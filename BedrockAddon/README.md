# VoxelCraft Script Starter (Minecraft Bedrock)

This folder is a separate Bedrock behavior pack built around the stable Minecraft Script API. It is not executed by the browser-based Three.js game on GitHub Pages.

## Included

- `manifest.json` declares a script module and a dependency on `@minecraft/server` version `2.10.0`.
- `scripts/main.js` welcomes players on first spawn and displays dimension/coordinates in the action bar.

## Install / test

1. Copy this folder into the Minecraft Bedrock development behavior packs directory (or package it as a `.mcpack`).
2. Open a test world and enable the behavior pack.
3. Launch the world and check the chat welcome message and action bar.
4. If your installed Minecraft version supports a different stable Script API module version, update the dependency to the version supported by that game version.

## References

- [Jayly Script API reference](https://jaylydev.github.io/scriptapi-docs/)
- [Bedrock Wiki](https://wiki.bedrock.dev/)
- [Microsoft Minecraft Creator reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable)
- [MicrosoftDocs/minecraft-creator](https://github.com/MicrosoftDocs/minecraft-creator)

Prefer stable APIs for release packs. Preview/beta APIs may require experiments and can change incompatibly.
