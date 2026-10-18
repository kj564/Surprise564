/** Stable public surface for the renderer-independent VoxelCraft engine. */
export { VoxelCraftEngine, type VoxelCraftEngineOptions } from './engine';

export { BlockRegistry, defaultBlockRegistry, type BlockDefinition } from './world/level/tile/registry';
export { FixedStepClock, type FixedStepOptions, type FixedStepResult } from './util/fixed-step';
export {
  chunkToWorld,
  worldToChunk,
  worldToLocal,
  localBlockIndex,
} from './util/coordinates';
export { Inventory, type ItemStack, type InsertResult } from './world/inventory/inventory';
export {
  BlockInteractionController,
  type MiningTickResult,
} from './client/interaction/controller';
export {
  raycastVoxels,
  type RayVector,
  type VoxelRayHit,
  type VoxelRayMiss,
  type VoxelRayResult,
} from './client/interaction/raycast';
export {
  Aabb,
  type Axis,
} from './world/physics/aabb';
export {
  PlayerPhysics,
  type PlayerInput,
  type PlayerPhysicsConfig,
  type PlayerPhysicsState,
  type PlayerPosition,
} from './world/physics/player-physics';
export { queryCollisionBoxes, type CollisionQueryResult } from './world/physics/world-collision';
export { ChunkData, type ChunkDimensions } from './world/level/chunk/chunk';
export {
  VoxelWorld,
  type BlockMutation,
  type BlockPosition,
  type WorldDimensions,
} from './world/level/world';
export {
  createWorldSave,
  restoreWorldSave,
  type PlayerSnapshot,
  type RestoredWorld,
  type SaveMetadataInput,
  type RestoreWorldResult,
} from './nbt/world-save';
export {
  validateWorldSave,
  type WorldSaveV1,
  type SaveValidationResult,
} from './nbt/save-schema';

export { ensureTerrainNeighborhood, type TerrainNeighborhoodResult } from './world/level/levelgen/terrain-streaming';
export { generateTerrainChunk, type TerrainOptions } from './world/level/levelgen/terrain-generator';
