import type { BlockRegistry } from '../../world/level/tile/registry';
import type { VoxelWorld } from '../../world/level/world';
import { buildChunkMesh, type ChunkMeshData } from './chunk-mesher';

export interface MeshSyncResult {
  readonly rebuilt: number;
  readonly removed: number;
  readonly rebuiltChunks: readonly Readonly<{ x: number; z: number }>[];
  readonly removedChunks: readonly Readonly<{ x: number; z: number }>[];
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
    return this.meshes.get(chunkKey(chunkX, chunkZ));
  }

  /** Synchronize cache membership and rebuild every dirty loaded chunk once per call. */
  sync(): MeshSyncResult {
    const loadedKeys = new Set(
      this.world.getLoadedChunkCoordinates().map(({ x, z }) => chunkKey(x, z)),
    );
    let removed = 0;
    const removedChunks: Array<Readonly<{ x: number; z: number }>> = [];
    for (const key of this.meshes.keys()) {
      if (!loadedKeys.has(key)) {
        this.meshes.delete(key);
        const [x, z] = key.split(',').map(Number);
        removedChunks.push(Object.freeze({ x, z }));
        removed += 1;
      }
    }

    const dirtyKeys = new Set(this.world.consumeDirtyChunks());
    let rebuilt = 0;
    const rebuiltChunks: Array<Readonly<{ x: number; z: number }>> = [];
    for (const key of dirtyKeys) {
      if (!loadedKeys.has(key)) continue;
      const [xText, zText] = key.split(',');
      const x = Number(xText);
      const z = Number(zText);
      this.meshes.set(key, buildChunkMesh(this.world, x, z, this.registry));
      rebuiltChunks.push(Object.freeze({ x, z }));
      rebuilt += 1;
    }
    return Object.freeze({
      rebuilt, removed,
      rebuiltChunks: Object.freeze(rebuiltChunks),
      removedChunks: Object.freeze(removedChunks),
    });
  }

  clear(): void {
    this.meshes.clear();
  }
}

function chunkKey(chunkX: number, chunkZ: number): string {
  return chunkX + ',' + chunkZ;
}
