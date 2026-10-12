import type { ItemStack } from '../inventory/inventory';

export interface SaveChunk {
  readonly x: number;
  readonly z: number;
  readonly blocks: readonly number[];
}

export interface WorldSaveV1 {
  readonly format: 'voxelcraft-world';
  readonly schemaVersion: 1;
  readonly generatorVersion: number;
  readonly metadata: {
    readonly name: string;
    readonly seed: number;
    readonly createdAt: string;
    readonly updatedAt: string;
  };
  readonly dimensions: {
    readonly chunkSizeX: number;
    readonly height: number;
    readonly chunkSizeZ: number;
  };
  readonly chunks: readonly SaveChunk[];
  readonly player: {
    readonly position: { readonly x: number; readonly y: number; readonly z: number };
    /** Radians. */
    readonly yaw: number;
    /** Radians, clamped to the vertical look range. */
    readonly pitch: number;
    readonly inventory: readonly (ItemStack | null)[];
  };
}

export type SaveValidationResult =
  | { readonly ok: true; readonly value: WorldSaveV1 }
  | { readonly ok: false; readonly errors: readonly string[] };

const MAX_CHUNKS = 4096;
const MAX_TOTAL_BLOCKS = 32_000_000;
const MAX_INVENTORY_SLOTS = 256;
const MAX_JSON_CHARS = 64_000_000;

/** Validate untrusted save data and return a fresh immutable representation. */
export function validateWorldSave(input: unknown): SaveValidationResult {
  const errors: string[] = [];
  if (!isRecord(input)) return failure(['save must be an object']);
  if (input.format !== 'voxelcraft-world') errors.push('format must be voxelcraft-world');
  if (input.schemaVersion !== 1) errors.push('unsupported schemaVersion; expected 1');
  if (!isPositiveInteger(input.generatorVersion)) errors.push('generatorVersion must be a positive integer');

  const metadata = input.metadata;
  if (!isRecord(metadata)) errors.push('metadata must be an object');
  else {
    if (typeof metadata.name !== 'string' || metadata.name.trim().length === 0 || metadata.name.length > 64) errors.push('metadata.name must contain 1 to 64 characters');
    if (!Number.isSafeInteger(metadata.seed)) errors.push('metadata.seed must be a safe integer');
    if (!isIsoDate(metadata.createdAt)) errors.push('metadata.createdAt must be a valid ISO date');
    if (!isIsoDate(metadata.updatedAt)) errors.push('metadata.updatedAt must be a valid ISO date');
  }

  const dimensions = input.dimensions;
  let volume = 0;
  if (!isRecord(dimensions)) errors.push('dimensions must be an object');
  else {
    if (!isBoundedInteger(dimensions.chunkSizeX, 1, 64)) errors.push('dimensions.chunkSizeX must be an integer from 1 to 64');
    if (!isBoundedInteger(dimensions.chunkSizeZ, 1, 64)) errors.push('dimensions.chunkSizeZ must be an integer from 1 to 64');
    if (!isBoundedInteger(dimensions.height, 1, 512)) errors.push('dimensions.height must be an integer from 1 to 512');
    if (isBoundedInteger(dimensions.chunkSizeX, 1, 64) && isBoundedInteger(dimensions.chunkSizeZ, 1, 64) && isBoundedInteger(dimensions.height, 1, 512)) {
      volume = dimensions.chunkSizeX * dimensions.chunkSizeZ * dimensions.height;
      if (volume > 2_000_000) errors.push('single chunk volume exceeds safety limit');
    }
  }

  const normalizedChunks: SaveChunk[] = [];
  const chunkKeys = new Set<string>();
  if (!Array.isArray(input.chunks)) errors.push('chunks must be an array');
  else {
    if (input.chunks.length > MAX_CHUNKS) errors.push('chunks exceeds the maximum count');
    let totalBlocks = 0;
    input.chunks.slice(0, MAX_CHUNKS).forEach((chunk, index) => {
      if (!isRecord(chunk)) {
        errors.push('chunks[' + index + '] must be an object');
        return;
      }
      if (!Number.isSafeInteger(chunk.x) || !Number.isSafeInteger(chunk.z)) {
        errors.push('chunks[' + index + '] coordinates must be safe integers');
        return;
      }
      const key = chunk.x + ',' + chunk.z;
      if (chunkKeys.has(key)) errors.push('duplicate chunk coordinates: ' + key);
      chunkKeys.add(key);
      if (!Array.isArray(chunk.blocks)) {
        errors.push('chunks[' + index + '].blocks must be an array');
        return;
      }
      if (chunk.blocks.length !== volume) errors.push('chunks[' + index + '].blocks length does not match chunk volume');
      totalBlocks += chunk.blocks.length;
      if (totalBlocks > MAX_TOTAL_BLOCKS) errors.push('total saved blocks exceeds safety limit');
      const blocks: number[] = [];
      for (let blockIndex = 0; blockIndex < Math.min(chunk.blocks.length, volume); blockIndex += 1) {
        const blockId = chunk.blocks[blockIndex];
        if (!isBoundedInteger(blockId, 0, 0xffff)) {
          errors.push('chunks[' + index + '].blocks[' + blockIndex + '] is not a valid block ID');
          break;
        }
        blocks.push(blockId);
      }
      if (blocks.length === volume && chunk.blocks.length === volume) {
        normalizedChunks.push(Object.freeze({ x: chunk.x, z: chunk.z, blocks: Object.freeze(blocks) }));
      }
    });
  }

  const player = input.player;
  let normalizedPlayer: WorldSaveV1['player'] | undefined;
  if (!isRecord(player)) errors.push('player must be an object');
  else {
    const position = player.position;
    if (!isRecord(position) || ![position.x, position.y, position.z].every(Number.isFinite)) {
      errors.push('player.position must contain finite x, y and z coordinates');
    }
    if (!Number.isFinite(player.yaw)) errors.push('player.yaw must be finite');
    if (!Number.isFinite(player.pitch) || (typeof player.pitch === 'number' && Math.abs(player.pitch) > Math.PI / 2)) errors.push('player.pitch must be within [-pi/2, pi/2]');
    const normalizedInventory: (ItemStack | null)[] = [];
    if (!Array.isArray(player.inventory)) errors.push('player.inventory must be an array');
    else {
      if (player.inventory.length > MAX_INVENTORY_SLOTS) errors.push('player.inventory exceeds the maximum slot count');
      player.inventory.slice(0, MAX_INVENTORY_SLOTS).forEach((stack, index) => {
        if (stack === null) {
          normalizedInventory.push(null);
          return;
        }
        if (!isRecord(stack) || typeof stack.itemKey !== 'string' || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(stack.itemKey) ||
            !isBoundedInteger(stack.count, 1, 999) || !isBoundedInteger(stack.maxStackSize, 1, 999) || stack.count > stack.maxStackSize) {
          errors.push('player.inventory[' + index + '] is not a valid item stack');
          return;
        }
        normalizedInventory.push(Object.freeze({ itemKey: stack.itemKey, count: stack.count, maxStackSize: stack.maxStackSize }));
      });
    }
    if (isRecord(position) && [position.x, position.y, position.z].every(Number.isFinite) &&
        Number.isFinite(player.yaw) && Number.isFinite(player.pitch) && Math.abs(player.pitch as number) <= Math.PI / 2 &&
        Array.isArray(player.inventory) && player.inventory.length <= MAX_INVENTORY_SLOTS && normalizedInventory.length === player.inventory.length) {
      normalizedPlayer = Object.freeze({
        position: Object.freeze({ x: position.x as number, y: position.y as number, z: position.z as number }),
        yaw: player.yaw as number,
        pitch: player.pitch as number,
        inventory: Object.freeze(normalizedInventory),
      });
    }
  }

  if (errors.length > 0 || !isRecord(metadata) || !isRecord(dimensions) || !normalizedPlayer ||
      !isPositiveInteger(input.generatorVersion) || input.schemaVersion !== 1 ||
      typeof metadata.name !== 'string' || !Number.isSafeInteger(metadata.seed) ||
      typeof metadata.createdAt !== 'string' || typeof metadata.updatedAt !== 'string' ||
      !isBoundedInteger(dimensions.chunkSizeX, 1, 64) || !isBoundedInteger(dimensions.chunkSizeZ, 1, 64) || !isBoundedInteger(dimensions.height, 1, 512) ||
      !Array.isArray(input.chunks)) {
    return failure(errors.length ? errors : ['save is invalid']);
  }

  const value: WorldSaveV1 = Object.freeze({
    format: 'voxelcraft-world',
    schemaVersion: 1,
    generatorVersion: input.generatorVersion,
    metadata: Object.freeze({
      name: metadata.name as string,
      seed: metadata.seed as number,
      createdAt: metadata.createdAt as string,
      updatedAt: metadata.updatedAt as string,
    }),
    dimensions: Object.freeze({
      chunkSizeX: dimensions.chunkSizeX as number,
      height: dimensions.height as number,
      chunkSizeZ: dimensions.chunkSizeZ as number,
    }),
    chunks: Object.freeze(normalizedChunks),
    player: normalizedPlayer,
  });
  return Object.freeze({ ok: true, value });
}

export function parseWorldSaveJson(json: string): SaveValidationResult {
  if (typeof json !== 'string') return failure(['save payload must be a string']);
  if (json.length > MAX_JSON_CHARS) return failure(['save payload exceeds size limit']);
  try {
    return validateWorldSave(JSON.parse(json) as unknown);
  } catch {
    return failure(['save payload is not valid JSON']);
  }
}

export function serializeWorldSave(input: unknown): string {
  const validation = validateWorldSave(input);
  if (!validation.ok) throw new TypeError('Refusing to serialize invalid world save: ' + validation.errors.join('; '));
  return JSON.stringify(validation.value);
}

function failure(errors: string[]): SaveValidationResult {
  return Object.freeze({ ok: false, errors: Object.freeze(errors) });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBoundedInteger(value: unknown, minimum: number, maximum: number): value is number {
  return Number.isSafeInteger(value) && (value as number) >= minimum && (value as number) <= maximum;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && value.includes('T');
}
