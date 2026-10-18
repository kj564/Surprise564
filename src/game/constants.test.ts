import { describe, expect, test } from 'bun:test';
import {
  AIR_DRAG_PER_TICK,
  CHUNK_DEPTH,
  CHUNK_WIDTH,
  CREATIVE_DESTRUCTION_TICK_DELAY,
  DESTROY_PROGRESS_DIVISOR,
  FACE_BRIGHTNESS_DOWN,
  FACE_BRIGHTNESS_NS,
  FACE_BRIGHTNESS_UP,
  FACE_BRIGHTNESS_WE,
  FLY_THRUST,
  FLY_VERTICAL_DAMPING,
  FRICTION2_NUMERATOR,
  GRAVITY_PER_TICK,
  INPUT_DECAY,
  JUMP_TRIGGER_TIME,
  JUMP_VELOCITY,
  LEVEL_HEIGHT,
  MAX_BRIGHTNESS,
  SEA_LEVEL,
  SECONDS_PER_DAY,
  SURVIVAL_DESTROY_DELAY,
  TICKS_PER_DAY,
  TICKS_PER_SECOND,
  WATER_LEVEL,
  YAW_ROT_DECAY,
} from './constants';

describe('MCPE 2013 rujukan constants (Rule Zero verified)', () => {
  test('Tick rate — §SharedConstants.h:28: TicksPerSecond = 20', () => {
    expect(TICKS_PER_SECOND).toBe(20);
  });

  test('Day length — §Level.h:74: TICKS_PER_DAY = 20 * 60 * 16 = 19200', () => {
    expect(TICKS_PER_DAY).toBe(20 * 60 * 16);
    expect(TICKS_PER_DAY).toBe(19200);
    // 960 seconds = 16 minutes per day
    expect(SECONDS_PER_DAY).toBe(960);
    expect(SECONDS_PER_DAY).toBe(TICKS_PER_DAY / TICKS_PER_SECOND);
  });

  test('Mining delays — §SurvivalMode.cpp:48 + §CreativeMode.cpp:11', () => {
    expect(SURVIVAL_DESTROY_DELAY).toBe(5);  // §SurvivalMode.cpp:48
    expect(CREATIVE_DESTRUCTION_TICK_DELAY).toBe(10);  // §CreativeMode.cpp:11
  });

  test('Destroy progress divisor — §Tile.cpp:394', () => {
    expect(DESTROY_PROGRESS_DIVISOR).toBe(30);  // §Tile.cpp:394: / 30.0f
  });

  test('World dimensions — §LevelConstants.h:5-8', () => {
    expect(LEVEL_HEIGHT).toBe(128);  // §LevelConstants.h:5
    expect(CHUNK_WIDTH).toBe(16);    // §LevelConstants.h:7
    expect(CHUNK_DEPTH).toBe(16);    // §LevelConstants.h:8
  });

  test('Sea/water levels — §Level.h:71 + §RandomLevelSource.cpp:68', () => {
    // §Level.h:71: SEA_LEVEL = DEPTH / 2 - 1 = 128 / 2 - 1 = 63
    expect(SEA_LEVEL).toBe(63);
    expect(SEA_LEVEL).toBe(Math.floor(LEVEL_HEIGHT / 2) - 1);
    // §RandomLevelSource.cpp:68: waterHeight = Level::DEPTH - 64 = 64
    expect(WATER_LEVEL).toBe(64);
    expect(WATER_LEVEL).toBe(LEVEL_HEIGHT - 64);
  });

  test('Max brightness — §Level.h:73', () => {
    expect(MAX_BRIGHTNESS).toBe(15);  // §Level.h:73
  });

  test('Per-face brightness — §TileRenderer.cpp:54-57', () => {
    // §TileRenderer.cpp:54 — c10 = 0.5 (DOWN)
    expect(FACE_BRIGHTNESS_DOWN).toBe(0.5);
    // §TileRenderer.cpp:55 — c11 = 1 (UP)
    expect(FACE_BRIGHTNESS_UP).toBe(1.0);
    // §TileRenderer.cpp:56 — c2 = 0.8 (NORTH + SOUTH)
    expect(FACE_BRIGHTNESS_NS).toBe(0.8);
    // §TileRenderer.cpp:57 — c3 = 0.6 (WEST + EAST)
    expect(FACE_BRIGHTNESS_WE).toBe(0.6);
  });

  test('Face brightness ordering: UP > N/S > W/E > DOWN', () => {
    // §TileRenderer.cpp:54-57 — verified ordering
    expect(FACE_BRIGHTNESS_UP).toBeGreaterThan(FACE_BRIGHTNESS_NS);
    expect(FACE_BRIGHTNESS_NS).toBeGreaterThan(FACE_BRIGHTNESS_WE);
    expect(FACE_BRIGHTNESS_WE).toBeGreaterThan(FACE_BRIGHTNESS_DOWN);
  });

  test('Player physics — §Mob.cpp:619-620, 845, 727, 754', () => {
    expect(GRAVITY_PER_TICK).toBe(0.08);  // §Mob.cpp:619: yd -= 0.08f
    expect(AIR_DRAG_PER_TICK).toBe(0.98);  // §Mob.cpp:620: yd *= 0.98f
    expect(JUMP_VELOCITY).toBe(0.42);     // §Mob.cpp:845: yd = 0.42f
    expect(INPUT_DECAY).toBe(0.98);       // §Mob.cpp:727: xxa *= 0.98f
    expect(YAW_ROT_DECAY).toBe(0.9);      // §Mob.cpp:754: yRotA *= 0.9f
  });

  test('Fly physics — §LocalPlayer.cpp:189, 199 + §Player.cpp:370', () => {
    expect(FLY_THRUST).toBe(0.15);          // §LocalPlayer.cpp:199: yd += 0.15f
    expect(JUMP_TRIGGER_TIME).toBe(7);     // §LocalPlayer.cpp:189: jumpTriggerTime = 7
    expect(FLY_VERTICAL_DAMPING).toBe(0.6); // §Player.cpp:370: yd = ydo * 0.6f
  });

  test('Friction2 numerator — §Mob.cpp:595', () => {
    // §Mob.cpp:595: (0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91)
    expect(FRICTION2_NUMERATOR).toBeCloseTo(0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91, 10);
  });
});
