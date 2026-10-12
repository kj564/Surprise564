import { CHUNK_SIZE, localToIndex } from "./coordinates.mjs";

export class ChunkData {
  #blocks;
  #revision = 0;
  #dirty = false;

  constructor({ x, y, z }, { size = CHUNK_SIZE, fill = 0 } = {}) {
    for (const [name, value] of Object.entries({ x, y, z, size, fill })) {
      if (!Number.isSafeInteger(value)) throw new TypeError(`${name} must be an integer`);
    }
    if (size < 1 || size > 64) throw new RangeError("chunk size must be between 1 and 64");
    if (fill < 0 || fill > 65535) throw new RangeError("fill block id must fit Uint16");
    this.position = Object.freeze({ x, y, z });
    this.size = size;
    this.#blocks = new Uint16Array(size * size * size);
    if (fill !== 0) this.#blocks.fill(fill);
  }

  get revision() { return this.#revision; }
  get dirty() { return this.#dirty; }

  getBlock(localPosition) {
    return this.#blocks[localToIndex(localPosition, this.size)];
  }

  /** Returns { changed, previous, current, revision }; no-op edits do not dirty the chunk. */
  setBlock(localPosition, blockId) {
    if (!Number.isSafeInteger(blockId) || blockId < 0 || blockId > 65535) {
      throw new RangeError("blockId must fit Uint16");
    }
    const index = localToIndex(localPosition, this.size);
    const previous = this.#blocks[index];
    if (previous === blockId) {
      return Object.freeze({ changed: false, previous, current: blockId, revision: this.#revision });
    }
    this.#blocks[index] = blockId;
    this.#revision += 1;
    this.#dirty = true;
    return Object.freeze({ changed: true, previous, current: blockId, revision: this.#revision });
  }

  markSaved(savedRevision = this.#revision) {
    if (!Number.isSafeInteger(savedRevision) || savedRevision < 0) {
      throw new RangeError("savedRevision must be a non-negative integer");
    }
    // A save that started before later edits must not clear the dirty flag.
    if (savedRevision === this.#revision) this.#dirty = false;
  }

  copyBlocks() {
    return this.#blocks.slice();
  }
}
