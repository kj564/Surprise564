import { describe, expect, test } from 'bun:test';
import { VoxelWorld } from './world';
import { generateStarterChunk } from './starter-terrain';

describe('starter terrain generator', () => {
  test('fills a chunk with a deterministic surface and solid layers', () => {
    const world = new VoxelWorld({ chunkSizeX: 8, height: 24, chunkSizeZ: 8 });
    const result = generateStarterChunk(world, 0, 0, { seed: 564, baseHeight: 8, amplitude: 2, waterLevel: 3 });
    expect(world.hasChunk(0, 0)).toBe(true);
    expect(result.minHeight).toBeGreaterThanOrEqual(1);
    expect(result.maxHeight).toBeLessThan(24);
    let grass = 0;
    let dirt = 0;
    let stone = 0;
    for (let x = 0; x < 8; x += 1) for (let z = 0; z < 8; z += 1) {
      const surface = Array.from({ length: 24 }, (_, y) => ({ y, id: world.getBlock(x, y, z) }))
        .filter(cell => cell.id === 2).at(-1);
      expect(surface).toBeDefined();
      grass += 1;
      if (world.getBlock(x, surface!.y - 1, z) === 3) dirt += 1;
      if (world.getBlock(x, 0, z) === 1) stone += 1;
    }
    expect(grass).toBe(64);
    expect(dirt).toBe(64);
    expect(stone).toBe(64);
  });

  test('same seed creates identical block data and validates unsafe options', () => {
    const a = new VoxelWorld({ chunkSizeX: 8, height: 24, chunkSizeZ: 8 });
    const b = new VoxelWorld({ chunkSizeX: 8, height: 24, chunkSizeZ: 8 });
    generateStarterChunk(a, -1, 2, { seed: 9, baseHeight: 8, amplitude: 3 });
    generateStarterChunk(b, -1, 2, { seed: 9, baseHeight: 8, amplitude: 3 });
    expect(Array.from(a.exportChunks()[0].blocks)).toEqual(Array.from(b.exportChunks()[0].blocks));
    expect(() => generateStarterChunk(a, 0, 0, { amplitude: 100 })).toThrow(RangeError);
  });
});
