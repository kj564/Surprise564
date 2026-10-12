function assertVector(vector, name) {
  if (!vector || typeof vector !== "object" ||
      !Number.isFinite(vector.x) || !Number.isFinite(vector.y) || !Number.isFinite(vector.z)) {
    throw new TypeError(`${name} must have finite x, y, z components`);
  }
}

/**
 * Amanatides-Woo voxel DDA. Returns the first solid block within maxDistance or null.
 * The direction is normalized, so distance is measured in world blocks.
 * face names describe the face entered by the ray (west/east/down/up/north/south).
 */
export function raycastBlocks(world, origin, direction, maxDistance, { isSolid = (id) => id !== 0 } = {}) {
  assertVector(origin, "origin");
  assertVector(direction, "direction");
  if (!world || typeof world.getBlock !== "function") throw new TypeError("world must expose getBlock(position)");
  if (typeof isSolid !== "function") throw new TypeError("isSolid must be a function");
  if (typeof maxDistance !== "number" || !Number.isFinite(maxDistance) || maxDistance < 0) {
    throw new RangeError("maxDistance must be finite and non-negative");
  }

  const magnitude = Math.hypot(direction.x, direction.y, direction.z);
  if (magnitude === 0) throw new RangeError("direction must not be zero");
  const dx = direction.x / magnitude;
  const dy = direction.y / magnitude;
  const dz = direction.z / magnitude;

  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
  const firstId = world.getBlock({ x, y, z });
  if (isSolid(firstId)) {
    return { block: { x, y, z }, blockId: firstId, face: "inside", point: { ...origin }, distance: 0 };
  }

  const stepX = Math.sign(dx), stepY = Math.sign(dy), stepZ = Math.sign(dz);
  const deltaX = dx === 0 ? Infinity : Math.abs(1 / dx);
  const deltaY = dy === 0 ? Infinity : Math.abs(1 / dy);
  const deltaZ = dz === 0 ? Infinity : Math.abs(1 / dz);
  let maxX = dx > 0 ? (x + 1 - origin.x) / dx : dx < 0 ? (origin.x - x) / -dx : Infinity;
  let maxY = dy > 0 ? (y + 1 - origin.y) / dy : dy < 0 ? (origin.y - y) / -dy : Infinity;
  let maxZ = dz > 0 ? (z + 1 - origin.z) / dz : dz < 0 ? (origin.z - z) / -dz : Infinity;
  let distance = 0;
  let face = null;

  // At most one voxel boundary is crossed per step; iteration count is distance-bounded.
  while (true) {
    if (maxX <= maxY && maxX <= maxZ) {
      distance = maxX; maxX += deltaX; x += stepX;
      face = stepX > 0 ? "west" : "east";
    } else if (maxY <= maxZ) {
      distance = maxY; maxY += deltaY; y += stepY;
      face = stepY > 0 ? "down" : "up";
    } else {
      distance = maxZ; maxZ += deltaZ; z += stepZ;
      face = stepZ > 0 ? "north" : "south";
    }
    if (distance > maxDistance) return null;
    const blockId = world.getBlock({ x, y, z });
    if (isSolid(blockId)) {
      return {
        block: { x, y, z },
        blockId,
        face,
        point: { x: origin.x + dx * distance, y: origin.y + dy * distance, z: origin.z + dz * distance },
        distance,
      };
    }
  }
}
