// §Container.ts — Direct 1:1 translation of C++ Container.h
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/Container.h
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { ItemInstance } from '../../item/translated/ItemInstance';

// --- Container.h:9-16 — ContainerType class ---
class ContainerType {
  static NONE = -9;
  static INVENTORY = -1;
  static CONTAINER = 0;
  static WORKBENCH = 1;
  static FURNACE = 2;
  static TRAP = 3;
  static ENCHANTMENT = 4;
  static BREWING_STAND = 5;
}

// --- Container.h:18-58 — Container abstract base class ---
abstract class Container {
  // --- Container.h:20 ---
  static LARGE_MAX_STACK_SIZE = 64;

  containerId: number;
  containerType: number;

  // --- Container.h:24-27 — Container(int containerType) ---
  constructor(containerType: number) {
    this.containerId = -1;
    this.containerType = containerType;
  }

  // --- Container.h:30 — pure virtual getItem ---
  abstract getItem(slot: number): ItemInstance | null;
  // --- Container.h:31 — pure virtual setItem ---
  abstract setItem(slot: number, item: ItemInstance | null): void;
  // --- Container.h:32 — pure virtual removeItem ---
  abstract removeItem(slot: number, count: number): ItemInstance;

  // --- Container.h:34 — pure virtual getName ---
  abstract getName(): string;
  // --- Container.h:35 — pure virtual getContainerSize ---
  abstract getContainerSize(): number;
  // --- Container.h:36 — pure virtual getMaxStackSize ---
  abstract getMaxStackSize(): number;

  // --- Container.h:38 — pure virtual stillValid ---
  abstract stillValid(player: any): boolean;

  // --- Container.h:40-41 — pure virtual startOpen / stopOpen ---
  abstract startOpen(): void;
  abstract stopOpen(): void;

  // --- Container.h:43-52 — getSlotCopies() ---
  getSlotCopies(): ItemInstance[] {
    const items: ItemInstance[] = [];
    const nullItem = new ItemInstance();
    for (let i = 0; i < this.getContainerSize(); i++) {
      const item = this.getItem(i);
      items.push(item ? item : nullItem);
    }
    return items;
  }
}

export { Container, ContainerType };
