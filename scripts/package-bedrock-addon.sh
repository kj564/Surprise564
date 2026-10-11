#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/dist/bedrock"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT"
node scripts/validate-bedrock-addon.mjs

command -v zip >/dev/null 2>&1 || {
  echo "The 'zip' command is required to package .mcpack/.mcaddon files." >&2
  exit 1
}

mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR/VoxelCraft.mcaddon" "$OUT_DIR/VoxelCraftBehaviorPack.mcpack" "$OUT_DIR/VoxelCraftResourcePack.mcpack"

(
  cd "$ROOT/BedrockAddon"
  zip -qr "$TMP_DIR/VoxelCraftBehaviorPack.mcpack" .
)
(
  cd "$ROOT/VoxelCraftResourcePack"
  zip -qr "$TMP_DIR/VoxelCraftResourcePack.mcpack" .
)

# A .mcaddon is a ZIP containing separate .mcpack archives, not a ZIP of raw pack folders.
zip -j -q "$OUT_DIR/VoxelCraft.mcaddon" \
  "$TMP_DIR/VoxelCraftBehaviorPack.mcpack" \
  "$TMP_DIR/VoxelCraftResourcePack.mcpack"

echo "Created: $OUT_DIR/VoxelCraft.mcaddon"
unzip -l "$OUT_DIR/VoxelCraft.mcaddon"
