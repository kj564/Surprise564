# Architecture Notes

This is an independent, clean-room learning project. It is not derived from leaked Minecraft source and contains no Minecraft-owned assets.

## Current structure

- handheld/src/world.hpp/.cpp: bounded 3D block grid, terrain generation, block counting.
- handheld/src/world_io.hpp/.cpp: versioned text persistence, strict block-ID validation, transactional loading.
- handheld/src/game.hpp/.cpp: game state and bounded player movement.
- handheld/src/main.cpp: command-line input loop and debug output.
- tests/world_tests.cpp: regression checks for storage, terrain layers, persistence, and movement.
- CMakeLists.txt: portable C++17 build and CTest integration.
- .github/workflows/pocket-engine-ci.yml: automated Linux configure/build/test workflow.

## Engineering principles

1. Keep simulation independent of rendering and platform-specific APIs.
2. Validate world dimensions, coordinate boundaries, and serialized values.
3. Do not mutate a live world until a save file has been fully validated.
4. Add deterministic tests before introducing complex systems.
5. Separate input, simulation, assets, and presentation.
6. Track provenance and licenses for every third-party dependency and asset.

## Roadmap

1. **Core data model** — basic deterministic grid simulation is in place.
2. **Persistence** — initial versioned text save/load API is implemented; future work includes stronger size limits and atomic file replacement.
3. **Input abstraction** — keyboard, touch, and gamepad commands behind one interface.
4. **Renderer** — chunk meshing and camera abstraction, with no copyrighted assets.
5. **Blocks and entities** — block registry, entity lifecycle, collision and physics.
6. **Content pipeline** — original or properly licensed textures, models, and sounds.

## Scope boundary

The prototype currently has no 3D renderer, texture pipeline, networking, mobs, inventory, or physics/collision system. Implement those as independently written systems. Do not copy code or assets from unauthorized leaks.
