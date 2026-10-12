import { worldToChunk, worldToLocal } from '../core/coordinates';
import { ChunkData } from './chunk';

export interface WorldDimensions {
  readonly chunkSizeX: number;
  readonly height: number;
  readonly chunkSizeZ: number;
}

export interface BlockPosition {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface BlockMutation {
  readonly changed: boolean;
  readonly previousId: number;
  readonly blockId: number;
  readonly position: BlockPosition;
  /** Chunk keys whose derived meshes/lighting may need recomputation. */
  readonly dirtyChunks: readonly string[];
}

/**
 * Renderer-independent world data. An unloaded chunk is undefined, never silently treated as air.
 * Chunk data is authoritative; renderer/mesh state belongs to adapters outside this class.
 */
export class VoxelWorld {
  readonly dimensions: WorldDimensions;
  private readonly chunks = new Map<string, ChunkData>();
  private readonly dirty = new Set<string>();

  constructor(dimensions: WorldDimensions) {
    this.dimensions = Object.freeze({
      chunkSizeX: positiveInteger(dimensions.chunkSizeX, 'chunkSizeX'),
      height: positiveInteger(dimensions.height, 'height'),
      chunkSizeZ: positiveInteger(dimensions.chunkSizeZ, 'chunkSizeZ'),
    });
  }

  static chunkKey(chunkX: number, chunkZ: number): string {
    if (!Number.isSafeInteger(chunkX) || !Number.isSafeInteger(chunkZ)) {
      throw new TypeError('Chunk coordinates must be safe integers');
    }
    return chunkX + ',' + chunkZ;
  }

  hasChunk(chunkX: number, chunkZ: number): boolean {
    return this.chunks.has(VoxelWorld.chunkKey(chunkX, chunkZ));
  }

  loadChunk(chunkX: number, chunkZ: number, initialBlocks?: ArrayLike<number>): ChunkData {
    const key = VoxelWorld.chunkKey(chunkX, chunkZ);
    if (this.chunks.has(key)) throw new Error('Chunk is already loaded: ' + key);
    const chunk = new ChunkData({
      sizeX: this.dimensions.chunkSizeX,
      height: this.dimensions.height,
      sizeZ: this.dimensions.chunkSizeZ,
    }, initialBlocks);
    this.chunks.set(key, chunk);
    this.dirty.add(key);
    return chunk;
  }

  unloadChunk(chunkX: number, chunkZ: number): boolean {
    const key = VoxelWorld.chunkKey(chunkX, chunkZ);
    const removed = this.chunks.delete(key);
    this.dirty.delete(key);
    if (removed) {
      for (const neighbor of this.neighborKeys(chunkX, chunkZ)) {
        if (this.chunks.has(neighbor)) this.dirty.add(neighbor);
      }
    }
    return removed;
  }

  /** undefined means the owning chunk is not loaded; zero means loaded air. */
  getBlock(x: number, y: number, z: number): number | undefined {
    assertWorldCoordinate(x, 'x');
    assertWorldCoordinate(y, 'y');
    assertWorldCoordinate(z, 'z');
    if (y < 0 || y >= this.dimensions.height) return undefined;
    const chunkX = worldToChunk(x, this.dimensions.chunkSizeX);
    const chunkZ = worldToChunk(z, this.dimensions.chunkSizeZ);
    const chunk = this.chunks.get(VoxelWorld.chunkKey(chunkX, chunkZ));
    if (!chunk) return undefined;
    return chunk.getBlock(worldToLocal(x, this.dimensions.chunkSizeX), y, worldToLocal(z, this.dimensions.chunkSizeZ));
  }

  /** Mutations require the owning chunk to be loaded; no implicit chunk generation occurs. */
  setBlock(position: BlockPosition, blockId: number): BlockMutation {
    assertWorldCoordinate(position.x, 'x');
    assertWorldCoordinate(position.y, 'y');
    assertWorldCoordinate(position.z, 'z');
    if (position.y < 0 || position.y >= this.dimensions.height) throw new RangeError('y is outside the world height');
    if (!Number.isInteger(blockId) || blockId < 0 || blockId > 0xffff) throw new RangeError('blockId must be an integer from 0 to 65535');

    const chunkX = worldToChunk(position.x, this.dimensions.chunkSizeX);
    const chunkZ = worldToChunk(position.z, this.dimensions.chunkSizeZ);
    const chunkKey = VoxelWorld.chunkKey(chunkX, chunkZ);
    const chunk = this.chunks.get(chunkKey);
    if (!chunk) throw new Error('Cannot modify an unloaded chunk: ' + chunkKey);

    const localX = worldToLocal(position.x, this.dimensions.chunkSizeX);
    const localZ = worldToLocal(position.z, this.dimensions.chunkSizeZ);
    const previousId = chunk.getBlock(localX, position.y, localZ);
    const changed = chunk.setBlock(localX, position.y, localZ, blockId);
    const dirtyChunks = changed ? this.markAffectedChunksDirty(chunkX, chunkZ, localX, localZ) : [];
    return {
      changed,
      previousId,
      blockId,
      position: Object.freeze({ ...position }),
      dirtyChunks: Object.freeze(dirtyChunks),
    };
  }

  /** Consume the current dirty set. Rendering systems can schedule derived-data rebuilds from it. */
  consumeDirtyChunks(): string[] {
    const result = [...this.dirty];
    this.dirty.clear();
    return result;
  }

  getLoadedChunkCount(): number {
    return this.chunks.size;
  }

  private markAffectedChunksDirty(chunkX: number, chunkZ: number, localX: number, localZ: number): string[] {
    const affected = new Set([VoxelWorld.chunkKey(chunkX, chunkZ)]);
    if (localX === 0) affected.add(VoxelWorld.chunkKey(chunkX - 1, chunkZ));
    if (localX === this.dimensions.chunkSizeX - 1) affected.add(VoxelWorld.chunkKey(chunkX + 1, chunkZ));
    if (localZ === 0) affected.add(VoxelWorld.chunkKey(chunkX, chunkZ - 1));
    if (localZ === this.dimensions.chunkSizeZ - 1) affected.add(VoxelWorld.chunkKey(chunkX, chunkZ + 1));
    const result: string[] = [];
    for (const key of affected) {
      if (this.chunks.has(key)) {
        this.dirty.add(key);
        result.push(key);
      }
    }
    return result;
  }

  private neighborKeys(chunkX: number, chunkZ: number): string[] {
    return [
      VoxelWorld.chunkKey(chunkX - 1, chunkZ),
      VoxelWorld.chunkKey(chunkX + 1, chunkZ),
      VoxelWorld.chunkKey(chunkX, chunkZ - 1),
      VoxelWorld.chunkKey(chunkX, chunkZ + 1),
    ];
  }
}

function positiveInteger(value: number, name: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RangeError(name + ' must be a positive safe integer');
  return value;
}

function assertWorldCoordinate(value: number, name: string): void {
  if (!Number.isSafeInteger(value)) throw new TypeError(name + ' must be a safe integer');
}
