import { describe, expect, test } from 'bun:test';
import { createGradientNoise2D } from './gradient-noise';

describe('seeded improved-gradient noise', () => {
  test('is deterministic for the same seed, including negative coordinates', () => {
    const first = createGradientNoise2D(564);
    const second = createGradientNoise2D(564);
    for (const [x, z] of [[0.25, 0.75], [-0.25, 0.75], [-18.5, -4.125], [128.01, -256.9]]) {
      expect(first.sample(x, z)).toBe(second.sample(x, z));
    }
  });

  test('different seeds produce different terrain samples', () => {
    const first = createGradientNoise2D(564);
    const second = createGradientNoise2D(565);
    const samples = [[0.1, 0.2], [1.3, 2.4], [-3.2, 8.1], [24.5, -16.25]];
    expect(samples.some(([x, z]) => first.sample(x, z) !== second.sample(x, z))).toBe(true);
  });

  test('returns bounded finite values and rejects invalid coordinates', () => {
    const noise = createGradientNoise2D(0);
    for (let x = -10; x <= 10; x += 0.25) {
      for (let z = -10; z <= 10; z += 0.5) {
        const value = noise.sample(x, z);
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(-1);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
    expect(() => noise.sample(Number.NaN, 0)).toThrow('finite');
    expect(() => noise.sample(0, Number.POSITIVE_INFINITY)).toThrow('finite');
    expect(() => createGradientNoise2D(1.5)).toThrow('safe integer');
  });

  test('interpolates smoothly across lattice boundaries', () => {
    const noise = createGradientNoise2D(42);
    const epsilon = 1e-4;
    expect(Math.abs(noise.sample(3 - epsilon, 2.37) - noise.sample(3 + epsilon, 2.37))).toBeLessThan(0.001);
    expect(Math.abs(noise.sample(-1.26, -2 - epsilon) - noise.sample(-1.26, -2 + epsilon))).toBeLessThan(0.001);
  });
});
