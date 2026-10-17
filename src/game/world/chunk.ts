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
  private readonly blockData: Uint16Array;
  private readonly stateData: Uint8Array;
  private _revision = 0;

  constructor(dimensions: ChunkDimensions, initialBlocks?: ArrayLike<number>, initialState?: ArrayLike<number>) {
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
    if (initialState && initialState.length !== volume) throw new RangeError('Initial block state length does not match chunk volume');
    this.blockData = initialBlocks ? ChunkData.copyAndValidate(initialBlocks, volume) : new Uint16Array(volume);
    this.stateData = initialState ? ChunkData.copyAndValidateState(initialState, volume) : new Uint8Array(volume);
  }

  get revision(): number {
    return this._revision;
  }

  /** Compatibility snapshot; mutating this array never mutates authoritative chunk data. */
  get blocks(): Uint16Array {
    return this.blockData.slice();
  }

  getBlock(x: number, y: number, z: number): number {
    return this.blockData[localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ)];
  }

  /** Returns the legacy block-state/metadata byte for a local coordinate. */
  getState(x: number, y: number, z: number): number {
    return this.stateData[localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ)];
  }

  /** Updates block metadata without changing the block ID; true means the value changed. */
  setState(x: number, y: number, z: number, state: number): boolean {
    if (!Number.isInteger(state) || state < 0 || state > 0xff) throw new RangeError('Block state must be an integer from 0 to 255');
    const index = localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ);
    if (this.stateData[index] === state) return false;
    this.stateData[index] = state;
    this._revision += 1;
    return true;
  }

  /** Compatibility snapshot; mutating this array never mutates authoritative chunk data. */
  get states(): Uint8Array {
    return this.stateData.slice();
  }

  /** Returns true only when the stored block value changed. */
  setBlock(x: number, y: number, z: number, blockId: number): boolean {
    if (!Number.isInteger(blockId) || blockId < 0 || blockId > 0xffff) {
      throw new RangeError('blockId must be an integer from 0 to 65535');
    }
    const index = localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ);
    if (this.blockData[index] === blockId) return false;
    this.blockData[index] = blockId;
    this.stateData[index] = 0;
    this._revision += 1;
    return true;
  }

  /** Copy the current block IDs for persistence. */
  toArray(): Uint16Array {
    return this.blockData.slice();
  }

  /** Copy the current block metadata for persistence. */
  toStateArray(): Uint8Array {
    return this.stateData.slice();
  }

  private static copyAndValidateState(source: ArrayLike<number>, expectedLength: number): Uint8Array {
    if (source.length !== expectedLength) throw new RangeError('Initial block state length does not match chunk volume');
    const copy = new Uint8Array(expectedLength);
    for (let index = 0; index < expectedLength; index += 1) {
      const value = source[index];
      if (!Number.isInteger(value) || value < 0 || value > 0xff) throw new RangeError('Initial block state contains an invalid value at index ' + index);
      copy[index] = value;
    }
    return copy;
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
