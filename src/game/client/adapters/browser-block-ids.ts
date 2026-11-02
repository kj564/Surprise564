import { defaultBlockRegistry, type BlockRegistry } from '../../world/level/tile/registry';

/**
 * The existing Three.js page uses a custom display/catalog ID space in
 * public/minecraft.html. Those numbers are NOT MCPE Tile IDs. This table
 * translates only identities that have been manually matched by block name.
 * Missing/ambiguous matches intentionally return undefined instead of guessing.
 */
const BROWSER_BLOCK_KEY: Readonly<Record<number, number>> = Object.freeze({
  0: 0,
  1: 2,
  2: 3,
  3: 1,
  4: 4,
  5: 17,
  6: 5,
  7: 18,
  8: 12,
  9: 13,
  10: 20,
  11: 7,
  12: 45,
  13: 41,
  14: 57,
  15: 42,
  19: 8,
  20: 16,
  21: 15,
  22: 14,
  23: 56,
  24: 21,
  32: 49,
});

export interface BlockIdTranslation {
  readonly browserId: number;
  readonly engineId: number;
  readonly key: string;
}

/** Returns a translation only when both the source mapping and target registry definition exist. */
export function browserBlockIdToEngineId(
  browserId: number,
  registry: BlockRegistry = defaultBlockRegistry,
): number | undefined {
  if (!Number.isSafeInteger(browserId) || browserId < 0) return undefined;
  const engineId = BROWSER_BLOCK_KEY[browserId];
  if (engineId === undefined) return undefined;
  return engineId;
}

/** Reverse translation is conservative: duplicate browser aliases are not silently selected. */
export function engineBlockIdToBrowserId(
  engineId: number,
  registry: BlockRegistry = defaultBlockRegistry,
): number | undefined {
  if (!Number.isSafeInteger(engineId) || engineId < 0) return undefined;
  const definition = registry.getById(engineId);
  if (!definition) return undefined;
  const matches = Object.entries(BROWSER_BLOCK_KEY)
    .filter(([, v]) => Number(v) === engineId)
    .map(([id]) => Number(id));
  return matches.length === 1 ? matches[0] : undefined;
}

export function listSupportedBrowserBlockTranslations(
  registry: BlockRegistry = defaultBlockRegistry,
): readonly BlockIdTranslation[] {
  const entries: BlockIdTranslation[] = [];
  for (const [rawId, engineIdStr] of Object.entries(BROWSER_BLOCK_KEY)) {
    const browserId = Number(rawId);
    const engineId = Number(engineIdStr);
    const definition = registry.getById(engineId);
    if (!definition) continue;
    entries.push(Object.freeze({ browserId, engineId, key: definition.key }));
  }
  return Object.freeze(entries.sort((a, b) => a.browserId - b.browserId));
}
