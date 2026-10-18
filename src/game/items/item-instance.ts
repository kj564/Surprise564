// §MCPE 2013 ItemInstance model — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   ItemInstance.h:97-99 — `int auxValue` field (durability for tools, data for blocks)
//   ItemInstance.cpp:99-100 — isDamageableItem: getMaxDamage() > 0
//   ItemInstance.cpp:120-122 — getMaxDamage: Item::items[id]->getMaxDamage()
//   ItemInstance.cpp:128-138 — hurt(i):
//     if (!isDamageableItem()) return;
//     auxValue += i;
//     if (auxValue > getMaxDamage()) {
//       count--;
//       if (count < 0) count = 0;
//       auxValue = 0;
//     }
//   DiggerItem.h:21-25 — mineBlock: itemInstance->hurt(1)
//   DiggerItem.h:67-72 — constructor: setMaxDamage(tier.getUses()); maxStackSize = 1
//   WeaponItem.h:33-37 — mineBlock: itemInstance->hurt(2)
//   WeaponItem.h:13-19 — constructor: setMaxDamage(tier.getUses()); maxStackSize = 1
//   SurvivalMode.cpp:57-76 — destroyBlock: item->mineBlock(t,x,y,z); if (count==0) clearSlot
//   CreativeMode.cpp:31-38 — creativeDestroyBlock: NO mineBlock call (no durability loss)

import type { ItemStack } from '../inventory/inventory';
import type { Tool } from './tools';

/** §ItemInstance::isDamageableItem (ItemInstance.cpp:99-100) — getMaxDamage() > 0.
 *  Tools have setMaxDamage(tier.getUses()) so getMaxDamage = tier.uses.
 *  Bare hand (tool=null) is never damageable. */
export function isDamageableItem(tool: Tool | null): boolean {
  if (!tool) return false;
  return tool.tierDef.uses > 0;
}

/** §ItemInstance::getMaxDamage (ItemInstance.cpp:120-122) — Item::items[id]->getMaxDamage().
 *  For tools: tier.getUses() (verified from DiggerItem.h:71 + WeaponItem.h:16). */
export function getMaxDamage(tool: Tool | null): number {
  if (!tool) return 0;
  return tool.tierDef.uses;
}

/** §ItemInstance::hurt (ItemInstance.cpp:128-138) — durability decrement.
 *  Returns null if the stack is fully consumed (count == 0) so the caller
 *  can §Inventory::clearSlot (FillingContainer.cpp:485-500) to null the slot.
 *  If the item is not damageable, returns the stack unchanged. */
export function hurtStack(stack: ItemStack, amount: number, tool: Tool | null): ItemStack | null {
  if (!isDamageableItem(tool)) return stack;  // §hurt early return
  if (!Number.isFinite(amount) || amount <= 0) return stack;
  // §ItemInstance.cpp:130-137 — exact rujukan formula
  let auxValue = (stack.auxValue ?? 0) + amount;
  let count = stack.count;
  const maxDamage = getMaxDamage(tool);
  if (auxValue > maxDamage) {
    count--;
    if (count < 0) count = 0;
    auxValue = 0;
  }
  if (count === 0) return null;  // §SurvivalMode.cpp:68 — clearSlot when count==0
  return Object.freeze({ ...stack, count, auxValue });
}

/** §DiggerItem::mineBlock (DiggerItem.h:21-25) — pickaxe/axe/shovel: hurt(1)
 *  §WeaponItem::mineBlock (WeaponItem.h:33-37) — sword: hurt(2)
 *  Bare hand: no durability (hurt is no-op, returns 0)
 *  Used by engine.tickMining to apply the correct hurt amount per block break. */
export function getMineBlockHurtAmount(tool: Tool | null): number {
  if (!tool) return 0;
  switch (tool.kind) {
    case 'pickaxe':
    case 'axe':
    case 'shovel':
      return 1;  // §DiggerItem.h:22 — itemInstance->hurt(1)
    case 'sword':
      return 2;  // §WeaponItem.h:35 — itemInstance->hurt(2)
    case 'none':
      return 0;
  }
  return 0;
}

/** Convenience: apply a single mineBlock durability decrement to an inventory
 *  slot. Returns the new stack (or null if consumed). Caller must setSlot
 *  with the result. §SurvivalMode.cpp:63-69 — getSelected → mineBlock →
 *  clearSlot if count==0. */
export function applyMineBlockDurability(
  stack: ItemStack,
  tool: Tool | null,
): ItemStack | null {
  const hurtAmount = getMineBlockHurtAmount(tool);
  return hurtStack(stack, hurtAmount, tool);
}
