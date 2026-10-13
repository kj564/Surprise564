import type { BlockRegistry } from '../blocks/registry';
import { defaultBlockRegistry } from '../blocks/registry';
import { VoxelWorld, type WorldDimensions } from './world';

export interface TerrainOptions {
  readonly seed?: number;
  readonly seaLevel?: number;
  readonly baseHeight?: number;
  readonly amplitude?: number;
  readonly registry?: BlockRegistry;
}

/** Deterministic heightmap terrain for a loaded chunk; every sample depends only on seed and world X/Z. */
export function generateTerrainChunk(
  world: VoxelWorld, chunkX: number, chunkZ: number, options: TerrainOptions = {},
): { readonly chunkX: number; readonly chunkZ: number; readonly minHeight: number; readonly maxHeight: number } {
  if (!Number.isSafeInteger(chunkX) || !Number.isSafeInteger(chunkZ)) throw new TypeError('Chunk coordinates must be safe integers');
  const seed = options.seed ?? 564;
  const seaLevel = options.seaLevel ?? 7;
  const baseHeight = options.baseHeight ?? 9;
  const amplitude = options.amplitude ?? 5;
  if (!Number.isSafeInteger(seed)) throw new RangeError('seed must be a safe integer');
  if (world.dimensions.height < 3) throw new RangeError('world height must be at least 3 blocks for terrain generation');
  if (!Number.isSafeInteger(seaLevel) || seaLevel < 0 || seaLevel >= world.dimensions.height) throw new RangeError('seaLevel is outside world height');
  if (!Number.isFinite(baseHeight) || !Number.isFinite(amplitude) || amplitude < 0) throw new RangeError('terrain height settings must be finite and amplitude non-negative');
  if (world.hasChunk(chunkX, chunkZ)) throw new Error('Cannot generate an already loaded chunk');
  const registry = options.registry ?? defaultBlockRegistry;
  const ids = {
    bedrock: requireId(registry, 'minecraft:bedrock'),
    stone: requireId(registry, 'minecraft:stone'),
    dirt: requireId(registry, 'minecraft:dirt'),
    grass: requireId(registry, 'minecraft:grass_block'),
    sand: requireId(registry, 'minecraft:sand'),
  };
  const dims = world.dimensions;
  // Precompute and validate the complete heightmap before creating a chunk, so a future
  // terrain-kernel regression cannot leave partially generated world state behind.
  const heights = new Uint16Array(dims.chunkSizeX * dims.chunkSizeZ);
  let minHeight = dims.height - 1, maxHeight = 0;
  for (let localX = 0; localX < dims.chunkSizeX; localX += 1) {
    for (let localZ = 0; localZ < dims.chunkSizeZ; localZ += 1) {
      const x = chunkX * dims.chunkSizeX + localX;
      const z = chunkZ * dims.chunkSizeZ + localZ;
      const broad = valueNoise(x / 28, z / 28, seed);
      const detail = valueNoise(x / 9, z / 9, seed ^ 0x5f356495);
      const height = Math.max(1, Math.min(dims.height - 2, Math.round(baseHeight + broad * amplitude + detail * amplitude * 0.35)));
      if (!Number.isSafeInteger(height) || height < 1 || height > dims.height - 2) {
        throw new RangeError('terrain height must be an integer from 1 to world height - 2');
      }
      heights[localX * dims.chunkSizeZ + localZ] = height;
      minHeight = Math.min(minHeight, height);
      maxHeight = Math.max(maxHeight, height);
    }
  }
  const chunk = world.loadChunk(chunkX, chunkZ);
  for (let localX = 0; localX < dims.chunkSizeX; localX += 1) {
    for (let localZ = 0; localZ < dims.chunkSizeZ; localZ += 1) {
      const height = heights[localX * dims.chunkSizeZ + localZ];
      const surface = height <= seaLevel + 1 ? ids.sand : ids.grass;
      for (let y = 0; y <= height; y += 1) {
        const id = y === 0 ? ids.bedrock : y === height ? surface : y >= height - 3 ? ids.dirt : ids.stone;
        chunk.setBlock(localX, y, localZ, id);
      }
    }
  }
  return Object.freeze({ chunkX, chunkZ, minHeight, maxHeight });
}

function requireId(registry: BlockRegistry, key: string): number {
  const id = registry.getIdByKey(key);
  if (id === undefined) throw new Error('Terrain requires block definition ' + key);
  return id;
}

function valueNoise(x: number, z: number, seed: number): number {
  const x0 = Math.floor(x), z0 = Math.floor(z);
  const tx = smooth(x - x0), tz = smooth(z - z0);
  const a = lattice(x0, z0, seed), b = lattice(x0 + 1, z0, seed);
  const c = lattice(x0, z0 + 1, seed), d = lattice(x0 + 1, z0 + 1, seed);
  return lerp(lerp(a, b, tx), lerp(c, d, tx), tz);
}
function lattice(x: number, z: number, seed: number): number {
  let n = Math.imul(x, 374761393) + Math.imul(z, 668265263) + Math.imul(seed, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n = (n ^ (n >>> 16)) >>> 0;
  return n / 0xffffffff * 2 - 1;
}
function smooth(t: number): number { return t * t * (3 - 2 * t); }
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }