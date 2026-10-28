// §main_emscripten.cpp — Browser entry point for MCPE 2013 compiled with Emscripten
// Replaces main_android.cpp / main_win32.cpp / main_rpi.cpp
// Uses Emscripten's main loop API (emscripten_set_main_loop) instead of blocking loop

#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include "client/MouseHandler.h"
#include <emscripten/emscripten.h>
#include <emscripten/html5.h>

// §Global app instance — browser needs a single static instance
static NinecraftApp* g_app = nullptr;
static AppPlatform_emscripten* g_platform = nullptr;
static AppContext g_context;

// §Emscripten main loop callback — called every frame by the browser
static void emscripten_main_loop() {
    if (g_app && g_app->isInited()) {
        g_app->update();
        
        // §Check if app wants to quit
        if (g_app->wantToQuit()) {
            emscripten_cancel_main_loop();
            g_app->teardown();
            delete g_app;
            delete g_platform;
            g_app = nullptr;
            g_platform = nullptr;
        }
    }
}

// §Browser input handlers — feed events into MCPE's static Keyboard/MouseHandler
static AppPlatform_emscripten* g_input_platform = nullptr;

static EM_BOOL on_key_down(int eventType, const EmscriptenKeyboardEvent* event, void* userData) {
    // §Translate browser key codes to MCPE key codes (feed into static Keyboard)
    Keyboard::feed((unsigned char)event->keyCode, KeyboardAction::KEYDOWN);
    return EM_TRUE;
}

static EM_BOOL on_key_up(int eventType, const EmscriptenKeyboardEvent* event, void* userData) {
    Keyboard::feed((unsigned char)event->keyCode, KeyboardAction::KEYUP);
    return EM_TRUE;
}

// §Main entry point — called once on page load
int main() {
    // §Create platform layer
    g_platform = new AppPlatform_emscripten();
    g_platform->setupCanvas(854, 480);
    
    // §Create app context (NO_EGL is defined — display/context/surface fields removed)
    g_context.platform = g_platform;
    g_context.doRender = true;
    
    // §Create the game
    g_app = new NinecraftApp();
    ((App*)g_app)->init(g_context);
    
    // §Register input handlers
    emscripten_set_keydown_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_down);
    emscripten_set_keyup_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_up);
    
    // §Start the main loop at 60 FPS
    emscripten_set_main_loop(emscripten_main_loop, 0, 1);
    
    return 0;
}
