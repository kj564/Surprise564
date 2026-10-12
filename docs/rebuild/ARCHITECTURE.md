# VoxelCraft Rebuild Architecture

## Goals

- Modern browser voxel game with mechanics-first delivery.
- Use MCPE 2013 as a behavioral reference, not as code to mechanically translate.
- Keep authoritative game rules independent from rendering, DOM/UI and input devices.
- Make each mechanic testable without launching WebGL.
- Preserve `main`; changes are isolated on `rebuild/voxelcraft-modern-engine`.

## Dependency direction

```text
Browser input / UI
       |
       v
Game session / interaction controller
       |
       +------> Player simulation ------> World collision query
       |                                     |
       +------> Mining / placement ----------+
       |                                     v
       +------> Inventory                 VoxelWorld
       |                                     |
       +------> Persistence <---------- chunk snapshots
       |
       v
Three.js renderer / chunk mesher (derived view only)
```

Authoritative data belongs in the core modules. Renderer objects must never be the source of truth for block IDs, inventory counts, player position or save state.

## Current module boundaries

- `src/game/core/coordinates.ts`: world/chunk/local conversion and flat indexes.
- `src/game/core/fixed-step.ts`: bounded simulation time stepping.
- `src/game/world/chunk.ts`, `world.ts`: validated chunk storage, loaded/unloaded semantics and mutation invalidation.
- `src/game/blocks/registry.ts`: namespaced block definitions and a deliberately partial historical ID mapping.
- `src/game/physics/`: AABB math, collision resolution, world broad phase, player gravity/movement and world-collision adapter.
- `src/game/interaction/`: DDA targeting, mining sessions, placement transaction and controller orchestration.
- `src/game/inventory/`: item stacks and slot rules.
- `src/game/persistence/`: validated versioned save contract and pure capture/restore functions.
- `public/minecraft.html`: existing Three.js browser runtime; the rebuild engine is not yet integrated into it.

## Contracts and invariants

1. Loaded air is block ID 0; unloaded chunks are represented by `undefined`, never silently treated as air.
2. Mutating a world requires the owning chunk to be loaded. A block write reports affected chunks for derived mesh updates.
3. Inventory operations report overflow; item counts must not silently disappear.
4. Mining validates the target continuously and breaks only the same block after its timer completes.
5. Placement validates the adjacent cell, rejects player overlap for solid blocks, mutates the world and consumes one inventory item as one synchronous transaction.
6. Collision broad-phase is bounded and fails closed for unknown block IDs or unloaded cells.
7. Save payloads are versioned, size-limited and validated before restoration; corrupt payloads must not partially restore a world.
8. Three.js meshes and UI are derived representations, not authoritative game state.

## Delivery stages

### Stage 1 — Mechanics foundation (in progress)
- Coordinates/chunks/world data, block registry, collision math, player movement, raycast, mining, placement, inventory, save schema.
- Test every mechanic in isolation and in cross-module integration tests.

### Stage 2 — Runtime adapters
- IndexedDB save store with atomic write semantics and migration handling.
- Input adapter for keyboard, pointer lock, touch controls and hotbar selection.
- Fixed-step simulation session wiring physics, targeting, mining and placement.
- Explicit state transitions for title/menu, loading, playing, pause and world failure.

### Stage 3 — World simulation
- Deterministic seeded terrain generation and chunk lifecycle.
- Shape/state-specific collision and rendering for slabs, stairs, doors, plants and fluids.
- Block updates, gravity blocks, scheduled ticks, lighting and fluid behavior with bounded work queues.
- Drops/entities, survival rules, tools, mining modifiers and game modes.

### Stage 4 — Rendering and UX
- Chunk meshing with face culling and render layers; rebuild only dirty chunks.
- Texture atlas/material validation, crosshair/target highlight, break progress, hotbar and inventory.
- Desktop/mobile input, resize/orientation behavior, accessibility and settings.

### Stage 5 — Persistence, performance and release
- IndexedDB autosave and explicit save failure UX.
- Long-session memory/performance tests, chunk stress tests and browser E2E.
- Provenance/license gates for source references and runtime assets.
- Merge only after all required checks pass on the final PR head and review is complete.

## Validation

The rebuild CI runs `bun run test:game-core`, foundation/source-path validation, current game validation and the production build. Browser interaction tests for the new engine and end-to-end wiring are still future work; unit tests passing do not imply the game is fully playable.
