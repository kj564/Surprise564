// §MCPE 2013 SynchedEntityData — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   SynchedEntityData.h:12-56    — DataItem base class + dirty tracking
//   SynchedEntityData.h:58-76    — DataItem2<T> template (flag set/clear/get)
//   SynchedEntityData.h:104-249  — SynchedEntityData class
//   SynchedEntityData.h:114-121  — TYPE_BYTE/SHORT/INT/FLOAT/STRING/ITEMINSTANCE/POS
//   SynchedEntityData.h:124-128  — TYPE_MASK / TYPE_SHIFT / MAX_ID_VALUE
//
// This is a pure data layer. Packet pack/unpack (§SynchedEntityData.h:229-235)
// is the browser layer's job; this class only tracks values and dirty state.

/** §SynchedEntityData.h:114 — `static const int TYPE_BYTE = 0;` */
export const TYPE_BYTE = 0;
/** §SynchedEntityData.h:115 — `static const int TYPE_SHORT = 1;` */
export const TYPE_SHORT = 1;
/** §SynchedEntityData.h:116 — `static const int TYPE_INT = 2;` */
export const TYPE_INT = 2;
/** §SynchedEntityData.h:117 — `static const int TYPE_FLOAT = 3;` */
export const TYPE_FLOAT = 3;
/** §SynchedEntityData.h:118 — `static const int TYPE_STRING = 4;` */
export const TYPE_STRING = 4;
/** §SynchedEntityData.h:120 — `static const int TYPE_ITEMINSTANCE = 5;` */
export const TYPE_ITEMINSTANCE = 5;
/** §SynchedEntityData.h:121 — `static const int TYPE_POS = 6;` */
export const TYPE_POS = 6;

/** §SynchedEntityData.h:114-121 — union of all DataItem type codes. */
export type DataItemType =
  | typeof TYPE_BYTE
  | typeof TYPE_SHORT
  | typeof TYPE_INT
  | typeof TYPE_FLOAT
  | typeof TYPE_STRING
  | typeof TYPE_ITEMINSTANCE
  | typeof TYPE_POS;

/** §SynchedEntityData.h:124 — `static const int TYPE_MASK = 0xe0;` (top 3 bits). */
export const TYPE_MASK = 0xe0;
/** §SynchedEntityData.h:125 — `static const int TYPE_SHIFT = 5;` */
export const TYPE_SHIFT = 5;
/** §SynchedEntityData.h:128 — `static const int MAX_ID_VALUE = ~TYPE_MASK & 0xff;` = 0x1f = 31. */
export const MAX_ID_VALUE = (~TYPE_MASK) & 0xff;

/** §SynchedEntityData.h:106 — `static const int MAX_STRING_DATA_LENGTH = 64;` */
export const MAX_STRING_DATA_LENGTH = 64;
/** §SynchedEntityData.h:107 — `static const int EOF_MARKER = 0x7f;` */
export const EOF_MARKER = 0x7f;

/** §SynchedEntityData.h:109-113 — supported DataItem payload types.
 *  Byte/Short/Int use number; String uses string. ItemInstance/Pos are
 *  ported as their VoxelCraft equivalents (ItemStack / Pos). */
export type DataValue = number | string | null;

/**
 * §SynchedEntityData.h:12-56 — base DataItem: (type,id,dirty) triple.
 * Concrete payloads live in DataItem2<T>; here we carry the payload opaquely.
 */
export interface DataItem {
  /** §SynchedEntityData.h:40 — `const int type;` */
  readonly type: DataItemType;
  /** §SynchedEntityData.h:41 — `const int id;` */
  readonly id: number;
  /** §SynchedEntityData.h:29-35 — `bool dirty;` toggled by set()/markDirty(). */
  dirty: boolean;
  /** §SynchedEntityData.h:75 — `T data;` payload (typed by DataItemType). */
  data: DataValue;
}

/** §SynchedEntityData.h:58-76 — DataItem2<T> flag-bit helpers. */
function setFlagBit(item: DataItem, flag: number): void {
  if (typeof item.data !== 'number') {
    throw new TypeError('setFlag only valid on numeric DataItems (byte/short/int)');
  }
  // §SynchedEntityData.h:67 — `data = data | (1 << flag);`
  item.data = (item.data as number) | (1 << flag);
}

function clearFlagBit(item: DataItem, flag: number): void {
  if (typeof item.data !== 'number') {
    throw new TypeError('clearFlag only valid on numeric DataItems (byte/short/int)');
  }
  // §SynchedEntityData.h:70 — `data = data & ~(1 << flag);`
  item.data = (item.data as number) & ~(1 << flag);
}

function getFlagBit(item: DataItem, flag: number): boolean {
  if (typeof item.data !== 'number') {
    throw new TypeError('getFlag only valid on numeric DataItems (byte/short/int)');
  }
  // §SynchedEntityData.h:73 — `return (data & (1 << flag)) != 0;`
  return ((item.data as number) & (1 << flag)) !== 0;
}

/** Resolve the §SynchedEntityData.h:138-144 type code for a payload value. */
function typeOf(value: DataValue): DataItemType {
  if (typeof value === 'string') return TYPE_STRING;
  if (typeof value === 'number') {
    // §SynchedEntityData.h:138 — getTypeId(TypeChar) → TYPE_BYTE.
    // The C++ template dispatches by C++ type; we mirror the most common
    // case (TypeChar/signed char) since every DataItem2<char> define() in
    // the rujukan entity tree uses byte.
    return TYPE_BYTE;
  }
  throw new TypeError('Unsupported DataItem payload type');
}

/**
 * §SynchedEntityData.h:104-249 — synchronized entity data.
 *
 * Mirrors the rujukan `SynchedEntityData` class: typed DataItems keyed by
 * a small int ID, with dirty tracking used by the network/persistence layer.
 * Packet pack/unpack (§SynchedEntityData.h:229-235) is the browser layer's
 * responsibility — this class never touches wire formats.
 */
export class SynchedEntityData {
  /** §SynchedEntityData.h:247 — `Map itemsById;` (id → DataItem). */
  private readonly itemsById = new Map<number, DataItem>();
  /** §SynchedEntityData.h:248 — `bool _isDirty;` */
  private dirty = false;

  /**
   * §SynchedEntityData.h:146-162 — `template <class T> void define(int idd, const T& value)`.
   * Defines a new typed DataItem. Silently no-ops on duplicate IDs / overflow
   * (matching the C++ `LOGE` + return behaviour).
   */
  define<T extends DataValue>(id: number, value: T): void {
    // §SynchedEntityData.h:150-153 — `if (idd > MAX_ID_VALUE) { LOGE(...); return; }`
    if (!Number.isSafeInteger(id) || id < 0 || id > MAX_ID_VALUE) return;
    // §SynchedEntityData.h:155-158 — `if (itemsById.find(idd) != itemsById.end()) { LOGE(...); return; }`
    if (this.itemsById.has(id)) return;
    const type = typeOf(value);
    // §SynchedEntityData.h:17 — `dirty(true)` in DataItem ctor.
    const item: DataItem = { type, id, dirty: true, data: value };
    this.itemsById.set(id, item);
    // A newly-defined item is conceptually dirty (it has not been broadcast).
    this.dirty = true;
  }

  /** §SynchedEntityData.h:164 — `TypeChar getByte(int id) const;` */
  getByte(id: number): number {
    return this.getNumber(id);
  }
  /** §SynchedEntityData.h:165 — `TypeShort getShort(int id) const;` */
  getShort(id: number): number {
    return this.getNumber(id);
  }
  /** §SynchedEntityData.h:166 — `TypeInt getInt(int id) const;` */
  getInt(id: number): number {
    return this.getNumber(id);
  }
  /** §SynchedEntityData.h:167 — `TypeFloat getFloat(int id) const;` */
  getFloat(id: number): number {
    return this.getNumber(id);
  }
  /** §SynchedEntityData.h:168 — `std::string getString(int id) const;` */
  getString(id: number): string {
    const item = this.require(id);
    if (typeof item.data !== 'string') {
      throw new TypeError('DataItem ' + id + ' is not a string');
    }
    return item.data;
  }

  private getNumber(id: number): number {
    const item = this.require(id);
    if (typeof item.data !== 'number') {
      throw new TypeError('DataItem ' + id + ' is not numeric');
    }
    return item.data;
  }

  private require(id: number): DataItem {
    const item = this.itemsById.get(id);
    if (!item) {
      // §SynchedEntityData.h:178-181 — `if (!dataItem) { LOGE("DataItem not found!"); return; }`
      throw new Error('DataItem not found: ' + id);
    }
    return item;
  }

  /**
   * §SynchedEntityData.h:172-192 — `template <class T> void set(int id, const T& value)`.
   * Marks the item dirty only when the new value differs from the old one.
   */
  set<T extends DataValue>(id: number, value: T): void {
    const item = this.itemsById.get(id);
    // §SynchedEntityData.h:178-181 — `if (!dataItem) { LOGE(...); return; }`
    if (!item) return;
    // §SynchedEntityData.h:182 — `if (dataItem->getType() == getTypeId(value)) { ... }`
    if (item.type !== typeOf(value)) {
      // §SynchedEntityData.h:190 — `LOGE("ERROR: Id %d is not correct type. %d != %d!", ...)`
      return;
    }
    // §SynchedEntityData.h:184 — `if (!(d->data == value)) { d->data = value; ... }`
    if (item.data !== value) {
      item.data = value;
      // §SynchedEntityData.h:186 — `dataItem->setDirty(true);`
      item.dirty = true;
      // §SynchedEntityData.h:187 — `_isDirty = true;`
      this.dirty = true;
    }
  }

  /** §SynchedEntityData.h:194-202 — `template <class T> void setFlag(int id, int flag);` */
  setFlag(id: number, flag: number): void {
    const item = this.itemsById.get(id);
    if (!item) return;
    const oldFlag = getFlagBit(item, flag);
    setFlagBit(item, flag);
    if (getFlagBit(item, flag) !== oldFlag) {
      // §SynchedEntityData.h:200 — `markDirty(id);`
      this.markDirty(id);
    }
  }

  /** §SynchedEntityData.h:204-212 — `template <class T> void clearFlag(int id, int flag);` */
  clearFlag(id: number, flag: number): void {
    const item = this.itemsById.get(id);
    if (!item) return;
    const oldFlag = getFlagBit(item, flag);
    clearFlagBit(item, flag);
    if (getFlagBit(item, flag) !== oldFlag) {
      this.markDirty(id);
    }
  }

  /** §SynchedEntityData.h:214-218 — `template <class T> bool getFlag(int id, int flag);` */
  getFlag(id: number, flag: number): boolean {
    const item = this.itemsById.get(id);
    if (!item) return false;
    return getFlagBit(item, flag);
  }

  /** §SynchedEntityData.h:220-223 — `void markDirty(int id)`. */
  markDirty(id: number): void {
    const item = this.itemsById.get(id);
    if (!item) return;
    item.dirty = true;
    this.dirty = true;
  }

  /** §SynchedEntityData.h:225-227 — `bool isDirty() const { return _isDirty; }`. */
  isDirty(): boolean {
    return this.dirty;
  }

  /** Clear the global dirty flag (e.g. after a snapshot was sent). Not in rujukan
   *  but the natural counterpart to `markDirty` for the renderer-side poll. */
  clearDirty(): void {
    this.dirty = false;
    for (const item of this.itemsById.values()) item.dirty = false;
  }

  /** Snapshot access for persistence/rendering adapters — does not mutate state. */
  getItem(id: number): DataItem | undefined {
    return this.itemsById.get(id);
  }

  /** §SynchedEntityData.h:132 — `typedef std::vector<DataItem*> DataList;` — iterates all items. */
  items(): readonly DataItem[] {
    return [...this.itemsById.values()];
  }
}
