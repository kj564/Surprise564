/**
 * Seeded 2D improved-gradient noise for browser terrain sampling.
 *
 * This is an independent implementation of the gradient-noise primitive used by
 * the historical reference's ImprovedNoise/PerlinNoise family. It intentionally
 * does not claim bit-for-bit MCPE terrain parity: the reference uses its own C++
 * random stream, stacked 3D density fields, biome surfaces and feature passes.
 */
export interface GradientNoise2D {
  sample(x: number, z: number): number;
}

const TABLE_SIZE = 256;
const MASK = TABLE_SIZE - 1;
const INV_SQRT_2 = 1 / Math.sqrt(2);

export function createGradientNoise2D(seed: number): GradientNoise2D {
  if (!Number.isSafeInteger(seed)) throw new RangeError('noise seed must be a safe integer');

  const permutation = new Uint16Array(TABLE_SIZE);
  for (let i = 0; i < TABLE_SIZE; i += 1) permutation[i] = i;

  let state = (seed >>> 0) || 0x6d2b79f5;
  const nextUint32 = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };

  for (let i = TABLE_SIZE - 1; i > 0; i -= 1) {
    const j = nextUint32() % (i + 1);
    const value = permutation[i];
    permutation[i] = permutation[j];
    permutation[j] = value;
  }

  const gradientAt = (x: number, z: number): number => {
    const hash = permutation[(permutation[x & MASK] + (z & MASK)) & MASK] & 7;
    switch (hash) {
      case 0: return x;
      case 1: return -x;
      case 2: return z;
      case 3: return -z;
      case 4: return (x + z) * INV_SQRT_2;
      case 5: return (x - z) * INV_SQRT_2;
      case 6: return (-x + z) * INV_SQRT_2;
      default: return (-x - z) * INV_SQRT_2;
    }
  };

  return Object.freeze({
    sample(x: number, z: number): number {
      if (!Number.isFinite(x) || !Number.isFinite(z)) {
        throw new TypeError('noise coordinates must be finite');
      }
      const xFloor = Math.floor(x);
      const zFloor = Math.floor(z);
      const dx = x - xFloor;
      const dz = z - zFloor;
      const u = fade(dx);
      const v = fade(dz);

      const n00 = gradientAtHash(permutation, xFloor, zFloor, dx, dz);
      const n10 = gradientAtHash(permutation, xFloor + 1, zFloor, dx - 1, dz);
      const n01 = gradientAtHash(permutation, xFloor, zFloor + 1, dx, dz - 1);
      const n11 = gradientAtHash(permutation, xFloor + 1, zFloor + 1, dx - 1, dz - 1);
      const value = lerp(lerp(n00, n10, u), lerp(n01, n11, u), v) * Math.SQRT2;
      return Math.max(-1, Math.min(1, value));
    },
  });
}

function gradientAtHash(
  permutation: Uint16Array,
  worldX: number,
  worldZ: number,
  localX: number,
  localZ: number,
): number {
  const hash = permutation[(permutation[worldX & MASK] + (worldZ & MASK)) & MASK] & 7;
  switch (hash) {
    case 0: return localX;
    case 1: return -localX;
    case 2: return localZ;
    case 3: return -localZ;
    case 4: return (localX + localZ) * INV_SQRT_2;
    case 5: return (localX - localZ) * INV_SQRT_2;
    case 6: return (-localX + localZ) * INV_SQRT_2;
    default: return (-localX - localZ) * INV_SQRT_2;
  }
}

function fade(value: number): number {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
