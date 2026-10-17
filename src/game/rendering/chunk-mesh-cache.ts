import type { BlockRegistry } from '../blocks/registry';
import type { VoxelWorld } from '../world/world';
import { buildChunkMesh, type ChunkMeshData } from './chunk-mesher';

export interface MeshSyncResult {
  readonly rebuilt: number;
  readonly removed: number;
}

export interface MeshSyncDetailedResult extends MeshSyncResult {
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

  /** Backwards-compatible aggregate sync result. */
  sync(): MeshSyncResult {
    const result = this.syncDetailed();
    return Object.freeze({ rebuilt: result.rebuilt, removed: result.removed });
  }

  /**
   * Synchronize only dirty chunks and report exact cache membership changes.
   * Renderers can now replace affected chunk groups without rebuilding the whole scene.
   */
  syncDetailed(): MeshSyncDetailedResult {
    const loadedKeys = new Set(
      this.world.getLoadedChunkCoordinates().map(({ x, z }) => chunkKey(x, z)),
    );
    const removedChunks: Array<Readonly<{ x: number; z: number }>> = [];
    for (const key of this.meshes.keys()) {
      if (!loadedKeys.has(key)) {
        this.meshes.delete(key);
        removedChunks.push(parseChunkKey(key));
      }
    }

    const dirtyKeys = new Set(this.world.consumeDirtyChunks());
    const rebuiltChunks: Array<Readonly<{ x: number; z: number }>> = [];
    for (const key of dirtyKeys) {
      if (!loadedKeys.has(key)) continue;
      const position = parseChunkKey(key);
      this.meshes.set(key, buildChunkMesh(this.world, position.x, position.z, this.registry));
      rebuiltChunks.push(position);
    }
    return Object.freeze({
      rebuilt: rebuiltChunks.length,
      removed: removedChunks.length,
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

function parseChunkKey(key: string): Readonly<{ x: number; z: number }> {
  const [xText, zText] = key.split(',');
  return Object.freeze({ x: Number(xText), z: Number(zText) });
}
