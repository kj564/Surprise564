#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include <emscripten/emscripten.h>
#include <emscripten/html5.h>
#include <cstdio>
#include <exception>

static NinecraftApp* g_app = nullptr;
static AppPlatform_emscripten* g_platform = nullptr;
static AppContext g_context;

static void emscripten_main_loop() {
    if (g_app && g_app->isInited()) g_app->update();
}

int main() {
    printf("[MCPE_WASM] Creating GL context from canvas…\n"); fflush(stdout);
    
    // §Create GL context bound to canvas via Emscripten's GL module
    // This ensures GL.currentContext.canvas is set properly
    EM_ASM({
        if (typeof GL !== 'undefined' && GL.createContext) {
            var canvas = document.getElementById('canvas');
            var ctx = GL.createContext(canvas, {alpha: false, depth: true, stencil: false, antialias: false});
            GL.makeContextCurrent(ctx);
            console.log('[MCPE_WASM] GL context created from canvas, ctx=' + ctx);
            
            // §Init GLImmediate AFTER context is current
            if (typeof Browser !== 'undefined') Browser.useWebGL = true;
            if (typeof GLImmediate !== 'undefined' && GLImmediate.init) {
                GLImmediate.init();
                console.log('[MCPE_WASM] GLImmediate.init() OK');
            }
            
            // §Verify canvas binding
            var cc = GL.currentContext;
            console.log('[MCPE_WASM] GLctx.canvas = ' + (cc && cc.GLctx && cc.GLctx.canvas ? cc.GLctx.canvas.id : 'none'));
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
    } catch (std::exception& e) {
        printf("[MCPE_WASM] EXC: %s\n", e.what()); fflush(stdout);
    } catch (...) {
        printf("[MCPE_WASM] UNKNOWN EXC\n"); fflush(stdout);
    }

    printf("[MCPE_WASM] Step 4: main loop\n"); fflush(stdout);
    emscripten_set_main_loop(emscripten_main_loop, 0, 1);
    return 0;
}
