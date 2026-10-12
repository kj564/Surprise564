import { describe, expect, test } from 'bun:test';
import { Aabb } from './aabb';
import { resolveAabbMovement } from './collision';

describe('resolveAabbMovement', () => {
  test('stops downward motion on a floor and marks the player grounded', () => {
    const player = new Aabb(0.2, 1, 0.2, 0.8, 2.8, 0.8);
    const floor = new Aabb(-10, 0, -10, 10, 1, 10);
    const result = resolveAabbMovement(player, { dx: 0, dy: -2, dz: 0 }, [floor]);
    expect(result.dy).toBe(0);
    expect(result.box.minY).toBe(1);
    expect(result.onGround).toBe(true);
    expect(result.verticalCollision).toBe(true);
  });
  test('stops horizontal motion at a wall without false grounding', () => {
    const player = new Aabb(0, 0, 0, 0.6, 1.8, 0.6);
    const wall = new Aabb(1, 0, -1, 2, 3, 2);
    const result = resolveAabbMovement(player, { dx: 2, dy: 0, dz: 0 }, [wall]);
    expect(result.dx).toBeCloseTo(0.4);
    expect(result.box.maxX).toBeCloseTo(1);
    expect(result.onGround).toBe(false);
    expect(result.horizontalCollision).toBe(true);
  });
  test('clips upward motion at a ceiling', () => {
    const player = new Aabb(0, 0, 0, 0.6, 1.8, 0.6);
    const ceiling = new Aabb(-1, 2, -1, 2, 3, 2);
    const result = resolveAabbMovement(player, { dx: 0, dy: 1, dz: 0 }, [ceiling]);
    expect(result.dy).toBeCloseTo(0.2);
    expect(result.onGround).toBe(false);
  });
  test('rejects invalid movement values', () => {
    const player = new Aabb(0, 0, 0, 1, 1, 1);
    expect(() => resolveAabbMovement(player, { dx: Infinity, dy: 0, dz: 0 }, [])).toThrow(TypeError);
  });
});
