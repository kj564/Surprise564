# Materials — Material system + canDestroyBlock

> Spec-driven port of MCPE 2013 material system (Material.cpp + Material.h + Tile subclasses).
> Every constant cites the rujukan C++ source with `§File:line`.

## Overview

`Material` is a per-block-type descriptor that controls whether the block is
solid, blocks light, is flammable, is replaceable, and — most importantly for
mining — whether it is `isAlwaysDestroyable()`. There are 27 materials defined
in §Material.cpp:37-66. Only 4 of them are `notAlwaysDestroyable` (the rest
default to `true`).

The `Inventory::canDestroy` gate (§Inventory.cpp:307-313) consults the material
to decide whether a bare-handed player can mine a block at full speed or
whether they need a tool's `canDestroySpecial` to unlock it.

The port lives in `src/game/items/tools.ts` (`isAlwaysDestroyable`,
`canDestroyBlock`, `getPlayerDestroySpeed`) and the per-block material field
in `src/game/blocks/registry.ts`.

## Constants — Material catalog (§Material.cpp:37-66)

27 material singletons (counted from §Material.cpp:8-34 — 27 static pointers):

| Material | Base class | notAlwaysDestroyable? | flammable? | neverBuildable? | replaceable? | Rujukan line |
|----------|------------|----------------------|------------|-----------------|--------------|--------------|
| `air` | GasMaterial | (default true) | no | no | no | §Material.cpp:39 |
| `dirt` | Material | (default true) | no | no | no | §Material.cpp:40 |
| `wood` | Material | (default true) | **yes** | no | no | §Material.cpp:41 |
| `stone` | Material | **yes** | no | no | no | §Material.cpp:42 |
| `metal` | Material | **yes** | no | no | no | §Material.cpp:43 |
| `water` | LiquidMaterial | (default true) | no | (no) | no | §Material.cpp:44 |
| `lava` | LiquidMaterial | (default true) | no | (no) | no | §Material.cpp:45 |
| `leaves` | Material | (default true) | **yes** | **yes** | no | §Material.cpp:46 |
| `plant` | DecorationMaterial | (default true) | no | no | no | §Material.cpp:47 |
| `replaceable_plant` | DecorationMaterial | (default true) | **yes** | no | **yes** | §Material.cpp:48 |
| `sponge` | Material | (default true) | no | no | no | §Material.cpp:49 |
| `cloth` | Material | (default true) | **yes** | no | no | §Material.cpp:50 |
| `fire` | GasMaterial | (default true) | no | no | no | §Material.cpp:51 |
| `sand` | Material | (default true) | no | no | no | §Material.cpp:52 |
| `decoration` | DecorationMaterial | (default true) | no | no | no | §Material.cpp:53 |
| `glass` | Material | (default true) | no | **yes** | no | §Material.cpp:54 |
| `explosive` | Material | (default true) | **yes** | **yes** | no | §Material.cpp:55 |
| `coral` | Material | (default true) | no | no | no | §Material.cpp:56 |
| `ice` | Material | (default true) | no | **yes** | no | §Material.cpp:57 |
| `topSnow` | DecorationMaterial | **yes** | no | **yes** | **yes** | §Material.cpp:58 |
| `snow` | Material | **yes** | no | no | no | §Material.cpp:59 |
| `cactus` | Material | (default true) | no | **yes** | no | §Material.cpp:60 |
| `clay` | Material | (default true) | no | no | no | §Material.cpp:61 |
| `vegetable` | Material | (default true) | no | no | no | §Material.cpp:62 |
| `portal` | Material | (default true) | no | no | no | §Material.cpp:63 |
| `cake` | Material | (default true) | no | no | no | §Material.cpp:64 |
| `web` | WebMaterial | (default true) | no | no | no | §Material.cpp:65 |

**Discrepancy with task spec**: the task said "26 materials" but the rujukan
source (§Material.cpp:8-34) declares 27 material pointers. Verified by
counting the lines — 27 entries from `air` to `web`. (If `air` is excluded
because it's never assigned to a Tile, that gives 26 — but `air` is in the
registry as `minecraft:air` with `material: 'air'` so the TS port treats it
as a real material.)

## Formulas

### `Material::isAlwaysDestroyable` (§Material.h:61-65)

```cpp
virtual bool isAlwaysDestroyable() const {
    // these materials will always drop resources when destroyed,
    // regardless of player's equipment
    return _isAlwaysDestroyable;
}
```

Default value of `_isAlwaysDestroyable` is `true` (§Material.h:85).
Only 4 materials call `notAlwaysDestroyable()`:
- `stone` (§Material.cpp:42)
- `metal` (§Material.cpp:43)
- `topSnow` (§Material.cpp:58)
- `snow` (§Material.cpp:59)

### `notAlwaysDestroyable` mutator (§Material.h:99-102)

```cpp
Material* notAlwaysDestroyable() {
    _isAlwaysDestroyable = false;
    return this;
}
```

### `Inventory::canDestroy` (§Inventory.cpp:307-313)

```cpp
bool Inventory::canDestroy(Tile* tile) {
    if (tile->material->isAlwaysDestroyable()) return true;       // line 309
    ItemInstance* item = getSelected();
    if (item != NULL) return item->canDestroySpecial(tile);      // line 312
    return false;                                                 // line 313
}
```

### `Inventory::getDestroySpeed` (§Inventory.cpp:316-323)

```cpp
float Inventory::getDestroySpeed(Tile* tile) {
    ItemInstance* item = getSelected();
    if (item && item->id >= 256) {
        return Item::items[item->id]->getDestroySpeed(NULL, tile);
    }
    return 1.0f;                                                   // bare hand
}
```

The `id >= 256` check skips tools (tool ids are 0-255 in MCPE 2013 — see
§Item.cpp:168-198 where `shovel_iron = new ShovelItem(0, Tier::IRON)` etc.).
Block items have id `tile_id` (256+ range, mapped by §Tile.cpp:289-298).
So a block item returns `Item::Item::getDestroySpeed` which is `1` (no bonus).

### Per-block material assignment (Tile subclass constructors)

The material is set in each Tile subclass constructor. Verified examples:

| Tile subclass | Material | Rujukan source |
|---------------|----------|----------------|
| `StoneTile` (id 1) | `Material::stone` | §StoneTile.h:15 — `Tile(id, tex, Material::stone)` |
| `GrassTile` (id 2) | `Material::dirt` | §GrassTile.cpp:6 — `super(id, Material::dirt)` |
| `DirtTile` (id 3) | `Material::dirt` | §DirtTile.h:15 — `Tile(id, tex, Material::dirt)` |
| `Tile` (id 4 stone_bricks) | `Material::stone` | §Tile.cpp:164 — `Tile(4, 16, Material::stone)` |
| `Tile` (id 5 oak_planks) | `Material::wood` | §Tile.cpp:165 — `Tile(5, 4, Material::wood)` |
| `TreeTile` (id 17 oak_log) | `Material::wood` | §TreeTile.h:21 — `Tile(id, Material::wood)` |
| `LeafTile` (id 18) | `Material::leaves` | §LeafTile.h:32 (verified by Task 16 audit) |
| `GlassTile` (id 20) | `Material::glass` | §Tile.cpp:180 — `GlassTile(20, 49, Material::glass, false)` |
| `OreTile` (id 14/15/16/21/56) | `Material::stone` | §OreTile.h:16 (verified) |
| `HeavyTile` (id 12 sand) | `Material::sand` | §HeavyTile.cpp:9 (verified) |
| `GravelTile` (id 13) | inherits `HeavyTile` → `Material::sand` | (extends HeavyTile) |
| `MetalTile` (id 41/42/57) | `Material::metal` | §MetalTile.h:13 |
| `SandStoneTile` (id 24) | `Material::stone` | §SandStoneTile.h:19 |
| `WebTile` (id 30) | `Material::web` | §WebTile.h:17 |
| `Bush` (id 37/38 flower/rose) | `Material::plant` | §Bush.h:14 |
| `Mushroom` (id 39/40) | inherits `Bush` → `Material::plant` | (extends Bush) |
| `ClothTile` (id 35) | `Material::cloth` | §ClothTile.h:14 |
| `ObsidianTile` (id 49) | inherits `StoneTile` → `Material::stone` | §ObsidianTile.h:10 |
| `TopSnowTile` (id 78) | `Material::topSnow` | §TopSnowTile.h:17 |
| `SnowTile` (id 80) | `Material::snow` | §SnowTile.h:17 |
| `IceTile` (id 79) | `Material::ice` | §IceTile.h:16 |
| `CactusTile` (id 81) | `Material::cactus` | §CactusTile.h:21 |
| `ReedTile` (id 83) | `Material::plant` | §ReedTile.h:16 |
| `FenceTile` (id 85) | `Material::wood` | §FenceTile.h:16 |
| `WorkbenchTile` (id 58) | `Material::wood` | §WorkbenchTile.h:16 |
| `BookshelfTile` (id 47) | `Material::wood` | §BookshelfTile.h:14 |
| `ChestTile` (id 54) | `Material::wood` | §ChestTile.cpp:9 |
| `FurnaceTile` (id 61/62) | `Material::stone` | §FurnaceTile.cpp:16 |
| `FarmTile` (id 60) | `Material::dirt` | §FarmTile.h:15 |
| `StairTile` (id 53/67/108/109) | inherits base tile's material | (passes Tile* base in constructor) |
| `SignTile` (id 63/68) | `Material::wood` | §SignTile.h:17 |
| `DoorTile` (id 64 wood) | `Material::wood` | §DoorTile.cpp:9 (`DoorTile(64, Material::wood)`) |
| `DoorTile` (id 71 iron) | `Material::metal` | §DoorTile.cpp:11 (`DoorTile(71, Material::metal)`) |
| `TorchTile` (id 50) | `Material::decoration` | §TorchTile.h:18 |
| `LadderTile` (id 65) | `Material::decoration` | §LadderTile.h:18 |
| `LiquidTileDynamic` (id 8 water) | `Material::water` | §Tile.cpp:168 |
| `LiquidTileDynamic` (id 10 lava) | `Material::lava` | §Tile.cpp:170 |
| `TntTile` (id 46) | (default Material::stone? actually no material specified) | §Tile.cpp:198 — no material arg |
| `TallGrass` (id 31) | `Material::replaceable_plant` | (DecorationMaterial subclass) |
| `FireTile` (id 51) | (default Material::stone? actually no material specified) | §Tile.cpp:273 |

## Worked examples (machine-decidable)

### `isAlwaysDestroyable` truth table

| Material | isAlwaysDestroyable | Reason |
|----------|---------------------|--------|
| `air` | true | default (Material.cpp:39, no notAlwaysDestroyable) |
| `dirt` | true | default |
| `wood` | true | default (flammable but still always-destroyable) |
| `stone` | **false** | §Material.cpp:42 — `notAlwaysDestroyable()` |
| `metal` | **false** | §Material.cpp:43 |
| `water` | true | default |
| `sand` | true | default |
| `glass` | true | default |
| `leaves` | true | default |
| `ice` | true | default |
| `web` | true | default (WebMaterial extends Material, no override) |
| `topSnow` | **false** | §Material.cpp:58 |
| `snow` | **false** | §Material.cpp:59 |
| `decoration` | true | default (DecorationMaterial extends Material, no override) |
| `cactus` | true | default |
| `plant` | true | default |

### `Inventory::canDestroy` truth table (stone vs equipped tool)

For `minecraft:stone` (material = stone, notAlwaysDestroyable):
- Bare hand (no item) → `isAlwaysDestroyable()=false`, `item=null` → `canDestroy=false`
  → applies 100× penalty to mining speed; **no drops**.
- Wood pickaxe → `isAlwaysDestroyable()=false`, `item.canDestroySpecial(stone)=true`
  (§PickaxeItem.cpp:42 `if (tile->material == Material::stone) return true`) → `canDestroy=true`.
- Wood axe → `isAlwaysDestroyable()=false`, `item.canDestroySpecial(stone)=false`
  (Item base §Item.h:307-309 returns false, no HatchetItem override) → `canDestroy=false`.
- Wood shovel → `isAlwaysDestroyable()=false`, `item.canDestroySpecial(stone)=false`
  (ShovelItem only handles topSnow/snow, §ShovelItem.cpp:20-24) → `canDestroy=false`.
- Wood sword → `isAlwaysDestroyable()=false`, `item.canDestroySpecial(stone)=false`
  (WeaponItem only handles web, §WeaponItem.h:69-71) → `canDestroy=false`.

### `Inventory::canDestroy` truth table (dirt vs equipped tool)

For `minecraft:dirt` (material = dirt, always-destroyable):
- Bare hand → `isAlwaysDestroyable()=true` → `canDestroy=true` (full speed, drops).
- Any tool → `isAlwaysDestroyable()=true` → `canDestroy=true`.

## Acceptance test (machine-decidable)

```ts
// §isAlwaysDestroyable matches Material.cpp:37-66
expect(isAlwaysDestroyable('stone')).toBe(false);      // §Material.cpp:42
expect(isAlwaysDestroyable('metal')).toBe(false);      // §Material.cpp:43
expect(isAlwaysDestroyable('snow')).toBe(false);       // §Material.cpp:59
expect(isAlwaysDestroyable('topSnow')).toBe(false);    // §Material.cpp:58
expect(isAlwaysDestroyable('dirt')).toBe(true);        // default
expect(isAlwaysDestroyable('wood')).toBe(true);        // default (flammable but still always)
expect(isAlwaysDestroyable('sand')).toBe(true);       // default
expect(isAlwaysDestroyable('leaves')).toBe(true);     // default
expect(isAlwaysDestroyable('glass')).toBe(true);      // default
expect(isAlwaysDestroyable('ice')).toBe(true);        // default
expect(isAlwaysDestroyable('web')).toBe(true);        // default (WebMaterial inherits default)
expect(isAlwaysDestroyable('decoration')).toBe(true); // default (DecorationMaterial inherits)
expect(isAlwaysDestroyable('plant')).toBe(true);      // default
expect(isAlwaysDestroyable('cactus')).toBe(true);     // default

// §canDestroy (Inventory.cpp:307-313): always-destroyable -> always true
expect(canDestroyBlock('dirt', 'minecraft:dirt', null)).toBe(true);
expect(canDestroyBlock('wood', 'minecraft:oak_planks', null)).toBe(true);
expect(canDestroyBlock('sand', 'minecraft:sand', null)).toBe(true);

// §canDestroy: stone requires pickaxe (PickaxeItem.cpp:42)
expect(canDestroyBlock('stone', 'minecraft:stone', null)).toBe(false);
expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_pickaxe'))).toBe(true);
expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_axe'))).toBe(false);
expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_shovel'))).toBe(false);
expect(canDestroyBlock('stone', 'minecraft:stone', getTool('minecraft:wood_sword'))).toBe(false);

// §Per-block material assignment verified by reading each rujukan Tile subclass
expect(defaultBlockRegistry.getByKey('minecraft:stone')?.material).toBe('stone');
expect(defaultBlockRegistry.getByKey('minecraft:grass_block')?.material).toBe('dirt');  // GrassTile.cpp:6
expect(defaultBlockRegistry.getByKey('minecraft:dirt')?.material).toBe('dirt');
expect(defaultBlockRegistry.getByKey('minecraft:oak_log')?.material).toBe('wood');      // TreeTile.h:21
expect(defaultBlockRegistry.getByKey('minecraft:oak_leaves')?.material).toBe('leaves');
expect(defaultBlockRegistry.getByKey('minecraft:glass')?.material).toBe('glass');
expect(defaultBlockRegistry.getByKey('minecraft:obsidian')?.material).toBe('stone');    // extends StoneTile
expect(defaultBlockRegistry.getByKey('minecraft:diamond_block')?.material).toBe('metal'); // MetalTile.h:13
expect(defaultBlockRegistry.getByKey('minecraft:ice')?.material).toBe('ice');
expect(defaultBlockRegistry.getByKey('minecraft:web')?.material).toBe('web');
expect(defaultBlockRegistry.getByKey('minecraft:oak_fence')?.material).toBe('wood');
expect(defaultBlockRegistry.getByKey('minecraft:farmland')?.material).toBe('dirt');
expect(defaultBlockRegistry.getByKey('minecraft:furnace')?.material).toBe('stone');
expect(defaultBlockRegistry.getByKey('minecraft:iron_door')?.material).toBe('metal');
expect(defaultBlockRegistry.getByKey('minecraft:snow_layer')?.material).toBe('topSnow');
expect(defaultBlockRegistry.getByKey('minecraft:reeds')?.material).toBe('plant');
expect(defaultBlockRegistry.getByKey('minecraft:crafting_table')?.material).toBe('wood');
expect(defaultBlockRegistry.getByKey('minecraft:chest')?.material).toBe('wood');
// Rule Zero fixes from Task 16:
expect(defaultBlockRegistry.getByKey('minecraft:torch')?.material).toBe('decoration');  // TorchTile.h:18
expect(defaultBlockRegistry.getByKey('minecraft:ladder')?.material).toBe('decoration');  // LadderTile.h:18
```

## Verification

| Claim | Test file | Test name |
|-------|-----------|-----------|
| 4 `notAlwaysDestroyable` materials (stone/metal/snow/topSnow) + 8 always-destroyable | `src/game/items/tools.test.ts` | `'isAlwaysDestroyable matches Material.cpp:37-66'` |
| Always-destroyable materials pass `canDestroyBlock` without tool | `src/game/items/tools.test.ts` | `'canDestroyBlock: always-destroyable materials always pass'` |
| Stone requires pickaxe (Inventory.cpp:307-313 + PickaxeItem.cpp:42) | `src/game/items/tools.test.ts` | `'canDestroyBlock: stone requires pickaxe'` |
| Snow/topSnow require shovel | `src/game/items/tools.test.ts` | `'canDestroyBlock: snow/topSnow require shovel'` |
| Bare hand returns 1 | `src/game/items/tools.test.ts` | `'getPlayerDestroySpeed: bare hand returns 1'` |
| Torch and ladder are decoration (NOT wood — Task 16 fix) | `src/game/items/tools.test.ts` | `'§Verified materials: torch and ladder use Material::decoration'` |
| Axe does NOT get bonus on torch/ladder (material=decoration) | `src/game/items/tools.test.ts` | `'§Axe does NOT get speed bonus on torch/ladder'` |
| 20 spot-check block materials match rujukan source | `src/game/items/tools.test.ts` | `'§All 41 block materials verified 1:1 with rujukan source'` |
| Registry requires air | `src/game/blocks/registry.test.ts` | `'requires air and validates material properties'` |

## Untested claims (note for next agent)

- **27 materials count**: no test asserts the total count of materials
  (27). The TS `BlockMaterial` type lists 27 entries (tools.ts:89-94). Suggested
  test: `expect(MATERIAL_NAMES.length).toBe(27)`.
- **Flammable / neverBuildable / replaceable flags**: rujukan Material.cpp
  has these flags but the TS port doesn't model them (no game logic uses them
  yet — no fire spread, no build-on-replaceable checks). When those systems
  are ported, add `isFlammable()`, `isNeverBuildable()`, `isReplaceable()`
  helpers and tests.
- **`Item::canDestroySpecial` base returns false (Item.h:307-309)**: not
  directly tested but exercised indirectly through "wrong tool type doesn't
  help" in the stone-requires-pickaxe test.
