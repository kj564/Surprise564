#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include <emscripten/emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/html5_webgl.h>
#include <cstdio>
#include <exception>

// GL constants
#define GL_COLOR_BUFFER_BIT 0x00004000
#define GL_DEPTH_BUFFER_BIT 0x00000100

static NinecraftApp* g_app = nullptr;
static AppPlatform_emscripten* g_platform = nullptr;
static AppContext g_context;

// External GL functions (provided by FULL_ES2)
extern "C" {
    void glClearColor(float, float, float, float);
    void glClear(unsigned int);
    void glViewport(int, int, int, int);
}

static int g_frameCount = 0;

static void emscripten_main_loop() {
    if (!g_app || !g_app->isInited()) return;
    
    // §Force clear canvas to sky blue every frame (so we see GL is working)
    if (g_frameCount == 0) {
        printf("[MCPE_WASM] First frame — glClearColor + glClear\n"); fflush(stdout);
    }
    glClearColor(0.53f, 0.77f, 1.0f, 1.0f);  // sky blue
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    
    g_app->update();
    g_frameCount++;
}

int main() {
    // §Create WebGL context explicitly
    EmscriptenWebGLContextAttributes attrs;
    emscripten_webgl_init_context_attributes(&attrs);
    attrs.alpha = 0; attrs.depth = 1; attrs.stencil = 0; attrs.antialias = 0;
    attrs.premultipliedAlpha = 0; attrs.preserveDrawingBuffer = 0;

    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE ctx = emscripten_webgl_create_context("#canvas", &attrs);
    printf("[MCPE_WASM] WebGL ctx handle: %d\n", (int)ctx); fflush(stdout);

    if (ctx > 0) {
        EM_BOOL ok = emscripten_webgl_make_context_current(ctx);
        printf("[MCPE_WASM] make_current: %d\n", (int)ok); fflush(stdout);
    }

    printf("[MCPE_WASM] Step 1: platform\n"); fflush(stdout);
    g_platform = new AppPlatform_emscripten();
    g_platform->setupCanvas(854, 480);
    g_context.platform = g_platform;
    g_context.doRender = true;

    printf("[MCPE_WASM] Step 2: NinecraftApp\n"); fflush(stdout);
    g_app = new NinecraftApp();

    printf("[MCPE_WASM] Step 3: App::init (sets SCREEN_STARTMENU)\n"); fflush(stdout);
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
