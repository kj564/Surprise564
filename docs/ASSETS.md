# Asset Provenance, Authority, and Staging Rules

## Source of truth

- **Original Minecraft assets are authoritative.** Use the exact matching source file when it exists; do not recreate a texture, model, sprite, or font from memory.
- **Canonical asset source:** `VoxelCraft/` contains the original resource-pack files used by the game.
- **Code/behavior reference:** `rujukan/` is the first place to consult for original game architecture and behavior.
- **Runtime copies:** `public/VoxelCraft/` is a staged subset for browser delivery. It is derived output, not the authoritative source.

## Rules when adding or changing assets

1. Find and inspect the exact original source file first.
2. Keep original source assets unchanged. Do not modify canonical originals to work around browser limitations.
3. If the browser needs a copy, stage it at the correct path under `public/VoxelCraft/`.
4. Add the same staging operation to both `scripts/setup.sh` and `.github/workflows/static.yml`; otherwise local and CI builds may diverge.
5. Update any runtime path list in `public/minecraft.html` and the corresponding checks in `scripts/validate-game.mjs`.
6. Validate file existence and, where appropriate, byte identity, image dimensions, model geometry, UV bounds, and runtime path wiring.
7. If an asset is missing, report that explicitly. A fallback is acceptable only when documented and must not be presented as the original asset.
8. Keep attribution and license notes accurate. Original Minecraft assets remain the property of their respective rights holders.

## Current asset flow

```text
VoxelCraft/ (canonical original resource-pack files)
        │
        ├── scripts/setup.sh
        └── .github/workflows/static.yml
                    │
                    ▼
        public/VoxelCraft/ (runtime subset)
                    │
                    ▼
        public/minecraft.html (browser renderer)
```

## Audio

The browser game currently uses Web Audio synthesized sound effects. Do not assume original music files are available unless verified in the source assets.
