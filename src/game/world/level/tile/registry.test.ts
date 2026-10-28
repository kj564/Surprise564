import { describe, expect, test } from 'bun:test';
import { BlockRegistry, defaultBlockRegistry } from './registry';

describe('BlockRegistry', () => {
  test('provides stable namespaced definitions and legacy mappings', () => {
    expect(defaultBlockRegistry.getById(0)?.legacyId).toBe(0);
    expect(defaultBlockRegistry.getByLegacyId(1)?.legacyId).toBe(1);
    expect(defaultBlockRegistry.getByLegacyId(8)?.legacyId).toBe(8);
    expect(defaultBlockRegistry.getByLegacyId(9)?.legacyId).toBe(8);
    expect(defaultBlockRegistry.getByLegacyId(10)?.lightEmission).toBe(15);
    expect(defaultBlockRegistry.getByLegacyId(11)?.legacyId).toBe(10);
    expect(defaultBlockRegistry.getById(2)?.legacyId).toBe(2);
    expect(defaultBlockRegistry.getByKey(53)?.shape).toBe('stairs');
    expect(defaultBlockRegistry.getByKey(20)?.renderLayer).toBe('translucent');
  });

  test('does not invent definitions for unknown IDs or keys', () => {
    expect(defaultBlockRegistry.getById(65535)).toBeUndefined();
    expect(defaultBlockRegistry.getById(-1)).toBeUndefined();
    expect(defaultBlockRegistry.getByKey(9999)).toBeUndefined();
  });

  test('does not expose mutable registry collections', () => {
    const values = defaultBlockRegistry.values();
    expect(values.length).toBeGreaterThan(20);
    expect(Object.isFrozen(values[0])).toBe(true);
    expect(Object.isFrozen(values[0].drops)).toBe(true);
    expect(() => (values[0].drops as number[]).push(1)).toThrow();
  });

  test('rejects duplicate keys and legacy IDs', () => {
    const stone = defaultBlockRegistry.getByKey(1)!;
    expect(() => new BlockRegistry([stone, stone])).toThrow('Duplicate block ID');
    const conflicting = { ...stone, key: 'minecraft:other_stone' };
    expect(() => new BlockRegistry([stone, conflicting])).toThrow('Duplicate legacy block ID');
  });

  test('requires air and validates material properties', () => {
    const stone = defaultBlockRegistry.getByKey(1)!;
    expect(() => new BlockRegistry([stone])).toThrow('must define block ID 0);
    expect(() => new BlockRegistry([
      defaultBlockRegistry.getByKey(0)!,
      { ...stone, key: 'minecraft:bad_stone', legacyId: 250, lightEmission: 16 },
    ])).toThrow('lightEmission');
  });
});
