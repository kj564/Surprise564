// §Browser adaptation: fix bow arrow spawn + debug exports.
// Rule Zero: rujukan/ immutable. BowItem::releaseUsing gates arrow spawn
// with !level->isClientSide (BowItem.h:36). In single-player emscripten,
// isClientSide may be true, preventing arrow spawn. We force-spawn arrow.
#define protected public
#include "NinecraftApp.h"
#include "client/Minecraft.h"
#include "client/player/LocalPlayer.h"
#include "world/level/Level.h"
#include "world/entity/player/Player.h"
#include "world/entity/player/Inventory.h"
#include "world/item/Item.h"
#include "world/item/ItemInstance.h"
#include "world/item/BowItem.h"
#include "world/entity/projectile/Arrow.h"
#undef protected
#include <emscripten.h>

extern NinecraftApp* get_mcpe_app();

// §is_level_client_side: debug export — returns level->isClientSide (1/0)
extern "C" EMSCRIPTEN_KEEPALIVE int is_level_client_side() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc || !mc->level) return -1;
    return mc->level->isClientSide ? 1 : 0;
}

// §force_release_bow: if player is using a bow, force-spawn an arrow.
// Bypasses the !level->isClientSide gate in BowItem::releaseUsing.
extern "C" EMSCRIPTEN_KEEPALIVE int force_release_bow() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc || !mc->player || !mc->level) return -1;
    Player* player = mc->player;
    if (!player->isUsingItem()) return -2;

    ItemInstance* carried = player->getCarriedItem();
    if (!carried || carried->isNull() || carried->id != Item::bow->id) return -3;

    // §Access protected useItemDuration via #define protected public
    int useDuration = 20 * 60 * 60;  // BowItem::getUseDuration
    int durationLeft = player->useItemDuration;
    int timeHeld = useDuration - durationLeft;
    float pow = timeHeld / (float)(20 * 1);  // MAX_DRAW_DURATION = 20
    pow = ((pow * pow) + pow * 2) / 3;
    if (pow < 0.1) return -4;
    if (pow > 1) pow = 1;

    // §Spawn arrow directly, bypassing isClientSide check
    Arrow* arrow = new Arrow(mc->level, player, pow * 2.0f);
    if (pow == 1) arrow->critArrow = true;
    mc->level->addEntity(arrow);

    // §Stop using item
    player->stopUsingItem();
    return (int)(pow * 100);
}
