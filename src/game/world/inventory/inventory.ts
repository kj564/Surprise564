export interface ItemStack {
  /** §ItemInstance.h:107 — int id (Tile 0-255 or Item 256+). C++ uses int IDs, NOT string keys. */
  readonly id: number;
  /** §ItemInstance.h:105 — int count */
  readonly count: number;
  readonly maxStackSize: number;
  /** §ItemInstance.h:114 — int auxValue (durability for tools, data for blocks) */
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
    const normalized = stack === null ? null : createStack(stack.id, stack.count, stack.maxStackSize, stack.auxValue);
    const previous = this.slots[slot];
    if (sameStack(previous, normalized)) return false;
    this.slots[slot] = normalized;
    this._revision += 1;
    return true;
  }

  /** Fills compatible stacks first, then empty slots; returns any items that did not fit. */
  insert(id: string, count: number, maxStackSize = 64): InsertResult {
    validateItemId(id);
    positiveInteger(count, 'count');
    positiveInteger(maxStackSize, 'maxStackSize');
    if (maxStackSize > 999) throw new RangeError('maxStackSize cannot exceed 999');

    for (const stack of this.slots) {
      if (stack?.id === id && stack.maxStackSize !== maxStackSize) {
        throw new Error('maxStackSize does not match existing stack definition for ' + id);
      }
    }

    let remaining = count;
    let changed = false;
    for (let index = 0; index < this.slots.length && remaining > 0; index += 1) {
      const stack = this.slots[index];
      if (!stack || stack.id !== id || stack.count >= stack.maxStackSize) continue;
      const amount = Math.min(remaining, stack.maxStackSize - stack.count);
      this.slots[index] = createStack(id, stack.count + amount, maxStackSize);
      remaining -= amount;
      changed = true;
    }
    for (let index = 0; index < this.slots.length && remaining > 0; index += 1) {
      if (this.slots[index] !== null) continue;
      const amount = Math.min(remaining, maxStackSize);
      this.slots[index] = createStack(id, amount, maxStackSize);
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
    const removed = createStack(stack.id, removedCount, stack.maxStackSize);
    this.slots[slot] = removedCount === stack.count
      ? null
      : createStack(stack.id, stack.count - removedCount, stack.maxStackSize);
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

function createStack(id: string, count: number, maxStackSize: number, auxValue?: number): ItemStack {
  validateItemId(id);
  positiveInteger(count, 'count');
  positiveInteger(maxStackSize, 'maxStackSize');
  if (maxStackSize > 999) throw new RangeError('maxStackSize cannot exceed 999');
  if (count > maxStackSize) throw new RangeError('Stack count exceeds maxStackSize');
  // §ItemInstance::auxValue — preserved for damageable items (tools).
  // Validate as non-negative integer; default to 0 (fresh tool) if absent.
  if (auxValue !== undefined && (!Number.isInteger(auxValue) || auxValue < 0 || auxValue > 9999)) {
    throw new RangeError('auxValue must be a non-negative integer up to 9999');
  }
  return Object.freeze({ id, count, maxStackSize, auxValue: auxValue ?? 0 });
}

function validateItemId(id: number): void {
  if (!Number.isInteger(id) || id < 0) {
    throw new TypeError('id must be a non-negative integer (C++ ItemInstance.id)');
  }
}

function positiveInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RangeError(name + ' must be a positive safe integer');
}

function sameStack(a: ItemStack | null, b: ItemStack | null): boolean {
  // §Compare auxValue too — tools with different durability are NOT the same stack.
  // Without this, setSlot would silently no-op when applyToolDurability updates
  // auxValue on a tool (same id/count/maxStackSize but different wear).
  return a === b || (a !== null && b !== null &&
    a.id === b.id && a.count === b.count && a.maxStackSize === b.maxStackSize &&
    (a.auxValue ?? 0) === (b.auxValue ?? 0));
}
