import type { BlockRegistry } from '../blocks/registry';
import type { VoxelWorld } from '../world/world';
import { buildChunkMesh, type ChunkMeshData } from './chunk-mesher';

export interface MeshSyncResult {
  readonly rebuilt: number;
  readonly removed: number;
}

/**
 * Small renderer-facing cache. World data remains authoritative; mesh objects are disposable
 * derivatives rebuilt from the world's dirty-chunk queue.
 */
export class ChunkMeshCache {
  private readonly meshes = new Map<string, ChunkMeshData>();

  constructor(private readonly world: VoxelWorld, private readonly registry: BlockRegistry) {}

  get size(): number {
    return this.meshes.size;
  }

  get(chunkX: number, chunkZ: number): ChunkMeshData | undefined {
    return this.meshes.get(VoxelWorldKey(chunkX, chunkZ));
  }

  /** Synchronize cache membership and rebuild every dirty loaded chunk once per call. */
  sync(): MeshSyncResult {
    const loadedKeys = new Set(
      this.world.getLoadedChunkCoordinates().map(({ x, z }) => VoxelWorldKey(x, z)),
    );
    let removed = 0;
    for (const key of this.meshes.keys()) {
      if (!loadedKeys.has(key)) {
        this.meshes.delete(key);
        removed += 1;
      }
    }

    const dirtyKeys = new Set(this.world.consumeDirtyChunks());
    let rebuilt = 0;
    for (const key of dirtyKeys) {
      if (!loadedKeys.has(key)) continue;
      const [xText, zText] = key.split(',');
      const x = Number(xText);
      const z = Number(zText);
      this.meshes.set(key, buildChunkMesh(this.world, x, z, this.registry));
      rebuilt += 1;
    }
    return Object.freeze({ rebuilt, removed });
  }

  clear(): void {
    this.meshes.clear();
  }
}

function VoxelWorldKey(chunkX: number, chunkZ: number): string {
  return chunkX + ',' + chunkZ;
}
