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

## Documentation

VoxelCraft follows the **spec-driven methodology** inspired by two reference projects:

1. **[weltendaemmerung](https://github.com/s-macke/weltendaemmerung)** — a C64 game ported to
   web with AI assistance using a spec-driven methodology: one `docs/` file per system,
   explicit verification, clear separation of concerns (game logic vs rendering vs UI).

2. **[awesome-rea](https://github.com/yibie/awesome-rea)** — a curated list of AI-assisted
   reverse-engineering projects. Every entry states an **acceptance test that is
   machine-decidable** — a byte comparison, a hash match, a build that stays green. The
   core question each port asks: **"how does this project define done?"**

We adopt both principles for VoxelCraft:

- **One spec file per system** in [`docs/`](docs/) — each file is self-contained with
  Overview -> Constants (citing rujukan source with `§File:line`) -> Formulas ->
  Acceptance test (machine-decidable claim) -> Verification (link to the test that
  checks it).
- **A central [`ACCEPTANCE.md`](ACCEPTANCE.md)** that states the machine-decidable
  acceptance test for every ported system, with status (tested / untested) for each.

### System spec files

| File | System | Status |
|------|--------|--------|
| [`docs/mining.md`](docs/mining.md) | Survival + Creative mining (SurvivalMode + CreativeMode + Tile::getDestroyProgress) | ✅ 23-tick test passes |
| [`docs/tools.md`](docs/tools.md) | Tool tiers, 20 tools, canDestroy tier gates, per-tool getDestroySpeed | ✅ 19 tests pass |
| [`docs/durability.md`](docs/durability.md) | ItemInstance::hurt, DiggerItem::mineBlock, sword hurt(2), strict `>` | ✅ 13 tests pass |
| [`docs/physics.md`](docs/physics.md) | Mob::travel, Player::travel, jumpFromGround, fly thrust, friction2 formula | ⚠ TS engine tests only — rujukan per-tick constants UNTESTED |
| [`docs/day-night.md`](docs/day-night.md) | TICKS_PER_DAY=19200, NormalDayCycleDimension formula, SEA_LEVEL vs waterHeight | ⚠ UNTESTED |
| [`docs/world-gen.md`](docs/world-gen.md) | Level dimensions (16×16×128), 41 block hardness values | ⚠ UNTESTED directly (exercised via mining) |
| [`docs/rendering.md`](docs/rendering.md) | TileRenderer c10/c11/c2/c3 per-face brightness, FACES vertex order, texture atlas | ⚠ UNTESTED (browser-side constants) |
| [`docs/materials.md`](docs/materials.md) | 27 materials, 4 notAlwaysDestroyable, per-block material assignments | ✅ isAlwaysDestroyable + canDestroy tests pass |

### Acceptance tests

[`ACCEPTANCE.md`](ACCEPTANCE.md) is the single source of truth for **machine-decidable
definitions of done**. Each system has:

- A one-line **definition of done** (e.g. "survival-mode mining of stone with a wood
  pickaxe takes exactly 23 physics ticks").
- An **acceptance test** — a TypeScript snippet asserting a numeric value, status
  string, or tick count.
- A **Verified by** list linking to the test(s) that check it (or an UNTESTED note
  with a suggested test for the next agent).
- A **Rujukan source** citation with `§File:line` for every constant.

Test suite at time of writing: `bun run test:game-core` -> 163 pass / 0 fail / 2318
expect() calls.


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
