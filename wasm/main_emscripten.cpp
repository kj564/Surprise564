#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include "platform/input/Mouse.h"
#include "platform/input/Multitouch.h"
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

// §Convert CSS pixel coords to canvas pixel coords
static void getCanvasCoords(int cssX, int cssY, short* outX, short* outY) {
    EM_ASM({
        var c = document.getElementById('canvas');
        var rect = c.getBoundingClientRect();
        var scaleX = c.width / rect.width;
        var scaleY = c.height / rect.height;
        HEAP16[$0 >> 1] = (short)(($1 - rect.left) * scaleX);
        HEAP16[$1_value >> 1] = (short)(($2 - rect.top) * scaleY);
    }, outX, cssX, cssY);
}

static EM_BOOL on_mouse_move(int eventType, const EmscriptenMouseEvent* event, void* userData) {
    // §targetX/targetY are in CSS pixels relative to canvas
    // MCPE expects raw canvas pixel coords (0-854, 0-480)
    // Emscripten already gives targetX in canvas pixels
    short x = (short)event->targetX;
    short y = (short)event->targetY;
    Mouse::feed(0, 0, x, y);  // ACTION_MOVE=0
    return EM_TRUE;
}

static EM_BOOL on_mouse_down(int eventType, const EmscriptenMouseEvent* event, void* userData) {
    short x = (short)event->targetX;
    short y = (short)event->targetY;
    // §ACTION_LEFT=1, DATA_DOWN=1
    Mouse::feed(1, 1, x, y);
    printf("[MOUSE] down at %d,%d\n", x, y); fflush(stdout);
    return EM_TRUE;
}

static EM_BOOL on_mouse_up(int eventType, const EmscriptenMouseEvent* event, void* userData) {
    short x = (short)event->targetX;
    short y = (short)event->targetY;
    // §ACTION_LEFT=1, DATA_UP=0
    Mouse::feed(1, 0, x, y);
    printf("[MOUSE] up at %d,%d\n", x, y); fflush(stdout);
    return EM_TRUE;
}

static EM_BOOL on_key_down(int eventType, const EmscriptenKeyboardEvent* event, void* userData) {
    Keyboard::feed((unsigned char)event->keyCode, KeyboardAction::KEYDOWN);
    return EM_TRUE;
}
static EM_BOOL on_key_up(int eventType, const EmscriptenKeyboardEvent* event, void* userData) {
    Keyboard::feed((unsigned char)event->keyCode, KeyboardAction::KEYUP);
    return EM_TRUE;
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

    printf("[MCPE_WASM] Registering input callbacks…\n"); fflush(stdout);
    emscripten_set_mousemove_callback("#canvas", nullptr, EM_FALSE, on_mouse_move);
    emscripten_set_mousedown_callback("#canvas", nullptr, EM_FALSE, on_mouse_down);
    emscripten_set_mouseup_callback("#canvas", nullptr, EM_FALSE, on_mouse_up);
    emscripten_set_keydown_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_down);
    emscripten_set_keyup_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_up);

    printf("[MCPE_WASM] Step 4: main loop\n"); fflush(stdout);
    emscripten_set_main_loop(emscripten_main_loop, 0, 1);
    return 0;
}
