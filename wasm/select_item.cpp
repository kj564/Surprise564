// §Browser adaptation: select an item by ID and move it to the hotbar.
// Rule Zero: rujukan/ immutable. This uses public Inventory API:
//   - getContainerSize() / getItem(slot) to find the item
//   - moveToSelectionSlot(0, inventorySlot, true) to wire it to hotbar slot 0
//   - selectSlot(0) to make it the active held item
#include "NinecraftApp.h"
#include "world/item/Item.h"
#include "world/item/ItemInstance.h"
#include "world/inventory/FillingContainer.h"
#include "world/entity/player/Inventory.h"
#include "world/entity/player/Player.h"
#include "client/player/LocalPlayer.h"
#include "client/Minecraft.h"
#include <emscripten.h>

extern NinecraftApp* get_mcpe_app();

// §select_item_by_id: find an item with the given ID in the player's
// inventory and move it to hotbar slot 0, then select slot 0.
// Returns the inventory slot index, or -1 if not found.
extern "C" EMSCRIPTEN_KEEPALIVE int select_item_by_id(int itemId) {
    Minecraft* mc = (Minecraft*)get_mcpe_app();
    if (!mc || !mc->player || !mc->player->inventory) return -1;
    Inventory* inv = mc->player->inventory;

    int size = inv->getContainerSize();
    for (int i = Inventory::MAX_SELECTION_SIZE; i < size; i++) {
        ItemInstance* item = inv->getItem(i);
        if (item && !item->isNull() && item->id == itemId) {
            // §Move this inventory slot to hotbar selection slot 0
            inv->moveToSelectionSlot(0, i, true);
            inv->selectSlot(0);
            return i;
        }
    }
    return -1;
}
