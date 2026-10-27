import type { BlockRegistry, BlockDefinition } from '../../world/level/tile/registry';
import { canDestroyBlock, getPlayerDestroySpeed, getTool, type Tool } from '../../world/item/tools';
import type { VoxelWorld, BlockPosition } from '../../world/level/world';
import type { Inventory, ItemStack } from '../../world/inventory/inventory';

// §MCPE 2013 mining model — 1:1 port from rujukan C++ source.
//   Tile::getDestroyProgress(Player* player)            (Tile.cpp:391-395)
//     if (destroySpeed < 0) return 0;                   // unbreakable
//     if (!player->canDestroy(this)) return 1 / destroySpeed / 100.0f;
//     return (player->getDestroySpeed(this) / destroySpeed) / 30.0f;
//   Player::getDestroySpeed(Tile*)                       (Player.cpp:556-561)
//     return inventory->getDestroySpeed(tile);           // bare hand = 1.0
//   SurvivalMode::continueDestroyBlock                    (SurvivalMode.cpp:18-50)
//     if (destroyDelay > 0) { destroyDelay--; return; }
//     destroyProgress += tile->getDestroyProgress(player)
//     if ((++destroyTicks & 3) == 1) step-sound;
//     if (destroyProgress >= 1) { destroyBlock; reset; destroyDelay = 5; }
//   CreativeMode::startDestroyBlock                        (CreativeMode.cpp:11-19)
//     creativeDestroyBlock(x,y,z,face);  // instant break
//     destroyDelay = DestructionTickDelay;  // = 10
//   CreativeMode::continueDestroyBlock                     (CreativeMode.cpp:28-33)
//     destroyDelay--;
//     if (destroyDelay <= 0) { destroyDelay = DestructionTickDelay; creativeDestroyBlock(); }

export const TICKS_PER_SECOND = 20;
export const SURVIVAL_DESTROY_DELAY = 5;          // ticks after break before next break
export const CREATIVE_DESTRUCTION_TICK_DELAY = 10; // ticks between creative breaks
export const DESTROY_PROGRESS_DIVISOR = 30;        // rujukan Tile::getDestroyProgress divisor

export type GameMode = 'survival' | 'creative';

export type MiningStartResult =
  | { readonly status: 'started'; readonly session: MiningSession }
  | { readonly status: 'unloaded' }
  | { readonly status: 'air' }
  | { readonly status: 'unknown-block'; readonly blockId: number }
  | { readonly status: 'unbreakable' };

export type MiningProgressResult =
  | { readonly status: 'mining'; readonly progress: number; readonly remainingTicks: number }
  | { readonly status: 'completed'; readonly progress: 1 }
  | { readonly status: 'cancelled' }
  // Creative-only: a break happened this tick and a cooldown delay is now active
  | { readonly status: 'cooldown'; readonly progress: 1; readonly cooldownTicks: number };

/** Tick-based mining state — 1:1 with rujukan SurvivalMode/CreativeMode.
 *  Caller advances one or more ticks per physics step (20 tps fixed-timestep). */
export class MiningSession {
  readonly target: BlockPosition;
  readonly blockId: number;
  readonly hardness: number;
  readonly mode: GameMode;
  readonly playerDestroySpeed: number;
  /** §Inventory::canDestroy — false means 100x slower fallback (no drops). */
  readonly canDestroy: boolean;
  private destroyProgress = 0;
  private destroyTicks = 0;
  private destroyDelay = 0;
  private completed = false;     // survival: destroyProgress>=1 reached this tick
  private cancelled = false;

  constructor(target: BlockPosition, blockId: number, hardness: number, mode: GameMode, playerDestroySpeed: number, canDestroy = true) {
    if (!Number.isSafeInteger(target.x) || !Number.isSafeInteger(target.y) || !Number.isSafeInteger(target.z)) {
      throw new TypeError('Mining target coordinates must be safe integers');
    }
    if (!Number.isSafeInteger(blockId) || blockId <= 0 || blockId > 0xffff) throw new RangeError('Mining blockId must be between 1 and 65535');
    if (!Number.isFinite(hardness)) throw new RangeError('hardness must be finite');
    if (mode !== 'survival' && mode !== 'creative') throw new RangeError('mode must be survival or creative');
    if (!Number.isFinite(playerDestroySpeed) || playerDestroySpeed <= 0) throw new RangeError('playerDestroySpeed must be finite and positive');
    this.target = Object.freeze({ ...target });
    this.blockId = blockId;
    this.hardness = hardness;
    this.mode = mode;
    this.playerDestroySpeed = playerDestroySpeed;
    this.canDestroy = canDestroy;
  }

  get isComplete(): boolean {
    return this.completed;
  }

  get isCancelled(): boolean {
    return this.cancelled;
  }

  get progress(): number {
    if (this.completed) return 1;
    return Math.min(1, this.destroyProgress);
  }

  /** Ticks of mining remaining until the block breaks (survival only; creative is instant). */
  get remainingTicks(): number {
    if (this.completed) return 0;
    if (this.hardness <= 0) return 0;
    const perTick = this.canDestroy
      ? (this.playerDestroySpeed / this.hardness) / DESTROY_PROGRESS_DIVISOR
      : (1 / this.hardness) / (DESTROY_PROGRESS_DIVISOR * 100);
    if (perTick <= 0) return Infinity;
    return Math.max(0, Math.ceil((1 - this.destroyProgress) / perTick));
  }

  /** Advance mining by `ticks` physics ticks (1 tick = 1/20 s). The caller must
   *  confirm the same target is still selected, otherwise the session cancels. */
  tick(ticks: number, currentTarget: BlockPosition | null, currentBlockId: number | undefined): MiningProgressResult {
    if (!Number.isFinite(ticks) || ticks < 0) throw new RangeError('ticks must be finite and non-negative');
    if (this.cancelled) return { status: 'cancelled' };
    if (!samePosition(this.target, currentTarget) || currentBlockId !== this.blockId) {
      this.cancelled = true;
      return { status: 'cancelled' };
    }
    if (this.completed) return { status: 'completed', progress: 1 };

    let remaining = Math.floor(ticks);
    if (remaining <= 0) {
      return { status: 'mining', progress: this.progress, remainingTicks: this.remainingTicks };
    }

    // Creative: instant break on first tick, then cooldown of CREATIVE_DESTRUCTION_TICK_DELAY.
    if (this.mode === 'creative') {
      // First tick that arrives while not on cooldown = instant break.
      if (this.destroyDelay <= 0) {
        this.completed = true;
        this.destroyDelay = CREATIVE_DESTRUCTION_TICK_DELAY; // for next break
        return { status: 'completed', progress: 1 };
      }
      // Consume ticks by cooldown. Each tick decrements destroyDelay.
      const consume = Math.min(remaining, this.destroyDelay);
      this.destroyDelay -= consume;
      remaining -= consume;
      if (remaining > 0) {
        // Cooldown elapsed this very call — break the (new) block now.
        if (this.destroyDelay <= 0) {
          this.completed = true;
          this.destroyDelay = CREATIVE_DESTRUCTION_TICK_DELAY;
          return { status: 'completed', progress: 1 };
        }
      }
      return { status: 'cooldown', progress: 1, cooldownTicks: this.destroyDelay };
    }

    // Survival: rujukan SurvivalMode::continueDestroyBlock
    while (remaining > 0) {
      // destroyDelay blocks the tick entirely (rujukan: `destroyDelay--; return;`).
      if (this.destroyDelay > 0) {
        const consume = Math.min(remaining, this.destroyDelay);
        this.destroyDelay -= consume;
        remaining -= consume;
        continue;
      }
      // One tick of mining progress.
      remaining -= 1;
      // §Tile::getDestroyProgress (Tile.cpp:391-395):
      //   if (!canDestroy) return 1 / destroySpeed / 100.0f;  // 100x slower fallback
      //   return (playerDestroySpeed / destroySpeed) / 30.0f;
      // hardness<0 is filtered by beginMining (unbreakable), so safe here.
      const perTick = this.canDestroy
        ? (this.playerDestroySpeed / this.hardness) / DESTROY_PROGRESS_DIVISOR
        : (1 / this.hardness) / (DESTROY_PROGRESS_DIVISOR * 100);
      this.destroyProgress += perTick;
      this.destroyTicks += 1;
      if (this.destroyProgress >= 1) {
        this.completed = true;
        this.destroyDelay = SURVIVAL_DESTROY_DELAY;
        return { status: 'completed', progress: 1 };
      }
    }
    return { status: 'mining', progress: this.progress, remainingTicks: this.remainingTicks };
  }

  /** Force-cancel the session (input release). */
  cancel(): void {
    this.cancelled = true;
  }
}

export type BeginMiningOptions = {
  readonly mode?: GameMode;
  /** Optional tool equipped in the selected hotbar slot. When omitted, the
   *  engine computes destroySpeed from the bare hand (= 1, rujukan Inventory.cpp:322). */
  readonly tool?: Tool | null;
  /** Optional override for player destroy speed (rujukan Player::getDestroySpeed).
   *  When omitted, computed from `tool` + block material via §Player::getDestroySpeed. */
  readonly playerDestroySpeed?: number;
};

export function beginMining(
  world: Pick<VoxelWorld, 'getBlock'>,
  target: BlockPosition,
  registry: BlockRegistry,
  options: BeginMiningOptions = {},
): MiningStartResult {
  const mode = options.mode ?? 'creative';
  if (mode !== 'survival' && mode !== 'creative') throw new RangeError('mode must be survival or creative');
  const blockId = world.getBlock(target.x, target.y, target.z);
  if (blockId === undefined) return { status: 'unloaded' };
  if (blockId === 0) return { status: 'air' };
  const definition = registry.getById(blockId);
  if (!definition) return { status: 'unknown-block', blockId };
  if (definition.hardness < 0) return { status: 'unbreakable' };

  // §Player::getDestroySpeed → tool-aware destroy speed multiplier (1 if bare hand).
  const tool = options.tool ?? null;
  const playerDestroySpeed = options.playerDestroySpeed ?? getPlayerDestroySpeed(definition.material, definition.key, tool);
  if (!Number.isFinite(playerDestroySpeed) || playerDestroySpeed <= 0) throw new RangeError('playerDestroySpeed must be finite and positive');

  // §Player::canDestroy → §Inventory::canDestroy (Inventory.cpp:307-313):
  //   if tile.material.isAlwaysDestroyable() → true (always drops)
  //   else if tool != null → tool.canDestroySpecial(tile)
  //   else false
  // §Tile::getDestroyProgress (Tile.cpp:391-395):
  //   if (destroySpeed < 0) return 0;                          // bedrock
  //   if (!player->canDestroy(this)) return 1 / destroySpeed / 100.0f;  // 100x slower
  //   return (player->getDestroySpeed(this) / destroySpeed) / 30.0f;
  // canDestroy=false still lets the player break the block, just 100x slower
  // and with no drops. We model this with the `canDestroy` flag on the session.
  const canDestroy = canDestroyBlock(definition.material, definition.key, tool);

  return {
    status: 'started',
    session: new MiningSession(target, blockId, definition.hardness, mode, playerDestroySpeed, canDestroy),
  };
}

export type BreakBlockResult =
  | { readonly status: 'not-ready'; readonly progress: number }
  | { readonly status: 'broken'; readonly blockId: number; readonly dropsInserted: readonly ItemStack[]; readonly dropsRemaining: readonly ItemStack[] }
  | { readonly status: 'target-changed' }
  | { readonly status: 'unloaded' }
  | { readonly status: 'unbreakable' };

/** Completes an already-finished mining session. Any inventory overflow is returned, never lost. */
export function finishBlockBreak(
  world: VoxelWorld,
  session: MiningSession,
  registry: BlockRegistry,
  inventory: Inventory,
): BreakBlockResult {
  if (session.isCancelled) return { status: 'target-changed' };
  if (!session.isComplete) return { status: 'not-ready', progress: session.progress };
  const target = session.target;
  const currentId = world.getBlock(target.x, target.y, target.z);
  if (currentId === undefined) return { status: 'unloaded' };
  if (currentId !== session.blockId || currentId === 0) return { status: 'target-changed' };
  const definition = registry.getById(currentId);
  if (!definition) return { status: 'target-changed' };
  if (definition.hardness < 0) return { status: 'unbreakable' };

  const mutation = world.setBlock(target, 0);
  if (!mutation.changed) return { status: 'target-changed' };
  const inserted: ItemStack[] = [];
  const remaining: ItemStack[] = [];
  for (const dropKey of definition.drops) {
    const result = inventory.insert(dropKey, 1);
    if (result.inserted > 0) inserted.push(Object.freeze({ id: dropKey, count: result.inserted, maxStackSize: 64 }));
    if (result.remainder > 0) remaining.push(Object.freeze({ id: dropKey, count: result.remainder, maxStackSize: 64 }));
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
