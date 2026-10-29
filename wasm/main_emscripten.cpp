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
    // §Feed both Mouse (for GUI clicks/hotbar) and Multitouch (for touch D-pad + look in touch mode)
    Mouse::feed(action, data, x, y, dx, dy);
    Multitouch::feed(action, data, x, y, 0);
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
