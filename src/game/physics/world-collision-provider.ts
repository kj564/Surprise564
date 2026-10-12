import type { BlockRegistry } from '../blocks/registry';
import type { VoxelWorld } from '../world/world';
import type { CollisionProvider } from './player-physics';
import { queryCollisionBoxes } from './world-collision';

/** Connects authoritative voxel data to the renderer-independent player physics engine. */
export function createWorldCollisionProvider(
  world: VoxelWorld,
  registry: BlockRegistry,
  maxCells = 8192,
): CollisionProvider {
  return sweptBounds => queryCollisionBoxes(world, sweptBounds, registry, maxCells).boxes;
}
