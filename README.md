# VoxelCraft

> A browser-playable voxel sandbox game inspired by Minecraft, built with Three.js and deployed to GitHub Pages.

[![Play VoxelCraft](https://img.shields.io/badge/PLAY-VoxelCraft-4a9a3a?style=for-the-badge)](https://kj564.github.io/Surprise564/minecraft.html)
[![GitHub Pages](https://img.shields.io/badge/Pages-live-88c5ff?style=for-the-badge)](https://kj564.github.io/Surprise564/)

**▶ Play now:** https://kj564.github.io/Surprise564/minecraft.html

VoxelCraft is **not affiliated with, endorsed by, or sponsored by Mojang Studios or Microsoft.** "Minecraft" is a trademark of Mojang Studios. Original Minecraft assets remain the property of their respective rights holders; see [`LICENSE-ATTRIBUTION.md`](LICENSE-ATTRIBUTION.md).

---

## Project scope

**This repository is focused on the VoxelCraft browser game.** It is not a Minecraft Bedrock addon toolkit. The playable game lives in `public/minecraft.html`; the Next.js app hosts it, and GitHub Actions builds and deploys it to GitHub Pages.

## Source-of-truth rules

Before changing gameplay or UI, read the relevant original implementation in `rujukan/` and consult [the Foundation Reference Map](docs/FOUNDATION-REFERENCE-MAP.md). For original Minecraft assets, use the matching source files in `VoxelCraft/`. Do not guess at behavior or replace available original assets with approximations.

- `rujukan/` is the primary code/architecture reference. Its Pocket Edition source is historical (2013): learn from its structure and behavior, but do not assume its APIs match modern Minecraft or browser APIs.
- `VoxelCraft/` contains the original Resource Pack files used as the canonical source for game assets.
- `VanillaBehaviorPack/` is a retained submodule that will inform the game's future logic; do not remove it as unrelated tooling.
- `public/VoxelCraft/` contains only the staged subset loaded by the browser. Treat these as derived runtime copies.
- Adapt original behavior to the browser runtime only where needed. The game uses Three.js, JavaScript, HTML, and CSS; it is not the original Minecraft engine.
- When adding runtime assets, update both `scripts/setup.sh` and `.github/workflows/static.yml`.
- Before declaring a change complete, run `bun run validate:game` and `bun run build`; test the changed behavior in a browser when possible.

See [Development Rules](docs/DEVELOPMENT-RULES.md), [Repository Structure](docs/STRUCTURE.md), and [Asset Rules](docs/ASSETS.md).

## Quick start

```bash
git clone https://github.com/kj564/Surprise564.git
cd Surprise564
./scripts/setup.sh
bun run dev
```

Then visit `http://localhost:3000/Surprise564/` or open the browser game directly at `http://localhost:3000/Surprise564/minecraft.html`.

## Browser game features

| System | Detail |
|--------|--------|
| Engine | Three.js 0.160 via CDN, single self-contained `minecraft.html` |
| World | Chunked 16×16×40 voxel terrain, procedural heightmap, beaches, oak trees, and water |
| Ores | Coal, iron, gold, and diamond ore distributed by depth |
| Day/night | Sun and moon arcs, star field, sunrise/sunset tint |
| Blocks | Block types with per-face textures sourced from the original resource pack |
| Controls | Pointer-lock mouse-look, WASD, jump, double-Space to fly |
| Build/break | DDA raycast break (left click) and place (right click), 6-block reach |
| Particles | Block-break particle burst |
| Audio | Web Audio synthesized break/place/step sound effects |
| Mobs | Chicken wandering AI, hopping, despawning, and spawning near the player |
| Inventory | Press `E` to swap blocks into the 9-slot hotbar |
| Persistence | Per-browser save via `localStorage`; press `K` to save manually |

**Controls:** WASD move · Mouse look · Space jump · Double-Space fly · E inventory · T advance time · K save · 1–9 / scroll hotbar · Left-click break · Right-click place

## Repository structure

See [`docs/STRUCTURE.md`](docs/STRUCTURE.md) for the full annotated tree.

```text
Surprise564/
├── rujukan/                       # Primary original-code/behavior reference
├── VoxelCraft/                    # Canonical original Minecraft resource-pack assets
├── VanillaBehaviorPack/            # Retained source for future game logic (Git submodule)
├── public/
│   ├── minecraft.html             # Browser game's main implementation
│   └── VoxelCraft/                # Staged runtime assets
├── src/app/                       # Next.js host page and global styles
├── scripts/setup.sh               # Stage required game assets and install dependencies
├── scripts/validate-game.mjs      # Static checks for game foundations
├── docs/                          # Structure, source map, asset and development rules
├── .github/workflows/static.yml   # Validation, build and GitHub Pages deployment
└── README.md
```

## Developing the browser game

Keep gameplay and browser UI changes in `public/minecraft.html`. Inspect `rujukan/` before implementing comparable behavior, and use the original files in `VoxelCraft/` for matching assets. Keep staged files under `public/VoxelCraft/` synchronized through both local setup and CI.

### GitHub Pages

The production site is published at https://kj564.github.io/Surprise564/. The game is available at https://kj564.github.io/Surprise564/minecraft.html.

## Attribution

See [`LICENSE-ATTRIBUTION.md`](LICENSE-ATTRIBUTION.md) for asset provenance and attribution. Minecraft is a trademark of Mojang Studios; this project is independent and unofficial.
