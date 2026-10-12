# Pocket Engine Study

An original, clean-room C++17 learning project inspired by the broad engineering problem of a small voxel sandbox. This is **not** Minecraft source code and does not include leaked source or proprietary assets.

## Current features

- Bounds-checked 3D block storage
- Flat terrain generation with grass, dirt, stone, and air
- Player position and bounded movement
- Console-based interactive prototype
- Unit-style regression checks with CTest
- CMake build and GitHub Actions CI

## Build

Requirements: CMake 3.16+ and a C++17 compiler.

```bash
cmake -S . -B build
cmake --build build --config Release
ctest --test-dir build --output-on-failure
```

Run the prototype:

```bash
./build/pocket_engine_study
```

On Windows multi-configuration generators, the executable may be under `build/Release/`.

## Console commands

- `look` — show player coordinates and the block at the current position
- `move north|south|east|west|up|down` — move one cell if inside the world bounds
- `stats` — show dimensions and block counts
- `help` — list commands
- `quit` — exit

## Scope and next milestones

This is an educational prototype, not a playable Minecraft-compatible game. It currently has no renderer, texture pipeline, networking, mobs, inventory, or save format. Those should be added incrementally and tested independently.

Do not add assets or code from unauthorized leaks. Only incorporate third-party materials when their license and provenance are documented.
