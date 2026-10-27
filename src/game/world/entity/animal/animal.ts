// §MCPE 2013 Animal base class — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Animal.h:13-37    — Animal class (multi-inherit AgableMob + Creature)
//   Animal.cpp:8-93   — full implementation
//
// The C++ Animal multi-inherits from AgableMob and Creature; Creature is an
// empty mixin (§Creature.h:6-7) so the TS port keeps single-inheritance
// from AgableMob. `getCreatureBaseType()` returns MobTypes::BaseCreature.

import { TICKS_PER_SECOND } from '../../../constants';
import type { EntityLevel } from '../level';
import { AgableMob } from '../mob-hierarchy';
import { MobType } from '../types';
import type { Entity } from '../entity';

/**
 * §Animal.h:13-37 — `Animal: public AgableMob, public Creature`.
 * Passive mobs: flee on hurt, spawn only on grass in daylight, never despawn.
 */
export abstract class Animal extends AgableMob {
  /** §Animal.h:36 — `int inLove;` breeding timer (unused in MCPE 2013 logic). */
  protected inLove = 0;

  constructor(level: EntityLevel | null) {
    super(level);
  }

  /** §Animal.cpp:15-21 — `bool Animal::hurt(Entity*, int)` — flee 3s + clear target. */
  override hurt(source: Entity | null, dmg: number): boolean {
    // §Animal.cpp:17 — `fleeTime = 3 * TicksPerSecond;`
    this.fleeTime = 3 * TICKS_PER_SECOND;
    // §Animal.cpp:18 — `attackTargetId = 0;`
    this.attackTargetId = 0;
    // §Animal.cpp:19 — `inLove = 0;`
    this.inLove = 0;
    return super.hurt(source, dmg);
  }

  /** §Animal.cpp:23-29 — `bool Animal::canSpawn()` — grass + brightness > 8. */
  override canSpawn(): boolean {
    const level = this.level;
    if (!level) return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.bb.minY);
    const zt = Math.floor(this.z);
    // §Animal.cpp:28 — `getTile(xt, yt-1, zt) == grass->id && getRawBrightness(...) > 8 && super`
    const grassLegacyId = 2; // §registry.ts minecraft:grass_block
    const onGrass = level.getTile(xt, yt - 1, zt) === grassLegacyId;
    const brightEnough = level.getRawBrightness(xt, yt, zt) > 8;
    return onGrass && brightEnough && super.canSpawn();
  }

  /** §Animal.cpp:31-34 — `int Animal::getAmbientSoundInterval() { return 12 * TPS; }`. */
  override getAmbientSoundInterval(): number {
    return 12 * TICKS_PER_SECOND;
  }

  /** §Animal.cpp:36-40 — `float Animal::getWalkTargetValue(int x, y, z)`. */
  override getWalkTargetValue(x: number, y: number, z: number): number {
    const level = this.level;
    if (!level) return 0;
    const grassLegacyId = 2;
    // §Animal.cpp:38 — `if (getTile(x, y-1, z) == grass->id) return 10;`
    if (level.getTile(x, y - 1, z) === grassLegacyId) return 10;
    // §Animal.cpp:39 — `return level->getBrightness(x, y, z) - 0.5f;`
    return level.getBrightness(x, y, z) - 0.5;
  }

  /** §Animal.cpp:42-83 — `Entity* Animal::findAttackTarget() { return NULL; }` (breeding disabled). */
  override findAttackTarget(): Entity | null {
    return null;
  }

  /** §Animal.cpp:85-88 — `bool Animal::removeWhenFarAway() { return false; }`. */
  override removeWhenFarAway(): boolean {
    return false;
  }

  /** §Animal.cpp:90-92 — `int Animal::getCreatureBaseType() const { return MobTypes::BaseCreature; }`. */
  override getCreatureBaseType(): number {
    return MobType.BaseCreature;
  }
}
