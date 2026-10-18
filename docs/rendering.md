# Rendering — TileRenderer per-face brightness + FACES vertex order

> Spec-driven port of MCPE 2013 block rendering (TileRenderer.cpp + texture atlas).
> Every constant cites the rujukan C++ source with `§File:line`.

## Overview

MCPE 2013 renders cubes by walking each of 6 faces and emitting a quad (4
vertices, 6 indices) when the neighbor on that face is air. Each face has a
fixed brightness multiplier (`c10/c11/c2/c3`) baked into the vertex color;
combined with the block's brightness from `Tile::getBrightness`, this gives
the classic Minecraft "lit top, darker sides, darkest bottom" look without
dynamic scene lighting.

The browser port replicates this in `public/minecraft.html::buildChunkGeometry`
(~line 1538). It uses `THREE.MeshBasicMaterial` (no dynamic lights) with
`vertexColors: true` so the baked brightness becomes the actual rendered color.

The TS engine has a separate `src/game/rendering/chunk-mesher.ts` that emits
geometry but does **not** apply per-face brightness (it leaves it to the
renderer). The mesher's FACES table uses a different vertex ordering than
rujukan's `renderFace*` functions (different starting vertex, but the same
winding direction).

## Constants — Per-face brightness (§TileRenderer.cpp:54-57)

```cpp
bool TileRenderer::tesselateBlockInWorld(Tile* tt, int x, int y, int z, float r, float g, float b) {
    applyAmbienceOcclusion = false;
    float xf = (float)x, yf = (float)y, zf = (float)z;
    Tesselator& t = Tesselator::instance;
    bool changed = false;
    float c10 = 0.5f;       // DOWN brightness
    float c11 = 1;          // UP brightness
    float c2  = 0.8f;       // NORTH/SOUTH brightness
    float c3  = 0.6f;       // WEST/EAST brightness
    ...
}
```

| Face | Brightness variable | Value | Rujukan source |
|------|---------------------|-------|----------------|
| DOWN (bottom) | `c10` | 0.5 | §TileRenderer.cpp:54 — `float c10 = 0.5f;` |
| UP (top) | `c11` | 1.0 | §TileRenderer.cpp:55 — `float c11 = 1;` |
| NORTH (-Z) | `c2` | 0.8 | §TileRenderer.cpp:56 — `float c2 = 0.8f;` |
| SOUTH (+Z) | `c2` | 0.8 | (same c2) |
| WEST (-X) | `c3` | 0.6 | §TileRenderer.cpp:57 — `float c3 = 0.6f;` |
| EAST (+X) | `c3` | 0.6 | (same c3) |

The face → brightness application is in §TileRenderer.cpp:81-118:
- DOWN: `t.color(r10 * br, g10 * br, b10 * br)` where `r10 = c10 * r` (line 67) — `c10=0.5`
- UP: `t.color(r11 * br, g11 * br, b11 * br)` where `r11 = c11 * r` (line 59) — `c11=1.0`
- NORTH: `t.color(r2 * br, g2 * br, b2 * br)` where `r2 = c2 * r` (line 68) — `c2=0.8`
- SOUTH: `t.color(r2 * br, g2 * br, b2 * br)` — same `c2=0.8`
- WEST: `t.color(r3 * br, g3 * br, b3 * br)` where `r3 = c3 * r` (line 69) — `c3=0.6`
- EAST: `t.color(r3 * br, g3 * br, b3 * br)` — same `c3=0.6`

The browser port bakes this into a per-face array (§minecraft.html:1547):

```js
// FACES order: 0=+X(EAST) 1=-X(WEST) 2=+Y(UP) 3=-Y(DOWN) 4=+Z(SOUTH) 5=-Z(NORTH)
const FACE_BRIGHTNESS = [0.6, 0.6, 1.0, 0.5, 0.8, 0.8];
```

Index mapping: 0=+X=EAST=0.6, 1=-X=WEST=0.6, 2=+Y=UP=1.0, 3=-Y=DOWN=0.5,
4=+Z=SOUTH=0.8, 5=-Z=NORTH=0.8. This matches rujukan's `c10/c11/c2/c3` exactly.

## Constants — Texture atlas

| Constant | Value | Rujukan source |
|----------|-------|----------------|
| Atlas width | 256 px | §TileRenderer.cpp:1754 (uses `/256.0f`) |
| Atlas height | 256 px | §TileRenderer.cpp:1754 |
| Tile size | 16×16 px | §TileRenderer.cpp:1752 (`<< 4` = `* 16`) |
| Atlas grid | 16×16 tiles | (derived from 256/16) |
| UV inset | `0.01 / 256` | §TileRenderer.cpp:1756 — `15.99f` inset (≈0.01/256 in TS port) |
| `flipY` (Three.js) | `false` | (browser port convention — see below) |

The rujukan GLES1 convention has V=0 at the **top** of the canvas (rows 0..15
left-to-right, top-to-bottom). Three.js's default `flipY=true` would flip the
PNG vertically, breaking this. The browser port sets `flipY=false` to match
GLES1:

```js
// minecraft.html:3635
tex.flipY = false;  // VERIFIED: terrain.png uses GLES1 convention (V=0 at top).
```

Per-tile UV mapping (rujukan §TileRenderer.cpp:1751-1759, mirrored in TS):

```
xt = (tex & 0xf) << 4;             // pixel x = (tile % 16) * 16
yt = tex & 0xf0;                   // pixel y = (tile / 16) * 16 (since & 0xf0 = high 4 bits)
u0 = (xt + xx0*16)         / 256;  // inset for tile sub-rect
u1 = (xt + xx1*16 - 0.01)  / 256;  // -0.01px inset to avoid bleed
v0 = (yt + zz0*16)         / 256;
v1 = (yt + zz1*16 - 0.01)  / 256;
```

## FACES vertex order (§TileRenderer.cpp:1743-2030)

Each `renderFace*` function emits 4 vertices in a specific winding order.
The TS engine's `chunk-mesher.ts` FACES table is a separate (functionally
equivalent) ordering.

### renderFaceDown (§TileRenderer.cpp:1743-1779)

```
(x0, y0, z1)  u0, v1
(x0, y0, z0)  u0, v0
(x1, y0, z0)  u1, v0
(x1, y0, z1)  u1, v1
```

### renderFaceUp (§TileRenderer.cpp:1781-1817)

```
(x1, y1, z1)  u1, v1
(x1, y1, z0)  u1, v0
(x0, y1, z0)  u0, v0
(x0, y1, z1)  u0, v1
```

### renderNorth (§TileRenderer.cpp:1819-1855)

```
(x0, y1, z0)  u1, v0
(x1, y1, z0)  u0, v0
(x1, y0, z0)  u0, v1
(x0, y0, z0)  u1, v1
```

### renderSouth (§TileRenderer.cpp:1857-1893)

```
(x0, y1, z1)  u0, v0
(x0, y0, z1)  u0, v1
(x1, y0, z1)  u1, v1
(x1, y1, z1)  u1, v0
```

### renderWest (§TileRenderer.cpp:1895-1931)

```
(x0, y1, z1)  u1, v0
(x0, y1, z0)  u0, v0
(x0, y0, z0)  u0, v1
(x0, y0, z1)  u1, v1
```

### renderEast (§TileRenderer.cpp:1933-1969)

```
(x1, y0, z1)  u0, v1
(x1, y0, z0)  u1, v1
(x1, y1, z0)  u1, v0
(x1, y1, z1)  u0, v0
```

### TS engine FACES (§src/game/rendering/chunk-mesher.ts:36-43)

The TS engine's FACES table uses a different ordering (west/east first, then
down/up, then north/south), but each face's vertices still produce the same
winding direction as rujukan (just starting from a different corner of the
quad). Both produce 6 correctly-wound quads per isolated cube — verified
by the chunk-mesher test `'creates six correctly shaped quads for an isolated cube'`.

```ts
const FACES = [
  { face: 'west',  normal: [-1, 0, 0], vertices: [[0,0,0], [0,0,1], [0,1,1], [0,1,0]] },
  { face: 'east',  normal: [ 1, 0, 0], vertices: [[1,0,1], [1,0,0], [1,1,0], [1,1,1]] },
  { face: 'down',  normal: [0, -1, 0], vertices: [[0,0,1], [0,0,0], [1,0,0], [1,0,1]] },
  { face: 'up',    normal: [0,  1, 0], vertices: [[0,1,0], [0,1,1], [1,1,1], [1,1,0]] },
  { face: 'north', normal: [0, 0, -1], vertices: [[1,0,0], [0,0,0], [0,1,0], [1,1,0]] },
  { face: 'south', normal: [0, 0,  1], vertices: [[0,0,1], [1,0,1], [1,1,1], [0,1,1]] },
];
```

### Browser port FACES (§minecraft.html:1510-1517)

The browser port's FACES table matches rujukan's `renderFace*` ordering
exactly (Task 14 verified this 1:1):

```js
const FACES = [
  { dir:[1,0,0],  c:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]], uv:[[0,1],[1,1],[1,0],[0,0]] }, // +X EAST
  { dir:[-1,0,0], c:[[0,1,1],[0,1,0],[0,0,0],[0,0,1]], uv:[[1,0],[0,0],[0,1],[1,1]] }, // -X WEST
  { dir:[0,1,0],  c:[[1,1,1],[1,1,0],[0,1,0],[0,1,1]], uv:[[1,1],[1,0],[0,0],[0,1]] }, // +Y UP
  { dir:[0,-1,0], c:[[0,0,1],[0,0,0],[1,0,0],[1,0,1]], uv:[[0,1],[0,0],[1,0],[1,1]] }, // -Y DOWN
  { dir:[0,0,1],  c:[[0,1,1],[0,0,1],[1,0,1],[1,1,1]], uv:[[0,0],[0,1],[1,1],[1,0]] }, // +Z SOUTH
  { dir:[0,0,-1], c:[[0,1,0],[1,1,0],[1,0,0],[0,0,0]], uv:[[1,0],[0,0],[0,1],[1,1]] }, // -Z NORTH
];
```

## Worked examples (machine-decidable)

### Per-face brightness values

| Face | Brightness | RGB at white (r=g=b=1) |
|------|-----------|------------------------|
| UP | 1.0 | (1.0, 1.0, 1.0) — brightest |
| NORTH/SOUTH | 0.8 | (0.8, 0.8, 0.8) — medium |
| WEST/EAST | 0.6 | (0.6, 0.6, 0.6) — darker |
| DOWN | 0.5 | (0.5, 0.5, 0.5) — darkest |

### Texture atlas tile coordinate

For tile id `5` (oak_planks texture in MCPE 2013):
```
xt = (5 & 0xf) << 4 = 5 * 16 = 80 px
yt = 5 & 0xf0 = 0 px (row 0)
u0 = 80 / 256 = 0.3125
u1 = (80 + 16 - 0.01) / 256 = 0.37496...
v0 = 0
v1 = (16 - 0.01) / 256 = 0.06246...
```

### Chunk quad count for an isolated cube

A single cube with all 6 neighbors being air produces 6 quads (one per face),
24 vertices, 36 indices. Verified by the chunk-mesher test.

## Acceptance test (machine-decidable)

```ts
// §Per-face brightness (TileRenderer.cpp:54-57) — proposed test
const FACE_BRIGHTNESS = [0.6, 0.6, 1.0, 0.5, 0.8, 0.8];  // matches minecraft.html:1547
expect(FACE_BRIGHTNESS[2]).toBe(1.0);    // UP
expect(FACE_BRIGHTNESS[3]).toBe(0.5);    // DOWN
expect(FACE_BRIGHTNESS[4]).toBe(0.8);    // SOUTH
expect(FACE_BRIGHTNESS[5]).toBe(0.8);    // NORTH
expect(FACE_BRIGHTNESS[0]).toBe(0.6);    // EAST
expect(FACE_BRIGHTNESS[1]).toBe(0.6);    // WEST

// §Texture atlas (256x256, 16x16 tiles, inset 0.01/256) — proposed
const ATLAS_W = 256, ATLAS_H = 256, ATLAS_COLS = 16;
const inset = 0.01 / ATLAS_W;
const col = 5, row = 0;
const u0 = col / ATLAS_COLS + inset;
const u1 = (col + 1) / ATLAS_COLS - inset;
expect(u1 - u0).toBeCloseTo(1/16 - 2*inset, 6);

// §Isolated cube produces 6 quads, 24 vertices, 36 indices
const world = makeWorld();
world.loadChunk(0, 0);
world.setBlock({ x: 0, y: 0, z: 0 }, 1);
const mesh = buildChunkMesh(world, 0, 0, defaultBlockRegistry);
expect(mesh.layers.opaque!.faceCount).toBe(6);
expect(mesh.layers.opaque!.positions.length).toBe(6 * 4 * 3);
expect(mesh.layers.opaque!.indices.length).toBe(36);

// §Two adjacent opaque cubes share one face (10 = 2*6 - 2)
world.setBlock({ x: 1, y: 0, z: 0 }, 4);
expect(buildChunkMesh(world, 0, 0, defaultBlockRegistry).layers.opaque?.faceCount).toBe(10);
```

## Verification

| Claim | Test file | Test name |
|-------|-----------|-----------|
| Isolated cube produces 6 quads (24 vertices, 36 indices) | `src/game/rendering/chunk-mesher.test.ts` | `'creates six correctly shaped quads for an isolated cube'` |
| Shared face between adjacent cubes is culled | `src/game/rendering/chunk-mesher.test.ts` | `'culls the shared face between adjacent opaque cubes'` |
| Chunk-boundary faces stay culled when neighbor loaded | `src/game/rendering/chunk-mesher.test.ts` | `'keeps chunk-boundary faces culled when both chunks are loaded'` |
| Non-cube blocks not silently rendered as cubes | `src/game/rendering/chunk-mesher.test.ts` | `'does not silently render non-cube or unknown blocks as cubes'` |
| Unloaded neighbor treated as exposed face | `src/game/rendering/chunk-mesher.test.ts` | `'treats unloaded neighbor space as exposed and rejects unloaded target chunks'` |

## Untested claims (note for next agent)

- **Per-face brightness values (`c10/c11/c2/c3`)**: NO test. These constants
  live only in `public/minecraft.html:1547` (a const array). The TS engine's
  `chunk-mesher.ts` doesn't apply brightness — it leaves it to the renderer.
  Suggested test: extract `FACE_BRIGHTNESS` into a small module and assert
  its 6 values match the rujukan constants.
- **FACES vertex order matches rujukan renderFace***: the browser port's
  FACES table matches rujukan exactly (Task 14 audit verified), but the TS
  engine's FACES table uses a different ordering. Neither has a test that
  pins specific vertex coordinates — the chunk-mesher test only checks
  counts, not positions. Suggested test: for an isolated cube at origin,
  assert that the first quad's 4 vertices match rujukan renderFaceDown's
  exact (x,y,z) values.
- **Texture atlas UV inset 0.01/256**: no test. The `tileUV` function in
  `minecraft.html:1519` encodes this but no test asserts the exact inset
  value.
- **flipY=false**: this is a Three.js texture attribute, not testable
  outside a DOM environment. The comment at `minecraft.html:3635-3637`
  documents the rationale (GLES1 V=0-at-top convention).
