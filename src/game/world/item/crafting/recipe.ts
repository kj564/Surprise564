// §MCPE 2013 Crafting — 1:1 port from rujukan C++ source.
// Rujukan: Recipe.h, RecipeCategory.h, ItemInstance.h
//
// Every constant/behavior has a §File:line citation to the C++ source.

import type { ItemStack } from '../../inventory/inventory';

// === §RecipeCategory.h:1-9 — RecipeCategory enum ===
/** §RecipeCategory.h:3 — `RCAT_TOOL` */
export const RCAT_TOOL = 0;
/** §RecipeCategory.h:4 — `RCAT_WEAPON` */
export const RCAT_WEAPON = 1;
/** §RecipeCategory.h:5 — `RCAT_ARMOR` */
export const RCAT_ARMOR = 2;
/** §RecipeCategory.h:6 — `RCAT_FOOD` */
export const RCAT_FOOD = 3;
/** §RecipeCategory.h:7 — `RCAT_OTHER` */
export const RCAT_OTHER = 4;

// === §Recipe.h:8-10 — Recipe size constants ===
/** §Recipe.h:8 — `static const int SIZE_2X2 = 0;` */
export const SIZE_2X2 = 0;
/** §Recipe.h:9 — `static const int SIZE_3X3 = 1;` */
export const SIZE_3X3 = 1;
/** §Recipe.h:11 — `static const int ANY_AUX_VALUE = -1;` */
export const ANY_AUX_VALUE = -1;

// === §Recipe.h:14-16 — CraftingGrid (called CraftingContainer in C++) ===
/** A 3×3 crafting grid. §CraftingContainer.h — getItem(x, y) returns ItemInstance*. */
export interface CraftingGrid {
  /** §CraftingContainer.h — `ItemInstance* getItem(int x, int y);` */
  getItem(x: number, y: number): ItemStack | null;
  readonly width: number;
  readonly height: number;
}

// === §Recipe.h:19-30 — ItemPack ===
/**
 * §Recipe.h:19-38 — ItemPack: a multiset of item IDs → count.
 * Used to compute how many times a recipe can be crafted from given items.
 */
export class ItemPack {
  private items = new Map<string, number>();

  /** §Recipe.h:22 — `void add(int id, int count = 1);` */
  add(id: string, count = 1): void {
    this.items.set(id, (this.items.get(id) ?? 0) + count);
  }

  /** §Recipe.h:23 — `int getCount(int id) const;` */
  getCount(id: string): number {
    return this.items.get(id) ?? 0;
  }

  /** §Recipe.h:25 — `int getMaxMultipliesOf(ItemPack& v) const;`
   *  Returns the max number of times `v`'s items can be fully consumed
   *  from this pack. */
  getMaxMultipliesOf(other: ItemPack): number {
    let max = Infinity;
    for (const [id, count] of other.items) {
      const have = this.items.get(id) ?? 0;
      if (count === 0) continue;
      max = Math.min(max, Math.floor(have / count));
      if (max === 0) return 0;
    }
    return max === Infinity ? 0 : max;
  }

  /** §Recipe.h:26 — `vector<ItemInstance> getItemInstances() const;` */
  getItemInstances(): ItemStack[] {
    const result: ItemStack[] = [];
    for (const [id, count] of this.items) {
      result.push({ id: id, count, maxStackSize: 64 });
    }
    return result;
  }
}

// === §Recipe.h:33-52 — Recipe abstract base ===
/**
 * §Recipe.h:33-52 — Abstract base for all crafting recipes.
 * Subclasses: ShapedRecipe, ShapelessRecipe.
 */
export abstract class Recipe {
  protected myItems = new ItemPack();

  /** §Recipe.h:37 — `virtual bool matches(CraftingContainer*) = 0;` */
  abstract matches(grid: CraftingGrid): boolean;

  /** §Recipe.h:38 — `virtual const ItemPack& getItemPack()` */
  getItemPack(): ItemPack {
    return this.myItems;
  }

  /** §Recipe.h:39 — `virtual int getMaxCraftCount(ItemPack& fromItems) = 0;` */
  abstract getMaxCraftCount(fromItems: ItemPack): number;

  /** §Recipe.h:41 — `virtual int size() = 0;` — total ingredient count. */
  abstract size(): number;

  /** §Recipe.h:43 — `virtual ItemInstance assemble(CraftingContainer*) = 0;` */
  abstract assemble(grid: CraftingGrid): ItemStack;

  /** §Recipe.h:44 — `virtual ItemInstance getResultItem() const = 0;` */
  abstract getResultItem(): ItemStack;

  /** §Recipe.h:48 — `virtual int getCraftingSize() = 0;` — SIZE_2X2 or SIZE_3X3. */
  abstract getCraftingSize(): number;
}

// === §Recipe.h:46-48 — isAnyAuxValue helper ===
/** §Recipe.h:46 — `static bool isAnyAuxValue(const ItemInstance* ii)` */
export function isAnyAuxValue(auxValue: number | undefined): boolean {
  return auxValue === ANY_AUX_VALUE;
}
