// §Browser adaptation: keyboard shortcuts that are platform-gated in the
// original source (#if defined(WIN32) / #if defined(RPI)). These shortcuts
// are not active in the emscripten build because __EMSCRIPTEN__ is not in
// the guards. We expose them via C++ exports that JS can call from its
// keyboard handler, using only public Minecraft API (Rule Zero: rujukan/
// immutable, this is wasm/ browser adaptation).
//
// Shortcuts exposed (matching Minecraft.cpp:718-800 WIN32/RPI blocks):
//   KEY_E → open inventory (SCREEN_BLOCKSELECTION, RPI:718-721)
//   KEY_F → toggle fly (WIN32:727-729)
//   KEY_T → toggle third person (WIN32:732-733)
//   KEY_L → cycle view distance (WIN32:747-748)
//   KEY_B → toggle gamemode (WIN32:755-756)
//   KEY_P → step time forward (WIN32:758-759)
#include "NinecraftApp.h"
#include "client/Minecraft.h"
#include "client/Options.h"
#include "client/gui/screens/ScreenChooser.h"
#include "client/gui/screens/IngameBlockSelectionScreen.h"
#include "client/player/LocalPlayer.h"
#include "world/level/Level.h"
#include "client/renderer/LevelRenderer.h"
#include <emscripten.h>

extern NinecraftApp* get_mcpe_app();

// §Toggle fly (KEY_F)
extern "C" EMSCRIPTEN_KEEPALIVE int toggle_fly() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc || !mc->player) return -1;
    mc->options.isFlying = !mc->options.isFlying;
    mc->player->noPhysics = mc->options.isFlying;
    return mc->options.isFlying ? 1 : 0;
}

// §Toggle third person view (KEY_T)
extern "C" EMSCRIPTEN_KEEPALIVE int toggle_third_person() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc) return -1;
    mc->options.thirdPersonView = !mc->options.thirdPersonView;
    return mc->options.thirdPersonView ? 1 : 0;
}

// §Cycle view distance (KEY_L): 0=far, 1=normal, 2=short, 3=tiny
extern "C" EMSCRIPTEN_KEEPALIVE int cycle_view_distance() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc) return -1;
    mc->options.viewDistance = (mc->options.viewDistance + 1) % 4;
    return mc->options.viewDistance;
}

// §Toggle game mode (KEY_B)
extern "C" EMSCRIPTEN_KEEPALIVE int toggle_gamemode() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc) return -1;
    mc->setIsCreativeMode(!mc->isCreativeMode());
    return mc->isCreativeMode() ? 1 : 0;
}

// §Step time forward (KEY_P)
extern "C" EMSCRIPTEN_KEEPALIVE int step_time() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc || !mc->level) return -1;
    mc->level->setTime(mc->level->getTime() + 1000);
    return (int)mc->level->getTime();
}

// §Open inventory / block selection (KEY_E)
extern "C" EMSCRIPTEN_KEEPALIVE int open_inventory() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc) return -1;
    mc->screenChooser.setScreen(SCREEN_BLOCKSELECTION);
    return 0;
}

// §Toggle ambient occlusion (KEY_O)
extern "C" EMSCRIPTEN_KEEPALIVE int toggle_ao() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc) return -1;
    mc->options.ambientOcclusion = !mc->options.ambientOcclusion;
    if (mc->levelRenderer) mc->levelRenderer->allChanged();
    return mc->options.ambientOcclusion ? 1 : 0;
}
