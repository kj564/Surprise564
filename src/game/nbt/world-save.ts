import { Inventory, type ItemStack } from '../world/inventory/inventory';
import { VoxelWorld } from '../world/level/world';
import { validateWorldSave, type WorldSaveV1 } from './save-schema';

export interface SaveMetadataInput {
  readonly name: string;
  readonly seed: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly generatorVersion: number;
}

export interface PlayerSnapshot {
  readonly position: { readonly x: number; readonly y: number; readonly z: number };
  readonly yaw: number;
  readonly pitch: number;
  readonly selectedSlot?: number;
}

export interface RestoredWorld {
  readonly save: WorldSaveV1;
  readonly world: VoxelWorld;
  readonly inventory: Inventory;
  readonly player: PlayerSnapshot;
}

export type RestoreWorldResult =
  | { readonly ok: true; readonly restored: RestoredWorld }
  | { readonly ok: false; readonly errors: readonly string[] };

/** Captures detached world, inventory and player data into the versioned save contract. */
export function createWorldSave(
  world: VoxelWorld,
  inventory: Inventory,
  metadata: SaveMetadataInput,
  player: PlayerSnapshot,
): WorldSaveV1 {
  const candidate = {
    format: 'voxelcraft-world',
    schemaVersion: 1,
    generatorVersion: metadata.generatorVersion,
    metadata: {
      name: metadata.name,
      seed: metadata.seed,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt,
    },
    dimensions: world.dimensions,
    chunks: world.exportChunks().map(chunk => ({
      x: chunk.x,
      z: chunk.z,
      blocks: Array.from(chunk.blocks),
    })),
    player: {
      position: { ...player.position },
      yaw: player.yaw,
      pitch: player.pitch,
      selectedSlot: player.selectedSlot ?? 0,
      inventory: inventory.snapshot().map((stack: ItemStack | null) => stack ? { ...stack } : null),
    },
  };
  const validation = validateWorldSave(candidate);
  if (!validation.ok) throw new TypeError('Cannot create invalid world save: ' + validation.errors.join('; '));
  return validation.value;
}

/** Restores only validated data. Invalid/corrupt payloads return errors and never partially load. */
export function restoreWorldSave(input: unknown): RestoreWorldResult {
  const validation = validateWorldSave(input);
  if (!validation.ok) return Object.freeze({ ok: false, errors: validation.errors });
  const save = validation.value;

  try {
    const world = new VoxelWorld(save.dimensions);
    for (const chunk of save.chunks) {
      world.loadChunk(chunk.x, chunk.z, chunk.blocks);
    }
    const inventory = new Inventory(Math.max(1, save.player.inventory.length));
    save.player.inventory.forEach((stack, index) => {
      if (stack) inventory.setSlot(index, stack);
    });
    return Object.freeze({
      ok: true,
      restored: Object.freeze({
        save,
        world,
        inventory,
        player: save.player,
      }),
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errors: Object.freeze(['save restoration failed: ' + (error instanceof Error ? error.message : 'unknown error')]),
    });
  }
}
