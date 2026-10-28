import { VoxelCraftEngine } from './engine';
import { BlockRegistry } from './world/level/tile/registry';
import { ChunkMeshCache } from './client/renderer/chunk-mesh-cache';
import { generateTerrainChunk } from './world/level/levelgen/terrain-generator';
import { ensureTerrainNeighborhood } from './world/level/levelgen/terrain-streaming';
import { getTool, type Tool } from './world/item/tools';

// §Entity/Mob system — ported from MCPE 2013 C++ (Entity.h, Mob.h, MobFactory.h)
import { MobFactory } from './world/entity/mob-factory';
import { MobType, EntityRendererId } from './world/entity/types';
import { Chicken } from './world/entity/animal/chicken';
import { Cow } from './world/entity/animal/cow';
import { Pig } from './world/entity/animal/pig';
import { Sheep } from './world/entity/animal/sheep';
import { Zombie } from './world/entity/monster/zombie';
import { Creeper } from './world/entity/monster/creeper';
import { Skeleton } from './world/entity/monster/skeleton';
import { Spider } from './world/entity/monster/spider';


// §Tile Entity system — ported from MCPE 2013 C++ (TileEntity.h, FurnaceTileEntity, ChestTileEntity, SignTileEntity)
import { FurnaceTileEntity } from './world/level/tile/entity/furnace-tile-entity';
import { ChestTileEntity } from './world/level/tile/entity/chest-tile-entity';
import { SignTileEntity } from './world/level/tile/entity/sign-tile-entity';
import { createTileEntity } from './world/level/tile/entity/tile-entity-factory';
import { TILE_ENTITY_FURNACE, TILE_ENTITY_CHEST, TILE_ENTITY_SIGN } from './world/level/tile/entity/tile-entity';
// §Crafting system — ported from MCPE 2013 C++ (Recipe.h, Recipes.h, FurnaceRecipes.h)
import { Recipes } from './world/item/crafting/recipes';
import { FurnaceRecipes } from './world/item/crafting/furnace-recipes';
import { DYE_BLACK, DYE_RED, DYE_GREEN, DYE_BROWN, DYE_BLUE, DYE_PURPLE,
         DYE_CYAN, DYE_SILVER, DYE_GRAY, DYE_PINK, DYE_LIME, DYE_YELLOW,
         DYE_LIGHT_BLUE, DYE_MAGENTA, DYE_ORANGE, DYE_WHITE } from './world/item/dye-colors';

declare global {
  interface Window {
    VoxelCraftEngine: typeof VoxelCraftEngine;
    VoxelCraftBlockRegistry: typeof BlockRegistry;
    VoxelCraftCreateMeshCache: (engine: VoxelCraftEngine) => ChunkMeshCache;
    VoxelCraftGenerateTerrainChunk: typeof generateTerrainChunk;
    VoxelCraftEnsureTerrainNeighborhood: typeof ensureTerrainNeighborhood;
    VoxelCraftGetTool: typeof getTool;
    // §Entity/Mob system exports
    VoxelCraftMobFactory: typeof MobFactory;
    VoxelCraftMobType: typeof MobType;
    VoxelCraftChicken: typeof Chicken;
    VoxelCraftCow: typeof Cow;
    VoxelCraftPig: typeof Pig;
    VoxelCraftSheep: typeof Sheep;
    VoxelCraftZombie: typeof Zombie;
    VoxelCraftCreeper: typeof Creeper;
    VoxelCraftSkeleton: typeof Skeleton;
    VoxelCraftSpider: typeof Spider;
    // §Tile Entity system exports
    VoxelCraftFurnaceTileEntity: typeof FurnaceTileEntity;
    VoxelCraftChestTileEntity: typeof ChestTileEntity;
    VoxelCraftSignTileEntity: typeof SignTileEntity;
    VoxelCraftCreateTileEntity: typeof createTileEntity;
    // §Crafting system exports
    VoxelCraftRecipes: typeof Recipes;
    VoxelCraftFurnaceRecipes: typeof FurnaceRecipes;
  }
}

window.VoxelCraftEngine = VoxelCraftEngine;
window.VoxelCraftBlockRegistry = BlockRegistry;
window.VoxelCraftCreateMeshCache = engine => new ChunkMeshCache(engine.world, engine.registry);
window.VoxelCraftGenerateTerrainChunk = generateTerrainChunk;
window.VoxelCraftEnsureTerrainNeighborhood = ensureTerrainNeighborhood;
window.VoxelCraftGetTool = getTool;

// §Expose entity/mob system so minecraft.html can spawn and tick mobs
window.VoxelCraftMobFactory = MobFactory;
window.VoxelCraftMobType = MobType;
window.VoxelCraftChicken = Chicken;
window.VoxelCraftCow = Cow;
window.VoxelCraftPig = Pig;
window.VoxelCraftSheep = Sheep;
window.VoxelCraftZombie = Zombie;
window.VoxelCraftCreeper = Creeper;
window.VoxelCraftSkeleton = Skeleton;
window.VoxelCraftSpider = Spider;

// §Expose tile entity system
window.VoxelCraftFurnaceTileEntity = FurnaceTileEntity;
window.VoxelCraftChestTileEntity = ChestTileEntity;
window.VoxelCraftSignTileEntity = SignTileEntity;
window.VoxelCraftCreateTileEntity = createTileEntity;

// §Expose crafting system so minecraft.html can query recipes
window.VoxelCraftRecipes = Recipes;
window.VoxelCraftFurnaceRecipes = FurnaceRecipes;



window.VoxelCraftEntity = Entity;
window.VoxelCraftMob = Mob;
window.VoxelCraftAABB_Cpp = AABB_Cpp;
window.VoxelCraftMth = { sqrt: mthSqrt, floor: mthFloor, sin: mthSin, cos: mthCos, atan: mthAtan, atan2: mthAtan2, PI, TWO_PI, DEGRAD, RADDEG };
