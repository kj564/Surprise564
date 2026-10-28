// §item-subclasses.ts — Direct 1:1 translation of C++ item subclass headers
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/item/
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Item, Tier, TIER_WOOD, TIER_STONE, TIER_IRON, TIER_EMERALD, TIER_GOLD } from './Item';

// === DiggerItem.h — base class for pickaxe/shovel/hatchet ===
// --- DiggerItem.h:14-72 ---
class DiggerItem extends Item {
  protected speed: number;
  protected tier: Tier;
  protected attackDamage: number;
  private _bTiles: boolean[] = new Array(256).fill(false);
  protected tiles: any[] = [];

  // --- DiggerItem.h:49-58 — constructor ---
  constructor(id: number, attackDamage: number, tier: Tier, tiles: any[] = []) {
    super(id);
    this.speed = tier.getSpeed();
    this.tier = tier;
    this.setTiles(tiles);
    this.maxStackSize = 1;
    this.setMaxDamage(tier.getUses());
    this.attackDamage = attackDamage + tier.getAttackDamageBonus();
  }

  // --- DiggerItem.h:16-20 — getDestroySpeed() ---
  getDestroySpeed(itemInstance: any, tile: any): number {
    if (this.hasTile(tile)) return this.speed;
    return 1;
  }

  // --- DiggerItem.h:22-26 — hurtEnemy() ---
  hurtEnemy(itemInstance: any, mob: any): void {
    itemInstance.hurt(2);
  }

  // --- DiggerItem.h:28-32 — mineBlock() ---
  mineBlock(itemInstance: any, tile: number, x: number, y: number, z: number): boolean {
    itemInstance.hurt(1);
    return true;
  }

  // --- DiggerItem.h:34-36 — getAttackDamage() ---
  getAttackDamage(entity: any): number { return this.attackDamage; }

  // --- DiggerItem.h:38-40 — isHandEquipped() ---
  isHandEquipped(): boolean { return true; }

  // --- DiggerItem.h:42-50 — setTiles() ---
  setTiles(tiles: any[]): void {
    for (let i = 0; i < 256; i++) this._bTiles[i] = false;
    for (let i = 0; i < tiles.length; i++) {
      this._bTiles[tiles[i].id] = true;
    }
    this.tiles = tiles;
  }

  // --- DiggerItem.h:67-69 — hasTile() ---
  hasTile(tile: any): boolean { return tile && this._bTiles[tile.id]; }
}

// === PickaxeItem.h — extends DiggerItem ===
// --- PickaxeItem.h:13-20 ---
class PickaxeItem extends DiggerItem {
  constructor(id: number, tier: Tier) {
    super(id, 1, tier);  // §attackDamage=1, tiles set in .cpp
  }
  // §C++ canDestroySpecial: checks stone/metal/ore tiles
  canDestroySpecial(tile: any): boolean {
    return tile && (tile.material === 'stone' || tile.material === 'metal');
  }
  // §C++ getDestroySpeed: returns speed for stone/metal/ore tiles
  getDestroySpeed(itemInstance: any, tile: any): number {
    if (tile && (tile.material === 'stone' || tile.material === 'metal')) return this.speed;
    return super.getDestroySpeed(itemInstance, tile);
  }
}

// === ShovelItem.h — extends DiggerItem ===
// --- ShovelItem.h:13-18 ---
class ShovelItem extends DiggerItem {
  constructor(id: number, tier: Tier) {
    super(id, 0, tier);
  }
  // §C++ canDestroySpecial: checks topSnow/snow/clay
  canDestroySpecial(tile: any): boolean {
    return tile && (tile.material === 'topSnow' || tile.material === 'snow' || tile.material === 'clay');
  }
}

// === HatchetItem.h — extends DiggerItem ===
// --- HatchetItem.h:13-19 ---
class HatchetItem extends DiggerItem {
  constructor(id: number, tier: Tier) {
    super(id, 2, tier);
  }
  // §C++ getDestroySpeed: returns speed for wood tiles
  getDestroySpeed(itemInstance: any, tile: any): number {
    if (tile && tile.material === 'wood') return this.speed;
    return super.getDestroySpeed(itemInstance, tile);
  }
}

// === WeaponItem.h — extends Item (sword) ===
// --- WeaponItem.h:16-68 ---
class WeaponItem extends Item {
  private damage: number;
  private tier: Tier;

  // --- WeaponItem.h:19-26 — constructor ---
  constructor(id: number, tier: Tier) {
    super(id);
    this.tier = tier;
    this.maxStackSize = 1;
    this.setMaxDamage(tier.getUses());
    this.damage = 4 + tier.getAttackDamageBonus();
  }

  // --- WeaponItem.h:29-35 — getDestroySpeed() ---
  getDestroySpeed(itemInstance: any, tile: any): number {
    if (tile && tile.id === 30) return 15;  // §web
    return 1.5;
  }

  // --- WeaponItem.h:37-40 — hurtEnemy() ---
  hurtEnemy(itemInstance: any, mob: any): void {
    itemInstance.hurt(1);
  }

  // --- WeaponItem.h:42-46 — mineBlock() ---
  mineBlock(itemInstance: any, tile: number, x: number, y: number, z: number): boolean {
    itemInstance.hurt(2);
    return true;
  }

  // --- WeaponItem.h:48-50 — getAttackDamage() ---
  getAttackDamage(entity: any): number { return this.damage; }

  // --- WeaponItem.h:52-54 — isHandEquipped() ---
  isHandEquipped(): boolean { return true; }

  // --- WeaponItem.h:60-62 — getUseDuration() ---
  getUseDuration(itemInstance: any): number { return 20 * 60 * 60; }

  // --- WeaponItem.h:64-66 — canDestroySpecial() ---
  canDestroySpecial(tile: any): boolean {
    return tile && tile.id === 30;  // §web
  }
}

// === HoeItem.h — extends Item ===
// --- HoeItem.h:10-18 ---
class HoeItem extends Item {
  protected tier: Tier;
  constructor(id: number, tier: Tier) {
    super(id);
    this.tier = tier;
  }
  isHandEquipped(): boolean { return true; }
}

// === BowItem.h — extends Item ===
// --- BowItem.h:15-28 ---
class BowItem extends Item {
  static MAX_DRAW_DURATION = 20 * 1;
  constructor(id: number) {
    super(id);
    this.maxStackSize = 1;
    this.setMaxDamage(384);
  }
}

// === FoodItem.h — extends Item ===
// --- FoodItem.h:16-28 ---
class FoodItem extends Item {
  static EAT_DURATION = Math.floor(20 * 1.6);
  protected nutrition: number;
  protected _isMeat: boolean;
  protected saturationModifier: number;

  constructor(id: number, nutrition: number, isMeat: boolean, saturationMod: number = 0.6) {
    super(id);
    this.nutrition = nutrition;
    this._isMeat = isMeat;
    this.saturationModifier = saturationMod;
  }

  isFood(): boolean { return true; }
  getUseDuration(itemInstance: any): number { return FoodItem.EAT_DURATION; }
}

// === FlintAndSteelItem.h — extends Item ===
// --- FlintAndSteelItem.h:14-22 ---
class FlintAndSteelItem extends Item {
  constructor(id: number) {
    super(id);
    this.setMaxStackSize(1);
    this.setMaxDamage(64);
  }
}

// === DoorItem.h — extends Item ===
// --- DoorItem.h:17-26 ---
class DoorItem extends Item {
  private material: string;
  constructor(id: number, material: string) {
    super(id);
    this.material = material;
    this.maxDamage = 64;
    this.maxStackSize = 1;
  }
}

// === SignItem.h — extends Item ===
// --- SignItem.h:12-18 ---
class SignItem extends Item {
  constructor(id: number) {
    super(id);
    this.maxStackSize = 16;
  }
}

// === ShearsItem.h — extends Item ===
// --- ShearsItem.h:13-22 ---
class ShearsItem extends Item {
  constructor(itemId: number) {
    super(itemId);
    this.setMaxStackSize(1);
    this.setMaxDamage(238);
  }
  // --- ShearsItem.h:24-29 — mineBlock: leaves/web hurt ---
  mineBlock(itemInstance: any, tile: number, x: number, y: number, z: number): boolean {
    if (tile === 18 || tile === 30) {  // §leaves or web
      itemInstance.hurt(1);
    }
    return true;
  }
}

// === BowlFoodItem.h — extends FoodItem (mushroom stew) ===
class BowlFoodItem extends FoodItem {
  constructor(id: number, returnItem: number) {
    super(id, 0, false);
  }
}

// === SeedItem.h — extends Item ===
class SeedItem extends Item {
  constructor(id: number, tileId: number, farmlandId: number) {
    super(id);
  }
}

// === CoalItem.h — extends Item ===
class CoalItem extends Item {
  constructor(id: number) { super(id); }
}

// === EggItem.h — extends Item ===
class EggItem extends Item {
  constructor(id: number) { super(id); }
}

// === SnowballItem.h — extends Item ===
class SnowballItem extends Item {
  constructor(id: number) { super(id); }
}

// === DyePowderItem.h — extends Item ===
class DyePowderItem extends Item {
  static BLUE = 4;
  constructor(id: number) { super(id); }
}

// === BedItem.h — extends Item ===
class BedItem extends Item {
  constructor(id: number) {
    super(id);
  }
}

// === HangingEntityItem.h — extends Item (painting) ===
class HangingEntityItem extends Item {
  constructor(id: number, entityType: number) {
    super(id);
  }
}

// === CameraItem.h — extends Item ===
class CameraItem extends Item {
  constructor(id: number) { super(id); }
}

// === TileItem.h — extends Item (placeholder for tile-as-item) ===
class TileItem extends Item {
  constructor(id: number) { super(id); }
}

// === AuxDataTileItem.h — extends Item (tile with aux data) ===
class AuxDataTileItem extends Item {
  private tile: any;
  constructor(id: number, tile: any) {
    super(id);
    this.tile = tile;
  }
}

// === ClothTileItem.h — extends Item (wool color) ===
class ClothTileItem extends Item {
  constructor(id: number) { super(id); }
}

// === LeafTileItem.h — extends Item ===
class LeafTileItem extends Item {
  constructor(id: number) { super(id); }
}

// === StoneSlabTileItem.h — extends Item ===
class StoneSlabTileItem extends Item {
  constructor(id: number) { super(id); }
}

// === SaplingTileItem.h — extends Item ===
class SaplingTileItem extends Item {
  constructor(id: number) { super(id); }
}

// === TilePlanterItem.h — extends Item (reeds, cake) ===
class TilePlanterItem extends Item {
  private tile: any;
  constructor(id: number, tile: any) {
    super(id);
    this.tile = tile;
  }
}

export {
  DiggerItem, PickaxeItem, ShovelItem, HatchetItem,
  WeaponItem, HoeItem, BowItem, FoodItem,
  FlintAndSteelItem, DoorItem, SignItem, ShearsItem,
  BowlFoodItem, SeedItem, CoalItem, EggItem, SnowballItem,
  DyePowderItem, BedItem, HangingEntityItem, CameraItem,
  TileItem, AuxDataTileItem, ClothTileItem, LeafTileItem,
  StoneSlabTileItem, SaplingTileItem, TilePlanterItem
};
