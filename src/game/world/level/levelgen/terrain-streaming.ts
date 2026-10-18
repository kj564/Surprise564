import { worldToChunk } from '../../../util/coordinates';
import type { BlockRegistry } from '../tile/registry';
import { generateTerrainChunk, type TerrainOptions } from './terrain-generator';
import type { VoxelWorld } from '../world';

export interface TerrainNeighborhoodResult {
  readonly centerChunkX: number;
  readonly centerChunkZ: number;
  readonly generated: readonly Readonly<{ x: number; z: number }>[];
}

/**
 * Ensure a square neighborhood around a world position is generated. Existing chunks are
 * never overwritten, preserving player edits when the player revisits an explored area.
 * Unloading is intentionally left to a future persistence-aware streaming layer.
 */
export function ensureTerrainNeighborhood(
  world: VoxelWorld,
  worldX: number,
  worldZ: number,
  options: TerrainOptions & { readonly radius?: number } = {},
): TerrainNeighborhoodResult {
  if (!Number.isFinite(worldX) || !Number.isFinite(worldZ)) {
    throw new TypeError('World position must be finite');
  }
  const radius = options.radius ?? 1;
  if (!Number.isSafeInteger(radius) || radius < 0 || radius > 8) {
    throw new RangeError('radius must be a safe integer from 0 to 8');
  }
  const centerChunkX = worldToChunk(Math.floor(worldX), world.dimensions.chunkSizeX);
  const centerChunkZ = worldToChunk(Math.floor(worldZ), world.dimensions.chunkSizeZ);
  const generated: Array<Readonly<{ x: number; z: number }>> = [];
  for (let z = centerChunkZ - radius; z <= centerChunkZ + radius; z += 1) {
    for (let x = centerChunkX - radius; x <= centerChunkX + radius; x += 1) {
      if (world.hasChunk(x, z)) continue;
      generateTerrainChunk(world, x, z, options);
      generated.push(Object.freeze({ x, z }));
    }
  }
  return Object.freeze({
    centerChunkX,
    centerChunkZ,
    generated: Object.freeze(generated),
  });
}
