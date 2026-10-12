import { CHUNK_SIZE, chunkKey, worldToChunk, worldToLocal } from "./coordinates.mjs";
import { ChunkData } from "./chunk-data.mjs";

export class WorldStore {
  #chunks = new Map();

  constructor({ chunkSize = CHUNK_SIZE } = {}) {
    if (!Number.isSafeInteger(chunkSize) || chunkSize < 1 || chunkSize > 64) {
      throw new RangeError("chunkSize must be an integer between 1 and 64");
    }
    this.chunkSize = chunkSize;
  }

  getChunk(chunkPosition) {
    return this.#chunks.get(chunkKey(chunkPosition)) ?? null;
  }

  getOrCreateChunk(chunkPosition) {
    const key = chunkKey(chunkPosition);
    let chunk = this.#chunks.get(key);
    if (!chunk) {
      chunk = new ChunkData(chunkPosition, { size: this.chunkSize });
      this.#chunks.set(key, chunk);
    }
    return chunk;
  }

  getBlock(worldPosition) {
    const chunkPosition = worldToChunk(worldPosition, this.chunkSize);
    const chunk = this.getChunk(chunkPosition);
    return chunk ? chunk.getBlock(worldToLocal(worldPosition, this.chunkSize)) : 0;
  }

  /** The single mutation path for block edits. A missing chunk is treated as air. */
  setBlock(worldPosition, blockId) {
    if (!Number.isSafeInteger(blockId) || blockId < 0 || blockId > 65535) {
      throw new RangeError("blockId must fit Uint16");
    }
    const chunkPosition = worldToChunk(worldPosition, this.chunkSize);
    const localPosition = worldToLocal(worldPosition, this.chunkSize);
    const existing = this.getChunk(chunkPosition);
    if (!existing && blockId === 0) {
      return Object.freeze({ changed: false, previous: 0, current: 0, chunk: null, revision: 0 });
    }
    const chunk = existing ?? this.getOrCreateChunk(chunkPosition);
    const result = chunk.setBlock(localPosition, blockId);
    return Object.freeze({ ...result, chunk });
  }

  get chunkCount() {
    return this.#chunks.size;
  }

  entries() {
    return this.#chunks.entries();
  }
}
