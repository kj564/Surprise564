#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include "platform/input/Mouse.h"
#include "platform/input/Multitouch.h"
#include "world/level/tile/Tile.h"
#include "world/level/Level.h"
#include <emscripten/emscripten.h>
#include <cstdio>
#include <exception>

static NinecraftApp* g_app = nullptr;
static AppPlatform_emscripten* g_platform = nullptr;
static AppContext g_context;

static void emscripten_main_loop() {
    if (g_app && g_app->isInited()) g_app->update();
}

extern "C" EMSCRIPTEN_KEEPALIVE void mouse_feed(char action, char data, short x, short y, short dx, short dy) {
    // §Feed Mouse with dx/dy (for MouseTurnInput — GUI clicks, hotbar)
    Mouse::feed(action, data, x, y, dx, dy);
    // §Feed Multitouch for D-pad button detection (down/up events)
    // For MOVE events, also feed to Multitouch so UnifiedTurnBuild can read
    // position. The delta (dx/dy) is passed via Mouse::feed which sets
    // Mouse::_dx correctly. For Multitouch, getDX() returns _dx which
    // accumulates 0 from 5-arg feed — but UnifiedTurnBuild also checks
    // _x - _xOld as fallback when _dx == DELTA_NOTSET.
    // To ensure the fallback works, we skip feeding MOVE to Multitouch
    // (so _dx stays DELTA_NOTSET and getDX uses _x - _xOld).
    if (action == 0 && dx == 0 && dy == 0) {
        // Pure move with no delta — update position for D-pad detection
        Multitouch::feed(action, data, x, y, 0);
    } else if (action != 0) {
        // Button press/release — feed to Multitouch for D-pad
        Multitouch::feed(action, data, x, y, 0);
    }
    // For MOVE with delta (look-around), don't feed to Multitouch.
    // UnifiedTurnBuild will use Mouse::getDX/getDY which have correct delta.
}
extern "C" EMSCRIPTEN_KEEPALIVE void keyboard_feed(unsigned char key, int state) {
    Keyboard::feed(key, state);
}

// §Debug: check block at (x, y, z)
extern "C" EMSCRIPTEN_KEEPALIVE int get_block(int x, int y, int z) {
    if (!g_app || !((Minecraft*)g_app)->level) return -1;
    return ((Minecraft*)g_app)->level->getTile(x, y, z);
}

// §Debug: get brightness at (x,y,z)
extern "C" EMSCRIPTEN_KEEPALIVE int get_brightness(int x, int y, int z) {
    if (!g_app || !((Minecraft*)g_app)->level) return -1;
    float b = ((Minecraft*)g_app)->level->getBrightness(x, y, z);
    return (int)(b * 1000);
}

// §Debug: check if Tile::tiles[id] is NULL
extern "C" EMSCRIPTEN_KEEPALIVE int get_tile_ptr(int id) {
    if (id < 0 || id >= 256) return -2;
    Tile* tile = Tile::tiles[id];
    return tile ? (int)tile : 0;
}

// §Auto-create a world for testing (bypasses GUI click flow)
#include "world/level/LevelSettings.h"
#include "client/gui/screens/ProgressScreen.h"
#include "client/gui/screens/StartMenuScreen.h"
extern "C" EMSCRIPTEN_KEEPALIVE int auto_create_world() {
    if (!g_app) return -1;
    Minecraft* mc = (Minecraft*)g_app;
    if (mc->level) return 1; // already in game
    try {
        printf("[MCPE_WASM] auto_create_world: selectLevel\n"); fflush(stdout);
        mc->selectLevel("testworld", "Test World", LevelSettings(12345, GameType::Creative));
        mc->hostMultiplayer();
        mc->setScreen(new ProgressScreen());
        printf("[MCPE_WASM] auto_create_world: done\n"); fflush(stdout);
        return 0;
    } catch (std::exception& e) {
        printf("[MCPE_WASM] auto_create_world EXC: %s\n", e.what()); fflush(stdout);
        return -2;
    } catch (...) {
        printf("[MCPE_WASM] auto_create_world UNKNOWN EXC\n"); fflush(stdout);
        return -3;
    }
}

int main() {
    printf("[MCPE_WASM] Creating GL context…\n"); fflush(stdout);
    EM_ASM({
        if (typeof GL !== 'undefined' && GL.createContext) {
            var canvas = document.getElementById('canvas');
            var ctx = GL.createContext(canvas, {alpha: false, depth: true, stencil: false, antialias: false});
            GL.makeContextCurrent(ctx);
            console.log('[MCPE_WASM] GL context OK');
        }
    });
    
    printf("[MCPE_WASM] Step 1: platform\n"); fflush(stdout);
    g_platform = new AppPlatform_emscripten();
    g_platform->setupCanvas(854, 480);
    g_context.platform = g_platform;
    g_context.doRender = true;

    printf("[MCPE_WASM] Step 2: NinecraftApp\n"); fflush(stdout);
    g_app = new NinecraftApp();

    printf("[MCPE_WASM] Step 3: App::init\n"); fflush(stdout);
    try {
        ((App*)g_app)->init(g_context);
        ((Minecraft*)g_app)->setSize(854, 480);
        printf("[MCPE_WASM] setSize(854, 480) ✓\n"); fflush(stdout);
    } catch (std::exception& e) {
        printf("[MCPE_WASM] EXC: %s\n", e.what()); fflush(stdout);
    } catch (...) {
        printf("[MCPE_WASM] UNKNOWN EXC\n"); fflush(stdout);
    }

    printf("[MCPE_WASM] Step 4: main loop\n"); fflush(stdout);
    emscripten_set_main_loop(emscripten_main_loop, 0, 1);
    return 0;
}
