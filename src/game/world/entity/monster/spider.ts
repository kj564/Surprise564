// §MCPE 2013 Spider — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Spider.h:11-62    — Spider class (extends Monster) — DATA_FLAGS_ID, climbing
//   Spider.cpp:6-138  — constructor / tick (climb sync) / findAttackTarget (dark only)
//                        checkHurtTarget (pounce) / makeStuckInWeb (no-op)

import type { EntityLevel } from '../level';
import { MobType, EntityRendererId } from '../types';
import type { Entity } from '../entity';
import { Monster } from './monster';

/** §Spider.h:16 — `static const int DATA_FLAGS_ID = 16;`. */
export const SPIDER_DATA_FLAGS_ID = 16;
/** §Spider.h:15 — `typedef SynchedEntityData::TypeChar DataFlagIdType;` — flag bit index 0 = climbing. */
export const SPIDER_FLAG_CLIMBING = 0;
/** §Spider.cpp:14 — `runSpeed = 0.5f;` */
export const SPIDER_RUN_SPEED = 0.5;

/** §Spider.h:11-62 — Spider mob. */
export class Spider extends Monster {
  /** §Spider.h:56 — `int fireCheckTick;` */
  protected fireCheckTick = 0;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Spider.cpp:10 — `entityRendererId = ER_SPIDER_RENDERER;`
    this.entityRendererId = EntityRendererId.Spider;
    // §Spider.cpp:11 — `textureName = "mob/spider.png";`
    this.textureName = 'mob/spider.png';
    // §Spider.cpp:13 — `setSize(1.4f, 0.9f);`
    this.setSize(1.4, 0.9);
    // §Spider.cpp:14 — `runSpeed = 0.5f;`
    this.runSpeed = SPIDER_RUN_SPEED;
    // §Spider.cpp:16 — `entityData.define(DATA_FLAGS_ID, (DataFlagIdType) 0);`
    this.entityData.define(SPIDER_DATA_FLAGS_ID, 0);
  }

  /** §Spider.cpp:19-21 — `void Spider::aiStep()` — super only (climb sync happens in tick). */
  override aiStep(): void {
    super.aiStep();
  }

  /** §Spider.cpp:23-31 — `void Spider::tick()` — sync climbing flag from horizontalCollision. */
  override tick(): void {
    super.tick();
    const level = this.level;
    if (level && !level.isClientSide) {
      // §Spider.cpp:29 — `setClimbing(horizontalCollision);`
      this.setClimbing(this.horizontalCollision);
    }
  }

  /** §Spider.cpp:33-35 — `int Spider::getMaxHealth() { return 8; }`. */
  override getMaxHealth(): number {
    return 8;
  }

  /** §Spider.cpp:37-39 — `bool Spider::onLadder() { return isClimbing(); }` — enables wall climbing. */
  override onLadder(): boolean {
    return this.isClimbing();
  }

  /** §Spider.cpp:41-43 — `void Spider::makeStuckInWeb()` — spiders ignore webs. */
  override makeStuckInWeb(): void {
    // §Spider.cpp:42 — `// do nothing - spiders don't get stuck in web`
  }

  /** §Spider.cpp:45-47 — `float Spider::getModelScale() { return 1.0f; }`. */
  getModelScale(): number {
    return 1.0;
  }

  /** §Spider.cpp:49-51 — `bool Spider::isClimbing()` — bit 0 of DATA_FLAGS_ID. */
  isClimbing(): boolean {
    // §Spider.cpp:50 — `return entityData.getFlag<DataFlagIdType>(DATA_FLAGS_ID, 0);`
    return this.entityData.getFlag(SPIDER_DATA_FLAGS_ID, SPIDER_FLAG_CLIMBING);
  }

  /** §Spider.cpp:53-58 — `void Spider::setClimbing(bool value)`. */
  setClimbing(value: boolean): void {
    if (value) {
      // §Spider.cpp:55 — `return entityData.setFlag<DataFlagIdType>(DATA_FLAGS_ID, 0);`
      this.entityData.setFlag(SPIDER_DATA_FLAGS_ID, SPIDER_FLAG_CLIMBING);
    } else {
      // §Spider.cpp:57 — `return entityData.clearFlag<DataFlagIdType>(DATA_FLAGS_ID, 0);`
      this.entityData.clearFlag(SPIDER_DATA_FLAGS_ID, SPIDER_FLAG_CLIMBING);
    }
  }

  /** §Spider.cpp:60-62 — `int Spider::getEntityTypeId() const { return MobTypes::Spider; }`. */
  override getEntityTypeId(): number {
    return MobType.Spider;
  }

  /** §Spider.cpp:64-66 — `bool Spider::makeStepSound() { return false; }`. */
  protected makeStepSound(): boolean {
    return false;
  }

  /** §Spider.cpp:68-74 — `Entity* Spider::findAttackTarget()` — only when dark (brightness < 0.5). */
  override findAttackTarget(): Entity | null {
    const level = this.level;
    if (!level) return null;
    const br = this.getBrightness(1);
    // §Spider.cpp:70 — `if (br < 0.5f) return level->getNearestPlayer(this, 16);`
    if (br < 0.5) return level.getNearestPlayer(this, 16) as Entity | null;
    return null;
  }

  /** §Spider.cpp:76-78 — `const char* Spider::getAmbientSound() { return "mob.spider"; }`. */
  override getAmbientSound(): string | null {
    return 'mob.spider';
  }

  /** §Spider.cpp:80-82 — `std::string Spider::getHurtSound() { return "mob.spider"; }`. */
  override getHurtSound(): string {
    return 'mob.spider';
  }

  /** §Spider.cpp:84-86 — `std::string Spider::getDeathSound() { return "mob.spiderdeath"; }`. */
  override getDeathSound(): string {
    return 'mob.spiderdeath';
  }

  /** §Spider.cpp:88-107 — `void Spider::checkHurtTarget(Entity*, float d)` — daylight retreat + pounce. */
  override checkHurtTarget(target: Entity, d: number): void {
    const br = this.getBrightness(1);
    // §Spider.cpp:90-93 — `if (br > 0.5f && nextInt(100) == 0) attackTargetId = 0; return;`
    if (br > 0.5 && this.random.nextInt(100) === 0) {
      this.attackTargetId = 0;
      return;
    }
    // §Spider.cpp:95-103 — `if (d > 2 && d < 6 && nextInt(10) == 0) { ... pounce ... }`
    if (d > 2 && d < 6 && this.random.nextInt(10) === 0) {
      if (this.onGround) {
        const xdd = target.x - this.x;
        const zdd = target.z - this.z;
        const dd = Math.sqrt(xdd * xdd + zdd * zdd);
        // §Spider.cpp:100-101 — `xd = (xdd / dd * 0.5f) * 0.8f + xd * 0.2f;`
        this.xd = (xdd / dd * 0.5) * 0.8 + this.xd * 0.2;
        this.zd = (zdd / dd * 0.5) * 0.8 + this.zd * 0.2;
        // §Spider.cpp:102 — `yd = 0.4f;`
        this.yd = 0.4;
      }
    } else {
      // §Spider.cpp:105 — `super::checkHurtTarget(target, d);`
      super.checkHurtTarget(target, d);
    }
  }

  /** §Spider.cpp:109-111 — `int Spider::getDeathLoot() { return Item::string->id; }`. */
  override getDeathLoot(): string | null {
    return 'minecraft:string';
  }
}
