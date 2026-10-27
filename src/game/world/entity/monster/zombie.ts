// §MCPE 2013 Zombie — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Zombie.h:11-42    — Zombie class (extends Monster)
//   Zombie.cpp:15-129 — constructor / aiStep (daylight burn) / sounds / die loot
//
// AI goals wired in §Zombie.cpp:28-38 (commented BreakDoorGoal + MeleeAttackGoal +
// RandomStrollGoal + HurtByTargetGoal + NearestAttackableTargetGoal) are exposed
// here as a goals array for the browser-layer goal selector to consume.

import type { EntityLevel } from '../level';
import { MobType, EntityRendererId } from '../types';
import { Monster } from './monster';
import type { Entity } from '../entity';

/** §Zombie.cpp:25 — `runSpeed = 0.5f;` */
export const ZOMBIE_RUN_SPEED = 0.5;
/** §Zombie.cpp:26 — `attackDamage = 4;` */
export const ZOMBIE_ATTACK_DAMAGE = 4;

/** §Zombie.cpp:28-35 — goal-selector entries the browser layer wires up. */
export const ZOMBIE_GOALS: readonly Readonly<{ readonly priority: number; readonly kind: string }> = Object.freeze([
  // §Zombie.cpp:29 — `targetSelector->addGoal(1, new HurtByTargetGoal(this, false));`
  Object.freeze({ priority: 1, kind: 'HurtByTargetGoal' }),
  // §Zombie.cpp:30 — `targetSelector->addGoal(2, new NearestAttackableTargetGoal(this, 1, 16, 0, true));`
  Object.freeze({ priority: 2, kind: 'NearestAttackableTargetGoal' }),
  // §Zombie.cpp:33 — `goalSelector->addGoal(1, new BreakDoorGoal(this));` (commented out in rujukan)
  // §Zombie.cpp:34 — `goalSelector->addGoal(2, new MeleeAttackGoal(this, runSpeed, false, 0));`
  Object.freeze({ priority: 2, kind: 'MeleeAttackGoal' }),
  // §Zombie.cpp:35 — `goalSelector->addGoal(7, new RandomStrollGoal(this, runSpeed));`
  Object.freeze({ priority: 7, kind: 'RandomStrollGoal' }),
]);

/** §Zombie.h:11-42 — Zombie mob. */
export class Zombie extends Monster {
  /** §Zombie.h:40 — `int fireCheckTick;` */
  protected fireCheckTick = 0;
  /** §Zombie.h:41 — `bool _useNewAi;` (default false, §Zombie.cpp:18). */
  protected useNewAiValue = false;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Zombie.cpp:20 — `entityRendererId = ER_ZOMBIE_RENDERER;`
    this.entityRendererId = EntityRendererId.Zombie;
    // §Zombie.cpp:21 — `textureName = "mob/zombie.png";`
    this.textureName = 'mob/zombie.png';
    // §Zombie.cpp:25 — `runSpeed = 0.5f;`
    this.runSpeed = ZOMBIE_RUN_SPEED;
    // §Zombie.cpp:26 — `attackDamage = 4;`
    this.attackDamage = ZOMBIE_ATTACK_DAMAGE;
  }

  /** §Zombie.cpp:49-51 — `int Zombie::getMaxHealth() { return 12; }`. */
  override getMaxHealth(): number {
    return 12;
  }

  /** §Zombie.cpp:53-72 — `void Zombie::aiStep()` — daylight burn. */
  override aiStep(): void {
    // §Zombie.cpp:54 — `if ((++fireCheckTick & 1) && level->isDay() && !level->isClientSide)`
    if ((++this.fireCheckTick & 1) && this.level?.isDay() && !this.level.isClientSide) {
      const br = this.getBrightness(1);
      // §Zombie.cpp:56 — `if (br > 0.5f)`
      if (br > 0.5) {
        const level = this.level!;
        // §Zombie.cpp:57 — `if (level->canSeeSky(x,y,z) && random.nextFloat()*3.5f < (br - 0.4f))`
        if (level.canSeeSky(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z)) &&
            this.random.nextFloat() * 3.5 < (br - 0.4)) {
          // §Zombie.cpp:58 — `hurt(NULL, 1);`
          this.hurt(null, 1);
          // §Zombie.cpp:60-65 — spawn explode particles (browser-layer concern).
          for (let i = 0; i < 5; ++i) {
            const xa = (2.0 * this.random.nextFloat() - 1.0) * (2.0 * this.random.nextFloat() - 1.0) * 0.02;
            const ya = (2.0 * this.random.nextFloat() - 1.0) * (2.0 * this.random.nextFloat() - 1.0) * 0.02;
            const za = (2.0 * this.random.nextFloat() - 1.0) * (2.0 * this.random.nextFloat() - 1.0) * 0.02;
            level.addParticle('explode',
              this.x + this.random.nextFloat() * this.bbWidth * 2 - this.bbWidth,
              this.y + this.random.nextFloat() * this.bbHeight,
              this.z + this.random.nextFloat() * this.bbWidth * 2 - this.bbWidth,
              xa, ya, za);
          }
        }
      }
    }
    super.aiStep();
  }

  /** §Zombie.cpp:74-76 — `int Zombie::getEntityTypeId() const { return MobTypes::Zombie; }`. */
  override getEntityTypeId(): number {
    return MobType.Zombie;
  }

  /** §Zombie.cpp:78-80 — `void Zombie::setUseNewAi(bool use)`. */
  setUseNewAi(use: boolean): void {
    this.useNewAiValue = use;
  }

  /** §Zombie.cpp:82-86 — `int Zombie::getArmorValue()` — super + 2 (cap 20). */
  override getArmorValue(): number {
    const armor = super.getArmorValue() + 2;
    // §Zombie.cpp:84 — `if (armor > 20) armor = 20;`
    return Math.min(armor, 20);
  }

  /** §Zombie.cpp:88-90 — `const char* Zombie::getAmbientSound() { return "mob.zombie"; }`. */
  override getAmbientSound(): string | null {
    return 'mob.zombie';
  }

  /** §Zombie.cpp:92-94 — `std::string Zombie::getHurtSound() { return "mob.zombiehurt"; }`. */
  override getHurtSound(): string {
    return 'mob.zombiehurt';
  }

  /** §Zombie.cpp:96-98 — `std::string Zombie::getDeathSound() { return "mob.zombiedeath"; }`. */
  override getDeathSound(): string {
    return 'mob.zombiedeath';
  }

  /** §Zombie.cpp:100-103 — `int Zombie::getDeathLoot()` — `@todo` returns 0 (rotten flesh commented out). */
  override getDeathLoot(): string | null {
    return null;
  }

  /** §Zombie.cpp:105-107 — `bool Zombie::useNewAi() { return _useNewAi; }`. */
  override useNewAi(): boolean {
    return this.useNewAiValue;
  }

  /** §Zombie.cpp:109-116 — `void Zombie::die(Entity*)` — 1/4 chance to drop a feather. */
  override die(source: Entity | null): void {
    super.die(source);
    const level = this.level;
    if (level && !level.isClientSide) {
      // §Zombie.cpp:112 — `if (random.nextInt(4) == 0)`
      if (this.random.nextInt(4) === 0) {
        // §Zombie.cpp:113 — `spawnAtLocation(Item::feather->id, random.nextInt(1) + 1);`
        this.spawnAtLocation('minecraft:feather', this.random.nextInt(1) + 1);
      }
    }
  }

  /** §Zombie.cpp:118-123 — `int Zombie::getAttackDamage(Entity* target)` — base + weapon bonus. */
  override getAttackDamage(_target: Entity): number {
    void _target;
    // §Zombie.cpp:119 — `ItemInstance* weapon = getCarriedItem();`
    const weapon = this.getCarriedItem();
    let damage = this.attackDamage;
    // §Zombie.cpp:121 — `if (weapon != NULL) damage += weapon->getAttackDamage(this);`
    if (weapon) damage += 0; // pure-logic port: no weapon damage model yet.
    return damage;
  }
}
