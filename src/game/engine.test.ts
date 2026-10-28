import { describe, expect, test } from 'bun:test';
import { VoxelCraftEngine } from './engine';
import { CREATIVE_DESTRUCTION_TICK_DELAY, DESTROY_PROGRESS_DIVISOR } from './client/interaction/mining';
import { getTool } from './world/item/tools';

function ticksToBreak(hardness: number, speed = 1): number {
  const perTick = (speed / hardness) / 30;
  let progress = 0;
  let ticks = 0;
  while (progress < 1) { progress += perTick; ticks++; }
  return ticks;
}

function makeGroundedEngine(mode: 'survival' | 'creative' = 'survival'): VoxelCraftEngine {
  const engine = new VoxelCraftEngine({
    dimensions: { chunkSizeX: 4, height: 8, chunkSizeZ: 4 },
    spawn: { x: 1.5, y: 1, z: 1.5 },
    inventorySlots: 9,
    gameMode: mode,
    // §Tests use wood_pickaxe so stone mining works (matches browser hotbar slot)
    tool: getTool(270),
  });
  engine.loadChunk(0, 0);
  for (let x = 0; x < 4; x += 1) {
    for (let z = 0; z < 4; z += 1) engine.world.setBlock({ x, y: 0, z }, 1);
  }
  return engine;
}

describe('VoxelCraftEngine composition root', () => {
  test('steps player movement through fixed-step clock against authoritative world collision', () => {
    const engine = makeGroundedEngine();
    const result = engine.step(1 / 30, { moveX: 0, moveZ: 0, jump: false });
    expect(result.clock.steps).toBe(2);
    expect(result.player.onGround).toBe(true);
    expect(result.player.position.y).toBeCloseTo(1);
  });

  test('targets selectable blocks and stops at unloaded chunk boundaries', () => {
    const engine = makeGroundedEngine();
    engine.world.setBlock({ x: 3, y: 1, z: 1 }, 1);
    const hit = engine.target({ x: 1.5, y: 1.5, z: 1.5 }, { x: 1, y: 0, z: 0 }, 6);
    expect(hit.status).toBe('hit');
    if (hit.status === 'hit') {
      expect(hit.block).toEqual({ x: 3, y: 1, z: 1 });
      expect(hit.face).toEqual({ x: -1, y: 0, z: 0 });
    }

    engine.world.setBlock({ x: 3, y: 1, z: 1 }, 0);
    const unloaded = engine.target({ x: 3.5, y: 1.5, z: 1.5 }, { x: 1, y: 0, z: 0 }, 2);
    expect(unloaded.status).toBe('unloaded');
  });

  test('survival: rujukan per-tick destroyProgress — stone with wood pickaxe breaks in 23 ticks', () => {
    const engine = makeGroundedEngine('survival');
    engine.world.setBlock({ x: 2, y: 1, z: 1 }, 1);
    const start = engine.startMining({ x: 2, y: 1, z: 1 });
    expect(start.status).toBe('started');
    // §Tile::getDestroyProgress formula: (2/1.5)/30 = 0.0444... per tick (wood pickaxe speed=2)
    // Exact ticks to break (FP-faithful, matches rujukan C++ behavior)
    const expectedTicks = ticksToBreak(1.5, 2);
    expect(expectedTicks).toBe(23);
    // expectedTicks-1 ticks: still mining
    let result = engine.tickMining(expectedTicks - 1, { x: 2, y: 1, z: 1 });
    expect(result.status).toBe('mining');
    // last tick: broken
    result = engine.tickMining(1, { x: 2, y: 1, z: 1 });
    expect(result.status).toBe('broken');
    expect(engine.world.getBlock(2, 1, 1)).toBe(0);
    expect(engine.inventory.snapshot().some(stack => stack?.id === 4)).toBe(true);
  });

  test('creative: instant break first tick (rujukan CreativeMode)', () => {
    const engine = makeGroundedEngine('creative');
    engine.world.setBlock({ x: 2, y: 1, z: 1 }, 1);
    const start = engine.startMining({ x: 2, y: 1, z: 1 });
    expect(start.status).toBe('started');
    const result = engine.tickMining(1, { x: 2, y: 1, z: 1 });
    expect(result.status).toBe('broken');
    expect(engine.world.getBlock(2, 1, 1)).toBe(0);
    expect(CREATIVE_DESTRUCTION_TICK_DELAY).toBe(10);
  });

  test('cancels mining if the target changes before completion', () => {
    const engine = makeGroundedEngine('survival');
    engine.world.setBlock({ x: 2, y: 1, z: 1 }, 1);
    expect(engine.startMining({ x: 2, y: 1, z: 1 }).status).toBe('started');
    const result = engine.tickMining(1, { x: 1, y: 1, z: 1 });
    expect(result.status).toBe('cancelled');
    expect(engine.world.getBlock(2, 1, 1)).toBe(1);
  });

  test('explicitly cancels an active mining session on input release', () => {
    const engine = makeGroundedEngine('survival');
    engine.world.setBlock({ x: 2, y: 1, z: 1 }, 1);
    expect(engine.startMining({ x: 2, y: 1, z: 1 }).status).toBe('started');
    expect(engine.cancelMining()).toBe(true);
    expect(engine.tickMining(1, { x: 2, y: 1, z: 1 }).status).toBe('no-session');
    expect(engine.world.getBlock(2, 1, 1)).toBe(1);
    expect(engine.cancelMining()).toBe(false);
  });

  test('captures world, inventory and player pose in a validated versioned save', () => {
    const engine = makeGroundedEngine();
    engine.inventory.insert(5, 12);
    const save = engine.createSave({
      name: 'Test World',
      seed: 564,
      createdAt: '2026-10-12T00:00:00.000Z',
      updatedAt: '2026-10-12T00:00:00.000Z',
      generatorVersion: 1,
    }, { yaw: 1.25, pitch: -0.2 });

    expect(save.format).toBe('voxelcraft-world');
    expect(save.schemaVersion).toBe(1);
    expect(save.chunks).toHaveLength(1);
    expect(save.player.position).toEqual(engine.player.state.position);
    expect(save.player.yaw).toBe(1.25);
    expect(save.player.pitch).toBe(-0.2);
    expect(save.player.inventory.some(stack => stack?.id === 5 && stack.count === 12)).toBe(true);

    engine.world.setBlock({ x: 1, y: 1, z: 1 }, 1);
    expect(save.chunks[0].blocks[1 + 4 * (1 + 4 * 1)]).toBe(0);
  });

  test('restores saved chunks, inventory and camera pose into a fresh engine', () => {
    const source = makeGroundedEngine();
    source.inventory.insert(5, 12);
    const save = source.createSave({
      name: 'Round Trip',
      seed: 42,
      createdAt: '2026-10-12T00:00:00.000Z',
      updatedAt: '2026-10-12T00:00:00.000Z',
      generatorVersion: 1,
    }, { yaw: 0.75, pitch: 0.1 });

    const restored = VoxelCraftEngine.fromSave(save);
    expect(restored.ok).toBe(true);
    if (!restored.ok) return;
    expect(restored.engine.inventory.snapshot().some(stack => stack?.id === 5 && stack.count === 12)).toBe(true);
    expect(restored.view.yaw).toBe(0.75);
    expect(restored.view.pitch).toBe(0.1);
  });
});
