import { VoxelCraftEngine } from './engine';
import { ChunkMeshCache } from './rendering/chunk-mesh-cache';
import { generateTerrainChunk } from './world/terrain-generator';
import { ensureTerrainNeighborhood } from './world/terrain-streaming';

declare global {
  interface Window {
    VoxelCraftEngine: typeof VoxelCraftEngine;
    VoxelCraftCreateMeshCache: (engine: VoxelCraftEngine) => ChunkMeshCache;
    VoxelCraftGenerateTerrainChunk: typeof generateTerrainChunk;
    VoxelCraftEnsureTerrainNeighborhood: typeof ensureTerrainNeighborhood;
  }
}

// Browser UI/input stays outside the simulation. The preview gets a small adapter to the
// renderer-independent chunk mesher/cache; it never mutates authoritative world data via meshes.
window.VoxelCraftEngine = VoxelCraftEngine;
window.VoxelCraftCreateMeshCache = engine => new ChunkMeshCache(engine.world, engine.registry);
window.VoxelCraftGenerateTerrainChunk = generateTerrainChunk;
window.VoxelCraftEnsureTerrainNeighborhood = ensureTerrainNeighborhood;
