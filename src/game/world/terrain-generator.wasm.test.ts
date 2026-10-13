import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'bun:test';
import { sampleTerrainHeight } from './terrain-generator';

const wasmPath = resolve(process.cwd(), 'public/voxelcraft-kernel.wasm');

describe('WASM terrain kernel parity', () => {
  if (!existsSync(wasmPath)) {
    test.skip('compares WASM samples after the kernel has been built', () => {});
    return;
  }

  test('matches TypeScript terrain heights for positive/negative coordinates and seeds', async () => {
    const bytes = readFileSync(wasmPath);
    const { instance } = await WebAssembly.instantiate(bytes, {});
    const terrainHeight = instance.exports.terrain_height as (
      x: number, z: number, seed: number, baseHeight: number, amplitude: number, worldHeight: number, seaLevel: number,
    ) => number;

    for (const seed of [0, 1, 42, 564, 2147483647, -17]) {
      for (const [x, z] of [[0, 0], [1, 1], [-1, -1], [-13, 44], [25, -17], [31, 16], [-100, -72]] as const) {
        const expected = sampleTerrainHeight(x, z, seed, 9, 5, 32);
        const actual = terrainHeight(x, z, seed, 9, 5, 32, 7);
        expect(actual).toBe(expected);
      }
    }
  });
});
