import test from "node:test";
import assert from "node:assert/strict";
import {
  BlockRegistry, CORE_BLOCKS, ChunkData, WorldStore,
  chunkKey, floorDiv, localToIndex, worldToChunk, worldToLocal,
} from "../src/game/world/index.mjs";

test("negative world coordinates map to the correct chunk and local coordinates", () => {
  assert.equal(floorDiv(-1, 16), -1);
  assert.equal(floorDiv(-16, 16), -1);
  assert.equal(floorDiv(-17, 16), -2);
  assert.deepEqual(worldToChunk({ x: -1, y: 0, z: -17 }), { x: -1, y: 0, z: -2 });
  assert.deepEqual(worldToLocal({ x: -1, y: 0, z: -17 }), { x: 15, y: 0, z: 15 });
  assert.equal(chunkKey({ x: -1, y: 2, z: -2 }), "-1,2,-2");
});

test("local chunk indexing is bounded and unique for representative coordinates", () => {
  assert.equal(localToIndex({ x: 0, y: 0, z: 0 }, 16), 0);
  assert.equal(localToIndex({ x: 15, y: 0, z: 0 }, 16), 15);
  assert.equal(localToIndex({ x: 0, y: 1, z: 0 }, 16), 256);
  assert.throws(() => localToIndex({ x: 16, y: 0, z: 0 }, 16), RangeError);
  assert.throws(() => localToIndex({ x: 0, y: -1, z: 0 }, 16), RangeError);
});

test("block registry enforces stable unique ids and air at id zero", () => {
  const registry = new BlockRegistry(CORE_BLOCKS);
  assert.equal(registry.size, CORE_BLOCKS.length);
  assert.equal(registry.getById(0).key, "air");
  assert.equal(registry.getByKey("stone").id, 1);
  assert.equal(registry.getByKey("missing"), null);
  assert.throws(() => new BlockRegistry([
    CORE_BLOCKS[0], { ...CORE_BLOCKS[1], id: 0, key: "duplicate_id" },
  ]), /duplicate block id/);
  assert.throws(() => new BlockRegistry([
    { ...CORE_BLOCKS[0], id: 1 }, { ...CORE_BLOCKS[1], id: 2 },
  ]), /id 0 must be non-solid air/);
  assert.throws(() => new BlockRegistry([
    CORE_BLOCKS[0], { ...CORE_BLOCKS[1], hardness: -2 },
  ]), /hardness/);
  assert.throws(() => new BlockRegistry([
    CORE_BLOCKS[0], { ...CORE_BLOCKS[1], hardness: Infinity },
  ]), /hardness/);
});

test("chunk edits are revisioned and no-op edits do not dirty state", () => {
  const chunk = new ChunkData({ x: 0, y: 0, z: 0 });
  const first = chunk.setBlock({ x: 1, y: 2, z: 3 }, 1);
  assert.deepEqual({ changed: first.changed, previous: first.previous, current: first.current, revision: first.revision },
    { changed: true, previous: 0, current: 1, revision: 1 });
  assert.equal(chunk.dirty, true);
  const noOp = chunk.setBlock({ x: 1, y: 2, z: 3 }, 1);
  assert.equal(noOp.changed, false);
  assert.equal(chunk.revision, 1);
  chunk.markSaved(0);
  assert.equal(chunk.dirty, true, "an old save cannot clear newer edits");
  chunk.markSaved(1);
  assert.equal(chunk.dirty, false);
  assert.equal(chunk.getBlock({ x: 1, y: 2, z: 3 }), 1);
});

test("world store handles negative coordinates and edits across chunk boundaries", () => {
  const world = new WorldStore();
  assert.equal(world.getBlock({ x: -1, y: 0, z: 0 }), 0);
  assert.equal(world.chunkCount, 0, "reading air should not allocate chunks");
  assert.equal(world.setBlock({ x: -1, y: 0, z: 0 }, 1).changed, true);
  assert.equal(world.setBlock({ x: 0, y: 0, z: 0 }, 2).changed, true);
  assert.equal(world.getBlock({ x: -1, y: 0, z: 0 }), 1);
  assert.equal(world.getBlock({ x: 0, y: 0, z: 0 }), 2);
  assert.equal(world.chunkCount, 2);
  assert.equal(world.setBlock({ x: 5, y: 5, z: 5 }, 0).changed, false);
  const countBeforeInvalidWrite = world.chunkCount;
  assert.throws(() => world.setBlock({ x: 50, y: 0, z: 0 }, 70000), RangeError);
  assert.equal(world.chunkCount, countBeforeInvalidWrite, "invalid writes must not allocate chunks");
});

test("chunk constructor and block writes reject invalid data", () => {
  assert.throws(() => new ChunkData({ x: 0, y: 0, z: 0 }, { size: 0 }), RangeError);
  const chunk = new ChunkData({ x: 0, y: 0, z: 0 });
  assert.throws(() => chunk.setBlock({ x: 0, y: 0, z: 0 }, 65536), RangeError);
  assert.throws(() => chunk.getBlock({ x: 16, y: 0, z: 0 }), RangeError);
});
