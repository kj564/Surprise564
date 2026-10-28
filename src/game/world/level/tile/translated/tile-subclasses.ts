// §tile-subclasses.ts — Direct 1:1 translation of C++ tile subclass headers
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Tile } from './Tile';

// === HalfTransparentTile.h ===
// --- HalfTransparentTile.h:10-39 ---
class HalfTransparentTile extends Tile {
  protected allowSame: boolean;

  constructor(id: number, tex: number, material: string, allowSame: boolean) {
    super(id, tex, material);
    this.allowSame = allowSame;
  }

  // --- HalfTransparentTile.h:24-26 — getRenderLayer() ---
  getRenderLayer(): number { return 1; }  // §RENDERLAYER_BLEND

  // --- HalfTransparentTile.h:28-30 — isSolidRender() ---
  isSolidRender(): boolean { return false; }

  // --- HalfTransparentTile.h:32-36 — shouldRenderFace() ---
  shouldRenderFace(level: any, x: number, y: number, z: number, face: number): boolean {
    const id = level.getTile(x, y, z);
    if (!this.allowSame && id === this.id) return false;
    return super.shouldRenderFace(level, x, y, z, face);
  }
}

// === TransparentTile.h ===
// --- TransparentTile.h:11-41 ---
class TransparentTile extends Tile {
  protected allowSame: boolean;

  constructor(id: number, tex: number, material: string, allowSame: boolean) {
    super(id, tex, material);
    this.allowSame = allowSame;
  }

  // --- TransparentTile.h:28-31 — isSolidRender() ---
  isSolidRender(): boolean { return false; }

  // --- TransparentTile.h:33-39 — shouldRenderFace() ---
  shouldRenderFace(level: any, x: number, y: number, z: number, face: number): boolean {
    const id = level.getTile(x, y, z);
    if (!this.allowSame && id === this.id) return false;
    return super.shouldRenderFace(level, x, y, z, face);
  }
}

// === StoneTile.h ===
// --- StoneTile.h:10-20 ---
class StoneTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'stone');  // §Material::stone
  }

  // --- StoneTile.h:17-19 — getResource() returns stoneBrick (cobblestone) ---
  getResource(data: number, random: any): number {
    return 4;  // §Tile::stoneBrick->id
  }
}

// === DirtTile.h ===
// --- DirtTile.h:10-18 ---
class DirtTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'dirt');  // §Material::dirt
  }
}

// === OreTile.h ===
// --- OreTile.h:14-39 ---
class OreTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, tex, 'stone');  // §Material::stone
  }

  // --- OreTile.h:17-23 — getResource() ---
  getResource(data: number, random: any): number {
    if (this.id === 16) return 263;  // §coalOre → Item::coal->id (256+7=263)
    if (this.id === 56) return 264;  // §emeraldOre → Item::emerald->id (256+8=264)
    if (this.id === 21) return 351;   // §lapisOre → Item::dye_powder->id (256+95=351)
    return this.id;
  }

  // --- OreTile.h:25-28 — getResourceCount() ---
  getResourceCount(random: any): number {
    if (this.id === 21) return 4 + random.nextInt(5);  // §lapisOre → 4+rand(5)
    return 1;
  }

  // --- OreTile.h:34-38 — getSpawnResourcesAuxValue() ---
  getSpawnResourcesAuxValue(data: number): number {
    // §lapis spawns blue dye (DyePowderItem::BLUE = 4)
    if (this.id === 21) return 4;
    return 0;
  }
}

// === MetalTile.h ===
// --- MetalTile.h:9-20 ---
class MetalTile extends Tile {
  constructor(id: number, tex: number) {
    super(id, 'metal');  // §Material::metal
    this.tex = tex;
  }

  // --- MetalTile.h:16-18 — getTexture() ---
  getTexture(face: number): number {
    return this.tex;
  }
}

// === GlassTile.h ===
// --- GlassTile.h:12-26 ---
class GlassTile extends HalfTransparentTile {
  constructor(id: number, tex: number, material: string, allowSame: boolean) {
    super(id, tex, material, allowSame);
  }

  // --- GlassTile.h:19-21 — getResourceCount() returns 0 ---
  getResourceCount(random: any): number { return 0; }

  // --- GlassTile.h:23-25 — getRenderLayer() ---
  getRenderLayer(): number { return 1; }  // §RENDERLAYER_ALPHATEST
}

// === TreeTile.h ===
// --- TreeTile.h:14-16 — static constants ---
const NORMAL_TRUNK = 0;
const DARK_TRUNK = 1;
const BIRCH_TRUNK = 2;

// --- TreeTile.h:18-68 ---
class TreeTile extends Tile {
  constructor(id: number) {
    super(id, 'wood');  // §Material::wood
    this.tex = 20;
  }

  // --- TreeTile.h:28-30 — getResourceCount() ---
  getResourceCount(random: any): number { return 1; }

  // --- TreeTile.h:32-34 — getResource() ---
  getResource(data: number, random: any): number {
    return 17;  // §Tile::treeTrunk->id
  }

  // --- TreeTile.h:48-62 — getTexture(face, data) ---
  getTextureWithData(face: number, data: number): number {
    if (face === 1) return 21;  // top
    if (face === 0) return 21;  // bottom
    if (data === DARK_TRUNK) return 4 + 7 * 16;   // dark wood side
    if (data === BIRCH_TRUNK) return 5 + 7 * 16;  // birch wood side
    return 20;  // normal wood side
  }

  // --- TreeTile.h:64-67 — getSpawnResourcesAuxValue() ---
  getSpawnResourcesAuxValue(data: number): number {
    return data;
  }
}

// === LeafTile.h ===
// --- LeafTile.h:21-26 — static constants ---
const LEAF_TYPE_MASK = 3;
const REQUIRED_WOOD_RANGE = 4;
const PERSISTENT_LEAF_BIT = 8;
const UPDATE_LEAF_BIT = 4;
const NORMAL_LEAF = 0;
const EVERGREEN_LEAF = 1;
const BIRCH_LEAF = 2;

// --- LeafTile.h:28-175 ---
class LeafTile extends TransparentTile {
  private oTex: number;
  private checkBuffer: Int32Array | null = null;

  constructor(id: number, tex: number) {
    super(id, tex, 'leaves', false);  // §Material::leaves, allowSame=false
    this.oTex = tex;
    this.setTicking(true);
  }

  // --- LeafTile.h:44-46 — getRenderLayer() ---
  getRenderLayer(): number {
    return this.isSolidRender() ? 0 : 1;  // OPAQUE or ALPHATEST
  }

  // --- LeafTile.h:87-97 — isSolidRender() ---
  isSolidRender(): boolean {
    return !this.allowSame;
  }

  // --- LeafTile.h:114-123 — getTexture(face, data) ---
  getTextureWithData(face: number, data: number): number {
    if ((data & LEAF_TYPE_MASK) === EVERGREEN_LEAF) {
      return this.tex + 5 * 16;  // §C++: tex + 5*16 or tex - 16 depending on type
    }
    return this.tex;
  }

  // --- LeafTile.h:125-129 — setFancy(bool) ---
  setFancy(fancyGraphics: boolean): void {
    this.allowSame = fancyGraphics;
    this.tex = this.oTex + (fancyGraphics ? 0 : 1);
  }

  // --- LeafTile.h:99-103 — getResourceCount() ---
  getResourceCount(random: any): number {
    return random.nextInt(20) === 0 ? 1 : 0;
  }

  // --- LeafTile.h:105-107 — getResource() ---
  getResource(data: number, random: any): number {
    return 6;  // §Tile::sapling->id
  }

  // --- LeafTile.h:157-161 — getSpawnResourcesAuxValue() ---
  getSpawnResourcesAuxValue(data: number): number {
    return data & LEAF_TYPE_MASK;
  }
}

// === GravelTile.h ===
// --- GravelTile.h:13-24 ---
class GravelTile extends Tile {
  // §C++: extends HeavyTile — but we use Tile directly since HeavyTile
  //       falling behavior is handled separately in tickFallingBlocks()
  constructor(type: number, tex: number) {
    super(type, tex, 'sand');  // §Material::sand (HeavyTile uses sand)
  }

  // --- GravelTile.h:19-22 — getResource() ---
  getResource(data: number, random: any): number {
    if (random.nextInt(10) === 0) return 318;  // §Item::flint->id (256+62=318)
    return this.id;
  }
}

export {
  HalfTransparentTile, TransparentTile,
  StoneTile, DirtTile, OreTile, MetalTile, GlassTile,
  TreeTile, LeafTile, GravelTile,
  NORMAL_TRUNK, DARK_TRUNK, BIRCH_TRUNK,
  LEAF_TYPE_MASK, REQUIRED_WOOD_RANGE, PERSISTENT_LEAF_BIT, UPDATE_LEAF_BIT,
  NORMAL_LEAF, EVERGREEN_LEAF, BIRCH_LEAF
};
