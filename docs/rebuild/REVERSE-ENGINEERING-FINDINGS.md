# VoxelCraft — Reverse-Engineering Findings (MCPE 2013)

This document records source-driven findings from the checked-in historical Pocket Edition source under `rujukan/pocket-edition-2013/mcpe-source/handheld/src/`. It is an engineering crosswalk, not a claim that this historical tree is the complete or exact source of every later Bedrock release. Findings below are paraphrased; implementation should be based on observed behavior and tests rather than copying large source sections.

## Architecture traced

| Concern | Reference implementation | Findings relevant to the browser engine |
| --- | --- | --- |
| Block catalog and behavior | `world/level/tile/Tile.h`, `Tile.cpp`, individual `*Tile.cpp/.h` files | Tile behavior is centralized through registered definitions and per-tile subclasses. The source defines opaque, alpha-tested and blended render layers; solidity, translucency, light blocking/emission, sound types and shape-related behavior are not one universal “cube” property. |
| Chunk storage and mutation | `world/level/chunk/LevelChunk.h/.cpp` | Chunk writes normalize legacy tile IDs to 8-bit storage and track metadata, heightmap, lighting and lifecycle callbacks. Browser chunk storage uses a newer 16-bit ID buffer, so it must preserve legacy identity without pretending the memory layout is identical. |
| World access and lifecycle | `world/level/Level.h/.cpp`, `world/level/chunk/ChunkCache.h` | World access is mediated by level/chunk abstractions; chunk availability is a distinct state from air. The rebuild intentionally keeps unloaded chunks distinguishable and avoids silently generating them during a read/write. |
| Terrain generation | `world/level/levelgen/RandomLevelSource.h/.cpp`, related biome/noise classes | Historical terrain generation is a multi-stage seeded pipeline with noise, biome and feature dependencies—not a simple heightmap. Current browser heightmap generation is explicitly a starter generator, not yet parity with MCPE terrain. |
| Block destruction and game rules | `client/gamemode/GameMode.cpp/.h` | Destruction checks world/game-mode conditions and coordinates tile mutation with player actions. The browser engine splits timed mining, validation, block mutation and inventory drops so each step can be tested independently. |
| Chunk rendering | `client/renderer/LevelRenderer.cpp/.h`, `TileRenderer.cpp/.h`, renderer chunk helpers | Rendering is chunk-oriented and has explicit chunk sizing, visibility/dirty-chunk work and separate tile geometry. Browser meshes are disposable derived data; the world remains authoritative. |
| Entity bounds and movement | `world/entity/Entity.cpp/.h`, `world/entity/player/Player.cpp/.h`, `client/player/LocalPlayer.cpp/.h` | The entity base uses a 0.6-wide, 1.8-high bounding box and tracks grounded/collision state. The browser physics module uses the same nominal body dimensions but a browser-specific fixed-step integrator; movement parity still requires comparative tests. |
| Save abstraction | `world/level/storage/LevelStorage.h`, storage implementations and level metadata | Storage is abstracted from the simulation and chunk data. The browser rebuild uses a versioned validated save schema and should add migrations rather than conflating its localStorage format with the historical native format. |
| Runtime composition | `client/Minecraft.cpp`, `client/gamemode/GameMode.cpp` | The native client composes player, world, renderer, game mode and interaction systems. The rebuild keeps those responsibilities separated between the engine, browser input and rendering adapter. |

## Verified compatibility hazards

1. **Block IDs are not interchangeable.** The current browser game has its own numeric `BLOCKS` catalog. For example, its ID 1 denotes grass, while the rebuilt registry maps legacy ID 1 to stone and legacy ID 2 to grass. Conversion must use the explicit identity adapter in `src/game/adapters/browser-block-ids.ts`; never copy a raw block array or old save directly into the other representation.
2. **A chunk buffer is not a full block definition.** Legacy tile behavior also includes metadata/state, shape, render layer, light, sounds, drops, callbacks and neighbor updates. A matching numeric ID alone is insufficient to claim parity.
3. **Terrain generation is not yet a faithful port.** The current seeded heightmap provides reproducible starter terrain and streaming. Reproducing MCPE terrain requires tracing random-number semantics, noise inputs, biome selection, caves, ores, water, structures/features, and generation order, then comparing generated samples against reference fixtures.
4. **Renderer output is not simulation state.** The source has a chunk renderer and specialized tile rendering; the browser uses a renderer-independent mesh cache and Three.js adapter. A mesh optimization must not change collision, targeting, drops, lighting rules or saved block state.
5. **WASM and WebGPU are accelerators/backends, not sources of truth.** The Rust WASM terrain sampler must match the TypeScript implementation across negative coordinates and seeds. WebGPU is preferred when initialization succeeds; WebGL remains the compatibility path. Neither path may alter game rules.

## Reverse-engineering workflow

- Read the declaration and implementation together (`.h` plus `.cpp`) and trace callers before inferring semantics.
- Record the exact source path, behavior hypothesis, known differences and a test before porting a rule.
- Use small fixtures for block IDs, chunk index/layout, terrain samples, collision edges and break/drop behavior.
- Keep source-derived behavior distinct from browser-specific implementation decisions.
- Do not claim “complete MCPE parity” until fixture comparisons cover the relevant systems. The historical source's licensing/provenance also remains a release-review item; source availability is not itself a license grant.

## Current implementation status

- **Implemented/tested:** data-driven block registry subset; explicit browser/engine block-ID mapping; typed chunk storage; world/chunk dirty tracking; AABB collision and player movement; DDA targeting; timed mining/placement; inventory; versioned save validation; chunk mesh generation; deterministic starter terrain and chunk streaming.
- **Added in this change:** Rust `wasm32-unknown-unknown` terrain-height kernel with TypeScript fallback, WASM/TypeScript parity tests, WebGPU renderer initialization with WebGL fallback.
- **Still not claimed:** full native terrain-generation parity, all historical tile metadata/state behavior, full lighting/fluid/redstone/entity AI systems, multiplayer parity, or complete conversion of the existing `public/minecraft.html` game to the new engine. The new engine remains an independently testable rebuild preview until migration gates pass.
