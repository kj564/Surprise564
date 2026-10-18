export interface ItemStack {
  readonly itemKey: string;
  readonly count: number;
  readonly maxStackSize: number;
  /** §ItemInstance::auxValue (ItemInstance.h:97-99) — used as durability
   *  for damageable items (tools), block data (wool color, etc.) for blocks.
   *  Optional for backward compat; defaults to 0 (no damage). */
  readonly auxValue?: number;
}

export interface InsertResult {
  readonly inserted: number;
  readonly remainder: number;
}

/** Pure inventory rules. UI slots and hotbar views should derive from this model. */
export class Inventory {
  private readonly slots: Array<ItemStack | null>;
  private _revision = 0;

  constructor(slotCount: number) {
    if (!Number.isSafeInteger(slotCount) || slotCount <= 0 || slotCount > 4096) {
      throw new RangeError('slotCount must be an integer between 1 and 4096');
    }
    this.slots = Array.from({ length: slotCount }, () => null);
  }

  get size(): number {
    return this.slots.length;
  }

  get revision(): number {
    return this._revision;
  }

  getSlot(index: number): ItemStack | null {
    return this.slots[this.assertSlot(index)];
  }

  snapshot(): readonly (ItemStack | null)[] {
    return Object.freeze([...this.slots]);
  }

  setSlot(index: number, stack: ItemStack | null): boolean {
    const slot = this.assertSlot(index);
    // §Preserve auxValue (durability) when normalizing input stack.
    const normalized = stack === null ? null : createStack(stack.itemKey, stack.count, stack.maxStackSize, stack.auxValue);
    const previous = this.slots[slot];
    if (sameStack(previous, normalized)) return false;
    this.slots[slot] = normalized;
    this._revision += 1;
    return true;
  }

  /** Fills compatible stacks first, then empty slots; returns any items that did not fit. */
  insert(itemKey: string, count: number, maxStackSize = 64): InsertResult {
    validateItemKey(itemKey);
    positiveInteger(count, 'count');
    positiveInteger(maxStackSize, 'maxStackSize');
    if (maxStackSize > 999) throw new RangeError('maxStackSize cannot exceed 999');

    for (const stack of this.slots) {
      if (stack?.itemKey === itemKey && stack.maxStackSize !== maxStackSize) {
        throw new Error('maxStackSize does not match existing stack definition for ' + itemKey);
      }
    }

    let remaining = count;
    let changed = false;
    for (let index = 0; index < this.slots.length && remaining > 0; index += 1) {
      const stack = this.slots[index];
      if (!stack || stack.itemKey !== itemKey || stack.count >= stack.maxStackSize) continue;
      const amount = Math.min(remaining, stack.maxStackSize - stack.count);
      this.slots[index] = createStack(itemKey, stack.count + amount, maxStackSize);
      remaining -= amount;
      changed = true;
    }
    for (let index = 0; index < this.slots.length && remaining > 0; index += 1) {
      if (this.slots[index] !== null) continue;
      const amount = Math.min(remaining, maxStackSize);
      this.slots[index] = createStack(itemKey, amount, maxStackSize);
      remaining -= amount;
      changed = true;
    }
    if (changed) this._revision += 1;
    return Object.freeze({ inserted: count - remaining, remainder: remaining });
  }

  /** Removes up to count items from a slot; returns null if the slot is empty. */
  remove(index: number, count: number): ItemStack | null {
    const slot = this.assertSlot(index);
    positiveInteger(count, 'count');
    const stack = this.slots[slot];
    if (!stack) return null;
    const removedCount = Math.min(count, stack.count);
    const removed = createStack(stack.itemKey, removedCount, stack.maxStackSize);
    this.slots[slot] = removedCount === stack.count
      ? null
      : createStack(stack.itemKey, stack.count - removedCount, stack.maxStackSize);
    this._revision += 1;
    return removed;
  }

  swap(firstIndex: number, secondIndex: number): boolean {
    const first = this.assertSlot(firstIndex);
    const second = this.assertSlot(secondIndex);
    if (first === second || sameStack(this.slots[first], this.slots[second])) return false;
    const temporary = this.slots[first];
    this.slots[first] = this.slots[second];
    this.slots[second] = temporary;
    this._revision += 1;
    return true;
  }

  private assertSlot(index: number): number {
    if (!Number.isSafeInteger(index) || index < 0 || index >= this.slots.length) {
      throw new RangeError('Inventory slot index is out of range');
    }
    return index;
  }
}

function createStack(itemKey: string, count: number, maxStackSize: number, auxValue?: number): ItemStack {
  validateItemKey(itemKey);
  positiveInteger(count, 'count');
  positiveInteger(maxStackSize, 'maxStackSize');
  if (maxStackSize > 999) throw new RangeError('maxStackSize cannot exceed 999');
  if (count > maxStackSize) throw new RangeError('Stack count exceeds maxStackSize');
  // §ItemInstance::auxValue — preserved for damageable items (tools).
  // Validate as non-negative integer; default to 0 (fresh tool) if absent.
  if (auxValue !== undefined && (!Number.isInteger(auxValue) || auxValue < 0 || auxValue > 9999)) {
    throw new RangeError('auxValue must be a non-negative integer up to 9999');
  }
  return Object.freeze({ itemKey, count, maxStackSize, auxValue: auxValue ?? 0 });
}

function validateItemKey(itemKey: string): void {
  if (typeof itemKey !== 'string' || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(itemKey)) {
    throw new TypeError('itemKey must be a lowercase namespaced key');
  }
}

function positiveInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RangeError(name + ' must be a positive safe integer');
}

function sameStack(a: ItemStack | null, b: ItemStack | null): boolean {
  // §Compare auxValue too — tools with different durability are NOT the same stack.
  // Without this, setSlot would silently no-op when applyToolDurability updates
  // auxValue on a tool (same itemKey/count/maxStackSize but different wear).
  return a === b || (a !== null && b !== null &&
    a.itemKey === b.itemKey && a.count === b.count && a.maxStackSize === b.maxStackSize &&
    (a.auxValue ?? 0) === (b.auxValue ?? 0));
}
