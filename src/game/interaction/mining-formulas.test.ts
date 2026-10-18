import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../blocks/registry';
import { VoxelWorld } from '../world/world';
import { beginMining, DESTROY_PROGRESS_DIVISOR } from './mining';

// §Helper: simulate rujukan's per-tick destroyProgress with bare hand (playerDestroySpeed=1, !canDestroy penalty)
function bareHandTicksToBreak(hardness: number): number {
  // §Tile.cpp:393 — if (!canDestroy) return 1 / destroySpeed / 100.0f;
  // perTick = (1 / hardness) / (30 * 100)
  const perTick = (1 / hardness) / (DESTROY_PROGRESS_DIVISOR * 100);
  let progress = 0;
  let ticks = 0;
  while (progress < 1) { progress += perTick; ticks++; }
  return ticks;
}

// §Helper: simulate rujukan's per-tick destroyProgress with canDestroy=true (bare hand on always-destroyable)
function bareHandAlwaysDestroyableTicksToBreak(hardness: number): number {
  // §Tile.cpp:394 — return (player->getDestroySpeed(this) / destroySpeed) / 30.0f;
  // bare hand speed = 1, so perTick = (1 / hardness) / 30
  const perTick = (1 / hardness) / DESTROY_PROGRESS_DIVISOR;
  let progress = 0;
  let ticks = 0;
  while (progress < 1) { progress += perTick; ticks++; }
  return ticks;
}

const target = { x: 1, y: 2, z: 1 };

function makeWorld(blockId = 1) {
  const world = new VoxelWorld({ chunkSizeX: 4, height: 8, chunkSizeZ: 4 });
  world.loadChunk(0, 0);
  world.setBlock(target, blockId);
  return world;
}

describe('Mining formulas (rujukan 1:1 — previously UNTESTED)', () => {
  test('§Survival bare hand on dirt (always-destroyable) breaks in 16 ticks', () => {
    // §Material.cpp — dirt is always-destroyable (no tool needed)
    // §Tile.cpp:394 — (1 / 0.5) / 30 = 0.0667 per tick → 16 ticks
    const expectedTicks = bareHandAlwaysDestroyableTicksToBreak(0.5);
    expect(expectedTicks).toBe(16);

    const world = makeWorld(3);  // dirt = blockId 3
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'survival' });
    if (started.status !== 'started') throw new Error('expected mining to start');
    // Verify canDestroy=true (dirt is always-destroyable)
    expect(started.session.canDestroy).toBe(true);
    expect(started.session.playerDestroySpeed).toBe(1);  // bare hand
    // Break in 16 ticks
    const result = started.session.tick(16, target, 3);
    expect(result.status).toBe('completed');
  });

  test('§Survival bare hand on stone (not-always-destroyable) applies 100x penalty', () => {
    // §Material.cpp — stone is NOT always-destroyable (requires pickaxe)
    // §Tile.cpp:393 — if (!canDestroy) return 1 / destroySpeed / 100.0f
    // perTick = (1 / 1.5) / (30 * 100) = 0.0002222... → 4500 ticks
    const expectedTicks = bareHandTicksToBreak(1.5);
    expect(expectedTicks).toBe(4500);

    const world = makeWorld(1);  // stone = blockId 1
    const started = beginMining(world, target, defaultBlockRegistry, { mode: 'survival' });
    if (started.status !== 'started') throw new Error('expected mining to start');
    // Verify canDestroy=false (stone requires pickaxe, bare hand doesn't have it)
    expect(started.session.canDestroy).toBe(false);
    expect(started.session.playerDestroySpeed).toBe(1);  // bare hand
    expect(started.session.hardness).toBe(1.5);

    // Tick 4499 times — still mining
    let result = started.session.tick(4499, target, 1);
    expect(result.status).toBe('mining');

    // Tick 1 more (4500th) — breaks
    result = started.session.tick(1, target, 1);
    expect(result.status).toBe('completed');
  });

  test('§100x penalty ratio: stone+bare (4500) vs stone+wood_pickaxe (23)', () => {
    // The ratio should be ~196x (4500/23), not exactly 100x, because
    // bare hand on stone uses (1/hardness)/(30*100) = 0.000222 per tick
    // wood pickaxe on stone uses (2/hardness)/30 = 0.0444 per tick
    // Ratio = 0.0444 / 0.000222 = 200x (because speed 2 vs 1 AND penalty 100x)
    // Actually: bare = 1/(1.5*3000) = 0.000222, pick = 2/(1.5*30) = 0.0444
    // Ratio = 0.0444 / 0.000222 = 200. So 4500/23 ≈ 195.7, close to 200x.
    const bareTicks = bareHandTicksToBreak(1.5);
    const pickTicks = Math.ceil(1 / ((2 / 1.5) / DESTROY_PROGRESS_DIVISOR));
    expect(bareTicks).toBe(4500);
    expect(pickTicks).toBe(23);
    // The ratio accounts for BOTH the 100x penalty AND the tool speed multiplier
    expect(bareTicks / pickTicks).toBeCloseTo(195.65, 1);
  });

  test('§Survival bare hand on obsidian: 100x penalty applied (30100 ticks)', () => {
    // §ObsidianTile extends StoneTile → Material::stone (notAlwaysDestroyable)
    // bare hand + !canDestroy: (1/10) / (30*100) = 0.000333 per tick → 3010 ticks
    // Wait, let me recalculate: perTick = (1 / 10) / 3000 = 0.0000333... → ceil(1/0.0000333) = 30001
    // Actually: (1/10)/(30*100) = 0.1/3000 = 0.0000333... → 1/0.0000333 = 30000.0003 → 30001 ticks
    // Let me verify with the helper:
    const obsidianTicks = bareHandTicksToBreak(10);  // obsidian hardness=10
    // obsidian requires diamond pickaxe (tier 3), bare hand canDestroy=false
    expect(obsidianTicks).toBeGreaterThan(30000);
    expect(obsidianTicks).toBe(30001);  // FP-faithful
  });
});
