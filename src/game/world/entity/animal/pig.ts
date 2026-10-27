// §MCPE 2013 Pig — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Pig.h:10-48      — Pig class declaration (DATA_SADDLE_ID = 16)
//   Pig.cpp:4-70     — constructor / interact / hasSaddle / sounds / loot

import type { EntityLevel } from '../level';
import { EntityRendererId, MobType } from '../types';
import { Animal } from './animal';

/** §Pig.h:13 — `static const int DATA_SADDLE_ID = 16;`. */
export const PIG_DATA_SADDLE_ID = 16;

/** §Pig.h:10-48 — Pig mob. */
export class Pig extends Animal {
  constructor(level: EntityLevel | null) {
    super(level);
    // §Pig.cpp:6 — `entityRendererId = ER_PIG_RENDERER;`
    this.entityRendererId = EntityRendererId.Pig;
    // §Pig.cpp:8 — `textureName = "mob/pig.png";`
    this.textureName = 'mob/pig.png';
    // §Pig.cpp:9 — `setSize(0.9f, 0.9f);`
    this.setSize(0.9, 0.9);
    // §Pig.cpp:11 — `entityData.define(DATA_SADDLE_ID, (TypeChar) 0);` is commented out in rujukan.
  }

  /** §Pig.cpp:14-17 — `int Pig::getEntityTypeId() const { return MobTypes::Pig; }`. */
  override getEntityTypeId(): number {
    return MobType.Pig;
  }

  /** §Pig.cpp:67-70 — `int Pig::getMaxHealth() { return 10; }`. */
  override getMaxHealth(): number {
    return 10;
  }

  /**
   * §Pig.cpp:19-22 — `bool Pig::interact(Player*)` — returns false (saddle logic
   * is `@todo`-commented out in rujukan).
   */
  override interact(_player: unknown): boolean {
    void _player;
    return false;
  }

  /** §Pig.cpp:24-28 — `bool Pig::hasSaddle()` — hardcoded false in rujukan. */
  hasSaddle(): boolean {
    // §Pig.cpp:26 — `return false;` (the entityData byte read is commented out).
    return false;
  }

  /** §Pig.cpp:30-37 — `void Pig::setSaddle(bool)` — body commented out in rujukan. */
  setSaddle(_value: boolean): void {
    void _value;
    // §Pig.cpp:33-36 — no-op (entityData.set calls commented out).
  }

  /** §Pig.cpp:39-42 — `const char* Pig::getAmbientSound() { return "mob.pig"; }`. */
  override getAmbientSound(): string | null {
    return 'mob.pig';
  }

  /** §Pig.cpp:44-47 — `std::string Pig::getHurtSound() { return "mob.pig"; }`. */
  override getHurtSound(): string {
    return 'mob.pig';
  }

  /** §Pig.cpp:49-52 — `std::string Pig::getDeathSound() { return "mob.pigdeath"; }`. */
  override getDeathSound(): string {
    return 'mob.pigdeath';
  }

  /** §Pig.cpp:54-60 — `int Pig::getDeathLoot()` — raw porkchop (cooked variant `@fire`-commented out). */
  override getDeathLoot(): string | null {
    // §Pig.cpp:58-59 — `if (isOnFire()) return cooked;` — fire state is `@todo`.
    return 'minecraft:porkchop_raw';
  }

  /** §Pig.cpp:62-65 — `Animal* Pig::getBreedOffspring(Animal*)`. */
  override getBreedOffspring(_target: Animal | null): Animal | null {
    void _target;
    return new Pig(this.level);
  }
}
