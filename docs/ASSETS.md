# Asset Attribution & Licensing Notes

See [`LICENSE-ATTRIBUTION.md`](../LICENSE-ATTRIBUTION.md) at the repo root for the authoritative statement.

## Quick reference

| Folder | Owned by | Use |
|--------|----------|-----|
| `public/minecraft.html`, `src/`, `BedrockAddon/`, `scripts/`, `.github/` | VoxelCraft project (original code) | Edit freely |
| `VoxelCraft/` (resource pack) | Mojang / Microsoft | Read-only asset source; do not redistribute outside the repo |
| `VanillaBehaviorPack/` (submodule) | Mojang / Microsoft | Read-only reference template; same caveat |
| `VoxelCraftResourcePack/` (JSON UI experiments) | VoxelCraft project | Edit, but be aware the JSON UI spec is version-sensitive |

## If a Mojang asset is missing from `VoxelCraft/`

Either fetch the latest from the upstream [ZtechNetwork/MCBVanillaResourcePack](https://github.com/ZtechNetwork/MCBVanillaResourcePack) repository, or extract it from your own legally-owned Minecraft Bedrock installation.

## Game music

Per the upstream pack README, game music is intentionally omitted for copyright reasons. The browser game uses WebAudio-synthesized SFX only, so no music files are required.
