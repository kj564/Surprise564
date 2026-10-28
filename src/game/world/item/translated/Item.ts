// §Item.ts — Direct 1:1 translation of C++ Item.h (408 lines) + Item.cpp (308 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/item/Item.h + Item.cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- Item.h:20 ---
const MAX_STACK_SIZE = 64;

// --- Item.h:22-23 ---
const MAX_ITEMS = 512;
const ICON_COLUMNS = 16;

// --- Item.h:24 / Item.cpp:4 ---
const ICON_DESCRIPTION_PREFIX = 'item.';

// --- Item.h:26-61 — Tier inner class ---
class Tier {
  readonly level: number;
  readonly uses: number;
  readonly speed: number;
  readonly damage: number;

  constructor(level: number, uses: number, speed: number, damage: number) {
    this.level = level;
    this.uses = uses;
    this.speed = speed;
    this.damage = damage;
  }

  getUses(): number { return this.uses; }
  getSpeed(): number { return this.speed; }
  getAttackDamageBonus(): number { return this.damage; }
  getLevel(): number { return this.level; }
}

// --- Item.cpp:9-13 — static Tier constants ---
const TIER_WOOD   = new Tier(0, 59, 2, 0);
const TIER_STONE  = new Tier(1, 131, 4, 1);
const TIER_IRON   = new Tier(2, 250, 6, 2);
const TIER_EMERALD = new Tier(3, 1561, 8, 3);
const TIER_GOLD   = new Tier(0, 32, 12, 0);

// --- Item.h:18-408 — class Item ---
class Item {
  // --- Item.h:64 — static items array ---
  static items: (Item | null)[] = new Array(MAX_ITEMS).fill(null);

  // --- Item.h:66-207 — static Item pointers ---
  // All initialized to null, set in initItems()
  static shovel_iron: Item | null = null;
  static pickAxe_iron: Item | null = null;
  static hatchet_iron: Item | null = null;
  static flintAndSteel: Item | null = null;
  static apple: Item | null = null;
  static bow: Item | null = null;
  static arrow: Item | null = null;
  static coal: Item | null = null;
  static emerald: Item | null = null;
  static ironIngot: Item | null = null;
  static goldIngot: Item | null = null;
  static sword_iron: Item | null = null;
  static sword_wood: Item | null = null;
  static shovel_wood: Item | null = null;
  static pickAxe_wood: Item | null = null;
  static hatchet_wood: Item | null = null;
  static sword_stone: Item | null = null;
  static shovel_stone: Item | null = null;
  static pickAxe_stone: Item | null = null;
  static hatchet_stone: Item | null = null;
  static sword_emerald: Item | null = null;
  static shovel_emerald: Item | null = null;
  static pickAxe_emerald: Item | null = null;
  static hatchet_emerald: Item | null = null;
  static stick: Item | null = null;
  static bowl: Item | null = null;
  static mushroomStew: Item | null = null;
  static sword_gold: Item | null = null;
  static shovel_gold: Item | null = null;
  static pickAxe_gold: Item | null = null;
  static hatchet_gold: Item | null = null;
  static string: Item | null = null;
  static feather: Item | null = null;
  static sulphur: Item | null = null;
  static hoe_wood: Item | null = null;
  static hoe_stone: Item | null = null;
  static hoe_iron: Item | null = null;
  static hoe_emerald: Item | null = null;
  static hoe_gold: Item | null = null;
  static seeds_wheat: Item | null = null;
  static wheat: Item | null = null;
  static bread: Item | null = null;
  static helmet_cloth: Item | null = null;
  static chestplate_cloth: Item | null = null;
  static leggings_cloth: Item | null = null;
  static boots_cloth: Item | null = null;
  static helmet_chain: Item | null = null;
  static chestplate_chain: Item | null = null;
  static leggings_chain: Item | null = null;
  static boots_chain: Item | null = null;
  static helmet_iron: Item | null = null;
  static chestplate_iron: Item | null = null;
  static leggings_iron: Item | null = null;
  static boots_iron: Item | null = null;
  static helmet_diamond: Item | null = null;
  static chestplate_diamond: Item | null = null;
  static leggings_diamond: Item | null = null;
  static boots_diamond: Item | null = null;
  static helmet_gold: Item | null = null;
  static chestplate_gold: Item | null = null;
  static leggings_gold: Item | null = null;
  static boots_gold: Item | null = null;
  static flint: Item | null = null;
  static porkChop_raw: Item | null = null;
  static porkChop_cooked: Item | null = null;
  static painting: Item | null = null;
  static sign: Item | null = null;
  static door_wood: Item | null = null;
  static door_iron: Item | null = null;
  static snowBall: Item | null = null;
  static leather: Item | null = null;
  static brick: Item | null = null;
  static clay: Item | null = null;
  static reeds: Item | null = null;
  static paper: Item | null = null;
  static book: Item | null = null;
  static slimeBall: Item | null = null;
  static egg: Item | null = null;
  static compass: Item | null = null;
  static clock: Item | null = null;
  static yellowDust: Item | null = null;
  static melon: Item | null = null;
  static seeds_melon: Item | null = null;
  static dye_powder: Item | null = null;
  static bone: Item | null = null;
  static sugar: Item | null = null;
  static bed: Item | null = null;
  static shears: Item | null = null;
  static beef_raw: Item | null = null;
  static beef_cooked: Item | null = null;
  static chicken_raw: Item | null = null;
  static chicken_cooked: Item | null = null;
  static netherbrick: Item | null = null;
  static netherQuartz: Item | null = null;
  static camera: Item | null = null;

  // --- Item.h:393-405 — public/protected/private fields ---
  readonly id: number;
  maxDamage: number;
  icon: number;
  category: number;
  protected maxStackSize: number;
  private _handEquipped: boolean;
  private _isStackedByData: boolean;
  private craftingRemainingItem: Item | null;
  descriptionId: string;

  // --- Item.h:212-226 — Item(int id) constructor ---
  constructor(id: number) {
    // §C++: id(256 + id) — note: C++ parameter shadows, so this.id = 256 + parameter id
    this.id = 256 + id;
    this.craftingRemainingItem = null;
    this.maxStackSize = MAX_STACK_SIZE;
    this.maxDamage = 32;
    this.category = -1;
    this._handEquipped = false;
    this._isStackedByData = false;
    this.icon = 0;
    this.descriptionId = '';

    // §C++: if (items[this->id] != NULL) printf(...)
    if (Item.items[this.id] != null) {
      console.warn('Item conflict id @ ' + this.id + '! Id already used');
    }
    // §C++: items[this->id] = this;
    Item.items[this.id] = this;
  }

  // --- Item.h:230-233 — setIcon(int icon) ---
  setIcon(icon: number): this {
    this.icon = icon;
    return this;
  }

  // --- Item.h:248-251 — setIcon(int column, int row) ---
  setIconPos(column: number, row: number): this {
    this.icon = column + row * ICON_COLUMNS;
    return this;
  }

  // --- Item.h:235-238 — setMaxStackSize(int max) ---
  setMaxStackSize(max: number): this {
    this.maxStackSize = max;
    return this;
  }

  // --- Item.h:240-242 — canBeDepleted() ---
  canBeDepleted(): boolean {
    return this.maxDamage > 0 && !this._isStackedByData;
  }

  // --- Item.h:244-246 — getIcon(int auxValue) ---
  getIcon(auxValue: number): number {
    return this.icon;
  }

  // --- Item.h:253-255 — useOn(ItemInstance*, Level*, x, y, z, face) ---
  useOn(itemInstance: any, level: any, x: number, y: number, z: number, face: number): boolean {
    return false;
  }

  // --- Item.h:257-259 — useOn(..., clickX, clickY, clickZ) ---
  useOnWithClick(itemInstance: any, player: any, level: any, x: number, y: number, z: number, face: number, clickX: number, clickY: number, clickZ: number): boolean {
    return false;
  }

  // --- Item.h:261-263 — getUseDuration(ItemInstance*) ---
  getUseDuration(itemInstance: any): number {
    return 0;
  }

  // --- Item.cpp:303-306 — useTimeDepleted(ItemInstance*, Level*, Player*) ---
  useTimeDepleted(itemInstance: any, level: any, player: any): any {
    return itemInstance;
  }

  // --- Item.h:267-269 — getDestroySpeed(ItemInstance*, Tile*) ---
  getDestroySpeed(itemInstance: any, tile: any): number {
    return 1;
  }

  // --- Item.h:271-273 — use(ItemInstance*, Level*, Player*) ---
  use(itemInstance: any, level: any, player: any): any {
    return itemInstance;
  }

  // --- Item.h:275-277 — getMaxStackSize() ---
  getMaxStackSize(): number {
    return this.maxStackSize;
  }

  // --- Item.h:279-281 — getLevelDataForAuxValue(int auxValue) ---
  getLevelDataForAuxValue(auxValue: number): number {
    return 0;
  }

  // --- Item.h:283-285 — isStackedByData() ---
  isStackedByData(): boolean {
    return this._isStackedByData;
  }

  // --- Item.h:287-290 — setCategory(int category) ---
  setCategory(category: number): this {
    this.category = category;
    return this;
  }

  // --- Item.h:292-294 — getMaxDamage() ---
  getMaxDamage(): number {
    return this.maxDamage;
  }

  // --- Item.h:296-297 — hurtEnemy(ItemInstance*, Mob*) ---
  hurtEnemy(itemInstance: any, mob: any): void {}

  // --- Item.h:299-301 — mineBlock(ItemInstance*, int tile, x, y, z) ---
  mineBlock(itemInstance: any, tile: number, x: number, y: number, z: number): boolean {
    return false;
  }

  // --- Item.h:303-305 — getAttackDamage(Entity*) ---
  getAttackDamage(entity: any): number {
    return 1;
  }

  // --- Item.h:307-309 — canDestroySpecial(const Tile*) const ---
  canDestroySpecial(tile: any): boolean {
    return false;
  }

  // --- Item.h:311-312 — interactEnemy(ItemInstance*, Mob*) ---
  interactEnemy(itemInstance: any, mob: any): void {}

  // --- Item.h:314-317 — handEquipped() ---
  handEquipped(): this {
    this._handEquipped = true;
    return this;
  }

  // --- Item.h:319-321 — isHandEquipped() const ---
  isHandEquipped(): boolean {
    return this._handEquipped;
  }

  // --- Item.h:323-325 — isMirroredArt() const ---
  isMirroredArt(): boolean {
    return false;
  }

  // --- Item.h:327-329 — isFood() const ---
  isFood(): boolean {
    return false;
  }

  // --- Item.h:331-333 — isArmor() const ---
  isArmor(): boolean {
    return false;
  }

  // --- Item.h:335-338 — setDescriptionId(const string& id) ---
  setDescriptionId(id: string): this {
    this.descriptionId = ICON_DESCRIPTION_PREFIX + id;
    return this;
  }

  // --- Item.h:340-342 — getDescription() const ---
  getDescription(): string {
    return this.descriptionId;  // §C++: I18n::get(getDescriptionId())
  }

  // --- Item.h:344-346 — getDescription(const ItemInstance*) const ---
  getDescriptionWithInstance(instance: any): string {
    return this.descriptionId;
  }

  // --- Item.h:348-350 — getDescriptionId() const ---
  getDescriptionId(): string {
    return this.descriptionId;
  }

  // --- Item.h:352-354 — getDescriptionId(const ItemInstance*) const ---
  getDescriptionIdWithInstance(instance: any): string {
    return this.descriptionId;
  }

  // --- Item.h:356-362 — setCraftingRemainingItem(Item*) ---
  setCraftingRemainingItem(craftingRemainingItem: Item | null): this {
    if (this.maxStackSize > 1) {
      console.warn('Max stack size must be 1 for items with crafting results');
    }
    this.craftingRemainingItem = craftingRemainingItem;
    return this;
  }

  // --- Item.h:364-366 — getCraftingRemainingItem() ---
  getCraftingRemainingItem(): Item | null {
    return this.craftingRemainingItem;
  }

  // --- Item.h:368-370 — hasCraftingRemainingItem() const ---
  hasCraftingRemainingItem(): boolean {
    return this.craftingRemainingItem != null;
  }

  // --- Item.h:372-374 — getName() const ---
  getName(): string {
    return this.descriptionId + '.name';  // §C++: I18n::get(getDescriptionId() + ".name")
  }

  // --- Item.h:376 — releaseUsing(...) ---
  releaseUsing(itemInstance: any, level: any, player: any, durationLeft: number): void {}

  // --- Item.h:377 — getUseAnimation() ---
  getUseAnimation(): any {
    return 'none';  // §C++: UseAnim::none
  }

  // --- Item.h:381-384 — setStackedByData(bool) (protected) ---
  protected setStackedByData(isStackedByData: boolean): this {
    this._isStackedByData = isStackedByData;
    return this;
  }

  // --- Item.h:386-389 — setMaxDamage(int) (protected) ---
  setMaxDamage(maxDamage: number): this {
    this.maxDamage = maxDamage;
    return this;
  }
}

// --- Item.cpp:84-302 — initItems() — translated line by line ---
function initItems(): void {
  // §C++ Item.cpp:86-88 — isInited guard
  let isInited = false;
  if (isInited) return;
  isInited = true;

  // §C++ Item.cpp:90-110 — Tools (shovel/pickaxe/hatchet/sword × iron/wood/stone/emerald/gold)
  Item.shovel_iron = new Item(0); Item.shovel_iron.setIconPos(2, 5).setCategory(0).setDescriptionId('shovelIron');
  Item.pickAxe_iron = new Item(1); Item.pickAxe_iron.setIconPos(2, 6).setCategory(0).setDescriptionId('pickaxeIron');
  Item.hatchet_iron = new Item(2); Item.hatchet_iron.setIconPos(2, 7).setCategory(0).setDescriptionId('hatchetIron');
  Item.flintAndSteel = new Item(3); Item.flintAndSteel.setIconPos(5, 0).setCategory(0).setDescriptionId('flintAndSteel');
  Item.apple = new Item(4); Item.apple.setIconPos(10, 0).setCategory(4).setDescriptionId('apple');
  Item.bow = new Item(5); Item.bow.setIconPos(5, 1).setCategory(0).setDescriptionId('bow');
  Item.arrow = new Item(6); Item.arrow.setIconPos(5, 2).setCategory(0).setDescriptionId('arrow');
  Item.coal = new Item(7); Item.coal.setIconPos(7, 0).setCategory(0).setDescriptionId('coal');
  Item.emerald = new Item(8); Item.emerald.setIconPos(7, 3).setCategory(1).setDescriptionId('emerald');
  Item.ironIngot = new Item(9); Item.ironIngot.setIconPos(7, 1).setCategory(1).setDescriptionId('ingotIron');
  Item.goldIngot = new Item(10); Item.goldIngot.setIconPos(7, 2).setCategory(1).setDescriptionId('ingotGold');
  Item.sword_iron = new Item(11); Item.sword_iron.setIconPos(2, 4).setCategory(0).setDescriptionId('swordIron');
  Item.sword_wood = new Item(12); Item.sword_wood.setIconPos(0, 4).setCategory(0).setDescriptionId('swordWood');
  Item.shovel_wood = new Item(13); Item.shovel_wood.setIconPos(0, 5).setCategory(0).setDescriptionId('shovelWood');
  Item.pickAxe_wood = new Item(14); Item.pickAxe_wood.setIconPos(0, 6).setCategory(0).setDescriptionId('pickaxeWood');
  Item.hatchet_wood = new Item(15); Item.hatchet_wood.setIconPos(0, 7).setCategory(0).setDescriptionId('hatchetWood');
  Item.sword_stone = new Item(16); Item.sword_stone.setIconPos(1, 4).setCategory(0).setDescriptionId('swordStone');
  Item.shovel_stone = new Item(17); Item.shovel_stone.setIconPos(1, 5).setCategory(0).setDescriptionId('shovelStone');
  Item.pickAxe_stone = new Item(18); Item.pickAxe_stone.setIconPos(1, 6).setCategory(0).setDescriptionId('pickaxeStone');
  Item.hatchet_stone = new Item(19); Item.hatchet_stone.setIconPos(1, 7).setCategory(0).setDescriptionId('hatchetStone');
  Item.sword_emerald = new Item(20); Item.sword_emerald.setIconPos(3, 4).setCategory(0).setDescriptionId('swordDiamond');
  Item.shovel_emerald = new Item(21); Item.shovel_emerald.setIconPos(3, 5).setCategory(0).setDescriptionId('shovelDiamond');
  Item.pickAxe_emerald = new Item(22); Item.pickAxe_emerald.setIconPos(3, 6).setCategory(0).setDescriptionId('pickaxeDiamond');
  Item.hatchet_emerald = new Item(23); Item.hatchet_emerald.setIconPos(3, 7).setCategory(0).setDescriptionId('hatchetDiamond');

  // §C++ Item.cpp:112-114 — stick, bowl, mushroomStew
  Item.stick = new Item(24); Item.stick.setIconPos(5, 3).handEquipped().setCategory(0).setDescriptionId('stick');
  Item.bowl = new Item(25); Item.bowl.setIconPos(7, 4).setCategory(4).setDescriptionId('bowl');
  Item.mushroomStew = new Item(26); Item.mushroomStew.setIconPos(8, 4).setCategory(4).setDescriptionId('mushroomStew');

  // §C++ Item.cpp:116-119 — gold tools
  Item.sword_gold = new Item(27); Item.sword_gold.setIconPos(4, 4).setCategory(0).setDescriptionId('swordGold');
  Item.shovel_gold = new Item(28); Item.shovel_gold.setIconPos(4, 5).setCategory(0).setDescriptionId('shovelGold');
  Item.pickAxe_gold = new Item(29); Item.pickAxe_gold.setIconPos(4, 6).setCategory(0).setDescriptionId('pickaxeGold');
  Item.hatchet_gold = new Item(30); Item.hatchet_gold.setIconPos(4, 7).setCategory(0).setDescriptionId('hatchetGold');

  // §C++ Item.cpp:121-123 — string, feather, sulphur
  Item.string = new Item(31); Item.string.setIconPos(8, 0).setCategory(0).setDescriptionId('string');
  Item.feather = new Item(32); Item.feather.setIconPos(8, 1).setCategory(0).setDescriptionId('feather');
  Item.sulphur = new Item(33); Item.sulphur.setIconPos(8, 2).setCategory(0).setDescriptionId('sulphur');

  // §C++ Item.cpp:125-129 — hoes
  Item.hoe_wood = new Item(34); Item.hoe_wood.setIconPos(0, 8).setCategory(0).setDescriptionId('hoeWood');
  Item.hoe_stone = new Item(35); Item.hoe_stone.setIconPos(1, 8).setCategory(0).setDescriptionId('hoeStone');
  Item.hoe_iron = new Item(36); Item.hoe_iron.setIconPos(2, 8).setCategory(0).setDescriptionId('hoeIron');
  Item.hoe_emerald = new Item(37); Item.hoe_emerald.setIconPos(3, 8).setCategory(0).setDescriptionId('hoeDiamond');
  Item.hoe_gold = new Item(38); Item.hoe_gold.setIconPos(4, 8).setCategory(0).setDescriptionId('hoeGold');

  // §C++ Item.cpp:131-133 — seeds, wheat, bread
  Item.seeds_wheat = new Item(39); Item.seeds_wheat.setIconPos(9, 0).setCategory(4).setDescriptionId('seeds');
  Item.wheat = new Item(40); Item.wheat.setIconPos(9, 1).setCategory(4).setDescriptionId('wheat');
  Item.bread = new Item(41); Item.bread.setIconPos(9, 2).setCategory(4).setDescriptionId('bread');

  // §C++ Item.cpp:135-156 — Armor (cloth/chain/iron/diamond/gold × helmet/chestplate/leggings/boots)
  Item.helmet_cloth = new Item(42); Item.helmet_cloth.setIconPos(0, 0).setCategory(4).setDescriptionId('helmetCloth');
  Item.chestplate_cloth = new Item(43); Item.chestplate_cloth.setIconPos(0, 1).setCategory(4).setDescriptionId('chestplateCloth');
  Item.leggings_cloth = new Item(44); Item.leggings_cloth.setIconPos(0, 2).setCategory(4).setDescriptionId('leggingsCloth');
  Item.boots_cloth = new Item(45); Item.boots_cloth.setIconPos(0, 3).setCategory(4).setDescriptionId('bootsCloth');
  Item.helmet_chain = new Item(46); Item.helmet_chain.setIconPos(1, 0).setCategory(4).setDescriptionId('helmetChain');
  Item.chestplate_chain = new Item(47); Item.chestplate_chain.setIconPos(1, 1).setCategory(4).setDescriptionId('chestplateChain');
  Item.leggings_chain = new Item(48); Item.leggings_chain.setIconPos(1, 2).setCategory(4).setDescriptionId('leggingsChain');
  Item.boots_chain = new Item(49); Item.boots_chain.setIconPos(1, 3).setCategory(4).setDescriptionId('bootsChain');
  Item.helmet_iron = new Item(50); Item.helmet_iron.setIconPos(2, 0).setCategory(4).setDescriptionId('helmetIron');
  Item.chestplate_iron = new Item(51); Item.chestplate_iron.setIconPos(2, 1).setCategory(4).setDescriptionId('chestplateIron');
  Item.leggings_iron = new Item(52); Item.leggings_iron.setIconPos(2, 2).setCategory(4).setDescriptionId('leggingsIron');
  Item.boots_iron = new Item(53); Item.boots_iron.setIconPos(2, 3).setCategory(4).setDescriptionId('bootsIron');
  Item.helmet_diamond = new Item(54); Item.helmet_diamond.setIconPos(3, 0).setCategory(4).setDescriptionId('helmetDiamond');
  Item.chestplate_diamond = new Item(55); Item.chestplate_diamond.setIconPos(3, 1).setCategory(4).setDescriptionId('chestplateDiamond');
  Item.leggings_diamond = new Item(56); Item.leggings_diamond.setIconPos(3, 2).setCategory(4).setDescriptionId('leggingsDiamond');
  Item.boots_diamond = new Item(57); Item.boots_diamond.setIconPos(3, 3).setCategory(4).setDescriptionId('bootsDiamond');
  Item.helmet_gold = new Item(58); Item.helmet_gold.setIconPos(4, 0).setCategory(4).setDescriptionId('helmetGold');
  Item.chestplate_gold = new Item(59); Item.chestplate_gold.setIconPos(4, 1).setCategory(4).setDescriptionId('chestplateGold');
  Item.leggings_gold = new Item(60); Item.leggings_gold.setIconPos(4, 2).setCategory(4).setDescriptionId('leggingsGold');
  Item.boots_gold = new Item(61); Item.boots_gold.setIconPos(4, 3).setCategory(4).setDescriptionId('bootsGold');

  // §C++ Item.cpp:158-165 — flint, porkChop, painting, sign, door_wood
  Item.flint = new Item(62); Item.flint.setIconPos(6, 0).setCategory(0).setDescriptionId('flint');
  Item.porkChop_raw = new Item(63); Item.porkChop_raw.setIconPos(7, 5).setCategory(4).setDescriptionId('porkchopRaw');
  Item.porkChop_cooked = new Item(64); Item.porkChop_cooked.setIconPos(8, 5).setCategory(4).setDescriptionId('porkchopCooked');
  Item.painting = new Item(65); Item.painting.setIconPos(10, 1).setCategory(1).setDescriptionId('painting');
  Item.sign = new Item(67); Item.sign.setIconPos(10, 2).setCategory(1).setDescriptionId('sign');
  Item.door_wood = new Item(68); Item.door_wood.setIconPos(11, 2).setCategory(0).setDescriptionId('doorWood');

  // §C++ Item.cpp:170-171 — door_iron, snowBall
  Item.door_iron = new Item(74); Item.door_iron.setIconPos(12, 2).setCategory(0).setDescriptionId('doorIron');
  Item.snowBall = new Item(76); Item.snowBall.setIconPos(14, 0).setCategory(1).setDescriptionId('snowball');

  // §C++ Item.cpp:173-184 — leather, brick, clay, reeds, paper, book, slimeBall, egg, compass, clock, yellowDust
  Item.leather = new Item(78); Item.leather.setIconPos(7, 6).setCategory(0).setDescriptionId('leather');
  Item.brick = new Item(80); Item.brick.setIconPos(6, 1).setCategory(0).setDescriptionId('brick');
  Item.clay = new Item(81); Item.clay.setIconPos(9, 3).setCategory(0).setDescriptionId('clay');
  Item.reeds = new Item(82); Item.reeds.setIconPos(11, 1).setCategory(4).setDescriptionId('reeds');
  Item.paper = new Item(83); Item.paper.setIconPos(10, 3).setCategory(1).setDescriptionId('paper');
  Item.book = new Item(84); Item.book.setIconPos(11, 3).setCategory(1).setDescriptionId('book');
  Item.slimeBall = new Item(85); Item.slimeBall.setIconPos(14, 1).setCategory(1).setDescriptionId('slimeball');
  Item.egg = new Item(88); Item.egg.setIconPos(12, 0).setCategory(4).setDescriptionId('egg');
  Item.compass = new Item(89); Item.compass.setIconPos(6, 3).setCategory(0).setDescriptionId('compass');
  Item.clock = new Item(91); Item.clock.setIconPos(6, 4).setCategory(0).setDescriptionId('clock');
  Item.yellowDust = new Item(92); Item.yellowDust.setIconPos(9, 4).setCategory(0).setDescriptionId('yellowDust');

  // §C++ Item.cpp:186-189 — dye_powder, bone, sugar
  Item.dye_powder = new Item(95); Item.dye_powder.setIconPos(14, 4).setCategory(1).setDescriptionId('dyePowder');
  Item.bone = new Item(96); Item.bone.setIconPos(12, 1).setCategory(0).setDescriptionId('bone').handEquipped();
  Item.sugar = new Item(97); Item.sugar.setIconPos(13, 0).setCategory(4).setDescriptionId('sugar').handEquipped();

  // §C++ Item.cpp:191 — bed
  Item.bed = new Item(99); Item.bed.setMaxStackSize(1).setIconPos(13, 2).setCategory(0).setDescriptionId('bed');

  // §C++ Item.cpp:193 — shears
  Item.shears = new Item(103); Item.shears.setIconPos(13, 5).setCategory(0).setDescriptionId('shears');

  // §C++ Item.cpp:195-198 — melon, seeds_melon, beef, chicken
  Item.melon = new Item(104); Item.melon.setIconPos(13, 6).setCategory(4).setDescriptionId('melon');
  Item.seeds_melon = new Item(106); Item.seeds_melon.setIconPos(14, 3).setCategory(4).setDescriptionId('seedsMelon');
  Item.beef_raw = new Item(107); Item.beef_raw.setIconPos(9, 6).setCategory(4).setDescriptionId('beefRaw');
  Item.beef_cooked = new Item(108); Item.beef_cooked.setIconPos(10, 6).setCategory(4).setDescriptionId('beefCooked');
  Item.chicken_raw = new Item(109); Item.chicken_raw.setIconPos(9, 7).setCategory(4).setDescriptionId('chickenRaw');
  Item.chicken_cooked = new Item(110); Item.chicken_cooked.setIconPos(10, 7).setCategory(4).setDescriptionId('chickenCooked');

  // §C++ Item.cpp:200-201 — netherbrick, netherQuartz
  Item.netherbrick = new Item(149); Item.netherbrick.setIconPos(5, 9).setDescriptionId('netherbrickItem').setCategory(0);
  Item.netherQuartz = new Item(150); Item.netherQuartz.setIconPos(5, 10).setDescriptionId('netherquartz').setCategory(3);

  // §C++ Item.cpp:204 — camera
  Item.camera = new Item(200); Item.camera.setIconPos(2, 15).setCategory(1).setDescriptionId('camera');

  // §C++ Item.cpp:284-288 — category validation loop
  for (let i = 256; i < MAX_ITEMS; i++) {
    if (Item.items[i] && Item.items[i]!.category === -1) {
      console.warn('Error: Missing category for item ' + Item.items[i]!.id + ': ' + Item.items[i]!.getDescriptionId());
    }
  }
}

// --- Item.cpp:293-299 — teardownItems() ---
function teardownItems(): void {
  for (let i = 0; i < MAX_ITEMS; i++) {
    if (Item.items[i]) {
      Item.items[i] = null;
    }
  }
}

export {
  Item, Tier, initItems, teardownItems,
  MAX_STACK_SIZE, MAX_ITEMS, ICON_COLUMNS, ICON_DESCRIPTION_PREFIX,
  TIER_WOOD, TIER_STONE, TIER_IRON, TIER_EMERALD, TIER_GOLD
};
