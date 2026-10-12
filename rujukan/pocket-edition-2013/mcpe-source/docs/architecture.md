# Architecture Notes

This is an independent, clean-room learning project. It is not derived from leaked Minecraft source and contains no Minecraft-owned assets.

## Current structure

- handheld/src/world.hpp/.cpp: bounded 3D block grid, terrain generation, block counting.
- handheld/src/game.hpp/.cpp: game state and bounded player movement.
- handheld/src/main.cpp: command-line input loop and debug output.
- tests/world_tests.cpp: regression checks for storage, terrain layers, and movement.
- CMakeLists.txt: portable C++17 build and CTest integration.
- .github/workflows/pocket-engine-ci.yml: automated Linux configure/build/test.

## Engineering principles

1. Keep simulation independent of rendering and platform-specific APIs.
2. Validate world dimensions and all coordinate boundaries.
3. Add deterministic tests before introducing complex systems.
4. Separate input, simulation, assets, and presentation.
5. Track provenance and licenses for every third-party dependency and asset.

## Roadmap

1. **Core data model** — complete enough for a small deterministic grid simulation.
2. **Persistence** — versioned world save/load format with corruption checks.
3. **Input abstraction** — keyboard, touch, and gamepad commands behind one interface.
4. **Renderer** — chunk meshing and camera abstraction, with no copyrighted assets.
5. **Blocks and entities** — block registry, entity lifecycle, collision and physics.
6. **Content pipeline** — original or properly licensed textures, models, and sounds.

## Scope boundary

The prototype currently has no 3D renderer, texture pipeline, networking, mobs, inventory, or save format. Implement those as independently written systems. Do not copy code or assets from unauthorized leaks.
