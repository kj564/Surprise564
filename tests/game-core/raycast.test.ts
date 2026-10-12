import { describe, expect, test } from "bun:test";
import { raycastVoxels } from "../../src/game/core/raycast";

const lookup = (solids: Map<string, number>) => (x: number, y: number, z: number) => solids.get(`${x},${y},${z}`) ?? 0;

describe("raycastVoxels", () => {
  test("hits the nearest block and reports the entry face", () => {
    const hit = raycastVoxels({ x: 0.5, y: 1.5, z: 0.5 }, { x: 8, y: 0, z: 0 }, 8, lookup(new Map([["3,1,0", 7], ["5,1,0", 9]])));
    expect(hit).toMatchObject({ blockId: 7, x: 3, y: 1, z: 0, normal: { x: -1, y: 0, z: 0 }, distance: 2.5 });
  });

  test("handles negative direction and a block containing the origin", () => {
    const hit = raycastVoxels({ x: 3.5, y: 0.5, z: 0.5 }, { x: -1, y: 0, z: 0 }, 5, lookup(new Map([["1,0,0", 2]])));
    expect(hit?.x).toBe(1);
    expect(hit?.normal).toEqual({ x: 1, y: 0, z: 0 });
    expect(raycastVoxels({ x: 1.2, y: 0.2, z: 0.2 }, { x: 1, y: 0, z: 0 }, 2, lookup(new Map([["1,0,0", 3]])))?.distance).toBe(0);
  });

  test("returns null for zero direction, no hit, or beyond range", () => {
    const empty = lookup(new Map());
    expect(raycastVoxels({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 3, empty)).toBeNull();
    expect(raycastVoxels({ x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, 2, lookup(new Map([["3,0,0", 1]])))).toBeNull();
    expect(() => raycastVoxels({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, -1, empty)).toThrow();
  });
});
