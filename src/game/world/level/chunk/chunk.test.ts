import { describe, expect, test } from 'bun:test';
import { ChunkData } from './chunk';

describe('ChunkData', () => {
  test('starts as air and tracks only real block changes', () => {
    const chunk = new ChunkData({ sizeX: 16, height: 40, sizeZ: 16 });
    expect(chunk.getBlock(0, 0, 0)).toBe(0);
    expect(chunk.revision).toBe(0);
    expect(chunk.setBlock(0, 0, 0, 1)).toBe(true);
    expect(chunk.revision).toBe(1);
    expect(chunk.setBlock(0, 0, 0, 1)).toBe(false);
    expect(chunk.revision).toBe(1);
    expect(chunk.setBlock(0, 0, 0, 0)).toBe(true);
    expect(chunk.revision).toBe(2);
  });

  test('stores blocks at distinct coordinates in a stable layout', () => {
    const chunk = new ChunkData({ sizeX: 2, height: 3, sizeZ: 2 });
    chunk.setBlock(1, 0, 0, 12);
    chunk.setBlock(0, 1, 0, 34);
    chunk.setBlock(0, 0, 1, 56);
    expect(chunk.getBlock(1, 0, 0)).toBe(12);
    expect(chunk.getBlock(0, 1, 0)).toBe(34);
    expect(chunk.getBlock(0, 0, 1)).toBe(56);
    expect(chunk.getBlock(0, 0, 0)).toBe(0);
  });

  test('validates dimensions, initial data and coordinates', () => {
    expect(() => new ChunkData({ sizeX: 0, height: 2, sizeZ: 2 })).toThrow(RangeError);
    expect(() => new ChunkData({ sizeX: 2, height: 2, sizeZ: 2 }, [1, 2])).toThrow(RangeError);
    expect(() => new ChunkData({ sizeX: 2, height: 2, sizeZ: 2 }, [0, 0, 0, 0, 0, 0, 0, 70000])).toThrow(RangeError);
    const chunk = new ChunkData({ sizeX: 2, height: 2, sizeZ: 2 });
    expect(() => chunk.getBlock(-1, 0, 0)).toThrow(RangeError);
    expect(() => chunk.setBlock(0, 0, 0, -1)).toThrow(RangeError);
    expect(() => chunk.setBlock(0, 0, 0, 1.5)).toThrow(RangeError);
  });

  test('returns a defensive copy for persistence', () => {
    const chunk = new ChunkData({ sizeX: 2, height: 2, sizeZ: 2 });
    chunk.setBlock(1, 1, 1, 9);
    const snapshot = chunk.toArray();
    snapshot[7] = 42;
    expect(chunk.getBlock(1, 1, 1)).toBe(9);
  });
});
