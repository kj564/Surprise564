// §MCPE 2013 TileEntity — 1:1 port from rujukan C++ source.
// Rujukan: TileEntity.h, TileEntity.cpp, TileEntityRendererId.h
//
// Tile entities are blocks that need per-tick logic or persistent state
// beyond what a simple block ID can store (chest inventory, furnace smelting,
// sign text). They are stored in the world's tile-entity map keyed by (x,y,z).

import type { ItemStack } from '../../../inventory/inventory';

// === §TileEntity.h:9-13 — TileEntityType ===
/** §TileEntity.h:9 — `static const int Undefined = 0;` */
export const TILE_ENTITY_UNDEFINED = 0;
/** §TileEntity.h:10 — `static const int Furnace = 1;` */
export const TILE_ENTITY_FURNACE = 1;
/** §TileEntity.h:11 — `static const int Chest = 2;` */
export const TILE_ENTITY_CHEST = 2;
/** §TileEntity.h:12 — `static const int NetherReactor = 3;` */
export const TILE_ENTITY_NETHER_REACTOR = 3;
/** §TileEntity.h:13 — `static const int Sign = 4;` */
export const TILE_ENTITY_SIGN = 4;

/** §TileEntity.h:24-70 — Abstract base class for tile entities. */
export abstract class TileEntity {
  /** §TileEntity.h:61 — `Level* level;` */
  level: unknown = null;
  /** §TileEntity.h:62 — `int x, y, z;` */
  x = 0; y = 0; z = 0;
  /** §TileEntity.h:64 — `int data;` */
  data = 0;
  /** §TileEntity.h:65 — `int type;` */
  readonly type: number;
  /** §TileEntity.h:66 — `int runningId;` */
  runningId = 0;
  /** §TileEntity.h:68 — `bool clientSideOnly;` */
  clientSideOnly = false;
  /** §TileEntity.h:70 — `TileEntityRendererId rendererId;` */
  rendererId = 0;
  /** §TileEntity.h:72 — `Tile* tile;` */
  protected tile: number = 0;
  /** §TileEntity.h:73 — `bool remove;` */
  protected removed = false;

  constructor(type: number) {
    this.type = type;
  }

  /** §TileEntity.h:34 — `virtual bool shouldSave() = 0;` */
  abstract shouldSave(): boolean;

  /** §TileEntity.h:35 — `virtual void load(CompoundTag* tag);` */
  load(tag: Record<string, unknown>): void {
    // §TileEntity.cpp — base: reads x, y, z from tag
    this.x = (tag.x as number) ?? this.x;
    this.y = (tag.y as number) ?? this.y;
    this.z = (tag.z as number) ?? this.z;
  }

  /** §TileEntity.h:36 — `virtual bool save(CompoundTag* tag);` */
  save(tag: Record<string, unknown>): boolean {
    tag.x = this.x;
    tag.y = this.y;
    tag.z = this.z;
    return true;
  }

  /** §TileEntity.h:38 — `virtual void tick() {}` — default: no-op */
  tick(): void {}

  /** §TileEntity.h:39 — `virtual bool isFinished();` */
  isFinished(): boolean {
    return this.removed;
  }

  /** §TileEntity.h:44 — `void setLevelAndPos(Level*, int, int, int);` */
  setLevelAndPos(level: unknown, x: number, y: number, z: number): void {
    this.level = level;
    this.x = x; this.y = y; this.z = z;
  }

  /** §TileEntity.h:50 — `float distanceToSqr(float, float, float);` */
  distanceToSqr(x: number, y: number, z: number): number {
    const dx = this.x - x, dy = this.y - y, dz = this.z - z;
    return dx * dx + dy * dy + dz * dz;
  }

  /** §TileEntity.h:52 — `Tile* getTile();` */
  getTile(): number { return this.tile; }

  /** §TileEntity.h:56 — `bool isRemoved() const;` */
  isRemoved(): boolean { return this.removed; }

  /** §TileEntity.h:57 — `void setRemoved();` */
  setRemoved(): void { this.removed = true; }

  /** §TileEntity.h:58 — `void clearRemoved();` */
  clearRemoved(): void { this.removed = false; }

  /** §TileEntity.h:60 — `virtual void triggerEvent(int, int);` */
  triggerEvent(_b0: number, _b1: number): void {}

  /** §TileEntity.h:61 — `virtual void clearCache();` */
  clearCache(): void {}

  /** §TileEntity.h:63 — `bool isType(int Type);` */
  isType(type: number): boolean { return this.type === type; }

  /** §TileEntity.h:46 — `void setChanged();` — marks for save */
  setChanged(): void { /* world adapter handles dirty tracking */ }
}

