import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { Inventory } from '../inventory/inventory';
import { VoxelWorld } from '../world/world';
import { beginMining, finishBlockBreak } from './mining';

const target = { x: 1, y: 2, z: 1 };

function makeWorld(blockId = 1) {
  const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
  world.loadChunk(0, 0);
  world.setBlock(target, blockId);
  return world;
}

describe('block mining', () => {
  test('tracks deterministic progress and refuses early completion', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry);
    expect(started.status).toBe('started');
    if (started.status !== 'started') return;
    expect(started.session.totalSeconds).toBe(1.5);
    const progress = started.session.advance(0.75, target, 1);
    expect(progress.status).toBe('mining');
    if (progress.status === 'mining') expect(progress.progress).toBeCloseTo(0.5);
    const inventory = new Inventory(2);
    expect(finishBlockBreak(world, started.session, defaultBlockRegistry, inventory).status).toBe('not-ready');
    expect(world.getBlock(target.x, target.y, target.z)).toBe(1);
  });

  test('breaks only after mining completes and stores the correct drop', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry);
    if (started.status !== 'started') throw new Error('expected mining to start');
    expect(started.session.advance(1.5, target, 1).status).toBe('completed');
    const inventory = new Inventory(2);
    const result = finishBlockBreak(world, started.session, defaultBlockRegistry, inventory);
    expect(result.status).toBe('broken');
    expect(world.getBlock(target.x, target.y, target.z)).toBe(0);
    expect(inventory.getSlot(0)).toEqual({ itemKey: 'minecraft:cobblestone', count: 1, maxStackSize: 64 });
  });

  test('cancels if the player changes target or the block changes', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry);
    if (started.status !== 'started') throw new Error('expected mining to start');
    expect(started.session.advance(0.2, { x: 2, y: 2, z: 1 }, 1).status).toBe('cancelled');
    expect(started.session.isCancelled).toBe(true);
    expect(finishBlockBreak(world, started.session, defaultBlockRegistry, new Inventory(1)).status).toBe('target-changed');

    const second = beginMining(world, target, defaultBlockRegistry);
    if (second.status !== 'started') throw new Error('expected second mining to start');
    world.setBlock(target, 3);
    expect(second.session.advance(0.2, target, world.getBlock(target.x, target.y, target.z)).status).toBe('cancelled');
  });

  test('rejects air, unloaded, unknown and unbreakable blocks', () => {
    const emptyWorld = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
    expect(beginMining(emptyWorld, target, defaultBlockRegistry).status).toBe('unloaded');
    emptyWorld.loadChunk(0, 0);
    expect(beginMining(emptyWorld, target, defaultBlockRegistry).status).toBe('air');
    const bedrock = makeWorld(7);
    expect(beginMining(bedrock, target, defaultBlockRegistry).status).toBe('unbreakable');
    const unknown = makeWorld(999);
    expect(beginMining(unknown, target, defaultBlockRegistry).status).toBe('unknown-block');
  });

  test('returns drops that do not fit instead of losing them', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry);
    if (started.status !== 'started') throw new Error('expected mining to start');
    started.session.advance(1.5, target, 1);
    const inventory = new Inventory(1);
    inventory.insert('minecraft:dirt', 64);
    const result = finishBlockBreak(world, started.session, defaultBlockRegistry, inventory);
    expect(result.status).toBe('broken');
    if (result.status !== 'broken') return;
    expect(result.dropsRemaining).toEqual([{ itemKey: 'minecraft:cobblestone', count: 1, maxStackSize: 64 }]);
    expect(inventory.getSlot(0)?.count).toBe(64);
  });

  test('does not break a target changed after mining finished', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry);
    if (started.status !== 'started') throw new Error('expected mining to start');
    started.session.advance(1.5, target, 1);
    world.setBlock(target, 3);
    expect(finishBlockBreak(world, started.session, defaultBlockRegistry, new Inventory(1)).status).toBe('target-changed');
    expect(world.getBlock(target.x, target.y, target.z)).toBe(3);
  });
});
