import { AIR_BLOCK_ID, type BlockId } from "./block-registry";

export interface Vector3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface VoxelHit {
  readonly blockId: BlockId;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly normal: Vector3;
  readonly distance: number;
}

export type BlockLookup = (x: number, y: number, z: number) => BlockId;

/**
 * Amanatides–Woo voxel traversal. Direction is normalized internally, so maxDistance
 * is expressed in world units regardless of the input vector magnitude.
 */
export function raycastVoxels(
  origin: Vector3,
  direction: Vector3,
  maxDistance: number,
  getBlock: BlockLookup,
): VoxelHit | null {
  const values = [origin.x, origin.y, origin.z, direction.x, direction.y, direction.z, maxDistance];
  if (!values.every(Number.isFinite)) throw new Error("Ray values must be finite.");
  if (maxDistance < 0) throw new Error("maxDistance must be non-negative.");

  const magnitude = Math.hypot(direction.x, direction.y, direction.z);
  if (magnitude === 0) return null;
  const dx = direction.x / magnitude;
  const dy = direction.y / magnitude;
  const dz = direction.z / magnitude;

  let x = Math.floor(origin.x);
  let y = Math.floor(origin.y);
  let z = Math.floor(origin.z);
  const initial = getBlock(x, y, z);
  if (initial !== AIR_BLOCK_ID) {
    return { blockId: initial, x, y, z, normal: { x: 0, y: 0, z: 0 }, distance: 0 };
  }

  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  const stepZ = Math.sign(dz);
  const deltaX = stepX === 0 ? Infinity : Math.abs(1 / dx);
  const deltaY = stepY === 0 ? Infinity : Math.abs(1 / dy);
  const deltaZ = stepZ === 0 ? Infinity : Math.abs(1 / dz);
  let maxX = stepX > 0 ? (x + 1 - origin.x) * deltaX : stepX < 0 ? (origin.x - x) * deltaX : Infinity;
  let maxY = stepY > 0 ? (y + 1 - origin.y) * deltaY : stepY < 0 ? (origin.y - y) * deltaY : Infinity;
  let maxZ = stepZ > 0 ? (z + 1 - origin.z) * deltaZ : stepZ < 0 ? (origin.z - z) * deltaZ : Infinity;

  let distance = 0;
  let normal: Vector3 = { x: 0, y: 0, z: 0 };
  while (distance <= maxDistance) {
    if (maxX <= maxY && maxX <= maxZ) {
      x += stepX;
      distance = maxX;
      maxX += deltaX;
      normal = { x: -stepX, y: 0, z: 0 };
    } else if (maxY <= maxZ) {
      y += stepY;
      distance = maxY;
      maxY += deltaY;
      normal = { x: 0, y: -stepY, z: 0 };
    } else {
      z += stepZ;
      distance = maxZ;
      maxZ += deltaZ;
      normal = { x: 0, y: 0, z: -stepZ };
    }

    if (distance > maxDistance) return null;
    const blockId = getBlock(x, y, z);
    if (blockId !== AIR_BLOCK_ID) return { blockId, x, y, z, normal, distance };
  }
  return null;
}
