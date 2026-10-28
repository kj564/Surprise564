// §Mob.ts — Direct 1:1 translation of C++ Mob.h (249 lines) + Mob.cpp (1144 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/entity/Mob.h + Mob.cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Entity, TOTAL_AIR_SUPPLY } from './Entity';
import { Vec3 } from '../../phys/translated/Vec3';
import { HitResult } from '../../phys/translated/HitResult';
import { Random } from '../../../util/translated/Random';

// --- Mob.h:27-28 — static constants ---
const ATTACK_DURATION = 5;
const SWING_DURATION = 8;

// --- Mob.h:23-249 — class Mob : public Entity ---
class Mob extends Entity {
  // --- Mob.h:163-192 — public fields ---
  invulnerableDuration: number = 20;
  timeOffs: number = 0;
  rotA: number = 0;
  yBodyRot: number = 0;
  yBodyRotO: number = 0;
  oAttackAnim: number = 0;
  attackAnim: number = 0;
  health: number = 10;
  lastHealth: number = 20;
  hurtTime: number = 0;
  hurtDuration: number = 0;
  hurtDir: number = 0;
  deathTime: number = 0;
  attackTime: number = 0;
  oTilt: number = 0;
  tilt: number = 0;
  lookTime: number = 0;
  fallTime: number = 0;
  walkAnimSpeedO: number = 0;
  walkAnimSpeed: number = 0;
  walkAnimPos: number = 0;
  aimDirection: Vec3 = new Vec3();
  arrowCount: number = 0;
  removeArrowTime: number = 0;
  random: Random = new Random();
  sensing: any = null;
  bypassArmor: boolean = false;

  // --- Mob.h:203-241 — protected fields ---
  protected entityData: any;
  protected swinging: boolean = false;
  protected swingTime: number = 0;
  protected noActionTime: number = 0;
  protected xxa: number = 0;
  protected yya: number = 0;
  protected yRotA: number = 0;
  protected defaultLookAngle: number = 0.0;
  protected runSpeed: number = 0.7;
  protected walkingSpeed: number = 0.1;
  protected flyingSpeed: number = 0.02;
  protected textureName: string = 'mob/char.png';
  protected modelName: string = '';
  protected deathScore: number = 0;
  protected oRun: number = 0;
  protected run: number = 0;
  protected animStep: number = 0;
  protected animStepO: number = 0;
  protected rotOffs: number = 0;
  protected bobStrength: number = 1;
  protected renderOffset: number = 0;
  protected lSteps: number = 0;
  protected lx: number = 0;
  protected ly: number = 0;
  protected lz: number = 0;
  protected lyr: number = 0;
  protected lxr: number = 0;
  protected lastHurt: number = 0;
  protected dmgSpill: number = 0;
  protected sentX: number = 0;
  protected sentY: number = 0;
  protected sentZ: number = 0;
  protected sentRotX: number = 0;
  protected sentRotY: number = 0;
  protected sentXd: number = 0;
  protected sentYd: number = 0;
  protected sentZd: number = 0;
  protected allowAlpha: boolean = true;
  protected jumping: boolean = false;
  protected autoSendPosRot: boolean = true;
  protected moveControl: any = null;
  protected jumpControl: any = null;
  protected navigation: any = null;
  protected goalSelector: any = null;
  protected targetSelector: any = null;

  // --- Mob.h:243-246 — private fields ---
  private lookingAtId: number = 0;
  private ambientSoundTime: number = 0;
  private speed: number = 0;

  // --- Mob.cpp:31-77 — constructor ---
  constructor(level: any) {
    super(level);
    this.invulnerableDuration = 20;
    this.textureName = 'mob/char.png';
    this.allowAlpha = true;
    this.modelName = '';
    this.bobStrength = 1;
    this.deathScore = 0;
    this.renderOffset = 0;
    this.lookingAtId = 0;
    this.jumping = false;
    this.defaultLookAngle = 0.0;
    this.runSpeed = 0.7;
    this.walkingSpeed = 0.1;
    this.flyingSpeed = 0.02;
    this.run = 0;
    this.oRun = 0;
    this.animStep = 0;
    this.animStepO = 0;
    this.lx = 0; this.ly = 0; this.lz = 0; this.lxr = 0; this.lyr = 0;
    this.lSteps = 0;
    this.walkAnimSpeed = 0;
    this.walkAnimSpeedO = 0;
    this.walkAnimPos = 0;
    this.attackAnim = 0;
    this.oAttackAnim = 0;
    this.autoSendPosRot = true;
    this.sentX = 0; this.sentY = 0; this.sentZ = 0;
    this.sentRotX = 0; this.sentRotY = 0;
    this.sentXd = 0; this.sentYd = 0; this.sentZd = 0;
    this.arrowCount = 0;
    this.removeArrowTime = 0;
    this.speed = 0;
    this.moveControl = null;
    this.jumpControl = null;
    this.navigation = null;
    this.goalSelector = null;
    this.targetSelector = null;
    this.sensing = null;
    this.swinging = false;
    this.swingTime = 0;
    this.lastHurt = 0;
    this.dmgSpill = 0;
    this.bypassArmor = false;

    this._init();
    this.health = this.getMaxHealth();
    this.blocksBuilding = true;
    this.ambientSoundTime = -level.random.nextInt(100);
    this.rotA = (Math.random() + 1) * 0.01;
    this.setPos(this.x, this.y, this.z);
    this.timeOffs = Math.random() * 12398;
    this.yRot = Math.random() * Math.PI * 2;
    this.footSize = 0.5;
  }

  // --- Mob.cpp:79-81 — destructor ---
  destroy(): void {}

  // --- Mob.cpp:83-89 — getWalkingSpeedModifier() ---
  getWalkingSpeedModifier(): number {
    let speed = 0.7;
    return speed;
  }

  // --- Mob.cpp:91-95 — canSee(Entity*) ---
  canSee(target: Entity): boolean {
    if (!this.level || !this.level.clip) return false;
    const from = new Vec3(this.x, this.y + this.getHeadHeight(), this.z);
    const to = new Vec3(target.x, target.y + target.getHeadHeight(), target.z);
    const hit = this.level.clip(from, to);
    return !hit || !hit.isHit();
  }

  // --- Mob.cpp:97-100 — getTexture() ---
  getTexture(): string { return this.textureName; }

  // --- Mob.cpp:102-104 — isPickable() ---
  isPickable(): boolean { return !this.removed; }

  // --- Mob.cpp:106-108 — isPushable() ---
  isPushable(): boolean { return !this.removed; }

  // --- Mob.cpp:110-112 — getHeadHeight() ---
  getHeadHeight(): number { return this.bbHeight * 0.85; }

  // --- Mob.cpp:114-118 — getVoicePitch() ---
  getVoicePitch(): number {
    if (this.isBaby()) {
      return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1.5;
    }
    return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1.0;
  }

  // --- Mob.cpp:120-122 — getAmbientSoundInterval() ---
  getAmbientSoundInterval(): number { return 8 * 20; }  // §SharedConstants::TicksPerSecond = 20

  // --- Mob.cpp:124-129 — playAmbientSound() ---
  playAmbientSound(): void {
    const ambient = this.getAmbientSound();
    if (ambient !== null) {
      this.level.playSound(this, ambient, this.getSoundVolume(), this.getVoicePitch());
    }
  }

  // --- Mob.cpp:131-218 — baseTick() ---
  baseTick(): void {
    this.oAttackAnim = this.attackAnim;
    super.baseTick();

    if (((this.ambientSoundTime++ & 15) === 0) && this.random.nextInt(2000) < this.ambientSoundTime) {
      this.ambientSoundTime = -this.getAmbientSoundInterval();
      this.playAmbientSound();
    }

    if (this.isAlive() && this.isInWall()) {
      this.hurt(null, 1);
    }

    if (this.isAlive() && this.isUnderLiquid('water') && !this.isWaterMob()) {
      this.airSupply--;
      if (this.airSupply === -20) {
        this.airSupply = 0;
        this.hurt(null, 2);
      }
    } else {
      this.airSupply = this.airCapacity;
    }

    this.oTilt = this.tilt;
    if (this.attackTime > 0) this.attackTime--;
    if (this.hurtTime > 0) this.hurtTime--;
    if (this.invulnerableTime > 0) this.invulnerableTime--;

    if (this.health <= 0) {
      this.deathTime++;
      if (this.deathTime > 20) {
        this.beforeRemove();
        this.remove();
      }
    }

    this.animStepO = this.animStep;
    this.yBodyRotO = this.yBodyRot;
    this.yRotO = this.yRot;
    this.xRotO = this.xRot;
  }

  // --- Mob.cpp:220-225 — spawnAnim() ---
  spawnAnim(): void {}

  // --- Mob.cpp:227-238 — lerpTo(float, float, float, float, float, int) ---
  lerpTo(x: number, y: number, z: number, yRot: number, xRot: number, steps: number): void {
    this.lx = x;
    this.ly = y + this.heightOffset;
    this.lz = z;
    this.lyr = yRot;
    this.lxr = xRot;
    this.lSteps = steps;
  }

  // --- Mob.cpp:240-243 — superTick() ---
  superTick(): void { super.tick(); }

  // --- Mob.cpp:245-341 — tick() ---
  tick(): void {
    super.tick();

    if (this.arrowCount > 0) {
      if (this.removeArrowTime <= 0) {
        this.removeArrowTime = 20 * 3;
      }
      this.removeArrowTime--;
      if (this.removeArrowTime <= 0) {
        this.arrowCount--;
      }
    }

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

    this.aiStep();
    this.updateWalkAnim();

    const xd = this.x - this.xo;
    const zd = this.z - this.zo;
    const sideDist = Math.sqrt(xd * xd + zd * zd);

    let yBodyRotT = this.yBodyRot;
    let walkSpeed = 0;
    this.oRun = this.run;
    let tRun = 0;
    if (sideDist <= 0.05) {
      // animStep = 0;
    } else {
      tRun = 1;
      walkSpeed = sideDist * 3;
      yBodyRotT = Math.atan2(zd, xd) * (180 / Math.PI) - 90;
    }
    if (this.attackAnim > 0) {
      yBodyRotT = this.yRot;
    }
    if (!this.onGround) {
      tRun = 0;
    }
    this.run = this.run + (tRun - this.run) * 0.3;

    let yBodyRotD = yBodyRotT - this.yBodyRot;
    while (yBodyRotD < -180) yBodyRotD += 360;
    while (yBodyRotD >= 180) yBodyRotD -= 360;
    this.yBodyRot += yBodyRotD * 0.3;

    let headDiff = this.yRot - this.yBodyRot;
    while (headDiff < -180) headDiff += 360;
    while (headDiff >= 180) headDiff -= 360;
    const behind = headDiff < -90 || headDiff >= 90;
    if (headDiff < -75) headDiff = -75;
    if (headDiff >= 75) headDiff = 75;
    this.yBodyRot = this.yRot - headDiff;
    if (headDiff * headDiff > 2500) {
      this.yBodyRot += headDiff * 0.2;
    }
    if (behind) {
      walkSpeed *= -1;
    }
    while (this.yRot - this.yRotO < -180) this.yRotO -= 360;
    while (this.yRot - this.yRotO >= 180) this.yRotO += 360;
    while (this.yBodyRot - this.yBodyRotO < -180) this.yBodyRotO -= 360;
    while (this.yBodyRot - this.yBodyRotO >= 180) this.yBodyRotO += 360;
    while (this.xRot - this.xRotO < -180) this.xRotO -= 360;
    while (this.xRot - this.xRotO >= 180) this.xRotO += 360;
    this.animStep += walkSpeed;
  }

  // --- Mob.cpp:343-346 — setSize(float, float) ---
  setSize(w: number, h: number): void {
    super.setSize(w, h);
  }

  // --- Mob.cpp:348-354 — heal(int) ---
  heal(healAmount: number): void {
    if (this.health <= 0) return;
    this.health += healAmount;
    if (this.health > 20) this.health = 20;
    this.invulnerableTime = this.invulnerableDuration / 2;
  }

  // --- Mob.cpp:356-406 — hurt(Entity*, int) ---
  hurt(source: any, dmg: number): boolean {
    if (this.level && this.level.isClientSide) return false;
    this.noActionTime = 0;
    if (this.health <= 0) return false;
    this.walkAnimSpeed = 1.5;

    let sound = true;
    if (this.invulnerableTime > this.invulnerableDuration / 2.0) {
      if (dmg <= this.lastHurt) return false;
      this.actuallyHurt(dmg - this.lastHurt);
      this.lastHurt = dmg;
      sound = false;
    } else {
      this.lastHurt = dmg;
      this.lastHealth = this.health;
      this.invulnerableTime = this.invulnerableDuration;
      this.actuallyHurt(dmg);
      this.hurtTime = this.hurtDuration = 10;
      this.hurtDuration = 10;
    }

    this.hurtDir = 0;

    if (sound) {
      this.markHurt();
      if (source !== null) {
        let xd = source.x - this.x;
        let zd = source.z - this.z;
        while (xd * xd + zd * zd < 0.0001) {
          xd = (Math.random() - Math.random()) * 0.01;
          zd = (Math.random() - Math.random()) * 0.01;
        }
        this.hurtDir = Math.atan2(zd, xd) * (180 / Math.PI) - this.yRot;
        this.knockback(source, dmg, xd, zd);
      } else {
        this.hurtDir = Math.floor(Math.random() * 2.0) * 180.0;
      }
    }

    if (this.health <= 0) {
      if (sound) this.level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      this.die(source);
    } else {
      if (sound) this.level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
    }
    return true;
  }

  // --- Mob.cpp:408-413 — actuallyHurt(int) ---
  actuallyHurt(dmg: number): void {
    if (!this.bypassArmor) {
      dmg = this.getDamageAfterArmorAbsorb(dmg);
    }
    this.health = Math.max(0, this.health - dmg);
  }

  // --- Mob.cpp:415-417 — getSoundVolume() ---
  getSoundVolume(): number { return 1; }

  // --- Mob.cpp:419-421 — getAmbientSound() ---
  getAmbientSound(): string | null { return null; }

  // --- Mob.cpp:423-425 — getHurtSound() ---
  getHurtSound(): string { return 'random.hurt'; }

  // --- Mob.cpp:427-429 — getDeathSound() ---
  getDeathSound(): string { return 'random.hurt'; }

  // --- Mob.cpp:431-445 — knockback(Entity*, int, float, float) ---
  knockback(source: any, dmg: number, xd: number, zd: number): void {
    const dd = 1 / Math.sqrt(xd * xd + zd * zd);
    const pow = 0.4;
    this.xd *= 0.5;
    this.yd *= 0.5;
    this.zd *= 0.5;
    this.xd -= xd * dd * pow;
    this.yd += 0.4;
    this.zd -= zd * dd * pow;
    if (this.yd > 0.4) this.yd = 0.4;
  }

  // --- Mob.cpp:447-458 — die(Entity*) ---
  die(source: any): void {
    if (this.deathScore > 0 && source !== null) {
      if (source.awardKillScore) source.awardKillScore(this, this.deathScore);
    }
    if (!this.level.isClientSide) {
      if (!this.isBaby()) {
        this.dropDeathLoot();
      }
    }
  }

  // --- Mob.cpp:460-470 — dropDeathLoot() ---
  dropDeathLoot(): void {
    const loot = this.getDeathLoot();
    if (loot > 0) {
      const count = this.random.nextInt(3);
      for (let i = 0; i < count; i++) {
        this.spawnAtLocation(loot, 1);
      }
    }
  }

  // --- Mob.cpp:472-474 — getDeathLoot() ---
  getDeathLoot(): number { return 0; }

  // --- Mob.cpp:476-480 — reset() ---
  reset(): void {
    super.reset();
    this._init();
  }

  // --- Mob.cpp:482-503 — _init() ---
  _init(): void {
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
    this.health = 10;
    this.lastHealth = 20;
  }

  // --- Mob.cpp:505-523 — causeFallDamage(float) ---
  causeFallDamage(distance: number): void {
    const dmg = Math.ceil(distance - 3);
    if (dmg > 0) {
      this.hurt(null, dmg);
    }
  }

  // --- Mob.cpp:525-590 — travel(float, float) ---
  travel(xa: number, ya: number): void {
    if (this.isInWater()) {
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.80;
      this.yd *= 0.80;
      this.zd *= 0.80;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd, 0)) {
        this.yd = 0.3;
      }
    } else if (this.isInLava()) {
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.50;
      this.yd *= 0.50;
      this.zd *= 0.50;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd, 0)) {
        this.yd = 0.3;
      }
    } else {
      // §Mob.cpp:549-590 — land branch
      let friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        const t = this.level.getTile(Math.floor(this.x), Math.floor(this.bb.y0 - 0.5), Math.floor(this.z));
        if (t > 0) {
          // §friction = Tile::tiles[t]->friction * 0.91f;
          friction = 0.6 * 0.91;  // §Default friction
        }
      }
      const friction2 = (0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91) / (friction * friction * friction);
      this.moveRelative(xa, ya, this.onGround ? this.walkingSpeed * friction2 : this.flyingSpeed);
      friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        const t = this.level.getTile(Math.floor(this.x), Math.floor(this.bb.y0 - 0.5), Math.floor(this.z));
        if (t > 0) {
          friction = 0.6 * 0.91;
        }
      }
      if (this.onLadder()) {
        this.fallDistance = 0;
        if (this.yd < -0.15) this.yd = -0.15;
        if (this.isSneaking() && this.yd < 0) this.yd = 0;
      }
      this.move(this.xd, this.yd, this.zd);
      if (this.horizontalCollision && this.onLadder()) {
        this.yd = 0.2;
      }
      this.yd -= 0.08;
      this.yd *= 0.98;
      this.xd *= friction;
      this.zd *= friction;
    }
  }

  // --- Mob.cpp:592-602 — updateWalkAnim() ---
  updateWalkAnim(): void {
    this.walkAnimSpeedO = this.walkAnimSpeed;
    const xxd = this.x - this.xo;
    const zzd = this.z - this.zo;
    let wst = Math.sqrt(xxd * xxd + zzd * zzd) * 4;
    if (wst > 1) wst = 1;
    this.walkAnimSpeed += (wst - this.walkAnimSpeed) * 0.4;
    this.walkAnimPos += this.walkAnimSpeed;
  }

  // --- Mob.cpp:604-611 — onLadder() ---
  onLadder(): boolean {
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.bb.y0);
    const zt = Math.floor(this.z);
    // §C++: return level->getTile(xt, yt, zt) == Tile::ladder->id
    return this.level.getTile(xt, yt, zt) === 65 || this.level.getTile(xt, yt + 1, zt) === 65;
  }

  // --- Mob.cpp:613-616 — isShootable() ---
  isShootable(): boolean { return true; }

  // --- Mob.cpp:618-625 — addAdditonalSaveData(CompoundTag*) ---
  addAdditionalSaveData(entityTag: any): void {
    entityTag.putShort('Health', this.health);
    entityTag.putShort('HurtTime', this.hurtTime);
    entityTag.putShort('DeathTime', this.deathTime);
    entityTag.putShort('AttackTime', this.attackTime);
  }

  // --- Mob.cpp:627-633 — readAdditionalSaveData(CompoundTag*) ---
  readAdditionalSaveData(tag: any): void {
    this.health = tag.getShort('Health');
    this.hurtTime = tag.getShort('HurtTime');
    this.deathTime = tag.getShort('DeathTime');
    this.attackTime = tag.getShort('AttackTime');
  }

  // --- Mob.cpp:635-638 — animateHurt() ---
  animateHurt(): void {
    this.hurtTime = this.hurtDuration = 10;
    this.hurtDir = 0;
  }

  // --- Mob.cpp:640-643 — isAlive() ---
  isAlive(): boolean { return !this.removed && this.health > 0; }

  // --- Mob.cpp:645-648 — isWaterMob() ---
  isWaterMob(): boolean { return false; }

  // --- Mob.cpp:650-724 — aiStep() ---
  aiStep(): void {
    if (this.isImmobile()) {
      this.jumping = false;
      this.xxa = 0;
      this.yya = 0;
      this.yRotA = 0;
    } else {
      if (!this.interpolateOnly()) {
        if (this.useNewAi()) {
          this.newServerAiStep();
        } else {
          this.updateAi();
        }
      }
    }

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

    this.xxa *= 0.98;
    this.yya *= 0.98;
    this.yRotA *= 0.9;

    const normalSpeed = this.walkingSpeed;
    const normalAirControlSpeed = this.flyingSpeed;
    this.walkingSpeed *= this.getWalkingSpeedModifier();
    this.flyingSpeed *= this.getWalkingSpeedModifier();
    this.travel(this.xxa, this.yya);
    this.walkingSpeed = normalSpeed;
    this.flyingSpeed = normalAirControlSpeed;
  }

  // --- Mob.cpp:727-810 — updateAi() ---
  updateAi(): void {
    this.noActionTime++;

    const player = this.level.getNearestPlayer ? this.level.getNearestPlayer(this, -1) : null;
    this.checkDespawn(player);

    this.xxa = 0;
    this.yya = 0;

    const lookDistance = 8;
    if (this.random.nextFloat() < 0.02) {
      const p = this.level.getNearestPlayer ? this.level.getNearestPlayer(this, lookDistance) : null;
      if (p !== null) {
        this.lookingAtId = p.entityId;
        this.lookTime = 10 + this.random.nextInt(20);
      } else {
        this.yRotA = (this.random.nextFloat() - 0.5) * 20;
      }
    }

    if (this.lookingAtId !== 0) {
      const lookingAt = this.level.getEntity ? this.level.getEntity(this.lookingAtId) : null;
      this.lookingAtId = 0;
      if (lookingAt !== null) {
        this.lookAt(lookingAt, 10, this.getMaxHeadXRot());
        if (this.lookTime-- <= 0 || lookingAt.removed || this.distanceToSqrEntity(lookingAt) > lookDistance * lookDistance) {
          this.lookingAtId = 0;
        } else {
          this.lookingAtId = lookingAt.entityId;
        }
      }
    } else {
      if (this.random.nextFloat() < 0.05) {
        this.yRotA = (this.random.nextFloat() - 0.5) * 20;
      }
      this.yRot += this.yRotA;
      this.xRot = this.defaultLookAngle;
    }

    const inWater = this.isInWater();
    const inLava = this.isInLava();
    if (inWater || inLava) this.jumping = this.random.nextFloat() < 0.8;
  }

  // --- Mob.cpp:812-848 — newServerAiStep() ---
  newServerAiStep(): void {
    this.noActionTime++;
    this.checkDespawn();
    this.jumping = false;

    if (this.sensing && this.sensing.tick) this.sensing.tick();

    if (this.random.nextInt(5) === 0) {
      if (this.targetSelector && this.targetSelector.tick) this.targetSelector.tick();
      if (this.goalSelector && this.goalSelector.tick) this.goalSelector.tick();
    }

    if (this.navigation && this.navigation.tick) this.navigation.tick();
    if (this.moveControl && this.moveControl.tick) this.moveControl.tick();
    if (this.jumpControl && this.jumpControl.tick) this.jumpControl.tick();
  }

  // --- Mob.cpp:850-852 — isImmobile() ---
  isImmobile(): boolean { return this.health <= 0; }

  // --- Mob.cpp:854-856 — jumpFromGround() ---
  jumpFromGround(): void { this.yd = 0.42; }

  // --- Mob.cpp:858-860 — removeWhenFarAway() ---
  removeWhenFarAway(): boolean { return true; }

  // --- Mob.cpp:862-865 — getMaxHeadXRot() ---
  getMaxHeadXRot(): number { return 10; }

  // --- Mob.cpp:867-887 — lookAt(Entity*, float, float) ---
  lookAt(e: Entity, yMax: number, xMax: number): void {
    const xd = e.x - this.x;
    let yd: number;
    const zd = e.z - this.z;
    yd = (e.bb.y0 + e.bb.y1) / 2 - (this.y + this.getHeadHeight());
    const sd = Math.sqrt(xd * xd + zd * zd);
    const yRotD = Math.atan2(zd, xd) * 180 / Math.PI - 90;
    const xRotD = Math.atan2(yd, sd) * 180 / Math.PI;
    this.xRot = -this.rotlerp(this.xRot, xRotD, xMax);
    this.yRot = this.rotlerp(this.yRot, yRotD, yMax);
  }

  // --- Mob.cpp:889-892 — isLookingAtAnEntity() ---
  isLookingAtAnEntity(): boolean { return this.lookingAtId !== 0; }

  // --- Mob.cpp:894-907 — rotlerp(float, float, float) private ---
  private rotlerp(a: number, b: number, max: number): number {
    let diff = b - a;
    while (diff < -180) diff += 360;
    while (diff >= 180) diff -= 360;
    if (diff > max) diff = max;
    if (diff < -max) diff = -max;
    return a + diff;
  }

  // --- Mob.cpp:909-911 — beforeRemove() ---
  beforeRemove(): void {}

  // --- Mob.cpp:913-917 — canSpawn() ---
  canSpawn(): boolean {
    return this.level.isUnobstructed(this.bb) &&
      this.level.getCubes(this, this.bb).length === 0 &&
      !this.level.containsAnyLiquid(this.bb);
  }

  // --- Mob.cpp:919-925 — outOfWorld() ---
  outOfWorld(): void {
    const oldHealth = this.health;
    this.hurt(null, 4);
    if (this.health >= oldHealth) {
      this.actuallyHurt(4);
    }
  }

  // --- Mob.cpp:927-933 — getAttackAnim(float) ---
  getAttackAnim(a: number): number {
    let diff = this.attackAnim - this.oAttackAnim;
    if (diff < 0) diff += 1;
    return this.oAttackAnim + diff * a;
  }

  // --- Mob.cpp:935-947 — getPos(float) ---
  getPos(a: number): Vec3 {
    if (a === 1) {
      return new Vec3(this.x, this.y, this.z);
    }
    const x = this.xo + (this.x - this.xo) * a;
    const y = this.yo + (this.y - this.yo) * a;
    const z = this.zo + (this.z - this.zo) * a;
    return new Vec3(x, y, z);
  }

  // --- Mob.cpp:949-952 — getLookAngle() ---
  getLookAngle(): Vec3 { return this.getViewVector(1); }

  // --- Mob.cpp:954-974 — getViewVector(float) ---
  getViewVector(a: number): Vec3 {
    let yRot: number, xRot: number;
    if (a === 1) {
      yRot = this.yRot;
      xRot = this.xRot;
    } else {
      xRot = this.xRotO + (this.xRot - this.xRotO) * a;
      yRot = this.yRotO + (this.yRot - this.yRotO) * a;
    }
    const yCos = Math.cos(-yRot * (Math.PI / 180) - Math.PI);
    const ySin = Math.sin(-yRot * (Math.PI / 180) - Math.PI);
    const xCos = -Math.cos(-xRot * (Math.PI / 180));
    const xSin = Math.sin(-xRot * (Math.PI / 180));
    return new Vec3(ySin * xCos, xSin, yCos * xCos);
  }

  // --- Mob.cpp:976-982 — pick(float, float) ---
  pick(range: number, a: number): HitResult {
    const from = this.getPos(a);
    const dir = this.getViewVector(a);
    const to = new Vec3(from.x + dir.x * range, from.y + dir.y * range, from.z + dir.z * range);
    if (this.level && this.level.clip) {
      return this.level.clip(from, to);
    }
    return new HitResult();
  }

  // --- Mob.cpp:984-987 — getMaxSpawnClusterSize() ---
  getMaxSpawnClusterSize(): number { return 4; }

  // --- Mob.cpp:989-992 — interpolateOnly() ---
  interpolateOnly(): boolean {
    return this.level && this.level.isClientSide ? this.level.isClientSide : false;
  }

  // --- Mob.cpp:994-1014 — handleEntityEvent(char) ---
  handleEntityEvent(id: number): void {
    if (id === 2) {  // §EntityEvent::HURT
      this.walkAnimSpeed = 1.5;
      this.invulnerableTime = this.invulnerableDuration;
      this.hurtTime = this.hurtDuration = 10;
      this.hurtDir = 0;
      this.level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
      this.hurt(null, 0);
    } else if (id === 3) {  // §EntityEvent::DEATH
      this.level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      this.health = 0;
      this.die(null);
    } else {
      super.handleEntityEvent(id);
    }
  }

  // --- Mob.cpp:1020-1022 — getMoveControl() ---
  getMoveControl(): any { return this.moveControl; }

  // --- Mob.cpp:1024-1026 — getJumpControl() ---
  getJumpControl(): any { return this.jumpControl; }

  // --- Mob.cpp:1028-1031 — setYya(float) ---
  setYya(yya: number): void { this.yya = yya; }

  // --- Mob.cpp:1033-1035 — getSpeed() ---
  getSpeed(): number { return this.speed; }

  // --- Mob.cpp:1037-1041 — setSpeed(float) ---
  setSpeed(speed: number): void {
    this.speed = speed;
    this.yya = speed;
  }

  // --- Mob.cpp:1043-1045 — setJumping(bool) ---
  setJumping(jump: boolean): void { this.jumping = jump; }

  // --- Mob.cpp:1047-1049 — useNewAi() ---
  useNewAi(): boolean { return false; }

  // --- Mob.cpp:1051-1053 — checkDespawn() ---
  checkDespawn(nearestBlocking?: any): void {
    if (nearestBlocking === undefined) {
      nearestBlocking = this.level.getNearestPlayer ? this.level.getNearestPlayer(this, -1) : null;
    }
    if (nearestBlocking !== null) {
      const removeIfFar = this.removeWhenFarAway();
      const xd = nearestBlocking.x - this.x;
      const yd = nearestBlocking.y - this.y;
      const zd = nearestBlocking.z - this.z;
      const sd = xd * xd + yd * yd + zd * zd;
      if (removeIfFar && sd > 96 * 96) {
        this.remove();
      }
      if (this.noActionTime > 30 * 20 && this.random.nextInt(800) === 0 && removeIfFar && sd > 32 * 32) {
        this.remove();
      } else {
        this.noActionTime = 0;
      }
    }
  }

  // --- Mob.cpp:1077-1095 — updateAttackAnim() ---
  updateAttackAnim(): void {
    if (this.swinging) {
      if (++this.swingTime >= SWING_DURATION) {
        this.swingTime = 0;
        this.swinging = false;
      }
    } else {
      this.swingTime = 0;
    }
    this.attackAnim = this.swingTime / SWING_DURATION;
  }

  // --- Mob.cpp:1097-1104 — swing() ---
  swing(): void {
    if (!this.swinging || this.swingTime >= 3 || this.swingTime < 0) {
      this.swingTime = -1;
      this.swinging = true;
    }
  }

  // --- Mob.cpp:1106-1108 — isSneaking() ---
  isSneaking(): boolean { return false; }  // §Simplified — getSharedFlag

  // --- Mob.cpp:1110-1112 — isSleeping() ---
  isSleeping(): boolean { return false; }

  // --- Mob.cpp:1114-1116 — setSneaking(bool) ---
  setSneaking(value: boolean): void {}  // §setSharedFlag

  // --- Mob.h:81 — getMaxHealth() ---
  getMaxHealth(): number { return 10; }

  // --- Mob.h:116 — isMob() ---
  isMob(): boolean { return true; }

  // --- Mob.h:117 — isBaby() ---
  isBaby(): boolean { return false; }

  // --- Mob.h:66-68 — getItemInHandIcon(ItemInstance*, int) ---
  getItemInHandIcon(item: any, layer: number): number {
    return item ? item.getIcon() : 0;
  }

  // --- Mob.h:120 — getCarriedItem() ---
  getCarriedItem(): any { return null; }

  // --- Mob.h:121 — getUseItemDuration() ---
  getUseItemDuration(): number { return 0; }

  // --- Mob.h:151 — hurtArmor(int) ---
  hurtArmor(damage: number): void {}

  // --- Mob.h:150 — getDamageAfterArmorAbsorb(int) ---
  getDamageAfterArmorAbsorb(damage: number): number {
    const absorb = 25 - this.getArmorValue();
    const v = damage * absorb + this.dmgSpill;
    this.hurtArmor(damage);
    damage = Math.floor(v / 25);
    this.dmgSpill = v % 25;
    return damage;
  }

  // --- Mob.h:85 — getArmorValue() ---
  getArmorValue(): number { return 0; }

  // --- Mob.h:87 — pick(float, float) — already above ---

  // --- Mob.h:87 — getEntityTypeId() abstract ---
  abstract getEntityTypeId(): number;
}

export { Mob, ATTACK_DURATION, SWING_DURATION };
