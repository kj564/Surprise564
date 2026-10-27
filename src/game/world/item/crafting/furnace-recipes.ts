// §MCPE 2013 FurnaceRecipes — 1:1 port from rujukan C++ source.
// Rujukan: FurnaceRecipes.h + FurnaceRecipes.cpp
//
// Singleton registry of smelting recipes (input itemId → output ItemStack).

import type { ItemStack } from '../../inventory/inventory';

/** §FurnaceRecipes.h:24-26 — `typedef std::map<int, ItemInstance> Map;` */
export type FurnaceRecipeMap = Map<string, ItemStack>;

/**
 * §FurnaceRecipes.h:18-32 — FurnaceRecipes singleton.
 * Maps input item IDs to smelted output ItemStacks.
 */
export class FurnaceRecipes {
  private static instance: FurnaceRecipes | null = null;

  /** §FurnaceRecipes.h:31 — `Map recipes;` */
  private recipes: FurnaceRecipeMap = new Map();

  constructor() {
    this.registerRecipes();
  }

  /** §FurnaceRecipes.h:22 — `static const FurnaceRecipes* getInstance();` */
  static getInstance(): FurnaceRecipes {
    if (!FurnaceRecipes.instance) {
      FurnaceRecipes.instance = new FurnaceRecipes();
    }
    return FurnaceRecipes.instance;
  }

  /** §FurnaceRecipes.h:24 — `static void teardownFurnaceRecipes();` */
  static teardown(): void {
    FurnaceRecipes.instance = null;
  }

  /** §FurnaceRecipes.cpp:40 — `bool isFurnaceItem(int itemId) const` */
  isFurnaceItem(itemId: string): boolean {
    return this.recipes.has(itemId);
  }

  /** §FurnaceRecipes.cpp:44 — `ItemInstance getResult(int itemId) const` */
  getResult(itemId: string): ItemStack | null {
    return this.recipes.get(itemId) ?? null;
  }

  /** §FurnaceRecipes.cpp:48 — `const Map& getRecipes() const` */
  getRecipes(): FurnaceRecipeMap {
    return this.recipes;
  }

  /** §FurnaceRecipes.cpp:32 — `void addFurnaceRecipe(int itemId, const ItemInstance& result)` */
  private addRecipe(itemId: string, result: ItemStack): void {
    this.recipes.set(itemId, result);
  }

  /**
   * §FurnaceRecipes.cpp:52-66 — Constructor registers all furnace recipes.
   * Each line is a direct 1:1 port.
   */
  private registerRecipes(): void {
    // §FurnaceRecipes.cpp:53 — `addFurnaceRecipe(Tile::ironOre->id, ItemInstance(Item::ironIngot));`
    this.addRecipe('ironOre', { itemKey: 'ironIngot', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:54 — `addFurnaceRecipe(Tile::goldOre->id, ItemInstance(Item::goldIngot));`
    this.addRecipe('goldOre', { itemKey: 'goldIngot', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:55 — `addFurnaceRecipe(Tile::emeraldOre->id, ItemInstance(Item::emerald));`
    this.addRecipe('emeraldOre', { itemKey: 'emerald', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:56 — `addFurnaceRecipe(Tile::sand->id, ItemInstance(Tile::glass));`
    this.addRecipe('sand', { itemKey: 'glass', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:57 — `addFurnaceRecipe(Item::porkChop_raw->id, ItemInstance(Item::porkChop_cooked));`
    this.addRecipe('porkChop_raw', { itemKey: 'porkChop_cooked', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:58 — `addFurnaceRecipe(Item::beef_raw->id, ItemInstance(Item::beef_cooked));`
    this.addRecipe('beef_raw', { itemKey: 'beef_cooked', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:59 — `addFurnaceRecipe(Item::chicken_raw->id, ItemInstance(Item::chicken_cooked));`
    this.addRecipe('chicken_raw', { itemKey: 'chicken_cooked', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:61 — `addFurnaceRecipe(Tile::stoneBrick->id, ItemInstance(Tile::rock));`
    this.addRecipe('stoneBrick', { itemKey: 'rock', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:62 — `addFurnaceRecipe(Item::clay->id, ItemInstance(Item::brick));`
    this.addRecipe('clay', { itemKey: 'brick', count: 1, maxStackSize: 64 });
    // §FurnaceRecipes.cpp:63 — `addFurnaceRecipe(Tile::cactus->id, ItemInstance(Item::dye_powder, 1, DyePowderItem::GREEN));`
    this.addRecipe('cactus', { itemKey: 'dye_powder', count: 1, maxStackSize: 64, auxValue: 2 }); // GREEN=2
    // §FurnaceRecipes.cpp:64 — `addFurnaceRecipe(Tile::mushroom2->id, ItemInstance(Item::dye_powder, 1, DyePowderItem::RED));`
    this.addRecipe('mushroom2', { itemKey: 'dye_powder', count: 1, maxStackSize: 64, auxValue: 1 }); // RED=1
    // §FurnaceRecipes.cpp:65 — `addFurnaceRecipe(Tile::treeTrunk->id, ItemInstance(Item::coal, 1, CoalItem::CHAR_COAL));`
    this.addRecipe('treeTrunk', { itemKey: 'coal', count: 1, maxStackSize: 64, auxValue: 1 }); // CHAR_COAL=1
    // §FurnaceRecipes.cpp:66 — `addFurnaceRecipe(Tile::netherrack->id, ItemInstance(Item::netherbrick));`
    this.addRecipe('netherrack', { itemKey: 'netherbrick', count: 1, maxStackSize: 64 });
  }
}
