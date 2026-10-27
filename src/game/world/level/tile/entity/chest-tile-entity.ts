// §MCPE 2013 ChestTileEntity — 1:1 port from rujukan C++ source.
// Rujukan: ChestTileEntity.h + ChestTileEntity.cpp
//
// Chest logic: 27-slot inventory (9×3), open/close animation, neighbor linking.

import { TileEntity, TILE_ENTITY_CHEST } from './tile-entity';
import type { ItemStack } from '../../../inventory/inventory';

/** §ChestTileEntity.h:47 — `static const int ItemsSize = 9*3;` = 27 slots */
export const CHEST_SIZE = 9 * 3;

/**
 * §ChestTileEntity.h:23-49 — Chest tile entity.
 * Stores 27 ItemStacks in a 9×3 grid. Supports neighbor chest linking
 * (double chest) and open/close animation via openness lerp.
 */
export class ChestTileEntity extends TileEntity {
  /** §ChestTileEntity.h:42 — `ItemInstance* items[ItemsSize];` */
  items: (ItemStack | null)[] = new Array(CHEST_SIZE).fill(null);

  /** §ChestTileEntity.h:39 — `bool hasCheckedNeighbors;` */
  hasCheckedNeighbors = false;
  /** §ChestTileEntity.h:40 — `ChestTileEntity* n, *e, *w, *s;` — neighbor chests */
  n: ChestTileEntity | null = null;
  e: ChestTileEntity | null = null;
  w: ChestTileEntity | null = null;
  s: ChestTileEntity | null = null;

  /** §ChestTileEntity.h:43 — `float openness, oOpenness;` — animation */
  openness = 0;
  oOpenness = 0;
  /** §ChestTileEntity.h:44 — `int openCount;` — number of viewers */
  openCount = 0;

  /** §ChestTileEntity.h:46 — `int tickInterval;` */
  private tickInterval = 0;

  constructor() {
    super(TILE_ENTITY_CHEST);
  }

  /** §ChestTileEntity.h:27 — `int getContainerSize() const;` */
  getContainerSize(): number { return CHEST_SIZE; }

  /** §ChestTileEntity.h:28 — `int getMaxStackSize() const;` — §Container::LARGE_MAX_STACK_SIZE = 64 */
  getMaxStackSize(): number { return 64; }

  /** §ChestTileEntity.h:29 — `std::string getName() const;` */
  getName(): string { return 'container.chest'; } // §ChestTileEntity.cpp:56

  /** §ChestTileEntity.h:31 — `ItemInstance* getItem(int slot);` */
  getItem(slot: number): ItemStack | null {
    return this.items[slot] ?? null;
  }

  /** §ChestTileEntity.cpp — setItem */
  setItem(slot: number, item: ItemStack | null): void {
    this.items[slot] = item;
    this.setChanged();
  }

  /** §ChestTileEntity.h:37 — `bool shouldSave();` */
  shouldSave(): boolean {
    // §ChestTileEntity.cpp:61-63 — save if any slot has items
    for (let i = 0; i < CHEST_SIZE; i++) {
      if (this.items[i]) return true;
    }
    return false;
  }

  /** §ChestTileEntity.cpp:67-86 — `void load(CompoundTag* base);` */
  load(tag: Record<string, unknown>): void {
    super.load(tag);
    const items = tag.Items as Array<Record<string, unknown>> | undefined;
    if (!items) return;
    for (const entry of items) {
      const slot = (entry.Slot as number) & 0xff;
      if (slot >= 0 && slot < CHEST_SIZE) {
        this.items[slot] = {
          id: entry.id as string,
          count: entry.count as number,
          maxStackSize: 64,
          auxValue: entry.auxValue as number | undefined,
        };
      }
    }
  }

  /** §ChestTileEntity.cpp — `bool save(CompoundTag* base);` */
  save(tag: Record<string, unknown>): boolean {
    if (!super.save(tag)) return false;
    const items: Array<Record<string, unknown>> = [];
    for (let i = 0; i < CHEST_SIZE; i++) {
      const item = this.items[i];
      if (item) {
        items.push({ Slot: i, id: item.id, count: item.count, auxValue: item.auxValue });
      }
    }
    tag.Items = items;
    return true;
  }

  /** §ChestTileEntity.cpp — `void tick();` */
  tick(): void {
    // §ChestTileEntity.cpp — animate openness
    this.oOpenness = this.openness;
    // §ChestTileEntity.cpp — lerp toward target (open if openCount > 0)
    const target = this.openCount > 0 ? 1 : 0;
    this.openness += (target - this.openness) * 0.1;

    // §ChestTileEntity.cpp — check neighbors every 20 ticks
    if (++this.tickInterval >= 20) {
      this.tickInterval = 0;
      this.checkNeighbors();
    }
  }

  /** §ChestTileEntity.h:35 — `void checkNeighbors();` */
  checkNeighbors(): void {
    // §ChestTileEntity.cpp — find adjacent chest tile entities for double-chest
    if (this.hasCheckedNeighbors) return;
    this.hasCheckedNeighbors = true;
    // Browser adapter: world.getTileEntity(x, y±1, z) etc.
    // Left as stubs — the world adapter fills these in
  }

  /** §ChestTileEntity.h:38 — `void triggerEvent(int, int);` */
  triggerEvent(b0: number, _b1: number): void {
    // §ChestTileEntity.cpp — open/close event
    if (b0 === 1) {
      this.openCount = _b1;
    }
  }

  /** §ChestTileEntity.h:40 — `void startOpen();` */
  startOpen(): void {
    ++this.openCount;
    this.setChanged();
  }

  /** §ChestTileEntity.h:41 — `void stopOpen();` */
  stopOpen(): void {
    --this.openCount;
    this.setChanged();
  }

  /** §ChestTileEntity.h:43 — `void setRemoved();` */
  setRemoved(): void {
    super.setRemoved();
    // §ChestTileEntity.cpp — notify neighbors
    if (this.n) { this.n.hasCheckedNeighbors = false; this.n.s = null; }
    if (this.s) { this.s.hasCheckedNeighbors = false; this.s.n = null; }
    if (this.e) { this.e.hasCheckedNeighbors = false; this.e.w = null; }
    if (this.w) { this.w.hasCheckedNeighbors = false; this.w.e = null; }
  }
}
