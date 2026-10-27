// Tile entity tests — verifies ported logic against C++ source citations.
import { describe, it, expect } from 'bun:test';
import { FurnaceTileEntity, FURNACE_BURN_INTERVAL, SLOT_INGREDIENT, SLOT_FUEL, SLOT_RESULT } from './furnace-tile-entity';
import { ChestTileEntity, CHEST_SIZE } from './chest-tile-entity';
import { SignTileEntity, SIGN_MAX_LINE_LENGTH, SIGN_NUM_LINES } from './sign-tile-entity';
import { TILE_ENTITY_FURNACE, TILE_ENTITY_CHEST, TILE_ENTITY_SIGN } from './tile-entity';
import { createTileEntity } from './tile-entity-factory';

describe('TileEntity factory (§TileEntity.h:21)', () => {
  it('creates furnace (§TileEntityType::Furnace = 1)', () => {
    const te = createTileEntity(TILE_ENTITY_FURNACE);
    expect(te).toBeInstanceOf(FurnaceTileEntity);
    expect(te!.type).toBe(1);
  });

  it('creates chest (§TileEntityType::Chest = 2)', () => {
    const te = createTileEntity(TILE_ENTITY_CHEST);
    expect(te).toBeInstanceOf(ChestTileEntity);
    expect(te!.type).toBe(2);
  });

  it('creates sign (§TileEntityType::Sign = 4)', () => {
    const te = createTileEntity(TILE_ENTITY_SIGN);
    expect(te).toBeInstanceOf(SignTileEntity);
    expect(te!.type).toBe(4);
  });
});

describe('FurnaceTileEntity (§FurnaceTileEntity.cpp)', () => {
  it('BURN_INTERVAL = 200 ticks (§FurnaceTileEntity.h:23 — 10 * 20)', () => {
    expect(FURNACE_BURN_INTERVAL).toBe(200);
  });

  it('starts with 3 empty slots (§FurnaceTileEntity.h:24 — NumItems = 3)', () => {
    const f = new FurnaceTileEntity();
    expect(f.items.length).toBe(3);
    expect(f.getItem(SLOT_INGREDIENT)).toBeNull();
    expect(f.getItem(SLOT_FUEL)).toBeNull();
    expect(f.getItem(SLOT_RESULT)).toBeNull();
  });

  it('isSlotEmpty returns true for empty slots (§FurnaceTileEntity.cpp:124)', () => {
    const f = new FurnaceTileEntity();
    expect(f.isSlotEmpty(SLOT_INGREDIENT)).toBe(true);
  });

  it('isLit returns false initially (§FurnaceTileEntity.cpp:122)', () => {
    const f = new FurnaceTileEntity();
    expect(f.isLit()).toBe(false);
  });

  it('shouldSave false when empty (§FurnaceTileEntity.cpp:49-53)', () => {
    const f = new FurnaceTileEntity();
    expect(f.shouldSave()).toBe(false);
  });

  it('shouldSave true when has items', () => {
    const f = new FurnaceTileEntity();
    f.setItem(SLOT_INGREDIENT, { itemKey: 'ironOre', count: 1, maxStackSize: 64 });
    expect(f.shouldSave()).toBe(true);
  });

  it('getBurnDuration: wood = 300 ticks (§FurnaceTileEntity.cpp:209)', () => {
    const f = new FurnaceTileEntity();
    expect(f.getBurnDuration({ itemKey: 'oak_planks', count: 1, maxStackSize: 64 })).toBe(300);
    expect(f.getBurnDuration({ itemKey: 'oak_log', count: 1, maxStackSize: 64 })).toBe(300);
  });

  it('getBurnDuration: stick = 100 ticks (§FurnaceTileEntity.cpp:210)', () => {
    const f = new FurnaceTileEntity();
    expect(f.getBurnDuration({ itemKey: 'stick', count: 1, maxStackSize: 64 })).toBe(100);
  });

  it('getBurnDuration: coal = 1600 ticks (§FurnaceTileEntity.cpp:211)', () => {
    const f = new FurnaceTileEntity();
    expect(f.getBurnDuration({ itemKey: 'coal', count: 1, maxStackSize: 64 })).toBe(1600);
  });

  it('getBurnDuration: non-fuel = 0', () => {
    const f = new FurnaceTileEntity();
    expect(f.getBurnDuration({ itemKey: 'stone', count: 1, maxStackSize: 64 })).toBe(0);
    expect(f.getBurnDuration(null)).toBe(0);
  });

  it('isFuel static method (§FurnaceTileEntity.cpp:218)', () => {
    expect(FurnaceTileEntity.isFuel({ itemKey: 'coal', count: 1, maxStackSize: 64 })).toBe(true);
    expect(FurnaceTileEntity.isFuel({ itemKey: 'stone', count: 1, maxStackSize: 64 })).toBe(false);
    expect(FurnaceTileEntity.isFuel(null)).toBe(false);
  });

  it('tick decrements litTime (§FurnaceTileEntity.cpp:136)', () => {
    const f = new FurnaceTileEntity();
    f.litTime = 10;
    f.tick();
    expect(f.litTime).toBe(9);
  });

  it('save/load roundtrip preserves items (§FurnaceTileEntity.cpp:89-106)', () => {
    const f = new FurnaceTileEntity();
    f.setItem(SLOT_INGREDIENT, { itemKey: 'ironOre', count: 2, maxStackSize: 64 });
    f.litTime = 50;
    f.tickCount = 30;
    const tag: Record<string, unknown> = {};
    f.save(tag);
    expect(tag.BurnTime).toBe(50);
    expect(tag.CookTime).toBe(30);
    const f2 = new FurnaceTileEntity();
    f2.load(tag);
    expect(f2.litTime).toBe(50);
    expect(f2.tickCount).toBe(30);
    expect(f2.getItem(SLOT_INGREDIENT)?.itemKey).toBe('ironOre');
  });
});

describe('ChestTileEntity (§ChestTileEntity.cpp)', () => {
  it('has 27 slots (§ChestTileEntity.h:47 — ItemsSize = 9*3)', () => {
    expect(CHEST_SIZE).toBe(27);
    const c = new ChestTileEntity();
    expect(c.items.length).toBe(27);
  });

  it('shouldSave false when empty', () => {
    const c = new ChestTileEntity();
    expect(c.shouldSave()).toBe(false);
  });

  it('shouldSave true when has items', () => {
    const c = new ChestTileEntity();
    c.setItem(0, { itemKey: 'stone', count: 64, maxStackSize: 64 });
    expect(c.shouldSave()).toBe(true);
  });

  it('getName returns container.chest (§ChestTileEntity.cpp:56)', () => {
    expect(new ChestTileEntity().getName()).toBe('container.chest');
  });

  it('startOpen/stopOpen track viewer count', () => {
    const c = new ChestTileEntity();
    expect(c.openCount).toBe(0);
    c.startOpen();
    c.startOpen();
    expect(c.openCount).toBe(2);
    c.stopOpen();
    expect(c.openCount).toBe(1);
  });

  it('save/load roundtrip preserves items', () => {
    const c = new ChestTileEntity();
    c.setItem(5, { itemKey: 'dirt', count: 32, maxStackSize: 64 });
    const tag: Record<string, unknown> = {};
    c.save(tag);
    const c2 = new ChestTileEntity();
    c2.load(tag);
    expect(c2.getItem(5)?.itemKey).toBe('dirt');
    expect(c2.getItem(5)?.count).toBe(32);
  });
});

describe('SignTileEntity (§SignTileEntity.cpp)', () => {
  it('has 4 empty lines initially', () => {
    const s = new SignTileEntity();
    expect(s.messages.length).toBe(SIGN_NUM_LINES);
    expect(s.messages.every(m => m === '')).toBe(true);
  });

  it('MAX_LINE_LENGTH = 15 (§SignTileEntity.h:12)', () => {
    expect(SIGN_MAX_LINE_LENGTH).toBe(15);
  });

  it('shouldSave always true (§SignTileEntity.cpp:37)', () => {
    expect(new SignTileEntity().shouldSave()).toBe(true);
  });

  it('isEditable true initially, false after load (§SignTileEntity.cpp:24)', () => {
    const s = new SignTileEntity();
    expect(s.isEditable()).toBe(true);
    s.load({ Text1: 'Hello', Text2: '', Text3: '', Text4: '' });
    expect(s.isEditable()).toBe(false);
    expect(s.messages[0]).toBe('Hello');
  });

  it('clamps lines to 15 chars on load (§SignTileEntity.cpp:32-34)', () => {
    const s = new SignTileEntity();
    s.load({ Text1: 'This is a very long line that exceeds 15 characters', Text2: '', Text3: '', Text4: '' });
    expect(s.messages[0].length).toBe(15);
  });

  it('save/load roundtrip preserves text', () => {
    const s = new SignTileEntity();
    s.messages = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
    const tag: Record<string, unknown> = {};
    s.save(tag);
    expect(tag.Text1).toBe('Line 1');
    expect(tag.Text4).toBe('Line 4');
    const s2 = new SignTileEntity();
    s2.load(tag);
    expect(s2.messages[0]).toBe('Line 1');
    expect(s2.messages[3]).toBe('Line 4');
  });
});
