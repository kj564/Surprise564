import { describe, expect, test } from 'bun:test';
import { raycastVoxels } from './raycast';
import { VoxelWorld } from '../world/world';

function makeWorld() {
  return new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
}

describe('raycastVoxels', () => {
  test('hits a block along a positive axis and reports the entered face', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 1, z: 1 }, 1);
    const hit = raycastVoxels(world, { x: 0.5, y: 1.5, z: 1.5 }, { x: 1, y: 0, z: 0 }, 5, id => id !== 0);
    expect(hit.status).toBe('hit');
    if (hit.status !== 'hit') return;
    expect(hit.block).toEqual({ x: 1, y: 1, z: 1 });
    expect(hit.face).toEqual({ x: -1, y: 0, z: 0 });
    expect(hit.distance).toBeCloseTo(0.5);
  });

  test('traverses negative coordinates correctly', () => {
    const world = makeWorld();
    world.loadChunk(-1, 0);
    world.setBlock({ x: -2, y: 1, z: 1 }, 4);
    const hit = raycastVoxels(world, { x: -0.5, y: 1.5, z: 1.5 }, { x: -1, y: 0, z: 0 }, 3, id => id !== 0);
    expect(hit.status).toBe('hit');
    if (hit.status !== 'hit') return;
    expect(hit.block.x).toBe(-2);
    expect(hit.face).toEqual({ x: 1, y: 0, z: 0 });
    expect(hit.distance).toBeCloseTo(0.5);
  });

  test('uses deterministic X-first tie-breaking on edge crossings', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 0, z: 0 }, 2);
    const hit = raycastVoxels(world, { x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 1, z: 0 }, 2, id => id !== 0);
    expect(hit.status).toBe('hit');
    if (hit.status !== 'hit') return;
    expect(hit.block).toEqual({ x: 1, y: 0, z: 0 });
    expect(hit.face).toEqual({ x: -1, y: 0, z: 0 });
  });

  test('stops at unloaded chunks instead of treating them as air', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    const result = raycastVoxels(world, { x: 3.5, y: 1.5, z: 1.5 }, { x: 1, y: 0, z: 0 }, 4, id => id !== 0);
    expect(result.status).toBe('unloaded');
    if (result.status !== 'unloaded') return;
    expect(result.block).toEqual({ x: 4, y: 1, z: 1 });
    expect(result.distance).toBeCloseTo(0.5);
  });

  test('treats vertical build limits as empty space while preserving loaded-world targeting', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 6, z: 1 }, 1);
    const result = raycastVoxels(world, { x: 1.5, y: 10.5, z: 1.5 }, { x: 0, y: -1, z: 0 }, 6, id => id !== 0);
    expect(result.status).toBe('hit');
    if (result.status === 'hit') expect(result.block).toEqual({ x: 1, y: 6, z: 1 });
  });

  test('returns miss after max distance and validates ray inputs', () => {
    const world = makeWorld();
    world.loadChunk(0, 0);
    expect(raycastVoxels(world, { x: 0.5, y: 1.5, z: 1.5 }, { x: 1, y: 0, z: 0 }, 0.2, id => id !== 0).status).toBe('miss');
    expect(() => raycastVoxels(world, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 1, () => true)).toThrow(RangeError);
    expect(() => raycastVoxels(world, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, -1, () => true)).toThrow(RangeError);
  });
});
