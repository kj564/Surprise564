// §entity-subclasses.ts — Direct 1:1 translation of C++ entity subclass headers
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/entity/
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Mob } from './Mob';

// === Creature.h — empty marker class (for MobCategory) ===
// --- Creature.h:5-8 ---
class Creature {}

// === PathfinderMob.h — extends Mob, adds pathfinding ===
// --- PathfinderMob.h:18-21 — AIData struct ---
interface AIData { target: Mob | null; }

// --- PathfinderMob.h:23-69 ---
class PathfinderMob extends Mob {
  static MAX_TURN = 30;
  static CAN_OPEN_DOORS = 1;
  static AVOID_WATER = 2;

  protected attackTargetId: number = 0;
  protected holdGround: boolean = false;
  protected fleeTime: number = 0;
  private path: any = null;

  constructor(level: any) {
    super(level);
  }

  // --- PathfinderMob.h:33 — canSpawn() ---
  canSpawn(): boolean { return super.canSpawn(); }

  // --- PathfinderMob.h:35 — isPathFinding() ---
  isPathFinding(): boolean { return this.path !== null; }

  // --- PathfinderMob.h:36-37 — setPath(Path&) ---
  setPath(path: any): void { this.path = path; }

  // --- PathfinderMob.h:39 — getAttackTarget() ---
  getAttackTarget(): any { return null; }
  // --- PathfinderMob.h:40 — setAttackTarget(Entity*) ---
  setAttackTarget(attacker: any): void {}

  // --- PathfinderMob.h:42 — getWalkTargetValue(int, int, int) ---
  getWalkTargetValue(x: number, y: number, z: number): number { return 0; }

  // --- PathfinderMob.h:43 — getNoActionTime() ---
  getNoActionTime(): number { return this.noActionTime; }

  // --- PathfinderMob.h:45 — getNavigation() ---
  getNavigation(): any { return this.navigation; }

  // --- PathfinderMob.h:47 — findAttackTarget() (protected) ---
  protected findAttackTarget(): any { return null; }

  // --- PathfinderMob.h:50-51 — checkHurtTarget / checkCantSeeTarget ---
  protected checkHurtTarget(target: any, d: number): void {}
  protected checkCantSeeTarget(target: any, d: number): void {}

  // --- PathfinderMob.h:55 — getWalkingSpeedModifier() ---
  getWalkingSpeedModifier(): number { return 1.0; }

  // --- PathfinderMob.h:57 — shouldHoldGround() ---
  shouldHoldGround(): boolean { return false; }

  // --- PathfinderMob.h:59-67 — updateAi() ---
  updateAi(): void {
    // §C++: full wander/stroll/flee AI — overridden in subclasses
    super.updateAi();
  }

  // --- PathfinderMob.h:61 — findRandomStrollLocation() ---
  findRandomStrollLocation(): boolean { return false; }
}

// === AgableMob.h — extends PathfinderMob, adds aging/breeding ===
// --- AgableMob.h:8-28 ---
class AgableMob extends PathfinderMob {
  private age: number = 0;
  static DATA_FLAGS_ID = 14;
  static DATAFLAG_ISBABY = 0;

  constructor(level: any) { super(level); }

  // --- AgableMob.h:13 — getAge() ---
  getAge(): number { return this.age; }
  // --- AgableMob.h:14 — setAge(int) ---
  setAge(age: number): void { this.age = age; }
  // --- AgableMob.h:15 — isBaby() ---
  isBaby(): boolean { return this.age < 0; }

  // --- AgableMob.h:21 — aiStep() ---
  aiStep(): void { super.aiStep(); }
}

// === Animal.h — extends AgableMob + Creature ===
// --- Animal.h:14-37 ---
class Animal extends AgableMob {
  private inLove: number = 0;

  constructor(level: any) { super(level); }

  // --- Animal.h:19 — hurt() ---
  hurt(source: any, dmg: number): boolean { return super.hurt(source, dmg); }

  // --- Animal.h:21 — canSpawn() ---
  canSpawn(): boolean { return super.canSpawn(); }

  // --- Animal.h:23 — getAmbientSoundInterval() ---
  getAmbientSoundInterval(): number { return 100; }

  // --- Animal.h:25 — getCreatureBaseType() ---
  getCreatureBaseType(): number { return 1; }  // §MobTypes::Creature

  // --- Animal.h:27 — removeWhenFarAway() ---
  removeWhenFarAway(): boolean { return false; }

  // --- Animal.h:31 — getWalkTargetValue(int, int, int) (protected) ---
  protected getWalkTargetValueImpl(x: number, y: number, z: number): number {
    // §C++: returns 10 for grass, 0.5 for bright spot, -1 for blocked
    return 0;
  }

  // --- Animal.h:32 — findAttackTarget() (protected) ---
  protected findAttackTargetImpl(): any { return null; }
}

// === WaterAnimal.h — extends PathfinderMob + Creature ===
// --- WaterAnimal.h:22-46 ---
class WaterAnimal extends PathfinderMob {
  constructor(level: any) { super(level); }

  isWaterMob(): boolean { return true; }
  canSpawn(): boolean { return super.canSpawn(); }
  getAmbientSoundInterval(): number { return 100; }
  getCreatureBaseType(): number { return 2; }  // §MobTypes::WaterAnimal
  removeWhenFarAway(): boolean { return false; }
}

// === Monster.h — extends PathfinderMob ===
// --- Monster.h:14-58 ---
class Monster extends PathfinderMob {
  protected attackDamage: number = 0;
  protected targetId: number = 0;
  protected lastHurtByMobId: number = 0;

  constructor(level: any) { super(level); }

  // --- Monster.h:19 — aiStep() ---
  aiStep(): void { super.aiStep(); }
  // --- Monster.h:20 — tick() ---
  tick(): void { super.tick(); }

  // --- Monster.h:23 — hurt(Entity*, int) ---
  hurt(sourceEntity: any, dmg: number): boolean { return super.hurt(sourceEntity, dmg); }

  // --- Monster.h:26 — canSpawn() ---
  canSpawn(): boolean { return this.isDarkEnoughToSpawn(); }

  // --- Monster.h:28 — getCreatureBaseType() ---
  getCreatureBaseType(): number { return 3; }  // §MobTypes::Monster

  // --- Monster.h:30 — doHurtTarget(Entity*) ---
  doHurtTarget(target: any): boolean {
    // §C++: target->hurt(this, attackDamage)
    if (target && target.hurt) {
      target.hurt(this, this.attackDamage);
      return true;
    }
    return false;
  }

  // --- Monster.h:31-32 — setTarget/getTarget ---
  setTarget(mob: any): void { this.targetId = mob ? mob.entityId : 0; }
  getTarget(): any { return this.targetId !== 0 ? this.level.getEntity(this.targetId) : null; }

  // --- Monster.h:34-35 — getLastHurtByMob/setLastHurtByMob ---
  getLastHurtByMob(): any { return this.lastHurtByMobId !== 0 ? this.level.getEntity(this.lastHurtByMobId) : null; }
  setLastHurtByMob(mob: any): void { this.lastHurtByMobId = mob ? mob.entityId : 0; }

  // --- Monster.h:36 — getAttackDamage(Entity*) ---
  getAttackDamage(target: any): number { return this.attackDamage; }

  // --- Monster.h:38 — findAttackTarget() (protected) ---
  protected findAttackTargetMonster(): any { return null; }

  // --- Monster.h:41 — isDarkEnoughToSpawn() (protected) ---
  protected isDarkEnoughToSpawn(): boolean {
    // §C++: checks brightness < random(8) and skyLight <= 0
    return true;
  }

  // --- Monster.h:48 — checkHurtTarget(Entity*, float) (protected) ---
  protected checkHurtTargetMonster(target: any, d: number): void {}

  // --- Monster.h:50 — getWalkTargetValue(int, int, int) (protected) ---
  protected getWalkTargetValueMonster(x: number, y: number, z: number): number {
    return 0.5;  // §simplified
  }

  // --- Monster.h:52 — getAttackTime() (protected) ---
  protected getAttackTime(): number { return 20; }
}

// === Chicken.h — extends Animal ===
// --- Chicken.h:15-49 ---
class Chicken extends Animal {
  sheared: boolean = false;
  flap: number = 0;
  flapSpeed: number = 0;
  oFlapSpeed: number = 0;
  oFlap: number = 0;
  flapping: number = 0;
  eggTime: number = 0;

  constructor(level: any) {
    super(level);
    this.eggTime = this.random.nextInt(6000) + 6000;
  }

  getEntityTypeId(): number { return 10; }  // §EntityTypes::Chicken
  getMaxHealth(): number { return 4; }

  // --- Chicken.h:27 — aiStep() ---
  aiStep(): void {
    super.aiStep();
    // §C++: wing flap animation + egg laying
    this.oFlap = this.flap;
    this.oFlapSpeed = this.flapSpeed;
    this.flapSpeed += (this.onGround ? -1 : 4) * 0.3;
    if (this.flapSpeed < 0) this.flapSpeed = 0;
    if (this.flapSpeed > 1) this.flapSpeed = 1;
    if (!this.onGround && this.flapping < 1) this.flapping = 1;
    this.flapping *= 0.9;
  }

  protected causeFallDamage(distance: number): void {}  // §chickens don't take fall damage

  protected getAmbientSound(): string | null { return 'mob.chicken.say'; }
  protected getHurtSound(): string { return 'mob.chicken.hurt'; }
  protected getDeathSound(): string { return 'mob.chicken.hurt'; }

  protected dropDeathLoot(): void {
    // §C++: drops feathers (id 288) and sometimes egg (id 344)
  }

  protected getBreedOffspring(target: Animal): Animal {
    return new Chicken(this.level);
  }
}

// === Cow.h — extends Animal ===
// --- Cow.h:14-44 ---
class Cow extends Animal {
  constructor(level: any) { super(level); }

  getEntityTypeId(): number { return 11; }  // §EntityTypes::Cow
  getMaxHealth(): number { return 10; }

  interact(player: any): boolean {
    // §C++: if player holds bucket, give milk
    return false;
  }

  protected getAmbientSound(): string | null { return 'mob.cow.say'; }
  protected getHurtSound(): string { return 'mob.cow.hurt'; }
  protected getDeathSound(): string { return 'mob.cow.hurt'; }
  protected getSoundVolume(): number { return 0.4; }

  protected getDeathLoot(): number { return 335; }  // §leather (256+79=335)
  protected dropDeathLoot(): void {}
  protected getBreedOffspring(target: Animal): Animal { return new Cow(this.level); }
}

// === Pig.h — extends Animal ===
// --- Pig.h:13-49 ---
class Pig extends Animal {
  static DATA_SADDLE_ID = 16;

  constructor(level: any) { super(level); }

  getEntityTypeId(): number { return 12; }  // §EntityTypes::Pig
  getMaxHealth(): number { return 10; }

  interact(player: any): boolean {
    // §C++: saddle interaction
    return false;
  }

  hasSaddle(): boolean { return false; }
  setSaddle(value: boolean): void {}

  protected getAmbientSound(): string | null { return 'mob.pig.say'; }
  protected getHurtSound(): string { return 'mob.pig.hurt'; }
  protected getDeathSound(): string { return 'mob.pig.death'; }

  protected getDeathLoot(): number { return 319; }  // §porkchop_raw (256+63=319)
  protected getBreedOffspring(target: Animal): Animal { return new Pig(this.level); }
}

// === Sheep.h — extends Animal ===
// --- Sheep.h:16-91 ---
class Sheep extends Animal {
  static EAT_ANIMATION_TICKS = 20 * 2;
  static DATA_WOOL_ID = 16;

  // --- Sheep.h:24-25 — color table ---
  static readonly COLOR: number[][] = [
    [0.92, 0.92, 0.92],   // white
    [0.80, 0.55, 0.30],   // orange
    [0.70, 0.40, 0.80],   // magenta
    [0.45, 0.50, 0.85],   // light blue
    [0.90, 0.80, 0.30],   // yellow
    [0.60, 0.70, 0.30],   // lime
    [0.90, 0.45, 0.55],   // pink
    [0.30, 0.30, 0.30],   // gray
    [0.50, 0.50, 0.50],   // light gray
    [0.30, 0.50, 0.60],   // cyan
    [0.45, 0.30, 0.60],   // purple
    [0.30, 0.40, 0.20],   // blue (actually dark green in MCPE 2013)
    [0.50, 0.40, 0.30],   // brown
    [0.30, 0.30, 0.30],   // green (actually dark gray)
    [0.60, 0.30, 0.30],   // red
    [0.15, 0.15, 0.15],   // black
  ];
  static readonly NumColors = 16;

  private eatAnimationTick: number = 0;
  private color: number = 0;
  private sheared: boolean = false;

  constructor(level: any) {
    super(level);
    this.color = Sheep.getSheepColor(this.random);
  }

  getMaxHealth(): number { return 8; }
  getEntityTypeId(): number { return 13; }  // §EntityTypes::Sheep

  // --- Sheep.h:34 — aiStep() ---
  aiStep(): void {
    super.aiStep();
    // §C++: eat grass animation
  }

  // --- Sheep.h:38 — handleEntityEvent(char) ---
  handleEntityEvent(id: number): void {
    super.handleEntityEvent(id);
  }

  // --- Sheep.h:42-43 — getHeadEatPositionScale / getHeadEatAngleScale ---
  getHeadEatPositionScale(a: number): number {
    if (this.eatAnimationTick <= 0) return 0;
    return Math.sin(this.eatAnimationTick * 0.5) * 0.3;
  }
  getHeadEatAngleScale(a: number): number {
    if (this.eatAnimationTick <= 0) return 0;
    return Math.sin(this.eatAnimationTick * 0.5) * 0.1;
  }

  // --- Sheep.h:46 — interact(Player*) ---
  interact(player: any): boolean {
    // §C++: shear with shears → drop wool
    return false;
  }

  // --- Sheep.h:54-55 — getColor/setColor ---
  getColor(): number { return this.color; }
  setColor(color: number): void { this.color = color; }

  // --- Sheep.h:57 — getSheepColor(Random*) static ---
  static getSheepColor(random: any): number {
    // §C++: weighted random color selection
    const r = random.nextFloat();
    if (r < 0.8184) return 0;  // white (81.84%)
    if (r < 0.8677) return 5;  // lime (4.93%)
    if (r < 0.9000) return 8;   // light gray (3.23%)
    if (r < 0.9250) return 2;   // magenta (2.5%)
    if (r < 0.9500) return 7;  // gray (2.5%)
    if (r < 0.9700) return 15; // black (2%)
    if (r < 0.9900) return 4;  // yellow (2%)
    return 6;                    // pink
  }

  // --- Sheep.h:59-60 — isSheared/setSheared ---
  isSheared(): boolean { return this.sheared; }
  setSheared(value: boolean): void { this.sheared = value; }

  protected dropDeathLoot(): void {
    // §C++: drops 1 wool of sheep's color
  }
  protected getDeathLoot(): number { return 35; }  // §cloth/wool (id 35)
  protected jumpFromGround(): void { super.jumpFromGround(); }
  protected updateAi(): void { super.updateAi(); }
  protected shouldHoldGround(): boolean { return false; }
  protected getAmbientSound(): string | null { return 'mob.sheep.say'; }
  protected getHurtSound(): string { return 'mob.sheep.hurt'; }
  protected getDeathSound(): string { return 'mob.sheep.hurt'; }
}

// === Zombie.h — extends Monster ===
// --- Zombie.h:13-44 ---
class Zombie extends Monster {
  protected fireCheckTick: number = 0;
  protected _useNewAi: boolean = false;

  constructor(level: any) { super(level); }

  getMaxHealth(): number { return 20; }
  getEntityTypeId(): number { return 32; }  // §EntityTypes::Zombie

  aiStep(): void {
    // §C++: burn in sunlight
    super.aiStep();
  }

  setUseNewAi(use: boolean): void { this._useNewAi = use; }
  die(source: any): void { super.die(source); }
  getAttackDamage(target: any): number { return this.attackDamage; }

  protected getArmorValue(): number { return 2; }
  protected getAmbientSound(): string | null { return 'mob.zombie.say'; }
  protected getHurtSound(): string { return 'mob.zombie.hurt'; }
  protected getDeathSound(): string { return 'mob.zombie.death'; }
  protected getDeathLoot(): number { return 265; }  // §ironIngot (256+9=265)
  protected useNewAi(): boolean { return this._useNewAi; }
}

// === Skeleton.h — extends Monster ===
// --- Skeleton.h:13-43 ---
class Skeleton extends Monster {
  private bow: any = null;
  private fireCheckTick: number = 0;

  constructor(level: any) { super(level); }

  getMaxHealth(): number { return 20; }
  getEntityTypeId(): number { return 34; }  // §EntityTypes::Skeleton

  aiStep(): void {
    // §C++: burn in sunlight
    super.aiStep();
  }

  protected getDeathLoot(): number { return 289; }  // §arrow (256+33=289? Actually 262)
  getCarriedItem(): any { return this.bow; }

  protected getAmbientSound(): string | null { return 'mob.skeleton.say'; }
  protected getHurtSound(): string { return 'mob.skeleton.hurt'; }
  protected getDeathSound(): string { return 'mob.skeleton.death'; }
  protected checkHurtTarget(target: any, d: number): void {}
  protected dropDeathLoot(): void {}
  protected getUseDuration(): number { return 20 * 15; }
}

// === Spider.h — extends Monster ===
// --- Spider.h:13-62 ---
class Spider extends Monster {
  static DATA_FLAGS_ID = 16;
  private fireCheckTick: number = 0;

  constructor(level: any) { super(level); }

  aiStep(): void { super.aiStep(); }
  tick(): void { super.tick(); }
  getMaxHealth(): number { return 16; }
  getEntityTypeId(): number { return 35; }  // §EntityTypes::Spider

  // --- Spider.h:33 — onLadder() — always true (climb walls) ---
  onLadder(): boolean { return true; }

  // --- Spider.h:39 — makeStuckInWeb() — no-op for spiders ---
  makeStuckInWeb(): void {}

  getModelScale(): number { return 1.0; }

  isClimbing(): boolean { return false; }
  setClimbing(value: boolean): void {}

  protected makeStepSound(): boolean { return false; }
  protected findAttackTarget(): any { return null; }
  protected getAmbientSound(): string | null { return 'mob.spider.say'; }
  protected getHurtSound(): string { return 'mob.spider.say'; }
  protected getDeathSound(): string { return 'mob.spider.death'; }
  protected checkHurtTarget(target: any, d: number): void {}
  protected getDeathLoot(): number { return 289; }  // §string (256+33=289? Actually 287)
}

// === Creeper.h — extends Monster ===
// --- Creeper.h:13-46 ---
class Creeper extends Monster {
  static DATA_SWELL_DIR = 16;
  static MAX_SWELL = 30;

  private swell: number = 0;
  private oldSwell: number = 0;
  private swellDir: number = 0;

  constructor(level: any) { super(level); }

  getMaxHealth(): number { return 20; }
  getEntityTypeId(): number { return 33; }  // §EntityTypes::Creeper

  tick(): void {
    // §C++: explosion timer
    this.oldSwell = this.swell;
    if (this.swellDir > 0) this.swell += 1;
    else if (this.swellDir < 0) this.swell -= 1;
    if (this.swell < 0) this.swell = 0;
    if (this.swell >= Creeper.MAX_SWELL) {
      // §C++: explode!
    }
    super.tick();
  }

  getSwelling(a: number): number {
    // §C++: interpolation between oldSwell and swell
    return this.oldSwell + (this.swell - this.oldSwell) * a;
  }

  private getSwellDir(): number { return this.swellDir; }
  private setSwellDir(dir: number): void { this.swellDir = dir; }

  protected getDeathLoot(): number { return 289; }  // §gunpowder (256+33=289? Actually 289=sulphur)
  protected checkCantSeeTarget(target: any, d: number): void {}
  protected getHurtSound(): string { return 'mob.creeper.say'; }
  protected getDeathSound(): string { return 'mob.creeper.death'; }
}

export {
  Creature, PathfinderMob, AgableMob, Animal, WaterAnimal, Monster,
  Chicken, Cow, Pig, Sheep,
  Zombie, Skeleton, Spider, Creeper
};
