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
    checkHardness('minecraft:stone', 1.5, '§Tile.cpp:161');
  });

  test('§Tile.cpp:162 — Grass: setDestroyTime(0.6f)', () => {
    checkHardness('minecraft:grass_block', 0.6, '§Tile.cpp:162');
  });

  test('§Tile.cpp:163 — Dirt: setDestroyTime(0.5f)', () => {
    checkHardness('minecraft:dirt', 0.5, '§Tile.cpp:163');
  });

  test('§Tile.cpp:164 — Stone brick (cobblestone): setDestroyTime(2.0f)', () => {
    checkHardness('minecraft:cobblestone', 2.0, '§Tile.cpp:164');
  });

  test('§Tile.cpp:165 — Wood (oak planks): setDestroyTime(2.0f)', () => {
    checkHardness('minecraft:oak_planks', 2.0, '§Tile.cpp:165');
  });

  test('§Tile.cpp:167 — Bedrock: setDestroyTime(-1) (unbreakable)', () => {
    checkHardness('minecraft:bedrock', -1, '§Tile.cpp:167');
  });

  test('§Tile.cpp:168 — Water: setDestroyTime(100.0f)', () => {
    // water is in the registry as legacyId 8
    checkHardness('minecraft:water', 100, '§Tile.cpp:168');
  });

  test('§Tile.cpp:172 — Sand: setDestroyTime(0.5f)', () => {
    checkHardness('minecraft:sand', 0.5, '§Tile.cpp:172');
  });

  test('§Tile.cpp:173 — Gravel: setDestroyTime(0.6f)', () => {
    checkHardness('minecraft:gravel', 0.6, '§Tile.cpp:173');
  });

  test('§Tile.cpp:174-176 — Gold/Iron/Coal ore: setDestroyTime(3.0f)', () => {
    checkHardness('minecraft:gold_ore', 3.0, '§Tile.cpp:174');
    checkHardness('minecraft:iron_ore', 3.0, '§Tile.cpp:175');
    checkHardness('minecraft:coal_ore', 3.0, '§Tile.cpp:176');
  });

  test('§Tile.cpp:177 — Tree trunk (oak log): setDestroyTime(2.0f)', () => {
    checkHardness('minecraft:oak_log', 2.0, '§Tile.cpp:177');
  });

  test('§Tile.cpp:178 — Leaves: setDestroyTime(0.2f)', () => {
    checkHardness('minecraft:oak_leaves', 0.2, '§Tile.cpp:178');
  });

  test('§Tile.cpp:180 — Glass: setDestroyTime(0.3f)', () => {
    checkHardness('minecraft:glass', 0.3, '§Tile.cpp:180');
  });

  test('§Tile.cpp:181 — Lapis ore: setDestroyTime(3.0f)', () => {
    checkHardness('minecraft:lapis_ore', 3.0, '§Tile.cpp:181');
    // §Note: lapis_block (Tile.cpp:182, setDestroyTime(3.0f)) is NOT registered
    // in defaultBlockRegistry — minecraft.html doesn't use it in its BLOCKS table.
    // Acceptable: registry only includes blocks the game actually uses.
  });

  test('§Tile.cpp:183 — Sandstone: setDestroyTime(0.8f)', () => {
    checkHardness('minecraft:sandstone', 0.8, '§Tile.cpp:183');
  });

  test('§Tile.cpp:185 — Web: setDestroyTime(4.0f)', () => {
    checkHardness('minecraft:web', 4.0, '§Tile.cpp:185');
  });

  test('§Tile.cpp:193-194 — Gold/Iron block: setDestroyTime(3.0f / 5.0f)', () => {
    checkHardness('minecraft:gold_block', 3.0, '§Tile.cpp:193');
    checkHardness('minecraft:iron_block', 5.0, '§Tile.cpp:194');
  });

  test('§Tile.cpp:195 — Stone slab: setDestroyTime(2.0f)', () => {
    checkHardness('minecraft:stone_slab', 2.0, '§Tile.cpp:195');
  });

  test('§Tile.cpp:197 — Bricks: setDestroyTime(2.0f)', () => {
    checkHardness('minecraft:bricks', 2.0, '§Tile.cpp:197');
  });

  test('§Tile.cpp:201 — Obsidian: setDestroyTime(10.0f)', () => {
    checkHardness('minecraft:obsidian', 10.0, '§Tile.cpp:201');
  });

  test('§Tile.cpp:202 — Torch: setDestroyTime(0.0f)', () => {
    checkHardness('minecraft:torch', 0.0, '§Tile.cpp:202');
  });

  test('§Tile.cpp:207-208 — Diamond ore/block: setDestroyTime(3.0f / 5.0f)', () => {
    checkHardness('minecraft:diamond_ore', 3.0, '§Tile.cpp:207');
    checkHardness('minecraft:diamond_block', 5.0, '§Tile.cpp:208');
  });

  test('§Tile.cpp:209 — Workbench (crafting table): setDestroyTime(2.5f)', () => {
    checkHardness('minecraft:crafting_table', 2.5, '§Tile.cpp:209');
  });

  test('§Tile.cpp:211 — Farmland: setDestroyTime(0.6f)', () => {
    checkHardness('minecraft:farmland', 0.6, '§Tile.cpp:211');
  });

  test('§Tile.cpp:212-213 — Furnace (lit/unlit): setDestroyTime(3.5f)', () => {
    checkHardness('minecraft:furnace', 3.5, '§Tile.cpp:212');
  });

  test('§Tile.cpp:214 — Sign: NOT registered (minecraft.html does not use sign block)', () => {
    // §SignTile (Tile.cpp:214, setDestroyTime(1.0f)) is NOT in defaultBlockRegistry.
    // minecraft.html's BLOCKS table does not include a sign block.
    // If sign is added later, this test should be updated to: checkHardness('minecraft:sign', 1.0, '§Tile.cpp:214');
    const sign = defaultBlockRegistry.getByKey('minecraft:sign');
    expect(sign).toBeUndefined();
  });

  test('§Tile.cpp:216 — Ladder: setDestroyTime(0.4f)', () => {
    checkHardness('minecraft:ladder', 0.4, '§Tile.cpp:216');
  });

  test('§Tile.cpp:226 — Top snow (snow layer): setDestroyTime(0.1f)', () => {
    checkHardness('minecraft:snow_layer', 0.1, '§Tile.cpp:226');
  });

  test('§Tile.cpp:227 — Ice: setDestroyTime(0.5f)', () => {
    checkHardness('minecraft:ice', 0.5, '§Tile.cpp:227');
  });

  test('§Tile.cpp:228 — Snow (full block): NOT registered (only snow_layer exists)', () => {
    // §SnowTile (Tile.cpp:228, setDestroyTime(0.2f)) is NOT in defaultBlockRegistry.
    // Only TopSnowTile (snow_layer, Tile.cpp:226, hardness 0.1) is registered.
    // If snow (full block) is added later, this test should verify hardness=0.2.
    const snow = defaultBlockRegistry.getByKey('minecraft:snow');
    expect(snow).toBeUndefined();
    // Verify snow_layer IS registered with correct hardness
    checkHardness('minecraft:snow_layer', 0.1, '§Tile.cpp:226');
  });

  test('§Tile.cpp:229 — Cactus: setDestroyTime(0.4f)', () => {
    checkHardness('minecraft:cactus', 0.4, '§Tile.cpp:229');
  });

  test('§Tile.cpp:231 — Reeds (sugar cane): setDestroyTime(0.0f)', () => {
    checkHardness('minecraft:reeds', 0.0, '§Tile.cpp:231');
  });

  test('§Tile.cpp:232 — Fence: setDestroyTime(2.0f)', () => {
    checkHardness('minecraft:oak_fence', 2.0, '§Tile.cpp:232');
  });

  test('§Hardness ordering matches rujukan mining difficulty', () => {
    // Easiest → hardest (excluding unbreakable bedrock)
    const dirt = defaultBlockRegistry.getByKey('minecraft:dirt')?.hardness ?? 0;
    const sand = defaultBlockRegistry.getByKey('minecraft:sand')?.hardness ?? 0;
    const stone = defaultBlockRegistry.getByKey('minecraft:stone')?.hardness ?? 0;
    const iron = defaultBlockRegistry.getByKey('minecraft:iron_block')?.hardness ?? 0;
    const obsidian = defaultBlockRegistry.getByKey('minecraft:obsidian')?.hardness ?? 0;
    expect(dirt).toBeLessThan(stone);
    expect(sand).toBeLessThan(stone);
    expect(stone).toBeLessThan(iron);
    expect(iron).toBeLessThan(obsidian);
  });
});
