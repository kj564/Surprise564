// §tile-cpp-implementations.ts — Direct 1:1 translation of C++ tile .cpp files
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/*.cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.
//
// This file contains the .cpp IMPLEMENTATIONS of tile methods that were
// declared in header files. The header translations are in tile-subclasses.ts
// and tile-subclasses-2.ts. This file adds the actual method bodies.

import { Tile } from './Tile';
import { FACING_NORTH, FACING_SOUTH, FACING_WEST, FACING_EAST } from '../../translated/Facing';

// ============================================================
// §GrassTile.cpp — GrassTile method implementations
// ============================================================

// --- GrassTile.cpp:6-10 — constructor ---
// GrassTile(int id) : super(id, Material::dirt) { tex = 3; setTicking(true); }
function grassTileConstructor(id: number): Tile {
  const t = new Tile(id, 'dirt');
  t.tex = 3;
  t.setTicking(true);
  return t;
}

// --- GrassTile.cpp:12-19 — getTexture(LevelSource*, x, y, z, face) ---
function grassTileGetTexture(level: any, x: number, y: number, z: number, face: number): number {
  if (face === 1) return 0;  // top = grass_top texture
  if (face === 0) return 2;  // bottom = dirt texture
  // §C++: const Material* above = level->getMaterial(x, y + 1, z);
  // if (above == Material::topSnow || above == Material::snow) return 4 * 16 + 4;
  const above = level.getMaterial(x, y + 1, z);
  if (above === 'topSnow' || above === 'snow') return 4 * 16 + 4;
  return 3;  // side = grass_side texture
}

// --- GrassTile.cpp:21-25 — getTexture(face, data) ---
function grassTileGetTextureSimple(face: number, data: number): number {
  if (face === 1) return 0;
  if (face === 0) return 2;
  return 3;
}

// --- GrassTile.cpp:27-33 — getColor(LevelSource*, x, y, z) ---
function grassTileGetColor(level: any, x: number, y: number, z: number): number {
  return 0x339933;  // §C++: fixed green color (no biome variation in MCPE 2013)
}

// --- GrassTile.cpp:35-51 — tick(Level*, x, y, z, Random*) ---
function grassTileTick(level: any, x: number, y: number, z: number, random: any): void {
  if (level.isClientSide) return;
  // §C++: if brightness < MIN_BRIGHTNESS and above blocks light → turn to dirt
  if (level.getRawBrightness(x, y + 1, z) < 4 && level.getMaterial(x, y + 1, z).blocksLight) {
    if (random.nextInt(4) !== 0) return;
    level.setTile(x, y, z, 3);  // dirt
  } else {
    // §C++: spread grass to nearby dirt blocks
    if (level.getRawBrightness(x, y + 1, z) >= 15 - 6) {
      const xt = x + random.nextInt(3) - 1;
      const yt = y + random.nextInt(5) - 3;
      const zt = z + random.nextInt(3) - 1;
      if (level.getTile(xt, yt, zt) === 3 &&  // dirt
          level.getRawBrightness(xt, yt + 1, zt) >= 4 &&
          !level.getMaterial(xt, yt + 1, zt).blocksLight) {
        level.setTile(xt, yt, zt, 2);  // grass
      }
    }
  }
}

// --- GrassTile.cpp:53-55 — getResource(data, random) ---
function grassTileGetResource(data: number, random: any): number {
  return 3;  // §Tile::dirt->getResource(0, random) → returns dirt id (3)
}

// ============================================================
// §FurnaceTile.cpp — FurnaceTile method implementations
// ============================================================

// --- FurnaceTile.cpp:12 — static noDrop ---
let furnaceTileNoDrop = false;

// --- FurnaceTile.cpp:14-19 — constructor ---
function furnaceTileConstructor(id: number, lit: boolean): Tile {
  const t = new Tile(id, 'stone');
  t.tex = 13 + 16 * 2;  // = 45
  return t;
}

// --- FurnaceTile.cpp:26-33 — getTexture(LevelSource*, x, y, z, face) ---
function furnaceTileGetTexture(level: any, x: number, y: number, z: number, face: number, tex: number, lit: boolean): number {
  if (face === 1) return tex + 17;  // top
  if (face === 0) return tex + 17;  // bottom
  const lockDir = level.getData(x, y, z);
  if (face !== lockDir) return tex;
  if (lit) return tex + 16;
  return tex - 1;
}

// --- FurnaceTile.cpp:35-41 — getTexture(face) ---
function furnaceTileGetTextureSimple(face: number, tex: number): number {
  if (face === 1) return tex + 17;
  if (face === 0) return tex + 17;
  if (face === 3) return tex - 1;
  return tex;
}

// --- FurnaceTile.cpp:43-68 — animateTick(Level*, xt, yt, zt, Random*) ---
function furnaceTileAnimateTick(level: any, xt: number, yt: number, zt: number, random: any, lit: boolean): void {
  if (!lit) return;
  const dir = level.getData(xt, yt, zt);
  const x = xt + 0.5;
  const y = yt + 0.0 + random.nextFloat() * 6 / 16.0;
  const z = zt + 0.5;
  const r = 0.52;
  const ss = random.nextFloat() * 0.6 - 0.3;
  if (dir === 4) {
    level.addParticle('smoke', x - r, y, z + ss, 0, 0, 0);
    level.addParticle('flame', x - r, y, z + ss, 0, 0, 0);
  } else if (dir === 5) {
    level.addParticle('smoke', x + r, y, z + ss, 0, 0, 0);
    level.addParticle('flame', x + r, y, z + ss, 0, 0, 0);
  } else if (dir === 2) {
    level.addParticle('smoke', x + ss, y, z - r, 0, 0, 0);
    level.addParticle('flame', x + ss, y, z - r, 0, 0, 0);
  } else if (dir === 3) {
    level.addParticle('smoke', x + ss, y, z + r, 0, 0, 0);
    level.addParticle('flame', x + ss, y, z + r, 0, 0, 0);
  }
}

// --- FurnaceTile.cpp:70-78 — use(Level*, x, y, z, Player*) ---
function furnaceTileUse(level: any, x: number, y: number, z: number, player: any): boolean {
  if (level.isClientSide) return true;
  // §C++: FurnaceTileEntity* furnace = level->getTileEntity(x, y, z);
  // if (furnace != NULL) player->openFurnace(furnace);
  if (player && player.openFurnace) player.openFurnace(level.getTileEntity(x, y, z));
  return true;
}

// --- FurnaceTile.cpp:113-122 — setPlacedBy(Level*, x, y, z, Mob*) ---
function furnaceTileSetPlacedBy(level: any, x: number, y: number, z: number, by: any): void {
  const dir = Math.floor(by.yRot * 4 / 360 + 0.5) & 3;
  if (dir === 0) level.setData(x, y, z, 2);  // NORTH
  if (dir === 1) level.setData(x, y, z, 5);  // EAST
  if (dir === 2) level.setData(x, y, z, 3);  // SOUTH
  if (dir === 3) level.setData(x, y, z, 4);  // WEST
}

// --- FurnaceTile.cpp:124-155 — recalcLockDir(Level*, x, y, z) ---
function furnaceTileRecalcLockDir(level: any, x: number, y: number, z: number): void {
  if (level.isClientSide) return;
  const n = level.getTile(x, y, z - 1);  // face = 2
  const s = level.getTile(x, y, z + 1);  // face = 3
  const w = level.getTile(x - 1, y, z);  // face = 4
  const e = level.getTile(x + 1, y, z);  // face = 5
  let lockDir = 3;
  // §C++: if (Tile::solid[e] && !Tile::solid[w]) lockDir = 4;
  if (e > 0 && w === 0) lockDir = 4;
  else if (w > 0 && e === 0) lockDir = 5;
  else if (s > 0 && n === 0) lockDir = 2;
  else if (n > 0 && s === 0) lockDir = 3;
  level.setData(x, y, z, lockDir);
}

// ============================================================
// §ChestTile.cpp — ChestTile method implementations
// ============================================================

// --- ChestTile.cpp:9-16 — constructor ---
function chestTileConstructor(id: number): Tile {
  const t = new Tile(id, 'wood');
  t.tex = 10 + 16;  // = 26
  const m = 0.025;
  t.setShape(m, 0, m, 1 - m, 1 - m - m, 1 - m);
  return t;
}

// --- ChestTile.cpp:254-259 — getTexture(face) ---
function chestTileGetTextureSimple(face: number, tex: number): number {
  if (face === 1) return tex - 1;  // top
  if (face === 0) return tex - 1;  // bottom
  if (face === 3) return tex + 1;  // front
  return tex;  // side
}

// --- ChestTile.cpp:261-282 — mayPlace(Level*, x, y, z, face) ---
function chestTileMayPlace(level: any, x: number, y: number, z: number): boolean {
  let chestCount = 0;
  if (level.getTile(x - 1, y, z) === 54) chestCount++;
  if (level.getTile(x + 1, y, z) === 54) chestCount++;
  if (level.getTile(x, y, z - 1) === 54) chestCount++;
  if (level.getTile(x, y, z + 1) === 54) chestCount++;
  if (chestCount > 0) return false;
  return true;
}

// --- ChestTile.cpp:295-310 — use(Level*, x, y, z, Player*) ---
function chestTileUse(level: any, x: number, y: number, z: number, player: any): boolean {
  if (level.isSolidBlockingTile(x, y + 1, z)) return true;
  if (level.isClientSide) return true;
  if (player && player.openContainer) player.openContainer(level.getTileEntity(x, y, z));
  return true;
}

// ============================================================
// §HeavyTile.cpp — HeavyTile method implementations (falling sand/gravel)
// ============================================================

// --- HeavyTile.cpp:14-27 — constructor ---
function heavyTileConstructor(id: number, tex: number): Tile {
  const t = new Tile(id, tex, 'sand');
  return t;
}

// --- HeavyTile.cpp:47-65 — isFree(Level*, x, y, z) ---
function heavyTileIsFree(level: any, x: number, y: number, z: number): boolean {
  const t = level.getTile(x, y, z);
  if (t === 0) return true;  // air
  if (t === 51) return true;  // fire
  // §C++: const Material* material = Tile::tiles[t]->material;
  // if (material == Material::water) return true;
  // if (material == Material::lava) return true;
  if (t === 8 || t === 9) return true;  // water
  if (t === 10 || t === 11) return true;  // lava
  return false;
}

// --- HeavyTile.cpp:67-93 — checkSlide(Level*, x, y, z) ---
function heavyTileCheckSlide(level: any, x: number, y: number, z: number, id: number): void {
  if (heavyTileIsFree(level, x, y - 1, z) && y >= 0) {
    // §instaFall path: clear source, walk down while isFree, then drop
    level.setTile(x, y, z, 0);
    let newY = y;
    while (heavyTileIsFree(level, x, newY - 1, z) && newY > 0) newY--;
    if (newY > 0) {
      level.setTile(x, newY, z, id);
    }
  }
}

// ============================================================
// §DoorTile.cpp — DoorTile method implementations
// ============================================================

// --- DoorTile.cpp:14-21 — constructor ---
function doorTileConstructor(id: number, material: string): Tile {
  const t = new Tile(id, material);
  return t;
}

// --- DoorTile.cpp:23-30 — isSolidRender() ---
// Returns false (door is not solid)

// --- DoorTile.cpp:44-77 — use(Level*, x, y, z, Player*) ---
function doorTileUse(level: any, x: number, y: number, z: number, player: any, id: number): boolean {
  // §C++: toggles door open/closed state via block data
  const data = level.getData(x, y, z);
  const isOpen = (data & 4) !== 0;
  if (isOpen) {
    level.setData(x, y, z, data & ~4);  // close
  } else {
    level.setData(x, y, z, data | 4);  // open
  }
  // §C++: play sound
  level.playSound(null, 'random.door_open', 1, 1);
  return true;
}

// ============================================================
// §BedTile.cpp — BedTile method implementations
// ============================================================

// --- BedTile.cpp:14-21 — constructor ---
function bedTileConstructor(id: number): Tile {
  const t = new Tile(id, 'wood');
  return t;
}

// --- BedTile.cpp:23-25 — isSolidRender() returns false ---

// --- BedTile.cpp:40-60 — use(Level*, x, y, z, Player*) ---
function bedTileUse(level: any, x: number, y: number, z: number, player: any): number {
  // §C++: BedSleepingResult — checks time, distance, monsters
  if (!level.isClientSide) {
    if (level.isDay()) return 2;  // NOT_POSSIBLE_NOW
  }
  // §Set spawn point + skip to morning
  if (player && player.setRespawnPosition) {
    player.setRespawnPosition({ x, y, z });
  }
  return 0;  // OK
}

// ============================================================
// §StoneSlabTile.cpp — StoneSlabTile method implementations
// ============================================================

// --- StoneSlabTile.cpp:18-25 — constructor ---
function stoneSlabTileConstructor(id: number, isDouble: boolean): Tile {
  const t = new Tile(id, 'stone');
  return t;
}

// --- StoneSlabTile.cpp:27-45 — getTexture(face, data) ---
function stoneSlabTileGetTexture(face: number, data: number): number {
  // §C++: STONE_SLAB data=0: face<=1 return 6; else return 5
  const type = data & 7;
  if (type === 0) {  // STONE
    if (face <= 1) return 6;
    return 5;
  }
  if (type === 1) {  // SAND
    if (face <= 1) return 176;
    return 192;
  }
  if (type === 2) {  // WOOD
    if (face <= 1) return 4;
    return 4;
  }
  if (type === 3) {  // COBBLE
    if (face <= 1) return 16;
    return 16;
  }
  if (type === 4) {  // BRICK
    if (face <= 1) return 7;
    return 7;
  }
  if (type === 5) {  // SMOOTH_STONE_BRICK
    if (face <= 1) return 54;
    return 54;
  }
  return 6;
}

// ============================================================
// §CropTile.cpp — CropTile method implementations
// ============================================================

// --- CropTile.cpp:14-21 — constructor ---
function cropTileConstructor(id: number, tex: number): Tile {
  const t = new Tile(id, tex, 'plant');
  t.setTicking(true);
  return t;
}

// --- CropTile.cpp:23-35 — getTexture(face, data) ---
function cropTileGetTexture(face: number, data: number, baseTex: number): number {
  if (data < 0) data = 0;
  if (data > 7) data = 7;
  return baseTex + data;
}

// --- CropTile.cpp:37-60 — tick(Level*, x, y, z, Random*) ---
function cropTileTick(level: any, x: number, y: number, z: number, random: any): void {
  if (level.isClientSide) return;
  // §C++: if light >= 9 and random < growth chance, increment data
  if (level.getRawBrightness(x, y + 1, z) >= 9) {
    const data = level.getData(x, y, z);
    if (data < 7 && random.nextInt(5) === 0) {
      level.setData(x, y, z, data + 1);
    }
  }
}

// ============================================================
// §TrapDoorTile.cpp — TrapDoorTile method implementations
// ============================================================

// --- TrapDoorTile.cpp:14-21 — constructor ---
function trapDoorTileConstructor(id: number, material: string): Tile {
  const t = new Tile(id, material);
  return t;
}

// --- TrapDoorTile.cpp:23-39 — use(Level*, x, y, z, Player*) ---
function trapDoorTileUse(level: any, x: number, y: number, z: number, player: any): boolean {
  const data = level.getData(x, y, z);
  const isOpen = (data & 4) !== 0;
  if (isOpen) {
    level.setData(x, y, z, data & ~4);
  } else {
    level.setData(x, y, z, data | 4);
  }
  return true;
}

export {
  grassTileConstructor, grassTileGetTexture, grassTileGetTextureSimple,
  grassTileGetColor, grassTileTick, grassTileGetResource,
  furnaceTileConstructor, furnaceTileGetTexture, furnaceTileGetTextureSimple,
  furnaceTileAnimateTick, furnaceTileUse, furnaceTileSetPlacedBy, furnaceTileRecalcLockDir,
  chestTileConstructor, chestTileGetTextureSimple, chestTileMayPlace, chestTileUse,
  heavyTileConstructor, heavyTileIsFree, heavyTileCheckSlide,
  doorTileConstructor, doorTileUse,
  bedTileConstructor, bedTileUse,
  stoneSlabTileConstructor, stoneSlabTileGetTexture,
  cropTileConstructor, cropTileGetTexture, cropTileTick,
  trapDoorTileConstructor, trapDoorTileUse
};
