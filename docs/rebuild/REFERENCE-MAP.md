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
| Collision geometry | `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/phys/AABB.h` | AABB operations and axis collision clipping are relevant behavior references. |
| Assets | `VoxelCraft/` | Repository attribution identifies these as vanilla resource-pack snapshot assets; verify rights before redistribution. |
| Behavior data | `VanillaBehaviorPack/` | Bedrock data is a reference, not directly executable browser-game code. |

## Initial modules on this branch

- `src/game/core/coordinates.ts`: world/chunk/local coordinates with correct negative-coordinate semantics and flat indexing.
- `src/game/world/chunk.ts`: renderer-independent `Uint16Array` storage, input validation, revision tracking and defensive snapshots.
- `src/game/physics/aabb.ts`: immutable AABB bounds, strict intersection, per-axis displacement clipping and swept bounds.
- Unit tests run via `bun run test:game-core`.

These primitives are not yet connected to Three.js and do not constitute complete player collision, rendering, generation or persistence.