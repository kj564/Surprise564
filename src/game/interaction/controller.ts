import type { BlockRegistry } from '../blocks/registry';
import type { Inventory } from '../inventory/inventory';
import type { Aabb } from '../physics/aabb';
import type { VoxelWorld, BlockPosition } from '../world/world';
import { beginMining, finishBlockBreak, type BreakBlockResult, type MiningProgressResult, type MiningSession, type MiningStartResult } from './mining';
import { placeBlockFromInventory, type PlaceBlockResult, type PlacementValidation } from './placement';
import { raycastVoxels, type RayVector, type VoxelRayHit, type VoxelRayResult } from './raycast';

export type MiningTickResult =
  | { readonly status: 'idle' }
  | { readonly status: 'mining'; readonly progress: number; readonly remainingSeconds: number }
  | { readonly status: 'cancelled' }
  | { readonly status: 'completed'; readonly breaking: BreakBlockResult };

/** Coordinates targeting, mining and placement without owning renderer or input-device state. */
export class BlockInteractionController {
  private miningSession: MiningSession | null = null;

  constructor(
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
    private readonly inventory: Inventory,
    private readonly miningSpeed = 1,
  ) {
    if (!Number.isFinite(miningSpeed) || miningSpeed <= 0) throw new RangeError('miningSpeed must be finite and positive');
  }

  get isMining(): boolean {
    return this.miningSession !== null && !this.miningSession.isCancelled && !this.miningSession.isComplete;
  }

  target(origin: RayVector, direction: RayVector, reach: number): VoxelRayResult {
    return raycastVoxels(this.world, origin, direction, reach, id => this.registry.getById(id)?.selectable ?? false);
  }

  startMining(hit: VoxelRayHit): MiningStartResult {
    this.miningSession = null;
    const result = beginMining(this.world, hit.block, this.registry, this.miningSpeed);
    if (result.status === 'started') this.miningSession = result.session;
    return result;
  }

  /** Pass the current ray target each tick; changing target or releasing the action cancels mining. */
  tickMining(deltaSeconds: number, currentHit: VoxelRayResult | null): MiningTickResult {
    const session = this.miningSession;
    if (!session) return Object.freeze({ status: 'idle' });
    if (!currentHit || currentHit.status !== 'hit') {
      session.advance(deltaSeconds, null, undefined);
      this.miningSession = null;
      return Object.freeze({ status: 'cancelled' });
    }
    const sameTarget = samePosition(session.target, currentHit.block);
    const currentId = this.world.getBlock(currentHit.block.x, currentHit.block.y, currentHit.block.z);
    const progress: MiningProgressResult = session.advance(deltaSeconds, currentHit.block, currentId);
    if (progress.status === 'cancelled' || !sameTarget) {
      this.miningSession = null;
      return Object.freeze({ status: 'cancelled' });
    }
    if (progress.status === 'completed') {
      const breaking = finishBlockBreak(this.world, session, this.registry, this.inventory);
      this.miningSession = null;
      return Object.freeze({ status: 'completed', breaking });
    }
    return Object.freeze({ status: 'mining', progress: progress.progress, remainingSeconds: progress.remainingSeconds });
  }

  cancelMining(): boolean {
    if (!this.miningSession) return false;
    this.miningSession.advance(0, null, undefined);
    this.miningSession = null;
    return true;
  }

  place(hit: VoxelRayHit, slotIndex: number, playerBounds: Aabb): PlaceBlockResult | PlacementValidation {
    return placeBlockFromInventory(this.world, hit, this.inventory, slotIndex, this.registry, playerBounds);
  }
}

function samePosition(a: BlockPosition, b: BlockPosition): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}
