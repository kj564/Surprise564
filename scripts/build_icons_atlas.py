#!/usr/bin/env python3
"""
Build a 256x256 MCPE-2013-style icons.png atlas from the existing
VoxelCraft/textures/ui/ individual heart / bubble / cursor textures.

Layout matches the Gui.cpp coordinates the HTML rewrite expects:

    (0,0)   16x16  crosshair (drawn programmatically, white "+" with transparent gaps)
    (16,0)   9x9   heart background  (non-blink)
    (25,0)   9x9   heart background (blink variant)
    (52,0)   9x9   full heart
    (61,0)   9x9   half heart
    (70,0)   9x9   full heart  (blink)
    (79,0)   9x9   half heart  (blink)
    (16,9)   9x9   empty armor
    (34,9)   9x9   full armor
    (52,9)   9x9   half armor
    (16,18)  9x9   full bubble
    (25,18)  9x9   empty bubble

Only icons.png is generated here. gui.png is already present in
public/VoxelCraft/textures/gui/ from the original MCPE 2013 dump.
"""

from PIL import Image, ImageDraw
import os

PUBLIC = os.path.join(os.path.dirname(__file__), "..", "public")
UI = os.path.join(PUBLIC, "VoxelCraft", "textures", "ui")
OUT = os.path.join(PUBLIC, "VoxelCraft", "textures", "gui", "icons.png")

ATLAS_SIZE = 256

# --- 1) Start with a fully transparent 256x256 atlas ---
atlas = Image.new("RGBA", (ATLAS_SIZE, ATLAS_SIZE), (0, 0, 0, 0))


# --- 2) Draw the crosshair (16x16, white "+" with transparent interior) ---
# MCPE 2013 crosshair: a thin plus made of two white 2-pixel-wide bars
# with the very centre kept transparent so the player's target block
# is visible through it. Matches Gui::renderGameOverlay's crosshair blit.
def draw_crosshair(img):
    draw = ImageDraw.Draw(img)
    white = (255, 255, 255, 255)
    # vertical bar: x = 7..8, y = 0..15
    draw.rectangle([7, 0, 8, 6], fill=white)
    draw.rectangle([7, 9, 8, 15], fill=white)
    # horizontal bar: x = 0..15, y = 7..8
    draw.rectangle([0, 7, 6, 8], fill=white)
    draw.rectangle([9, 7, 15, 8], fill=white)

draw_crosshair(atlas)


# --- 3) Helper: paste a 9x9 sprite at (x, y) ---
def paste_sprite(path, x, y, tint=None):
    if not os.path.exists(path):
        print(f"  ! missing: {path}")
        return
    s = Image.open(path).convert("RGBA")
    if s.size != (9, 9):
        # resample nearest to 9x9 just in case
        s = s.resize((9, 9), Image.NEAREST)
    if tint:
        # multiply RGB by tint (keep alpha)
        r, g, b = s.split()
        r = r.point(lambda v: int(v * tint[0] / 255))
        g = g.point(lambda v: int(v * tint[1] / 255))
        b = b.point(lambda v: int(v * tint[2] / 255))
        s = Image.merge("RGBA", (r, g, b, s.split()[3]))
    atlas.paste(s, (x, y), s)


# --- 4) Hearts (row y=0) ---
print("Building hearts row (y=0)...")
# Heart background (non-blink)
paste_sprite(os.path.join(UI, "heart_background.png"), 16, 0)
# Heart background blink variant
paste_sprite(os.path.join(UI, "heart_flash.png"), 25, 0)
# Full heart
paste_sprite(os.path.join(UI, "heart.png"), 52, 0)
# Half heart
paste_sprite(os.path.join(UI, "heart_half.png"), 61, 0)
# Blink full heart (lighter pinkish overlay)
paste_sprite(os.path.join(UI, "heart.png"), 70, 0)
paste_sprite(os.path.join(UI, "heart_flash.png"), 70, 0)
# Blink half heart
paste_sprite(os.path.join(UI, "heart_half.png"), 79, 0)
paste_sprite(os.path.join(UI, "heart_flash.png"), 79, 0)


# --- 5) Armor row (y=9) — drawn programmatically, gray armor shapes ---
print("Building armor row (y=9)...")
def draw_armor_empty(x, y):
    # Empty armor: just a faint outline
    draw = ImageDraw.Draw(atlas)
    outline = (60, 60, 60, 180)
    # chestplate silhouette outline
    draw.rectangle([x + 1, y + 1, x + 7, y + 7], outline=outline)
def draw_armor_full(x, y):
    draw = ImageDraw.Draw(atlas)
    gray = (160, 160, 160, 255)
    dark = (90, 90, 90, 255)
    # chestplate silhouette
    draw.rectangle([x + 1, y + 1, x + 7, y + 7], fill=gray, outline=dark)
    # shoulder straps
    draw.rectangle([x + 0, y + 2, x + 1, y + 5], fill=gray)
    draw.rectangle([x + 7, y + 2, x + 8, y + 5], fill=gray)
def draw_armor_half(x, y):
    draw = ImageDraw.Draw(atlas)
    gray = (160, 160, 160, 255)
    dark = (90, 90, 90, 255)
    # left half only
    draw.rectangle([x + 1, y + 1, x + 4, y + 7], fill=gray, outline=dark)

draw_armor_empty(16, 9)
draw_armor_full(34, 9)
draw_armor_half(52, 9)


# --- 6) Bubbles (row y=18) — drawn programmatically ---
print("Building bubbles row (y=18)...")
def draw_bubble_full(x, y):
    draw = ImageDraw.Draw(atlas)
    white = (255, 255, 255, 255)
    # Simple bubble: 3x3 white square with center hole
    draw.rectangle([x + 2, y + 0, x + 6, y + 8], fill=white)
    draw.rectangle([x + 0, y + 2, x + 8, y + 6], fill=white)
    # Center stays transparent
def draw_bubble_empty(x, y):
    draw = ImageDraw.Draw(atlas)
    outline = (255, 255, 255, 200)
    # Empty bubble: outline only
    draw.rectangle([x + 2, y + 0, x + 6, y + 0], fill=outline)
    draw.rectangle([x + 2, y + 8, x + 6, y + 8], fill=outline)
    draw.rectangle([x + 0, y + 2, x + 0, y + 6], fill=outline)
    draw.rectangle([x + 8, y + 2, x + 8, y + 6], fill=outline)

draw_bubble_full(16, 18)
draw_bubble_empty(25, 18)


# --- 7) Save the atlas ---
atlas.save(OUT)
print(f"Saved {OUT} ({atlas.size}, mode={atlas.mode})")

# Verify by re-reading and checking key pixels
verify = Image.open(OUT)
print("Verify pixels:")
print(f"  Crosshair (7,7) corner should be transparent: {verify.getpixel((7,7))}")
print(f"  Crosshair (7,0) top of vertical bar: {verify.getpixel((7,0))}")
print(f"  Crosshair (0,7) left of horizontal bar: {verify.getpixel((0,7))}")
print(f"  Heart bg (16,0) area: {verify.getpixel((20,4))}")
print(f"  Full heart (52,0) area: {verify.getpixel((56,4))}")
