import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { browserBlockIdToEngineId, engineBlockIdToBrowserId, listSupportedBrowserBlockTranslations } from './browser-block-ids';

describe('existing browser runtime block ID adapter', () => {
  test('translates custom browser IDs by block identity, not by numeric coincidence', () => {
    expect(browserBlockIdToEngineId(1)).toBe(2); // Browser grass -> engine grass block
    expect(browserBlockIdToEngineId(3)).toBe(1); // Browser stone -> engine stone
    expect(browserBlockIdToEngineId(5)).toBe(17); // Browser oak log -> legacy oak log
    expect(browserBlockIdToEngineId(6)).toBe(5); // Browser planks -> legacy oak planks
    expect(browserBlockIdToEngineId(11)).toBe(7); // Browser bedrock -> legacy bedrock
    expect(browserBlockIdToEngineId(13)).toBe(41); // Browser gold block -> engine gold block
    expect(browserBlockIdToEngineId(14)).toBe(57); // Browser diamond block -> engine diamond block
    expect(browserBlockIdToEngineId(15)).toBe(42); // Browser iron block -> engine iron block
    expect(browserBlockIdToEngineId(17)).toBe(58); // Browser crafting table -> engine crafting table
    expect(browserBlockIdToEngineId(18)).toBe(61); // Browser furnace -> engine furnace
    expect(browserBlockIdToEngineId(19)).toBe(8); // Browser water -> legacy water
    expect(browserBlockIdToEngineId(56)).toBe(79); // Browser ice -> engine ice
  });

  test('does not guess for unknown, custom-only or unsupported browser IDs', () => {
    expect(browserBlockIdToEngineId(16)).toBeUndefined(); // coal block has no matching engine definition
    expect(browserBlockIdToEngineId(25)).toBeUndefined(); // lapis block has no matching engine definition
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

  test('every translated ID still exists in the live browser BLOCKS catalog', () => {
    const source = readFileSync(new URL('../../../public/minecraft.html', import.meta.url), 'utf8');
    const catalog = source.match(/const BLOCKS = \\{([\\s\\S]*?)\\n    \\};/);
    expect(catalog, 'live BLOCKS catalog should be discoverable in public/minecraft.html').not.toBeNull();
    const catalogIds = new Set(
      [...catalog![1].matchAll(/^\\s*(\\d+)\\s*:/gm)].map(match => Number(match[1])),
    );
    for (const mapping of listSupportedBrowserBlockTranslations()) {
      expect(catalogIds.has(mapping.browserId), 'stale browser ID ' + mapping.browserId).toBe(true);
    }
  });

  test('returns a detached frozen mapping list', () => {
    const mappings = listSupportedBrowserBlockTranslations();
    expect(mappings.length).toBeGreaterThan(15);
    expect(Object.isFrozen(mappings)).toBe(true);
    expect(Object.isFrozen(mappings[0])).toBe(true);
  });
});
