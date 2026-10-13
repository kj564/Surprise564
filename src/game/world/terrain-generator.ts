import type { BlockRegistry } from '../blocks/registry';
import { defaultBlockRegistry } from '../blocks/registry';
import { createGradientNoise2D } from './gradient-noise';
import { VoxelWorld } from './world';

export interface TerrainOptions {
  readonly seed?: number;
  readonly seaLevel?: number;
  readonly baseHeight?: number;
  readonly amplitude?: number;
  readonly registry?: BlockRegistry;
}

/**
 * Deterministic 2D heightmap terrain for the rebuild preview.
 *
 * The historical MCPE reference uses stacked 3D Perlin density fields and a
 * biome-aware surface pass. This heightmap uses a seeded improved-gradient
 * noise primitive as an incremental browser adaptation, not a bit-identical
 * port of RandomLevelSource.
 */
export function generateTerrainChunk(
  world: VoxelWorld, chunkX: number, chunkZ: number, options: TerrainOptions = {},
): { readonly chunkX: number; readonly chunkZ: number; readonly minHeight: number; readonly maxHeight: number } {
  if (!Number.isSafeInteger(chunkX) || !Number.isSafeInteger(chunkZ)) throw new TypeError('Chunk coordinates must be safe integers');
  const seed = options.seed ?? 564;
  const seaLevel = options.seaLevel ?? 7;
  const baseHeight = options.baseHeight ?? 9;
  const amplitude = options.amplitude ?? 5;
  if (!Number.isSafeInteger(seed)) throw new RangeError('seed must be a safe integer');
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
  const broadNoise = createGradientNoise2D(seed);
  const detailNoise = createGradientNoise2D(seed ^ 0x5f356495);
  const dims = world.dimensions;
  const chunk = world.loadChunk(chunkX, chunkZ);
  let minHeight = dims.height - 1, maxHeight = 0;
  for (let localX = 0; localX < dims.chunkSizeX; localX += 1) {
    for (let localZ = 0; localZ < dims.chunkSizeZ; localZ += 1) {
      const x = chunkX * dims.chunkSizeX + localX;
      const z = chunkZ * dims.chunkSizeZ + localZ;
      const broad = broadNoise.sample(x / 28, z / 28);
      const detail = detailNoise.sample(x / 9, z / 9);
      const height = Math.max(1, Math.min(dims.height - 2, Math.round(baseHeight + broad * amplitude + detail * amplitude * 0.35)));
      minHeight = Math.min(minHeight, height);
      maxHeight = Math.max(maxHeight, height);
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
