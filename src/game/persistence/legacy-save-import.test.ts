import { describe, expect, test } from 'bun:test';
import { importLegacyBlockSave } from './legacy-save-import';

describe('legacy browser save importer', () => {
  test('imports valid sparse edits across negative chunk coordinates', () => {
    const result = importLegacyBlockSave({ version: 1, blocks: {
      '0,2,0': 1, '-17,3,18': 2, '1,64,1': 1, 'bad-key': 1, '2,2,2': 999,
    } });
    expect(result.imported).toBe(2);
    expect(result.skipped).toBe(3);
    expect(result.chunksLoaded).toBe(2);
    expect(result.world.getBlock(0, 2, 0)).toBe(2); // browser grass ID 1 -> engine grass-block ID 2
    expect(result.world.getBlock(-17, 3, 18)).toBe(3); // browser dirt ID 2 -> engine dirt ID 3
    expect(result.world.getBlock(1, 2, 1)).toBe(0);
  });
  test('translates browser catalog IDs and skips unsupported browser-only IDs', () => {
    const result = importLegacyBlockSave({ version: 1, blocks: { '0,1,0': 1, '1,1,0': 3, '2,1,0': 25 } });
    expect(result.imported).toBe(2);
    expect(result.skipped).toBe(1);
    expect(result.world.getBlock(0, 1, 0)).toBe(2); // grass, not stone
    expect(result.world.getBlock(1, 1, 0)).toBe(1); // stone, not browser ID 3
    expect(result.world.getBlock(2, 1, 0)).toBe(0);
  });
  test('rejects malformed save envelopes and excessive entry counts', () => {
    expect(() => importLegacyBlockSave({ version: 2, blocks: {} })).toThrow('version: 1');
    expect(() => importLegacyBlockSave({ version: 1, blocks: { '0,0,0': 1 } }, { maxEntries: 0 })).toThrow('entry limit');
  });
  test('skips unsafe coordinates', () => {
    const result = importLegacyBlockSave({ version: 1, blocks: { '9007199254740992,1,0': 1 } });
    expect(result.imported).toBe(0);
    expect(result.skipped).toBe(1);
  });
});