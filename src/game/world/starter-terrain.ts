import { VoxelWorld, type WorldDimensions } from './world';

/** Deterministic, dependency-free starter terrain for previews and new worlds. */
export interface TerrainOptions {
  readonly seed?: number;
  readonly baseHeight?: number;
  readonly amplitude?: number;
  readonly waterLevel?: number;
}

export interface GeneratedTerrain {
  readonly chunkX: number;
  readonly chunkZ: number;
  readonly minHeight: number;
  readonly maxHeight: number;
}

/**
 * Generates a modest rolling grass/dirt/stone landscape into an already-created world.
 * This is a bootstrap generator, not a claim of parity with Minecraft's historical noise.
 */
export function generateStarterChunk(
  world: VoxelWorld,
  chunkX: number,
  chunkZ: number,
  options: TerrainOptions = {},
): GeneratedTerrain {
  assertSafeInteger(chunkX, 'chunkX');
  assertSafeInteger(chunkZ, 'chunkZ');
  const seed = options.seed ?? 564;
  const baseHeight = options.baseHeight ?? 10;
  const amplitude = options.amplitude ?? 3;
  const waterLevel = options.waterLevel ?? 7;
  assertSafeInteger(seed, 'seed');
  if (!Number.isSafeInteger(baseHeight) || baseHeight < 2 || baseHeight >= world.dimensions.height) {
    throw new RangeError('baseHeight must be at least 2 and below world height');
  }
  if (!Number.isSafeInteger(amplitude) || amplitude < 0 || amplitude > 16) {
    throw new RangeError('amplitude must be an integer from 0 to 16');
  }
  if (!Number.isSafeInteger(waterLevel) || waterLevel < 0 || waterLevel >= world.dimensions.height) {
    throw new RangeError('waterLevel must be within world height');
  }
  if (!world.hasChunk(chunkX, chunkZ)) world.loadChunk(chunkX, chunkZ);

  const { chunkSizeX, chunkSizeZ, height } = world.dimensions;
  let minHeight = height;
  let maxHeight = 0;
  for (let localX = 0; localX < chunkSizeX; localX += 1) {
    for (let localZ = 0; localZ < chunkSizeZ; localZ += 1) {
      const x = chunkX * chunkSizeX + localX;
      const z = chunkZ * chunkSizeZ + localZ;
      const top = Math.max(1, Math.min(height - 1, baseHeight + terrainNoise(x, z, seed, amplitude)));
      minHeight = Math.min(minHeight, top);
      maxHeight = Math.max(maxHeight, top);
      for (let y = 0; y < top; y += 1) {
        const id = y === top - 1 ? 2 : y >= top - 4 ? 3 : 1;
        world.setBlock({ x, y, z }, id);
      }
      for (let y = top; y <= waterLevel && y < height; y += 1) {
        // Water IDs 8/9 normalize in the registry; keep the stored legacy still-water ID.
        world.setBlock({ x, y, z }, 9);
      }
    }
  }
  return Object.freeze({ chunkX, chunkZ, minHeight, maxHeight });
}

function terrainNoise(x: number, z: number, seed: number, amplitude: number): number {
  if (amplitude === 0) return 0;
  const a = Math.sin((x + seed * 0.013) * 0.31);
  const b = Math.cos((z - seed * 0.021) * 0.27);
  const c = Math.sin((x + z + seed * 0.007) * 0.13);
  return Math.round((a + b + c) * amplitude / 3);
}

function assertSafeInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value)) throw new TypeError(name + ' must be a safe integer');
}
