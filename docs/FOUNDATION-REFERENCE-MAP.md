# Foundation Reference Map — Game Code and Original Assets

This is the required starting point before implementing or changing a game system. The original code reference helps establish responsibilities and behavior; original Minecraft files are authoritative for matching assets. Browser code adapts the relevant concepts rather than pretending to be the original Minecraft engine.

## 1. Authority hierarchy

1. **Read `rujukan/` first for code architecture and behavior.** The checked-in historical source is at `rujukan/pocket-edition-2013/mcpe-source/`. Use it to inspect screen lifecycle, input dispatch, inventory responsibilities, GUI components, rendering, and top-level orchestration before writing comparable browser code.
2. **Use original Minecraft files for exact assets.** When a matching original asset exists, prefer it over memory, guesswork, a visual imitation, or a newly invented substitute. `VoxelCraft/` is the checked-in mirror/snapshot of the upstream [MCBVanillaResourcePack](https://github.com/ZtechNetwork/MCBVanillaResourcePack), used by setup and CI.
3. **Consult `VanillaBehaviorPack/` for future game logic.** This retained submodule is part of the project's reference material for future game rules and behavior; do not remove it as unrelated tooling. Adapt relevant behavior to the browser runtime rather than assuming Bedrock-specific scripts execute directly in the browser.
4. **Implement browser adaptations in `public/minecraft.html`.** It is a Three.js/HTML/CSS implementation, not the original Minecraft engine. Port relevant behavior and layout concepts where feasible, and record necessary differences.
5. **Treat staged files as derived runtime copies.** `public/VoxelCraft/` contains only the subset deployed by GitHub Pages. The original source remains in `VoxelCraft/` or the applicable original file under `rujukan/`.

If two sources disagree, do not silently pick whichever is easiest. Check their version and purpose, explain the conflict, and choose the source appropriate to the browser game.

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

These files belong to historical Pocket Edition 2013 source. They are architectural references, not drop-in code or current browser APIs.

## 3. Original asset and runtime references

| Need | Authoritative reference |
| --- | --- |
| Original block textures | Upstream [`MCBVanillaResourcePack`](https://github.com/ZtechNetwork/MCBVanillaResourcePack); checked-in mirror: `VoxelCraft/textures/blocks/` |
| UI sprites and fonts | Upstream [`MCBVanillaResourcePack`](https://github.com/ZtechNetwork/MCBVanillaResourcePack); checked-in mirror: `VoxelCraft/textures/ui/`, `VoxelCraft/textures/gui/newgui/`, `VoxelCraft/font/` |
| Item sprites used by the browser UI | Upstream [`MCBVanillaResourcePack`](https://github.com/ZtechNetwork/MCBVanillaResourcePack); checked-in mirror: `VoxelCraft/textures/items/` |
| Original chicken model and texture | Upstream [`MCBVanillaResourcePack`](https://github.com/ZtechNetwork/MCBVanillaResourcePack); checked-in mirror: `VoxelCraft/models/entity/chicken.geo.json`, `VoxelCraft/textures/entity/chicken/chicken.png` |
| Future vanilla game rules and behavior patterns | `VanillaBehaviorPack/` |
| Browser game's current implementation | `public/minecraft.html` |
| Browser runtime copies | `public/VoxelCraft/` |

When the source pack provides separate hover, pressed, selected, disabled, or focus assets, preserve those states. Do not replace authentic sprites with emoji, generic gradients, or hand-drawn approximations unless the required asset is genuinely unavailable or a documented technical limitation requires an adapter.

## 4. Mandatory implementation workflow

1. Identify the exact subsystem and desired behavior.
2. Search `rujukan/` for the matching class, component, or flow; read the relevant source before writing code.
3. Inspect matching original Minecraft assets.
4. Inspect the current browser implementation to understand existing state, events, and constraints.
5. Implement the smallest coherent browser adaptation. Keep behavior/state management separate from visual styling where practical.
6. If a new asset is needed, add it to both local staging and CI staging, preserving the canonical source file.
7. Extend `scripts/validate-game.mjs` with useful static assertions where possible.
8. Run `bun run validate:game` and `bun run build`; test the affected interaction in a browser when possible.
9. In the report, distinguish static validation from real browser testing. Never claim a test passed if it was not run.

## 5. Browser-game boundaries

- `public/minecraft.html` owns the browser game world, input, gameplay, and HTML UI.
- `src/app/page.tsx` is the web host and iframe wrapper; do not move gameplay into it.
- `MCBVanillaResourcePack` is the upstream Resource Pack source; `VoxelCraft/` is its checked-in mirror and is not served directly by Pages.
- `VanillaBehaviorPack/` is retained as a source for future game logic; initialize it with the repository submodule setup.
- `public/VoxelCraft/` is a staged subset, not the canonical original.
- Browser-adapted menus and inventory may resemble Minecraft but are implemented in browser technologies.

## 6. Asset integrity and validation

- Preserve original source files; don't edit them to make browser rendering easier.
- Adapt via separate runtime code or staged copies, with source provenance documented.
- Keep `scripts/setup.sh` and `.github/workflows/static.yml` in sync for every required browser asset.
- Verify staged files against originals (byte comparison where appropriate), dimensions and model structure when relevant.
- Static checks establish file and wiring integrity, not visual fidelity. A real browser test remains necessary for rendering and input behavior.

See the detailed [Reference Source Audit](REFERENCE-SOURCE-AUDIT.md) for findings from reading the historical C++ files. Also see [Development Rules](DEVELOPMENT-RULES.md), [Asset Rules](ASSETS.md), and [Repository Structure](STRUCTURE.md).
