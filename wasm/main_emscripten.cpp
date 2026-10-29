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

// §Mouse input callbacks — feed events into MCPE's Mouse/Multitouch system
// ACTION_MOVE=0, ACTION_LEFT=1, ACTION_RIGHT=2
// DATA_UP=0, DATA_DOWN=1

static EM_BOOL on_mouse_move(int eventType, const EmscriptenMouseEvent* event, void* userData) {
    // §Feed mouse position to both Mouse (non-touch) and Multitouch (touch)
    // Engine uses touch mode (useTouchscreen=true), so Multitouch is primary
    short x = (short)event->targetX;
    short y = (short)event->targetY;
    
    // §Scale to MCPE GUI coordinates
    // MCPE uses Gui::InvGuiScale to convert mouse coords
    // Gui::InvGuiScale = 2.0f / Gui::guiScale (typically guiScale=2, InvGuiScale=0.5)
    // For 854x480 canvas with guiScale=2: mouse coords are halved
    // Actually, MCPE stores raw pixel coords and scales in render
    // Let's just pass raw pixel coords
    Mouse::feed(0, 0, x, y);  // ACTION_MOVE=0, DATA_UP=0
    Multitouch::feed(0, 0, x, y, 0);  // pointerId=0
    return EM_TRUE;
}

static EM_BOOL on_mouse_down(int eventType, const EmscriptenMouseEvent* event, void* userData) {
    short x = (short)event->targetX;
    short y = (short)event->targetY;
    char button = 1;  // ACTION_LEFT=1
    char data = 1;    // DATA_DOWN=1
    
    // §Feed to Mouse (for non-touch path)
    Mouse::feed(button, data, x, y);
    // §Feed to Multitouch (for touch path — engine uses this)
    Multitouch::feed(button, data, x, y, 0);  // pointerId=0
    return EM_TRUE;
}

static EM_BOOL on_mouse_up(int eventType, const EmscriptenMouseEvent* event, void* userData) {
    short x = (short)event->targetX;
    short y = (short)event->targetY;
    char button = 1;  // ACTION_LEFT=1
    char data = 0;   // DATA_UP=0
    
    Mouse::feed(button, data, x, y);
    Multitouch::feed(button, data, x, y, 0);  // pointerId=0
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

    // §Register mouse input callbacks — feed events to MCPE Mouse/Multitouch
    printf("[MCPE_WASM] Registering input callbacks…\n"); fflush(stdout);
    emscripten_set_mousemove_callback("#canvas", nullptr, EM_FALSE, on_mouse_move);
    emscripten_set_mousedown_callback("#canvas", nullptr, EM_FALSE, on_mouse_down);
    emscripten_set_mouseup_callback("#canvas", nullptr, EM_FALSE, on_mouse_up);
    emscripten_set_keydown_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_down);
    emscripten_set_keyup_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_up);
    
    // §Also handle touch events for mobile
    emscripten_set_touchstart_callback("#canvas", nullptr, EM_FALSE, [](int eventType, const EmscriptenTouchEvent* event, void* userData) -> EM_BOOL {
        if (event->numTouches > 0) {
            short x = (short)event->touches[0].targetX;
            short y = (short)event->touches[0].targetY;
            Multitouch::feed(1, 1, x, y, 0);  // ACTION_LEFT, DATA_DOWN
        }
        return EM_TRUE;
    });
    emscripten_set_touchend_callback("#canvas", nullptr, EM_FALSE, [](int eventType, const EmscriptenTouchEvent* event, void* userData) -> EM_BOOL {
        if (event->numTouches > 0) {
            short x = (short)event->touches[0].targetX;
            short y = (short)event->touches[0].targetY;
            Multitouch::feed(1, 0, x, y, 0);  // ACTION_LEFT, DATA_UP
        }
        return EM_TRUE;
    });
    emscripten_set_touchmove_callback("#canvas", nullptr, EM_FALSE, [](int eventType, const EmscriptenTouchEvent* event, void* userData) -> EM_BOOL {
        if (event->numTouches > 0) {
            short x = (short)event->touches[0].targetX;
            short y = (short)event->touches[0].targetY;
            Multitouch::feed(0, 0, x, y, 0);  // ACTION_MOVE
        }
        return EM_TRUE;
    });

    printf("[MCPE_WASM] Step 4: main loop\n"); fflush(stdout);
    emscripten_set_main_loop(emscripten_main_loop, 0, 1);
    return 0;
}
