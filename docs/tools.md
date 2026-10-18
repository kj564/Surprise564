# Tools — Tier class, tool metadata, canDestroySpecial

> Spec-driven port of MCPE 2013 tools (Item::Tier + PickaxeItem + HatchetItem + ShovelItem + WeaponItem).
> Every constant cites the rujukan C++ source with `§File:line`.

## Overview

A tool is an `Item` subclass that carries a `Tier` (level/uses/speed/damage) and a tile
list (`TileList`) of blocks it can mine at bonus speed. Tools determine (1) the
`canDestroySpecial` gate that decides whether a `notAlwaysDestroyable` material is
mineable at all, and (2) the `getDestroySpeed` multiplier applied to the bare-hand
speed of 1.0 when the tool matches the block's material.

There are exactly 20 tools in MCPE 2013: 5 tiers × 4 kinds (pickaxe, axe, shovel, sword).
Swords extend `Item` directly (not `DiggerItem`) so they have a different speed rule.

The port lives in `src/game/items/tools.ts`.

## Constants — Tier (§Item.cpp:11-15)

```cpp
Item::Tier const Item::Tier::WOOD   (0,   59,  2,  0);
Item::Tier const Item::Tier::STONE  (1,  131,  4,  1);
Item::Tier const Item::Tier::IRON   (2,  250,  6,  2);
Item::Tier const Item::Tier::EMERALD(3, 1561,  8,  3);
Item::Tier const Item::Tier::GOLD   (0,   32, 12,  0);
```

The rujukan class is declared in §Item.h:26-59 with four private `const` fields
(`level`, `uses`, `speed`, `damage`) and four getters.

| Tier name (rujukan) | Tier name (TS port) | level | uses (durability) | speed (destroy multiplier) | damage (attack bonus) |
|--------------------|---------------------|-------|-------------------|-----------------------------|------------------------|
| WOOD | `wood` | 0 | 59 | 2 | 0 |
| STONE | `stone` | 1 | 131 | 4 | 1 |
| IRON | `iron` | 2 | 250 | 6 | 2 |
| EMERALD | `diamond` | 3 | 1561 | 8 | 3 |
| GOLD | `gold` | 0 | 32 | 12 | 0 |

**Discrepancy — naming only, not values**: rujukan calls the top tier `EMERALD`
(declared at §Item.h:35 as `static const Tier EMERALD;`). MCPE 2013 internally
called diamonds "emeralds" (the `pickAxe_emerald`, `sword_emerald`, etc. statics at
§Item.h:89-92). The TS port renames it `diamond` to match modern Minecraft
terminology; the numeric values (`level=3, uses=1561, speed=8, damage=3`) match
the rujukan `EMERALD` tier exactly. Functionally identical.

## Constants — Tool icon coordinates (§Item.cpp:168-198)

Each `Item::initItems` call chains `setIcon(col, row)` to locate the tool's 16×16
icon inside `items.png` (256×256 atlas, 16×16 grid). The 20 tools, in rujukan
declaration order:

| itemKey (TS) | rujukan field | kind | tier | icon (col,row) | Rujukan line |
|--------------|---------------|------|------|----------------|--------------|
| `minecraft:iron_shovel` | `shovel_iron` | shovel | iron | (2,5) | §Item.cpp:168 |
| `minecraft:iron_pickaxe` | `pickAxe_iron` | pickaxe | iron | (2,6) | §Item.cpp:169 |
| `minecraft:iron_axe` | `hatchet_iron` | axe | iron | (2,7) | §Item.cpp:170 |
| `minecraft:iron_sword` | `sword_iron` | sword | iron | (2,4) | §Item.cpp:179 |
| `minecraft:wood_shovel` | `shovel_wood` | shovel | wood | (0,5) | §Item.cpp:181 |
| `minecraft:wood_pickaxe` | `pickAxe_wood` | pickaxe | wood | (0,6) | §Item.cpp:182 |
| `minecraft:wood_axe` | `hatchet_wood` | axe | wood | (0,7) | §Item.cpp:183 |
| `minecraft:wood_sword` | `sword_wood` | sword | wood | (0,4) | §Item.cpp:180 |
| `minecraft:stone_shovel` | `shovel_stone` | shovel | stone | (1,5) | §Item.cpp:185 |
| `minecraft:stone_pickaxe` | `pickAxe_stone` | pickaxe | stone | (1,6) | §Item.cpp:186 |
| `minecraft:stone_axe` | `hatchet_stone` | axe | stone | (1,7) | §Item.cpp:187 |
| `minecraft:stone_sword` | `sword_stone` | sword | stone | (1,4) | §Item.cpp:184 |
| `minecraft:diamond_shovel` | `shovel_emerald` | shovel | diamond | (3,5) | §Item.cpp:189 |
| `minecraft:diamond_pickaxe` | `pickAxe_emerald` | pickaxe | diamond | (3,6) | §Item.cpp:190 |
| `minecraft:diamond_axe` | `hatchet_emerald` | axe | diamond | (3,7) | §Item.cpp:191 |
| `minecraft:diamond_sword` | `sword_emerald` | sword | diamond | (3,4) | §Item.cpp:188 |
| `minecraft:gold_shovel` | `shovel_gold` | shovel | gold | (4,5) | §Item.cpp:196 |
| `minecraft:gold_pickaxe` | `pickAxe_gold` | pickaxe | gold | (4,6) | §Item.cpp:197 |
| `minecraft:gold_axe` | `hatchet_gold` | axe | gold | (4,7) | §Item.cpp:198 |
| `minecraft:gold_sword` | `sword_gold` | sword | gold | (4,4) | §Item.cpp:195 |

20 tools total. Verified by §Item.h:81-92 (WOOD/STONE/IRON/EMERALD/GOLD statics ×
4 kinds each) and `TOOL_KEYS.length === 20` in the TS port.

## Formulas

### `DiggerItem::getDestroySpeed` (§DiggerItem.h:14-21)

```cpp
float getDestroySpeed(ItemInstance* itemInstance, Tile* tile) {
    if (hasTile(tile)) return speed;     // speed = tier.getSpeed() at construction
    return 1;                            // no bonus
}
```

`hasTile(tile)` returns true if the tile's id is in the tool's `TileList` (set via
`setTiles(...)` in the constructor — §DiggerItem.h:43-52).

### `PickaxeItem::canDestroySpecial` (§PickaxeItem.cpp:34-45)

```cpp
bool PickaxeItem::canDestroySpecial(const Tile* tile) const {
    if (tile == Tile::obsidian)                                return tier.getLevel() == 3;
    if (tile == Tile::emeraldBlock || tile == Tile::emeraldOre) return tier.getLevel() >= 2;
    if (tile == Tile::goldBlock   || tile == Tile::goldOre)    return tier.getLevel() >= 2;
    if (tile == Tile::ironBlock   || tile == Tile::ironOre)    return tier.getLevel() >= 1;
    if (tile == Tile::lapisBlock  || tile == Tile::lapisOre)   return tier.getLevel() >= 1;
    if (tile == Tile::redStoneOre || tile == Tile::redStoneOre_lit) return tier.getLevel() >= 2;
    if (tile->material == Material::stone) return true;
    if (tile->material == Material::metal)  return true;
    return false;
}
```

`emeraldBlock`/`emeraldOre` in rujukan are the diamond block/ore (same naming
convention as the EMERALD tier). The TS port maps these to
`minecraft:diamond_block` / `minecraft:diamond_ore` — same Tile IDs (57, 56).

### `PickaxeItem::getDestroySpeed` (§PickaxeItem.cpp:47-53)

```cpp
float PickaxeItem::getDestroySpeed(ItemInstance* itemInstance, Tile* tile) {
    if (tile != NULL && (tile->material == Material::metal || tile->material == Material::stone))
        return speed;                                       // tier speed for stone/metal
    return super::getDestroySpeed(itemInstance, tile);      // §DiggerItem.h:14-19
}
```

So pickaxe gets `tier.speed` on any stone/metal block (regardless of whether
it's in the tile list), and falls through to the `hasTile ? speed : 1` check
otherwise.

### `HatchetItem::getDestroySpeed` (§HatchetItem.cpp:21-27)

```cpp
float HatchetItem::getDestroySpeed(ItemInstance* itemInstance, Tile* tile) {
    if (tile != NULL && tile->material == Material::wood) return speed;
    return super::getDestroySpeed(itemInstance, tile);
}
```

Axe gets `tier.speed` on any wood block, and falls through otherwise. HatchetItem
has **no** `canDestroySpecial` override, so it inherits the `Item` base
(§Item.h:307-309) which returns `false` — axes do not unlock any `notAlwaysDestroyable`
material. Wood is always-destroyable so axes aren't gated.

### `ShovelItem::canDestroySpecial` (§ShovelItem.cpp:20-24)

```cpp
bool ShovelItem::canDestroySpecial(const Tile* tile) const {
    if (tile == Tile::topSnow) return true;
    if (tile == Tile::snow)    return true;
    return false;
}
```

Shovels unlock `topSnow` and `snow` (both `notAlwaysDestroyable`). All other
shovel tile-list blocks (dirt, sand, gravel, grass, clay, farmland) are
always-destroyable, so no `canDestroySpecial` is needed for them.

### `WeaponItem::getDestroySpeed` (§WeaponItem.h:28-35)

```cpp
float getDestroySpeed(ItemInstance* itemInstance, Tile* tile) {
    if (tile->id == Tile::web->id) return 15;   // swords cut web fast
    return 1.5f;                                // 1.5x default mining speed (NOT 1)
}
```

This was a Rule Zero violation in an earlier port (the TS port returned 1.0
for swords). Fixed in Task 16 — swords now return `1.5` default and `15` for
web (§WeaponItem.h:30-37).

### `WeaponItem::canDestroySpecial` (§WeaponItem.h:69-71)

```cpp
bool canDestroySpecial(const Tile* tile) const {
    return tile->id == Tile::web->id;
}
```

### `Item::canDestroySpecial` base (§Item.h:307-309 — returns false)

The default `Item::canDestroySpecial` returns `false`, so axes/swords do not
unlock any gated material (only pickaxe and shovel override).

## Acceptance test (machine-decidable)

```ts
// §Tier constants match rujukan Item.cpp:11-15
expect(TIERS.wood).toEqual({ level: 0, uses: 59, speed: 2, damage: 0 });
expect(TIERS.stone).toEqual({ level: 1, uses: 131, speed: 4, damage: 1 });
expect(TIERS.iron).toEqual({ level: 2, uses: 250, speed: 6, damage: 2 });
expect(TIERS.diamond).toEqual({ level: 3, uses: 1561, speed: 8, damage: 3 });
expect(TIERS.gold).toEqual({ level: 0, uses: 32, speed: 12, damage: 0 });

// §20 tools registered (5 tiers x 4 kinds)
expect(TOOL_KEYS.length).toBe(20);

// §Icon coords match rujukan Item.cpp:168-198
expect(getTool('minecraft:iron_pickaxe')).toEqual({
  kind: 'pickaxe', tier: 'iron', tierDef: TIERS.iron, iconCol: 2, iconRow: 6,
});

// §canDestroy tier gates (PickaxeItem.cpp:38-52)
expect(canDestroyBlock('stone', 'minecraft:obsidian', getTool('minecraft:diamond_pickaxe'))).toBe(true);
expect(canDestroyBlock('stone', 'minecraft:obsidian', getTool('minecraft:iron_pickaxe'))).toBe(false);
expect(canDestroyBlock('stone', 'minecraft:diamond_ore', getTool('minecraft:iron_pickaxe'))).toBe(true);
expect(canDestroyBlock('stone', 'minecraft:diamond_ore', getTool('minecraft:stone_pickaxe'))).toBe(false);
expect(canDestroyBlock('stone', 'minecraft:iron_ore',  getTool('minecraft:stone_pickaxe'))).toBe(true);
expect(canDestroyBlock('stone', 'minecraft:iron_ore',  getTool('minecraft:wood_pickaxe'))).toBe(false);
expect(canDestroyBlock('stone', 'minecraft:lapis_ore', getTool('minecraft:stone_pickaxe'))).toBe(true);

// §Pickaxe getDestroySpeed on stone/metal -> tier speed (PickaxeItem.cpp:54-58)
expect(getPlayerDestroySpeed('stone', 'minecraft:stone',       getTool('minecraft:wood_pickaxe'))).toBe(2);
expect(getPlayerDestroySpeed('metal',  'minecraft:gold_block', getTool('minecraft:diamond_pickaxe'))).toBe(8);
expect(getPlayerDestroySpeed('stone', 'minecraft:stone',       getTool('minecraft:gold_pickaxe'))).toBe(12);

// §Axe on wood -> tier speed; on stone -> 1 (HatchetItem.cpp:21-25)
expect(getPlayerDestroySpeed('wood', 'minecraft:oak_planks', getTool('minecraft:wood_axe'))).toBe(2);
expect(getPlayerDestroySpeed('stone', 'minecraft:stone',     getTool('minecraft:wood_axe'))).toBe(1);

// §Shovel tile-list -> tier speed (DiggerItem.h:14-19)
expect(getPlayerDestroySpeed('dirt', 'minecraft:dirt', getTool('minecraft:wood_shovel'))).toBe(2);
expect(getPlayerDestroySpeed('sand', 'minecraft:sand', getTool('minecraft:stone_shovel'))).toBe(4);

// §Sword: 1.5 default, 15 for web (WeaponItem.h:30-37)
expect(getPlayerDestroySpeed('stone', 'minecraft:stone', getTool('minecraft:wood_sword'))).toBe(1.5);
expect(getPlayerDestroySpeed('web',   'minecraft:web',   getTool('minecraft:wood_sword'))).toBe(15);

// §Bare hand -> 1 (Inventory.cpp:322)
expect(getPlayerDestroySpeed('stone', 'minecraft:stone', null)).toBe(1);
```

## Verification

| Claim | Test file | Test name |
|-------|-----------|-----------|
| All 5 tier values (wood/stone/iron/diamond/gold) | `src/game/items/tools.test.ts` | `'TIERS values match rujukan Item.cpp:11-15'` |
| Tool icon coords (iron/wood/diamond/gold pickaxe, wood shovel) | `src/game/items/tools.test.ts` | `'Tool metadata matches rujukan Item.cpp:168-198'` |
| 20 tools total | `src/game/items/tools.test.ts` | `'20 tools registered (5 tiers x 4 kinds)'` |
| Pickaxe tier gates (obsidian/diamond/gold/iron/lapis ore) | `src/game/items/tools.test.ts` | `'canDestroyBlock: per-block tier gates (rujukan PickaxeItem.cpp:38-52)'` |
| Snow/topSnow requires shovel | `src/game/items/tools.test.ts` | `'canDestroyBlock: snow/topSnow require shovel (rujukan ShovelItem.cpp:25-30)'` |
| Bare hand returns 1 | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: bare hand returns 1 (rujukan Inventory.cpp:322)'` |
| Pickaxe on stone/metal -> tier speed | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: pickaxe on stone/metal -> tier speed'` |
| Pickaxe on non-stone -> 1 (no bonus) | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: pickaxe on non-stone material -> 1 (no bonus)'` |
| Axe on wood -> tier speed | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: axe on wood -> tier speed'` |
| Axe on non-wood -> 1 | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: axe on non-wood material -> 1 (no bonus)'` |
| Shovel tile-list -> tier speed | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: shovel on its tile list -> tier speed'` |
| Sword returns 1.5 default | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: sword returns 1.5 (rujukan WeaponItem.h:30-37)'` |
| Sword on web -> 15 | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: sword on web returns 15 (rujukan WeaponItem.h:32)'` |

## Untested claims (note for next agent)

- **Redstone ore tier gate**: rujukan §PickaxeItem.cpp:41 has `if (tile == Tile::redStoneOre || tile == Tile::redStoneOre_lit) return tier.getLevel() >= 2;` but the TS port (`tools.ts:124`) doesn't include `minecraft:redstone_ore` in its `pickaxeCanDestroy` branch — only obsidian/diamond/gold/iron/lapis are gated. This is a **bug**: redstone ore in the TS port has no tier gate, so wood pickaxe can "mine" it. Suggested fix: add the redstone branch to `pickaxeCanDestroy` and a test `canDestroyBlock('stone', 'minecraft:redstone_ore', getTool('minecraft:wood_pickaxe')) === false`.
- **Sword canDestroySpecial for web**: rujukan §WeaponItem.h:69-71 returns true for web. The TS port's `canDestroyBlock` returns `false` for swords unconditionally (line 200-201 of `tools.ts`), but since `web` material is `alwaysDestroyable`, the gate is never reached — so the TS port is functionally correct. Worth a defensive test.
