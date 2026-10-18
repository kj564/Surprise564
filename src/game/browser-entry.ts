import { VoxelCraftEngine } from './engine';
import { BlockRegistry } from './world/level/tile/registry';
import { ChunkMeshCache } from './client/renderer/chunk-mesh-cache';
import { generateTerrainChunk } from './world/level/levelgen/terrain-generator';
import { ensureTerrainNeighborhood } from './world/level/levelgen/terrain-streaming';
import { getTool, type Tool } from './world/item/tools';

declare global {
  interface Window {
    VoxelCraftEngine: typeof VoxelCraftEngine;
    VoxelCraftBlockRegistry: typeof BlockRegistry;
    VoxelCraftCreateMeshCache: (engine: VoxelCraftEngine) => ChunkMeshCache;
    VoxelCraftGenerateTerrainChunk: typeof generateTerrainChunk;
    VoxelCraftEnsureTerrainNeighborhood: typeof ensureTerrainNeighborhood;
    // §MCPE 2013 tool lookup — used by minecraft.html to resolve the equipped
    // tool from the selected hotbar slot's itemKey and pass it to startMining.
    VoxelCraftGetTool: typeof getTool;
  }
}

// Browser UI/input stays outside the simulation. The preview gets a small adapter to the
// renderer-independent chunk mesher/cache; it never mutates authoritative world data via meshes.
window.VoxelCraftEngine = VoxelCraftEngine;
window.VoxelCraftBlockRegistry = BlockRegistry;
window.VoxelCraftCreateMeshCache = engine => new ChunkMeshCache(engine.world, engine.registry);
window.VoxelCraftGenerateTerrainChunk = generateTerrainChunk;
window.VoxelCraftEnsureTerrainNeighborhood = ensureTerrainNeighborhood;
// §Expose tool lookup so minecraft.html can compute the equipped tool from the
// selected hotbar slot's itemKey (e.g. 'minecraft:wood_pickaxe') and pass it
// to voxelEngine.startMining(target, tool).
window.VoxelCraftGetTool = getTool;
