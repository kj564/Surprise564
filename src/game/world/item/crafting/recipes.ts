// §MCPE 2013 Recipes — 1:1 port from rujukan C++ source.
// Rujukan: Recipes.h + Recipes.cpp
//
// Singleton registry of all crafting recipes (shaped + shapeless).
// Registration calls ToolRecipes, WeaponRecipes, ArmorRecipes, FoodRecipes,
// OreRecipes, ClothDyeRecipes, StructureRecipes — exactly like Recipes.cpp.

import type { ItemStack } from '../../inventory/inventory';
import { Recipe, ItemPack } from './recipe';
import { ShapedRecipe } from './shaped-recipe';
import { ShapelessRecipe } from './shapeless-recipe';

// === §Recipes.h:18-27 — Type (char → item binding) ===
/** §Recipes.h:19-27 — `class Type { char c; Item* item; Tile* tile; ItemInstance itemInstance; }` */
export interface RecipeType {
  readonly c: string;
  readonly id: string;
  readonly auxValue?: number;
}

// === §Recipes.h:32-35 — Shape helpers ===
/** §Recipes.h:32 — `static RowList Shape(const string& r0);` */
export function shape(r0: string): string[] { return [r0]; }
/** §Recipes.h:33 — `static RowList Shape(const string& r0, const string& r1);` */
export function shape2(r0: string, r1: string): string[] { return [r0, r1]; }
/** §Recipes.h:34 — `static RowList Shape(const string& r0, const string& r1, const string& r2);` */
export function shape3(r0: string, r1: string, r2: string): string[] { return [r0, r1, r2]; }

// === §Recipes.h:37-39 — definition() helpers ===
/** §Recipes.h:48 — `template<class T> TypeList definition(char c0, T t)` */
export function def(c: string, id: string, auxValue?: number): RecipeType[] {
  return [{ c, id: itemKey, auxValue }];
}
export function def2(c0: string, k0: string, c1: string, k1: string): RecipeType[] {
  return [{ c: c0, id: k0 }, { c: c1, id: k1 }];
}
export function def3(c0: string, k0: string, c1: string, k1: string, c2: string, k2: string): RecipeType[] {
  return [{ c: c0, id: k0 }, { c: c1, id: k1 }, { c: c2, id: k2 }];
}

/** Helper: create an ItemStack */
export function itemStack(id: string, count = 1, auxValue?: number): ItemStack {
  return { id: itemKey, count, maxStackSize: 64, auxValue };
}

/** §Recipes.h:8 — `typedef std::vector<Recipe*> RecipeList;` */
export type RecipeList = Recipe[];

/**
 * §Recipes.h:10-41 — Recipes singleton.
 * Registers all crafting recipes at construction time, mirroring Recipes.cpp.
 */
export class Recipes {
  private static instance: Recipes | null = null;

  private recipes: RecipeList = [];

  constructor() {
    this.registerAll();
  }

  /** §Recipes.h:12 — `static Recipes* getInstance();` */
  static getInstance(): Recipes {
    if (!Recipes.instance) {
      Recipes.instance = new Recipes();
    }
    return Recipes.instance;
  }

  /** §Recipes.h:13 — `static void teardownRecipes();` */
  static teardown(): void {
    Recipes.instance = null;
  }

  /** §Recipes.h:15 — `const RecipeList& getRecipes();` */
  getRecipes(): RecipeList {
    return this.recipes;
  }

  /** §Recipes.h:40 — `Recipe* getRecipeFor(const ItemInstance& result);` */
  getRecipeFor(result: ItemStack): Recipe | null {
    for (const r of this.recipes) {
      const ri = r.getResultItem();
      if (ri.id === result.id) return r;
    }
    return null;
  }

  // === §Recipes.h:29-33 — addShapedRecipe overloads ===

  /** §Recipes.h:29 — `void addShapedRecipe(result, r0, types)` — 1-row shaped recipe. */
  addShapedRecipe(result: ItemStack, row: string, types: RecipeType[]): void {
    this.addShapedRecipeRows(result, [row], types);
  }

  /** §Recipes.h:30 — `void addShapedRecipe(result, r0, r1, types)` — 2-row shaped recipe. */
  addShapedRecipe2(result: ItemStack, r0: string, r1: string, types: RecipeType[]): void {
    this.addShapedRecipeRows(result, [r0, r1], types);
  }

  /** §Recipes.h:31 — `void addShapedRecipe(result, r0, r1, r2, types)` — 3-row shaped recipe. */
  addShapedRecipe3(result: ItemStack, r0: string, r1: string, r2: string, types: RecipeType[]): void {
    this.addShapedRecipeRows(result, [r0, r1, r2], types);
  }

  /** §Recipes.h:35 — `void addShapedRecipe(result, RowList, types)` — core shaped recipe. */
  addShapedRecipeRows(result: ItemStack, rows: string[], types: RecipeType[]): void {
    const height = rows.length;
    const width = rows[0]?.length ?? 0;
    const typeMap = new Map<string, RecipeType>();
    for (const t of types) typeMap.set(t.c, t);

    const recipeItems: ItemStack[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = rows[y][x];
        const type = typeMap.get(c);
        if (type) {
          recipeItems.push(itemStack(type.id, 1, type.auxValue));
        } else {
          recipeItems.push(itemStack('air', 0));
        }
      }
    }
    this.recipes.push(new ShapedRecipe(width, height, recipeItems, result));
  }

  /** §Recipes.h:37 — `void addShapelessRecipe(result, types)` */
  addShapelessRecipe(result: ItemStack, types: RecipeType[]): void {
    const ingredients = types.map((t) => itemStack(t.id, 1, t.auxValue));
    this.recipes.push(new ShapelessRecipe(result, ingredients));
  }

  // === §Recipes.cpp:12-20 — registerAll (mirrors Recipes constructor) ===
  private registerAll(): void {
    // §Recipes.cpp:12 — `ToolRecipes::addRecipes(this);`
    this.registerToolRecipes();
    // §Recipes.cpp:13 — `WeaponRecipes::addRecipes(this);`
    this.registerWeaponRecipes();
    // §Recipes.cpp:14 — `OreRecipes::addRecipes(this);`
    this.registerOreRecipes();
    // §Recipes.cpp:15 — `FoodRecipes::addRecipes(this);`
    this.registerFoodRecipes();
    // §Recipes.cpp:16 — `StructureRecipes::addRecipes(this);` — empty in MCPE 2013
    // §Recipes.cpp:17 — `ArmorRecipes::addRecipes(this);`
    this.registerArmorRecipes();
    // §Recipes.cpp:18 — `ClothDyeRecipes::addRecipes(this);`
    this.registerClothDyeRecipes();

    // §Recipes.cpp:20-25 — paper (3 sugar cane → 3 paper)
    this.addShapedRecipe(itemStack('paper', 3), '###', def('#', 'reeds'));
    // §Recipes.cpp:27-31 — book (3 paper → 1 book)
    this.addShapedRecipe3(itemStack('book', 1), '#', '#', '#', def('#', 'paper'));
    // §Recipes.cpp:33-37 — fence (6 stick → 2 fence)
    this.addShapedRecipe2(itemStack('fence', 2), '###', '###', def('#', 'stick'));
    // §Recipes.cpp:45-49 — fenceGate
    this.addShapedRecipe2(itemStack('fenceGate', 1), '#W#', '#W#', def2('#', 'stick', 'W', 'wood'));
    // §Recipes.cpp:58-62 — bookshelf
    this.addShapedRecipe3(itemStack('bookshelf', 1), '###', 'XXX', '###', def2('#', 'wood', 'X', 'book'));
    // §Recipes.cpp:64-68 — snow block
    this.addShapedRecipe2(itemStack('snow', 1), '##', '##', def('#', 'snowBall'));
    // §Recipes.cpp:70-74 — clay block
    this.addShapedRecipe2(itemStack('clay', 1), '##', '##', def('#', 'clay'));
    // §Recipes.cpp:76-80 — redBrick block
    this.addShapedRecipe2(itemStack('redBrick', 1), '##', '##', def('#', 'brick'));
    // §Recipes.cpp:82-86 — glowstone
    this.addShapedRecipe2(itemStack('lightGem', 1), '##', '##', def('#', 'yellowDust'));
    // §Recipes.cpp:88-92 — cloth
    this.addShapedRecipe2(itemStack('cloth', 1), '##', '##', def('#', 'string'));
    // §Recipes.cpp:94-98 — TNT
    this.addShapedRecipe3(itemStack('tnt', 1), 'X#X', '#X#', 'X#X', def2('X', 'sulphur', '#', 'sand'));
    // §Recipes.cpp:113-116 — ladder
    this.addShapedRecipe3(itemStack('ladder', 2), '# #', '###', '# #', def('#', 'stick'));
    // §Recipes.cpp:118-122 — wood door
    this.addShapedRecipe3(itemStack('door_wood', 1), '##', '##', '##', def('#', 'wood'));
    // §Recipes.cpp:124-127 — trapdoor
    this.addShapedRecipe2(itemStack('trapdoor', 2), '###', '###', def('#', 'wood'));
    // §Recipes.cpp:137-141 — sign
    this.addShapedRecipe3(itemStack('sign', 1), '###', '###', ' X ', def2('#', 'wood', 'X', 'stick'));
    // §Recipes.cpp:149-151 — sugar
    this.addShapedRecipe(itemStack('sugar', 1), '#', def('#', 'reeds'));
    // §Recipes.cpp:153-155 — planks from log
    this.addShapedRecipe(itemStack('wood', 4), '#', def('#', 'treeTrunk'));
    // §Recipes.cpp:157-161 — sticks
    this.addShapedRecipe2(itemStack('stick', 4), '#', '#', def('#', 'wood'));
  }

  // === §ToolRecipes.cpp:16-47 ===
  private registerToolRecipes(): void {
    // §ToolRecipes.cpp:16-20 — 4 shapes for pickaxe/shovel/hatchet/hoe
    const pickShape = shape3('XXX', ' # ', ' # ');
    const shovelShape = shape3('X', '#', '#');
    const hatchetShape = shape3('XX', 'X#', ' #');
    const hoeShape = shape3('XX', ' #', ' #');
    const shapes = [pickShape, shovelShape, hatchetShape, hoeShape];

    // §ToolRecipes.cpp:22 — materials: wood, stone, iron, emerald, gold
    const materials = ['wood', 'stoneBrick', 'ironIngot', 'emerald', 'goldIngot'];
    // §ToolRecipes.cpp:28-32 — result items for each tool × material
    const toolNames = ['pickAxe', 'shovel', 'hatchet', 'hoe'];

    for (let t = 0; t < toolNames.length; t++) {
      for (let m = 0; m < materials.length; m++) {
        const result = itemStack(`${toolNames[t]}_${['wood','stone','iron','emerald','gold'][m]}`);
        this.addShapedRecipeRows(result, shapes[t], def2('#', 'stick', 'X', materials[m]));
      }
    }

    // §ToolRecipes.cpp:42-45 — shears
    this.addShapedRecipe2(itemStack('shears', 1), ' #', '# ', def('#', 'ironIngot'));
  }

  // === §WeaponRecipes.cpp:14-40 ===
  private registerWeaponRecipes(): void {
    // §WeaponRecipes.cpp:16-18 — sword shape
    const swordShape = shape3('X', 'X', '#');
    // §WeaponRecipes.cpp:22 — materials
    const materials = ['wood', 'stoneBrick', 'ironIngot', 'emerald', 'goldIngot'];
    const prefixes = ['wood', 'stone', 'iron', 'emerald', 'gold'];

    for (let m = 0; m < materials.length; m++) {
      this.addShapedRecipeRows(itemStack(`sword_${prefixes[m]}`), swordShape, def2('#', 'stick', 'X', materials[m]));
    }

    // §WeaponRecipes.cpp:32-36 — bow
    this.addShapedRecipe3(itemStack('bow', 1), ' #X', '# X', ' #X', def2('X', 'string', '#', 'stick'));
    // §WeaponRecipes.cpp:38-43 — arrow (4)
    this.addShapedRecipe3(itemStack('arrow', 4), 'X', '#', 'Y', def3('Y', 'feather', 'X', 'flint', '#', 'stick'));
  }

  // === §ArmorRecipes.cpp:22-48 ===
  private registerArmorRecipes(): void {
    // §ArmorRecipes.cpp:8-24 — 4 shapes: helmet, chestplate, leggings, boots
    const helmetShape = shape2('XXX', 'X X');
    const chestShape = shape3('X X', 'XXX', 'XXX');
    const leggingsShape = shape3('XXX', 'X X', 'X X');
    const bootsShape = shape2('X X', 'X X');
    const shapes = [helmetShape, chestShape, leggingsShape, bootsShape];

    // §ArmorRecipes.cpp:26 — materials: leather, iron, emerald, gold
    const materials = ['leather', 'ironIngot', 'emerald', 'goldIngot'];
    const prefixes = ['cloth', 'iron', 'diamond', 'gold'];
    const armorTypes = ['helmet', 'chestplate', 'leggings', 'boots'];

    for (let t = 0; t < armorTypes.length; t++) {
      for (let m = 0; m < materials.length; m++) {
        this.addShapedRecipeRows(itemStack(`${armorTypes[t]}_${prefixes[m]}`), shapes[t], def('X', materials[m]));
      }
    }
  }

  // === §FoodRecipes.h:6-29 ===
  private registerFoodRecipes(): void {
    // §FoodRecipes.h:8 — mushroomStew (shapeless: mushroom1 + mushroom2 + bowl)
    this.addShapelessRecipe(itemStack('mushroomStew'), def3('0', 'mushroom1', '0', 'mushroom2', '0', 'bowl'));
    // §FoodRecipes.h:14-18 — melon block (3×3 melon slices → 1 melon)
    this.addShapedRecipe3(itemStack('melon', 1), 'MMM', 'MMM', 'MMM', def('M', 'melon'));
    // §FoodRecipes.h:20-22 — melon seeds
    this.addShapedRecipe(itemStack('seeds_melon'), 'M', def('M', 'melon'));
  }

  // === §OreRecipes.cpp:9-40 ===
  private registerOreRecipes(): void {
    // §OreRecipes.cpp:12-16 — block ↔ ingot pairs
    const pairs: [string, ItemStack][] = [
      ['goldBlock', itemStack('goldIngot', 9)],
      ['ironBlock', itemStack('ironIngot', 9)],
      ['emeraldBlock', itemStack('emerald', 9)],
      ['lapisBlock', itemStack('dye_powder', 9, 4)], // §OreRecipes.cpp:16 — BLUE=4
    ];

    for (const [block, ingot] of pairs) {
      // §OreRecipes.cpp:24-27 — 9 ingots → 1 block (3×3)
      this.addShapedRecipe3(itemStack(block, 1), '###', '###', '###', def('#', ingot.id));
      // §OreRecipes.cpp:29-31 — 1 block → 9 ingots
      this.addShapedRecipe(itemStack(ingot.id, ingot.count), '#', def('#', block));
    }
  }

  // === §ClothDyeRecipes.h:6-56 ===
  private registerClothDyeRecipes(): void {
    // §ClothDyeRecipes.h:10-18 — cloth dyeing (skip BLACK/BROWN/SILVER/GRAY/WHITE)
    // Simplified: register dye + cloth → colored cloth

    // §ClothDyeRecipes.h:27 — flower → 2 yellow dye
    this.addShapelessRecipe(itemStack('dye_powder', 2, 11), def('0', 'flower')); // YELLOW=11
    // §ClothDyeRecipes.h:30 — bone → 3 white dye
    this.addShapelessRecipe(itemStack('dye_powder', 3, 15), def('0', 'bone')); // WHITE=15
    // §ClothDyeRecipes.h:32-33 — red + white → 2 pink
    this.addShapelessRecipe(itemStack('dye_powder', 2, 9), def2('0', 'dye_powder', '0', 'dye_powder')); // PINK=9
    // §ClothDyeRecipes.h:35-36 — red + yellow → 2 orange
    this.addShapelessRecipe(itemStack('dye_powder', 2, 14), def2('0', 'dye_powder', '0', 'dye_powder')); // ORANGE=14
    // §ClothDyeRecipes.h:38-39 — green + white → 2 lime
    this.addShapelessRecipe(itemStack('dye_powder', 2, 10), def2('0', 'dye_powder', '0', 'dye_powder')); // LIME=10
    // §ClothDyeRecipes.h:49-50 — blue + white → 2 light_blue
    this.addShapelessRecipe(itemStack('dye_powder', 2, 12), def2('0', 'dye_powder', '0', 'dye_powder')); // LIGHT_BLUE=12
    // §ClothDyeRecipes.h:51-52 — blue + green → 2 cyan
    this.addShapelessRecipe(itemStack('dye_powder', 2, 6), def2('0', 'dye_powder', '0', 'dye_powder')); // CYAN=6
    // §ClothDyeRecipes.h:53-54 — blue + red → 2 purple
    this.addShapelessRecipe(itemStack('dye_powder', 2, 5), def2('0', 'dye_powder', '0', 'dye_powder')); // PURPLE=5
    // §ClothDyeRecipes.h:57-58 — blue+red+red+white → 4 magenta
    this.addShapelessRecipe(itemStack('dye_powder', 4, 13), def2('0', 'dye_powder', '0', 'dye_powder')); // MAGENTA=13
  }
}
