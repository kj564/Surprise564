// §MCPE 2013 Skeleton — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Skeleton.h:13-41   — Skeleton class (extends Monster) — bow + fireCheckTick
//   Skeleton.cpp:4-107 — constructor / aiStep (daylight burn) / checkHurtTarget
//                         (ranged arrow fire) / dropDeathLoot (arrows + bones)

import { TICKS_PER_SECOND } from '../../../constants';
import type { EntityLevel } from '../level';
import { MobType, EntityRendererId } from '../types';
import type { Entity } from '../entity';
import { Monster } from './monster';

/** §Skeleton.cpp:79 — `attackTime = SharedConstants::TicksPerSecond * 3;` — 3-second ranged cooldown. */
export const SKELETON_RANGED_COOLDOWN_TICKS = TICKS_PER_SECOND * 3;

/** §Skeleton.h:13-41 — Skeleton mob. */
export class Skeleton extends Monster {
  /** §Skeleton.h:39 — `ItemInstance bow;` (constructed as `ItemInstance(Item::bow, 1)`). */
  protected readonly bow: { readonly itemKey: string; readonly count: number } = Object.freeze({
    itemKey: 'minecraft:bow',
    count: 1,
  });
  /** §Skeleton.h:40 — `int fireCheckTick;` */
  protected fireCheckTick = 0;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Skeleton.cpp:9 — `entityRendererId = ER_SKELETON_RENDERER;`
    this.entityRendererId = EntityRendererId.Skeleton;
    // §Skeleton.cpp:10 — `textureName = "mob/skeleton.png";`
    this.textureName = 'mob/skeleton.png';
  }

  /** §Skeleton.cpp:13-15 — `int Skeleton::getMaxHealth() { return 10; }`. */
  override getMaxHealth(): number {
    return 10;
  }

  /** §Skeleton.cpp:17-36 — `void Skeleton::aiStep()` — daylight burn. */
  override aiStep(): void {
    // §Skeleton.cpp:18 — `if ((++fireCheckTick & 1) && level->isDay() && !level->isClientSide)`
    if ((++this.fireCheckTick & 1) && this.level?.isDay() && !this.level.isClientSide) {
      const br = this.getBrightness(1);
      if (br > 0.5) {
        const level = this.level!;
        // §Skeleton.cpp:21 — `if (level->canSeeSky(x,y,z) && random.nextFloat()*3.5f < (br - 0.4f))`
        if (level.canSeeSky(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z)) &&
            this.random.nextFloat() * 3.5 < (br - 0.4)) {
          // §Skeleton.cpp:22 — `hurt(NULL, 1);`
          this.hurt(null, 1);
          // §Skeleton.cpp:24-29 — explode particles
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

  /** §Skeleton.cpp:38-40 — `int Skeleton::getDeathLoot() { return Item::arrow->id; }`. */
  override getDeathLoot(): string | null {
    return 'minecraft:arrow';
  }

  /** §Skeleton.cpp:42-44 — `ItemInstance* Skeleton::getCarriedItem() { return &bow; }`. */
  override getCarriedItem(): { readonly itemKey: string; readonly count: number } | null {
    return this.bow;
  }

  /** §Skeleton.cpp:46-48 — `int Skeleton::getEntityTypeId() const { return MobTypes::Skeleton; }`. */
  override getEntityTypeId(): number {
    return MobType.Skeleton;
  }

  /** §Skeleton.cpp:50-52 — `const char* Skeleton::getAmbientSound() { return "mob.skeleton"; }`. */
  override getAmbientSound(): string | null {
    return 'mob.skeleton';
  }

  /** §Skeleton.cpp:54-56 — `std::string Skeleton::getHurtSound() { return "mob.skeletonhurt"; }`. */
  override getHurtSound(): string {
    return 'mob.skeletonhurt';
  }

  /** §Skeleton.cpp:58-60 — `std::string Skeleton::getDeathSound() { return "mob.skeletonhurt"; }`. */
  override getDeathSound(): string {
    return 'mob.skeletonhurt';
  }

  /**
   * §Skeleton.cpp:62-85 — `void Skeleton::checkHurtTarget(Entity* target, float d)`.
   * Fires an arrow when target < 10 blocks away. The browser layer constructs
   * the Arrow entity; this port surfaces the fire event via the level adapter.
   */
  override checkHurtTarget(target: Entity, d: number): void {
    if (d >= 10) return;
    const xd = target.x - this.x;
    const zd = target.z - this.z;

    if (this.attackTime === 0) {
      const level = this.level;
      if (level) {
        // §Skeleton.cpp:68 — `Arrow* arrow = new Arrow(level, this, 1);`
        // §Skeleton.cpp:71 — `float yd = (target->y + target->getHeadHeight() - 0.7f) - arrow->y;`
        const yd = target.y + target.getHeadHeight() - 0.7 - this.y;
        // §Skeleton.cpp:73 — `float yo = sqrt(xd*xd + zd*zd) * 0.2f;`
        const yo = Math.sqrt(xd * xd + zd * zd) * 0.2;
        // §Skeleton.cpp:75 — `level->playSound(this, "random.bow", 1.0f, ...);`
        level.playSound(this, 'random.bow', 1.0, 1 / (this.random.nextFloat() * 0.4 + 0.8));
        // §Skeleton.cpp:76 — `level->addEntity(arrow);` (arrow-shot delegated to adapter).
        level.addEntity({ kind: 'arrow', owner: this, x: this.x, y: this.y + 1.4, z: this.z, xd, yd: yd + yo, zd, speed: 1.6, spread: 32 });
        // §Skeleton.cpp:79 — `attackTime = SharedConstants::TicksPerSecond * 3;`
        this.attackTime = SKELETON_RANGED_COOLDOWN_TICKS;
      }
    }
    // §Skeleton.cpp:81 — `yRot = (atan2(zd, xd) * RADDEG) - 90;`
    this.yRot = Math.atan2(zd, xd) * (180 / Math.PI) - 90;
    // §Skeleton.cpp:83 — `holdGround = true;`
    this.holdGround = true;
  }

  /** §Skeleton.cpp:87-98 — `void Skeleton::dropDeathLoot()` — arrows + bones. */
  override dropDeathLoot(): void {
    // §Skeleton.cpp:89 — `int count = random.nextInt(3);`
    const arrowCount = this.random.nextInt(3);
    for (let i = 0; i < arrowCount; i++) {
      // §Skeleton.cpp:91 — `spawnAtLocation(Item::arrow->id, 1);`
      this.spawnAtLocation('minecraft:arrow', 1);
    }
    // §Skeleton.cpp:94 — `count = random.nextInt(3);`
    const boneCount = this.random.nextInt(3);
    for (let i = 0; i < boneCount; i++) {
      // §Skeleton.cpp:96 — `spawnAtLocation(Item::bone->id, 1);`
      this.spawnAtLocation('minecraft:bone', 1);
    }
  }

  /** §Skeleton.cpp:100-102 — `int Skeleton::getUseDuration() { return attackTime; }`. */
  override getUseItemDuration(): number {
    return this.attackTime;
  }
}
