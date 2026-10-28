import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from './registry';
import type { BlockDefinition } from './registry';

// §Block hardness values — verified 1:1 against rujukan Tile.cpp:161-243 (Tile::initItems)
// Each setDestroyTime() call is cited with §File:line.

describe('Block hardness values 1:1 with rujukan (Tile.cpp:161-243)', () => {
  // §Helper: lookup block by legacyId and check hardness
  function checkHardness(key: string, expected: number, citation: string) {
    const def = defaultBlockRegistry.getByKey(key);
    expect(def, `Block ${key} should exist (${citation})`).toBeDefined();
    if (!def) return;
    expect(def.hardness, `${key} hardness should be ${expected} (${citation})`).toBe(expected);
  }

  test('§Tile.cpp:161 — Stone (rock): setDestroyTime(1.5f)', () => {
    checkHardness(1, 1.5, '§Tile.cpp:161');
  });

  test('§Tile.cpp:162 — Grass: setDestroyTime(0.6f)', () => {
    checkHardness(2, 0.6, '§Tile.cpp:162');
  });

  test('§Tile.cpp:163 — Dirt: setDestroyTime(0.5f)', () => {
    checkHardness(3, 0.5, '§Tile.cpp:163');
  });

  test('§Tile.cpp:164 — Stone brick (cobblestone): setDestroyTime(2.0f)', () => {
    checkHardness(4, 2.0, '§Tile.cpp:164');
  });

  test('§Tile.cpp:165 — Wood (oak planks): setDestroyTime(2.0f)', () => {
    checkHardness(5, 2.0, '§Tile.cpp:165');
  });

  test('§Tile.cpp:167 — Bedrock: setDestroyTime(-1) (unbreakable)', () => {
    checkHardness(7, -1, '§Tile.cpp:167');
  });

  test('§Tile.cpp:168 — Water: setDestroyTime(100.0f)', () => {
    // water is in the registry as legacyId 8
    checkHardness(8, 100, '§Tile.cpp:168');
  });

  test('§Tile.cpp:172 — Sand: setDestroyTime(0.5f)', () => {
    checkHardness(12, 0.5, '§Tile.cpp:172');
  });

  test('§Tile.cpp:173 — Gravel: setDestroyTime(0.6f)', () => {
    checkHardness(13, 0.6, '§Tile.cpp:173');
  });

  test('§Tile.cpp:174-176 — Gold/Iron/Coal ore: setDestroyTime(3.0f)', () => {
    checkHardness(14, 3.0, '§Tile.cpp:174');
    checkHardness(15, 3.0, '§Tile.cpp:175');
    checkHardness(16, 3.0, '§Tile.cpp:176');
  });

  test('§Tile.cpp:177 — Tree trunk (oak log): setDestroyTime(2.0f)', () => {
    checkHardness(17, 2.0, '§Tile.cpp:177');
  });

  test('§Tile.cpp:178 — Leaves: setDestroyTime(0.2f)', () => {
    checkHardness(18, 0.2, '§Tile.cpp:178');
  });

  test('§Tile.cpp:180 — Glass: setDestroyTime(0.3f)', () => {
    checkHardness(20, 0.3, '§Tile.cpp:180');
  });

  test('§Tile.cpp:181 — Lapis ore: setDestroyTime(3.0f)', () => {
    checkHardness(21, 3.0, '§Tile.cpp:181');
    // §Note: lapis_block (Tile.cpp:182, setDestroyTime(3.0f)) is NOT registered
    // in defaultBlockRegistry — minecraft.html doesn't use it in its BLOCKS table.
    // Acceptable: registry only includes blocks the game actually uses.
  });

  test('§Tile.cpp:183 — Sandstone: setDestroyTime(0.8f)', () => {
    checkHardness(24, 0.8, '§Tile.cpp:183');
  });

  test('§Tile.cpp:185 — Web: setDestroyTime(4.0f)', () => {
    checkHardness(30, 4.0, '§Tile.cpp:185');
  });

  test('§Tile.cpp:193-194 — Gold/Iron block: setDestroyTime(3.0f / 5.0f)', () => {
    checkHardness(41, 3.0, '§Tile.cpp:193');
    checkHardness(42, 5.0, '§Tile.cpp:194');
  });

  test('§Tile.cpp:195 — Stone slab: setDestroyTime(2.0f)', () => {
    checkHardness(44, 2.0, '§Tile.cpp:195');
  });

  test('§Tile.cpp:197 — Bricks: setDestroyTime(2.0f)', () => {
    checkHardness(45, 2.0, '§Tile.cpp:197');
  });

  test('§Tile.cpp:201 — Obsidian: setDestroyTime(10.0f)', () => {
    checkHardness(49, 10.0, '§Tile.cpp:201');
  });

  test('§Tile.cpp:202 — Torch: setDestroyTime(0.0f)', () => {
    checkHardness(50, 0.0, '§Tile.cpp:202');
  });

  test('§Tile.cpp:207-208 — Diamond ore/block: setDestroyTime(3.0f / 5.0f)', () => {
    checkHardness(56, 3.0, '§Tile.cpp:207');
    checkHardness(57, 5.0, '§Tile.cpp:208');
  });

  test('§Tile.cpp:209 — Workbench (crafting table): setDestroyTime(2.5f)', () => {
    checkHardness(58, 2.5, '§Tile.cpp:209');
  });

  test('§Tile.cpp:211 — Farmland: setDestroyTime(0.6f)', () => {
    checkHardness(60, 0.6, '§Tile.cpp:211');
  });

  test('§Tile.cpp:212-213 — Furnace (lit/unlit): setDestroyTime(3.5f)', () => {
    checkHardness(61, 3.5, '§Tile.cpp:212');
  });

  test('§Tile.cpp:214 — Sign: NOT registered (minecraft.html does not use sign block)', () => {
    // §SignTile (Tile.cpp:214, setDestroyTime(1.0f)) is NOT in defaultBlockRegistry.
    // minecraft.html's BLOCKS table does not include a sign block.
    // If sign is added later, this test should be updated to: checkHardness('minecraft:sign', 1.0, '§Tile.cpp:214');
    const sign = defaultBlockRegistry.getByKey('minecraft:sign');
    expect(sign).toBeUndefined();
  });

  test('§Tile.cpp:216 — Ladder: setDestroyTime(0.4f)', () => {
    checkHardness(65, 0.4, '§Tile.cpp:216');
  });

  test('§Tile.cpp:226 — Top snow (snow layer): setDestroyTime(0.1f)', () => {
    checkHardness(78, 0.1, '§Tile.cpp:226');
  });

  test('§Tile.cpp:227 — Ice: setDestroyTime(0.5f)', () => {
    checkHardness(79, 0.5, '§Tile.cpp:227');
  });

  test('§Tile.cpp:228 — Snow (full block): NOT registered (only snow_layer exists)', () => {
    // §SnowTile (Tile.cpp:228, setDestroyTime(0.2f)) is NOT in defaultBlockRegistry.
    // Only TopSnowTile (snow_layer, Tile.cpp:226, hardness 0.1) is registered.
    // If snow (full block) is added later, this test should verify hardness=0.2.
    const snow = defaultBlockRegistry.getByKey(80);
    expect(snow).toBeUndefined();
    // Verify snow_layer IS registered with correct hardness
    checkHardness(78, 0.1, '§Tile.cpp:226');
  });

  test('§Tile.cpp:229 — Cactus: setDestroyTime(0.4f)', () => {
    checkHardness(81, 0.4, '§Tile.cpp:229');
  });

  test('§Tile.cpp:231 — Reeds (sugar cane): setDestroyTime(0.0f)', () => {
    checkHardness(83, 0.0, '§Tile.cpp:231');
  });

  test('§Tile.cpp:232 — Fence: setDestroyTime(2.0f)', () => {
    checkHardness(85, 2.0, '§Tile.cpp:232');
  });

  test('§Hardness ordering matches rujukan mining difficulty', () => {
    // Easiest → hardest (excluding unbreakable bedrock)
    const dirt = defaultBlockRegistry.getByKey(3)?.hardness ?? 0;
    const sand = defaultBlockRegistry.getByKey(12)?.hardness ?? 0;
    const stone = defaultBlockRegistry.getByKey(1)?.hardness ?? 0;
    const iron = defaultBlockRegistry.getByKey(42)?.hardness ?? 0;
    const obsidian = defaultBlockRegistry.getByKey(49)?.hardness ?? 0;
    expect(dirt).toBeLessThan(stone);
    expect(sand).toBeLessThan(stone);
    expect(stone).toBeLessThan(iron);
    expect(iron).toBeLessThan(obsidian);
  });
});
