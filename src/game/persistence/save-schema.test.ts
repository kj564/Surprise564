import { describe, expect, test } from 'bun:test';
import { parseWorldSaveJson, serializeWorldSave, validateWorldSave } from './save-schema';

function validSave() {
  return {
    format: 'voxelcraft-world',
    schemaVersion: 1,
    generatorVersion: 1,
    metadata: {
      name: 'Test World',
      seed: 12345,
      createdAt: '2026-10-12T00:00:00.000Z',
      updatedAt: '2026-10-12T00:00:00.000Z',
    },
    dimensions: { chunkSizeX: 2, height: 2, chunkSizeZ: 2 },
    chunks: [{ x: -1, z: 0, blocks: [0, 1, 2, 3, 4, 5, 6, 7] }],
    player: {
      position: { x: -1.5, y: 1, z: 0.5 },
      yaw: 0.25,
      pitch: 0.1,
      inventory: [{ itemKey: 'minecraft:stone', count: 2, maxStackSize: 64 }, null],
    },
  };
}

describe('world save schema', () => {
  test('validates and normalizes a versioned save', () => {
    const result = validateWorldSave(validSave());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.schemaVersion).toBe(1);
    expect(result.value.chunks[0].blocks).toHaveLength(8);
    expect(result.value.player.inventory[0]?.itemKey).toBe('minecraft:stone');
  });

  test('normalizes historical saves without metadata and validates provided state bytes', () => {
    const legacy = validSave();
    const result = validateWorldSave(legacy);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.chunks[0].states).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);

    const withStates = validSave();
    withStates.chunks[0].states = [0, 1, 2, 3, 4, 5, 6, 255];
    const valid = validateWorldSave(withStates);
    expect(valid.ok).toBe(true);
    if (valid.ok) expect(valid.value.chunks[0].states[7]).toBe(255);

    const malformed = validSave();
    malformed.chunks[0].states = [0, 1, 2, 256, 4, 5, 6, 7];
    const invalid = validateWorldSave(malformed);
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) expect(invalid.errors.some(error => error.includes('valid state byte'))).toBe(true);
  });

  test('round-trips valid JSON through serializer and parser', () => {
    const json = serializeWorldSave(validSave());
    const parsed = parseWorldSaveJson(json);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.value.metadata.seed).toBe(12345);
  });

  test('rejects unsupported versions, invalid dimensions and malformed JSON', () => {
    const badVersion = validSave();
    badVersion.schemaVersion = 2;
    expect(validateWorldSave(badVersion).ok).toBe(false);
    const badDimensions = validSave();
    badDimensions.dimensions.height = 0;
    expect(validateWorldSave(badDimensions).ok).toBe(false);
    expect(parseWorldSaveJson('{bad json').ok).toBe(false);
    expect(parseWorldSaveJson('x'.repeat(64_000_001)).ok).toBe(false);
  });

  test('rejects duplicate chunks and block arrays with wrong length or invalid IDs', () => {
    const duplicate = validSave();
    duplicate.chunks.push({ x: -1, z: 0, blocks: [0, 0, 0, 0, 0, 0, 0, 0] });
    expect(validateWorldSave(duplicate).ok).toBe(false);
    const wrongLength = validSave();
    wrongLength.chunks[0].blocks.pop();
    expect(validateWorldSave(wrongLength).ok).toBe(false);
    const invalidBlock = validSave();
    invalidBlock.chunks[0].blocks[0] = 70000;
    expect(validateWorldSave(invalidBlock).ok).toBe(false);
  });

  test('defaults older saves to hotbar slot zero and rejects out-of-range selections', () => {
    const legacy = validateWorldSave(validSave());
    expect(legacy.ok).toBe(true);
    if (legacy.ok) expect(legacy.value.player.selectedSlot).toBe(0);

    const invalid = validSave();
    invalid.player.selectedSlot = 2;
    expect(validateWorldSave(invalid).ok).toBe(false);

    const valid = validSave();
    valid.player.selectedSlot = 1;
    const normalized = validateWorldSave(valid);
    expect(normalized.ok).toBe(true);
    if (normalized.ok) expect(normalized.value.player.selectedSlot).toBe(1);
  });

  test('rejects invalid inventory stacks and out-of-range pitch', () => {
    const invalidStack = validSave();
    invalidStack.player.inventory[0] = { itemKey: 'stone', count: 1, maxStackSize: 64 };
    expect(validateWorldSave(invalidStack).ok).toBe(false);
    const invalidPitch = validSave();
    invalidPitch.player.pitch = Math.PI;
    expect(validateWorldSave(invalidPitch).ok).toBe(false);
  });

  test('returns immutable data and refuses to serialize invalid saves', () => {
    const result = validateWorldSave(validSave());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.chunks[0].blocks)).toBe(true);
    expect(() => serializeWorldSave({})).toThrow('Refusing to serialize invalid world save');
  });
});
