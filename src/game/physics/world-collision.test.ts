import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { Aabb } from './aabb';
import { queryCollisionBoxes } from './world-collision';
import { VoxelWorld } from '../world/world';

describe('queryCollisionBoxes', () => {
  test('collects solid blocks but skips air and non-solid blocks', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 4, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 1, z: 1 }, 1);
    world.setBlock({ x: 2, y: 1, z: 1 }, 50);
    const result = queryCollisionBoxes(world, new Aabb(0.5, 1, 0.5, 3, 2, 2), defaultBlockRegistry);
    expect(result.boxes).toEqual([new Aabb(1, 1, 1, 2, 2, 2)]);
    expect(result.unloadedCells).toHaveLength(0);
  });

  test('fails closed for unknown IDs and unloaded chunk cells', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 4, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 1, z: 1 }, 999);
    const unknown = queryCollisionBoxes(world, new Aabb(1, 1, 1, 2, 2, 2), defaultBlockRegistry);
    expect(unknown.boxes).toEqual([new Aabb(1, 1, 1, 2, 2, 2)]);

    const unloaded = queryCollisionBoxes(world, new Aabb(4, 1, 1, 5, 2, 2), defaultBlockRegistry);
    expect(unloaded.boxes).toHaveLength(1);
    expect(unloaded.unloadedCells).toEqual([{ x: 4, y: 1, z: 1 }]);
  });

  test('treats vertical world limits as solid boundaries and caps query size', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 4, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    const below = queryCollisionBoxes(world, new Aabb(1, -1, 1, 2, 0, 2), defaultBlockRegistry);
    expect(below.boxes).toEqual([new Aabb(1, -1, 1, 2, 0, 2)]);
    expect(below.unloadedCells).toHaveLength(0);
    expect(() => queryCollisionBoxes(world, new Aabb(0, 0, 0, 20, 20, 20), defaultBlockRegistry, 10)).toThrow(RangeError);
  });
  test('uses one-eighth-height collision bounds for snow layers', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 4, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 1, z: 1 }, 78);
    const result = queryCollisionBoxes(world, new Aabb(1, 1, 1, 2, 2, 2), defaultBlockRegistry);
    expect(result.boxes).toEqual([new Aabb(1, 1, 1, 2, 1.125, 2)]);
  });

});
