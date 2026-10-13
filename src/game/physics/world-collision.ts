import { Aabb } from './aabb';
import type { BlockRegistry } from '../blocks/registry';
import type { VoxelWorld } from '../world/world';

export interface CollisionQueryResult {
  readonly boxes: readonly Aabb[];
  /** Coordinates of unloaded cells conservatively treated as solid barriers. */
  readonly unloadedCells: readonly Readonly<{ x: number; y: number; z: number }>[];
}

/**
 * Collects collision shapes intersecting a broad-phase region. Source-referenced shapes with
 * implemented geometry (currently cubes and bottom slabs) use matching bounds. Unknown blocks,
 * unloaded chunks and unimplemented solid shapes fail closed as full cubes.
 */
export function queryCollisionBoxes(
  world: VoxelWorld,
  bounds: Aabb,
  registry: BlockRegistry,
  maxCells = 8192,
): CollisionQueryResult {
  if (!Number.isSafeInteger(maxCells) || maxCells <= 0) throw new RangeError('maxCells must be a positive safe integer');
  const minX = Math.floor(bounds.minX);
  const minY = Math.floor(bounds.minY);
  const minZ = Math.floor(bounds.minZ);
  const maxX = Math.floor(bounds.maxX - 1e-9);
  const maxY = Math.floor(bounds.maxY - 1e-9);
  const maxZ = Math.floor(bounds.maxZ - 1e-9);
  const countX = Math.max(0, maxX - minX + 1);
  const countY = Math.max(0, maxY - minY + 1);
  const countZ = Math.max(0, maxZ - minZ + 1);
  if (countX * countY * countZ > maxCells) throw new RangeError('Collision broad-phase query exceeds maxCells');

  const boxes: Aabb[] = [];
  const unloadedCells: Array<Readonly<{ x: number; y: number; z: number }>> = [];
  for (let y = minY; y <= maxY; y += 1) {
    for (let z = minZ; z <= maxZ; z += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const position = { x, y, z };
        const outsideVerticalWorld = y < 0 || y >= world.dimensions.height;
        const blockId = outsideVerticalWorld ? undefined : world.getBlock(x, y, z);
        if (blockId === undefined) {
          if (!outsideVerticalWorld) unloadedCells.push(Object.freeze(position));
          boxes.push(blockCube(x, y, z));
          continue;
        }
        if (blockId === 0) continue;
        const definition = registry.getById(blockId);
        if (!definition) {
          boxes.push(blockCube(x, y, z));
          continue;
        }
        if (!definition.solid) continue;
        if (definition.shape === 'slab') {
          boxes.push(new Aabb(x, y, z, x + 1, y + 0.5, z + 1));
        } else {
          // Unimplemented solid shapes remain conservative until their shape-specific
          // collision contracts and orientation/state data are implemented.
          boxes.push(blockCube(x, y, z));
        }
      }
    }
  }
  return Object.freeze({
    boxes: Object.freeze(boxes),
    unloadedCells: Object.freeze(unloadedCells),
  });
}

function blockCube(x: number, y: number, z: number): Aabb {
  return new Aabb(x, y, z, x + 1, y + 1, z + 1);
}
