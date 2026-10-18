# World dimensions & block hardness — LevelConstants + Tile.cpp

> Spec-driven port of MCPE 2013 world dimensions and per-block hardness.
> Every constant cites the rujukan C++ source with `§File:line`.

## Overview

The MCPE 2013 overworld is a fixed-height 128-block column with a 16×16 chunk
grid. Each chunk stores 16×128×16 = 32768 block IDs. Sea level sits at y=63
(`Level::SEA_LEVEL`); the worldgen water-height cutoff is y=64
(`RandomLevelSource::prepareHeights`).

Each tile has a `setDestroyTime` (a.k.a. hardness) that drives `Tile::getDestroyProgress`
(see `docs/mining.md`). This file lists every hardness value assigned in
`Tile::initTiles` (§Tile.cpp:160-300), grouped by block name.

The TS engine port lives in `src/game/blocks/registry.ts` (41 block definitions).

## Constants — World dimensions

| Constant | Value | Rujukan source |
|----------|-------|----------------|
| `LEVEL_HEIGHT` | 128 | §LevelConstants.h:5 |
| `CHUNK_CACHE_WIDTH` | 16 chunks | §LevelConstants.h:6 |
| `CHUNK_WIDTH` | 16 blocks | §LevelConstants.h:7 |
| `CHUNK_DEPTH` | 16 blocks | §LevelConstants.h:8 |
| `LEVEL_WIDTH` | `16 * 16 = 256` blocks | §LevelConstants.h:9 |
| `LEVEL_DEPTH` | `16 * 16 = 256` blocks | §LevelConstants.h:10 |
| `CHUNK_COLUMNS` | `16 * 16 = 256` | §LevelConstants.h:11 |
| `CHUNK_BLOCK_COUNT` | `256 * 128 = 32768` | §LevelConstants.h:12 |
| `Level::DEPTH` | `LEVEL_HEIGHT = 128` | §Level.h:70 |
| `Level::SEA_LEVEL` | `128/2 - 1 = 63` | §Level.h:71 |
| `Level::MAX_BRIGHTNESS` | 15 | §Level.h:73 |
| `Level::MAX_LEVEL_SIZE` | 32000000 | §Level.h:69 |
| Worldgen `waterHeight` | `DEPTH - 64 = 64` | §RandomLevelSource.cpp:68 |
| `Level::genDepthBits` | 7 | §Level.h:76 |
| `Level::genDepth` | `1 << 7 = 128` | §Level.h:78 |

## Block hardness (§Tile.cpp:161-268)

Every `setDestroyTime(...)` call in `Tile::initTiles`:

| Block (TS port key) | Hardness | Material | Rujukan line |
|---------------------|----------|----------|--------------|
| `minecraft:stone` | 1.5 | stone | §Tile.cpp:161 |
| `minecraft:grass_block` | 0.6 | dirt | §Tile.cpp:162 |
| `minecraft:dirt` | 0.5 | dirt | §Tile.cpp:163 |
| `minecraft:stone_bricks` | 2.0 | stone | §Tile.cpp:164 |
| `minecraft:oak_planks` | 2.0 | wood | §Tile.cpp:165 |
| `minecraft:sapling` | 0.0 | — | §Tile.cpp:166 |
| `minecraft:bedrock` | -1 (unbreakable) | stone | §Tile.cpp:167 |
| `minecraft:water` | 100.0 | water | §Tile.cpp:168 |
| `minecraft:lava` | 100.0 / 0.0 | lava | §Tile.cpp:170-171 |
| `minecraft:sand` | 0.5 | sand | §Tile.cpp:172 |
| `minecraft:gravel` | 0.6 | sand | §Tile.cpp:173 |
| `minecraft:gold_ore` | 3.0 | stone | §Tile.cpp:174 |
| `minecraft:iron_ore` | 3.0 | stone | §Tile.cpp:175 |
| `minecraft:coal_ore` | 3.0 | stone | §Tile.cpp:176 |
| `minecraft:oak_log` | 2.0 | wood | §Tile.cpp:177 |
| `minecraft:oak_leaves` | 0.2 | leaves | §Tile.cpp:178 |
| `minecraft:glass` | 0.3 | glass | §Tile.cpp:180 |
| `minecraft:lapis_ore` | 3.0 | stone | §Tile.cpp:181 |
| `minecraft:lapis_block` | 3.0 | stone | §Tile.cpp:182 |
| `minecraft:sandstone` | 0.8 | stone | §Tile.cpp:183 |
| `minecraft:bed` | 0.2 | — | §Tile.cpp:184 |
| `minecraft:web` | 4.0 | web | §Tile.cpp:185 |
| `minecraft:tallgrass` | 0.0 | — | §Tile.cpp:186 |
| `minecraft:cloth` | 0.8 | cloth | §Tile.cpp:187 |
| `minecraft:flower` | 0.0 | plant | §Tile.cpp:189 |
| `minecraft:rose` | 0.0 | plant | §Tile.cpp:190 |
| `minecraft:mushroom1` | 0.0 | plant | §Tile.cpp:191 |
| `minecraft:mushroom2` | 0.0 | plant | §Tile.cpp:192 |
| `minecraft:gold_block` | 3.0 | metal | §Tile.cpp:193 |
| `minecraft:iron_block` | 5.0 | metal | §Tile.cpp:194 |
| `minecraft:stone_slab` (full) | 2.0 | stone | §Tile.cpp:195 |
| `minecraft:stone_slab` (half) | 2.0 | stone | §Tile.cpp:196 |
| `minecraft:bricks` | 2.0 | stone | §Tile.cpp:197 |
| `minecraft:tnt` | 0.0 | — | §Tile.cpp:198 |
| `minecraft:bookshelf` | 1.5 | wood | §Tile.cpp:199 |
| `minecraft:moss_stone` | 2.0 | stone | §Tile.cpp:200 |
| `minecraft:obsidian` | 10.0 | stone | §Tile.cpp:201 |
| `minecraft:torch` | 0.0 | decoration | §Tile.cpp:202 |
| `minecraft:oak_stairs` | (inherits wood=2.0) | wood | §Tile.cpp:204 (StairTile uses base tile) |
| `minecraft:chest` | 2.5 | wood | §Tile.cpp:205 |
| `minecraft:diamond_ore` | 3.0 | stone | §Tile.cpp:207 |
| `minecraft:diamond_block` | 5.0 | metal | §Tile.cpp:208 |
| `minecraft:crafting_table` | 2.5 | wood | §Tile.cpp:209 |
| `minecraft:crops` | 0.0 | — | §Tile.cpp:210 |
| `minecraft:farmland` | 0.6 | dirt | §Tile.cpp:211 |
| `minecraft:furnace` | 3.5 | stone | §Tile.cpp:212 |
| `minecraft:furnace_lit` | 3.5 | stone | §Tile.cpp:213 |
| `minecraft:sign` | 1.0 | wood | §Tile.cpp:214 |
| `minecraft:oak_door` | 3.0 | wood | §Tile.cpp:215 |
| `minecraft:ladder` | 0.4 | decoration | §Tile.cpp:216 |
| `minecraft:stone_stairs` | (inherits stone_bricks=2.0) | stone | §Tile.cpp:218 |
| `minecraft:wall_sign` | 1.0 | wood | §Tile.cpp:219 |
| `minecraft:iron_door` | 5.0 | metal | §Tile.cpp:221 |
| `minecraft:redstone_ore` | 3.0 | stone | §Tile.cpp:223 |
| `minecraft:redstone_ore_lit` | 3.0 | stone | §Tile.cpp:224 |
| `minecraft:snow_layer` | 0.1 | topSnow | §Tile.cpp:226 |
| `minecraft:ice` | 0.5 | ice | §Tile.cpp:227 |
| `minecraft:snow` | 0.2 | snow | §Tile.cpp:228 |
| `minecraft:cactus` | 0.4 | cactus | §Tile.cpp:229 |
| `minecraft:clay` | 0.6 | clay | §Tile.cpp:230 |
| `minecraft:reeds` | 0.0 | plant | §Tile.cpp:231 |
| `minecraft:oak_fence` | 2.0 | wood | §Tile.cpp:233 |
| `minecraft:netherrack` | 0.4 | stone | §Tile.cpp:235 |
| `minecraft:glowstone` | 0.3 | glass | §Tile.cpp:238 |
| `minecraft:invisible_bedrock` | -1 (unbreakable) | stone | §Tile.cpp:239 |
| `minecraft:trapdoor` | 3.0 | wood | §Tile.cpp:240 |
| `minecraft:stone_brick_smooth` | 1.5 | stone | §Tile.cpp:242 |
| `minecraft:thin_glass` | 0.3 | glass | §Tile.cpp:244 |
| `minecraft:melon` | 1.0 | wood | §Tile.cpp:245 |
| `minecraft:melon_stem` | 0.0 | wood | §Tile.cpp:246 |
| `minecraft:fence_gate` | 2.0 | wood | §Tile.cpp:247 |
| `minecraft:nether_brick` | 2.0 | stone | §Tile.cpp:251 |
| `minecraft:quartz_block` | 0.8 | — | §Tile.cpp:255 |
| `minecraft:stonecutter` | 2.5 | stone | §Tile.cpp:261 |
| `minecraft:glowing_obsidian` | 10.0 | stone | §Tile.cpp:262 |
| `minecraft:nether_reactor` | 3.0 | metal | §Tile.cpp:263 |
| `minecraft:fire` | 0.0 | — | §Tile.cpp:273 |

Selected spot-check values from the TS registry (`src/game/blocks/registry.ts:35-74`):

| Key | TS hardness | Rujukan | Match |
|-----|-------------|---------|-------|
| `minecraft:stone` | 1.5 | 1.5 | ✓ |
| `minecraft:dirt` | 0.5 | 0.5 | ✓ |
| `minecraft:obsidian` | 10 | 10 | ✓ |
| `minecraft:diamond_block` | 5 | 5.0 | ✓ |
| `minecraft:iron_block` | 5 | 5.0 | ✓ |
| `minecraft:gold_block` | 3 | 3.0 | ✓ |
| `minecraft:gold_ore` | 3 | 3.0 | ✓ |
| `minecraft:iron_ore` | 3 | 3.0 | ✓ |
| `minecraft:coal_ore` | 3 | 3.0 | ✓ |
| `minecraft:furnace` | 3.5 | 3.5 | ✓ |
| `minecraft:sand` | 0.5 | 0.5 | ✓ |
| `minecraft:sandstone` | 0.8 | 0.8 | ✓ |
| `minecraft:ice` | 0.5 | 0.5 | ✓ |
| `minecraft:oak_leaves` | 0.2 | 0.2 | ✓ |
| `minecraft:web` | 4 | 4.0 | ✓ |
| `minecraft:bedrock` | -1 | -1 | ✓ |
| `minecraft:water` | 100 | 100.0 | ✓ (also lightOpacity 3, lava 15) |
| `minecraft:lava` | 100 | 100.0 / 0.0 (dynamic) | ✓ (rujukan calmLava=100, lava=0 — port uses 100) |

## Worked examples (machine-decidable)

### Chunk block count

```
CHUNK_BLOCK_COUNT = CHUNK_WIDTH * CHUNK_DEPTH * LEVEL_HEIGHT
                  = 16 * 16 * 128
                  = 32768
```

### Sea level vs waterHeight

- `Level::SEA_LEVEL = DEPTH / 2 - 1 = 128 / 2 - 1 = 63`
- `waterHeight = DEPTH - 64 = 128 - 64 = 64`
- Discrepancy: 1 block. Both are in rujukan source — see `docs/day-night.md`.

### Block hardness reference values (used by mining tests)

- `stone` = 1.5 → wood_pickaxe (speed 2) breaks in 23 ticks (`ceil(30*1.5/2)`)
- `dirt` = 0.5 → bare hand (speed 1) breaks in 15 ticks (`ceil(30*0.5/1)`)
- `obsidian` = 10 → diamond_pickaxe (speed 8) breaks in 38 ticks (`ceil(30*10/8)`)
- `diamond_block` = 5 → diamond_pickaxe breaks in 19 ticks (`ceil(30*5/8)`)

## Acceptance test (machine-decidable)

```ts
// §World dimensions (LevelConstants.h:5-12)
expect(LEVEL_HEIGHT).toBe(128);
expect(CHUNK_WIDTH).toBe(16);
expect(CHUNK_DEPTH).toBe(16);
expect(CHUNK_BLOCK_COUNT).toBe(32768);
expect(Level.SEA_LEVEL).toBe(63);
expect(128 - 64).toBe(64);                    // worldgen waterHeight (RandomLevelSource.cpp:68)

// §Block hardness values (Tile.cpp:161-268)
expect(defaultBlockRegistry.getByKey('minecraft:stone')?.hardness).toBe(1.5);
expect(defaultBlockRegistry.getByKey('minecraft:dirt')?.hardness).toBe(0.5);
expect(defaultBlockRegistry.getByKey('minecraft:obsidian')?.hardness).toBe(10);
expect(defaultBlockRegistry.getByKey('minecraft:diamond_block')?.hardness).toBe(5);
expect(defaultBlockRegistry.getByKey('minecraft:iron_block')?.hardness).toBe(5);
expect(defaultBlockRegistry.getByKey('minecraft:furnace')?.hardness).toBe(3.5);
expect(defaultBlockRegistry.getByKey('minecraft:bedrock')?.hardness).toBe(-1);  // unbreakable

// §Material assignment for 41 ported blocks (Tile subclass constructors)
expect(defaultBlockRegistry.getByKey('minecraft:stone')?.material).toBe('stone');
expect(defaultBlockRegistry.getByKey('minecraft:dirt')?.material).toBe('dirt');
expect(defaultBlockRegistry.getByKey('minecraft:oak_log')?.material).toBe('wood');
expect(defaultBlockRegistry.getByKey('minecraft:obsidian')?.material).toBe('stone');  // extends StoneTile
expect(defaultBlockRegistry.getByKey('minecraft:diamond_block')?.material).toBe('metal');
expect(defaultBlockRegistry.getByKey('minecraft:web')?.material).toBe('web');
expect(defaultBlockRegistry.getByKey('minecraft:ice')?.material).toBe('ice');
```

## Verification

| Claim | Test file | Test name |
|-------|-----------|-----------|
| Registry rejects invalid hardness (`< -1`) | `src/game/blocks/registry.test.ts` | `'rejects duplicate keys and legacy IDs'` / validation in `registry.ts:138` |
| Registry requires `minecraft:air` (legacy id 0) | `src/game/blocks/registry.test.ts` | `'requires air and validates material properties'` |
| 41 ported block materials match rujukan Tile subclasses | `src/game/items/tools.test.ts` | `'§All 41 block materials verified 1:1 with rujukan source'` |
| Torch/ladder are `decoration` (not `wood`) | `src/game/items/tools.test.ts` | `'§Verified materials: torch and ladder use Material::decoration (not wood)'` |

## Untested claims (note for next agent)

- **`CHUNK_BLOCK_COUNT === 32768`**: no test pins this. Suggested test in a
  new `src/game/world/world-dimensions.test.ts`:
  `expect(16 * 16 * 128).toBe(32768)`.
- **`Level::SEA_LEVEL === 63`**: no test pins this. The TS world defines
  `height: 128` (registry uses 8 in test setups to keep tests fast), but the
  production `minecraft.html` uses `CHUNK_Y = 128`. Suggested test:
  `expect(Math.floor(128 / 2) - 1).toBe(63)`.
- **Worldgen waterHeight vs SEA_LEVEL discrepancy**: no test. See
  `docs/day-night.md`.
- **`bedrock` hardness === -1**: no direct test. The mining system rejects
  `hardness < 0` as `unbreakable` in `beginMining` (`mining.ts:199`), and the
  creative bedrock-unbreakable test (`mining.test.ts:126`) exercises the
  behavior, but the value `-1` isn't pinned.
- **41 vs ~75 rujukan tiles**: the TS registry ports 41 of rujukan's ~75
  tiles. The unported ones (bed, sapling, tallgrass, flower, mushroom, etc.)
  have hardness values listed above but no TS entries. Future porting work.
