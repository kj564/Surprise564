# VoxelCraft Main Menu — Minecraft Bedrock Resource Pack

This is a **Resource Pack** for Minecraft Bedrock Edition, separate from the browser-based Three.js game and separate from `BedrockAddon/` (the Behavior Pack).

## What is included

- `manifest.json`: resource-pack manifest.
- `ui/_ui_defs.json`: registers the custom UI definitions.
- `ui/main_menu.json`: adds VoxelCraft branding to the start screen.
- `ui/start_screen.json`: based on Mojang's public Bedrock Samples start-screen UI, with a small branding control inserted.

## Install for local testing

1. Copy the `VoxelCraftResourcePack` folder to Minecraft's `development_resource_packs` directory.
2. Launch Bedrock and enable **VoxelCraft Main Menu** in Global Resources.
3. Restart Minecraft and inspect the title screen. Keep a backup of existing packs before testing.

## Important compatibility notes

- Bedrock's UI is version-sensitive. The start screen is copied from Mojang's sample UI, so changes in a later game version may require updating `ui/start_screen.json`.
- This is an experimental community customization, not an officially supported way to replace the entire Bedrock main menu. Test against your exact Bedrock version and check the content log if the screen fails to load.
- The six panorama cube faces, a custom logo texture, and a menu music file are **not included yet** because original art/audio assets have not been supplied. The pack currently adds text branding and preserves the existing background and functional vanilla buttons.
- Java Edition conventions such as `texts/splashes.txt` are not assumed to work as Bedrock menu features.
- Only new custom UI files are listed in `ui/_ui_defs.json`; vanilla UI files are merged by the game.

## Source

The base `ui/start_screen.json` is adapted from [Mojang/bedrock-samples](https://github.com/Mojang/bedrock-samples/tree/main/resource_pack/ui). JsonUI reference: [Microsoft Learn — UI definitions](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/jsonuireference/examples/jsonuicomponents/ui_defs?view=minecraft-bedrock-stable) and [Bedrock Wiki — JSON UI](https://wiki.bedrock.dev/json-ui/json-ui-intro).
