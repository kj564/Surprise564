import { describe, expect, test } from 'bun:test';
import { Inventory } from './inventory';

describe('Inventory', () => {
  test('inserts into partial stacks before allocating empty slots', () => {
    const inventory = new Inventory(3);
    inventory.setSlot(0, { id: 1, count: 60, maxStackSize: 64 });
    const result = inventory.insert(1, 10);
    expect(result).toEqual({ inserted: 10, remainder: 0 });
    expect(inventory.getSlot(0)?.count).toBe(64);
    expect(inventory.getSlot(1)?.count).toBe(6);
    expect(inventory.revision).toBe(2);
  });

  test('reports remainder when all slots are full', () => {
    const inventory = new Inventory(1);
    const result = inventory.insert(3, 70);
    expect(result).toEqual({ inserted: 64, remainder: 6 });
    expect(inventory.getSlot(0)?.count).toBe(64);
  });

  test('removes exact quantities and clears empty stacks', () => {
    const inventory = new Inventory(2);
    inventory.insert(1, 10);
    expect(inventory.remove(0, 4)).toEqual({ id: 1, count: 4, maxStackSize: 64, auxValue: 0 });
    expect(inventory.getSlot(0)?.count).toBe(6);
    expect(inventory.remove(0, 99)?.count).toBe(6);
    expect(inventory.getSlot(0)).toBeNull();
    expect(inventory.remove(0, 1)).toBeNull();
  });

  test('swaps slots and avoids revisions for no-op operations', () => {
    const inventory = new Inventory(2);
    inventory.setSlot(0, { id: 1, count: 1, maxStackSize: 64 });
    inventory.setSlot(1, { id: 3, count: 2, maxStackSize: 64 });
    const before = inventory.revision;
    expect(inventory.swap(0, 1)).toBe(true);
    expect(inventory.getSlot(0)?.id).toBe(3);
    expect(inventory.swap(0, 0)).toBe(false);
    expect(inventory.revision).toBe(before + 1);
  });

  test('preserves item count when inserting and removing across multiple stacks', () => {
    const inventory = new Inventory(4);
    const inserted = inventory.insert(4, 150, 64);
    const total = inventory.snapshot().reduce((sum, stack) => sum + (stack?.count ?? 0), 0);
    expect(inserted.inserted + inserted.remainder).toBe(150);
    expect(total).toBe(150);
    const removed = inventory.remove(0, 64);
    const after = inventory.snapshot().reduce((sum, stack) => sum + (stack?.count ?? 0), 0);
    expect(removed?.count).toBe(64);
    expect(after + removed!.count).toBe(total);
  });

  test('validates stack keys, counts, capacities and slot indexes', () => {
    const inventory = new Inventory(2);
    expect(() => new Inventory(0)).toThrow(RangeError);
    expect(() => inventory.insert('stone', 1)).toThrow(TypeError);
    expect(() => inventory.insert(1, 0)).toThrow(RangeError);
    expect(() => inventory.setSlot(0, { id: 1, count: 65, maxStackSize: 64 })).toThrow(RangeError);
    expect(() => inventory.getSlot(2)).toThrow(RangeError);
    inventory.insert(1, 1, 16);
    expect(() => inventory.insert(1, 1, 64)).toThrow('maxStackSize does not match');
  });

  test('returns immutable snapshots', () => {
    const inventory = new Inventory(1);
    inventory.insert(1, 1);
    const snapshot = inventory.snapshot();
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot[0])).toBe(true);
    expect(() => (snapshot as unknown as unknown[]).push(null)).toThrow();
  });
});
