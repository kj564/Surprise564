#ifndef MISSING_ITEMS_H
#define MISSING_ITEMS_H
#include "Item.h"
#include "ItemInstance.h"
namespace Minecart { enum Type { RIDEABLE=0, CHEST=1, FURNACE=2 }; }
class MinecartItem : public Item { typedef Item super;
public: MinecartItem(int id, int t) : super(id), type(t) { maxStackSize = 1; }
    bool useOn(ItemInstance* i, Player* p, Level* l, int x, int y, int z, int f, float cx, float cy, float cz) { return false; }
private: int type; };
class SaddleItem : public Item { typedef Item super;
public: SaddleItem(int id) : super(id) { maxStackSize = 1; } };
class RedStoneItem : public Item { typedef Item super;
public: RedStoneItem(int id) : super(id) {} };
class BoatItem : public Item { typedef Item super;
public: BoatItem(int id) : super(id) { maxStackSize = 1; } };
class FishingRodItem : public Item { typedef Item super;
public: FishingRodItem(int id) : super(id) { maxStackSize = 1; setMaxDamage(64); } };
class RecordingItem : public Item { typedef Item super;
public: RecordingItem(int id, const char* n) : super(id), name(n) { maxStackSize = 1; }
private: const char* name; };
#endif
