// §MCPE 2013 Monster base class — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Monster.h:13-55   — Monster class declaration (extends PathfinderMob)
//   Monster.cpp:9-144 — constructor / aiStep / tick / hurt / canSpawn /
//                       findAttackTarget / isDarkEnoughToSpawn / doHurtTarget /
//                       checkHurtTarget / getWalkTargetValue / target tracking

import type { EntityLevel } from '../level';
import { PathfinderMob } from '../mob-hierarchy';
import { MobType } from '../types';
import { EntityRendererId } from '../types';
import type { Entity, Mob } from '../entity';

/** §Monster.cpp:142-144 — `int Monster::getAttackTime() { return 20; }`. */
export const MONSTER_DEFAULT_ATTACK_TIME = 20;

/**
 * §Monster.h:13-55 — `Monster: public PathfinderMob` (implements Enemy).
 *
 * Carries: attackDamage, targetId, lastHurtByMobId. Adds `aiStep` sunlight
 * penalty (+2 noActionTime when brightness > 0.5), `tick` PEACEFUL despawn,
 * `isDarkEnoughToSpawn()` gate, and `doHurtTarget(Entity*)`.
 */
export abstract class Monster extends PathfinderMob {
  /** §Monster.h:51 — `int attackDamage;` default 2 (§Monster.cpp:11). */
  protected attackDamage = 2;
  /** §Monster.h:52 — `int targetId;` (separate from attackTargetId — explicit mob target). */
  targetId = 0;
  /** §Monster.h:54 — `int lastHurtByMobId;` */
  lastHurtByMobId = 0;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Monster.cpp:15 — `entityRendererId = ER_HUMANOID_RENDERER;`
    this.entityRendererId = EntityRendererId.Humanoid;
  }

  /** §Monster.cpp:19-28 — `void Monster::aiStep()` — sunlight penalty + super. */
  override aiStep(): void {
    // §Monster.cpp:21 — `updateAttackAnim();`
    this.updateAttackAnim();
    // §Monster.cpp:23 — `float br = getBrightness(1);`
    const br = this.getBrightness(1);
    if (br > 0.5) {
      // §Monster.cpp:25 — `noActionTime += 2;`
      this.noActionTime += 2;
    }
    super.aiStep();
  }

  /** §Monster.cpp:30-34 — `void Monster::tick()` — despawn on PEACEFUL. */
  override tick(): void {
    super.tick();
    const level = this.level;
    // §Monster.cpp:33 — `if (!level->isClientSide && level->difficulty == PEACEFUL) remove();`
    if (level && !level.isClientSide && level.difficulty === 0 /* Peaceful */) {
      this.remove();
    }
  }

  /** §Monster.cpp:36-50 — `bool Monster::hurt(Entity*, int)` — propagates target IDs. */
  override hurt(sourceEntity: Entity | null, dmg: number): boolean {
    if (!super.hurt(sourceEntity, dmg)) return false;
    if (sourceEntity !== this) {
      // §Monster.cpp:40 — `attackTargetId = 0;`
      this.attackTargetId = 0;
      if (sourceEntity) {
        // §Monster.cpp:42 — `attackTargetId = sourceEntity->entityId;`
        this.attackTargetId = sourceEntity.entityId;
        if (sourceEntity.isMob()) {
          // §Monster.cpp:44 — `lastHurtByMobId = sourceEntity->entityId;`
          this.lastHurtByMobId = sourceEntity.entityId;
        }
      }
    }
    return true;
  }

  /** §Monster.cpp:52-55 — `bool Monster::canSpawn() { return isDarkEnoughToSpawn() && super; }`. */
  override canSpawn(): boolean {
    return this.isDarkEnoughToSpawn() && super.canSpawn();
  }

  /** §Monster.cpp:57-64 — `Entity* Monster::findAttackTarget()`. */
  override findAttackTarget(): Entity | null {
    const level = this.level;
    if (!level) return null;
    // §Monster.cpp:60 — `Player* player = level->getNearestPlayer(this, 16);`
    const player = level.getNearestPlayer(this, 16) as Entity | null;
    if (player && this.canSee(player)) return player;
    return null;
  }

  /** §Monster.cpp:66-86 — `bool Monster::isDarkEnoughToSpawn()`. */
  isDarkEnoughToSpawn(): boolean {
    const level = this.level;
    if (!level) return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.bb.minY);
    const zt = Math.floor(this.z);
    // §Monster.cpp:74 — `if (level->getBrightness(LightLayer::Sky, xt, yt, zt) > random.nextInt(32)) return false;`
    if (level.getLightBrightness(0 /* LightLayer.Sky */, xt, yt, zt) > this.random.nextInt(32)) return false;
    // §Monster.cpp:76 — `int br = level->getRawBrightness(xt, yt, zt);`
    const br = level.getRawBrightness(xt, yt, zt);
    // §Monster.cpp:85 — `return br <= random.nextInt(8);`
    return br <= this.random.nextInt(8);
  }

  /** §Monster.cpp:88-102 — `bool Monster::doHurtTarget(Entity* target)`. */
  doHurtTarget(target: Entity): boolean {
    // §Monster.cpp:90 — `swing();`
    this.swing();
    const dmg = this.getAttackDamage(target);
    // §Monster.cpp:101 — `return target->hurt(this, dmg);`
    return target.hurt(this, dmg);
  }

  /** §Monster.cpp:104-109 — `void Monster::checkHurtTarget(Entity*, float distance)`. */
  override checkHurtTarget(target: Entity, distance: number): void {
    // §Monster.cpp:105 — `if (attackTime <= 0 && distance < 2.0f && target->bb.y1 > bb.y0 && target->bb.y0 < bb.y1)`
    if (this.attackTime <= 0 && distance < 2.0 && target.bb.maxY > this.bb.minY && target.bb.minY < this.bb.maxY) {
      // §Monster.cpp:106 — `attackTime = getAttackTime();`
      this.attackTime = this.getAttackTime();
      // §Monster.cpp:107 — `doHurtTarget(target);`
      this.doHurtTarget(target);
    }
  }

  /** §Monster.cpp:111-114 — `float Monster::getWalkTargetValue(int, int, int)`. */
  override getWalkTargetValue(x: number, y: number, z: number): number {
    const level = this.level;
    if (!level) return 0;
    // §Monster.cpp:113 — `return 0.5f - level->getBrightness(x, y, z);`
    return 0.5 - level.getBrightness(x, y, z);
  }

  /** §Monster.cpp:116-118 — `int Monster::getCreatureBaseType() const { return MobTypes::BaseEnemy; }`. */
  override getCreatureBaseType(): number {
    return MobType.BaseEnemy;
  }

  /** §Monster.cpp:120-123 — `Mob* Monster::getTarget()` — lookup via level.getMob. */
  getTarget(): Mob | null {
    if (this.targetId === 0) return null;
    const level = this.level;
    if (!level) return null;
    return level.getMob(this.targetId) as Mob | null;
  }

  /** §Monster.cpp:125-127 — `void Monster::setTarget(Mob* mob)`. */
  setTarget(mob: Mob | null): void {
    this.targetId = mob ? mob.entityId : 0;
  }

  /** §Monster.cpp:129-132 — `Mob* Monster::getLastHurtByMob()`. */
  getLastHurtByMob(): Mob | null {
    if (this.targetId === 0) return null;
    const level = this.level;
    if (!level) return null;
    return level.getMob(this.lastHurtByMobId) as Mob | null;
  }

  /** §Monster.cpp:134-136 — `void Monster::setLastHurtByMob(Mob* mob)`. */
  setLastHurtByMob(mob: Mob | null): void {
    this.lastHurtByMobId = mob ? mob.entityId : 0;
  }

  /** §Monster.cpp:138-140 — `virtual int Monster::getAttackDamage(Entity* target)`. */
  getAttackDamage(_target: Entity): number {
    void _target;
    return this.attackDamage;
  }

  /** §Monster.cpp:142-144 — `virtual int Monster::getAttackTime() { return 20; }`. */
  getAttackTime(): number {
    return MONSTER_DEFAULT_ATTACK_TIME;
  }
}
