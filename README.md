# VoxelCraft

> A browser-playable Minecraft-style voxel game **plus** a Minecraft Bedrock addon toolkit, packaged as a single GitHub Pages site.

[![Play VoxelCraft](https://img.shields.io/badge/PLAY-VoxelCraft-4a9a3a?style=for-the-badge)](https://kj564.github.io/Surprise564/minecraft.html)
[![GitHub Pages](https://img.shields.io/badge/Pages-live-88c5ff?style=for-the-badge)](https://kj564.github.io/Surprise564/)

**▶ Play now:** https://kj564.github.io/Surprise564/minecraft.html

VoxelCraft is **not affiliated with, endorsed by, or sponsored by Mojang Studios or Microsoft.** "Minecraft" is a trademark of Mojang Studios. All vanilla assets belong to Mojang & Microsoft — see [`LICENSE-ATTRIBUTION.md`](LICENSE-ATTRIBUTION.md).

---

## Table of contents

- [What's in this repo](#whats-in-this-repo)
- [Quick start](#quick-start)
- [Browser game features](#browser-game-features)
- [Bedrock addon features](#bedrock-addon-features)
- [Repository structure](#repository-structure)
- [Developing the browser game](#developing-the-browser-game)
- [Bedrock references](#bedrock-references)
- [Attribution](#attribution)

## What's in this repo

Two separate, parallel projects share this repository:

1. **Browser voxel game** — `public/minecraft.html` is a self-contained Three.js game that runs in any modern browser and is deployed to GitHub Pages.
2. **Minecraft Bedrock addon toolkit** — `BedrockAddon/` (custom Script API pack) + `VoxelCraftResourcePack/` (JSON UI experiments) + reference data in `VoxelCraft/` and `VanillaBehaviorPack/`.

The Bedrock packs **do not** run inside the browser game. The browser game reads textures from `public/VoxelCraft/textures/blocks/`, not from the Bedrock packs.

## Quick start

```bash
# Clone with the vanilla BP submodule
git clone --recurse-submodules https://github.com/kj564/Surprise564.git
cd Surprise564

# One-shot setup (submodules + game textures + deps)
./scripts/setup.sh

# Run the dev server
bun run dev
```

Then open the **Preview Panel** in your IDE or visit `http://localhost:3000/Surprise564/`.

Already cloned without `--recurse-submodules`? Run `git submodule update --init --recursive` first.

## Browser game features

| System | Detail |
|--------|--------|
| Engine | Three.js 0.160 via CDN, single self-contained `minecraft.html` |
| World | Chunked 16×16×40 voxel terrain, procedural heightmap + beaches + oak trees + water |
| Ores | Coal / iron / gold / diamond ore distributed by depth (procedurally generated ore textures) |
| Day/night | Visible sun & moon arcs, 250-star field, sunrise/sunset tint |
| Blocks | 23 block types with per-face textures from the real Bedrock atlas |
| Controls | Pointer-lock mouse-look, WASD, jump, double-Space to fly |
| Build/break | DDA raycast break (left click) + place (right click), 6-block reach |
| Particles | Block-break particle burst, color-sampled from atlas |
| Audio | WebAudio-synthesized break / place / step SFX |
| Mobs | Chicken wander AI with hop + despawn + spawn near player |
| Inventory | Press `E` to swap any of 23 blocks into the 9-slot hotbar |
| Persistence | Per-browser save via `localStorage` (press `K` to save manually) |

**Controls cheat-sheet:** WASD move · Mouse look · Space jump · 2× Space fly · E inventory · T advance time · K save · 1–9 / scroll hotbar · L-click break · R-click place

## Bedrock addon features

| Pack | Path | What it does |
|------|------|--------------|
| **VoxelCraft BP** | `BedrockAddon/` | Custom Script API behavior pack (`@minecraft/server` 2.10.0 + `@minecraft/server-ui` 2.0.0) |
| **VoxelCraft RP (JSON UI)** | `VoxelCraftResourcePack/` | Experimental start-screen / main-menu UI reskin |
| **Vanilla BP reference** | `VanillaBehaviorPack/` (submodule) | Read-only mirror of the official vanilla behavior pack template |
| **Vanilla RP reference** | `VoxelCraft/` | Full 18,417-file vanilla resource pack; asset source for the browser game |

The VoxelCraft BP (`BedrockAddon/`) ships:

- **10 custom chat commands:** `!help`, `!menu`, `!give`, `!fly`, `!heal`, `!time`, `!weather`, `!tp`, `!kit`, `!stats`
- **ActionForm UI menu** — rename a book to "VoxelCraft Guide" and use it to open an 8-button action menu
- **Coin economy + ore rewards** — break ores for coins (coal +2 → emerald +20, deepslate variants give bonus)
- **Player stats** — stored in world dynamic properties (survive restarts): coins, blocksBroken, mobsKilled, joins
- **Action bar HUD** — dimension + XYZ + in-game clock + coin total
- **Auto-save** every 5 minutes

See [`BedrockAddon/README.md`](BedrockAddon/README.md) for install + test instructions.

### Native Bedrock install (BP + RP together)

To install VoxelCraft **inside Minecraft Bedrock Edition**, use the native add-on package—not the browser game:

1. Open the latest successful **Build native Minecraft Bedrock addon** workflow run in the repository's Actions tab.
2. Download the `VoxelCraft-Bedrock-Addon` artifact and extract `VoxelCraft.mcaddon`.
3. Open `VoxelCraft.mcaddon` with Minecraft Bedrock to import both packs.
4. Enable **VoxelCraft Behavior Pack** in the target world's Behavior Packs. Its manifest declares the matching **VoxelCraft Main Menu** Resource Pack dependency.
5. For Script API functionality, use a Bedrock version compatible with the manifest's minimum engine and declared `@minecraft/server` / `@minecraft/server-ui` versions. Enable the required experiment only if your installed Bedrock version requests it.

The packaging workflow validates both manifests, checks the RP UI registrations, builds the nested `.mcpack` archives, and publishes one `.mcaddon` artifact. This is native Bedrock packaging; it does **not** make the separate Three.js browser game run inside Bedrock.


## Repository structure

See [`docs/STRUCTURE.md`](docs/STRUCTURE.md) for the full annotated tree. TL;DR:

```
Surprise564/
├── public/minecraft.html         # ★ Browser voxel game
├── public/VoxelCraft/textures/   #     Browser-game textures staged from vanilla RP
├── src/app/                      #     Next.js host page
├── VoxelCraft/                   #     Full vanilla Resource Pack (asset source)
├── VanillaBehaviorPack/          #     Git submodule: upstream vanilla BP
├── BedrockAddon/                  # ★ Our custom Script API behavior pack
├── VoxelCraftResourcePack/        #     Experimental JSON UI resource pack
├── scripts/setup.sh              #     Repo bootstrap
├── docs/                         #     STRUCTURE.md + ASSETS.md
├── .github/workflows/static.yml  #     GitHub Pages build pipeline
└── README.md                     #     You are here
```

## Developing the browser game

Requirements: [Bun](https://bun.sh) and a modern Node.js runtime.

```bash
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:3000/Surprise564/`. To open the game file directly, use `http://localhost:3000/Surprise564/minecraft.html`.

**Editor:** keep gameplay changes inside `public/minecraft.html`. The Next.js page in `src/app/page.tsx` only iframes the game — it shouldn't contain game logic.

### GitHub Pages

The workflow at `.github/workflows/static.yml` runs `bun run build` (Next.js static export with `output: "export"` and `basePath: "/Surprise564"`), then deploys the `out/` folder to Pages. Anything under `public/` is automatically included in the export.

## Bedrock references

Documentation sources used while building the addon and the game:

- [JaylyDev Script API docs](https://jaylydev.github.io/scriptapi-docs/) — event signatures, dynamic properties, `ActionFormData`
- [bedrock.dev](https://bedrock.dev/) — manifest schema, blocks.json, entity JSON
- [Microsoft Learn — Minecraft Creator reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable) — `world.afterEvents`, `player.teleport`, `world.setTimeOfDay`
- [MicrosoftDocs/minecraft-creator](https://github.com/MicrosoftDocs/minecraft-creator) — Script API patterns and conventions

## Attribution

The vanilla Resource Pack (`VoxelCraft/`) and the vanilla Behavior Pack submodule (`VanillaBehaviorPack/`) remain maintained by their upstream repositories. The upstream READMEs note that Minecraft assets belong to Mojang Studios and Microsoft. Review upstream notices and applicable terms before redistributing pack contents.

Full attribution details: [`LICENSE-ATTRIBUTION.md`](LICENSE-ATTRIBUTION.md).
