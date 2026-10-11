# VoxelCraft Behavior Pack (Minecraft Bedrock)

A real Minecraft Bedrock behavior pack built around the stable Minecraft Script API (`@minecraft/server` v2.10.0 + `@minecraft/server-ui` v2.0.0). It is separate from the browser-based Three.js game on GitHub Pages and runs inside actual Minecraft Bedrock Edition.

## Features

### Custom chat commands
Type these in chat. Read-only commands `!help` and `!stats` are available to all players. World-changing commands require the `voxelcraft_admin` tag:

| Command | Description |
|---------|-------------|
| `!help` | Tampilkan daftar perintah |
| `!give <item> [jumlah]` | Beri item (e.g. `!give cobblestone 64`) |
| `!fly` | Toggle mode terbang |
| `!heal` | Pulihkan HP & hunger |
| `!time <day\|night\|noon\|midnight\|angka>` | Atur waktu dunia |
| `!weather <clear\|rain\|thunder>` | Atur cuaca |
| `!tp <x> <y> <z>` | Teleport ke koordinat |
| `!kit` | Dapatkan kit starter (alat + blok) |
| `!stats` | Lihat statistik pemain |

### ActionForm UI menu
- Rename a writable or written book to include the word **VoxelCraft** (e.g. with an anvil), then use it (right-click) to open an in-game menu with 8 quick actions: kit, heal, fly toggle, time day/night, weather clear, stats, close.

### Player stats + coin economy (dynamic properties)
- Per-player stats stored as world dynamic properties (survive restarts): `coins`, `blocksBroken`, `mobsKilled`, `joins`.
- **Ore coin rewards** on block break:
  - Coal Ore → +2 · Iron Ore → +3 · Gold Ore → +5 · Diamond Ore → +15 · Emerald Ore → +20
  - Deepslate variants give bonus (e.g. Deepslate Diamond → +25)
- Killing mobs → +1 coin
- Action bar HUD shows dimension, XYZ, in-game clock, and coin total.

### Auto-save
- Every 5 minutes (6000 ticks), all player stats are persisted to world dynamic properties.

## One-file installation (recommended)

The repository's **Build native Minecraft Bedrock addon** workflow produces a `VoxelCraft.mcaddon` artifact containing both this Behavior Pack and `VoxelCraftResourcePack/` as separate `.mcpack` archives.

1. Download the `VoxelCraft-Bedrock-Addon` artifact from the latest successful workflow run in GitHub Actions.
2. Extract the artifact ZIP to get `VoxelCraft.mcaddon`.
3. Open `VoxelCraft.mcaddon` in Minecraft Bedrock to import both packs.
4. Enable **VoxelCraft Behavior Pack** in your world. Its manifest declares the Resource Pack dependency so Bedrock can activate the pair together.

## Install / test

1. Copy the `BedrockAddon/` folder into the Minecraft Bedrock development behavior packs directory, or zip it as a `.mcpack` and double-click to import.
2. Create or open a world with **Experiments > Beta APIs** enabled (required for `@minecraft/server` v2.x stable module in some game versions).
3. Enable the **VoxelCraft Behavior Pack** in world settings.
4. Join the world and check chat for the welcome message.
5. From the server console, grant trusted administrators the tag with `/tag <player> add voxelcraft_admin`. Remove it with `/tag <player> remove voxelcraft_admin`.
6. Type `!help` in chat to see all commands. `!give`, `!fly`, `!heal`, `!time`, `!weather`, `!tp`, and `!kit` require the admin tag.
7. To open the menu UI, an admin gets a writable book (use `!give writable_book`), renames it to "VoxelCraft Guide" in an anvil, then uses it.

## References (sumber dokumentasi)

- [JaylyDev Script API reference](https://jaylydev.github.io/scriptapi-docs/)
- [bedrock.dev](https://bedrock.dev/) — community docs for manifest schema, blocks.json, items, entities
- [Microsoft Learn — Minecraft Creator Reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/?view=minecraft-bedrock-stable)
- [MicrosoftDocs/minecraft-creator](https://github.com/MicrosoftDocs/minecraft-creator) — source repo for official docs

## Module versions

- `@minecraft/server` → `2.10.0`
- `@minecraft/server-ui` → `2.0.0`
- `min_engine_version` → `1.26.0`

If your installed Minecraft version supports a different stable Script API module version, update the `dependencies` array in `manifest.json` accordingly. Prefer stable APIs for release packs; preview/beta APIs may require experiments and can change incompatibly.
