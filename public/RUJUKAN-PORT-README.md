# VoxelCraft — Rujukan Faithful Port

A **100% faithful browser port** of the historical Minecraft Pocket Edition 2013 C++ source code, located in `rujukan/pocket-edition-2013/mcpe-source/`.

This file (`public/voxelcraft-rujukan-port.html`) is a single self-contained HTML file that translates the C++ class structure, constants, tick flow, and screen lifecycle into JavaScript/Three.js — **without any additions** beyond what the original rujukan source defines.

## Faithful translation policy

- **Class names mirror rujukan exactly**: `Minecraft`, `Level`, `LevelChunk`, `Tile`, `Entity`, `Mob`, `Animal`, `Chicken`, `Player`, `LocalPlayer`, `Inventory`, `GameMode`, `CreativeMode`, `SurvivalMode`, `Gui`, `Screen`, `Button`, `StartMenuScreen`, `PauseScreen`, `Timer`, `MouseHandler`, `KeyboardInput`, `MouseTurnInput`, `MouseBuildInput`, `LevelRenderer`, `GameRenderer`, `ParticleEngine`, `Vec3`, `AABB`, `HitResult`, etc.
- **Constants match rujukan headers exactly**: `LEVEL_HEIGHT=128`, `CHUNK_WIDTH=16`, `CHUNK_CACHE_WIDTH=16` (256x256 bounded world), `SEA_LEVEL=63`, `TICKS_PER_SECOND=20`, `MAX_TICKS_PER_UPDATE=10`, `MAX_HEALTH=20`, `MAX_FOOD=20`, `PICK_RANGE=5.0`, `CreativeMode::DestructionTickDelay=10`, player AABB `0.6x1.8` eye `1.62`.
- **Tile registry uses exact IDs from `Tile::initTiles()`**: id 1=stone, 2=grass, 3=dirt, 5=wood, 7=bedrock, 8=water, 12=sand, 17=log, 18=leaves, 20=glass, 45=brick, 49=obsidian, 50=torch, 57=diamond_block, 61=furnace, etc. — with matching materials, destroy times, and sound types.
- **Tick flow follows `Minecraft::tick()` order**: `gameMode.tick -> tickInput -> gui.tick -> gameRenderer.tick -> levelRenderer.tick -> level.tickEntities -> level.tick -> particleEngine.tick -> screen.tick -> soundEngine.update`.
- **`Level.tick()` order**: `MobSpawner -> chunkSource.tick -> updateSkyDarken -> time advance -> tickPendingTicks -> tickTiles`.
- **Screen lifecycle follows `Screen.cpp`**: `init(minecraft,w,h) -> initScreen() -> setupPositions() -> updateTabButtonSelection()`; `mouseClicked -> hit-test -> press`; `mouseReleased -> buttonClicked`; `ESC -> setScreen(null)`.

## What this port does NOT add

Per the user's strict requirement of "100% dedikasi menterjemahkan tanpa tambahan apapun" (100% dedicated to translating without any additions), this port does NOT include:
- Clouds, vignette, sprint FOV kick, or any visual polish not in rujukan
- Extra tiles, items, mobs, or blocks beyond what rujukan defines
- Modern game features (minimaps, quests, skill trees, etc.)
- Any feature that doesn't exist in the 2013 MCPE C++ source

## Systems covered

| Rujukan path | Port coverage |
|---|---|
| `world/phys/` | `Vec3`, `AABB`, `HitResult` |
| `world/level/` | `LevelConstants`, `LevelChunk`, `Level`, `LevelGen` |
| `world/level/tile/` | `Tile` base + 32 tile subclasses (StoneTile, GrassTile, DirtTile, LiquidTile, GlassTile, OreTile, LeafTile, TreeTile, TorchTile, etc.) |
| `world/entity/` | `Entity`, `Mob`, `Animal`, `Chicken` |
| `world/entity/player/` | `Player`, `LocalPlayer` |
| `world/inventory/` | `ItemInstance`, `Item`, `Inventory` (9 hotbar + 27 storage) |
| `world/food/` | `SimpleFoodData` |
| `client/gamemode/` | `GameMode`, `CreativeMode`, `SurvivalMode` |
| `client/gui/` | `GuiComponent`, `Font`, `Gui` (HUD: hearts, bubbles, hotbar, crosshair, messages) |
| `client/gui/Screen` | `Screen` base |
| `client/gui/components/` | `Button` |
| `client/gui/screens/` | `StartMenuScreen`, `PauseScreen` |
| `client/` | `Minecraft`, `Timer`, `Options`, `KeyMapping`, `MouseHandler` |
| `client/player/input/` | `KeyboardInput`, `MouseTurnInput`, `MouseBuildInput` |
| `client/renderer/` | `Tesselator`, `Textures`, `LevelRenderer`, `GameRenderer`, `Chunk` |
| `client/particle/` | `ParticleEngine` |

## How to run

```bash
./scripts/setup.sh   # stage assets (same as main game)
bun run dev
```

Open `http://localhost:3000/voxelcraft-rujukan-port.html` directly.

## Rendering note

Three.js (0.160) is used as the browser equivalent of the original GLES1 rendering pipeline. The bounded 256x256x128 world may show z-fighting on water surfaces and gaps at world edges — these are artifacts of the faithful bounded-world translation, not gameplay bugs.

## Source reference

See `rujukan/pocket-edition-2013/mcpe-source/handheld/src/` for the original C++ source. See `docs/FOUNDATION-REFERENCE-MAP.md` for the authority hierarchy.
