function finite(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

export class AABB {
  constructor(minX, minY, minZ, maxX, maxY, maxZ) {
    for (const [name, value] of Object.entries({ minX, minY, minZ, maxX, maxY, maxZ })) finite(value, name);
    if (minX > maxX || minY > maxY || minZ > maxZ) throw new RangeError("AABB minimum must not exceed maximum");
    this.minX = minX; this.minY = minY; this.minZ = minZ;
    this.maxX = maxX; this.maxY = maxY; this.maxZ = maxZ;
    Object.freeze(this);
  }

  intersects(other) {
    return this.maxX > other.minX && this.minX < other.maxX &&
      this.maxY > other.minY && this.minY < other.maxY &&
      this.maxZ > other.minZ && this.minZ < other.maxZ;
  }

  moved(dx, dy, dz) {
    finite(dx, "dx"); finite(dy, "dy"); finite(dz, "dz");
    return new AABB(this.minX + dx, this.minY + dy, this.minZ + dz,
      this.maxX + dx, this.maxY + dy, this.maxZ + dz);
  }

  expanded(dx, dy, dz) {
    finite(dx, "dx"); finite(dy, "dy"); finite(dz, "dz");
    return new AABB(
      this.minX + Math.min(0, dx), this.minY + Math.min(0, dy), this.minZ + Math.min(0, dz),
      this.maxX + Math.max(0, dx), this.maxY + Math.max(0, dy), this.maxZ + Math.max(0, dz),
    );
  }
}

/** Clips one movement axis against a static obstacle; touching faces are not overlap. */
export function clipMovementX(moving, obstacle, delta) {
  finite(delta, "delta");
  if (obstacle.maxY <= moving.minY || obstacle.minY >= moving.maxY ||
      obstacle.maxZ <= moving.minZ || obstacle.minZ >= moving.maxZ) return delta;
  if (delta > 0 && moving.maxX <= obstacle.minX) return Math.min(delta, obstacle.minX - moving.maxX);
  if (delta < 0 && moving.minX >= obstacle.maxX) return Math.max(delta, obstacle.maxX - moving.minX);
  return delta;
}

export function clipMovementY(moving, obstacle, delta) {
  finite(delta, "delta");
  if (obstacle.maxX <= moving.minX || obstacle.minX >= moving.maxX ||
      obstacle.maxZ <= moving.minZ || obstacle.minZ >= moving.maxZ) return delta;
  if (delta > 0 && moving.maxY <= obstacle.minY) return Math.min(delta, obstacle.minY - moving.maxY);
  if (delta < 0 && moving.minY >= obstacle.maxY) return Math.max(delta, obstacle.maxY - moving.minY);
  return delta;
}

export function clipMovementZ(moving, obstacle, delta) {
  finite(delta, "delta");
  if (obstacle.maxX <= moving.minX || obstacle.minX >= moving.maxX ||
      obstacle.maxY <= moving.minY || obstacle.minY >= moving.maxY) return delta;
  if (delta > 0 && moving.maxZ <= obstacle.minZ) return Math.min(delta, obstacle.minZ - moving.maxZ);
  if (delta < 0 && moving.minZ >= obstacle.maxZ) return Math.max(delta, obstacle.maxZ - moving.minZ);
  return delta;
}
