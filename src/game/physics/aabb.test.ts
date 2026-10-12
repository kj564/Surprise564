import { describe, expect, test } from 'bun:test';
import { Aabb } from './aabb';

describe('Aabb collision primitives', () => {
  test('touching faces are not penetration', () => {
    const a = new Aabb(0, 0, 0, 1, 1, 1);
    expect(a.intersects(new Aabb(1, 0, 0, 2, 1, 1))).toBe(false);
    expect(a.intersects(new Aabb(0.5, 0.5, 0.5, 2, 2, 2))).toBe(true);
  });
  test('clips movement at a wall', () => {
    const a = new Aabb(0, 0, 0, 0.6, 1.8, 0.6);
    const wall = new Aabb(1, 0, -1, 2, 3, 2);
    expect(a.clipDisplacement(wall, 'x', 2)).toBeCloseTo(0.4);
  });
  test('computes movement bounds', () => {
    const a = new Aabb(1, 2, 3, 2, 4, 5);
    expect(a.sweptBounds(-2, 1, 3)).toEqual(new Aabb(-1, 2, 3, 2, 5, 8));
  });
});
