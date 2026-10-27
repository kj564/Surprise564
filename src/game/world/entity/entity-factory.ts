// §MCPE 2013 EntityFactory — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   EntityFactory.h:8-15  — `class EntityFactory` (CreateEntity + loadEntity decls)
//   EntityFactory.cpp:12-57 — switch on typeId; dispatch mobs (id < 64) to MobFactory
//
// The rujukan factory branches by id range:
//   id < 0    → LOGE + null    (§EntityFactory.cpp:34-35)
//   id < 64   → MobFactory::CreateMob  (§EntityFactory.cpp:36-37)
//   id >= 64  → CreateEntity   (§EntityFactory.cpp:38-39)
// Concrete non-mob entity classes (PrimedTnt, Arrow, etc.) live outside the
// entity logic port (they're item/projectile sub-trees). The TS port surfaces
// the same switch + the dispatch table so the browser layer can wire concrete
// non-mob entity classes via the constructor.

import type { EntityLevel } from './level';
import type { Entity } from './entity';
import { EntityType } from './types';
import { MobFactory } from './mob-factory';

/** §EntityFactory.cpp:12-24 — non-mob entity factory hook signature.
 *  Browser layer registers concrete entity ctors keyed by EntityType id. */
export type NonMobEntityCtor = (level: EntityLevel | null) => Entity;

/**
 * §EntityFactory.h:8-15 — `class EntityFactory`.
 *
 * Pure dispatch layer: mobs go to MobFactory, non-mobs go to the registered
 * constructor table. `loadEntity(tag, level)` mirrors §EntityFactory.cpp:26-57.
 */
export abstract class EntityFactory {
  /** §EntityFactory.cpp:5-11 — registered constructors for non-mob entities. */
  private static readonly nonMobCtors = new Map<number, NonMobEntityCtor>();

  /** Register a non-mob entity constructor for a given EntityType id. */
  static registerNonMob(typeId: number, ctor: NonMobEntityCtor): void {
    if (!Number.isInteger(typeId) || typeId < 64) {
      throw new RangeError('Non-mob entity type IDs must be ≥ 64');
    }
    if (typeof ctor !== 'function') throw new TypeError('ctor must be a function');
    MobFactory; // ensure MobFactory side-effects are evaluated by the bundler.
    EntityFactory.nonMobCtors.set(typeId, ctor);
  }

  /**
   * §EntityFactory.cpp:12-24 — `Entity* EntityFactory::CreateEntity(int typeId, Level* level)`.
   * Returns null on unknown IDs (matching C++ `return NULL;` at §EntityFactory.cpp:23).
   */
  static createEntity(typeId: number, level: EntityLevel | null): Entity | null {
    switch (typeId) {
      // §EntityFactory.cpp:15 — `case EntityTypes::IdItemEntity: return new ItemEntity(level);`
      case EntityType.ItemEntity:
      // §EntityFactory.cpp:16 — `case EntityTypes::IdFallingTile: return new FallingTile(level);`
      case EntityType.FallingTile:
      // §EntityFactory.cpp:17 — `case EntityTypes::IdPrimedTnt: return new PrimedTnt(level);`
      case EntityType.PrimedTnt:
      // §EntityFactory.cpp:18 — `case EntityTypes::IdArrow: return new Arrow(level);`
      case EntityType.Arrow:
      // §EntityFactory.cpp:19 — `case EntityTypes::IdThrownEgg: return new ThrownEgg(level);`
      case EntityType.ThrownEgg:
      // §EntityFactory.cpp:20 — `case EntityTypes::IdSnowball: return new Snowball(level);`
      case EntityType.Snowball:
      // §EntityFactory.cpp:21 — `case EntityTypes::IdPainting: return new Painting(level);`
      case EntityType.Painting: {
        const ctor = EntityFactory.nonMobCtors.get(typeId);
        return ctor ? ctor(level) : null;
      }
      default:
        // §EntityFactory.cpp:23 — `return NULL;`
        return null;
    }
  }

  /**
   * §EntityFactory.cpp:26-57 — `Entity* EntityFactory::loadEntity(CompoundTag* tag, Level* level)`.
   *
   * Reads the `id` int from the tag, dispatches by range to MobFactory or
   * CreateEntity, then calls `e->load(tag)`. Returns null on missing id,
   * negative id, or null entity (matching §EntityFactory.cpp:29-35).
   */
  static loadEntity(tag: Record<string, unknown> | null, level: EntityLevel | null): Entity | null {
    // §EntityFactory.cpp:28 — `if (!tag) return NULL;`
    if (!tag) return null;
    // §EntityFactory.cpp:29 — `if (!tag->contains("id")) return NULL;`
    if (!('id' in tag)) return null;
    const id = Number(tag['id']);
    if (!Number.isInteger(id)) return null;

    let e: Entity | null = null as Entity | null;
    if (id < 0) {
      // §EntityFactory.cpp:34-35 — `LOGE("Negative ItemId: %d ...");`
      return null;
    } else if (id < 64) {
      // §EntityFactory.cpp:36-37 — `e = MobFactory::CreateMob(id, level);`
      e = MobFactory.createMob(id, level) as unknown as Entity | null;
    } else {
      // §EntityFactory.cpp:38-39 — `e = CreateEntity(id, level);`
      e = EntityFactory.createEntity(id, level);
    }

    if (e) {
      // §EntityFactory.cpp:43 — `e->load(tag);`
      e.readAdditionalSaveData(tag);
      // §EntityFactory.cpp:46-53 — item-entity cleanup skipped (ItemEntity not ported here).
    }
    return e;
  }
}
