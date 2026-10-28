import { describe, expect, test } from 'bun:test';
import { Inventory } from '../world/inventory/inventory';
import { VoxelWorld } from '../world/level/world';
import { createWorldSave, restoreWorldSave } from './world-save';

const metadata = {
  name: 'Persistence Test',
  seed: 564,
  createdAt: '2026-10-12T00:00:00.000Z',
  updatedAt: '2026-10-12T00:01:00.000Z',
  generatorVersion: 1,
};
const player = {
  position: { x: -1.5, y: 4, z: 0.25 },
  yaw: 0.5,
  pitch: -0.2,
};

describe('world save capture and restore', () => {
  test('captures chunks, inventory and player state into a detached save', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 2, chunkSizeZ: 2 });
    world.loadChunk(-1, 0);
    world.setBlock({ x: -2, y: 1, z: 1 }, 3);
    const inventory = new Inventory(3);
    inventory.insert(1, 5);
    const save = createWorldSave(world, inventory, metadata, player);
    expect(save.chunks).toHaveLength(1);
    expect(save.chunks[0].x).toBe(-1);
    expect(save.player.inventory[0]?.count).toBe(5);
    expect(save.player.position).toEqual(player.position);
    expect(Object.isFrozen(save)).toBe(true);
  });

  test('restores world blocks and inventory without aliasing the source world', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 2, chunkSizeZ: 2 });
    world.loadChunk(-1, 0);
    world.setBlock({ x: -2, y: 1, z: 1 }, 3);
    const inventory = new Inventory(2);
    inventory.insert(3, 8);
    const save = createWorldSave(world, inventory, metadata, player);
    const restored = restoreWorldSave(JSON.parse(JSON.stringify(save)));
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.restored.world.getBlock(-2, 1, 1)).toBe(3);
    expect(restored.restored.inventory.getSlot(0)?.count).toBe(8);
    expect(restored.restored.player).toEqual(save.player);
    restored.restored.world.setBlock({ x: -2, y: 1, z: 1 }, 4);
    expect(world.getBlock(-2, 1, 1)).toBe(3);
  });

  test('returns validation errors without partially restoring invalid data', () => {
    const result = restoreWorldSave({ format: 'bad' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.length).toBeGreaterThan(0);
  });

  test('refuses to capture invalid metadata or player state', () => {
    const world = new VoxelWorld({ chunkSizeX: 2, height: 2, chunkSizeZ: 2 });
    world.loadChunk(0, 0);
    expect(() => createWorldSave(world, new Inventory(1), { ...metadata, seed: NaN }, player)).toThrow('Cannot create invalid world save');
    expect(() => createWorldSave(world, new Inventory(1), metadata, { ...player, pitch: 10 })).toThrow('Cannot create invalid world save');
  });
});
