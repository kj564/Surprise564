# MCPE 2013 Source Reverse-Engineering Notes

Reviewed against the checked-in reference under `rujukan/pocket-edition-2013/mcpe-source/` and the current browser-engine code on 2026-10-13.

## Scope and method

This is a behavioral/architectural reverse-engineering record, not a line-by-line port. The reference is a historical C++ Pocket Edition codebase. The browser game is a separate Three.js/TypeScript/JavaScript implementation, so original assumptions, numeric IDs, memory layouts, networking and platform APIs must not be copied blindly.

Primary files inspected:

- `handheld/src/client/Minecraft.cpp`
- `handheld/src/client/gui/Screen.cpp`
- `handheld/src/client/gui/components/Button.cpp`
- `handheld/src/client/gui/components/NinePatch.cpp`
- `handheld/src/client/gui/components/InventoryPane.cpp`
- `handheld/src/client/gui/Gui.cpp`
- `handheld/src/client/gui/screens/StartMenuScreen.cpp`
- `handheld/src/client/gui/screens/PauseScreen.cpp`
- `handheld/src/client/gamemode/GameMode.cpp`
- `handheld/src/client/renderer/LevelRenderer.cpp`
- `handheld/src/client/player/LocalPlayer.cpp`
- `handheld/src/world/level/Level.cpp`
- `handheld/src/world/level/chunk/LevelChunk.cpp`
- `handheld/src/world/level/chunk/ChunkCache.h`
- `handheld/src/world/level/tile/Tile.cpp`
- `handheld/src/world/entity/Entity.cpp`
- `handheld/src/world/entity/player/Player.cpp`
- `handheld/src/world/entity/player/Inventory.cpp`
- `handheld/src/world/level/storage/ExternalFileLevelStorage.cpp`

Current browser-side comparison points:

- `public/minecraft.html`: existing legacy browser runtime
- `public/voxelcraft-rebuild.html`: separate playable rebuild preview
- `src/game/engine.ts`, `src/game/world/*`, `src/game/interaction/*`, `src/game/physics/*`, `src/game/inventory/*`, `src/game/persistence/*`, `src/game/rendering/*`: renderer-independent rebuild systems

## 1. Runtime ownership and subsystem boundaries

### Reference behavior

`Minecraft.cpp` is the composition/orchestration point. It connects level, player, input, GUI/screen, game mode, and render systems. Screen changes are coordinated centrally; an individual screen does not own the entire game loop. The HUD in `Gui.cpp` is separate from menu screens.

### Browser implication

Keep authoritative gameplay state outside DOM and Three.js meshes. UI should submit commands to gameplay systems; it should not implement block rules in click handlers. Rendering should consume world data and produce derived meshes. Keep title/pause/inventory UI lifecycles distinct from the in-world HUD.

### Current status

The rebuild already follows much of this separation: `VoxelCraftEngine` composes world, player physics, inventory, targeting/mining/placement and save operations; the chunk mesher/cache is separate. However, the rebuild is exposed through `public/voxelcraft-rebuild.html` as a preview and has not replaced the existing `public/minecraft.html` runtime. Treat this as an intentional integration boundary, not proof of runtime parity.

## 2. World mutation is a transaction with side effects

### Reference behavior: `LevelChunk.cpp`, `Level.cpp`, `Tile.cpp`

A chunk block write is not merely an array assignment:

1. Normalize/check the incoming tile value and compare it with the previous tile/data; unchanged writes return early.
2. Update block storage and per-block auxiliary data.
3. Invoke removal behavior for the old tile where applicable, including removal of tile-entity state on relevant client transitions.
4. Recalculate column height when opacity changes affect the topmost occupied position.
5. Update sky light and block light, then reconcile light gaps.
6. Invoke placement behavior for the new tile when the server-side rules require it.
7. Mark the chunk unsaved and set the corresponding update-map bits.

The legacy packed index in this file is `x << 11 | z << 7 | y`, reflecting that source's 16×16×128 chunk layout and axis order. It is not a safe formula to transplant into a differently dimensioned browser chunk.

### Browser implication

Route every edit through a single world mutation API. The mutation should validate coordinates/IDs, detect no-ops, update authoritative storage, update persistence state, and report all affected render/neighbor regions. Add light, heightmap, block callbacks and scheduled ticks as distinct systems when those mechanics are implemented. Do not claim these systems exist merely because a mesh was rebuilt.

### Current status and gaps

- `ChunkData` provides bounded storage, change detection and revision tracking.
- `VoxelWorld` owns chunk data and tracks dirty chunk keys.
- Interaction functions separate target validation and placement transactions from UI.
- The current rebuild does not yet reproduce the reference's complete heightmap, sky/block-light propagation, tile lifecycle callbacks, block entities or scheduled-tick behavior.
- Unknown IDs and unloaded chunks are deliberately handled conservatively in collision/targeting; preserve this fail-closed behavior.

## 3. Chunk cache, loading, generation and neighbors

### Reference behavior: `ChunkCache.h`

The reference uses a bounded cache with a last-accessed-chunk fast path and cache slots. When a requested slot represents another chunk, the previous chunk is unloaded/saved before replacement. The cache tries saved storage first and falls back to a chunk source/generator. Post-processing is gated by the availability of neighboring chunks, and neighboring chunks can be revisited for deferred post-processing once the required neighborhood exists. Out-of-range coordinates use an explicit empty-chunk path in this fixed-size world.

### Browser implication

Do not confuse an unloaded chunk with air. Define explicit loaded/unloaded/generating states before adding aggressive streaming or eviction. Save dirty chunks before eviction; prevent duplicate cross-chunk generation; defer tree/feature placement that needs neighbors until its neighborhood contract is satisfied. Mesh invalidation at a chunk edge must include the neighbor whose exposed faces changed.

### Current status and gaps

- `VoxelWorld.getBlock` distinguishes an unloaded chunk from block ID 0.
- `ensureTerrainNeighborhood` deterministically fills a bounded square neighborhood and does not overwrite already loaded chunks.
- The browser rebuild intentionally does not unload chunks yet. Add persistence-aware eviction only after dirty-save/reload tests exist.
- The legacy runtime's saved voxel overrides are indexed per chunk after PR #85, avoiding a full save-map scan for every generated chunk.

## 4. Block definitions, IDs and game-mode rules

### Reference behavior: `Tile.cpp`, `GameMode.cpp`

The source defines more than a display name or texture: tile registries carry material/solid/render/light/tick/entity-related traits and sound types. Game mode mediates mining and item use. The reference's block-destruction path checks that a tile exists, enforces immutable-world restrictions, mutates the level, and only then performs destruction effects and invokes the tile's destroy behavior. Item-on-block use gives the target tile's own `use` behavior a chance before falling back to the held item. Creative item use preserves count/auxiliary data where normal use might consume or alter it.

### Browser implication

Centralize block rules in registry definitions and interaction services. Separate validation, world mutation, inventory consumption, drops, sound and particles so failed actions cannot partially consume items. Keep creative/survival policy explicit. Avoid sprinkling block-ID conditionals through the renderer.

### Current status and gaps

- `src/game/blocks/registry.ts` uses namespaced identities, explicit legacy IDs, shapes, render layers, hardness, sound, light traits and drops.
- `src/game/adapters/browser-block-ids.ts` exists because legacy runtime numeric IDs differ from historical MCPE IDs. Never copy raw block arrays or numeric IDs across these formats.
- The current rebuild's mining rules are time-based but tool tiers, enchantments, status effects and full game-mode policy remain incomplete.
- A registry trait is only metadata until a consuming subsystem implements it. For example, declared light traits do not mean dynamic lighting is already implemented.

## 5. Player movement and collision

### Reference behavior: `Entity.cpp`, `Player.cpp`, `LocalPlayer.cpp`

The player is an entity with position, velocity, bounding box, movement/collision resolution and player-specific state. Local-player input is translated into movement intents; creative flight is a distinct path from ordinary movement. Collision and movement are not solely camera transforms. The historical implementation contains special cases for block shapes and auto-jump, so it should be treated as behavioral evidence rather than a modern physics specification.

### Browser implication

Keep camera orientation separate from the player's collision body. Apply gravity and movement through bounded simulation steps; resolve floors, walls and ceilings using an AABB; derive grounded state from collision results rather than input. Add shape-aware collision before treating slabs, stairs, doors and other non-cube blocks as physically correct.

### Current status and gaps

- The rebuild has a fixed-step clock, AABB movement resolution and a world collision query.
- Unloaded chunks are treated as solid barriers by collision queries to avoid falling through missing data.
- Collision currently uses conservative full cubes; non-cube collision shapes and the source's complete movement edge cases are not implemented yet.
- Browser playtesting is still required for slopes/steps, corners, chunk edges, jumping and pointer-lock transitions.

## 6. Inventory and GUI responsibilities

### Reference behavior: `Inventory.cpp`, `InventoryPane.cpp`, `Gui.cpp`

The historical inventory initializes a 36-slot main inventory plus a 9-slot selection/hotbar region. The selected slot is an explicit index and selected-item access goes through inventory linkage. The inventory pane requests items from its callback rather than owning gameplay inventory. Rendering is layered: slot backgrounds, item sprites, disabled/selection feedback, item counts and durability decorations are handled separately. The pane clips content and maintains selection/scroll behavior. The in-world hotbar is rendered by the separate GUI subsystem.

### Browser implication

Inventory data must be authoritative and independent of slot DOM/canvas rendering. Keep item stacks, selected slot, insertion/removal, durability and action eligibility in the inventory/gameplay layer. Render counts and durability as overlays on the original item sprite; keep click/touch hit areas aligned with slots.

### Current status and gaps

- The rebuild has a pure `Inventory` model and selected-slot state in `VoxelCraftEngine`.
- The browser UI still needs parity checks for stack splitting/merging, drag transfer, crafting/container callbacks, item durability and touch selection.
- Do not assume that a visible inventory slot implies the corresponding gameplay action exists.

## 7. Screens, buttons, input and layout

### Reference behavior: `Screen.cpp`, `Button.cpp`, `StartMenuScreen.cpp`, `PauseScreen.cpp`

Screen initialization calls subclass setup and then positions controls; resizing reruns layout. Pointer coordinates are converted into screen coordinates before click/release handling. Keyboard key events and text-character events are separate. Screens may prevent events from propagating to gameplay. Buttons have distinct visibility, active/disabled, selected/hovered and pressed states, and click handling checks active state and hit bounds. The start menu's button registrations and tab-navigation controls are explicit; button IDs route to concrete screen transitions.

### Browser implication

Recompute layouts after resize, use semantic controls and real actions, and prevent UI input from leaking into movement/mining. Track pressed/released states separately from hover/focus. Keyboard, mouse, touch and accessibility focus require separate regression tests. Use original Resource Pack states when the matching asset exists; nine-slice panels must preserve corners and edges rather than stretch the entire image.

### Current status and gaps

- Existing UI fixes use original Resource Pack panel and button assets where available.
- Static CSS validation does not establish pixel-perfect rendering or correct input routing.
- The browser game still needs hands-on viewport-resize, keyboard navigation, pointer/touch and focus tests.

## 8. Rendering and dirty-region model

### Reference behavior: `LevelRenderer.cpp` and chunk code

The renderer maintains chunk render structures and considers visibility/distance/culling. World mutation marks data for later updates; the renderer is a consumer of changed world state rather than the authority for block contents.

### Browser implication

Treat meshes as disposable cache entries derived from chunk revisions. Rebuild only dirty chunks and adjacent chunks when boundary faces change. Cull hidden faces and group geometry/materials to reduce draw calls. Unknown or unsupported block shapes should be counted/reported rather than silently rendered as a semantically different block.

### Current status and gaps

- `chunk-mesher.ts` generates visible cube faces by render layer and reports unknown IDs/unsupported shapes.
- `ChunkMeshCache` caches derived meshes.
- Lighting, ambient occlusion, texture-atlas UV parity, non-cube mesh geometry, entity rendering and complete culling remain separate work items.

## 9. Save/load, compatibility and recovery

### Reference behavior: `ExternalFileLevelStorage.cpp`

The historical storage code writes a new level-data file before replacing the primary save and keeps an old-save backup during the replacement sequence. It also tracks storage versions and contains explicit data converters for old block representations/unavailable IDs. Player data and chunk data are persisted through distinct code paths.

### Browser implication

Treat saves as untrusted versioned input. Validate dimensions, coordinates, IDs, item stacks and total size before mutating a world. Preserve a last-known-good save until the new save is successfully serialized and stored. Migrations must be explicit and round-trip tested; unsupported IDs must not be guessed into unrelated blocks.

### Current status and gaps

- `save-schema.ts` validates a versioned `voxelcraft-world` schema, bounds payload size and validates world/player/inventory data.
- `world-save.ts` snapshots and restores into a fresh world; engine restoration reports validation errors rather than partially mutating an existing engine.
- The current browser rebuild schema is version 1 and is not byte-compatible with the historical native storage format.
- The existing legacy browser runtime uses its own localStorage save shape. Do not replace or reinterpret that shape without an explicit migration and regression tests.

## 10. Verified mapping and non-equivalences

| Reference concept | Browser-side counterpart | Important difference |
| --- | --- | --- |
| `Minecraft` orchestration | `VoxelCraftEngine` plus browser adapter | The browser engine is not a port of the C++ runtime. |
| `LevelChunk` block storage | `ChunkData` / `VoxelWorld` | Chunk dimensions, IDs and index order differ. |
| `ChunkCache` | `VoxelWorld` + `ensureTerrainNeighborhood` | Current rebuild does not implement bounded cache eviction. |
| `GameMode::destroyBlock` | mining/interaction controller | Effects, game modes and drops are not yet fully equivalent. |
| `Inventory` | `src/game/inventory/inventory.ts` | Current model is a compact stack model, not all legacy container/link behavior. |
| `LevelRenderer` | chunk mesher/cache + Three.js adapter | Renderer is derived data; full lighting/culling parity is not implemented. |
| Native level storage | `src/game/persistence/*` | Different schema and storage medium; no direct file compatibility. |
| Native UI screens | browser DOM/CSS in the two HTML entry points | Input lifecycle and responsive behavior need browser tests. |

## 11. Next implementation order based on source findings

1. **World mutation contract:** add explicit tests for edits on chunk edges, no-op changes, dirty-neighbor reporting and persistence after reload.
2. **Interaction parity:** test break cancellation when the target changes or the pointer leaves, placement against unloaded/unknown cells, inventory rollback on failed placement, and correct drops.
3. **Save durability:** add a browser persistence adapter with last-known-good recovery and explicit migration tests before changing the legacy save format.
4. **Collision shape registry:** move from conservative full-cube collision to block-defined shapes for the subset actually rendered.
5. **Lighting/heightmap:** implement as separate derived world systems, driven by block mutations; do not fake the result with renderer-only shading.
6. **UI/runtime integration:** after engine behavior reaches parity, integrate behind a reversible feature flag and test the existing legacy world/save path remains intact.
7. **Browser smoke suite:** exercise startup, chunk generation, mine/place, inventory, save/reload, resize, keyboard, mouse and touch. CI static checks are necessary but not sufficient.

## Verification statement

This document is based on direct inspection of the listed source files and current browser-engine files. It is a reverse-engineering map and gap analysis, not a claim that the browser rebuild implements every native behavior. Automated CI passing does not replace browser-level functional or visual testing.
