import type { VoxelRayHit, RayVector } from './raycast';
import type { VoxelWorld, BlockPosition } from '../world/world';
import type { BlockRegistry } from '../blocks/registry';

export type PlacementValidation =
  | { readonly status: 'ready'; readonly target: BlockPosition; readonly replacedBlockId: number }
  | { readonly status: 'invalid-face' }
  | { readonly status: 'cannot-place-air' }
  | { readonly status: 'unknown-placed-block' }
  | { readonly status: 'unloaded'; readonly target: BlockPosition }
  | { readonly status: 'unknown-target-block'; readonly target: BlockPosition; readonly blockId: number }
  | { readonly status: 'occupied'; readonly target: BlockPosition; readonly blockId: number };

/**
 * Resolves and validates the cell adjacent to a ray hit.
 * This deliberately does not mutate the world or inventory; collision-volume validation and
 * inventory consumption belong in the later placement transaction.
 */
export function validatePlacementTarget(
  world: Pick<VoxelWorld, 'getBlock'>,
  hit: VoxelRayHit,
  placedBlockId: number,
  registry: BlockRegistry,
): PlacementValidation {
  if (placedBlockId === 0) return { status: 'cannot-place-air' };
  const placedDefinition = registry.getById(placedBlockId);
  if (!placedDefinition) return { status: 'unknown-placed-block' };

  const face = cardinalFace(hit.face);
  if (!face) return { status: 'invalid-face' };
  const target = Object.freeze({
    x: hit.block.x + face.x,
    y: hit.block.y + face.y,
    z: hit.block.z + face.z,
  });
  const currentId = world.getBlock(target.x, target.y, target.z);
  if (currentId === undefined) return { status: 'unloaded', target };

  const currentDefinition = registry.getById(currentId);
  if (!currentDefinition) return { status: 'unknown-target-block', target, blockId: currentId };
  if (!currentDefinition.replaceable) return { status: 'occupied', target, blockId: currentId };
  return { status: 'ready', target, replacedBlockId: currentId };
}

function cardinalFace(face: RayVector): RayVector | undefined {
  const isUnit = Math.abs(face.x) + Math.abs(face.y) + Math.abs(face.z) === 1;
  if (!isUnit || ![face.x, face.y, face.z].every(value => value === -1 || value === 0 || value === 1)) return undefined;
  return face;
}
