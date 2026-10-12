export type Axis = 'x' | 'y' | 'z';

/** Immutable axis-aligned box in world-space block units. */
export class Aabb {
  constructor(
    readonly minX: number,
    readonly minY: number,
    readonly minZ: number,
    readonly maxX: number,
    readonly maxY: number,
    readonly maxZ: number,
  ) {
    const values = [minX, minY, minZ, maxX, maxY, maxZ];
    if (!values.every(Number.isFinite)) throw new TypeError('AABB coordinates must be finite');
    if (minX > maxX || minY > maxY || minZ > maxZ) throw new RangeError('AABB minimum must not exceed maximum');
  }

  move(dx: number, dy: number, dz: number): Aabb {
    finiteDelta(dx, 'dx'); finiteDelta(dy, 'dy'); finiteDelta(dz, 'dz');
    return new Aabb(this.minX + dx, this.minY + dy, this.minZ + dz, this.maxX + dx, this.maxY + dy, this.maxZ + dz);
  }

  /** True only when the boxes share positive volume; touching faces are not penetration. */
  intersects(other: Aabb): boolean {
    return this.maxX > other.minX && this.minX < other.maxX &&
      this.maxY > other.minY && this.minY < other.maxY &&
      this.maxZ > other.minZ && this.minZ < other.maxZ;
  }

  /** Return the largest safe displacement on one axis before intersecting an obstacle. */
  clipDisplacement(other: Aabb, axis: Axis, delta: number): number {
    finiteDelta(delta, 'delta');
    if (delta === 0) return 0;
    if (!overlapOnOtherAxes(this, other, axis)) return delta;

    const [movingMin, movingMax, obstacleMin, obstacleMax] = axisBounds(this, other, axis);
    if (delta > 0 && movingMax <= obstacleMin) return Math.min(delta, obstacleMin - movingMax);
    if (delta < 0 && movingMin >= obstacleMax) return Math.max(delta, obstacleMax - movingMin);
    return delta;
  }

  /** Bounding box containing this box before and after the requested movement. */
  sweptBounds(dx: number, dy: number, dz: number): Aabb {
    finiteDelta(dx, 'dx'); finiteDelta(dy, 'dy'); finiteDelta(dz, 'dz');
    return new Aabb(
      dx < 0 ? this.minX + dx : this.minX,
      dy < 0 ? this.minY + dy : this.minY,
      dz < 0 ? this.minZ + dz : this.minZ,
      dx > 0 ? this.maxX + dx : this.maxX,
      dy > 0 ? this.maxY + dy : this.maxY,
      dz > 0 ? this.maxZ + dz : this.maxZ,
    );
  }
}

function overlapOnOtherAxes(a: Aabb, b: Aabb, axis: Axis): boolean {
  if (axis === 'x') return a.maxY > b.minY && a.minY < b.maxY && a.maxZ > b.minZ && a.minZ < b.maxZ;
  if (axis === 'y') return a.maxX > b.minX && a.minX < b.maxX && a.maxZ > b.minZ && a.minZ < b.maxZ;
  return a.maxX > b.minX && a.minX < b.maxX && a.maxY > b.minY && a.minY < b.maxY;
}

function axisBounds(a: Aabb, b: Aabb, axis: Axis): [number, number, number, number] {
  if (axis === 'x') return [a.minX, a.maxX, b.minX, b.maxX];
  if (axis === 'y') return [a.minY, a.maxY, b.minY, b.maxY];
  return [a.minZ, a.maxZ, b.minZ, b.maxZ];
}

function finiteDelta(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new TypeError(name + ' must be finite');
}
