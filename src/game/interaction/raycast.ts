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
  getSelectionHeight?: (blockId: number) => number | undefined,
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
      const shapeHeight = getSelectionHeight?.(blockId);
      if (shapeHeight === undefined || shapeHeight >= 1) {
        return { status: 'hit', blockId, block: Object.freeze({ x, y, z }), face: Object.freeze(face), distance };
      }
      if (!Number.isFinite(shapeHeight) || shapeHeight <= 0) throw new RangeError('Selection shape height must be finite and positive');
      const cellExit = Math.min(maxX, maxY, maxZ, maxDistance);
      const shapeHit = intersectRayBox(origin, { x: dx, y: dy, z: dz },
        { x, y, z }, { x: x + 1, y: y + shapeHeight, z: z + 1 }, distance, cellExit);
      if (shapeHit) {
        return { status: 'hit', blockId, block: Object.freeze({ x, y, z }), face: Object.freeze(shapeHit.face), distance: shapeHit.distance };
      }
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


interface RayBoxHit { readonly distance: number; readonly face: RayVector }

/** Intersects the ray with an axis-aligned selection box, restricted to the current DDA cell. */
function intersectRayBox(
  origin: RayVector,
  direction: RayVector,
  min: RayVector,
  max: RayVector,
  minDistance: number,
  maxDistance: number,
): RayBoxHit | null {
  let enter = -Infinity;
  let exit = Infinity;
  let enterFace: RayVector = { x: 0, y: 0, z: 0 };
  const axes = [
    { origin: origin.x, direction: direction.x, min: min.x, max: max.x, axis: 'x' as const },
    { origin: origin.y, direction: direction.y, min: min.y, max: max.y, axis: 'y' as const },
    { origin: origin.z, direction: direction.z, min: min.z, max: max.z, axis: 'z' as const },
  ];
  for (const axis of axes) {
    if (Math.abs(axis.direction) < 1e-12) {
      if (axis.origin < axis.min || axis.origin > axis.max) return null;
      continue;
    }
    let near = (axis.min - axis.origin) / axis.direction;
    let far = (axis.max - axis.origin) / axis.direction;
    let sign = -Math.sign(axis.direction);
    if (near > far) {
      [near, far] = [far, near];
    }
    if (near > enter) {
      enter = near;
      enterFace = { x: 0, y: 0, z: 0, [axis.axis]: sign };
    }
    exit = Math.min(exit, far);
    if (enter > exit) return null;
  }
  const hitDistance = Math.max(enter, minDistance);
  if (hitDistance > exit + 1e-9 || hitDistance > maxDistance + 1e-9 || exit < minDistance - 1e-9) return null;
  return { distance: hitDistance, face: enter < minDistance ? { x: 0, y: 0, z: 0 } : enterFace };
}
