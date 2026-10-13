# Terrain Generation Reverse-Engineering Audit

Reviewed: 2026-10-13  
Reference: `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/levelgen/`

## Finding

The historical Pocket Edition terrain pipeline is not a simple per-column height function. The core path is split across `RandomLevelSource`, `PerlinNoise`, `ImprovedNoise`, biome data, and feature post-processing. The current browser rebuild intentionally implements a smaller, deterministic heightmap pipeline.

## Source files and observed responsibilities

### `RandomLevelSource.cpp` / `.h`

- The generator owns multiple noise fields: `lperlinNoise1`, `lperlinNoise2`, `perlinNoise1`, `perlinNoise2`, `perlinNoise3`, `scaleNoise`, `depthNoise`, and `forestNoise`.
- `prepareHeights` obtains a three-dimensional density buffer from `getHeights`, then interpolates density across subchunk samples and fills stone/water/ice according to density and temperature.
- `buildSurfaces` applies a separate surface pass using biome top/filler materials and sand, gravel, and depth noise. It also places a randomized bedrock floor and handles water-level-adjacent material choices.
- `postProcess` seeds feature placement from world seed and chunk coordinates, then attempts ores, trees, flowers, mushrooms, reeds, springs and other biome-dependent features. Some candidate features are commented out in this historical source and must not be treated as active behavior.
- The reference uses 16×16 horizontal chunks and 128-block generation height in this path. The browser rebuild's dimensions differ, so storage layout and constants cannot be transplanted directly.

### `synth/PerlinNoise.cpp`

- Builds a stack of `ImprovedNoise` instances from the generator's random stream.
- Samples multiple scales/octaves and combines their contributions for both scalar values and regions.
- The exact seeded output depends on the historical C++ random stream and the order in which noise instances are initialized.

### `synth/ImprovedNoise.cpp`

- Builds a shuffled 256-entry permutation table and random coordinate offsets.
- Samples a lattice cell, evaluates fade curves and gradient contributions at its corners, then interpolates those contributions.
- Provides both 2D/3D sampling and region accumulation. The terrain pipeline uses the 3D form for density fields and 2D forms for some surface/feature fields.

## Browser rebuild comparison

Current code: `src/game/world/terrain-generator.ts` and `src/game/world/gradient-noise.ts`.

- The rebuild now uses a deterministic seeded gradient-noise primitive for a two-dimensional heightmap. This is closer to the reference's *noise family* than a sine-only terrain, and it is tested for deterministic seeds, negative coordinates, smooth lattice boundaries, and chunk-edge continuity.
- The noise primitive is an independent browser implementation. It does **not** copy the historical C++ source, reproduce its random-number stream, or claim bit-for-bit output parity.
- The rebuild still does not reproduce the reference's 3D density interpolation, complete octave initialization/order, biome temperature map, sand/gravel/depth surface rules, randomized bedrock depth, or feature/ore post-processing.
- The legacy `public/minecraft.html` runtime and the new `public/voxelcraft-rebuild.html` preview remain separate. Changing the rebuild generator does not silently migrate or replace the legacy runtime.

## Safe implementation sequence

1. Keep deterministic noise sampling independent from chunk storage and rendering.
2. Lock down negative-coordinate and chunk-boundary tests before introducing terrain streaming.
3. Port surface materials and sea-level handling as explicit systems, with regression tests.
4. Add a 3D density sampler only after its coordinate convention, dimensions and generator version are explicit.
5. Add biome and feature passes in deterministic chunk-local stages; test cross-chunk features with neighboring chunks loaded in different orders.
6. Keep parity claims scoped to the exact systems and tests completed. Static tests do not prove visual terrain fidelity or browser performance.

## License and provenance boundary

The repository's historical reference tree has no confirmed project-level license grant in the checked-in material. This audit records observed behavior; it does not grant permission to redistribute copied C++ implementation or restricted game assets. Keep new implementation independently written, preserve attribution notes, and resolve licensing before any redistribution claim.
