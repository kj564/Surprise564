# Physics — Mob::travel + Player::travel + jumpFromGround + aiStep

> Spec-driven port of MCPE 2013 player physics (Mob + Player + LocalPlayer).
> Every constant cites the rujukan C++ source with `§File:line`.

## Overview

MCPE 2013 physics runs on a fixed 20-tick-per-second loop. Each tick the player's
input is read, `Mob::aiStep` updates input decays + handles jumping + fly thrust,
and `Mob::travel` integrates the velocity through `moveRelative + move + gravity +
drag`. The browser port replicates this in `public/minecraft.html::movePlayerTick`
(~line 3958).

There are TWO physics implementations in this repo:
- `src/game/physics/player-physics.ts` — the TS engine's abstract PlayerPhysics
  class (used by tests). Uses per-second units (gravity=24, jumpSpeed=8).
- `public/minecraft.html` — the live browser game. Uses per-tick units matching
  rujukan (gravity=0.08, jumpSpeed=0.42, airDrag=0.98).

This spec documents the **per-tick rujukan values** that the browser port replicates.
The TS engine's per-second constants are a separate abstraction (documented in
the source file but not 1:1 with rujukan — they're a numeric remapping).

## Constants

| Constant | Value | Rujukan source |
|----------|-------|----------------|
| `TicksPerSecond` | 20 | §SharedConstants.h:28 |
| `Timer(20)` constructor call | 20 tps | §Timer.h:10 (used at `Minecraft.cpp:153`) |
| `MAX_TICKS_PER_UPDATE` | 10 | §Timer.h:116 |
| `TICK_MS` (derived) | 50 ms | 1000 / 20 |
| Gravity per tick | `0.08` | §Mob.cpp:620 — `yd -= 0.08f;` (called in land branch only) |
| Air drag per tick | `0.98` | §Mob.cpp:621 — `yd *= 0.98f;` |
| Water damping per tick | `0.80` | §Mob.cpp:565-567 |
| Lava damping per tick | `0.50` | §Mob.cpp:577-579 |
| Water/lava buoyancy | `0.02` downward | §Mob.cpp:568, §Mob.cpp:580 |
| Water/lava bounce on horizontal collision | `0.3` upward | §Mob.cpp:571, §Mob.cpp:583 |
| `jumpFromGround` yd | `0.42` | §Mob.cpp:846 — `yd = 0.42f;` |
| Water/lava swim jump thrust | `0.04` per tick | §Mob.cpp:719-722 |
| Input decay `xxa` per tick | `0.98` | §Mob.cpp:727 — `xxa *= 0.98f;` |
| Input decay `yya` per tick | `0.98` | §Mob.cpp:728 — `yya *= 0.98f;` |
| Input decay `yRotA` per tick | `0.9` | §Mob.cpp:729 — `yRotA *= 0.9f;` |
| Ground friction (default tile) | `0.6` | §Tile.cpp:328 — `friction(0.6f)` |
| Air friction factor | `0.91` | §Mob.cpp:586 — `float friction = 0.91f;` |
| Ground friction factor | `0.6 * 0.91` | §Mob.cpp:588 — `friction = 0.6f * 0.91f;` |
| Per-tile friction override | `Tile::tiles[t]->friction * 0.91f` | §Mob.cpp:591 |
| Player fly damping (overwrite, not multiply) | `yd = ydo * 0.6f` | §Player.cpp:370 |
| Player fly speed (when flying) | `0.05` | §Player.cpp:368 — `flyingSpeed = 0.05f;` |
| Fly vertical thrust up (Space/wantUp) | `+0.15` per tick | §LocalPlayer.cpp:194 — `yd += 0.15f;` |
| Fly vertical thrust down (Shift/wantDown) | `-0.15` per tick | §LocalPlayer.cpp:198 — `yd -= 0.15f;` |
| `jumpTriggerTime` window (double-tap fly toggle) | `7` ticks | §LocalPlayer.cpp:186 — `jumpTriggerTime = 7;` |
| Ladder descent cap | `-0.15` yd | §Mob.cpp:609 — `if (yd < -0.15) yd = -0.15f;` |
| Ladder climb bounce on horizontal collision | `0.2` yd | §Mob.cpp:617 — `yd = 0.2f;` |

## Formulas

### `Mob::travel` land branch (§Mob.cpp:558-626)

```
float friction = 0.91f;
if (onGround) {
    friction = 0.6f * 0.91f;
    int t = level->getTile(...);
    if (t > 0) friction = Tile::tiles[t]->friction * 0.91f;
}
float friction2 = (0.6f * 0.6f * 0.91f * 0.91f * 0.6f * 0.91f) / (friction*friction*friction);
moveRelative(xa, ya, onGround ? walkingSpeed * friction2 : flyingSpeed);

// recompute friction (Mob.cpp:598-605 — friction computed TWICE in rujukan)
friction = 0.91f;
if (onGround) friction = 0.6f * 0.91f;  // (+ per-tile override if t>0)

move(xd, yd, zd);                  // Y first, then X, then Z (Entity::move order)
yd -= 0.08f;                       // gravity
yd *= 0.98f;                       // air drag
xd *= friction;
zd *= friction;
```

### `friction2` constant

The numerator `0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91` is constant. Its value is:

```
0.6^3 * 0.91^3 = 0.216 * 0.753571 = 0.162771336...
```

So on a default-friction ground (`friction = 0.6 * 0.91 = 0.546`):

```
friction2 = 0.162771336 / (0.546^3) = 0.162771336 / 0.162771336 = 1.0
```

That is: with default ground friction, `friction2 = 1.0` exactly. Walking speed
multiplied by 1.0 is just walking speed. This is the rujukan "calibrated" default.

On ice (`friction = 0.98 * 0.91`), `friction2 ≈ 0.162771336 / 0.789^3 ≈ 0.331`
— ice actually reduces ground acceleration? No: ice friction is `0.98`, so
ground friction becomes `0.98 * 0.91 = 0.8918`, and `friction2 = 0.162771336 /
0.8918^3 = 0.2298` — still less than 1. But the player keeps momentum because
`xd *= friction` per tick only damps by `0.8918` instead of `0.546`. Net effect:
ice sliding is from low per-tick damping, not high `friction2`.

### `Mob::aiStep` (§Mob.cpp:688-757)

```
if (isImmobile) { jumping=false; xxa=yya=yRotA=0; }
else { run AI; }

if (jumping) {
    if (inWater)      yd += 0.04;
    else if (inLava)  yd += 0.04;
    else if (onGround) jumpFromGround();     // yd = 0.42
}

xxa   *= 0.98;     // §Mob.cpp:727
yya   *= 0.98;     // §Mob.cpp:728
yRotA *= 0.9;      // §Mob.cpp:729

walkingSpeed *= getWalkingSpeedModifier();
flyingSpeed  *= getWalkingSpeedModifier();
travel(xxa, yya);
```

### `Mob::jumpFromGround` (§Mob.cpp:844-847)

```cpp
void Mob::jumpFromGround() {
    yd = 0.42f;
}
```

Single value, no water/lava branch (those are in `aiStep`'s `if (jumping)` block).

### `Player::travel` fly override (§Player.cpp:364-375)

```cpp
void Player::travel(float xa, float ya) {
    if (abilities.flying) {
        float ydo = yd;
        float ofs = flyingSpeed;
        flyingSpeed = 0.05f;
        super::travel(xa, ya);          // Mob::travel land branch (modifies yd via gravity+drag)
        yd = ydo * 0.6f;                // OVERWRITE — discards super::travel's yd changes
        flyingSpeed = ofs;
    } else {
        super::travel(xa, ya);
    }
}
```

**Critical**: this is `yd = ydo * 0.6f`, NOT `yd *= 0.6f`. The overwrite discards
the gravity+drag from `super::travel` and replaces yd with `0.6 × (yd as it was
before super::travel)`. The browser port had a bug here (Task 14) where it
multiplied, accumulating gravity in fly mode. Fixed in commit 9dd19286.

### `LocalPlayer::aiStep` fly toggle (§LocalPlayer.cpp:168-217)

```cpp
jumpTriggerTime--;     // decrement per tick (7-tick window)
ascendTriggerTime--;
descendTriggerTime--;

if (abilities.mayfly) {
    if (!wasJumping && input->jumping) {
        if (jumpTriggerTime <= 0) jumpTriggerTime = 7;     // start window
        else {
            abilities.flying = !abilities.flying;          // second press within 7 ticks -> toggle
            jumpTriggerTime = 0;
        }
    }
    if (abilities.flying) {
        if (input->wantUp)   yd += 0.15f;                  // Space
        if (input->wantDown) yd -= 0.15f;                  // Shift
    }
}

Mob::aiStep();     // base Mob::aiStep (input decay + travel)
```

## Worked examples (machine-decidable)

### Tick rate

`TicksPerSecond = 20` → `TICK_MS = 1000 / 20 = 50` ms per tick.

### Jump height

`yd₀ = 0.42`. Each subsequent tick: `yd_{n+1} = (yd_n - 0.08) * 0.98`.

Ticks until yd crosses zero (start of fall):
- yd[0] = 0.42
- yd[1] = (0.42 - 0.08) * 0.98 = 0.3332
- yd[2] = (0.3332 - 0.08) * 0.98 = 0.247736
- yd[3] = (0.247736 - 0.08) * 0.98 = 0.164181
- yd[4] = (0.164181 - 0.08) * 0.98 = 0.082497
- yd[5] = (0.082497 - 0.08) * 0.98 = 0.002447 (still positive)
- yd[6] = (0.002447 - 0.08) * 0.98 = -0.075802 (negative — falling)

Peak height ≈ sum of yd[0..5] = 0.42 + 0.3332 + 0.247736 + 0.164181 + 0.082497 + 0.002447
≈ 1.25 blocks. (Matches Minecraft player-jump of ~1.25 blocks.)

### Fly vertical thrust

Holding Space while flying: `yd_{n+1} = (yd_n + 0.15) * 0.6` (overwrite from
Player::travel). Equilibrium when `yd = (yd + 0.15) * 0.6` → `yd = 0.6 yd + 0.09`
→ `0.4 yd = 0.09` → `yd = 0.225`. So fly-up reaches terminal velocity 0.225 blocks/tick
(4.5 blocks/second).

After 1 second (20 ticks) holding Space: `yd ≈ 0.19584` (verified by Task 14
Agent Browser measurement).

## Acceptance test (machine-decidable)

The TS engine's `PlayerPhysics` class uses per-second units, not per-tick. The
rujukan per-tick constants live in `public/minecraft.html` and are NOT covered
by the test suite. The closest tests assert the TS engine's per-second values:

```ts
// §Tick rate — TS engine
expect(TICKS_PER_SECOND).toBe(20);                // src/game/interaction/mining.ts:25

// §Physics integration — TS engine's grounded state
const engine = makeGroundedEngine();
const result = engine.step(1/30, { moveX: 0, moveZ: 0, jump: false });
expect(result.clock.steps).toBe(2);               // FixedStepClock caps at 2 per 33ms
expect(result.player.onGround).toBe(true);
```

For the rujukan per-tick constants (gravity 0.08, airDrag 0.98, jump 0.42,
friction2 formula) — these are **untested** in the TS suite. They live only in
`public/minecraft.html`. Suggested acceptance tests (would need a new
`physics-rujukan.test.ts` or a benchmark snapshot of the html runtime):

```ts
// §Mob::jumpFromGround (Mob.cpp:844-847) — proposed
expect(jumpFromGround()).toBe(0.42);

// §Mob::travel land branch gravity+drag — proposed
let yd = 0.42;
for (let i = 0; i < 6; i++) yd = (yd - 0.08) * 0.98;
expect(yd).toBeLessThan(0);                       // falling after 6 ticks

// §friction2 formula (Mob.cpp:595) — proposed
const friction = 0.6 * 0.91;
const friction2 = (0.6*0.6*0.91*0.91*0.6*0.91) / (friction**3);
expect(friction2).toBeCloseTo(1.0, 6);           // default ground = 1.0 exactly

// §Player::travel fly damping — proposed
let yd = 0.15;                                   // Space thrust for one tick
yd = yd * 0.6;                                   // rujukan OVERWRITE, not multiply
expect(yd).toBeCloseTo(0.09, 6);
```

## Verification

| Claim | Test file | Test name |
|-------|-----------|-----------|
| `TICKS_PER_SECOND === 20` | `src/game/interaction/controller.test.ts` | `'TICKS_PER_SECOND matches rujukan Timer.h (20 tps)'` |
| FixedStepClock advances in fixed-size steps | `src/game/core/fixed-step.test.ts` | `'advances only in fixed-size steps and retains interpolation remainder'` |
| FixedStepClock caps catch-up at MAX_TICKS_PER_UPDATE=10 | `src/game/core/fixed-step.test.ts` | `'caps catch-up work and drops whole overdue steps'` |
| Player grounds on floor | `src/game/physics/player-physics.test.ts` | `'resolves gravity against the floor and establishes grounded state'` |
| Player jumps only when grounded | `src/game/physics/player-physics.test.ts` | `'allows jumping only from grounded state'` |
| Diagonal movement normalized | `src/game/physics/player-physics.test.ts` | `'normalizes diagonal movement to avoid faster diagonal speed'` |
| Sprint multiplier | `src/game/physics/player-physics.test.ts` | `'sprint increases horizontal speed without changing vertical physics'` |

## Untested claims (note for next agent)

The rujukan per-tick physics constants — `gravity=0.08`, `airDrag=0.98`,
`jump=0.42`, `friction2` formula, `yd = ydo * 0.6` overwrite, `jumpTriggerTime=7`,
`±0.15` fly thrust — are all encoded in `public/minecraft.html::movePlayerTick`
but have **no test coverage**. The TS engine's `PlayerPhysics` uses different
(per-second) units.

To bring the physics under test, options:
1. Extract `movePlayerTick` from `minecraft.html` into a `src/game/physics/
   rujukan-travel.ts` module that operates on per-tick numbers, then test it
   directly with the worked examples above.
2. Add an Agent Browser snapshot test that runs the live game for 60 ticks
   holding Space and asserts `player.vel.y ≈ 0.19584` (the Task 14 verification
   value). This is closer to the awesome-rea "machine-decidable" philosophy
   but couples the test to the DOM runtime.
