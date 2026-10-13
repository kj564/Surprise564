import { VoxelCraftEngine } from './engine';
import { ChunkMeshCache } from './rendering/chunk-mesh-cache';
import { generateTerrainChunk, setTerrainHeightKernel } from './world/terrain-generator';
import { ensureTerrainNeighborhood } from './world/terrain-streaming';

declare global {
  interface Window {
    VoxelCraftEngine: typeof VoxelCraftEngine;
    VoxelCraftCreateMeshCache: (engine: VoxelCraftEngine) => ChunkMeshCache;
    VoxelCraftGenerateTerrainChunk: typeof generateTerrainChunk;
    VoxelCraftEnsureTerrainNeighborhood: typeof ensureTerrainNeighborhood;
    VoxelCraftWasmReady: Promise<'WASM' | 'TypeScript fallback'>;
  }
}

// Browser UI/input stays outside the simulation. The preview gets a small adapter to the
// renderer-independent chunk mesher/cache; it never mutates authoritative world data via meshes.
window.VoxelCraftEngine = VoxelCraftEngine;
window.VoxelCraftCreateMeshCache = engine => new ChunkMeshCache(engine.world, engine.registry);
window.VoxelCraftGenerateTerrainChunk = generateTerrainChunk;
window.VoxelCraftEnsureTerrainNeighborhood = ensureTerrainNeighborhood;

/**
 * Terrain sampling is an optional WASM fast path. If the binary is unavailable or WebAssembly
 * cannot initialize, the same deterministic TypeScript implementation remains authoritative.
 */
window.VoxelCraftWasmReady = (async () => {
  try {
    const response = await fetch('./voxelcraft-kernel.wasm');
    if (!response.ok) throw new Error('WASM kernel request failed: ' + response.status);
    let instance: WebAssembly.Instance;
    try {
      ({ instance } = await WebAssembly.instantiateStreaming(response.clone(), {}));
    } catch {
      ({ instance } = await WebAssembly.instantiate(await response.arrayBuffer(), {}));
    }
    const terrainHeight = instance.exports.terrain_height as (
      x: number, z: number, seed: number, baseHeight: number, amplitude: number, worldHeight: number, seaLevel: number,
    ) => number;
    if (typeof terrainHeight !== 'function') throw new Error('WASM terrain_height export is missing');
    setTerrainHeightKernel((x, z, seed, baseHeight, amplitude, worldHeight, seaLevel) =>
      terrainHeight(x, z, seed, baseHeight, amplitude, worldHeight, seaLevel));
    return 'WASM';
  } catch (error) {
    console.warn('VoxelCraft WASM kernel unavailable; using deterministic TypeScript fallback.', error);
    setTerrainHeightKernel(undefined);
    return 'TypeScript fallback';
  }
})();
