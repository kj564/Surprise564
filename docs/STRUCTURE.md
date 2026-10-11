# VoxelCraft Repository Structure

This document explains where each piece of the project lives and why.

```
Surprise564/
├── public/                       # Static assets served by GitHub Pages (via Next.js export)
│   ├── minecraft.html            # ★ Browser voxel game (Three.js, self-contained)
│   └── VoxelCraft/
│       └── textures/blocks/      #   Only the 24 textures minecraft.html uses
│
├── src/
│   └── app/
│       ├── layout.tsx            # Next.js root layout
│       ├── page.tsx              # Index route — iframes minecraft.html
│       └── globals.css            # Tailwind/global styles
│
├── VoxelCraft/                   # Full vanilla Bedrock Resource Pack (310 MB)
│                                 #   Source: github.com/ZtechNetwork/MCBVanillaResourcePack
│                                 #   Kept as the canonical asset source for the browser game.
│                                 #   NOT served directly by GitHub Pages.
│
├── VanillaBehaviorPack/          # Git SUBMODULE → ZtechNetwork/MCBVanillaBehaviorPack
│                                 #   Run `git submodule update --init --recursive` after clone.
│                                 #   Reference template for what an official BP looks like.
│
├── BedrockAddon/                 # ★ Our custom Script API behavior pack
│   ├── manifest.json             #   Depends on @minecraft/server 2.10.0 + server-ui 2.0.0
│   ├── scripts/main.js           #   9 chat commands + ActionForm UI + coin economy
│   └── README.md                 #   Install + test instructions
│
├── VoxelCraftResourcePack/       # Experimental Bedrock JSON UI resource pack work
│                                 #   (start screen, main menu customisation)
│
├── scripts/
│   └── setup.sh                  # Repo bootstrap (submodule init + texture copy + bun install)
│
├── .github/workflows/
│   └── static.yml                # GitHub Action: bun build → out/ → GitHub Pages
│
├── docs/
│   ├── STRUCTURE.md              # This file
│   └── ASSETS.md                 # Asset attribution and licensing notes
│
├── next.config.ts                # Next.js config: output="export", basePath="/Surprise564"
├── package.json                  # Bun/Node deps (next, three, @types/three)
├── tsconfig.json
├── tailwind.config.ts
└── README.md                     # Start here
```

## What runs where

| Surface | Path | Runs in |
|---------|------|---------|
| **Browser game** | `public/minecraft.html` | Any browser via GitHub Pages |
| **Web host** | `src/app/page.tsx` | Next.js → static export → Pages |
| **Bedrock behavior pack** | `BedrockAddon/` | Minecraft Bedrock Edition (real game) |
| **Bedrock resource pack** | `VoxelCraftResourcePack/` | Minecraft Bedrock Edition (real game) |
| **Vanilla reference RP** | `VoxelCraft/` | Read-only asset source for the browser game |
| **Vanilla reference BP** | `VanillaBehaviorPack/` | Read-only reference for behavior pack authors |

## GitHub Pages build chain

1. Push to `main` triggers `.github/workflows/static.yml`.
2. Action runs `bun install` + `bun run build` (Next.js static export).
3. Next.js copies everything under `public/` into `out/`.
4. `out/` is uploaded as the Pages artifact and deployed to `https://kj564.github.io/Surprise564/`.
5. The game itself is reachable at `/Surprise564/minecraft.html`.

## Why two copies of textures?

- `VoxelCraft/` holds the **complete** 18,417-file vanilla resource pack so contributors can grab any texture they want for the browser game.
- `public/VoxelCraft/textures/blocks/` holds only the 24 textures the browser game actually references today, to keep the GitHub Pages deployment small and fast.
- `scripts/setup.sh` re-syncs the 24 textures from the full pack if they go missing.
