import { describe, expect, test } from 'bun:test';
import { BlockRegistry, defaultBlockRegistry } from './registry';

describe('BlockRegistry', () => {
  test('provides stable namespaced definitions and legacy mappings', () => {
    expect(defaultBlockRegistry.getById(0)?.key).toBe('minecraft:air');
    expect(defaultBlockRegistry.getByLegacyId(1)?.key).toBe('minecraft:stone');
    expect(defaultBlockRegistry.getByLegacyId(8)?.key).toBe('minecraft:water');
    expect(defaultBlockRegistry.getByLegacyId(9)?.key).toBe('minecraft:water');
    expect(defaultBlockRegistry.getByLegacyId(10)?.lightEmission).toBe(15);
    expect(defaultBlockRegistry.getByLegacyId(11)?.key).toBe('minecraft:lava');
    expect(defaultBlockRegistry.getById(2)?.key).toBe('minecraft:grass_block');
    expect(defaultBlockRegistry.getByKey('minecraft:oak_stairs')?.shape).toBe('stairs');
    expect(defaultBlockRegistry.getByKey('minecraft:glass')?.renderLayer).toBe('translucent');
  });

  test('does not invent definitions for unknown IDs or keys', () => {
    expect(defaultBlockRegistry.getById(65535)).toBeUndefined();
    expect(defaultBlockRegistry.getById(-1)).toBeUndefined();
    expect(defaultBlockRegistry.getByKey('minecraft:not_real')).toBeUndefined();
  });

  test('does not expose mutable registry collections', () => {
    const values = defaultBlockRegistry.values();
    expect(values.length).toBeGreaterThan(20);
    expect(Object.isFrozen(values[0])).toBe(true);
    expect(Object.isFrozen(values[0].drops)).toBe(true);
    expect(() => (values[0].drops as string[]).push('minecraft:stone')).toThrow();
  });

  test('rejects duplicate keys and legacy IDs', () => {
    const stone = defaultBlockRegistry.getByKey('minecraft:stone')!;
    expect(() => new BlockRegistry([stone, stone])).toThrow('Duplicate block key');
    const conflicting = { ...stone, key: 'minecraft:other_stone' };
    expect(() => new BlockRegistry([stone, conflicting])).toThrow('Duplicate legacy block ID');
  });

  test('requires air and validates material properties', () => {
    const stone = defaultBlockRegistry.getByKey('minecraft:stone')!;
    expect(() => new BlockRegistry([stone])).toThrow('must define minecraft:air');
    expect(() => new BlockRegistry([
      defaultBlockRegistry.getByKey('minecraft:air')!,
      { ...stone, key: 'minecraft:bad_stone', legacyId: 250, lightEmission: 16 },
    ])).toThrow('lightEmission');
  });
});
