import { VoxelCraftEngine } from './engine';

declare global {
  interface Window {
    VoxelCraftEngine: typeof VoxelCraftEngine;
  }
}

// Deliberately expose only the composition root. The static browser demo owns rendering/input,
// while all world, collision, targeting, mining, placement and inventory rules stay in this engine.
window.VoxelCraftEngine = VoxelCraftEngine;
