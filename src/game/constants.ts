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

// === Entity / Mob constants (Entity.h + Mob.h + animal/monster sources) ===
// Grouped here so the renderer/serialization layers can import a single file.

/** §Entity.h:27 — `static const int TOTAL_AIR_SUPPLY = 15 * SharedConstants::TicksPerSecond;`
 *  = 15 * 20 = 300 ticks (15 seconds of breath). */
export const TOTAL_AIR_SUPPLY = 15 * TICKS_PER_SECOND;

/** §Entity.h:222 — `static const int DATA_AIR_SUPPLY_ID = 1;` — SynchedEntityData slot
 *  carrying the air-supply short (mirrored from Entity.h protected section). */
export const DATA_AIR_SUPPLY_ID = 1;

/** §Mob.h:27 — `static const int ATTACK_DURATION = 5;` — base attack animation length. */
export const ATTACK_DURATION = 5;

/** §Mob.h:28 — `static const int SWING_DURATION = 8;` — arm-swing animation length (§Mob.cpp:1082). */
export const SWING_DURATION = 8;

/** §Mob.cpp:81 — `int Mob::getMaxSpawnClusterSize() { return 4; }` — pack spawn cap. */
export const MAX_SPAWN_CLUSTER_SIZE = 4;

/** §Mob.cpp:854-857 — `int Mob::getMaxHeadXRot() { return 10; }` — lookAt pitch clamp. */
export const MAX_HEAD_X_ROT = 10;

/** §Mob.cpp:142-144 — `int Monster::getAttackTime() { return 20; }` — monster attack cooldown. */
export const MONSTER_ATTACK_TIME = 20;

/** §Mob.cpp:769 — `float lookDistance = 8;` — legacy AI player-look distance. */
export const MOB_LOOK_DISTANCE = 8;

/** §Mob.cpp:1057 — `if (removeIfFar && sd > 96*96) remove();` — far despawn radius. */
export const MOB_DESPAWN_FAR = 96;
/** §Mob.cpp:1062 — `if (sd > 32*32) remove();` — idle despawn radius. */
export const MOB_DESPAWN_IDLE = 32;
/** §Mob.cpp:1062 — `noActionTime > 30 * TPS` — idle despawn grace period. */
export const MOB_IDLE_DESPAWN_TICKS = 30 * TICKS_PER_SECOND;

/** §PathfinderMob.h:24 — `static const int MAX_TURN = 30;` — per-tick yaw clamp when following a path. */
export const PATHFINDER_MAX_TURN = 30;

/** §AgableMob.h:25 — `static const int DATA_FLAGS_ID = 14;` — baby-flag byte in SynchedEntityData. */
export const AGABLE_DATA_FLAGS_ID = 14;
/** §AgableMob.h:27 — `static const int DATAFLAG_ISBABY = 0;` — baby bit position. */
export const AGABLE_DATAFLAG_ISBABY = 0;

/** §Pig.h:13 — `static const int DATA_SADDLE_ID = 16;` — saddle byte in SynchedEntityData. */
export const PIG_DATA_SADDLE_ID = 16;

/** §Sheep.h:24 — `static const int EAT_ANIMATION_TICKS = SharedConstants::TicksPerSecond * 2;`
 *  = 40 ticks (2 seconds) per grass-eat cycle. */
export const EAT_ANIMATION_TICKS = TICKS_PER_SECOND * 2;
/** §Sheep.h:25 — `static const int DATA_WOOL_ID = 16;` — wool-color byte (low nibble: color, 0x10: sheared). */
export const SHEEP_DATA_WOOL_ID = 16;
/** §Sheep.cpp:23 — `static const int NumColors = ...;` = 16 wool colors. */
export const SHEEP_NUM_COLORS = 16;

/** §Creeper.h:42 — `static const int DATA_SWELL_DIR = 16;` — swell direction byte in SynchedEntityData. */
export const CREEPER_DATA_SWELL_DIR = 16;
/** §Creeper.h:43 — `static const int MAX_SWELL = 30;` — ticks to detonation. */
export const CREEPER_MAX_SWELL = 30;
/** §Creeper.cpp:88 — `level->explode(this, x, y, z, 2.4f);` — creeper explosion power. */
export const CREEPER_EXPLOSION_POWER = 2.4;

/** §Spider.h:16 — `static const int DATA_FLAGS_ID = 16;` — climbing-flag byte in SynchedEntityData. */
export const SPIDER_DATA_FLAGS_ID = 16;
/** §Spider.cpp:49-58 — climbing flag bit position (0). */
export const SPIDER_FLAG_CLIMBING = 0;

/** §SharedFlags.h:15 — `static const unsigned int DATA_SHARED_FLAGS_ID = 0;` — shared-flags byte. */
export const DATA_SHARED_FLAGS_ID = 0;

/** §Chicken.cpp:19 — egg timer base: `TPS * 60 * 5` = 6000 ticks (5 min minimum). */
export const CHICKEN_EGG_TIME_MIN_TICKS = TICKS_PER_SECOND * 60 * 5;
/** §Chicken.cpp:19 — egg timer random spread: `TPS * 60 * 5` = 6000 ticks (5 min variance). */
export const CHICKEN_EGG_TIME_RANGE_TICKS = TICKS_PER_SECOND * 60 * 5;

/** §Skeleton.cpp:79 — `attackTime = SharedConstants::TicksPerSecond * 3;` — skeleton ranged cooldown. */
export const SKELETON_RANGED_COOLDOWN_TICKS = TICKS_PER_SECOND * 3;

// === Default mob speeds (§Mob.cpp:41-43) ===
/** §Mob.cpp:41 — `runSpeed(0.7f)` — default run speed for non-monster mobs. */
export const DEFAULT_RUN_SPEED = 0.7;
/** §Mob.cpp:42 — `walkingSpeed(0.1f)` — default walkingSpeed. */
export const DEFAULT_WALKING_SPEED = 0.1;
/** §Mob.cpp:43 — `flyingSpeed(0.02f)` — default flyingSpeed. */
export const DEFAULT_FLYING_SPEED = 0.02;

/** §Mob.cpp:92 — `float speed = 0.7f;` in getWalkingSpeedModifier (MCPE override). */
export const MOB_WALK_SPEED_MODIFIER = 0.7;

/** §Mob.h:81 — `virtual int getMaxHealth() { return 10; }` — default Mob max health. */
export const DEFAULT_MOB_MAX_HEALTH = 10;

/** §Mob.cpp:844-847 — `yd = 0.42f;` — jump-from-ground Y velocity. */
export const MOB_JUMP_VELOCITY = 0.42;
/** §Mob.cpp:481 — `yd += 0.4f;` in knockback — knockback upward thrust. */
export const MOB_KNOCKBACK_Y = 0.4;
/** §Mob.cpp:474 — `float pow = 0.4f;` — knockback horizontal strength. */
export const MOB_KNOCKBACK_POW = 0.4;
/** §Mob.cpp:476-478 — `xd *= 0.5f; yd *= 0.5f; zd *= 0.5f;` — knockback velocity halving. */
export const MOB_KNOCKBACK_VEL_DAMP = 0.5;
