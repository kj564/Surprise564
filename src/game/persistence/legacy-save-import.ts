import type { BlockRegistry } from '../blocks/registry';
import { defaultBlockRegistry } from '../blocks/registry';
import { browserBlockIdToEngineId } from '../adapters/browser-block-ids';
import { VoxelWorld, type WorldDimensions } from '../world/world';

export interface LegacyImportOptions {
  readonly dimensions?: WorldDimensions;
  readonly registry?: BlockRegistry;
  readonly maxEntries?: number;
}

export interface LegacyImportResult {
  readonly world: VoxelWorld;
  readonly imported: number;
  readonly skipped: number;
  readonly chunksLoaded: number;
}

/** Imports the legacy browser game's sparse version-1 block edit map, not a full world snapshot. */
export function importLegacyBlockSave(input: unknown, options: LegacyImportOptions = {}): LegacyImportResult {
  const dimensions = options.dimensions ?? { chunkSizeX: 16, height: 64, chunkSizeZ: 16 };
  const registry = options.registry ?? defaultBlockRegistry;
  const maxEntries = options.maxEntries ?? 100_000;
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 0 || maxEntries > 1_000_000) {
    throw new RangeError('maxEntries must be an integer between 0 and 1000000');
  }
  if (!isRecord(input) || input.version !== 1 || !isRecord(input.blocks)) {
    throw new TypeError('Legacy save must contain version: 1 and a blocks object');
  }
  const entries = Object.entries(input.blocks);
  if (entries.length > maxEntries) throw new RangeError('Legacy save exceeds the configured entry limit');
  const world = new VoxelWorld(dimensions);
  const parsed: Array<{ x: number; y: number; z: number; id: number }> = [];
  const chunks = new Set<string>();
  let skipped = 0;
  for (const [key, id] of entries) {
    const match = /^(-?\d+),(-?\d+),(-?\d+)$/.exec(key);
    if (!match || !Number.isSafeInteger(Number(match[1])) || !Number.isSafeInteger(Number(match[2])) ||
        !Number.isSafeInteger(Number(match[3])) || typeof id !== 'number' || !Number.isSafeInteger(id) || id < 0 || id > 0xffff ||
        !registry.getById(id)) { skipped += 1; continue; }
    const x = Number(match[1]), y = Number(match[2]), z = Number(match[3]);
    if (y < 0 || y >= dimensions.height) { skipped += 1; continue; }
    // Legacy v1 browser saves use the custom BLOCKS catalog IDs, not MCPE/engine IDs.
    // Convert by verified block identity; never copy the numeric ID directly.
    parsed.push({ x, y, z, id: browserBlockIdToEngineId(id, registry)! });
    chunks.add(VoxelWorld.chunkKey(Math.floor(x / dimensions.chunkSizeX), Math.floor(z / dimensions.chunkSizeZ)));
  }
  for (const key of chunks) {
    const [cx, cz] = key.split(',').map(Number);
    world.loadChunk(cx, cz);
  }
  for (const block of parsed) world.setBlock({ x: block.x, y: block.y, z: block.z }, block.id);
  return Object.freeze({ world, imported: parsed.length, skipped, chunksLoaded: chunks.size });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}