/** Stable public surface for the renderer-independent VoxelCraft engine. */
export { VoxelCraftEngine, type VoxelCraftEngineOptions } from './engine';

export { BlockRegistry, defaultBlockRegistry, type BlockDefinition } from './blocks/registry';
export { FixedStepClock, type FixedStepOptions, type FixedStepResult } from './core/fixed-step';
export {
  chunkToWorld,
  worldToChunk,
  worldToLocal,
  localBlockIndex,
} from './core/coordinates';
export { Inventory, type ItemStack, type InsertResult } from './inventory/inventory';
export {
  BlockInteractionController,
  type MiningTickResult,
} from './interaction/controller';
export {
  raycastVoxels,
  type RayVector,
  type VoxelRayHit,
  type VoxelRayMiss,
  type VoxelRayResult,
} from './interaction/raycast';
export {
  Aabb,
  type Axis,
} from './physics/aabb';
export {
  PlayerPhysics,
  type PlayerInput,
  type PlayerPhysicsConfig,
  type PlayerPhysicsState,
  type PlayerPosition,
} from './physics/player-physics';
export { queryCollisionBoxes, type CollisionQueryResult } from './physics/world-collision';
export { ChunkData, type ChunkDimensions } from './world/chunk';
export {
  VoxelWorld,
  type BlockMutation,
  type BlockPosition,
  type WorldDimensions,
} from './world/world';
export {
  createWorldSave,
  restoreWorldSave,
  type PlayerSnapshot,
  type RestoredWorld,
  type SaveMetadataInput,
  type RestoreWorldResult,
} from './persistence/world-save';
export {
  validateWorldSave,
  type WorldSaveV1,
  type SaveValidationResult,
} from './persistence/save-schema';

export { ensureTerrainNeighborhood, type TerrainNeighborhoodResult } from './world/terrain-streaming';
export { generateTerrainChunk, type TerrainOptions } from './world/terrain-generator';
