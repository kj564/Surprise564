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

// §Translated C++ source — exported for minecraft.html to use
// These are direct 1:1 translations from the C++ MCPE 2013 source code
import { Tile, initTiles, tiles } from './world/level/tile/translated/Tile';
import { Item, initItems, teardownItems, MAX_STACK_SIZE, MAX_ITEMS } from './world/item/translated/Item';
import { ItemInstance } from './world/item/translated/ItemInstance';
import { Material, initMaterials, GasMaterial, LiquidMaterial } from './world/level/material/translated/Material';
import { FillingContainer } from './world/inventory/translated/FillingContainer';
import { Entity, TOTAL_AIR_SUPPLY } from './world/entity/translated/Entity';
import { Mob, ATTACK_DURATION, SWING_DURATION } from './world/entity/translated/Mob';
import { Player, BedSleepingResult } from './world/entity/translated/Player';
import { Level, DEPTH, SEA_LEVEL, MAX_BRIGHTNESS, TICKS_PER_DAY } from './world/level/translated/Level';
import { ChunkPos, LevelChunk, ChunkCache, ChunkSource, LevelSource } from './world/level/translated/chunk-classes';
import { Dimension, DimensionFactory, TileEntityType, TileEntity, TileEntityFactory, GameMode, CreativeMode, SurvivalMode, Biome, BiomeSource, RandomLevelSource, LevelSettings, GameType, LEVEL_HEIGHT, CHUNK_BLOCK_COUNT } from './world/level/translated/world-systems';
import { DOWN, UP, NORTH, SOUTH, WEST, EAST, OPPOSITE_FACING, STEP_X, STEP_Y, STEP_Z } from './world/translated/Facing';
import { AABB } from './world/phys/translated/AABB';
import { Vec3 } from './world/phys/translated/Vec3';
import { HitResult, HitResultType } from './world/phys/translated/HitResult';
import { sqrt as mthSqrt, floor as mthFloor, sin as mthSin, cos as mthCos, atan as mthAtan, atan2 as mthAtan2, PI, TWO_PI, DEGRAD, RADDEG } from './util/translated/Mth';
import { Random } from './util/translated/Random';
import { TicksPerSecond } from './util/translated/SharedConstants';
import { Structures, Tools, FoodArmor, Decorations, Mechanisms } from './world/item/translated/ItemCategory';
import { UseAnimation } from './world/item/translated/UseAnim';
import { StoneTile, DirtTile, OreTile, MetalTile, GlassTile, TreeTile, LeafTile, GravelTile, HalfTransparentTile, TransparentTile } from './world/level/tile/translated/tile-subclasses';
import { TntTile, TorchTile, LadderTile, FenceTile, FenceGateTile, BookshelfTile, WebTile, IceTile, SnowTile, TopSnowTile, LightGemTile, ObsidianTile, ClayTile, ReedTile, CactusTile, SandTile, Bush, Sapling, Mushroom, TallGrass, CropTile, FarmTile, SandStoneTile, RedStoneOreTile, MultiTextureTile, BedTile, MelonTile, StemTile, InvisibleTile, StonecutterTile, NetherReactor, QuartzBlockTile, CarriedTile, ThinFenceTile, StairTile, FireTile, DoorTile, SignTile, TrapDoorTile, StoneSlabTile, LiquidTile, LiquidTileDynamic, LiquidTileStatic } from './world/level/tile/translated/tile-subclasses-2';
import { DiggerItem, PickaxeItem, ShovelItem, HatchetItem, WeaponItem, HoeItem, BowItem, FoodItem, FlintAndSteelItem, DoorItem, SignItem, ShearsItem, BowlFoodItem, SeedItem, CoalItem, EggItem, SnowballItem, DyePowderItem, BedItem, HangingEntityItem, CameraItem, TileItem, AuxDataTileItem, ClothTileItem, LeafTileItem, StoneSlabTileItem, SaplingTileItem, TilePlanterItem } from './world/item/translated/item-subclasses';
import { Creature, PathfinderMob, AgableMob, Animal, WaterAnimal, Monster, Chicken as ChickenEntity, Cow as CowEntity, Pig as PigEntity, Sheep as SheepEntity, Zombie as ZombieEntity, Skeleton as SkeletonEntity, Spider as SpiderEntity, Creeper as CreeperEntity } from './world/entity/translated/entity-subclasses';

// §Export translated C++ classes to window for minecraft.html
window.VoxelCraftTile = Tile;
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
window.VoxelCraftAABB = AABB;
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
