import { localBlockIndex } from '../core/coordinates';

export interface ChunkDimensions {
  sizeX: number;
  height: number;
  sizeZ: number;
}

/**
 * Authoritative, renderer-independent block storage for one chunk.
 * Block ID 0 is reserved for air. Meshes and scene objects are derived from this data.
 */
export class ChunkData {
  readonly sizeX: number;
  readonly height: number;
  readonly sizeZ: number;
  readonly blocks: Uint16Array;
  private _revision = 0;

  constructor(dimensions: ChunkDimensions, initialBlocks?: ArrayLike<number>) {
    this.sizeX = positiveInteger(dimensions.sizeX, 'sizeX');
    this.height = positiveInteger(dimensions.height, 'height');
    this.sizeZ = positiveInteger(dimensions.sizeZ, 'sizeZ');
    const volume = this.sizeX * this.height * this.sizeZ;
    if (!Number.isSafeInteger(volume) || volume > 0x7fffffff) {
      throw new RangeError('Chunk volume is too large');
    }
    if (initialBlocks && initialBlocks.length !== volume) {
      throw new RangeError('Initial block data length does not match chunk volume');
    }
    this.blocks = initialBlocks ? ChunkData.copyAndValidate(initialBlocks, volume) : new Uint16Array(volume);
  }

  get revision(): number {
    return this._revision;
  }

  getBlock(x: number, y: number, z: number): number {
    return this.blocks[localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ)];
  }

  /** Returns true only when the stored block value changed. */
  setBlock(x: number, y: number, z: number, blockId: number): boolean {
    if (!Number.isInteger(blockId) || blockId < 0 || blockId > 0xffff) {
      throw new RangeError('blockId must be an integer from 0 to 65535');
    }
    const index = localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ);
    if (this.blocks[index] === blockId) return false;
    this.blocks[index] = blockId;
    this._revision += 1;
    return true;
  }

  /** Copy the current data for persistence; callers cannot mutate this chunk through the copy. */
  toArray(): Uint16Array {
    return this.blocks.slice();
  }

  private static copyAndValidate(source: ArrayLike<number>, expectedLength: number): Uint16Array {
    if (source.length !== expectedLength) throw new RangeError('Initial block data length does not match chunk volume');
    const copy = new Uint16Array(expectedLength);
    for (let index = 0; index < expectedLength; index += 1) {
      const value = source[index];
      if (!Number.isInteger(value) || value < 0 || value > 0xffff) {
        throw new RangeError('Initial block data contains an invalid block ID at index ' + index);
      }
      copy[index] = value;
    }
    return copy;
  }
}

function positiveInteger(value: number, name: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(name + ' must be a positive safe integer');
  }
  return value;
}
