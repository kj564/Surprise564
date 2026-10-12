# VoxelCraft Web Rebuild — Architecture Proposal

Status: initial design; implementation must pass the licensing gate in `LICENSING-AND-SOURCE-AUDIT.md`.

## Product target

A modern browser-based voxel sandbox inspired by the feature depth of modern Minecraft, using the historical MCPE 2013 archive as a *reference lead only while rights are unresolved*. The implementation is independently authored. Do not promise exact parity until a feature-by-feature specification and test evidence exist.

## Design principles

- **Simulation is authoritative:** world state is data; meshes are a rendering projection and never the source of truth.
- **Deterministic core:** gameplay systems should be testable without WebGL, DOM, wall-clock time, or network access.
- **Feature vertical slices:** each system includes its data model, interaction, persistence (where relevant), tests, and browser verification before being called done.
- **No magic IDs:** block/item definitions use a central registry with stable identifiers and validated properties.
- **Fail visibly:** missing textures, invalid recipes, corrupted saves, and failed chunk jobs must be reported rather than silently substituted.
- **Separate browser adapters:** keyboard/mouse/touch, WebGL, audio, storage, and page lifecycle stay outside the pure simulation core.
- **Compatibility is explicit:** save format and behavior versions are versioned; migrations are tested.
- **License provenance travels with assets:** each imported file must have a source, license/status, and approval record.

## Proposed repository layout

```text
src/game/
  core/           # IDs, vectors, deterministic clock, events, RNG interfaces
  world/          # voxel storage, chunks, world generation interfaces
  blocks/         # block registry, material/shape/interaction definitions
  physics/        # player capsule/AABB, collision, movement integration
  interaction/    # voxel DDA raycast, break/place validation
  inventory/      # item stacks, slots, hotbar, transfer rules
  crafting/       # recipe model and crafting transactions
  entities/       # entity state and update interfaces
  simulation/     # fixed-step tick orchestration and system scheduling
  persistence/    # versioned save schema, serialization, migrations
  platform/
    browser/      # keyboard, pointer lock, touch, visibility, lifecycle
    rendering/    # Three.js renderer, chunk meshing, texture loading
    audio/        # browser audio adapter
    storage/      # IndexedDB adapter
  ui/             # HUD, inventory, pause/settings, accessible DOM controls
  test-fixtures/  # small deterministic worlds; no proprietary assets
tests/
  unit/
  integration/
  browser/
docs/rebuild/
```

This is a target layout, not a requirement to move files before the first vertical slice. Existing `public/minecraft.html` remains the legacy playable build and is not deleted or rewritten in place during foundation work.

## Module contracts

### World data
- Chunk dimensions are configuration, not hard-coded assumptions in consumers.
- Block storage uses integer IDs resolved through a validated registry.
- World reads/writes go through a world API that marks affected chunks and neighboring boundary meshes dirty.
- Out-of-world, unloaded, and air states are distinct where needed.

### Simulation and physics
- Fixed-step simulation with an accumulator; render frames may vary without changing physics results.
- Collision and movement are pure functions over state plus world queries.
- Player movement, jumping, gravity, flight/creative movement, and collision are separately tested.
- Interaction raycasting is independent of rendering and returns a stable hit record (voxel coordinate, face normal, distance).

### Rendering
- Renderer consumes snapshots/chunk data; it does not own authoritative world state.
- Chunk meshing omits hidden faces where safe and handles chunk boundaries deterministically.
- Transparent/cutout/opaque materials are explicit and tested separately.
- Texture loading validates HTTP status, image decode, dimensions, atlas/UV mapping, and reports the exact failed asset.
- WebGL context loss and page visibility changes are handled without corrupting simulation state.

### Inventory and interactions
- Item stacks enforce maximum counts and item identity.
- Hotbar selection is a view of inventory state, not a second source of truth.
- Place/break operations are transactions: validate reach, target face, collision with player, block rules, inventory count, and world write before committing.
- UI state is driven by game state and keyboard/mouse/touch inputs share the same action layer.

### Persistence
- Save payload has a schema version, world seed/settings, player state, modified chunks, inventory, and required metadata.
- Save operations are atomic at the application layer and recover from incomplete writes.
- IndexedDB adapter has a testable interface and a graceful quota/error path.

## Initial dependency policy

- TypeScript for new modules.
- Three.js for rendering only; no gameplay rules hidden in renderer callbacks.
- Vitest (or equivalent) for pure unit/integration tests and Playwright for browser acceptance tests.
- IndexedDB behind a storage interface.
- Keep dependency additions minimal and pin/lock versions; do not introduce a new framework without a measured need.

## Definition of done for each feature

1. Specification written and version/assumptions identified.
2. Unit tests cover normal, boundary, and invalid inputs.
3. Integration test covers the relevant systems together.
4. Browser test covers the real user interaction when the feature has UI or WebGL behavior.
5. No uncaught exceptions, failed required asset requests, or unexpected console errors in the relevant test.
6. Save/load compatibility and performance impact assessed where relevant.
7. Feature is documented with limitations; no “complete” claim based on build success alone.
