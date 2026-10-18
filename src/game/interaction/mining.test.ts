import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { Inventory } from '../inventory/inventory';
import { VoxelWorld } from '../world/world';
import { beginMining, finishBlockBreak, type GameMode } from './mining';
import { getTool } from '../items/tools';

const target = { x: 1, y: 2, z: 1 };

function makeWorld(blockId = 1) {
  const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
  world.loadChunk(0, 0);
  world.setBlock(target, blockId);
  return world;
}

/** Compute the exact tick count needed for a session to break, using the same
 *  per-tick increment as MiningSession.tick() — accounting for FP rounding
 *  the way rujukan C++ would. */

/** Ticks to break with bare hand (1/100 penalty when !canDestroy). */
function ticksToBreakBareHand(hardness: number): number {
  const perTick = (1 / hardness) / (30 * 100);  // rujukan fallback
  let p = 0; let t = 0;
  while (p < 1) { p += perTick; t++; }
  return t;
}

function ticksToBreak(hardness: number, speed = 1): number {
  const perTick = (speed / hardness) / 30;
  let progress = 0;
  let ticks = 0;
  while (progress < 1) { progress += perTick; ticks++; }
  return ticks;
}

describe('block mining', () => {
  test('survival: tracks deterministic progress and refuses early completion', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'survival', tool: getTool('minecraft:wood_pickaxe') });
    expect(started.status).toBe('started');
    if (started.status !== 'started') return;
    expect(started.session.hardness).toBe(1.5);
    expect(started.session.mode).toBe('survival');
    const ticksTotal = ticksToBreak(1.5, 2);
    // Mine 1 tick less than total — still mining
    const progress = started.session.tick(ticksTotal - 1, target, 1);
    expect(progress.status).toBe('mining');
    const inventory = new Inventory(2);
    expect(finishBlockBreak(world, started.session, defaultBlockRegistry, inventory).status).toBe('not-ready');
    expect(world.getBlock(target.x, target.y, target.z)).toBe(1);
  });

  test('survival: breaks only after mining completes and stores the correct drop', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'survival', tool: getTool('minecraft:wood_pickaxe') });
    if (started.status !== 'started') throw new Error('expected mining to start');
    const ticksTotal = ticksToBreak(1.5, 2);
    expect(started.session.tick(ticksTotal, target, 1).status).toBe('completed');
    const inventory = new Inventory(2);
    const result = finishBlockBreak(world, started.session, defaultBlockRegistry, inventory);
    expect(result.status).toBe('broken');
    expect(world.getBlock(target.x, target.y, target.z)).toBe(0);
    expect(inventory.getSlot(0)).toEqual({ itemKey: 'minecraft:cobblestone', count: 1, maxStackSize: 64, auxValue: 0 });
  });

  test('cancels if the player changes target or the block changes', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'survival', tool: getTool('minecraft:wood_pickaxe') });
    if (started.status !== 'started') throw new Error('expected mining to start');
    expect(started.session.tick(1, { x: 2, y: 2, z: 1 }, 1).status).toBe('cancelled');
    expect(started.session.isCancelled).toBe(true);
    expect(finishBlockBreak(world, started.session, defaultBlockRegistry, new Inventory(1)).status).toBe('target-changed');

    const second = beginMining(world, target, defaultBlockRegistry, { mode: 'survival', tool: getTool('minecraft:wood_pickaxe') });
    if (second.status !== 'started') throw new Error('expected second mining to start');
    world.setBlock(target, 3);
    expect(second.session.tick(1, target, world.getBlock(target.x, target.y, target.z)).status).toBe('cancelled');
  });

  test('rejects air, unloaded, unknown and unbreakable blocks', () => {
    const emptyWorld = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
    expect(beginMining(emptyWorld, target, defaultBlockRegistry, { tool: getTool('minecraft:wood_pickaxe') }).status).toBe('unloaded');
    emptyWorld.loadChunk(0, 0);
    expect(beginMining(emptyWorld, target, defaultBlockRegistry, { tool: getTool('minecraft:wood_pickaxe') }).status).toBe('air');
    const bedrock = makeWorld(7);
    expect(beginMining(bedrock, target, defaultBlockRegistry).status).toBe('unbreakable');
    const unknown = makeWorld(999);
    expect(beginMining(unknown, target, defaultBlockRegistry, { tool: getTool('minecraft:wood_pickaxe') }).status).toBe('unknown-block');
  });

  test('survival: returns drops that do not fit instead of losing them', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'survival', tool: getTool('minecraft:wood_pickaxe') });
    if (started.status !== 'started') throw new Error('expected mining to start');
    started.session.tick(ticksToBreak(1.5, 2), target, 1);
    const inventory = new Inventory(1);
    inventory.insert('minecraft:dirt', 64);
    const result = finishBlockBreak(world, started.session, defaultBlockRegistry, inventory);
    expect(result.status).toBe('broken');
    if (result.status !== 'broken') return;
    expect(result.dropsRemaining).toEqual([{ itemKey: 'minecraft:cobblestone', count: 1, maxStackSize: 64 }]);
    expect(inventory.getSlot(0)?.count).toBe(64);
  });

  test('survival: does not break a target changed after mining finished', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'survival', tool: getTool('minecraft:wood_pickaxe') });
    if (started.status !== 'started') throw new Error('expected mining to start');
    started.session.tick(ticksToBreak(1.5, 2), target, 1);
    world.setBlock(target, 3);
    expect(finishBlockBreak(world, started.session, defaultBlockRegistry, new Inventory(1)).status).toBe('target-changed');
    expect(world.getBlock(target.x, target.y, target.z)).toBe(3);
  });

  test('creative: instant break on first tick (rujukan CreativeMode.cpp)', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'creative', tool: getTool('minecraft:wood_pickaxe') });
    if (started.status !== 'started') throw new Error('expected mining to start');
    expect(started.session.mode).toBe('creative');
    // First tick: instant break
    expect(started.session.tick(1, target, 1).status).toBe('completed');
    expect(started.session.isComplete).toBe(true);
  });

  test('creative: bedrock still unbreakable (beginMining rejects before session)', () => {
    const world = makeWorld(7);
    expect(beginMining(world, target, defaultBlockRegistry, { mode: 'creative', tool: getTool('minecraft:wood_pickaxe') }).status).toBe('unbreakable');
  });

  test('game mode default is creative (matches MCPE 2013 default for new worlds in browser)', () => {
    const world = makeWorld();
    const started = beginMining(world, target, defaultBlockRegistry, { tool: getTool('minecraft:wood_pickaxe') });
    if (started.status !== 'started') throw new Error('expected mining to start');
    expect(started.session.mode).toBe('creative');
  });
});
