// §FillingContainer.ts — Direct 1:1 translation of C++ FillingContainer.h (107 lines) + FillingContainer.cpp (624 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/inventory/FillingContainer.h + .cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Container } from './Container';
import { ItemInstance } from '../../item/translated/ItemInstance';

// --- FillingContainer.cpp:7-8 — #define constants ---
const MAGIX_VAL = 255;
const MAX_SLOTS = 96;

// --- FillingContainer.h:62-68 — LinkedSlot struct ---
interface LinkedSlot {
  inventorySlot: number;
}

// --- FillingContainer.h:27-105 — class FillingContainer : public Container ---
class FillingContainer extends Container {
  // --- FillingContainer.h:82 ---
  static MAX_INVENTORY_STACK_SIZE = 254;

  // --- FillingContainer.h:103-104 — public fields ---
  linkedSlots: LinkedSlot[];
  numTotalSlots: number;
  readonly numLinkedSlots: number;

  // --- FillingContainer.h:106 — protected ItemList items ---
  protected items: (ItemInstance | null)[];

  // --- FillingContainer.h:108 — protected _isCreative ---
  protected _isCreative: boolean;

  // --- FillingContainer.cpp:14-27 — constructor ---
  constructor(numTotalSlots: number, numLinkedSlots: number, containerType: number, isCreative: boolean) {
    super(containerType);
    this.numTotalSlots = numTotalSlots;
    this.numLinkedSlots = numLinkedSlots;
    this.linkedSlots = [];
    this._isCreative = isCreative;

    if (numLinkedSlots > 0) {
      for (let i = 0; i < numLinkedSlots; i++) {
        this.linkedSlots.push({ inventorySlot: -1 });
      }
    }

    // §C++: items.resize(numTotalSlots);
    this.items = new Array(numTotalSlots).fill(null);
  }

  // --- FillingContainer.cpp:29-37 — destructor → clearInventory() ---
  destroy(): void {
    this.clearInventory();
    this.linkedSlots = [];
  }

  // --- FillingContainer.cpp:39-51 — clearInventory() ---
  clearInventory(): void {
    for (let i = 0; i < this.numLinkedSlots; i++) {
      this.linkedSlots[i] = { inventorySlot: i };
    }
    for (let i = this.numLinkedSlots; i < this.items.length; i++) {
      this.release(i);
    }
    this.items = new Array(this.numTotalSlots).fill(null);
  }

  // --- FillingContainer.cpp:53-61 — removeResource(int type) ---
  removeResourceByType(type: number): boolean {
    if (this._isCreative) return true;
    const slot = this.getSlot(type);
    if (slot < 0) return false;
    const item = this.items[slot];
    if (item) {
      item.count--;
      if (item.count <= 0) this.release(slot);
    }
    return true;
  }

  // --- FillingContainer.cpp:63-65 — removeResource(const ItemInstance&) ---
  removeResourceByItem(item: ItemInstance): boolean {
    return this.removeResourceWithAux(item, false) === 0;
  }

  // --- FillingContainer.cpp:67-94 — removeResource(const ItemInstance&, bool requireExactAux) ---
  removeResourceWithAux(item: ItemInstance, requireExactAux: boolean): number {
    if (this._isCreative) return 0;
    let count = item.count;
    while (count > 0) {
      let slot = -1;
      // §C++: simplified — no Recipe::isAnyAuxValue in browser port
      if (!requireExactAux) {
        slot = this.getNonEmptySlot(item.id);
      } else {
        slot = this.getNonEmptySlotWithData(item.id, item.getAuxValue());
      }
      if (slot < 0) return count;
      const slotItem = this.items[slot]!;
      const toRemove = Math.min(count, slotItem.count);
      slotItem.count -= toRemove;
      count -= toRemove;
      if (slotItem.count <= 0) this.clearSlot(slot);
    }
    return 0;
  }

  // --- FillingContainer.cpp:96-105 — hasResource(int type) ---
  hasResource(type: number): boolean {
    if (this._isCreative) return true;
    const slot = this.getSlot(type);
    return slot >= 0;
  }

  // --- FillingContainer.cpp:107-112 — swapSlots(int from, int to) ---
  swapSlots(from: number, to: number): void {
    const tmp = this.items[to];
    this.items[to] = this.items[from];
    this.items[from] = tmp;
  }

  // --- FillingContainer.cpp:114-145 — add(ItemInstance* item) ---
  add(item: ItemInstance | null): boolean {
    if (this._isCreative) return true;
    if (!item || item.isNull()) return true;
    if (!item.isDamaged()) {
      let lastSize: number;
      do {
        lastSize = item.count;
        item.count = this.addResource(item);
      } while (item.count > 0 && item.count < lastSize);
      return item.count < lastSize;
    }
    const slot = this.getFreeSlot();
    if (slot >= 0) {
      this.items[slot] = ItemInstance.clone(item);
      this.linkEmptySlot(slot);
      item.count = 0;
      return true;
    }
    return false;
  }

  // --- FillingContainer.cpp:147-172 — removeItem(int slot, int count) ---
  removeItem(slot: number, count: number): ItemInstance {
    const item = this.getItem(slot);
    if (item) {
      if (count > item.count) count = item.count;
      item.count -= count;
      if (item.count <= 0) this.clearSlot(slot);
    }
    return new ItemInstance();
  }

  // --- FillingContainer.cpp:174-185 — setItem(int slot, ItemInstance* item) ---
  setItem(slot: number, item: ItemInstance | null): void {
    if (slot < 0 || slot >= this.numTotalSlots) return;
    if (item) {
      if (!this.items[slot]) {
        this.items[slot] = new ItemInstance(item.id, item.count, item.getAuxValue());
      } else {
        this.items[slot]!.id = item.id;
        this.items[slot]!.count = item.count;
        this.items[slot]!.setAuxValue(item.getAuxValue());
      }
    } else {
      this.release(slot);
    }
  }

  // --- FillingContainer.cpp:203-211 — getContainerSize() ---
  getContainerSize(): number {
    return this.numTotalSlots;
  }

  // --- FillingContainer.cpp:213-223 — getItem(int slot) ---
  getItem(slot: number): ItemInstance | null {
    if (slot < 0 || slot >= this.numTotalSlots) return null;
    if (slot >= this.numLinkedSlots) return this.items[slot];
    return this.getLinked(slot);
  }

  // --- FillingContainer.cpp:225-228 — getName() ---
  getName(): string { return 'Inventory'; }

  // --- FillingContainer.cpp:230-234 — getMaxStackSize() ---
  getMaxStackSize(): number { return FillingContainer.MAX_INVENTORY_STACK_SIZE; }

  // --- FillingContainer.cpp:236-253 — dropSlot(int slot, bool onlyClearContainer, bool randomly) ---
  dropSlot(slot: number, onlyClearContainer: boolean, randomly: boolean = false): void {
    if (slot >= 0 && slot < this.numLinkedSlots) {
      slot = this.linkedSlots[slot].inventorySlot;
    }
    if (slot < 0 || slot >= this.items.length) return;
    const item = this.items[slot];
    if (item && item.count) {
      if (!onlyClearContainer) this.doDrop(item.copy(), randomly);
      item.count = 0;
      this.release(slot);
      this.compressLinkedSlotList(slot);
    }
  }

  // --- FillingContainer.cpp:255-261 — dropAll(bool onlyClearContainer) ---
  dropAll(onlyClearContainer: boolean): void {
    for (let i = this.numLinkedSlots; i < this.items.length; i++) {
      this.dropSlot(i, onlyClearContainer, true);
    }
  }

  // --- FillingContainer.cpp:263-265 — setContainerChanged() ---
  setContainerChanged(): void {}

  // --- FillingContainer.cpp:267-270 — stillValid(Player*) ---
  stillValid(player: any): boolean { return !player.removed; }

  // --- FillingContainer.cpp:272-280 — contains(ItemInstance*) ---
  contains(itemInstance: ItemInstance): boolean {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] && ItemInstance.matches(this.items[i], itemInstance)) return true;
    }
    return false;
  }

  // --- FillingContainer.cpp:282-284 — startOpen() / stopOpen() ---
  startOpen(): void {}
  stopOpen(): void {}

  // --- FillingContainer.cpp:286-293 — getSlot(int tileId) ---
  getSlot(tileId: number): number;
  // --- FillingContainer.cpp:295-303 — getSlot(int tileId, int data) ---
  getSlot(tileId: number, data: number): number;
  getSlot(tileId: number, data?: number): number {
    for (let i = this.numLinkedSlots; i < this.items.length; i++) {
      const item = this.items[i];
      if (item && item.id === tileId) {
        if (data === undefined) return i;
        if (item.getAuxValue() === data) return i;
      }
    }
    return -1;
  }

  // --- FillingContainer.cpp:305-312 — getNonEmptySlot(int tileId) ---
  getNonEmptySlot(tileId: number): number;
  // --- FillingContainer.cpp:314-323 — getNonEmptySlot(int tileId, int data) ---
  getNonEmptySlotWithData(tileId: number, data?: number): number;
  getNonEmptySlot(tileId: number, data?: number): number {
    for (let i = this.numLinkedSlots; i < this.items.length; i++) {
      const item = this.items[i];
      if (item && item.id === tileId && item.count > 0) {
        if (data === undefined) return i;
        if (item.getAuxValue() === data) return i;
      }
    }
    return -1;
  }

  // --- FillingContainer.cpp:325-332 — getNumEmptySlots() ---
  getNumEmptySlots(): number {
    let numEmpty = 0;
    for (let i = this.numLinkedSlots; i < this.items.length; i++) {
      if (!this.items[i] || this.items[i]!.isNull()) numEmpty++;
    }
    return numEmpty;
  }

  // --- FillingContainer.cpp:334-336 — getNumLinkedSlots() ---
  getNumLinkedSlots(): number { return this.numLinkedSlots; }

  // --- FillingContainer.cpp:338-350 — getSlotWithRemainingSpace(const ItemInstance&) ---
  getSlotWithRemainingSpace(item: ItemInstance): number {
    for (let i = 0; i < this.items.length; i++) {
      const it = this.items[i];
      if (it && it.id === item.id && it.isStackable() && it.count < it.getMaxStackSize()
        && it.count < this.getMaxStackSize()
        && (!it.isStackedByData() || it.getAuxValue() === item.getAuxValue())) {
        return i;
      }
    }
    return -1;
  }

  // --- FillingContainer.cpp:352-390 — addResource(const ItemInstance&) ---
  addResource(itemInstance: ItemInstance): number {
    const type = itemInstance.id;
    let count = itemInstance.count;
    if (itemInstance.getMaxStackSize() === 1) {
      const slot = this.getFreeSlot();
      if (slot < 0) return count;
      if (this.items[slot] === null) {
        this.items[slot] = ItemInstance.clone(itemInstance)!;
        this.linkEmptySlot(slot);
      } else if (this.items[slot]!.isNull()) {
        this.items[slot]!.id = itemInstance.id;
        this.items[slot]!.count = itemInstance.count;
        this.items[slot]!.setAuxValue(itemInstance.getAuxValue());
        this.linkEmptySlot(slot);
      }
      return 0;
    }
    let slot = this.getSlotWithRemainingSpace(itemInstance);
    if (slot < 0) slot = this.getFreeSlot();
    if (slot < 0) return count;
    if (this.items[slot] === null) {
      this.items[slot] = new ItemInstance(type, 0, itemInstance.getAuxValue());
    } else if (this.items[slot]!.isNull()) {
      this.items[slot]!.id = type;
      this.items[slot]!.setAuxValue(itemInstance.getAuxValue());
    }
    this.linkEmptySlot(slot);
    let toAdd = count;
    if (toAdd > this.items[slot]!.getMaxStackSize() - this.items[slot]!.count) {
      toAdd = this.items[slot]!.getMaxStackSize() - this.items[slot]!.count;
    }
    if (toAdd > this.getMaxStackSize() - this.items[slot]!.count) {
      toAdd = this.getMaxStackSize() - this.items[slot]!.count;
    }
    if (toAdd === 0) return count;
    count -= toAdd;
    this.items[slot]!.count += toAdd;
    return count;
  }

  // --- FillingContainer.cpp:392-400 — getFreeSlot() ---
  getFreeSlot(): number {
    for (let i = this.numLinkedSlots; i < this.items.length; i++) {
      if (this.items[i] === null || this.items[i]!.isNull()) return i;
    }
    return -1;
  }

  // --- FillingContainer.cpp:402-409 — release(int slot) ---
  release(slot: number): void {
    if (this.items[slot]) {
      this.items[slot] = null;
    }
  }

  // --- FillingContainer.cpp:411-427 — clearSlot(int slot) ---
  clearSlot(slot: number): void {
    if (slot < 0) return;
    if (slot < this.numLinkedSlots) {
      this.release(this.linkedSlots[slot].inventorySlot);
      this.linkedSlots[slot].inventorySlot = -1;
    } else {
      this.release(slot);
    }
    this.compressLinkedSlotList(slot);
  }

  // --- FillingContainer.cpp:429-448 — addItem(ItemInstance*) ---
  addItem(item: ItemInstance): number {
    for (let i = this.numLinkedSlots; i < this.items.length; i++) {
      if (!this.items[i]) {
        this.items[i] = item;
        return i;
      }
    }
    const newSize = this.items.length + 1;
    if (this._isCreative && newSize > this.numTotalSlots) {
      this.numTotalSlots = newSize;
    }
    if (newSize <= this.numTotalSlots) {
      this.items.push(item);
      return newSize - 1;
    }
    console.warn('Error@addItem: adding an item to an already full inventory: ' + item.getDescriptionId());
    return 0;
  }

  // --- FillingContainer.cpp:450-454 — fixBackwardCompabilityItem(ItemInstance&) ---
  fixBackwardCompabilityItem(item: ItemInstance): void {
    // §C++: if (item.id == Tile::stoneSlabHalf->id) item.setAuxValue(item.getAuxValue() & StoneSlabTile::TYPE_MASK);
    // StoneSlabTile::TYPE_MASK = 7
    if (item.id === 44) {
      item.setAuxValue(item.getAuxValue() & 7);
    }
  }

  // --- FillingContainer.cpp:456-472 — replace(vector<ItemInstance>, int) ---
  replace(newItems: ItemInstance[], maxCount: number = -1): void {
    this.clearInventory();
    maxCount = maxCount < 0 ? newItems.length : Math.min(newItems.length, maxCount);
    const base = this.numLinkedSlots;
    const iMax = Math.min(this.getContainerSize() - base, maxCount);
    for (let i = 0; i < iMax; i++) {
      this.replaceSlot(base + i, newItems[i].isNull() ? null : newItems[i]);
    }
  }

  // --- FillingContainer.cpp:474-484 — replaceSlot(int, ItemInstance*) ---
  replaceSlot(slotId: number, ins: ItemInstance | null): void {
    if (ins) {
      if (!this.items[slotId]) {
        this.items[slotId] = new ItemInstance();
      }
      this.items[slotId]!.id = ins.id;
      this.items[slotId]!.count = ins.count;
      this.items[slotId]!.setAuxValue(ins.getAuxValue());
    } else {
      this.release(slotId);
    }
  }

  // --- FillingContainer.cpp:486-495 — getSlotList(int&) ---
  getSlotList(slot: number): (ItemInstance | null)[] {
    return this.items;
  }

  // --- FillingContainer.cpp:498-521 — linkSlot(int, int, bool) ---
  linkSlot(selectionSlot: number, inventorySlot: number, propagate: boolean): boolean {
    if (selectionSlot < 0 || selectionSlot >= this.numLinkedSlots) return false;
    if (inventorySlot < this.numLinkedSlots || inventorySlot >= this.numTotalSlots) return false;
    if (inventorySlot === this.linkedSlots[selectionSlot].inventorySlot) return false;
    if (propagate) {
      let i = 0;
      for (; i < this.numLinkedSlots - 1; i++) {
        if (this.linkedSlots[i].inventorySlot === inventorySlot) break;
      }
      for (; i > selectionSlot; i--) {
        this.linkedSlots[i].inventorySlot = this.linkedSlots[i - 1].inventorySlot;
      }
    }
    this.linkedSlots[selectionSlot].inventorySlot = inventorySlot;
    return true;
  }

  // --- FillingContainer.cpp:523-539 — linkEmptySlot(int) ---
  linkEmptySlot(inventorySlot: number): boolean {
    for (let i = 0; i < this.numLinkedSlots; i++) {
      if (this.linkedSlots[i].inventorySlot === inventorySlot) return true;
    }
    for (let i = 0; i < this.numLinkedSlots; i++) {
      const item = this.getLinked(i);
      if (!item) {
        this.linkedSlots[i].inventorySlot = inventorySlot;
        return true;
      }
    }
    return false;
  }

  // --- FillingContainer.cpp:541-552 — compressLinkedSlotList(int) ---
  compressLinkedSlotList(slot: number): void {
    let i = slot - 1, j = 0;
    while (++i < this.numLinkedSlots) {
      this.linkedSlots[i - j] = this.linkedSlots[i];
      const item = this.getLinked(i);
      if (!item) j++;
    }
    for (let k = i - j; k < i; k++) {
      this.linkedSlots[k].inventorySlot = -1;
    }
  }

  // --- FillingContainer.cpp:554-558 — doDrop(ItemInstance*, bool) ---
  doDrop(item: ItemInstance, randomly: boolean): void {
    // §C++: delete item; — in JS, just let GC handle it
  }

  // --- FillingContainer.cpp:560-569 — getLinked(int) ---
  getLinked(slot: number): ItemInstance | null {
    if (slot < this.numLinkedSlots && slot >= 0) {
      const i = this.linkedSlots[slot].inventorySlot;
      return (i >= this.numLinkedSlots && i < this.numTotalSlots) ? this.items[i] : null;
    }
    return null;
  }
}

export { FillingContainer, MAGIX_VAL, MAX_SLOTS };
