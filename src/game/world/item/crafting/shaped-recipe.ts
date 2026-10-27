// §MCPE 2013 ShapedRecipe — 1:1 port from rujukan C++ source.
// Rujukan: ShapedRecipe.h
//
// A shaped recipe has a fixed width × height pattern. The pattern can be
// placed anywhere in the 3×3 grid (with offset) and can be flipped horizontally.

import type { ItemStack } from '../../inventory/inventory';
import type { CraftingGrid } from './recipe';
import { Recipe, SIZE_2X2, SIZE_3X3, ANY_AUX_VALUE } from './recipe';

/** §ShapedRecipe.h:8-92 — ShapedRecipe with width × height pattern. */
export class ShapedRecipe extends Recipe {
  /** §ShapedRecipe.h:64 — `const int resultId;` */
  readonly resultId: string;

  private readonly width: number;
  private readonly height: number;
  private readonly recipeItems: ItemStack[];
  private readonly result: ItemStack;

  /**
   * §ShapedRecipe.h:11-20 — Constructor.
   * @param width  Pattern width (1-3)
   * @param height Pattern height (1-3)
   * @param recipeItems Array of width*height ItemStacks (null = empty slot)
   * @param result The crafted result
   */
  constructor(width: number, height: number, recipeItems: ItemStack[], result: ItemStack) {
    super();
    this.width = width;
    this.height = height;
    this.recipeItems = recipeItems;
    this.result = result;
    this.resultId = result.itemKey;

    // §ShapedRecipe.h:17-19 — `for (int i = 0; i < width * height; ++i)
    //   if (!recipeItems[i].isNull()) myItems.add(getIdForItemInstance(&recipeItems[i]));`
    for (const item of recipeItems) {
      this.myItems.add(item.itemKey);
    }
  }

  /** §ShapedRecipe.h:46-51 — `int getMaxCraftCount(ItemPack& fromItems)` */
  getMaxCraftCount(fromItems: import('./recipe').ItemPack): number {
    return fromItems.getMaxMultipliesOf(this.myItems);
  }

  /** §ShapedRecipe.h:53-56 — `ItemInstance getResultItem() const` */
  getResultItem(): ItemStack {
    return this.result;
  }

  /** §ShapedRecipe.h:58-70 — `bool matches(CraftingContainer* craftSlots)`
   *  Tries all 3×3 offsets + xFlip. */
  matches(grid: CraftingGrid): boolean {
    for (let xOffs = 0; xOffs <= (3 - this.width); xOffs++) {
      for (let yOffs = 0; yOffs <= (3 - this.height); yOffs++) {
        // §ShapedRecipe.h:61 — `if (matches(craftSlots, xOffs, yOffs, true)) return true;`
        if (this.matchesAt(grid, xOffs, yOffs, true)) return true;
        // §ShapedRecipe.h:62 — `if (matches(craftSlots, xOffs, yOffs, false)) return true;`
        if (this.matchesAt(grid, xOffs, yOffs, false)) return true;
      }
    }
    return false;
  }

  /** §ShapedRecipe.h:73-91 — `bool matches(CraftingContainer*, int xOffs, int yOffs, bool xFlip)` */
  private matchesAt(grid: CraftingGrid, xOffs: number, yOffs: number, xFlip: boolean): boolean {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const xs = x - xOffs;
        const ys = y - yOffs;
        let expected: ItemStack | null = null;
        if (xs >= 0 && ys >= 0 && xs < this.width && ys < this.height) {
          const idx = xFlip
            ? (this.width - xs - 1) + ys * this.width  // §ShapedRecipe.h:84
            : xs + ys * this.width;                     // §ShapedRecipe.h:85
          expected = this.recipeItems[idx] ?? null;
        }
        const item = grid.getItem(x, y);
        if (!item && !expected) continue;
        if ((!item) !== (!expected)) return false;  // XOR
        if (expected && item && expected.itemKey !== item.itemKey) return false;
        // §ShapedRecipe.h:89 — `if (expected.getAuxValue() != ANY_AUX_VALUE && ...)`
        if (expected && item && expected.auxValue !== ANY_AUX_VALUE && expected.auxValue !== undefined) {
          if (expected.auxValue !== item.auxValue) return false;
        }
      }
    }
    return true;
  }

  /** §ShapedRecipe.h:93-96 — `ItemInstance assemble(CraftingContainer*)` */
  assemble(_grid: CraftingGrid): ItemStack {
    return this.result;
  }

  /** §ShapedRecipe.h:98-100 — `int size()` */
  size(): number {
    return this.width * this.height;
  }

  /** §ShapedRecipe.h:102-105 — `int getCraftingSize()` */
  getCraftingSize(): number {
    return (this.width <= 2 && this.height <= 2) ? SIZE_2X2 : SIZE_3X3;
  }
}
