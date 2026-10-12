export const CHUNK_SIZE = 16;

function assertInteger(value, name) {
  if (!Number.isSafeInteger(value)) throw new TypeError(`${name} must be a safe integer`);
}

export function floorDiv(value, divisor) {
  assertInteger(value, "value");
  assertInteger(divisor, "divisor");
  if (divisor <= 0) throw new RangeError("divisor must be positive");
  return Math.floor(value / divisor);
}

export function positiveMod(value, divisor) {
  assertInteger(value, "value");
  assertInteger(divisor, "divisor");
  if (divisor <= 0) throw new RangeError("divisor must be positive");
  return ((value % divisor) + divisor) % divisor;
}

/** Maps world block coordinates to a 3D chunk coordinate. */
export function worldToChunk(position, chunkSize = CHUNK_SIZE) {
  validatePosition(position);
  return {
    x: floorDiv(position.x, chunkSize),
    y: floorDiv(position.y, chunkSize),
    z: floorDiv(position.z, chunkSize),
  };
}

/** Maps world block coordinates to non-negative coordinates inside a chunk. */
export function worldToLocal(position, chunkSize = CHUNK_SIZE) {
  validatePosition(position);
  return {
    x: positiveMod(position.x, chunkSize),
    y: positiveMod(position.y, chunkSize),
    z: positiveMod(position.z, chunkSize),
  };
}

/** Stable key for a 3D chunk coordinate. */
export function chunkKey(position) {
  validatePosition(position);
  return `${position.x},${position.y},${position.z}`;
}

/** Dense y-major chunk index; x changes fastest, then z, then y. */
export function localToIndex(position, chunkSize = CHUNK_SIZE) {
  validatePosition(position);
  assertInteger(chunkSize, "chunkSize");
  if (chunkSize <= 0) throw new RangeError("chunkSize must be positive");
  for (const axis of ["x", "y", "z"]) {
    if (position[axis] < 0 || position[axis] >= chunkSize) {
      throw new RangeError(`${axis} coordinate is outside chunk bounds`);
    }
  }
  return position.x + chunkSize * (position.z + chunkSize * position.y);
}

export function validatePosition(position) {
  if (!position || typeof position !== "object") throw new TypeError("position must be an object");
  for (const axis of ["x", "y", "z"]) assertInteger(position[axis], `position.${axis}`);
}
