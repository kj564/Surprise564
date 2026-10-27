// §MCPE 2013 Creeper — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Creeper.h:11-46   — Creeper class (extends Monster) — swell/maxSwell/DATA_SWELL_DIR
//   Creeper.cpp:7-115 — constructor / tick / getSwelling / checkHurtTarget / loot

import type { EntityLevel } from '../level';
import { MobType, EntityRendererId } from '../types';
import type { Entity } from '../entity';
import { Monster } from './monster';

/** §Creeper.h:42 — `static const int DATA_SWELL_DIR = 16;` */
export const CREEPER_DATA_SWELL_DIR = 16;
/** §Creeper.h:43 — `static const int MAX_SWELL = 30;` */
export const CREEPER_MAX_SWELL = 30;

/** §Creeper.h:11-46 — Creeper mob. */
export class Creeper extends Monster {
  /** §Creeper.h:37 — `int swell;` current swell counter. */
  swell = 0;
  /** §Creeper.h:38 — `int oldSwell;` previous-tick swell (for interpolation). */
  oldSwell = 0;
  /** §Creeper.h:40 — `int swellDir;` default -1 (§Creeper.cpp:11). */
  private swellDirValue = -1;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Creeper.cpp:13 — `entityRendererId = ER_CREEPER_RENDERER;`
    this.entityRendererId = EntityRendererId.Creeper;
    // §Creeper.cpp:14 — `textureName = "mob/creeper.png";`
    this.textureName = 'mob/creeper.png';
    // §Creeper.cpp:16 — `entityData.define(DATA_SWELL_DIR, (TypeChar) -1);`
    this.entityData.define(CREEPER_DATA_SWELL_DIR, -1);
  }

  /** §Creeper.cpp:19-21 — `int Creeper::getMaxHealth() { return 16; }`. */
  override getMaxHealth(): number {
    return 16;
  }

  /** §Creeper.cpp:23-45 — `void Creeper::tick()` — swell interpolation + server-side decay. */
  override tick(): void {
    // §Creeper.cpp:24 — `oldSwell = swell;`
    this.oldSwell = this.swell;
    const level = this.level;
    if (level?.isClientSide) {
      // §Creeper.cpp:25-33 — client-side swell sync from DATA_SWELL_DIR byte.
      const swellDir = this.getSwellDir();
      if (swellDir > 0 && this.swell === 0) {
        // §Creeper.cpp:28 — `level->playSound(this, "random.fuse", 1, 0.5f);`
        level.playSound(this, 'random.fuse', 1, 0.5);
      }
      // §Creeper.cpp:30 — `swell += swellDir;`
      this.swell += swellDir;
      if (this.swell < 0) this.swell = 0;
      // §Creeper.cpp:32 — `if (swell >= MAX_SWELL) swell = MAX_SWELL;`
      if (this.swell >= CREEPER_MAX_SWELL) this.swell = CREEPER_MAX_SWELL;
    }
    super.tick();

    // §Creeper.cpp:36-44 — server-side: if no target, decay swell to 0.
    if (level && !level.isClientSide && this.attackTargetId === 0) {
      if (this.swell > 0) {
        // §Creeper.cpp:38 — `setSwellDir(-1);`
        this.setSwellDir(-1);
        // §Creeper.cpp:39 — `swell--;`
        this.swell--;
        if (this.swell < 0) this.swell = 0;
      }
    }
  }

  /** §Creeper.cpp:47-49 — `float Creeper::getSwelling(float a)`. */
  getSwelling(a: number): number {
    // §Creeper.cpp:48 — `return (oldSwell + (swell - oldSwell) * a) / (MAX_SWELL - 2);`
    return (this.oldSwell + (this.swell - this.oldSwell) * a) / (CREEPER_MAX_SWELL - 2);
  }

  /** §Creeper.cpp:51-53 — `int Creeper::getEntityTypeId() const { return MobTypes::Creeper; }`. */
  override getEntityTypeId(): number {
    return MobType.Creeper;
  }

  /** §Creeper.cpp:55-57 — `int Creeper::getDeathLoot() { return Item::sulphur->id; }`. */
  override getDeathLoot(): string | null {
    return 'minecraft:sulphur';
  }

  /** §Creeper.cpp:59-68 — `void Creeper::checkCantSeeTarget(Entity*, float d)` — decay swell. */
  override checkCantSeeTarget(_target: Entity, _d: number): void {
    void _target; void _d;
    const level = this.level;
    if (!level || level.isClientSide) return;
    if (this.swell > 0) {
      // §Creeper.cpp:62 — `setSwellDir(-1);`
      this.setSwellDir(-1);
      // §Creeper.cpp:63 — `swell--;`
      this.swell--;
      if (this.swell < 0) this.swell = 0;
    }
  }

  /** §Creeper.cpp:70-72 — `std::string Creeper::getHurtSound() { return "mob.creeper"; }`. */
  override getHurtSound(): string {
    return 'mob.creeper';
  }

  /** §Creeper.cpp:74-76 — `std::string Creeper::getDeathSound() { return "mob.creeperdeath"; }`. */
  override getDeathSound(): string {
    return 'mob.creeperdeath';
  }

  /** §Creeper.cpp:78-97 — `void Creeper::checkHurtTarget(Entity*, float d)` — swell + explode. */
  override checkHurtTarget(target: Entity, d: number): void {
    const level = this.level;
    if (!level || level.isClientSide) return;
    const swellDir = this.getSwellDir();
    // §Creeper.cpp:81 — `if ((swellDir <= 0 && d < 3) || (swellDir > 0 && d < 7))`
    if ((swellDir <= 0 && d < 3) || (swellDir > 0 && d < 7)) {
      if (this.swell === 0) {
        // §Creeper.cpp:83 — `level->playSound(this, "random.fuse", 1, 0.5f);`
        level.playSound(this, 'random.fuse', 1, 0.5);
      }
      // §Creeper.cpp:85 — `setSwellDir(1);`
      this.setSwellDir(1);
      // §Creeper.cpp:87 — `if (++swell >= MAX_SWELL) { level->explode(...); remove(); }`
      if (++this.swell >= CREEPER_MAX_SWELL) {
        level.explode(this, this.x, this.y, this.z, 2.4);
        this.remove();
      }
      // §Creeper.cpp:91 — `holdGround = true;`
      this.holdGround = true;
    } else {
      // §Creeper.cpp:93 — `setSwellDir(-1);`
      this.setSwellDir(-1);
      // §Creeper.cpp:94 — `if (--swell < 0) swell = 0;`
      if (--this.swell < 0) this.swell = 0;
    }
    void target;
  }

  /** §Creeper.cpp:99-101 — `int Creeper::getSwellDir()`. */
  getSwellDir(): number {
    // §Creeper.cpp:100 — `return (int) entityData.getByte(DATA_SWELL_DIR);`
    return this.entityData.getByte(CREEPER_DATA_SWELL_DIR);
  }

  /** §Creeper.cpp:103-105 — `void Creeper::setSwellDir(int dir)`. */
  setSwellDir(dir: number): void {
    // §Creeper.cpp:104 — `entityData.set(DATA_SWELL_DIR, (TypeChar) dir);`
    this.entityData.set(CREEPER_DATA_SWELL_DIR, dir);
    this.swellDirValue = dir;
  }
}
