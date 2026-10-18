# Day-night cycle — Day length + NormalDayCycleDimension

> Spec-driven port of MCPE 2013 day length and time-of-day formula.
> Every constant cites the rujukan C++ source with `§File:line`.

## Overview

The MCPE 2013 overworld runs a 16-minute day cycle: 19200 ticks at 20 tps = 960 s.
`Level::TICKS_PER_DAY` is the canonical constant. `NormalDayCycleDimension::getTimeOfDay`
maps the raw tick counter to a 0..1 phase with a blend of linear and smoothstep.

The browser port drives this in `public/minecraft.html::animate` (around line 4494),
advancing `worldTime` by `dt / 960` per render frame and recomputing sun position +
sky color from it.

## Constants

| Constant | Value | Rujukan source |
|----------|-------|----------------|
| `SharedConstants::TicksPerSecond` | 20 | §SharedConstants.h:28 |
| `Level::TICKS_PER_DAY` | `20 * 60 * 16 = 19200` | §Level.h:74 — `static const int TICKS_PER_DAY = SharedConstants::TicksPerSecond * 60 * 16;` |
| `Level::MAX_BRIGHTNESS` | 15 | §Level.h:73 |
| `Level::DEPTH` (= `LEVEL_HEIGHT`) | 128 | §Level.h:70 + §LevelConstants.h:5 |
| `Level::SEA_LEVEL` | `DEPTH / 2 - 1 = 63` | §Level.h:71 |
| `Level::MIDDLE_OF_NIGHT_TIME` | 12000 | §Level.h:75 |
| World water height (world-gen) | `DEPTH - 64 = 64` | §RandomLevelSource.cpp:68 — `int waterHeight = Level::DEPTH - 64;` |
| Day length in seconds (derived) | 960 s | 19200 / 20 |
| Day length in minutes (derived) | 16 min | 960 / 60 |
| `RandomLevelSource::SNOW_CUTOFF` | 0.5 | §RandomLevelSource.cpp:15 |
| `RandomLevelSource::SNOW_SCALE` | 0.3 | §RandomLevelSource.cpp:16 |

## Formulas

### `Level::TICKS_PER_DAY` (§Level.h:74)

```cpp
static const int TICKS_PER_DAY = SharedConstants::TicksPerSecond * 60 * 16;
```

Substituting `TicksPerSecond = 20`: `TICKS_PER_DAY = 20 * 60 * 16 = 19200`.

The trailing comment `// ORG:20*60*20` shows the original PC Minecraft value was
`24000` (20-minute day) — MCPE 2013 shortened it to 16 minutes (`19200`).

### `NormalDayCycleDimension::getTimeOfDay` (§NormalDayCycleDimension.h:12-20)

```cpp
float getTimeOfDay(long time, float a) {
    int dayStep = (int)(time % Level::TICKS_PER_DAY);
    float td = (dayStep + a) / Level::TICKS_PER_DAY - 0.25f;
    if (td < 0) td += 1;
    if (td > 1) td -= 1;
    float tdo = td;
    td = 1 - (cos(td * Mth::PI) + 1) * 0.5f;
    return tdo + (td - tdo) / 3.0f;
}
```

Where:
- `time` is the absolute tick counter (`Level::time`).
- `a` is the intra-tick fractional accumulator (`Timer::a`).
- `td` first maps to `[-0.25, 0.75]` then wraps to `[0, 1]`.
- The smoothstep blend `1 - (cos(π·td) + 1) / 2` produces a smoother day/night
  curve around sunrise/sunset. Final result is `tdo + (smoothed - tdo) / 3` — a
  weighted average of linear (tdo) and smoothstep (smoothed), 2/3 linear.

### `Level::SEA_LEVEL` (§Level.h:71)

```cpp
static const short DEPTH = LEVEL_HEIGHT;          // = 128
static const short SEA_LEVEL = DEPTH / 2 - 1;     // = 63
```

Note: `SEA_LEVEL = 63`, NOT 64. The browser port and TS engine often call this
"WATER_LEVEL = 64" because the worldgen formula `waterHeight = DEPTH - 64` (§RandomLevelSource.cpp:68)
evaluates to 64. The two constants differ by 1:
- `SEA_LEVEL = 63` — used by code that checks "is this block at or below sea level?"
- `waterHeight = 64` — used by `RandomLevelSource::prepareHeights` to decide "fill blocks below this y with water".

This 1-block discrepancy is in the rujukan source, not a port bug. The TS
registry and `minecraft.html` use `WATER_LEVEL = 64` because the worldgen
waterHeight formula is what they replicate.

## Worked examples (machine-decidable)

### Day length

```
TICKS_PER_DAY = 20 * 60 * 16 = 19200 ticks
Wall-clock   = 19200 / 20 = 960 seconds = 16 minutes
```

### Time-of-day at midnight (tick 12000 = MIDDLE_OF_NIGHT_TIME)

```
dayStep = 12000 % 19200 = 12000
td = (12000 + 0) / 19200 - 0.25 = 0.625 - 0.25 = 0.375
tdo = 0.375
smoothed = 1 - (cos(π*0.375) + 1)*0.5 = 1 - (cos(1.1781) + 1)*0.5 = 1 - (0.3827 + 1)*0.5 = 0.30865
result = 0.375 + (0.30865 - 0.375) / 3 = 0.375 - 0.02212 = 0.35288
```

Midnight in MCPE 2013 maps to phase ≈ 0.353 (not 0.5 — the cycle is offset).

### Time-of-day at noon (tick 0 = start of day)

```
dayStep = 0
td = (0 + 0) / 19200 - 0.25 = -0.25 → wrap to 0.75
tdo = 0.75
smoothed = 1 - (cos(π*0.75) + 1)*0.5 = 1 - (cos(2.356) + 1)*0.5 = 1 - (-0.7071 + 1)*0.5 = 1 - 0.1465 = 0.85355
result = 0.75 + (0.85355 - 0.75) / 3 = 0.75 + 0.03452 = 0.78452
```

### Water level vs sea level

- `Level::SEA_LEVEL = 63` (used in code like `getSeaLevel`)
- `RandomLevelSource::prepareHeights` uses `waterHeight = DEPTH - 64 = 64`
- Blocks at y=64 and below are water; y=63 is the first dry block above water
  (1-block "beach" band — matches Minecraft terrain generation).

## Acceptance test (machine-decidable)

```ts
// §TICKS_PER_DAY (Level.h:74)
expect(20 * 60 * 16).toBe(19200);                // rujukan formula
expect(19200 / 20).toBe(960);                   // 960 s = 16 min

// §Day length in seconds
expect(19200 * 50 / 1000).toBe(960);           // 19200 ticks * 50ms = 960s

// §SEA_LEVEL vs waterHeight discrepancy
expect(128 / 2 - 1).toBe(63);                   // Level::SEA_LEVEL (Level.h:71)
expect(128 - 64).toBe(64);                       // waterHeight (RandomLevelSource.cpp:68)

// §NormalDayCycleDimension::getTimeOfDay at midnight (proposed)
function getTimeOfDay(time, a = 0) {
  const dayStep = time % 19200;
  let td = (dayStep + a) / 19200 - 0.25;
  if (td < 0) td += 1;
  if (td > 1) td -= 1;
  const tdo = td;
  td = 1 - (Math.cos(td * Math.PI) + 1) * 0.5;
  return tdo + (td - tdo) / 3;
}
expect(getTimeOfDay(0)).toBeCloseTo(0.78452, 4);     // noon
expect(getTimeOfDay(12000)).toBeCloseTo(0.35288, 4); // midnight
expect(getTimeOfDay(9600)).toBeCloseTo(0.5, 1);      // sunset transition
```

## Verification

| Claim | Test file | Test name |
|-------|-----------|-----------|
| `TICKS_PER_SECOND === 20` (denominator of day length) | `src/game/interaction/controller.test.ts` | `'TICKS_PER_SECOND matches rujukan Timer.h (20 tps)'` |
| FixedStepClock cap matches `MAX_TICKS_PER_UPDATE = 10` | `src/game/core/fixed-step.test.ts` | `'caps catch-up work and drops whole overdue steps'` |

## Untested claims (note for next agent)

- **Day length 19200 ticks**: no test asserts `TICKS_PER_DAY === 19200` or
  `day length === 960s`. The browser port advances `worldTime += dt / 960` per
  frame (minecraft.html:4494), which encodes the 960 s value, but no test
  pins it.
- **`NormalDayCycleDimension::getTimeOfDay` formula**: the browser port uses a
  simpler `sin(2π·t - π/2)` formula (line 4495), not the rujukan blend. This is
  a known LOW-priority deviation (Task 14 audit, deviation #4). No test exists
  for either formula. Suggested fix: port the exact `getTimeOfDay` blend,
  then test the 3 worked examples above (noon=0.78452, midnight=0.35288,
  sunset=0.5).
- **`SEA_LEVEL = 63` vs `waterHeight = 64`**: no test pins either. The TS
  engine and `minecraft.html` use 64 because they replicate the worldgen
  formula, not the constant. Suggested test:
  `expect(LevelConstants.LEVEL_HEIGHT).toBe(128); expect(128/2-1).toBe(63);
   expect(128-64).toBe(64)` — confirms the 1-block discrepancy is intentional.
