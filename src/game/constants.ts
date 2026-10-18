// §MCPE 2013 rujukan constants — centralized, testable.
//
// Every constant here is verified 1:1 against the rujukan C++ source.
// Citation format: §File:line — see docs/ for full spec per system.
//
// Rule Zero: read source line-by-line, don't guess.

// === Tick timing (SharedConstants.h + Timer.h) ===
/** §SharedConstants.h:28 — `const int TicksPerSecond = 20;`
 *  Also §Timer.h constructor in Minecraft.cpp:153 — `timer(20)`. */
export const TICKS_PER_SECOND = 20;

/** §Level.h:74 — `static const int TICKS_PER_DAY = SharedConstants::TicksPerSecond * 60 * 16;`
 *  = 20 * 60 * 16 = 19200 ticks per full day/night cycle. */
export const TICKS_PER_DAY = 19200;

/** Derived: TICKS_PER_DAY / TICKS_PER_SECOND = 19200 / 20 = 960 seconds = 16 minutes. */
export const SECONDS_PER_DAY = TICKS_PER_DAY / TICKS_PER_SECOND; // 960

// === Mining timing (SurvivalMode.cpp + CreativeMode.cpp) ===
/** §SurvivalMode.cpp:48 — `destroyDelay = 5;` after block break. */
export const SURVIVAL_DESTROY_DELAY = 5;

/** §CreativeMode.cpp:11 — `static const int DestructionTickDelay = 10;` between breaks. */
export const CREATIVE_DESTRUCTION_TICK_DELAY = 10;

/** §Tile.cpp:394 — `return (player->getDestroySpeed(this) / destroySpeed) / 30.0f;` */
export const DESTROY_PROGRESS_DIVISOR = 30;

// === World dimensions (LevelConstants.h + Level.h) ===
/** §LevelConstants.h:5 — `const int LEVEL_HEIGHT = 128;` */
export const LEVEL_HEIGHT = 128;

/** §LevelConstants.h:7 — `const int CHUNK_WIDTH = 16;` (in blocks) */
export const CHUNK_WIDTH = 16;

/** §LevelConstants.h:8 — `const int CHUNK_DEPTH = 16;` (in blocks) */
export const CHUNK_DEPTH = 16;

/** §Level.h:70-71 — `DEPTH = LEVEL_HEIGHT; SEA_LEVEL = DEPTH / 2 - 1;` = 128 / 2 - 1 = 63. */
export const SEA_LEVEL = 63;

/** §RandomLevelSource.cpp:68 — `int waterHeight = Level::DEPTH - 64;` = 128 - 64 = 64.
 *  Note: This is the water *surface* height used in world gen, distinct from
 *  SEA_LEVEL (63) which is the brightness/flood level. minecraft.html calls
 *  this WATER_LEVEL = 64. */
export const WATER_LEVEL = 64;

/** §Level.h:73 — `static const int MAX_BRIGHTNESS = 15;` */
export const MAX_BRIGHTNESS = 15;

// === Per-face brightness (TileRenderer.cpp:54-57) ===
/** §TileRenderer.cpp:54 — `float c10 = 0.5f;` (DOWN face brightness multiplier). */
export const FACE_BRIGHTNESS_DOWN = 0.5;

/** §TileRenderer.cpp:55 — `float c11 = 1;` (UP face brightness multiplier). */
export const FACE_BRIGHTNESS_UP = 1.0;

/** §TileRenderer.cpp:56 — `float c2 = 0.8f;` (NORTH + SOUTH face brightness multiplier). */
export const FACE_BRIGHTNESS_NS = 0.8;

/** §TileRenderer.cpp:57 — `float c3 = 0.6f;` (WEST + EAST face brightness multiplier). */
export const FACE_BRIGHTNESS_WE = 0.6;

// === Player physics (Mob.cpp + Player.cpp + LocalPlayer.cpp) ===
/** §Mob.cpp:619 — `yd -= 0.08f;` (gravity per tick). */
export const GRAVITY_PER_TICK = 0.08;

/** §Mob.cpp:620 — `yd *= 0.98f;` (air drag per tick). */
export const AIR_DRAG_PER_TICK = 0.98;

/** §Mob.cpp:845 — `yd = 0.42f;` in jumpFromGround. */
export const JUMP_VELOCITY = 0.42;

/** §Mob.cpp:727 — `xxa *= 0.98f; yya *= 0.98f;` (input decay per tick). */
export const INPUT_DECAY = 0.98;

/** §Mob.cpp:754 — `yRotA *= 0.9f;` (yaw rotation decay per tick). */
export const YAW_ROT_DECAY = 0.9;

/** §LocalPlayer.cpp:199 — `yd += 0.15f;` (fly upward thrust per tick). */
export const FLY_THRUST = 0.15;

/** §LocalPlayer.cpp:189 — `if (jumpTriggerTime <= 0) jumpTriggerTime = 7;`
 *  7-tick window for double-jump fly toggle (350ms at 20 tps). */
export const JUMP_TRIGGER_TIME = 7;

/** §Player.cpp:370 — `yd = ydo * 0.6f;` (fly vertical damping, OVERWRITE not multiply). */
export const FLY_VERTICAL_DAMPING = 0.6;

/** §Mob.cpp:595 — friction2 formula constant numerator:
 *  `(0.6f * 0.6f * 0.91f * 0.91f * 0.6f * 0.91f) / (friction * friction * friction)` */
export const FRICTION2_NUMERATOR = 0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91;
