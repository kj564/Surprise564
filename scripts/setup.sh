#!/usr/bin/env bash
# VoxelCraft development setup.
#
# Initializes the vanilla Bedrock behavior-pack submodule and ensures the
# browser game has the textures it needs under public/VoxelCraft/textures/blocks/.
#
# Safe to re-run.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> [1/3] Initializing git submodules (VanillaBehaviorPack)…"
if [ -f .gitmodules ]; then
  git submodule update --init --recursive
else
  echo "    .gitmodules not found — skipping submodule init."
fi

echo "==> [2/3] Ensuring browser-game textures are present…"
GAME_TEX_DIR="public/VoxelCraft/textures/blocks"
SRC_TEX_DIR="VoxelCraft/textures/blocks"

# Textures the browser game (public/minecraft.html) actually references.
REQUIRED=(
  grass_top grass_side_carried dirt stone cobblestone
  log_oak_top log_oak planks_oak leaves_oak_opaque sand
  gravel glass bedrock brick gold_block diamond_block
  iron_block coal_block crafting_table_top crafting_table_side
  crafting_table_front furnace_front_off furnace_side water_still
)

mkdir -p "$GAME_TEX_DIR"

missing=0
for name in "${REQUIRED[@]}"; do
  dst="$GAME_TEX_DIR/$name.png"
  if [ -f "$dst" ]; then continue; fi
  src="$SRC_TEX_DIR/$name.png"
  if [ -f "$src" ]; then
    cp "$src" "$dst"
    echo "    copied $name.png -> public/VoxelCraft/textures/blocks/"
  else
    echo "    WARNING: $name.png not found in $SRC_TEX_DIR (game will fall back to a missing-texture pink square)"
    missing=$((missing+1))
  fi
done

if [ "$missing" -gt 0 ]; then
  echo "    $missing required texture(s) missing."
else
  echo "    All ${#REQUIRED[@]} required textures present."
fi

echo "==> [3/3] Installing browser-game dependencies (bun)…"
if command -v bun >/dev/null 2>&1; then
  bun install --frozen-lockfile
  echo "    Done. Run 'bun run dev' to start the dev server."
else
  echo "    bun not found — install from https://bun.sh, then re-run this script."
fi

echo ""
echo "VoxelCraft setup complete."
