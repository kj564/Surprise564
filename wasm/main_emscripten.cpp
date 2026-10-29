#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include <emscripten/emscripten.h>
#include <emscripten/html5.h>
#include <cstdio>
#include <exception>

extern "C" {
    void glClearColor(float, float, float, float);
    void glClear(unsigned int);
    void glViewport(int, int, int, int);
    void glEnable(unsigned int);
    void glDisable(unsigned int);
}

static NinecraftApp* g_app = nullptr;
static AppPlatform_emscripten* g_platform = nullptr;
static AppContext g_context;
static int g_frame = 0;

static void emscripten_main_loop() {
    if (!g_app || !g_app->isInited()) return;
    
    // §Force sky blue clear every frame
    glClearColor(0.53f, 0.77f, 1.0f, 1.0f);
    glClear(0x00004000 | 0x00000100); // GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT
    glViewport(0, 0, 854, 480);
    
    g_app->update();
    g_frame++;
}

int main() {
    printf("[MCPE_WASM] Creating GL context…\n"); fflush(stdout);
    EM_ASM({
        if (typeof GL !== 'undefined' && GL.createContext) {
            var canvas = document.getElementById('canvas');
            var ctx = GL.createContext(canvas, {alpha: false, depth: true, stencil: false, antialias: false});
            GL.makeContextCurrent(ctx);
            console.log('[MCPE_WASM] GL context OK, canvas=' + (GL.currentContext.GLctx.canvas ? GL.currentContext.GLctx.canvas.id : 'none'));
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
