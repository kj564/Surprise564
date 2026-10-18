import type { BlockRegistry } from '../blocks/registry';
import type { Inventory } from '../inventory/inventory';
import type { Aabb } from '../physics/aabb';
import type { VoxelWorld, BlockPosition } from '../world/world';
import { beginMining, finishBlockBreak, type BreakBlockResult, type GameMode, type MiningProgressResult, type MiningSession, type MiningStartResult } from './mining';
import type { Tool } from '../items/tools';
import { placeBlockFromInventory, type PlaceBlockResult, type PlacementValidation } from './placement';
import { raycastVoxels, type RayVector, type VoxelRayHit, type VoxelRayResult } from './raycast';

export type MiningTickResult =
  | { readonly status: 'idle' }
  | { readonly status: 'mining'; readonly progress: number; readonly remainingTicks: number }
  | { readonly status: 'cooldown'; readonly progress: 1; readonly cooldownTicks: number }
  | { readonly status: 'cancelled' }
  | { readonly status: 'completed'; readonly breaking: BreakBlockResult };

/** Coordinates targeting, mining and placement without owning renderer or input-device state. */
export class BlockInteractionController {
  private miningSession: MiningSession | null = null;

  constructor(
    private readonly world: VoxelWorld,
    private readonly registry: BlockRegistry,
    private readonly inventory: Inventory,
    private readonly mode: GameMode = 'creative',
    /** §MCPE 2013: tool equipped in the selected hotbar slot. Bare hand = null. */
    private readonly tool: Tool | null = null,
  ) {
    if (mode !== 'survival' && mode !== 'creative') throw new RangeError('mode must be survival or creative');
  }

  get isMining(): boolean {
    return this.miningSession !== null && !this.miningSession.isCancelled && !this.miningSession.isComplete;
  }

  target(origin: RayVector, direction: RayVector, reach: number): VoxelRayResult {
    return raycastVoxels(this.world, origin, direction, reach, id => this.registry.getById(id)?.selectable ?? false);
  }

  startMining(hit: VoxelRayHit, tool: Tool | null = this.tool): MiningStartResult {
    this.miningSession = null;
    const result = beginMining(this.world, hit.block, this.registry, {
      mode: this.mode,
      tool,
    });
    if (result.status === 'started') this.miningSession = result.session;
    return result;
  }

  /** Pass the current ray target each tick; changing target or releasing the action cancels mining.
   *  `ticks` is the number of physics ticks to advance (1 tick = 1/20 s). */
  tickMining(ticks: number, currentHit: VoxelRayResult | null): MiningTickResult {
    const session = this.miningSession;
    if (!session) return Object.freeze({ status: 'idle' });
    if (!currentHit || currentHit.status !== 'hit') {
      session.cancel();
      this.miningSession = null;
      return Object.freeze({ status: 'cancelled' });
    }
    const sameTarget = samePosition(session.target, currentHit.block);
    const currentId = this.world.getBlock(currentHit.block.x, currentHit.block.y, currentHit.block.z);
    const progress: MiningProgressResult = session.tick(ticks, currentHit.block, currentId);
    if (progress.status === 'cancelled' || !sameTarget) {
      this.miningSession = null;
      return Object.freeze({ status: 'cancelled' });
    }
    if (progress.status === 'completed') {
      const breaking = finishBlockBreak(this.world, session, this.registry, this.inventory);
      this.miningSession = null;
      return Object.freeze({ status: 'completed', breaking });
    }
    if (progress.status === 'cooldown') {
      return Object.freeze({ status: 'cooldown', progress: 1, cooldownTicks: progress.cooldownTicks });
    }
    return Object.freeze({ status: 'mining', progress: progress.progress, remainingTicks: progress.remainingTicks });
  }

  cancelMining(): boolean {
    if (!this.miningSession) return false;
    this.miningSession.cancel();
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
