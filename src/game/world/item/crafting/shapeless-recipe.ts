// §MCPE 2013 ShapelessRecipe — 1:1 port from rujukan C++ source.
// Rujukan: ShapelessRecipe.h
//
// A shapeless recipe matches if all ingredients are present in the grid,
// regardless of position.

import type { ItemStack } from '../../inventory/inventory';
import type { CraftingGrid, ItemPack } from './recipe';
import { Recipe, SIZE_2X2, SIZE_3X3, ANY_AUX_VALUE } from './recipe';

/** §ShapelessRecipe.h:9-58 — ShapelessRecipe with a list of ingredients. */
export class ShapelessRecipe extends Recipe {
  private readonly result: ItemStack;
  private readonly ingredients: ItemStack[];

  /**
   * §ShapelessRecipe.h:12-19 — Constructor.
   * @param result The crafted result
   * @param ingredients Array of required ingredient ItemStacks
   */
  constructor(result: ItemStack, ingredients: ItemStack[]) {
    super();
    this.result = result;
    this.ingredients = ingredients;

    // §ShapelessRecipe.h:16-18 — `for (unsigned int i = 0; i < ingredients.size(); ++i)
    //   if (!ingredients[i].isNull()) myItems.add(getIdForItemInstance(&ingredients[i]));`
    for (const item of ingredients) {
      this.myItems.add(item.id);
    }
  }

  /** §ShapelessRecipe.h:21-24 — `ItemInstance getResultItem() const` */
  getResultItem(): ItemStack {
    return this.result;
  }

  /** §ShapelessRecipe.h:26-31 — `int getMaxCraftCount(ItemPack& fromItems)` */
  getMaxCraftCount(fromItems: ItemPack): number {
    return fromItems.getMaxMultipliesOf(this.myItems);
  }

  /** §ShapelessRecipe.h:33-54 — `bool matches(CraftingContainer* craftSlots)`
   *  Iterates grid, matches each item against remaining ingredients. */
  matches(grid: CraftingGrid): boolean {
    // §ShapelessRecipe.h:35 — `Ingredients tempList = ingredients;`
    const tempList = [...this.ingredients];

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const item = grid.getItem(x, y);
        if (!item) continue;

        let found = false;
        // §ShapelessRecipe.h:43-48 — find matching ingredient in tempList
        for (let i = 0; i < tempList.length; i++) {
          const ingredient = tempList[i];
          if (!ingredient) continue;
          // §ShapelessRecipe.h:44 — `if (item->id == ingredient.id && ...)`
          if (item.id === ingredient.id) {
            // §ShapelessRecipe.h:44 — `ingredient.getAuxValue() == Recipe::ANY_AUX_VALUE || ...`
            if (ingredient.auxValue === ANY_AUX_VALUE || ingredient.auxValue === undefined ||
                ingredient.auxValue === item.auxValue) {
              found = true;
              tempList.splice(i, 1);  // §ShapelessRecipe.h:50 — `tempList.erase(it);`
              break;
            }
          }
        }
        // §ShapelessRecipe.h:52 — `if (!found) return false;`
        if (!found) return false;
      }
    }

    // §ShapelessRecipe.h:56 — `return tempList.empty();`
    return tempList.length === 0;
  }

  /** §ShapelessRecipe.h:58-60 — `ItemInstance assemble(CraftingContainer*)` */
  assemble(_grid: CraftingGrid): ItemStack {
    return this.result;
  }

  /** §ShapelessRecipe.h:62-64 — `int size()` */
  size(): number {
    return this.ingredients.length;
  }

  /** §ShapelessRecipe.h:66-68 — `int getCraftingSize()` */
  getCraftingSize(): number {
    return (this.ingredients.length > 4) ? SIZE_3X3 : SIZE_2X2;
  }
}
