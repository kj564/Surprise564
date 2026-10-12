# Foundation Reference Map — Code, UI, Gameplay, and Assets

This is the required starting point before implementing or changing a game system. The reference material is authoritative for how we reason about the implementation; the original Minecraft files are authoritative for their matching assets and behavior. Browser code must adapt these references honestly rather than pretending to be the native Minecraft engine.

## 1. Authority hierarchy

1. **Read `rujukan/` first for code architecture and behavior.** The checked-in historical source is at `rujukan/pocket-edition-2013/mcpe-source/`. Use it to inspect screen lifecycle, input dispatch, inventory responsibilities, GUI components, rendering, and top-level orchestration before writing comparable browser code.
2. **Use original Minecraft files for exact source behavior and assets.** When a matching original file exists, prefer it over memory, guesswork, a visual imitation, or a newly invented substitute. For the modern vanilla Resource Pack assets in this repository, `VoxelCraft/` is the canonical asset source.
3. **Use current Bedrock references for current Bedrock contracts.** `VanillaBehaviorPack/` is a reference submodule; `BedrockAddon/` defines this project's actual custom commands, stats, rewards, and ActionForm contract; `VoxelCraftResourcePack/` contains native Bedrock JSON UI experiments.
4. **Implement browser adaptations in `public/minecraft.html`.** It is a Three.js/HTML/CSS implementation, not the original Minecraft engine. Port relevant behavior and layout concepts where feasible. Record necessary differences rather than claiming the old source or Bedrock scripts run directly in the browser.
5. **Treat staged files as derived runtime copies.** `public/VoxelCraft/` contains only the subset deployed by GitHub Pages. The original source remains `VoxelCraft/` or the applicable original file under `rujukan/`.

If two sources disagree, do not silently pick whichever is easiest. Check their version and purpose, explain the conflict, and choose the source appropriate to the target runtime.

## 2. Useful historical source files

Path root: `rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/`

| Reference | What to learn |
| --- | --- |
| `client/gui/Gui.cpp` | In-game HUD responsibilities and hotbar rendering are distinct from menu screens. |
| `client/gui/Screen.cpp` | Screen lifecycle, resize handling, input dispatch, and focus/navigation. |
| `client/gui/components/Button.cpp` | Button states and hit-testing are behavior, not just appearance. |
| `client/gui/components/NinePatch.cpp` | Stretchable panels preserve corners and edges rather than scaling the full image uniformly. |
| `client/gui/screens/StartMenuScreen.cpp` | Title-menu controls and screen transitions are grouped into screen responsibilities. |
| `client/gui/components/InventoryPane.cpp` | Inventory selection, scrolling, hit areas, and item rendering are separate concerns. |
| `client/Minecraft.cpp` | Top-level orchestration coordinates player, level, input, GUI, and renderer. |

These files belong to the historical Pocket Edition 2013 source. They are a primary architectural reference for this project, but are not drop-in code and do not define modern Bedrock identifiers or current JSON UI schemas.

## 3. Modern UI and asset references

| Need | Authoritative reference |
| --- | --- |
| UI sprites and fonts | `VoxelCraft/textures/ui/`, `VoxelCraft/textures/gui/newgui/`, `VoxelCraft/textures/items/`, `VoxelCraft/font/` |
| HUD layout, anchors, slot dimensions, layering, nine-slice metadata | `VoxelCraft/ui/hud_screen.json` and related files under `VoxelCraft/ui/` |
| Browser game's current implementation | `public/minecraft.html` |
| Browser runtime copies | `public/VoxelCraft/` |
| Actual custom Behavior Pack commands, rewards, stats, menu contract | `BedrockAddon/scripts/main.js` |
| Vanilla Behavior Pack patterns | `VanillaBehaviorPack/` |
| Native Bedrock JSON UI experiments | `VoxelCraftResourcePack/` |

When the pack provides separate hover, pressed, selected, disabled, or focus assets, preserve those states. Do not replace authentic sprites with emoji, generic gradients, or hand-drawn approximations unless the required asset is genuinely unavailable or a documented technical limitation requires an adapter.

## 4. Mandatory implementation workflow

1. Identify the exact subsystem and desired behavior.
2. Search `rujukan/` for the matching class, component, or flow; read the relevant source before writing code.
3. Inspect matching original Minecraft assets and current project references.
4. Inspect the current browser implementation to understand existing state, events, and constraints.
5. Implement the smallest coherent browser adaptation. Keep behavior/state management separate from visual styling where practical.
6. If a new asset is needed, add it to both local staging and CI staging, preserving the canonical source file.
7. Extend `scripts/validate-game.mjs` with useful static assertions where possible.
8. Run `bun run validate:game` and `bun run build`; test the affected interaction in a browser when possible.
9. In the report, distinguish static validation from real browser or Bedrock testing. Never claim a test passed if it was not run.

## 5. Browser-game boundaries

- `public/minecraft.html` owns the browser game world, input, gameplay, and HTML UI.
- `src/app/page.tsx` is the web host and iframe wrapper; do not move gameplay into it.
- `VoxelCraft/` is the canonical modern vanilla Resource Pack asset source and is not served directly by Pages.
- `public/VoxelCraft/` is a staged subset. Do not treat it as the canonical original.
- `BedrockAddon/` and `VoxelCraftResourcePack/` run in native Bedrock, not inside the browser game.
- Browser-adapted menus and inventory may look and behave similarly, but they are not the native Bedrock JSON UI or ActionForm runtime.

## 6. Asset integrity and validation

- Preserve original source files; don't edit them to make browser rendering easier.
- Adapt via separate runtime code or staged copies, with source provenance documented.
- Keep `scripts/setup.sh` and `.github/workflows/static.yml` in sync for every required browser asset.
- Verify staged files against originals (byte comparison where appropriate), dimensions and model structure when relevant.
- Static checks establish file and wiring integrity, not visual fidelity. A real browser test remains necessary for rendering and input behavior.

See [Development Rules](DEVELOPMENT-RULES.md), [Asset Rules](ASSETS.md), and [Repository Structure](STRUCTURE.md).
