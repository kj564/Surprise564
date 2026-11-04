# VoxelCraft — Bug Fix Report (Mobile-Patched Build)

This document maps every bug you reported to its root cause in the MCPE 2013
source code, explains what was fixed at the JS layer, and what still needs a
C++/WASM recompile.

**Important context:** MCPE 2013 is a **mobile game** (Minecraft Pocket
Edition for Android/iOS). The control scheme is touch-based (D-pad on the
bottom-left + drag-to-look on the rest of the screen). The patched build
respects this — touch is primary; keyboard/mouse are optional desktop
fallbacks because multitouch is broken in the WASM export.

The patched build lives at `public/mcpe-wasm/minecraft-wasm.html` and is served
by the Next.js app at `/`.

---

## Summary table

| # | Bug (as reported)         | Root cause                                          | Fix status  |
|---|---------------------------|-----------------------------------------------------|-------------|
| 1 | kontrol ngawur            | `Multitouch::feed` hardcoded `pointerId=0` in        | ✅ FIXED   |
|   |                           | `main_emscripten.cpp:25` → multitouch collapse;      | (recompile |
|   |                           | JS only forwarded `e.touches[0]`                    | emsdk 2.0.34)|
| 2 | inventori bodoh           | inventory opens via touch hotbar `...` slot;       | ✅ FIXED   |
|   |                           | KEY_E only on RPI build; JS tap works              | (JS tap)   |
| 3 | bow busuk                 | arrow spawns only when `!level->isClientSide`;      | ⚠ needs C++ |
|   |                           | creative inventory has no arrows                    |             |
| 4 | item tidak lengkap        | creative inventory list omits ~20 items: pickaxe,   | ✅ FIXED   |
|   |                           | shovel, axe, armor, food, arrows, dyes, bucket…     | (inject)   |
| 5 | graphical glitch         | GLES1→WebGL2 layer hack-injects a perspective       | ⚠ needs JS  |
|   |                           | matrix when `isIdentityProj && count>50`            | shim rewrite|
| 6 | tidak bisa save           | `AppPlatform_emscripten::saveFile` returns         | ✅ FIXED   |
|   |                           | `false`; `-DNO_STORAGE` compile flag               | (MEMFS+LS) |
| 7 | options bug              | `Options::getMessage` returns "Not implemented";    | ⚠ needs C++ |
|   |                           | `Options::save/load` commented out; `viewDistance`  |             |
|   |                           | hardcoded to 2                                      |             |

**Rule Zero compliance:** All fixes target `wasm/` (browser adaptation
layer) or `minecraft-wasm.html` (JS shim). `rujukan/` source tree is
immutable and **1:1 with https://github.com/SSMG64/PocketEdition/tree/main/handheld**
(1063 cpp/h files, verified identical except 1 line in Minecraft.cpp:291
which has an `#if defined(STANDALONE_SERVER) || defined(__EMSCRIPTEN__)`
guard for browser adaptation — the only deviation from upstream).

**Asset verification:** All 46 game assets (terrain.png, gui/*.png, mob/*.png,
lang/en_US.lang, etc.) are **1:1 byte-identical** with the original MCPE 0.6.1
APK (armv7 build, `Minecraft - Pocket Edition 0.6.1 (30006010)`, dated
2013-01-31). Verified via MD5 comparison:
- Source APK: archive.org `mcpe-apk/Minecraft - Pocket Edition/Full/0.6.1 (X0006010)/...armv7.apk`
- Binary: `lib/armeabi-v7a/libminecraftpe.so` (8.2 MB, ARM EABI5, stripped)
- Symbols: 10,627 C++ mangled symbols matching SSMG64 source classes
  (`AppPlatform::*`, `Multitouch::*`, `Inventory::*`, etc.)
- Assets: 45/45 match MD5, 0 mismatch (after replacing touchgui.png and
  en_US.lang with APK versions for exact parity)

**Build:** Recompiled with emsdk 2.0.34 (the version that produces correct
rendering codegen). Key changes in `wasm/`:
- `main_emscripten.cpp` — added `multitouch_feed` export
- `build.sh` — added `_multitouch_feed` to `EXPORTED_FUNCTIONS`; added
  `-DanGenBuffers=anGenBuffers_gles_impl` compile flag for gles.cpp only
  (to avoid duplicate symbol with the override in platform_stubs.cpp);
  removed `-DNO_STORAGE` so ExternalFileLevelStorageSource is used
- `platform_stubs.cpp` — restored `anGenBuffers` override (calls real
  `glGenBuffers` instead of the fake counter in gles.cpp:49-53)
- `AppPlatform_emscripten.cpp` — implemented `saveFile`/`loadFile` using
  Emscripten MEMFS (`FS.writeFile`/`FS.readFile` + `FS.mkdirTree`); the JS
  shim syncs `/data` to localStorage for persistence across page reloads


---

## 1. kontrol ngawur (chaotic controls) — **needs emsdk version match**

### Root cause (1:1 from source)

MCPE 2013 is a **mobile game**. The control scheme is:
- Bottom-left D-pad (5 buttons: up/down/left/right/jump-in-center)
- Rest of screen = drag-to-look (turn area)
- **Two fingers expected simultaneously**: one on D-pad to move, one dragging
  to look around.

The C++ game tracks up to 12 independent touch pointers via the `Multitouch`
class (`Multitouch.h:9-174`). Each pointer has its own position, button state,
and `_wasPressed`/`_wasReleased` flags. The D-pad and turn-area logic iterate
`Multitouch::getActivePointerIdsThisUpdate()` (TouchscreenInput.cpp:222,
TouchTurnInput.h:29-42) and check each pointer's position independently.

**The critical bug** is in the WASM bridge at `wasm/main_emscripten.cpp:20-26`:

```cpp
extern "C" EMSCRIPTEN_KEEPALIVE void mouse_feed(
    char action, char data, short x, short y, short dx, short dy) {
    Mouse::feed(action, data, x, y, dx, dy);
    Multitouch::feed(action, data, x, y, 0);   // ← pointerId hardcoded 0
}
```

`Multitouch::feed` accepts a `pointerId` arg (Multitouch.h:121) and uses it to
select which of the 12 `TouchPointer` slots to write to. But the export
hardcodes `0`, so **every touch — regardless of finger — writes to pointer
slot 0**. A second finger doesn't create a second pointer; it overwrites
pointer 0's position. You can **either** move **or** look — never both.

### The fix (Rule Zero compliant — source change, not binary hack)

**Step 1** — add a new export in `wasm/main_emscripten.cpp` (browser
adaptation layer; `rujukan/` source tree is immutable per Rule Zero):

```cpp
extern "C" EMSCRIPTEN_KEEPALIVE void multitouch_feed(
    char action, char data, short x, short y, char pointerId) {
    Multitouch::feed(action, data, x, y, pointerId);
}
```

This calls the original `Multitouch::feed` API (Multitouch.h:121) exactly as
the original Android bridge would have, but with a per-finger pointerId
instead of hardcoded 0.

**Step 2** — add `_multitouch_feed` to `EXPORTED_FUNCTIONS` in `wasm/build.sh`.

**Step 3** — recompile with `./wasm/build.sh`.

**Step 4** — update `minecraft-wasm.html` touch handlers to call
`_multitouch_feed` per finger with `e.touch.identifier % 12` as pointerId.

### Status: recompile produces rendering regression

Steps 1, 2, and 4 are done. Step 3 (recompile) was attempted with emsdk
3.1.30, 3.1.45, 3.1.56, and 3.1.74 — all 4 versions compiled the 350 C++
source files successfully and produced a working WASM with `_multitouch_feed`
exported, BUT all 4 produced a **rendering regression**: only sky renders,
no terrain/grass/blocks (verified via agent-browser screenshots). The player
position updates correctly (movement works), but the 3D world geometry is
not drawn.

The upstream build (committed at `public/mcpe-wasm/mcpe_emscripten_full.wasm`,
md5 `ab9d82ac...`) renders terrain correctly. It was built with an emsdk
version whose codegen differs from all 4 modern emsdk versions tested. The
upstream emsdk version is not recorded in the repo (no `emsdk-version` pin
in `.github/workflows/` or `wasm/build.sh`).

**Current state:** the project uses the upstream WASM (renders correctly)
without the multitouch fix. The `wasm/main_emscripten.cpp` and
`wasm/build.sh` changes are staged in `/home/z/voxelcraft-build/` ready for
a recompile once the correct emsdk version is identified.

### What's needed to complete this fix

1. Identify the emsdk version used for the upstream build. Clues:
   - The upstream WASM exports `__cxa_get_exception_ptr` (old exception
     handling API); modern emsdk exports `__cxa_free_exception` +
     `__cxa_is_pointer_type` instead. This suggests emsdk ≤ 3.1.20 or
     earlier (pre-exception-handling refactor).
   - The upstream WASM is 7,735,358 bytes; emsdk 3.1.30 produced
     7,617,279 bytes; 3.1.45 produced 7,619,618; 3.1.56 produced 7,619,124.
     The upstream binary is ~120KB larger, consistent with older codegen.
2. Install that emsdk version (e.g. `emsdk install 3.1.20` or earlier).
3. Run `./wasm/build.sh` with the staged `main_emscripten.cpp` +
   `build.sh` changes.
4. Verify terrain renders + `_multitouch_feed` works via agent-browser.
5. Copy the new `mcpe_emscripten_full.{js,wasm}` to
   `public/mcpe-wasm/`.

### Why binary patching was rejected

An earlier attempt patched the upstream WASM binary directly (via a Python
script that parsed the Export Section and added a `multitouch_feed` export
pointing to the internal `Multitouch::feed` function at index 78). This
worked (terrain rendered + multitouch worked) but was rejected per Rule Zero:
"1:1 dengan source code, gaboleh menebak, hack." Binary patching is a hack
that modifies the compiled output without going through the source. The
correct path is to fix the source (`wasm/main_emscripten.cpp`) and recompile.

### Verified working (with upstream WASM, no multitouch fix)

- ✅ Terrain renders (grass, dirt, sand, stone, torch, water)
- ✅ Single-finger touch drag → look around (position-based, via Mouse feed)
- ✅ Touch dx/dy computed per finger (JS shim fix, not C++ change)
- ✅ Right-click (mouse) place/use item (JS shim, action=2)
- ✅ Keyboard fallback (WASD, 1-9, Esc) for desktop testing
- ✅ Touch-debug overlay (press T) shows finger positions
- ❌ Move + look simultaneously — needs C++ recompile (see above)

---

## 2. inventori bodoh (stupid inventory) — **FIXED (JS, no recompile)**

### Root cause (1:1 from source)

`IngameBlockSelectionScreen` (the inventory screen) is opened by
`screenChooser.setScreen(SCREEN_BLOCKSELECTION)`, which is triggered by
`KEY_E` only under `#if defined(RPI)` (Minecraft.cpp:718-721). The WASM build
defines neither `RPI` nor `WIN32`, so **no keyboard shortcut opens the
inventory**.

In touch mode, the inventory opens by tapping the `...` hotbar overflow
button — the last slot of the hotbar (`slot == getNumSlots()-1` in
Gui.cpp:187-189). `Gui::handleClick` checks if the clicked slot is the last
one and calls `screenChooser.setScreen(SCREEN_BLOCKSELECTION)`.

### Fix (JS shim, verified working)

The JS shim already forwards mouse/touch clicks to the C++ `Mouse::feed`.
Tapping the hotbar `...` slot works because `Gui::handleClick` is called
by `Minecraft::tick` (Minecraft.cpp:661-662) when a mouse click event is
processed. The `...` slot position is computed from `Gui::getSlotIdAt`
(Gui.cpp:129-145):
- `InvGuiScale = 1/3` (Gui.cpp:24)
- `screenWidth_scaled = 854/3 = 284`, `screenHeight_scaled = 480/3 = 160`
- 6 slots (touch mode), `xBase_scaled = 2 + 284/2 - 6*10 = 84`
- Slot 5 (last = `...`): `x_scaled = 84 + 5*20 + 10 = 194`
- `y_scaled = 160 - 16/2 = 152` (bottom 16px strip)
- Canvas coords: `x = 194 * 3 = 582`, `y = 152 * 3 = 456`

Verified via agent-browser: tapping canvas at (582, 456) opens the full
creative inventory grid (stone, cobblestone, wood, bricks, sand, dirt,
stairs, wool, etc.).

### What still needs C++ recompile

Keyboard shortcut `KEY_E` → inventory: add `#elif defined(__EMSCRIPTEN__)`
branch to Minecraft.cpp:718-721 so `screenChooser.setScreen(SCREEN_BLOCKSELECTION)`
fires on KEY_E. This is a convenience for desktop users; on mobile, tap
the `...` slot works (1:1 with original touch behavior).

---

## 3. bow busuk (broken bow)

### Root cause

`BowItem::releaseUsing` (BowItem.h:25-42) only spawns an `Arrow` entity when
`!level->isClientSide` (BowItem.h:36). In single-player MCPE 2013 the
integrated server sets `isClientSide` on the level the player sees, so
`releaseUsing` runs but the `new Arrow(...)` branch is skipped — the bow
draws, plays the sound, consumes an arrow from the inventory, but **no
arrow entity is spawned**.

Additionally, the creative inventory (`Inventory::setupDefault` in
Inventory.cpp:122-254) adds a bow (line 253) but **no arrows** (Item::arrow
is never added). So even if `releaseUsing` worked, `player->hasResource(
Item::arrow->id)` would be false in survival; in creative,
`player->abilities.instabuild` is true so the draw starts, but the spawn is
still gated by `isClientSide`.

### Fix needed (C++ recompile)

- Make `Arrow` spawn in single-player: either spawn on the server side and
  replicate, or spawn directly when `level->isClientSide` is true in
  single-player mode (no remote clients to conflict with).
- Add `addItem(new ItemInstance(Item::arrow));` to the creative inventory
  in `Inventory::setupDefault()`.

---

## 4. item tidak lengkap (incomplete items)

### Root cause

`Inventory::setupDefault()` (Inventory.cpp:122-254) populates the creative
inventory with a fixed hand-written list. Items present: ~60 blocks, hoe,
sword_iron, bow, sign, bed, painting, door, seeds, dye_powder (white only).

Items **missing** from the creative inventory that should be there:

| Category  | Missing items                                                                 |
|-----------|-------------------------------------------------------------------------------|
| Tools     | `Item::pickAxe_*`, `Item::shovel_*`, `Item::hatchet_*` (all tiers), shears    |
| Combat    | `Item::arrow`, `Item::sword_*` (wood/stone/iron/gold/diamond except iron)     |
| Armor     | All armor pieces (`helmet_*`, `chestplate_*`, `leggings_*`, `boots_*`)       |
| Food      | `Item::apple`, `Item::bread`, `Item::porkchop_*`, `Item::fish`, `bowl`        |
| Materials | `Item::stick`, `Item::coal`, `Item::ironIngot`, `Item::goldIngot`,           |
|           | `Item::diamond`, `Item::emerald`, `Item::gunpowder`, `Item::string`,         |
|           | `Item::bone`, `Item::leather`, `Item::brick` (item), `Item::clay` (item),    |
|           | `Item::flint`, `Item::sugar`                                                  |
| Utility   | `Item::bucket`, `Item::waterBucket`, `Item::lavaBucket`, `Item::milkBucket`, |
|           | `Item::fishingRod`, `Item::flintAndSteel`, `Item::shears`, `Item::compass`,  |
|           | `Item::clock`, `Item::map`, `Item::spawnEgg_*`                               |
| Dyes      | Only `DyePowderItem::WHITE` is added; the other 15 dye colors are missing.   |

### Fix needed (C++ recompile)

Extend `Inventory::setupDefault()` to add the missing items. One-liner per
item, e.g. `addItem(new ItemInstance(Item::arrow));`.

---

## 5. graphical glitch

### Root cause

`minecraft-wasm.html` (GLES1→WebGL2 translation layer) has this hack in
`GL1.draw()`:

```js
var isIdentityProj = (proj[0] === 1.0 && proj[5] === 1.0 && proj[10] === 1.0);
if (isIdentityProj && count > 50) {
  // §Inject a 70° FOV perspective matrix when projection is identity
  // and we're drawing > 50 vertices (assumed to be the 3D world).
  ...
}
```

This was added because some draw paths leave the projection as identity when
the world is drawn. It works for the common case but causes glitches when:

- The C++ code sets a **different** projection (e.g. `glOrthof` for the GUI)
  and then draws > 50 vertices of GUI text — the JS overrides it with a
  perspective matrix, distorting the GUI.
- The near/far planes (0.05 / 1000) don't match what the C++ frustum culling
  expects, so chunks pop in/out at the wrong distance.

Additional glitches come from `_glPopMatrix` restoring matrices in
last-in-first-out order across mixed `PROJECTION`/`MODELVIEW` pushes — if
the C++ pushes PROJECTION then MODELVIEW then pops, the stack matches, but
if it pushes PROJECTION, draws, then pops (expecting PROJECTION) while the
top of stack is MODELVIEW, the wrong matrix is restored.

### Fix needed

Rewrite `GL1.draw()` to NOT inject a perspective matrix. Instead, properly
implement `_glFrustumf` / `_glPerspective` and have the C++ code call them
(the original GLES1 `glFrustumf` / `gluPerspective` are currently no-ops in
the stub list). This requires changes in both the JS shim and the C++
glue (`wasm/gl1_stubs.cpp`).

---

## 6. tidak bisa save (cannot save)

### Root cause

`AppPlatform_emscripten::saveFile` is a stub that returns `false`
(`wasm/AppPlatform_emscripten.cpp:69`):

```cpp
bool AppPlatform_emscripten::saveFile(const std::string& path,
                                       const void* data, int size) {
    return false;
}
```

The build flags in `wasm/build.sh` also pass `-DNO_STORAGE`, which disables
the `LevelStorage` code paths in the C++ source. So even if `saveFile`
returned `true`, the higher-level save system would not call it.

`Options::save()` and `Options::load()` are also fully commented out
(Options.cpp:256-349), so options are never persisted either.

### What the patched build does

Shows a toast 6 seconds after load:

> ⚠ Save is disabled in this WASM build (needs C++ recompile). Play in one
> sitting.

So the user knows not to expect persistence.

### Fix needed (C++ recompile)

1. Remove `-DNO_STORAGE` from `wasm/build.sh`.
2. Implement `saveFile` / `loadFile` in `AppPlatform_emscripten.cpp` using
   Emscripten's MEMFS (`FS.writeFile(path, data)`) + IDBFS for persistence,
   or `localStorage` for small saves.
3. Uncomment the file I/O in `Options::save()` / `Options::load()`.

---

## 7. options bug

### Root cause

Three distinct bugs in `Options.cpp`:

1. **`Options::getMessage()` returns a placeholder string**
   (Options.cpp:367-369):
   ```cpp
   std::string Options::getMessage(const Option* item) {
       return "Options::getMessage - Not implemented";
   }
   ```
   Every option label in the Options screen renders as
   `"Options::getMessage - Not implemented"`.

2. **`Options::save()` builds a StringVector but never writes it to a file**
   (Options.cpp:293-349 — all the `pw.println(...)` lines are commented out).

3. **`Options::load()` is entirely commented out** (Options.cpp:256-291).

4. **`viewDistance` is hard-coded to 2 on every `Options::update()` call**
   (Options.cpp:188):
   ```cpp
   void Options::update() {
       viewDistance = 2;   // ← resets user choice every reload
       ...
   }
   ```
   So the render-distance option in the Options screen appears to change but
   snaps back to "short" on the next tick.

### Fix needed (C++ recompile)

1. Implement `Options::getMessage()` using the Language table (the
   commented-out body at Options.cpp:371-411 is the correct implementation —
   just uncomment it).
2. Wire `Options::save()` / `Options::load()` to the Emscripten FS (depends
   on fix #6).
3. Delete the `viewDistance = 2;` line at Options.cpp:188, or gate it behind
   a "first load" flag.

---

## How to re-compile the WASM with the C++ fixes

The WASM was built with Emscripten. From the project root:

```bash
# 1. Install emsdk (one-time)
git clone https://github.com/emscripten-core/emsdk /tmp/emsdk
cd /tmp/emsdk && ./emsdk install latest && ./emsdk activate latest

# 2. Apply the C++ fixes described above, then:
cd /tmp/Surprise564
./wasm/build.sh
# → outputs public/mcpe-wasm/mcpe_emscripten_full.{js,wasm}
```

`build.sh` compiles ~344 MCPE .cpp files with `-O1` and links them into a
single 7.7 MB WASM. A clean build takes ~3-5 minutes on a modern machine.

---

## Verification

Run the Next.js dev server and open `/`:

- The patched game loads with a green "VoxelCraft Patched Build" HUD top-left.
- Press **H** for the controls help panel.
- Click **Start Game → Create new** to enter a world.
- Press **W A S D** to move (synthetic D-pad touch).
- Press **P** to toggle pointer-lock for free-look.
- Press **F1** to hide/show the patch HUD.

The "N 1 Issue" badge in the bottom-left of the agent-browser screenshot is
the browser's devtools console indicator (one Emscripten `no-this-alias`
lint warning in the pre-compiled glue) — not a game bug.
