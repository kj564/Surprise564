# Reference Source Audit — Pocket Edition 2013

Reviewed: 2026-10-12
Repository path: `rujukan/pocket-edition-2013/mcpe-source/`

This document records concrete findings from reading the checked-in historical source before further browser-game changes. The source is an architectural/behavioral reference, not code to copy directly into the Three.js runtime.

## GUI and screen lifecycle

### `handheld/src/client/gui/Screen.cpp`
- Screen initialization assigns the game/font and dimensions, calls the subclass initializer, lays out controls, then updates keyboard/tab selection.
- Resizing updates dimensions and calls `setupPositions()`; layouts therefore need to be recomputed after viewport changes.
- Mouse input coordinates are translated from display dimensions into screen-space coordinates before click/release handlers run.
- Keyboard keys and text-character events are dispatched separately.
- A screen can stop input propagation with `passEvents`.

**Browser adaptation:** keep screen transitions, layout recomputation, pointer hit-testing, and keyboard handling explicit. Test resize, keyboard, and pointer/touch input separately.

### `handheld/src/client/gui/components/Button.cpp`
- A button's visible state, active state, selected state, pressed state, and click hit area are distinct.
- Click handling requires the button to be active and the pointer to be inside its bounds.
- Disabled buttons use a separate text treatment; selected/hovered states change appearance.
- The source's legacy atlas blit is partly commented out, so it does not by itself establish which current Resource Pack sprite should be used.

**Browser adaptation:** use authentic Resource Pack state sprites when available; do not treat hover styling as a substitute for disabled/pressed behavior. Keep hit areas aligned with visible controls.

### `handheld/src/client/gui/components/NinePatch.cpp`
- A panel is split into nine quads.
- The four corners and four edges preserve their intended geometry while the center region adapts to the target size.
- The component rebuilds its nine quads when dimensions change.

**Browser adaptation:** preserve source slice geometry and pixel scale; avoid stretching a complete pixel-art panel as one image. Validate small and large panel sizes.

### `handheld/src/client/gui/screens/StartMenuScreen.cpp`
- The screen registers menu buttons and keyboard/tab navigation controls separately.
- `setupPositions()` computes centered button positions from current screen dimensions.
- Button IDs dispatch to explicit screen transitions (world selection, multiplayer, options, etc.).
- The title screen is explicitly not an in-game screen.

**Browser adaptation:** menu layout and navigation should be responsive and deterministic; each control must invoke a real, supported transition rather than merely look interactive.

### `handheld/src/client/gui/components/InventoryPane.cpp`
- Inventory items are retrieved through the screen callback rather than owned by the renderer.
- The pane clips drawing to its viewport, renders slot backgrounds and item sprites in separate passes, and handles item counts/decorations separately.
- Selection calls back into inventory/screen logic and checks whether the item is allowed before acting.
- Scrollbars and selection feedback are separate concerns.

**Browser adaptation:** keep inventory data/actions separate from drawing; maintain consistent hitboxes, clipping, selection, item counts, and scroll behavior.

### `handheld/src/client/gui/Gui.cpp`
- The in-game HUD/hotbar is rendered by a separate GUI subsystem, distinct from menu-screen responsibilities.
- Hotbar geometry and slot hit-testing are computed in GUI coordinates.
- HUD elements are conditionally rendered according to game/player state.

**Browser adaptation:** do not couple pause/main-menu styles or transitions to in-game HUD state. Keep hotbar selection logic and HUD visibility tied to gameplay state.

### `handheld/src/client/Minecraft.cpp`
- The top-level object coordinates the level, player/input, GUI/screen, and rendering systems.
- Screen changes are managed through the central game object rather than each screen independently owning the whole runtime.

**Browser adaptation:** keep `public/minecraft.html` as the game runtime, with clear subsystem boundaries; do not move gameplay into the Next.js iframe host.

## World/chunk behavior

### `handheld/src/world/level/chunk/LevelChunk.cpp`
- Block changes are not only writes to a block array: the code checks for no-op changes, updates block/data storage, recalculates height where needed, updates lighting, invokes block lifecycle callbacks, and marks the chunk unsaved/updated.
- The historical storage layout uses explicit local coordinates and a packed array index.
- This file contains legacy assumptions and should not be copied without adapting bounds, block IDs, and browser-world semantics.

**Browser adaptation:** block edits must stay within chunk-local bounds, invalidate affected render data, persist edits, and update adjacent-chunk effects where a boundary is crossed. Do not assume a visual mesh update alone covers world-state consistency.

### `handheld/src/world/level/chunk/ChunkCache.h`
- Chunk lookup first checks a cached last-accessed chunk and then a bounded cache slot.
- Loading can replace/unload an old chunk, retrieve saved data or generate a new chunk, and run post-processing only when required neighboring chunks are available.
- The source explicitly handles out-of-cache coordinates and avoids blindly treating every coordinate as a populated chunk.

**Browser adaptation:** chunk generation/loading should be bounded and cache-aware; cross-chunk features must account for neighbor availability and avoid duplicate or missing boundary updates.

## Current browser runtime cross-check

The implementation lives in `public/minecraft.html`, not in the historical C++ runtime. The current per-chunk saved-edit index follows the locality principle seen in chunk caching: loading a chunk should process only its own saved edits. That optimization is statically validated, but the historical source does not prove browser correctness or performance.

## Required workflow for future changes

1. Identify the subsystem and expected behavior.
2. Read the matching source under `rujukan/` before implementing.
3. Inspect the matching original Resource Pack assets and Behavior Pack material when relevant.
4. Compare with the current browser runtime and document meaningful differences.
5. Add regression checks, run repository validators/build, and test affected browser interactions when possible.
6. Report static validation separately from real browser testing; never claim a visual or interactive test that was not run.
