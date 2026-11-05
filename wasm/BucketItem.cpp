#include "BucketItem.h"
#include "world/entity/player/Player.h"
#include "world/level/tile/Tile.h"
bool BucketItem::useOn(ItemInstance* instance, Player* player, Level* level, int x, int y, int z, int face, float cx, float cy, float cz) {
    if (content == 0) {
        int tileId = level->getTile(x, y, z);
        if (tileId == Tile::water->id || tileId == Tile::lava->id) {
            level->setTile(x, y, z, 0);
            instance->id = (tileId == Tile::water->id) ? Item::bucket_water->id : Item::bucket_lava->id;
            return true;
        }
        return false;
    }
    int px=x, py=y, pz=z;
    if (face==0) py--; else if (face==1) py++; else if (face==2) pz--; else if (face==3) pz++; else if (face==4) px--; else if (face==5) px++;
    level->setTile(px, py, pz, content);
    instance->id = Item::bucket_empty->id;
    return true;
}
