#ifndef BUCKET_ITEM_H
#define BUCKET_ITEM_H
#include "Item.h"
#include "ItemInstance.h"
#include "Level.h"
class Player;
class Tile;
class BucketItem : public Item {
    typedef Item super;
public:
    int content;
    BucketItem(int id, int contentId) : super(id), content(contentId) { maxStackSize = 1; }
    bool useOn(ItemInstance* instance, Player* player, Level* level, int x, int y, int z, int face, float cx, float cy, float cz);
};
#endif
