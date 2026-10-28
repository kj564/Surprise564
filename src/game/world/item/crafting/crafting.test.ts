// Crafting system tests — verifies ported recipes against C++ source citations.
import { describe, it, expect } from 'bun:test';
import { Recipes, itemStack, def, def2, def3, shape, shape2, shape3 } from './recipes';
import { FurnaceRecipes } from './furnace-recipes';
import { ShapedRecipe } from './shaped-recipe';
import { ShapelessRecipe } from './shapeless-recipe';
import type { CraftingGrid } from './recipe';

// Helper: build a 3×3 grid from item keys (null = empty)
function makeGrid(items: (string | null)[][]): CraftingGrid {
  return {
    width: 3,
    height: 3,
    getItem(x: number, y: number) {
      const row = items[y];
      if (!row || x >= row.length) return null;
      const k = row[x];
      return k ? { id: k, count: 1, maxStackSize: 64 } : null;
    },
  };
}

describe('Recipes singleton (§Recipes.h)', () => {
  it('getInstance returns same instance', () => {
    const a = Recipes.getInstance();
    const b = Recipes.getInstance();
    expect(a).toBe(b);
  });

  it('registers recipes from all categories (§Recipes.cpp:12-18)', () => {
    const r = Recipes.getInstance().getRecipes();
    expect(r.length).toBeGreaterThan(20);
  });

  it('getRecipeFor finds TNT recipe (§Recipes.cpp:94-98)', () => {
    const r = Recipes.getInstance().getRecipeFor(itemStack('tnt'));
    expect(r).not.toBeNull();
    expect(r!.getResultItem().id).toBe('tnt');
  });
});

describe('ShapedRecipe (§ShapedRecipe.h)', () => {
  it('matches TNT pattern: X#X / #X# / X#X (§Recipes.cpp:94-98)', () => {
    const tnt = new ShapedRecipe(3, 3, [
      itemStack('sulphur'), itemStack('sand'), itemStack('sulphur'),
      itemStack('sand'), itemStack('sulphur'), itemStack('sand'),
      itemStack('sulphur'), itemStack('sand'), itemStack('sulphur'),
    ], itemStack('tnt'));
    const grid = makeGrid([
      ['sulphur', 'sand', 'sulphur'],
      ['sand', 'sulphur', 'sand'],
      ['sulphur', 'sand', 'sulphur'],
    ]);
    expect(tnt.matches(grid)).toBe(true);
  });

  it('does not match wrong pattern', () => {
    const tnt = new ShapedRecipe(3, 3, [
      itemStack('sulphur'), itemStack('sand'), itemStack('sulphur'),
      itemStack('sand'), itemStack('sulphur'), itemStack('sand'),
      itemStack('sulphur'), itemStack('sand'), itemStack('sulphur'),
    ], itemStack('tnt'));
    const grid = makeGrid([
      ['sulphur', 'sand', 'sulphur'],
      ['sand', null, 'sand'],
      ['sulphur', 'sand', 'sulphur'],
    ]);
    expect(tnt.matches(grid)).toBe(false);
  });

  it('getCraftingSize returns SIZE_3X3 for 3-wide (§ShapedRecipe.h:102-105)', () => {
    const r = new ShapedRecipe(3, 2, [
      itemStack('a'), itemStack('b'), itemStack('c'),
      itemStack('d'), itemStack('e'), itemStack('f'),
    ], itemStack('result'));
    expect(r.getCraftingSize()).toBe(1); // SIZE_3X3
  });

  it('getCraftingSize returns SIZE_2X2 for 2-wide', () => {
    const r = new ShapedRecipe(2, 2, [
      itemStack('a'), itemStack('b'),
      itemStack('c'), itemStack('d'),
    ], itemStack('result'));
    expect(r.getCraftingSize()).toBe(0); // SIZE_2X2
  });
});

describe('ShapelessRecipe (§ShapelessRecipe.h)', () => {
  it('matches when all ingredients present (§ShapelessRecipe.h:33-54)', () => {
    const r = new ShapelessRecipe(itemStack('mushroomStew'), [
      itemStack('mushroom1'), itemStack('mushroom2'), itemStack('bowl'),
    ]);
    const grid = makeGrid([
      ['mushroom1', 'mushroom2', null],
      ['bowl', null, null],
      [null, null, null],
    ]);
    expect(r.matches(grid)).toBe(true);
  });

  it('does not match when ingredient missing', () => {
    const r = new ShapelessRecipe(itemStack('mushroomStew'), [
      itemStack('mushroom1'), itemStack('mushroom2'), itemStack('bowl'),
    ]);
    const grid = makeGrid([
      ['mushroom1', null, null],
      ['bowl', null, null],
      [null, null, null],
    ]);
    expect(r.matches(grid)).toBe(false);
  });
});

describe('FurnaceRecipes (§FurnaceRecipes.cpp)', () => {
  it('getInstance returns same instance', () => {
    expect(FurnaceRecipes.getInstance()).toBe(FurnaceRecipes.getInstance());
  });

  it('ironOre → ironIngot (§FurnaceRecipes.cpp:53)', () => {
    const f = FurnaceRecipes.getInstance();
    expect(f.isFurnaceItem('ironOre')).toBe(true);
    expect(f.getResult('ironOre')?.id).toBe('ironIngot');
  });

  it('sand → glass (§FurnaceRecipes.cpp:56)', () => {
    expect(FurnaceRecipes.getInstance().getResult('sand')?.id).toBe('glass');
  });

  it('chicken_raw → chicken_cooked (§FurnaceRecipes.cpp:59)', () => {
    expect(FurnaceRecipes.getInstance().getResult('chicken_raw')?.id).toBe('chicken_cooked');
  });

  it('non-furnace item returns null', () => {
    expect(FurnaceRecipes.getInstance().getResult('dirt')).toBeNull();
  });

  it('registers 13 furnace recipes (§FurnaceRecipes.cpp:53-66)', () => {
    expect(FurnaceRecipes.getInstance().getRecipes().size).toBe(13);
  });
});
