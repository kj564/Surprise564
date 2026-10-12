import { AIR_BLOCK_ID, type BlockId } from "./block-registry";

export interface WorldBounds {
  readonly minY: number;
  readonly maxY: number;
}

export interface BlockChange {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly previousId: BlockId;
  readonly blockId: BlockId;
  readonly changed: boolean;
}

export interface ChunkCoordinate {
  readonly x: number;
  readonly z: number;
}

function assertInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value)) throw new Error(`${label} must be a safe integer.`);
}

export function chunkCoordinate(value: number, chunkSize: number): number {
  assertInteger(value, "Coordinate");
  if (!Number.isSafeInteger(chunkSize) || chunkSize < 1) {
    throw new Error("Chunk size must be a positive safe integer.");
  }
  return Math.floor(value / chunkSize);
}

export function localCoordinate(value: number, chunkSize: number): number {
  const chunk = chunkCoordinate(value, chunkSize);
  return value - chunk * chunkSize;
}

/** Sparse authoritative voxel storage. Rendering meshes must be derived from this data. */
export class VoxelWorld {
  readonly chunkSize: number;
  readonly bounds: WorldBounds;
  private readonly chunks = new Map<string, Map<string, BlockId>>();

  constructor(options: { chunkSize?: number; bounds?: WorldBounds } = {}) {
    this.chunkSize = options.chunkSize ?? 16;
    if (!Number.isSafeInteger(this.chunkSize) || this.chunkSize < 1) {
      throw new Error("Chunk size must be a positive safe integer.");
    }
    this.bounds = Object.freeze({ ...(options.bounds ?? { minY: 0, maxY: 255 }) });
    assertInteger(this.bounds.minY, "minY");
    assertInteger(this.bounds.maxY, "maxY");
    if (this.bounds.minY > this.bounds.maxY) throw new Error("minY must not exceed maxY.");
  }

  getBlock(x: number, y: number, z: number): BlockId {
    this.assertCoordinates(x, y, z);
    if (y < this.bounds.minY || y > this.bounds.maxY) return AIR_BLOCK_ID;
    const chunk = this.chunks.get(this.chunkKey(x, z));
    return chunk?.get(this.voxelKey(x, y, z)) ?? AIR_BLOCK_ID;
  }

  setBlock(x: number, y: number, z: number, blockId: BlockId): BlockChange {
    this.assertCoordinates(x, y, z);
    if (!Number.isSafeInteger(blockId) || blockId < 0) {
      throw new Error("Block id must be a non-negative safe integer.");
    }
    if (y < this.bounds.minY || y > this.bounds.maxY) {
      throw new RangeError(`Y coordinate ${y} is outside world bounds.`);
    }

    const previousId = this.getBlock(x, y, z);
    if (previousId === blockId) {
      return { x, y, z, previousId, blockId, changed: false };
    }

    const key = this.chunkKey(x, z);
    let chunk = this.chunks.get(key);
    if (!chunk && blockId !== AIR_BLOCK_ID) {
      chunk = new Map<string, BlockId>();
      this.chunks.set(key, chunk);
    }

    if (blockId === AIR_BLOCK_ID) {
      chunk?.delete(this.voxelKey(x, y, z));
      if (chunk?.size === 0) this.chunks.delete(key);
    } else {
      chunk!.set(this.voxelKey(x, y, z), blockId);
    }

    return { x, y, z, previousId, blockId, changed: true };
  }

  getChunkCoordinates(x: number, z: number): ChunkCoordinate {
    return { x: chunkCoordinate(x, this.chunkSize), z: chunkCoordinate(z, this.chunkSize) };
  }

  getLoadedChunkCount(): number {
    return this.chunks.size;
  }

  private chunkKey(x: number, z: number): string {
    return `${chunkCoordinate(x, this.chunkSize)},${chunkCoordinate(z, this.chunkSize)}`;
  }

  private voxelKey(x: number, y: number, z: number): string {
    return `${localCoordinate(x, this.chunkSize)},${y},${localCoordinate(z, this.chunkSize)}`;
  }

  private assertCoordinates(x: number, y: number, z: number): void {
    assertInteger(x, "x");
    assertInteger(y, "y");
    assertInteger(z, "z");
  }
}
