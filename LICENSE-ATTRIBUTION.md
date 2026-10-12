# VoxelCraft — Asset Attribution & License

This repository is a fan project. **VoxelCraft is not affiliated with, endorsed by, or sponsored by Mojang Studios or Microsoft.** "Minecraft" is a trademark of Mojang Studios.

## Minecraft Bedrock assets

All vanilla Minecraft Bedrock assets (textures, sounds, models, animations, entity definitions, recipe JSON, etc.) located in:

- `VoxelCraft/` — checked-in mirror/snapshot of the upstream [ZtechNetwork/MCBVanillaResourcePack](https://github.com/ZtechNetwork/MCBVanillaResourcePack)
- `VanillaBehaviorPack/` — full vanilla behavior pack template (git submodule of [ZtechNetwork/MCBVanillaBehaviorPack](https://github.com/ZtechNetwork/MCBVanillaBehaviorPack))

…are the property of **Mojang Studios / Microsoft**. They are included here solely as reference data and runtime assets for the browser game, consistent with how the upstream repositories distribute them.

> All assets belong to Mojang & Microsoft.

The upstream README explicitly states that this data is a template and that they don't own these assets — see [`VoxelCraft/README.md`](VoxelCraft/README.md).

## Original code in this repo

The following folders are original work for VoxelCraft and are licensed under the repository's license (see `LICENSE` if present, otherwise MIT-style permissive):

- `public/minecraft.html` — the browser voxel game (Three.js)
- `src/` — Next.js app that hosts the browser game
- `BedrockAddon/` — custom Script API behavior pack starter (commands, ActionForm UI, dynamic-property stats)
- `VoxelCraftResourcePack/` — experimental JSON UI resource pack work
- `scripts/setup.sh` — development setup helper
- `.github/workflows/` — CI/CD pipelines

## Game music

Per the upstream resource pack README: **game music is not included** for copyright reasons. If you need music references, use `sound_definitions.json` in `VoxelCraft/sounds/` as a lookup table only.

## Reporting issues with vanilla assets

As of March 22nd, 2025, the upstream repositories are templates. Issues with vanilla assets themselves should be reported to the official [Mojang/bedrock-samples](https://github.com/Mojang/bedrock-samples/issues) repository, not to this project.

## TL;DR for contributors

- Do not redistribute the contents of `VoxelCraft/` or `VanillaBehaviorPack/` outside this repository without verifying your rights to do so.
- Prefer writing your own assets, or pull from the user's installed game at runtime as the upstream README recommends.
- Keep VoxelCraft a personal, non-commercial project unless you have explicit written permission from Mojang/Microsoft.
