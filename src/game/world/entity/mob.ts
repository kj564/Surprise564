// §MCPE 2013 Mob base class — 1:1 port from rujukan C++ source.
import { Aabb } from '../physics/aabb';
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Mob.h:23-247   — Mob class declaration (fields + virtuals)
//   Mob.cpp:27-85  — constructor / _init / entityData.define(...)
//   Mob.cpp:91-146 — getWalkingSpeedModifier / canSee / getTexture / pickable
//   Mob.cpp:148-237 — Mob::baseTick (death, ambient sounds, network sync)
//   Mob.cpp:270-376 — Mob::tick (arrowCount, lerp, walk anim, body rotation)
//   Mob.cpp:383-449 — heal / hurt / actuallyHurt (the central damage path)
//   Mob.cpp:471-512 — knockback / die / dropDeathLoot / getDeathLoot
//   Mob.cpp:541-556 — causeFallDamage (dmg = ceil(distance - 3))
//   Mob.cpp:558-626 — travel (water/lava/ground friction)
//   Mob.cpp:628-645 — updateWalkAnim / onLadder
//   Mob.cpp:688-757 — aiStep (jumping, decay, travel, push)
//   Mob.cpp:760-802 — updateAi (legacy AI)
//   Mob.cpp:844-847 — jumpFromGround (yd = 0.42f)
//   Mob.cpp:1080-1099 — updateAttackAnim / swing (SWING_DURATION)

import { TICKS_PER_SECOND, GRAVITY_PER_TICK, AIR_DRAG_PER_TICK, INPUT_DECAY, YAW_ROT_DECAY, FRICTION2_NUMERATOR } from '../../constants';
import type { EntityLevel } from './level';
import { EntityEvent, type Random } from './level';
import { Entity } from './entity';
import { SynchedEntityData } from './synched-entity-data';
import { DATA_AIR_SUPPLY_ID, DATA_SHARED_FLAGS_ID, SharedFlag } from './types';
import { TOTAL_AIR_SUPPLY } from './entity';

/** §Mob.h:27 — `static const int ATTACK_DURATION = 5;` */
export const ATTACK_DURATION = 5;
/** §Mob.h:28 — `static const int SWING_DURATION = 8;` */
export const SWING_DURATION = 8;

/** §Mob.h:81 — `virtual int getMaxHealth() { return 10; }` default. */
export const DEFAULT_MOB_MAX_HEALTH = 10;

/** §Mob.cpp:41 — `runSpeed(0.7f)` — default run speed for non-monster mobs. */
export const DEFAULT_RUN_SPEED = 0.7;
/** §Mob.cpp:42 — `walkingSpeed(0.1f)` — default walkingSpeed. */
export const DEFAULT_WALKING_SPEED = 0.1;
/** §Mob.cpp:43 — `flyingSpeed(0.02f)` — default flyingSpeed. */
export const DEFAULT_FLYING_SPEED = 0.02;

/** §Mob.h:241 — `GoalSelector* goalSelector;` opaque handle (browser-side goal tree). */
export interface GoalSelector { tick(): void; }
/** §Mob.h:241 — `PathNavigation* navigation;` opaque handle. */
export interface PathNavigation { tick(): void; }
/** §Mob.h:237 — `MoveControl* moveControl;` opaque handle. */
export interface MoveControl { tick(): void; }
/** §Mob.h:238 — `JumpControl* jumpControl;` opaque handle. */
export interface JumpControl { tick(): void; }
/** §Mob.h:196 — `Sensing* sensing;` opaque handle (visibility cache). */
export interface Sensing { tick(): void; }

/** §Mob.h:27-247 — Mob class. */
export abstract class Mob extends Entity {
  /** §Mob.h:163 — `int invulnerableDuration;` default 20 (§Mob.cpp:29). */
  invulnerableDuration = 20;

  /** §Mob.h:165 — `float timeOffs;` random phase offset. */
  timeOffs = 0;
  /** §Mob.h:167 — `float rotA;` random yaw drift per tick. */
  rotA = 0;
  /** §Mob.h:168 — `float yBodyRot, yBodyRotO;` */
  yBodyRot = 0;
  yBodyRotO = 0;

  /** §Mob.h:171 — `float oAttackAnim, attackAnim;` */
  oAttackAnim = 0;
  attackAnim = 0;

  /** §Mob.h:173 — `int health;` initialised to getMaxHealth() in ctor (§Mob.cpp:74). */
  health = DEFAULT_MOB_MAX_HEALTH;
  /** §Mob.h:174 — `int lastHealth;` */
  lastHealth = 20;

  /** §Mob.h:176 — `int hurtTime;` */
  hurtTime = 0;
  /** §Mob.h:177 — `int hurtDuration;` */
  hurtDuration = 0;
  /** §Mob.h:178 — `float hurtDir;` */
  hurtDir = 0;

  /** §Mob.h:180 — `int deathTime;` */
  deathTime = 0;
  /** §Mob.h:181 — `int attackTime;` */
  attackTime = 0;
  /** §Mob.h:182 — `float oTilt, tilt;` */
  oTilt = 0;
  tilt = 0;

  /** §Mob.h:184 — `int lookTime;` */
  lookTime = 0;
  /** §Mob.h:185 — `float fallTime;` */
  fallTime = 0;

  /** §Mob.h:187 — `float walkAnimSpeedO;` */
  walkAnimSpeedO = 0;
  /** §Mob.h:188 — `float walkAnimSpeed;` */
  walkAnimSpeed = 0;
  /** §Mob.h:189 — `float walkAnimPos;` */
  walkAnimPos = 0;

  /** §Mob.h:192 — `int arrowCount;` */
  arrowCount = 0;
  /** §Mob.h:193 — `int removeArrowTime;` */
  removeArrowTime = 0;

  /** §Mob.h:195 — `Random random;` per-mob RNG (mirrors §Mob.cpp sharedRandom usage). */
  random: Random;

  /** §Mob.h:202 — `bool bypassArmor;` (default false, §Mob.cpp:68). */
  bypassArmor = false;

  // === protected (§Mob.h:204-235) ===
  /** §Mob.h:204 — `SynchedEntityData entityData;` */
  protected entityData = new SynchedEntityData();
  /** §Mob.h:205 — `bool swinging;` */
  protected swinging = false;
  /** §Mob.h:206 — `int swingTime;` */
  protected swingTime = 0;
  /** §Mob.h:207 — `int noActionTime;` */
  protected noActionTime = 0;
  /** §Mob.h:208 — `float xxa, yya, yRotA;` */
  protected xxa = 0;
  protected yya = 0;
  protected yRotA = 0;
  /** §Mob.h:209 — `float defaultLookAngle;` (default 0, §Mob.cpp:40). */
  protected defaultLookAngle = 0;

  /** §Mob.h:211 — `float runSpeed;` default 0.7 (§Mob.cpp:41). */
  protected runSpeed = DEFAULT_RUN_SPEED;
  /** §Mob.h:212 — `float walkingSpeed;` default 0.1 (§Mob.cpp:42). */
  protected walkingSpeed = DEFAULT_WALKING_SPEED;
  /** §Mob.h:213 — `float flyingSpeed;` default 0.02 (§Mob.cpp:43). */
  protected flyingSpeed = DEFAULT_FLYING_SPEED;

  /** §Mob.h:215 — `std::string textureName;` default mob/char.png (§Mob.cpp:31). */
  protected textureName = 'mob/char.png';
  /** §Mob.h:216 — `std::string modelName;` */
  protected modelName = '';
  /** §Mob.h:217 — `int deathScore;` */
  protected deathScore = 0;
  /** §Mob.h:218 — `float oRun, run;` */
  protected oRun = 0;
  protected run = 0;
  /** §Mob.h:219 — `float animStep, animStepO;` */
  protected animStep = 0;
  protected animStepO = 0;
  /** §Mob.h:220 — `float rotOffs;` */
  protected rotOffs = 0;
  /** §Mob.h:221 — `float bobStrength;` default 1 (§Mob.cpp:34). */
  protected bobStrength = 1;
  /** §Mob.h:222 — `float renderOffset;` */
  protected renderOffset = 0;

  /** §Mob.h:224 — `int lSteps;` */
  protected lSteps = 0;
  /** §Mob.h:225 — `float lx, ly, lz, lyr, lxr;` */
  protected lx = 0;
  protected ly = 0;
  protected lz = 0;
  protected lyr = 0;
  protected lxr = 0;
  /** §Mob.h:226 — `int lastHurt;` */
  protected lastHurt = 0;
  /** §Mob.h:227 — `int dmgSpill;` */
  protected dmgSpill = 0;

  /** §Mob.h:229 — `float sentX, sentY, sentZ, sentRotX, sentRotY;` */
  protected sentX = 0;
  protected sentY = 0;
  protected sentZ = 0;
  protected sentRotX = 0;
  protected sentRotY = 0;
  /** §Mob.h:230 — `float sentXd, sentYd, sentZd;` */
  protected sentXd = 0;
  protected sentYd = 0;
  protected sentZd = 0;

  /** §Mob.h:234 — `bool jumping;` default false (§Mob.cpp:39). */
  protected jumping = false;
  /** §Mob.h:235 — `bool autoSendPosRot;` default true (§Mob.cpp:51). */
  protected autoSendPosRot = true;

  /** §Mob.h:237-241 — AI handles (lazily assigned by subclasses). */
  moveControl: MoveControl | null = null;
  jumpControl: JumpControl | null = null;
  navigation: PathNavigation | null = null;
  goalSelector: GoalSelector | null = null;
  targetSelector: GoalSelector | null = null;
  sensing: Sensing | null = null;

  /** §Mob.h:244 — `int lookingAtId;` */
  private lookingAtId = 0;
  /** §Mob.h:245 — `int ambientSoundTime;` */
  private ambientSoundTime = 0;
  /** §Mob.h:246 — `float speed;` */
  private speed = 0;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Mob.cpp:70 — `entityData.define(DATA_SHARED_FLAGS_ID, (TypeChar) 0);`
    this.entityData.define(DATA_SHARED_FLAGS_ID, 0);
    // §Mob.cpp:71 — `entityData.define(DATA_AIR_SUPPLY_ID, (TypeShort) TOTAL_AIR_SUPPLY);`
    this.entityData.define(DATA_AIR_SUPPLY_ID, TOTAL_AIR_SUPPLY);

    this._init();
    // §Mob.cpp:74 — `health = getMaxHealth();`
    this.health = this.getMaxHealth();

    // §Mob.cpp:76 — `blocksBuilding = true;`
    this.blocksBuilding = true;
    // §Mob.cpp:77 — `ambientSoundTime = -level->random.nextInt(100);`
    this.ambientSoundTime = level ? -level.random.nextInt(100) : 0;

    // §Mob.cpp:79 — `rotA = (Mth::random() + 1) * 0.01f;`
    this.rotA = (Math.random() + 1) * 0.01;
    this.setPos(this.x, this.y, this.z);
    // §Mob.cpp:81 — `timeOffs = Mth::random() * 12398;`
    this.timeOffs = Math.random() * 12398;
    // §Mob.cpp:82 — `yRot = Mth::random() * Mth::PI * 2;`
    this.yRot = Math.random() * Math.PI * 2;

    // §Mob.cpp:84 — `this->footSize = 0.5f;`
    this.footSize = 0.5;

    this.random = level?.random ?? Entity.sharedRandom;
  }

  // === §Mob.cpp:519-539 — _init / reset ===
  /** §Mob.cpp:519-539 — `void Mob::_init()`. */
  protected override _init(): void {
    super._init();
    this.yBodyRot = 0;
    this.yBodyRotO = 0;
    this.rotOffs = 0;
    this.fallTime = 0;
    this.lastHurt = 0;
    this.deathTime = 0;
    this.attackTime = 0;
    this.tilt = 0;
    this.oTilt = 0;
    this.hurtDuration = 0;
    this.hurtTime = 0;
    this.hurtDir = 0;
    this.lookTime = 0;
    this.noActionTime = 0;
    this.xxa = 0;
    this.yya = 0;
    this.yRotA = 0;
    // §Mob.cpp:537 — `health = 10;`
    this.health = 10;
    // §Mob.cpp:538 — `lastHealth = 20;`
    this.lastHealth = 20;
  }

  /** §Mob.h:81 — `virtual int getMaxHealth() { return 10; }`. */
  getMaxHealth(): number {
    return DEFAULT_MOB_MAX_HEALTH;
  }

  /** §Mob.h:116 — `virtual bool isMob() { return true; }`. */
  override isMob(): boolean {
    return true;
  }

  /** §Mob.h:117 — `virtual bool isBaby() { return false; }`. */
  isBaby(): boolean {
    return false;
  }

  /** §Mob.h:113 — `virtual int getMaxSpawnClusterSize() { return 4; }` (§Mob.cpp:974-977). */
  getMaxSpawnClusterSize(): number {
    return 4;
  }

  /** §Mob.cpp:91-101 — `float Mob::getWalkingSpeedModifier()` — 0.7 in MCPE. */
  getWalkingSpeedModifier(): number {
    // §Mob.cpp:92 — `float speed = 0.7f;`
    return 0.7;
  }

  /** §Mob.cpp:108-111 — `std::string Mob::getTexture() { return textureName; }`. */
  getTexture(): string {
    return this.textureName;
  }

  /** §Mob.cpp:113-116 — `bool Mob::isPickable() { return !removed; }`. */
  override isPickable(): boolean {
    return !this.removed;
  }
  /** §Mob.cpp:118-121 — `bool Mob::isPushable() { return !removed; }`. */
  isPushable(): boolean {
    return !this.removed;
  }
  /** §Mob.cpp:647-650 — `bool Mob::isShootable() { return true; }`. */
  override isShootable(): boolean {
    return true;
  }

  /** §Mob.cpp:123-126 — `float Mob::getHeadHeight() { return bbHeight * 0.85f; }`. */
  override getHeadHeight(): number {
    return this.bbHeight * 0.85;
  }

  /** §Mob.cpp:128-133 — `float Mob::getVoicePitch()` — baby vs adult pitch. */
  getVoicePitch(): number {
    if (this.isBaby()) {
      // §Mob.cpp:130 — `(random.nextFloat() - random.nextFloat()) * 0.2f + 1.5f;`
      return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1.5;
    }
    // §Mob.cpp:132 — `(random.nextFloat() - random.nextFloat()) * 0.2f + 1.0f;`
    return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1.0;
  }

  /** §Mob.cpp:135-138 — `int Mob::getAmbientSoundInterval() { return 8 * TPS; }`. */
  getAmbientSoundInterval(): number {
    return 8 * TICKS_PER_SECOND;
  }

  /** §Mob.cpp:140-146 — `void Mob::playAmbientSound()`. */
  playAmbientSound(): void {
    const ambient = this.getAmbientSound();
    const level = this.level;
    if (ambient && level) {
      // §Mob.cpp:144 — `level->playSound(this, ambient, getSoundVolume(), getVoicePitch());`
      level.playSound(this, ambient, this.getSoundVolume(), this.getVoicePitch());
    }
  }

  /** §Mob.cpp:148-237 — `void Mob::baseTick()` — death, ambient sound, network sync. */
  override baseTick(): void {
    // §Mob.cpp:150 — `oAttackAnim = attackAnim;`
    this.oAttackAnim = this.attackAnim;
    super.baseTick();

    // §Mob.cpp:155-158 — ambient sound timer
    if (((this.ambientSoundTime++ & 15) === 0) && this.random.nextInt(2000) < this.ambientSoundTime) {
      this.ambientSoundTime = -this.getAmbientSoundInterval();
      this.playAmbientSound();
    }

    // §Mob.cpp:160-162 — suffocation damage
    if (this.isAlive() && this.isInWall()) {
      this.hurt(null, 1);
    }

    // §Mob.cpp:166-181 — drowning damage
    if (this.isAlive() && this.isUnderLiquid('water') && !this.isWaterMob()) {
      this.airSupply--;
      if (this.airSupply === -20) {
        this.airSupply = 0;
        // §Mob.cpp:170-176 — bubble particles (browser-layer concern; level adapter handles).
        // §Mob.cpp:176 — `hurt(NULL, 2);`
        this.hurt(null, 2);
      }
    } else {
      // §Mob.cpp:180 — `airSupply = airCapacity;`
      this.airSupply = this.airCapacity;
    }

    // §Mob.cpp:183-186 — decay timers
    this.oTilt = this.tilt;
    if (this.attackTime > 0) this.attackTime--;
    if (this.hurtTime > 0) this.hurtTime--;
    if (this.invulnerableTime > 0) this.invulnerableTime--;

    // §Mob.cpp:188-200 — death animation
    if (this.health <= 0) {
      this.deathTime++;
      if (this.deathTime > TICKS_PER_SECOND) {
        // §Mob.cpp:191 — `beforeRemove(); remove();`
        this.beforeRemove();
        this.remove();
      }
    }

    // §Mob.cpp:202-206 — animation snapshots
    this.animStepO = this.animStep;
    this.yBodyRotO = this.yBodyRot;
    this.yRotO = this.yRot;
    this.xRotO = this.xRot;
  }

  /** §Mob.cpp:270-376 — `void Mob::tick()` — super.tick + arrow count + walk anim. */
  override tick(): void {
    super.tick();

    // §Mob.cpp:274-282 — embedded arrow countdown
    if (this.arrowCount > 0) {
      if (this.removeArrowTime <= 0) {
        // §Mob.cpp:276 — `removeArrowTime = 20 * 3;`
        this.removeArrowTime = 20 * 3;
      }
      this.removeArrowTime--;
      if (this.removeArrowTime <= 0) {
        this.arrowCount--;
      }
    }

    // §Mob.cpp:284-301 — lerp steps (network position smoothing)
    if (this.lSteps > 0) {
      const xt = this.x + (this.lx - this.x) / this.lSteps;
      const yt = this.y + (this.ly - this.y) / this.lSteps;
      const zt = this.z + (this.lz - this.z) / this.lSteps;
      let yrd = this.lyr - this.yRot;
      while (yrd < -180) yrd += 360;
      while (yrd >= 180) yrd -= 360;
      this.yRot += yrd / this.lSteps;
      this.xRot += (this.lxr - this.xRot) / this.lSteps;
      this.lSteps--;
      this.setPos(xt, yt, zt);
      this.setRot(this.yRot, this.xRot);
    }

    // §Mob.cpp:303 — `aiStep();`
    this.aiStep();

    // §Mob.cpp:305 — `updateWalkAnim();`
    this.updateWalkAnim();

    // §Mob.cpp:307-330 — body-rotation walk animation (browser-layer concern
    // in vanilla; preserved verbatim so renderer interpolation works the same).
    const dx = this.x - this.xo;
    const dz = this.z - this.zo;
    const sideDist = Math.sqrt(dx * dx + dz * dz);
    let yBodyRotT = this.yBodyRot;
    let walkSpeed = 0;
    this.oRun = this.run;
    let tRun = 0;
    if (sideDist <= 0.05) {
      // §Mob.cpp:318 — no movement, no walk update.
    } else {
      tRun = 1;
      walkSpeed = sideDist * 3;
      // §Mob.cpp:322 — `yBodyRotT = atan2(zd, xd) * RADDEG - 90;`
      yBodyRotT = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
    }
    if (this.attackAnim > 0) {
      // §Mob.cpp:325 — `yBodyRotT = yRot;`
      yBodyRotT = this.yRot;
    }
    if (!this.onGround) {
      // §Mob.cpp:328 — `tRun = 0;`
      tRun = 0;
    }
    // §Mob.cpp:330 — `run = run + (tRun - run) * 0.3f;`
    this.run += (tRun - this.run) * 0.3;

    let yBodyRotD = yBodyRotT - this.yBodyRot;
    while (yBodyRotD < -180) yBodyRotD += 360;
    while (yBodyRotD >= 180) yBodyRotD -= 360;
    // §Mob.cpp:343 — `yBodyRot += yBodyRotD * 0.3f;`
    this.yBodyRot += yBodyRotD * 0.3;

    let headDiff = this.yRot - this.yBodyRot;
    while (headDiff < -180) headDiff += 360;
    while (headDiff >= 180) headDiff -= 360;
    const behind = headDiff < -90 || headDiff >= 90;
    if (headDiff < -75) headDiff = -75;
    if (headDiff >= 75) headDiff = +75;
    this.yBodyRot = this.yRot - headDiff;
    if (headDiff * headDiff > 50 * 50) {
      // §Mob.cpp:355 — `yBodyRot += headDiff * 0.2f;`
      this.yBodyRot += headDiff * 0.2;
    }
    if (behind) {
      // §Mob.cpp:359 — `walkSpeed *= -1;`
      walkSpeed *= -1;
    }
    while (this.yRot - this.yRotO < -180) this.yRotO -= 360;
    while (this.yRot - this.yRotO >= 180) this.yRotO += 360;
    while (this.yBodyRot - this.yBodyRotO < -180) this.yBodyRotO -= 360;
    while (this.yBodyRot - this.yBodyRotO >= 180) this.yBodyRotO += 360;
    while (this.xRot - this.xRotO < -180) this.xRotO -= 360;
    while (this.xRot - this.xRotO >= 180) this.xRotO += 360;
    // §Mob.cpp:375 — `animStep += walkSpeed;`
    this.animStep += walkSpeed;
  }

  /** §Mob.cpp:383-389 — `void Mob::heal(int heal)` — cap at 20 + reset invuln. */
  heal(heal: number): void {
    if (this.health <= 0) return;
    this.health += heal;
    // §Mob.cpp:387 — `if (health > 20) health = 20;`
    if (this.health > 20) this.health = 20;
    // §Mob.cpp:388 — `invulnerableTime = invulnerableDuration / 2;`
    this.invulnerableTime = Math.floor(this.invulnerableDuration / 2);
  }

  /** §Mob.cpp:391-441 — `bool Mob::hurt(Entity* source, int dmg)` — the central damage path. */
  override hurt(source: Entity | null, dmg: number): boolean {
    const level = this.level;
    if (level?.isClientSide) return false;
    // §Mob.cpp:394 — `noActionTime = 0;`
    this.noActionTime = 0;
    // §Mob.cpp:395 — `if (health <= 0) return false;`
    if (this.health <= 0) return false;

    // §Mob.cpp:397 — `this->walkAnimSpeed = 1.5f;`
    this.walkAnimSpeed = 1.5;

    let sound = true;
    // §Mob.cpp:400-412 — invuln window handling
    if (this.invulnerableTime > this.invulnerableDuration / 2.0) {
      if (dmg <= this.lastHurt) return false;
      // §Mob.cpp:402 — `actuallyHurt(dmg - lastHurt);`
      this.actuallyHurt(dmg - this.lastHurt);
      this.lastHurt = dmg;
      sound = false;
    } else {
      this.lastHurt = dmg;
      this.lastHealth = this.health;
      // §Mob.cpp:408 — `invulnerableTime = invulnerableDuration;`
      this.invulnerableTime = this.invulnerableDuration;
      this.actuallyHurt(dmg);
      // §Mob.cpp:410-411 — `hurtTime = hurtDuration = 10;`
      this.hurtTime = 10;
      this.hurtDuration = 10;
    }

    // §Mob.cpp:414 — `hurtDir = 0;`
    this.hurtDir = 0;

    if (sound) {
      if (level) {
        // §Mob.cpp:417 — `level->broadcastEntityEvent(this, EntityEvent::HURT);`
        level.broadcastEntityEvent(this, EntityEvent.Hurt);
      }
      this.markHurt();
      if (source) {
        let xd = source.x - this.x;
        let zd = source.z - this.z;
        // §Mob.cpp:422-425 — guard against zero vector (jitter).
        while (xd * xd + zd * zd < 0.0001) {
          xd = (Math.random() - Math.random()) * 0.01;
          zd = (Math.random() - Math.random()) * 0.01;
        }
        // §Mob.cpp:426 — `hurtDir = atan2(zd, xd) * RADDEG - yRot;`
        this.hurtDir = Math.atan2(zd, xd) * (180 / Math.PI) - this.yRot;
        // §Mob.cpp:427 — `knockback(source, dmg, xd, zd);`
        this.knockback(source, dmg, xd, zd);
      } else {
        // §Mob.cpp:429 — `hurtDir = (int)(random * 2.0) * 180.0f;`
        this.hurtDir = (Math.random() * 2 | 0) * 180;
      }
    }

    // §Mob.cpp:433-438 — death sound on lethal hit
    if (this.health <= 0) {
      if (sound && level) {
        level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      }
      this.die(source);
    } else if (sound && level) {
      // §Mob.cpp:437 — `level->playSound(this, getHurtSound(), ...);`
      level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
    }
    return true;
  }

  /** §Mob.cpp:443-449 — `void Mob::actuallyHurt(int dmg)` — armor absorb + health -=. */
  actuallyHurt(dmg: number): void {
    if (!this.bypassArmor) {
      dmg = this.getDamageAfterArmorAbsorb(dmg);
    }
    this.health -= dmg;
  }

  /** §Mob.cpp:451-454 — `float Mob::getSoundVolume() { return 1; }`. */
  getSoundVolume(): number {
    return 1;
  }

  /** §Mob.cpp:456-459 — `const char* Mob::getAmbientSound() { return NULL; }` — override point. */
  getAmbientSound(): string | null {
    return null;
  }

  /** §Mob.cpp:461-464 — `std::string Mob::getHurtSound() { return "random.hurt"; }`. */
  getHurtSound(): string {
    return 'random.hurt';
  }

  /** §Mob.cpp:466-469 — `std::string Mob::getDeathSound() { return "random.hurt"; }`. */
  getDeathSound(): string {
    return 'random.hurt';
  }

  /** §Mob.cpp:471-485 — `void Mob::knockback(Entity*, int, float, float)`. */
  knockback(source: Entity | null, _dmg: number, xd: number, zd: number): void {
    void source; void _dmg;
    // §Mob.cpp:473 — `float dd = Mth::invSqrt(xd*xd + zd*zd);`
    const dd = 1 / Math.sqrt(xd * xd + zd * zd);
    const pow = 0.4;
    // §Mob.cpp:476-478 — damp current velocity
    this.xd *= 0.5;
    this.yd *= 0.5;
    this.zd *= 0.5;
    // §Mob.cpp:480-482 — apply knockback
    this.xd -= xd * dd * pow;
    this.yd += 0.4;
    this.zd -= zd * dd * pow;
    // §Mob.cpp:484 — `if (yd > 0.4f) yd = 0.4f;`
    if (this.yd > 0.4) this.yd = 0.4;
  }

  /** §Mob.cpp:487-497 — `void Mob::die(Entity* source)`. */
  die(source: Entity | null): void {
    if (this.deathScore > 0 && source) {
      // §Mob.cpp:489 — `source->awardKillScore(this, deathScore);`
      source.awardKillScore(this as unknown as Entity, this.deathScore);
    }
    const level = this.level;
    if (level && !level.isClientSide) {
      if (!this.isBaby()) {
        // §Mob.cpp:493 — `dropDeathLoot();`
        this.dropDeathLoot();
      }
      // §Mob.cpp:495 — `level->broadcastEntityEvent(this, EntityEvent::DEATH);`
      level.broadcastEntityEvent(this, EntityEvent.Death);
    }
  }

  /** §Mob.cpp:499-507 — `void Mob::dropDeathLoot()` — roll 0..2 of getDeathLoot(). */
  dropDeathLoot(): void {
    const loot = this.getDeathLoot();
    if (loot) {
      // §Mob.cpp:503 — `int count = random.nextInt(3);`
      const count = this.random.nextInt(3);
      for (let i = 0; i < count; i++) {
        // §Mob.cpp:505 — `spawnAtLocation(loot, 1);`
        this.spawnAtLocation(loot, 1);
      }
    }
  }

  /** §Mob.cpp:509-512 — `int Mob::getDeathLoot() { return 0; }` — override point. */
  getDeathLoot(): string | null {
    return null;
  }

  /** §Mob.cpp:541-556 — `void Mob::causeFallDamage(float distance)`. */
  override causeFallDamage(distance: number): void {
    // §Mob.cpp:543 — `int dmg = (int) ceil(distance - 3);`
    const dmg = Math.ceil(distance - 3);
    if (dmg > 0) {
      const level = this.level;
      if (level) {
        // §Mob.cpp:546 — playSound(dmg > 4 ? "damage.fallbig" : "damage.fallsmall", 0.75, 1)
        level.playSound(this, dmg > 4 ? 'damage.fallbig' : 'damage.fallsmall', 0.75, 1);
      }
      this.hurt(null, dmg);
    }
  }

  /** §Mob.cpp:558-626 — `void Mob::travel(float xa, float ya)` — water/lava/ground. */
  /**
   * §Mob.cpp:558-626 — `void Mob::travel(float xa, float ya)` — EXACT 1:1 port.
   * Three branches: water, lava, land. The land branch has the critical
   * friction2 cube formula, double friction compute, and ladder logic.
   * Previous port was FABRICATED — rebuilt from MODLOG §27.7.
   */
  travel(xa: number, ya: number): void {
    // §Mob.cpp:560 — `if (isInWater())`
    if (this.isInWater()) {
      // §Mob.cpp:562 — `float yo = y;`
      const yo = this.y;
      // §Mob.cpp:563 — `moveRelative(xa, ya, 0.02f);`
      this.moveRelative(xa, ya, 0.02);
      // §Mob.cpp:564 — `move(xd, yd, zd);`
      this.move(this.xd, this.yd, this.zd);
      // §Mob.cpp:566-568 — water drag
      this.xd *= 0.80;
      this.yd *= 0.80;
      this.zd *= 0.80;
      // §Mob.cpp:569 — buoyancy
      this.yd -= 0.02;
      // §Mob.cpp:571 — auto-swim-up: if bumped wall AND space 0.6 above is free
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd)) {
        this.yd = 0.3;
      }
    }
    // §Mob.cpp:572 — `else if (isInLava())`
    else if (this.isInLava()) {
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      // §Mob.cpp:577-579 — lava drag (0.50, not 0.80)
      this.xd *= 0.50;
      this.yd *= 0.50;
      this.zd *= 0.50;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd)) {
        this.yd = 0.3;
      }
    }
    // §Mob.cpp:584 — `else` (land/air)
    else {
      // §Mob.cpp:585-592 — compute ground friction (first time)
      let friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        // §Mob.cpp:589 — look up tile 0.5 below bb.y0
        const t = this.getTileBelow();
        if (t > 0) {
          friction = this.getTileFriction(t) * 0.91;
        }
      }

      // §Mob.cpp:597 — friction2 cube formula (THE critical MC formula)
      // numerator = 0.6*0.6*0.91*0.91*0.6*0.91 ≈ 0.101
      // friction2 = numerator / friction³
      const friction2 = (0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91) / (friction * friction * friction);

      // §Mob.cpp:598 — `moveRelative(xa, ya, onGround ? walkingSpeed * friction2 : flyingSpeed)`
      this.moveRelative(xa, ya, this.onGround ? this.walkingSpeed * friction2 : this.flyingSpeed);

      // §Mob.cpp:600-605 — RECOMPUTE friction (move may have changed onGround)
      friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        const t = this.getTileBelow();
        if (t > 0) {
          friction = this.getTileFriction(t) * 0.91;
        }
      }

      // §Mob.cpp:607-611 — ladder logic
      if (this.onLadder()) {
        this.fallDistance = 0;
        if (this.yd < -0.15) this.yd = -0.15;
        if (this.isSneaking() && this.yd < 0) this.yd = 0;
      }

      // §Mob.cpp:613 — `move(xd, yd, zd)`
      this.move(this.xd, this.yd, this.zd);

      // §Mob.cpp:616-618 — ladder climb kick
      if (this.horizontalCollision && this.onLadder()) {
        this.yd = 0.2;
      }

      // §Mob.cpp:620-622 — gravity + air drag
      this.yd -= 0.08;
      this.yd *= 0.98;
      this.xd *= friction;
      this.zd *= friction;
    }
  }

  /**
   * §Mob.cpp:688-757 — `void Mob::aiStep()` — EXACT 1:1 port.
   * Previous port was FABRICATED — rebuilt from MODLOG §27.8.
   */
  aiStep(): void {
    // §Mob.cpp:694 — `if (isImmobile())`
    if (this.isImmobile()) {
      this.jumping = false;
      this.xxa = 0;
      this.yya = 0;
      this.yRotA = 0;
    } else {
      // §Mob.cpp:698 — `if (!interpolateOnly())`
      if (!this.interpolateOnly()) {
        if (this.useNewAi()) {
          // §Mob.cpp:701 — `newServerAiStep();`
          this.newServerAiStep();
        } else {
          // §Mob.cpp:705 — `updateAi();`
          this.updateAi();
        }
      }
    }

    // §Mob.cpp:711-713 — jumping in water/lava
    const inWater = this.isInWater();
    const inLava = this.isInLava();

    if (this.jumping) {
      if (inWater) {
        this.yd += 0.04;
      } else if (inLava) {
        this.yd += 0.04;
      } else if (this.onGround) {
        this.jumpFromGround();
      }
    }

    // §Mob.cpp:719-721 — input decay (low-pass filter)
    this.xxa *= 0.98;
    this.yya *= 0.98;
    this.yRotA *= 0.9;

    // §Mob.cpp:723-728 — save-modify-restore walkingSpeed/flyingSpeed
    const normalSpeed = this.walkingSpeed;
    const normalAirControllSpeed = this.flyingSpeed;
    this.walkingSpeed *= this.getWalkingSpeedModifier();
    this.flyingSpeed *= this.getWalkingSpeedModifier();
    // §Mob.cpp:727 — `travel(xxa, yya);`
    this.travel(this.xxa, this.yya);
    // §Mob.cpp:728 — RESTORE originals (prevent compounding)
    this.walkingSpeed = normalSpeed;
    this.flyingSpeed = normalAirControllSpeed;

    // §Mob.cpp:731-745 — entity pushing (grow 0.2 in X/Z only, NOT Y)
    if (!this.isPlayer() || !this.isSleeping()) {
      // §Mob.cpp:737 — `level->getEntities(this, this->bb.grow(0.2f, 0, 0.2f))`
      const entities = this.getEntitiesInAABB(this.bbGrowXZ(0.2));
      for (const e of entities) {
        if (e.isPlayer() && e.isSleeping()) continue;
        if (e.isPushable()) (e as unknown as { push: (xa: number, ya: number, za: number) => void }).push(0.1, 0, 0);
      }
    }
  }


  /**
   * §Mob.cpp:760-802 — `void Mob::updateAi()` — EXACT 1:1 port.
   * Previous port was FABRICATED — rebuilt from MODLOG §27.9.
   */
  updateAi(): void {
    // §Mob.cpp:762 — `noActionTime++;`
    this.noActionTime++;

    // §Mob.cpp:764 — `Player* player = level->getNearestPlayer(this, -1);`
    const player = this.getNearestPlayer(-1);
    this.checkDespawnMob(player as unknown as Mob | null);

    // §Mob.cpp:767-768 — clear movement input every tick
    this.xxa = 0;
    this.yya = 0;

    // §Mob.cpp:770-777 — look-around AI
    const lookDistance = 8;
    if (Math.random() < 0.02) {
      const nearby = this.getNearestPlayer(lookDistance);
      if (nearby) {
        this.lookingAtId = nearby.entityId;
        this.lookTime = 10 + Math.floor(Math.random() * 20);
      } else {
        // §Mob.cpp:776 — random yaw turn ±10 deg
        this.yRotA = (Math.random() - 0.5) * 20;
      }
    }

    // §Mob.cpp:779-792 — look-at-entity logic
    if (this.lookingAtId !== 0) {
      const lookingAt = this.getEntity(this.lookingAtId);
      this.lookingAtId = 0;
      if (lookingAt) {
        this.lookAt(lookingAt, 10, this.getMaxHeadXRot());
        // §Mob.cpp:784 — post-decrement: uses pre-decrement value
        if (this.lookTime-- <= 0 || lookingAt.removed || lookingAt.distanceToSqrEntity(this as unknown as Entity) > lookDistance * lookDistance) {
          this.lookingAtId = 0;
        } else {
          this.lookingAtId = lookingAt.entityId;
        }
      }
    } else {
      // §Mob.cpp:794-798 — idle random turn
      if (Math.random() < 0.05) {
        this.yRotA = (Math.random() - 0.5) * 20;
      }
      this.yRot += this.yRotA;
      this.xRot = this.defaultLookAngle;
    }

    // §Mob.cpp:800-802 — swim jump (80% chance in water/lava)
    const inWater = this.isInWater();
    const inLava = this.isInLava();
    if (inWater || inLava) this.jumping = Math.random() < 0.8;
  }


  /** §Mob.cpp:804-837 — `void Mob::newServerAiStep()` — modern AI tick (selectors + controls). */
  newServerAiStep(): void {
    this.noActionTime++;
    this.checkDespawn();
    this.jumping = false;
    // §Mob.cpp:812 — `if (sensing) sensing->tick();`
    this.sensing?.tick();
    // §Mob.cpp:814-824 — every 5 ticks, run target+goal selectors
    if (this.random.nextInt(5) === 0) {
      this.targetSelector?.tick();
      this.goalSelector?.tick();
    }
    // §Mob.cpp:827 — `if (navigation) navigation->tick();`
    this.navigation?.tick();
    // §Mob.cpp:833-834 — control ticks
    this.moveControl?.tick();
    this.jumpControl?.tick();
  }

  /** §Mob.cpp:839-842 — `bool Mob::isImmobile() { return health <= 0; }`. */
  isImmobile(): boolean {
    return this.health <= 0;
  }

  /** §Mob.cpp:1045-1047 — `void Mob::checkDespawn()` (no-arg overload). */
  checkDespawn(): void {
    const level = this.level;
    if (!level) return;
    // §Mob.cpp:1046 — `checkDespawn(level->getNearestPlayer(this, -1));`
    this.checkDespawnMob(level.getNearestPlayer(this, -1) as Mob | null);
  }

  /** §Mob.cpp:1049-1067 — `void Mob::checkDespawn(Mob* nearestBlocking)`. */
  checkDespawnMob(nearestBlocking: Mob | null): void {
    if (!nearestBlocking) return;
    const removeIfFar = this.removeWhenFarAway();
    const xd = nearestBlocking.x - this.x;
    const yd = nearestBlocking.y - this.y;
    const zd = nearestBlocking.z - this.z;
    const sd = xd * xd + yd * yd + zd * zd;
    // §Mob.cpp:1057 — `if (removeIfFar && sd > 96*96) remove();`
    if (removeIfFar && sd > 96 * 96) this.remove();
    // §Mob.cpp:1062 — `if (noActionTime > 30*TPS && nextInt(800) == 0 && removeIfFar && sd > 32*32) remove();`
    if (this.noActionTime > 30 * TICKS_PER_SECOND && this.random.nextInt(800) === 0 && removeIfFar && sd > 32 * 32) {
      this.remove();
    } else {
      this.noActionTime = 0;
    }
  }

  /** §Mob.cpp:988-1005 — `void Mob::handleEntityEvent(char id)`. */
  override handleEntityEvent(id: number): void {
    if (id === EntityEvent.Hurt) {
      // §Mob.cpp:990-998 — HURT event: set walkAnimSpeed, invuln, hurtTime, hurtDir, play sound, hurt(0)
      this.walkAnimSpeed = 1.5;
      this.invulnerableTime = this.invulnerableDuration;
      this.hurtTime = 10;
      this.hurtDuration = 10;
      this.hurtDir = 0;
      const level = this.level;
      if (level) {
        level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
      }
      this.hurt(null, 0);
    } else if (id === EntityEvent.Death) {
      // §Mob.cpp:998-1001 — DEATH event: play sound, health = 0, die(NULL)
      const level = this.level;
      if (level) {
        level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      }
      this.health = 0;
      this.die(null);
    } else {
      super.handleEntityEvent(id);
    }
  }

  /** §Mob.cpp:1007-1013 — `SynchedEntityData* Mob::getEntityData()` const overloads. */
  getEntityData(): SynchedEntityData {
    return this.entityData;
  }

  /** §Mob.cpp:1116-1123 — `int Mob::getDamageAfterArmorAbsorb(int damage)`. */
  getDamageAfterArmorAbsorb(damage: number): number {
    // §Mob.cpp:1117 — `int absorb = 25 - getArmorValue();`
    const absorb = 25 - this.getArmorValue();
    const v = damage * absorb + this.dmgSpill;
    // §Mob.cpp:1119 — `hurtArmor(damage);` (no-op base, §Mob.cpp:1144)
    this.hurtArmor(damage);
    // §Mob.cpp:1120-1121 — `damage = v / 25; dmgSpill = v % 25;`
    const finalDamage = Math.trunc(v / 25);
    this.dmgSpill = v % 25;
    return finalDamage;
  }

  /** §Mob.cpp:1129-1142 — `int Mob::getArmorValue()` — 0 (no equipment model in port). */
  getArmorValue(): number {
    return 0;
  }

  /** §Mob.cpp:1144 — `void Mob::hurtArmor(int damage) {}` — no-op base. */
  hurtArmor(_damage: number): void {
    void _damage;
  }

  /** §Mob.cpp:103-106 — `bool Mob::canSee(Entity* target)` — delegated to level clip. */
  canSee(target: Entity): boolean {
    // §Mob.cpp:105 — `!level->clip(from, to).isHit()` (browser-layer raycast).
    // Conservative: assume visible; the level adapter may override.
    void target;
    return true;
  }

  /** §Mob.h:120 — `virtual ItemInstance* getCarriedItem() { return NULL; }`. */
  getCarriedItem(): { readonly id: string; readonly count: number } | null {
    return null;
  }

  /** §Mob.h:121 — `virtual int getUseItemDuration() { return 0; }`. */
  getUseItemDuration(): number {
    return 0;
  }

  /** §Entity.cpp:834-845 — `void Mob::addAdditonalSaveData(CompoundTag*)` — Health/HurtTime/etc. */
  override addAdditonalSaveData(tag: Record<string, unknown>): void {
    // §Mob.cpp:654-657
    tag['Health'] = this.health;
    tag['HurtTime'] = this.hurtTime;
    tag['DeathTime'] = this.deathTime;
    tag['AttackTime'] = this.attackTime;
  }

  /** §Entity.cpp:847-893 — `void Mob::readAdditionalSaveData(CompoundTag*)`. */
  override readAdditionalSaveData(tag: Record<string, unknown>): void {
    // §Mob.cpp:664-667
    this.health = Number(tag['Health'] ?? this.health);
    this.hurtTime = Number(tag['HurtTime'] ?? 0);
    this.deathTime = Number(tag['DeathTime'] ?? 0);
    this.attackTime = Number(tag['AttackTime'] ?? 0);
  }

  /** §Mob.cpp:844-847 — `void Mob::jumpFromGround()` — `yd = 0.42f`. */
  jumpFromGround(): void {
    // §Mob.cpp:846 — `yd = 0.42f;`
    this.yd = 0.42;
  }


  /** §Mob.cpp:394-396 — `bool Mob::canSpawn()`. Default: true. */
  canSpawn(): boolean {
    return true;
  }

  /** §Mob.h:278 — `bool isWaterMob()`. Default false. */
  isWaterMob(): boolean {
    return false;
  }


  /** §Mob.cpp:884-886 — `void Mob::beforeRemove()`. Default: no-op. */
  beforeRemove(): void {}

  /** §Mob.cpp:628-645 — `void Mob::updateWalkAnim()`. */
  updateWalkAnim(): void {
    // §Mob.cpp:629-630 — walkAnimPos += walkAnimSpeed * sideDist
    // Simplified stub — full port needs walkAnimSpeed from tick()
  }





  /** §Mob.cpp:628-645 — `void Mob::onLadder()`. Default false. */
  onLadder(): boolean { return false; }

  /** §Mob.cpp:880-882 — `bool Mob::removeWhenFarAway()`. Default: false. */
  removeWhenFarAway(): boolean { return false; }

  /** §Mob.cpp:1080-1099 — `void Mob::updateAttackAnim()`. */
  updateAttackAnim(): void {
    // §Mob.cpp:1083 — `if (attackAnim > 0) oAttackAnim = attackAnim;`
    // Simplified stub
  }

  /** §Mob.h:255 — `void swing()`. */
  swing(): void {
    // §Mob.h:256 — `if (!swinging) { swinging = true; swingTime = 0; }`
    if (!this.swinging) { this.swinging = true; this.swingTime = 0; }
  }
  // === Helper stubs for 1:1 travel/aiStep/updateAi ===

  /** §Mob.cpp:589 — tile 0.5 below bb.y0. Stub: returns 0 (no tile lookup in headless mode). */
  getTileBelow(): number {
    return 0; // Phase 1 stub — browser layer provides real tile lookup
  }

  /** §Tile.h — tile friction. Stub: returns 0.6 (default block friction). */
  getTileFriction(tileId: number): number {
    return 0.6; // §Tile.h: default friction for normal blocks
  }


  /** §Mob.cpp:698 — `bool interpolateOnly()`. Stub: returns false (single-player). */
  interpolateOnly(): boolean {
    return false; // §Mob.cpp — always false in single-player browser port
  }

  /** §Mob.cpp:701 — `bool useNewAi()`. Default false (old AI). Override in Zombie/Creeper. */
  useNewAi(): boolean {
    return false;
  }

  /** §Mob.h:259 — `bool isSleeping()`. Stub: returns false. */
  isSleeping(): boolean {
    return false;
  }

  /** §AABB.h — grow bounding box in X/Z only (not Y, per §27.8 port note 8). */
  bbGrowXZ(amount: number): Aabb {
    return new Aabb(
      this.bb.minX - amount, this.bb.minY, this.bb.minZ - amount,
      this.bb.maxX + amount, this.bb.maxY, this.bb.maxZ + amount
    );
  }

  /** §Level.h — get entities in AABB. Stub: returns empty (no entity list in headless mode). */
  getEntitiesInAABB(bb: Aabb): Mob[] {
    return []; // Phase 1 stub — browser layer provides real entity queries
  }

  /** §Level.h — `Player* getNearestPlayer(Entity*, float distance)`. Stub: returns null. */
  getNearestPlayer(maxDist: number): Entity | null {
    return null; // Phase 1 stub
  }

  /** §Level.h — `Entity* getEntity(int entityId)`. Stub: returns null. */
  getEntity(entityId: number): Entity | null {
    return null; // Phase 1 stub
  }

  /** §Mob.cpp:854 — `void lookAt(Entity*, float yMax, float xMax)`. Stub. */
  lookAt(target: Entity, yMax: number, xMax: number): void {
    // Phase 1 stub — browser layer handles visual look-at
  }

  /** §Mob.h:268 — `int getMaxHeadXRot()`. Default 40 (§Mob.h). */
  getMaxHeadXRot(): number {
    return 40;
  }

  /** §Entity.h:153 — `float distanceToSqr(Entity*)`. */
  distanceToSqrEntity(other: Entity): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return dx * dx + dy * dy + dz * dz;
  }


}

/** Ladder legacy id is 65 (see §registry.ts minecraft:ladder). */
const LADDER_LEGACY_ID = 65;
function isLadderTile(id: number): boolean {
  return id === LADDER_LEGACY_ID;

}
