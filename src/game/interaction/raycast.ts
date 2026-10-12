import type { VoxelWorld } from '../world/world';

export interface RayVector {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface VoxelRayHit {
  readonly status: 'hit';
  readonly blockId: number;
  readonly block: Readonly<{ x: number; y: number; z: number }>;
  /** The adjacent face entered by the ray; zero vector when origin starts inside a selectable block. */
  readonly face: RayVector;
  readonly distance: number;
}

export interface VoxelRayMiss {
  readonly status: 'miss';
  readonly distance: number;
}

export interface VoxelRayUnloaded {
  readonly status: 'unloaded';
  readonly block: Readonly<{ x: number; y: number; z: number }>;
  readonly distance: number;
}

export type VoxelRayResult = VoxelRayHit | VoxelRayMiss | VoxelRayUnloaded;
export type BlockReader = Pick<VoxelWorld, 'getBlock'> & Partial<Pick<VoxelWorld, 'dimensions'>>;

/**
 * Grid DDA ray traversal in block coordinates.
 * Ties are deterministic: X wins over Y, and Y wins over Z.
 * An unloaded cell stops traversal instead of being treated as air.
 */
export function raycastVoxels(
  world: BlockReader,
  origin: RayVector,
  direction: RayVector,
  maxDistance: number,
  isSelectable: (blockId: number) => boolean,
): VoxelRayResult {
  assertFiniteVector(origin, 'origin');
  assertFiniteVector(direction, 'direction');
  if (!Number.isFinite(maxDistance) || maxDistance < 0) throw new RangeError('maxDistance must be finite and non-negative');
  const length = Math.hypot(direction.x, direction.y, direction.z);
  if (length === 0) throw new RangeError('Ray direction must not be zero');
  if (typeof isSelectable !== 'function') throw new TypeError('isSelectable must be a function');

  const dx = direction.x / length;
  const dy = direction.y / length;
  const dz = direction.z / length;
  let x = Math.floor(origin.x);
  let y = Math.floor(origin.y);
  let z = Math.floor(origin.z);

  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  const stepZ = Math.sign(dz);
  const deltaX = stepX === 0 ? Infinity : Math.abs(1 / dx);
  const deltaY = stepY === 0 ? Infinity : Math.abs(1 / dy);
  const deltaZ = stepZ === 0 ? Infinity : Math.abs(1 / dz);
  let maxX = initialBoundaryTime(origin.x, x, dx, stepX);
  let maxY = initialBoundaryTime(origin.y, y, dy, stepY);
  let maxZ = initialBoundaryTime(origin.z, z, dz, stepZ);
  let distance = 0;
  let face: RayVector = { x: 0, y: 0, z: 0 };

  while (distance <= maxDistance) {
    // Vertical build limits are known empty space for ray traversal, not unloaded chunks.
    const outsideVerticalWorld = world.dimensions !== undefined && (y < 0 || y >= world.dimensions.height);
    const blockId = outsideVerticalWorld ? 0 : world.getBlock(x, y, z);
    if (blockId === undefined) {
      return { status: 'unloaded', block: Object.freeze({ x, y, z }), distance };
    }
    if (isSelectable(blockId)) {
      return { status: 'hit', blockId, block: Object.freeze({ x, y, z }), face: Object.freeze(face), distance };
    }

    // Strict comparisons deliberately establish X -> Y -> Z tie-breaking.
    if (maxX <= maxY && maxX <= maxZ) {
      distance = maxX;
      maxX += deltaX;
      x += stepX;
      face = { x: -stepX, y: 0, z: 0 };
    } else if (maxY <= maxZ) {
      distance = maxY;
      maxY += deltaY;
      y += stepY;
      face = { x: 0, y: -stepY, z: 0 };
    } else {
      distance = maxZ;
      maxZ += deltaZ;
      z += stepZ;
      face = { x: 0, y: 0, z: -stepZ };
    }
  }

  return { status: 'miss', distance: maxDistance };
}

function initialBoundaryTime(origin: number, cell: number, direction: number, step: number): number {
  if (step === 0) return Infinity;
  const boundary = step > 0 ? cell + 1 : cell;
  return Math.max(0, (boundary - origin) / direction);
}

function assertFiniteVector(vector: RayVector, name: string): void {
  if (![vector.x, vector.y, vector.z].every(Number.isFinite)) {
    throw new TypeError(name + ' components must be finite');
  }
}
