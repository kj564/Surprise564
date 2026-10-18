import { defaultBlockRegistry, type BlockRegistry } from './blocks/registry';
import { FixedStepClock, type FixedStepResult } from './core/fixed-step';
import { Inventory } from './inventory/inventory';
import { beginMining, finishBlockBreak, type GameMode, type MiningProgressResult, type MiningSession, type MiningStartResult } from './interaction/mining';
import { applyMineBlockDurability } from './items/item-instance';
import { getTool, type Tool } from './items/tools';
import { placeBlockFromInventory } from './interaction/placement';
import { raycastVoxels, type RayVector, type VoxelRayHit, type VoxelRayResult } from './interaction/raycast';
import { Aabb } from './physics/aabb';
import { PlayerPhysics, type PlayerInput, type PlayerPhysicsState, type PlayerPosition } from './physics/player-physics';
import { queryCollisionBoxes } from './physics/world-collision';
import { createWorldSave, restoreWorldSave, type PlayerSnapshot, type SaveMetadataInput } from './persistence/world-save';
import { ChunkData } from './world/chunk';
import { VoxelWorld, type BlockPosition, type WorldDimensions } from './world/world';

export interface VoxelCraftEngineOptions {
  readonly dimensions?: WorldDimensions;
  readonly spawn?: PlayerPosition;
  readonly inventorySlots?: number;
  readonly registry?: BlockRegistry;
  /** MCPE 2013 game mode (default: creative). Survival uses per-tick destroyProgress;
   *  Creative instantly breaks with a 10-tick cooldown between breaks. */
  readonly gameMode?: GameMode;
  /** §MCPE 2013: tool equipped in the selected hotbar slot. Bare hand = null (default).
   *  The browser port computes this from the selected slot's itemKey via getTool(). */
  readonly tool?: Tool | null;
}

/** Renderer-independent composition root for the new VoxelCraft mechanics. */
export class VoxelCraftEngine {
  readonly world: VoxelWorld;
  readonly inventory: Inventory;
  readonly player: PlayerPhysics;
  readonly registry: BlockRegistry;
  readonly clock: FixedStepClock;
  readonly gameMode: GameMode;
  readonly tool: Tool | null;
  private miningSession: MiningSession | null = null;
  private selectedSlotValue = 0;

  /** Restores a validated save into a fresh engine; corrupt input never partially mutates an existing engine. */
  static fromSave(input: unknown):
    | { readonly ok: true; readonly engine: VoxelCraftEngine; readonly view: { readonly yaw: number; readonly pitch: number } }
    | { readonly ok: false; readonly errors: readonly string[] } {
    const result = restoreWorldSave(input);
    if (!result.ok) return result;

    const { save, world, inventory, player } = result.restored;
    const engine = new VoxelCraftEngine({
      dimensions: save.dimensions,
      spawn: player.position,
      inventorySlots: inventory.size,
    });
    for (const chunk of world.exportChunks()) {
      engine.loadChunk(chunk.x, chunk.z, chunk.blocks);
    }
    inventory.snapshot().forEach((stack, index) => {
      if (stack) engine.inventory.setSlot(index, stack);
    });
    engine.selectSlot(player.selectedSlot ?? 0);
    return Object.freeze({
      ok: true,
      engine,
      view: Object.freeze({ yaw: player.yaw, pitch: player.pitch }),
    });
  }

  constructor(options: VoxelCraftEngineOptions = {}) {
    this.registry = options.registry ?? defaultBlockRegistry;
    this.world = new VoxelWorld(options.dimensions ?? { chunkSizeX: 16, height: 64, chunkSizeZ: 16 });
    this.inventory = new Inventory(options.inventorySlots ?? 36);
    this.player = new PlayerPhysics(options.spawn ?? { x: 0.5, y: 2, z: 0.5 });
    this.clock = new FixedStepClock();
    this.gameMode = options.gameMode ?? 'creative';
    this.tool = options.tool ?? null;
  }

  get selectedSlot(): number {
    return this.selectedSlotValue;
  }

  selectSlot(index: number): void {
    const hotbarSize = Math.min(9, this.inventory.size);
    if (!Number.isSafeInteger(index) || index < 0 || index >= hotbarSize) {
      throw new RangeError('Selected slot must be within the hotbar');
    }
    this.selectedSlotValue = index;
  }

  loadChunk(chunkX: number, chunkZ: number, initialBlocks?: ArrayLike<number>): ChunkData {
    return this.world.loadChunk(chunkX, chunkZ, initialBlocks);
  }

  step(frameSeconds: number, input: PlayerInput): { readonly clock: FixedStepResult; readonly player: PlayerPhysicsState } {
    let playerState = this.player.state;
    const clockResult = this.clock.advance(frameSeconds, deltaSeconds => {
      playerState = this.player.step(deltaSeconds, input, sweptBounds =>
        queryCollisionBoxes(this.world, sweptBounds, this.registry).boxes,
      );
    });
    return Object.freeze({ clock: clockResult, player: playerState });
  }

  /** Trace a view ray against authoritative world data; unloaded chunks stop the ray. */
  target(origin: RayVector, direction: RayVector, reach = 6): VoxelRayResult {
    return raycastVoxels(this.world, origin, direction, reach, id => this.registry.getById(id)?.selectable ?? false);
  }

  startMining(target: BlockPosition, tool: Tool | null = this.tool): MiningStartResult {
    const result = beginMining(this.world, target, this.registry, {
      mode: this.gameMode,
      tool,
    });
    this.miningSession = result.status === 'started' ? result.session : null;
    return result;
  }

  /** Force-cancel an active mining session (input release). */
  cancelMining(): boolean {
    if (!this.miningSession) return false;
    this.miningSession.cancel();
    this.miningSession = null;
    return true;
  }

  /** Advance mining by `ticks` physics ticks (1 tick = 1/20 s). Caller must
   *  confirm the same currently targeted block, otherwise the session cancels.
   *  Returns the per-tick outcome and (on completion) the drop remainder. */
  tickMining(ticks: number, currentTarget: BlockPosition | null):
    | MiningProgressResult
    | { readonly status: 'no-session' }
    | { readonly status: 'broken'; readonly dropsRemaining: readonly { readonly itemKey: string; readonly count: number; readonly maxStackSize: number }[] } {
    const session = this.miningSession;
    if (!session) return { status: 'no-session' };
    const currentBlockId = this.world.getBlock(session.target.x, session.target.y, session.target.z);
    const progress = session.tick(ticks, currentTarget, currentBlockId);
    if (progress.status === 'cancelled') {
      this.miningSession = null;
      return progress;
    }
    if (progress.status !== 'completed') return progress;

    const result = finishBlockBreak(this.world, session, this.registry, this.inventory);
    this.miningSession = null;
    if (result.status === 'broken') {
      // §SurvivalMode::destroyBlock (SurvivalMode.cpp:57-76):
      //   item->mineBlock(t, x, y, z);  // decrement tool durability
      //   if (item->count == 0) inventory->clearSlot(selected);
      // CreativeMode::creativeDestroyBlock (CreativeMode.cpp:31-38) does NOT
      // call mineBlock, so tools don't lose durability in creative mode.
      if (this.gameMode === 'survival') {
        this.applyToolDurability();
      }
      return Object.freeze({ status: 'broken', dropsRemaining: result.dropsRemaining });
    }
    if (result.status === 'target-changed' || result.status === 'unloaded' || result.status === 'unbreakable') {
      return { status: 'cancelled' };
    }
    return { status: 'no-session' };
  }

  /** §SurvivalMode.cpp:63-69 — decrement tool durability on the selected
   *  hotbar slot after a block break. If the tool breaks (count == 0),
   *  §FillingContainer::clearSlot nulls the slot (SurvivalMode.cpp:68).
   *  §rujukan uses `inventory->getSelected()` (real-time lookup of the
   *  currently selected slot) — NOT a cached tool from startMining. This
   *  matters if the player switches slots mid-mine: the durability is
   *  applied to whatever tool is in the selected slot AT BREAK TIME. */
  private applyToolDurability(): void {
    const slot = this.selectedSlotValue;
    const stack = this.inventory.getSlot(slot);
    if (!stack) return;  // empty slot — nothing to damage
    // §Item::items[id] lookup — resolve tool from selected slot's itemKey.
    // Returns null for non-tool items (blocks, etc.) — no durability to apply.
    const tool = getTool(stack.itemKey);
    if (!tool) return;
    const newStack = applyMineBlockDurability(stack, tool);
    if (newStack === null) {
      // §SurvivalMode.cpp:68 — count==0 → clearSlot
      this.inventory.setSlot(slot, null);
    } else if (newStack !== stack) {
      this.inventory.setSlot(slot, newStack);
    }
  }

  placeSelected(hit: VoxelRayHit) {
    return placeBlockFromInventory(this.world, hit, this.inventory, this.selectedSlotValue, this.registry, this.player.bounds);
  }

  /** Captures the authoritative world, inventory and player pose using the versioned save schema. */
  createSave(metadata: SaveMetadataInput, view: { readonly yaw: number; readonly pitch: number }): ReturnType<typeof createWorldSave> {
    const state = this.player.state;
    const snapshot: PlayerSnapshot = {
      position: state.position,
      yaw: view.yaw,
      pitch: view.pitch,
      selectedSlot: this.selectedSlotValue,
    };
    return createWorldSave(this.world, this.inventory, metadata, snapshot);
  }

  /** Exposes the current body bounds for camera placement and browser adapters. */
  get playerBounds(): Aabb {
    return this.player.bounds;
  }
}
