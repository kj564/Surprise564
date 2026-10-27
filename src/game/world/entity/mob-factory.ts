// §MCPE 2013 MobFactory — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   MobFactory.h:8-90 — `class MobFactory` (header-only switch + static test cache)
//
// The rujukan factory is a header-only switch on MobTypes IDs. It also
// maintains a static `std::map<int, Mob*>` cache keyed by mobType that is
// invalidated whenever a new Level is presented (§MobFactory.h:62-87).
// We mirror that cache here for tests; `clearStaticTestMobs()` is a no-arg
// "want clear" sentinel call (§MobFactory.h:56-58).

import type { EntityLevel } from './level';
import type { Mob } from './mob';
import { MobType } from './types';
import { Chicken } from './animal/chicken';
import { Cow } from './animal/cow';
import { Pig } from './animal/pig';
import { Sheep } from './animal/sheep';
import { Zombie } from './monster/zombie';
import { Creeper } from './monster/creeper';
import { Skeleton } from './monster/skeleton';
import { Spider } from './monster/spider';

/**
 * §MobFactory.h:8-90 — `class MobFactory`.
 * Static `CreateMob(int, Level*)` switch + per-level test-mob cache.
 */
export abstract class MobFactory {
  /** §MobFactory.h:62-63 — `static std::map<int, Mob*> _mobs; static Level* lastLevel;` */
  private static testMobs = new Map<number, Mob>();
  private static lastLevel: EntityLevel | null = null;

  /**
   * §MobFactory.h:10-54 — `static Mob* CreateMob(int mobType, Level* level)`.
   * Returns null on unknown type (matching the C++ `default:` + `LOGE` + null return).
   * Sets `mob->health = mob->getMaxHealth()` before returning (§MobFactory.h:51).
   */
  static createMob(mobType: number, level: EntityLevel | null): Mob | null {
    let mob: Mob | null = null;
    switch (mobType) {
      // Animals (§MobFactory.h:16-27)
      case MobType.Chicken: mob = new Chicken(level); break;
      case MobType.Cow:     mob = new Cow(level); break;
      case MobType.Pig:     mob = new Pig(level); break;
      case MobType.Sheep:   mob = new Sheep(level); break;
      // Monsters (§MobFactory.h:30-44)
      case MobType.Creeper:  mob = new Creeper(level); break;
      case MobType.Zombie:   mob = new Zombie(level); break;
      case MobType.Skeleton: mob = new Skeleton(level); break;
      case MobType.Spider:   mob = new Spider(level); break;
      // §MobFactory.h:42-43 — PigZombie omitted (not present in MCPE 2013 source).
      default:
        // §MobFactory.h:46 — `LOGE("Unknown mob type requested: %d\n", mobType);`
        return null;
    }
    if (mob) {
      // §MobFactory.h:51 — `mob->health = mob->getMaxHealth();`
      mob.health = mob.getMaxHealth();
    }
    return mob;
  }

  /**
   * §MobFactory.h:56-58 — `static void clearStaticTestMobs()`.
   * Sentinel: clears the cache (called with mobType=0, level=NULL).
   */
  static clearStaticTestMobs(): void {
    MobFactory.getStaticTestMob(0, null);
  }

  /**
   * §MobFactory.h:61-87 — `static Mob* getStaticTestMob(int mobType, Level* level)`.
   *
   * Cache semantics:
   *   mobType=0 && level=null  →  want clear (deletes all cached mobs, returns null)
   *   level !== lastLevel      →  new level: clear cache, then proceed
   *   existing entry            →  return it
   *   no entry                  →  CreateMob + cache + return
   */
  static getStaticTestMob(mobType: number, level: EntityLevel | null): Mob | null {
    // §MobFactory.h:65 — `bool wantClear = (mobType == 0) && (level == NULL);`
    const wantClear = mobType === 0 && level === null;
    // §MobFactory.h:66 — `bool newLevel = (level != lastLevel);`
    const newLevel = level !== MobFactory.lastLevel;
    MobFactory.lastLevel = level;

    if (wantClear || newLevel) {
      // §MobFactory.h:71-73 — clear cache (we hold plain refs, no `delete` in JS).
      MobFactory.testMobs.clear();
      if (wantClear) return null;
    }

    // §MobFactory.h:78-81 — `if (it != end) return it->second;`
    const existing = MobFactory.testMobs.get(mobType);
    if (existing) return existing;

    // §MobFactory.h:84-86 — `Mob* mob = CreateMob(mobType, level); _mobs.insert(...); return mob;`
    const mob = MobFactory.createMob(mobType, level);
    if (mob) MobFactory.testMobs.set(mobType, mob);
    return mob;
  }
}
