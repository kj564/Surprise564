# Bug Report — MCPE 0.7.0 WASM Port

## Console Errors (4)
- Error: Missing category for tile 87 (netherrack) — source fixed, needs rebuild
- Error: Missing category for tile 95 (invisible_bedrock) — source fixed, needs rebuild  
- Error: Missing category for tile 253 (grass_carried) — source fixed, needs rebuild
- Error: Missing category for tile 255 (info_reserved6) — source fixed, needs rebuild

## Visual Bugs (21, from VLM analysis)
### Critical
1. No crosshair — Gui::render crosshair not drawing
2. No hand/held-item model — ItemInHandRenderer not working
3. Leaves = solid green cubes — alpha test not working
4. Black patches in sky — sky rendering corrupt
5. Clouds clip terrain — depth sorting wrong
6. Hotbar item icons wrong — 3D tile rendering shows wrong texture
7. D-pad transparency issues — alpha blending wrong
8. Compass N broken — icon not drawing

### Medium
9-15: grass texture, z-fighting, no AO, face shading, floating trees, color mismatch, LOD

### Low  
16-21: D-pad alignment, HUD overlap, hotbar highlight, texture tiling

## Item Icon Bug Analysis
### Hotbar items (from source: Inventory::setupDefault, non-DEMO, creative):
- Slot 0: Tile::rock (id=1) — shows as stone ✓
- Slot 1: Tile::stoneBrick (id=4) — shows as "cobblestone" ✗
- Slot 2: Tile::redBrick (id=45) — shows as bricks ✓
- Slot 3: Tile::torch (id=50) — shows as torch ✓
- Slot 4: Tile::dirt (id=3) — shows as dirt ✓
- Slot 5: Tile::wood (id=5) — shows as "eggs"/"..." ✗
- Slot 6: "..." button — shows as "eggs" (three dots = three white blobs)

### Root cause
renderGuiItemCorrect uses 3D rendering (renderGuiTile) for blocks (id < 256):
- glPushMatrix2 + glTranslatef2 + glScalef2 + glRotatef2
- renderFaceUp/Down/N/S/E/W with texture from terrain.png
- UV computed from texture index: xt=(tex&0xf)<<4, yt=tex&0xf0

The 3D rendering in GL1 shim may have issues:
- Matrix stack (push/pop) may not work correctly
- Texture binding may be wrong after 3D transforms
- Depth/clipping may clip the 3D icon

### Block placement test
- Quick tap (80ms) in turn area should place block
- No block was placed — block placement may not work in touch mode
- Need to verify hitResult.type == TILE before placement
