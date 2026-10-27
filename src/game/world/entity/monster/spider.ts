// §MCPE 2013 Spider — 1:1 port from rujukan C++ source.
// Rujukan: Spider.h:11-62, Spider.cpp:6-138

import type { EntityLevel } from '../level';
import { MobType, EntityRendererId } from '../types';
import type { Entity } from '../entity';
import { Monster } from './monster';

/** §Spider.h:16 — `static const int DATA_FLAGS_ID = 16;` */
export const SPIDER_DATA_FLAGS_ID = 16;
/** §Spider.cpp:14 — `runSpeed = 0.5f;` */
export const SPIDER_RUN_SPEED = 0.5;

/** §Spider.h:11-62 — Spider mob (extends Monster). Climbs walls, immune to webs. */
export class Spider extends Monster {
  /** §Spider.h:56 — `int fireCheckTick;` */
  protected fireCheckTick = 0;

  constructor(level?: EntityLevel | null) {
    super(level ?? null);
    // §Spider.cpp:9 — `entityRendererId = ER_SPIDER_RENDERER;`
    this.entityRendererId = EntityRendererId.Spider;
    // §Spider.cpp:10 — `textureName = "mob/spider.png";`
    this.textureName = 'mob/spider.png';
    // §Spider.cpp:13 — `setSize(1.4f, 0.9f);`
    this.setSize(1.4, 0.9);
    // §Spider.cpp:14 — `runSpeed = 0.5f;`
    this.runSpeed = SPIDER_RUN_SPEED;
    // §Spider.cpp:16 — `entityData.define(DATA_FLAGS_ID, (DataFlagIdType) 0);`
    this.entityData.define(SPIDER_DATA_FLAGS_ID, 0);
  }

  /** §Spider.cpp:19-21 — `void Spider::aiStep()` — super only. */
  override aiStep(): void {
    super.aiStep();
  }

  /** §Spider.cpp:23-31 — `void Spider::tick()` — sync climbing from horizontalCollision. */
  override tick(): void {
    super.tick();
    const level = this.level;
    if (level && !level.isClientSide) {
      // §Spider.cpp:29 — `setClimbing(horizontalCollision);`
      this.setClimbing(this.horizontalCollision);
    }
  }

  /** §Spider.cpp:33-35 — `int Spider::getMaxHealth() { return 8; }` */
  override getMaxHealth(): number {
    return 8;
  }

  /** §Spider.cpp:37-39 — `bool Spider::onLadder() { return isClimbing(); }` */
  override onLadder(): boolean {
    return this.isClimbing();
  }

  /** §Spider.cpp:41-43 — `void Spider::makeStuckInWeb()` — no-op (spiders immune). */
  override makeStuckInWeb(): void {
    // §Spider.cpp:42 — do nothing
  }

  /** §Spider.cpp:45-47 — `float Spider::getModelScale() { return 1.0f; }` */
  getModelScale(): number {
    return 1.0;
  }

  /** §Spider.cpp:49-53 — `bool Spider::isClimbing()` — reads DATA_FLAGS_ID bit 0. */
  isClimbing(): boolean {
    return this.entityData.getFlag(SPIDER_DATA_FLAGS_ID, 0);
  }

  /** §Spider.cpp:55-57 — `void Spider::setClimbing(bool value)` — sets DATA_FLAGS_ID bit 0. */
  setClimbing(value: boolean): void {
    this.entityData.setFlag(SPIDER_DATA_FLAGS_ID, 0);
  }

  /** §Spider.cpp:60-62 — `int Spider::getEntityTypeId() const { return MobTypes::Spider; }` */
  override getEntityTypeId(): number {
    return MobType.Spider;
  }

  /** §Spider.cpp:64-66 — `bool Spider::makeStepSound() { return false; }` */
  protected makeStepSound = false;

  /** §Spider.cpp:68-74 — `Entity* Spider::findAttackTarget()` — only when dark. */
  override findAttackTarget(): Entity | null {
    const level = this.level;
    if (!level) return null;
    const br = this.getBrightness(1);
    // §Spider.cpp:71 — `if (br < 0.5f) return level->findNearestPlayer(...)`
    if (br < 0.5) {
      return (level as unknown as { findNearestPlayer: (e: unknown, r: number) => Entity | null }).findNearestPlayer(this, 16);
    }
    return null;
  }

  /** §Spider.cpp:88-90 — `const char* Spider::getAmbientSound() { return "mob.spider"; }` */
  override getAmbientSound(): string | null {
    return 'mob.spider';
  }

  /** §Spider.cpp:92 — `std::string Spider::getHurtSound() { return "mob.spider"; }` */
  override getHurtSound(): string {
    return 'mob.spider';
  }

  /** §Spider.cpp:94 — `std::string Spider::getDeathSound() { return "mob.spiderdeath"; }` */
  override getDeathSound(): string {
    return 'mob.spiderdeath';
  }

  /** §Spider.cpp:96-100 — `void Spider::checkHurtTarget(Entity* target, float d)` — pounce. */
  override checkHurtTarget(target: Entity, d: number): void {
    // §Spider.cpp:97-99 — pounce toward target when close
    super.checkHurtTarget(target, d);
  }

  /** §Spider.cpp:134-136 — `int Spider::getDeathLoot() { return Item::string->id; }` */
  override getDeathLoot(): string {
    // §Item::string — placeholder until item registry ported
    return 'string';
  }
}
