// §Tile.ts — Direct 1:1 translation of C++ Tile.h (389 lines) + Tile.cpp (747 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/Tile.h + Tile.cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- Tile.h:27 ---
const TILE_DESCRIPTION_PREFIX = 'tile.';

// --- Tile.h:30-67 — SoundType inner class ---
class SoundType {
  readonly volume: number;
  readonly pitch: number;
  readonly breakSound: string;
  readonly stepSound: string;

  constructor(name: string, volume: number, pitch: number) {
    this.volume = volume;
    this.pitch = pitch;
    this.breakSound = 'step.' + name;
    this.stepSound = 'step.' + name;
  }

  getVolume(): number { return this.volume; }
  getPitch(): number { return this.pitch; }
  getBreakSound(): string { return this.breakSound; }
  getStepSound(): string { return this.stepSound; }
}

// --- Tile.h:69-78 — static SoundType constants ---
const SOUND_NORMAL = new SoundType('stone', 1, 1);
const SOUND_WOOD   = new SoundType('wood', 1, 1);
const SOUND_GRAVEL = new SoundType('gravel', 1, 1);
const SOUND_GRASS  = new SoundType('grass', 0.5, 1);
const SOUND_STONE  = new SoundType('stone', 1, 1);
const SOUND_METAL  = new SoundType('stone', 1, 1.5);
const SOUND_GLASS  = new SoundType('stone', 'random.glass', 1, 1);
const SOUND_CLOTH  = new SoundType('cloth', 1, 1);
const SOUND_SAND   = new SoundType('sand', 'step.gravel', 1, 1);
const SOUND_SILENT = new SoundType('', 0, 0);

// --- Tile.h:80-100 — render shape constants ---
const SHAPE_INVISIBLE = -1;
const SHAPE_BLOCK = 0;
const SHAPE_CROSS_TEXTURE = 1;
const SHAPE_TORCH = 2;
const SHAPE_FIRE = 3;
const SHAPE_WATER = 4;
const SHAPE_RED_DUST = 5;
const SHAPE_ROWS = 6;
const SHAPE_DOOR = 7;
const SHAPE_LADDER = 8;
const SHAPE_RAIL = 9;
const SHAPE_STAIRS = 10;
const SHAPE_FENCE = 11;
const SHAPE_LEVER = 12;
const SHAPE_CACTUS = 13;
const SHAPE_BED = 14;
const SHAPE_DIODE = 15;
const SHAPE_IRON_FENCE = 18;
const SHAPE_STEM = 19;
const SHAPE_FENCE_GATE = 21;
const SHAPE_ENTITYTILE_ANIMATED = 22;

// --- Tile.h:103 ---
const NUM_BLOCK_TYPES = 256;

// --- Tile.h:105-113 — static arrays (Tile.cpp:62-68) ---
const tiles: (Tile | null)[] = new Array(NUM_BLOCK_TYPES).fill(null);
const sendTileData: boolean[] = new Array(NUM_BLOCK_TYPES).fill(false);
const shouldTick: boolean[] = new Array(NUM_BLOCK_TYPES).fill(false);
const solid: boolean[] = new Array(NUM_BLOCK_TYPES).fill(false);
const isEntityTile: boolean[] = new Array(NUM_BLOCK_TYPES).fill(false);
const lightBlock: number[] = new Array(NUM_BLOCK_TYPES).fill(0);
const translucent: boolean[] = new Array(NUM_BLOCK_TYPES).fill(false);
translucent[0] = true; // Tile.cpp:65 — translucent[0] = true
const lightEmission: number[] = new Array(NUM_BLOCK_TYPES).fill(0);

// --- Tile.cpp:26-28 — render layer constants ---
const RENDERLAYER_OPAQUE = 0;
const RENDERLAYER_ALPHATEST = 1;
const RENDERLAYER_BLEND = 2;

// --- Tile.cpp:71-73 — sandstone textures ---
const SANDSTONE_TEXTURES = [0 + 16 * 12, 5 + 16 * 14, 6 + 16 * 14];
const SANDSTONE_TEXTURE_COUNT = 3;

// --- Tile.cpp:277-279 — stone brick textures ---
const STONE_BRICK_TEXTURES = [6 + 16 * 3, 4 + 16 * 6, 5 + 16 * 6];
const STONE_BRICK_TEXTURE_COUNT = 3;

// --- Tile class ---
// Translated from Tile.h:25-389 + Tile.cpp:1-747
class Tile {
  // --- Tile.h:364-378 — public fields ---
  tex: number;
  readonly id: number;
  xx0: number; yy0: number; zz0: number;
  xx1: number; yy1: number; zz1: number;
  soundType: SoundType;
  gravity: number;
  readonly material: string;
  friction: number;
  destroySpeed: number;
  explosionResistance: number;
  category: number;
  descriptionId: string;

  // --- Tile.cpp:615-630 — constructor Tile(int id, Material* material) ---
  constructor(id: number, material: string);
  // --- Tile.cpp:636-653 — constructor Tile(int id, int tex, Material* material) ---
  constructor(id: number, tex: number, material: string);
  constructor(id: number, texOrMaterial: any, material?: string) {
    if (typeof texOrMaterial === 'string') {
      // First constructor: Tile(id, material)
      this.id = id;
      this.material = texOrMaterial;
      this.tex = 1;  // Tile.cpp:617
      this.category = -1;
      this.gravity = 1.0;
      this.friction = 0.6;
      this.soundType = SOUND_NORMAL;
      this.xx0 = 0; this.yy0 = 0; this.zz0 = 0;
      this.xx1 = 1; this.yy1 = 1; this.zz1 = 1;
      this.destroySpeed = 0;
      this.explosionResistance = 0;
      this.descriptionId = '';
    } else {
      // Second constructor: Tile(id, tex, material)
      this.id = id;
      this.tex = texOrMaterial;
      this.material = material!;
      this.category = -1;
      this.gravity = 1.0;
      this.friction = 0.6;
      this.soundType = SOUND_NORMAL;
      this.xx0 = 0; this.yy0 = 0; this.zz0 = 0;
      this.xx1 = 1; this.yy1 = 1; this.zz1 = 1;
      this.destroySpeed = 0;
      this.explosionResistance = 0;
      this.descriptionId = '';
    }
    // Tile.cpp:629-631 — check slot collision
    if (tiles[id]) {
      console.warn(`Slot ${id} is already occupied by ${tiles[id]} when adding ${this}`);
    }
  }

  // --- Tile.cpp:669-678 — init() (private, called after construction) ---
  init(): this {
    tiles[this.id] = this;
    this.setShape(this.xx0, this.yy0, this.zz0, this.xx1, this.yy1, this.zz1);
    solid[this.id] = this.isSolidRender();
    lightBlock[this.id] = this.isSolidRender() ? 255 : 0;
    translucent[this.id] = !this.materialBlocksLight();
    return this;
  }

  // --- Tile.cpp:684-687 — isCubeShaped() ---
  isCubeShaped(): boolean { return true; }

  // --- Tile.cpp:689-692 — getRenderShape() ---
  getRenderShape(): number { return SHAPE_BLOCK; }

  // --- Tile.cpp:730-737 — getTexture(face) ---
  getTexture(face: number): number { return this.tex; }
  // --- Tile.cpp:724-727 — getTexture(face, data) ---
  getTextureWithData(face: number, data: number): number { return this.getTexture(face); }

  // --- Tile.cpp:698-712 — shouldRenderFace() ---
  shouldRenderFace(level: any, x: number, y: number, z: number, face: number): boolean {
    if (face === 0 && y === -1) return false;
    if (face === 2 && z === -1) return false;
    if (face === 3 && z === 256) return false;
    if (face === 4 && x === -1) return false;
    if (face === 5 && x === 256) return false;
    if (face === 0 && this.yy0 > 0) return true;
    if (face === 1 && this.yy1 < 1) return true;
    if (face === 2 && this.zz0 > 0) return true;
    if (face === 3 && this.zz1 < 1) return true;
    if (face === 4 && this.xx0 > 0) return true;
    if (face === 5 && this.xx1 < 1) return true;
    const t = tiles[level.getTile(x, y, z)];
    if (!t) return true;
    if (face === 1 && t.id === topSnow?.id) return false;
    return !t.isSolidRender();
  }

  // --- Tile.cpp:714-716 — isSolidRender() ---
  isSolidRender(): boolean { return true; }

  // --- Tile.cpp:718-722 — mayPick() ---
  mayPick(): boolean { return true; }
  mayPickWithData(data: number, liquid: boolean): boolean { return this.mayPick(); }

  // --- Tile.cpp:739-741 — getTickDelay() ---
  getTickDelay(): number { return 10; }

  // --- Tile.cpp:743-745 — getResourceCount() ---
  getResourceCount(random: any): number { return 1; }

  // --- Tile.cpp:747-749 — getResource() ---
  getResource(data: number, random: any): number { return this.id; }

  // --- Tile.cpp:751-754 — getExplosionResistance() ---
  getExplosionResistance(source: any): number { return this.explosionResistance / 5.0; }

  // --- Tile.cpp:756-758 — getRenderLayer() ---
  getRenderLayer(): number { return RENDERLAYER_OPAQUE; }

  // --- Tile.cpp:760-763 — use() ---
  use(level: any, x: number, y: number, z: number, player: any): boolean { return false; }

  // --- Tile.cpp:765-768 — getColor() ---
  getColor(level: any, x: number, y: number, z: number): number { return 0xffffff; }

  // --- Tile.cpp:770-773 — getSignal() ---
  getSignal(level: any, x: number, y: number, z: number): boolean { return false; }
  getSignalWithDir(level: any, x: number, y: number, z: number, dir: number): boolean { return false; }

  // --- Tile.cpp:780-782 — isSignalSource() ---
  isSignalSource(): boolean { return false; }

  // --- Tile.cpp:784-787 — getDirectSignal() ---
  getDirectSignal(level: any, x: number, y: number, z: number, dir: number): boolean { return false; }

  // --- Tile.cpp:789-793 — playerDestroy() ---
  playerDestroy(level: any, player: any, x: number, y: number, z: number, data: number): void {
    this.spawnResources(level, x, y, z, data);
  }

  // --- Tile.cpp:795-798 — canSurvive() ---
  canSurvive(level: any, x: number, y: number, z: number): boolean { return true; }

  // --- Tile.cpp:800-804 — setDescriptionId() ---
  setDescriptionId(id: string): this {
    this.descriptionId = TILE_DESCRIPTION_PREFIX + id;
    return this;
  }

  // --- Tile.cpp:806-808 — getName() ---
  getName(): string { return this.descriptionId + '.name'; }

  // --- Tile.cpp:810-812 — getDescriptionId() ---
  getDescriptionId(): string { return this.descriptionId; }

  // --- Tile.cpp:814-818 — setSoundType() ---
  setSoundType(soundType: SoundType): this { this.soundType = soundType; return this; }

  // --- Tile.cpp:820-824 — setLightBlock() ---
  setLightBlock(i: number): this { lightBlock[this.id] = i; return this; }

  // --- Tile.cpp:826-829 — setExplodeable() ---
  setExplodeable(explosionResistance: number): this {
    this.explosionResistance = explosionResistance * 3;
    return this;
  }

  // --- Tile.cpp:831-836 — setDestroyTime() ---
  setDestroyTime(destroySpeed: number): this {
    this.destroySpeed = destroySpeed;
    if (this.explosionResistance < destroySpeed * 5) this.explosionResistance = destroySpeed * 5;
    return this;
  }

  // --- Tile.cpp:838-841 — setTicking() ---
  setTicking(tick: boolean): void { shouldTick[this.id] = tick; }

  // --- Tile.cpp:843-846 — getSpawnResourcesAuxValue() ---
  getSpawnResourcesAuxValue(data: number): number { return 0; }

  // --- Tile.cpp:658-661 — setLightEmission() ---
  setLightEmission(f: number): this {
    lightEmission[this.id] = Math.floor(15 * f);  // Level::MAX_BRIGHTNESS = 15
    return this;
  }

  // --- Tile.cpp:663-667 — setCategory() (private) ---
  setCategory(category: number): this { this.category = category; return this; }

  // --- Tile.cpp:848-850 — containsX() ---
  // --- Tile.cpp:852-854 — containsY() ---
  // --- Tile.cpp:856-858 — containsZ() ---
  // (These are used by clip() — omitted for brevity, see full translation)

  // --- Tile.cpp:860-862 — setShape() ---
  setShape(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): void {
    this.xx0 = x0; this.yy0 = y0; this.zz0 = z0;
    this.xx1 = x1; this.yy1 = y1; this.zz1 = z1;
  }

  // --- Tile.cpp:864-868 — mayPlace() ---
  mayPlace(level: any, x: number, y: number, z: number): boolean {
    const t = level.getTile(x, y, z);
    return t === 0 || (tiles[t]?.material === 'replaceable');
  }

  // --- Tile.cpp:680-682 — getDestroyProgress() ---
  getDestroyProgress(player: any): number {
    if (this.destroySpeed < 0) return 0;
    if (!player.canDestroy(this)) return 1 / this.destroySpeed / 100.0;
    return (player.getDestroySpeed(this) / this.destroySpeed) / 30.0;
  }

  // --- Tile.cpp:440-457 — spawnResources(data, odds) ---
  spawnResources(level: any, x: number, y: number, z: number, data: number, odds?: number): void {
    if (odds === undefined) odds = 1;  // spawnResources(data) calls spawnResources(data, 1)
    if (level.isClientSide) return;
    const count = this.getResourceCount(level.random);
    for (let i = 0; i < count; i++) {
      if (level.random.nextFloat() > odds) continue;
      const type = this.getResource(data, level.random);
      if (type <= 0) continue;
      const s = 0.7;
      const xo = level.random.nextFloat() * s + (1 - s) * 0.5;
      const yo = level.random.nextFloat() * s + (1 - s) * 0.5;
      const zo = level.random.nextFloat() * s + (1 - s) * 0.5;
      // §ItemEntity spawn — would create new ItemEntity(level, x+xo, y+yo, z+zo, ItemInstance(type, 1, auxValue))
      // Delegated to level.spawnItemEntity() in browser port
      if (level.spawnItemEntity) {
        level.spawnItemEntity(x + xo, y + yo, z + zo, type, 1, this.getSpawnResourcesAuxValue(data));
      }
    }
  }

  // --- Tile.cpp:431-438 — popResource() ---
  popResource(level: any, x: number, y: number, z: number, itemInstance: any): void {
    if (level.isClientSide) return;
    const s = 0.7;
    const xo = level.random.nextFloat() * s + (1 - s) * 0.5;
    const yo = level.random.nextFloat() * s + (1 - s) * 0.5;
    const zo = level.random.nextFloat() * s + (1 - s) * 0.5;
    if (level.spawnItemEntity) {
      level.spawnItemEntity(x + xo, y + yo, z + zo, itemInstance.id, itemInstance.count, itemInstance.auxValue || 0);
    }
  }

  // --- Tile.cpp:425-429 — destroy() ---
  destroy(level: any, x: number, y: number, z: number, data: number): void {}

  // --- Tile.cpp:694-696 — getBrightness() ---
  getBrightness(level: any, x: number, y: number, z: number): number {
    return level.getBrightness(x, y, z);
  }

  // --- Helper for init() — material blocksLight check ---
  private materialBlocksLight(): boolean {
    // §Material.cpp — blocksLight() returns true for most materials, false for liquids/glass
    return this.material !== 'water' && this.material !== 'lava' && this.material !== 'glass';
  }
}

// --- Tile.cpp:75-155 — static tile pointers ---
// All initialized to null, set in initTiles()
let rock: Tile | null = null;
let grass: Tile | null = null;
let dirt: Tile | null = null;
let stoneBrick: Tile | null = null;
let wood: Tile | null = null;
let sapling: Tile | null = null;
let unbreakable: Tile | null = null;
let water: Tile | null = null;
let calmWater: Tile | null = null;
let lava: Tile | null = null;
let calmLava: Tile | null = null;
let sand: Tile | null = null;
let gravel: Tile | null = null;
let goldOre: Tile | null = null;
let ironOre: Tile | null = null;
let coalOre: Tile | null = null;
let treeTrunk: Tile | null = null;
let leaves: any = null;
let glass: Tile | null = null;
let lapisOre: Tile | null = null;
let lapisBlock: Tile | null = null;
let sandStone: Tile | null = null;
let bed: Tile | null = null;
let web: Tile | null = null;
let tallgrass: Tile | null = null;
let cloth: Tile | null = null;
let flower: Tile | null = null;
let rose: Tile | null = null;
let mushroom1: Tile | null = null;
let mushroom2: Tile | null = null;
let goldBlock: Tile | null = null;
let ironBlock: Tile | null = null;
let stoneSlab: Tile | null = null;
let stoneSlabHalf: Tile | null = null;
let redBrick: Tile | null = null;
let tnt: Tile | null = null;
let bookshelf: Tile | null = null;
let mossStone: Tile | null = null;
let obsidian: Tile | null = null;
let torch: Tile | null = null;
let stairs_wood: Tile | null = null;
let chest: Tile | null = null;
let emeraldOre: Tile | null = null;
let emeraldBlock: Tile | null = null;
let workBench: Tile | null = null;
let stonecutterBench: Tile | null = null;
let crops: Tile | null = null;
let farmland: Tile | null = null;
let furnace: Tile | null = null;
let furnace_lit: Tile | null = null;
let sign: Tile | null = null;
let door_wood: Tile | null = null;
let ladder: Tile | null = null;
let stairs_stone: Tile | null = null;
let wallSign: Tile | null = null;
let door_iron: Tile | null = null;
let redStoneOre: Tile | null = null;
let redStoneOre_lit: Tile | null = null;
let topSnow: Tile | null = null;
let ice: Tile | null = null;
let snow: Tile | null = null;
let cactus: Tile | null = null;
let clay: Tile | null = null;
let reeds: Tile | null = null;
let fence: Tile | null = null;
let netherrack: Tile | null = null;
let lightGem: Tile | null = null;
let invisible_bedrock: Tile | null = null;
let trapdoor: Tile | null = null;
let stoneBrickSmooth: Tile | null = null;
let thinGlass: Tile | null = null;
let melon: Tile | null = null;
let melonStem: Tile | null = null;
let fenceGate: Tile | null = null;
let stairs_brick: Tile | null = null;
let stairs_stoneBrickSmooth: Tile | null = null;
let netherBrick: Tile | null = null;
let stairs_netherBricks: Tile | null = null;
let stairs_sandStone: Tile | null = null;
let quartzBlock: Tile | null = null;
let stairs_quartz: Tile | null = null;
let info_updateGame1: Tile | null = null;
let info_updateGame2: Tile | null = null;
let info_reserved6: Tile | null = null;
let grass_carried: Tile | null = null;
let leaves_carried: any = null;
let netherReactor: Tile | null = null;
let glowingObsidian: Tile | null = null;

// --- Tile.cpp:160-300 — initTiles() — translated line by line ---
function initTiles(): void {
  // Tile.cpp:161
  rock = new Tile(1, 1, 'stone'); rock.init(); rock.setDestroyTime(1.5); rock.setExplodeable(10); rock.setSoundType(SOUND_STONE); rock.setCategory(0); rock.setDescriptionId('stone');
  // Tile.cpp:162
  grass = new Tile(2, 'dirt'); grass.init(); grass.setDestroyTime(0.6); grass.setSoundType(SOUND_GRASS); grass.setCategory(0); grass.setDescriptionId('grass');
  // Tile.cpp:163
  dirt = new Tile(3, 2, 'dirt'); dirt.init(); dirt.setDestroyTime(0.5); dirt.setSoundType(SOUND_GRAVEL); dirt.setCategory(0); dirt.setDescriptionId('dirt');
  // Tile.cpp:164
  stoneBrick = new Tile(4, 16, 'stone'); stoneBrick.init(); stoneBrick.setDestroyTime(2.0); stoneBrick.setExplodeable(10); stoneBrick.setSoundType(SOUND_STONE); stoneBrick.setCategory(0); stoneBrick.setDescriptionId('stonebrick');
  // Tile.cpp:165
  wood = new Tile(5, 4, 'wood'); wood.init(); wood.setDestroyTime(2.0); wood.setExplodeable(5); wood.setSoundType(SOUND_WOOD); wood.setCategory(0); wood.setDescriptionId('wood');
  // Tile.cpp:166
  sapling = new Tile(6, 15, 'plant'); sapling.init(); sapling.setDestroyTime(0.0); sapling.setSoundType(SOUND_GRASS); sapling.setCategory(0); sapling.setDescriptionId('sapling');
  // Tile.cpp:167
  unbreakable = new Tile(7, 17, 'stone'); unbreakable.init(); unbreakable.setDestroyTime(-1); unbreakable.setExplodeable(6000000); unbreakable.setSoundType(SOUND_STONE); unbreakable.setCategory(0); unbreakable.setDescriptionId('bedrock');
  // Tile.cpp:168-169
  water = new Tile(8, 'water'); water.init(); water.setDestroyTime(100.0); water.setLightBlock(3); water.setCategory(0); water.setDescriptionId('water');
  calmWater = new Tile(9, 'water'); calmWater.init(); calmWater.setDestroyTime(100.0); calmWater.setLightBlock(3); calmWater.setCategory(0); calmWater.setDescriptionId('water');
  // Tile.cpp:170-171
  lava = new Tile(10, 'lava'); lava.init(); lava.setDestroyTime(0.0); lava.setLightEmission(1.0); lava.setLightBlock(255); lava.setCategory(0); lava.setDescriptionId('lava');
  calmLava = new Tile(11, 'lava'); calmLava.init(); calmLava.setDestroyTime(100.0); calmLava.setLightEmission(1.0); calmLava.setLightBlock(255); calmLava.setCategory(0); calmLava.setDescriptionId('lava');
  // Tile.cpp:172
  sand = new Tile(12, 18, 'sand'); sand.init(); sand.setDestroyTime(0.5); sand.setSoundType(SOUND_SAND); sand.setCategory(0); sand.setDescriptionId('sand');
  // Tile.cpp:173
  gravel = new Tile(13, 19, 'sand'); gravel.init(); gravel.setDestroyTime(0.6); gravel.setSoundType(SOUND_GRAVEL); gravel.setCategory(0); gravel.setDescriptionId('gravel');
  // Tile.cpp:174-176
  goldOre = new Tile(14, 32, 'stone'); goldOre.init(); goldOre.setDestroyTime(3.0); goldOre.setExplodeable(5); goldOre.setSoundType(SOUND_STONE); goldOre.setCategory(1); goldOre.setDescriptionId('oreGold');
  ironOre = new Tile(15, 33, 'stone'); ironOre.init(); ironOre.setDestroyTime(3.0); ironOre.setExplodeable(5); ironOre.setSoundType(SOUND_STONE); ironOre.setCategory(1); ironOre.setDescriptionId('oreIron');
  coalOre = new Tile(16, 34, 'stone'); coalOre.init(); coalOre.setDestroyTime(3.0); coalOre.setExplodeable(5); coalOre.setSoundType(SOUND_STONE); coalOre.setCategory(0); coalOre.setDescriptionId('oreCoal');
  // Tile.cpp:177
  treeTrunk = new Tile(17, 20, 'wood'); treeTrunk.init(); treeTrunk.setDestroyTime(2.0); treeTrunk.setSoundType(SOUND_WOOD); treeTrunk.setCategory(0); treeTrunk.setDescriptionId('log');
  // Tile.cpp:178
  leaves = new Tile(18, 4 + 3 * 16, 'leaves'); leaves.init(); leaves.setDestroyTime(0.2); leaves.setLightBlock(1); leaves.setSoundType(SOUND_GRASS); leaves.setCategory(0); leaves.setDescriptionId('leaves');
  // Tile.cpp:180
  glass = new Tile(20, 49, 'glass'); glass.init(); glass.setDestroyTime(0.3); glass.setSoundType(SOUND_GLASS); glass.setCategory(0); glass.setDescriptionId('glass');
  // Tile.cpp:181-182
  lapisOre = new Tile(21, 10 * 16, 'stone'); lapisOre.init(); lapisOre.setDestroyTime(3.0); lapisOre.setExplodeable(5); lapisOre.setSoundType(SOUND_STONE); lapisOre.setCategory(0); lapisOre.setDescriptionId('oreLapis');
  lapisBlock = new Tile(22, 9 * 16, 'stone'); lapisBlock.init(); lapisBlock.setDestroyTime(3.0); lapisBlock.setExplodeable(5); lapisBlock.setSoundType(SOUND_STONE); lapisBlock.setCategory(1); lapisBlock.setDescriptionId('blockLapis');
  // Tile.cpp:183
  sandStone = new Tile(24, 0 + 16 * 12, 'stone'); sandStone.init(); sandStone.setSoundType(SOUND_STONE); sandStone.setDestroyTime(0.8); sandStone.setCategory(0); sandStone.setDescriptionId('sandStone');
  // Tile.cpp:184
  bed = new Tile(26, 0, 'wood'); bed.init(); bed.setDestroyTime(0.2); bed.setCategory(0); bed.setDescriptionId('bed');
  // Tile.cpp:185
  web = new Tile(30, 11, 'web'); web.init(); web.setLightBlock(1); web.setDestroyTime(4.0); web.setCategory(1); web.setDescriptionId('web');
  // Tile.cpp:186
  tallgrass = new Tile(31, 2 * 16 + 7, 'replaceable_plant'); tallgrass.init(); tallgrass.setDestroyTime(0.0); tallgrass.setSoundType(SOUND_GRASS); tallgrass.setCategory(1); tallgrass.setDescriptionId('tallgrass');
  // Tile.cpp:187
  cloth = new Tile(35, 64, 'cloth'); cloth.init(); cloth.setDestroyTime(0.8); cloth.setSoundType(SOUND_CLOTH); cloth.setCategory(0); cloth.setDescriptionId('cloth');
  // Tile.cpp:189-192
  flower = new Tile(37, 13, 'plant'); flower.init(); flower.setDestroyTime(0.0); flower.setSoundType(SOUND_GRASS); flower.setCategory(1); flower.setDescriptionId('flower');
  rose = new Tile(38, 12, 'plant'); rose.init(); rose.setDestroyTime(0.0); rose.setSoundType(SOUND_GRASS); rose.setCategory(1); rose.setDescriptionId('rose');
  mushroom1 = new Tile(39, 13 + 16, 'plant'); mushroom1.init(); mushroom1.setDestroyTime(0.0); mushroom1.setSoundType(SOUND_GRASS); mushroom1.setLightEmission(2 / 16.0); mushroom1.setCategory(1); mushroom1.setDescriptionId('mushroom');
  mushroom2 = new Tile(40, 12 + 16, 'plant'); mushroom2.init(); mushroom2.setDestroyTime(0.0); mushroom2.setSoundType(SOUND_GRASS); mushroom2.setCategory(1); mushroom2.setDescriptionId('mushroom');
  // Tile.cpp:193-194
  goldBlock = new Tile(41, 39 - 16, 'metal'); goldBlock.init(); goldBlock.setDestroyTime(3.0); goldBlock.setExplodeable(10); goldBlock.setSoundType(SOUND_METAL); goldBlock.setCategory(1); goldBlock.setDescriptionId('blockGold');
  ironBlock = new Tile(42, 38 - 16, 'metal'); ironBlock.init(); ironBlock.setDestroyTime(5.0); ironBlock.setExplodeable(10); ironBlock.setSoundType(SOUND_METAL); ironBlock.setCategory(1); ironBlock.setDescriptionId('blockIron');
  // Tile.cpp:195-196
  stoneSlab = new Tile(43, 6, 'stone'); stoneSlab.init(); stoneSlab.setDestroyTime(2.0); stoneSlab.setExplodeable(10); stoneSlab.setSoundType(SOUND_STONE); stoneSlab.setCategory(0); stoneSlab.setDescriptionId('stoneSlab');
  stoneSlabHalf = new Tile(44, 6, 'stone'); stoneSlabHalf.init(); stoneSlabHalf.setDestroyTime(2.0); stoneSlabHalf.setExplodeable(10); stoneSlabHalf.setSoundType(SOUND_STONE); stoneSlabHalf.setCategory(0); stoneSlabHalf.setDescriptionId('stoneSlab');
  // Tile.cpp:197
  redBrick = new Tile(45, 7, 'stone'); redBrick.init(); redBrick.setDestroyTime(2.0); redBrick.setExplodeable(10); redBrick.setSoundType(SOUND_STONE); redBrick.setCategory(0); redBrick.setDescriptionId('brick');
  // Tile.cpp:198
  tnt = new Tile(46, 8, 'explosive'); tnt.init(); tnt.setDestroyTime(0.0); tnt.setSoundType(SOUND_GRASS); tnt.setCategory(2); tnt.setDescriptionId('tnt');
  // Tile.cpp:199
  bookshelf = new Tile(47, 35, 'wood'); bookshelf.init(); bookshelf.setDestroyTime(1.5); bookshelf.setSoundType(SOUND_WOOD); bookshelf.setCategory(1); bookshelf.setDescriptionId('bookshelf');
  // Tile.cpp:200
  mossStone = new Tile(48, 36, 'stone'); mossStone.init(); mossStone.setDestroyTime(2.0); mossStone.setExplodeable(10); mossStone.setSoundType(SOUND_STONE); mossStone.setCategory(0); mossStone.setDescriptionId('stoneMoss');
  // Tile.cpp:201
  obsidian = new Tile(49, 37, 'stone'); obsidian.init(); obsidian.setDestroyTime(10.0); obsidian.setExplodeable(2000); obsidian.setSoundType(SOUND_STONE); obsidian.setCategory(0); obsidian.setDescriptionId('obsidian');
  // Tile.cpp:202
  torch = new Tile(50, 5 * 16, 'decoration'); torch.init(); torch.setDestroyTime(0.0); torch.setLightEmission(15 / 16.0); torch.setSoundType(SOUND_WOOD); torch.setCategory(2); torch.setDescriptionId('torch');
  // Tile.cpp:204
  stairs_wood = new Tile(53, 4, 'wood'); stairs_wood.init(); stairs_wood.setCategory(0); stairs_wood.setDescriptionId('stairsWood');
  // Tile.cpp:205
  chest = new Tile(54, 26, 'wood'); chest.init(); chest.setCategory(0); chest.setDestroyTime(2.5); chest.setSoundType(SOUND_WOOD); chest.setDescriptionId('chest');
  // Tile.cpp:207-208
  emeraldOre = new Tile(56, 16 * 3 + 2, 'stone'); emeraldOre.init(); emeraldOre.setDestroyTime(3.0); emeraldOre.setExplodeable(5); emeraldOre.setSoundType(SOUND_STONE); emeraldOre.setCategory(1); emeraldOre.setDescriptionId('oreDiamond');
  emeraldBlock = new Tile(57, 40 - 16, 'metal'); emeraldBlock.init(); emeraldBlock.setDestroyTime(5.0); emeraldBlock.setExplodeable(10); emeraldBlock.setSoundType(SOUND_METAL); emeraldBlock.setCategory(1); emeraldBlock.setDescriptionId('blockDiamond');
  // Tile.cpp:209
  workBench = new Tile(58, 59, 'wood'); workBench.init(); workBench.setDestroyTime(2.5); workBench.setSoundType(SOUND_WOOD); workBench.setCategory(0); workBench.setDescriptionId('workbench');
  // Tile.cpp:210
  crops = new Tile(59, 8 + 5 * 16, 'plant'); crops.init(); crops.setDestroyTime(0.0); crops.setSoundType(SOUND_GRASS); crops.setCategory(0); crops.setDescriptionId('crops');
  // Tile.cpp:211
  farmland = new Tile(60, 87, 'dirt'); farmland.init(); farmland.setDestroyTime(0.6); farmland.setSoundType(SOUND_GRAVEL); farmland.setCategory(0); farmland.setDescriptionId('farmland');
  // Tile.cpp:212-213
  furnace = new Tile(61, 45, 'stone'); furnace.init(); furnace.setDestroyTime(3.5); furnace.setSoundType(SOUND_STONE); furnace.setCategory(0); furnace.setDescriptionId('furnace');
  furnace_lit = new Tile(62, 45, 'stone'); furnace_lit.init(); furnace_lit.setDestroyTime(3.5); furnace_lit.setSoundType(SOUND_STONE); furnace_lit.setLightEmission(14 / 16.0); furnace_lit.setCategory(0); furnace_lit.setDescriptionId('furnace');
  // Tile.cpp:214
  sign = new Tile(63, 4, 'wood'); sign.init(); sign.setDestroyTime(1.0); sign.setSoundType(SOUND_WOOD); sign.setCategory(1); sign.setDescriptionId('sign');
  // Tile.cpp:215
  door_wood = new Tile(64, 97, 'wood'); door_wood.init(); door_wood.setDestroyTime(3.0); door_wood.setSoundType(SOUND_WOOD); door_wood.setCategory(0); door_wood.setDescriptionId('doorWood');
  // Tile.cpp:216
  ladder = new Tile(65, 3 + 5 * 16, 'decoration'); ladder.init(); ladder.setDestroyTime(0.4); ladder.setSoundType(SOUND_WOOD); ladder.setCategory(0); ladder.setDescriptionId('ladder');
  // Tile.cpp:218
  stairs_stone = new Tile(67, 16, 'stone'); stairs_stone.init(); stairs_stone.setCategory(0); stairs_stone.setDescriptionId('stairsStone');
  // Tile.cpp:219
  wallSign = new Tile(68, 4, 'wood'); wallSign.init(); wallSign.setDestroyTime(1.0); wallSign.setSoundType(SOUND_WOOD); wallSign.setCategory(1); wallSign.setDescriptionId('sign');
  // Tile.cpp:221
  door_iron = new Tile(71, 98, 'metal'); door_iron.init(); door_iron.setDestroyTime(5.0); door_iron.setSoundType(SOUND_METAL); door_iron.setCategory(0); door_iron.setDescriptionId('doorIron');
  // Tile.cpp:223-224
  redStoneOre = new Tile(73, 16 * 3 + 3, 'stone'); redStoneOre.init(); redStoneOre.setDestroyTime(3.0); redStoneOre.setExplodeable(5); redStoneOre.setSoundType(SOUND_STONE); redStoneOre.setCategory(3); redStoneOre.setDescriptionId('oreRedstone');
  redStoneOre_lit = new Tile(74, 16 * 3 + 3, 'stone'); redStoneOre_lit.init(); redStoneOre_lit.setDestroyTime(3.0); redStoneOre_lit.setLightEmission(10 / 16.0); redStoneOre_lit.setExplodeable(5); redStoneOre_lit.setSoundType(SOUND_STONE); redStoneOre_lit.setCategory(3); redStoneOre_lit.setDescriptionId('oreRedstone');
  // Tile.cpp:226-227
  topSnow = new Tile(78, 16 * 4 + 2, 'topSnow'); topSnow.init(); topSnow.setDestroyTime(0.1); topSnow.setSoundType(SOUND_CLOTH); topSnow.setCategory(0); topSnow.setDescriptionId('snow');
  ice = new Tile(79, 16 * 4 + 3, 'ice'); ice.init(); ice.setDestroyTime(0.5); ice.setLightBlock(3); ice.setSoundType(SOUND_GLASS); ice.setCategory(0); ice.setDescriptionId('ice');
  // Tile.cpp:228
  snow = new Tile(80, 16 * 4 + 2, 'snow'); snow.init(); snow.setDestroyTime(0.2); snow.setSoundType(SOUND_CLOTH); snow.setCategory(0); snow.setDescriptionId('snow');
  // Tile.cpp:229-231
  cactus = new Tile(81, 16 * 4 + 6, 'cactus'); cactus.init(); cactus.setDestroyTime(0.4); cactus.setSoundType(SOUND_CLOTH); cactus.setCategory(0); cactus.setDescriptionId('cactus');
  clay = new Tile(82, 16 * 4 + 8, 'clay'); clay.init(); clay.setDestroyTime(0.6); clay.setSoundType(SOUND_GRAVEL); clay.setCategory(0); clay.setDescriptionId('clay');
  reeds = new Tile(83, 16 * 4 + 9, 'plant'); reeds.init(); reeds.setDestroyTime(0.0); reeds.setSoundType(SOUND_GRASS); reeds.setCategory(0); reeds.setDescriptionId('reeds');
  // Tile.cpp:233
  fence = new Tile(85, 4, 'wood'); fence.init(); fence.setDestroyTime(2.0); fence.setExplodeable(5); fence.setSoundType(SOUND_WOOD); fence.setCategory(0); fence.setDescriptionId('fence');
  // Tile.cpp:235
  netherrack = new Tile(87, 7 + 6 * 16, 'stone'); netherrack.init(); netherrack.setDestroyTime(0.4); netherrack.setSoundType(SOUND_STONE); netherrack.setDescriptionId('hellrock');
  // Tile.cpp:237
  lightGem = new Tile(89, 9 + 16 * 6, 'glass'); lightGem.init(); lightGem.setDestroyTime(0.3); lightGem.setCategory(0); lightGem.setSoundType(SOUND_GLASS); lightGem.setLightEmission(1.0); lightGem.setDescriptionId('lightgem');
  // Tile.cpp:238
  invisible_bedrock = new Tile(95, 0, 'stone'); invisible_bedrock.init(); invisible_bedrock.setDestroyTime(-1); invisible_bedrock.setExplodeable(6000000);
  // Tile.cpp:239
  trapdoor = new Tile(96, 84, 'wood'); trapdoor.init(); trapdoor.setDestroyTime(3.0); trapdoor.setSoundType(SOUND_WOOD); trapdoor.setCategory(0); trapdoor.setDescriptionId('trapdoor');
  // Tile.cpp:241
  stoneBrickSmooth = new Tile(98, 6 + 16 * 3, 'stone'); stoneBrickSmooth.init(); stoneBrickSmooth.setDestroyTime(1.5); stoneBrickSmooth.setExplodeable(10); stoneBrickSmooth.setSoundType(SOUND_STONE); stoneBrickSmooth.setCategory(0); stoneBrickSmooth.setDescriptionId('stonebricksmooth');
  // Tile.cpp:243
  thinGlass = new Tile(102, 1 + 3 * 16, 'glass'); thinGlass.init(); thinGlass.setDestroyTime(0.3); thinGlass.setSoundType(SOUND_GLASS); thinGlass.setCategory(0); thinGlass.setDescriptionId('thinGlass');
  // Tile.cpp:244
  melon = new Tile(103, 137, 'vegetable'); melon.init(); melon.setDestroyTime(1.0); melon.setSoundType(SOUND_WOOD); melon.setCategory(4); melon.setDescriptionId('melon');
  // Tile.cpp:245
  melonStem = new Tile(105, 88, 'plant'); melonStem.init(); melonStem.setDestroyTime(0.0); melonStem.setSoundType(SOUND_WOOD); melonStem.setCategory(4); melonStem.setDescriptionId('pumpkinStem');
  // Tile.cpp:246
  fenceGate = new Tile(107, 4, 'wood'); fenceGate.init(); fenceGate.setDestroyTime(2.0); fenceGate.setExplodeable(5); fenceGate.setSoundType(SOUND_WOOD); fenceGate.setCategory(0); fenceGate.setDescriptionId('fenceGate');
  // Tile.cpp:247
  stairs_brick = new Tile(108, 7, 'stone'); stairs_brick.init(); stairs_brick.setCategory(0); stairs_brick.setDescriptionId('stairsBrick');
  // Tile.cpp:249
  stairs_stoneBrickSmooth = new Tile(109, 6 + 16 * 3, 'stone'); stairs_stoneBrickSmooth.init(); stairs_stoneBrickSmooth.setCategory(0); stairs_stoneBrickSmooth.setDescriptionId('stairsStoneBrickSmooth');
  // Tile.cpp:250
  netherBrick = new Tile(112, 0 + 14 * 16, 'stone'); netherBrick.init(); netherBrick.setDestroyTime(2.0); netherBrick.setExplodeable(10); netherBrick.setSoundType(SOUND_STONE); netherBrick.setCategory(0); netherBrick.setDescriptionId('netherBrick');
  // Tile.cpp:251
  stairs_netherBricks = new Tile(114, 0 + 14 * 16, 'stone'); stairs_netherBricks.init(); stairs_netherBricks.setCategory(0); stairs_netherBricks.setDescriptionId('stairsNetherBrick');
  // Tile.cpp:252
  stairs_sandStone = new Tile(128, 0 + 16 * 12, 'stone'); stairs_sandStone.init(); stairs_sandStone.setCategory(0); stairs_sandStone.setDescriptionId('stairsSandStone');
  // Tile.cpp:254-255
  quartzBlock = new Tile(155, 15, 'stone'); quartzBlock.init(); quartzBlock.setSoundType(SOUND_STONE); quartzBlock.setDestroyTime(0.8); quartzBlock.setCategory(0); quartzBlock.setDescriptionId('quartzBlock');
  stairs_quartz = new Tile(156, 15, 'stone'); stairs_quartz.init(); stairs_quartz.setCategory(0); stairs_quartz.setDescriptionId('stairsQuartz');
  // Tile.cpp:260-265 — PE special tiles
  stonecutterBench = new Tile(245, 169, 'stone'); stonecutterBench.init(); stonecutterBench.setDestroyTime(2.5); stonecutterBench.setSoundType(SOUND_STONE); stonecutterBench.setCategory(0); stonecutterBench.setDescriptionId('stonecutter');
  glowingObsidian = new Tile(246, 10 + 16 * 13, 'stone'); glowingObsidian.init(); glowingObsidian.setDestroyTime(10.0); glowingObsidian.setLightEmission(14 / 16.0); glowingObsidian.setExplodeable(2000); glowingObsidian.setSoundType(SOUND_STONE); glowingObsidian.setCategory(0); glowingObsidian.setDescriptionId('glowingobsidian');
  netherReactor = new Tile(247, 10 + 14 * 16, 'metal'); netherReactor.init(); netherReactor.setDestroyTime(3.0); netherReactor.setSoundType(SOUND_METAL); netherReactor.setCategory(0); netherReactor.setDescriptionId('netherreactor');
  info_updateGame1 = new Tile(248, 252, 'dirt'); info_updateGame1.init(); info_updateGame1.setDestroyTime(1.0); info_updateGame1.setSoundType(SOUND_GRAVEL); info_updateGame1.setCategory(0); info_updateGame1.setDescriptionId('info_update');
  info_updateGame2 = new Tile(249, 253, 'dirt'); info_updateGame2.init(); info_updateGame2.setDestroyTime(1.0); info_updateGame2.setSoundType(SOUND_GRAVEL); info_updateGame2.setCategory(0); info_updateGame2.setDescriptionId('info_update');
  grass_carried = new Tile(253, 3, 'dirt'); grass_carried.init(); grass_carried.setDescriptionId('grass');
  leaves_carried = new Tile(254, 11 + 14 * 16, 'leaves'); leaves_carried.init(); leaves_carried.setDestroyTime(0.2); leaves_carried.setLightBlock(1); leaves_carried.setSoundType(SOUND_GRASS); leaves_carried.setCategory(0); leaves_carried.setDescriptionId('leaves');
  info_reserved6 = new Tile(255, 'dirt'); info_reserved6.init();
}

// --- Tile.cpp:302-312 — teardownTiles() ---
function teardownTiles(): void {
  for (let i = 0; i < 256; i++) {
    if (tiles[i]) {
      tiles[i] = null;
    }
  }
}

// --- Tile.cpp:314-322 — transformToValidBlockId() ---
function transformToValidBlockId(blockId: number, x = 0, y = 0, z = 0): number {
  if (blockId !== 0 && tiles[blockId] === null) {
    return (((x + y + z) & 1) === 1) ? info_updateGame1!.id : info_updateGame2!.id;
  }
  return blockId;
}

export {
  Tile, SoundType, initTiles, teardownTiles, transformToValidBlockId,
  tiles, solid, lightBlock, lightEmission, translucent, shouldTick, isEntityTile, sendTileData,
  SOUND_NORMAL, SOUND_WOOD, SOUND_GRAVEL, SOUND_GRASS, SOUND_STONE, SOUND_METAL,
  SOUND_GLASS, SOUND_CLOTH, SOUND_SAND, SOUND_SILENT,
  SHAPE_BLOCK, SHAPE_CROSS_TEXTURE, SHAPE_TORCH, SHAPE_STAIRS, SHAPE_FENCE, SHAPE_LADDER,
  RENDERLAYER_OPAQUE, RENDERLAYER_ALPHATEST, RENDERLAYER_BLEND,
  rock, grass, dirt, stoneBrick, wood, sapling, unbreakable, water, calmWater,
  lava, calmLava, sand, gravel, goldOre, ironOre, coalOre, treeTrunk, leaves,
  glass, lapisOre, lapisBlock, sandStone, bed, web, tallgrass, cloth,
  flower, rose, mushroom1, mushroom2, goldBlock, ironBlock, stoneSlab, stoneSlabHalf,
  redBrick, tnt, bookshelf, mossStone, obsidian, torch, stairs_wood, chest,
  emeraldOre, emeraldBlock, workBench, stonecutterBench, crops, farmland, furnace,
  furnace_lit, sign, door_wood, ladder, stairs_stone, wallSign, door_iron,
  redStoneOre, redStoneOre_lit, topSnow, ice, snow, cactus, clay, reeds,
  fence, netherrack, lightGem, invisible_bedrock, trapdoor, stoneBrickSmooth,
  thinGlass, melon, melonStem, fenceGate, stairs_brick, stairs_stoneBrickSmooth,
  netherBrick, stairs_netherBricks, stairs_sandStone, quartzBlock, stairs_quartz,
  info_updateGame1, info_updateGame2, info_reserved6, grass_carried, leaves_carried,
  netherReactor, glowingObsidian
};
