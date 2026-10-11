# VoxelCraft

VoxelCraft contains two separate projects: a browser-playable voxel game published with GitHub Pages, and optional Minecraft Bedrock development packs. The Bedrock packs do **not** run inside the browser game.

## Browser game (GitHub Pages)

- `public/minecraft.html` — Three.js voxel game and its in-browser UI.
- `public/VoxelCraft/textures/blocks/` — textures used by the browser game.
- `src/app/` — Next.js page that hosts the game.
- `.github/workflows/static.yml` — static build and GitHub Pages deployment.

**Keep the web game's menu and gameplay changes in the web app**, primarily `public/minecraft.html` and the page that embeds it. A Bedrock Resource Pack or Behavior Pack cannot change the GitHub Pages game's UI.

## Minecraft Bedrock packs

| Path | Purpose |
| --- | --- |
| `BedrockAddon/` | Our small custom Script API Behavior Pack starter. |
| `VoxelCraftResourcePack/` | Experimental Bedrock Resource Pack / JSON UI work. JSON UI is version-sensitive and may not work on versions using hard-coded Ore UI. |
| `VanillaBehaviorPack/` | Git submodule referencing the upstream vanilla Behavior Pack template from ZtechNetwork. Keep upstream vanilla files separate from our custom pack. |
| `VoxelCraft/` | Existing VoxelCraft assets retained for development. |

### Get the vanilla Behavior Pack files

Clone with submodules enabled:

```bash
git clone --recurse-submodules https://github.com/kj564/Surprise564.git
```

If you already cloned the repository:

```bash
git submodule update --init --recursive
```

The submodule tracks [ZtechNetwork/MCBVanillaBehaviorPack](https://github.com/ZtechNetwork/MCBVanillaBehaviorPack). It is an upstream vanilla template, not custom gameplay logic written for the browser game. Its manifest currently targets a newer Bedrock version than older game releases, so check `VanillaBehaviorPack/manifest.json` before using it.

### Develop the browser game locally

Requirements: Bun and a modern Node.js runtime.

```bash
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:3000/Surprise564/`. To open the game file directly, use `http://localhost:3000/Surprise564/minecraft.html`.

### GitHub Pages

The workflow builds a static Next.js export and publishes `out/`. Keep the browser game's HTML and required assets available under `public/` so they are included in the export.

## Bedrock references

- [Jayly Script API docs](https://jaylydev.github.io/scriptapi-docs/)
- [Bedrock Wiki](https://wiki.bedrock.dev/)
- [Minecraft Creator reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable)
- [MicrosoftDocs/minecraft-creator](https://github.com/MicrosoftDocs/minecraft-creator)

## Attribution

The vanilla Behavior Pack submodule remains maintained by its upstream repository. Its README notes that Minecraft assets belong to Mojang Studios and Microsoft. Review upstream notices and applicable terms before redistributing pack contents.
