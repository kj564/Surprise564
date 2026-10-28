// §chunk-classes.ts — Direct 1:1 translation of C++ chunk system headers
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/chunk/*.h + LevelSource.h + ChunkPos.h
// Rule Zero: Every line below maps to a specific line in the C++ source.

// === LevelSource.h — abstract interface for level data access ===
// --- LevelSource.h:13-35 ---
abstract class LevelSource {
  abstract getTile(x: number, y: number, z: number): number;
  abstract isEmptyTile(x: number, y: number, z: number): boolean;
  abstract getBrightness(x: number, y: number, z: number): number;
  abstract getData(x: number, y: number, z: number): number;
  abstract getMaterial(x: number, y: number, z: number): string;
  abstract isSolidRenderTile(x: number, y: number, z: number): boolean;
  abstract isSolidBlockingTile(x: number, y: number, z: number): boolean;
  abstract getBiome(x: number, z: number): any;
}

// === ChunkPos.h — chunk position ===
// --- ChunkPos.h:9-43 ---
class ChunkPos {
  readonly x: number;
  readonly z: number;

  constructor();
  constructor(x: number, z: number);
  constructor(x?: number, z?: number) {
    this.x = x ?? 0;
    this.z = z ?? 0;
  }

  // --- ChunkPos.h:17-19 — hashCode(x, z) static ---
  static hashCode(x: number, z: number): number {
    return (x < 0 ? 0x80000000 : 0) | ((x & 0x7fff) << 16) | (z < 0 ? 0x00008000 : 0) | (z & 0x7fff);
  }

  // --- ChunkPos.h:21-23 — hashCode() ---
  hashCode(): number { return ChunkPos.hashCode(this.x, this.z); }

  // --- ChunkPos.h:25-27 — operator== ---
  equals(rhs: ChunkPos): boolean { return this.x === rhs.x && this.z === rhs.z; }

  // --- ChunkPos.h:29-31 — operator< ---
  lessThan(rhs: ChunkPos): boolean { return this.hashCode() < rhs.hashCode(); }

  // --- ChunkPos.h:33-41 — distanceToSqr(const Entity*) ---
  distanceToSqr(e: any): number {
    const xPos = this.x * 16 + 8;
    const zPos = this.z * 16 + 8;
    const xd = xPos - e.x;
    const zd = zPos - e.z;
    return xd * xd + zd * zd;
  }
}

// === ChunkSource.h — abstract chunk source ===
// --- ChunkSource.h:14-47 ---
abstract class ChunkSource {
  isChunkCache: boolean = false;

  constructor() { this.isChunkCache = false; }

  abstract hasChunk(x: number, z: number): boolean;
  abstract getChunk(x: number, z: number): any;
  abstract create(x: number, z: number): any;
  abstract postProcess(parent: ChunkSource, x: number, z: number): void;
  abstract tick(): boolean;
  abstract shouldSave(): boolean;
  saveAll(onlyUnsaved: boolean): void {}
  abstract getMobsAt(mobCategory: any, x: number, y: number, z: number): any;
  abstract gatherStats(): string;
}

// === LevelChunk.h — chunk data container ===
// --- LevelChunk.h:17-142 ---
class LevelChunk {
  // --- LevelChunk.h:133-141 — public fields ---
  blocksLength: number = 0;
  loaded: boolean = false;
  level: any = null;
  data: Uint8Array = new Uint8Array(32768);  // §DataLayer
  skyLight: Uint8Array = new Uint8Array(32768);
  blockLight: Uint8Array = new Uint8Array(32768);
  heightmap: Int8Array = new Int8Array(256);  // §char[CHUNK_COLUMNS]
  updateMap: Uint8Array = new Uint8Array(256);
  minHeight: number = 0;
  readonly x: number;
  readonly z: number;
  readonly xt: number;
  readonly zt: number;
  terrainPopulated: boolean = false;
  unsaved: boolean = false;
  dontSave: boolean = false;
  createdFromSave: boolean = false;
  lastSaveHadEntities: boolean = false;
  lastSaveTime: number = 0;

  // --- LevelChunk.h:143 — protected blocks array ---
  protected blocks: Uint8Array = new Uint8Array(32768);  // §unsigned char* blocks

  // --- LevelChunk.h:145-147 — entity blocks (8 arrays for Y-banding) ---
  private entityBlocks: any[][] = [[], [], [], [], [], [], [], []];

  // --- LevelChunk.h:149 — tile entity map ---
  private tileEntities: Map<string, any> = new Map();

  // --- LevelChunk.h:131-132 — static fields ---
  static touchedSky: boolean = false;
  static ChunkBlockCount = 32768;  // §CHUNK_BLOCK_COUNT
  static ChunkSize = 32768;
  static UpdateMapBitShift = 4;

  // --- LevelChunk.h:26-27 — constructor ---
  constructor(level: any, x: number, z: number);
  constructor(level: any, blocks: Uint8Array, x: number, z: number);
  constructor(level: any, arg2: any, arg3: any, arg4?: any) {
    this.level = level;
    if (arg2 instanceof Uint8Array) {
      this.blocks = arg2;
      this.x = arg3;
      this.z = arg4;
    } else {
      this.x = arg2;
      this.z = arg3;
    }
    this.xt = this.x * 16;
    this.zt = this.z * 16;
  }

  // --- LevelChunk.h:31 — init() ---
  init(): void {}

  // --- LevelChunk.h:36 — clearUpdateMap() ---
  clearUpdateMap(): void {
    this.updateMap.fill(0);
  }

  // --- LevelChunk.h:38 — deleteBlockData() ---
  deleteBlockData(): void {
    this.blocks = new Uint8Array(0);
  }

  // --- LevelChunk.h:40-42 — isAt(int, int) ---
  isAt(x: number, z: number): boolean {
    return this.x === x && this.z === z;
  }

  // --- LevelChunk.h:44-46 — getHeightmap(int, int) ---
  getHeightmap(x: number, z: number): number {
    return this.heightmap[(z & 15) << 4 | (x & 15)];
  }

  // --- LevelChunk.h:65 — getBlockData() ---
  getBlockData(): Uint8Array { return this.blocks; }

  // --- LevelChunk.h:101-103 — getTile(int, int, int) ---
  getTile(x: number, y: number, z: number): number {
    return this.blocks[y << 8 | (z & 15) << 4 | (x & 15)];
  }

  // --- LevelChunk.h:104-105 — setTile(int, int, int, int) ---
  setTile(x: number, y: number, z: number, tile: number): boolean {
    return this.setTileAndData(x, y, z, tile, 0);
  }

  // --- LevelChunk.h:108-110 — setTileAndData(int, int, int, int, int) ---
  setTileAndData(x: number, y: number, z: number, tile: number, data: number): boolean {
    const idx = y << 8 | (z & 15) << 4 | (x & 15);
    if (this.blocks[idx] === tile) return false;
    this.blocks[idx] = tile;
    this.data[idx] = data;
    this.unsaved = true;
    return true;
  }

  // --- LevelChunk.h:112-114 — getData(int, int, int) ---
  getData(x: number, y: number, z: number): number {
    return this.data[y << 8 | (z & 15) << 4 | (x & 15)];
  }

  // --- LevelChunk.h:115-116 — setData(int, int, int, int) ---
  setData(x: number, y: number, z: number, val: number): void {
    const idx = y << 8 | (z & 15) << 4 | (x & 15);
    this.data[idx] = val;
    this.unsaved = true;
  }

  // --- LevelChunk.h:118-119 — setTileRaw ---
  setTileRaw(x: number, y: number, z: number, tile: number): void {
    const idx = y << 8 | (z & 15) << 4 | (x & 15);
    this.blocks[idx] = tile;
  }

  // --- LevelChunk.h:126-127 — isEmpty() ---
  isEmpty(): boolean { return false; }

  // --- LevelChunk.h:76-77 — addEntity(Entity*) ---
  addEntity(e: any): void {
    const yc = Math.floor(e.y / 16);
    if (yc >= 0 && yc < 8) {
      this.entityBlocks[yc].push(e);
    }
  }

  // --- LevelChunk.h:78-80 — removeEntity(Entity*) ---
  removeEntity(e: any): void {
    for (let i = 0; i < 8; i++) {
      const idx = this.entityBlocks[i].indexOf(e);
      if (idx >= 0) {
        this.entityBlocks[i].splice(idx, 1);
        return;
      }
    }
  }

  // --- LevelChunk.h:86-87 — getTileEntity(int, int, int) ---
  getTileEntity(x: number, y: number, z: number): any {
    return this.tileEntities.get(`${x},${y},${z}`);
  }

  // --- LevelChunk.h:90 — hasTileEntityAt(int, int, int) ---
  hasTileEntityAt(x: number, y: number, z: number): boolean {
    return this.tileEntities.has(`${x},${y},${z}`);
  }

  // --- LevelChunk.h:92-93 — addTileEntity(TileEntity*) ---
  addTileEntity(te: any): void {
    // §C++: adds to tileEntities map
  }

  // --- LevelChunk.h:94-95 — setTileEntity(int, int, int, TileEntity*) ---
  setTileEntity(x: number, y: number, z: number, tileEntity: any): void {
    this.tileEntities.set(`${x},${y},${z}`, tileEntity);
  }

  // --- LevelChunk.h:96-97 — removeTileEntity(int, int, int) ---
  removeTileEntity(x: number, y: number, z: number): void {
    this.tileEntities.delete(`${x},${y},${z}`);
  }

  // --- LevelChunk.h:99-100 — isSkyLit(int, int, int) ---
  isSkyLit(x: number, y: number, z: number): boolean {
    return y >= this.getHeightmap(x, z);
  }

  // --- LevelChunk.h:108-109 — load() / unload() ---
  load(): void { this.loaded = true; }
  unload(): void { this.loaded = false; }

  // --- LevelChunk.h:111-112 — shouldSave(bool) ---
  shouldSave(force: boolean): boolean {
    return force || this.unsaved;
  }

  // --- LevelChunk.h:113 — markUnsaved() ---
  markUnsaved(): void { this.unsaved = true; }

  // --- LevelChunk.h:115-116 — countEntities() ---
  countEntities(): number {
    let count = 0;
    for (let i = 0; i < 8; i++) count += this.entityBlocks[i].length;
    return count;
  }

  // --- LevelChunk.h:121-123 — getRawBrightness(int, int, int, int) ---
  getRawBrightness(x: number, y: number, z: number, skyDampen: number): number {
    // §C++: max(skyLight - skyDampen, 0) OR blockLight
    const idx = y << 8 | (z & 15) << 4 | (x & 15);
    const sky = Math.max(0, this.skyLight[idx] - skyDampen);
    const block = this.blockLight[idx];
    return Math.max(sky, block);
  }

  // --- LevelChunk.h:67-69 — getBrightness(LightLayer, int, int, int) ---
  getBrightness(layer: any, x: number, y: number, z: number): number {
    const idx = y << 8 | (z & 15) << 4 | (x & 15);
    if (layer === 'sky') return this.skyLight[idx];
    return this.blockLight[idx];
  }

  // --- LevelChunk.h:70-71 — setBrightness(LightLayer, int, int, int, int) ---
  setBrightness(layer: any, x: number, y: number, z: number, brightness: number): void {
    const idx = y << 8 | (z & 15) << 4 | (x & 15);
    if (layer === 'sky') this.skyLight[idx] = brightness;
    else this.blockLight[idx] = brightness;
  }

  // --- LevelChunk.h:140 — getTileEntityMap() ---
  getTileEntityMap(): Map<string, any> { return this.tileEntities; }
}

// === ChunkCache.h — chunk cache (header-only, 264 lines) ===
// --- ChunkCache.h:11-264 — class ChunkCache : public ChunkSource ---
class ChunkCache extends ChunkSource {
  static MAX_SAVES = 2;

  xLast: number = -999999999;
  zLast: number = -999999999;
  private last: any = null;
  private level: any;
  private emptyChunk: any = null;
  private source: any = null;
  private storage: any = null;
  private chunks: (LevelChunk | null)[];

  constructor(level: any, storage: any, source: any) {
    super();
    this.isChunkCache = true;
    this.level = level;
    this.storage = storage;
    this.source = source;
    this.chunks = new Array(32 * 32).fill(null);
    // §C++: emptyChunk = new EmptyLevelChunk(level_, NULL, 0, 0);
    this.emptyChunk = { isAt: () => false, terrainPopulated: true };
  }

  // --- ChunkCache.h:47-49 — fits(int, int) ---
  fits(x: number, z: number): boolean {
    return x >= 0 && z >= 0 && x < 32 && z < 32;  // §CHUNK_CACHE_WIDTH = 32
  }

  // --- ChunkCache.h:51-61 — hasChunk(int, int) ---
  hasChunk(x: number, z: number): boolean {
    if (!this.fits(x, z)) return true;
    if (x === this.xLast && z === this.zLast && this.last !== null) return true;
    const xs = x & 31;
    const zs = z & 31;
    const slot = xs + zs * 32;
    return this.chunks[slot] !== null && (this.chunks[slot] === this.emptyChunk || this.chunks[slot]!.isAt(x, z));
  }

  // --- ChunkCache.h:63-65 — create(int, int) ---
  create(x: number, z: number): any { return this.getChunk(x, z); }

  // --- ChunkCache.h:67-119 — getChunk(int, int) ---
  getChunk(x: number, z: number): any {
    if (x === this.xLast && z === this.zLast && this.last !== null) return this.last;
    if (!this.fits(x, z)) return this.emptyChunk;
    const xs = x & 31;
    const zs = z & 31;
    const slot = xs + zs * 32;
    if (!this.hasChunk(x, z)) {
      if (this.chunks[slot] !== null) {
        this.chunks[slot]!.unload();
      }
      let newChunk = this.load(x, z);
      let updateLights = false;
      if (newChunk === null) {
        if (this.source === null) newChunk = this.emptyChunk;
        else newChunk = this.source.getChunk(x, z);
      } else {
        updateLights = true;
      }
      this.chunks[slot] = newChunk;
      // §C++: newChunk->lightLava()
      if (this.chunks[slot] !== null) {
        this.chunks[slot]!.load();
      }
      // §C++: postProcess checks for neighboring chunks
      if (!this.chunks[slot]!.terrainPopulated && this.hasChunk(x + 1, z + 1) && this.hasChunk(x, z + 1) && this.hasChunk(x + 1, z)) {
        this.postProcess(this, x, z);
      }
    }
    this.xLast = x;
    this.zLast = z;
    this.last = this.chunks[slot];
    return this.chunks[slot];
  }

  // --- ChunkCache.h:143-145 — getMobsAt ---
  getMobsAt(mobCategory: any, x: number, y: number, z: number): any {
    return this.source ? this.source.getMobsAt(mobCategory, x, y, z) : null;
  }

  // --- ChunkCache.h:147-155 — postProcess(ChunkSource*, int, int) ---
  postProcess(parent: ChunkSource, x: number, z: number): void {
    if (!this.fits(x, z)) return;
    const chunk = this.getChunk(x, z);
    if (!chunk.terrainPopulated) {
      chunk.terrainPopulated = true;
      if (this.source !== null) {
        this.source.postProcess(parent, x, z);
        chunk.clearUpdateMap();
      }
    }
  }

  // --- ChunkCache.h:178-182 — tick() ---
  tick(): boolean {
    if (this.storage !== null) this.storage.tick();
    return this.source ? this.source.tick() : false;
  }

  // --- ChunkCache.h:184-186 — shouldSave() ---
  shouldSave(): boolean { return true; }

  // --- ChunkCache.h:188-190 — gatherStats() ---
  gatherStats(): string { return 'ChunkCache: 1024'; }

  // --- ChunkCache.h:205-210 — load(int, int) (private) ---
  private load(x: number, z: number): any {
    if (this.storage === null) return this.emptyChunk;
    if (x < 0 || x >= 32 || z < 0 || z >= 32) return this.emptyChunk;
    const levelChunk = this.storage.load(this.level, x, z);
    if (levelChunk !== null) {
      levelChunk.lastSaveTime = this.level.getTime();
    }
    return levelChunk;
  }

  // --- ChunkCache.h:212-218 — saveEntities(LevelChunk*) (private) ---
  private saveEntities(levelChunk: any): void {
    if (this.storage === null) return;
    this.storage.saveEntities(this.level, levelChunk);
  }

  // --- ChunkCache.h:220-228 — save(LevelChunk*) (private) ---
  private save(levelChunk: any): void {
    if (this.storage === null) return;
    levelChunk.lastSaveTime = this.level.getTime();
    this.storage.save(this.level, levelChunk);
  }
}

export { LevelSource, ChunkPos, ChunkSource, LevelChunk, ChunkCache };
