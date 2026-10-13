import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { VoxelWorld } from '../world/world';
import { PlayerPhysics } from './player-physics';
import { createWorldCollisionProvider } from './world-collision-provider';

describe('world collision provider integration', () => {
  test('player can stand on real world blocks and cannot walk through a real wall', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    for (let x = 0; x < 4; x += 1) {
      for (let z = 0; z < 4; z += 1) world.setBlock({ x, y: 0, z }, 1);
    }
    world.setBlock({ x: 1, y: 1, z: 1 }, 1);
    const collision = createWorldCollisionProvider(world, defaultBlockRegistry);
    const player = new PlayerPhysics({ x: 0.5, y: 1, z: 1.5 });

    const grounded = player.step(1 / 60, { moveX: 0, moveZ: 0, jump: false }, collision);
    expect(grounded.onGround).toBe(true);
    expect(grounded.position.y).toBeCloseTo(1);

    const blocked = player.step(0.1, { moveX: 1, moveZ: 0, jump: false }, collision);
    expect(blocked.horizontalCollision).toBe(true);
    expect(player.bounds.maxX).toBeCloseTo(1);
  });

  test('unloaded neighboring chunks are conservative barriers', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    for (let x = 0; x < 4; x += 1) {
      for (let z = 0; z < 4; z += 1) world.setBlock({ x, y: 0, z }, 1);
    }
    const player = new PlayerPhysics({ x: 3.5, y: 1, z: 1.5 });
    const collision = createWorldCollisionProvider(world, defaultBlockRegistry);
    const state = player.step(0.2, { moveX: 1, moveZ: 0, jump: false }, collision);
    expect(state.horizontalCollision).toBe(true);
    expect(player.bounds.maxX).toBeCloseTo(4);
  });

  // Regression: a legacy bottom slab is half a block high, not a full cube.
  test('player stands on the top of a half-height slab', () => {
    const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
    world.loadChunk(0, 0);
    world.setBlock({ x: 1, y: 0, z: 1 }, 44);
    const collision = createWorldCollisionProvider(world, defaultBlockRegistry);
    const player = new PlayerPhysics({ x: 1.5, y: 0.5, z: 1.5 });

    const state = player.step(1 / 60, { moveX: 0, moveZ: 0, jump: false }, collision);
    expect(state.onGround).toBe(true);
    expect(state.position.y).toBeCloseTo(0.5);
  });

});
