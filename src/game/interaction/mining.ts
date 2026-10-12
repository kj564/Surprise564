import type { BlockRegistry } from '../blocks/registry';
import type { VoxelWorld, BlockPosition } from '../world/world';
import type { Inventory, ItemStack } from '../inventory/inventory';

export type MiningStartResult =
  | { readonly status: 'started'; readonly session: MiningSession }
  | { readonly status: 'unloaded' }
  | { readonly status: 'air' }
  | { readonly status: 'unknown-block'; readonly blockId: number }
  | { readonly status: 'unbreakable' };

export type MiningProgressResult =
  | { readonly status: 'mining'; readonly progress: number; readonly remainingSeconds: number }
  | { readonly status: 'completed'; readonly progress: 1 }
  | { readonly status: 'cancelled' };

/** Time-based mining state. Tool tiers and game-mode modifiers are explicit future inputs. */
export class MiningSession {
  readonly target: BlockPosition;
  readonly blockId: number;
  readonly totalSeconds: number;
  private elapsedSeconds = 0;
  private finished = false;

  constructor(target: BlockPosition, blockId: number, totalSeconds: number) {
    if (!Number.isSafeInteger(target.x) || !Number.isSafeInteger(target.y) || !Number.isSafeInteger(target.z)) {
      throw new TypeError('Mining target coordinates must be safe integers');
    }
    if (!Number.isSafeInteger(blockId) || blockId <= 0 || blockId > 0xffff) throw new RangeError('Mining blockId must be between 1 and 65535');
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) throw new RangeError('totalSeconds must be finite and non-negative');
    this.target = Object.freeze({ ...target });
    this.blockId = blockId;
    this.totalSeconds = totalSeconds;
    this.finished = totalSeconds === 0;
  }

  get progress(): number {
    if (this.finished) return 1;
    if (this.totalSeconds === 0) return 1;
    return Math.min(1, this.elapsedSeconds / this.totalSeconds);
  }

  advance(deltaSeconds: number, currentTarget: BlockPosition | null, currentBlockId: number | undefined): MiningProgressResult {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) throw new RangeError('deltaSeconds must be finite and non-negative');
    if (this.finished) return { status: 'completed', progress: 1 };
    if (!samePosition(this.target, currentTarget) || currentBlockId !== this.blockId) {
      this.finished = true;
      return { status: 'cancelled' };
    }
    this.elapsedSeconds = Math.min(this.totalSeconds, this.elapsedSeconds + deltaSeconds);
    if (this.elapsedSeconds >= this.totalSeconds) {
      this.finished = true;
      return { status: 'completed', progress: 1 };
    }
    return {
      status: 'mining',
      progress: this.progress,
      remainingSeconds: Math.max(0, this.totalSeconds - this.elapsedSeconds),
    };
  }
}

export function beginMining(
  world: Pick<VoxelWorld, 'getBlock'>,
  target: BlockPosition,
  registry: BlockRegistry,
  miningSpeed = 1,
): MiningStartResult {
  if (!Number.isFinite(miningSpeed) || miningSpeed <= 0) throw new RangeError('miningSpeed must be finite and positive');
  const blockId = world.getBlock(target.x, target.y, target.z);
  if (blockId === undefined) return { status: 'unloaded' };
  if (blockId === 0) return { status: 'air' };
  const definition = registry.getById(blockId);
  if (!definition) return { status: 'unknown-block', blockId };
  if (definition.hardness < 0) return { status: 'unbreakable' };
  return {
    status: 'started',
    session: new MiningSession(target, blockId, definition.hardness / miningSpeed),
  };
}

export type BreakBlockResult =
  | { readonly status: 'broken'; readonly blockId: number; readonly dropsInserted: readonly ItemStack[]; readonly dropsRemaining: readonly ItemStack[] }
  | { readonly status: 'target-changed' }
  | { readonly status: 'unloaded' }
  | { readonly status: 'unbreakable' };

/** Completes an already-finished mining session. Any inventory overflow is returned, never lost. */
export function finishBlockBreak(
  world: VoxelWorld,
  target: BlockPosition,
  expectedBlockId: number,
  registry: BlockRegistry,
  inventory: Inventory,
): BreakBlockResult {
  const currentId = world.getBlock(target.x, target.y, target.z);
  if (currentId === undefined) return { status: 'unloaded' };
  if (currentId !== expectedBlockId || currentId === 0) return { status: 'target-changed' };
  const definition = registry.getById(currentId);
  if (!definition) return { status: 'target-changed' };
  if (definition.hardness < 0) return { status: 'unbreakable' };

  world.setBlock(target, 0);
  const inserted: ItemStack[] = [];
  const remaining: ItemStack[] = [];
  for (const dropKey of definition.drops) {
    const result = inventory.insert(dropKey, 1);
    if (result.inserted > 0) inserted.push(Object.freeze({ itemKey: dropKey, count: result.inserted, maxStackSize: 64 }));
    if (result.remainder > 0) remaining.push(Object.freeze({ itemKey: dropKey, count: result.remainder, maxStackSize: 64 }));
  }
  return {
    status: 'broken',
    blockId: currentId,
    dropsInserted: Object.freeze(inserted),
    dropsRemaining: Object.freeze(remaining),
  };
}

function samePosition(a: BlockPosition, b: BlockPosition | null): boolean {
  return b !== null && a.x === b.x && a.y === b.y && a.z === b.z;
}
