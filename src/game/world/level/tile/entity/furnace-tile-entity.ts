// §MCPE 2013 FurnaceTileEntity — 1:1 port from rujukan C++ source.
// Rujukan: FurnaceTileEntity.h + FurnaceTileEntity.cpp
//
// Furnace logic: 3 slots (ingredient, fuel, result), burn timer, cook timer.
// §FurnaceTileEntity.h:23 — `static const int BURN_INTERVAL = 10 * 20;` = 200 ticks

import { TileEntity, TILE_ENTITY_FURNACE } from './tile-entity';
import type { ItemStack } from '../../../inventory/inventory';

/** §FurnaceTileEntity.h:23 — `static const int BURN_INTERVAL = 10 * 20;` = 200 ticks (10 seconds) */
export const FURNACE_BURN_INTERVAL = 10 * 20; // §SharedConstants.h:28 — TicksPerSecond = 20

/** §FurnaceTileEntity.h:24 — `static const int NumItems = 3;` */
export const FURNACE_NUM_SLOTS = 3;

/** §FurnaceTileEntity.h:49 — `static const int SLOT_INGREDIENT = 0;` */
export const SLOT_INGREDIENT = 0;
/** §FurnaceTileEntity.h:50 — `static const int SLOT_FUEL = 1;` */
export const SLOT_FUEL = 1;
/** §FurnaceTileEntity.h:51 — `static const int SLOT_RESULT = 2;` */
export const SLOT_RESULT = 2;

/**
 * §FurnaceTileEntity.h:26-69 — Furnace tile entity.
 * Manages smelting: ingredient → result using fuel.
 */
export class FurnaceTileEntity extends TileEntity {
  /** §FurnaceTileEntity.h:62 — `int litTime;` — remaining burn ticks */
  litTime = 0;
  /** §FurnaceTileEntity.h:63 — `int litDuration;` — total burn duration of current fuel */
  litDuration = 0;
  /** §FurnaceTileEntity.h:64 — `int tickCount;` — cooking progress (0 to BURN_INTERVAL) */
  tickCount = 0;
  /** §FurnaceTileEntity.h:65 — `ItemInstance items[NumItems];` — 3 slots */
  items: (ItemStack | null)[] = [null, null, null];

  /** §FurnaceTileEntity.h:68 — `bool _canBeFinished;` */
  private _canBeFinished = false;
  /** §FurnaceTileEntity.h:69 — `bool finished;` */
  private _finished = false;

  constructor() {
    super(TILE_ENTITY_FURNACE);
  }

  /** §FurnaceTileEntity.h:40 — `ItemInstance* getItem(int slot);` */
  getItem(slot: number): ItemStack | null {
    return this.items[slot] ?? null;
  }

  /** §FurnaceTileEntity.h:41 — `void setItem(int slot, ItemInstance* item);` */
  setItem(slot: number, item: ItemStack | null): void {
    this.items[slot] = item;
    this.setChanged();
  }

  /** §FurnaceTileEntity.h:44 — `ItemInstance removeItem(int slot, int count);` */
  removeItem(slot: number, count: number): ItemStack | null {
    const item = this.items[slot];
    if (!item) return null;
    if (item.count <= count) {
      this.items[slot] = null;
      this.setChanged();
      return item;
    }
    const removed = { ...item, count };
    this.items[slot] = { ...item, count: item.count - count };
    this.setChanged();
    return removed;
  }

  /** §FurnaceTileEntity.h:48 — `int getContainerSize() const;` */
  getContainerSize(): number { return FURNACE_NUM_SLOTS; }

  /** §FurnaceTileEntity.h:49 — `int getMaxStackSize() const;` — §Container::LARGE_MAX_STACK_SIZE = 64 */
  getMaxStackSize(): number { return 64; }

  /** §FurnaceTileEntity.h:55 — `bool shouldSave();` */
  shouldSave(): boolean {
    // §FurnaceTileEntity.cpp:49-53 — save if lit or any slot has items
    if (this.litTime > 0) return true;
    for (let i = 0; i < FURNACE_NUM_SLOTS; i++) {
      if (this.items[i]) return true;
    }
    return false;
  }

  /** §FurnaceTileEntity.cpp:72-87 — `void load(CompoundTag* base);` */
  load(tag: Record<string, unknown>): void {
    super.load(tag);
    // §FurnaceTileEntity.cpp:75 — load items from "Items" list
    const items = tag.Items as Array<Record<string, unknown>> | undefined;
    for (let i = 0; i < FURNACE_NUM_SLOTS; i++) this.items[i] = null;
    if (items) {
      for (const entry of items) {
        const slot = entry.Slot as number;
        if (slot >= 0 && slot < FURNACE_NUM_SLOTS) {
          this.items[slot] = {
            id: entry.id as string,
            count: entry.count as number,
            maxStackSize: 64,
            auxValue: entry.auxValue as number | undefined,
          };
        }
      }
    }
    // §FurnaceTileEntity.cpp:85 — `litTime = base->getShort("BurnTime");`
    this.litTime = (tag.BurnTime as number) ?? 0;
    // §FurnaceTileEntity.cpp:86 — `tickCount = base->getShort("CookTime");`
    this.tickCount = (tag.CookTime as number) ?? 0;
    // §FurnaceTileEntity.cpp:87 — `litDuration = getBurnDuration(items[SLOT_FUEL]);`
    this.litDuration = this.getBurnDuration(this.items[SLOT_FUEL]);
  }

  /** §FurnaceTileEntity.cpp:89-106 — `bool save(CompoundTag* base);` */
  save(tag: Record<string, unknown>): boolean {
    if (!super.save(tag)) return false;
    tag.BurnTime = this.litTime;
    tag.CookTime = this.tickCount;
    // §FurnaceTileEntity.cpp:96-104 — save items as "Items" list
    const items: Array<Record<string, unknown>> = [];
    for (let i = 0; i < FURNACE_NUM_SLOTS; i++) {
      const item = this.items[i];
      if (item) {
        items.push({ Slot: i, id: item.id, count: item.count, auxValue: item.auxValue });
      }
    }
    tag.Items = items;
    return true;
  }

  /** §FurnaceTileEntity.cpp:113 — `int getBurnProgress(int max);` */
  getBurnProgress(max: number): number {
    return (this.tickCount * max) / FURNACE_BURN_INTERVAL;
  }

  /** §FurnaceTileEntity.cpp:117 — `int getLitProgress(int max);` */
  getLitProgress(max: number): number {
    if (this.litDuration === 0) this.litDuration = FURNACE_BURN_INTERVAL;
    return (this.litTime * max) / this.litDuration;
  }

  /** §FurnaceTileEntity.cpp:122 — `bool isLit();` */
  isLit(): boolean { return this.litTime > 0; }

  /** §FurnaceTileEntity.cpp:124 — `bool isSlotEmpty(int slot);` */
  isSlotEmpty(slot: number): boolean { return this.items[slot] === null; }

  /**
   * §FurnaceTileEntity.cpp:130-175 — `void tick()` — the main furnace tick.
   * Decrements litTime, checks if fuel should be consumed, advances cook timer,
   * calls burn() when cook timer reaches BURN_INTERVAL.
   */
  tick(): void {
    const wasLit = this.litTime > 0;
    let changed = false;

    // §FurnaceTileEntity.cpp:136 — `if (litTime > 0) --litTime;`
    if (this.litTime > 0) this.litTime--;

    // §FurnaceTileEntity.cpp:141 — `if (!level->isClientSide)`
    // Browser port: always server-side (single player)
    if (this.litTime === 0 && this.canBurn()) {
      // §FurnaceTileEntity.cpp:142 — consume fuel
      this.litDuration = this.litTime = this.getBurnDuration(this.items[SLOT_FUEL]);
      if (this.litTime > 0) {
        changed = true;
        // §FurnaceTileEntity.cpp:145 — consume fuel item
        const fuel = this.items[SLOT_FUEL];
        if (fuel) {
          const newCount = fuel.count - 1; if (newCount <= 0) { this.items[SLOT_FUEL] = null; } else { this.items[SLOT_FUEL] = { ...fuel, count: newCount }; }
        }
      }
    }

    // §FurnaceTileEntity.cpp:153 — `if (isLit() && canBurn())`
    if (this.isLit() && this.canBurn()) {
      // §FurnaceTileEntity.cpp:154 — `if (++tickCount == BURN_INTERVAL)`
      if (++this.tickCount === FURNACE_BURN_INTERVAL) {
        this.tickCount = 0;
        this.burn();
        changed = true;
      }
    } else {
      // §FurnaceTileEntity.cpp:160 — `tickCount = 0;`
      this.tickCount = 0;
    }

    // §FurnaceTileEntity.cpp:163 — lit state changed → update block
    if (wasLit !== (this.litTime > 0)) {
      changed = true;
      // §FurnaceTile.cpp — setLit(litTime > 0, level, x, y, z)
      // Browser adapter: world.setBlock(x, y, z, litTime > 0 ? 62 : 61)
    }

    if (changed) this.setChanged();
    else if (!wasLit) this._finished = true;
  }

  /** §FurnaceTileEntity.h:58 — `bool isFinished();` */
  isFinished(): boolean { return this._canBeFinished && this._finished; }

  /**
   * §FurnaceTileEntity.cpp:177-186 — `void burn()` — smelt one item.
   * Consumes ingredient, produces result.
   */
  burn(): void {
    if (!this.canBurn()) return;
    const ingredient = this.items[SLOT_INGREDIENT];
    if (!ingredient) return;

    // §FurnaceTileEntity.cpp:181 — get result from FurnaceRecipes
    // Browser: use window.VoxelCraftFurnaceRecipes if available
    let resultKey: string | null = null;
    if (typeof window !== 'undefined' && window.VoxelCraftFurnaceRecipes) {
      const result = window.VoxelCraftFurnaceRecipes.getInstance().getResult(ingredient.id);
      if (result) resultKey = result.id;
    }

    if (!resultKey) return;

    // §FurnaceTileEntity.cpp:182-183 — place result in output slot
    const resultSlot = this.items[SLOT_RESULT];
    if (!resultSlot) {
      this.items[SLOT_RESULT] = { id: resultKey, count: 1, maxStackSize: 64 };
    } else if (resultSlot.id === resultKey) {
      this.items[SLOT_RESULT] = { ...resultSlot, count: resultSlot.count + 1 };
    }

    // §FurnaceTileEntity.cpp:185 — consume ingredient
    const newIngCount = ingredient.count - 1; if (newIngCount <= 0) { this.items[SLOT_INGREDIENT] = null; } else { this.items[SLOT_INGREDIENT] = { ...ingredient, count: newIngCount }; }

    this.setChanged();
  }

  /**
   * §FurnaceTileEntity.cpp:188-200 — `bool canBurn()` — check if smelting is possible.
   */
  canBurn(): boolean {
    const ingredient = this.items[SLOT_INGREDIENT];
    if (!ingredient) return false;

    // §FurnaceTileEntity.cpp:190 — get result from FurnaceRecipes
    let resultKey: string | null = null;
    if (typeof window !== 'undefined' && window.VoxelCraftFurnaceRecipes) {
      const result = window.VoxelCraftFurnaceRecipes.getInstance().getResult(ingredient.id);
      if (result) resultKey = result.id;
    }
    if (!resultKey) return false; // §FurnaceTileEntity.cpp:191

    const resultSlot = this.items[SLOT_RESULT];
    if (!resultSlot) return true; // §FurnaceTileEntity.cpp:192
    if (resultSlot.id !== resultKey) return false; // §FurnaceTileEntity.cpp:193
    if (resultSlot.count < this.getMaxStackSize()) return true; // §FurnaceTileEntity.cpp:194
    return false;
  }

  /**
   * §FurnaceTileEntity.cpp:202-216 — `static int getBurnDuration(const ItemInstance&)`.
   * Returns burn ticks for a fuel item.
   */
  getBurnDuration(item: ItemStack | null): number {
    if (!item) return 0;
    const key = item.id;
    // §FurnaceTileEntity.cpp:209 — wood material: BURN_INTERVAL * 3/2 = 300 ticks
    if (key.includes('planks') || key.includes('log') || key.includes('wood') ||
        key.includes('oak_log') || key.includes('oak_planks')) return FURNACE_BURN_INTERVAL * 3 / 2;
    // §FurnaceTileEntity.cpp:210 — stick: BURN_INTERVAL / 2 = 100 ticks
    if (key === 'stick') return FURNACE_BURN_INTERVAL / 2;
    // §FurnaceTileEntity.cpp:211 — coal: BURN_INTERVAL * 8 = 1600 ticks
    if (key === 'coal') return FURNACE_BURN_INTERVAL * 8;
    return 0;
  }

  /** §FurnaceTileEntity.cpp:218-220 — `static bool isFuel(const ItemInstance&)` */
  static isFuel(item: ItemStack | null): boolean {
    const temp = new FurnaceTileEntity();
    return temp.getBurnDuration(item) > 0;
  }
}
