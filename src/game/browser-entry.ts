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

// §Translated C++ source — non-conflicting imports only
import { Tile, initTiles, tiles } from './world/level/tile/translated/Tile';
import { Item, initItems } from './world/item/translated/Item';
import { ItemInstance } from './world/item/translated/ItemInstance';
import { Material, initMaterials } from './world/level/material/translated/Material';
import { FillingContainer } from './world/inventory/translated/FillingContainer';
import { Player } from './world/entity/translated/Player';
import { Level } from './world/level/translated/Level';
import { LevelChunk, ChunkCache } from './world/level/translated/chunk-classes';
import { Vec3 } from './world/phys/translated/Vec3';
import { HitResult } from './world/phys/translated/HitResult';
import { Random } from './util/translated/Random';
import { TicksPerSecond } from './util/translated/SharedConstants';
import { Dimension, TileEntity, GameMode, CreativeMode, SurvivalMode, Biome, BiomeSource } from './world/level/translated/world-systems';

// §Expose crafting system so minecraft.html can query recipes
window.VoxelCraftRecipes = Recipes;
window.VoxelCraftFurnaceRecipes = FurnaceRecipes;


// §Translated C++ source exports (non-conflicting only)
window.VoxelCraftInitTiles = initTiles;
window.VoxelCraftTiles = tiles;
window.VoxelCraftInitItems = initItems;
window.VoxelCraftItemInstance = ItemInstance;
window.VoxelCraftInitMaterials = initMaterials;
window.VoxelCraftFillingContainer = FillingContainer;
window.VoxelCraftPlayer = Player;
window.VoxelCraftLevel = Level;
window.VoxelCraftLevelChunk = LevelChunk;
window.VoxelCraftChunkCache = ChunkCache;
window.VoxelCraftVec3 = Vec3;
window.VoxelCraftHitResult = HitResult;
window.VoxelCraftRandom = Random;
window.VoxelCraftTicksPerSecond = TicksPerSecond;
window.VoxelCraftDimension = Dimension;
window.VoxelCraftTileEntity = TileEntity;
window.VoxelCraftGameMode = GameMode;
window.VoxelCraftCreativeMode = CreativeMode;
window.VoxelCraftSurvivalMode = SurvivalMode;
window.VoxelCraftBiome = Biome;
window.VoxelCraftBiomeSource = BiomeSource;

window.VoxelCraftInitTiles = initTiles;
window.VoxelCraftTiles = tiles;
window.VoxelCraftItem = Item;
window.VoxelCraftInitItems = initItems;
window.VoxelCraftItemInstance = ItemInstance;
window.VoxelCraftMaterial = Material;
window.VoxelCraftInitMaterials = initMaterials;
window.VoxelCraftFillingContainer = FillingContainer;
window.VoxelCraftEntity = Entity;
window.VoxelCraftMob = Mob;
window.VoxelCraftPlayer = Player;
window.VoxelCraftLevel = Level;
window.VoxelCraftLevelChunk = LevelChunk;
window.VoxelCraftChunkCache = ChunkCache;
window.VoxelCraftAABB_Cpp = AABB_Cpp;
window.VoxelCraftVec3 = Vec3;
window.VoxelCraftHitResult = HitResult;
window.VoxelCraftMth = { sqrt: mthSqrt, floor: mthFloor, sin: mthSin, cos: mthCos, atan: mthAtan, atan2: mthAtan2, PI, TWO_PI, DEGRAD, RADDEG };
window.VoxelCraftRandom = Random;
window.VoxelCraftTicksPerSecond = TicksPerSecond;
window.VoxelCraftDimension = Dimension;
window.VoxelCraftTileEntity = TileEntity;
window.VoxelCraftGameMode = GameMode;
window.VoxelCraftCreativeMode = CreativeMode;
window.VoxelCraftSurvivalMode = SurvivalMode;
window.VoxelCraftBiome = Biome;
window.VoxelCraftBiomeSource = BiomeSource;
