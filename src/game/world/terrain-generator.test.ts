import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { VoxelWorld } from './world';
import { generateTerrainChunk } from './terrain-generator';

const dimensions = { chunkSizeX: 8, height: 24, chunkSizeZ: 8 };
function surface(world: VoxelWorld, x: number, z: number): number {
  for (let y = world.dimensions.height - 1; y >= 0; y -= 1) if ((world.getBlock(x, y, z) ?? 0) !== 0) return y;
  return -1;
}

describe('seeded terrain generation', () => {
  test('generates repeatable chunks for the same seed', () => {
    const a = new VoxelWorld(dimensions), b = new VoxelWorld(dimensions);
    const summaryA = generateTerrainChunk(a, -1, 2, { seed: 564 });
    const summaryB = generateTerrainChunk(b, -1, 2, { seed: 564 });
    expect(Array.from(a.exportChunks()[0].blocks)).toEqual(Array.from(b.exportChunks()[0].blocks));
    expect(summaryA).toEqual(summaryB);
  });

  test('different seeds produce different surface patterns', () => {
    const a = new VoxelWorld(dimensions), b = new VoxelWorld(dimensions);
    generateTerrainChunk(a, -1, -1, { seed: 564 });
    generateTerrainChunk(b, -1, -1, { seed: 565 });
    expect(Array.from(a.exportChunks()[0].blocks)).not.toEqual(Array.from(b.exportChunks()[0].blocks));
  });

  test('uses valid terrain layers and varies the surface height', () => {
    const world = new VoxelWorld(dimensions);
    const summary = generateTerrainChunk(world, 0, 0, { seed: 42 });
    const heights = new Set<number>();
    for (let x = 0; x < 8; x += 1) for (let z = 0; z < 8; z += 1) heights.add(surface(world, x, z));
    expect(heights.size).toBeGreaterThan(1);
    expect(summary.minHeight).toBeGreaterThan(0);
    expect(summary.maxHeight).toBeLessThan(dimensions.height - 1);
    expect(world.getBlock(0, 0, 0)).toBe(defaultBlockRegistry.getIdByKey('minecraft:bedrock'));
  });

  test('keeps height samples continuous at positive X chunk edges', () => {
    const world = new VoxelWorld(dimensions);
    generateTerrainChunk(world, 0, 0, { seed: 564 });
    generateTerrainChunk(world, 1, 0, { seed: 564 });
    for (let z = 0; z < 8; z += 1) {
      expect(Math.abs(surface(world, 7, z) - surface(world, 8, z))).toBeLessThanOrEqual(2);
    }
  });

  test('keeps height samples continuous across negative X and Z chunk edges', () => {
    const world = new VoxelWorld(dimensions);
    generateTerrainChunk(world, -1, -1, { seed: 564 });
    generateTerrainChunk(world, 0, -1, { seed: 564 });
    generateTerrainChunk(world, -1, 0, { seed: 564 });

    for (let z = -8; z < 0; z += 1) {
      expect(Math.abs(surface(world, -1, z) - surface(world, 0, z))).toBeLessThanOrEqual(2);
    }
    for (let x = -8; x < 0; x += 1) {
      expect(Math.abs(surface(world, x, -1) - surface(world, x, 0))).toBeLessThanOrEqual(2);
    }
  });

  test('rejects duplicate generation and invalid seeds', () => {
    const world = new VoxelWorld(dimensions);
    generateTerrainChunk(world, 0, 0);
    expect(() => generateTerrainChunk(world, 0, 0)).toThrow('already loaded');
    expect(() => generateTerrainChunk(new VoxelWorld(dimensions), 0, 0, { seed: 1.5 })).toThrow('safe integer');
  });
});
