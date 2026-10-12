# VoxelCraft Rebuild Roadmap

The rebuild is isolated on `rebuild/web-modern-foundation`. `main` and the legacy playable game are not to be deleted or overwritten. Do not merge work with failing or missing required checks.

## Gate 0 — Source and license audit (current)
- [x] Create isolated rebuild branch.
- [x] Inspect repository root for a project-level LICENSE.
- [x] Inspect existing asset attribution and the resource pack's own README.
- [x] Record provenance and licensing blockers.
- [ ] Resolve whether source archive may be used and distributed; resolve assets independently.
- [ ] Correct misleading license fallback wording in attribution documentation.

**Exit criteria:** documented rights basis for every source/asset family intended for direct use. If unresolved, continue only with independently authored generic engine work and original/test assets.

## Gate 1 — Architecture and testing foundation
- [x] Draft module boundaries and target layout.
- [ ] Add TypeScript game-core entry point without importing legacy gameplay code.
- [ ] Add unit-test runner and a deterministic test world.
- [ ] Add CI checks for typecheck, unit tests, lint, build, and license/provenance manifest.
- [ ] Add browser smoke test for the new route separately from the legacy game.

## Gate 2 — First playable vertical slice
- [ ] Render a tiny deterministic voxel world with original placeholder textures.
- [ ] Player camera and input adapter.
- [ ] Fixed-step movement and collision.
- [ ] DDA targeting, break/place, and block registry.
- [ ] Hotbar state and accessible HUD.
- [ ] Browser acceptance test: load, move, target, break, place, restart.

## Gate 3 — Durable world and core systems
- [ ] IndexedDB save/load and versioned schema.
- [ ] Inventory stack invariants and item transfers.
- [ ] Chunk boundary updates, meshing, culling, and stress tests.
- [ ] World generation with seeded deterministic output.
- [ ] Settings, pause/resume, resize, pointer lock, touch fallback, WebGL context recovery.

## Gate 4 — Feature expansion
- [ ] Crafting, tools/durability, drops, liquids, lighting, day/night.
- [ ] Entities and AI only after the entity update/collision contracts are tested.
- [ ] Specialized block shapes and interactions; no treating every block as a cube.
- [ ] Sound and animation only after asset rights and loading pipelines are cleared.

## Gate 5 — Release candidate
- [ ] Full regression suite on clean CI.
- [ ] Browser tests at desktop and mobile viewports.
- [ ] Performance budget and long-session memory checks.
- [ ] Save migration and corruption recovery tests.
- [ ] Manual playtest checklist with reproducible bug reports.
- [ ] License, attribution, trademark, and asset manifest review.

## Release rule

A passing static build is necessary but insufficient. No feature is considered complete unless its automated tests and relevant browser behavior pass. Never merge to `main` while required checks fail or while the PR head differs from the tested commit.
