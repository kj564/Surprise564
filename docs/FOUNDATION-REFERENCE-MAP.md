# Foundation reference map — VoxelCraft UI and gameplay

This document defines which repository sources are authoritative when implementing the browser game's UI. It is a guardrail for future changes, not a claim that browser HTML can execute Bedrock JSON UI or the native game engine.

## 1. Source hierarchy

1. **Modern Bedrock Resource Pack assets:** `VoxelCraft/textures/ui/`, `VoxelCraft/textures/gui/newgui/`, `VoxelCraft/textures/items/`, and `VoxelCraft/font/`. When a matching original sprite or font exists, use that asset rather than approximating it with CSS gradients, emoji, or newly drawn shapes.
2. **Modern Bedrock UI layout metadata:** `VoxelCraft/ui/hud_screen.json` and the related JSON UI files under `VoxelCraft/ui/`. Use their anchors, slot dimensions, selected-slot sizing, layering, and nine-slice metadata as layout references. The browser still needs an HTML/CSS implementation of those concepts.
3. **Behavior Pack behavior and menu contract:** `BedrockAddon/scripts/main.js` defines VoxelCraft commands, stats, rewards, and the ActionForm menu. `VanillaBehaviorPack/` is the vanilla BP reference submodule. Keep browser-adapted controls and labels aligned with actual supported BP actions; do not present unsupported actions as functional.
4. **Historical implementation reference:** `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/` contains the older Pocket Edition GUI architecture. Use it to understand separation of screen, component, input, inventory, and rendering responsibilities—not as a drop-in implementation for the modern Bedrock UI.

## 2. Useful historical source files

| Reference | What to learn from it |
| --- | --- |
| `client/gui/Gui.cpp` | In-game HUD responsibilities and hotbar rendering are separate from menu screens. |
| `client/gui/Screen.cpp` | Screen lifecycle, resize handling, input dispatch, and focus/navigation responsibilities. |
| `client/gui/components/Button.cpp` | Button states and hit-testing are behavior, not just appearance. |
| `client/gui/components/NinePatch.cpp` | Stretchable panels preserve corner/edge borders instead of scaling the whole image. |
| `client/gui/screens/StartMenuScreen.cpp` | Title-menu controls and screen transitions are grouped in one screen. |
| `client/gui/components/InventoryPane.cpp` | Inventory selection, scrolling, hit areas, and item rendering are distinct concerns. |
| `client/Minecraft.cpp` | Top-level orchestration coordinates the player, level, input, GUI, and renderer. |

The historical source dates to Pocket Edition 2013. It is not the authority for current Bedrock resource identifiers or current JSON UI schemas.

## 3. Browser game boundaries

- `public/minecraft.html` is the browser game's entry point and currently owns its Three.js world, input, and HTML UI.
- `VoxelCraft/` is the modern vanilla Resource Pack reference; `public/VoxelCraft/` is a staged subset for static hosting.
- `BedrockAddon/` and `VoxelCraftResourcePack/` target Minecraft Bedrock itself. Their scripts/JSON do not run in the browser. The browser menu is an adapter, not the actual Bedrock ActionForm or JSON UI runtime.
- Asset staging is defined in both `scripts/setup.sh` and `.github/workflows/static.yml`. Any asset used by the browser must be staged by both paths.

## 4. Foundation rules

1. Keep the original asset as the source of truth; do not silently substitute a similar file.
2. Keep hover, pressed, selected, disabled, and focus states distinct when the pack provides distinct assets.
3. Use the pack's dimensions and nine-slice metadata as the starting point; scale proportionally for desktop/mobile instead of inventing unrelated dimensions.
4. Keep menu state transitions and keyboard/mouse/touch handling separate from CSS presentation.
5. Treat the browser and native Bedrock implementations as separate runtimes; explicitly mark features the browser has not implemented.
6. CI must verify that staged UI sprites, item icons, and font are byte-identical to the original Resource Pack files.

## 5. Validation

Run `./scripts/setup.sh`, then `bun run validate:game` and `bun run build`. GitHub Actions performs asset staging before validation/build. A passing static check confirms source wiring and asset parity; it does not replace a real browser visual/input test or a Bedrock in-game test.
