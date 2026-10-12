import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { Inventory } from '../inventory/inventory';
import { Aabb } from '../physics/aabb';
import { VoxelWorld } from '../world/world';
import { BlockInteractionController } from './controller';
import type { VoxelRayHit } from './raycast';

function setup() {
  const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
  world.loadChunk(0, 0);
  world.setBlock({ x: 1, y: 1, z: 1 }, 1);
  const inventory = new Inventory(4);
  const controller = new BlockInteractionController(world, defaultBlockRegistry, inventory);
  const hit: VoxelRayHit = {
    status: 'hit',
    blockId: 1,
    block: { x: 1, y: 1, z: 1 },
    face: { x: -1, y: 0, z: 0 },
    distance: 0.5,
  };
  return { world, inventory, controller, hit };
}

describe('BlockInteractionController', () => {
  test('targets selectable blocks using registry rules and stops at unloaded chunks', () => {
    const { controller } = setup();
    expect(controller.target({ x: 0.5, y: 1.5, z: 1.5 }, { x: 1, y: 0, z: 0 }, 5).status).toBe('hit');
    expect(controller.target({ x: 3.5, y: 1.5, z: 1.5 }, { x: 1, y: 0, z: 0 }, 5).status).toBe('unloaded');
  });

  test('mines only while the same target remains selected, then awards drops', () => {
    const { world, inventory, controller, hit } = setup();
    expect(controller.startMining(hit).status).toBe('started');
    const half = controller.tickMining(0.75, hit);
    expect(half.status).toBe('mining');
    if (half.status === 'mining') expect(half.progress).toBeCloseTo(0.5);
    expect(controller.tickMining(0.75, hit).status).toBe('completed');
    expect(world.getBlock(1, 1, 1)).toBe(0);
    expect(inventory.getSlot(0)?.itemKey).toBe('minecraft:cobblestone');
    expect(controller.isMining).toBe(false);
  });

  test('cancels when target changes or action is released', () => {
    const { controller, hit } = setup();
    controller.startMining(hit);
    const other: VoxelRayHit = { ...hit, block: { x: 2, y: 1, z: 1 } };
    expect(controller.tickMining(0.1, other).status).toBe('cancelled');
    expect(controller.startMining(hit).status).toBe('started');
    expect(controller.cancelMining()).toBe(true);
    expect(controller.cancelMining()).toBe(false);
  });

  test('places from the selected inventory slot through the same world transaction', () => {
    const { world, inventory, controller, hit } = setup();
    inventory.setSlot(0, { itemKey: 'minecraft:cobblestone', count: 2, maxStackSize: 64 });
    const result = controller.place(hit, 0, new Aabb(2.5, 1, 2.5, 3.1, 2.8, 3.1));
    expect(result.status).toBe('placed');
    expect(world.getBlock(0, 1, 1)).toBe(4);
    expect(inventory.getSlot(0)?.count).toBe(1);
  });

  test('does not place a solid block into the player bounds', () => {
    const { inventory, controller, hit } = setup();
    inventory.setSlot(0, { itemKey: 'minecraft:cobblestone', count: 1, maxStackSize: 64 });
    const result = controller.place(hit, 0, new Aabb(0, 1, 1, 1, 2, 2));
    expect(result.status).toBe('blocked-by-player');
    expect(inventory.getSlot(0)?.count).toBe(1);
  });
});
