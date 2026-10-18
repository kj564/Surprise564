// §MCPE 2013 Tool system — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Item.h:26-59      — Tier class (level, uses, speed, damage)
//   Item.cpp:11-15    — Tier static instances: WOOD/STONE/IRON/EMERALD/GOLD
//   Item.cpp:168-198  — Item::initItems: tool icon (col,row) coordinates
//   DiggerItem.h:14-19 — getDestroySpeed(item, tile): hasTile ? speed : 1
//   PickaxeItem.cpp   — canDestroySpecial + getDestroySpeed (stone/metal → speed)
//   HatchetItem.cpp   — getDestroySpeed (wood → speed)
//   ShovelItem.cpp    — canDestroySpecial (topSnow, snow)
//   Material.cpp:37-66 — initMaterials: stone/metal = notAlwaysDestroyable
//   Material.h:61-65  — isAlwaysDestroyable() default = true
//   Player.cpp:563-565 — Player::canDestroy → Inventory::canDestroy
//   Inventory.cpp:307-313 — canDestroy: isAlwaysDestroyable OR tool.canDestroySpecial
//   Tile.cpp:391-395  — getDestroyProgress:
//                          if (destroySpeed<0) return 0;  // unbreakable
//                          if (!canDestroy) return 1/destroySpeed/100;  // 100x slower
//                          return (playerDestroySpeed / destroySpeed) / 30;

export type ToolKind = 'pickaxe' | 'axe' | 'shovel' | 'sword' | 'none';
export type ToolTier = 'wood' | 'stone' | 'iron' | 'diamond' | 'gold' | 'none';

export interface ToolTierDef {
  readonly level: number;  // 0=wood/gold, 1=stone, 2=iron, 3=diamond
  readonly uses: number;  // durability
  readonly speed: number;  // destroySpeed multiplier
  readonly damage: number; // attack damage
}

export const TIERS: Readonly<Record<ToolTier, ToolTierDef>> = Object.freeze({
  wood:    Object.freeze({ level: 0, uses: 59,   speed: 2,  damage: 0 }),
  stone:   Object.freeze({ level: 1, uses: 131,  speed: 4,  damage: 1 }),
  iron:    Object.freeze({ level: 2, uses: 250,  speed: 6,  damage: 2 }),
  diamond: Object.freeze({ level: 3, uses: 1561, speed: 8,  damage: 3 }),
  gold:    Object.freeze({ level: 0, uses: 32,   speed: 12, damage: 0 }),
  none:    Object.freeze({ level: 0, uses: 0,    speed: 1,  damage: 0 }),
});

export interface Tool {
  readonly kind: ToolKind;
  readonly tier: ToolTier;
  readonly tierDef: ToolTierDef;
  /** Icon position in items.png 256x256 atlas (col,row,16x16 tiles). */
  readonly iconCol: number;
  readonly iconRow: number;
}

// Verified from rujukan Item.cpp:168-198 — tool itemKey → Tool metadata.
const TOOL_TABLE: Readonly<Record<string, Tool>> = Object.freeze({
  // Iron tools (Item.cpp:168-170): setIcon(2,5/6/7)
  'minecraft:iron_shovel':   makeTool('shovel',  'iron',    2, 5),
  'minecraft:iron_pickaxe':  makeTool('pickaxe', 'iron',    2, 6),
  'minecraft:iron_axe':      makeTool('axe',     'iron',    2, 7),
  // Wood tools (Item.cpp:181-183): setIcon(0,5/6/7)
  'minecraft:wood_shovel':   makeTool('shovel',  'wood',    0, 5),
  'minecraft:wood_pickaxe':  makeTool('pickaxe', 'wood',    0, 6),
  'minecraft:wood_axe':      makeTool('axe',     'wood',    0, 7),
  // Stone tools (Item.cpp:185-187): setIcon(1,5/6/7)
  'minecraft:stone_shovel':  makeTool('shovel',  'stone',   1, 5),
  'minecraft:stone_pickaxe': makeTool('pickaxe', 'stone',   1, 6),
  'minecraft:stone_axe':     makeTool('axe',     'stone',   1, 7),
  // Diamond tools (Item.cpp:189-191): setIcon(3,5/6/7)
  'minecraft:diamond_shovel':  makeTool('shovel',  'diamond', 3, 5),
  'minecraft:diamond_pickaxe': makeTool('pickaxe', 'diamond', 3, 6),
  'minecraft:diamond_axe':     makeTool('axe',     'diamond', 3, 7),
  // Gold tools (Item.cpp:196-198): setIcon(4,5/6/7)
  'minecraft:gold_shovel':   makeTool('shovel',  'gold',    4, 5),
  'minecraft:gold_pickaxe':  makeTool('pickaxe', 'gold',    4, 6),
  'minecraft:gold_axe':      makeTool('axe',     'gold',    4, 7),
  // Swords (Item.cpp:179-180,184,188,195): setIcon(<tier>,4)
  'minecraft:wood_sword':    makeTool('sword', 'wood',    0, 4),
  'minecraft:stone_sword':   makeTool('sword', 'stone',   1, 4),
  'minecraft:iron_sword':    makeTool('sword', 'iron',    2, 4),
  'minecraft:diamond_sword': makeTool('sword', 'diamond', 3, 4),
  'minecraft:gold_sword':    makeTool('sword', 'gold',    4, 4),
});

function makeTool(kind: ToolKind, tier: ToolTier, iconCol: number, iconRow: number): Tool {
  return Object.freeze({ kind, tier, tierDef: TIERS[tier], iconCol, iconRow });
}

/** Lookup tool metadata by item key. Returns null for non-tool items. */
export function getTool(itemKey: string | null | undefined): Tool | null {
  if (!itemKey) return null;
  return TOOL_TABLE[itemKey] ?? null;
}

// §Block material — 1:1 with rujukan Material.cpp:37-66
export type BlockMaterial =
  | 'air' | 'dirt' | 'wood' | 'stone' | 'metal' | 'water' | 'lava'
  | 'leaves' | 'plant' | 'replaceable_plant' | 'sponge' | 'cloth' | 'fire'
  | 'sand' | 'decoration' | 'glass' | 'explosive' | 'coral' | 'ice'
  | 'topSnow' | 'snow' | 'cactus' | 'clay' | 'vegetable' | 'portal' | 'cake'
  | 'web';

// §Material::isAlwaysDestroyable — Material.cpp:37-66 + Material.h:84 default=true.
// Materials that called notAlwaysDestroyable() require a tool to drop resources.
const NOT_ALWAYS_DESTROYABLE: ReadonlySet<BlockMaterial> = new Set([
  'stone',
  'metal',
  'snow',
  'topSnow',
]);

export function isAlwaysDestroyable(material: BlockMaterial): boolean {
  return !NOT_ALWAYS_DESTROYABLE.has(material);
}

// §PickaxeItem::canDestroySpecial (PickaxeItem.cpp:38-52):
//   if obsidian → tier.level == 3
//   if emerald_block/ore → tier.level >= 2
//   if gold_block/ore → tier.level >= 2
//   if iron_block/ore → tier.level >= 1
//   if lapis_block/ore → tier.level >= 1
//   if redstone_ore → tier.level >= 2
//   if material == stone OR metal → true
//   else false
function pickaxeCanDestroy(material: BlockMaterial, blockKey: string, tierLevel: number): boolean {
  // Per-block tier gates (rujukan exact):
  if (blockKey === 'minecraft:obsidian') return tierLevel === 3;
  if (blockKey === 'minecraft:diamond_block' || blockKey === 'minecraft:diamond_ore') return tierLevel >= 2;
  if (blockKey === 'minecraft:gold_block' || blockKey === 'minecraft:gold_ore') return tierLevel >= 2;
  if (blockKey === 'minecraft:iron_block' || blockKey === 'minecraft:iron_ore') return tierLevel >= 1;
  if (blockKey === 'minecraft:lapis_block' || blockKey === 'minecraft:lapis_ore') return tierLevel >= 1;
  // Material fallback — §PickaxeItem.cpp:50-51
  if (material === 'stone' || material === 'metal') return true;
  return false;
}

// §ShovelItem::canDestroySpecial (ShovelItem.cpp:25-30):
//   if topSnow → true; if snow → true; else false
function shovelCanDestroy(material: BlockMaterial): boolean {
  return material === 'topSnow' || material === 'snow';
}

// §PickaxeItem::getDestroySpeed (PickaxeItem.cpp:54-58):
//   if tile.material == stone OR metal → return tier.speed
//   else fall through to DiggerItem.getDestroySpeed (hasTile check)
function pickaxeDestroySpeed(material: BlockMaterial, hasTile: boolean, tierSpeed: number): number {
  if (material === 'stone' || material === 'metal') return tierSpeed;
  return hasTile ? tierSpeed : 1;
}

// §HatchetItem::getDestroySpeed (HatchetItem.cpp:21-25):
//   if tile.material == wood → return tier.speed
//   else fall through to DiggerItem.getDestroySpeed (hasTile check)
function axeDestroySpeed(material: BlockMaterial, hasTile: boolean, tierSpeed: number): number {
  if (material === 'wood') return tierSpeed;
  return hasTile ? tierSpeed : 1;
}

// §DiggerItem::getDestroySpeed (DiggerItem.h:14-19): hasTile ? speed : 1
// §Item::getDestroySpeed base (Item.h:267-269): always returns 1
function shovelDestroySpeed(hasTile: boolean, tierSpeed: number): number {
  return hasTile ? tierSpeed : 1;
}

// §PickaxeItem tile list (PickaxeItem.cpp:7-26): cobblestone, stone_brick,
// stone_slab (both), stone, sandstone, moss_stone, iron_ore, iron_block,
// coal_ore, gold_block, gold_ore, diamond_block, diamond_ore, ice, lapis_ore,
// lapis_block. Map to our itemKey format.
const PICKAXE_TILES: ReadonlySet<string> = new Set([
  'minecraft:cobblestone', 'minecraft:stone_bricks', 'minecraft:stone_slab',
  'minecraft:stone', 'minecraft:sandstone', 'minecraft:moss_stone',
  'minecraft:iron_ore', 'minecraft:iron_block', 'minecraft:coal_ore',
  'minecraft:gold_block', 'minecraft:gold_ore', 'minecraft:diamond_block',
  'minecraft:diamond_ore', 'minecraft:ice', 'minecraft:lapis_ore', 'minecraft:lapis_block',
]);

// §HatchetItem tile list (HatchetItem.cpp:14-22): wood, bookshelf, tree_trunk (oak_log),
// chest, stone_slab, stone_slab_half. Map to our itemKey format.
const AXE_TILES: ReadonlySet<string> = new Set([
  'minecraft:oak_planks', 'minecraft:bookshelf', 'minecraft:oak_log',
  'minecraft:chest', 'minecraft:stone_slab', 'minecraft:oak_stairs',
  'minecraft:crafting_table', 'minecraft:oak_fence',
]);

// §ShovelItem tile list (ShovelItem.cpp:11-19): grass, dirt, sand, gravel,
// topSnow, snow, clay, farmland. Map to our itemKey format.
const SHOVEL_TILES: ReadonlySet<string> = new Set([
  'minecraft:grass_block', 'minecraft:dirt', 'minecraft:sand', 'minecraft:gravel',
  'minecraft:snow_layer', 'minecraft:snow', 'minecraft:clay', 'minecraft:farmland',
]);

// §Inventory::canDestroy (Inventory.cpp:307-313):
//   if tile.material->isAlwaysDestroyable() return true
//   if item: return item.canDestroySpecial(tile)
//   else false
export function canDestroyBlock(
  material: BlockMaterial,
  blockKey: string,
  tool: Tool | null,
): boolean {
  if (isAlwaysDestroyable(material)) return true;
  if (!tool) return false;
  switch (tool.kind) {
    case 'pickaxe': return pickaxeCanDestroy(material, blockKey, tool.tierDef.level);
    case 'shovel': return shovelCanDestroy(material);
    case 'axe':
    case 'sword':
    case 'none': return false;
  }
  return false;
}

// §Player::getDestroySpeed → Inventory::getDestroySpeed → Item::getDestroySpeed
// (Inventory.cpp:316-323): bare hand returns 1.0; tool returns tool.getDestroySpeed
export function getPlayerDestroySpeed(
  material: BlockMaterial,
  blockKey: string,
  tool: Tool | null,
): number {
  if (!tool) return 1;  // §Inventory.cpp:322 bare-hand fallback
  const hasTile = (() => {
    switch (tool.kind) {
      case 'pickaxe': return PICKAXE_TILES.has(blockKey);
      case 'axe':     return AXE_TILES.has(blockKey);
      case 'shovel':  return SHOVEL_TILES.has(blockKey);
      case 'sword':   return false;  // §WeaponItem: no mining bonus
      case 'none':    return false;
    }
    return false;
  })();
  switch (tool.kind) {
    case 'pickaxe': return pickaxeDestroySpeed(material, hasTile, tool.tierDef.speed);
    case 'axe':     return axeDestroySpeed(material, hasTile, tool.tierDef.speed);
    case 'shovel':  return shovelDestroySpeed(hasTile, tool.tierDef.speed);
    case 'sword':   return 1;  // §WeaponItem extends Item, no mining override
    case 'none':    return 1;
  }
  return 1;
}

/** All tool item keys (used by engine + tests). */
export const TOOL_KEYS: readonly string[] = Object.freeze(Object.keys(TOOL_TABLE));
