# VoxelCraft Script Starter (Minecraft Bedrock)

This folder is our small, custom Bedrock Behavior Pack built around the stable Minecraft Script API. It is separate from both the browser game and the vanilla Behavior Pack reference.

## Included

- `manifest.json` declares a script module and a dependency on `@minecraft/server`.
- `scripts/main.js` welcomes players on first spawn and displays dimension/coordinates in the action bar.

## Install / test

1. Copy this folder into Minecraft Bedrock's development behavior packs directory (or package it as a `.mcpack`).
2. Open a test world and enable this behavior pack.
3. Launch the world and check the chat welcome message and action bar.
4. If your installed Minecraft version supports a different stable Script API module version, update the dependency in `manifest.json` to the version supported by that game version.

## Related pack

The separate `../VanillaBehaviorPack/` folder is a Git submodule that points to [ZtechNetwork/MCBVanillaBehaviorPack](https://github.com/ZtechNetwork/MCBVanillaBehaviorPack). It is an upstream vanilla template, not a dependency of this starter. Initialize it with `git submodule update --init --recursive`.

## References

- [Jayly Script API reference](https://jaylydev.github.io/scriptapi-docs/)
- [Bedrock Wiki](https://wiki.bedrock.dev/)
- [Microsoft Minecraft Creator reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable)
- [MicrosoftDocs/minecraft-creator](https://github.com/MicrosoftDocs/minecraft-creator)

Prefer stable APIs for release packs. Preview/beta APIs may require experiments and can change incompatibly.
