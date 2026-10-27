import type { VoxelRayHit, RayVector } from './raycast';
import type { VoxelWorld, BlockPosition } from '../../world/level/world';
import type { BlockRegistry } from '../../world/level/tile/registry';
import { Aabb } from '../../world/physics/aabb';
import type { Inventory } from '../../world/inventory/inventory';

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


export type PlaceBlockResult =
  | { readonly status: 'placed'; readonly target: BlockPosition; readonly blockId: number; readonly dirtyChunks: readonly string[]; readonly remainingInSlot: number }
  | { readonly status: 'inventory-empty' }
  | { readonly status: 'not-a-block-item' }
  | { readonly status: 'blocked-by-player'; readonly target: BlockPosition }
  | { readonly status: 'no-change'; readonly target: BlockPosition };

/**
 * Applies a single-player placement transaction: validate, check player overlap, mutate world,
 * then consume one item. Solid block collision is conservatively treated as a full cube until
 * orientation/state-specific collision shapes are implemented.
 */
export function placeBlockFromInventory(
  world: VoxelWorld,
  hit: VoxelRayHit,
  inventory: Inventory,
  slotIndex: number,
  registry: BlockRegistry,
  playerBounds: Aabb,
): PlaceBlockResult | PlacementValidation {
  const stack = inventory.getSlot(slotIndex);
  if (!stack) return { status: 'inventory-empty' };
  const blockId = registry.getIdByKey(stack.id);
  if (blockId === undefined || blockId === 0) return { status: 'not-a-block-item' };

  const validation = validatePlacementTarget(world, hit, blockId, registry);
  if (validation.status !== 'ready') return validation;

  const definition = registry.getById(blockId);
  if (!definition) return { status: 'not-a-block-item' };
  if (definition.solid) {
    const targetBounds = new Aabb(
      validation.target.x, validation.target.y, validation.target.z,
      validation.target.x + 1, validation.target.y + 1, validation.target.z + 1,
    );
    if (playerBounds.intersects(targetBounds)) {
      return { status: 'blocked-by-player', target: validation.target };
    }
  }

  const mutation = world.setBlock(validation.target, blockId);
  if (!mutation.changed) return { status: 'no-change', target: validation.target };
  const consumed = inventory.remove(slotIndex, 1);
  if (!consumed) throw new Error('Placement invariant violated: item stack disappeared during synchronous placement');
  return {
    status: 'placed',
    target: validation.target,
    blockId,
    dirtyChunks: mutation.dirtyChunks,
    remainingInSlot: inventory.getSlot(slotIndex)?.count ?? 0,
  };
}
