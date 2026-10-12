import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { Inventory } from '../inventory/inventory';
import { Aabb } from '../physics/aabb';
import { VoxelWorld } from '../world/world';
import { placeBlockFromInventory } from './placement';
import type { VoxelRayHit } from './raycast';

function hitAt(x: number, y: number, z: number, face: { x: number; y: number; z: number }): VoxelRayHit {
  return { status: 'hit', blockId: 1, block: { x, y, z }, face, distance: 1 };
}

function makeWorld() {
  const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
  world.loadChunk(0, 0);
  return world;
}

const awayFromTarget = new Aabb(2.5, 2, 2.5, 3.2, 3.8, 3.2);
const playerOverTarget = new Aabb(0.1, 2.1, 1.1, 0.9, 2.9, 1.9);

describe('placeBlockFromInventory', () => {
  test('places a block and consumes exactly one item after validation', () => {
    const world = makeWorld();
    const inventory = new Inventory(2);
    inventory.insert('minecraft:stone', 3);
    const result = placeBlockFromInventory(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), inventory, 0, defaultBlockRegistry, awayFromTarget);
    expect(result.status).toBe('placed');
    expect(world.getBlock(0, 2, 1)).toBe(1);
    expect(inventory.getSlot(0)?.count).toBe(2);
    if (result.status === 'placed') expect(result.remainingInSlot).toBe(2);
  });

  test('does not consume an item if the new block intersects the player', () => {
    const world = makeWorld();
    const inventory = new Inventory(1);
    inventory.insert('minecraft:stone', 2);
    const result = placeBlockFromInventory(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), inventory, 0, defaultBlockRegistry, playerOverTarget);
    expect(result.status).toBe('blocked-by-player');
    expect(world.getBlock(0, 2, 1)).toBe(0);
    expect(inventory.getSlot(0)?.count).toBe(2);
  });

  test('does not consume an item for occupied or unloaded targets', () => {
    const world = makeWorld();
    const inventory = new Inventory(1);
    inventory.insert('minecraft:stone', 2);
    world.setBlock({ x: 0, y: 2, z: 1 }, 1);
    expect(placeBlockFromInventory(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), inventory, 0, defaultBlockRegistry, awayFromTarget).status).toBe('occupied');
    expect(placeBlockFromInventory(world, hitAt(3, 2, 1, { x: 1, y: 0, z: 0 }), inventory, 0, defaultBlockRegistry, awayFromTarget).status).toBe('unloaded');
    expect(inventory.getSlot(0)?.count).toBe(2);
  });

  test('does not consume items when target write would be a no-op', () => {
    const world = makeWorld();
    const inventory = new Inventory(1);
    inventory.insert('minecraft:water', 2);
    world.setBlock({ x: 0, y: 2, z: 1 }, 8);
    const result = placeBlockFromInventory(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), inventory, 0, defaultBlockRegistry, awayFromTarget);
    expect(result.status).toBe('no-change');
    expect(inventory.getSlot(0)?.count).toBe(2);
  });

  test('rejects empty inventory and non-block items without changing the world', () => {
    const world = makeWorld();
    const empty = new Inventory(1);
    expect(placeBlockFromInventory(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), empty, 0, defaultBlockRegistry, awayFromTarget).status).toBe('inventory-empty');
    const inventory = new Inventory(1);
    inventory.insert('minecraft:diamond', 2);
    expect(placeBlockFromInventory(world, hitAt(1, 2, 1, { x: -1, y: 0, z: 0 }), inventory, 0, defaultBlockRegistry, awayFromTarget).status).toBe('not-a-block-item');
    expect(world.getBlock(0, 2, 1)).toBe(0);
    expect(inventory.getSlot(0)?.count).toBe(2);
  });
});
