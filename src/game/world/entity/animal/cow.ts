// §MCPE 2013 Cow — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Cow.h:12-40      — Cow class declaration
//   Cow.cpp:6-79    — constructor / interact / sounds / dropDeathLoot

import type { EntityLevel } from '../level';
import { EntityRendererId, MobType } from '../types';
import { Animal } from './animal';

/** §Cow.h:12-40 — Cow mob. */
export class Cow extends Animal {
  constructor(level: EntityLevel | null) {
    super(level);
    // §Cow.cpp:9 — `entityRendererId = ER_COW_RENDERER;`
    this.entityRendererId = EntityRendererId.Cow;
    // §Cow.cpp:11 — `textureName = "mob/cow.png";`
    this.textureName = 'mob/cow.png';
    // §Cow.cpp:12 — `setSize(0.9f, 1.3f);`
    this.setSize(0.9, 1.3);
  }

  /** §Cow.cpp:15-17 — `int Cow::getEntityTypeId() const { return MobTypes::Cow; }`. */
  override getEntityTypeId(): number {
    return MobType.Cow;
  }

  /** §Cow.cpp:19-21 — `int Cow::getMaxHealth() { return 10; }`. */
  override getMaxHealth(): number {
    return 10;
  }

  /**
   * §Cow.cpp:31-38 — `bool Cow::interact(Player* player)`.
   * Milk-on-bucket interaction is commented out in rujukan; returns super.
   */
  override interact(player: unknown): boolean {
    // §Cow.cpp:32-36 — bucket-empty→milk swap is `@todo` in rujukan; falls through.
    return super.interact(player);
  }

  /** §Cow.cpp:40-42 — `const char* Cow::getAmbientSound() { return "mob.cow"; }`. */
  override getAmbientSound(): string | null {
    return 'mob.cow';
  }

  /** §Cow.cpp:44-46 — `std::string Cow::getHurtSound() { return "mob.cowhurt"; }`. */
  override getHurtSound(): string {
    return 'mob.cowhurt';
  }

  /** §Cow.cpp:48-50 — `std::string Cow::getDeathSound() { return "mob.cowhurt"; }`. */
  override getDeathSound(): string {
    return 'mob.cowhurt';
  }

  /** §Cow.cpp:52-54 — `float Cow::getSoundVolume() { return 0.4f; }`. */
  override getSoundVolume(): number {
    return 0.4;
  }

  /** §Cow.cpp:56-58 — `int Cow::getDeathLoot() { return Item::leather->id; }`. */
  override getDeathLoot(): string | null {
    return 'minecraft:leather';
  }

  /** §Cow.cpp:60-75 — `void Cow::dropDeathLoot()` — leather + raw beef. */
  override dropDeathLoot(): void {
    // §Cow.cpp:62 — `int count = random.nextInt(3);`
    const leatherCount = this.random.nextInt(3);
    for (let i = 0; i < leatherCount; i++) {
      // §Cow.cpp:64 — `spawnAtLocation(Item::leather->id, 1);`
      this.spawnAtLocation('minecraft:leather', 1);
    }
    // §Cow.cpp:67 — `count = random.nextInt(3) + 1;`
    const beefCount = this.random.nextInt(3) + 1;
    for (let i = 0; i < beefCount; i++) {
      // §Cow.cpp:72 — `spawnAtLocation(Item::beef_raw->id, 1);`
      this.spawnAtLocation('minecraft:beef_raw', 1);
    }
  }

  /** §Cow.cpp:77-79 — `Animal* Cow::getBreedOffspring(Animal*)`. */
  override getBreedOffspring(_target: Animal | null): Animal | null {
    void _target;
    return new Cow(this.level);
  }

  /** §Cow.cpp:23-29 — save/load (no extra fields beyond Animal). */
  override addAdditonalSaveData(tag: Record<string, unknown>): void {
    super.addAdditonalSaveData(tag);
  }
  override readAdditionalSaveData(tag: Record<string, unknown>): void {
    super.readAdditionalSaveData(tag);
  }
}
