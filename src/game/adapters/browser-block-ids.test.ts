import { describe, expect, test } from 'bun:test';
import { browserBlockIdToEngineId, engineBlockIdToBrowserId, listSupportedBrowserBlockTranslations } from './browser-block-ids';

describe('existing browser runtime block ID adapter', () => {
  test('translates custom browser IDs by block identity, not by numeric coincidence', () => {
    expect(browserBlockIdToEngineId(1)).toBe(2); // Browser grass -> engine grass block
    expect(browserBlockIdToEngineId(3)).toBe(1); // Browser stone -> engine stone
    expect(browserBlockIdToEngineId(5)).toBe(17); // Browser oak log -> legacy oak log
    expect(browserBlockIdToEngineId(6)).toBe(5); // Browser planks -> legacy oak planks
    expect(browserBlockIdToEngineId(11)).toBe(7); // Browser bedrock -> legacy bedrock
    expect(browserBlockIdToEngineId(19)).toBe(8); // Browser water -> legacy water
  });

  test('does not guess for unknown, custom-only or unsupported browser IDs', () => {
    expect(browserBlockIdToEngineId(17)).toBeUndefined(); // crafting table not yet in registry
    expect(browserBlockIdToEngineId(18)).toBeUndefined(); // furnace not yet in registry
    expect(browserBlockIdToEngineId(27)).toBeUndefined();
    expect(browserBlockIdToEngineId(-1)).toBeUndefined();
    expect(browserBlockIdToEngineId(1.5)).toBeUndefined();
  });

  test('reverse mapping round-trips supported identities', () => {
    for (const mapping of listSupportedBrowserBlockTranslations()) {
      expect(browserBlockIdToEngineId(mapping.browserId)).toBe(mapping.engineId);
      expect(engineBlockIdToBrowserId(mapping.engineId)).toBe(mapping.browserId);
    }
  });

  test('returns a detached frozen mapping list', () => {
    const mappings = listSupportedBrowserBlockTranslations();
    expect(mappings.length).toBeGreaterThan(15);
    expect(Object.isFrozen(mappings)).toBe(true);
    expect(Object.isFrozen(mappings[0])).toBe(true);
  });
});
