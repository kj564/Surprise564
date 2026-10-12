import { describe, expect, test } from "bun:test";
import { VoxelWorld, chunkCoordinate, localCoordinate } from "../../src/game/core/voxel-world";

describe("VoxelWorld", () => {
  test("stores, updates, and removes blocks", () => {
    const world = new VoxelWorld({ bounds: { minY: -16, maxY: 64 } });
    expect(world.getBlock(0, 0, 0)).toBe(0);
    expect(world.setBlock(0, 0, 0, 1)).toMatchObject({ previousId: 0, blockId: 1, changed: true });
    expect(world.setBlock(0, 0, 0, 1).changed).toBe(false);
    expect(world.getBlock(0, 0, 0)).toBe(1);
    expect(world.setBlock(0, 0, 0, 0).changed).toBe(true);
    expect(world.getBlock(0, 0, 0)).toBe(0);
    expect(world.getLoadedChunkCount()).toBe(0);
  });

  test("maps negative world coordinates to correct chunks and local coordinates", () => {
    expect(chunkCoordinate(-1, 16)).toBe(-1);
    expect(chunkCoordinate(-16, 16)).toBe(-1);
    expect(chunkCoordinate(-17, 16)).toBe(-2);
    expect(localCoordinate(-1, 16)).toBe(15);
    expect(localCoordinate(-16, 16)).toBe(0);
    expect(localCoordinate(-17, 16)).toBe(15);
  });

  test("keeps neighboring chunks isolated and removes empty chunks", () => {
    const world = new VoxelWorld();
    world.setBlock(-1, 10, 0, 2);
    world.setBlock(0, 10, 0, 3);
    expect(world.getLoadedChunkCount()).toBe(2);
    expect(world.getBlock(-1, 10, 0)).toBe(2);
    expect(world.getBlock(0, 10, 0)).toBe(3);
    world.setBlock(-1, 10, 0, 0);
    expect(world.getLoadedChunkCount()).toBe(1);
  });

  test("rejects non-integer coordinates and writes outside vertical bounds", () => {
    const world = new VoxelWorld({ bounds: { minY: 0, maxY: 10 } });
    expect(() => world.getBlock(0.5, 1, 2)).toThrow();
    expect(() => world.setBlock(0, 11, 0, 1)).toThrow(RangeError);
    expect(world.getBlock(0, 11, 0)).toBe(0);
  });
});
