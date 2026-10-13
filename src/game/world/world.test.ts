import { describe, expect, test } from 'bun:test';
import { VoxelWorld } from './world';

describe('VoxelWorld', () => {
  test('distinguishes loaded air from an unloaded chunk', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 4, chunkSizeZ: 2 });
    expect(world.getBlock(0, 0, 0)).toBeUndefined();
    world.loadChunk(0, 0);
    expect(world.getBlock(0, 0, 0)).toBe(0);
    expect(world.getLoadedChunkCount()).toBe(1);
  });

  test('maps positive and negative world coordinates to the correct chunks', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 4, chunkSizeZ: 2 });
    world.loadChunk(0, 0);
    world.loadChunk(-1, -1);
    world.setBlock({ x: 1, y: 1, z: 1 }, 5);
    world.setBlock({ x: -1, y: 1, z: -1 }, 7);
    expect(world.getBlock(1, 1, 1)).toBe(5);
    expect(world.getBlock(-1, 1, -1)).toBe(7);
    expect(world.getBlock(-2, 1, -2)).toBe(0);
  });

  test('requires loaded chunks and valid vertical coordinates for mutations', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 4, chunkSizeZ: 2 });
    expect(() => world.setBlock({ x: 0, y: 0, z: 0 }, 1)).toThrow('unloaded chunk');
    world.loadChunk(0, 0);
    expect(world.getBlock(0, -1, 0)).toBeUndefined();
    expect(() => world.setBlock({ x: 0, y: 4, z: 0 }, 1)).toThrow(RangeError);
    expect(() => world.setBlock({ x: 0, y: 0, z: 0 }, -1)).toThrow(RangeError);
  });

  test('marks the changed chunk and loaded neighbors dirty at chunk edges', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 4, chunkSizeZ: 2 });
    world.loadChunk(0, 0);
    world.loadChunk(-1, 0);
    world.loadChunk(1, 0);
    world.consumeDirtyChunks();

    const mutation = world.setBlock({ x: 0, y: 1, z: 0 }, 3);
    expect(mutation.changed).toBe(true);
    expect(mutation.previousId).toBe(0);
    expect([...mutation.dirtyChunks].sort()).toEqual(['-1,0', '0,0']);
    expect(world.consumeDirtyChunks().sort()).toEqual(['-1,0', '0,0']);
  });

  test('does not dirty chunks for no-op writes and unload invalidates neighbors', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 4, chunkSizeZ: 2 });
    world.loadChunk(0, 0);
    world.loadChunk(1, 0);
    world.consumeDirtyChunks();
    expect(world.setBlock({ x: 0, y: 0, z: 0 }, 0).changed).toBe(false);
    expect(world.consumeDirtyChunks()).toEqual([]);
    expect(world.unloadChunk(0, 0)).toBe(true);
    expect(world.consumeDirtyChunks()).toEqual(['1,0']);
    expect(world.unloadChunk(0, 0)).toBe(false);
  });

  test('rejects unsafe world and chunk coordinates', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 4, chunkSizeZ: 2 });
    expect(() => world.getBlock(0.5, 0, 0)).toThrow(TypeError);
    expect(() => VoxelWorld.chunkKey(Number.MAX_SAFE_INTEGER + 1, 0)).toThrow(TypeError);
  });
  test('invalidates the loaded neighbor on each of the four horizontal chunk boundaries', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 4, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    world.loadChunk(-1, 0);
    world.loadChunk(1, 0);
    world.loadChunk(0, -1);
    world.loadChunk(0, 1);
    world.consumeDirtyChunks();

    const cases = [
      { position: { x: 0, y: 1, z: 1 }, blockId: 1, expected: ['-1,0', '0,0'] },
      { position: { x: 3, y: 1, z: 1 }, blockId: 2, expected: ['0,0', '1,0'] },
      { position: { x: 1, y: 1, z: 0 }, blockId: 3, expected: ['0,-1', '0,0'] },
      { position: { x: 1, y: 1, z: 3 }, blockId: 4, expected: ['0,0', '0,1'] },
    ];

    for (const { position, blockId, expected } of cases) {
      world.consumeDirtyChunks();
      const mutation = world.setBlock(position, blockId);
      expect(mutation.changed).toBe(true);
      expect([...mutation.dirtyChunks].sort()).toEqual([...expected].sort());
      expect(world.consumeDirtyChunks().sort()).toEqual([...expected].sort());
    }
  });

});
