#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include "world/level/LevelSettings.h"
#include "client/gui/screens/ProgressScreen.h"
#include <emscripten/emscripten.h>
#include <emscripten/html5.h>
#include <emscripten/html5_webgl.h>
#include <cstdio>
#include <exception>

static NinecraftApp* g_app = nullptr;
static AppPlatform_emscripten* g_platform = nullptr;
static AppContext g_context;

static void emscripten_main_loop() {
    if (g_app && g_app->isInited()) g_app->update();
}

int main() {
    // §Create WebGL context explicitly BEFORE any GL calls
    EmscriptenWebGLContextAttributes attrs;
    emscripten_webgl_init_context_attributes(&attrs);
    attrs.alpha = 0; attrs.depth = 1; attrs.stencil = 0; attrs.antialias = 0;
    attrs.premultipliedAlpha = 0; attrs.preserveDrawingBuffer = 0;

    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE ctx = emscripten_webgl_create_context("#canvas", &attrs);
    printf("[MCPE_WASM] WebGL ctx handle: %d\n", (int)ctx); fflush(stdout);

    if (ctx > 0) {
        EM_BOOL ok = emscripten_webgl_make_context_current(ctx);
        printf("[MCPE_WASM] make_current: %d\n", (int)ok); fflush(stdout);
        // Continue regardless — GL functions may still work
    }

    // Test: call glClearColor + glClear to verify GL works
    extern void glClearColor(float, float, float, float);
    extern void glClear(unsigned int);
    glClearColor(0.53f, 0.77f, 1.0f, 1.0f);  // sky blue
    glClear(0x00004000 | 0x00000100);  // GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT
    printf("[MCPE_WASM] glClear called\n"); fflush(stdout);

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

    printf("[MCPE_WASM] Step 4: selectLevel\n"); fflush(stdout);
    try {
        LevelSettings settings(142857, GameType::Creative);
        g_app->selectLevel("W", "W", settings);
        g_app->hostMultiplayer();
        g_app->setScreen(new ProgressScreen());
    } catch (...) {}

    printf("[MCPE_WASM] Step 5: loop\n"); fflush(stdout);
    emscripten_set_main_loop(emscripten_main_loop, 0, 1);
    return 0;
}
