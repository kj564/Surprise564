// §MCPE 2013 Mob hierarchy — PathfinderMob + AgableMob + FlyingMob.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   PathfinderMob.h:13-65   — AIData struct, MAX_TURN, pathfinderMask flags
//   PathfinderMob.cpp:11-248 — full PathfinderMob implementation
//   AgableMob.h:8-30        — age + DATA_FLAGS_ID + DATAFLAG_ISBABY
//   AgableMob.cpp:3-53      — setAge / isBaby / aiStep aging
//   FlyingMob.h:11-24       — travel + onLadder overrides
//   FlyingMob.cpp:7-71      — flying-travel friction model (no gravity)

import { TICKS_PER_SECOND } from '../../constants';
import type { EntityLevel } from './level';
import { Mob, type PathNavigation } from './mob';
import type { Entity } from './entity';

/** §PathfinderMob.h:24 — `static const int MAX_TURN = 30;`. */
export const MAX_TURN = 30;
/** §PathfinderMob.h:58 — `static const int CAN_OPEN_DOORS = 1;`. */
export const CAN_OPEN_DOORS = 1;
/** §PathfinderMob.h:59 — `static const int AVOID_WATER = 2;`. */
export const AVOID_WATER = 2;

/** §AgableMob.h:25 — `static const int DATA_FLAGS_ID = 14;`. */
export const DATA_FLAGS_ID_AGEABLE = 14;
/** §AgableMob.h:27 — `static const int DATAFLAG_ISBABY = 0;`. */
export const DATAFLAG_ISBABY = 0;

/** §PathfinderMob.h:13-19 — `struct AIData { Mob* target; }`. */
export interface AIData {
  target: Mob | null;
}

/** Position read out of a path object (browser-layer pathfinder provides). */
export interface PathPoint { readonly x: number; readonly y: number; readonly z: number; }
/** Path object shape that PathfinderMob reads (level adapter returns one). */
export interface PathHandle {
  currentPos(self: unknown): PathPoint;
  next(): void;
  isDone(): boolean;
  destroy(): void;
}

/**
 * §PathfinderMob.h:21-65 — `PathfinderMob: public Mob`.
 *
 * Adds: attack-target tracking, path navigation, random-stroll selection,
 * `getWalkingSpeedModifier` 2× boost when fleeing. The C++ class wires a
 * real `PathNavigation` + `Sensing`; here we keep the AI tick body but
 * leave path finding to the browser-layer adapter via the `Level`.
 */
export abstract class PathfinderMob extends Mob {
  /** §PathfinderMob.h:54 — `int attackTargetId;` (0 = no target). */
  attackTargetId = 0;
  /** §PathfinderMob.h:55 — `bool holdGround;` set when target is in range. */
  holdGround = false;
  /** §PathfinderMob.h:56 — `int fleeTime;` ticks of 2× speed boost after being hurt. */
  fleeTime = 0;

  /** §PathfinderMob.h:62 — `Path path;` opaque path object held by navigation. */
  protected path: PathHandle | null = null;

  constructor(level: EntityLevel | null) {
    super(level);
    // §PathfinderMob.cpp:19-20 — `sensing = new Sensing(this); navigation = new PathNavigation(...)`.
    // The browser layer assigns concrete sensing/navigation via fields.
  }

  /** §PathfinderMob.cpp:28-31 — `bool PathfinderMob::canSpawn()` — super + walkTargetValue. */
  override canSpawn(): boolean {
    if (!super.canSpawn()) return false;
    // §PathfinderMob.cpp:30 — `getWalkTargetValue(floor(x), floor(bb.y0), floor(z)) >= 0`
    return this.getWalkTargetValue(Math.floor(this.x), Math.floor(this.bb.minY), Math.floor(this.z)) >= 0;
  }

  /** §PathfinderMob.cpp:33-36 — `bool PathfinderMob::isPathFinding()`. */
  isPathFinding(): boolean {
    // §PathfinderMob.cpp:35 — `return !path.isEmpty();`
    return this.path != null;
  }

  /** §PathfinderMob.cpp:38-41 — `void PathfinderMob::setPath(Path&)`. */
  setPath(path: PathHandle | null): void {
    this.path = path;
  }

  /** §PathfinderMob.cpp:43-47 — `Entity* PathfinderMob::getAttackTarget()`. */
  getAttackTarget(): Entity | null {
    if (this.attackTargetId === 0) return null;
    const level = this.level;
    if (!level) return null;
    return level.getEntity(this.attackTargetId) as Entity | null;
  }

  /** §PathfinderMob.cpp:49-52 — `void PathfinderMob::setAttackTarget(Entity*)`. */
  setAttackTarget(attacker: Entity | null): void {
    this.attackTargetId = attacker ? attacker.entityId : 0;
  }

  /** §PathfinderMob.cpp:54-57 — `bool PathfinderMob::shouldHoldGround() { return false; }`. */
  shouldHoldGround(): boolean {
    return false;
  }

  /** §PathfinderMob.cpp:59-185 — `void PathfinderMob::updateAi()`. */
  override updateAi(): void {
    if (this.fleeTime > 0) this.fleeTime--;
    this.holdGround = this.shouldHoldGround();
    const maxDist = 16;

    let attackTarget: Entity | null = null;
    if (this.attackTargetId === 0) {
      // §PathfinderMob.cpp:69 — `attackTarget = findAttackTarget();`
      attackTarget = this.findAttackTarget();
      if (attackTarget) {
        // §PathfinderMob.cpp:71 — `level->findPath(&path, this, attackTarget, maxDist, false, false);`
        this.path = this.findPathToEntity(attackTarget, maxDist);
        this.attackTargetId = attackTarget.entityId;
      }
    } else {
      const level = this.level;
      attackTarget = level ? level.getEntity(this.attackTargetId) as Entity | null : null;
      if (!attackTarget || !attackTarget.isAlive()) {
        // §PathfinderMob.cpp:78-79 — clear stale target.
        this.attackTargetId = 0;
        attackTarget = null;
      } else {
        this.attackTargetId = attackTarget.entityId;
        const d = attackTarget.distanceToEntity(this);
        if (this.canSee(attackTarget)) {
          // §PathfinderMob.cpp:84 — `checkHurtTarget(attackTarget, d);`
          this.checkHurtTarget(attackTarget, d);
        } else {
          // §PathfinderMob.cpp:86 — `checkCantSeeTarget(attackTarget, d);`
          this.checkCantSeeTarget(attackTarget, d);
        }
      }
    }

    // §PathfinderMob.cpp:96-111 — random stroll decision
    let doStroll = false;
    if (!this.holdGround && attackTarget && (!this.path || this.random.nextInt(20) === 0)) {
      this.path = this.findPathToEntity(attackTarget, maxDist);
    } else if (!this.holdGround) {
      if (!this.path && this.random.nextInt(180) === 0) {
        doStroll = true;
      } else if (this.random.nextInt(120) === 0) {
        doStroll = true;
      } else if (this.fleeTime > 0 && (this.fleeTime & 7) === 1) {
        doStroll = true;
      }
    }
    if (doStroll && this.noActionTime < TICKS_PER_SECOND * 5) {
      this.findRandomStrollLocation();
    }

    // §PathfinderMob.cpp:113-122 — empty path or rare random → super.updateAi
    if (!this.path || this.random.nextInt(100) === 0) {
      super.updateAi();
      return;
    }

    // §PathfinderMob.cpp:124-184 — follow-path body (target point, rotation).
    const target = this.path.currentPos(this);
    if (target) {
      const r = this.bbWidth * 2;
      // §PathfinderMob.cpp:128 — `target.distanceToSqr(x, target.y, z) < r*r` → advance.
      if (this.distanceToSqr(target.x, target.y, target.z) >= r * r) {
        const xd = target.x - this.x;
        const zd = target.z - this.z;
        const yRotD = Math.atan2(zd, xd) * (180 / Math.PI) - 90;
        let rotDiff = yRotD - this.yRot;
        // §PathfinderMob.cpp:145-148 — wrap to [-180, 180)
        while (rotDiff < -180) rotDiff += 360;
        while (rotDiff >= 180) rotDiff -= 360;
        // §PathfinderMob.cpp:149-156 — clamp to ±MAX_TURN
        if (rotDiff > MAX_TURN) rotDiff = MAX_TURN;
        if (rotDiff < -MAX_TURN) rotDiff = -MAX_TURN;
        this.yya = this.runSpeed;
        this.yRot += rotDiff;
        const yd = target.y - Math.floor(this.bb.minY + 0.5);
        if (yd > 0) this.jumping = true;
      }
    }

    if (attackTarget) {
      // §PathfinderMob.cpp:178 — `lookAt(attackTarget, 30, 30);`
      this.lookAt(attackTarget, 30, 30);
    }
    if (this.horizontalCollision && !this.isPathFinding()) this.jumping = true;
    if (this.random.nextFloat() < 0.8 && (this.isInWater() || this.isInLava())) this.jumping = true;
  }

  /** §PathfinderMob.cpp:187-214 — `void PathfinderMob::findRandomStrollLocation()`. */
  findRandomStrollLocation(): void {
    let hasBest = false;
    let xBest = 0, yBest = 0, zBest = 0;
    let best = -99999;
    // §PathfinderMob.cpp:195 — `for (int i = 0; i < 10; i++)`
    for (let i = 0; i < 10; i++) {
      const xt = Math.floor(this.x + this.random.nextInt(13) - 6);
      const yt = Math.floor(this.y + this.random.nextInt(7) - 3);
      const zt = Math.floor(this.z + this.random.nextInt(13) - 6);
      const value = this.getWalkTargetValue(xt, yt, zt);
      if (value > best) {
        best = value;
        xBest = xt; yBest = yt; zBest = zt;
        hasBest = true;
      }
    }
    if (hasBest) {
      // §PathfinderMob.cpp:211 — `level->findPath(&path, this, xBest, yBest, zBest, 10, false, false);`
      this.path = this.findPathToCoords(xBest, yBest, zBest, 10);
    }
  }

  /** §PathfinderMob.cpp:216-218 — `void PathfinderMob::checkHurtTarget(Entity*, float)` — no-op base. */
  checkHurtTarget(_target: Entity, _d: number): void {
    void _target; void _d;
  }

  /** §PathfinderMob.cpp:220-224 — `void PathfinderMob::checkCantSeeTarget(Entity*, float d)`. */
  checkCantSeeTarget(_target: Entity, d: number): void {
    void _target;
    // §PathfinderMob.cpp:222-223 — `if (d > 32) attackTargetId = 0;`
    if (d > 32) this.attackTargetId = 0;
  }

  /** §PathfinderMob.cpp:226-229 — `float PathfinderMob::getWalkTargetValue(int, int, int)`. */
  getWalkTargetValue(_x: number, _y: number, _z: number): number {
    void _x; void _y; void _z;
    return 0;
  }

  /** §PathfinderMob.cpp:231-234 — `Entity* PathfinderMob::findAttackTarget() { return NULL; }`. */
  findAttackTarget(): Entity | null {
    return null;
  }

  /** §PathfinderMob.cpp:236-240 — `float PathfinderMob::getWalkingSpeedModifier()` — 2× if fleeing. */
  override getWalkingSpeedModifier(): number {
    let speed = super.getWalkingSpeedModifier();
    // §PathfinderMob.cpp:238 — `if (fleeTime > 0) speed *= 2;`
    if (this.fleeTime > 0) speed *= 2;
    return speed;
  }

  /** §PathfinderMob.cpp:242-244 — `int PathfinderMob::getNoActionTime()`. */
  getNoActionTime(): number {
    return this.noActionTime;
  }

  // === Path-finding hooks (browser-layer adapter) ===
  /** §Level.h `findPath(Entity*,Entity*,float,...)` — resolves via the level adapter. */
  private findPathToEntity(target: Entity, maxDist: number): PathHandle | null {
    const level = this.level as (EntityLevel & {
      findPath?: (self: unknown, target: unknown, dist: number) => PathHandle | null;
    }) | null;
    if (!level?.findPath) return null;
    return level.findPath(this, target, maxDist);
  }
  /** §Level.h `findPath(Entity*,int,int,int,int,...)` — coord variant for stroll. */
  private findPathToCoords(x: number, y: number, z: number, dist: number): PathHandle | null {
    const level = this.level as (EntityLevel & {
      findPathTo?: (self: unknown, x: number, y: number, z: number, dist: number) => PathHandle | null;
    }) | null;
    if (!level?.findPathTo) return null;
    return level.findPathTo(this, x, y, z, dist);
  }

  /** §PathfinderMob.cpp:246-248 — `PathNavigation* PathfinderMob::getNavigation()`. */
  getNavigation(): PathNavigation | null {
    return this.navigation;
  }
}

/**
 * §AgableMob.h:8-30 — `AgableMob: public PathfinderMob`.
 *
 * Carries a single signed `age` field: negative = baby (counts up to 0),
 * positive = breeding cooldown (counts down to 0). The baby bit lives in
 * the DATA_FLAGS_ID byte (id 14) at DATAFLAG_ISBABY=0.
 */
export abstract class AgableMob extends PathfinderMob {
  /** §AgableMob.h:23 — `int age;` initialised -1 in §AgableMob.cpp:5. */
  protected age = -1;

  constructor(level: EntityLevel | null) {
    super(level);
    // §AgableMob.cpp:7 — `entityData.define(DATA_FLAGS_ID, (TypeChar)0);`
    this.entityData.define(DATA_FLAGS_ID_AGEABLE, 0);
    // §AgableMob.cpp:8 — `setAge(0);`
    this.setAge(0);
  }

  /** §AgableMob.cpp:11-13 — `int AgableMob::getAge()`. */
  getAge(): number {
    return this.age;
  }

  /** §AgableMob.cpp:15-23 — `void AgableMob::setAge(int age)` — flips baby flag. */
  setAge(age: number): void {
    if (this.age < 0 && age >= 0) {
      // §AgableMob.cpp:17 — `entityData.clearFlag<TypeChar>(DATA_FLAGS_ID, DATAFLAG_ISBABY);`
      this.entityData.clearFlag(DATA_FLAGS_ID_AGEABLE, DATAFLAG_ISBABY);
    } else if (this.age >= 0 && age < 0) {
      // §AgableMob.cpp:20 — `entityData.setFlag<TypeChar>(DATA_FLAGS_ID, DATAFLAG_ISBABY);`
      this.entityData.setFlag(DATA_FLAGS_ID_AGEABLE, DATAFLAG_ISBABY);
    }
    this.age = age;
  }

  /** §AgableMob.cpp:35-45 — `void AgableMob::aiStep()` — age drift. */
  override aiStep(): void {
    super.aiStep();
    // §AgableMob.cpp:41-42 — `if (age < 0) setAge(age + 1);`
    if (this.age < 0) this.setAge(this.age + 1);
    // §AgableMob.cpp:43-44 — `else if (age > 0) setAge(age - 1);`
    else if (this.age > 0) this.setAge(this.age - 1);
  }

  /** §AgableMob.cpp:47-53 — `bool AgableMob::isBaby()` — server uses age; client uses flag. */
  override isBaby(): boolean {
    const level = this.level;
    if (level && !level.isClientSide) {
      // §AgableMob.cpp:49 — `return age < 0;`
      return this.age < 0;
    }
    // §AgableMob.cpp:51 — `return entityData.getFlag<TypeChar>(DATA_FLAGS_ID, DATAFLAG_ISBABY);`
    return this.entityData.getFlag(DATA_FLAGS_ID_AGEABLE, DATAFLAG_ISBABY);
  }

  /** §AgableMob.cpp:25-28 — `addAdditonalSaveData` adds Age. */
  override addAdditonalSaveData(tag: Record<string, unknown>): void {
    super.addAdditonalSaveData(tag);
    // §AgableMob.cpp:27 — `tag->putInt("Age", getAge());`
    tag['Age'] = this.getAge();
  }

  /** §AgableMob.cpp:30-33 — `readAdditionalSaveData` reads Age. */
  override readAdditionalSaveData(tag: Record<string, unknown>): void {
    super.readAdditionalSaveData(tag);
    // §AgableMob.cpp:32 — `setAge(tag->getInt("Age"));`
    this.setAge(Number(tag['Age'] ?? 0));
  }

  /** §AgableMob.h — `Animal* getBreedOffspring(Animal*)` — override point. */
  getBreedOffspring(target: AgableMob | null): AgableMob | null {
    void target;
    return null;
  }
}

/**
 * §FlyingMob.h:11-24 — `FlyingMob: public Mob`.
 *
 * Same `travel(xa, ya)` signature as Mob, but with no gravity — yd is
 * damped by ground friction (not subtracted by 0.08 each tick). Used by
 * Ghast-style mobs (not present in MCPE 2013, but the class ships anyway).
 */
export abstract class FlyingMob extends Mob {
  /** §FlyingMob.cpp:12-62 — `void FlyingMob::travel(float xa, float ya)`. */
  override travel(xa: number, ya: number): void {
    if (this.isInWater()) {
      // §FlyingMob.cpp:14-20
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.80;
      this.yd *= 0.80;
      this.zd *= 0.80;
    } else if (this.isInLava()) {
      // §FlyingMob.cpp:21-26
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.50;
      this.yd *= 0.50;
      this.zd *= 0.50;
    } else {
      // §FlyingMob.cpp:27-53 — ground/air friction model (no gravity!)
      let friction = 0.91;
      if (this.onGround) {
        // §FlyingMob.cpp:29-35 — `friction = 0.6f * 0.91f;`
        friction = 0.6 * 0.91;
      }
      // §FlyingMob.cpp:37 — `friction2 = (0.6*0.6*0.91*0.91*0.6*0.91) / (friction^3)`
      const friction2 = (0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91) / (friction * friction * friction);
      // §FlyingMob.cpp:38 — `moveRelative(xa, ya, onGround ? 0.1f * friction2 : 0.02f);`
      this.moveRelative(xa, ya, this.onGround ? 0.1 * friction2 : 0.02);

      friction = 0.91;
      if (this.onGround) friction = 0.6 * 0.91;

      this.move(this.xd, this.yd, this.zd);

      // §FlyingMob.cpp:51-53 — `xd *= friction; yd *= friction; zd *= friction;`
      this.xd *= friction;
      this.yd *= friction;
      this.zd *= friction;
    }
    // §FlyingMob.cpp:55-61 — inline updateWalkAnim.
    this.walkAnimSpeedO = this.walkAnimSpeed;
    const xxd = this.x - this.xo;
    const zzd = this.z - this.zo;
    let wst = Math.sqrt(xxd * xxd + zzd * zzd) * 4;
    if (wst > 1) wst = 1;
    this.walkAnimSpeed += (wst - this.walkAnimSpeed) * 0.4;
    this.walkAnimPos += this.walkAnimSpeed;
  }

  /** §FlyingMob.cpp:64-67 — `bool FlyingMob::onLadder() { return false; }`. */
  override onLadder(): boolean {
    return false;
  }

  /** §FlyingMob.cpp:69-71 — `void FlyingMob::causeFallDamage(float)` — no-op. */
  override causeFallDamage(_distance: number): void {
    void _distance;
  }
}
