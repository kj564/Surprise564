# GUI System — 1:1 with rujukan MCPE 2013

## Overview

MCPE 2013 GUI uses a screen-based system: `Screen` base class with lifecycle
methods (`init`, `setupPositions`, `render`, `buttonClicked`), component-based
UI (`Button`, `ImageButton`, `Slider`, etc.), and a central `Gui` class for
the in-game HUD (hotbar, hearts, crosshair, vignette).

All sprites come from two atlases in `gui/`:
- **gui.png** (256×256): hotbar, buttons, panels, slot backgrounds
- **icons.png** (256×256): hearts, bubbles, crosshair, hunger bar

## Constants (rujukan source citations)

### Button (Button.cpp + Button.h)

| Property | Value | Citation |
|----------|-------|----------|
| Default width | 200px | §Button.h:8 — `GuiElement(true, true, 0, 0, 200, 24)` |
| Default height | 24px | §Button.h:8 |
| StartMenu "Start Game" width | 160px | §StartMenuScreen.cpp:27 — `bHost(2, 0, 0, 160, 24, "Start Game")` |
| StartMenu "Options" width | 78px | §StartMenuScreen.cpp:29 — `bOptions(4, 0, 0, 78, 22, "Options")` |
| Button sprite y (disabled) | 46 | §Button.cpp:83 — `blit(x, y, 0, 46 + 0*20, ...)` (yImage=0) |
| Button sprite y (normal) | 66 | §Button.cpp:83 — `46 + 1*20 = 66` (yImage=1) |
| Button sprite y (hover) | 86 | §Button.cpp:83 — `46 + 2*20 = 86` (yImage=2) |
| Text color (disabled) | #a0a0a0 | §Button.cpp:75 — `0xffa0a0a0` (ARGB) |
| Text color (normal) | #e0e0e0 | §Button.cpp:80 — `0xe0e0e0` (RGB, alpha defaults to 0xff) |
| Text color (hover) | #ffffa0 | §Button.cpp:78 — `0xffffa0` (RGB, alpha defaults to 0xff) |
| Text y offset | (height - 8) / 2 | §Button.cpp:75,78,80 — `y + (height - 8) / 2` |
| getYImage(disabled) | 0 | §Button.cpp:67 — `if (!active) res = 0` |
| getYImage(normal) | 1 | §Button.cpp:65 — `int res = 1` (default) |
| getYImage(hover) | 2 | §Button.cpp:68 — `else if (hovered) res = 2` |

### Hotbar (Gui.cpp:709-765)

| Property | Value | Citation |
|----------|-------|----------|
| Bar sprite | gui.png (0,0) 180×22 | §Gui.cpp:714 — `blit(xBase, yBase, 0, 0, slotsWidth, 22)` |
| Right end cap | gui.png (180,0) 2×22 | §Gui.cpp:715 — `blit(xBase + slotsWidth, yBase, 180, 0, 2, 22)` |
| Selected highlight | gui.png (0,22) 24×22 | §Gui.cpp:744 — `blit(xBase-1 + 20*selected, yBase-1, 0, 22, 24, 22)` |
| Slot width | 20px | §Gui.cpp:757 — `x += 20` |
| Num slots | 9 | §Gui.h — `getNumSlots()` returns 9 for demo |
| Bar alpha | 0.5 | §Gui.cpp:710 — `glColor4f2(1, 1, 1, .5)` |

### Hearts (Gui.cpp:567-601)

| Property | Value | Citation |
|----------|-------|----------|
| Heart count | 10 | §Gui.cpp:577 — `Player::MAX_HEALTH / 2` (MAX_HEALTH=20) |
| Heart sprite size | 9×9 | §Gui.cpp:589 — `blit(xo, yo, ..., 9, 9)` |
| Heart x spacing | 8px | §Gui.cpp:588 — `xo = xx + i * 8` |
| Heart x base | 2 | §Gui.cpp:574 — `int xx = 2` |
| Heart y base | 2 | §Gui.cpp:578 — `int yo = 2` |
| Background (empty) | icons.png (16,0) | §Gui.cpp:589 — `blit(xo, yo, 16 + bg*9, 9*0, 9, 9)` (bg=0 normal, bg=1 blink) |
| Full heart | icons.png (16+4*9, 0) = (52,0) | §Gui.cpp:595 — `blit(xo, yo, 16 + 4*9, 9*0, 9, 9)` |
| Half heart | icons.png (16+5*9, 0) = (61,0) | §Gui.cpp:596 — `blit(xo, yo, 16 + 5*9, 9*0, 9, 9)` |
| Blink full | icons.png (16+6*9, 0) = (70,0) | §Gui.cpp:593 — `if (ip2 < oh) blit(xo, yo, 16 + 6*9, ...)` |
| Blink half | icons.png (16+7*9, 0) = (79,0) | §Gui.cpp:594 — `else if (ip2 == oh) blit(xo, yo, 16 + 7*9, ...)` |
| Blink condition | (invulnerableTime / 3) % 2 == 1 && invulnerableTime >= 10 | §Gui.cpp:568-569 |
| Low health jitter | h <= 4 → random y offset | §Gui.cpp:586-588 — `if (h <= 4) yo = yo + random.nextInt(2) - 1` |

### Crosshair (Gui.cpp:505-511)

| Property | Value | Citation |
|----------|-------|----------|
| Sprite | icons.png (0,0) 16×16 | §Gui.cpp:509 — `blit(screenWidth/2 - 8, screenHeight/2 - 8, 0, 0, 16, 16)` |
| Blend mode | GL_ONE_MINUS_DST_COLOR, GL_ONE_MINUS_SRC_COLOR | §Gui.cpp:507 — `glBlendFunc2(GL_ONE_MINUS_DST_COLOR, GL_ONE_MINUS_SRC_COLOR)` |
| Effect | Inverts framebuffer under crosshair (visible on any background) | §Gui.cpp:506-510 |
| Browser equivalent | CSS `mix-blend-mode: difference` | Replicates the GL blend by inverting the destination |

### Vignette (Gui.cpp:268-295)

| Property | Value | Citation |
|----------|-------|----------|
| Texture | misc/vignette.png | §Gui.cpp:278 — `loadAndBindTexture("misc/vignette.png")` |
| Darkness | 1 - brightness, clamped [0,1] | §Gui.cpp:269-271 |
| Smooth | `tbr += (br - tbr) * 0.01f` | §Gui.cpp:272 |
| Browser equivalent | CSS radial-gradient with opacity | minecraft.html uses `#vignette` div |

### StartMenuScreen (StartMenuScreen.cpp)

| Property | Value | Citation |
|----------|-------|----------|
| bHost | id=2, 160×24, "Start Game" | §StartMenuScreen.cpp:27 |
| bJoin | id=3, 160×24, "Join Game" | §StartMenuScreen.cpp:28 |
| bOptions | id=4, 78×22, "Options" | §StartMenuScreen.cpp:29 |
| yBase | height/2 + 25 | §StartMenuScreen.cpp:75 — `int yBase = height / 2 + 25` |
| bHost.y | yBase - 28 | §StartMenuScreen.cpp:80 — `bHost.y = yBase - 28` |
| bJoin.y | yBase | §StartMenuScreen.cpp:83 — `bJoin.y = yBase` |
| bOptions.y | yBase + 30 | §StartMenuScreen.cpp:83 — `bOptions.y = yBase + 28 + 2` |
| Centered | (width - button.width) / 2 | §StartMenuScreen.cpp:87-89 |

### PauseScreen (PauseScreen.cpp)

| Property | Value | Citation |
|----------|-------|----------|
| Title | "Game menu" at y=24 | §PauseScreen.cpp:144 — `drawCenteredString(font, "Game menu", width / 2, 24, 0xffffff)` |
| Title color | 0xffffff (white) | §PauseScreen.cpp:144 |
| bContinue | 160 wide, y = 16 + 32*1 = 48 | §PauseScreen.cpp:102,106 — `"Back to game"` |
| bQuit | 160 wide, y = 16 + 32*2 = 80 | §PauseScreen.cpp:103,109 — `"Quit to title"` |
| bQuitAndSaveLocally | 160 wide, y = 16 + 32*3 = 112 | §PauseScreen.cpp:103,116 — `"Quit and copy map"` |
| Button spacing | 32px vertical | §PauseScreen.cpp:106,109,116 — `yBase + 32 * N` |

### Screen lifecycle (Screen.cpp)

| Method | Purpose | Citation |
|--------|---------|----------|
| `init()` | Called when screen is set; creates buttons | §Screen.cpp |
| `setupPositions()` | Called on resize; positions buttons | §Screen.cpp |
| `render(xm, ym, a)` | Draws screen + buttons | §Screen.cpp |
| `buttonClicked(Button*)` | Handles button press | §Screen.cpp |
| `mouseClicked(x, y, button)` | Delegates to buttons | §Screen.cpp |
| `mouseReleased(x, y, button)` | Delegates to buttons | §Screen.cpp |
| `keyPressed(key)` | ESC → setScreen(NULL) | §Screen.cpp |

## Browser port mapping

| Rujukan | minecraft.html | Notes |
|---------|----------------|-------|
| Gui::renderToolBar | `#hotbar` CSS div | gui.png (0,0) 180×22 sprite ✓ |
| Gui::renderHearts | `#hearts` CSS divs | icons.png sprites, hidden in creative mode ✓ |
| Crosshair (icons.png 0,0) | `#crosshair` CSS div | mix-blend-mode: difference ✓ |
| Vignette (misc/vignette.png) | `#vignette` CSS radial-gradient | Approximation (rujukan uses texture) |
| Button (gui.png y=46/66/86) | CSS button elements | Fixed to match rujukan in Task 20 ✓ |
| StartMenuScreen | `#overlay` div | Custom layout (browser adaptation) |
| PauseScreen | `#pauseOverlay` div | "Game Menu" title ✓, custom buttons |
| Toast messages | `#toast` CSS div | Not in rujukan (browser addition) |

## Acceptance tests

| Test | Expected | Status |
|------|----------|--------|
| Crosshair uses icons.png (0,0) 16×16 | CSS background-position: 0 0, 16×16 size | ✅ verified |
| Crosshair blend mode | mix-blend-mode: difference | ✅ verified |
| Hotbar uses gui.png (0,0) 180×22 | CSS background-position: 0 0, 180×22 | ✅ verified |
| Button normal text color | #e0e0e0 | ✅ verified (Task 20) |
| Button hover text color | #ffffa0 | ✅ verified (Task 20) |
| Button disabled text color | #a0a0a0 | ✅ verified (Task 20) |
| Button normal background | gui.png y=66 | ✅ verified (Task 20) |
| Button hover background | gui.png y=86 | ✅ verified (Task 20) |
| Button disabled background | gui.png y=46 | ✅ verified (Task 20) |
| Heart count (survival) | 10 hearts | ⚠ hidden in creative (default mode) |
| Pause title | "Game Menu" | ✅ verified |
