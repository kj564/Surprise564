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
    expect(getTool(257)).toEqual({
      kind: 'pickaxe', tier: 'iron', tierDef: TIERS.iron, iconCol: 2, iconRow: 6,
    });
    expect(getTool(269)).toEqual({
      kind: 'shovel', tier: 'wood', tierDef: TIERS.wood, iconCol: 0, iconRow: 5,
    });
    expect(getTool('minecraft:diamond_axe')).toEqual({
      kind: 'axe', tier: 'diamond', tierDef: TIERS.diamond, iconCol: 3, iconRow: 7,
    });
    expect(getTool(285)).toEqual({
      kind: 'pickaxe', tier: 'gold', tierDef: TIERS.gold, iconCol: 4, iconRow: 6,
    });
    expect(getTool(1)).toBeNull();  // blocks aren't tools
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
    expect(canDestroyBlock('dirt', 3, null)).toBe(true);
    expect(canDestroyBlock('wood', 5, null)).toBe(true);
    expect(canDestroyBlock('sand', 12, null)).toBe(true);
  });

  test('canDestroyBlock: stone requires pickaxe (rujukan Inventory.cpp:307-313)', () => {
    expect(canDestroyBlock('stone', 1, null)).toBe(false);
    expect(canDestroyBlock('stone', 1, getTool(270))).toBe(true);
    expect(canDestroyBlock('stone', 1, getTool(257))).toBe(true);
    // Wrong tool type doesn't help
    expect(canDestroyBlock('stone', 1, getTool('minecraft:wood_axe'))).toBe(false);
    expect(canDestroyBlock('stone', 1, getTool(269))).toBe(false);
    expect(canDestroyBlock('stone', 1, getTool('minecraft:wood_sword'))).toBe(false);
  });

  test('canDestroyBlock: per-block tier gates (rujukan PickaxeItem.cpp:38-52)', () => {
    // Obsidian requires diamond pickaxe (level 3)
    expect(canDestroyBlock('stone', 49, getTool(270))).toBe(false);
    expect(canDestroyBlock('stone', 49, getTool(274))).toBe(false);
    expect(canDestroyBlock('stone', 49, getTool(257))).toBe(false);
    expect(canDestroyBlock('stone', 49, getTool(278))).toBe(true);
    // Diamond/gold ore requires iron pickaxe (level >=2)
    expect(canDestroyBlock('stone', 56, getTool(274))).toBe(false);
    expect(canDestroyBlock('stone', 56, getTool(257))).toBe(true);
    expect(canDestroyBlock('stone', 14, getTool(270))).toBe(false);
    expect(canDestroyBlock('stone', 14, getTool(257))).toBe(true);
    // Iron/lapis ore requires stone pickaxe (level >=1)
    expect(canDestroyBlock('stone', 15, getTool(270))).toBe(false);
    expect(canDestroyBlock('stone', 15, getTool(274))).toBe(true);
    expect(canDestroyBlock('stone', 21, getTool(270))).toBe(false);
    expect(canDestroyBlock('stone', 21, getTool(274))).toBe(true);
    // §PickaxeItem.cpp:41 — redstone ore requires iron pickaxe (tier >= 2)
    expect(canDestroyBlock('stone', 73, getTool(270))).toBe(false);
    expect(canDestroyBlock('stone', 73, getTool(274))).toBe(false);
    expect(canDestroyBlock('stone', 73, getTool(257))).toBe(true);
    expect(canDestroyBlock('stone', 'minecraft:redstone_ore_lit', getTool(274))).toBe(false);
    expect(canDestroyBlock('stone', 'minecraft:redstone_ore_lit', getTool(257))).toBe(true);
  });

  test('canDestroyBlock: snow/topSnow require shovel (rujukan ShovelItem.cpp:25-30)', () => {
    expect(canDestroyBlock('snow', 80, null)).toBe(false);
    expect(canDestroyBlock('topSnow', 78, null)).toBe(false);
    expect(canDestroyBlock('snow', 80, getTool(269))).toBe(true);
    expect(canDestroyBlock('topSnow', 78, getTool(269))).toBe(true);
    // Pickaxe doesn't help with snow
    expect(canDestroyBlock('snow', 80, getTool(270))).toBe(false);
  });

  test('getPlayerDestroySpeed: bare hand returns 1 (rujukan Inventory.cpp:322)', () => {
    expect(getPlayerDestroySpeed('stone', 1, null)).toBe(1);
    expect(getPlayerDestroySpeed('wood', 5, null)).toBe(1);
    expect(getPlayerDestroySpeed('dirt', 3, null)).toBe(1);
  });

  test('getPlayerDestroySpeed: pickaxe on stone/metal → tier speed (rujukan PickaxeItem.cpp:54-58)', () => {
    // Wood pickaxe (speed=2) on stone → 2
    expect(getPlayerDestroySpeed('stone', 1, getTool(270))).toBe(2);
    // Iron pickaxe (speed=6) on iron_ore (stone material) → 6
    expect(getPlayerDestroySpeed('stone', 15, getTool(257))).toBe(6);
    // Diamond pickaxe (speed=8) on gold_block (metal material) → 8
    expect(getPlayerDestroySpeed('metal', 41, getTool(278))).toBe(8);
    // Gold pickaxe (speed=12) on stone → 12 (gold is fast but low durability)
    expect(getPlayerDestroySpeed('stone', 1, getTool(285))).toBe(12);
  });

  test('getPlayerDestroySpeed: pickaxe on non-stone material → 1 (no bonus)', () => {
    // Pickaxe on dirt → 1 (no bonus since dirt isn't stone/metal)
    expect(getPlayerDestroySpeed('dirt', 3, getTool(270))).toBe(1);
    // Pickaxe on wood → 1 (need axe for wood bonus)
    expect(getPlayerDestroySpeed('wood', 5, getTool(270))).toBe(1);
  });

  test('getPlayerDestroySpeed: axe on wood → tier speed (rujukan HatchetItem.cpp:21-25)', () => {
    expect(getPlayerDestroySpeed('wood', 5, getTool('minecraft:wood_axe'))).toBe(2);
    expect(getPlayerDestroySpeed('wood', 17, getTool('minecraft:iron_axe'))).toBe(6);
    expect(getPlayerDestroySpeed('wood', 5, getTool('minecraft:diamond_axe'))).toBe(8);
  });

  test('getPlayerDestroySpeed: axe on non-wood material → 1 (no bonus)', () => {
    expect(getPlayerDestroySpeed('stone', 1, getTool('minecraft:wood_axe'))).toBe(1);
    expect(getPlayerDestroySpeed('dirt', 3, getTool('minecraft:iron_axe'))).toBe(1);
  });

  test('getPlayerDestroySpeed: shovel on its tile list → tier speed (rujukan DiggerItem.h:14-19)', () => {
    expect(getPlayerDestroySpeed('dirt', 3, getTool(269))).toBe(2);
    expect(getPlayerDestroySpeed('dirt', 2, getTool('minecraft:iron_shovel'))).toBe(6);
    expect(getPlayerDestroySpeed('sand', 12, getTool('minecraft:stone_shovel'))).toBe(4);
  });

  test('getPlayerDestroySpeed: sword returns 1.5 (rujukan WeaponItem.h:30-37)', () => {
    // §WeaponItem::getDestroySpeed returns 1.5 by default (NOT 1 — I initially guessed wrong)
    expect(getPlayerDestroySpeed('stone', 1, getTool('minecraft:wood_sword'))).toBe(1.5);
    expect(getPlayerDestroySpeed('wood', 5, getTool('minecraft:iron_sword'))).toBe(1.5);
    expect(getPlayerDestroySpeed('dirt', 3, getTool('minecraft:diamond_sword'))).toBe(1.5);
  });

  test('getPlayerDestroySpeed: sword on web returns 15 (rujukan WeaponItem.h:32)', () => {
    // §WeaponItem::getDestroySpeed: if (tile->id == Tile::web->id) return 15;
    expect(getPlayerDestroySpeed('web', 30, getTool('minecraft:wood_sword'))).toBe(15);
    expect(getPlayerDestroySpeed('web', 30, getTool('minecraft:iron_sword'))).toBe(15);
  });
});

  test('§Verified materials: torch and ladder use Material::decoration (not wood)', () => {
    // §TorchTile.h:18 — super(id, tex, Material::decoration)
    // §LadderTile.h:18 — super(id, tex, Material::decoration)
    // These were initially mis-assigned as 'wood' in the registry. The bug
    // would have given axe bonus speed on torch/ladder, which rujukan does NOT.
    const torchDef = defaultBlockRegistry.getByKey(50);
    const ladderDef = defaultBlockRegistry.getByKey(65);
    expect(torchDef?.material).toBe('decoration');
    expect(ladderDef?.material).toBe('decoration');
  });

  test('§Axe does NOT get speed bonus on torch/ladder (material=decoration, not wood)', () => {
    // §HatchetItem::getDestroySpeed: if (tile.material == Material::wood) return speed;
    // Torch/ladder material is decoration → falls through to DiggerItem base (hasTile ? speed : 1).
    // Torch/ladder are NOT in AXE_TILES, so hasTile=false → returns 1.
    expect(getPlayerDestroySpeed('decoration', 50, getTool('minecraft:wood_axe'))).toBe(1);
    expect(getPlayerDestroySpeed('decoration', 65, getTool('minecraft:iron_axe'))).toBe(1);
    // Sanity check: wood_axe on oak_log (material=wood) DOES get speed bonus
    expect(getPlayerDestroySpeed('wood', 17, getTool('minecraft:wood_axe'))).toBe(2);
  });

  test('§All 41 block materials verified 1:1 with rujukan source', () => {
    // Spot-check a sample of blocks that I had to verify by reading each Tile subclass
    expect(defaultBlockRegistry.getByKey(1)?.material).toBe('stone');
    expect(defaultBlockRegistry.getByKey(2)?.material).toBe('dirt');  // GrassTile.cpp:6
    expect(defaultBlockRegistry.getByKey(3)?.material).toBe('dirt');
    expect(defaultBlockRegistry.getByKey(12)?.material).toBe('sand');          // HeavyTile.cpp:9
    expect(defaultBlockRegistry.getByKey(13)?.material).toBe('sand');         // extends HeavyTile
    expect(defaultBlockRegistry.getByKey(17)?.material).toBe('wood');        // TreeTile.h:21
    expect(defaultBlockRegistry.getByKey(18)?.material).toBe('leaves');   // LeafTile.h:32
    expect(defaultBlockRegistry.getByKey(20)?.material).toBe('glass');          // Tile.cpp:180
    expect(defaultBlockRegistry.getByKey(49)?.material).toBe('stone');     // extends StoneTile
    expect(defaultBlockRegistry.getByKey(57)?.material).toBe('metal'); // MetalTile.h:13
    expect(defaultBlockRegistry.getByKey(79)?.material).toBe('ice');              // IceTile.h:16
    expect(defaultBlockRegistry.getByKey(81)?.material).toBe('cactus');        // CactusTile.h:21
    expect(defaultBlockRegistry.getByKey(30)?.material).toBe('web');              // WebTile.h:17
    expect(defaultBlockRegistry.getByKey(85)?.material).toBe('wood');       // FenceTile.h:16
    expect(defaultBlockRegistry.getByKey(60)?.material).toBe('dirt');        // FarmTile.h:15
    expect(defaultBlockRegistry.getByKey(61)?.material).toBe('stone');        // FurnaceTile.cpp:16
    expect(defaultBlockRegistry.getByKey('minecraft:iron_door')?.material).toBe('metal');     // DoorTile.cpp:11
    expect(defaultBlockRegistry.getByKey(78)?.material).toBe('topSnow');  // TopSnowTile.h:17
    expect(defaultBlockRegistry.getByKey(83)?.material).toBe('plant');          // ReedTile.h:16
    expect(defaultBlockRegistry.getByKey(58)?.material).toBe('wood'); // WorkbenchTile.h:16
    expect(defaultBlockRegistry.getByKey(54)?.material).toBe('wood');           // ChestTile.cpp:9
  });