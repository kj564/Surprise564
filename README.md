# VoxelCraft

> A browser-playable voxel sandbox game faithful to Minecraft Pocket Edition 2013, built with Three.js.

[![Play VoxelCraft](https://img.shields.io/badge/PLAY-VoxelCraft-4a9a3a?style=for-the-badge)](https://kj564.github.io/Surprise564/minecraft.html)
[![GitHub Pages](https://img.shields.io/badge/Pages-live-88c5ff?style=for-the-badge)](https://kj564.github.io/Surprise564/)

**▶ Play now:** https://kj564.github.io/Surprise564/minecraft.html

VoxelCraft is **not affiliated with, endorsed by, or sponsored by Mojang Studios or Microsoft.** "Minecraft" is a trademark of Mojang Studios. Original Minecraft assets remain the property of their respective rights holders; see [`LICENSE-ATTRIBUTION.md`](LICENSE-ATTRIBUTION.md).

---

## Kitab Suci (Source of Truth)

Semua perubahan harus 1:1 dengan sumber asli berikut:

1. **`rujukan/`** — Source code C++ MCPE 2013 (arsitektur, behavior, constants, tick flow)
2. **`VoxelCraft/`** — Mirror Resource Pack (tekstur, model, font — dari MCBVanillaResourcePack)
3. **`VanillaBehaviorPack/`** — Behavior Pack asli (referensi game logic masa depan)

Lihat [Foundation Reference Map](docs/FOUNDATION-REFERENCE-MAP.md) dan [Development Rules](docs/DEVELOPMENT-RULES.md) untuk detail.

## Quick start

```bash
git clone https://github.com/kj564/Surprise564.git
cd Surprise564
bun install
bun run build:voxel-engine
bun run dev
```

Buka `http://localhost:3000/` atau langsung `http://localhost:3000/minecraft.html`.

## Game features

| System | Detail |
|--------|--------|
| Engine | Three.js 0.160 via importmap, single file `minecraft.html` |
| Textures | Original MCPE 2013 `terrain.png` atlas (256×256, 16×16 grid) |
| GUI | Original MCPE 2013 `gui.png` + `icons.png` (hotbar, hearts, crosshair) |
| Font | Original MCPE 2013 `default8.png` (128×128) |
| World | Chunked voxel terrain, procedural heightmap, trees, water |
| Ores | Coal, iron, gold, diamond, lapis, redstone (from `terrain.png`) |
| Day/night | Sun/moon arcs, star field, sunset tint |
| Clouds | Original MCPE 2013 `clouds.png` dengan day/night color modulation |
| Blocks | 36 block types, semua ada di `Tile::initItems()` rujukan |
| Controls | Pointer-lock mouse-look, WASD, sprint (Shift), double-Space fly |
| Build/break | DDA raycast break (left click) and place (right click) |
| Physics | Fixed-timestep 20 tps, gravity 0.08/tick, friction2 formula, AABB clip collision |
| Mobs | Chicken dengan ES6 class hierarchy 1:1 rujukan (Entity → Mob → PathfinderMob → AgableMob → Animal → Chicken) |
| Inventory | 4 tabs (Semua/Alam/Bangunan/Mineral), hanya block rujukan MCPE 2013 |
| Persistence | Per-browser save via `localStorage`; press `K` to save manually |

**Controls:** WASD move · Mouse look · Space jump · Double-Space fly · Shift sprint · E inventory · G VoxelCraft menu · T advance time · K save · 1–8 hotbar · Left-click break · Right-click place

## Reverse engineering

Semua reverse engineering dilakukan dengan disiplin **Rule Zero: read the real thing, don't guess** — baca source code rujukan line-by-line, transkripsi exact, bukan dari ingatan atau summary.

Dokumentasi RE ada di [`MODLOG.md`](MODLOG.md) (18.000+ baris, 27 entries):
- Entries 1-8: Entity/Mob/Player physics (move, travel, aiStep, jumpFromGround)
- Entries 9-13: Level/Tile/GameMode/LevelGen/MobSpawner
- Entries 14-19: Chunk/Renderer/Chicken/Screen/Minecraft loop/ParticleEngine
- Entry 20: Cloud mechanics (LevelRenderer::renderClouds + getCloudColor)
- Entries 21-25: Mob system (Mob.cpp, PathfinderMob, Animal, Chicken, MobSpawner)
- Entry 26: Mob class hierarchy (fields, vtable, constructor chain)
- Entry 27: EXACT mob method transcriptions (fix fabricated Entry 2)

## Repository structure

```text
Surprise564/
├── rujukan/                        # MCPE 2013 C++ source (kitab suci #1)
├── VoxelCraft/                     # Mirror MCBVanillaResourcePack (kitab suci #2)
├── VanillaBehaviorPack/            # Behavior Pack submodule (kitab suci #3)
├── public/
│   ├── minecraft.html              # Game utama (single file)
│   ├── voxelcraft-engine.bundle.js # Engine bundle
│   └── VoxelCraft/                 # Staged runtime assets (24 files)
│       ├── textures/blocks/terrain.png   # MCPE 2013 block atlas
│       ├── textures/gui/gui.png          # MCPE 2013 UI atlas
│       ├── textures/gui/icons.png        # MCPE 2013 hearts/crosshair
│       ├── textures/environment/clouds.png # MCPE 2013 clouds
│       ├── font/default8.png             # MCPE 2013 font
│       ├── models/entity/chicken.geo.json # Chicken model
│       └── textures/items/               # 9 vcGuide icons
├── src/                            # Next.js host + game engine TypeScript
├── scripts/                        # Build & validation scripts
├── docs/                           # Structure, rules, asset docs
├── MODLOG.md                       # RE documentation (18,000+ lines)
├── .github/workflows/              # CI: build, validate, deploy to Pages
└── README.md                       # This file
```

## GitHub Pages

Production: https://kj564.github.io/Surprise564/minecraft.html

CI workflow (`.github/workflows/static.yml`):
1. Stage MCPE 2013 textures dari `rujukan/`
2. Build voxel engine bundle
3. Build static site (`next build`)
4. Deploy to GitHub Pages

## Attribution

See [`LICENSE-ATTRIBUTION.md`](LICENSE-ATTRIBUTION.md) for asset provenance and attribution. Minecraft is a trademark of Mojang Studios; this project is independent and unofficial.
