// §Browser adaptation: inject additional creative items into player inventory.
// Rule Zero: rujukan/ source tree is immutable (1:1 with SSMG64/PocketEdition).
// The original Inventory::setupDefault (Inventory.cpp:122-254) has a fixed
// creative item list that omits arrows, tools, food, materials. This file
// adds a C++ export that JS can call after world load to inject missing items.
//
// addItem and addResource are protected in FillingContainer. We use the
// standard C++ adaptation pattern `#define private public` (or `protected`)
// to access them from outside the class hierarchy. This is a browser-only
// adaptation in wasm/ — rujukan/ headers are NOT modified on disk.
#include "NinecraftApp.h"
#include "AppPlatform_emscripten.h"
#include "world/level/tile/Tile.h"
#include "world/item/Item.h"
#include "world/item/ItemInstance.h"

// §Access protected members of FillingContainer for browser adaptation.
// This #define must come BEFORE including FillingContainer.h.
#define protected public
#include "world/inventory/FillingContainer.h"
#include "world/entity/player/Inventory.h"
#undef protected

#include "world/entity/player/Player.h"
#include "client/player/LocalPlayer.h"
#include "client/Minecraft.h"
#include <emscripten.h>

extern NinecraftApp* get_mcpe_app();

// §addCreativeItem: use addItem (now public via #define) to add an item to
// the inventory. addItem appends to inventory slots above MAX_SELECTION_SIZE
// and returns the slot index. We then link it to a free hotbar selection slot.
static int addCreativeItem(Inventory* inv, ItemInstance* item) {
    int slot = inv->addItem(item);
    printf("[CREATIVE] addItem %d -> slot %d\n", item->id, slot);
    if (slot >= 0) inv->linkEmptySlot(slot);
    return slot;
}

// §inject_creative_items: add missing items to the player's creative
// inventory. Returns 0 on success, -1 if no player.
extern "C" EMSCRIPTEN_KEEPALIVE int inject_creative_items() {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc || !mc->player || !mc->player->inventory) return -1;
    Inventory* inv = mc->player->inventory;

    // §Tools (all tiers) — missing from setupDefault
    addCreativeItem(inv, new ItemInstance(Item::pickAxe_iron));
    addCreativeItem(inv, new ItemInstance(Item::shovel_iron));
    addCreativeItem(inv, new ItemInstance(Item::hatchet_iron));
    addCreativeItem(inv, new ItemInstance(Item::pickAxe_stone));
    addCreativeItem(inv, new ItemInstance(Item::shovel_stone));
    addCreativeItem(inv, new ItemInstance(Item::hatchet_stone));
    addCreativeItem(inv, new ItemInstance(Item::pickAxe_wood));
    addCreativeItem(inv, new ItemInstance(Item::shovel_wood));
    addCreativeItem(inv, new ItemInstance(Item::hatchet_wood));
    addCreativeItem(inv, new ItemInstance(Item::pickAxe_gold));
    addCreativeItem(inv, new ItemInstance(Item::shovel_gold));
    addCreativeItem(inv, new ItemInstance(Item::hatchet_gold));
    addCreativeItem(inv, new ItemInstance(Item::pickAxe_emerald));
    addCreativeItem(inv, new ItemInstance(Item::shovel_emerald));
    addCreativeItem(inv, new ItemInstance(Item::hatchet_emerald));

    // §Weapons (all tiers)
    addCreativeItem(inv, new ItemInstance(Item::sword_wood));
    addCreativeItem(inv, new ItemInstance(Item::sword_stone));
    addCreativeItem(inv, new ItemInstance(Item::sword_gold));
    addCreativeItem(inv, new ItemInstance(Item::sword_emerald));

    // §Bow + arrows — bow is in setupDefault but arrows are missing
    addCreativeItem(inv, new ItemInstance(Item::arrow, 64));

    // §Food
    addCreativeItem(inv, new ItemInstance(Item::apple, 64));
    addCreativeItem(inv, new ItemInstance(Item::mushroomStew));
    addCreativeItem(inv, new ItemInstance(Item::bowl));

    // §Materials
    addCreativeItem(inv, new ItemInstance(Item::stick, 64));
    addCreativeItem(inv, new ItemInstance(Item::coal, 64));
    addCreativeItem(inv, new ItemInstance(Item::ironIngot, 64));
    addCreativeItem(inv, new ItemInstance(Item::goldIngot, 64));
    addCreativeItem(inv, new ItemInstance(Item::emerald, 64));
    addCreativeItem(inv, new ItemInstance(Item::string));
    addCreativeItem(inv, new ItemInstance(Item::feather));
    addCreativeItem(inv, new ItemInstance(Item::sulphur));

    // §Utility
    addCreativeItem(inv, new ItemInstance(Item::flintAndSteel));
    addCreativeItem(inv, new ItemInstance(Item::hoe_iron));
    addCreativeItem(inv, new ItemInstance(Item::hoe_stone));
    addCreativeItem(inv, new ItemInstance(Item::hoe_wood));
    addCreativeItem(inv, new ItemInstance(Item::hoe_gold));
    addCreativeItem(inv, new ItemInstance(Item::hoe_emerald));

    return 0;
}
