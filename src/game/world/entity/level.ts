// §MCPE 2013 Entity/Mob Level contract — abstracts the C++ `Level*` pointer.
//
// The rujukan C++ Entity/Mob tree talks to a Level* for block lookup,
// collision queries, light, sound, particles, raycasts, AI pathfinding and
// network replication. VoxelCraft's `VoxelWorld` only carries block data;
// the engine/composition root wires a concrete `EntityLevel` adapter around
// it. This file pins the *contract* the entity layer is allowed to call.
//
// Method set verified against the calls in Entity.cpp, Mob.cpp,
// PathfinderMob.cpp, Animal.cpp, Sheep.cpp, Monster.cpp, Zombie.cpp,
// Creeper.cpp, Skeleton.cpp, Spider.cpp (Rule Zero).

import type { Aabb } from '../physics/aabb';
import type { VoxelWorld } from '../level/world';

/** §Level.h — difficulty enum (referenced by §Monster.cpp:33). */
export enum Difficulty {
  /** §Difficulty.h — `PEACEFUL` — monsters despawn immediately. */
  Peaceful = 0,
  Easy = 1,
  Normal = 2,
  Hard = 3,
}

/** §Level.h — light layer enum (referenced by §Monster.cpp:74). */
export enum LightLayer {
  /** §Level.h — `Sky` sky-light layer (sunlight). */
  Sky = 0,
  /** §Level.h — `Block` block-light layer (torches, lava). */
  Block = 1,
}

/**
 * §Level.h — minimal Random port. C++ uses `Random` with nextFloat/nextInt;
 * VoxelCraft's entity layer only needs three methods.
 */
export interface Random {
  /** §Random.h — `float nextFloat();` */
  nextFloat(): number;
  /** §Random.h — `int nextInt(int n);` — uniform int in [0, n). */
  nextInt(bound: number): number;
}

/** Default Math.random-backed Random (matches C++ `Random(getEpochTimeS())` seeding in spirit). */
export class MathRandom implements Random {
  nextFloat(): number {
    return Math.random();
  }
  nextInt(bound: number): number {
    if (!Number.isFinite(bound) || bound <= 0) throw new RangeError('bound must be positive');
    return Math.floor(Math.random() * bound);
  }
}

/** §Pos.h — int triple used by spawnAtLocation / pathfinding. */
export interface Pos {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** §EntityEvent.h — events broadcast to clients via `level->broadcastEntityEvent`. */
export enum EntityEvent {
  /** §EntityEvent.h — `HURT` (sent by §Mob.cpp:417). */
  Hurt = 2,
  /** §EntityEvent.h — `DEATH` (sent by §Mob.cpp:495). */
  Death = 3,
  /** §EntityEvent.h — `EAT_GRASS` (sent by §Sheep.cpp:203). */
  EatGrass = 18,
}

/**
 * The Level contract the entity layer is allowed to call. Mirrors the
 * methods actually invoked from the rujukan C++ sources cited inline.
 * A real adapter will wrap VoxelWorld + BlockRegistry; tests use a mock.
 */
export interface EntityLevel {
  /** §Level.h — underlying world data (block storage). */
  readonly world: VoxelWorld;
  /** §Level.h:74 — `bool isClientSide;`. */
  readonly isClientSide: boolean;
  /** §Level.h — `Difficulty difficulty;`. */
  readonly difficulty: Difficulty;
  /** §Level.h — `Random random;` (per-level RNG). */
  readonly random: Random;

  /** §Level.h — `Tile* getTile(int x, int y, int z);` — 0 = air, undefined = unloaded. */
  getTile(x: number, y: number, z: number): number;
  /** §Level.h — `int getData(int x, int y, int z);` — block aux data (e.g. wool color). */
  getData(x: number, y: number, z: number): number;
  /** §Level.h — `bool setTile(int x, int y, int z, int id);` — returns true if applied. */
  setTile(x: number, y: number, z: number, id: number): boolean;

  /** §Level.h — `bool isSolidBlockingTile(int x, int y, int z);` — §Entity.cpp:90. */
  isSolidBlockingTile(x: number, y: number, z: number): boolean;

  /** §Level.h — `std::vector<AABB>& getCubes(Entity*, const AABB&);` — §Entity.cpp:115,201. */
  getCubes(self: unknown, box: Aabb): readonly Aabb[];
  /** §Level.h — `bool isUnobstructed(const AABB&);` — §Mob.cpp:912. */
  isUnobstructed(box: Aabb): boolean;
  /** §Level.h — `bool containsAnyLiquid(const AABB&);` — §Entity.cpp:117, §Mob.cpp:912. */
  containsAnyLiquid(box: Aabb): boolean;
  /** §Level.h — `bool containsMaterial(const AABB&, Material*);` — §Entity.cpp:110. */
  containsMaterial(box: Aabb, material: string): boolean;
  /** §Level.h — `bool checkAndHandleWater(const AABB&, Material*, Entity*);` — §Entity.cpp:106. */
  isInWater(box: Aabb, self: unknown): boolean;
  /** §Level.h — `bool containsFireTile(const AABB&);` — §Entity.cpp:341. */
  containsFireTile(box: Aabb): boolean;

  /** §Level.h — `int getBrightness(int x, int y, int z);` — §Entity.cpp:409. */
  getBrightness(x: number, y: number, z: number): number;
  /** §Level.h — `int getRawBrightness(int x, int y, int z);` — §Monster.cpp:76. */
  getRawBrightness(x: number, y: number, z: number): number;
  /** §Level.h — `int getBrightness(LightLayer, int, int, int);` — §Monster.cpp:74. */
  getLightBrightness(layer: LightLayer, x: number, y: number, z: number): number;
  /** §Level.h — `bool canSeeSky(int x, int y, int z);` — §Zombie.cpp:57. */
  canSeeSky(x: number, y: number, z: number): boolean;
  /** §Level.h — `bool isDay();` — §Zombie.cpp:54. */
  isDay(): boolean;

  // === Notifications (browser layer hooks; no-op in pure logic) ===
  /** §Level.h — `void playSound(Entity*, const char*, float, float);` — §Mob.cpp:144. */
  playSound(self: unknown, sound: string, volume: number, pitch: number): void;
  /** §Level.h — `void broadcastEntityEvent(Entity*, char);` — §Mob.cpp:417. */
  broadcastEntityEvent(self: unknown, event: EntityEvent): void;
  /** §Level.h — `void addParticle(...)` — §Mob.cpp:174. No-op allowed in pure logic. */
  addParticle(
    kind: string,
    x: number, y: number, z: number,
    xd: number, yd: number, zd: number,
  ): void;
  /** §Level.h — `bool addEntity(Entity*);` — §Entity.cpp:916 (spawnAtLocation). */
  addEntity(entity: unknown): void;
  /** §Level.h — `void explode(Entity*, float, float, float, float);` — §Creeper.cpp:88. */
  explode(self: unknown, x: number, y: number, z: number, power: number): void;
  /** §Level.h — `void levelEvent(...)` — §Sheep.cpp:216. */
  levelEvent(
    source: unknown,
    event: number,
    x: number, y: number, z: number,
    data: number,
  ): void;

  // === Entity registry ===
  /** §Level.h — `Entity* getEntity(int id);` — §Mob.cpp:781. */
  getEntity(id: number): unknown | null;
  /** §Level.h — `Mob* getMob(int id);` — §Monster.cpp:122. */
  getMob(id: number): unknown | null;
  /** §Level.h — `Player* getNearestPlayer(Entity*, float);` — §Mob.cpp:763. */
  getNearestPlayer(self: unknown, distance: number): unknown | null;
  /** §Level.h — `EntityList& getEntities(Entity*, const AABB&);` — §Mob.cpp:745. */
  getEntities(self: unknown, box: Aabb): readonly unknown[];
}
