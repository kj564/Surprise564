import { defaultBlockRegistry, type BlockRegistry } from './blocks/registry';
import { FixedStepClock, type FixedStepResult } from './core/fixed-step';
import { Inventory } from './inventory/inventory';
import { beginMining, finishBlockBreak, type MiningProgressResult, type MiningSession, type MiningStartResult } from './interaction/mining';
import { placeBlockFromInventory } from './interaction/placement';
import { raycastVoxels, type RayVector, type VoxelRayHit, type VoxelRayResult } from './interaction/raycast';
import { Aabb } from './physics/aabb';
import { PlayerPhysics, type PlayerInput, type PlayerPhysicsState, type PlayerPosition } from './physics/player-physics';
import { queryCollisionBoxes } from './physics/world-collision';
import { ChunkData } from './world/chunk';
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

  /** Exposes the current body bounds for camera placement and browser adapters. */
  get playerBounds(): Aabb {
    return this.player.bounds;
  }
}
