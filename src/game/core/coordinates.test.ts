import { describe, expect, test } from 'bun:test';
import { chunkToWorld, localBlockIndex, worldToChunk, worldToLocal } from './coordinates';

describe('voxel coordinate helpers', () => {
  test('maps negative coordinates using floor-based chunk coordinates', () => {
    expect(worldToChunk(-1)).toBe(-1);
    expect(worldToLocal(-1)).toBe(15);
    expect(worldToChunk(-16)).toBe(-1);
    expect(worldToLocal(-16)).toBe(0);
    expect(worldToChunk(-17)).toBe(-2);
    expect(worldToLocal(-17)).toBe(15);
  });

  test('round-trips chunk and local coordinates', () => {
    for (const world of [-513, -17, -16, -1, 0, 1, 15, 16, 17, 513]) {
      expect(chunkToWorld(worldToChunk(world), worldToLocal(world))).toBe(world);
    }
  });

  test('flattens blocks with X varying fastest, then Z, then Y', () => {
    expect(localBlockIndex(0, 0, 0, 16, 40, 16)).toBe(0);
    expect(localBlockIndex(1, 0, 0, 16, 40, 16)).toBe(1);
    expect(localBlockIndex(0, 0, 1, 16, 40, 16)).toBe(16);
    expect(localBlockIndex(0, 1, 0, 16, 40, 16)).toBe(256);
  });

  test('rejects invalid local coordinates and non-integer world coordinates', () => {
    expect(() => chunkToWorld(0, 16)).toThrow(RangeError);
    expect(() => worldToChunk(0.5)).toThrow(TypeError);
    expect(() => localBlockIndex(16, 0, 0, 16, 40, 16)).toThrow(RangeError);
  });
});
