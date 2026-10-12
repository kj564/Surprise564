import { describe, expect, test } from 'bun:test';
import { Aabb } from './aabb';
import { PlayerPhysics } from './player-physics';

const floor = new Aabb(-10, 0, -10, 10, 1, 10);
const wall = new Aabb(1, 1, -1, 2, 3, 2);
const emptyObstacles = () => [];

describe('PlayerPhysics', () => {
  test('resolves gravity against the floor and establishes grounded state', () => {
    const player = new PlayerPhysics({ x: 0.5, y: 1, z: 0.5 });
    const state = player.step(1 / 60, { moveX: 0, moveZ: 0, jump: false }, () => [floor]);
    expect(state.position.y).toBeCloseTo(1);
    expect(state.onGround).toBe(true);
    expect(state.velocityY).toBe(0);
  });

  test('allows jumping only from grounded state', () => {
    const player = new PlayerPhysics({ x: 0.5, y: 1, z: 0.5 });
    player.step(1 / 60, { moveX: 0, moveZ: 0, jump: false }, () => [floor]);
    const jumped = player.step(1 / 60, { moveX: 0, moveZ: 0, jump: true }, () => [floor]);
    expect(jumped.position.y).toBeGreaterThan(1);
    expect(jumped.velocityY).toBeGreaterThan(0);
    expect(jumped.onGround).toBe(false);
  });

  test('clips horizontal movement at a wall without tunneling through it', () => {
    const player = new PlayerPhysics({ x: 0.5, y: 1, z: 0.5 });
    const state = player.step(0.1, { moveX: 1, moveZ: 0, jump: false }, () => [floor, wall]);
    expect(state.position.x).toBeCloseTo(0.7);
    expect(player.bounds.maxX).toBeCloseTo(1);
    expect(state.horizontalCollision).toBe(true);
    expect(state.onGround).toBe(true);
  });

  test('normalizes diagonal movement to avoid faster diagonal speed', () => {
    const player = new PlayerPhysics({ x: 0, y: 5, z: 0 }, { moveSpeed: 4 });
    const state = player.step(0.1, { moveX: 1, moveZ: 1, jump: false }, emptyObstacles);
    expect(state.position.x).toBeCloseTo(state.position.z);
    expect(Math.hypot(state.position.x, state.position.z)).toBeCloseTo(0.4);
  });

  test('teleport resets velocity and collision flags', () => {
    const player = new PlayerPhysics({ x: 0.5, y: 1, z: 0.5 });
    player.step(1 / 60, { moveX: 0, moveZ: 0, jump: false }, () => [floor]);
    player.teleport({ x: 4, y: 10, z: -2 });
    expect(player.state.position).toEqual({ x: 4, y: 10, z: -2 });
    expect(player.state.velocityY).toBe(0);
    expect(player.state.onGround).toBe(false);
  });

  test('rejects invalid steps, inputs and spawn coordinates', () => {
    expect(() => new PlayerPhysics({ x: NaN, y: 0, z: 0 })).toThrow(TypeError);
    const player = new PlayerPhysics({ x: 0, y: 2, z: 0 });
    expect(() => player.step(0, { moveX: 0, moveZ: 0, jump: false }, emptyObstacles)).toThrow(RangeError);
    expect(() => player.step(0.01, { moveX: Infinity, moveZ: 0, jump: false }, emptyObstacles)).toThrow(TypeError);
  });
});
