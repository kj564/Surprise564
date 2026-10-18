import { describe, expect, test } from 'bun:test';
import { getTool, TIERS } from './tools';
import {
  applyMineBlockDurability,
  getMineBlockHurtAmount,
  getMaxDamage,
  hurtStack,
  isDamageableItem,
} from './item-instance';
import type { ItemStack } from '../../world/inventory/inventory';

function makeStack(itemKey: string, count = 1): ItemStack {
  return Object.freeze({ itemKey, count, maxStackSize: 1 });
}

describe('ItemInstance durability (rujukan 1:1)', () => {
  test('isDamageableItem — tools are damageable, bare hand is not (ItemInstance.cpp:99-100)', () => {
    expect(isDamageableItem(getTool('minecraft:wood_pickaxe'))).toBe(true);
    expect(isDamageableItem(getTool('minecraft:stone_pickaxe'))).toBe(true);
    expect(isDamageableItem(getTool('minecraft:iron_pickaxe'))).toBe(true);
    expect(isDamageableItem(getTool('minecraft:diamond_pickaxe'))).toBe(true);
    expect(isDamageableItem(getTool('minecraft:gold_pickaxe'))).toBe(true);
    expect(isDamageableItem(getTool('minecraft:wood_sword'))).toBe(true);
    expect(isDamageableItem(null)).toBe(false);  // bare hand
  });

  test('getMaxDamage — matches tier.getUses() (Item.cpp:11-15)', () => {
    // §DiggerItem.h:71 + WeaponItem.h:16: setMaxDamage(tier.getUses())
    expect(getMaxDamage(getTool('minecraft:wood_pickaxe'))).toBe(TIERS.wood.uses);    // 59
    expect(getMaxDamage(getTool('minecraft:stone_pickaxe'))).toBe(TIERS.stone.uses);  // 131
    expect(getMaxDamage(getTool('minecraft:iron_pickaxe'))).toBe(TIERS.iron.uses);    // 250
    expect(getMaxDamage(getTool('minecraft:diamond_pickaxe'))).toBe(TIERS.diamond.uses);  // 1561
    expect(getMaxDamage(getTool('minecraft:gold_pickaxe'))).toBe(TIERS.gold.uses);    // 32
    expect(getMaxDamage(null)).toBe(0);  // bare hand has no max damage
  });

  test('getMineBlockHurtAmount — DiggerItem hurt(1), WeaponItem hurt(2) (DiggerItem.h:22 + WeaponItem.h:35)', () => {
    expect(getMineBlockHurtAmount(getTool('minecraft:wood_pickaxe'))).toBe(1);
    expect(getMineBlockHurtAmount(getTool('minecraft:iron_axe'))).toBe(1);
    expect(getMineBlockHurtAmount(getTool('minecraft:diamond_shovel'))).toBe(1);
    expect(getMineBlockHurtAmount(getTool('minecraft:wood_sword'))).toBe(2);  // sword hurts 2 per block
    expect(getMineBlockHurtAmount(null)).toBe(0);  // bare hand — no durability to apply
  });

  test('hurtStack — non-damageable item is unchanged (ItemInstance.cpp:129 early return)', () => {
    const stack = makeStack('minecraft:stone', 64);  // blocks aren't damageable
    // Pass null tool — represents bare hand or non-tool item
    const result = hurtStack(stack, 1, null);
    expect(result).toBe(stack);  // same reference — no change
  });

  test('hurtStack — single hurt(1) on fresh wood pickaxe (ItemInstance.cpp:130-137)', () => {
    const stack = makeStack('minecraft:wood_pickaxe', 1);
    const tool = getTool('minecraft:wood_pickaxe');
    const result = hurtStack(stack, 1, tool);
    expect(result).not.toBeNull();
    expect(result?.count).toBe(1);  // not broken yet
    expect(result?.auxValue).toBe(1);  // auxValue += 1
  });

  test('hurtStack — accumulate auxValue up to maxDamage (ItemInstance.cpp:131 uses > not >=)', () => {
    // §ItemInstance.cpp:131 — `if (auxValue > getMaxDamage())` — strict greater-than
    // gold_pickaxe maxDamage=32. auxValue=32 is NOT > 32, so still 1 count, auxValue=32.
    // Only at auxValue=33 does count--, auxValue=0.
    const tool = getTool('minecraft:gold_pickaxe');  // maxDamage = 32
    let stack: ItemStack | null = makeStack('minecraft:gold_pickaxe', 1);
    // Hurt 32 times — should still have 1 count, auxValue=32 (NOT > 32)
    for (let i = 0; i < 32; i++) {
      stack = hurtStack(stack!, 1, tool);
      expect(stack).not.toBeNull();
    }
    expect(stack?.count).toBe(1);
    expect(stack?.auxValue).toBe(32);  // 32 NOT > 32 → no break yet
    // 33rd hurt → auxValue=33 > 32 → count--, auxValue=0 → null
    stack = hurtStack(stack!, 1, tool);
    expect(stack).toBeNull();
  });

  test('hurtStack — wood pickaxe breaks after 59 hurts (tier.getUses()=59)', () => {
    const tool = getTool('minecraft:wood_pickaxe');  // maxDamage = 59
    let stack: ItemStack | null = makeStack('minecraft:wood_pickaxe', 1);
    for (let i = 0; i < 58; i++) {
      stack = hurtStack(stack!, 1, tool);
      expect(stack).not.toBeNull();
    }
    expect(stack?.count).toBe(1);
    expect(stack?.auxValue).toBe(58);
    // 59th hurt → auxValue=59, NOT > 59 (maxDamage), so still 1 count, auxValue=59
    stack = hurtStack(stack!, 1, tool);
    expect(stack?.count).toBe(1);
    expect(stack?.auxValue).toBe(59);
    // 60th hurt → auxValue=60 > 59 → count--, auxValue=0 → null
    stack = hurtStack(stack!, 1, tool);
    expect(stack).toBeNull();
  });

  test('hurtStack — diamond pickaxe breaks after 1561 hurts (tier.getUses()=1561)', () => {
    const tool = getTool('minecraft:diamond_pickaxe');  // maxDamage = 1561
    let stack: ItemStack | null = makeStack('minecraft:diamond_pickaxe', 1);
    for (let i = 0; i < 1560; i++) {
      stack = hurtStack(stack!, 1, tool);
      expect(stack).not.toBeNull();
    }
    expect(stack?.auxValue).toBe(1560);
    // 1561th hurt — auxValue=1561, NOT > 1561, so still 1 count
    stack = hurtStack(stack!, 1, tool);
    expect(stack?.count).toBe(1);
    expect(stack?.auxValue).toBe(1561);
    // 1562th — auxValue=1562 > 1561 → count-- → null
    stack = hurtStack(stack!, 1, tool);
    expect(stack).toBeNull();
  });

  test('hurtStack — gold sword breaks after 17 block breaks (maxDamage=32, mineBlock hurt(2) per break)', () => {
    // §ItemInstance.cpp:131 — strict >, not >=
    // 16 breaks × hurt(2) = 32 damage. auxValue=32 NOT > 32, still 1 count.
    // 17th break → auxValue=34 > 32 → count-- → null
    const tool = getTool('minecraft:gold_sword');  // maxDamage = 32
    let stack: ItemStack | null = makeStack('minecraft:gold_sword', 1);
    for (let i = 0; i < 16; i++) {
      stack = hurtStack(stack!, 2, tool);  // hurt(2) per block
      expect(stack).not.toBeNull();
    }
    expect(stack?.auxValue).toBe(32);  // NOT > 32
    expect(stack?.count).toBe(1);
    // 17th break → auxValue=34 > 32 → count-- → null
    stack = hurtStack(stack!, 2, tool);
    expect(stack).toBeNull();
  });

  test('hurtStack — count=0 returns null (ItemInstance.cpp:134-136)', () => {
    // Start with count=1, hurt past maxDamage → count becomes 0 → return null
    const tool = getTool('minecraft:wood_pickaxe');  // maxDamage = 59
    const stack = makeStack('minecraft:wood_pickaxe', 1);
    // Hurt 60 in one go → auxValue=60 > 59 → count--, auxValue=0
    const result = hurtStack(stack, 60, tool);
    expect(result).toBeNull();
  });

  test('hurtStack — count > 1 stacks still decrement count (ItemInstance.cpp:134)', () => {
    // §In creative, tools have maxStackSize=1 (DiggerItem.h:71), but the
    // hurt logic should still work if count > 1 (theoretical edge case).
    const tool = getTool('minecraft:wood_pickaxe');
    const stack: ItemStack = Object.freeze({ itemKey: 'minecraft:wood_pickaxe', count: 3, maxStackSize: 3 });
    // Hurt 60 → auxValue=60 > 59 → count 3→2, auxValue=0
    const result = hurtStack(stack, 60, tool);
    expect(result?.count).toBe(2);
    expect(result?.auxValue).toBe(0);
  });

  test('applyMineBlockDurability — pickaxe decrements 1, sword decrements 2', () => {
    const pickStack = makeStack('minecraft:wood_pickaxe', 1);
    const pickTool = getTool('minecraft:wood_pickaxe');
    const r1 = applyMineBlockDurability(pickStack, pickTool);
    expect(r1?.auxValue).toBe(1);  // hurt(1)

    const swordStack = makeStack('minecraft:wood_sword', 1);
    const swordTool = getTool('minecraft:wood_sword');
    const r2 = applyMineBlockDurability(swordStack, swordTool);
    expect(r2?.auxValue).toBe(2);  // hurt(2)
  });

  test('applyMineBlockDurability — bare hand returns stack unchanged', () => {
    const stack = makeStack('minecraft:stone', 64);  // a block, not a tool
    const result = applyMineBlockDurability(stack, null);
    expect(result).toBe(stack);  // same reference
  });
});
