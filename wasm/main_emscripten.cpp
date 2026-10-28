#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "platform/input/Keyboard.h"
#include "client/MouseHandler.h"
#include "world/level/LevelSettings.h"
#include "client/gui/screens/ProgressScreen.h"
#include <emscripten/emscripten.h>
#include <emscripten/html5.h>
#include <cstdio>

static NinecraftApp* g_app = nullptr;
static AppPlatform_emscripten* g_platform = nullptr;
static AppContext g_context;

static void emscripten_main_loop() {
    if (g_app && g_app->isInited()) {
        g_app->update();
    }
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
    printf("[MCPE_WASM] Step 1: Creating platform layer\n"); fflush(stdout);
    g_platform = new AppPlatform_emscripten();
    g_platform->setupCanvas(854, 480);

    g_context.platform = g_platform;
    g_context.doRender = true;

    printf("[MCPE_WASM] Step 2: Creating NinecraftApp\n"); fflush(stdout);
    g_app = new NinecraftApp();

    printf("[MCPE_WASM] Step 3: Calling App::init\n"); fflush(stdout);
    ((App*)g_app)->init(g_context);

    printf("[MCPE_WASM] Step 4: Auto-starting Creative level\n"); fflush(stdout);
    LevelSettings settings((long)142857, GameType::Creative);
    std::string levelId = "WasmWorld";
    std::string levelName = "WasmWorld";
    g_app->selectLevel(levelId, levelName, settings);
    g_app->hostMultiplayer();
    g_app->setScreen(new ProgressScreen());

    printf("[MCPE_WASM] Step 5: Starting main loop\n"); fflush(stdout);
    emscripten_set_keydown_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_down);
    emscripten_set_keyup_callback(EMSCRIPTEN_EVENT_TARGET_DOCUMENT, nullptr, EM_FALSE, on_key_up);
    emscripten_set_main_loop(emscripten_main_loop, 0, 1);

    return 0;
}
