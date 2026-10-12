# VoxelCraft Modern Rebuild — Audit and Architecture Gate

Status: **Phase 0 audit / architecture baseline**
Branch: `rebuild/voxelcraft-modern-core`
Date: 2026-10-12
Target: modern browser voxel sandbox; MCPE 2013 source is a historical behavior/architecture reference, not the target engine.

## 1. Repository baseline

- The deployed game currently lives in `public/minecraft.html` and is a self-contained Three.js 0.160 runtime. The host is Next.js; GitHub Pages is built by `.github/workflows/static.yml`.
- Existing gameplay is already nontrivial (chunked terrain, block catalog, DDA interactions, hotbar/inventory, persistence, day/night and a basic mob). A rebuild must not silently throw away working behavior; the existing runtime stays as a reference and rollback point.
- `rujukan/pocket-edition-2013/mcpe-source/` contains historical C++ implementation. The inspected `Tile.cpp` defines tile IDs/materials/destroy times/sounds/categories and demonstrates that block behavior is metadata-driven, not just a texture. The existing reference audit covers GUI/screen lifecycle, NinePatch, inventory, chunk cache, and chunk mutation responsibilities.
- `VoxelCraft/` is a checked-in mirror/snapshot of the upstream MCBVanillaResourcePack. `VanillaBehaviorPack/` is a git submodule. `public/VoxelCraft/` is a staged runtime subset, not the canonical source.
- The repo's current validation contract calls for `bun run validate:game` and `bun run build`, plus browser interaction tests when possible. The new branch will add more focused unit tests and keep those existing checks as regression gates.

## 2. License and provenance gate (must not skip)

### Findings
- No tracked root or source-tree file named `LICENSE`, `LICENCE`, `COPYING`, `NOTICE`, or `COPYRIGHT` was found in the repository tree at audit time.
- `LICENSE-ATTRIBUTION.md` says vanilla Bedrock assets in `VoxelCraft/` and `VanillaBehaviorPack/` belong to Mojang Studios/Microsoft, warns against redistribution without verifying rights, and advises treating the project as personal/non-commercial absent written permission.
- The historical Pocket Edition C++ source under `rujukan/pocket-edition-2013/mcpe-source/` has no discoverable license file in this repository tree. A source snapshot being present does **not** establish permission to redistribute, adapt, or publish it.
- The upstream Resource Pack / Behavior Pack mirrors also contain third-party copyrighted game assets. Attribution alone is not a license grant.

### Required handling
1. Do not copy C++ implementation text into new runtime files and do not expand redistribution of source textures, sounds, models, fonts, or behavior-pack content while permissions are unresolved.
2. Use the historical source to identify system responsibilities, state transitions, invariants, and expected mechanics; implement browser systems as original TypeScript/JavaScript with independent tests. This is a risk-reduction measure, not a legal conclusion that every use is authorized.
3. Before a public release, verify the license/terms and provenance of each included code/asset dependency; replace or exclude material whose redistribution rights are unclear. Keep an asset manifest with source, license/permission, and runtime use.
4. Do not add a generic MIT license to the repository or imply Mojang/Microsoft endorsement without an explicit owner decision and rights review.

**Gate result:** implementation may proceed on original engine code and procedural/test fixtures, but distribution of historical code and proprietary assets remains **unverified / blocked pending rights review**.

## 3. Mechanics inferred from source review

These are behavior contracts to reproduce or deliberately modernize; they are not permission to copy implementation code.

- **Block registry:** stable IDs map to material/solidity/transparency, hardness, sound, drops, placement rules, and render layer. Visual texture selection must not define gameplay semantics.
- **World edits:** validate coordinates and target state; no-op edits do not create redundant changes; a committed edit invalidates local and boundary-dependent render/collision data, updates derived height/lighting as applicable, and marks persistence dirty.
- **Chunk boundaries:** coordinates are explicit and bounded. Edits, structures, lighting and mesh invalidation crossing a 16-block boundary must update the neighbor deterministically.
- **Player physics:** collision uses a player AABB and movement must resolve axes/substeps rather than teleport through thin walls. Input must reset on blur/visibility loss and key-repeat must not toggle edge-triggered actions repeatedly.
- **Screens and inventory:** screen lifecycle, focus, hit-testing, resize, keyboard navigation, and item state belong to explicit systems. HUD/hotbar state is separate from menu state; inventory selection/action is separate from drawing.
- **Save data:** validate data at the boundary, version the schema, and avoid trusting malformed or oversized browser storage. Keep world edits and player/inventory state consistent after reload.
- **Modern extensions:** new mechanics (configurable worlds, modern crafting, mobs, multiplayer later) must be isolated behind explicit versioned systems so they do not contaminate the historical compatibility profile.

## 4. Proposed browser architecture

The first step is a modular engine with clear data ownership; rendering and UI consume game state rather than becoming the source of truth.

```text
src/game/
  core/       fixed-step clock, game session, deterministic RNG, event bus
  world/      block registry, coordinates, chunk data, edits, generation
  physics/    AABB, collision resolution, movement controller, raycast
  gameplay/   interaction, breaking progress, placement, drops, survival rules
  inventory/  item stacks, slots, hotbar, inventory actions
  persistence/ versioned save schema, validation, migration, IndexedDB adapter
  rendering/  Three.js scene adapter, chunk meshing, materials, effects
  input/      keyboard/mouse/touch mapping and focus-loss reset
  ui/         screen state and view adapters (HUD/menu/inventory)
  tests/      deterministic unit and integration tests
```

- **Language/build:** TypeScript modules for engine state; browser renderer remains Three.js. Integrate incrementally with the current static game entry instead of attempting a single risky rewrite of the whole HTML file.
- **Simulation:** fixed timestep with a render interpolation layer; no game rules hidden in render callbacks.
- **World model:** authoritative chunk/block data independent from meshes; edits go through one transaction API; render/collision caches are derived and invalidatable.
- **Persistence:** schema-versioned IndexedDB worlds, safe migration and graceful recovery; retain a compatibility importer for old localStorage saves where feasible.
- **Performance:** begin synchronously for correctness; move chunk generation/meshing to Web Workers only after module contracts and deterministic tests are stable.
- **Input/UI:** actions are semantic (move, jump, use, break, place, inventory, pause), with keyboard/mouse/touch adapters. Responsive UI is a view of state, not a second state store.
- **Testability:** pure unit tests for registry/coordinates/raycast/physics/save validation; deterministic world tests; Playwright smoke + interaction tests; existing repository checks remain required.

## 5. Implementation sequence and acceptance gates

### Phase 0 — Audit and baseline (this document)
- [x] Inspect current architecture, package scripts, CI, reference map and attribution policy.
- [x] Read representative source implementations for block definitions and GUI/chunk behavior.
- [x] Record missing/unclear licensing and prohibit unsupported asset/code redistribution.
- [ ] Complete a subsystem-by-subsystem source map before claiming full source audit.

### Phase 1 — Engine contracts and test harness
- Define coordinate conventions, stable block/item IDs, chunk bounds, save schema and deterministic RNG.
- Add unit tests before integrating behavior into rendering.
- Gate: all unit tests, `bun run validate:game`, and `bun run build` pass.

### Phase 2 — Core world and interaction
- Implement chunk data, transaction-based block edits, raycast, placement validation, break progress and drop rules.
- Gate: tests for face selection, reach limits, invalid coordinates, boundary edits and no-op edits pass.

### Phase 3 — Player movement and survival
- Implement AABB collision, gravity, jump, sprint, fall damage and mode-specific movement.
- Gate: tests cover corners, walls, steps, ceilings, chunk boundaries and repeated key input; browser tests verify real controls.

### Phase 4 — Inventory and persistence
- Model item stacks, hotbar selection, inventory actions and versioned saves independently from UI.
- Gate: save/reload round trip, corrupt-save recovery, migration and inventory conservation tests pass.

### Phase 5 — Rendering and modern features
- Connect Three.js meshes/materials to authoritative state; optimize transparent/opaque meshing and chunk updates.
- Add modern features only after core mechanics gates pass; maintain a documented compatibility matrix.

### Phase 6 — UX/performance/release
- Validate desktop and mobile controls, resize/focus transitions, loading/error states, performance and asset rights.
- Gate: CI green, browser smoke + gameplay tests green, no unexplained console/network errors, license/provenance review complete.
- Merge only after the pull request's required checks pass; `main` is not deleted or rewritten.

## 6. Known limitations of this audit

This is a targeted first-pass audit, not a line-by-line review of the entire historical C++ tree or every resource asset. In particular, the source snapshot's legal provenance is unresolved and the source may be incomplete or historically modified. Every mechanic implementation must cite the exact reference files reviewed and describe intentional differences. Do not report unrun tests as passing.
