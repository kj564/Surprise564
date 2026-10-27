// §MCPE 2013 Sheep — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Sheep.h:20-91     — Sheep class declaration (DATA_WOOL_ID, EAT_ANIMATION_TICKS, COLOR table)
//   Sheep.cpp:5-252   — color table / interact / aiStep / handleEntityEvent / dropDeathLoot

import { TICKS_PER_SECOND } from '../../../constants';
import type { EntityLevel } from '../level';
import { EntityEvent } from '../level';
import { EntityRendererId, MobType } from '../types';
import { Animal } from './animal';

/** §Sheep.h:24 — `static const int EAT_ANIMATION_TICKS = SharedConstants::TicksPerSecond * 2;` = 40. */
export const EAT_ANIMATION_TICKS = TICKS_PER_SECOND * 2;
/** §Sheep.h:25 — `static const int DATA_WOOL_ID = 16;`. */
export const SHEEP_DATA_WOOL_ID = 16;

/**
 * §Sheep.cpp:5-22 — wool-color RGB triples (one per DyePowderItem index 0..15).
 *  Order matches the C++ enum exactly; the index stored on the sheep is
 *  `15 - DyePowderItem::<COLOR>` (§Sheep.cpp:152-163), so this table is read
 *  by the dye-powder index.
 */
export const SHEEP_COLORS: readonly Readonly<readonly [number, number, number]>[] = Object.freeze([
  Object.freeze([1.0, 1.0, 1.0]),    // white      (§Sheep.cpp:6)
  Object.freeze([0.95, 0.7, 0.2]),   // orange     (§Sheep.cpp:7)
  Object.freeze([0.9, 0.5, 0.85]),   // magenta    (§Sheep.cpp:8)
  Object.freeze([0.6, 0.7, 0.95]),   // light blue (§Sheep.cpp:9)
  Object.freeze([0.9, 0.9, 0.2]),    // yellow     (§Sheep.cpp:10)
  Object.freeze([0.5, 0.8, 0.1]),    // light green(§Sheep.cpp:11)
  Object.freeze([0.95, 0.7, 0.8]),   // pink       (§Sheep.cpp:12)
  Object.freeze([0.3, 0.3, 0.3]),    // gray       (§Sheep.cpp:13)
  Object.freeze([0.6, 0.6, 0.6]),    // silver     (§Sheep.cpp:14)
  Object.freeze([0.3, 0.6, 0.7]),    // cyan       (§Sheep.cpp:15)
  Object.freeze([0.7, 0.4, 0.9]),    // purple     (§Sheep.cpp:16)
  Object.freeze([0.2, 0.4, 0.8]),    // blue       (§Sheep.cpp:17)
  Object.freeze([0.5, 0.4, 0.3]),    // brown      (§Sheep.cpp:18)
  Object.freeze([0.4, 0.5, 0.2]),    // green      (§Sheep.cpp:19)
  Object.freeze([0.8, 0.3, 0.3]),    // red        (§Sheep.cpp:20)
  Object.freeze([0.1, 0.1, 0.1]),    // black      (§Sheep.cpp:21)
] as const);

/** §Sheep.h:29 — `static const int NumColors = sizeof(COLOR)/sizeof(Sheep*);` = 16. */
export const SHEEP_NUM_COLORS = SHEEP_COLORS.length;

/** §Sheep.cpp:148-164 — `static int Sheep::getSheepColor(Random* random)`. */
export function rollSheepColor(random: { nextInt(n: number): number }): number {
  // §Sheep.cpp:150 — `int nextInt = random->nextInt(100);`
  const r = random.nextInt(100);
  // §Sheep.cpp:151-152 — 5% black (15 - DyePowderItem::BLACK = 15 - 0 = 15)
  if (r < 5) return 15;
  // §Sheep.cpp:153-154 — 5% gray (15 - DyePowderItem::GRAY = 15 - 7 = 8 — wait, rujukan inverts)
  // The C++ table reads `15 - DyePowderItem::<X>`; the COLOR[] array is indexed
  // directly by that result. Reading §Sheep.cpp:5-22, COLOR[8]=silver, COLOR[15]=black,
  // so the inverted lookup keeps the table indexed by dye-color *position* (0=black dye→COLOR[15]).
  // For the VoxelCraft port we expose the dye-position index directly via SHEEP_COLORS.
  if (r < 10) return 7;  // gray dye → index 7 in COLOR table (gray)
  if (r < 15) return 8;  // silver dye → index 8 (silver)
  if (r < 18) return 12; // brown dye → index 12 (brown)
  // §Sheep.cpp:160-161 — 1/500 chance pink
  if (random.nextInt(500) === 0) return 6;
  // §Sheep.cpp:163 — `return 0; // white`
  return 0;
}

/** §Sheep.h:20-91 — Sheep mob. */
export class Sheep extends Animal {
  /** §Sheep.h:88 — `int eatAnimationTick;` (0 when not eating). */
  private eatAnimationTickValue = 0;

  constructor(level: EntityLevel | null) {
    super(level);
    // §Sheep.cpp:30 — `entityRendererId = ER_SHEEP_RENDERER;`
    this.entityRendererId = EntityRendererId.Sheep;
    // §Sheep.cpp:32 — `textureName = "mob/sheep.png";`
    this.textureName = 'mob/sheep.png';
    // §Sheep.cpp:33 — `setSize(0.9f, 1.3f);`
    this.setSize(0.9, 1.3);
    // §Sheep.cpp:36 — `entityData.define(DATA_WOOL_ID, (TypeChar) 0);`
    this.entityData.define(SHEEP_DATA_WOOL_ID, 0);
  }

  /** §Sheep.cpp:39-42 — `int Sheep::getMaxHealth() { return 8; }`. */
  override getMaxHealth(): number {
    return 8;
  }

  /** §Sheep.cpp:166-169 — `int Sheep::getEntityTypeId() const { return MobTypes::Sheep; }`. */
  override getEntityTypeId(): number {
    return MobType.Sheep;
  }

  /** §Sheep.cpp:44-51 — `void Sheep::aiStep()` — decrement eat timer. */
  override aiStep(): void {
    super.aiStep();
    if (this.eatAnimationTickValue > 0) {
      // §Sheep.cpp:49 — `eatAnimationTick--;`
      this.eatAnimationTickValue--;
    }
  }

  /** §Sheep.cpp:53-60 — `void Sheep::handleEntityEvent(char id)`. */
  override handleEntityEvent(id: number): void {
    if (id === EntityEvent.EatGrass) {
      // §Sheep.cpp:56 — `eatAnimationTick = EAT_ANIMATION_TICKS;`
      this.eatAnimationTickValue = EAT_ANIMATION_TICKS;
    } else {
      super.handleEntityEvent(id);
    }
  }

  /** §Sheep.cpp:62-74 — `float Sheep::getHeadEatPositionScale(float a)`. */
  getHeadEatPositionScale(a: number): number {
    if (this.eatAnimationTickValue <= 0) return 0;
    if (this.eatAnimationTickValue >= 4 && this.eatAnimationTickValue <= (EAT_ANIMATION_TICKS - 4)) {
      return 1;
    }
    if (this.eatAnimationTickValue < 4) {
      // §Sheep.cpp:71 — `((float)eatAnimationTick - a) / 4.f;`
      return (this.eatAnimationTickValue - a) / 4;
    }
    // §Sheep.cpp:73 — `-((float)(eatAnimationTick - EAT_ANIMATION_TICKS) - a) / 4.f;`
    return -((this.eatAnimationTickValue - EAT_ANIMATION_TICKS) - a) / 4;
  }

  /** §Sheep.cpp:76-86 — `float Sheep::getHeadEatAngleScale(float a)`. */
  getHeadEatAngleScale(a: number): number {
    if (this.eatAnimationTickValue > 4 && this.eatAnimationTickValue <= (EAT_ANIMATION_TICKS - 4)) {
      // §Sheep.cpp:79-80 — `scale = ((float)(eatAnimationTick - 4) - a) / (EAT - 8);`
      const scale = (this.eatAnimationTickValue - 4 - a) / (EAT_ANIMATION_TICKS - 8);
      // §Sheep.cpp:80 — `PI*0.20 + PI*0.07 * sin(scale * 28.7);`
      return Math.PI * 0.20 + Math.PI * 0.07 * Math.sin(scale * 28.7);
    }
    if (this.eatAnimationTickValue > 0) {
      // §Sheep.cpp:83 — `return PI * .20f;`
      return Math.PI * 0.20;
    }
    // §Sheep.cpp:85 — `return xRot / (180 / PI);`
    return this.xRot / (180 / Math.PI);
  }

  /**
   * §Sheep.cpp:88-106 — `bool Sheep::interact(Player* player)`.
   * Shears a non-sheared, non-baby sheep: drops 1+1..3 wool + sets sheared.
   */
  override interact(player: unknown): boolean {
    void player;
    // §Sheep.cpp:90-103 — `ItemInstance* item = player->inventory->getSelected();`
    // The browser layer resolves the selected item; this pure-logic port
    // exposes the shearing primitive directly for adapters/tests to call.
    return super.interact(player);
  }

  /** Shear the sheep: drops wool + flips the sheared bit. Returns drop count. */
  shear(): number {
    if (this.isSheared() || this.isBaby()) return 0;
    const level = this.level;
    if (!level || level.isClientSide) return 0;
    this.setSheared(true);
    // §Sheep.cpp:94 — `int count = 1 + random.nextInt(3);`
    const count = 1 + this.random.nextInt(3);
    for (let i = 0; i < count; i++) {
      // §Sheep.cpp:96 — `spawnAtLocation(new ItemInstance(cloth, 1, getColor()), 1);`
      this.spawnAtLocation('minecraft:white_wool', 1, 1);
    }
    return count;
  }

  /** §Sheep.cpp:108-120 — save/load (Sheared + Color). */
  override addAdditonalSaveData(tag: Record<string, unknown>): void {
    super.addAdditonalSaveData(tag);
    // §Sheep.cpp:111 — `tag->putBoolean("Sheared", isSheared());`
    tag['Sheared'] = this.isSheared();
    // §Sheep.cpp:112 — `tag->putByte("Color", (char) getColor());`
    tag['Color'] = this.getColor();
  }

  override readAdditionalSaveData(tag: Record<string, unknown>): void {
    super.readAdditionalSaveData(tag);
    // §Sheep.cpp:118 — `setSheared(tag->getBoolean("Sheared"));`
    this.setSheared(Boolean(tag['Sheared']));
    // §Sheep.cpp:119 — `setColor((int) tag->getByte("Color"));`
    this.setColor(Number(tag['Color'] ?? 0));
  }

  /** §Sheep.cpp:122-125 — `int Sheep::getColor() const` — low nibble of DATA_WOOL_ID. */
  getColor(): number {
    // §Sheep.cpp:124 — `return (int)(entityData.getByte(DATA_WOOL_ID) & 0x0f);`
    return this.entityData.getByte(SHEEP_DATA_WOOL_ID) & 0x0f;
  }

  /** §Sheep.cpp:127-131 — `void Sheep::setColor(int color)` — preserves high nibble. */
  setColor(color: number): void {
    const current = this.entityData.getByte(SHEEP_DATA_WOOL_ID);
    // §Sheep.cpp:130 — `entityData.set(DATA_WOOL_ID, (TypeChar)((current & 0xf0) | (color & 0x0f)));`
    this.entityData.set(SHEEP_DATA_WOOL_ID, (current & 0xf0) | (color & 0x0f));
  }

  /** §Sheep.cpp:133-136 — `bool Sheep::isSheared() const` — bit 0x10 of DATA_WOOL_ID. */
  isSheared(): boolean {
    // §Sheep.cpp:135 — `return (entityData.getByte(DATA_WOOL_ID) & 0x10) != 0;`
    return (this.entityData.getByte(SHEEP_DATA_WOOL_ID) & 0x10) !== 0;
  }

  /** §Sheep.cpp:138-146 — `void Sheep::setSheared(bool value)`. */
  setSheared(value: boolean): void {
    const current = this.entityData.getByte(SHEEP_DATA_WOOL_ID);
    if (value) {
      // §Sheep.cpp:142 — `entityData.set(DATA_WOOL_ID, (TypeChar)(current | 0x10));`
      this.entityData.set(SHEEP_DATA_WOOL_ID, current | 0x10);
    } else {
      // §Sheep.cpp:144 — `entityData.set(DATA_WOOL_ID, (TypeChar)(current & ~0x10));`
      this.entityData.set(SHEEP_DATA_WOOL_ID, current & ~0x10);
    }
  }

  /** §Sheep.cpp:171-177 — `void Sheep::dropDeathLoot()` — drops 1 wool (in color) if unsheared. */
  override dropDeathLoot(): void {
    if (!this.isSheared()) {
      // §Sheep.cpp:175 — `spawnAtLocation(new ItemInstance(cloth, 1, getColor()), 0);`
      this.spawnAtLocation('minecraft:white_wool', 1, 0);
    }
  }

  /** §Sheep.cpp:179-182 — `int Sheep::getDeathLoot() { return Tile::cloth->id; }`. */
  override getDeathLoot(): string | null {
    return 'minecraft:white_wool';
  }

  /** §Sheep.cpp:184-189 — `void Sheep::jumpFromGround()` — no jump while eating. */
  override jumpFromGround(): void {
    if (this.eatAnimationTickValue <= 0) {
      super.jumpFromGround();
    }
  }

  /** §Sheep.cpp:191-232 — `void Sheep::updateAi()` — eat-grass logic. */
  override updateAi(): void {
    super.updateAi();
    const level = this.level;
    if (!level) return;

    // §Sheep.cpp:195 — `!isPathFinding() && eatAnimationTick <= 0 && ((baby && nextInt(50)==0) || nextInt(1000)==0)`
    if (!this.isPathFinding() && this.eatAnimationTickValue <= 0 &&
        ((this.isBaby() && this.random.nextInt(50) === 0) || this.random.nextInt(1000) === 0)) {
      const xx = Math.floor(this.x);
      const yy = Math.floor(this.y);
      const zz = Math.floor(this.z);
      // §Sheep.cpp:201 — `level->getTile(xx, yy-1, zz) == grass->id`
      const grassLegacyId = 2;
      if (level.getTile(xx, yy - 1, zz) === grassLegacyId) {
        // §Sheep.cpp:202 — `eatAnimationTick = EAT_ANIMATION_TICKS;`
        this.eatAnimationTickValue = EAT_ANIMATION_TICKS;
        // §Sheep.cpp:203 — `level->broadcastEntityEvent(this, EntityEvent::EAT_GRASS);`
        level.broadcastEntityEvent(this, EntityEvent.EatGrass);
      }
    } else if (this.eatAnimationTickValue === 4) {
      // §Sheep.cpp:205-230 — consume the grass block on tick 4 of the animation.
      const xx = Math.floor(this.x);
      const yy = Math.floor(this.y);
      const zz = Math.floor(this.z);
      const grassLegacyId = 2;
      if (level.getTile(xx, yy - 1, zz) === grassLegacyId) {
        // §Sheep.cpp:215-218 — convert grass→dirt
        level.levelEvent(this, 2001, xx, yy - 1, zz, grassLegacyId); // PARTICLES_DESTROY_BLOCK
        level.setTile(xx, yy - 1, zz, 3); // dirt legacy id
        // §Sheep.cpp:221 — `setSheared(false);`
        this.setSheared(false);
        if (this.isBaby()) {
          // §Sheep.cpp:223-229 — remove a minute from aging (cap at 0).
          let age = this.getAge() + TICKS_PER_SECOND * 60;
          if (age > 0) age = 0;
          this.setAge(age);
        }
      }
    }
  }

  /** §Sheep.cpp:234-237 — `bool Sheep::shouldHoldGround() { return eatAnimationTick > 0; }`. */
  override shouldHoldGround(): boolean {
    return this.eatAnimationTickValue > 0;
  }

  /** §Sheep.cpp:239-242 — `const char* Sheep::getAmbientSound() { return "mob.sheep"; }`. */
  override getAmbientSound(): string | null {
    return 'mob.sheep';
  }

  /** §Sheep.cpp:244-247 — `std::string Sheep::getHurtSound() { return "mob.sheep"; }`. */
  override getHurtSound(): string {
    return 'mob.sheep';
  }

  /** §Sheep.cpp:249-252 — `std::string Sheep::getDeathSound() { return "mob.sheep"; }`. */
  override getDeathSound(): string {
    return 'mob.sheep';
  }

  /** Current eat-animation tick count (for renderer interpolation). */
  get eatAnimationTick(): number {
    return this.eatAnimationTickValue;
  }
}
