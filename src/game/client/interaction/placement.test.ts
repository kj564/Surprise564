import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../../world/level/tile/registry';
import { VoxelWorld } from '../../world/level/world';
import { validatePlacementTarget } from './placement';
import type { VoxelRayHit } from './raycast';

function hitAt(x: number, y: number, z: number, face: { x: number; y: number; z: number }): VoxelRayHit {
  return { status: 'hit', blockId: 1, block: { x, y, z }, face, distance: 1 };
}

function makeWorld() {
  const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
  world.loadChunk(0, 0);
  return world;
}

describe('validatePlacementTarget', () => {
  test('resolves the adjacent cell from the selected face', () => {
    const world = makeWorld();
    const result = validatePlacementTarget(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), 5, defaultBlockRegistry);
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(result.target).toEqual({ x: 0, y: 2, z: 1 });
    expect(result.replacedBlockId).toBe(0);
  });

  test('rejects occupied targets and unknown target IDs', () => {
    const world = makeWorld();
    world.setBlock({ x: 0, y: 2, z: 1 }, 1);
    const occupied = validatePlacementTarget(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), 5, defaultBlockRegistry);
    expect(occupied.status).toBe('occupied');

    world.setBlock({ x: 0, y: 2, z: 1 }, 999);
    const unknown = validatePlacementTarget(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), 5, defaultBlockRegistry);
    expect(unknown.status).toBe('unknown-target-block');
  });

  test('refuses air, unknown placed blocks, and non-cardinal faces', () => {
    const world = makeWorld();
    expect(validatePlacementTarget(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), 0, defaultBlockRegistry).status).toBe('cannot-place-air');
    expect(validatePlacementTarget(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), 999, defaultBlockRegistry).status).toBe('unknown-placed-block');
    expect(validatePlacementTarget(world, hitAt(1, 2, 1, { x: 0, y: 0, z: 0 }), 5, defaultBlockRegistry).status).toBe('invalid-face');
    expect(validatePlacementTarget(world, hitAt(1, 2, 1, { x: 1, y: 1, z: 0 }), 5, defaultBlockRegistry).status).toBe('invalid-face');
  });

  test('reports unloaded target cells rather than treating them as air', () => {
    const world = makeWorld();
    const result = validatePlacementTarget(world, hitAt(3, 2, 1, { x: 1, y: 0, z: 0 }), 5, defaultBlockRegistry);
    expect(result.status).toBe('unloaded');
    if (result.status !== 'unloaded') return;
    expect(result.target).toEqual({ x: 4, y: 2, z: 1 });
  });
});
