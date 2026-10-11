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

# Keep this list aligned with TEXTURE_FILES in public/minecraft.html.
# The four basic ores below are generated procedurally by buildAtlas(), so
# their source PNGs are not required.
REQUIRED=(
  grass_top grass_side_carried dirt stone cobblestone
  log_oak_top log_oak planks_oak leaves_oak_opaque sand
  gravel glass bedrock brick gold_block diamond_block
  iron_block coal_block crafting_table_top crafting_table_side
  crafting_table_front furnace_front_off furnace_side water_still
  lapis_ore lapis_block redstone_ore redstone_block
  emerald_ore emerald_block copper_ore quartz_ore obsidian glowstone
  log_birch log_birch_top planks_birch leaves_birch_opaque
  log_spruce planks_spruce leaves_spruce_opaque
  log_jungle planks_jungle leaves_jungle_opaque
  log_acacia planks_acacia leaves_acacia_opaque
  log_big_oak planks_big_oak
  stone_granite stone_granite_smooth stone_diorite stone_diorite_smooth
  stone_andesite stone_andesite_smooth stonebrick
  snow ice netherrack soul_sand bookshelf pumpkin_top pumpkin_side sponge
  wool_colored_white wool_colored_black wool_colored_red
  wool_colored_blue wool_colored_green
  log_spruce_top log_jungle_top log_acacia_top log_big_oak_top
  furnace_top pumpkin_face_off
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

# Copy the vanilla Bedrock chicken model and texture for the browser renderer.
# The browser parses the original Bedrock geometry and uses the matching 64x32 atlas.
mkdir -p public/VoxelCraft/models/entity public/VoxelCraft/textures/entity/chicken
cp VoxelCraft/models/entity/chicken.geo.json public/VoxelCraft/models/entity/chicken.geo.json
cp VoxelCraft/textures/entity/chicken/chicken.png public/VoxelCraft/textures/entity/chicken/chicken.png

# Stage the original Bedrock UI sprites used by the browser HUD, inventory, and menus.
UI_TEX_DIR="public/VoxelCraft/textures/ui"
SRC_UI_DIR="VoxelCraft/textures/ui"
UI_REQUIRED=(
  menubackground background_panel background_with_border button_borderless_dark
  button_borderless_darkhover button_borderless_darkpressed dialog_background_opaque
  highlight_slot hotbar_start_cap hotbar_end_cap cancel inventory_icon
  hud_tip_text_background item_cell
)
mkdir -p "$UI_TEX_DIR"
for name in "${UI_REQUIRED[@]}"; do
  src="$SRC_UI_DIR/$name.png"
  dst="$UI_TEX_DIR/$name.png"
  if [ ! -f "$src" ]; then echo "Missing vanilla UI texture source: $src"; exit 1; fi
  if [ ! -f "$dst" ] || ! cmp -s "$src" "$dst"; then cp "$src" "$dst"; echo "    staged UI $name.png"; fi
done

# Stage the original item sprites referenced by the Behavior Pack ActionForm menu.
ITEM_TEX_DIR="public/VoxelCraft/textures/items"
SRC_ITEM_DIR="VoxelCraft/textures/items"
ITEM_REQUIRED=(book_writable apple feather clock_item bed_red compass_item book_normal brick diamond)
mkdir -p "$ITEM_TEX_DIR"
for name in "${ITEM_REQUIRED[@]}"; do
  src="$SRC_ITEM_DIR/$name.png"
  dst="$ITEM_TEX_DIR/$name.png"
  if [ ! -f "$src" ]; then echo "Missing Behavior Pack menu icon source: $src"; exit 1; fi
  if [ ! -f "$dst" ] || ! cmp -s "$src" "$dst"; then cp "$src" "$dst"; echo "    staged item icon $name.png"; fi
done

# Stage the original Bedrock Minecraft Ten font used by the UI.
FONT_SRC="VoxelCraft/font/minecraft-ten.ttf"
FONT_DST="public/VoxelCraft/font/minecraft-ten.ttf"
if [ ! -f "$FONT_SRC" ]; then echo "Missing original Bedrock font: $FONT_SRC"; exit 1; fi
mkdir -p "$(dirname "$FONT_DST")"
if [ ! -f "$FONT_DST" ] || ! cmp -s "$FONT_SRC" "$FONT_DST"; then
  cp "$FONT_SRC" "$FONT_DST"
  echo "    staged original Minecraft Ten font"
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
