// §MCPE 2013 rujukan entity type IDs and shared enums.
//
// Every constant here is verified 1:1 against the rujukan C++ source.
// Citation format: §File:line — see docs/ for full spec per system.
//
// Rule Zero: read source line-by-line, don't guess.
//
// Rujukan source files:
//   EntityTypes.h        — BaseTypes / EntityTypes / MobTypes ID table
//   EntityPos.h          — entity-position snapshot (move/rot pair)
//   EntityRendererId.h   — renderer enum (renderer is selected browser-side)
//   SharedFlags.h        — bit indices in DATA_SHARED_FLAGS_ID byte

// === BaseTypes (§EntityTypes.h:7-11) — top-level entity category ===
/** §EntityTypes.h:9 — `static const int Entity = 1;` */
export const BASE_TYPE_ENTITY = 1;
/** §EntityTypes.h:10 — `static const int Item = 2;` */
export const BASE_TYPE_ITEM = 2;

/** §EntityTypes.h:7-11 — top-level entity category (Entity vs Item). */
export type BaseType = typeof BASE_TYPE_ENTITY | typeof BASE_TYPE_ITEM;

// === EntityTypes (§EntityTypes.h:14-33) — non-mob entity IDs (≥64) ===
/**
 * §EntityTypes.h:24-32 — non-mob entity type IDs. Mobs occupy IDs 1–63;
 * ItemEntity/TNT/Arrow/etc. start at 64.
 */
export enum EntityType {
  /** §EntityTypes.h:24 — `IdItemEntity = 64;` */
  ItemEntity = 64,
  /** §EntityTypes.h:26 — `IdPrimedTnt = 65;` */
  PrimedTnt = 65,
  /** §EntityTypes.h:27 — `IdFallingTile = 66;` */
  FallingTile = 66,
  /** §EntityTypes.h:29 — `IdArrow = 80;` */
  Arrow = 80,
  /** §EntityTypes.h:30 — `IdSnowball = 81;` */
  Snowball = 81,
  /** §EntityTypes.h:31 — `IdThrownEgg = 82;` */
  ThrownEgg = 82,
  /** §EntityTypes.h:32 — `IdPainting = 83;` */
  Painting = 83,
}

// === MobTypes (§EntityTypes.h:38-54) — mob type IDs (1–63) ===
/**
 * §EntityTypes.h:38-54 — MobTypes table. Base categories (1–3) double as
 * `getCreatureBaseType()` return values; concrete mobs start at 10.
 */
export enum MobType {
  /** §EntityTypes.h:40 — `BaseEnemy = 1;` */
  BaseEnemy = 1,
  /** §EntityTypes.h:41 — `BaseCreature = 2;` */
  BaseCreature = 2,
  /** §EntityTypes.h:42 — `BaseWaterCreature = 3;` */
  BaseWaterCreature = 3,

  // Animals (§EntityTypes.h:44-47)
  /** §EntityTypes.h:44 — `Chicken = 10;` */
  Chicken = 10,
  /** §EntityTypes.h:45 — `Cow = 11;` */
  Cow = 11,
  /** §EntityTypes.h:46 — `Pig = 12;` */
  Pig = 12,
  /** §EntityTypes.h:47 — `Sheep = 13;` */
  Sheep = 13,

  // Monsters (§EntityTypes.h:49-53)
  /** §EntityTypes.h:49 — `Zombie = 32;` */
  Zombie = 32,
  /** §EntityTypes.h:50 — `Creeper = 33;` */
  Creeper = 33,
  /** §EntityTypes.h:51 — `Skeleton = 34;` */
  Skeleton = 34,
  /** §EntityTypes.h:52 — `Spider = 35;` */
  Spider = 35,
  /** §EntityTypes.h:53 — `PigZombie = 36;` */
  PigZombie = 36,
}

// === EntityPos (§EntityPos.h:8-44) — partial position snapshot ===
/**
 * §EntityPos.h:8-44 — entity position snapshot. C++ uses two boolean flags
 * (`rot`, `move`) to mark which sub-set of fields the snapshot carries:
 *   move=true,rot=true  → full pos+rot  (§EntityPos.h:16-27)
 *   move=true,rot=false → translation only (§EntityPos.h:29-36)
 *   move=false,rot=true → rotation only (§EntityPos.h:38-44)
 */
export interface EntityPos {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly yRot: number;
  readonly xRot: number;
  /** §EntityPos.h:14 — `bool move;` — true when x/y/z carry new data. */
  readonly move: boolean;
  /** §EntityPos.h:13 — `bool rot;` — true when yRot/xRot carry new data. */
  readonly rot: boolean;
}

/** §EntityPos.h:16-27 — full position+rotation snapshot. */
export function fullEntityPos(x: number, y: number, z: number, yRot: number, xRot: number): EntityPos {
  return Object.freeze({ x, y, z, yRot, xRot, move: true, rot: true });
}

/** §EntityPos.h:29-36 — translation-only snapshot. */
export function moveEntityPos(x: number, y: number, z: number): EntityPos {
  return Object.freeze({ x, y, z, yRot: 0, xRot: 0, move: true, rot: false });
}

/** §EntityPos.h:38-44 — rotation-only snapshot. */
export function rotEntityPos(yRot: number, xRot: number): EntityPos {
  return Object.freeze({ x: 0, y: 0, z: 0, yRot, xRot, move: false, rot: true });
}

// === SharedFlags (§SharedFlags.h:4-16) — bit indices in DATA_SHARED_FLAGS_ID ===
/** §SharedFlags.h:7-11 — flag bit indices packed in the shared-flags byte. */
export enum SharedFlag {
  /** §SharedFlags.h:7 — `FLAG_ONFIRE = 0;` */
  OnFire = 0,
  /** §SharedFlags.h:8 — `FLAG_SNEAKING = 1;` */
  Sneaking = 1,
  /** §SharedFlags.h:9 — `FLAG_RIDING = 2;` */
  Riding = 2,
  /** §SharedFlags.h:10 — `FLAG_SPRINTING = 3;` */
  Sprinting = 3,
  /** §SharedFlags.h:11 — `FLAG_USINGITEM = 4;` */
  UsingItem = 4,
}

/** §SharedFlags.h:15 — `static const unsigned int DATA_SHARED_FLAGS_ID = 0;` */
export const DATA_SHARED_FLAGS_ID = 0;

/** §Entity.h:222 — `static const int DATA_AIR_SUPPLY_ID = 1;` */
export const DATA_AIR_SUPPLY_ID = 1;

// === EntityRendererId (§EntityRendererId.h:4-26) — renderer enum ===
/**
 * §EntityRendererId.h:4-26 — renderer enum. The renderer is selected
 * browser-side from this ID; the entity layer only carries the discriminator.
 */
export enum EntityRendererId {
  /** §EntityRendererId.h:5 — `ER_DEFAULT_RENDERER` */
  Default = 0,
  /** §EntityRendererId.h:6 — `ER_QUERY_RENDERER` */
  Query = 1,
  /** §EntityRendererId.h:7 — `ER_TNT_RENDERER` */
  Tnt = 2,
  /** §EntityRendererId.h:8 — `ER_HUMANOID_RENDERER` */
  Humanoid = 3,
  /** §EntityRendererId.h:9 — `ER_ITEM_RENDERER` */
  Item = 4,
  /** §EntityRendererId.h:10 — `ER_TRIPODCAMERA_RENDERER` */
  TripodCamera = 5,
  /** §EntityRendererId.h:11 — `ER_CHICKEN_RENDERER` */
  Chicken = 6,
  /** §EntityRendererId.h:12 — `ER_COW_RENDERER` */
  Cow = 7,
  /** §EntityRendererId.h:13 — `ER_PIG_RENDERER` */
  Pig = 8,
  /** §EntityRendererId.h:14 — `ER_SHEEP_RENDERER` */
  Sheep = 9,
  /** §EntityRendererId.h:15 — `ER_SHEEP_FUR_RENDERER` */
  SheepFur = 10,
  /** §EntityRendererId.h:16 — `ER_ZOMBIE_RENDERER` */
  Zombie = 11,
  /** §EntityRendererId.h:17 — `ER_SKELETON_RENDERER` */
  Skeleton = 12,
  /** §EntityRendererId.h:18 — `ER_SPIDER_RENDERER` */
  Spider = 13,
  /** §EntityRendererId.h:19 — `ER_CREEPER_RENDERER` */
  Creeper = 14,
  /** §EntityRendererId.h:20 — `ER_ARROW_RENDERER` */
  Arrow = 15,
  /** §EntityRendererId.h:21 — `ER_PLAYER_RENDERER` */
  Player = 16,
  /** §EntityRendererId.h:22 — `ER_THROWNEGG_RENDERER` */
  ThrownEgg = 17,
  /** §EntityRendererId.h:23 — `ER_SNOWBALL_RENDERER` */
  Snowball = 18,
  /** §EntityRendererId.h:24 — `ER_PAINTING_RENDERER` */
  Painting = 19,
  /** §EntityRendererId.h:25 — `ER_FALLINGTILE_RENDERER` */
  FallingTile = 20,
}
