// §MCPE 2013 Mob base class — 1:1 port from rujukan C++ source.
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
  override isPushable(): boolean {
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
      source.awardKillScore(this, this.deathScore);
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
  travel(xa: number, ya: number): void {
    if (this.isInWater()) {
      // §Mob.cpp:561-572 — water travel
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.80;
      this.yd *= 0.80;
      this.zd *= 0.80;
      // §Mob.cpp:568 — `yd -= 0.02f;`
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd)) {
        // §Mob.cpp:571 — `yd = 0.3f;`
        this.yd = 0.3;
      }
    } else if (this.isInLava()) {
      // §Mob.cpp:573-584 — lava travel
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.50;
      this.yd *= 0.50;
      this.zd *= 0.50;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd)) {
        this.yd = 0.3;
      }
    } else {
      // §Mob.cpp:585-624 — ground travel
      let friction = 0.91;
      if (this.onGround) {
        // §Mob.cpp:588 — `friction = 0.6f * 0.91f;`
        friction = 0.6 * 0.91;
        // §Mob.cpp:589-592 — tile friction override (browser-layer concern).
      }
      // §Mob.cpp:595 — friction2 numerator (defined in §constants.ts)
      const friction2 = FRICTION2_NUMERATOR / (friction * friction * friction);
      // §Mob.cpp:596 — `moveRelative(xa, ya, onGround ? walkingSpeed * friction2 : flyingSpeed);`
      this.moveRelative(xa, ya, this.onGround ? this.walkingSpeed * friction2 : this.flyingSpeed);

      friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
      }
      if (this.onLadder()) {
        // §Mob.cpp:608-611 — ladder fall speed cap
        this.fallDistance = 0;
        if (this.yd < -0.15) this.yd = -0.15;
        if (this.isSneaking() && this.yd < 0) this.yd = 0;
      }
      this.move(this.xd, this.yd, this.zd);
      if (this.horizontalCollision && this.onLadder()) {
        // §Mob.cpp:617 — `yd = 0.2f;`
        this.yd = 0.2;
      }
      // §Mob.cpp:620-621 — gravity + air drag (mirrors constants.ts)
      this.yd -= GRAVITY_PER_TICK;
      this.yd *= AIR_DRAG_PER_TICK;
      this.xd *= friction;
      this.zd *= friction;
    }
  }

  /** §Mob.cpp:628-637 — `void Mob::updateWalkAnim()`. */
  updateWalkAnim(): void {
    this.walkAnimSpeedO = this.walkAnimSpeed;
    const xxd = this.x - this.xo;
    const zzd = this.z - this.zo;
    let wst = Math.sqrt(xxd * xxd + zzd * zzd) * 4;
    if (wst > 1) wst = 1;
    // §Mob.cpp:635-636 — `walkAnimSpeed += (wst - walkAnimSpeed) * 0.4f; walkAnimPos += walkAnimSpeed;`
    this.walkAnimSpeed += (wst - this.walkAnimSpeed) * 0.4;
    this.walkAnimPos += this.walkAnimSpeed;
  }

  /** §Mob.cpp:639-645 — `bool Mob::onLadder()` — ladder block check via level. */
  onLadder(): boolean {
    const level = this.level;
    if (!level) return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.bb.minY);
    const zt = Math.floor(this.z);
    // §Mob.cpp:644 — `level->getTile(xt, yt, zt) == Tile::ladder->id || ...`
    // Ladder legacy ID = 65 (see registry.ts); browser-layer adapter may
    // resolve via block key — we accept either through a small helper.
    return isLadderTile(level.getTile(xt, yt, zt)) || isLadderTile(level.getTile(xt, yt + 1, zt));
  }

  /** §Mob.cpp:678-681 — `bool Mob::isAlive() { return !removed && health > 0; }`. */
  override isAlive(): boolean {
    return !this.removed && this.health > 0;
  }

  /** §Mob.h:55 — `virtual bool isWaterMob() { return false; }` (§Mob.cpp:683-686). */
  isWaterMob(): boolean {
    return false;
  }

  /** §Mob.h:54 — `virtual bool isSleeping() { return false; }` (§Mob.cpp:1105-1107). */
  isSleeping(): boolean {
    return false;
  }

  /** §Mob.h:57-58 — `isSneaking / setSneaking` via shared flags byte. */
  override isSneaking(): boolean {
    // §Mob.cpp:1101-1103 — `getSharedFlag(FLAG_SNEAKING)`
    return this.getSharedFlag(SharedFlag.Sneaking);
  }
  setSneaking(value: boolean): void {
    // §Mob.cpp:1109-1111 — `setSharedFlag(FLAG_SNEAKING, value)`
    this.setSharedFlag(SharedFlag.Sneaking, value);
  }

  /** §Mob.h:122 — `virtual void swing();` (§Mob.cpp:1094-1099). */
  swing(): void {
    // §Mob.cpp:1095-1098 — `if (!swinging || swingTime >= 3 || swingTime < 0) { ... }`
    if (!this.swinging || this.swingTime >= 3 || this.swingTime < 0) {
      this.swingTime = -1;
      this.swinging = true;
    }
  }

  /** §Mob.cpp:1080-1092 — `void Mob::updateAttackAnim()`. */
  updateAttackAnim(): void {
    if (this.swinging) {
      // §Mob.cpp:1082-1086 — `if (++swingTime >= SWING_DURATION) { swingTime = 0; swinging = false; }`
      if (++this.swingTime >= SWING_DURATION) {
        this.swingTime = 0;
        this.swinging = false;
      }
    } else {
      // §Mob.cpp:1087-1089 — `swingTime = 0;`
      this.swingTime = 0;
    }
    // §Mob.cpp:1091 — `attackAnim = swingTime / (float) SWING_DURATION;`
    this.attackAnim = this.swingTime / SWING_DURATION;
  }

  /** §Mob.cpp:923-928 — `float Mob::getAttackAnim(float a)`. */
  getAttackAnim(a: number): number {
    let diff = this.attackAnim - this.oAttackAnim;
    if (diff < 0) diff += 1;
    // §Mob.cpp:927 — `return oAttackAnim + diff * a;`
    return this.oAttackAnim + diff * a;
  }

  /** §Mob.cpp:844-847 — `void Mob::jumpFromGround()` — `yd = 0.42f;`. */
  jumpFromGround(): void {
    this.yd = 0.42;
  }

  /** §Mob.cpp:849-852 — `bool Mob::removeWhenFarAway() { return true; }`. */
  removeWhenFarAway(): boolean {
    return true;
  }

  /** §Mob.cpp:854-857 — `int Mob::getMaxHeadXRot() { return 10; }`. */
  getMaxHeadXRot(): number {
    return 10;
  }

  /** §Mob.cpp:890-904 — `float Mob::rotlerp(float a, b, max)`. */
  private rotlerp(a: number, b: number, max: number): number {
    let diff = b - a;
    while (diff < -180) diff += 360;
    while (diff >= 180) diff -= 360;
    if (diff > max) diff = max;
    if (diff < -max) diff = -max;
    return a + diff;
  }

  /** §Mob.cpp:859-878 — `void Mob::lookAt(Entity* e, float yMax, float xMax)`. */
  lookAt(e: Entity, yMax: number, xMax: number): void {
    const xd = e.x - this.x;
    const zd = e.z - this.z;
    const yd = (e.bb.minY + e.bb.maxY) / 2 - (this.y + this.getHeadHeight());
    const sd = Math.sqrt(xd * xd + zd * zd);
    // §Mob.cpp:874-877
    const yRotD = Math.atan2(zd, xd) * (180 / Math.PI) - 90;
    const xRotD = Math.atan2(yd, sd) * (180 / Math.PI);
    this.xRot = -this.rotlerp(this.xRot, xRotD, xMax);
    this.yRot = this.rotlerp(this.yRot, yRotD, yMax);
  }

  /** §Mob.cpp:880-883 — `bool Mob::isLookingAtAnEntity() { return lookingAtId != 0; }`. */
  isLookingAtAnEntity(): boolean {
    return this.lookingAtId !== 0;
  }

  /** §Mob.cpp:906-908 — `void Mob::beforeRemove()` — no-op base. */
  beforeRemove(): void {
    /* no-op */
  }

  /** §Mob.cpp:910-913 — `bool Mob::canSpawn()` — unobstructed + no liquid. */
  canSpawn(): boolean {
    const level = this.level;
    if (!level) return false;
    // §Mob.cpp:912 — `level->isUnobstructed(bb) && getCubes(...).size() == 0 && !containsAnyLiquid(bb)`
    return level.isUnobstructed(this.bb) &&
      level.getCubes(this, this.bb).length === 0 &&
      !level.containsAnyLiquid(this.bb);
  }

  /** §Mob.cpp:915-921 — `void Mob::outOfWorld()` — bypass armor hurt path. */
  override outOfWorld(): void {
    const oldHealth = this.health;
    this.hurt(null, 4);
    if (this.health >= oldHealth) {
      this.actuallyHurt(4);
    }
  }

  /** §Mob.cpp:979-982 — `bool Mob::interpolateOnly() { return level->isClientSide; }`. */
  interpolateOnly(): boolean {
    return this.level?.isClientSide ?? false;
  }

  /** §Mob.cpp:1041-1043 — `bool Mob::useNewAi() { return false; }`. */
  useNewAi(): boolean {
    return false;
  }

  /** §Mob.cpp:1023-1035 — yya/speed getters/setters. */
  setYya(yya: number): void {
    this.yya = yya;
  }
  getSpeed(): number {
    return this.speed;
  }
  setSpeed(speed: number): void {
    this.speed = speed;
    // §Mob.cpp:1034 — `this->yya = speed;`
    this.yya = speed;
  }
  /** §Mob.cpp:1037-1039 — `void Mob::setJumping(bool jump)`. */
  setJumping(jump: boolean): void {
    this.jumping = jump;
  }

  /** §Mob.h:1068-1078 — `bool Mob::getSharedFlag(int flag)` + setter. */
  getSharedFlag(flag: SharedFlag): boolean {
    // §Mob.cpp:1069 — `entityData.getFlag<...>(DATA_SHARED_FLAGS_ID, flag);`
    return this.entityData.getFlag(DATA_SHARED_FLAGS_ID, flag);
  }
  setSharedFlag(flag: SharedFlag, value: boolean): void {
    // §Mob.cpp:1071-1078 — `setFlag / clearFlag`
    if (value) {
      this.entityData.setFlag(DATA_SHARED_FLAGS_ID, flag);
    } else {
      this.entityData.clearFlag(DATA_SHARED_FLAGS_ID, flag);
    }
  }

  /** §Mob.cpp:688-757 — `void Mob::aiStep()` — main per-tick AI entry. */
  aiStep(): void {
    if (this.isImmobile()) {
      // §Mob.cpp:694-697 — `jumping = false; xxa = 0; yya = 0; yRotA = 0;`
      this.jumping = false;
      this.xxa = 0;
      this.yya = 0;
      this.yRotA = 0;
    } else if (!this.interpolateOnly()) {
      if (this.useNewAi()) {
        // §Mob.cpp:701-703 — `newServerAiStep();`
        this.newServerAiStep();
      } else {
        // §Mob.cpp:706-708 — `updateAi();`
        this.updateAi();
      }
    }

    const inWater = this.isInWater();
    const inLava = this.isInLava();

    if (this.jumping) {
      // §Mob.cpp:717-724 — buoyancy / jump
      if (inWater || inLava) {
        this.yd += 0.04;
      } else if (this.onGround) {
        this.jumpFromGround();
      }
    }

    // §Mob.cpp:727-729 — input decay (constants.ts)
    this.xxa *= INPUT_DECAY;
    this.yya *= INPUT_DECAY;
    this.yRotA *= YAW_ROT_DECAY;

    // §Mob.cpp:731-737 — travel (with temporary speed modifier)
    const normalSpeed = this.walkingSpeed;
    const normalAirControl = this.flyingSpeed;
    this.walkingSpeed *= this.getWalkingSpeedModifier();
    this.flyingSpeed *= this.getWalkingSpeedModifier();
    this.travel(this.xxa, this.yya);
    this.walkingSpeed = normalSpeed;
    this.flyingSpeed = normalAirControl;
  }

  /** §Mob.cpp:760-802 — `void Mob::updateAi()` — legacy AI entry point. */
  updateAi(): void {
    // §Mob.cpp:761 — `noActionTime++;`
    this.noActionTime++;

    const level = this.level;
    if (level) {
      const player = level.getNearestPlayer(this, -1);
      this.checkDespawnMob(player as Mob | null);
    }

    this.xxa = 0;
    this.yya = 0;

    // §Mob.cpp:769-777 — random look-around
    const lookDistance = 8;
    let player = level ? level.getNearestPlayer(this, lookDistance) : null;
    if (player && this.random.nextFloat() < 0.02) {
      // §Mob.cpp:773-775 — `lookingAtId = player->entityId; lookTime = 10 + nextInt(20);`
      this.lookingAtId = (player as Entity).entityId;
      this.lookTime = 10 + this.random.nextInt(20);
    } else if (!player && this.random.nextFloat() < 0.02) {
      // §Mob.cpp:776 — `yRotA = (random - 0.5) * 20;`
      this.yRotA = (this.random.nextFloat() - 0.5) * 20;
    }

    if (this.lookingAtId !== 0) {
      const lookingAt = level ? level.getEntity(this.lookingAtId) as Entity | null : null;
      this.lookingAtId = 0;
      if (lookingAt) {
        this.lookAt(lookingAt, 10, this.getMaxHeadXRot());
        if (this.lookTime-- <= 0 || lookingAt.removed || lookingAt.distanceToSqrEntity(this) > lookDistance * lookDistance) {
          this.lookingAtId = 0;
        } else {
          this.lookingAtId = lookingAt.entityId;
        }
      }
    } else {
      if (this.random.nextFloat() < 0.05) {
        this.yRotA = (this.random.nextFloat() - 0.5) * 20;
      }
      // §Mob.cpp:795 — `yRot += yRotA;`
      this.yRot += this.yRotA;
      // §Mob.cpp:796 — `xRot = defaultLookAngle;`
      this.xRot = this.defaultLookAngle;
    }

    const inWater = this.isInWater();
    const inLava = this.isInLava();
    // §Mob.cpp:801 — `if (inWater || inLava) jumping = random < 0.8;`
    if (inWater || inLava) this.jumping = this.random.nextFloat() < 0.8;
    void player;
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
  getCarriedItem(): { readonly itemKey: string; readonly count: number } | null {
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
}

/** Ladder legacy id is 65 (see §registry.ts minecraft:ladder). */
const LADDER_LEGACY_ID = 65;
function isLadderTile(id: number): boolean {
  return id === LADDER_LEGACY_ID;
}
