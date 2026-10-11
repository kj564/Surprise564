# Surprise564

A personal web project that combines the **Tools Wars** canvas fighting game, surprise/birthday pages, a standalone voxel sandbox, and archived presentation material.

## Main areas

- `src/` — Next.js application and the Tools Wars game.
- `public/minecraft.html` — standalone first-person voxel game, loaded as a static page.
- `public/VoxelCraft/` — block texture assets used by the voxel game.
- `public/surprise/` — media and exported HTML used by the surprise pages.
- `HTML/` — original exported HTML materials; the Pages workflow copies these into `public/HTML/` during build.
- `VoxelCraft/` — Minecraft Bedrock resource-pack data (JSON definitions, animations, textures, and related assets).

## Run locally

Requirements: Bun and a recent Node.js runtime.

```bash
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:3000/Surprise564/` because the Next.js app uses the `/Surprise564` base path for GitHub Pages.

Useful checks:

```bash
bun run lint
bun run build
```

The GitHub Actions workflow builds a static export and deploys it to GitHub Pages. It also includes the original exported HTML material before building.

## Minecraft Bedrock notes

The `VoxelCraft/` directory contains resource-pack-style data. It is **not currently a standalone Script API behavior pack**: the repository tree does not include a behavior-pack `manifest.json` or a `scripts/` entry point. Do not add `@minecraft/server` imports to resource JSON files. If Script API features are introduced later, add a separate behavior-pack structure and declare the required module versions in its manifest.

For compatibility work, use the stable documentation first and only use beta APIs when the target world explicitly enables the relevant experiments:

- [Jayly Script API references](https://jaylydev.github.io/scriptapi-docs/)
- [Bedrock documentation](https://bedrock.dev/)
- [Minecraft Creator reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable)
- [MicrosoftDocs/minecraft-creator](https://github.com/MicrosoftDocs/minecraft-creator)
- [Script API versioning](https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/versioning?view=minecraft-bedrock-stable)
- [Pack manifest reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable)

## Notes on bundled assets

The repository includes large exported presentation files, media, and Minecraft-related assets. Keep source files and generated copies distinct, and avoid removing or recompressing media unless the corresponding HTML references are updated and checked.
