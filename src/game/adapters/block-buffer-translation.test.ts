import { describe, expect, test } from 'bun:test';
import { translateBrowserBlockBuffer, translateEngineBlockBufferToBrowser } from './block-buffer-translation';

describe('atomic block-buffer translation', () => {
  test('converts a supported browser block buffer without assuming numeric ID parity', () => {
    const result = translateBrowserBlockBuffer(Uint8Array.from([0, 1, 2, 3, 5, 6, 11, 13, 14, 15, 17, 18, 19, 56]));
    expect(result.ok).toBe(true);
    if (result.ok) expect([...result.blocks]).toEqual([0, 2, 3, 1, 17, 5, 7, 41, 57, 42, 58, 61, 8, 79]);
  });

  test('rejects a whole buffer when custom-only IDs are present', () => {
    const result = translateBrowserBlockBuffer(Uint8Array.from([0, 1, 16, 3, 25]));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map(error => [error.index, error.blockId])).toEqual([[2, 16], [4, 25]]);
    }
  });

  test('rejects malformed IDs and does not return a partial result', () => {
    const result = translateBrowserBlockBuffer([0, 1, -1, 3.2, 2]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.map(error => error.index)).toEqual([2, 3]);
  });

  test('round-trips supported block buffers', () => {
    const original = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 32, 56]);
    const toEngine = translateBrowserBlockBuffer(original);
    expect(toEngine.ok).toBe(true);
    if (!toEngine.ok) return;
    const toBrowser = translateEngineBlockBufferToBrowser(toEngine.blocks);
    expect(toBrowser.ok).toBe(true);
    if (toBrowser.ok) expect([...toBrowser.blocks]).toEqual([...original]);
  });

  test('bounds conversion size before allocating output', () => {
    expect(() => translateBrowserBlockBuffer({ length: 16_777_217 })).toThrow(RangeError);
  });
});
