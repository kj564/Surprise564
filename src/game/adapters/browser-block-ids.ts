import { defaultBlockRegistry, type BlockRegistry } from '../blocks/registry';

/**
 * The existing Three.js page uses a custom display/catalog ID space in
 * public/minecraft.html. Those numbers are NOT MCPE Tile IDs. This table
 * translates only identities that have been manually matched by block name.
 * Missing/ambiguous matches intentionally return undefined instead of guessing.
 */
const BROWSER_BLOCK_KEY: Readonly<Record<number, string>> = Object.freeze({
  0: 'minecraft:air',
  1: 'minecraft:grass_block',
  2: 'minecraft:dirt',
  3: 'minecraft:stone',
  4: 'minecraft:cobblestone',
  5: 'minecraft:oak_log',
  6: 'minecraft:oak_planks',
  7: 'minecraft:oak_leaves',
  8: 'minecraft:sand',
  9: 'minecraft:gravel',
  10: 'minecraft:glass',
  11: 'minecraft:bedrock',
  12: 'minecraft:bricks',
  13: 'minecraft:gold_block',
  14: 'minecraft:diamond_block',
  15: 'minecraft:iron_block',
  17: 'minecraft:crafting_table',
  18: 'minecraft:furnace',
  19: 'minecraft:water',
  20: 'minecraft:coal_ore',
  21: 'minecraft:iron_ore',
  22: 'minecraft:gold_ore',
  23: 'minecraft:diamond_ore',
  24: 'minecraft:lapis_ore',
  32: 'minecraft:obsidian',
  56: 'minecraft:ice',
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
  const key = BROWSER_BLOCK_KEY[browserId];
  if (!key) return undefined;
  return registry.getByKey(key)?.legacyId ?? (key === 'minecraft:air' ? 0 : undefined);
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
    .filter(([, key]) => key === definition.key)
    .map(([id]) => Number(id));
  return matches.length === 1 ? matches[0] : undefined;
}

export function listSupportedBrowserBlockTranslations(
  registry: BlockRegistry = defaultBlockRegistry,
): readonly BlockIdTranslation[] {
  const entries: BlockIdTranslation[] = [];
  for (const [rawId, key] of Object.entries(BROWSER_BLOCK_KEY)) {
    const browserId = Number(rawId);
    const engineId = key === 'minecraft:air' ? 0 : registry.getByKey(key)?.legacyId;
    if (engineId === undefined) continue;
    entries.push(Object.freeze({ browserId, engineId, key }));
  }
  return Object.freeze(entries.sort((a, b) => a.browserId - b.browserId));
}
