// §ItemInstance.ts — Direct 1:1 translation of C++ ItemInstance.h (116 lines) + ItemInstance.cpp (292 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/item/ItemInstance.h + .cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- ItemInstance.h:22 — class ItemInstance ---
// §C++: class ItemInstance { public: int count; int id; private: int auxValue; }
class ItemInstance {
  // --- ItemInstance.h:105 ---
  count: number;
  // --- ItemInstance.h:107 ---
  id: number;
  // --- ItemInstance.h:114 — private auxValue (was "damage", now multi-purpose) ---
  private auxValue: number;

  // --- ItemInstance.cpp:7-9 — ItemInstance() default constructor ---
  constructor();
  // --- ItemInstance.cpp:11-13 — ItemInstance(const Tile* tile) ---
  constructor(tile: { id: number });
  // --- ItemInstance.cpp:15-17 — ItemInstance(const Tile* tile, int count) ---
  constructor(tile: { id: number }, count: number);
  // --- ItemInstance.cpp:19-21 — ItemInstance(const Tile* tile, int count, int auxValue) ---
  constructor(tile: { id: number }, count: number, auxValue: number);
  // --- ItemInstance.cpp:23-25 — ItemInstance(const Item* item) ---
  constructor(item: { id: number });
  // --- ItemInstance.cpp:27-29 — ItemInstance(const Item* item, int count) ---
  constructor(item: { id: number }, count: number);
  // --- ItemInstance.cpp:31-33 — ItemInstance(const Item* item, int count, int auxValue) ---
  constructor(item: { id: number }, count: number, auxValue: number);
  // --- ItemInstance.cpp:35-37 — ItemInstance(int id, int count, int damage) ---
  constructor(id: number, count: number, auxValue: number);

  // --- Unified constructor implementation ---
  constructor(arg1: any, arg2?: any, arg3?: any) {
    if (arg1 === undefined) {
      // ItemInstance.cpp:7-9 — default constructor
      this.init(0, 0, 0);
    } else if (typeof arg1 === 'number') {
      // ItemInstance.cpp:35-37 — ItemInstance(int id, int count, int damage)
      this.init(arg1, arg2, arg3);
    } else {
      // arg1 is Tile* or Item* — use arg1.id
      // ItemInstance.cpp:11-21 — Tile variants
      // ItemInstance.cpp:23-33 — Item variants
      const id = arg1.id;
      const count = arg2 ?? 1;
      const aux = arg3 ?? 0;
      this.init(id, count, aux);
    }
  }

  // --- ItemInstance.cpp:39-43 — init(int id, int count, int damage) ---
  init(id: number, count: number, damage: number): void {
    this.id = id;
    this.count = count;
    this.auxValue = damage;
  }

  // --- ItemInstance.cpp:45-47 — isNull() ---
  isNull(): boolean {
    return (this.id | this.count | this.auxValue) === 0;
  }

  // --- ItemInstance.cpp:49-51 — setNull() ---
  setNull(): void {
    this.id = this.count = this.auxValue = 0;
  }

  // --- ItemInstance.cpp:57-60 — remove(int count) ---
  remove(count: number): ItemInstance {
    this.count -= count;
    return new ItemInstance(this.id, count, this.auxValue);
  }

  // --- ItemInstance.cpp:62-69 — useOn() ---
  useOn(player: any, level: any, x: number, y: number, z: number, face: number, clickX: number, clickY: number, clickZ: number): boolean {
    const item = this.getItem();
    if (item && item.useOn && item.useOn(this, player, level, x, y, z, face, clickX, clickY, clickZ)) {
      return true;
    }
    return false;
  }

  // --- ItemInstance.cpp:71-73 — getDestroySpeed(Tile* tile) ---
  getDestroySpeed(tile: any): number {
    const item = this.getItem();
    return item ? item.getDestroySpeed(this, tile) : 1;
  }

  // --- ItemInstance.cpp:75-77 — use(Level*, Player*) ---
  use(level: any, player: any): ItemInstance | null {
    const item = this.getItem();
    return item ? item.use(this, level, player) : null;
  }

  // --- ItemInstance.cpp:79-81 — getMaxStackSize() ---
  getMaxStackSize(): number {
    const item = this.getItem();
    return item ? item.getMaxStackSize() : 64;
  }

  // --- ItemInstance.cpp:83-85 — isStackable() ---
  isStackable(): boolean {
    return this.getMaxStackSize() > 1 && (!this.isDamageableItem() || !this.isDamaged());
  }

  // --- ItemInstance.cpp:87-90 — isStackable(a, b) static ---
  static isStackableStatic(a: ItemInstance | null, b: ItemInstance | null): boolean {
    return !!(a && b && a.id === b.id && b.isStackable()
      && (!b.isStackedByData() || a.getAuxValue() === b.getAuxValue()));
  }

  // --- ItemInstance.cpp:92-94 — isDamageableItem() ---
  isDamageableItem(): boolean {
    const item = this.getItem();
    return item ? item.getMaxDamage() > 0 : false;
  }

  // --- ItemInstance.cpp:100-102 — isStackedByData() ---
  isStackedByData(): boolean {
    const item = this.getItem();
    return item ? item.isStackedByData() : false;
  }

  // --- ItemInstance.cpp:104-106 — isDamaged() ---
  isDamaged(): boolean {
    return this.isDamageableItem() && this.auxValue > 0;
  }

  // --- ItemInstance.cpp:108-110 — getDamageValue() ---
  getDamageValue(): number {
    return this.auxValue;
  }

  // --- ItemInstance.cpp:112-114 — getAuxValue() ---
  getAuxValue(): number {
    return this.auxValue;
  }

  // --- ItemInstance.cpp:115-117 — setAuxValue(int value) ---
  setAuxValue(value: number): void {
    this.auxValue = value;
  }

  // --- ItemInstance.cpp:119-121 — getMaxDamage() ---
  getMaxDamage(): number {
    const item = this.getItem();
    return item ? item.getMaxDamage() : 0;
  }

  // --- ItemInstance.cpp:123-133 — hurt(int i) ---
  hurt(i: number): void {
    if (!this.isDamageableItem()) return;
    this.auxValue += i;
    if (this.auxValue > this.getMaxDamage()) {
      this.count--;
      if (this.count < 0) this.count = 0;
      this.auxValue = 0;
    }
  }

  // --- ItemInstance.cpp:135-137 — hurtEnemy(Mob* mob) ---
  hurtEnemy(mob: any): void {
    const item = this.getItem();
    if (item && item.hurtEnemy) item.hurtEnemy(this, mob);
  }

  // --- ItemInstance.cpp:139-141 — mineBlock(int tile, int x, int y, int z) ---
  mineBlock(tile: number, x: number, y: number, z: number): void {
    const item = this.getItem();
    if (item && item.mineBlock) item.mineBlock(this, tile, x, y, z);
  }

  // --- ItemInstance.cpp:143-145 — getAttackDamage(Entity*) ---
  getAttackDamage(entity: any): number {
    const item = this.getItem();
    return item ? item.getAttackDamage(entity) : 0;
  }

  // --- ItemInstance.cpp:147-149 — canDestroySpecial(Tile*) ---
  canDestroySpecial(tile: any): boolean {
    const item = this.getItem();
    return item ? item.canDestroySpecial(tile) : false;
  }

  // --- ItemInstance.cpp:151-153 — snap(Player*) ---
  snap(player: any): void {
    // §C++: empty implementation
  }

  // --- ItemInstance.cpp:155-157 — interactEnemy(Mob*) ---
  interactEnemy(mob: any): void {
    const item = this.getItem();
    if (item && item.interactEnemy) item.interactEnemy(this, mob);
  }

  // --- ItemInstance.cpp:159-161 — copy() ---
  copy(): ItemInstance {
    return new ItemInstance(this.id, this.count, this.auxValue);
  }

  // --- ItemInstance.cpp:163-168 — matches(a, b) static ---
  static matches(a: ItemInstance | null, b: ItemInstance | null): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a.matchesInternal(b);
  }

  // --- ItemInstance.cpp:170-178 — matchesNulls(a, b) static ---
  static matchesNulls(a: ItemInstance | null, b: ItemInstance | null): boolean {
    const aNull = !a || a.isNull();
    const bNull = !b || b.isNull();
    if (aNull && bNull) return true;
    if (aNull || bNull) return false;
    return a!.matchesInternal(b!);
  }

  // --- ItemInstance.cpp:180-186 — sameItem(ItemInstance* b) ---
  sameItem(b: ItemInstance): boolean {
    return this.id === b.id && this.auxValue === b.auxValue;
  }

  // --- ItemInstance.cpp:188-190 — getDescriptionId() ---
  getDescriptionId(): string {
    return this.id ? this.getItem()?.getDescriptionId(this) ?? 'EmptyItemInstance' : 'EmptyItemInstance';
  }

  // --- ItemInstance.cpp:192-194 — setDescriptionId() ---
  setDescriptionId(id: string): this {
    return this;
  }

  // --- ItemInstance.cpp:196-198 — getName() ---
  getName(): string {
    return this.getDescriptionId() + '.name';
  }

  // --- ItemInstance.cpp:200-204 — toString() ---
  toString(): string {
    return this.count + ' x ' + this.getDescriptionId() + '(' + this.id + ')' + '@' + this.auxValue;
  }

  // --- ItemInstance.cpp:206-208 — clone(item) static ---
  static clone(item: ItemInstance | null): ItemInstance | null {
    return item === null ? null : item.copy();
  }

  // --- ItemInstance.cpp:210-212 — cloneSafe(item) static ---
  static cloneSafe(item: ItemInstance | null): ItemInstance {
    return item ? item.copy() : new ItemInstance();
  }

  // --- ItemInstance.cpp:214-217 — matches(b) private ---
  private matchesInternal(b: ItemInstance): boolean {
    return this.id === b.id && this.count === b.count && this.auxValue === b.auxValue;
  }

  // --- ItemInstance.cpp:219-224 — save(CompoundTag*) ---
  save(tag: any): any {
    tag.putShort('id', this.id);
    tag.putByte('Count', this.count);
    tag.putShort('Damage', this.auxValue);
    return tag;
  }

  // --- ItemInstance.cpp:226-230 — load(CompoundTag*) ---
  load(tag: any): void {
    this.id = tag.getShort('id');
    this.count = tag.getByte('Count');
    this.auxValue = tag.getShort('Damage');
  }

  // --- ItemInstance.cpp:232-238 — operator==(rhs) ---
  equals(rhs: ItemInstance): boolean {
    return this.id === rhs.id && this.auxValue === rhs.auxValue && this.count === rhs.count;
  }

  // --- ItemInstance.cpp:240-249 — fromTag(CompoundTag*) static ---
  static fromTag(tag: any): ItemInstance | null {
    const item = new ItemInstance();
    item.load(tag);
    if (item.getItem() === null) {
      return null;
    }
    return item;
  }

  // --- ItemInstance.cpp:251-253 — getItem() ---
  getItem(): any {
    // §C++: return Item::items[id];
    // In browser port, items are registered via a global items array
    return (globalThis as any).Item_items?.[this.id] ?? null;
  }

  // --- ItemInstance.cpp:255-257 — getIcon() ---
  getIcon(): number {
    const item = this.getItem();
    return item ? item.getIcon(this.auxValue) : 0;
  }

  // --- ItemInstance.cpp:258-260 — releaseUsing() ---
  releaseUsing(level: any, player: any, durationLeft: number): void {
    const item = this.getItem();
    if (item && item.releaseUsing) item.releaseUsing(this, level, player, durationLeft);
  }

  // --- ItemInstance.cpp:262-264 — getUseDuration() ---
  getUseDuration(): number {
    const item = this.getItem();
    return item ? item.getUseDuration(this) : 0;
  }

  // --- ItemInstance.cpp:266-268 — getUseAnimation() ---
  getUseAnimation(): any {
    const item = this.getItem();
    return item ? item.getUseAnimation() : null;
  }

  // --- ItemInstance.cpp:270-272 — useTimeDepleted() ---
  useTimeDepleted(level: any, player: any): ItemInstance {
    const item = this.getItem();
    return item ? item.useTimeDepleted(this, level, player) : this;
  }

  // --- ItemInstance.cpp:274-284 — isArmorItem(instance) static ---
  static isArmorItem(instance: ItemInstance | null): boolean {
    if (!instance) return false;
    const item = instance.getItem();
    if (!item) return false;
    return item.isArmor ? item.isArmor() : false;
  }
}

export { ItemInstance };
