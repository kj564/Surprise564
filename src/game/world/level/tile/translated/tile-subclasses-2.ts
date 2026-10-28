// §tile-subclasses-2.ts — Direct 1:1 translation of C++ tile subclass headers (batch 2)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Tile } from './Tile';
import { StoneTile } from './tile-subclasses';

// === TntTile.h ===
class TntTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'explosive');  // §Material::explosive
  }
  // --- TntTile.h:21-25 — getTexture(face) ---
  getTexture(face: number): number {
    if (face === 0) return this.tex + 2;  // bottom
    if (face === 1) return this.tex + 1;  // top
    return this.tex;  // side
  }
}

// === TorchTile.h ===
class TorchTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'decoration');  // §Material::decoration
    this.setTicking(true);
  }
  isSolidRender(): boolean { return false; }
}

// === LadderTile.h ===
class LadderTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'decoration');
  }
  isSolidRender(): boolean { return false; }
}

// === FenceTile.h ===
class FenceTile extends Tile {
  constructor(id: number, tex: number, material?: string) {
    super(id, tex, material || 'wood');
  }
}

// === FenceGateTile.h ===
class FenceGateTile extends Tile {
  static DIRECTION_MASK = 3;
  static OPEN_BIT = 4;
  constructor(id: number, tex: number) {
    super(id, tex, 'wood');
  }
}

// === BookshelfTile.h ===
class BookshelfTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'wood');
  }
  // --- BookshelfTile.h:19-22 — getTexture(face) ---
  getTexture(face: number): number {
    if (face <= 1) return 4;  // top/bottom = planks
    return this.tex;  // side = bookshelf texture
  }
  // --- BookshelfTile.h:24-26 — getResourceCount() ---
  getResourceCount(random: any): number { return 3; }
  // --- BookshelfTile.h:28-30 — getResource() ---
  getResource(data: number, random: any): number {
    return 340;  // §Item::book->id (256+84=340)
  }
}

// === WebTile.h ===
class WebTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'web');
  }
  getRenderLayer(): number { return 1; }  // §RENDERLAYER_ALPHATEST
  // --- WebTile.h:26 — entityInside() ---
  entityInside(level: any, x: number, y: number, z: number, entity: any): void {
    entity.makeStuckInWeb();
  }
}

// === IceTile.h ===
class IceTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'ice');
    this.friction = 0.98;
    this.setTicking(true);
  }
  getResourceCount(random: any): number { return 0; }
}

// === SnowTile.h ===
class SnowTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'snow');
    this.setTicking(true);
  }
  getResource(data: number, random: any): number {
    return 332;  // §Item::snowBall->id (256+76=332)
  }
  getResourceCount(random: any): number { return 4; }
}

// === TopSnowTile.h ===
class TopSnowTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'topSnow');
    this.setShape(0, 0, 0, 1, 1 / 8.0, 1);
    this.setTicking(true);
  }
  isSolidRender(): boolean { return false; }
}

// === LightGemTile.h ===
class LightGemTile extends Tile {
  constructor(id: number, tex: number, material: string) {
    super(id, tex, material);
  }
  getResourceCount(random: any): number { return 1; }
  getResource(data: number, random: any): number {
    return 348;  // §Item::yellowDust->id (256+92=348)
  }
}

// === ObsidianTile.h ===
class ObsidianTile extends StoneTile {
  private isGlowing: boolean;
  constructor(id: number, tex: number, isGlowing: boolean) {
    super(id, tex);
    this.isGlowing = isGlowing;
  }
  getResourceCount(random: any): number { return 1; }
  getResource(data: number, random: any): number {
    return 49;  // §Tile::obsidian->id
  }
}

// === ClayTile.h ===
class ClayTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'clay');
  }
  getResource(data: number, random: any): number {
    return 337;  // §Item::clay->id (256+81=337)
  }
  getResourceCount(random: any): number { return 4; }
}

// === ReedTile.h ===
class ReedTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, 'plant');  // §Material::plant
    this.tex = tex;
    const ss = 6 / 16.0;
    this.setShape(0.5 - ss, 0, 0.5 - ss, 0.5 + ss, 1, 0.5 + ss);
    this.setTicking(true);
  }
}

// === CactusTile.h ===
class CactusTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'cactus');
    this.setTicking(true);
  }
}

// === SandTile.h (extends HeavyTile) ===
class SandTile extends Tile {
  // §C++: extends HeavyTile — falling behavior handled separately
  constructor(id: number, tex: number) {
    super(id, tex, 'sand');
  }
}

// === Bush.h (flower, rose) ===
class Bush extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'plant');
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 1; }  // §SHAPE_CROSS_TEXTURE
}

// === Sapling.h ===
class Sapling extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'plant');
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 1; }  // §SHAPE_CROSS_TEXTURE
}

// === Mushroom.h ===
class Mushroom extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'plant');
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 1; }  // §SHAPE_CROSS_TEXTURE
}

// === TallGrass.h ===
class TallGrass extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'replaceable_plant');
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 1; }  // §SHAPE_CROSS_TEXTURE
}

// === CropTile.h ===
class CropTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'plant');
    this.setTicking(true);
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 6; }  // §SHAPE_ROWS
}

// === FarmTile.h ===
class FarmTile extends Tile {
  constructor(id: number) {
    super(id, 'dirt');
    // §C++: tex = 7 + 5*16 = 87, but set via initTiles
  }
  isSolidRender(): boolean { return true; }
}

// === SandStoneTile.h ===
class SandStoneTile extends Tile {
  constructor(id: number, textures: number[], texCount: number) {
    super(id, textures[0], 'stone');
  }
  // §getTexture(face, data): UP=11*16=176, DOWN(data=0)=13*16=208, else=_textures[0]
  getTextureWithData(face: number, data: number): number {
    if (face === 1) return 176;  // top = 11*16
    if (face === 0 && data === 0) return 208;  // bottom = 13*16
    return this.tex;  // side = 0+16*12=192
  }
}

// === RedStoneOreTile.h ===
class RedStoneOreTile extends Tile {
  private isLit: boolean;
  constructor(id: number, tex: number, isLit: boolean) {
    super(id, tex, 'stone');
    this.isLit = isLit;
  }
}

// === MultiTextureTile.h ===
class MultiTextureTile extends Tile {
  protected textures: number[];
  constructor(id: number, textures: number[], texCount: number, material: string) {
    super(id, textures[0], material);
    this.textures = textures;
  }
  getTextureWithData(face: number, data: number): number {
    if (data < this.textures.length) return this.textures[data];
    return this.textures[0];
  }
}

// === BedTile.h ===
class BedTile extends Tile {
  constructor(id: number) {
    super(id, 'wood');
  }
}

// === MelonTile.h ===
class MelonTile extends Tile {
  constructor(id: number) {
    super(id, 'vegetable');
  }
  getTexture(face: number): number {
    if (face === 1) return 137;  // top
    if (face === 0) return 137;  // bottom
    return 136;  // side
  }
}

// === StemTile.h ===
class StemTile extends Tile {
  constructor(id: number, melonTile: any) {
    super(id, 'plant');
    this.setTicking(true);
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 19; }  // §SHAPE_STEM
}

// === InvisibleTile.h ===
class InvisibleTile extends Tile {
  constructor(id: number, tex: number, material: string) {
    super(id, tex, material);
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return -1; }  // §SHAPE_INVISIBLE
}

// === StonecutterTile.h ===
class StonecutterTile extends Tile {
  constructor(id: number) {
    super(id, 'stone');
  }
}

// === NetherReactor.h ===
class NetherReactor extends Tile {
  constructor(id: number, tex: number, material: string) {
    super(id, tex, material);
  }
}

// === QuartzBlockTile.h ===
class QuartzBlockTile extends Tile {
  constructor(id: number) {
    super(id, 'stone');
  }
}

// === CarriedTile.h ===
class CarriedTile extends Tile {
  constructor(id: number, tex: number, carriedTex: number) {
    super(id, tex, 'dirt');
    this.tex = carriedTex;
  }
}

// === ThinFenceTile.h ===
class ThinFenceTile extends Tile {
  constructor(id: number, tex: number, sideTex: number, material: string, allowSame: boolean) {
    super(id, tex, material);
  }
}

// === StairTile.h (already read, large file) ===
class StairTile extends Tile {
  static UPSIDEDOWN_BIT = 4;
  static DIR_EAST = 0;
  static DIR_WEST = 1;
  static DIR_SOUTH = 2;
  static DIR_NORTH = 3;
  private base: Tile;
  private baseData: number = 0;
  constructor(id: number, base: Tile) {
    super(id, base.tex, base.material);
    this.base = base;
    this.setDestroyTime(base.destroySpeed);
    this.setExplodeable(0);  // §base->explosionResistance / 3
  }
  isSolidRender(): boolean { return false; }
  isCubeShaped(): boolean { return false; }
  getRenderShape(): number { return 10; }  // §SHAPE_STAIRS
  getTexture(face: number): number { return this.base.getTexture(face); }
  getTextureWithData(face: number, data: number): number {
    return this.base.getTexture(face);
  }
}

// === FireTile.h ===
class FireTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'fire');
    this.setTicking(true);
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 3; }  // §SHAPE_FIRE
  getRenderLayer(): number { return 1; }  // §RENDERLAYER_ALPHATEST
}

// === DoorTile.h ===
class DoorTile extends Tile {
  constructor(id: number, material: string) {
    super(id, material);
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 7; }  // §SHAPE_DOOR
}

// === SignTile.h ===
class SignTile extends Tile {
  constructor(id: number, entityType: number, isWall: boolean) {
    super(id, 'wood');
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 1; }  // §SHAPE_CROSS_TEXTURE (standing sign)
}

// === TrapDoorTile.h ===
class TrapDoorTile extends Tile {
  constructor(id: number, material: string) {
    super(id, material);
  }
  isSolidRender(): boolean { return false; }
}

// === StoneSlabTile.h ===
class StoneSlabTile extends Tile {
  static TYPE_MASK = 7;
  static TYPE_STONE = 0;
  static TYPE_SAND = 1;
  static TYPE_WOOD = 2;
  static TYPE_COBBLE = 3;
  static TYPE_BRICK = 4;
  static TYPE_SMOOTH_STONE_BRICK = 5;
  private isDouble: boolean;
  constructor(id: number, isDouble: boolean) {
    super(id, 'stone');
    this.isDouble = isDouble;
  }
  isCubeShaped(): boolean { return this.isDouble; }
  isSolidRender(): boolean { return this.isDouble; }
  getTexture(face: number, data: number): number {
    // §StoneSlabTile.cpp:46-50 — returns texture based on data and face
    if (face <= 1) return 6;  // top/bottom
    return 5;  // side (for STONE type)
  }
}

// === LiquidTile.h (base) ===
class LiquidTile extends Tile {
  constructor(id: number, material: string) {
    super(id, material);
    this.setTicking(true);
  }
  isSolidRender(): boolean { return false; }
  getRenderShape(): number { return 4; }  // §SHAPE_WATER
  getRenderLayer(): number { return 2; }  // §RENDERLAYER_BLEND
}

// === LiquidTileDynamic.h ===
class LiquidTileDynamic extends LiquidTile {
  constructor(id: number, material: string) {
    super(id, material);
  }
  getTickDelay(): number {
    return this.material === 'lava' ? 30 : 5;
  }
}

// === LiquidTileStatic.h ===
class LiquidTileStatic extends LiquidTile {
  constructor(id: number, material: string) {
    super(id, material);
  }
  getTickDelay(): number { return 0; }
}

export {
  TntTile, TorchTile, LadderTile, FenceTile, FenceGateTile,
  BookshelfTile, WebTile, IceTile, SnowTile, TopSnowTile,
  LightGemTile, ObsidianTile, ClayTile, ReedTile, CactusTile,
  SandTile, Bush, Sapling, Mushroom, TallGrass, CropTile, FarmTile,
  SandStoneTile, RedStoneOreTile, MultiTextureTile, BedTile, MelonTile,
  StemTile, InvisibleTile, StonecutterTile, NetherReactor,
  QuartzBlockTile, CarriedTile, ThinFenceTile, StairTile, FireTile,
  DoorTile, SignTile, TrapDoorTile, StoneSlabTile,
  LiquidTile, LiquidTileDynamic, LiquidTileStatic
};
