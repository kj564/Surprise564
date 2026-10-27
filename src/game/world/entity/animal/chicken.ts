// §MCPE 2013 Chicken — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Chicken.h:11-47   — Chicken class (extends Animal) — flap state, egg timer
//   Chicken.cpp:5-113 — constructor / aiStep / dropDeathLoot / sounds

import { TICKS_PER_SECOND } from '../../../constants';
import type { EntityLevel } from '../level';
import { EntityRendererId, MobType } from '../types';
import { Animal } from './animal';

/** §Chicken.cpp:19 — egg timer = TPS * 60 * 5 + random[0, TPS*60*5) — 5 to 10 min. */
export const CHICKEN_EGG_TIME_MIN_TICKS = TICKS_PER_SECOND * 60 * 5; // 6000
/** §Chicken.cpp:19 — egg timer range is one full interval (5–10 min total). */
export const CHICKEN_EGG_TIME_RANGE_TICKS = TICKS_PER_SECOND * 60 * 5; // 6000

/** §Chicken.h:42-46 — flap animation state. */
export interface ChickenFlapState {
  /** §Chicken.h:42 — `float flap;` current flap phase. */
  flap: number;
  /** §Chicken.h:43 — `float flapSpeed;` */
  flapSpeed: number;
  /** §Chicken.h:44 — `float oFlapSpeed, oFlap;` previous-tick values. */
  oFlapSpeed: number;
  oFlap: number;
  /** §Chicken.h:45 — `float flapping;` flap intensity multiplier (1 when airborne). */
  flapping: number;
}

/** §Chicken.h:11-47 — Chicken mob. */
export class Chicken extends Animal {
  /** §Chicken.h:41 — `bool sheared;` (vestigial in rujukan Chicken ctor; kept for ABI compat). */
  sheared = false;
  /** §Chicken.h:42 — `float flap;` */
  flap = 0;
  /** §Chicken.h:43 — `float flapSpeed;` */
  flapSpeed = 0;
  /** §Chicken.h:44 — `float oFlapSpeed, oFlap;` */
  oFlap = 0;
  oFlapSpeed = 0;
  /** §Chicken.h:45 — `float flapping;` default 1 (§Chicken.cpp:12). */
  flapping = 1;
  /** §Chicken.h:46 — `int eggTime;` egg-laying countdown (ticks). */
  eggTime = 0;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Chicken.cpp:15 — `entityRendererId = ER_CHICKEN_RENDERER;`
    this.entityRendererId = EntityRendererId.Chicken;
    // §Chicken.cpp:17 — `textureName = "mob/chicken.png";`
    this.textureName = 'mob/chicken.png';
    // §Chicken.cpp:18 — `setSize(0.3f, 0.7f);`
    this.setSize(0.3, 0.7);
    // §Chicken.cpp:19 — `eggTime = random.nextInt(TPS*60*5) + TPS*60*5;`
    this.eggTime = this.random.nextInt(CHICKEN_EGG_TIME_RANGE_TICKS) + CHICKEN_EGG_TIME_MIN_TICKS;
  }

  /** §Chicken.cpp:22-25 — `int Chicken::getEntityTypeId() const { return MobTypes::Chicken; }`. */
  override getEntityTypeId(): number {
    return MobType.Chicken;
  }

  /** §Chicken.cpp:28-31 — `int Chicken::getMaxHealth() { return 4; }`. */
  override getMaxHealth(): number {
    return 4;
  }

  /** §Chicken.cpp:33-61 — `void Chicken::aiStep()` — flap animation + egg timer. */
  override aiStep(): void {
    super.aiStep();
    // §Chicken.cpp:37-38 — snapshot old flap values
    this.oFlap = this.flap;
    this.oFlapSpeed = this.flapSpeed;
    // §Chicken.cpp:40 — `flapSpeed += (onGround ? -1 : 4) * 0.3f;`
    this.flapSpeed += (this.onGround ? -1 : 4) * 0.3;
    // §Chicken.cpp:41-42 — clamp flapSpeed to [0, 1]
    if (this.flapSpeed < 0) this.flapSpeed = 0;
    if (this.flapSpeed > 1) this.flapSpeed = 1;
    // §Chicken.cpp:44 — `if (!onGround && flapping < 1) flapping = 1;`
    if (!this.onGround && this.flapping < 1) this.flapping = 1;
    // §Chicken.cpp:45 — `flapping *= 0.9f;`
    this.flapping *= 0.9;
    // §Chicken.cpp:47-49 — slow fall when descending
    if (!this.onGround && this.yd < 0) {
      this.yd *= 0.6;
    }
    // §Chicken.cpp:51 — `flap += flapping * 2;`
    this.flap += this.flapping * 2;
  }

  /** §Chicken.cpp:73-75 — `void Chicken::causeFallDamage(float)` — chickens ignore fall damage. */
  override causeFallDamage(_distance: number): void {
    void _distance;
  }

  /** §Chicken.cpp:77-80 — `const char* Chicken::getAmbientSound() { return "mob.chicken"; }`. */
  override getAmbientSound(): string | null {
    return 'mob.chicken';
  }

  /** §Chicken.cpp:82-85 — `std::string Chicken::getHurtSound() { return "mob.chickenhurt"; }`. */
  override getHurtSound(): string {
    return 'mob.chickenhurt';
  }

  /** §Chicken.cpp:87-90 — `std::string Chicken::getDeathSound() { return "mob.chickenhurt"; }`. */
  override getDeathSound(): string {
    return 'mob.chickenhurt';
  }

  /** §Chicken.cpp:97-108 — `void Chicken::dropDeathLoot()` — feathers + raw chicken. */
  override dropDeathLoot(): void {
    // §Chicken.cpp:100 — `int count = random.nextInt(3);`
    const featherCount = this.random.nextInt(3);
    for (let i = 0; i < featherCount; i++) {
      // §Chicken.cpp:102 — `spawnAtLocation(Item::feather->id, 1);`
      this.spawnAtLocation('minecraft:feather', 1);
    }
    // §Chicken.cpp:107 — `spawnAtLocation(Item::chicken_raw->id, 1);`
    this.spawnAtLocation('minecraft:chicken_raw', 1);
  }

  /** §Chicken.cpp:110-113 — `Animal* Chicken::getBreedOffspring(Animal*)`. */
  override getBreedOffspring(_target: Animal | null): Animal | null {
    void _target;
    return new Chicken(this.level);
  }

  /** §Chicken.cpp:63-71 — save/load (no extra fields beyond Animal). */
  override addAdditonalSaveData(tag: Record<string, unknown>): void {
    super.addAdditonalSaveData(tag);
  }
  override readAdditionalSaveData(tag: Record<string, unknown>): void {
    super.readAdditionalSaveData(tag);
  }
}
