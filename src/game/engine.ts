import { defaultBlockRegistry, type BlockRegistry } from './blocks/registry';
import { FixedStepClock, type FixedStepResult } from './core/fixed-step';
import { Inventory } from './inventory/inventory';
import { beginMining, finishBlockBreak, type MiningProgressResult, type MiningSession, type MiningStartResult } from './interaction/mining';
import { placeBlockFromInventory } from './interaction/placement';
import { raycastVoxels, type RayVector, type VoxelRayHit, type VoxelRayResult } from './interaction/raycast';
import { Aabb } from './physics/aabb';
import { PlayerPhysics, type PlayerInput, type PlayerPhysicsState, type PlayerPosition } from './physics/player-physics';
import { queryCollisionBoxes } from './physics/world-collision';
import { createWorldSave, restoreWorldSave, type PlayerSnapshot, type SaveMetadataInput } from './persistence/world-save';
import { ChunkData } from './world/chunk';
import type { WorldSaveV1 } from './persistence/save-schema';
import { VoxelWorld, type BlockPosition, type WorldDimensions } from './world/world';

export interface VoxelCraftEngineOptions {
  readonly dimensions?: WorldDimensions;
  readonly spawn?: PlayerPosition;
  readonly inventorySlots?: number;
  readonly registry?: BlockRegistry;
}

/** Renderer-independent composition root for the new VoxelCraft mechanics. */
export class VoxelCraftEngine {
  readonly world: VoxelWorld;
  readonly inventory: Inventory;
  readonly player: PlayerPhysics;
  readonly registry: BlockRegistry;
  readonly clock: FixedStepClock;
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

  startMining(target: BlockPosition, miningSpeed = 1): MiningStartResult {
    const result = beginMining(this.world, target, this.registry, miningSpeed);
    this.miningSession = result.status === 'started' ? result.session : null;
    return result;
  }

  /** Advance mining only while the caller confirms the same currently targeted block. */
  cancelMining(): boolean {
    if (!this.miningSession) return false;
    this.miningSession.advance(0, null, undefined);
    this.miningSession = null;
    return true;
  }

  advanceMining(deltaSeconds: number, currentTarget: BlockPosition | null): MiningProgressResult | { readonly status: 'no-session' } | { readonly status: 'broken'; readonly dropsRemaining: readonly { readonly itemKey: string; readonly count: number; readonly maxStackSize: number }[] } {
    const session = this.miningSession;
    if (!session) return { status: 'no-session' };
    const currentBlockId = this.world.getBlock(session.target.x, session.target.y, session.target.z);
    const progress = session.advance(deltaSeconds, currentTarget, currentBlockId);
    if (progress.status === 'cancelled') {
      this.miningSession = null;
      return progress;
    }
    if (progress.status !== 'completed') return progress;

    const result = finishBlockBreak(this.world, session, this.registry, this.inventory);
    this.miningSession = null;
    if (result.status === 'broken') {
      return Object.freeze({ status: 'broken', dropsRemaining: result.dropsRemaining });
    }
    if (result.status === 'target-changed' || result.status === 'unloaded' || result.status === 'unbreakable') {
      return { status: 'cancelled' };
    }
    return { status: 'no-session' };
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
    };
    return createWorldSave(this.world, this.inventory, metadata, snapshot);
  }

  createSave(metadata: SaveMetadataInput, view: Pick<PlayerSnapshot, 'yaw' | 'pitch'>): WorldSaveV1 {
    const state = this.player.state;
    return createWorldSave(this.world, this.inventory, metadata, {
      position: state.position, yaw: view.yaw, pitch: view.pitch,
    });
  }

  /** Rebuilds a fresh engine only after the complete payload passes save-schema validation. */
  static fromSave(input: unknown, registry: BlockRegistry = defaultBlockRegistry):
    | { readonly ok: true; readonly engine: VoxelCraftEngine; readonly view: Readonly<{ yaw: number; pitch: number }> }
    | { readonly ok: false; readonly errors: readonly string[] } {
    const result = restoreWorldSave(input);
    if (!result.ok) return result;
    const restored = result.restored;
    const engine = new VoxelCraftEngine({
      dimensions: restored.world.dimensions,
      spawn: restored.player.position,
      inventorySlots: restored.inventory.size,
      registry,
    });
    for (const chunk of restored.world.exportChunks()) engine.loadChunk(chunk.x, chunk.z, chunk.blocks);
    restored.inventory.snapshot().forEach((stack, index) => {
      if (stack) engine.inventory.setSlot(index, stack);
    });
    return Object.freeze({
      ok: true,
      engine,
      view: Object.freeze({ yaw: restored.player.yaw, pitch: restored.player.pitch }),
    });
  }

  /** Exposes the current body bounds for camera placement and browser adapters. */
  get playerBounds(): Aabb {
    return this.player.bounds;
  }
}
