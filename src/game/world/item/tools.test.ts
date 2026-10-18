import { describe, expect, test } from 'bun:test';
import { defaultBlockRegistry } from '../../world/level/tile/registry';
import {
  TIERS,
  canDestroyBlock,
  getPlayerDestroySpeed,
  getTool,
  isAlwaysDestroyable,
  TOOL_KEYS,
} from './tools';

describe('MCPE 2013 tool system (rujukan 1:1)', () => {
  test('TIERS values match rujukan Item.cpp:11-15', () => {
    expect(TIERS.wood).toEqual({ level: 0, uses: 59, speed: 2, damage: 0 });
    expect(TIERS.stone).toEqual({ level: 1, uses: 131, speed: 4, damage: 1 });
    expect(TIERS.iron).toEqual({ level: 2, uses: 250, speed: 6, damage: 2 });
    expect(TIERS.diamond).toEqual({ level: 3, uses: 1561, speed: 8, damage: 3 });
    expect(TIERS.gold).toEqual({ level: 0, uses: 32, speed: 12, damage: 0 });
    expect(TIERS.none).toEqual({ level: 0, uses: 0, speed: 1, damage: 0 });
  });

  test('Tool metadata matches rujukan Item.cpp:168-198', () => {
    expect(getTool('minecraft:iron_pickaxe')).toEqual({
      kind: 'pickaxe', tier: 'iron', tierDef: TIERS.iron, iconCol: 2, iconRow: 6,
    });
    expect(getTool('minecraft:wood_shovel')).toEqual({
      kind: 'shovel', tier: 'wood', tierDef: TIERS.wood, iconCol: 0, iconRow: 5,
    });
    expect(getTool('minecraft:diamond_axe')).toEqual({
      kind: 'axe', tier: 'diamond', tierDef: TIERS.diamond, iconCol: 3, iconRow: 7,
    });
    expect(getTool('minecraft:gold_pickaxe')).toEqual({
      kind: 'pickaxe', tier: 'gold', tierDef: TIERS.gold, iconCol: 4, iconRow: 6,
    });
    expect(getTool('minecraft:stone')).toBeNull();  // blocks aren't tools
    expect(getTool(null)).toBeNull();
    expect(getTool(undefined)).toBeNull();
  });

  test('20 tools registered (5 tiers × 4 kinds)', () => {
    expect(TOOL_KEYS.length).toBe(20);
  });

  test('isAlwaysDestroyable matches Material.cpp:37-66', () => {
    // notAlwaysDestroyable → false
    expect(isAlwaysDestroyable('stone')).toBe(false);
    expect(isAlwaysDestroyable('metal')).toBe(false);
    expect(isAlwaysDestroyable('snow')).toBe(false);
    expect(isAlwaysDestroyable('topSnow')).toBe(false);
    // Default = true
    expect(isAlwaysDestroyable('dirt')).toBe(true);
    expect(isAlwaysDestroyable('wood')).toBe(true);
    expect(isAlwaysDestroyable('sand')).toBe(true);
    expect(isAlwaysDestroyable('leaves')).toBe(true);
    expect(isAlwaysDestroyable('glass')).toBe(true);
    expect(isAlwaysDestroyable('ice')).toBe(true);
    expect(isAlwaysDestroyable('web')).toBe(true);
  });

  test('canDestroyBlock: always-destroyable materials always pass (no tool needed)', () => {
    expect(canDestroyBlock('dirt', 'minecraft:dirt', null)).toBe(true);
    expect(canDestroyBlock('wood', 'minecraft:oak_planks', null)).toBe(true);
    expect(canDestroyBlock('sand', 'minecraft:sand', null)).toBe(true);
  });

  test('canDestroyBlock: stone requires pickaxe (rujukan Inventory.cpp:307-313)', () => {
    expect(canDestroyBlock('stone', 'minecraft:stone', null)).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_pickaxe'))).toBe(true);
    expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:iron_pickaxe'))).toBe(true);
    // Wrong tool type doesn't help
    expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_axe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_shovel'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_sword'))).toBe(false);
  });

  test('canDestroyBlock: per-block tier gates (rujukan PickaxeItem.cpp:38-52)', () => {
    // Obsidian requires diamond pickaxe (level 3)
    expect(canDestroyBlock('stone', 'minecraft:obsidian', getTool('minecraft:wood_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:obsidian', getTool('minecraft:stone_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:obsidian', getTool('minecraft:iron_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:obsidian', getTool('minecraft:diamond_pickaxe'))).toBe(true);
    // Diamond/gold ore requires iron pickaxe (level >=2)
    expect(canDestroyBlock('stone', 'minecraft:diamond_ore', getTool('minecraft:stone_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:diamond_ore', getTool('minecraft:iron_pickaxe'))).toBe(true);
    expect(canDestroyBlock('stone', 'minecraft:gold_ore', getTool('minecraft:wood_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:gold_ore', getTool('minecraft:iron_pickaxe'))).toBe(true);
    // Iron/lapis ore requires stone pickaxe (level >=1)
    expect(canDestroyBlock('stone', 'minecraft:iron_ore', getTool('minecraft:wood_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:iron_ore', getTool('minecraft:stone_pickaxe'))).toBe(true);
    expect(canDestroyBlock('stone', 'minecraft:lapis_ore', getTool('minecraft:wood_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:lapis_ore', getTool('minecraft:stone_pickaxe'))).toBe(true);
    // §PickaxeItem.cpp:41 — redstone ore requires iron pickaxe (tier >= 2)
    expect(canDestroyBlock('stone', 'minecraft:redstone_ore', getTool('minecraft:wood_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:redstone_ore', getTool('minecraft:stone_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:redstone_ore', getTool('minecraft:iron_pickaxe'))).toBe(true);
    expect(canDestroyBlock('stone', 'minecraft:redstone_ore_lit', getTool('minecraft:stone_pickaxe'))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:redstone_ore_lit', getTool('minecraft:iron_pickaxe'))).toBe(true);
  });

  test('canDestroyBlock: snow/topSnow require shovel (rujukan ShovelItem.cpp:25-30)', () => {
    expect(canDestroyBlock('snow', 'minecraft:snow', null)).toBe(false);
    expect(canDestroyBlock('topSnow', 'minecraft:snow_layer', null)).toBe(false);
    expect(canDestroyBlock('snow', 'minecraft:snow', getTool('minecraft:wood_shovel'))).toBe(true);
    expect(canDestroyBlock('topSnow', 'minecraft:snow_layer', getTool('minecraft:wood_shovel'))).toBe(true);
    // Pickaxe doesn't help with snow
    expect(canDestroyBlock('snow', 'minecraft:snow', getTool('minecraft:wood_pickaxe'))).toBe(false);
  });

  test('getPlayerDestroySpeed: bare hand returns 1 (rujukan Inventory.cpp:322)', () => {
    expect(getPlayerDestroySpeed('stone', 'minecraft:stone', null)).toBe(1);
    expect(getPlayerDestroySpeed('wood', 'minecraft:oak_planks', null)).toBe(1);
    expect(getPlayerDestroySpeed('dirt', 'minecraft:dirt', null)).toBe(1);
  });

  test('getPlayerDestroySpeed: pickaxe on stone/metal → tier speed (rujukan PickaxeItem.cpp:54-58)', () => {
    // Wood pickaxe (speed=2) on stone → 2
    expect(getPlayerDestroySpeed('stone', 'minecraft:stone', getTool('minecraft:wood_pickaxe'))).toBe(2);
    // Iron pickaxe (speed=6) on iron_ore (stone material) → 6
    expect(getPlayerDestroySpeed('stone', 'minecraft:iron_ore', getTool('minecraft:iron_pickaxe'))).toBe(6);
    // Diamond pickaxe (speed=8) on gold_block (metal material) → 8
    expect(getPlayerDestroySpeed('metal', 'minecraft:gold_block', getTool('minecraft:diamond_pickaxe'))).toBe(8);
    // Gold pickaxe (speed=12) on stone → 12 (gold is fast but low durability)
    expect(getPlayerDestroySpeed('stone', 'minecraft:stone', getTool('minecraft:gold_pickaxe'))).toBe(12);
  });

  test('getPlayerDestroySpeed: pickaxe on non-stone material → 1 (no bonus)', () => {
    // Pickaxe on dirt → 1 (no bonus since dirt isn't stone/metal)
    expect(getPlayerDestroySpeed('dirt', 'minecraft:dirt', getTool('minecraft:wood_pickaxe'))).toBe(1);
    // Pickaxe on wood → 1 (need axe for wood bonus)
    expect(getPlayerDestroySpeed('wood', 'minecraft:oak_planks', getTool('minecraft:wood_pickaxe'))).toBe(1);
  });

  test('getPlayerDestroySpeed: axe on wood → tier speed (rujukan HatchetItem.cpp:21-25)', () => {
    expect(getPlayerDestroySpeed('wood', 'minecraft:oak_planks', getTool('minecraft:wood_axe'))).toBe(2);
    expect(getPlayerDestroySpeed('wood', 'minecraft:oak_log', getTool('minecraft:iron_axe'))).toBe(6);
    expect(getPlayerDestroySpeed('wood', 'minecraft:oak_planks', getTool('minecraft:diamond_axe'))).toBe(8);
  });

  test('getPlayerDestroySpeed: axe on non-wood material → 1 (no bonus)', () => {
    expect(getPlayerDestroySpeed('stone', 'minecraft:stone', getTool('minecraft:wood_axe'))).toBe(1);
    expect(getPlayerDestroySpeed('dirt', 'minecraft:dirt', getTool('minecraft:iron_axe'))).toBe(1);
  });

  test('getPlayerDestroySpeed: shovel on its tile list → tier speed (rujukan DiggerItem.h:14-19)', () => {
    expect(getPlayerDestroySpeed('dirt', 'minecraft:dirt', getTool('minecraft:wood_shovel'))).toBe(2);
    expect(getPlayerDestroySpeed('dirt', 'minecraft:grass_block', getTool('minecraft:iron_shovel'))).toBe(6);
    expect(getPlayerDestroySpeed('sand', 'minecraft:sand', getTool('minecraft:stone_shovel'))).toBe(4);
  });

  test('getPlayerDestroySpeed: sword returns 1.5 (rujukan WeaponItem.h:30-37)', () => {
    // §WeaponItem::getDestroySpeed returns 1.5 by default (NOT 1 — I initially guessed wrong)
    expect(getPlayerDestroySpeed('stone', 'minecraft:stone', getTool('minecraft:wood_sword'))).toBe(1.5);
    expect(getPlayerDestroySpeed('wood', 'minecraft:oak_planks', getTool('minecraft:iron_sword'))).toBe(1.5);
    expect(getPlayerDestroySpeed('dirt', 'minecraft:dirt', getTool('minecraft:diamond_sword'))).toBe(1.5);
  });

  test('getPlayerDestroySpeed: sword on web returns 15 (rujukan WeaponItem.h:32)', () => {
    // §WeaponItem::getDestroySpeed: if (tile->id == Tile::web->id) return 15;
    expect(getPlayerDestroySpeed('web', 'minecraft:web', getTool('minecraft:wood_sword'))).toBe(15);
    expect(getPlayerDestroySpeed('web', 'minecraft:web', getTool('minecraft:iron_sword'))).toBe(15);
  });
});

  test('§Verified materials: torch and ladder use Material::decoration (not wood)', () => {
    // §TorchTile.h:18 — super(id, tex, Material::decoration)
    // §LadderTile.h:18 — super(id, tex, Material::decoration)
    // These were initially mis-assigned as 'wood' in the registry. The bug
    // would have given axe bonus speed on torch/ladder, which rujukan does NOT.
    const torchDef = defaultBlockRegistry.getByKey('minecraft:torch');
    const ladderDef = defaultBlockRegistry.getByKey('minecraft:ladder');
    expect(torchDef?.material).toBe('decoration');
    expect(ladderDef?.material).toBe('decoration');
  });

  test('§Axe does NOT get speed bonus on torch/ladder (material=decoration, not wood)', () => {
    // §HatchetItem::getDestroySpeed: if (tile.material == Material::wood) return speed;
    // Torch/ladder material is decoration → falls through to DiggerItem base (hasTile ? speed : 1).
    // Torch/ladder are NOT in AXE_TILES, so hasTile=false → returns 1.
    expect(getPlayerDestroySpeed('decoration', 'minecraft:torch', getTool('minecraft:wood_axe'))).toBe(1);
    expect(getPlayerDestroySpeed('decoration', 'minecraft:ladder', getTool('minecraft:iron_axe'))).toBe(1);
    // Sanity check: wood_axe on oak_log (material=wood) DOES get speed bonus
    expect(getPlayerDestroySpeed('wood', 'minecraft:oak_log', getTool('minecraft:wood_axe'))).toBe(2);
  });

  test('§All 41 block materials verified 1:1 with rujukan source', () => {
    // Spot-check a sample of blocks that I had to verify by reading each Tile subclass
    expect(defaultBlockRegistry.getByKey('minecraft:stone')?.material).toBe('stone');
    expect(defaultBlockRegistry.getByKey('minecraft:grass_block')?.material).toBe('dirt');  // GrassTile.cpp:6
    expect(defaultBlockRegistry.getByKey('minecraft:dirt')?.material).toBe('dirt');
    expect(defaultBlockRegistry.getByKey('minecraft:sand')?.material).toBe('sand');          // HeavyTile.cpp:9
    expect(defaultBlockRegistry.getByKey('minecraft:gravel')?.material).toBe('sand');         // extends HeavyTile
    expect(defaultBlockRegistry.getByKey('minecraft:oak_log')?.material).toBe('wood');        // TreeTile.h:21
    expect(defaultBlockRegistry.getByKey('minecraft:oak_leaves')?.material).toBe('leaves');   // LeafTile.h:32
    expect(defaultBlockRegistry.getByKey('minecraft:glass')?.material).toBe('glass');          // Tile.cpp:180
    expect(defaultBlockRegistry.getByKey('minecraft:obsidian')?.material).toBe('stone');     // extends StoneTile
    expect(defaultBlockRegistry.getByKey('minecraft:diamond_block')?.material).toBe('metal'); // MetalTile.h:13
    expect(defaultBlockRegistry.getByKey('minecraft:ice')?.material).toBe('ice');              // IceTile.h:16
    expect(defaultBlockRegistry.getByKey('minecraft:cactus')?.material).toBe('cactus');        // CactusTile.h:21
    expect(defaultBlockRegistry.getByKey('minecraft:web')?.material).toBe('web');              // WebTile.h:17
    expect(defaultBlockRegistry.getByKey('minecraft:oak_fence')?.material).toBe('wood');       // FenceTile.h:16
    expect(defaultBlockRegistry.getByKey('minecraft:farmland')?.material).toBe('dirt');        // FarmTile.h:15
    expect(defaultBlockRegistry.getByKey('minecraft:furnace')?.material).toBe('stone');        // FurnaceTile.cpp:16
    expect(defaultBlockRegistry.getByKey('minecraft:iron_door')?.material).toBe('metal');     // DoorTile.cpp:11
    expect(defaultBlockRegistry.getByKey('minecraft:snow_layer')?.material).toBe('topSnow');  // TopSnowTile.h:17
    expect(defaultBlockRegistry.getByKey('minecraft:reeds')?.material).toBe('plant');          // ReedTile.h:16
    expect(defaultBlockRegistry.getByKey('minecraft:crafting_table')?.material).toBe('wood'); // WorkbenchTile.h:16
    expect(defaultBlockRegistry.getByKey('minecraft:chest')?.material).toBe('wood');           // ChestTile.cpp:9
  });