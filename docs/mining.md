# Mining — Survival + Creative block break

> Spec-driven port of MCPE 2013 mining (SurvivalMode + CreativeMode + Tile::getDestroyProgress).
> All constants cite the rujukan C++ source with `§File:line` and must be verified line-by-line.

## Overview

Mining is the player's interaction with a target block held under the cursor. Two game
modes drive two distinct behaviors:

- **Survival**: per-tick `destroyProgress` accumulates against `Tile::getDestroyProgress`.
  When progress reaches 1.0 the block breaks. A 5-tick `destroyDelay` is imposed after
  every break before the next break can begin.
- **Creative**: instant break on first tick (`startDestroyBlock → creativeDestroyBlock`
  immediately calls `destroyBlock`). A 10-tick `DestructionTickDelay` gates subsequent
  breaks while the player keeps the mouse held.

The port lives in `src/game/interaction/mining.ts` (TypeScript engine) and the browser
runtime (`public/minecraft.html`) drives it through the engine's `tickMining` API.

## Constants

| Constant | Value | Rujukan source |
|----------|-------|----------------|
| `SURVIVAL_DESTROY_DELAY` | `5` ticks | §SurvivalMode.cpp:45 — `destroyDelay = 5;` |
| `CREATIVE_DESTRUCTION_TICK_DELAY` (a.k.a. `DestructionTickDelay`) | `10` ticks | §CreativeMode.cpp:16 — `static const int DestructionTickDelay = 10;` |
| `DESTROY_PROGRESS_DIVISOR` | `30` | §Tile.cpp:394 — `return (player->getDestroySpeed(this) / destroySpeed) / 30.0f;` |
| `100×` fallback divisor (when `!canDestroy`) | `100` | §Tile.cpp:393 — `return 1 / destroySpeed / 100.0f;` |
| `destroyProgress` completion threshold | `1.0` | §SurvivalMode.cpp:40 — `if (destroyProgress >= 1)` |
| Step-sound tick mask | `++destroyTicks & 3 == 1` | §SurvivalMode.cpp:32 — `if ((++destroyTicks & 3) == 1)` |
| `TICKS_PER_SECOND` | `20` | §SharedConstants.h:28 + §Timer.h:10 (`Timer(20)`) |
| `MAX_TICKS_PER_UPDATE` | `10` | §Timer.h:116 |

## Formulas

### `Tile::getDestroyProgress` (§Tile.cpp:391-395)

```cpp
float Tile::getDestroyProgress(Player* player) {
    if (destroySpeed < 0) return 0;                       // bedrock, invisible_bedrock
    if (!player->canDestroy(this)) return 1 / destroySpeed / 100.0f;   // 100x slower fallback
    return (player->getDestroySpeed(this) / destroySpeed) / 30.0f;
}
```

Where:
- `destroySpeed` is the per-tile hardness (e.g. `stone = 1.5`, `dirt = 0.5`, `obsidian = 10`).
  See §Tile.cpp:161-268 for every `setDestroyTime(...)` call.
- `player->canDestroy(this)` resolves through `Player::canDestroy -> Inventory::canDestroy`
  (§Player.cpp:563-565, §Inventory.cpp:307-313). Returns `true` when the tile material is
  always-destroyable, or the equipped tool's `canDestroySpecial(tile)` returns true.
- `player->getDestroySpeed(this)` is `Inventory::getDestroySpeed(tile)` (§Player.cpp:556-561),
  which returns 1.0 for a bare hand (§Inventory.cpp:316-323) or the tool's per-material
  destroy speed multiplier (see `docs/tools.md`).

### Per-tick survival mining (§SurvivalMode.cpp:18-50)

```
if (destroyDelay > 0) { destroyDelay--; return; }          // skip tick, decrement delay
if (target == same) {
    destroyProgress += tile.getDestroyProgress(player);     // Tile.cpp:391-395
    if ((++destroyTicks & 3) == 1) play step sound;         // every 4th tick
    if (destroyProgress >= 1) {
        destroyBlock(x, y, z, face);                        // SurvivalMode.cpp:57-76
        destroyProgress = 0;
        oDestroyProgress = 0;
        destroyTicks = 0;
        destroyDelay = 5;                                   // SurvivalMode.cpp:45
    }
} else {
    destroyProgress = 0;                                   // re-target, reset
    destroyTicks = 0;
    xDestroyBlock = x; yDestroyBlock = y; zDestroyBlock = z;
}
```

### Per-tick creative mining (§CreativeMode.cpp:23-46)

```
startDestroyBlock: creativeDestroyBlock -> destroyBlock instantly; destroyDelay = 10
continueDestroyBlock:
    destroyDelay--;
    if (destroyDelay <= 0) {
        destroyDelay = DestructionTickDelay;  // =10
        creativeDestroyBlock;
    }
```

There is **no** `mineBlock` call in creative (§CreativeMode.cpp:31-38 has no `item->mineBlock`),
so creative mining does **not** damage the held tool. See `docs/durability.md`.

## Tick-count closed forms

For a block of hardness `H` mined with player destroy speed `S` and `canDestroy=true`:

```
perTick = (S / H) / 30
ticksToBreak = ceil(1 / perTick) = ceil(30 * H / S)
```

For the `!canDestroy` fallback (bare hand on stone, etc.):

```
perTick = (1 / H) / (30 * 100) = 1 / (H * 3000)
ticksToBreak = ceil(H * 3000)
```

### Worked examples (machine-decidable)

| Block | Hardness | Tool | playerDestroySpeed | canDestroy | perTick | Ticks to break | Wall-clock (20 tps) |
|-------|----------|------|--------------------|------------|---------|----------------|---------------------|
| stone | 1.5 | wood_pickaxe | 2 | true | 2/1.5/30 = 0.0444... | `ceil(30*1.5/2) = 23` | 1.15 s |
| dirt | 0.5 | bare hand | 1 | true | 1/0.5/30 = 0.0666... | `ceil(30*0.5/1) = 15` | 0.75 s |
| stone | 1.5 | bare hand | 1 | **false** | 1/1.5/3000 = 0.000222... | `ceil(4500) = 4500` | 225 s (100x penalty) |
| obsidian | 10 | diamond_pickaxe | 8 | true | 8/10/30 = 0.0266... | `ceil(30*10/8) = 38` | 1.9 s |
| obsidian | 10 | wood_pickaxe | 2 | **false** (tier gate) | 1/10/3000 | `ceil(30000) = 30000` | 1500 s |

Note: `dirt+bare_hand` closed form is `15` ticks, but the TS test suite uses an
FP-accumulation helper `ticksToBreak(0.5, 1)` that returns `16` (because the
loop accumulates FP error one tick longer than the pure closed form). The TS
engine follows the same FP-accumulation pattern, so the engine's actual break
time is `16` ticks for `dirt + bare_hand`. The acceptance test below pins the
value the engine produces, not the closed form.

## Acceptance test (machine-decidable)

```ts
// §Tick count for stone + wood_pickaxe
expect(ticksToBreak(1.5, 2)).toBe(23);

// §Engine-level: 22 ticks of mining -> still mining, 23rd tick -> broken
const engine = makeGroundedEngine('survival');
engine.world.setBlock({ x: 2, y: 1, z: 1 }, 1);
engine.startMining({ x: 2, y: 1, z: 1 });
expect(engine.tickMining(22, { x: 2, y: 1, z: 1 }).status).toBe('mining');
expect(engine.tickMining(1,  { x: 2, y: 1, z: 1 }).status).toBe('broken');

// §Survival destroyDelay is exactly 5 ticks (rujukan SurvivalMode.cpp:45)
expect(SURVIVAL_DESTROY_DELAY).toBe(5);

// §Creative destruction delay is exactly 10 ticks (rujukan CreativeMode.cpp:16)
expect(CREATIVE_DESTRUCTION_TICK_DELAY).toBe(10);

// §Creative: instant break on first tick
const e = makeGroundedEngine('creative');
e.world.setBlock({ x: 2, y: 1, z: 1 }, 1);
e.startMining({ x: 2, y: 1, z: 1 });
expect(e.tickMining(1, { x: 2, y: 1, z: 1 }).status).toBe('broken');
```

## Verification

| Claim | Test file | Test name |
|-------|-----------|-----------|
| stone + wood_pickaxe breaks in 23 ticks (survival) | `src/game/engine.test.ts` | `'survival: rujukan per-tick destroyProgress — stone with wood pickaxe breaks in 23 ticks'` |
| stone + wood_pickaxe breaks in 23 ticks (controller) | `src/game/interaction/controller.test.ts` | `'survival: rujukan destroyProgress formula — stone with wood pickaxe breaks in 23 ticks'` |
| `SURVIVAL_DESTROY_DELAY === 5` | `src/game/interaction/controller.test.ts` | `'survival: 5-tick destroyDelay after break (rujukan SurvivalMode.cpp)'` |
| `CREATIVE_DESTRUCTION_TICK_DELAY === 10` + instant break | `src/game/interaction/controller.test.ts` | `'creative: instant break first tick, 10-tick cooldown after (rujukan CreativeMode.cpp)'` |
| Creative bedrock unbreakable | `src/game/interaction/mining.test.ts` | `'creative: bedrock still unbreakable (beginMining rejects before session)'` |
| `TICKS_PER_SECOND === 20` | `src/game/interaction/controller.test.ts` | `'TICKS_PER_SECOND matches rujukan Timer.h (20 tps)'` |
| Target-change cancels mining | `src/game/interaction/mining.test.ts` | `'cancels if the player changes target or the block changes'` |

## Untested claims (note for next agent)

- **100x fallback formula**: there is no test that asserts `stone + bare_hand = 4500`
  ticks (the helper function `ticksToBreakBareHand` exists in `mining.test.ts` but is
  never invoked). The TS engine encodes the formula in `mining.ts:158` but it isn't
  exercised end-to-end. Suggested test:
  `engine.tickMining(4499, target).status === 'mining' && engine.tickMining(1, target).status === 'broken'`
  with bare-hand tool (`tool: null`).
- **`dirt + bare_hand = 16` ticks**: not directly asserted as a tick count. The
  per-tick FP accumulation matches the helper but no test pins the count.
- **`++destroyTicks & 3 == 1` step-sound**: browser port doesn't replicate the step
  sound; no test.
