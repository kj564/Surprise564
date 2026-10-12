import { describe, expect, test } from 'bun:test';
import { VoxelWorld } from './world';
import { ensureTerrainNeighborhood } from './terrain-streaming';

describe('ensureTerrainNeighborhood', () => {
  test('generates a deterministic square around the player and does not overwrite existing chunks', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 20, chunkSizeZ: 4 });
    const first = ensureTerrainNeighborhood(world, 0.5, 0.5, { radius: 1, seed: 564, baseHeight: 5, amplitude: 2 });
    expect(first.centerChunkX).toBe(0);
    expect(first.centerChunkZ).toBe(0);
    expect(first.generated).toHaveLength(9);
    const before = world.getBlock(0, 0, 0);
    world.setBlock({ x: 0, y: 1, z: 0 }, 1);
    const second = ensureTerrainNeighborhood(world, 0.5, 0.5, { radius: 1, seed: 999 });
    expect(second.generated).toHaveLength(0);
    expect(world.getBlock(0, 1, 0)).toBe(1);
    expect(world.getBlock(0, 0, 0)).toBe(before);
  });

  test('supports negative world coordinates and only creates missing chunks', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 20, chunkSizeZ: 4 });
    const result = ensureTerrainNeighborhood(world, -0.1, -4.1, { radius: 0, seed: 7, baseHeight: 5, amplitude: 1 });
    expect(result.centerChunkX).toBe(-1);
    expect(result.centerChunkZ).toBe(-2);
    expect(result.generated).toEqual([{ x: -1, z: -2 }]);
    expect(world.hasChunk(-1, -2)).toBe(true);
  });

  test('validates positions and bounded radius', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 20, chunkSizeZ: 4 });
    expect(() => ensureTerrainNeighborhood(world, Number.NaN, 0)).toThrow();
    expect(() => ensureTerrainNeighborhood(world, 0, 0, { radius: 9 })).toThrow();
  });
});
