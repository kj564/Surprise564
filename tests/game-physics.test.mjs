import test from "node:test";
import assert from "node:assert/strict";
import { WorldStore } from "../src/game/world/index.mjs";
import { raycastBlocks as castBlocks } from "../src/game/physics/raycast-blocks.mjs";
import { clipMovementX as clipX, clipMovementY as clipY, clipMovementZ as clipZ, AABB as Box } from "../src/game/physics/aabb.mjs";

test("AABB uses strict overlap and returns new boxes for movement", () => {
  const a = new Box(0, 0, 0, 1, 1, 1);
  assert.equal(a.intersects(new Box(0.5, 0.5, 0.5, 2, 2, 2)), true);
  assert.equal(a.intersects(new Box(1, 0, 0, 2, 1, 1)), false);
  assert.deepEqual(a.moved(2, 0, -1), new Box(2, 0, -1, 3, 1, 0));
  assert.deepEqual(a.expanded(1, -2, 0), new Box(0, -2, 0, 2, 1, 1));
  assert.throws(() => new Box(2, 0, 0, 1, 1, 1), RangeError);
});

test("axis clipping stops movement at the obstacle without crossing it", () => {
  const moving = new Box(0, 0, 0, 0.8, 1.8, 0.8);
  assert.equal(clipX(moving, new Box(1, 0, 0, 2, 2, 1), 1), 0.2);
  assert.equal(clipX(moving, new Box(-2, 0, 0, -1, 2, 1), -1), -1);
  assert.equal(clipY(moving, new Box(0, 2, 0, 1, 3, 1), 1), 0.2);
  assert.equal(clipY(moving, new Box(0, -2, 0, 1, -1, 1), -1), -1);
  assert.equal(clipZ(moving, new Box(0, 0, 1, 1, 2, 2), 1), 0.2);
  assert.equal(clipZ(moving, new Box(0, 0, -2, 1, 2, -1), -1), -1);
  assert.equal(clipX(moving, new Box(1, 3, 0, 2, 4, 1), 1), 1, "no vertical overlap means no collision");
});

test("voxel DDA returns first hit, entered face and distance", () => {
  const world = new WorldStore();
  world.setBlock({ x: 3, y: 1, z: 0 }, 1);
  const hit = castBlocks(world, { x: 0.5, y: 1.5, z: 0.5 }, { x: 5, y: 0, z: 0 }, 4);
  assert.deepEqual(hit.block, { x: 3, y: 1, z: 0 });
  assert.equal(hit.blockId, 1);
  assert.equal(hit.face, "west");
  assert.equal(hit.distance, 2.5);
  assert.deepEqual(hit.point, { x: 3, y: 1.5, z: 0.5 });
});

test("voxel DDA handles negative coordinates, max reach and inside-origin", () => {
  const world = new WorldStore();
  world.setBlock({ x: -3, y: 0, z: 0 }, 2);
  assert.equal(castBlocks(world, { x: 0.5, y: 0.5, z: 0.5 }, { x: -1, y: 0, z: 0 }, 2), null);
  const hit = castBlocks(world, { x: 0.5, y: 0.5, z: 0.5 }, { x: -1, y: 0, z: 0 }, 3);
  assert.deepEqual(hit.block, { x: -3, y: 0, z: 0 });
  assert.equal(hit.face, "east");
  assert.equal(hit.distance, 2.5);
  const insideWorld = new WorldStore();
  insideWorld.setBlock({ x: -2, y: 0, z: 0 }, 2);
  assert.equal(castBlocks(insideWorld, { x: -1.5, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, 1).face, "inside");
  assert.throws(() => castBlocks(world, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 2), RangeError);
});

test("raycast accepts custom solidity semantics for liquids and foliage", () => {
  const world = new WorldStore();
  world.setBlock({ x: 1, y: 0, z: 0 }, 8);
  world.setBlock({ x: 2, y: 0, z: 0 }, 1);
  const hit = castBlocks(world, { x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, 4, {
    isSolid: (id) => id === 1,
  });
  assert.deepEqual(hit.block, { x: 2, y: 0, z: 0 });
});

test("raycast rejects invalid vectors and distances", () => {
  const world = new WorldStore();
  assert.throws(() => castBlocks(world, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 4), RangeError);
  assert.throws(() => castBlocks(world, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, -1), RangeError);
  assert.throws(() => castBlocks(world, { x: NaN, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 4), TypeError);
});
