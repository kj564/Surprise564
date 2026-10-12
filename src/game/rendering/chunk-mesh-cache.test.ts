import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { VoxelWorld } from '../world/world';
import { ChunkMeshCache } from './chunk-mesh-cache';

describe('ChunkMeshCache', () => {
  test('builds initial meshes from dirty loaded chunks', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 2, chunkSizeZ: 2 });
    world.loadChunk(0, 0);
    world.setBlock({ x: 0, y: 0, z: 0 }, 1);
    const cache = new ChunkMeshCache(world, defaultBlockRegistry);

    expect(cache.sync()).toEqual({ rebuilt: 1, removed: 0 });
    expect(cache.size).toBe(1);
    expect(cache.get(0, 0)?.layers.opaque?.faceCount).toBe(6);
    expect(cache.sync()).toEqual({ rebuilt: 0, removed: 0 });
  });

  test('rebuilds both chunks when a boundary neighbor is loaded or changed', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 2, chunkSizeZ: 2 });
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 0, z: 0 }, 1);
    const cache = new ChunkMeshCache(world, defaultBlockRegistry);
    cache.sync();

    world.loadChunk(1, 0);
    world.setBlock({ x: 2, y: 0, z: 0 }, 1);
    expect(cache.sync()).toEqual({ rebuilt: 2, removed: 0 });
    expect(cache.get(0, 0)?.layers.opaque?.faceCount).toBe(5);
    expect(cache.get(1, 0)?.layers.opaque?.faceCount).toBe(5);
  });

  test('removes unloaded mesh entries and restores exposed boundary faces', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 2, chunkSizeZ: 2 });
    world.loadChunk(0, 0);
    world.loadChunk(1, 0);
    world.setBlock({ x: 1, y: 0, z: 0 }, 1);
    world.setBlock({ x: 2, y: 0, z: 0 }, 1);
    const cache = new ChunkMeshCache(world, defaultBlockRegistry);
    cache.sync();

    world.unloadChunk(1, 0);
    expect(cache.sync()).toEqual({ rebuilt: 1, removed: 1 });
    expect(cache.size).toBe(1);
    expect(cache.get(0, 0)?.layers.opaque?.faceCount).toBe(6);
    expect(cache.get(1, 0)).toBeUndefined();
  });
});
