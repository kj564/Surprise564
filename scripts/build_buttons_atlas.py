#!/usr/bin/env python3
"""
Extract the three MCPE 2013 button states (normal / hover / pressed) from
gui.png into a clean 200x60 atlas called gui_buttons.png.

gui.png has the buttons stacked vertically at y=46, y=66, y=86 (each 200x20).
We copy each into a new 200x60 atlas:
    y=0..19   normal
    y=20..39  hover
    y=40..59  pressed

CSS uses this with `background-size: 200px 60px` and `background-position: 0 0`,
`0 -20px`, `0 -40px` to switch states. With `background-repeat: repeat-x`
the 200px-wide button sprite tiles cleanly across any button width — no
"rest of atlas" leaking between tiles (which is what would happen if we
used the full 256x256 gui.png directly with background-position).
"""

from PIL import Image
import os

PUBLIC = os.path.join(os.path.dirname(__file__), "..", "public")
SRC = os.path.join(PUBLIC, "VoxelCraft", "textures", "gui", "gui.png")
OUT = os.path.join(PUBLIC, "VoxelCraft", "textures", "gui", "gui_buttons.png")

src = Image.open(SRC).convert("RGBA")
out = Image.new("RGBA", (200, 60), (0, 0, 0, 0))

# Normal: y=46..65 in gui.png -> y=0..19 in gui_buttons.png
out.paste(src.crop((0, 46, 200, 66)), (0, 0))
# Hover: y=66..85 -> y=20..39
out.paste(src.crop((0, 66, 200, 86)), (0, 20))
# Pressed: y=86..105 -> y=40..59
out.paste(src.crop((0, 86, 200, 106)), (0, 40))

out.save(OUT)
print(f"Saved {OUT} ({out.size})")

# Verify
v = Image.open(OUT)
print(f"Verify:")
print(f"  Normal (10,5)  -> {v.getpixel((10,5))}   (should be ~44 gray)")
print(f"  Hover  (10,25) -> {v.getpixel((10,25))}   (should be ~111 light gray)")
print(f"  Pressed(10,45) -> {v.getpixel((10,45))}   (should be ~126 bluish)")
print(f"  Top border  (100,0)  -> {v.getpixel((100,0))}   (should be black)")
print(f"  Bottom border (100,19) -> {v.getpixel((100,19))} (should be black)")
