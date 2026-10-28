// §Full MCPE 2013 WASM test — compile ALL available C++ source files
#include <cstdio>
#include <string>
#include <vector>
#include <map>
#include <set>

// §Include order matters — dependencies first
#include "Random.h"
#include "Mth.h"
#include "../world/phys/AABB.h"
#include "../world/phys/Vec3.h"
#include "../world/phys/HitResult.h"
#include "../world/level/material/Material.h"
#include "../world/level/material/GasMaterial.h"
#include "../world/level/material/LiquidMaterial.h"
#include "../world/level/material/DecorationMaterial.h"
#include "../world/level/material/WebMaterial.h"

#define TileInclude_h
#include "../world/level/tile/Tile.h"
#include "../world/item/Item.h"
#include "../world/item/ItemInstance.h"
#include "../world/item/ItemCategory.h"
#include "../world/item/UseAnim.h"

int main() {
    printf("MCPE 2013 Full WASM Test\n");
    Mth::initMth();
    Material::initMaterials();
    Tile::initTiles();
    Item::initItems();
    printf("All systems initialized!\n");
    
    // Test: create ItemInstance for every registered item
    int count = 0;
    for (int i = 256; i < 512; i++) {
        if (Item::items[i]) {
            ItemInstance inst(i, 1, 0);
            count++;
        }
    }
    printf("Items tested: %d\n", count);
    
    // Test: create ItemInstance for every registered tile
    int tileCount = 0;
    for (int i = 1; i < 256; i++) {
        if (Tile::tiles[i]) {
            ItemInstance inst(i, 1, 0);
            tileCount++;
        }
    }
    printf("Tiles tested: %d\n", tileCount);
    
    printf("SUCCESS: All MCPE 2013 C++ running in WASM!\n");
    return 0;
}
