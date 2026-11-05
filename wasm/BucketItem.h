// §0.7.0 feature: BucketItem for water/lava bucket (not in 0.6.1 source).
// Based on 0.7.0 APK symbols: BucketItem::useOn, BucketItem::emptyBucket.
// BucketItem(int id, int content) — content: 0=empty, Tile::water->id, Tile::lava->id
#ifndef BUCKET_ITEM_H
#define BUCKET_ITEM_H

#include "world/item/Item.h"
#include "world/item/ItemInstance.h"
#include "world/level/Level.h"
#include "world/entity/player/Player.h"
#include "world/level/tile/Tile.h"

class BucketItem : public Item
{
    typedef Item super;
public:
    int content; // 0 = empty, >0 = tile id (water, lava)

    BucketItem(int id, int contentId)
    :   super(id),
        content(contentId)
    {
        maxStackSize = 1;
    }

    bool useOn(ItemInstance* instance, Player* player, Level* level, int x, int y, int z, int face, float clickX, float clickY, float clickZ) {
        // §If empty bucket: pick up water/lava at target
        if (content == 0) {
            int tileId = level->getTile(x, y, z);
            if (tileId == Tile::water->id || tileId == Tile::lava->id) {
                level->setTile(x, y, z, 0);
                // §Replace with filled bucket
                instance->id = (tileId == Tile::water->id) ? Item::bucket_water->id : Item::bucket_lava->id;
                return true;
            }
            return false;
        }
        // §If filled bucket: place liquid at target
        int placeX = x, placeY = y, placeZ = z;
        if (face == 0) placeY--;
        else if (face == 1) placeY++;
        else if (face == 2) placeZ--;
        else if (face == 3) placeZ++;
        else if (face == 4) placeX--;
        else if (face == 5) placeX++;
        
        level->setTile(placeX, placeY, placeZ, content);
        // §Replace with empty bucket
        instance->id = Item::bucket_empty->id;
        return true;
    }
};

#endif // BUCKET_ITEM_H
