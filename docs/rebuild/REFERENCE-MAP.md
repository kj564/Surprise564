# VoxelCraft Rebuild — Verified Reference Map

This is a guide for investigation, not permission to copy historical code or redistribute assets. Verify provenance and licensing before reproducing source or publishing assets.

| System | Reference inspected | Design implication for browser code |
| --- | --- | --- |
| Client orchestration | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/Minecraft.cpp` | Explicit initialization, lifecycle and system ownership. |
| UI lifecycle | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/Screen.cpp` | Screen state and input/focus routing should be separate from world input. |
| HUD | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/Gui.cpp` | HUD/hotbar responsibilities are distinct from menu screens. |
| Inventory UI | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/components/InventoryPane.cpp` | Selection, scrolling, hit areas and rendering are separate concerns from inventory rules. |
| Block definitions | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/Tile.h` | Legacy registry has traits for shapes, render layers, transparency, ticking and light; blocks are not all identical cubes. |
| Block behavior | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/Tile.cpp` | Tile initialization includes material and sound categories. |
| World API | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/Level.h` | World responsibilities include chunks, scheduled ticks, entities, light updates and storage. |
| World implementation | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/Level.cpp` | Generation/chunk source, pathfinding, light and entity systems need deliberate boundaries. |
| Collision geometry | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/phys/AABB.h` and player/entity physics sources | AABB operations and axis collision clipping are behavior references; compare face clipping and grounded movement before expanding parity. |
| Block shape taxonomy | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/Tile.h` | Explicit legacy categories include cube, cross-texture, torch, water, door, ladder, stairs, fence, cactus, bed and entity-tile shapes; geometry and collision must be implemented per shape rather than assumed cubic. |
| Block defaults and materials | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/Tile.cpp` | Legacy definitions centralize render layers, light blocking/emission, solidity, tick flags and sound groups; each ported block should be checked against these fields and initialization mappings. |
| Client/input lifecycle | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/Minecraft.cpp` | Client orchestration owns initialization and coordinates input, game mode, player, world, storage, GUI and renderer; browser adapters should preserve those ownership boundaries. |
| HUD lifecycle | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/Gui.cpp` | HUD/hotbar is a distinct in-game overlay; menu/screen lifecycle and world interaction should not be coupled into block data or rendering. |
| Assets | `VoxelCraft/` | Repository attribution identifies these as vanilla resource-pack snapshot assets; verify rights before redistribution. |
| Behavior data | `VanillaBehaviorPack/` | Bedrock data is a reference, not directly executable browser-game code. |

## Initial modules on this branch

- `src/game/core/coordinates.ts`: world/chunk/local coordinates with correct negative-coordinate semantics and flat indexing.
- `src/game/core/fixed-step.ts`: bounded fixed-step simulation clock with catch-up limits, dropped-time reporting and interpolation alpha.
- `src/game/world/chunk.ts`: renderer-independent `Uint16Array` storage, input validation, revision tracking and defensive snapshots.
- `src/game/world/world.ts`: loaded-chunk-only world reads/writes, explicit distinction between air and unloaded data, and dirty-chunk tracking across boundaries.
- `src/game/interaction/raycast.ts`: deterministic grid-DDA targeting with defined axis tie-breaking and explicit stop on unloaded chunks.
- `src/game/interaction/placement.ts`: validates the adjacent target and includes a single-player placement transaction that checks inventory, player overlap, world mutation and item consumption. Solid shapes currently use conservative full-cube overlap until orientation-specific shapes are implemented.
- `src/game/interaction/mining.ts`: time-based mining sessions, target-change cancellation, guarded block removal, drop insertion and explicit reporting of inventory overflow.
- `src/game/interaction/controller.ts`: coordinates registry-based targeting, continuous mining/cancellation, drop awarding and inventory-backed placement. This is a renderer/input-independent orchestration layer with integration tests.
- `src/game/blocks/registry.ts`: immutable data-driven block definitions with namespaced keys, MCPE legacy ID mappings (including normalized still/flowing fluid aliases), shape/render traits, hardness, sound, light and drop metadata. The initial catalog is intentionally a subset, not a claim of full block parity.
- `src/game/inventory/inventory.ts`: immutable item stacks, slot operations, stack merging, overflow reporting, removal and conservation-focused tests.
- `src/game/persistence/save-schema.ts` and `world-save.ts`: versioned save validation, corruption/size limits, detached chunk snapshots, and safe world/inventory/player capture and restore. Browser storage integration remains a later step.
- `src/game/physics/aabb.ts`: immutable AABB bounds, strict intersection, per-axis displacement clipping and swept bounds.
- `src/game/physics/world-collision.ts`: broad-phase collision queries from world data; unknown IDs and unloaded cells fail closed as solid cubes.
- `src/game/physics/world-collision-provider.ts`: adapter that feeds authoritative world collision queries directly into player physics, covered by integration tests against actual voxel blocks and unloaded chunk edges.
- `src/game/physics/player-physics.ts`: fixed-step movement, gravity, grounded jump, diagonal speed normalization and collision response; it receives a collision provider and is not yet wired to the live renderer/input.
- Unit tests run via `bun run test:game-core`.

## Current preview wiring and gaps

- `src/game/browser-entry.ts` is bundled to `public/voxelcraft-engine.bundle.js` by `bun run build:voxel-engine`.
- `public/voxelcraft-rebuild.html` is a browser presentation/input shell. It imports the generated TypeScript engine bundle and routes world state, player movement/collision, targeting, mining, placement, inventory and saves through `VoxelCraftEngine`; the legacy `public/minecraft.html` remains a separate old runtime and is not evidence of engine integration.
- The rebuild preview currently builds chunk meshes from the authoritative TypeScript world. Its renderer remains a thin shell, and full parity is not achieved: shape/state variants, light propagation, fluid simulation, complete MCPE block/item catalogs, entity AI, crafting/containers, and rigorous gameplay/browser regression coverage remain incomplete.
- Current shape support is deliberately partial. The MCPE reference declares more shapes than the mesher supports. Each new shape needs geometry, selection and collision tests rather than a fallback cube.

These modules and the playable preview are still an incremental foundation, not complete Minecraft PE 2013 parity.