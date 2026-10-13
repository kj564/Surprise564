import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { VoxelWorld } from '../world/world';
import { buildChunkMesh } from './chunk-mesher';

function makeWorld(size = 2): VoxelWorld {
  return new VoxelWorld({ chunkSizeX: size, height: 2, chunkSizeZ: size });
}

describe('buildChunkMesh', () => {
  test('creates six correctly shaped quads for an isolated cube', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.setBlock({ x: 0, y: 0, z: 0 }, 1);

    const mesh = buildChunkMesh(world, 0, 0, defaultBlockRegistry);
    const opaque = mesh.layers.opaque!;
    expect(opaque.faceCount).toBe(6);
    expect(opaque.positions.length).toBe(6 * 4 * 3);
    expect(opaque.normals.length).toBe(opaque.positions.length);
    expect(opaque.blockIds.length).toBe(24);
    expect(opaque.indices.length).toBe(36);
    expect(Array.from(opaque.blockIds).every(id => id === 1)).toBe(true);
  });

  test('culls the shared face between adjacent opaque cubes', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.setBlock({ x: 0, y: 0, z: 0 }, 1);
    world.setBlock({ x: 1, y: 0, z: 0 }, 4);

    const mesh = buildChunkMesh(world, 0, 0, defaultBlockRegistry);
    expect(mesh.layers.opaque?.faceCount).toBe(10);
  });

  test('keeps chunk-boundary faces culled when both chunks are loaded', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.loadChunk(1, 0);
    world.setBlock({ x: 1, y: 0, z: 0 }, 1);
    world.setBlock({ x: 2, y: 0, z: 0 }, 1);

    expect(buildChunkMesh(world, 0, 0, defaultBlockRegistry).layers.opaque?.faceCount).toBe(5);
    expect(buildChunkMesh(world, 1, 0, defaultBlockRegistry).layers.opaque?.faceCount).toBe(5);
  });

  test('renders source-referenced slab and torch shapes without cube approximation', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.setBlock({ x: 0, y: 0, z: 0 }, 44); // slab is not a full cube
    world.setBlock({ x: 1, y: 0, z: 0 }, 50); // torch has a custom shape
    world.setBlock({ x: 0, y: 1, z: 0 }, 65535); // not registered

    const mesh = buildChunkMesh(world, 0, 0, defaultBlockRegistry);
    expect(mesh.unsupportedShapeBlocks).toBe(0);
    expect(mesh.unknownBlockIds).toBe(1);
    const slab = mesh.layers.opaque!;
    expect(slab.faceCount).toBe(6);
    expect(Math.max(...Array.from(slab.positions).filter((_, i) => i % 3 === 1 && i < slab.positions.length))).toBe(1);
    const torch = mesh.layers.cutout!;
    expect(torch.faceCount).toBe(5);
    expect(Math.max(...Array.from(torch.positions).filter((_, i) => i % 3 === 1))).toBe(1.75);
  });

  test('treats unloaded neighbor space as exposed and rejects unloaded target chunks', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 0, z: 0 }, 1);
    expect(buildChunkMesh(world, 0, 0, defaultBlockRegistry).layers.opaque?.faceCount).toBe(6);
    expect(() => buildChunkMesh(world, 1, 0, defaultBlockRegistry)).toThrow('unloaded chunk');
  });
});
