// §Test: compile core MCPE 2013 C++ source files with Emscripten
#include <cstdio>
#include <string>
#include <vector>
#include <map>
#include <set>

// §Forward declarations
class Level;
class LevelSource;
class Entity;
class Mob;
class Player;
class CompoundTag;

// §Include actual MCPE 2013 headers in correct dependency order
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

// §Tile needs the above
#define TileInclude_h
#include "../world/level/tile/Tile.h"
#include "../world/level/tile/LeafTile.h"
#include "../world/level/tile/TransparentTile.h"
#include "../world/level/tile/HalfTransparentTile.h"
#include "../world/item/ShearsItem.h"

// §Item
#include "../world/item/Item.h"
#include "../world/item/ItemInstance.h"
#include "../world/item/ItemCategory.h"
#include "../world/item/UseAnim.h"

int main() {
    printf("=== MCPE 2013 Core C++ in WASM ===\n\n");
    
    // §Material
    Material::initMaterials();
    printf("[Material] air isLiquid=%d\n", Material::air->isLiquid());
    printf("[Material] stone isSolid=%d\n", Material::stone->isSolid());
    printf("[Material] water isLiquid=%d\n", Material::water->isLiquid());
    printf("[Material] water blocksLight=%d\n", Material::water->blocksLight());
    printf("[Material] glass isAlwaysDestroyable=%d\n", Material::glass->isAlwaysDestroyable());
    printf("[Material] stone isAlwaysDestroyable=%d\n", Material::stone->isAlwaysDestroyable());
    printf("[Material] wood isFlammable=%d\n", Material::wood->isFlammable());
    printf("[Material] lava isLiquid=%d\n", Material::lava->isLiquid());
    
    // §Tile
    Tile::initTiles();
    printf("\n[Tile] rock: id=%d tex=%d destroySpeed=%.1f\n", Tile::rock->id, Tile::rock->tex, Tile::rock->destroySpeed);
    printf("[Tile] grass: id=%d tex=%d\n", Tile::grass->id, Tile::grass->tex);
    printf("[Tile] dirt: id=%d tex=%d\n", Tile::dirt->id, Tile::dirt->tex);
    printf("[Tile] water: id=%d\n", Tile::water->id);
    printf("[Tile] lava: id=%d\n", Tile::lava->id);
    printf("[Tile] torch: id=%d tex=%d\n", Tile::torch->id, Tile::torch->tex);
    printf("[Tile] obsidian: id=%d tex=%d destroySpeed=%.1f\n", Tile::obsidian->id, Tile::obsidian->tex, Tile::obsidian->destroySpeed);
    printf("[Tile] bedrock: id=%d destroySpeed=%.1f\n", Tile::unbreakable->id, Tile::unbreakable->destroySpeed);
    printf("[Tile] furnace: id=%d tex=%d\n", Tile::furnace->id, Tile::furnace->tex);
    printf("[Tile] chest: id=%d tex=%d\n", Tile::chest->id, Tile::chest->tex);
    printf("[Tile] workbench: id=%d tex=%d\n", Tile::workBench->id, Tile::workBench->tex);
    printf("[Tile] treeTrunk: id=%d tex=%d\n", Tile::treeTrunk->id, Tile::treeTrunk->tex);
    printf("[Tile] leaves: id=%d\n", Tile::leaves->id);
    printf("[Tile] sand: id=%d tex=%d\n", Tile::sand->id, Tile::sand->tex);
    printf("[Tile] gravel: id=%d tex=%d\n", Tile::gravel->id, Tile::gravel->tex);
    printf("[Tile] goldOre: id=%d tex=%d\n", Tile::goldOre->id, Tile::goldOre->tex);
    printf("[Tile] ironOre: id=%d tex=%d\n", Tile::ironOre->id, Tile::ironOre->tex);
    printf("[Tile] coalOre: id=%d tex=%d\n", Tile::coalOre->id, Tile::coalOre->tex);
    printf("[Tile] diamondOre(emeraldOre): id=%d tex=%d\n", Tile::emeraldOre->id, Tile::emeraldOre->tex);
    printf("[Tile] goldBlock: id=%d tex=%d\n", Tile::goldBlock->id, Tile::goldBlock->tex);
    printf("[Tile] ironBlock: id=%d tex=%d\n", Tile::ironBlock->id, Tile::ironBlock->tex);
    printf("[Tile] diamondBlock(emeraldBlock): id=%d tex=%d\n", Tile::emeraldBlock->id, Tile::emeraldBlock->tex);
    printf("[Tile] glass: id=%d tex=%d\n", Tile::glass->id, Tile::glass->tex);
    printf("[Tile] netherrack: id=%d tex=%d\n", Tile::netherrack->id, Tile::netherrack->tex);
    printf("[Tile] lightGem(glowstone): id=%d tex=%d\n", Tile::lightGem->id, Tile::lightGem->tex);
    printf("[Tile] stonecutter: id=%d tex=%d\n", Tile::stonecutterBench->id, Tile::stonecutterBench->tex);
    printf("[Tile] netherReactor: id=%d tex=%d\n", Tile::netherReactor->id, Tile::netherReactor->tex);
    
    // §Item
    Item::initItems();
    printf("\n[Item] stick: id=%d icon=%d\n", Item::stick->id, Item::stick->icon);
    printf("[Item] pickAxe_iron: id=%d icon=%d\n", Item::pickAxe_iron->id, Item::pickAxe_iron->icon);
    printf("[Item] pickAxe_wood: id=%d icon=%d\n", Item::pickAxe_wood->id, Item::pickAxe_wood->icon);
    printf("[Item] pickAxe_emerald(diamond): id=%d icon=%d\n", Item::pickAxe_emerald->id, Item::pickAxe_emerald->icon);
    printf("[Item] sword_iron: id=%d icon=%d\n", Item::sword_iron->id, Item::sword_iron->icon);
    printf("[Item] bow: id=%d icon=%d\n", Item::bow->id, Item::bow->icon);
    printf("[Item] arrow: id=%d icon=%d\n", Item::arrow->id, Item::arrow->icon);
    printf("[Item] coal: id=%d icon=%d\n", Item::coal->id, Item::coal->icon);
    printf("[Item] apple: id=%d icon=%d\n", Item::apple->id, Item::apple->icon);
    printf("[Item] ironIngot: id=%d icon=%d\n", Item::ironIngot->id, Item::ironIngot->icon);
    printf("[Item] goldIngot: id=%d icon=%d\n", Item::goldIngot->id, Item::goldIngot->icon);
    printf("[Item] shears: id=%d\n", Item::shears->id);
    printf("[Item] door_iron: id=%d icon=%d\n", Item::door_iron->id, Item::door_iron->icon);
    printf("[Item] bed: id=%d icon=%d\n", Item::bed->id, Item::bed->icon);
    printf("[Item] camera: id=%d icon=%d\n", Item::camera->id, Item::camera->icon);
    
    // §ItemInstance
    ItemInstance stickStack(Item::stick, 64, 0);
    printf("\n[ItemInstance] stick stack: id=%d count=%d isNull=%d\n", stickStack.id, stickStack.count, stickStack.isNull());
    printf("[ItemInstance] getMaxStackSize=%d\n", stickStack.getMaxStackSize());
    printf("[ItemInstance] isDamageable=%d\n", stickStack.isDamageableItem());
    
    ItemInstance pickaxe(Item::pickAxe_wood, 1, 0);
    printf("\n[ItemInstance] pickAxe_wood: id=%d count=%d\n", pickaxe.id, pickaxe.count);
    printf("[ItemInstance] isDamageable=%d\n", pickaxe.isDamageableItem());
    printf("[ItemInstance] getMaxDamage=%d\n", pickaxe.getMaxDamage());
    
    // §Mth
    printf("\n[Mth] PI=%f\n", Mth::PI);
    printf("[Mth] sin(PI/2)=%f\n", Mth::sin(Mth::PI / 2.0f));
    printf("[Mth] cos(PI)=%f\n", Mth::cos(Mth::PI));
    printf("[Mth] sqrt(16)=%f\n", Mth::sqrt(16.0f));
    printf("[Mth] floor(3.7)=%d\n", Mth::floor(3.7f));
    printf("[Mth] clamp(5,1,3)=%d\n", Mth::clamp(5, 1, 3));
    printf("[Mth] lerp(0,10,0.5)=%f\n", Mth::lerp(0.0f, 10.0f, 0.5f));
    printf("[Mth] abs(-5)=%f\n", Mth::abs(-5.0f));
    printf("[Mth] Min(3,7)=%f\n", Mth::Min(3.0f, 7.0f));
    printf("[Mth] Max(3,7)=%f\n", Mth::Max(3.0f, 7.0f));
    
    // §Random
    Random r(12345);
    printf("\n[Random] seed=12345:\n");
    for (int i = 0; i < 5; i++) {
        printf("  nextInt(100)=%d nextFloat()=%f nextBoolean()=%d\n", r.nextInt(100), r.nextFloat(), r.nextBoolean());
    }
    
    printf("\n=== All MCPE 2013 core C++ running in WASM! ===\n");
    return 0;
}
