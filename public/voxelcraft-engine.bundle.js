// src/game/world/level/tile/registry.ts
function block(definition) {
  return Object.freeze({ ...definition, legacyAliases: definition.legacyAliases ? Object.freeze([...definition.legacyAliases]) : undefined, drops: Object.freeze([...definition.drops]) });
}
var definitions = [
  block({ key: "minecraft:air", legacyId: 0, displayName: "Air", shape: "none", renderLayer: "invisible", solid: false, selectable: false, replaceable: true, material: "air", hardness: 0, sound: "silent", lightOpacity: 0, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:stone", legacyId: 1, displayName: "Stone", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 1.5, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [4] }),
  block({ key: "minecraft:grass_block", legacyId: 2, displayName: "Grass Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "dirt", hardness: 0.6, sound: "grass", lightOpacity: 15, lightEmission: 0, drops: [3] }),
  block({ key: "minecraft:dirt", legacyId: 3, displayName: "Dirt", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "dirt", hardness: 0.5, sound: "gravel", lightOpacity: 15, lightEmission: 0, drops: [3] }),
  block({ key: "minecraft:cobblestone", legacyId: 4, displayName: "Cobblestone", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [4] }),
  block({ key: "minecraft:oak_planks", legacyId: 5, displayName: "Oak Planks", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: [5] }),
  block({ key: "minecraft:bedrock", legacyId: 7, displayName: "Bedrock", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: -1, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:sand", legacyId: 12, displayName: "Sand", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "sand", hardness: 0.5, sound: "sand", lightOpacity: 15, lightEmission: 0, drops: [12] }),
  block({ key: "minecraft:gravel", legacyId: 13, displayName: "Gravel", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "sand", hardness: 0.6, sound: "gravel", lightOpacity: 15, lightEmission: 0, drops: [13] }),
  block({ key: "minecraft:gold_ore", legacyId: 14, displayName: "Gold Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [14] }),
  block({ key: "minecraft:iron_ore", legacyId: 15, displayName: "Iron Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [15] }),
  block({ key: "minecraft:coal_ore", legacyId: 16, displayName: "Coal Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [263] }),
  block({ key: "minecraft:oak_log", legacyId: 17, displayName: "Oak Log", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: [17] }),
  block({ key: "minecraft:oak_leaves", legacyId: 18, displayName: "Oak Leaves", shape: "cube", renderLayer: "cutout", solid: true, selectable: true, replaceable: false, material: "leaves", hardness: 0.2, sound: "grass", lightOpacity: 1, lightEmission: 0, drops: [18] }),
  block({ key: "minecraft:glass", legacyId: 20, displayName: "Glass", shape: "cube", renderLayer: "translucent", solid: true, selectable: true, replaceable: false, material: "glass", hardness: 0.3, sound: "glass", lightOpacity: 0, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:lapis_ore", legacyId: 21, displayName: "Lapis Lazuli Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [351] }),
  block({ key: "minecraft:sandstone", legacyId: 24, displayName: "Sandstone", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 0.8, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [24] }),
  block({ key: "minecraft:web", legacyId: 30, displayName: "Cobweb", shape: "cross", renderLayer: "cutout", solid: false, selectable: true, replaceable: false, material: "web", hardness: 4, sound: "cloth", lightOpacity: 1, lightEmission: 0, drops: [287] }),
  block({ key: "minecraft:gold_block", legacyId: 41, displayName: "Gold Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 3, sound: "metal", lightOpacity: 15, lightEmission: 0, drops: [41] }),
  block({ key: "minecraft:iron_block", legacyId: 42, displayName: "Iron Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 5, sound: "metal", lightOpacity: 15, lightEmission: 0, drops: [42] }),
  block({ key: "minecraft:stone_slab", legacyId: 44, displayName: "Stone Slab", shape: "slab", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [44] }),
  block({ key: "minecraft:bricks", legacyId: 45, displayName: "Bricks", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [45] }),
  block({ key: "minecraft:obsidian", legacyId: 49, displayName: "Obsidian", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 10, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [49] }),
  block({ key: "minecraft:torch", legacyId: 50, displayName: "Torch", shape: "torch", renderLayer: "cutout", solid: false, selectable: true, replaceable: true, material: "decoration", hardness: 0, sound: "wood", lightOpacity: 0, lightEmission: 14, drops: [50] }),
  block({ key: "minecraft:oak_stairs", legacyId: 53, displayName: "Oak Stairs", shape: "stairs", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: [53] }),
  block({ key: "minecraft:chest", legacyId: 54, displayName: "Chest", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2.5, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: [54] }),
  block({ key: "minecraft:diamond_ore", legacyId: 56, displayName: "Diamond Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [264] }),
  block({ key: "minecraft:diamond_block", legacyId: 57, displayName: "Diamond Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 5, sound: "metal", lightOpacity: 15, lightEmission: 0, drops: [57] }),
  block({ key: "minecraft:crafting_table", legacyId: 58, displayName: "Crafting Table", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2.5, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: [58] }),
  block({ key: "minecraft:farmland", legacyId: 60, displayName: "Farmland", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "dirt", hardness: 0.6, sound: "gravel", lightOpacity: 15, lightEmission: 0, drops: [3] }),
  block({ key: "minecraft:furnace", legacyId: 61, displayName: "Furnace", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3.5, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [61] }),
  block({ key: "minecraft:ladder", legacyId: 65, displayName: "Ladder", shape: "cross", renderLayer: "cutout", solid: false, selectable: true, replaceable: true, material: "decoration", hardness: 0.4, sound: "wood", lightOpacity: 0, lightEmission: 0, drops: [65] }),
  block({ key: "minecraft:stone_stairs", legacyId: 67, displayName: "Stone Stairs", shape: "stairs", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [67] }),
  block({ key: "minecraft:iron_door", legacyId: 71, displayName: "Iron Door", shape: "door", renderLayer: "cutout", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 5, sound: "metal", lightOpacity: 0, lightEmission: 0, drops: [71] }),
  block({ key: "minecraft:snow_layer", legacyId: 78, displayName: "Snow Layer", shape: "slab", renderLayer: "opaque", solid: false, selectable: true, replaceable: true, material: "topSnow", hardness: 0.1, sound: "cloth", lightOpacity: 0, lightEmission: 0, drops: [78] }),
  block({ key: "minecraft:ice", legacyId: 79, displayName: "Ice", shape: "cube", renderLayer: "translucent", solid: true, selectable: true, replaceable: false, material: "ice", hardness: 0.5, sound: "glass", lightOpacity: 3, lightEmission: 0, drops: [79] }),
  block({ key: "minecraft:cactus", legacyId: 81, displayName: "Cactus", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "cactus", hardness: 0.4, sound: "cloth", lightOpacity: 0, lightEmission: 0, drops: [81] }),
  block({ key: "minecraft:reeds", legacyId: 83, displayName: "Sugar Cane", shape: "cross", renderLayer: "cutout", solid: false, selectable: true, replaceable: true, material: "plant", hardness: 0, sound: "grass", lightOpacity: 0, lightEmission: 0, drops: [83] }),
  block({ key: "minecraft:oak_fence", legacyId: 85, displayName: "Oak Fence", shape: "cube", renderLayer: "cutout", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 0, lightEmission: 0, drops: [85] }),
  block({ key: "minecraft:water", legacyId: 8, legacyAliases: [9], displayName: "Water", shape: "liquid", renderLayer: "translucent", solid: false, selectable: true, replaceable: true, material: "dirt", hardness: 100, sound: "silent", lightOpacity: 3, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:lava", legacyId: 10, legacyAliases: [11], displayName: "Lava", shape: "liquid", renderLayer: "translucent", solid: false, selectable: true, replaceable: true, material: "dirt", hardness: 100, sound: "silent", lightOpacity: 15, lightEmission: 15, drops: [] })
];

class BlockRegistry {
  byKey = new Map;
  byLegacyId = new Map;
  constructor(entries = definitions) {
    for (const entry of entries) {
      if (this.byKey.has(entry.legacyId ?? 0))
        throw new Error("Duplicate block key: " + entry.legacyId);
      validateDefinition(entry);
      const stored = Object.freeze({
        ...entry,
        legacyAliases: entry.legacyAliases ? Object.freeze([...entry.legacyAliases]) : undefined,
        drops: Object.freeze([...entry.drops])
      });
      this.byKey.set(entry.legacyId ?? 0, stored);
      const legacyIds = [...entry.legacyId === undefined ? [] : [entry.legacyId], ...entry.legacyAliases ?? []];
      for (const legacyId of legacyIds) {
        if (!Number.isInteger(legacyId) || legacyId < 0 || legacyId > 255) {
          throw new RangeError("Legacy block ID must be an integer from 0 to 255");
        }
        if (this.byLegacyId.has(legacyId))
          throw new Error("Duplicate legacy block ID: " + legacyId);
        this.byLegacyId.set(legacyId, stored);
      }
    }
    const air = this.byLegacyId.get(0);
    if (!air) {
      throw new Error("Registry must define block ID 0 (air)");
    }
  }
  getByKey(key) {
    return this.byKey.get(key);
  }
  getIdByKey(key) {
    if (id === 0)
      return 0;
    return this.byKey.get(key)?.legacyId;
  }
  getById(id2) {
    if (!Number.isInteger(id2) || id2 < 0 || id2 > 65535)
      return;
    if (id2 === 0)
      return this.byLegacyId.get(0);
    return this.byLegacyId.get(id2);
  }
  getByLegacyId(id2) {
    return Number.isInteger(id2) ? this.byLegacyId.get(id2) : undefined;
  }
  values() {
    return [...this.byKey.values()];
  }
}
function validateDefinition(entry) {
  if (!entry.displayName.trim())
    throw new TypeError("Block displayName cannot be empty");
  if (!Number.isFinite(entry.hardness) || entry.hardness < -1)
    throw new RangeError("Block hardness must be -1 or non-negative");
  if (!Number.isInteger(entry.lightOpacity) || entry.lightOpacity < 0 || entry.lightOpacity > 15)
    throw new RangeError("lightOpacity must be between 0 and 15");
  if (!Number.isInteger(entry.lightEmission) || entry.lightEmission < 0 || entry.lightEmission > 15)
    throw new RangeError("lightEmission must be between 0 and 15");
  if (entry.legacyAliases?.some((id2) => !Number.isInteger(id2) || id2 < 0 || id2 > 255))
    throw new RangeError("Legacy block aliases must be integers from 0 to 255");
  if (entry.drops.some((drop) => !Number.isInteger(drop) || drop < 0))
    throw new TypeError("Drop IDs must be non-negative integers");
}
var defaultBlockRegistry = new BlockRegistry;

// src/game/util/fixed-step.ts
class FixedStepClock {
  stepSeconds;
  maxFrameSeconds;
  maxStepsPerFrame;
  accumulator = 0;
  constructor(options = {}) {
    this.stepSeconds = positiveFinite(options.stepSeconds ?? 1 / 60, "stepSeconds");
    this.maxFrameSeconds = positiveFinite(options.maxFrameSeconds ?? 0.25, "maxFrameSeconds");
    this.maxStepsPerFrame = positiveInteger(options.maxStepsPerFrame ?? 5, "maxStepsPerFrame");
    if (this.maxFrameSeconds < this.stepSeconds) {
      throw new RangeError("maxFrameSeconds must be at least one simulation step");
    }
  }
  advance(frameSeconds, step) {
    if (!Number.isFinite(frameSeconds) || frameSeconds < 0) {
      throw new RangeError("frameSeconds must be finite and non-negative");
    }
    if (typeof step !== "function")
      throw new TypeError("step must be a function");
    const acceptedFrame = Math.min(frameSeconds, this.maxFrameSeconds);
    let droppedSeconds = frameSeconds - acceptedFrame;
    this.accumulator += acceptedFrame;
    let steps = 0;
    while (this.accumulator + Number.EPSILON >= this.stepSeconds && steps < this.maxStepsPerFrame) {
      step(this.stepSeconds);
      this.accumulator -= this.stepSeconds;
      if (this.accumulator < 0 && this.accumulator > -Number.EPSILON * 4)
        this.accumulator = 0;
      steps += 1;
    }
    if (this.accumulator >= this.stepSeconds) {
      const wholeStepsDropped = Math.floor((this.accumulator + this.stepSeconds * 0.0000000001) / this.stepSeconds);
      const timeDropped = wholeStepsDropped * this.stepSeconds;
      this.accumulator = Math.max(0, this.accumulator - timeDropped);
      droppedSeconds += timeDropped;
    }
    return Object.freeze({
      steps,
      alpha: Math.min(1 - Number.EPSILON, Math.max(0, this.accumulator / this.stepSeconds)),
      droppedSeconds
    });
  }
  reset() {
    this.accumulator = 0;
  }
  get interpolationAlpha() {
    return Math.min(1 - Number.EPSILON, Math.max(0, this.accumulator / this.stepSeconds));
  }
}
function positiveFinite(value, name) {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(name + " must be finite and positive");
  return value;
}
function positiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError(name + " must be a positive safe integer");
  return value;
}

// src/game/world/inventory/inventory.ts
class Inventory {
  slots;
  _revision = 0;
  constructor(slotCount) {
    if (!Number.isSafeInteger(slotCount) || slotCount <= 0 || slotCount > 4096) {
      throw new RangeError("slotCount must be an integer between 1 and 4096");
    }
    this.slots = Array.from({ length: slotCount }, () => null);
  }
  get size() {
    return this.slots.length;
  }
  get revision() {
    return this._revision;
  }
  getSlot(index) {
    return this.slots[this.assertSlot(index)];
  }
  snapshot() {
    return Object.freeze([...this.slots]);
  }
  setSlot(index, stack) {
    const slot = this.assertSlot(index);
    const normalized = stack === null ? null : createStack(stack.id, stack.count, stack.maxStackSize, stack.auxValue);
    const previous = this.slots[slot];
    if (sameStack(previous, normalized))
      return false;
    this.slots[slot] = normalized;
    this._revision += 1;
    return true;
  }
  insert(id2, count, maxStackSize = 64) {
    validateItemId(id2);
    positiveInteger2(count, "count");
    positiveInteger2(maxStackSize, "maxStackSize");
    if (maxStackSize > 999)
      throw new RangeError("maxStackSize cannot exceed 999");
    for (const stack of this.slots) {
      if (stack?.id === id2 && stack.maxStackSize !== maxStackSize) {
        throw new Error("maxStackSize does not match existing stack definition for " + id2);
      }
    }
    let remaining = count;
    let changed = false;
    for (let index = 0;index < this.slots.length && remaining > 0; index += 1) {
      const stack = this.slots[index];
      if (!stack || stack.id !== id2 || stack.count >= stack.maxStackSize)
        continue;
      const amount = Math.min(remaining, stack.maxStackSize - stack.count);
      this.slots[index] = createStack(id2, stack.count + amount, maxStackSize);
      remaining -= amount;
      changed = true;
    }
    for (let index = 0;index < this.slots.length && remaining > 0; index += 1) {
      if (this.slots[index] !== null)
        continue;
      const amount = Math.min(remaining, maxStackSize);
      this.slots[index] = createStack(id2, amount, maxStackSize);
      remaining -= amount;
      changed = true;
    }
    if (changed)
      this._revision += 1;
    return Object.freeze({ inserted: count - remaining, remainder: remaining });
  }
  remove(index, count) {
    const slot = this.assertSlot(index);
    positiveInteger2(count, "count");
    const stack = this.slots[slot];
    if (!stack)
      return null;
    const removedCount = Math.min(count, stack.count);
    const removed = createStack(stack.id, removedCount, stack.maxStackSize);
    this.slots[slot] = removedCount === stack.count ? null : createStack(stack.id, stack.count - removedCount, stack.maxStackSize);
    this._revision += 1;
    return removed;
  }
  swap(firstIndex, secondIndex) {
    const first = this.assertSlot(firstIndex);
    const second = this.assertSlot(secondIndex);
    if (first === second || sameStack(this.slots[first], this.slots[second]))
      return false;
    const temporary = this.slots[first];
    this.slots[first] = this.slots[second];
    this.slots[second] = temporary;
    this._revision += 1;
    return true;
  }
  assertSlot(index) {
    if (!Number.isSafeInteger(index) || index < 0 || index >= this.slots.length) {
      throw new RangeError("Inventory slot index is out of range");
    }
    return index;
  }
}
function createStack(id2, count, maxStackSize, auxValue) {
  validateItemId(id2);
  positiveInteger2(count, "count");
  positiveInteger2(maxStackSize, "maxStackSize");
  if (maxStackSize > 999)
    throw new RangeError("maxStackSize cannot exceed 999");
  if (count > maxStackSize)
    throw new RangeError("Stack count exceeds maxStackSize");
  if (auxValue !== undefined && (!Number.isInteger(auxValue) || auxValue < 0 || auxValue > 9999)) {
    throw new RangeError("auxValue must be a non-negative integer up to 9999");
  }
  return Object.freeze({ id: id2, count, maxStackSize, auxValue: auxValue ?? 0 });
}
function validateItemId(id2) {
  if (!Number.isInteger(id2) || id2 < 0) {
    throw new TypeError("id must be a non-negative integer (C++ ItemInstance.id)");
  }
}
function positiveInteger2(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError(name + " must be a positive safe integer");
}
function sameStack(a, b) {
  return a === b || a !== null && b !== null && a.id === b.id && a.count === b.count && a.maxStackSize === b.maxStackSize && (a.auxValue ?? 0) === (b.auxValue ?? 0);
}

// src/game/world/item/tools.ts
var TIERS = Object.freeze({
  wood: Object.freeze({ level: 0, uses: 59, speed: 2, damage: 0 }),
  stone: Object.freeze({ level: 1, uses: 131, speed: 4, damage: 1 }),
  iron: Object.freeze({ level: 2, uses: 250, speed: 6, damage: 2 }),
  diamond: Object.freeze({ level: 3, uses: 1561, speed: 8, damage: 3 }),
  gold: Object.freeze({ level: 0, uses: 32, speed: 12, damage: 0 }),
  none: Object.freeze({ level: 0, uses: 0, speed: 1, damage: 0 })
});
var TOOL_TABLE = Object.freeze({
  "minecraft:iron_shovel": makeTool("shovel", "iron", 2, 5),
  "minecraft:iron_pickaxe": makeTool("pickaxe", "iron", 2, 6),
  "minecraft:iron_axe": makeTool("axe", "iron", 2, 7),
  "minecraft:wood_shovel": makeTool("shovel", "wood", 0, 5),
  "minecraft:wood_pickaxe": makeTool("pickaxe", "wood", 0, 6),
  "minecraft:wood_axe": makeTool("axe", "wood", 0, 7),
  "minecraft:stone_shovel": makeTool("shovel", "stone", 1, 5),
  "minecraft:stone_pickaxe": makeTool("pickaxe", "stone", 1, 6),
  "minecraft:stone_axe": makeTool("axe", "stone", 1, 7),
  "minecraft:diamond_shovel": makeTool("shovel", "diamond", 3, 5),
  "minecraft:diamond_pickaxe": makeTool("pickaxe", "diamond", 3, 6),
  "minecraft:diamond_axe": makeTool("axe", "diamond", 3, 7),
  "minecraft:gold_shovel": makeTool("shovel", "gold", 4, 5),
  "minecraft:gold_pickaxe": makeTool("pickaxe", "gold", 4, 6),
  "minecraft:gold_axe": makeTool("axe", "gold", 4, 7),
  "minecraft:wood_sword": makeTool("sword", "wood", 0, 4),
  "minecraft:stone_sword": makeTool("sword", "stone", 1, 4),
  "minecraft:iron_sword": makeTool("sword", "iron", 2, 4),
  "minecraft:diamond_sword": makeTool("sword", "diamond", 3, 4),
  "minecraft:gold_sword": makeTool("sword", "gold", 4, 4)
});
function makeTool(kind, tier, iconCol, iconRow) {
  return Object.freeze({ kind, tier, tierDef: TIERS[tier], iconCol, iconRow });
}
function getTool(id2) {
  if (!Number.isInteger(id2) || id2 <= 0)
    return null;
  return TOOL_TABLE[id2] ?? null;
}
var NOT_ALWAYS_DESTROYABLE = new Set([
  "stone",
  "metal",
  "snow",
  "topSnow"
]);
function isAlwaysDestroyable(material) {
  return !NOT_ALWAYS_DESTROYABLE.has(material);
}
function pickaxeCanDestroy(material, blockKey, tierLevel) {
  if (blockKey === "minecraft:obsidian")
    return tierLevel === 3;
  if (blockKey === "minecraft:diamond_block" || blockKey === "minecraft:diamond_ore")
    return tierLevel >= 2;
  if (blockKey === "minecraft:gold_block" || blockKey === "minecraft:gold_ore")
    return tierLevel >= 2;
  if (blockKey === "minecraft:iron_block" || blockKey === "minecraft:iron_ore")
    return tierLevel >= 1;
  if (blockKey === "minecraft:lapis_block" || blockKey === "minecraft:lapis_ore")
    return tierLevel >= 1;
  if (blockKey === "minecraft:redstone_ore" || blockKey === "minecraft:redstone_ore_lit")
    return tierLevel >= 2;
  if (material === "stone" || material === "metal")
    return true;
  return false;
}
function shovelCanDestroy(material) {
  return material === "topSnow" || material === "snow";
}
function pickaxeDestroySpeed(material, hasTile, tierSpeed) {
  if (material === "stone" || material === "metal")
    return tierSpeed;
  return hasTile ? tierSpeed : 1;
}
function axeDestroySpeed(material, hasTile, tierSpeed) {
  if (material === "wood")
    return tierSpeed;
  return hasTile ? tierSpeed : 1;
}
function shovelDestroySpeed(hasTile, tierSpeed) {
  return hasTile ? tierSpeed : 1;
}
var PICKAXE_TILES = new Set([
  "minecraft:cobblestone",
  "minecraft:stone_bricks",
  "minecraft:stone_slab",
  "minecraft:stone",
  "minecraft:sandstone",
  "minecraft:moss_stone",
  "minecraft:iron_ore",
  "minecraft:iron_block",
  "minecraft:coal_ore",
  "minecraft:gold_block",
  "minecraft:gold_ore",
  "minecraft:diamond_block",
  "minecraft:diamond_ore",
  "minecraft:ice",
  "minecraft:lapis_ore",
  "minecraft:lapis_block"
]);
var AXE_TILES = new Set([
  "minecraft:oak_planks",
  "minecraft:bookshelf",
  "minecraft:oak_log",
  "minecraft:chest",
  "minecraft:stone_slab",
  "minecraft:oak_stairs",
  "minecraft:crafting_table",
  "minecraft:oak_fence"
]);
var SHOVEL_TILES = new Set([
  "minecraft:grass_block",
  "minecraft:dirt",
  "minecraft:sand",
  "minecraft:gravel",
  "minecraft:snow_layer",
  "minecraft:snow",
  "minecraft:clay",
  "minecraft:farmland"
]);
function canDestroyBlock(material, blockKey, tool) {
  if (isAlwaysDestroyable(material))
    return true;
  if (!tool)
    return false;
  switch (tool.kind) {
    case "pickaxe":
      return pickaxeCanDestroy(material, blockKey, tool.tierDef.level);
    case "shovel":
      return shovelCanDestroy(material);
    case "axe":
    case "sword":
    case "none":
      return false;
  }
  return false;
}
function getPlayerDestroySpeed(material, blockKey, tool) {
  if (!tool)
    return 1;
  const hasTile = (() => {
    switch (tool.kind) {
      case "pickaxe":
        return PICKAXE_TILES.has(blockKey);
      case "axe":
        return AXE_TILES.has(blockKey);
      case "shovel":
        return SHOVEL_TILES.has(blockKey);
      case "sword":
        return false;
      case "none":
        return false;
    }
    return false;
  })();
  switch (tool.kind) {
    case "pickaxe":
      return pickaxeDestroySpeed(material, hasTile, tool.tierDef.speed);
    case "axe":
      return axeDestroySpeed(material, hasTile, tool.tierDef.speed);
    case "shovel":
      return shovelDestroySpeed(hasTile, tool.tierDef.speed);
    case "sword":
      return blockKey === "minecraft:web" ? 15 : 1.5;
    case "none":
      return 1;
  }
  return 1;
}
var TOOL_KEYS = Object.freeze(Object.keys(TOOL_TABLE));

// src/game/client/interaction/mining.ts
var SURVIVAL_DESTROY_DELAY = 5;
var CREATIVE_DESTRUCTION_TICK_DELAY = 10;
var DESTROY_PROGRESS_DIVISOR = 30;

class MiningSession {
  target;
  blockId;
  hardness;
  mode;
  playerDestroySpeed;
  canDestroy;
  destroyProgress = 0;
  destroyTicks = 0;
  destroyDelay = 0;
  completed = false;
  cancelled = false;
  constructor(target, blockId, hardness, mode, playerDestroySpeed, canDestroy = true) {
    if (!Number.isSafeInteger(target.x) || !Number.isSafeInteger(target.y) || !Number.isSafeInteger(target.z)) {
      throw new TypeError("Mining target coordinates must be safe integers");
    }
    if (!Number.isSafeInteger(blockId) || blockId <= 0 || blockId > 65535)
      throw new RangeError("Mining blockId must be between 1 and 65535");
    if (!Number.isFinite(hardness))
      throw new RangeError("hardness must be finite");
    if (mode !== "survival" && mode !== "creative")
      throw new RangeError("mode must be survival or creative");
    if (!Number.isFinite(playerDestroySpeed) || playerDestroySpeed <= 0)
      throw new RangeError("playerDestroySpeed must be finite and positive");
    this.target = Object.freeze({ ...target });
    this.blockId = blockId;
    this.hardness = hardness;
    this.mode = mode;
    this.playerDestroySpeed = playerDestroySpeed;
    this.canDestroy = canDestroy;
  }
  get isComplete() {
    return this.completed;
  }
  get isCancelled() {
    return this.cancelled;
  }
  get progress() {
    if (this.completed)
      return 1;
    return Math.min(1, this.destroyProgress);
  }
  get remainingTicks() {
    if (this.completed)
      return 0;
    if (this.hardness <= 0)
      return 0;
    const perTick = this.canDestroy ? this.playerDestroySpeed / this.hardness / DESTROY_PROGRESS_DIVISOR : 1 / this.hardness / (DESTROY_PROGRESS_DIVISOR * 100);
    if (perTick <= 0)
      return Infinity;
    return Math.max(0, Math.ceil((1 - this.destroyProgress) / perTick));
  }
  tick(ticks, currentTarget, currentBlockId) {
    if (!Number.isFinite(ticks) || ticks < 0)
      throw new RangeError("ticks must be finite and non-negative");
    if (this.cancelled)
      return { status: "cancelled" };
    if (!samePosition(this.target, currentTarget) || currentBlockId !== this.blockId) {
      this.cancelled = true;
      return { status: "cancelled" };
    }
    if (this.completed)
      return { status: "completed", progress: 1 };
    let remaining = Math.floor(ticks);
    if (remaining <= 0) {
      return { status: "mining", progress: this.progress, remainingTicks: this.remainingTicks };
    }
    if (this.mode === "creative") {
      if (this.destroyDelay <= 0) {
        this.completed = true;
        this.destroyDelay = CREATIVE_DESTRUCTION_TICK_DELAY;
        return { status: "completed", progress: 1 };
      }
      const consume = Math.min(remaining, this.destroyDelay);
      this.destroyDelay -= consume;
      remaining -= consume;
      if (remaining > 0) {
        if (this.destroyDelay <= 0) {
          this.completed = true;
          this.destroyDelay = CREATIVE_DESTRUCTION_TICK_DELAY;
          return { status: "completed", progress: 1 };
        }
      }
      return { status: "cooldown", progress: 1, cooldownTicks: this.destroyDelay };
    }
    while (remaining > 0) {
      if (this.destroyDelay > 0) {
        const consume = Math.min(remaining, this.destroyDelay);
        this.destroyDelay -= consume;
        remaining -= consume;
        continue;
      }
      remaining -= 1;
      const perTick = this.canDestroy ? this.playerDestroySpeed / this.hardness / DESTROY_PROGRESS_DIVISOR : 1 / this.hardness / (DESTROY_PROGRESS_DIVISOR * 100);
      this.destroyProgress += perTick;
      this.destroyTicks += 1;
      if (this.destroyProgress >= 1) {
        this.completed = true;
        this.destroyDelay = SURVIVAL_DESTROY_DELAY;
        return { status: "completed", progress: 1 };
      }
    }
    return { status: "mining", progress: this.progress, remainingTicks: this.remainingTicks };
  }
  cancel() {
    this.cancelled = true;
  }
}
function beginMining(world, target, registry, options = {}) {
  const mode = options.mode ?? "creative";
  if (mode !== "survival" && mode !== "creative")
    throw new RangeError("mode must be survival or creative");
  const blockId = world.getBlock(target.x, target.y, target.z);
  if (blockId === undefined)
    return { status: "unloaded" };
  if (blockId === 0)
    return { status: "air" };
  const definition = registry.getById(blockId);
  if (!definition)
    return { status: "unknown-block", blockId };
  if (definition.hardness < 0)
    return { status: "unbreakable" };
  const tool = options.tool ?? null;
  const playerDestroySpeed = options.playerDestroySpeed ?? getPlayerDestroySpeed(definition.material, definition.key, tool);
  if (!Number.isFinite(playerDestroySpeed) || playerDestroySpeed <= 0)
    throw new RangeError("playerDestroySpeed must be finite and positive");
  const canDestroy = canDestroyBlock(definition.material, definition.key, tool);
  return {
    status: "started",
    session: new MiningSession(target, blockId, definition.hardness, mode, playerDestroySpeed, canDestroy)
  };
}
function finishBlockBreak(world, session, registry, inventory) {
  if (session.isCancelled)
    return { status: "target-changed" };
  if (!session.isComplete)
    return { status: "not-ready", progress: session.progress };
  const target = session.target;
  const currentId = world.getBlock(target.x, target.y, target.z);
  if (currentId === undefined)
    return { status: "unloaded" };
  if (currentId !== session.blockId || currentId === 0)
    return { status: "target-changed" };
  const definition = registry.getById(currentId);
  if (!definition)
    return { status: "target-changed" };
  if (definition.hardness < 0)
    return { status: "unbreakable" };
  const mutation = world.setBlock(target, 0);
  if (!mutation.changed)
    return { status: "target-changed" };
  const inserted = [];
  const remaining = [];
  for (const dropKey of definition.drops) {
    const result = inventory.insert(dropKey, 1);
    if (result.inserted > 0)
      inserted.push(Object.freeze({ id: dropKey, count: result.inserted, maxStackSize: 64 }));
    if (result.remainder > 0)
      remaining.push(Object.freeze({ id: dropKey, count: result.remainder, maxStackSize: 64 }));
  }
  return {
    status: "broken",
    blockId: currentId,
    dropsInserted: Object.freeze(inserted),
    dropsRemaining: Object.freeze(remaining)
  };
}
function samePosition(a, b) {
  return b !== null && a.x === b.x && a.y === b.y && a.z === b.z;
}

// src/game/world/item/item-instance.ts
function isDamageableItem(tool) {
  if (!tool)
    return false;
  return tool.tierDef.uses > 0;
}
function getMaxDamage(tool) {
  if (!tool)
    return 0;
  return tool.tierDef.uses;
}
function hurtStack(stack, amount, tool) {
  if (!isDamageableItem(tool))
    return stack;
  if (!Number.isFinite(amount) || amount <= 0)
    return stack;
  let auxValue = (stack.auxValue ?? 0) + amount;
  let count = stack.count;
  const maxDamage = getMaxDamage(tool);
  if (auxValue > maxDamage) {
    count--;
    if (count < 0)
      count = 0;
    auxValue = 0;
  }
  if (count === 0)
    return null;
  return Object.freeze({ ...stack, count, auxValue });
}
function getMineBlockHurtAmount(tool) {
  if (!tool)
    return 0;
  switch (tool.kind) {
    case "pickaxe":
    case "axe":
    case "shovel":
      return 1;
    case "sword":
      return 2;
    case "none":
      return 0;
  }
  return 0;
}
function applyMineBlockDurability(stack, tool) {
  const hurtAmount = getMineBlockHurtAmount(tool);
  return hurtStack(stack, hurtAmount, tool);
}

// src/game/world/physics/aabb.ts
class Aabb {
  minX;
  minY;
  minZ;
  maxX;
  maxY;
  maxZ;
  constructor(minX, minY, minZ, maxX, maxY, maxZ) {
    this.minX = minX;
    this.minY = minY;
    this.minZ = minZ;
    this.maxX = maxX;
    this.maxY = maxY;
    this.maxZ = maxZ;
    const values = [minX, minY, minZ, maxX, maxY, maxZ];
    if (!values.every(Number.isFinite))
      throw new TypeError("AABB coordinates must be finite");
    if (minX > maxX || minY > maxY || minZ > maxZ)
      throw new RangeError("AABB minimum must not exceed maximum");
  }
  move(dx, dy, dz) {
    finiteDelta(dx, "dx");
    finiteDelta(dy, "dy");
    finiteDelta(dz, "dz");
    return new Aabb(this.minX + dx, this.minY + dy, this.minZ + dz, this.maxX + dx, this.maxY + dy, this.maxZ + dz);
  }
  intersects(other) {
    return this.maxX > other.minX && this.minX < other.maxX && this.maxY > other.minY && this.minY < other.maxY && this.maxZ > other.minZ && this.minZ < other.maxZ;
  }
  clipDisplacement(other, axis, delta) {
    finiteDelta(delta, "delta");
    if (delta === 0)
      return 0;
    if (!overlapOnOtherAxes(this, other, axis))
      return delta;
    const [movingMin, movingMax, obstacleMin, obstacleMax] = axisBounds(this, other, axis);
    if (delta > 0 && movingMax <= obstacleMin)
      return Math.min(delta, obstacleMin - movingMax);
    if (delta < 0 && movingMin >= obstacleMax)
      return Math.max(delta, obstacleMax - movingMin);
    return delta;
  }
  sweptBounds(dx, dy, dz) {
    finiteDelta(dx, "dx");
    finiteDelta(dy, "dy");
    finiteDelta(dz, "dz");
    return new Aabb(dx < 0 ? this.minX + dx : this.minX, dy < 0 ? this.minY + dy : this.minY, dz < 0 ? this.minZ + dz : this.minZ, dx > 0 ? this.maxX + dx : this.maxX, dy > 0 ? this.maxY + dy : this.maxY, dz > 0 ? this.maxZ + dz : this.maxZ);
  }
}
function overlapOnOtherAxes(a, b, axis) {
  if (axis === "x")
    return a.maxY > b.minY && a.minY < b.maxY && a.maxZ > b.minZ && a.minZ < b.maxZ;
  if (axis === "y")
    return a.maxX > b.minX && a.minX < b.maxX && a.maxZ > b.minZ && a.minZ < b.maxZ;
  return a.maxX > b.minX && a.minX < b.maxX && a.maxY > b.minY && a.minY < b.maxY;
}
function axisBounds(a, b, axis) {
  if (axis === "x")
    return [a.minX, a.maxX, b.minX, b.maxX];
  if (axis === "y")
    return [a.minY, a.maxY, b.minY, b.maxY];
  return [a.minZ, a.maxZ, b.minZ, b.maxZ];
}
function finiteDelta(value, name) {
  if (!Number.isFinite(value))
    throw new TypeError(name + " must be finite");
}

// src/game/client/interaction/placement.ts
function validatePlacementTarget(world, hit, placedBlockId, registry) {
  if (placedBlockId === 0)
    return { status: "cannot-place-air" };
  const placedDefinition = registry.getById(placedBlockId);
  if (!placedDefinition)
    return { status: "unknown-placed-block" };
  const face = cardinalFace(hit.face);
  if (!face)
    return { status: "invalid-face" };
  const target = Object.freeze({
    x: hit.block.x + face.x,
    y: hit.block.y + face.y,
    z: hit.block.z + face.z
  });
  const currentId = world.getBlock(target.x, target.y, target.z);
  if (currentId === undefined)
    return { status: "unloaded", target };
  const currentDefinition = registry.getById(currentId);
  if (!currentDefinition)
    return { status: "unknown-target-block", target, blockId: currentId };
  if (!currentDefinition.replaceable)
    return { status: "occupied", target, blockId: currentId };
  return { status: "ready", target, replacedBlockId: currentId };
}
function cardinalFace(face) {
  const isUnit = Math.abs(face.x) + Math.abs(face.y) + Math.abs(face.z) === 1;
  if (!isUnit || ![face.x, face.y, face.z].every((value) => value === -1 || value === 0 || value === 1))
    return;
  return face;
}
function placeBlockFromInventory(world, hit, inventory, slotIndex, registry, playerBounds) {
  const stack = inventory.getSlot(slotIndex);
  if (!stack)
    return { status: "inventory-empty" };
  const blockId = registry.getIdByKey(stack.id);
  if (blockId === undefined || blockId === 0)
    return { status: "not-a-block-item" };
  const validation = validatePlacementTarget(world, hit, blockId, registry);
  if (validation.status !== "ready")
    return validation;
  const definition = registry.getById(blockId);
  if (!definition)
    return { status: "not-a-block-item" };
  if (definition.solid) {
    const targetBounds = new Aabb(validation.target.x, validation.target.y, validation.target.z, validation.target.x + 1, validation.target.y + 1, validation.target.z + 1);
    if (playerBounds.intersects(targetBounds)) {
      return { status: "blocked-by-player", target: validation.target };
    }
  }
  const mutation = world.setBlock(validation.target, blockId);
  if (!mutation.changed)
    return { status: "no-change", target: validation.target };
  const consumed = inventory.remove(slotIndex, 1);
  if (!consumed)
    throw new Error("Placement invariant violated: item stack disappeared during synchronous placement");
  return {
    status: "placed",
    target: validation.target,
    blockId,
    dirtyChunks: mutation.dirtyChunks,
    remainingInSlot: inventory.getSlot(slotIndex)?.count ?? 0
  };
}

// src/game/client/interaction/raycast.ts
function raycastVoxels(world, origin, direction, maxDistance, isSelectable) {
  assertFiniteVector(origin, "origin");
  assertFiniteVector(direction, "direction");
  if (!Number.isFinite(maxDistance) || maxDistance < 0)
    throw new RangeError("maxDistance must be finite and non-negative");
  const length = Math.hypot(direction.x, direction.y, direction.z);
  if (length === 0)
    throw new RangeError("Ray direction must not be zero");
  if (typeof isSelectable !== "function")
    throw new TypeError("isSelectable must be a function");
  const dx = direction.x / length;
  const dy = direction.y / length;
  const dz = direction.z / length;
  let x = Math.floor(origin.x);
  let y = Math.floor(origin.y);
  let z = Math.floor(origin.z);
  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  const stepZ = Math.sign(dz);
  const deltaX = stepX === 0 ? Infinity : Math.abs(1 / dx);
  const deltaY = stepY === 0 ? Infinity : Math.abs(1 / dy);
  const deltaZ = stepZ === 0 ? Infinity : Math.abs(1 / dz);
  let maxX = initialBoundaryTime(origin.x, x, dx, stepX);
  let maxY = initialBoundaryTime(origin.y, y, dy, stepY);
  let maxZ = initialBoundaryTime(origin.z, z, dz, stepZ);
  let distance = 0;
  let face = { x: 0, y: 0, z: 0 };
  while (distance <= maxDistance) {
    const outsideVerticalWorld = world.dimensions !== undefined && (y < 0 || y >= world.dimensions.height);
    const blockId = outsideVerticalWorld ? 0 : world.getBlock(x, y, z);
    if (blockId === undefined) {
      return { status: "unloaded", block: Object.freeze({ x, y, z }), distance };
    }
    if (isSelectable(blockId)) {
      return { status: "hit", blockId, block: Object.freeze({ x, y, z }), face: Object.freeze(face), distance };
    }
    if (maxX <= maxY && maxX <= maxZ) {
      distance = maxX;
      maxX += deltaX;
      x += stepX;
      face = { x: -stepX, y: 0, z: 0 };
    } else if (maxY <= maxZ) {
      distance = maxY;
      maxY += deltaY;
      y += stepY;
      face = { x: 0, y: -stepY, z: 0 };
    } else {
      distance = maxZ;
      maxZ += deltaZ;
      z += stepZ;
      face = { x: 0, y: 0, z: -stepZ };
    }
  }
  return { status: "miss", distance: maxDistance };
}
function initialBoundaryTime(origin, cell, direction, step) {
  if (step === 0)
    return Infinity;
  const boundary = step > 0 ? cell + 1 : cell;
  return Math.max(0, (boundary - origin) / direction);
}
function assertFiniteVector(vector, name) {
  if (![vector.x, vector.y, vector.z].every(Number.isFinite)) {
    throw new TypeError(name + " components must be finite");
  }
}

// src/game/world/physics/collision.ts
function resolveAabbMovement(box, movement, obstacles) {
  const requested = [movement.dx, movement.dy, movement.dz];
  if (!requested.every(Number.isFinite))
    throw new TypeError("Movement deltas must be finite");
  let current = box;
  const actual = { x: movement.dx, y: movement.dy, z: movement.dz };
  for (const axis of ["y", "x", "z"]) {
    let delta = actual[axis];
    for (const obstacle of obstacles)
      delta = current.clipDisplacement(obstacle, axis, delta);
    actual[axis] = delta;
    if (axis === "x")
      current = current.move(delta, 0, 0);
    else if (axis === "y")
      current = current.move(0, delta, 0);
    else
      current = current.move(0, 0, delta);
  }
  const verticalCollision = actual.y !== movement.dy;
  const horizontalCollision = actual.x !== movement.dx || actual.z !== movement.dz;
  return {
    box: current,
    dx: actual.x,
    dy: actual.y,
    dz: actual.z,
    onGround: movement.dy < 0 && verticalCollision,
    horizontalCollision,
    verticalCollision
  };
}

// src/game/world/physics/player-physics.ts
var MAX_STEP_SECONDS = 0.25;

class PlayerPhysics {
  width;
  height;
  moveSpeed;
  sprintMultiplier;
  gravity;
  jumpSpeed;
  terminalVelocity;
  groundProbe;
  positionValue;
  velocityYValue = 0;
  onGroundValue = false;
  horizontalCollisionValue = false;
  verticalCollisionValue = false;
  constructor(spawn, config = {}) {
    this.width = positiveFinite2(config.width ?? 0.6, "width");
    this.height = positiveFinite2(config.height ?? 1.8, "height");
    this.moveSpeed = positiveFinite2(config.moveSpeed ?? 4.3, "moveSpeed");
    this.sprintMultiplier = positiveFinite2(config.sprintMultiplier ?? 1.3, "sprintMultiplier");
    this.gravity = positiveFinite2(config.gravity ?? 24, "gravity");
    this.jumpSpeed = positiveFinite2(config.jumpSpeed ?? 8, "jumpSpeed");
    this.terminalVelocity = positiveFinite2(config.terminalVelocity ?? 50, "terminalVelocity");
    this.groundProbe = positiveFinite2(config.groundProbe ?? 0.025, "groundProbe");
    this.positionValue = validatePosition(spawn);
  }
  get bounds() {
    const half = this.width / 2;
    return new Aabb(this.positionValue.x - half, this.positionValue.y, this.positionValue.z - half, this.positionValue.x + half, this.positionValue.y + this.height, this.positionValue.z + half);
  }
  get state() {
    return Object.freeze({
      position: Object.freeze({ ...this.positionValue }),
      velocityY: this.velocityYValue,
      onGround: this.onGroundValue,
      horizontalCollision: this.horizontalCollisionValue,
      verticalCollision: this.verticalCollisionValue
    });
  }
  teleport(position) {
    this.positionValue = validatePosition(position);
    this.velocityYValue = 0;
    this.onGroundValue = false;
    this.horizontalCollisionValue = false;
    this.verticalCollisionValue = false;
  }
  step(deltaSeconds, input, obstaclesFor) {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0 || deltaSeconds > MAX_STEP_SECONDS) {
      throw new RangeError("deltaSeconds must be in (0, 0.25]");
    }
    if (![input.moveX, input.moveZ].every(Number.isFinite))
      throw new TypeError("Movement input must be finite");
    if (typeof input.jump !== "boolean")
      throw new TypeError("jump input must be boolean");
    if (input.sprint !== undefined && typeof input.sprint !== "boolean")
      throw new TypeError("sprint input must be boolean when provided");
    if (typeof obstaclesFor !== "function")
      throw new TypeError("obstaclesFor must be a function");
    let moveX = clamp(input.moveX, -1, 1);
    let moveZ = clamp(input.moveZ, -1, 1);
    const moveLength = Math.hypot(moveX, moveZ);
    if (moveLength > 1) {
      moveX /= moveLength;
      moveZ /= moveLength;
    }
    const horizontalSpeed = this.moveSpeed * (input.sprint === true ? this.sprintMultiplier : 1);
    const dx = moveX * horizontalSpeed * deltaSeconds;
    const dz = moveZ * horizontalSpeed * deltaSeconds;
    if (input.jump && this.onGroundValue) {
      this.velocityYValue = this.jumpSpeed;
      this.onGroundValue = false;
    }
    this.velocityYValue = Math.max(-this.terminalVelocity, this.velocityYValue - this.gravity * deltaSeconds);
    const dy = this.velocityYValue * deltaSeconds;
    const startingBounds = this.bounds;
    const swept = startingBounds.sweptBounds(dx, dy, dz);
    const result = resolveAabbMovement(startingBounds, { dx, dy, dz }, obstaclesFor(swept));
    const half = this.width / 2;
    this.positionValue = Object.freeze({
      x: result.box.minX + half,
      y: result.box.minY,
      z: result.box.minZ + half
    });
    if (result.verticalCollision)
      this.velocityYValue = 0;
    this.horizontalCollisionValue = result.horizontalCollision;
    this.verticalCollisionValue = result.verticalCollision;
    this.onGroundValue = result.onGround;
    if (!this.onGroundValue) {
      const currentBounds = this.bounds;
      const probeBounds = currentBounds.sweptBounds(0, -this.groundProbe, 0);
      const probe = resolveAabbMovement(currentBounds, { dx: 0, dy: -this.groundProbe, dz: 0 }, obstaclesFor(probeBounds));
      if (probe.onGround) {
        this.onGroundValue = true;
        if (this.velocityYValue < 0)
          this.velocityYValue = 0;
      }
    }
    return this.state;
  }
}
function validatePosition(position) {
  if (![position.x, position.y, position.z].every(Number.isFinite)) {
    throw new TypeError("Player position must contain finite coordinates");
  }
  return Object.freeze({ x: position.x, y: position.y, z: position.z });
}
function positiveFinite2(value, name) {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(name + " must be finite and positive");
  return value;
}
function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

// src/game/world/physics/world-collision.ts
function queryCollisionBoxes(world, bounds, registry, maxCells = 8192) {
  if (!Number.isSafeInteger(maxCells) || maxCells <= 0)
    throw new RangeError("maxCells must be a positive safe integer");
  const minX = Math.floor(bounds.minX);
  const minY = Math.floor(bounds.minY);
  const minZ = Math.floor(bounds.minZ);
  const maxX = Math.floor(bounds.maxX - 0.000000001);
  const maxY = Math.floor(bounds.maxY - 0.000000001);
  const maxZ = Math.floor(bounds.maxZ - 0.000000001);
  const countX = Math.max(0, maxX - minX + 1);
  const countY = Math.max(0, maxY - minY + 1);
  const countZ = Math.max(0, maxZ - minZ + 1);
  if (countX * countY * countZ > maxCells)
    throw new RangeError("Collision broad-phase query exceeds maxCells");
  const boxes = [];
  const unloadedCells = [];
  for (let y = minY;y <= maxY; y += 1) {
    for (let z = minZ;z <= maxZ; z += 1) {
      for (let x = minX;x <= maxX; x += 1) {
        const position = { x, y, z };
        const outsideVerticalWorld = y < 0 || y >= world.dimensions.height;
        const blockId = outsideVerticalWorld ? undefined : world.getBlock(x, y, z);
        if (blockId === undefined) {
          if (!outsideVerticalWorld)
            unloadedCells.push(Object.freeze(position));
          boxes.push(blockCube(x, y, z));
          continue;
        }
        if (blockId === 0)
          continue;
        const definition = registry.getById(blockId);
        if (!definition || definition.solid)
          boxes.push(blockCube(x, y, z));
      }
    }
  }
  return Object.freeze({
    boxes: Object.freeze(boxes),
    unloadedCells: Object.freeze(unloadedCells)
  });
}
function blockCube(x, y, z) {
  return new Aabb(x, y, z, x + 1, y + 1, z + 1);
}

// src/game/util/coordinates.ts
var CHUNK_SIZE_X = 16;
function worldToChunk(worldCoordinate, chunkSize = CHUNK_SIZE_X) {
  assertInteger(worldCoordinate, "worldCoordinate");
  assertPositiveInteger(chunkSize, "chunkSize");
  return Math.floor(worldCoordinate / chunkSize);
}
function worldToLocal(worldCoordinate, chunkSize = CHUNK_SIZE_X) {
  assertInteger(worldCoordinate, "worldCoordinate");
  assertPositiveInteger(chunkSize, "chunkSize");
  return (worldCoordinate % chunkSize + chunkSize) % chunkSize;
}
function localBlockIndex(localX, y, localZ, sizeX, height, sizeZ) {
  assertInteger(localX, "localX");
  assertInteger(y, "y");
  assertInteger(localZ, "localZ");
  assertPositiveInteger(sizeX, "sizeX");
  assertPositiveInteger(height, "height");
  assertPositiveInteger(sizeZ, "sizeZ");
  if (localX < 0 || localX >= sizeX || localZ < 0 || localZ >= sizeZ || y < 0 || y >= height) {
    throw new RangeError("Block coordinates are outside the chunk volume");
  }
  return localX + sizeX * (localZ + sizeZ * y);
}
function assertInteger(value, name) {
  if (!Number.isSafeInteger(value))
    throw new TypeError(name + " must be a safe integer");
}
function assertPositiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError(name + " must be a positive safe integer");
}

// src/game/world/level/chunk/chunk.ts
class ChunkData {
  sizeX;
  height;
  sizeZ;
  blockData;
  _revision = 0;
  constructor(dimensions, initialBlocks) {
    this.sizeX = positiveInteger3(dimensions.sizeX, "sizeX");
    this.height = positiveInteger3(dimensions.height, "height");
    this.sizeZ = positiveInteger3(dimensions.sizeZ, "sizeZ");
    const volume = this.sizeX * this.height * this.sizeZ;
    if (!Number.isSafeInteger(volume) || volume > 2147483647) {
      throw new RangeError("Chunk volume is too large");
    }
    if (initialBlocks && initialBlocks.length !== volume) {
      throw new RangeError("Initial block data length does not match chunk volume");
    }
    this.blockData = initialBlocks ? ChunkData.copyAndValidate(initialBlocks, volume) : new Uint16Array(volume);
  }
  get revision() {
    return this._revision;
  }
  get blocks() {
    return this.blockData.slice();
  }
  getBlock(x, y, z) {
    return this.blockData[localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ)];
  }
  setBlock(x, y, z, blockId) {
    if (!Number.isInteger(blockId) || blockId < 0 || blockId > 65535) {
      throw new RangeError("blockId must be an integer from 0 to 65535");
    }
    const index = localBlockIndex(x, y, z, this.sizeX, this.height, this.sizeZ);
    if (this.blockData[index] === blockId)
      return false;
    this.blockData[index] = blockId;
    this._revision += 1;
    return true;
  }
  toArray() {
    return this.blockData.slice();
  }
  static copyAndValidate(source, expectedLength) {
    if (source.length !== expectedLength)
      throw new RangeError("Initial block data length does not match chunk volume");
    const copy = new Uint16Array(expectedLength);
    for (let index = 0;index < expectedLength; index += 1) {
      const value = source[index];
      if (!Number.isInteger(value) || value < 0 || value > 65535) {
        throw new RangeError("Initial block data contains an invalid block ID at index " + index);
      }
      copy[index] = value;
    }
    return copy;
  }
}
function positiveInteger3(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(name + " must be a positive safe integer");
  }
  return value;
}

// src/game/world/level/world.ts
class VoxelWorld {
  dimensions;
  chunks = new Map;
  dirty = new Set;
  constructor(dimensions) {
    this.dimensions = Object.freeze({
      chunkSizeX: positiveInteger4(dimensions.chunkSizeX, "chunkSizeX"),
      height: positiveInteger4(dimensions.height, "height"),
      chunkSizeZ: positiveInteger4(dimensions.chunkSizeZ, "chunkSizeZ")
    });
  }
  static chunkKey(chunkX, chunkZ) {
    if (!Number.isSafeInteger(chunkX) || !Number.isSafeInteger(chunkZ)) {
      throw new TypeError("Chunk coordinates must be safe integers");
    }
    return chunkX + "," + chunkZ;
  }
  hasChunk(chunkX, chunkZ) {
    return this.chunks.has(VoxelWorld.chunkKey(chunkX, chunkZ));
  }
  loadChunk(chunkX, chunkZ, initialBlocks) {
    const key = VoxelWorld.chunkKey(chunkX, chunkZ);
    if (this.chunks.has(key))
      throw new Error("Chunk is already loaded: " + key);
    const chunk = new ChunkData({
      sizeX: this.dimensions.chunkSizeX,
      height: this.dimensions.height,
      sizeZ: this.dimensions.chunkSizeZ
    }, initialBlocks);
    this.chunks.set(key, chunk);
    this.dirty.add(key);
    for (const neighbor of this.neighborKeys(chunkX, chunkZ)) {
      if (this.chunks.has(neighbor))
        this.dirty.add(neighbor);
    }
    return chunk;
  }
  unloadChunk(chunkX, chunkZ) {
    const key = VoxelWorld.chunkKey(chunkX, chunkZ);
    const removed = this.chunks.delete(key);
    this.dirty.delete(key);
    if (removed) {
      for (const neighbor of this.neighborKeys(chunkX, chunkZ)) {
        if (this.chunks.has(neighbor))
          this.dirty.add(neighbor);
      }
    }
    return removed;
  }
  getBlock(x, y, z) {
    assertWorldCoordinate(x, "x");
    assertWorldCoordinate(y, "y");
    assertWorldCoordinate(z, "z");
    if (y < 0 || y >= this.dimensions.height)
      return;
    const chunkX = worldToChunk(x, this.dimensions.chunkSizeX);
    const chunkZ = worldToChunk(z, this.dimensions.chunkSizeZ);
    const chunk = this.chunks.get(VoxelWorld.chunkKey(chunkX, chunkZ));
    if (!chunk)
      return;
    return chunk.getBlock(worldToLocal(x, this.dimensions.chunkSizeX), y, worldToLocal(z, this.dimensions.chunkSizeZ));
  }
  setBlock(position, blockId) {
    assertWorldCoordinate(position.x, "x");
    assertWorldCoordinate(position.y, "y");
    assertWorldCoordinate(position.z, "z");
    if (position.y < 0 || position.y >= this.dimensions.height)
      throw new RangeError("y is outside the world height");
    if (!Number.isInteger(blockId) || blockId < 0 || blockId > 65535)
      throw new RangeError("blockId must be an integer from 0 to 65535");
    const chunkX = worldToChunk(position.x, this.dimensions.chunkSizeX);
    const chunkZ = worldToChunk(position.z, this.dimensions.chunkSizeZ);
    const chunkKey = VoxelWorld.chunkKey(chunkX, chunkZ);
    const chunk = this.chunks.get(chunkKey);
    if (!chunk)
      throw new Error("Cannot modify an unloaded chunk: " + chunkKey);
    const localX = worldToLocal(position.x, this.dimensions.chunkSizeX);
    const localZ = worldToLocal(position.z, this.dimensions.chunkSizeZ);
    const previousId = chunk.getBlock(localX, position.y, localZ);
    const changed = chunk.setBlock(localX, position.y, localZ, blockId);
    const dirtyChunks = changed ? this.markAffectedChunksDirty(chunkX, chunkZ, localX, localZ) : [];
    return {
      changed,
      previousId,
      blockId,
      position: Object.freeze({ ...position }),
      dirtyChunks: Object.freeze(dirtyChunks)
    };
  }
  consumeDirtyChunks() {
    const result = [...this.dirty];
    this.dirty.clear();
    return result;
  }
  getLoadedChunkCount() {
    return this.chunks.size;
  }
  getLoadedChunkCoordinates() {
    const coordinates = [...this.chunks.keys()].map((key) => {
      const [xText, zText] = key.split(",");
      return Object.freeze({ x: Number(xText), z: Number(zText) });
    });
    coordinates.sort((a, b) => a.x - b.x || a.z - b.z);
    return Object.freeze(coordinates);
  }
  exportChunks() {
    const chunks = [...this.chunks.entries()].map(([key, chunk]) => {
      const [xText, zText] = key.split(",");
      return { x: Number(xText), z: Number(zText), blocks: chunk.toArray() };
    });
    chunks.sort((a, b) => a.x - b.x || a.z - b.z);
    return Object.freeze(chunks.map((chunk) => Object.freeze(chunk)));
  }
  markAffectedChunksDirty(chunkX, chunkZ, localX, localZ) {
    const affected = new Set([VoxelWorld.chunkKey(chunkX, chunkZ)]);
    if (localX === 0)
      affected.add(VoxelWorld.chunkKey(chunkX - 1, chunkZ));
    if (localX === this.dimensions.chunkSizeX - 1)
      affected.add(VoxelWorld.chunkKey(chunkX + 1, chunkZ));
    if (localZ === 0)
      affected.add(VoxelWorld.chunkKey(chunkX, chunkZ - 1));
    if (localZ === this.dimensions.chunkSizeZ - 1)
      affected.add(VoxelWorld.chunkKey(chunkX, chunkZ + 1));
    const result = [];
    for (const key of affected) {
      if (this.chunks.has(key)) {
        this.dirty.add(key);
        result.push(key);
      }
    }
    return result;
  }
  neighborKeys(chunkX, chunkZ) {
    return [
      VoxelWorld.chunkKey(chunkX - 1, chunkZ),
      VoxelWorld.chunkKey(chunkX + 1, chunkZ),
      VoxelWorld.chunkKey(chunkX, chunkZ - 1),
      VoxelWorld.chunkKey(chunkX, chunkZ + 1)
    ];
  }
}
function positiveInteger4(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError(name + " must be a positive safe integer");
  return value;
}
function assertWorldCoordinate(value, name) {
  if (!Number.isSafeInteger(value))
    throw new TypeError(name + " must be a safe integer");
}

// src/game/nbt/save-schema.ts
var MAX_CHUNKS = 4096;
var MAX_TOTAL_BLOCKS = 32000000;
var MAX_INVENTORY_SLOTS = 256;
function validateWorldSave(input) {
  const errors = [];
  if (!isRecord(input))
    return failure(["save must be an object"]);
  if (input.format !== "voxelcraft-world")
    errors.push("format must be voxelcraft-world");
  if (input.schemaVersion !== 1)
    errors.push("unsupported schemaVersion; expected 1");
  if (!isPositiveInteger(input.generatorVersion))
    errors.push("generatorVersion must be a positive integer");
  const metadata = input.metadata;
  if (!isRecord(metadata))
    errors.push("metadata must be an object");
  else {
    if (typeof metadata.name !== "string" || metadata.name.trim().length === 0 || metadata.name.length > 64)
      errors.push("metadata.name must contain 1 to 64 characters");
    if (!Number.isSafeInteger(metadata.seed))
      errors.push("metadata.seed must be a safe integer");
    if (!isIsoDate(metadata.createdAt))
      errors.push("metadata.createdAt must be a valid ISO date");
    if (!isIsoDate(metadata.updatedAt))
      errors.push("metadata.updatedAt must be a valid ISO date");
  }
  const dimensions = input.dimensions;
  let volume = 0;
  if (!isRecord(dimensions))
    errors.push("dimensions must be an object");
  else {
    if (!isBoundedInteger(dimensions.chunkSizeX, 1, 64))
      errors.push("dimensions.chunkSizeX must be an integer from 1 to 64");
    if (!isBoundedInteger(dimensions.chunkSizeZ, 1, 64))
      errors.push("dimensions.chunkSizeZ must be an integer from 1 to 64");
    if (!isBoundedInteger(dimensions.height, 1, 512))
      errors.push("dimensions.height must be an integer from 1 to 512");
    if (isBoundedInteger(dimensions.chunkSizeX, 1, 64) && isBoundedInteger(dimensions.chunkSizeZ, 1, 64) && isBoundedInteger(dimensions.height, 1, 512)) {
      volume = dimensions.chunkSizeX * dimensions.chunkSizeZ * dimensions.height;
      if (volume > 2000000)
        errors.push("single chunk volume exceeds safety limit");
    }
  }
  const normalizedChunks = [];
  const chunkKeys = new Set;
  if (!Array.isArray(input.chunks))
    errors.push("chunks must be an array");
  else {
    if (input.chunks.length > MAX_CHUNKS)
      errors.push("chunks exceeds the maximum count");
    let totalBlocks = 0;
    input.chunks.slice(0, MAX_CHUNKS).forEach((chunk, index) => {
      if (!isRecord(chunk)) {
        errors.push("chunks[" + index + "] must be an object");
        return;
      }
      if (!Number.isSafeInteger(chunk.x) || !Number.isSafeInteger(chunk.z)) {
        errors.push("chunks[" + index + "] coordinates must be safe integers");
        return;
      }
      const key = chunk.x + "," + chunk.z;
      if (chunkKeys.has(key))
        errors.push("duplicate chunk coordinates: " + key);
      chunkKeys.add(key);
      if (!Array.isArray(chunk.blocks)) {
        errors.push("chunks[" + index + "].blocks must be an array");
        return;
      }
      if (chunk.blocks.length !== volume)
        errors.push("chunks[" + index + "].blocks length does not match chunk volume");
      totalBlocks += chunk.blocks.length;
      if (totalBlocks > MAX_TOTAL_BLOCKS)
        errors.push("total saved blocks exceeds safety limit");
      const blocks = [];
      for (let blockIndex = 0;blockIndex < Math.min(chunk.blocks.length, volume); blockIndex += 1) {
        const blockId = chunk.blocks[blockIndex];
        if (!isBoundedInteger(blockId, 0, 65535)) {
          errors.push("chunks[" + index + "].blocks[" + blockIndex + "] is not a valid block ID");
          break;
        }
        blocks.push(blockId);
      }
      if (blocks.length === volume && chunk.blocks.length === volume) {
        normalizedChunks.push(Object.freeze({ x: chunk.x, z: chunk.z, blocks: Object.freeze(blocks) }));
      }
    });
  }
  const player = input.player;
  let normalizedPlayer;
  if (!isRecord(player))
    errors.push("player must be an object");
  else {
    const position = player.position;
    if (!isRecord(position) || ![position.x, position.y, position.z].every(Number.isFinite)) {
      errors.push("player.position must contain finite x, y and z coordinates");
    }
    if (!Number.isFinite(player.yaw))
      errors.push("player.yaw must be finite");
    if (!Number.isFinite(player.pitch) || typeof player.pitch === "number" && Math.abs(player.pitch) > Math.PI / 2)
      errors.push("player.pitch must be within [-pi/2, pi/2]");
    const rawSelectedSlot = player.selectedSlot === undefined ? 0 : player.selectedSlot;
    const maxSelectedSlot = Array.isArray(player.inventory) && player.inventory.length > 0 ? Math.min(8, player.inventory.length - 1) : 8;
    const selectedSlotValid = isBoundedInteger(rawSelectedSlot, 0, maxSelectedSlot);
    if (!selectedSlotValid)
      errors.push("player.selectedSlot must refer to an existing hotbar slot");
    const normalizedInventory = [];
    if (!Array.isArray(player.inventory))
      errors.push("player.inventory must be an array");
    else {
      if (player.inventory.length === 0)
        errors.push("player.inventory must contain at least one slot");
      if (player.inventory.length > MAX_INVENTORY_SLOTS)
        errors.push("player.inventory exceeds the maximum slot count");
      player.inventory.slice(0, MAX_INVENTORY_SLOTS).forEach((stack, index) => {
        if (stack === null) {
          normalizedInventory.push(null);
          return;
        }
        if (!isRecord(stack) || typeof stack.id !== "string" || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(stack.id) || !isBoundedInteger(stack.count, 1, 999) || !isBoundedInteger(stack.maxStackSize, 1, 999) || stack.count > stack.maxStackSize) {
          errors.push("player.inventory[" + index + "] is not a valid item stack");
          return;
        }
        const auxValue = typeof stack.auxValue === "number" && Number.isInteger(stack.auxValue) && stack.auxValue >= 0 && stack.auxValue <= 9999 ? stack.auxValue : 0;
        normalizedInventory.push(Object.freeze({ id: stack.id, count: stack.count, maxStackSize: stack.maxStackSize, auxValue }));
      });
    }
    if (isRecord(position) && [position.x, position.y, position.z].every(Number.isFinite) && Number.isFinite(player.yaw) && Number.isFinite(player.pitch) && Math.abs(player.pitch) <= Math.PI / 2 && Array.isArray(player.inventory) && player.inventory.length <= MAX_INVENTORY_SLOTS && normalizedInventory.length === player.inventory.length && selectedSlotValid) {
      normalizedPlayer = Object.freeze({
        position: Object.freeze({ x: position.x, y: position.y, z: position.z }),
        yaw: player.yaw,
        pitch: player.pitch,
        selectedSlot: rawSelectedSlot,
        inventory: Object.freeze(normalizedInventory)
      });
    }
  }
  if (errors.length > 0 || !isRecord(metadata) || !isRecord(dimensions) || !normalizedPlayer || !isPositiveInteger(input.generatorVersion) || input.schemaVersion !== 1 || typeof metadata.name !== "string" || !Number.isSafeInteger(metadata.seed) || typeof metadata.createdAt !== "string" || typeof metadata.updatedAt !== "string" || !isBoundedInteger(dimensions.chunkSizeX, 1, 64) || !isBoundedInteger(dimensions.chunkSizeZ, 1, 64) || !isBoundedInteger(dimensions.height, 1, 512) || !Array.isArray(input.chunks)) {
    return failure(errors.length ? errors : ["save is invalid"]);
  }
  const value = Object.freeze({
    format: "voxelcraft-world",
    schemaVersion: 1,
    generatorVersion: input.generatorVersion,
    metadata: Object.freeze({
      name: metadata.name,
      seed: metadata.seed,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt
    }),
    dimensions: Object.freeze({
      chunkSizeX: dimensions.chunkSizeX,
      height: dimensions.height,
      chunkSizeZ: dimensions.chunkSizeZ
    }),
    chunks: Object.freeze(normalizedChunks),
    player: normalizedPlayer
  });
  return Object.freeze({ ok: true, value });
}
function failure(errors) {
  return Object.freeze({ ok: false, errors: Object.freeze(errors) });
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isBoundedInteger(value, minimum, maximum) {
  return Number.isSafeInteger(value) && value >= minimum && value <= maximum;
}
function isPositiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}
function isIsoDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) && value.includes("T");
}

// src/game/nbt/world-save.ts
function createWorldSave(world, inventory, metadata, player) {
  const candidate = {
    format: "voxelcraft-world",
    schemaVersion: 1,
    generatorVersion: metadata.generatorVersion,
    metadata: {
      name: metadata.name,
      seed: metadata.seed,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt
    },
    dimensions: world.dimensions,
    chunks: world.exportChunks().map((chunk) => ({
      x: chunk.x,
      z: chunk.z,
      blocks: Array.from(chunk.blocks)
    })),
    player: {
      position: { ...player.position },
      yaw: player.yaw,
      pitch: player.pitch,
      selectedSlot: player.selectedSlot ?? 0,
      inventory: inventory.snapshot().map((stack) => stack ? { ...stack } : null)
    }
  };
  const validation = validateWorldSave(candidate);
  if (!validation.ok)
    throw new TypeError("Cannot create invalid world save: " + validation.errors.join("; "));
  return validation.value;
}
function restoreWorldSave(input) {
  const validation = validateWorldSave(input);
  if (!validation.ok)
    return Object.freeze({ ok: false, errors: validation.errors });
  const save = validation.value;
  try {
    const world = new VoxelWorld(save.dimensions);
    for (const chunk of save.chunks) {
      world.loadChunk(chunk.x, chunk.z, chunk.blocks);
    }
    const inventory = new Inventory(Math.max(1, save.player.inventory.length));
    save.player.inventory.forEach((stack, index) => {
      if (stack)
        inventory.setSlot(index, stack);
    });
    return Object.freeze({
      ok: true,
      restored: Object.freeze({
        save,
        world,
        inventory,
        player: save.player
      })
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      errors: Object.freeze(["save restoration failed: " + (error instanceof Error ? error.message : "unknown error")])
    });
  }
}

// src/game/engine.ts
class VoxelCraftEngine {
  world;
  inventory;
  player;
  registry;
  clock;
  gameMode;
  tool;
  miningSession = null;
  selectedSlotValue = 0;
  static fromSave(input) {
    const result = restoreWorldSave(input);
    if (!result.ok)
      return result;
    const { save, world, inventory, player } = result.restored;
    const engine = new VoxelCraftEngine({
      dimensions: save.dimensions,
      spawn: player.position,
      inventorySlots: inventory.size
    });
    for (const chunk of world.exportChunks()) {
      engine.loadChunk(chunk.x, chunk.z, chunk.blocks);
    }
    inventory.snapshot().forEach((stack, index) => {
      if (stack)
        engine.inventory.setSlot(index, stack);
    });
    engine.selectSlot(player.selectedSlot ?? 0);
    return Object.freeze({
      ok: true,
      engine,
      view: Object.freeze({ yaw: player.yaw, pitch: player.pitch })
    });
  }
  constructor(options = {}) {
    this.registry = options.registry ?? defaultBlockRegistry;
    this.world = new VoxelWorld(options.dimensions ?? { chunkSizeX: 16, height: 64, chunkSizeZ: 16 });
    this.inventory = new Inventory(options.inventorySlots ?? 36);
    this.player = new PlayerPhysics(options.spawn ?? { x: 0.5, y: 2, z: 0.5 });
    this.clock = new FixedStepClock;
    this.gameMode = options.gameMode ?? "creative";
    this.tool = options.tool ?? null;
  }
  get selectedSlot() {
    return this.selectedSlotValue;
  }
  selectSlot(index) {
    const hotbarSize = Math.min(9, this.inventory.size);
    if (!Number.isSafeInteger(index) || index < 0 || index >= hotbarSize) {
      throw new RangeError("Selected slot must be within the hotbar");
    }
    this.selectedSlotValue = index;
  }
  loadChunk(chunkX, chunkZ, initialBlocks) {
    return this.world.loadChunk(chunkX, chunkZ, initialBlocks);
  }
  step(frameSeconds, input) {
    let playerState = this.player.state;
    const clockResult = this.clock.advance(frameSeconds, (deltaSeconds) => {
      playerState = this.player.step(deltaSeconds, input, (sweptBounds) => queryCollisionBoxes(this.world, sweptBounds, this.registry).boxes);
    });
    return Object.freeze({ clock: clockResult, player: playerState });
  }
  target(origin, direction, reach = 6) {
    return raycastVoxels(this.world, origin, direction, reach, (id2) => this.registry.getById(id2)?.selectable ?? false);
  }
  startMining(target, tool = this.tool) {
    const result = beginMining(this.world, target, this.registry, {
      mode: this.gameMode,
      tool
    });
    this.miningSession = result.status === "started" ? result.session : null;
    return result;
  }
  cancelMining() {
    if (!this.miningSession)
      return false;
    this.miningSession.cancel();
    this.miningSession = null;
    return true;
  }
  tickMining(ticks, currentTarget) {
    const session = this.miningSession;
    if (!session)
      return { status: "no-session" };
    const currentBlockId = this.world.getBlock(session.target.x, session.target.y, session.target.z);
    const progress = session.tick(ticks, currentTarget, currentBlockId);
    if (progress.status === "cancelled") {
      this.miningSession = null;
      return progress;
    }
    if (progress.status !== "completed")
      return progress;
    const result = finishBlockBreak(this.world, session, this.registry, this.inventory);
    this.miningSession = null;
    if (result.status === "broken") {
      if (this.gameMode === "survival") {
        this.applyToolDurability();
      }
      return Object.freeze({ status: "broken", dropsRemaining: result.dropsRemaining });
    }
    if (result.status === "target-changed" || result.status === "unloaded" || result.status === "unbreakable") {
      return { status: "cancelled" };
    }
    return { status: "no-session" };
  }
  applyToolDurability() {
    const slot = this.selectedSlotValue;
    const stack = this.inventory.getSlot(slot);
    if (!stack)
      return;
    const tool = getTool(stack.id);
    if (!tool)
      return;
    const newStack = applyMineBlockDurability(stack, tool);
    if (newStack === null) {
      this.inventory.setSlot(slot, null);
    } else if (newStack !== stack) {
      this.inventory.setSlot(slot, newStack);
    }
  }
  placeSelected(hit) {
    return placeBlockFromInventory(this.world, hit, this.inventory, this.selectedSlotValue, this.registry, this.player.bounds);
  }
  createSave(metadata, view) {
    const state = this.player.state;
    const snapshot = {
      position: state.position,
      yaw: view.yaw,
      pitch: view.pitch,
      selectedSlot: this.selectedSlotValue
    };
    return createWorldSave(this.world, this.inventory, metadata, snapshot);
  }
  get playerBounds() {
    return this.player.bounds;
  }
}

// src/game/client/renderer/chunk-mesher.ts
var FACES = Object.freeze([
  { face: "west", normal: [-1, 0, 0], dx: -1, dy: 0, dz: 0, vertices: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
  { face: "east", normal: [1, 0, 0], dx: 1, dy: 0, dz: 0, vertices: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]] },
  { face: "down", normal: [0, -1, 0], dx: 0, dy: -1, dz: 0, vertices: [[0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1]] },
  { face: "up", normal: [0, 1, 0], dx: 0, dy: 1, dz: 0, vertices: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]] },
  { face: "north", normal: [0, 0, -1], dx: 0, dy: 0, dz: -1, vertices: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
  { face: "south", normal: [0, 0, 1], dx: 0, dy: 0, dz: 1, vertices: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] }
]);
var VISIBLE_LAYERS = ["opaque", "cutout", "translucent"];
function buildChunkMesh(world, chunkX, chunkZ, registry) {
  if (!world.hasChunk(chunkX, chunkZ))
    throw new Error("Cannot mesh an unloaded chunk: " + chunkX + "," + chunkZ);
  const dimensions = world.dimensions;
  const baseX = chunkX * dimensions.chunkSizeX;
  const baseZ = chunkZ * dimensions.chunkSizeZ;
  const layers = {
    opaque: emptyLayer(),
    cutout: emptyLayer(),
    translucent: emptyLayer()
  };
  let unsupportedShapeBlocks = 0;
  let unknownBlockIds = 0;
  for (let localX = 0;localX < dimensions.chunkSizeX; localX += 1) {
    for (let y = 0;y < dimensions.height; y += 1) {
      for (let localZ = 0;localZ < dimensions.chunkSizeZ; localZ += 1) {
        const x = baseX + localX;
        const z = baseZ + localZ;
        const blockId = world.getBlock(x, y, z);
        if (blockId === undefined || blockId === 0)
          continue;
        const definition = registry.getById(blockId);
        if (!definition) {
          unknownBlockIds += 1;
          continue;
        }
        if (definition.renderLayer === "invisible" || definition.shape === "none")
          continue;
        if (definition.shape !== "cube") {
          unsupportedShapeBlocks += 1;
          continue;
        }
        if (!VISIBLE_LAYERS.includes(definition.renderLayer))
          continue;
        for (const face of FACES) {
          const neighborId = world.getBlock(x + face.dx, y + face.dy, z + face.dz);
          if (isFaceOccluded(definition, neighborId, registry))
            continue;
          appendFace(layers[definition.renderLayer], face, x, y, z, blockId);
        }
      }
    }
  }
  const output = {};
  for (const layerName of VISIBLE_LAYERS) {
    const layer = layers[layerName];
    if (layer.faceCount === 0)
      continue;
    output[layerName] = Object.freeze({
      renderLayer: layerName,
      positions: Float32Array.from(layer.positions),
      normals: Float32Array.from(layer.normals),
      blockIds: Uint16Array.from(layer.blockIds),
      indices: Uint32Array.from(layer.indices),
      faceCount: layer.faceCount
    });
  }
  return Object.freeze({
    chunkX,
    chunkZ,
    layers: Object.freeze(output),
    unsupportedShapeBlocks,
    unknownBlockIds
  });
}
function isFaceOccluded(current, neighborId, registry) {
  if (neighborId === undefined || neighborId === 0)
    return false;
  const neighbor = registry.getById(neighborId);
  if (!neighbor || neighbor.renderLayer === "invisible" || neighbor.shape === "none")
    return false;
  if (neighbor.renderLayer === "opaque")
    return true;
  return current.key === neighbor.key && current.renderLayer === neighbor.renderLayer;
}
function emptyLayer() {
  return { positions: [], normals: [], blockIds: [], indices: [], faceCount: 0 };
}
function appendFace(layer, face, x, y, z, blockId) {
  const firstVertex = layer.blockIds.length;
  for (const vertex of face.vertices) {
    layer.positions.push(x + vertex[0], y + vertex[1], z + vertex[2]);
    layer.normals.push(face.normal[0], face.normal[1], face.normal[2]);
    layer.blockIds.push(blockId);
  }
  layer.indices.push(firstVertex, firstVertex + 1, firstVertex + 2, firstVertex, firstVertex + 2, firstVertex + 3);
  layer.faceCount += 1;
}

// src/game/client/renderer/chunk-mesh-cache.ts
class ChunkMeshCache {
  world;
  registry;
  meshes = new Map;
  constructor(world, registry) {
    this.world = world;
    this.registry = registry;
  }
  get size() {
    return this.meshes.size;
  }
  get(chunkX, chunkZ) {
    return this.meshes.get(chunkKey(chunkX, chunkZ));
  }
  sync() {
    const loadedKeys = new Set(this.world.getLoadedChunkCoordinates().map(({ x, z }) => chunkKey(x, z)));
    let removed = 0;
    const removedChunks = [];
    for (const key of this.meshes.keys()) {
      if (!loadedKeys.has(key)) {
        this.meshes.delete(key);
        const [x, z] = key.split(",").map(Number);
        removedChunks.push(Object.freeze({ x, z }));
        removed += 1;
      }
    }
    const dirtyKeys = new Set(this.world.consumeDirtyChunks());
    let rebuilt = 0;
    const rebuiltChunks = [];
    for (const key of dirtyKeys) {
      if (!loadedKeys.has(key))
        continue;
      const [xText, zText] = key.split(",");
      const x = Number(xText);
      const z = Number(zText);
      this.meshes.set(key, buildChunkMesh(this.world, x, z, this.registry));
      rebuiltChunks.push(Object.freeze({ x, z }));
      rebuilt += 1;
    }
    return Object.freeze({
      rebuilt,
      removed,
      rebuiltChunks: Object.freeze(rebuiltChunks),
      removedChunks: Object.freeze(removedChunks)
    });
  }
  clear() {
    this.meshes.clear();
  }
}
function chunkKey(chunkX, chunkZ) {
  return chunkX + "," + chunkZ;
}

// src/game/world/level/levelgen/terrain-generator.ts
function generateTerrainChunk(world, chunkX, chunkZ, options = {}) {
  if (!Number.isSafeInteger(chunkX) || !Number.isSafeInteger(chunkZ))
    throw new TypeError("Chunk coordinates must be safe integers");
  const seed = options.seed ?? 564;
  const seaLevel = options.seaLevel ?? 7;
  const baseHeight = options.baseHeight ?? 9;
  const amplitude = options.amplitude ?? 5;
  if (!Number.isSafeInteger(seed))
    throw new RangeError("seed must be a safe integer");
  if (!Number.isSafeInteger(seaLevel) || seaLevel < 0 || seaLevel >= world.dimensions.height)
    throw new RangeError("seaLevel is outside world height");
  if (!Number.isFinite(baseHeight) || !Number.isFinite(amplitude) || amplitude < 0)
    throw new RangeError("terrain height settings must be finite and amplitude non-negative");
  if (world.hasChunk(chunkX, chunkZ))
    throw new Error("Cannot generate an already loaded chunk");
  const registry = options.registry ?? defaultBlockRegistry;
  const ids = {
    bedrock: requireId(registry, "minecraft:bedrock"),
    stone: requireId(registry, "minecraft:stone"),
    dirt: requireId(registry, "minecraft:dirt"),
    grass: requireId(registry, "minecraft:grass_block"),
    sand: requireId(registry, "minecraft:sand")
  };
  const dims = world.dimensions;
  const chunk = world.loadChunk(chunkX, chunkZ);
  let minHeight = dims.height - 1, maxHeight = 0;
  for (let localX = 0;localX < dims.chunkSizeX; localX += 1) {
    for (let localZ = 0;localZ < dims.chunkSizeZ; localZ += 1) {
      const x = chunkX * dims.chunkSizeX + localX;
      const z = chunkZ * dims.chunkSizeZ + localZ;
      const broad = valueNoise(x / 28, z / 28, seed);
      const detail = valueNoise(x / 9, z / 9, seed ^ 1597334677);
      const height = Math.max(1, Math.min(dims.height - 2, Math.round(baseHeight + broad * amplitude + detail * amplitude * 0.35)));
      minHeight = Math.min(minHeight, height);
      maxHeight = Math.max(maxHeight, height);
      const surface = height <= seaLevel + 1 ? ids.sand : ids.grass;
      for (let y = 0;y <= height; y += 1) {
        const id2 = y === 0 ? ids.bedrock : y === height ? surface : y >= height - 3 ? ids.dirt : ids.stone;
        chunk.setBlock(localX, y, localZ, id2);
      }
    }
  }
  return Object.freeze({ chunkX, chunkZ, minHeight, maxHeight });
}
function requireId(registry, key) {
  const id2 = registry.getIdByKey(key);
  if (id2 === undefined)
    throw new Error("Terrain requires block definition " + key);
  return id2;
}
function valueNoise(x, z, seed) {
  const x0 = Math.floor(x), z0 = Math.floor(z);
  const tx = smooth(x - x0), tz = smooth(z - z0);
  const a = lattice(x0, z0, seed), b = lattice(x0 + 1, z0, seed);
  const c = lattice(x0, z0 + 1, seed), d = lattice(x0 + 1, z0 + 1, seed);
  return lerp(lerp(a, b, tx), lerp(c, d, tx), tz);
}
function lattice(x, z, seed) {
  let n = Math.imul(x, 374761393) + Math.imul(z, 668265263) + Math.imul(seed, 1442695041);
  n = Math.imul(n ^ n >>> 13, 1274126177);
  n = (n ^ n >>> 16) >>> 0;
  return n / 4294967295 * 2 - 1;
}
function smooth(t) {
  return t * t * (3 - 2 * t);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// src/game/world/level/levelgen/terrain-streaming.ts
function ensureTerrainNeighborhood(world, worldX, worldZ, options = {}) {
  if (!Number.isFinite(worldX) || !Number.isFinite(worldZ)) {
    throw new TypeError("World position must be finite");
  }
  const radius = options.radius ?? 1;
  if (!Number.isSafeInteger(radius) || radius < 0 || radius > 8) {
    throw new RangeError("radius must be a safe integer from 0 to 8");
  }
  const centerChunkX = worldToChunk(Math.floor(worldX), world.dimensions.chunkSizeX);
  const centerChunkZ = worldToChunk(Math.floor(worldZ), world.dimensions.chunkSizeZ);
  const generated = [];
  for (let z = centerChunkZ - radius;z <= centerChunkZ + radius; z += 1) {
    for (let x = centerChunkX - radius;x <= centerChunkX + radius; x += 1) {
      if (world.hasChunk(x, z))
        continue;
      generateTerrainChunk(world, x, z, options);
      generated.push(Object.freeze({ x, z }));
    }
  }
  return Object.freeze({
    centerChunkX,
    centerChunkZ,
    generated: Object.freeze(generated)
  });
}

// src/game/world/entity/types.ts
var MobType;
((MobType2) => {
  MobType2[MobType2["BaseEnemy"] = 1] = "BaseEnemy";
  MobType2[MobType2["BaseCreature"] = 2] = "BaseCreature";
  MobType2[MobType2["BaseWaterCreature"] = 3] = "BaseWaterCreature";
  MobType2[MobType2["Chicken"] = 10] = "Chicken";
  MobType2[MobType2["Cow"] = 11] = "Cow";
  MobType2[MobType2["Pig"] = 12] = "Pig";
  MobType2[MobType2["Sheep"] = 13] = "Sheep";
  MobType2[MobType2["Zombie"] = 32] = "Zombie";
  MobType2[MobType2["Creeper"] = 33] = "Creeper";
  MobType2[MobType2["Skeleton"] = 34] = "Skeleton";
  MobType2[MobType2["Spider"] = 35] = "Spider";
  MobType2[MobType2["PigZombie"] = 36] = "PigZombie";
})(MobType ||= {});
var DATA_SHARED_FLAGS_ID = 0;
var DATA_AIR_SUPPLY_ID = 1;

// src/game/constants.ts
var TICKS_PER_SECOND = 20;
var TICKS_PER_DAY = 19200;
var SECONDS_PER_DAY = TICKS_PER_DAY / TICKS_PER_SECOND;
var FRICTION2_NUMERATOR = 0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91;
var TOTAL_AIR_SUPPLY = 15 * TICKS_PER_SECOND;
var MOB_IDLE_DESPAWN_TICKS = 30 * TICKS_PER_SECOND;
var EAT_ANIMATION_TICKS = TICKS_PER_SECOND * 2;
var CHICKEN_EGG_TIME_MIN_TICKS = TICKS_PER_SECOND * 60 * 5;
var CHICKEN_EGG_TIME_RANGE_TICKS = TICKS_PER_SECOND * 60 * 5;
var SKELETON_RANGED_COOLDOWN_TICKS = TICKS_PER_SECOND * 3;

// src/game/world/entity/entity.ts
var TOTAL_AIR_SUPPLY2 = 15 * TICKS_PER_SECOND;
var RADDEG2 = 180 / Math.PI;
var DEGRAD2 = Math.PI / 180;

class Entity2 {
  static entityCounter = 0;
  static sharedRandom = {
    nextFloat: () => Math.random(),
    nextInt: (n) => Math.floor(Math.random() * n)
  };
  x = 0;
  y = 0;
  z = 0;
  xChunk = 0;
  yChunk = 0;
  zChunk = 0;
  entityId;
  viewScale = 1;
  level;
  xo = 0;
  yo = 0;
  zo = 0;
  xd = 0;
  yd = 0;
  zd = 0;
  yRot = 0;
  xRot = 0;
  yRotO = 0;
  xRotO = 0;
  bb = new Aabb(0, 0, 0, 0, 0, 0);
  heightOffset = 0;
  bbWidth = 0.6;
  bbHeight = 1.8;
  walkDistO = 0;
  walkDist = 0;
  xOld = 0;
  yOld = 0;
  zOld = 0;
  ySlideOffset = 0;
  footSize = 0;
  pushthrough = 0;
  tickCount = 0;
  invulnerableTime = 0;
  airSupply = TOTAL_AIR_SUPPLY2;
  onFire = 0;
  flameTime = 1;
  entityRendererId = 0 /* Default */;
  fallDistance = 0;
  blocksBuilding = false;
  inChunk = false;
  onGround = false;
  horizontalCollision = false;
  verticalCollision = false;
  collision = false;
  hurtMarked = false;
  slide = true;
  removed = false;
  noPhysics = false;
  canRemove = true;
  invisible = false;
  reallyRemoveIfPlayer = false;
  airCapacity = TOTAL_AIR_SUPPLY2;
  makeStepSound = true;
  wasInWater = false;
  fireImmune = false;
  firstTick = true;
  nextStep = 1;
  isStuckInWeb = false;
  constructor(level) {
    this.level = level;
    this._init();
    this.entityId = ++Entity2.entityCounter;
    this.setPos(0, 0, 0);
  }
  reset() {
    this._init();
  }
  _init() {
    this.xo = this.xOld = this.x;
    this.yo = this.yOld = this.y;
    this.zo = this.zOld = this.z;
    this.xRotO = this.xRot;
    this.yRotO = this.yRot;
    this.onFire = 0;
    this.removed = false;
    this.fallDistance = 0;
  }
  remove() {
    this.removed = true;
  }
  setSize(w, h) {
    this.bbWidth = w;
    this.bbHeight = h;
  }
  setRot(yRot, xRot) {
    this.yRot = yRot;
    this.yRotO = yRot;
    this.xRot = xRot;
    this.xRotO = xRot;
  }
  setPos(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    const w = this.bbWidth / 2;
    const h = this.bbHeight;
    const y0 = y - this.heightOffset + this.ySlideOffset;
    this.bb = new Aabb(x - w, y0, z - w, x + w, y0 + h, z + w);
  }
  setPosFrom(pos) {
    if (pos.move)
      this.setPos(pos.x, pos.y, pos.z);
    else
      this.setPos(this.x, this.y, this.z);
    if (pos.rot)
      this.setRot(pos.yRot, pos.xRot);
    else
      this.setRot(this.yRot, this.xRot);
  }
  move(xa, ya, za) {
    const level = this.level;
    if (this.noPhysics) {
      this.bb = this.bb.move(xa, ya, za);
      this.x = (this.bb.minX + this.bb.maxX) / 2;
      this.y = this.bb.minY + this.heightOffset - this.ySlideOffset;
      this.z = (this.bb.minZ + this.bb.maxZ) / 2;
      return;
    }
    if (!level) {
      this.bb = this.bb.move(xa, ya, za);
      this.x = (this.bb.minX + this.bb.maxX) / 2;
      this.y = this.bb.minY + this.heightOffset - this.ySlideOffset;
      this.z = (this.bb.minZ + this.bb.maxZ) / 2;
      return;
    }
    if (this.isStuckInWeb) {
      this.isStuckInWeb = false;
      xa *= 0.25;
      ya *= 0.05;
      za *= 0.25;
      this.xd = 0;
      this.yd = 0;
      this.zd = 0;
    }
    const xo = this.x;
    const zo = this.z;
    let xaOrg = xa;
    let yaOrg = ya;
    let zaOrg = za;
    const cubes = level.getCubes(this, this.bbExpanded(xa, ya, za));
    for (const cube of cubes)
      ya = this.clipY(cube, ya);
    this.bb = this.bb.move(0, ya, 0);
    if (!this.slide && yaOrg !== ya) {
      xa = ya = za = 0;
    }
    const og = this.onGround || yaOrg !== ya && yaOrg < 0;
    for (const cube of cubes)
      xa = this.clipX(cube, xa);
    this.bb = this.bb.move(xa, 0, 0);
    if (!this.slide && xaOrg !== xa) {
      xa = ya = za = 0;
    }
    for (const cube of cubes)
      za = this.clipZ(cube, za);
    this.bb = this.bb.move(0, 0, za);
    if (!this.slide && zaOrg !== za) {
      xa = ya = za = 0;
    }
    this.x = (this.bb.minX + this.bb.maxX) / 2;
    this.y = this.bb.minY + this.heightOffset - this.ySlideOffset;
    this.z = (this.bb.minZ + this.bb.maxZ) / 2;
    this.horizontalCollision = xaOrg !== xa || zaOrg !== za;
    this.verticalCollision = yaOrg !== ya;
    this.onGround = yaOrg !== ya && yaOrg < 0;
    this.collision = this.horizontalCollision || this.verticalCollision;
    this.checkFallDamage(ya, this.onGround);
    if (xaOrg !== xa)
      this.xd = 0;
    if (yaOrg !== ya)
      this.yd = 0;
    if (zaOrg !== za)
      this.zd = 0;
    if (this.makeStepSound) {
      const xm = this.x - xo;
      const zm = this.z - zo;
      this.walkDist += Math.sqrt(xm * xm + zm * zm) * 0.6;
      if (this.walkDist > this.nextStep) {
        this.nextStep = Math.floor(this.walkDist) + 1;
        this.playStepSound(Math.floor(this.x), Math.floor(this.y - 0.2 - this.heightOffset), Math.floor(this.z));
      }
    }
    this.ySlideOffset *= 0.4;
    const water = this.isInWater();
    if (level.containsFireTile(this.bb)) {
      this.burn(1);
      if (!water) {
        this.onFire++;
        if (this.onFire === 0)
          this.onFire = 20 * 15;
      }
    } else if (this.onFire <= 0) {
      this.onFire = -this.flameTime;
    }
    if (water && this.onFire > 0) {
      this.onFire = -this.flameTime;
    }
  }
  bbExpanded(xa, ya, za) {
    return new Aabb(Math.min(this.bb.minX, this.bb.minX + xa), Math.min(this.bb.minY, this.bb.minY + ya), Math.min(this.bb.minZ, this.bb.minZ + za), Math.max(this.bb.maxX, this.bb.maxX + xa), Math.max(this.bb.maxY, this.bb.maxY + ya), Math.max(this.bb.maxZ, this.bb.maxZ + za));
  }
  clipY(cube, ya) {
    if (ya === 0)
      return 0;
    if (!overlapOnAxes(this.bb, cube, "y"))
      return ya;
    if (ya > 0 && this.bb.maxY <= cube.minY)
      return Math.min(ya, cube.minY - this.bb.maxY);
    if (ya < 0 && this.bb.minY >= cube.maxY)
      return Math.max(ya, cube.maxY - this.bb.minY);
    return ya;
  }
  clipX(cube, xa) {
    if (xa === 0)
      return 0;
    if (!overlapOnAxes(this.bb, cube, "x"))
      return xa;
    if (xa > 0 && this.bb.maxX <= cube.minX)
      return Math.min(xa, cube.minX - this.bb.maxX);
    if (xa < 0 && this.bb.minX >= cube.maxX)
      return Math.max(xa, cube.maxX - this.bb.minX);
    return xa;
  }
  clipZ(cube, za) {
    if (za === 0)
      return 0;
    if (!overlapOnAxes(this.bb, cube, "z"))
      return za;
    if (za > 0 && this.bb.maxZ <= cube.minZ)
      return Math.min(za, cube.minZ - this.bb.maxZ);
    if (za < 0 && this.bb.minZ >= cube.maxZ)
      return Math.max(za, cube.maxZ - this.bb.minZ);
    return za;
  }
  makeStuckInWeb() {
    this.isStuckInWeb = true;
    this.fallDistance = 0;
  }
  tick() {
    this.baseTick();
  }
  baseTick() {
    this.tickCount++;
    this.walkDistO = this.walkDist;
    this.xo = this.x;
    this.yo = this.y;
    this.zo = this.z;
    this.xRotO = this.xRot;
    this.yRotO = this.yRot;
    const level = this.level;
    if (!level) {
      this.firstTick = false;
      return;
    }
    if (this.isInWater()) {
      this.fallDistance = 0;
      this.wasInWater = true;
      this.onFire = 0;
    } else {
      this.wasInWater = false;
    }
    if (!level.isClientSide) {
      if (this.onFire > 0) {
        if (this.fireImmune) {
          this.onFire -= 4;
          if (this.onFire < 0)
            this.onFire = 0;
        } else {
          if (this.onFire % 20 === 0) {
            this.hurt(null, 1);
          }
          this.onFire--;
        }
      }
    }
    if (this.isInLava()) {
      this.lavaHurt();
    }
    if (this.y < -64) {
      this.outOfWorld();
    }
    this.firstTick = false;
  }
  outOfWorld() {
    this.remove();
  }
  checkFallDamage(ya, onGround) {
    if (onGround) {
      if (this.fallDistance > 0) {
        if (this.isMob()) {}
        this.causeFallDamage(this.fallDistance);
        this.fallDistance = 0;
      }
    } else {
      if (ya < 0)
        this.fallDistance -= ya;
    }
  }
  causeFallDamage(_fallDistance) {}
  getHeadHeight() {
    return 0;
  }
  moveRelative(xa, za, speed) {
    let dist = Math.sqrt(xa * xa + za * za);
    if (dist < 0.01)
      return;
    if (dist < 1)
      dist = 1;
    dist = speed / dist;
    const xa2 = xa * dist;
    const za2 = za * dist;
    const sin_ = Math.sin(this.yRot * DEGRAD2);
    const cos_ = Math.cos(this.yRot * DEGRAD2);
    this.xd += xa2 * cos_ - za2 * sin_;
    this.zd += za2 * cos_ + xa2 * sin_;
  }
  moveTo(x, y, z, yRot, xRot) {
    this.xOld = this.xo = this.x = x;
    this.yOld = this.yo = this.y = y + this.heightOffset;
    this.zOld = this.zo = this.z = z;
    this.yRot = this.yRotO = yRot;
    this.xRot = this.xRotO = xRot;
    this.setPos(this.x, this.y, this.z);
  }
  distanceToEntity(e) {
    return this.distanceTo(e.x, e.y, e.z);
  }
  distanceTo(x2, y2, z2) {
    const dx = this.x - x2;
    const dy = this.y - y2;
    const dz = this.z - z2;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  distanceToSqr(x2, y2, z2) {
    const dx = this.x - x2;
    const dy = this.y - y2;
    const dz = this.z - z2;
    return dx * dx + dy * dy + dz * dz;
  }
  distanceToSqrEntity(e) {
    return this.distanceToSqr(e.x, e.y, e.z);
  }
  markHurt() {
    this.hurtMarked = true;
  }
  hurt(source, _damage) {
    this.markHurt();
    return false;
  }
  intersects(x0, y0, z0, x1, y1, z1) {
    return this.bb.intersects(new Aabb(x0, y0, z0, x1, y1, z1));
  }
  isPickable() {
    return false;
  }
  isPushable() {
    return false;
  }
  isShootable() {
    return false;
  }
  isCreativeModeAllowed() {
    return false;
  }
  getShadowHeightOffs() {
    return this.bbHeight / 2;
  }
  isAlive() {
    return !this.removed;
  }
  isSneaking() {
    return false;
  }
  isPlayer() {
    return false;
  }
  isMob() {
    return false;
  }
  isItemEntity() {
    return false;
  }
  isHangingEntity() {
    return false;
  }
  getAuxData() {
    return 0;
  }
  isOnFire() {
    return this.onFire > 0;
  }
  interactPreventDefault() {
    return false;
  }
  interact(_player) {
    return false;
  }
  getPickRadius() {
    return 0.1;
  }
  lavaHurt() {
    if (this.fireImmune)
      return;
    this.hurt(null, 4);
    this.onFire = 30 * TICKS_PER_SECOND;
  }
  burn(dmg) {
    if (!this.fireImmune) {
      this.hurt(null, dmg);
    }
  }
  spawnAtLocation(resource, count, yOffs = 0) {
    const level = this.level;
    if (!level)
      return null;
    level.addEntity({ id: resource, count, x: this.x, y: this.y + yOffs, z: this.z });
    return Object.freeze({ id: resource, count });
  }
  isInWater() {
    const level = this.level;
    if (!level)
      return false;
    return level.isInWater(this.bb, this);
  }
  isInLava() {
    const level = this.level;
    if (!level)
      return false;
    return level.containsMaterial(this.bb, "lava");
  }
  isUnderLiquid(material) {
    const level = this.level;
    if (!level)
      return false;
    return level.containsMaterial(this.bb, material);
  }
  isInWall() {
    const level = this.level;
    if (!level)
      return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.y + this.getHeadHeight());
    const zt = Math.floor(this.z);
    return level.isSolidBlockingTile(xt, yt, zt);
  }
  isFree(xa, ya, za, grow = 0) {
    return false;
  }
  getBrightness(_a) {
    const level = this.level;
    if (!level)
      return 0;
    const xTile = Math.floor(this.x);
    const hh = (this.bb.maxY - this.bb.minY) * 0.66;
    const yTile = Math.floor(this.y - this.heightOffset + hh);
    const zTile = Math.floor(this.z);
    return level.getBrightness(xTile, yTile, zTile);
  }
  turn(xo, yo) {
    const xRotOld = this.xRot;
    const yRotOld = this.yRot;
    this.yRot += xo * 0.15;
    this.xRot -= yo * 0.15;
    if (this.xRot < -90)
      this.xRot = -90;
    if (this.xRot > 90)
      this.xRot = 90;
    this.xRotO += this.xRot - xRotOld;
    this.yRotO += this.yRot - yRotOld;
  }
  interpolateTurn(xo, yo) {
    this.yRot += xo * 0.15;
    this.xRot -= yo * 0.15;
    if (this.xRot < -90)
      this.xRot = -90;
    if (this.xRot > 90)
      this.xRot = 90;
  }
  lerpTo(x, y, z, yRot, xRot, _steps) {
    this.setPos(x, y, z);
    this.setRot(yRot, xRot);
  }
  lerpMotion(xd, yd, zd) {
    this.xd = xd;
    this.yd = yd;
    this.zd = zd;
  }
  push(xa, ya, za) {
    this.xd += xa;
    this.yd += ya;
    this.zd += za;
  }
  pushEntity(e) {
    let xa = e.x - this.x;
    let za = e.z - this.z;
    let dd = Math.max(Math.abs(xa), Math.abs(za));
    if (dd >= 0.01) {
      dd = Math.sqrt(dd);
      xa /= dd;
      za /= dd;
      let pow = 1 / dd;
      if (pow > 1)
        pow = 1;
      xa *= pow;
      za *= pow;
      xa *= 0.05;
      za *= 0.05;
      xa *= 1 - this.pushthrough;
      za *= 1 - this.pushthrough;
      this.push(-xa, 0, -za);
      e.push(xa, 0, za);
    }
  }
  animateHurt() {}
  setEquippedSlot(_slot, _item, _auxValue) {}
  queryEntityRenderer() {
    return this.entityRendererId;
  }
  getCreatureBaseType() {
    return 0;
  }
  handleEntityEvent(_id) {}
  playStepSound(xt, yt, zt) {
    const level = this.level;
    if (!level)
      return;
    level.playSound(this, "step.stone", 0.25, 1);
  }
  awardKillScore(_victim, _score) {}
  shouldRenderAtSqrDistance(distance) {
    const dx = this.bb.maxX - this.bb.minX;
    const dy = this.bb.maxY - this.bb.minY;
    const dz = this.bb.maxZ - this.bb.minZ;
    let size = Math.sqrt(dx * dx + dy * dy + dz * dz);
    size *= 64 * this.viewScale;
    return distance < size * size;
  }
}
function overlapOnAxes(a, b, axis) {
  if (axis === "x")
    return a.maxY > b.minY && a.minY < b.maxY && a.maxZ > b.minZ && a.minZ < b.maxZ;
  if (axis === "y")
    return a.maxX > b.minX && a.minX < b.maxX && a.maxZ > b.minZ && a.minZ < b.maxZ;
  return a.maxX > b.minX && a.minX < b.maxX && a.maxY > b.minY && a.minY < b.maxY;
}

// src/game/world/entity/synched-entity-data.ts
var TYPE_BYTE = 0;
var TYPE_STRING = 4;
var TYPE_MASK = 224;
var MAX_ID_VALUE = ~TYPE_MASK & 255;
function setFlagBit(item, flag) {
  if (typeof item.data !== "number") {
    throw new TypeError("setFlag only valid on numeric DataItems (byte/short/int)");
  }
  item.data = item.data | 1 << flag;
}
function clearFlagBit(item, flag) {
  if (typeof item.data !== "number") {
    throw new TypeError("clearFlag only valid on numeric DataItems (byte/short/int)");
  }
  item.data = item.data & ~(1 << flag);
}
function getFlagBit(item, flag) {
  if (typeof item.data !== "number") {
    throw new TypeError("getFlag only valid on numeric DataItems (byte/short/int)");
  }
  return (item.data & 1 << flag) !== 0;
}
function typeOf(value) {
  if (typeof value === "string")
    return TYPE_STRING;
  if (typeof value === "number") {
    return TYPE_BYTE;
  }
  throw new TypeError("Unsupported DataItem payload type");
}

class SynchedEntityData {
  itemsById = new Map;
  dirty = false;
  define(id2, value) {
    if (!Number.isSafeInteger(id2) || id2 < 0 || id2 > MAX_ID_VALUE)
      return;
    if (this.itemsById.has(id2))
      return;
    const type = typeOf(value);
    const item = { type, id: id2, dirty: true, data: value };
    this.itemsById.set(id2, item);
    this.dirty = true;
  }
  getByte(id2) {
    return this.getNumber(id2);
  }
  getShort(id2) {
    return this.getNumber(id2);
  }
  getInt(id2) {
    return this.getNumber(id2);
  }
  getFloat(id2) {
    return this.getNumber(id2);
  }
  getString(id2) {
    const item = this.require(id2);
    if (typeof item.data !== "string") {
      throw new TypeError("DataItem " + id2 + " is not a string");
    }
    return item.data;
  }
  getNumber(id2) {
    const item = this.require(id2);
    if (typeof item.data !== "number") {
      throw new TypeError("DataItem " + id2 + " is not numeric");
    }
    return item.data;
  }
  require(id2) {
    const item = this.itemsById.get(id2);
    if (!item) {
      throw new Error("DataItem not found: " + id2);
    }
    return item;
  }
  set(id2, value) {
    const item = this.itemsById.get(id2);
    if (!item)
      return;
    if (item.type !== typeOf(value)) {
      return;
    }
    if (item.data !== value) {
      item.data = value;
      item.dirty = true;
      this.dirty = true;
    }
  }
  setFlag(id2, flag) {
    const item = this.itemsById.get(id2);
    if (!item)
      return;
    const oldFlag = getFlagBit(item, flag);
    setFlagBit(item, flag);
    if (getFlagBit(item, flag) !== oldFlag) {
      this.markDirty(id2);
    }
  }
  clearFlag(id2, flag) {
    const item = this.itemsById.get(id2);
    if (!item)
      return;
    const oldFlag = getFlagBit(item, flag);
    clearFlagBit(item, flag);
    if (getFlagBit(item, flag) !== oldFlag) {
      this.markDirty(id2);
    }
  }
  getFlag(id2, flag) {
    const item = this.itemsById.get(id2);
    if (!item)
      return false;
    return getFlagBit(item, flag);
  }
  markDirty(id2) {
    const item = this.itemsById.get(id2);
    if (!item)
      return;
    item.dirty = true;
    this.dirty = true;
  }
  isDirty() {
    return this.dirty;
  }
  clearDirty() {
    this.dirty = false;
    for (const item of this.itemsById.values())
      item.dirty = false;
  }
  getItem(id2) {
    return this.itemsById.get(id2);
  }
  items() {
    return [...this.itemsById.values()];
  }
}

// src/game/world/entity/mob.ts
var DEFAULT_MOB_MAX_HEALTH = 10;
var DEFAULT_RUN_SPEED = 0.7;
var DEFAULT_WALKING_SPEED = 0.1;
var DEFAULT_FLYING_SPEED = 0.02;

class Mob2 extends Entity2 {
  invulnerableDuration = 20;
  timeOffs = 0;
  rotA = 0;
  yBodyRot = 0;
  yBodyRotO = 0;
  oAttackAnim = 0;
  attackAnim = 0;
  health = DEFAULT_MOB_MAX_HEALTH;
  lastHealth = 20;
  hurtTime = 0;
  hurtDuration = 0;
  hurtDir = 0;
  deathTime = 0;
  attackTime = 0;
  oTilt = 0;
  tilt = 0;
  lookTime = 0;
  fallTime = 0;
  walkAnimSpeedO = 0;
  walkAnimSpeed = 0;
  walkAnimPos = 0;
  arrowCount = 0;
  removeArrowTime = 0;
  random;
  bypassArmor = false;
  entityData = new SynchedEntityData;
  swinging = false;
  swingTime = 0;
  noActionTime = 0;
  xxa = 0;
  yya = 0;
  yRotA = 0;
  defaultLookAngle = 0;
  runSpeed = DEFAULT_RUN_SPEED;
  walkingSpeed = DEFAULT_WALKING_SPEED;
  flyingSpeed = DEFAULT_FLYING_SPEED;
  textureName = "mob/char.png";
  modelName = "";
  deathScore = 0;
  oRun = 0;
  run = 0;
  animStep = 0;
  animStepO = 0;
  rotOffs = 0;
  bobStrength = 1;
  renderOffset = 0;
  lSteps = 0;
  lx = 0;
  ly = 0;
  lz = 0;
  lyr = 0;
  lxr = 0;
  lastHurt = 0;
  dmgSpill = 0;
  sentX = 0;
  sentY = 0;
  sentZ = 0;
  sentRotX = 0;
  sentRotY = 0;
  sentXd = 0;
  sentYd = 0;
  sentZd = 0;
  jumping = false;
  autoSendPosRot = true;
  moveControl = null;
  jumpControl = null;
  navigation = null;
  goalSelector = null;
  targetSelector = null;
  sensing = null;
  lookingAtId = 0;
  ambientSoundTime = 0;
  speed = 0;
  constructor(level) {
    super(level);
    this.entityData.define(DATA_SHARED_FLAGS_ID, 0);
    this.entityData.define(DATA_AIR_SUPPLY_ID, TOTAL_AIR_SUPPLY2);
    this._init();
    this.health = this.getMaxHealth();
    this.blocksBuilding = true;
    this.ambientSoundTime = level ? -level.random.nextInt(100) : 0;
    this.rotA = (Math.random() + 1) * 0.01;
    this.setPos(this.x, this.y, this.z);
    this.timeOffs = Math.random() * 12398;
    this.yRot = Math.random() * Math.PI * 2;
    this.footSize = 0.5;
    this.random = level?.random ?? Entity2.sharedRandom;
  }
  _init() {
    super._init();
    this.yBodyRot = 0;
    this.yBodyRotO = 0;
    this.rotOffs = 0;
    this.fallTime = 0;
    this.lastHurt = 0;
    this.deathTime = 0;
    this.attackTime = 0;
    this.tilt = 0;
    this.oTilt = 0;
    this.hurtDuration = 0;
    this.hurtTime = 0;
    this.hurtDir = 0;
    this.lookTime = 0;
    this.noActionTime = 0;
    this.xxa = 0;
    this.yya = 0;
    this.yRotA = 0;
    this.health = 10;
    this.lastHealth = 20;
  }
  getMaxHealth() {
    return DEFAULT_MOB_MAX_HEALTH;
  }
  isMob() {
    return true;
  }
  isBaby() {
    return false;
  }
  getMaxSpawnClusterSize() {
    return 4;
  }
  getWalkingSpeedModifier() {
    return 0.7;
  }
  getTexture() {
    return this.textureName;
  }
  isPickable() {
    return !this.removed;
  }
  isPushable() {
    return !this.removed;
  }
  isShootable() {
    return true;
  }
  getHeadHeight() {
    return this.bbHeight * 0.85;
  }
  getVoicePitch() {
    if (this.isBaby()) {
      return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1.5;
    }
    return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1;
  }
  getAmbientSoundInterval() {
    return 8 * TICKS_PER_SECOND;
  }
  playAmbientSound() {
    const ambient = this.getAmbientSound();
    const level = this.level;
    if (ambient && level) {
      level.playSound(this, ambient, this.getSoundVolume(), this.getVoicePitch());
    }
  }
  baseTick() {
    this.oAttackAnim = this.attackAnim;
    super.baseTick();
    if ((this.ambientSoundTime++ & 15) === 0 && this.random.nextInt(2000) < this.ambientSoundTime) {
      this.ambientSoundTime = -this.getAmbientSoundInterval();
      this.playAmbientSound();
    }
    if (this.isAlive() && this.isInWall()) {
      this.hurt(null, 1);
    }
    if (this.isAlive() && this.isUnderLiquid("water") && !this.isWaterMob()) {
      this.airSupply--;
      if (this.airSupply === -20) {
        this.airSupply = 0;
        this.hurt(null, 2);
      }
    } else {
      this.airSupply = this.airCapacity;
    }
    this.oTilt = this.tilt;
    if (this.attackTime > 0)
      this.attackTime--;
    if (this.hurtTime > 0)
      this.hurtTime--;
    if (this.invulnerableTime > 0)
      this.invulnerableTime--;
    if (this.health <= 0) {
      this.deathTime++;
      if (this.deathTime > TICKS_PER_SECOND) {
        this.beforeRemove();
        this.remove();
      }
    }
    this.animStepO = this.animStep;
    this.yBodyRotO = this.yBodyRot;
    this.yRotO = this.yRot;
    this.xRotO = this.xRot;
  }
  tick() {
    super.tick();
    if (this.arrowCount > 0) {
      if (this.removeArrowTime <= 0) {
        this.removeArrowTime = 20 * 3;
      }
      this.removeArrowTime--;
      if (this.removeArrowTime <= 0) {
        this.arrowCount--;
      }
    }
    if (this.lSteps > 0) {
      const xt = this.x + (this.lx - this.x) / this.lSteps;
      const yt = this.y + (this.ly - this.y) / this.lSteps;
      const zt = this.z + (this.lz - this.z) / this.lSteps;
      let yrd = this.lyr - this.yRot;
      while (yrd < -180)
        yrd += 360;
      while (yrd >= 180)
        yrd -= 360;
      this.yRot += yrd / this.lSteps;
      this.xRot += (this.lxr - this.xRot) / this.lSteps;
      this.lSteps--;
      this.setPos(xt, yt, zt);
      this.setRot(this.yRot, this.xRot);
    }
    this.aiStep();
    this.updateWalkAnim();
    const dx = this.x - this.xo;
    const dz = this.z - this.zo;
    const sideDist = Math.sqrt(dx * dx + dz * dz);
    let yBodyRotT = this.yBodyRot;
    let walkSpeed = 0;
    this.oRun = this.run;
    let tRun = 0;
    if (sideDist <= 0.05) {} else {
      tRun = 1;
      walkSpeed = sideDist * 3;
      yBodyRotT = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
    }
    if (this.attackAnim > 0) {
      yBodyRotT = this.yRot;
    }
    if (!this.onGround) {
      tRun = 0;
    }
    this.run += (tRun - this.run) * 0.3;
    let yBodyRotD = yBodyRotT - this.yBodyRot;
    while (yBodyRotD < -180)
      yBodyRotD += 360;
    while (yBodyRotD >= 180)
      yBodyRotD -= 360;
    this.yBodyRot += yBodyRotD * 0.3;
    let headDiff = this.yRot - this.yBodyRot;
    while (headDiff < -180)
      headDiff += 360;
    while (headDiff >= 180)
      headDiff -= 360;
    const behind = headDiff < -90 || headDiff >= 90;
    if (headDiff < -75)
      headDiff = -75;
    if (headDiff >= 75)
      headDiff = 75;
    this.yBodyRot = this.yRot - headDiff;
    if (headDiff * headDiff > 50 * 50) {
      this.yBodyRot += headDiff * 0.2;
    }
    if (behind) {
      walkSpeed *= -1;
    }
    while (this.yRot - this.yRotO < -180)
      this.yRotO -= 360;
    while (this.yRot - this.yRotO >= 180)
      this.yRotO += 360;
    while (this.yBodyRot - this.yBodyRotO < -180)
      this.yBodyRotO -= 360;
    while (this.yBodyRot - this.yBodyRotO >= 180)
      this.yBodyRotO += 360;
    while (this.xRot - this.xRotO < -180)
      this.xRotO -= 360;
    while (this.xRot - this.xRotO >= 180)
      this.xRotO += 360;
    this.animStep += walkSpeed;
  }
  heal(heal) {
    if (this.health <= 0)
      return;
    this.health += heal;
    if (this.health > 20)
      this.health = 20;
    this.invulnerableTime = Math.floor(this.invulnerableDuration / 2);
  }
  hurt(source, dmg) {
    const level = this.level;
    if (level?.isClientSide)
      return false;
    this.noActionTime = 0;
    if (this.health <= 0)
      return false;
    this.walkAnimSpeed = 1.5;
    let sound = true;
    if (this.invulnerableTime > this.invulnerableDuration / 2) {
      if (dmg <= this.lastHurt)
        return false;
      this.actuallyHurt(dmg - this.lastHurt);
      this.lastHurt = dmg;
      sound = false;
    } else {
      this.lastHurt = dmg;
      this.lastHealth = this.health;
      this.invulnerableTime = this.invulnerableDuration;
      this.actuallyHurt(dmg);
      this.hurtTime = 10;
      this.hurtDuration = 10;
    }
    this.hurtDir = 0;
    if (sound) {
      if (level) {
        level.broadcastEntityEvent(this, 2 /* Hurt */);
      }
      this.markHurt();
      if (source) {
        let xd = source.x - this.x;
        let zd = source.z - this.z;
        while (xd * xd + zd * zd < 0.0001) {
          xd = (Math.random() - Math.random()) * 0.01;
          zd = (Math.random() - Math.random()) * 0.01;
        }
        this.hurtDir = Math.atan2(zd, xd) * (180 / Math.PI) - this.yRot;
        this.knockback(source, dmg, xd, zd);
      } else {
        this.hurtDir = (Math.random() * 2 | 0) * 180;
      }
    }
    if (this.health <= 0) {
      if (sound && level) {
        level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      }
      this.die(source);
    } else if (sound && level) {
      level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
    }
    return true;
  }
  actuallyHurt(dmg) {
    if (!this.bypassArmor) {
      dmg = this.getDamageAfterArmorAbsorb(dmg);
    }
    this.health -= dmg;
  }
  getSoundVolume() {
    return 1;
  }
  getAmbientSound() {
    return null;
  }
  getHurtSound() {
    return "random.hurt";
  }
  getDeathSound() {
    return "random.hurt";
  }
  knockback(source, _dmg, xd, zd) {
    const dd = 1 / Math.sqrt(xd * xd + zd * zd);
    const pow = 0.4;
    this.xd *= 0.5;
    this.yd *= 0.5;
    this.zd *= 0.5;
    this.xd -= xd * dd * pow;
    this.yd += 0.4;
    this.zd -= zd * dd * pow;
    if (this.yd > 0.4)
      this.yd = 0.4;
  }
  die(source) {
    if (this.deathScore > 0 && source) {
      source.awardKillScore(this, this.deathScore);
    }
    const level = this.level;
    if (level && !level.isClientSide) {
      if (!this.isBaby()) {
        this.dropDeathLoot();
      }
      level.broadcastEntityEvent(this, 3 /* Death */);
    }
  }
  dropDeathLoot() {
    const loot = this.getDeathLoot();
    if (loot) {
      const count = this.random.nextInt(3);
      for (let i = 0;i < count; i++) {
        this.spawnAtLocation(loot, 1);
      }
    }
  }
  getDeathLoot() {
    return null;
  }
  causeFallDamage(distance) {
    const dmg = Math.ceil(distance - 3);
    if (dmg > 0) {
      const level = this.level;
      if (level) {
        level.playSound(this, dmg > 4 ? "damage.fallbig" : "damage.fallsmall", 0.75, 1);
      }
      this.hurt(null, dmg);
    }
  }
  travel(xa, ya) {
    if (this.isInWater()) {
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.8;
      this.yd *= 0.8;
      this.zd *= 0.8;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd)) {
        this.yd = 0.3;
      }
    } else if (this.isInLava()) {
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.5;
      this.yd *= 0.5;
      this.zd *= 0.5;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd)) {
        this.yd = 0.3;
      }
    } else {
      let friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        const t = this.getTileBelow();
        if (t > 0) {
          friction = this.getTileFriction(t) * 0.91;
        }
      }
      const friction2 = 0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91 / (friction * friction * friction);
      this.moveRelative(xa, ya, this.onGround ? this.walkingSpeed * friction2 : this.flyingSpeed);
      friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        const t = this.getTileBelow();
        if (t > 0) {
          friction = this.getTileFriction(t) * 0.91;
        }
      }
      if (this.onLadder()) {
        this.fallDistance = 0;
        if (this.yd < -0.15)
          this.yd = -0.15;
        if (this.isSneaking() && this.yd < 0)
          this.yd = 0;
      }
      this.move(this.xd, this.yd, this.zd);
      if (this.horizontalCollision && this.onLadder()) {
        this.yd = 0.2;
      }
      this.yd -= 0.08;
      this.yd *= 0.98;
      this.xd *= friction;
      this.zd *= friction;
    }
  }
  aiStep() {
    if (this.isImmobile()) {
      this.jumping = false;
      this.xxa = 0;
      this.yya = 0;
      this.yRotA = 0;
    } else {
      if (!this.interpolateOnly()) {
        if (this.useNewAi()) {
          this.newServerAiStep();
        } else {
          this.updateAi();
        }
      }
    }
    const inWater = this.isInWater();
    const inLava = this.isInLava();
    if (this.jumping) {
      if (inWater) {
        this.yd += 0.04;
      } else if (inLava) {
        this.yd += 0.04;
      } else if (this.onGround) {
        this.jumpFromGround();
      }
    }
    this.xxa *= 0.98;
    this.yya *= 0.98;
    this.yRotA *= 0.9;
    const normalSpeed = this.walkingSpeed;
    const normalAirControllSpeed = this.flyingSpeed;
    this.walkingSpeed *= this.getWalkingSpeedModifier();
    this.flyingSpeed *= this.getWalkingSpeedModifier();
    this.travel(this.xxa, this.yya);
    this.walkingSpeed = normalSpeed;
    this.flyingSpeed = normalAirControllSpeed;
    if (!this.isPlayer() || !this.isSleeping()) {
      const entities = this.getEntitiesInAABB(this.bbGrowXZ(0.2));
      for (const e of entities) {
        if (e.isPlayer() && e.isSleeping())
          continue;
        if (e.isPushable())
          e.push(0.1, 0, 0);
      }
    }
  }
  updateAi() {
    this.noActionTime++;
    const player = this.getNearestPlayer(-1);
    this.checkDespawnMob(player);
    this.xxa = 0;
    this.yya = 0;
    const lookDistance = 8;
    if (Math.random() < 0.02) {
      const nearby = this.getNearestPlayer(lookDistance);
      if (nearby) {
        this.lookingAtId = nearby.entityId;
        this.lookTime = 10 + Math.floor(Math.random() * 20);
      } else {
        this.yRotA = (Math.random() - 0.5) * 20;
      }
    }
    if (this.lookingAtId !== 0) {
      const lookingAt = this.getEntity(this.lookingAtId);
      this.lookingAtId = 0;
      if (lookingAt) {
        this.lookAt(lookingAt, 10, this.getMaxHeadXRot());
        if (this.lookTime-- <= 0 || lookingAt.removed || lookingAt.distanceToSqrEntity(this) > lookDistance * lookDistance) {
          this.lookingAtId = 0;
        } else {
          this.lookingAtId = lookingAt.entityId;
        }
      }
    } else {
      if (Math.random() < 0.05) {
        this.yRotA = (Math.random() - 0.5) * 20;
      }
      this.yRot += this.yRotA;
      this.xRot = this.defaultLookAngle;
    }
    const inWater = this.isInWater();
    const inLava = this.isInLava();
    if (inWater || inLava)
      this.jumping = Math.random() < 0.8;
  }
  newServerAiStep() {
    this.noActionTime++;
    this.checkDespawn();
    this.jumping = false;
    this.sensing?.tick();
    if (this.random.nextInt(5) === 0) {
      this.targetSelector?.tick();
      this.goalSelector?.tick();
    }
    this.navigation?.tick();
    this.moveControl?.tick();
    this.jumpControl?.tick();
  }
  isImmobile() {
    return this.health <= 0;
  }
  checkDespawn() {
    const level = this.level;
    if (!level)
      return;
    this.checkDespawnMob(level.getNearestPlayer(this, -1));
  }
  checkDespawnMob(nearestBlocking) {
    if (!nearestBlocking)
      return;
    const removeIfFar = this.removeWhenFarAway();
    const xd = nearestBlocking.x - this.x;
    const yd = nearestBlocking.y - this.y;
    const zd = nearestBlocking.z - this.z;
    const sd = xd * xd + yd * yd + zd * zd;
    if (removeIfFar && sd > 96 * 96)
      this.remove();
    if (this.noActionTime > 30 * TICKS_PER_SECOND && this.random.nextInt(800) === 0 && removeIfFar && sd > 32 * 32) {
      this.remove();
    } else {
      this.noActionTime = 0;
    }
  }
  handleEntityEvent(id2) {
    if (id2 === 2 /* Hurt */) {
      this.walkAnimSpeed = 1.5;
      this.invulnerableTime = this.invulnerableDuration;
      this.hurtTime = 10;
      this.hurtDuration = 10;
      this.hurtDir = 0;
      const level = this.level;
      if (level) {
        level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
      }
      this.hurt(null, 0);
    } else if (id2 === 3 /* Death */) {
      const level = this.level;
      if (level) {
        level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      }
      this.health = 0;
      this.die(null);
    } else {
      super.handleEntityEvent(id2);
    }
  }
  getEntityData() {
    return this.entityData;
  }
  getDamageAfterArmorAbsorb(damage) {
    const absorb = 25 - this.getArmorValue();
    const v = damage * absorb + this.dmgSpill;
    this.hurtArmor(damage);
    const finalDamage = Math.trunc(v / 25);
    this.dmgSpill = v % 25;
    return finalDamage;
  }
  getArmorValue() {
    return 0;
  }
  hurtArmor(_damage) {}
  canSee(target) {
    return true;
  }
  getCarriedItem() {
    return null;
  }
  getUseItemDuration() {
    return 0;
  }
  addAdditonalSaveData(tag) {
    tag["Health"] = this.health;
    tag["HurtTime"] = this.hurtTime;
    tag["DeathTime"] = this.deathTime;
    tag["AttackTime"] = this.attackTime;
  }
  readAdditionalSaveData(tag) {
    this.health = Number(tag["Health"] ?? this.health);
    this.hurtTime = Number(tag["HurtTime"] ?? 0);
    this.deathTime = Number(tag["DeathTime"] ?? 0);
    this.attackTime = Number(tag["AttackTime"] ?? 0);
  }
  jumpFromGround() {
    this.yd = 0.42;
  }
  canSpawn() {
    return true;
  }
  isWaterMob() {
    return false;
  }
  beforeRemove() {}
  updateWalkAnim() {}
  onLadder() {
    return false;
  }
  removeWhenFarAway() {
    return false;
  }
  updateAttackAnim() {}
  swing() {
    if (!this.swinging) {
      this.swinging = true;
      this.swingTime = 0;
    }
  }
  getTileBelow() {
    return 0;
  }
  getTileFriction(tileId) {
    return 0.6;
  }
  interpolateOnly() {
    return false;
  }
  useNewAi() {
    return false;
  }
  isSleeping() {
    return false;
  }
  bbGrowXZ(amount) {
    return new Aabb(this.bb.minX - amount, this.bb.minY, this.bb.minZ - amount, this.bb.maxX + amount, this.bb.maxY, this.bb.maxZ + amount);
  }
  getEntitiesInAABB(bb) {
    return [];
  }
  getNearestPlayer(maxDist) {
    return null;
  }
  getEntity(entityId) {
    return null;
  }
  lookAt(target, yMax, xMax) {}
  getMaxHeadXRot() {
    return 40;
  }
  distanceToSqrEntity(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return dx * dx + dy * dy + dz * dz;
  }
}

// src/game/world/entity/mob-hierarchy.ts
var MAX_TURN = 30;
var DATA_FLAGS_ID_AGEABLE = 14;
var DATAFLAG_ISBABY = 0;

class PathfinderMob extends Mob2 {
  attackTargetId = 0;
  holdGround = false;
  fleeTime = 0;
  path = null;
  constructor(level) {
    super(level);
  }
  canSpawn() {
    if (!super.canSpawn())
      return false;
    return this.getWalkTargetValue(Math.floor(this.x), Math.floor(this.bb.minY), Math.floor(this.z)) >= 0;
  }
  isPathFinding() {
    return this.path != null;
  }
  setPath(path) {
    this.path = path;
  }
  getAttackTarget() {
    if (this.attackTargetId === 0)
      return null;
    const level = this.level;
    if (!level)
      return null;
    return level.getEntity(this.attackTargetId);
  }
  setAttackTarget(attacker) {
    this.attackTargetId = attacker ? attacker.entityId : 0;
  }
  shouldHoldGround() {
    return false;
  }
  updateAi() {
    if (this.fleeTime > 0)
      this.fleeTime--;
    this.holdGround = this.shouldHoldGround();
    const maxDist = 16;
    let attackTarget = null;
    if (this.attackTargetId === 0) {
      attackTarget = this.findAttackTarget();
      if (attackTarget) {
        this.path = this.findPathToEntity(attackTarget, maxDist);
        this.attackTargetId = attackTarget.entityId;
      }
    } else {
      const level = this.level;
      attackTarget = level ? level.getEntity(this.attackTargetId) : null;
      if (!attackTarget || !attackTarget.isAlive()) {
        this.attackTargetId = 0;
        attackTarget = null;
      } else {
        this.attackTargetId = attackTarget.entityId;
        const d = attackTarget.distanceToEntity(this);
        if (this.canSee(attackTarget)) {
          this.checkHurtTarget(attackTarget, d);
        } else {
          this.checkCantSeeTarget(attackTarget, d);
        }
      }
    }
    let doStroll = false;
    if (!this.holdGround && attackTarget && (!this.path || this.random.nextInt(20) === 0)) {
      this.path = this.findPathToEntity(attackTarget, maxDist);
    } else if (!this.holdGround) {
      if (!this.path && this.random.nextInt(180) === 0) {
        doStroll = true;
      } else if (this.random.nextInt(120) === 0) {
        doStroll = true;
      } else if (this.fleeTime > 0 && (this.fleeTime & 7) === 1) {
        doStroll = true;
      }
    }
    if (doStroll && this.noActionTime < TICKS_PER_SECOND * 5) {
      this.findRandomStrollLocation();
    }
    if (!this.path || this.random.nextInt(100) === 0) {
      super.updateAi();
      return;
    }
    const target = this.path.currentPos(this);
    if (target) {
      const r = this.bbWidth * 2;
      if (this.distanceToSqr(target.x, target.y, target.z) >= r * r) {
        const xd = target.x - this.x;
        const zd = target.z - this.z;
        const yRotD = Math.atan2(zd, xd) * (180 / Math.PI) - 90;
        let rotDiff = yRotD - this.yRot;
        while (rotDiff < -180)
          rotDiff += 360;
        while (rotDiff >= 180)
          rotDiff -= 360;
        if (rotDiff > MAX_TURN)
          rotDiff = MAX_TURN;
        if (rotDiff < -MAX_TURN)
          rotDiff = -MAX_TURN;
        this.yya = this.runSpeed;
        this.yRot += rotDiff;
        const yd = target.y - Math.floor(this.bb.minY + 0.5);
        if (yd > 0)
          this.jumping = true;
      }
    }
    if (attackTarget) {
      this.lookAt(attackTarget, 30, 30);
    }
    if (this.horizontalCollision && !this.isPathFinding())
      this.jumping = true;
    if (this.random.nextFloat() < 0.8 && (this.isInWater() || this.isInLava()))
      this.jumping = true;
  }
  findRandomStrollLocation() {
    let hasBest = false;
    let xBest = 0, yBest = 0, zBest = 0;
    let best = -99999;
    for (let i = 0;i < 10; i++) {
      const xt = Math.floor(this.x + this.random.nextInt(13) - 6);
      const yt = Math.floor(this.y + this.random.nextInt(7) - 3);
      const zt = Math.floor(this.z + this.random.nextInt(13) - 6);
      const value = this.getWalkTargetValue(xt, yt, zt);
      if (value > best) {
        best = value;
        xBest = xt;
        yBest = yt;
        zBest = zt;
        hasBest = true;
      }
    }
    if (hasBest) {
      this.path = this.findPathToCoords(xBest, yBest, zBest, 10);
    }
  }
  checkHurtTarget(_target, _d) {}
  checkCantSeeTarget(_target, d) {
    if (d > 32)
      this.attackTargetId = 0;
  }
  getWalkTargetValue(_x, _y, _z) {
    return 0;
  }
  findAttackTarget() {
    return null;
  }
  getWalkingSpeedModifier() {
    let speed = super.getWalkingSpeedModifier();
    if (this.fleeTime > 0)
      speed *= 2;
    return speed;
  }
  getNoActionTime() {
    return this.noActionTime;
  }
  findPathToEntity(target, maxDist) {
    const level = this.level;
    if (!level?.findPath)
      return null;
    return level.findPath(this, target, maxDist);
  }
  findPathToCoords(x, y, z, dist) {
    const level = this.level;
    if (!level?.findPathTo)
      return null;
    return level.findPathTo(this, x, y, z, dist);
  }
  getNavigation() {
    return this.navigation;
  }
}

class AgableMob extends PathfinderMob {
  age = -1;
  constructor(level) {
    super(level);
    this.entityData.define(DATA_FLAGS_ID_AGEABLE, 0);
    this.setAge(0);
  }
  getAge() {
    return this.age;
  }
  setAge(age) {
    if (this.age < 0 && age >= 0) {
      this.entityData.clearFlag(DATA_FLAGS_ID_AGEABLE, DATAFLAG_ISBABY);
    } else if (this.age >= 0 && age < 0) {
      this.entityData.setFlag(DATA_FLAGS_ID_AGEABLE, DATAFLAG_ISBABY);
    }
    this.age = age;
  }
  aiStep() {
    super.aiStep();
    if (this.age < 0)
      this.setAge(this.age + 1);
    else if (this.age > 0)
      this.setAge(this.age - 1);
  }
  isBaby() {
    const level = this.level;
    if (level && !level.isClientSide) {
      return this.age < 0;
    }
    return this.entityData.getFlag(DATA_FLAGS_ID_AGEABLE, DATAFLAG_ISBABY);
  }
  addAdditonalSaveData(tag) {
    super.addAdditonalSaveData(tag);
    tag["Age"] = this.getAge();
  }
  readAdditionalSaveData(tag) {
    super.readAdditionalSaveData(tag);
    this.setAge(Number(tag["Age"] ?? 0));
  }
  getBreedOffspring(target) {
    return null;
  }
}

// src/game/world/entity/animal/animal.ts
class Animal extends AgableMob {
  inLove = 0;
  constructor(level) {
    super(level);
  }
  hurt(source, dmg) {
    this.fleeTime = 3 * TICKS_PER_SECOND;
    this.attackTargetId = 0;
    this.inLove = 0;
    return super.hurt(source, dmg);
  }
  canSpawn() {
    const level = this.level;
    if (!level)
      return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.bb.minY);
    const zt = Math.floor(this.z);
    const grassLegacyId = 2;
    const onGrass = level.getTile(xt, yt - 1, zt) === grassLegacyId;
    const brightEnough = level.getRawBrightness(xt, yt, zt) > 8;
    return onGrass && brightEnough && super.canSpawn();
  }
  getAmbientSoundInterval() {
    return 12 * TICKS_PER_SECOND;
  }
  getWalkTargetValue(x, y, z) {
    const level = this.level;
    if (!level)
      return 0;
    const grassLegacyId = 2;
    if (level.getTile(x, y - 1, z) === grassLegacyId)
      return 10;
    return level.getBrightness(x, y, z) - 0.5;
  }
  findAttackTarget() {
    return null;
  }
  removeWhenFarAway() {
    return false;
  }
  getCreatureBaseType() {
    return 2 /* BaseCreature */;
  }
}

// src/game/world/entity/animal/chicken.ts
var CHICKEN_EGG_TIME_MIN_TICKS2 = TICKS_PER_SECOND * 60 * 5;
var CHICKEN_EGG_TIME_RANGE_TICKS2 = TICKS_PER_SECOND * 60 * 5;

class Chicken extends Animal {
  sheared = false;
  flap = 0;
  flapSpeed = 0;
  oFlap = 0;
  oFlapSpeed = 0;
  flapping = 1;
  eggTime = 0;
  constructor(level) {
    super(level);
    this.entityRendererId = 6 /* Chicken */;
    this.textureName = "mob/chicken.png";
    this.setSize(0.3, 0.7);
    this.eggTime = this.random.nextInt(CHICKEN_EGG_TIME_RANGE_TICKS2) + CHICKEN_EGG_TIME_MIN_TICKS2;
  }
  getEntityTypeId() {
    return 10 /* Chicken */;
  }
  getMaxHealth() {
    return 4;
  }
  aiStep() {
    super.aiStep();
    this.oFlap = this.flap;
    this.oFlapSpeed = this.flapSpeed;
    this.flapSpeed += (this.onGround ? -1 : 4) * 0.3;
    if (this.flapSpeed < 0)
      this.flapSpeed = 0;
    if (this.flapSpeed > 1)
      this.flapSpeed = 1;
    if (!this.onGround && this.flapping < 1)
      this.flapping = 1;
    this.flapping *= 0.9;
    if (!this.onGround && this.yd < 0) {
      this.yd *= 0.6;
    }
    this.flap += this.flapping * 2;
  }
  causeFallDamage(_distance) {}
  getAmbientSound() {
    return "mob.chicken";
  }
  getHurtSound() {
    return "mob.chickenhurt";
  }
  getDeathSound() {
    return "mob.chickenhurt";
  }
  dropDeathLoot() {
    const featherCount = this.random.nextInt(3);
    for (let i = 0;i < featherCount; i++) {
      this.spawnAtLocation("minecraft:feather", 1);
    }
    this.spawnAtLocation("minecraft:chicken_raw", 1);
  }
  getBreedOffspring(_target) {
    return new Chicken(this.level);
  }
  addAdditonalSaveData(tag) {
    super.addAdditonalSaveData(tag);
  }
  readAdditionalSaveData(tag) {
    super.readAdditionalSaveData(tag);
  }
}

// src/game/world/entity/animal/cow.ts
class Cow extends Animal {
  constructor(level) {
    super(level);
    this.entityRendererId = 7 /* Cow */;
    this.textureName = "mob/cow.png";
    this.setSize(0.9, 1.3);
  }
  getEntityTypeId() {
    return 11 /* Cow */;
  }
  getMaxHealth() {
    return 10;
  }
  interact(player) {
    return super.interact(player);
  }
  getAmbientSound() {
    return "mob.cow";
  }
  getHurtSound() {
    return "mob.cowhurt";
  }
  getDeathSound() {
    return "mob.cowhurt";
  }
  getSoundVolume() {
    return 0.4;
  }
  getDeathLoot() {
    return "minecraft:leather";
  }
  dropDeathLoot() {
    const leatherCount = this.random.nextInt(3);
    for (let i = 0;i < leatherCount; i++) {
      this.spawnAtLocation("minecraft:leather", 1);
    }
    const beefCount = this.random.nextInt(3) + 1;
    for (let i = 0;i < beefCount; i++) {
      this.spawnAtLocation("minecraft:beef_raw", 1);
    }
  }
  getBreedOffspring(_target) {
    return new Cow(this.level);
  }
  addAdditonalSaveData(tag) {
    super.addAdditonalSaveData(tag);
  }
  readAdditionalSaveData(tag) {
    super.readAdditionalSaveData(tag);
  }
}

// src/game/world/entity/animal/pig.ts
class Pig extends Animal {
  constructor(level) {
    super(level);
    this.entityRendererId = 8 /* Pig */;
    this.textureName = "mob/pig.png";
    this.setSize(0.9, 0.9);
  }
  getEntityTypeId() {
    return 12 /* Pig */;
  }
  getMaxHealth() {
    return 10;
  }
  interact(_player) {
    return false;
  }
  hasSaddle() {
    return false;
  }
  setSaddle(_value) {}
  getAmbientSound() {
    return "mob.pig";
  }
  getHurtSound() {
    return "mob.pig";
  }
  getDeathSound() {
    return "mob.pigdeath";
  }
  getDeathLoot() {
    return "minecraft:porkchop_raw";
  }
  getBreedOffspring(_target) {
    return new Pig(this.level);
  }
}

// src/game/world/entity/animal/sheep.ts
var EAT_ANIMATION_TICKS2 = TICKS_PER_SECOND * 2;
var SHEEP_DATA_WOOL_ID = 16;
var SHEEP_COLORS = [
  [1, 1, 1],
  [0.95, 0.7, 0.2],
  [0.9, 0.5, 0.85],
  [0.6, 0.7, 0.95],
  [0.9, 0.9, 0.2],
  [0.5, 0.8, 0.1],
  [0.95, 0.7, 0.8],
  [0.3, 0.3, 0.3],
  [0.6, 0.6, 0.6],
  [0.3, 0.6, 0.7],
  [0.7, 0.4, 0.9],
  [0.2, 0.4, 0.8],
  [0.5, 0.4, 0.3],
  [0.4, 0.5, 0.2],
  [0.8, 0.3, 0.3],
  [0.1, 0.1, 0.1]
];
var SHEEP_NUM_COLORS = SHEEP_COLORS.length;
class Sheep extends Animal {
  eatAnimationTickValue = 0;
  constructor(level) {
    super(level);
    this.entityRendererId = 9 /* Sheep */;
    this.textureName = "mob/sheep.png";
    this.setSize(0.9, 1.3);
    this.entityData.define(SHEEP_DATA_WOOL_ID, 0);
  }
  getMaxHealth() {
    return 8;
  }
  getEntityTypeId() {
    return 13 /* Sheep */;
  }
  aiStep() {
    super.aiStep();
    if (this.eatAnimationTickValue > 0) {
      this.eatAnimationTickValue--;
    }
  }
  handleEntityEvent(id2) {
    if (id2 === 18 /* EatGrass */) {
      this.eatAnimationTickValue = EAT_ANIMATION_TICKS2;
    } else {
      super.handleEntityEvent(id2);
    }
  }
  getHeadEatPositionScale(a) {
    if (this.eatAnimationTickValue <= 0)
      return 0;
    if (this.eatAnimationTickValue >= 4 && this.eatAnimationTickValue <= EAT_ANIMATION_TICKS2 - 4) {
      return 1;
    }
    if (this.eatAnimationTickValue < 4) {
      return (this.eatAnimationTickValue - a) / 4;
    }
    return -(this.eatAnimationTickValue - EAT_ANIMATION_TICKS2 - a) / 4;
  }
  getHeadEatAngleScale(a) {
    if (this.eatAnimationTickValue > 4 && this.eatAnimationTickValue <= EAT_ANIMATION_TICKS2 - 4) {
      const scale = (this.eatAnimationTickValue - 4 - a) / (EAT_ANIMATION_TICKS2 - 8);
      return Math.PI * 0.2 + Math.PI * 0.07 * Math.sin(scale * 28.7);
    }
    if (this.eatAnimationTickValue > 0) {
      return Math.PI * 0.2;
    }
    return this.xRot / (180 / Math.PI);
  }
  interact(player) {
    return super.interact(player);
  }
  shear() {
    if (this.isSheared() || this.isBaby())
      return 0;
    const level = this.level;
    if (!level || level.isClientSide)
      return 0;
    this.setSheared(true);
    const count = 1 + this.random.nextInt(3);
    for (let i = 0;i < count; i++) {
      this.spawnAtLocation("minecraft:white_wool", 1, 1);
    }
    return count;
  }
  addAdditonalSaveData(tag) {
    super.addAdditonalSaveData(tag);
    tag["Sheared"] = this.isSheared();
    tag["Color"] = this.getColor();
  }
  readAdditionalSaveData(tag) {
    super.readAdditionalSaveData(tag);
    this.setSheared(Boolean(tag["Sheared"]));
    this.setColor(Number(tag["Color"] ?? 0));
  }
  getColor() {
    return this.entityData.getByte(SHEEP_DATA_WOOL_ID) & 15;
  }
  setColor(color) {
    const current = this.entityData.getByte(SHEEP_DATA_WOOL_ID);
    this.entityData.set(SHEEP_DATA_WOOL_ID, current & 240 | color & 15);
  }
  isSheared() {
    return (this.entityData.getByte(SHEEP_DATA_WOOL_ID) & 16) !== 0;
  }
  setSheared(value) {
    const current = this.entityData.getByte(SHEEP_DATA_WOOL_ID);
    if (value) {
      this.entityData.set(SHEEP_DATA_WOOL_ID, current | 16);
    } else {
      this.entityData.set(SHEEP_DATA_WOOL_ID, current & ~16);
    }
  }
  dropDeathLoot() {
    if (!this.isSheared()) {
      this.spawnAtLocation("minecraft:white_wool", 1, 0);
    }
  }
  getDeathLoot() {
    return "minecraft:white_wool";
  }
  jumpFromGround() {
    if (this.eatAnimationTickValue <= 0) {
      super.jumpFromGround();
    }
  }
  updateAi() {
    super.updateAi();
    const level = this.level;
    if (!level)
      return;
    if (!this.isPathFinding() && this.eatAnimationTickValue <= 0 && (this.isBaby() && this.random.nextInt(50) === 0 || this.random.nextInt(1000) === 0)) {
      const xx = Math.floor(this.x);
      const yy = Math.floor(this.y);
      const zz = Math.floor(this.z);
      const grassLegacyId = 2;
      if (level.getTile(xx, yy - 1, zz) === grassLegacyId) {
        this.eatAnimationTickValue = EAT_ANIMATION_TICKS2;
        level.broadcastEntityEvent(this, 18 /* EatGrass */);
      }
    } else if (this.eatAnimationTickValue === 4) {
      const xx = Math.floor(this.x);
      const yy = Math.floor(this.y);
      const zz = Math.floor(this.z);
      const grassLegacyId = 2;
      if (level.getTile(xx, yy - 1, zz) === grassLegacyId) {
        level.levelEvent(this, 2001, xx, yy - 1, zz, grassLegacyId);
        level.setTile(xx, yy - 1, zz, 3);
        this.setSheared(false);
        if (this.isBaby()) {
          let age = this.getAge() + TICKS_PER_SECOND * 60;
          if (age > 0)
            age = 0;
          this.setAge(age);
        }
      }
    }
  }
  shouldHoldGround() {
    return this.eatAnimationTickValue > 0;
  }
  getAmbientSound() {
    return "mob.sheep";
  }
  getHurtSound() {
    return "mob.sheep";
  }
  getDeathSound() {
    return "mob.sheep";
  }
  get eatAnimationTick() {
    return this.eatAnimationTickValue;
  }
}

// src/game/world/entity/monster/monster.ts
var MONSTER_DEFAULT_ATTACK_TIME = 20;

class Monster extends PathfinderMob {
  attackDamage = 2;
  targetId = 0;
  lastHurtByMobId = 0;
  constructor(level) {
    super(level);
    this.entityRendererId = 3 /* Humanoid */;
  }
  aiStep() {
    this.updateAttackAnim();
    const br = this.getBrightness(1);
    if (br > 0.5) {
      this.noActionTime += 2;
    }
    super.aiStep();
  }
  tick() {
    super.tick();
    const level = this.level;
    if (level && !level.isClientSide && level.difficulty === 0) {
      this.remove();
    }
  }
  hurt(sourceEntity, dmg) {
    if (!super.hurt(sourceEntity, dmg))
      return false;
    if (sourceEntity !== this) {
      this.attackTargetId = 0;
      if (sourceEntity) {
        this.attackTargetId = sourceEntity.entityId;
        if (sourceEntity.isMob()) {
          this.lastHurtByMobId = sourceEntity.entityId;
        }
      }
    }
    return true;
  }
  canSpawn() {
    return this.isDarkEnoughToSpawn() && super.canSpawn();
  }
  findAttackTarget() {
    const level = this.level;
    if (!level)
      return null;
    const player = level.getNearestPlayer(this, 16);
    if (player && this.canSee(player))
      return player;
    return null;
  }
  isDarkEnoughToSpawn() {
    const level = this.level;
    if (!level)
      return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.bb.minY);
    const zt = Math.floor(this.z);
    if (level.getLightBrightness(0, xt, yt, zt) > this.random.nextInt(32))
      return false;
    const br = level.getRawBrightness(xt, yt, zt);
    return br <= this.random.nextInt(8);
  }
  doHurtTarget(target) {
    this.swing();
    const dmg = this.getAttackDamage(target);
    return target.hurt(this, dmg);
  }
  checkHurtTarget(target, distance) {
    if (this.attackTime <= 0 && distance < 2 && target.bb.maxY > this.bb.minY && target.bb.minY < this.bb.maxY) {
      this.attackTime = this.getAttackTime();
      this.doHurtTarget(target);
    }
  }
  getWalkTargetValue(x, y, z) {
    const level = this.level;
    if (!level)
      return 0;
    return 0.5 - level.getBrightness(x, y, z);
  }
  getCreatureBaseType() {
    return 1 /* BaseEnemy */;
  }
  getTarget() {
    if (this.targetId === 0)
      return null;
    const level = this.level;
    if (!level)
      return null;
    return level.getMob(this.targetId);
  }
  setTarget(mob) {
    this.targetId = mob ? mob.entityId : 0;
  }
  getLastHurtByMob() {
    if (this.targetId === 0)
      return null;
    const level = this.level;
    if (!level)
      return null;
    return level.getMob(this.lastHurtByMobId);
  }
  setLastHurtByMob(mob) {
    this.lastHurtByMobId = mob ? mob.entityId : 0;
  }
  getAttackDamage(_target) {
    return this.attackDamage;
  }
  getAttackTime() {
    return MONSTER_DEFAULT_ATTACK_TIME;
  }
}

// src/game/world/entity/monster/zombie.ts
var ZOMBIE_RUN_SPEED = 0.5;
var ZOMBIE_ATTACK_DAMAGE = 4;
class Zombie extends Monster {
  fireCheckTick = 0;
  useNewAiValue = false;
  constructor(level) {
    super(level);
    this.entityRendererId = 11 /* Zombie */;
    this.textureName = "mob/zombie.png";
    this.runSpeed = ZOMBIE_RUN_SPEED;
    this.attackDamage = ZOMBIE_ATTACK_DAMAGE;
  }
  getMaxHealth() {
    return 12;
  }
  aiStep() {
    if (++this.fireCheckTick & 1 && this.level?.isDay() && !this.level.isClientSide) {
      const br = this.getBrightness(1);
      if (br > 0.5) {
        const level = this.level;
        if (level.canSeeSky(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z)) && this.random.nextFloat() * 3.5 < br - 0.4) {
          this.hurt(null, 1);
          for (let i = 0;i < 5; ++i) {
            const xa = (2 * this.random.nextFloat() - 1) * (2 * this.random.nextFloat() - 1) * 0.02;
            const ya = (2 * this.random.nextFloat() - 1) * (2 * this.random.nextFloat() - 1) * 0.02;
            const za = (2 * this.random.nextFloat() - 1) * (2 * this.random.nextFloat() - 1) * 0.02;
            level.addParticle("explode", this.x + this.random.nextFloat() * this.bbWidth * 2 - this.bbWidth, this.y + this.random.nextFloat() * this.bbHeight, this.z + this.random.nextFloat() * this.bbWidth * 2 - this.bbWidth, xa, ya, za);
          }
        }
      }
    }
    super.aiStep();
  }
  getEntityTypeId() {
    return 32 /* Zombie */;
  }
  setUseNewAi(use) {
    this.useNewAiValue = use;
  }
  getArmorValue() {
    const armor = super.getArmorValue() + 2;
    return Math.min(armor, 20);
  }
  getAmbientSound() {
    return "mob.zombie";
  }
  getHurtSound() {
    return "mob.zombiehurt";
  }
  getDeathSound() {
    return "mob.zombiedeath";
  }
  getDeathLoot() {
    return null;
  }
  useNewAi() {
    return this.useNewAiValue;
  }
  die(source) {
    super.die(source);
    const level = this.level;
    if (level && !level.isClientSide) {
      if (this.random.nextInt(4) === 0) {
        this.spawnAtLocation("minecraft:feather", this.random.nextInt(1) + 1);
      }
    }
  }
  getAttackDamage(_target) {
    const weapon = this.getCarriedItem();
    let damage = this.attackDamage;
    if (weapon)
      damage += 0;
    return damage;
  }
}

// src/game/world/entity/monster/creeper.ts
var CREEPER_DATA_SWELL_DIR = 16;
var CREEPER_MAX_SWELL = 30;

class Creeper extends Monster {
  swell = 0;
  oldSwell = 0;
  swellDirValue = -1;
  constructor(level) {
    super(level);
    this.entityRendererId = 14 /* Creeper */;
    this.textureName = "mob/creeper.png";
    this.entityData.define(CREEPER_DATA_SWELL_DIR, -1);
  }
  getMaxHealth() {
    return 16;
  }
  tick() {
    this.oldSwell = this.swell;
    const level = this.level;
    if (level?.isClientSide) {
      const swellDir = this.getSwellDir();
      if (swellDir > 0 && this.swell === 0) {
        level.playSound(this, "random.fuse", 1, 0.5);
      }
      this.swell += swellDir;
      if (this.swell < 0)
        this.swell = 0;
      if (this.swell >= CREEPER_MAX_SWELL)
        this.swell = CREEPER_MAX_SWELL;
    }
    super.tick();
    if (level && !level.isClientSide && this.attackTargetId === 0) {
      if (this.swell > 0) {
        this.setSwellDir(-1);
        this.swell--;
        if (this.swell < 0)
          this.swell = 0;
      }
    }
  }
  getSwelling(a) {
    return (this.oldSwell + (this.swell - this.oldSwell) * a) / (CREEPER_MAX_SWELL - 2);
  }
  getEntityTypeId() {
    return 33 /* Creeper */;
  }
  getDeathLoot() {
    return "minecraft:sulphur";
  }
  checkCantSeeTarget(_target, _d) {
    const level = this.level;
    if (!level || level.isClientSide)
      return;
    if (this.swell > 0) {
      this.setSwellDir(-1);
      this.swell--;
      if (this.swell < 0)
        this.swell = 0;
    }
  }
  getHurtSound() {
    return "mob.creeper";
  }
  getDeathSound() {
    return "mob.creeperdeath";
  }
  checkHurtTarget(target, d) {
    const level = this.level;
    if (!level || level.isClientSide)
      return;
    const swellDir = this.getSwellDir();
    if (swellDir <= 0 && d < 3 || swellDir > 0 && d < 7) {
      if (this.swell === 0) {
        level.playSound(this, "random.fuse", 1, 0.5);
      }
      this.setSwellDir(1);
      if (++this.swell >= CREEPER_MAX_SWELL) {
        level.explode(this, this.x, this.y, this.z, 2.4);
        this.remove();
      }
      this.holdGround = true;
    } else {
      this.setSwellDir(-1);
      if (--this.swell < 0)
        this.swell = 0;
    }
  }
  getSwellDir() {
    return this.entityData.getByte(CREEPER_DATA_SWELL_DIR);
  }
  setSwellDir(dir) {
    this.entityData.set(CREEPER_DATA_SWELL_DIR, dir);
    this.swellDirValue = dir;
  }
}

// src/game/world/entity/monster/skeleton.ts
var SKELETON_RANGED_COOLDOWN_TICKS2 = TICKS_PER_SECOND * 3;

class Skeleton extends Monster {
  bow = Object.freeze({
    id: "minecraft:bow",
    count: 1
  });
  fireCheckTick = 0;
  constructor(level) {
    super(level);
    this.entityRendererId = 12 /* Skeleton */;
    this.textureName = "mob/skeleton.png";
  }
  getMaxHealth() {
    return 10;
  }
  aiStep() {
    if (++this.fireCheckTick & 1 && this.level?.isDay() && !this.level.isClientSide) {
      const br = this.getBrightness(1);
      if (br > 0.5) {
        const level = this.level;
        if (level.canSeeSky(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z)) && this.random.nextFloat() * 3.5 < br - 0.4) {
          this.hurt(null, 1);
          for (let i = 0;i < 5; ++i) {
            const xa = (2 * this.random.nextFloat() - 1) * (2 * this.random.nextFloat() - 1) * 0.02;
            const ya = (2 * this.random.nextFloat() - 1) * (2 * this.random.nextFloat() - 1) * 0.02;
            const za = (2 * this.random.nextFloat() - 1) * (2 * this.random.nextFloat() - 1) * 0.02;
            level.addParticle("explode", this.x + this.random.nextFloat() * this.bbWidth * 2 - this.bbWidth, this.y + this.random.nextFloat() * this.bbHeight, this.z + this.random.nextFloat() * this.bbWidth * 2 - this.bbWidth, xa, ya, za);
          }
        }
      }
    }
    super.aiStep();
  }
  getDeathLoot() {
    return "minecraft:arrow";
  }
  getCarriedItem() {
    return this.bow;
  }
  getEntityTypeId() {
    return 34 /* Skeleton */;
  }
  getAmbientSound() {
    return "mob.skeleton";
  }
  getHurtSound() {
    return "mob.skeletonhurt";
  }
  getDeathSound() {
    return "mob.skeletonhurt";
  }
  checkHurtTarget(target, d) {
    if (d >= 10)
      return;
    const xd = target.x - this.x;
    const zd = target.z - this.z;
    if (this.attackTime === 0) {
      const level = this.level;
      if (level) {
        const yd = target.y + target.getHeadHeight() - 0.7 - this.y;
        const yo = Math.sqrt(xd * xd + zd * zd) * 0.2;
        level.playSound(this, "random.bow", 1, 1 / (this.random.nextFloat() * 0.4 + 0.8));
        level.addEntity({ kind: "arrow", owner: this, x: this.x, y: this.y + 1.4, z: this.z, xd, yd: yd + yo, zd, speed: 1.6, spread: 32 });
        this.attackTime = SKELETON_RANGED_COOLDOWN_TICKS2;
      }
    }
    this.yRot = Math.atan2(zd, xd) * (180 / Math.PI) - 90;
    this.holdGround = true;
  }
  dropDeathLoot() {
    const arrowCount = this.random.nextInt(3);
    for (let i = 0;i < arrowCount; i++) {
      this.spawnAtLocation("minecraft:arrow", 1);
    }
    const boneCount = this.random.nextInt(3);
    for (let i = 0;i < boneCount; i++) {
      this.spawnAtLocation("minecraft:bone", 1);
    }
  }
  getUseItemDuration() {
    return this.attackTime;
  }
}

// src/game/world/entity/monster/spider.ts
var SPIDER_DATA_FLAGS_ID = 16;
var SPIDER_RUN_SPEED = 0.5;

class Spider extends Monster {
  fireCheckTick = 0;
  constructor(level) {
    super(level ?? null);
    this.entityRendererId = 13 /* Spider */;
    this.textureName = "mob/spider.png";
    this.setSize(1.4, 0.9);
    this.runSpeed = SPIDER_RUN_SPEED;
    this.entityData.define(SPIDER_DATA_FLAGS_ID, 0);
  }
  aiStep() {
    super.aiStep();
  }
  tick() {
    super.tick();
    const level = this.level;
    if (level && !level.isClientSide) {
      this.setClimbing(this.horizontalCollision);
    }
  }
  getMaxHealth() {
    return 8;
  }
  onLadder() {
    return this.isClimbing();
  }
  makeStuckInWeb() {}
  getModelScale() {
    return 1;
  }
  isClimbing() {
    return this.entityData.getFlag(SPIDER_DATA_FLAGS_ID, 0);
  }
  setClimbing(value) {
    this.entityData.setFlag(SPIDER_DATA_FLAGS_ID, 0);
  }
  getEntityTypeId() {
    return 35 /* Spider */;
  }
  makeStepSound = false;
  findAttackTarget() {
    const level = this.level;
    if (!level)
      return null;
    const br = this.getBrightness(1);
    if (br < 0.5) {
      return level.findNearestPlayer(this, 16);
    }
    return null;
  }
  getAmbientSound() {
    return "mob.spider";
  }
  getHurtSound() {
    return "mob.spider";
  }
  getDeathSound() {
    return "mob.spiderdeath";
  }
  checkHurtTarget(target, d) {
    super.checkHurtTarget(target, d);
  }
  getDeathLoot() {
    return "string";
  }
}

// src/game/world/entity/mob-factory.ts
class MobFactory {
  static testMobs = new Map;
  static lastLevel = null;
  static createMob(mobType, level) {
    let mob = null;
    switch (mobType) {
      case 10 /* Chicken */:
        mob = new Chicken(level);
        break;
      case 11 /* Cow */:
        mob = new Cow(level);
        break;
      case 12 /* Pig */:
        mob = new Pig(level);
        break;
      case 13 /* Sheep */:
        mob = new Sheep(level);
        break;
      case 33 /* Creeper */:
        mob = new Creeper(level);
        break;
      case 32 /* Zombie */:
        mob = new Zombie(level);
        break;
      case 34 /* Skeleton */:
        mob = new Skeleton(level);
        break;
      case 35 /* Spider */:
        mob = new Spider(level);
        break;
      default:
        return null;
    }
    if (mob) {
      mob.health = mob.getMaxHealth();
    }
    return mob;
  }
  static clearStaticTestMobs() {
    MobFactory.getStaticTestMob(0, null);
  }
  static getStaticTestMob(mobType, level) {
    const wantClear = mobType === 0 && level === null;
    const newLevel = level !== MobFactory.lastLevel;
    MobFactory.lastLevel = level;
    if (wantClear || newLevel) {
      MobFactory.testMobs.clear();
      if (wantClear)
        return null;
    }
    const existing = MobFactory.testMobs.get(mobType);
    if (existing)
      return existing;
    const mob = MobFactory.createMob(mobType, level);
    if (mob)
      MobFactory.testMobs.set(mobType, mob);
    return mob;
  }
}

// src/game/world/level/tile/entity/tile-entity.ts
var TILE_ENTITY_FURNACE = 1;
var TILE_ENTITY_CHEST = 2;
var TILE_ENTITY_SIGN = 4;

class TileEntity {
  level = null;
  x = 0;
  y = 0;
  z = 0;
  data = 0;
  type;
  runningId = 0;
  clientSideOnly = false;
  rendererId = 0;
  tile = 0;
  removed = false;
  constructor(type) {
    this.type = type;
  }
  load(tag) {
    this.x = tag.x ?? this.x;
    this.y = tag.y ?? this.y;
    this.z = tag.z ?? this.z;
  }
  save(tag) {
    tag.x = this.x;
    tag.y = this.y;
    tag.z = this.z;
    return true;
  }
  tick() {}
  isFinished() {
    return this.removed;
  }
  setLevelAndPos(level, x, y, z) {
    this.level = level;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  distanceToSqr(x, y, z) {
    const dx = this.x - x, dy = this.y - y, dz = this.z - z;
    return dx * dx + dy * dy + dz * dz;
  }
  getTile() {
    return this.tile;
  }
  isRemoved() {
    return this.removed;
  }
  setRemoved() {
    this.removed = true;
  }
  clearRemoved() {
    this.removed = false;
  }
  triggerEvent(_b0, _b1) {}
  clearCache() {}
  isType(type) {
    return this.type === type;
  }
  setChanged() {}
}

// src/game/world/level/tile/entity/furnace-tile-entity.ts
var FURNACE_BURN_INTERVAL = 10 * 20;
var FURNACE_NUM_SLOTS = 3;
var SLOT_INGREDIENT = 0;
var SLOT_FUEL = 1;
var SLOT_RESULT = 2;

class FurnaceTileEntity extends TileEntity {
  litTime = 0;
  litDuration = 0;
  tickCount = 0;
  items = [null, null, null];
  _canBeFinished = false;
  _finished = false;
  constructor() {
    super(TILE_ENTITY_FURNACE);
  }
  getItem(slot) {
    return this.items[slot] ?? null;
  }
  setItem(slot, item) {
    this.items[slot] = item;
    this.setChanged();
  }
  removeItem(slot, count) {
    const item = this.items[slot];
    if (!item)
      return null;
    if (item.count <= count) {
      this.items[slot] = null;
      this.setChanged();
      return item;
    }
    const removed = { ...item, count };
    this.items[slot] = { ...item, count: item.count - count };
    this.setChanged();
    return removed;
  }
  getContainerSize() {
    return FURNACE_NUM_SLOTS;
  }
  getMaxStackSize() {
    return 64;
  }
  shouldSave() {
    if (this.litTime > 0)
      return true;
    for (let i = 0;i < FURNACE_NUM_SLOTS; i++) {
      if (this.items[i])
        return true;
    }
    return false;
  }
  load(tag) {
    super.load(tag);
    const items = tag.Items;
    for (let i = 0;i < FURNACE_NUM_SLOTS; i++)
      this.items[i] = null;
    if (items) {
      for (const entry of items) {
        const slot = entry.Slot;
        if (slot >= 0 && slot < FURNACE_NUM_SLOTS) {
          this.items[slot] = {
            id: entry.id,
            count: entry.count,
            maxStackSize: 64,
            auxValue: entry.auxValue
          };
        }
      }
    }
    this.litTime = tag.BurnTime ?? 0;
    this.tickCount = tag.CookTime ?? 0;
    this.litDuration = this.getBurnDuration(this.items[SLOT_FUEL]);
  }
  save(tag) {
    if (!super.save(tag))
      return false;
    tag.BurnTime = this.litTime;
    tag.CookTime = this.tickCount;
    const items = [];
    for (let i = 0;i < FURNACE_NUM_SLOTS; i++) {
      const item = this.items[i];
      if (item) {
        items.push({ Slot: i, id: item.id, count: item.count, auxValue: item.auxValue });
      }
    }
    tag.Items = items;
    return true;
  }
  getBurnProgress(max) {
    return this.tickCount * max / FURNACE_BURN_INTERVAL;
  }
  getLitProgress(max) {
    if (this.litDuration === 0)
      this.litDuration = FURNACE_BURN_INTERVAL;
    return this.litTime * max / this.litDuration;
  }
  isLit() {
    return this.litTime > 0;
  }
  isSlotEmpty(slot) {
    return this.items[slot] === null;
  }
  tick() {
    const wasLit = this.litTime > 0;
    let changed = false;
    if (this.litTime > 0)
      this.litTime--;
    if (this.litTime === 0 && this.canBurn()) {
      this.litDuration = this.litTime = this.getBurnDuration(this.items[SLOT_FUEL]);
      if (this.litTime > 0) {
        changed = true;
        const fuel = this.items[SLOT_FUEL];
        if (fuel) {
          const newCount = fuel.count - 1;
          if (newCount <= 0) {
            this.items[SLOT_FUEL] = null;
          } else {
            this.items[SLOT_FUEL] = { ...fuel, count: newCount };
          }
        }
      }
    }
    if (this.isLit() && this.canBurn()) {
      if (++this.tickCount === FURNACE_BURN_INTERVAL) {
        this.tickCount = 0;
        this.burn();
        changed = true;
      }
    } else {
      this.tickCount = 0;
    }
    if (wasLit !== this.litTime > 0) {
      changed = true;
    }
    if (changed)
      this.setChanged();
    else if (!wasLit)
      this._finished = true;
  }
  isFinished() {
    return this._canBeFinished && this._finished;
  }
  burn() {
    if (!this.canBurn())
      return;
    const ingredient = this.items[SLOT_INGREDIENT];
    if (!ingredient)
      return;
    let resultKey = null;
    if (typeof window !== "undefined" && window.VoxelCraftFurnaceRecipes) {
      const result = window.VoxelCraftFurnaceRecipes.getInstance().getResult(ingredient.id);
      if (result)
        resultKey = result.id;
    }
    if (!resultKey)
      return;
    const resultSlot = this.items[SLOT_RESULT];
    if (!resultSlot) {
      this.items[SLOT_RESULT] = { id: resultKey, count: 1, maxStackSize: 64 };
    } else if (resultSlot.id === resultKey) {
      this.items[SLOT_RESULT] = { ...resultSlot, count: resultSlot.count + 1 };
    }
    const newIngCount = ingredient.count - 1;
    if (newIngCount <= 0) {
      this.items[SLOT_INGREDIENT] = null;
    } else {
      this.items[SLOT_INGREDIENT] = { ...ingredient, count: newIngCount };
    }
    this.setChanged();
  }
  canBurn() {
    const ingredient = this.items[SLOT_INGREDIENT];
    if (!ingredient)
      return false;
    let resultKey = null;
    if (typeof window !== "undefined" && window.VoxelCraftFurnaceRecipes) {
      const result = window.VoxelCraftFurnaceRecipes.getInstance().getResult(ingredient.id);
      if (result)
        resultKey = result.id;
    }
    if (!resultKey)
      return false;
    const resultSlot = this.items[SLOT_RESULT];
    if (!resultSlot)
      return true;
    if (resultSlot.id !== resultKey)
      return false;
    if (resultSlot.count < this.getMaxStackSize())
      return true;
    return false;
  }
  getBurnDuration(item) {
    if (!item)
      return 0;
    const key = item.id;
    if (key.includes("planks") || key.includes("log") || key.includes("wood") || key.includes("oak_log") || key.includes("oak_planks"))
      return FURNACE_BURN_INTERVAL * 3 / 2;
    if (key === "stick")
      return FURNACE_BURN_INTERVAL / 2;
    if (key === "coal")
      return FURNACE_BURN_INTERVAL * 8;
    return 0;
  }
  static isFuel(item) {
    const temp = new FurnaceTileEntity;
    return temp.getBurnDuration(item) > 0;
  }
}

// src/game/world/level/tile/entity/chest-tile-entity.ts
var CHEST_SIZE = 9 * 3;

class ChestTileEntity extends TileEntity {
  items = new Array(CHEST_SIZE).fill(null);
  hasCheckedNeighbors = false;
  n = null;
  e = null;
  w = null;
  s = null;
  openness = 0;
  oOpenness = 0;
  openCount = 0;
  tickInterval = 0;
  constructor() {
    super(TILE_ENTITY_CHEST);
  }
  getContainerSize() {
    return CHEST_SIZE;
  }
  getMaxStackSize() {
    return 64;
  }
  getName() {
    return "container.chest";
  }
  getItem(slot) {
    return this.items[slot] ?? null;
  }
  setItem(slot, item) {
    this.items[slot] = item;
    this.setChanged();
  }
  shouldSave() {
    for (let i = 0;i < CHEST_SIZE; i++) {
      if (this.items[i])
        return true;
    }
    return false;
  }
  load(tag) {
    super.load(tag);
    const items = tag.Items;
    if (!items)
      return;
    for (const entry of items) {
      const slot = entry.Slot & 255;
      if (slot >= 0 && slot < CHEST_SIZE) {
        this.items[slot] = {
          id: entry.id,
          count: entry.count,
          maxStackSize: 64,
          auxValue: entry.auxValue
        };
      }
    }
  }
  save(tag) {
    if (!super.save(tag))
      return false;
    const items = [];
    for (let i = 0;i < CHEST_SIZE; i++) {
      const item = this.items[i];
      if (item) {
        items.push({ Slot: i, id: item.id, count: item.count, auxValue: item.auxValue });
      }
    }
    tag.Items = items;
    return true;
  }
  tick() {
    this.oOpenness = this.openness;
    const target = this.openCount > 0 ? 1 : 0;
    this.openness += (target - this.openness) * 0.1;
    if (++this.tickInterval >= 20) {
      this.tickInterval = 0;
      this.checkNeighbors();
    }
  }
  checkNeighbors() {
    if (this.hasCheckedNeighbors)
      return;
    this.hasCheckedNeighbors = true;
  }
  triggerEvent(b0, _b1) {
    if (b0 === 1) {
      this.openCount = _b1;
    }
  }
  startOpen() {
    ++this.openCount;
    this.setChanged();
  }
  stopOpen() {
    --this.openCount;
    this.setChanged();
  }
  setRemoved() {
    super.setRemoved();
    if (this.n) {
      this.n.hasCheckedNeighbors = false;
      this.n.s = null;
    }
    if (this.s) {
      this.s.hasCheckedNeighbors = false;
      this.s.n = null;
    }
    if (this.e) {
      this.e.hasCheckedNeighbors = false;
      this.e.w = null;
    }
    if (this.w) {
      this.w.hasCheckedNeighbors = false;
      this.w.e = null;
    }
  }
}

// src/game/world/level/tile/entity/sign-tile-entity.ts
var SIGN_MAX_LINE_LENGTH = 15;
var SIGN_NUM_LINES = 4;

class SignTileEntity extends TileEntity {
  messages = ["", "", "", ""];
  selectedLine = -1;
  editable = true;
  constructor() {
    super(TILE_ENTITY_SIGN);
  }
  save(tag) {
    if (!super.save(tag))
      return false;
    tag.Text1 = this.messages[0];
    tag.Text2 = this.messages[1];
    tag.Text3 = this.messages[2];
    tag.Text4 = this.messages[3];
    return true;
  }
  load(tag) {
    this.editable = false;
    super.load(tag);
    this.messages[0] = tag.Text1 ?? "";
    this.messages[1] = tag.Text2 ?? "";
    this.messages[2] = tag.Text3 ?? "";
    this.messages[3] = tag.Text4 ?? "";
    for (let i = 0;i < SIGN_NUM_LINES; i++) {
      if (this.messages[i].length > SIGN_MAX_LINE_LENGTH) {
        this.messages[i] = this.messages[i].substring(0, SIGN_MAX_LINE_LENGTH);
      }
    }
  }
  shouldSave() {
    return true;
  }
  isEditable() {
    return this.editable;
  }
  setEditable(editable) {
    this.editable = editable;
  }
  setLevelAndPos(level, x, y, z) {
    super.setLevelAndPos(level, x, y, z);
  }
}

// src/game/world/level/tile/entity/tile-entity-factory.ts
function createTileEntity(type) {
  switch (type) {
    case TILE_ENTITY_FURNACE:
      return new FurnaceTileEntity;
    case TILE_ENTITY_CHEST:
      return new ChestTileEntity;
    case TILE_ENTITY_SIGN:
      return new SignTileEntity;
    default:
      return null;
  }
}

// src/game/world/item/crafting/recipe.ts
var SIZE_2X2 = 0;
var SIZE_3X3 = 1;
var ANY_AUX_VALUE = -1;

class ItemPack {
  items = new Map;
  add(id2, count = 1) {
    this.items.set(id2, (this.items.get(id2) ?? 0) + count);
  }
  getCount(id2) {
    return this.items.get(id2) ?? 0;
  }
  getMaxMultipliesOf(other) {
    let max = Infinity;
    for (const [id2, count] of other.items) {
      const have = this.items.get(id2) ?? 0;
      if (count === 0)
        continue;
      max = Math.min(max, Math.floor(have / count));
      if (max === 0)
        return 0;
    }
    return max === Infinity ? 0 : max;
  }
  getItemInstances() {
    const result = [];
    for (const [id2, count] of this.items) {
      result.push({ id: id2, count, maxStackSize: 64 });
    }
    return result;
  }
}

class Recipe {
  myItems = new ItemPack;
  getItemPack() {
    return this.myItems;
  }
}

// src/game/world/item/crafting/shaped-recipe.ts
class ShapedRecipe extends Recipe {
  resultId;
  width;
  height;
  recipeItems;
  result;
  constructor(width, height, recipeItems, result) {
    super();
    this.width = width;
    this.height = height;
    this.recipeItems = recipeItems;
    this.result = result;
    this.resultId = result.id;
    for (const item of recipeItems) {
      this.myItems.add(item.id);
    }
  }
  getMaxCraftCount(fromItems) {
    return fromItems.getMaxMultipliesOf(this.myItems);
  }
  getResultItem() {
    return this.result;
  }
  matches(grid) {
    for (let xOffs = 0;xOffs <= 3 - this.width; xOffs++) {
      for (let yOffs = 0;yOffs <= 3 - this.height; yOffs++) {
        if (this.matchesAt(grid, xOffs, yOffs, true))
          return true;
        if (this.matchesAt(grid, xOffs, yOffs, false))
          return true;
      }
    }
    return false;
  }
  matchesAt(grid, xOffs, yOffs, xFlip) {
    for (let x = 0;x < 3; x++) {
      for (let y = 0;y < 3; y++) {
        const xs = x - xOffs;
        const ys = y - yOffs;
        let expected = null;
        if (xs >= 0 && ys >= 0 && xs < this.width && ys < this.height) {
          const idx = xFlip ? this.width - xs - 1 + ys * this.width : xs + ys * this.width;
          expected = this.recipeItems[idx] ?? null;
        }
        const item = grid.getItem(x, y);
        if (!item && !expected)
          continue;
        if (!item !== !expected)
          return false;
        if (expected && item && expected.id !== item.id)
          return false;
        if (expected && item && expected.auxValue !== ANY_AUX_VALUE && expected.auxValue !== undefined) {
          if (expected.auxValue !== item.auxValue)
            return false;
        }
      }
    }
    return true;
  }
  assemble(_grid) {
    return this.result;
  }
  size() {
    return this.width * this.height;
  }
  getCraftingSize() {
    return this.width <= 2 && this.height <= 2 ? SIZE_2X2 : SIZE_3X3;
  }
}

// src/game/world/item/crafting/shapeless-recipe.ts
class ShapelessRecipe extends Recipe {
  result;
  ingredients;
  constructor(result, ingredients) {
    super();
    this.result = result;
    this.ingredients = ingredients;
    for (const item of ingredients) {
      this.myItems.add(item.id);
    }
  }
  getResultItem() {
    return this.result;
  }
  getMaxCraftCount(fromItems) {
    return fromItems.getMaxMultipliesOf(this.myItems);
  }
  matches(grid) {
    const tempList = [...this.ingredients];
    for (let y = 0;y < 3; y++) {
      for (let x = 0;x < 3; x++) {
        const item = grid.getItem(x, y);
        if (!item)
          continue;
        let found = false;
        for (let i = 0;i < tempList.length; i++) {
          const ingredient = tempList[i];
          if (!ingredient)
            continue;
          if (item.id === ingredient.id) {
            if (ingredient.auxValue === ANY_AUX_VALUE || ingredient.auxValue === undefined || ingredient.auxValue === item.auxValue) {
              found = true;
              tempList.splice(i, 1);
              break;
            }
          }
        }
        if (!found)
          return false;
      }
    }
    return tempList.length === 0;
  }
  assemble(_grid) {
    return this.result;
  }
  size() {
    return this.ingredients.length;
  }
  getCraftingSize() {
    return this.ingredients.length > 4 ? SIZE_3X3 : SIZE_2X2;
  }
}

// src/game/world/item/crafting/recipes.ts
function shape2(r0, r1) {
  return [r0, r1];
}
function shape3(r0, r1, r2) {
  return [r0, r1, r2];
}
var SHORT_KEY_TO_ID = {
  air: 0,
  stone: 1,
  grass: 2,
  dirt: 3,
  stoneBrick: 4,
  wood: 5,
  sapling: 6,
  bedrock: 7,
  water: 8,
  sand: 12,
  gravel: 13,
  goldOre: 14,
  ironOre: 15,
  coalOre: 16,
  treeTrunk: 17,
  leaves: 18,
  glass: 20,
  lapisOre: 21,
  lapisBlock: 22,
  sandStone: 24,
  web: 30,
  tallgrass: 31,
  cloth: 35,
  flower: 37,
  rose: 38,
  mushroom1: 39,
  mushroom2: 40,
  goldBlock: 41,
  ironBlock: 42,
  stoneSlab: 44,
  redBrick: 45,
  tnt: 46,
  bookshelf: 47,
  mossStone: 48,
  obsidian: 49,
  torch: 50,
  chest: 54,
  emeraldOre: 56,
  emeraldBlock: 57,
  workBench: 58,
  crops: 59,
  farmland: 60,
  furnace: 62,
  ladder: 65,
  redStoneOre: 73,
  topSnow: 78,
  ice: 79,
  snow: 80,
  cactus: 81,
  clay: 82,
  reeds: 83,
  fence: 85,
  lightGem: 89,
  trapdoor: 96,
  stoneBrickSmooth: 98,
  melon: 103,
  fenceGate: 107,
  stick: 280,
  bowl: 281,
  mushroomStew: 282,
  string: 287,
  feather: 288,
  sulphur: 289,
  flint: 318,
  leather: 334,
  brick: 336,
  clay_item: 337,
  paper: 339,
  book: 340,
  yellowDust: 348,
  dye_powder: 351,
  bone: 352,
  sugar: 353,
  shears: 359,
  coal: 263,
  emerald: 264,
  ironIngot: 265,
  goldIngot: 266,
  apple: 260,
  bow: 261,
  arrow: 262,
  bread: 297,
  seeds_wheat: 295,
  wheat: 296,
  door_wood: 64,
  sign: 63,
  snowBall: 332,
  bed: 355
};
function resolveItemId(key) {
  if (typeof key === "number")
    return key;
  if (SHORT_KEY_TO_ID[key] !== undefined)
    return SHORT_KEY_TO_ID[key];
  const parsed = parseInt(key, 10);
  return isNaN(parsed) ? 0 : parsed;
}
function def(c, id2, auxValue) {
  return [{ c, id: resolveItemId(id2), auxValue }];
}
function def2(c0, k0, c1, k1) {
  return [{ c: c0, id: resolveItemId(k0) }, { c: c1, id: resolveItemId(k1) }];
}
function def3(c0, k0, c1, k1, c2, k2) {
  return [{ c: c0, id: resolveItemId(k0) }, { c: c1, id: resolveItemId(k1) }, { c: c2, id: resolveItemId(k2) }];
}
function itemStack(id2, count = 1, auxValue) {
  return { id: resolveItemId(id2), count, maxStackSize: 64, auxValue };
}

class Recipes {
  static instance = null;
  recipes = [];
  constructor() {
    this.registerAll();
  }
  static getInstance() {
    if (!Recipes.instance) {
      Recipes.instance = new Recipes;
    }
    return Recipes.instance;
  }
  static teardown() {
    Recipes.instance = null;
  }
  getRecipes() {
    return this.recipes;
  }
  getRecipeFor(result) {
    for (const r of this.recipes) {
      const ri = r.getResultItem();
      if (ri.id === result.id)
        return r;
    }
    return null;
  }
  addShapedRecipe(result, row, types) {
    this.addShapedRecipeRows(result, [row], types);
  }
  addShapedRecipe2(result, r0, r1, types) {
    this.addShapedRecipeRows(result, [r0, r1], types);
  }
  addShapedRecipe3(result, r0, r1, r2, types) {
    this.addShapedRecipeRows(result, [r0, r1, r2], types);
  }
  addShapedRecipeRows(result, rows, types) {
    const height = rows.length;
    const width = rows[0]?.length ?? 0;
    const typeMap = new Map;
    for (const t of types)
      typeMap.set(t.c, t);
    const recipeItems = [];
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        const c = rows[y][x];
        const type = typeMap.get(c);
        if (type) {
          recipeItems.push(itemStack(type.id, 1, type.auxValue));
        } else {
          recipeItems.push(itemStack("air", 0));
        }
      }
    }
    this.recipes.push(new ShapedRecipe(width, height, recipeItems, result));
  }
  addShapelessRecipe(result, types) {
    const ingredients = types.map((t) => itemStack(t.id, 1, t.auxValue));
    this.recipes.push(new ShapelessRecipe(result, ingredients));
  }
  registerAll() {
    this.registerToolRecipes();
    this.registerWeaponRecipes();
    this.registerOreRecipes();
    this.registerFoodRecipes();
    this.registerArmorRecipes();
    this.registerClothDyeRecipes();
    this.addShapedRecipe(itemStack("paper", 3), "###", def("#", "reeds"));
    this.addShapedRecipe3(itemStack("book", 1), "#", "#", "#", def("#", "paper"));
    this.addShapedRecipe2(itemStack("fence", 2), "###", "###", def("#", "stick"));
    this.addShapedRecipe2(itemStack("fenceGate", 1), "#W#", "#W#", def2("#", "stick", "W", "wood"));
    this.addShapedRecipe3(itemStack("bookshelf", 1), "###", "XXX", "###", def2("#", "wood", "X", "book"));
    this.addShapedRecipe2(itemStack("snow", 1), "##", "##", def("#", "snowBall"));
    this.addShapedRecipe2(itemStack("clay", 1), "##", "##", def("#", "clay"));
    this.addShapedRecipe2(itemStack("redBrick", 1), "##", "##", def("#", "brick"));
    this.addShapedRecipe2(itemStack("lightGem", 1), "##", "##", def("#", "yellowDust"));
    this.addShapedRecipe2(itemStack("cloth", 1), "##", "##", def("#", "string"));
    this.addShapedRecipe3(itemStack("tnt", 1), "X#X", "#X#", "X#X", def2("X", "sulphur", "#", "sand"));
    this.addShapedRecipe3(itemStack("ladder", 2), "# #", "###", "# #", def("#", "stick"));
    this.addShapedRecipe3(itemStack("door_wood", 1), "##", "##", "##", def("#", "wood"));
    this.addShapedRecipe2(itemStack("trapdoor", 2), "###", "###", def("#", "wood"));
    this.addShapedRecipe3(itemStack("sign", 1), "###", "###", " X ", def2("#", "wood", "X", "stick"));
    this.addShapedRecipe(itemStack("sugar", 1), "#", def("#", "reeds"));
    this.addShapedRecipe(itemStack("wood", 4), "#", def("#", "treeTrunk"));
    this.addShapedRecipe2(itemStack("stick", 4), "#", "#", def("#", "wood"));
  }
  registerToolRecipes() {
    const pickShape = shape3("XXX", " # ", " # ");
    const shovelShape = shape3("X", "#", "#");
    const hatchetShape = shape3("XX", "X#", " #");
    const hoeShape = shape3("XX", " #", " #");
    const shapes = [pickShape, shovelShape, hatchetShape, hoeShape];
    const materials = ["wood", "stoneBrick", "ironIngot", "emerald", "goldIngot"];
    const toolNames = ["pickAxe", "shovel", "hatchet", "hoe"];
    for (let t = 0;t < toolNames.length; t++) {
      for (let m = 0;m < materials.length; m++) {
        const result = itemStack(`${toolNames[t]}_${["wood", "stone", "iron", "emerald", "gold"][m]}`);
        this.addShapedRecipeRows(result, shapes[t], def2("#", "stick", "X", materials[m]));
      }
    }
    this.addShapedRecipe2(itemStack("shears", 1), " #", "# ", def("#", "ironIngot"));
  }
  registerWeaponRecipes() {
    const swordShape = shape3("X", "X", "#");
    const materials = ["wood", "stoneBrick", "ironIngot", "emerald", "goldIngot"];
    const prefixes = ["wood", "stone", "iron", "emerald", "gold"];
    for (let m = 0;m < materials.length; m++) {
      this.addShapedRecipeRows(itemStack(`sword_${prefixes[m]}`), swordShape, def2("#", "stick", "X", materials[m]));
    }
    this.addShapedRecipe3(itemStack("bow", 1), " #X", "# X", " #X", def2("X", "string", "#", "stick"));
    this.addShapedRecipe3(itemStack("arrow", 4), "X", "#", "Y", def3("Y", "feather", "X", "flint", "#", "stick"));
  }
  registerArmorRecipes() {
    const helmetShape = shape2("XXX", "X X");
    const chestShape = shape3("X X", "XXX", "XXX");
    const leggingsShape = shape3("XXX", "X X", "X X");
    const bootsShape = shape2("X X", "X X");
    const shapes = [helmetShape, chestShape, leggingsShape, bootsShape];
    const materials = ["leather", "ironIngot", "emerald", "goldIngot"];
    const prefixes = ["cloth", "iron", "diamond", "gold"];
    const armorTypes = ["helmet", "chestplate", "leggings", "boots"];
    for (let t = 0;t < armorTypes.length; t++) {
      for (let m = 0;m < materials.length; m++) {
        this.addShapedRecipeRows(itemStack(`${armorTypes[t]}_${prefixes[m]}`), shapes[t], def("X", materials[m]));
      }
    }
  }
  registerFoodRecipes() {
    this.addShapelessRecipe(itemStack("mushroomStew"), def3("0", "mushroom1", "0", "mushroom2", "0", "bowl"));
    this.addShapedRecipe3(itemStack("melon", 1), "MMM", "MMM", "MMM", def("M", "melon"));
    this.addShapedRecipe(itemStack("seeds_melon"), "M", def("M", "melon"));
  }
  registerOreRecipes() {
    const pairs = [
      ["goldBlock", itemStack("goldIngot", 9)],
      ["ironBlock", itemStack("ironIngot", 9)],
      ["emeraldBlock", itemStack("emerald", 9)],
      ["lapisBlock", itemStack("dye_powder", 9, 4)]
    ];
    for (const [block2, ingot] of pairs) {
      this.addShapedRecipe3(itemStack(block2, 1), "###", "###", "###", def("#", ingot.id));
      this.addShapedRecipe(itemStack(ingot.id, ingot.count), "#", def("#", block2));
    }
  }
  registerClothDyeRecipes() {
    this.addShapelessRecipe(itemStack("dye_powder", 2, 11), def("0", "flower"));
    this.addShapelessRecipe(itemStack("dye_powder", 3, 15), def("0", "bone"));
    this.addShapelessRecipe(itemStack("dye_powder", 2, 9), def2("0", "dye_powder", "0", "dye_powder"));
    this.addShapelessRecipe(itemStack("dye_powder", 2, 14), def2("0", "dye_powder", "0", "dye_powder"));
    this.addShapelessRecipe(itemStack("dye_powder", 2, 10), def2("0", "dye_powder", "0", "dye_powder"));
    this.addShapelessRecipe(itemStack("dye_powder", 2, 12), def2("0", "dye_powder", "0", "dye_powder"));
    this.addShapelessRecipe(itemStack("dye_powder", 2, 6), def2("0", "dye_powder", "0", "dye_powder"));
    this.addShapelessRecipe(itemStack("dye_powder", 2, 5), def2("0", "dye_powder", "0", "dye_powder"));
    this.addShapelessRecipe(itemStack("dye_powder", 4, 13), def2("0", "dye_powder", "0", "dye_powder"));
  }
}

// src/game/world/item/crafting/furnace-recipes.ts
class FurnaceRecipes {
  static instance = null;
  recipes = new Map;
  constructor() {
    this.registerRecipes();
  }
  static getInstance() {
    if (!FurnaceRecipes.instance) {
      FurnaceRecipes.instance = new FurnaceRecipes;
    }
    return FurnaceRecipes.instance;
  }
  static teardown() {
    FurnaceRecipes.instance = null;
  }
  isFurnaceItem(itemId) {
    return this.recipes.has(itemId);
  }
  getResult(itemId) {
    return this.recipes.get(itemId) ?? null;
  }
  getRecipes() {
    return this.recipes;
  }
  addRecipe(itemId, result) {
    this.recipes.set(itemId, result);
  }
  registerRecipes() {
    this.addRecipe("ironOre", { id: "ironIngot", count: 1, maxStackSize: 64 });
    this.addRecipe("goldOre", { id: "goldIngot", count: 1, maxStackSize: 64 });
    this.addRecipe("emeraldOre", { id: "emerald", count: 1, maxStackSize: 64 });
    this.addRecipe("sand", { id: "glass", count: 1, maxStackSize: 64 });
    this.addRecipe("porkChop_raw", { id: "porkChop_cooked", count: 1, maxStackSize: 64 });
    this.addRecipe("beef_raw", { id: "beef_cooked", count: 1, maxStackSize: 64 });
    this.addRecipe("chicken_raw", { id: "chicken_cooked", count: 1, maxStackSize: 64 });
    this.addRecipe("stoneBrick", { id: "rock", count: 1, maxStackSize: 64 });
    this.addRecipe("clay", { id: "brick", count: 1, maxStackSize: 64 });
    this.addRecipe("cactus", { id: "dye_powder", count: 1, maxStackSize: 64, auxValue: 2 });
    this.addRecipe("mushroom2", { id: "dye_powder", count: 1, maxStackSize: 64, auxValue: 1 });
    this.addRecipe("treeTrunk", { id: "coal", count: 1, maxStackSize: 64, auxValue: 1 });
    this.addRecipe("netherrack", { id: "netherbrick", count: 1, maxStackSize: 64 });
  }
}

// src/game/world/level/tile/translated/Tile.ts
var TILE_DESCRIPTION_PREFIX = "tile.";

class SoundType {
  volume;
  pitch;
  breakSound;
  stepSound;
  constructor(name, volume, pitch) {
    this.volume = volume;
    this.pitch = pitch;
    this.breakSound = "step." + name;
    this.stepSound = "step." + name;
  }
  getVolume() {
    return this.volume;
  }
  getPitch() {
    return this.pitch;
  }
  getBreakSound() {
    return this.breakSound;
  }
  getStepSound() {
    return this.stepSound;
  }
}
var SOUND_NORMAL = new SoundType("stone", 1, 1);
var SOUND_WOOD = new SoundType("wood", 1, 1);
var SOUND_GRAVEL = new SoundType("gravel", 1, 1);
var SOUND_GRASS = new SoundType("grass", 0.5, 1);
var SOUND_STONE = new SoundType("stone", 1, 1);
var SOUND_METAL = new SoundType("stone", 1, 1.5);
var SOUND_GLASS = new SoundType("stone", "random.glass", 1, 1);
var SOUND_CLOTH = new SoundType("cloth", 1, 1);
var SOUND_SAND = new SoundType("sand", "step.gravel", 1, 1);
var SOUND_SILENT = new SoundType("", 0, 0);
var SHAPE_BLOCK = 0;
var NUM_BLOCK_TYPES = 256;
var tiles = new Array(NUM_BLOCK_TYPES).fill(null);
var sendTileData = new Array(NUM_BLOCK_TYPES).fill(false);
var shouldTick = new Array(NUM_BLOCK_TYPES).fill(false);
var solid = new Array(NUM_BLOCK_TYPES).fill(false);
var isEntityTile = new Array(NUM_BLOCK_TYPES).fill(false);
var lightBlock = new Array(NUM_BLOCK_TYPES).fill(0);
var translucent = new Array(NUM_BLOCK_TYPES).fill(false);
translucent[0] = true;
var lightEmission = new Array(NUM_BLOCK_TYPES).fill(0);
var RENDERLAYER_OPAQUE = 0;
var SANDSTONE_TEXTURES = [0 + 16 * 12, 5 + 16 * 14, 6 + 16 * 14];
var STONE_BRICK_TEXTURES = [6 + 16 * 3, 4 + 16 * 6, 5 + 16 * 6];
class Tile {
  tex;
  id;
  xx0;
  yy0;
  zz0;
  xx1;
  yy1;
  zz1;
  soundType;
  gravity;
  material;
  friction;
  destroySpeed;
  explosionResistance;
  category;
  descriptionId;
  constructor(id2, texOrMaterial, material) {
    if (typeof texOrMaterial === "string") {
      this.id = id2;
      this.material = texOrMaterial;
      this.tex = 1;
      this.category = -1;
      this.gravity = 1;
      this.friction = 0.6;
      this.soundType = SOUND_NORMAL;
      this.xx0 = 0;
      this.yy0 = 0;
      this.zz0 = 0;
      this.xx1 = 1;
      this.yy1 = 1;
      this.zz1 = 1;
      this.destroySpeed = 0;
      this.explosionResistance = 0;
      this.descriptionId = "";
    } else {
      this.id = id2;
      this.tex = texOrMaterial;
      this.material = material;
      this.category = -1;
      this.gravity = 1;
      this.friction = 0.6;
      this.soundType = SOUND_NORMAL;
      this.xx0 = 0;
      this.yy0 = 0;
      this.zz0 = 0;
      this.xx1 = 1;
      this.yy1 = 1;
      this.zz1 = 1;
      this.destroySpeed = 0;
      this.explosionResistance = 0;
      this.descriptionId = "";
    }
    if (tiles[id2]) {
      console.warn(`Slot ${id2} is already occupied by ${tiles[id2]} when adding ${this}`);
    }
  }
  init() {
    tiles[this.id] = this;
    this.setShape(this.xx0, this.yy0, this.zz0, this.xx1, this.yy1, this.zz1);
    solid[this.id] = this.isSolidRender();
    lightBlock[this.id] = this.isSolidRender() ? 255 : 0;
    translucent[this.id] = !this.materialBlocksLight();
    return this;
  }
  isCubeShaped() {
    return true;
  }
  getRenderShape() {
    return SHAPE_BLOCK;
  }
  getTexture(face) {
    return this.tex;
  }
  getTextureWithData(face, data) {
    return this.getTexture(face);
  }
  shouldRenderFace(level, x, y, z, face) {
    if (face === 0 && y === -1)
      return false;
    if (face === 2 && z === -1)
      return false;
    if (face === 3 && z === 256)
      return false;
    if (face === 4 && x === -1)
      return false;
    if (face === 5 && x === 256)
      return false;
    if (face === 0 && this.yy0 > 0)
      return true;
    if (face === 1 && this.yy1 < 1)
      return true;
    if (face === 2 && this.zz0 > 0)
      return true;
    if (face === 3 && this.zz1 < 1)
      return true;
    if (face === 4 && this.xx0 > 0)
      return true;
    if (face === 5 && this.xx1 < 1)
      return true;
    const t = tiles[level.getTile(x, y, z)];
    if (!t)
      return true;
    if (face === 1 && t.id === topSnow?.id)
      return false;
    return !t.isSolidRender();
  }
  isSolidRender() {
    return true;
  }
  mayPick() {
    return true;
  }
  mayPickWithData(data, liquid) {
    return this.mayPick();
  }
  getTickDelay() {
    return 10;
  }
  getResourceCount(random) {
    return 1;
  }
  getResource(data, random) {
    return this.id;
  }
  getExplosionResistance(source) {
    return this.explosionResistance / 5;
  }
  getRenderLayer() {
    return RENDERLAYER_OPAQUE;
  }
  use(level, x, y, z, player) {
    return false;
  }
  getColor(level, x, y, z) {
    return 16777215;
  }
  getSignal(level, x, y, z) {
    return false;
  }
  getSignalWithDir(level, x, y, z, dir) {
    return false;
  }
  isSignalSource() {
    return false;
  }
  getDirectSignal(level, x, y, z, dir) {
    return false;
  }
  playerDestroy(level, player, x, y, z, data) {
    this.spawnResources(level, x, y, z, data);
  }
  canSurvive(level, x, y, z) {
    return true;
  }
  setDescriptionId(id2) {
    this.descriptionId = TILE_DESCRIPTION_PREFIX + id2;
    return this;
  }
  getName() {
    return this.descriptionId + ".name";
  }
  getDescriptionId() {
    return this.descriptionId;
  }
  setSoundType(soundType) {
    this.soundType = soundType;
    return this;
  }
  setLightBlock(i) {
    lightBlock[this.id] = i;
    return this;
  }
  setExplodeable(explosionResistance) {
    this.explosionResistance = explosionResistance * 3;
    return this;
  }
  setDestroyTime(destroySpeed) {
    this.destroySpeed = destroySpeed;
    if (this.explosionResistance < destroySpeed * 5)
      this.explosionResistance = destroySpeed * 5;
    return this;
  }
  setTicking(tick) {
    shouldTick[this.id] = tick;
  }
  getSpawnResourcesAuxValue(data) {
    return 0;
  }
  setLightEmission(f) {
    lightEmission[this.id] = Math.floor(15 * f);
    return this;
  }
  setCategory(category) {
    this.category = category;
    return this;
  }
  setShape(x0, y0, z0, x1, y1, z1) {
    this.xx0 = x0;
    this.yy0 = y0;
    this.zz0 = z0;
    this.xx1 = x1;
    this.yy1 = y1;
    this.zz1 = z1;
  }
  mayPlace(level, x, y, z) {
    const t = level.getTile(x, y, z);
    return t === 0 || tiles[t]?.material === "replaceable";
  }
  getDestroyProgress(player) {
    if (this.destroySpeed < 0)
      return 0;
    if (!player.canDestroy(this))
      return 1 / this.destroySpeed / 100;
    return player.getDestroySpeed(this) / this.destroySpeed / 30;
  }
  spawnResources(level, x, y, z, data, odds) {
    if (odds === undefined)
      odds = 1;
    if (level.isClientSide)
      return;
    const count = this.getResourceCount(level.random);
    for (let i = 0;i < count; i++) {
      if (level.random.nextFloat() > odds)
        continue;
      const type = this.getResource(data, level.random);
      if (type <= 0)
        continue;
      const s = 0.7;
      const xo = level.random.nextFloat() * s + (1 - s) * 0.5;
      const yo = level.random.nextFloat() * s + (1 - s) * 0.5;
      const zo = level.random.nextFloat() * s + (1 - s) * 0.5;
      if (level.spawnItemEntity) {
        level.spawnItemEntity(x + xo, y + yo, z + zo, type, 1, this.getSpawnResourcesAuxValue(data));
      }
    }
  }
  popResource(level, x, y, z, itemInstance) {
    if (level.isClientSide)
      return;
    const s = 0.7;
    const xo = level.random.nextFloat() * s + (1 - s) * 0.5;
    const yo = level.random.nextFloat() * s + (1 - s) * 0.5;
    const zo = level.random.nextFloat() * s + (1 - s) * 0.5;
    if (level.spawnItemEntity) {
      level.spawnItemEntity(x + xo, y + yo, z + zo, itemInstance.id, itemInstance.count, itemInstance.auxValue || 0);
    }
  }
  destroy(level, x, y, z, data) {}
  getBrightness(level, x, y, z) {
    return level.getBrightness(x, y, z);
  }
  materialBlocksLight() {
    return this.material !== "water" && this.material !== "lava" && this.material !== "glass";
  }
}
var rock = null;
var grass = null;
var dirt = null;
var stoneBrick = null;
var wood = null;
var sapling = null;
var unbreakable = null;
var water = null;
var calmWater = null;
var lava = null;
var calmLava = null;
var sand = null;
var gravel = null;
var goldOre = null;
var ironOre = null;
var coalOre = null;
var treeTrunk = null;
var leaves = null;
var glass = null;
var lapisOre = null;
var lapisBlock = null;
var sandStone = null;
var bed = null;
var web = null;
var tallgrass = null;
var cloth = null;
var flower = null;
var rose = null;
var mushroom1 = null;
var mushroom2 = null;
var goldBlock = null;
var ironBlock = null;
var stoneSlab = null;
var stoneSlabHalf = null;
var redBrick = null;
var tnt = null;
var bookshelf = null;
var mossStone = null;
var obsidian = null;
var torch = null;
var stairs_wood = null;
var chest = null;
var emeraldOre = null;
var emeraldBlock = null;
var workBench = null;
var stonecutterBench = null;
var crops = null;
var farmland = null;
var furnace = null;
var furnace_lit = null;
var sign = null;
var door_wood = null;
var ladder = null;
var stairs_stone = null;
var wallSign = null;
var door_iron = null;
var redStoneOre = null;
var redStoneOre_lit = null;
var topSnow = null;
var ice = null;
var snow = null;
var cactus = null;
var clay = null;
var reeds = null;
var fence = null;
var netherrack = null;
var lightGem = null;
var invisible_bedrock = null;
var trapdoor = null;
var stoneBrickSmooth = null;
var thinGlass = null;
var melon = null;
var melonStem = null;
var fenceGate = null;
var stairs_brick = null;
var stairs_stoneBrickSmooth = null;
var netherBrick = null;
var stairs_netherBricks = null;
var stairs_sandStone = null;
var quartzBlock = null;
var stairs_quartz = null;
var info_updateGame1 = null;
var info_updateGame2 = null;
var info_reserved6 = null;
var grass_carried = null;
var leaves_carried = null;
var netherReactor = null;
var glowingObsidian = null;
function initTiles() {
  rock = new Tile(1, 1, "stone");
  rock.init();
  rock.setDestroyTime(1.5);
  rock.setExplodeable(10);
  rock.setSoundType(SOUND_STONE);
  rock.setCategory(0);
  rock.setDescriptionId("stone");
  grass = new Tile(2, "dirt");
  grass.init();
  grass.setDestroyTime(0.6);
  grass.setSoundType(SOUND_GRASS);
  grass.setCategory(0);
  grass.setDescriptionId("grass");
  dirt = new Tile(3, 2, "dirt");
  dirt.init();
  dirt.setDestroyTime(0.5);
  dirt.setSoundType(SOUND_GRAVEL);
  dirt.setCategory(0);
  dirt.setDescriptionId("dirt");
  stoneBrick = new Tile(4, 16, "stone");
  stoneBrick.init();
  stoneBrick.setDestroyTime(2);
  stoneBrick.setExplodeable(10);
  stoneBrick.setSoundType(SOUND_STONE);
  stoneBrick.setCategory(0);
  stoneBrick.setDescriptionId("stonebrick");
  wood = new Tile(5, 4, "wood");
  wood.init();
  wood.setDestroyTime(2);
  wood.setExplodeable(5);
  wood.setSoundType(SOUND_WOOD);
  wood.setCategory(0);
  wood.setDescriptionId("wood");
  sapling = new Tile(6, 15, "plant");
  sapling.init();
  sapling.setDestroyTime(0);
  sapling.setSoundType(SOUND_GRASS);
  sapling.setCategory(0);
  sapling.setDescriptionId("sapling");
  unbreakable = new Tile(7, 17, "stone");
  unbreakable.init();
  unbreakable.setDestroyTime(-1);
  unbreakable.setExplodeable(6000000);
  unbreakable.setSoundType(SOUND_STONE);
  unbreakable.setCategory(0);
  unbreakable.setDescriptionId("bedrock");
  water = new Tile(8, "water");
  water.init();
  water.setDestroyTime(100);
  water.setLightBlock(3);
  water.setCategory(0);
  water.setDescriptionId("water");
  calmWater = new Tile(9, "water");
  calmWater.init();
  calmWater.setDestroyTime(100);
  calmWater.setLightBlock(3);
  calmWater.setCategory(0);
  calmWater.setDescriptionId("water");
  lava = new Tile(10, "lava");
  lava.init();
  lava.setDestroyTime(0);
  lava.setLightEmission(1);
  lava.setLightBlock(255);
  lava.setCategory(0);
  lava.setDescriptionId("lava");
  calmLava = new Tile(11, "lava");
  calmLava.init();
  calmLava.setDestroyTime(100);
  calmLava.setLightEmission(1);
  calmLava.setLightBlock(255);
  calmLava.setCategory(0);
  calmLava.setDescriptionId("lava");
  sand = new Tile(12, 18, "sand");
  sand.init();
  sand.setDestroyTime(0.5);
  sand.setSoundType(SOUND_SAND);
  sand.setCategory(0);
  sand.setDescriptionId("sand");
  gravel = new Tile(13, 19, "sand");
  gravel.init();
  gravel.setDestroyTime(0.6);
  gravel.setSoundType(SOUND_GRAVEL);
  gravel.setCategory(0);
  gravel.setDescriptionId("gravel");
  goldOre = new Tile(14, 32, "stone");
  goldOre.init();
  goldOre.setDestroyTime(3);
  goldOre.setExplodeable(5);
  goldOre.setSoundType(SOUND_STONE);
  goldOre.setCategory(1);
  goldOre.setDescriptionId("oreGold");
  ironOre = new Tile(15, 33, "stone");
  ironOre.init();
  ironOre.setDestroyTime(3);
  ironOre.setExplodeable(5);
  ironOre.setSoundType(SOUND_STONE);
  ironOre.setCategory(1);
  ironOre.setDescriptionId("oreIron");
  coalOre = new Tile(16, 34, "stone");
  coalOre.init();
  coalOre.setDestroyTime(3);
  coalOre.setExplodeable(5);
  coalOre.setSoundType(SOUND_STONE);
  coalOre.setCategory(0);
  coalOre.setDescriptionId("oreCoal");
  treeTrunk = new Tile(17, 20, "wood");
  treeTrunk.init();
  treeTrunk.setDestroyTime(2);
  treeTrunk.setSoundType(SOUND_WOOD);
  treeTrunk.setCategory(0);
  treeTrunk.setDescriptionId("log");
  leaves = new Tile(18, 4 + 3 * 16, "leaves");
  leaves.init();
  leaves.setDestroyTime(0.2);
  leaves.setLightBlock(1);
  leaves.setSoundType(SOUND_GRASS);
  leaves.setCategory(0);
  leaves.setDescriptionId("leaves");
  glass = new Tile(20, 49, "glass");
  glass.init();
  glass.setDestroyTime(0.3);
  glass.setSoundType(SOUND_GLASS);
  glass.setCategory(0);
  glass.setDescriptionId("glass");
  lapisOre = new Tile(21, 10 * 16, "stone");
  lapisOre.init();
  lapisOre.setDestroyTime(3);
  lapisOre.setExplodeable(5);
  lapisOre.setSoundType(SOUND_STONE);
  lapisOre.setCategory(0);
  lapisOre.setDescriptionId("oreLapis");
  lapisBlock = new Tile(22, 9 * 16, "stone");
  lapisBlock.init();
  lapisBlock.setDestroyTime(3);
  lapisBlock.setExplodeable(5);
  lapisBlock.setSoundType(SOUND_STONE);
  lapisBlock.setCategory(1);
  lapisBlock.setDescriptionId("blockLapis");
  sandStone = new Tile(24, 0 + 16 * 12, "stone");
  sandStone.init();
  sandStone.setSoundType(SOUND_STONE);
  sandStone.setDestroyTime(0.8);
  sandStone.setCategory(0);
  sandStone.setDescriptionId("sandStone");
  bed = new Tile(26, 0, "wood");
  bed.init();
  bed.setDestroyTime(0.2);
  bed.setCategory(0);
  bed.setDescriptionId("bed");
  web = new Tile(30, 11, "web");
  web.init();
  web.setLightBlock(1);
  web.setDestroyTime(4);
  web.setCategory(1);
  web.setDescriptionId("web");
  tallgrass = new Tile(31, 2 * 16 + 7, "replaceable_plant");
  tallgrass.init();
  tallgrass.setDestroyTime(0);
  tallgrass.setSoundType(SOUND_GRASS);
  tallgrass.setCategory(1);
  tallgrass.setDescriptionId("tallgrass");
  cloth = new Tile(35, 64, "cloth");
  cloth.init();
  cloth.setDestroyTime(0.8);
  cloth.setSoundType(SOUND_CLOTH);
  cloth.setCategory(0);
  cloth.setDescriptionId("cloth");
  flower = new Tile(37, 13, "plant");
  flower.init();
  flower.setDestroyTime(0);
  flower.setSoundType(SOUND_GRASS);
  flower.setCategory(1);
  flower.setDescriptionId("flower");
  rose = new Tile(38, 12, "plant");
  rose.init();
  rose.setDestroyTime(0);
  rose.setSoundType(SOUND_GRASS);
  rose.setCategory(1);
  rose.setDescriptionId("rose");
  mushroom1 = new Tile(39, 13 + 16, "plant");
  mushroom1.init();
  mushroom1.setDestroyTime(0);
  mushroom1.setSoundType(SOUND_GRASS);
  mushroom1.setLightEmission(2 / 16);
  mushroom1.setCategory(1);
  mushroom1.setDescriptionId("mushroom");
  mushroom2 = new Tile(40, 12 + 16, "plant");
  mushroom2.init();
  mushroom2.setDestroyTime(0);
  mushroom2.setSoundType(SOUND_GRASS);
  mushroom2.setCategory(1);
  mushroom2.setDescriptionId("mushroom");
  goldBlock = new Tile(41, 39 - 16, "metal");
  goldBlock.init();
  goldBlock.setDestroyTime(3);
  goldBlock.setExplodeable(10);
  goldBlock.setSoundType(SOUND_METAL);
  goldBlock.setCategory(1);
  goldBlock.setDescriptionId("blockGold");
  ironBlock = new Tile(42, 38 - 16, "metal");
  ironBlock.init();
  ironBlock.setDestroyTime(5);
  ironBlock.setExplodeable(10);
  ironBlock.setSoundType(SOUND_METAL);
  ironBlock.setCategory(1);
  ironBlock.setDescriptionId("blockIron");
  stoneSlab = new Tile(43, 6, "stone");
  stoneSlab.init();
  stoneSlab.setDestroyTime(2);
  stoneSlab.setExplodeable(10);
  stoneSlab.setSoundType(SOUND_STONE);
  stoneSlab.setCategory(0);
  stoneSlab.setDescriptionId("stoneSlab");
  stoneSlabHalf = new Tile(44, 6, "stone");
  stoneSlabHalf.init();
  stoneSlabHalf.setDestroyTime(2);
  stoneSlabHalf.setExplodeable(10);
  stoneSlabHalf.setSoundType(SOUND_STONE);
  stoneSlabHalf.setCategory(0);
  stoneSlabHalf.setDescriptionId("stoneSlab");
  redBrick = new Tile(45, 7, "stone");
  redBrick.init();
  redBrick.setDestroyTime(2);
  redBrick.setExplodeable(10);
  redBrick.setSoundType(SOUND_STONE);
  redBrick.setCategory(0);
  redBrick.setDescriptionId("brick");
  tnt = new Tile(46, 8, "explosive");
  tnt.init();
  tnt.setDestroyTime(0);
  tnt.setSoundType(SOUND_GRASS);
  tnt.setCategory(2);
  tnt.setDescriptionId("tnt");
  bookshelf = new Tile(47, 35, "wood");
  bookshelf.init();
  bookshelf.setDestroyTime(1.5);
  bookshelf.setSoundType(SOUND_WOOD);
  bookshelf.setCategory(1);
  bookshelf.setDescriptionId("bookshelf");
  mossStone = new Tile(48, 36, "stone");
  mossStone.init();
  mossStone.setDestroyTime(2);
  mossStone.setExplodeable(10);
  mossStone.setSoundType(SOUND_STONE);
  mossStone.setCategory(0);
  mossStone.setDescriptionId("stoneMoss");
  obsidian = new Tile(49, 37, "stone");
  obsidian.init();
  obsidian.setDestroyTime(10);
  obsidian.setExplodeable(2000);
  obsidian.setSoundType(SOUND_STONE);
  obsidian.setCategory(0);
  obsidian.setDescriptionId("obsidian");
  torch = new Tile(50, 5 * 16, "decoration");
  torch.init();
  torch.setDestroyTime(0);
  torch.setLightEmission(15 / 16);
  torch.setSoundType(SOUND_WOOD);
  torch.setCategory(2);
  torch.setDescriptionId("torch");
  stairs_wood = new Tile(53, 4, "wood");
  stairs_wood.init();
  stairs_wood.setCategory(0);
  stairs_wood.setDescriptionId("stairsWood");
  chest = new Tile(54, 26, "wood");
  chest.init();
  chest.setCategory(0);
  chest.setDestroyTime(2.5);
  chest.setSoundType(SOUND_WOOD);
  chest.setDescriptionId("chest");
  emeraldOre = new Tile(56, 16 * 3 + 2, "stone");
  emeraldOre.init();
  emeraldOre.setDestroyTime(3);
  emeraldOre.setExplodeable(5);
  emeraldOre.setSoundType(SOUND_STONE);
  emeraldOre.setCategory(1);
  emeraldOre.setDescriptionId("oreDiamond");
  emeraldBlock = new Tile(57, 40 - 16, "metal");
  emeraldBlock.init();
  emeraldBlock.setDestroyTime(5);
  emeraldBlock.setExplodeable(10);
  emeraldBlock.setSoundType(SOUND_METAL);
  emeraldBlock.setCategory(1);
  emeraldBlock.setDescriptionId("blockDiamond");
  workBench = new Tile(58, 59, "wood");
  workBench.init();
  workBench.setDestroyTime(2.5);
  workBench.setSoundType(SOUND_WOOD);
  workBench.setCategory(0);
  workBench.setDescriptionId("workbench");
  crops = new Tile(59, 8 + 5 * 16, "plant");
  crops.init();
  crops.setDestroyTime(0);
  crops.setSoundType(SOUND_GRASS);
  crops.setCategory(0);
  crops.setDescriptionId("crops");
  farmland = new Tile(60, 87, "dirt");
  farmland.init();
  farmland.setDestroyTime(0.6);
  farmland.setSoundType(SOUND_GRAVEL);
  farmland.setCategory(0);
  farmland.setDescriptionId("farmland");
  furnace = new Tile(61, 45, "stone");
  furnace.init();
  furnace.setDestroyTime(3.5);
  furnace.setSoundType(SOUND_STONE);
  furnace.setCategory(0);
  furnace.setDescriptionId("furnace");
  furnace_lit = new Tile(62, 45, "stone");
  furnace_lit.init();
  furnace_lit.setDestroyTime(3.5);
  furnace_lit.setSoundType(SOUND_STONE);
  furnace_lit.setLightEmission(14 / 16);
  furnace_lit.setCategory(0);
  furnace_lit.setDescriptionId("furnace");
  sign = new Tile(63, 4, "wood");
  sign.init();
  sign.setDestroyTime(1);
  sign.setSoundType(SOUND_WOOD);
  sign.setCategory(1);
  sign.setDescriptionId("sign");
  door_wood = new Tile(64, 97, "wood");
  door_wood.init();
  door_wood.setDestroyTime(3);
  door_wood.setSoundType(SOUND_WOOD);
  door_wood.setCategory(0);
  door_wood.setDescriptionId("doorWood");
  ladder = new Tile(65, 3 + 5 * 16, "decoration");
  ladder.init();
  ladder.setDestroyTime(0.4);
  ladder.setSoundType(SOUND_WOOD);
  ladder.setCategory(0);
  ladder.setDescriptionId("ladder");
  stairs_stone = new Tile(67, 16, "stone");
  stairs_stone.init();
  stairs_stone.setCategory(0);
  stairs_stone.setDescriptionId("stairsStone");
  wallSign = new Tile(68, 4, "wood");
  wallSign.init();
  wallSign.setDestroyTime(1);
  wallSign.setSoundType(SOUND_WOOD);
  wallSign.setCategory(1);
  wallSign.setDescriptionId("sign");
  door_iron = new Tile(71, 98, "metal");
  door_iron.init();
  door_iron.setDestroyTime(5);
  door_iron.setSoundType(SOUND_METAL);
  door_iron.setCategory(0);
  door_iron.setDescriptionId("doorIron");
  redStoneOre = new Tile(73, 16 * 3 + 3, "stone");
  redStoneOre.init();
  redStoneOre.setDestroyTime(3);
  redStoneOre.setExplodeable(5);
  redStoneOre.setSoundType(SOUND_STONE);
  redStoneOre.setCategory(3);
  redStoneOre.setDescriptionId("oreRedstone");
  redStoneOre_lit = new Tile(74, 16 * 3 + 3, "stone");
  redStoneOre_lit.init();
  redStoneOre_lit.setDestroyTime(3);
  redStoneOre_lit.setLightEmission(10 / 16);
  redStoneOre_lit.setExplodeable(5);
  redStoneOre_lit.setSoundType(SOUND_STONE);
  redStoneOre_lit.setCategory(3);
  redStoneOre_lit.setDescriptionId("oreRedstone");
  topSnow = new Tile(78, 16 * 4 + 2, "topSnow");
  topSnow.init();
  topSnow.setDestroyTime(0.1);
  topSnow.setSoundType(SOUND_CLOTH);
  topSnow.setCategory(0);
  topSnow.setDescriptionId("snow");
  ice = new Tile(79, 16 * 4 + 3, "ice");
  ice.init();
  ice.setDestroyTime(0.5);
  ice.setLightBlock(3);
  ice.setSoundType(SOUND_GLASS);
  ice.setCategory(0);
  ice.setDescriptionId("ice");
  snow = new Tile(80, 16 * 4 + 2, "snow");
  snow.init();
  snow.setDestroyTime(0.2);
  snow.setSoundType(SOUND_CLOTH);
  snow.setCategory(0);
  snow.setDescriptionId("snow");
  cactus = new Tile(81, 16 * 4 + 6, "cactus");
  cactus.init();
  cactus.setDestroyTime(0.4);
  cactus.setSoundType(SOUND_CLOTH);
  cactus.setCategory(0);
  cactus.setDescriptionId("cactus");
  clay = new Tile(82, 16 * 4 + 8, "clay");
  clay.init();
  clay.setDestroyTime(0.6);
  clay.setSoundType(SOUND_GRAVEL);
  clay.setCategory(0);
  clay.setDescriptionId("clay");
  reeds = new Tile(83, 16 * 4 + 9, "plant");
  reeds.init();
  reeds.setDestroyTime(0);
  reeds.setSoundType(SOUND_GRASS);
  reeds.setCategory(0);
  reeds.setDescriptionId("reeds");
  fence = new Tile(85, 4, "wood");
  fence.init();
  fence.setDestroyTime(2);
  fence.setExplodeable(5);
  fence.setSoundType(SOUND_WOOD);
  fence.setCategory(0);
  fence.setDescriptionId("fence");
  netherrack = new Tile(87, 7 + 6 * 16, "stone");
  netherrack.init();
  netherrack.setDestroyTime(0.4);
  netherrack.setSoundType(SOUND_STONE);
  netherrack.setDescriptionId("hellrock");
  lightGem = new Tile(89, 9 + 16 * 6, "glass");
  lightGem.init();
  lightGem.setDestroyTime(0.3);
  lightGem.setCategory(0);
  lightGem.setSoundType(SOUND_GLASS);
  lightGem.setLightEmission(1);
  lightGem.setDescriptionId("lightgem");
  invisible_bedrock = new Tile(95, 0, "stone");
  invisible_bedrock.init();
  invisible_bedrock.setDestroyTime(-1);
  invisible_bedrock.setExplodeable(6000000);
  trapdoor = new Tile(96, 84, "wood");
  trapdoor.init();
  trapdoor.setDestroyTime(3);
  trapdoor.setSoundType(SOUND_WOOD);
  trapdoor.setCategory(0);
  trapdoor.setDescriptionId("trapdoor");
  stoneBrickSmooth = new Tile(98, 6 + 16 * 3, "stone");
  stoneBrickSmooth.init();
  stoneBrickSmooth.setDestroyTime(1.5);
  stoneBrickSmooth.setExplodeable(10);
  stoneBrickSmooth.setSoundType(SOUND_STONE);
  stoneBrickSmooth.setCategory(0);
  stoneBrickSmooth.setDescriptionId("stonebricksmooth");
  thinGlass = new Tile(102, 1 + 3 * 16, "glass");
  thinGlass.init();
  thinGlass.setDestroyTime(0.3);
  thinGlass.setSoundType(SOUND_GLASS);
  thinGlass.setCategory(0);
  thinGlass.setDescriptionId("thinGlass");
  melon = new Tile(103, 137, "vegetable");
  melon.init();
  melon.setDestroyTime(1);
  melon.setSoundType(SOUND_WOOD);
  melon.setCategory(4);
  melon.setDescriptionId("melon");
  melonStem = new Tile(105, 88, "plant");
  melonStem.init();
  melonStem.setDestroyTime(0);
  melonStem.setSoundType(SOUND_WOOD);
  melonStem.setCategory(4);
  melonStem.setDescriptionId("pumpkinStem");
  fenceGate = new Tile(107, 4, "wood");
  fenceGate.init();
  fenceGate.setDestroyTime(2);
  fenceGate.setExplodeable(5);
  fenceGate.setSoundType(SOUND_WOOD);
  fenceGate.setCategory(0);
  fenceGate.setDescriptionId("fenceGate");
  stairs_brick = new Tile(108, 7, "stone");
  stairs_brick.init();
  stairs_brick.setCategory(0);
  stairs_brick.setDescriptionId("stairsBrick");
  stairs_stoneBrickSmooth = new Tile(109, 6 + 16 * 3, "stone");
  stairs_stoneBrickSmooth.init();
  stairs_stoneBrickSmooth.setCategory(0);
  stairs_stoneBrickSmooth.setDescriptionId("stairsStoneBrickSmooth");
  netherBrick = new Tile(112, 0 + 14 * 16, "stone");
  netherBrick.init();
  netherBrick.setDestroyTime(2);
  netherBrick.setExplodeable(10);
  netherBrick.setSoundType(SOUND_STONE);
  netherBrick.setCategory(0);
  netherBrick.setDescriptionId("netherBrick");
  stairs_netherBricks = new Tile(114, 0 + 14 * 16, "stone");
  stairs_netherBricks.init();
  stairs_netherBricks.setCategory(0);
  stairs_netherBricks.setDescriptionId("stairsNetherBrick");
  stairs_sandStone = new Tile(128, 0 + 16 * 12, "stone");
  stairs_sandStone.init();
  stairs_sandStone.setCategory(0);
  stairs_sandStone.setDescriptionId("stairsSandStone");
  quartzBlock = new Tile(155, 15, "stone");
  quartzBlock.init();
  quartzBlock.setSoundType(SOUND_STONE);
  quartzBlock.setDestroyTime(0.8);
  quartzBlock.setCategory(0);
  quartzBlock.setDescriptionId("quartzBlock");
  stairs_quartz = new Tile(156, 15, "stone");
  stairs_quartz.init();
  stairs_quartz.setCategory(0);
  stairs_quartz.setDescriptionId("stairsQuartz");
  stonecutterBench = new Tile(245, 169, "stone");
  stonecutterBench.init();
  stonecutterBench.setDestroyTime(2.5);
  stonecutterBench.setSoundType(SOUND_STONE);
  stonecutterBench.setCategory(0);
  stonecutterBench.setDescriptionId("stonecutter");
  glowingObsidian = new Tile(246, 10 + 16 * 13, "stone");
  glowingObsidian.init();
  glowingObsidian.setDestroyTime(10);
  glowingObsidian.setLightEmission(14 / 16);
  glowingObsidian.setExplodeable(2000);
  glowingObsidian.setSoundType(SOUND_STONE);
  glowingObsidian.setCategory(0);
  glowingObsidian.setDescriptionId("glowingobsidian");
  netherReactor = new Tile(247, 10 + 14 * 16, "metal");
  netherReactor.init();
  netherReactor.setDestroyTime(3);
  netherReactor.setSoundType(SOUND_METAL);
  netherReactor.setCategory(0);
  netherReactor.setDescriptionId("netherreactor");
  info_updateGame1 = new Tile(248, 252, "dirt");
  info_updateGame1.init();
  info_updateGame1.setDestroyTime(1);
  info_updateGame1.setSoundType(SOUND_GRAVEL);
  info_updateGame1.setCategory(0);
  info_updateGame1.setDescriptionId("info_update");
  info_updateGame2 = new Tile(249, 253, "dirt");
  info_updateGame2.init();
  info_updateGame2.setDestroyTime(1);
  info_updateGame2.setSoundType(SOUND_GRAVEL);
  info_updateGame2.setCategory(0);
  info_updateGame2.setDescriptionId("info_update");
  grass_carried = new Tile(253, 3, "dirt");
  grass_carried.init();
  grass_carried.setDescriptionId("grass");
  leaves_carried = new Tile(254, 11 + 14 * 16, "leaves");
  leaves_carried.init();
  leaves_carried.setDestroyTime(0.2);
  leaves_carried.setLightBlock(1);
  leaves_carried.setSoundType(SOUND_GRASS);
  leaves_carried.setCategory(0);
  leaves_carried.setDescriptionId("leaves");
  info_reserved6 = new Tile(255, "dirt");
  info_reserved6.init();
}

// src/game/world/item/translated/Item.ts
var MAX_STACK_SIZE = 64;
var MAX_ITEMS = 512;
var ICON_COLUMNS = 16;
var ICON_DESCRIPTION_PREFIX = "item.";

class Tier {
  level;
  uses;
  speed;
  damage;
  constructor(level, uses, speed, damage) {
    this.level = level;
    this.uses = uses;
    this.speed = speed;
    this.damage = damage;
  }
  getUses() {
    return this.uses;
  }
  getSpeed() {
    return this.speed;
  }
  getAttackDamageBonus() {
    return this.damage;
  }
  getLevel() {
    return this.level;
  }
}
var TIER_WOOD = new Tier(0, 59, 2, 0);
var TIER_STONE = new Tier(1, 131, 4, 1);
var TIER_IRON = new Tier(2, 250, 6, 2);
var TIER_EMERALD = new Tier(3, 1561, 8, 3);
var TIER_GOLD = new Tier(0, 32, 12, 0);

class Item {
  static items = new Array(MAX_ITEMS).fill(null);
  static shovel_iron = null;
  static pickAxe_iron = null;
  static hatchet_iron = null;
  static flintAndSteel = null;
  static apple = null;
  static bow = null;
  static arrow = null;
  static coal = null;
  static emerald = null;
  static ironIngot = null;
  static goldIngot = null;
  static sword_iron = null;
  static sword_wood = null;
  static shovel_wood = null;
  static pickAxe_wood = null;
  static hatchet_wood = null;
  static sword_stone = null;
  static shovel_stone = null;
  static pickAxe_stone = null;
  static hatchet_stone = null;
  static sword_emerald = null;
  static shovel_emerald = null;
  static pickAxe_emerald = null;
  static hatchet_emerald = null;
  static stick = null;
  static bowl = null;
  static mushroomStew = null;
  static sword_gold = null;
  static shovel_gold = null;
  static pickAxe_gold = null;
  static hatchet_gold = null;
  static string = null;
  static feather = null;
  static sulphur = null;
  static hoe_wood = null;
  static hoe_stone = null;
  static hoe_iron = null;
  static hoe_emerald = null;
  static hoe_gold = null;
  static seeds_wheat = null;
  static wheat = null;
  static bread = null;
  static helmet_cloth = null;
  static chestplate_cloth = null;
  static leggings_cloth = null;
  static boots_cloth = null;
  static helmet_chain = null;
  static chestplate_chain = null;
  static leggings_chain = null;
  static boots_chain = null;
  static helmet_iron = null;
  static chestplate_iron = null;
  static leggings_iron = null;
  static boots_iron = null;
  static helmet_diamond = null;
  static chestplate_diamond = null;
  static leggings_diamond = null;
  static boots_diamond = null;
  static helmet_gold = null;
  static chestplate_gold = null;
  static leggings_gold = null;
  static boots_gold = null;
  static flint = null;
  static porkChop_raw = null;
  static porkChop_cooked = null;
  static painting = null;
  static sign = null;
  static door_wood = null;
  static door_iron = null;
  static snowBall = null;
  static leather = null;
  static brick = null;
  static clay = null;
  static reeds = null;
  static paper = null;
  static book = null;
  static slimeBall = null;
  static egg = null;
  static compass = null;
  static clock = null;
  static yellowDust = null;
  static melon = null;
  static seeds_melon = null;
  static dye_powder = null;
  static bone = null;
  static sugar = null;
  static bed = null;
  static shears = null;
  static beef_raw = null;
  static beef_cooked = null;
  static chicken_raw = null;
  static chicken_cooked = null;
  static netherbrick = null;
  static netherQuartz = null;
  static camera = null;
  id;
  maxDamage;
  icon;
  category;
  maxStackSize;
  _handEquipped;
  _isStackedByData;
  craftingRemainingItem;
  descriptionId;
  constructor(id2) {
    this.id = 256 + id2;
    this.craftingRemainingItem = null;
    this.maxStackSize = MAX_STACK_SIZE;
    this.maxDamage = 32;
    this.category = -1;
    this._handEquipped = false;
    this._isStackedByData = false;
    this.icon = 0;
    this.descriptionId = "";
    if (Item.items[this.id] != null) {
      console.warn("Item conflict id @ " + this.id + "! Id already used");
    }
    Item.items[this.id] = this;
  }
  setIcon(icon) {
    this.icon = icon;
    return this;
  }
  setIconPos(column, row) {
    this.icon = column + row * ICON_COLUMNS;
    return this;
  }
  setMaxStackSize(max) {
    this.maxStackSize = max;
    return this;
  }
  canBeDepleted() {
    return this.maxDamage > 0 && !this._isStackedByData;
  }
  getIcon(auxValue) {
    return this.icon;
  }
  useOn(itemInstance, level, x, y, z, face) {
    return false;
  }
  useOnWithClick(itemInstance, player, level, x, y, z, face, clickX, clickY, clickZ) {
    return false;
  }
  getUseDuration(itemInstance) {
    return 0;
  }
  useTimeDepleted(itemInstance, level, player) {
    return itemInstance;
  }
  getDestroySpeed(itemInstance, tile) {
    return 1;
  }
  use(itemInstance, level, player) {
    return itemInstance;
  }
  getMaxStackSize() {
    return this.maxStackSize;
  }
  getLevelDataForAuxValue(auxValue) {
    return 0;
  }
  isStackedByData() {
    return this._isStackedByData;
  }
  setCategory(category) {
    this.category = category;
    return this;
  }
  getMaxDamage() {
    return this.maxDamage;
  }
  hurtEnemy(itemInstance, mob) {}
  mineBlock(itemInstance, tile, x, y, z) {
    return false;
  }
  getAttackDamage(entity) {
    return 1;
  }
  canDestroySpecial(tile) {
    return false;
  }
  interactEnemy(itemInstance, mob) {}
  handEquipped() {
    this._handEquipped = true;
    return this;
  }
  isHandEquipped() {
    return this._handEquipped;
  }
  isMirroredArt() {
    return false;
  }
  isFood() {
    return false;
  }
  isArmor() {
    return false;
  }
  setDescriptionId(id2) {
    this.descriptionId = ICON_DESCRIPTION_PREFIX + id2;
    return this;
  }
  getDescription() {
    return this.descriptionId;
  }
  getDescriptionWithInstance(instance) {
    return this.descriptionId;
  }
  getDescriptionId() {
    return this.descriptionId;
  }
  getDescriptionIdWithInstance(instance) {
    return this.descriptionId;
  }
  setCraftingRemainingItem(craftingRemainingItem) {
    if (this.maxStackSize > 1) {
      console.warn("Max stack size must be 1 for items with crafting results");
    }
    this.craftingRemainingItem = craftingRemainingItem;
    return this;
  }
  getCraftingRemainingItem() {
    return this.craftingRemainingItem;
  }
  hasCraftingRemainingItem() {
    return this.craftingRemainingItem != null;
  }
  getName() {
    return this.descriptionId + ".name";
  }
  releaseUsing(itemInstance, level, player, durationLeft) {}
  getUseAnimation() {
    return "none";
  }
  setStackedByData(isStackedByData) {
    this._isStackedByData = isStackedByData;
    return this;
  }
  setMaxDamage(maxDamage) {
    this.maxDamage = maxDamage;
    return this;
  }
}
function initItems() {
  let isInited = false;
  if (isInited)
    return;
  isInited = true;
  Item.shovel_iron = new Item(0);
  Item.shovel_iron.setIconPos(2, 5).setCategory(0).setDescriptionId("shovelIron");
  Item.pickAxe_iron = new Item(1);
  Item.pickAxe_iron.setIconPos(2, 6).setCategory(0).setDescriptionId("pickaxeIron");
  Item.hatchet_iron = new Item(2);
  Item.hatchet_iron.setIconPos(2, 7).setCategory(0).setDescriptionId("hatchetIron");
  Item.flintAndSteel = new Item(3);
  Item.flintAndSteel.setIconPos(5, 0).setCategory(0).setDescriptionId("flintAndSteel");
  Item.apple = new Item(4);
  Item.apple.setIconPos(10, 0).setCategory(4).setDescriptionId("apple");
  Item.bow = new Item(5);
  Item.bow.setIconPos(5, 1).setCategory(0).setDescriptionId("bow");
  Item.arrow = new Item(6);
  Item.arrow.setIconPos(5, 2).setCategory(0).setDescriptionId("arrow");
  Item.coal = new Item(7);
  Item.coal.setIconPos(7, 0).setCategory(0).setDescriptionId("coal");
  Item.emerald = new Item(8);
  Item.emerald.setIconPos(7, 3).setCategory(1).setDescriptionId("emerald");
  Item.ironIngot = new Item(9);
  Item.ironIngot.setIconPos(7, 1).setCategory(1).setDescriptionId("ingotIron");
  Item.goldIngot = new Item(10);
  Item.goldIngot.setIconPos(7, 2).setCategory(1).setDescriptionId("ingotGold");
  Item.sword_iron = new Item(11);
  Item.sword_iron.setIconPos(2, 4).setCategory(0).setDescriptionId("swordIron");
  Item.sword_wood = new Item(12);
  Item.sword_wood.setIconPos(0, 4).setCategory(0).setDescriptionId("swordWood");
  Item.shovel_wood = new Item(13);
  Item.shovel_wood.setIconPos(0, 5).setCategory(0).setDescriptionId("shovelWood");
  Item.pickAxe_wood = new Item(14);
  Item.pickAxe_wood.setIconPos(0, 6).setCategory(0).setDescriptionId("pickaxeWood");
  Item.hatchet_wood = new Item(15);
  Item.hatchet_wood.setIconPos(0, 7).setCategory(0).setDescriptionId("hatchetWood");
  Item.sword_stone = new Item(16);
  Item.sword_stone.setIconPos(1, 4).setCategory(0).setDescriptionId("swordStone");
  Item.shovel_stone = new Item(17);
  Item.shovel_stone.setIconPos(1, 5).setCategory(0).setDescriptionId("shovelStone");
  Item.pickAxe_stone = new Item(18);
  Item.pickAxe_stone.setIconPos(1, 6).setCategory(0).setDescriptionId("pickaxeStone");
  Item.hatchet_stone = new Item(19);
  Item.hatchet_stone.setIconPos(1, 7).setCategory(0).setDescriptionId("hatchetStone");
  Item.sword_emerald = new Item(20);
  Item.sword_emerald.setIconPos(3, 4).setCategory(0).setDescriptionId("swordDiamond");
  Item.shovel_emerald = new Item(21);
  Item.shovel_emerald.setIconPos(3, 5).setCategory(0).setDescriptionId("shovelDiamond");
  Item.pickAxe_emerald = new Item(22);
  Item.pickAxe_emerald.setIconPos(3, 6).setCategory(0).setDescriptionId("pickaxeDiamond");
  Item.hatchet_emerald = new Item(23);
  Item.hatchet_emerald.setIconPos(3, 7).setCategory(0).setDescriptionId("hatchetDiamond");
  Item.stick = new Item(24);
  Item.stick.setIconPos(5, 3).handEquipped().setCategory(0).setDescriptionId("stick");
  Item.bowl = new Item(25);
  Item.bowl.setIconPos(7, 4).setCategory(4).setDescriptionId("bowl");
  Item.mushroomStew = new Item(26);
  Item.mushroomStew.setIconPos(8, 4).setCategory(4).setDescriptionId("mushroomStew");
  Item.sword_gold = new Item(27);
  Item.sword_gold.setIconPos(4, 4).setCategory(0).setDescriptionId("swordGold");
  Item.shovel_gold = new Item(28);
  Item.shovel_gold.setIconPos(4, 5).setCategory(0).setDescriptionId("shovelGold");
  Item.pickAxe_gold = new Item(29);
  Item.pickAxe_gold.setIconPos(4, 6).setCategory(0).setDescriptionId("pickaxeGold");
  Item.hatchet_gold = new Item(30);
  Item.hatchet_gold.setIconPos(4, 7).setCategory(0).setDescriptionId("hatchetGold");
  Item.string = new Item(31);
  Item.string.setIconPos(8, 0).setCategory(0).setDescriptionId("string");
  Item.feather = new Item(32);
  Item.feather.setIconPos(8, 1).setCategory(0).setDescriptionId("feather");
  Item.sulphur = new Item(33);
  Item.sulphur.setIconPos(8, 2).setCategory(0).setDescriptionId("sulphur");
  Item.hoe_wood = new Item(34);
  Item.hoe_wood.setIconPos(0, 8).setCategory(0).setDescriptionId("hoeWood");
  Item.hoe_stone = new Item(35);
  Item.hoe_stone.setIconPos(1, 8).setCategory(0).setDescriptionId("hoeStone");
  Item.hoe_iron = new Item(36);
  Item.hoe_iron.setIconPos(2, 8).setCategory(0).setDescriptionId("hoeIron");
  Item.hoe_emerald = new Item(37);
  Item.hoe_emerald.setIconPos(3, 8).setCategory(0).setDescriptionId("hoeDiamond");
  Item.hoe_gold = new Item(38);
  Item.hoe_gold.setIconPos(4, 8).setCategory(0).setDescriptionId("hoeGold");
  Item.seeds_wheat = new Item(39);
  Item.seeds_wheat.setIconPos(9, 0).setCategory(4).setDescriptionId("seeds");
  Item.wheat = new Item(40);
  Item.wheat.setIconPos(9, 1).setCategory(4).setDescriptionId("wheat");
  Item.bread = new Item(41);
  Item.bread.setIconPos(9, 2).setCategory(4).setDescriptionId("bread");
  Item.helmet_cloth = new Item(42);
  Item.helmet_cloth.setIconPos(0, 0).setCategory(4).setDescriptionId("helmetCloth");
  Item.chestplate_cloth = new Item(43);
  Item.chestplate_cloth.setIconPos(0, 1).setCategory(4).setDescriptionId("chestplateCloth");
  Item.leggings_cloth = new Item(44);
  Item.leggings_cloth.setIconPos(0, 2).setCategory(4).setDescriptionId("leggingsCloth");
  Item.boots_cloth = new Item(45);
  Item.boots_cloth.setIconPos(0, 3).setCategory(4).setDescriptionId("bootsCloth");
  Item.helmet_chain = new Item(46);
  Item.helmet_chain.setIconPos(1, 0).setCategory(4).setDescriptionId("helmetChain");
  Item.chestplate_chain = new Item(47);
  Item.chestplate_chain.setIconPos(1, 1).setCategory(4).setDescriptionId("chestplateChain");
  Item.leggings_chain = new Item(48);
  Item.leggings_chain.setIconPos(1, 2).setCategory(4).setDescriptionId("leggingsChain");
  Item.boots_chain = new Item(49);
  Item.boots_chain.setIconPos(1, 3).setCategory(4).setDescriptionId("bootsChain");
  Item.helmet_iron = new Item(50);
  Item.helmet_iron.setIconPos(2, 0).setCategory(4).setDescriptionId("helmetIron");
  Item.chestplate_iron = new Item(51);
  Item.chestplate_iron.setIconPos(2, 1).setCategory(4).setDescriptionId("chestplateIron");
  Item.leggings_iron = new Item(52);
  Item.leggings_iron.setIconPos(2, 2).setCategory(4).setDescriptionId("leggingsIron");
  Item.boots_iron = new Item(53);
  Item.boots_iron.setIconPos(2, 3).setCategory(4).setDescriptionId("bootsIron");
  Item.helmet_diamond = new Item(54);
  Item.helmet_diamond.setIconPos(3, 0).setCategory(4).setDescriptionId("helmetDiamond");
  Item.chestplate_diamond = new Item(55);
  Item.chestplate_diamond.setIconPos(3, 1).setCategory(4).setDescriptionId("chestplateDiamond");
  Item.leggings_diamond = new Item(56);
  Item.leggings_diamond.setIconPos(3, 2).setCategory(4).setDescriptionId("leggingsDiamond");
  Item.boots_diamond = new Item(57);
  Item.boots_diamond.setIconPos(3, 3).setCategory(4).setDescriptionId("bootsDiamond");
  Item.helmet_gold = new Item(58);
  Item.helmet_gold.setIconPos(4, 0).setCategory(4).setDescriptionId("helmetGold");
  Item.chestplate_gold = new Item(59);
  Item.chestplate_gold.setIconPos(4, 1).setCategory(4).setDescriptionId("chestplateGold");
  Item.leggings_gold = new Item(60);
  Item.leggings_gold.setIconPos(4, 2).setCategory(4).setDescriptionId("leggingsGold");
  Item.boots_gold = new Item(61);
  Item.boots_gold.setIconPos(4, 3).setCategory(4).setDescriptionId("bootsGold");
  Item.flint = new Item(62);
  Item.flint.setIconPos(6, 0).setCategory(0).setDescriptionId("flint");
  Item.porkChop_raw = new Item(63);
  Item.porkChop_raw.setIconPos(7, 5).setCategory(4).setDescriptionId("porkchopRaw");
  Item.porkChop_cooked = new Item(64);
  Item.porkChop_cooked.setIconPos(8, 5).setCategory(4).setDescriptionId("porkchopCooked");
  Item.painting = new Item(65);
  Item.painting.setIconPos(10, 1).setCategory(1).setDescriptionId("painting");
  Item.sign = new Item(67);
  Item.sign.setIconPos(10, 2).setCategory(1).setDescriptionId("sign");
  Item.door_wood = new Item(68);
  Item.door_wood.setIconPos(11, 2).setCategory(0).setDescriptionId("doorWood");
  Item.door_iron = new Item(74);
  Item.door_iron.setIconPos(12, 2).setCategory(0).setDescriptionId("doorIron");
  Item.snowBall = new Item(76);
  Item.snowBall.setIconPos(14, 0).setCategory(1).setDescriptionId("snowball");
  Item.leather = new Item(78);
  Item.leather.setIconPos(7, 6).setCategory(0).setDescriptionId("leather");
  Item.brick = new Item(80);
  Item.brick.setIconPos(6, 1).setCategory(0).setDescriptionId("brick");
  Item.clay = new Item(81);
  Item.clay.setIconPos(9, 3).setCategory(0).setDescriptionId("clay");
  Item.reeds = new Item(82);
  Item.reeds.setIconPos(11, 1).setCategory(4).setDescriptionId("reeds");
  Item.paper = new Item(83);
  Item.paper.setIconPos(10, 3).setCategory(1).setDescriptionId("paper");
  Item.book = new Item(84);
  Item.book.setIconPos(11, 3).setCategory(1).setDescriptionId("book");
  Item.slimeBall = new Item(85);
  Item.slimeBall.setIconPos(14, 1).setCategory(1).setDescriptionId("slimeball");
  Item.egg = new Item(88);
  Item.egg.setIconPos(12, 0).setCategory(4).setDescriptionId("egg");
  Item.compass = new Item(89);
  Item.compass.setIconPos(6, 3).setCategory(0).setDescriptionId("compass");
  Item.clock = new Item(91);
  Item.clock.setIconPos(6, 4).setCategory(0).setDescriptionId("clock");
  Item.yellowDust = new Item(92);
  Item.yellowDust.setIconPos(9, 4).setCategory(0).setDescriptionId("yellowDust");
  Item.dye_powder = new Item(95);
  Item.dye_powder.setIconPos(14, 4).setCategory(1).setDescriptionId("dyePowder");
  Item.bone = new Item(96);
  Item.bone.setIconPos(12, 1).setCategory(0).setDescriptionId("bone").handEquipped();
  Item.sugar = new Item(97);
  Item.sugar.setIconPos(13, 0).setCategory(4).setDescriptionId("sugar").handEquipped();
  Item.bed = new Item(99);
  Item.bed.setMaxStackSize(1).setIconPos(13, 2).setCategory(0).setDescriptionId("bed");
  Item.shears = new Item(103);
  Item.shears.setIconPos(13, 5).setCategory(0).setDescriptionId("shears");
  Item.melon = new Item(104);
  Item.melon.setIconPos(13, 6).setCategory(4).setDescriptionId("melon");
  Item.seeds_melon = new Item(106);
  Item.seeds_melon.setIconPos(14, 3).setCategory(4).setDescriptionId("seedsMelon");
  Item.beef_raw = new Item(107);
  Item.beef_raw.setIconPos(9, 6).setCategory(4).setDescriptionId("beefRaw");
  Item.beef_cooked = new Item(108);
  Item.beef_cooked.setIconPos(10, 6).setCategory(4).setDescriptionId("beefCooked");
  Item.chicken_raw = new Item(109);
  Item.chicken_raw.setIconPos(9, 7).setCategory(4).setDescriptionId("chickenRaw");
  Item.chicken_cooked = new Item(110);
  Item.chicken_cooked.setIconPos(10, 7).setCategory(4).setDescriptionId("chickenCooked");
  Item.netherbrick = new Item(149);
  Item.netherbrick.setIconPos(5, 9).setDescriptionId("netherbrickItem").setCategory(0);
  Item.netherQuartz = new Item(150);
  Item.netherQuartz.setIconPos(5, 10).setDescriptionId("netherquartz").setCategory(3);
  Item.camera = new Item(200);
  Item.camera.setIconPos(2, 15).setCategory(1).setDescriptionId("camera");
  for (let i = 256;i < MAX_ITEMS; i++) {
    if (Item.items[i] && Item.items[i].category === -1) {
      console.warn("Error: Missing category for item " + Item.items[i].id + ": " + Item.items[i].getDescriptionId());
    }
  }
}

// src/game/world/item/translated/ItemInstance.ts
class ItemInstance {
  count;
  id;
  auxValue;
  constructor(arg1, arg2, arg3) {
    if (arg1 === undefined) {
      this.init(0, 0, 0);
    } else if (typeof arg1 === "number") {
      this.init(arg1, arg2, arg3);
    } else {
      const id2 = arg1.id;
      const count = arg2 ?? 1;
      const aux = arg3 ?? 0;
      this.init(id2, count, aux);
    }
  }
  init(id2, count, damage) {
    this.id = id2;
    this.count = count;
    this.auxValue = damage;
  }
  isNull() {
    return (this.id | this.count | this.auxValue) === 0;
  }
  setNull() {
    this.id = this.count = this.auxValue = 0;
  }
  remove(count) {
    this.count -= count;
    return new ItemInstance(this.id, count, this.auxValue);
  }
  useOn(player, level, x, y, z, face, clickX, clickY, clickZ) {
    const item = this.getItem();
    if (item && item.useOn && item.useOn(this, player, level, x, y, z, face, clickX, clickY, clickZ)) {
      return true;
    }
    return false;
  }
  getDestroySpeed(tile) {
    const item = this.getItem();
    return item ? item.getDestroySpeed(this, tile) : 1;
  }
  use(level, player) {
    const item = this.getItem();
    return item ? item.use(this, level, player) : null;
  }
  getMaxStackSize() {
    const item = this.getItem();
    return item ? item.getMaxStackSize() : 64;
  }
  isStackable() {
    return this.getMaxStackSize() > 1 && (!this.isDamageableItem() || !this.isDamaged());
  }
  static isStackableStatic(a, b) {
    return !!(a && b && a.id === b.id && b.isStackable() && (!b.isStackedByData() || a.getAuxValue() === b.getAuxValue()));
  }
  isDamageableItem() {
    const item = this.getItem();
    return item ? item.getMaxDamage() > 0 : false;
  }
  isStackedByData() {
    const item = this.getItem();
    return item ? item.isStackedByData() : false;
  }
  isDamaged() {
    return this.isDamageableItem() && this.auxValue > 0;
  }
  getDamageValue() {
    return this.auxValue;
  }
  getAuxValue() {
    return this.auxValue;
  }
  setAuxValue(value) {
    this.auxValue = value;
  }
  getMaxDamage() {
    const item = this.getItem();
    return item ? item.getMaxDamage() : 0;
  }
  hurt(i) {
    if (!this.isDamageableItem())
      return;
    this.auxValue += i;
    if (this.auxValue > this.getMaxDamage()) {
      this.count--;
      if (this.count < 0)
        this.count = 0;
      this.auxValue = 0;
    }
  }
  hurtEnemy(mob) {
    const item = this.getItem();
    if (item && item.hurtEnemy)
      item.hurtEnemy(this, mob);
  }
  mineBlock(tile, x, y, z) {
    const item = this.getItem();
    if (item && item.mineBlock)
      item.mineBlock(this, tile, x, y, z);
  }
  getAttackDamage(entity) {
    const item = this.getItem();
    return item ? item.getAttackDamage(entity) : 0;
  }
  canDestroySpecial(tile) {
    const item = this.getItem();
    return item ? item.canDestroySpecial(tile) : false;
  }
  snap(player) {}
  interactEnemy(mob) {
    const item = this.getItem();
    if (item && item.interactEnemy)
      item.interactEnemy(this, mob);
  }
  copy() {
    return new ItemInstance(this.id, this.count, this.auxValue);
  }
  static matches(a, b) {
    if (a === null && b === null)
      return true;
    if (a === null || b === null)
      return false;
    return a.matchesInternal(b);
  }
  static matchesNulls(a, b) {
    const aNull = !a || a.isNull();
    const bNull = !b || b.isNull();
    if (aNull && bNull)
      return true;
    if (aNull || bNull)
      return false;
    return a.matchesInternal(b);
  }
  sameItem(b) {
    return this.id === b.id && this.auxValue === b.auxValue;
  }
  getDescriptionId() {
    return this.id ? this.getItem()?.getDescriptionId(this) ?? "EmptyItemInstance" : "EmptyItemInstance";
  }
  setDescriptionId(id2) {
    return this;
  }
  getName() {
    return this.getDescriptionId() + ".name";
  }
  toString() {
    return this.count + " x " + this.getDescriptionId() + "(" + this.id + ")" + "@" + this.auxValue;
  }
  static clone(item) {
    return item === null ? null : item.copy();
  }
  static cloneSafe(item) {
    return item ? item.copy() : new ItemInstance;
  }
  matchesInternal(b) {
    return this.id === b.id && this.count === b.count && this.auxValue === b.auxValue;
  }
  save(tag) {
    tag.putShort("id", this.id);
    tag.putByte("Count", this.count);
    tag.putShort("Damage", this.auxValue);
    return tag;
  }
  load(tag) {
    this.id = tag.getShort("id");
    this.count = tag.getByte("Count");
    this.auxValue = tag.getShort("Damage");
  }
  equals(rhs) {
    return this.id === rhs.id && this.auxValue === rhs.auxValue && this.count === rhs.count;
  }
  static fromTag(tag) {
    const item = new ItemInstance;
    item.load(tag);
    if (item.getItem() === null) {
      return null;
    }
    return item;
  }
  getItem() {
    return globalThis.Item_items?.[this.id] ?? null;
  }
  getIcon() {
    const item = this.getItem();
    return item ? item.getIcon(this.auxValue) : 0;
  }
  releaseUsing(level, player, durationLeft) {
    const item = this.getItem();
    if (item && item.releaseUsing)
      item.releaseUsing(this, level, player, durationLeft);
  }
  getUseDuration() {
    const item = this.getItem();
    return item ? item.getUseDuration(this) : 0;
  }
  getUseAnimation() {
    const item = this.getItem();
    return item ? item.getUseAnimation() : null;
  }
  useTimeDepleted(level, player) {
    const item = this.getItem();
    return item ? item.useTimeDepleted(this, level, player) : this;
  }
  static isArmorItem(instance) {
    if (!instance)
      return false;
    const item = instance.getItem();
    if (!item)
      return false;
    return item.isArmor ? item.isArmor() : false;
  }
}

// src/game/world/level/material/translated/Material.ts
class Material {
  static air = null;
  static dirt = null;
  static wood = null;
  static stone = null;
  static metal = null;
  static water = null;
  static lava = null;
  static leaves = null;
  static plant = null;
  static replaceable_plant = null;
  static sponge = null;
  static cloth = null;
  static fire = null;
  static sand = null;
  static decoration = null;
  static glass = null;
  static explosive = null;
  static coral = null;
  static ice = null;
  static topSnow = null;
  static snow = null;
  static cactus = null;
  static clay = null;
  static vegetable = null;
  static portal = null;
  static cake = null;
  static web = null;
  _flammable;
  _neverBuildable;
  _isAlwaysDestroyable;
  _replaceable;
  constructor() {
    this._flammable = false;
    this._neverBuildable = false;
    this._isAlwaysDestroyable = true;
    this._replaceable = false;
  }
  isLiquid() {
    return false;
  }
  letsWaterThrough() {
    return !this.isLiquid() && !this.isSolid();
  }
  isSolid() {
    return true;
  }
  blocksLight() {
    return true;
  }
  isSolidBlocking() {
    if (this._neverBuildable)
      return false;
    return this.blocksMotion();
  }
  isAlwaysDestroyable() {
    return this._isAlwaysDestroyable;
  }
  blocksMotion() {
    return true;
  }
  isFlammable() {
    return this._flammable;
  }
  isReplaceable() {
    return this._replaceable;
  }
  flammable() {
    this._flammable = true;
    return this;
  }
  neverBuildable() {
    this._neverBuildable = true;
    return this;
  }
  notAlwaysDestroyable() {
    this._isAlwaysDestroyable = false;
    return this;
  }
  replaceable() {
    this._replaceable = true;
    return this;
  }
}

class GasMaterial extends Material {
  constructor() {
    super();
    this.replaceable();
  }
  isSolid() {
    return false;
  }
  blocksLight() {
    return false;
  }
  blocksMotion() {
    return false;
  }
}

class LiquidMaterial extends Material {
  constructor() {
    super();
    this.replaceable();
  }
  isLiquid() {
    return true;
  }
  blocksMotion() {
    return false;
  }
  isSolid() {
    return false;
  }
}

class DecorationMaterial extends Material {
  isSolid() {
    return false;
  }
  blocksLight() {
    return false;
  }
  blocksMotion() {
    return false;
  }
}

class WebMaterial extends Material {
  constructor() {
    super();
    this.notAlwaysDestroyable();
  }
  blocksMotion() {
    return false;
  }
}
function initMaterials() {
  Material.air = new GasMaterial;
  Material.dirt = new Material;
  Material.wood = new Material().flammable();
  Material.stone = new Material().notAlwaysDestroyable();
  Material.metal = new Material().notAlwaysDestroyable();
  Material.water = new LiquidMaterial;
  Material.lava = new LiquidMaterial;
  Material.leaves = new Material().flammable().neverBuildable();
  Material.plant = new DecorationMaterial;
  Material.replaceable_plant = new DecorationMaterial().replaceable().flammable();
  Material.sponge = new Material;
  Material.cloth = new Material().flammable();
  Material.fire = new GasMaterial;
  Material.sand = new Material;
  Material.decoration = new DecorationMaterial;
  Material.glass = new Material().neverBuildable();
  Material.explosive = new Material().flammable().neverBuildable();
  Material.coral = new Material;
  Material.ice = new Material().neverBuildable();
  Material.topSnow = new DecorationMaterial().neverBuildable().notAlwaysDestroyable().replaceable();
  Material.snow = new Material().notAlwaysDestroyable();
  Material.cactus = new Material().neverBuildable();
  Material.clay = new Material;
  Material.vegetable = new Material;
  Material.portal = new Material;
  Material.cake = new Material;
  Material.web = new WebMaterial;
}

// src/game/world/inventory/translated/Container.ts
class Container {
  static LARGE_MAX_STACK_SIZE = 64;
  containerId;
  containerType;
  constructor(containerType) {
    this.containerId = -1;
    this.containerType = containerType;
  }
  getSlotCopies() {
    const items = [];
    const nullItem = new ItemInstance;
    for (let i = 0;i < this.getContainerSize(); i++) {
      const item = this.getItem(i);
      items.push(item ? item : nullItem);
    }
    return items;
  }
}

// src/game/world/inventory/translated/FillingContainer.ts
class FillingContainer extends Container {
  static MAX_INVENTORY_STACK_SIZE = 254;
  linkedSlots;
  numTotalSlots;
  numLinkedSlots;
  items;
  _isCreative;
  constructor(numTotalSlots, numLinkedSlots, containerType, isCreative) {
    super(containerType);
    this.numTotalSlots = numTotalSlots;
    this.numLinkedSlots = numLinkedSlots;
    this.linkedSlots = [];
    this._isCreative = isCreative;
    if (numLinkedSlots > 0) {
      for (let i = 0;i < numLinkedSlots; i++) {
        this.linkedSlots.push({ inventorySlot: -1 });
      }
    }
    this.items = new Array(numTotalSlots).fill(null);
  }
  destroy() {
    this.clearInventory();
    this.linkedSlots = [];
  }
  clearInventory() {
    for (let i = 0;i < this.numLinkedSlots; i++) {
      this.linkedSlots[i] = { inventorySlot: i };
    }
    for (let i = this.numLinkedSlots;i < this.items.length; i++) {
      this.release(i);
    }
    this.items = new Array(this.numTotalSlots).fill(null);
  }
  removeResourceByType(type) {
    if (this._isCreative)
      return true;
    const slot = this.getSlot(type);
    if (slot < 0)
      return false;
    const item = this.items[slot];
    if (item) {
      item.count--;
      if (item.count <= 0)
        this.release(slot);
    }
    return true;
  }
  removeResourceByItem(item) {
    return this.removeResourceWithAux(item, false) === 0;
  }
  removeResourceWithAux(item, requireExactAux) {
    if (this._isCreative)
      return 0;
    let count = item.count;
    while (count > 0) {
      let slot = -1;
      if (!requireExactAux) {
        slot = this.getNonEmptySlot(item.id);
      } else {
        slot = this.getNonEmptySlotWithData(item.id, item.getAuxValue());
      }
      if (slot < 0)
        return count;
      const slotItem = this.items[slot];
      const toRemove = Math.min(count, slotItem.count);
      slotItem.count -= toRemove;
      count -= toRemove;
      if (slotItem.count <= 0)
        this.clearSlot(slot);
    }
    return 0;
  }
  hasResource(type) {
    if (this._isCreative)
      return true;
    const slot = this.getSlot(type);
    return slot >= 0;
  }
  swapSlots(from, to) {
    const tmp = this.items[to];
    this.items[to] = this.items[from];
    this.items[from] = tmp;
  }
  add(item) {
    if (this._isCreative)
      return true;
    if (!item || item.isNull())
      return true;
    if (!item.isDamaged()) {
      let lastSize;
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
  removeItem(slot, count) {
    const item = this.getItem(slot);
    if (item) {
      if (count > item.count)
        count = item.count;
      item.count -= count;
      if (item.count <= 0)
        this.clearSlot(slot);
    }
    return new ItemInstance;
  }
  setItem(slot, item) {
    if (slot < 0 || slot >= this.numTotalSlots)
      return;
    if (item) {
      if (!this.items[slot]) {
        this.items[slot] = new ItemInstance(item.id, item.count, item.getAuxValue());
      } else {
        this.items[slot].id = item.id;
        this.items[slot].count = item.count;
        this.items[slot].setAuxValue(item.getAuxValue());
      }
    } else {
      this.release(slot);
    }
  }
  getContainerSize() {
    return this.numTotalSlots;
  }
  getItem(slot) {
    if (slot < 0 || slot >= this.numTotalSlots)
      return null;
    if (slot >= this.numLinkedSlots)
      return this.items[slot];
    return this.getLinked(slot);
  }
  getName() {
    return "Inventory";
  }
  getMaxStackSize() {
    return FillingContainer.MAX_INVENTORY_STACK_SIZE;
  }
  dropSlot(slot, onlyClearContainer, randomly = false) {
    if (slot >= 0 && slot < this.numLinkedSlots) {
      slot = this.linkedSlots[slot].inventorySlot;
    }
    if (slot < 0 || slot >= this.items.length)
      return;
    const item = this.items[slot];
    if (item && item.count) {
      if (!onlyClearContainer)
        this.doDrop(item.copy(), randomly);
      item.count = 0;
      this.release(slot);
      this.compressLinkedSlotList(slot);
    }
  }
  dropAll(onlyClearContainer) {
    for (let i = this.numLinkedSlots;i < this.items.length; i++) {
      this.dropSlot(i, onlyClearContainer, true);
    }
  }
  setContainerChanged() {}
  stillValid(player) {
    return !player.removed;
  }
  contains(itemInstance) {
    for (let i = 0;i < this.items.length; i++) {
      if (this.items[i] && ItemInstance.matches(this.items[i], itemInstance))
        return true;
    }
    return false;
  }
  startOpen() {}
  stopOpen() {}
  getSlot(tileId, data) {
    for (let i = this.numLinkedSlots;i < this.items.length; i++) {
      const item = this.items[i];
      if (item && item.id === tileId) {
        if (data === undefined)
          return i;
        if (item.getAuxValue() === data)
          return i;
      }
    }
    return -1;
  }
  getNonEmptySlot(tileId, data) {
    for (let i = this.numLinkedSlots;i < this.items.length; i++) {
      const item = this.items[i];
      if (item && item.id === tileId && item.count > 0) {
        if (data === undefined)
          return i;
        if (item.getAuxValue() === data)
          return i;
      }
    }
    return -1;
  }
  getNumEmptySlots() {
    let numEmpty = 0;
    for (let i = this.numLinkedSlots;i < this.items.length; i++) {
      if (!this.items[i] || this.items[i].isNull())
        numEmpty++;
    }
    return numEmpty;
  }
  getNumLinkedSlots() {
    return this.numLinkedSlots;
  }
  getSlotWithRemainingSpace(item) {
    for (let i = 0;i < this.items.length; i++) {
      const it = this.items[i];
      if (it && it.id === item.id && it.isStackable() && it.count < it.getMaxStackSize() && it.count < this.getMaxStackSize() && (!it.isStackedByData() || it.getAuxValue() === item.getAuxValue())) {
        return i;
      }
    }
    return -1;
  }
  addResource(itemInstance) {
    const type = itemInstance.id;
    let count = itemInstance.count;
    if (itemInstance.getMaxStackSize() === 1) {
      const slot2 = this.getFreeSlot();
      if (slot2 < 0)
        return count;
      if (this.items[slot2] === null) {
        this.items[slot2] = ItemInstance.clone(itemInstance);
        this.linkEmptySlot(slot2);
      } else if (this.items[slot2].isNull()) {
        this.items[slot2].id = itemInstance.id;
        this.items[slot2].count = itemInstance.count;
        this.items[slot2].setAuxValue(itemInstance.getAuxValue());
        this.linkEmptySlot(slot2);
      }
      return 0;
    }
    let slot = this.getSlotWithRemainingSpace(itemInstance);
    if (slot < 0)
      slot = this.getFreeSlot();
    if (slot < 0)
      return count;
    if (this.items[slot] === null) {
      this.items[slot] = new ItemInstance(type, 0, itemInstance.getAuxValue());
    } else if (this.items[slot].isNull()) {
      this.items[slot].id = type;
      this.items[slot].setAuxValue(itemInstance.getAuxValue());
    }
    this.linkEmptySlot(slot);
    let toAdd = count;
    if (toAdd > this.items[slot].getMaxStackSize() - this.items[slot].count) {
      toAdd = this.items[slot].getMaxStackSize() - this.items[slot].count;
    }
    if (toAdd > this.getMaxStackSize() - this.items[slot].count) {
      toAdd = this.getMaxStackSize() - this.items[slot].count;
    }
    if (toAdd === 0)
      return count;
    count -= toAdd;
    this.items[slot].count += toAdd;
    return count;
  }
  getFreeSlot() {
    for (let i = this.numLinkedSlots;i < this.items.length; i++) {
      if (this.items[i] === null || this.items[i].isNull())
        return i;
    }
    return -1;
  }
  release(slot) {
    if (this.items[slot]) {
      this.items[slot] = null;
    }
  }
  clearSlot(slot) {
    if (slot < 0)
      return;
    if (slot < this.numLinkedSlots) {
      this.release(this.linkedSlots[slot].inventorySlot);
      this.linkedSlots[slot].inventorySlot = -1;
    } else {
      this.release(slot);
    }
    this.compressLinkedSlotList(slot);
  }
  addItem(item) {
    for (let i = this.numLinkedSlots;i < this.items.length; i++) {
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
    console.warn("Error@addItem: adding an item to an already full inventory: " + item.getDescriptionId());
    return 0;
  }
  fixBackwardCompabilityItem(item) {
    if (item.id === 44) {
      item.setAuxValue(item.getAuxValue() & 7);
    }
  }
  replace(newItems, maxCount = -1) {
    this.clearInventory();
    maxCount = maxCount < 0 ? newItems.length : Math.min(newItems.length, maxCount);
    const base = this.numLinkedSlots;
    const iMax = Math.min(this.getContainerSize() - base, maxCount);
    for (let i = 0;i < iMax; i++) {
      this.replaceSlot(base + i, newItems[i].isNull() ? null : newItems[i]);
    }
  }
  replaceSlot(slotId, ins) {
    if (ins) {
      if (!this.items[slotId]) {
        this.items[slotId] = new ItemInstance;
      }
      this.items[slotId].id = ins.id;
      this.items[slotId].count = ins.count;
      this.items[slotId].setAuxValue(ins.getAuxValue());
    } else {
      this.release(slotId);
    }
  }
  getSlotList(slot) {
    return this.items;
  }
  linkSlot(selectionSlot, inventorySlot, propagate) {
    if (selectionSlot < 0 || selectionSlot >= this.numLinkedSlots)
      return false;
    if (inventorySlot < this.numLinkedSlots || inventorySlot >= this.numTotalSlots)
      return false;
    if (inventorySlot === this.linkedSlots[selectionSlot].inventorySlot)
      return false;
    if (propagate) {
      let i = 0;
      for (;i < this.numLinkedSlots - 1; i++) {
        if (this.linkedSlots[i].inventorySlot === inventorySlot)
          break;
      }
      for (;i > selectionSlot; i--) {
        this.linkedSlots[i].inventorySlot = this.linkedSlots[i - 1].inventorySlot;
      }
    }
    this.linkedSlots[selectionSlot].inventorySlot = inventorySlot;
    return true;
  }
  linkEmptySlot(inventorySlot) {
    for (let i = 0;i < this.numLinkedSlots; i++) {
      if (this.linkedSlots[i].inventorySlot === inventorySlot)
        return true;
    }
    for (let i = 0;i < this.numLinkedSlots; i++) {
      const item = this.getLinked(i);
      if (!item) {
        this.linkedSlots[i].inventorySlot = inventorySlot;
        return true;
      }
    }
    return false;
  }
  compressLinkedSlotList(slot) {
    let i = slot - 1, j = 0;
    while (++i < this.numLinkedSlots) {
      this.linkedSlots[i - j] = this.linkedSlots[i];
      const item = this.getLinked(i);
      if (!item)
        j++;
    }
    for (let k = i - j;k < i; k++) {
      this.linkedSlots[k].inventorySlot = -1;
    }
  }
  doDrop(item, randomly) {}
  getLinked(slot) {
    if (slot < this.numLinkedSlots && slot >= 0) {
      const i = this.linkedSlots[slot].inventorySlot;
      return i >= this.numLinkedSlots && i < this.numTotalSlots ? this.items[i] : null;
    }
    return null;
  }
}

// src/game/world/entity/translated/Entity.ts
var entityCounter = 0;
var TOTAL_AIR_SUPPLY3 = 15 * 20;

class Entity3 {
  x = 0;
  y = 0;
  z = 0;
  xChunk = 0;
  yChunk = 0;
  zChunk = 0;
  entityId = 0;
  viewScale = 1;
  level;
  xo = 0;
  yo = 0;
  zo = 0;
  xd = 0;
  yd = 0;
  zd = 0;
  yRot = 0;
  xRot = 0;
  yRotO = 0;
  xRotO = 0;
  bb;
  heightOffset = 0;
  bbWidth = 0.6;
  bbHeight = 1.8;
  walkDistO = 0;
  walkDist = 0;
  xOld = 0;
  yOld = 0;
  zOld = 0;
  ySlideOffset = 0;
  footSize = 0;
  pushthrough = 0;
  tickCount = 0;
  invulnerableTime = 0;
  airSupply = TOTAL_AIR_SUPPLY3;
  onFire = 0;
  flameTime = 1;
  entityRendererId = 0;
  fallDistance = 0;
  blocksBuilding = false;
  inChunk = false;
  onGround = false;
  horizontalCollision = false;
  verticalCollision = false;
  collision = false;
  hurtMarked = false;
  slide = true;
  removed = false;
  noPhysics = false;
  canRemove = true;
  invisible = false;
  reallyRemoveIfPlayer = false;
  airCapacity = TOTAL_AIR_SUPPLY3;
  makeStepSound = true;
  wasInWater = false;
  fireImmune = false;
  firstTick = true;
  nextStep = 1;
  isStuckInWeb = false;
  constructor(level) {
    this.level = level;
    this.viewScale = 1;
    this.blocksBuilding = false;
    this.onGround = false;
    this.wasInWater = false;
    this.collision = false;
    this.hurtMarked = false;
    this.slide = true;
    this.isStuckInWeb = false;
    this.removed = false;
    this.reallyRemoveIfPlayer = false;
    this.canRemove = true;
    this.noPhysics = false;
    this.firstTick = true;
    this.bbWidth = 0.6;
    this.bbHeight = 1.8;
    this.heightOffset = 0;
    this.ySlideOffset = 0;
    this.fallDistance = 0;
    this.footSize = 0;
    this.invulnerableTime = 0;
    this.pushthrough = 0;
    this.airCapacity = TOTAL_AIR_SUPPLY3;
    this.airSupply = TOTAL_AIR_SUPPLY3;
    this.xOld = 0;
    this.yOld = 0;
    this.zOld = 0;
    this.horizontalCollision = false;
    this.verticalCollision = false;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xo = 0;
    this.yo = 0;
    this.zo = 0;
    this.xd = 0;
    this.yd = 0;
    this.zd = 0;
    this.xRot = 0;
    this.yRot = 0;
    this.xRotO = 0;
    this.yRotO = 0;
    this.xChunk = 0;
    this.yChunk = 0;
    this.zChunk = 0;
    this.inChunk = false;
    this.fireImmune = false;
    this.onFire = 0;
    this.flameTime = 1;
    this.walkDist = 0;
    this.walkDistO = 0;
    this.tickCount = 0;
    this.entityRendererId = 0;
    this.nextStep = 1;
    this.makeStepSound = true;
    this.invisible = false;
    this._init();
    this.entityId = ++entityCounter;
    this.setPos(0, 0, 0);
  }
  _init() {
    this.xo = this.xOld = this.x;
    this.yo = this.yOld = this.y;
    this.zo = this.zOld = this.z;
    this.xRotO = this.xRot;
    this.yRotO = this.yRot;
    this.onFire = 0;
    this.removed = false;
    this.fallDistance = 0;
  }
  reset() {
    this._init();
  }
  hashCode() {
    return this.entityId;
  }
  equals(rhs) {
    return this.entityId === rhs.entityId;
  }
  setLevel(level) {
    this.level = level;
  }
  remove() {
    this.removed = true;
  }
  setPos(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    const w = this.bbWidth / 2;
    const h = this.bbHeight;
    if (this.bb) {
      this.bb.x0 = x - w;
      this.bb.y0 = y - this.heightOffset + this.ySlideOffset;
      this.bb.z0 = z - w;
      this.bb.x1 = x + w;
      this.bb.y1 = y - this.heightOffset + this.ySlideOffset + h;
      this.bb.z1 = z + w;
    }
  }
  move(xa, ya, za) {
    if (this.noPhysics) {
      if (this.bb) {
        this.bb.x0 += xa;
        this.bb.x1 += xa;
        this.bb.y0 += ya;
        this.bb.y1 += ya;
        this.bb.z0 += za;
        this.bb.z1 += za;
      }
      this.x = (this.bb.x0 + this.bb.x1) / 2;
      this.y = this.bb.y0 + this.heightOffset - this.ySlideOffset;
      this.z = (this.bb.z0 + this.bb.z1) / 2;
      return;
    }
    if (this.isStuckInWeb) {
      this.isStuckInWeb = false;
      xa *= 0.25;
      ya *= 0.05;
      za *= 0.25;
      this.xd = 0;
      this.yd = 0;
      this.zd = 0;
    }
    const xo = this.x;
    const zo = this.z;
    const xaOrg = xa;
    const yaOrg = ya;
    const zaOrg = za;
    if (this.level && this.level.getCubes) {
      const cubes = this.level.getCubes(this, this.bb);
      if (cubes.length > 0) {
        for (const cube of cubes) {
          if (cube.clipYCollide)
            ya = cube.clipYCollide(this.bb, ya);
        }
        if (this.bb) {
          this.bb.y0 += ya;
          this.bb.y1 += ya;
        }
        const og = this.onGround || yaOrg !== ya && yaOrg < 0;
        for (const cube of cubes) {
          if (cube.clipXCollide)
            xa = cube.clipXCollide(this.bb, xa);
        }
        if (this.bb) {
          this.bb.x0 += xa;
          this.bb.x1 += xa;
        }
        for (const cube of cubes) {
          if (cube.clipZCollide)
            za = cube.clipZCollide(this.bb, za);
        }
        if (this.bb) {
          this.bb.z0 += za;
          this.bb.z1 += za;
        }
        this.onGround = yaOrg !== ya && yaOrg < 0;
      }
    }
    if (!this.slide && yaOrg !== ya) {
      xa = ya = za = 0;
    }
    if (!this.slide && xaOrg !== xa) {
      xa = ya = za = 0;
    }
    if (!this.slide && zaOrg !== za) {
      xa = ya = za = 0;
    }
    this.x = (this.bb.x0 + this.bb.x1) / 2;
    this.y = this.bb.y0 + this.heightOffset - this.ySlideOffset;
    this.z = (this.bb.z0 + this.bb.z1) / 2;
    this.horizontalCollision = xaOrg !== xa || zaOrg !== za;
    this.verticalCollision = yaOrg !== ya;
    this.onGround = yaOrg !== ya && yaOrg < 0;
    this.collision = this.horizontalCollision || this.verticalCollision;
    this.checkFallDamage(ya, this.onGround);
    if (xaOrg !== xa)
      this.xd = 0;
    if (yaOrg !== ya)
      this.yd = 0;
    if (zaOrg !== za)
      this.zd = 0;
    const xm = this.x - xo;
    const zm = this.z - zo;
    if (this.makeStepSound) {
      this.walkDist += Math.sqrt(xm * xm + zm * zm) * 0.6;
    }
    this.ySlideOffset *= 0.4;
  }
  makeStuckInWeb() {
    this.isStuckInWeb = true;
    this.fallDistance = 0;
  }
  isUnderLiquid(material) {
    const yp = this.y + this.getHeadHeight();
    const xt = Math.floor(this.x);
    const yt = Math.floor(yp);
    const zt = Math.floor(this.z);
    const t = this.level.getTile(xt, yt, zt);
    if (t !== 0 && this.level.tiles && this.level.tiles[t]) {
      return this.level.tiles[t].material === material;
    }
    return false;
  }
  setPosFromEntityPos(pos) {
    if (pos.move)
      this.setPos(pos.x, pos.y, pos.z);
    else
      this.setPos(this.x, this.y, this.z);
    if (pos.rot)
      this.setRot(pos.yRot, pos.xRot);
    else
      this.setRot(this.yRot, this.xRot);
  }
  getBrightness(a) {
    const xTile = Math.floor(this.x);
    const hh = (this.bb.y1 - this.bb.y0) * 0.66;
    const yTile = Math.floor(this.y - this.heightOffset + hh);
    const zTile = Math.floor(this.z);
    if (this.level && this.level.getBrightness) {
      return this.level.getBrightness(xTile, yTile, zTile);
    }
    return 0;
  }
  setSize(w, h) {
    this.bbWidth = w;
    this.bbHeight = h;
  }
  setRot(yRot, xRot) {
    this.yRot = this.yRotO = yRot;
    this.xRot = this.xRotO = xRot;
  }
  turn(xo, yo) {
    const xRotOld = this.xRot;
    const yRotOld = this.yRot;
    this.yRot += xo * 0.15;
    this.xRot -= yo * 0.15;
    if (this.xRot < -90)
      this.xRot = -90;
    if (this.xRot > 90)
      this.xRot = 90;
    this.xRotO += this.xRot - xRotOld;
    this.yRotO += this.yRot - yRotOld;
  }
  interpolateTurn(xo, yo) {
    this.yRot += xo * 0.15;
    this.xRot -= yo * 0.15;
    if (this.xRot < -90)
      this.xRot = -90;
    if (this.xRot > 90)
      this.xRot = 90;
  }
  tick() {
    this.baseTick();
  }
  baseTick() {
    this.tickCount++;
    this.walkDistO = this.walkDist;
    this.xo = this.x;
    this.yo = this.y;
    this.zo = this.z;
    this.xRotO = this.xRot;
    this.yRotO = this.yRot;
    if (this.isInWater()) {
      if (!this.wasInWater && !this.firstTick) {}
      this.fallDistance = 0;
      this.wasInWater = true;
      this.onFire = 0;
    } else {
      this.wasInWater = false;
    }
    if (this.onFire > 0) {
      if (this.fireImmune) {
        this.onFire -= 4;
        if (this.onFire < 0)
          this.onFire = 0;
      } else {
        if (this.onFire % 20 === 0) {
          this.hurt(null, 1);
        }
        this.onFire--;
      }
    }
    if (this.isInLava()) {
      this.lavaHurt();
    }
    if (this.y < -64) {
      this.outOfWorld();
    }
    this.firstTick = false;
  }
  outOfWorld() {
    this.remove();
  }
  checkFallDamage(ya, onGround) {
    if (onGround) {
      if (this.fallDistance > 0) {
        this.causeFallDamage(this.fallDistance);
        this.fallDistance = 0;
      }
    } else {
      if (ya < 0)
        this.fallDistance -= ya;
    }
  }
  causeFallDamage(fallDamage2) {}
  getHeadHeight() {
    return 0;
  }
  moveRelative(xa, za, speed) {
    let dist = Math.sqrt(xa * xa + za * za);
    if (dist < 0.01)
      return;
    if (dist < 1)
      dist = 1;
    dist = speed / dist;
    xa *= dist;
    za *= dist;
    const sin_ = Math.sin(this.yRot * Math.PI / 180);
    const cos_ = Math.cos(this.yRot * Math.PI / 180);
    this.xd += xa * cos_ - za * sin_;
    this.zd += za * cos_ + xa * sin_;
  }
  moveTo(x, y, z, yRot, xRot) {
    this.xOld = this.xo = this.x = x;
    this.yOld = this.yo = this.y = y + this.heightOffset;
    this.zOld = this.zo = this.z = z;
    this.yRot = this.yRotO = yRot;
    this.xRot = this.xRotO = xRot;
    this.setPos(this.x, this.y, this.z);
  }
  distanceToEntity(e) {
    const xd = this.x - e.x;
    const yd = this.y - e.y;
    const zd = this.z - e.z;
    return Math.sqrt(xd * xd + yd * yd + zd * zd);
  }
  distanceTo(x2, y2, z2) {
    const xd = this.x - x2;
    const yd = this.y - y2;
    const zd = this.z - z2;
    return Math.sqrt(xd * xd + yd * yd + zd * zd);
  }
  distanceToSqr(x2, y2, z2) {
    const xd = this.x - x2;
    const yd = this.y - y2;
    const zd = this.z - z2;
    return xd * xd + yd * yd + zd * zd;
  }
  distanceToSqrEntity(e) {
    const xd = this.x - e.x;
    const yd = this.y - e.y;
    const zd = this.z - e.z;
    return xd * xd + yd * yd + zd * zd;
  }
  playerTouch(player) {}
  pushEntity(e) {
    let xa = e.x - this.x;
    let za = e.z - this.z;
    let dd = Math.abs(xa) > Math.abs(za) ? Math.abs(xa) : Math.abs(za);
    if (dd >= 0.01) {
      dd = Math.sqrt(dd);
      xa /= dd;
      za /= dd;
      let pow = 1 / dd;
      if (pow > 1)
        pow = 1;
      xa *= pow;
      za *= pow;
      xa *= 0.05;
      za *= 0.05;
      xa *= 1 - this.pushthrough;
      za *= 1 - this.pushthrough;
      this.push(-xa, 0, -za);
      e.push(xa, 0, za);
    }
  }
  push(xa, ya, za) {
    this.xd += xa;
    this.yd += ya;
    this.zd += za;
  }
  markHurt() {
    this.hurtMarked = true;
  }
  hurt(source, damage) {
    this.markHurt();
    return false;
  }
  intersects(x0, y0, z0, x1, y1, z1) {
    if (!this.bb)
      return false;
    return this.bb.x0 < x1 && this.bb.x1 > x0 && this.bb.y0 < y1 && this.bb.y1 > y0 && this.bb.z0 < z1 && this.bb.z1 > z0;
  }
  isPickable() {
    return false;
  }
  isPushable() {
    return false;
  }
  isShootable() {
    return false;
  }
  awardKillScore(victim, score) {}
  shouldRender(c) {
    if (this.invisible)
      return false;
    const xd = this.x - c.x;
    const yd = this.y - c.y;
    const zd = this.z - c.z;
    const distance = xd * xd + yd * yd + zd * zd;
    return this.shouldRenderAtSqrDistance(distance);
  }
  shouldRenderAtSqrDistance(distance) {
    let size = this.bb ? (this.bb.x1 - this.bb.x0 + this.bb.y1 - this.bb.y0 + this.bb.z1 - this.bb.z0) / 3 : 0.6;
    size *= 64 * this.viewScale;
    return distance < size * size;
  }
  isCreativeModeAllowed() {
    return false;
  }
  getShadowHeightOffs() {
    return this.bbHeight / 2;
  }
  isAlive() {
    return !this.removed;
  }
  interact(player) {
    return false;
  }
  lerpTo(x, y, z, yRot, xRot, steps) {
    this.setPos(x, y, z);
    this.setRot(yRot, xRot);
  }
  getPickRadius() {
    return 0.1;
  }
  lerpMotion(xd, yd, zd) {
    this.xd = xd;
    this.yd = yd;
    this.zd = zd;
  }
  animateHurt() {}
  setEquippedSlot(slot, item, auxValue) {}
  isSneaking() {
    return false;
  }
  isPlayer() {
    return false;
  }
  lavaHurt() {
    if (!this.fireImmune) {
      this.hurt(null, 4);
      this.onFire = 30 * 20;
    }
  }
  burn(dmg) {
    if (!this.fireImmune) {
      this.hurt(null, dmg);
    }
  }
  save(entityTag) {
    const id2 = this.getEntityTypeId();
    if (this.removed || id2 === 0)
      return false;
    entityTag.putInt("id", id2);
    this.saveWithoutId(entityTag);
    return true;
  }
  saveWithoutId(entityTag) {
    entityTag.putFloat("FallDistance", this.fallDistance);
    entityTag.putShort("Fire", this.onFire);
    entityTag.putShort("Air", this.airSupply);
    entityTag.putBoolean("OnGround", this.onGround);
    this.addAdditionalSaveData(entityTag);
  }
  load(tag) {
    this.fallDistance = tag.getFloat("FallDistance");
    this.onFire = tag.getShort("Fire");
    this.airSupply = tag.getShort("Air");
    this.onGround = tag.getBoolean("OnGround");
    this.setPos(this.x, this.y, this.z);
    return true;
  }
  spawnAtLocation(resource, count) {
    return this.spawnAtLocationWithOffset(resource, count, 0);
  }
  spawnAtLocationWithOffset(resource, count, yOffs) {
    return this.spawnAtLocationItem({ id: resource, count, auxValue: 0 }, yOffs);
  }
  spawnAtLocationItem(itemInstance, yOffs) {
    if (this.level && this.level.spawnItemEntity) {
      this.level.spawnItemEntity(this.x, this.y + yOffs, this.z, itemInstance.id, itemInstance.count, itemInstance.auxValue);
    }
    return null;
  }
  isOnFire() {
    return this.onFire > 0;
  }
  interactPreventDefault() {
    return false;
  }
  isItemEntity() {
    return false;
  }
  isHangingEntity() {
    return false;
  }
  getAuxData() {
    return 0;
  }
  playStepSound(xt, yt, zt, t) {
    if (this.level && this.level.playSound) {
      this.level.playSound(this, "step.stone", 0.25, 1);
    }
  }
  isInWall() {
    if (!this.level)
      return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.y + this.getHeadHeight());
    const zt = Math.floor(this.z);
    return this.level.isSolidBlockingTile ? this.level.isSolidBlockingTile(xt, yt, zt) : false;
  }
  isInWater() {
    if (!this.level || !this.level.containsMaterial)
      return false;
    return this.level.containsMaterial(this.bb, "water");
  }
  isInLava() {
    if (!this.level || !this.level.containsMaterial)
      return false;
    return this.level.containsMaterial(this.bb, "lava");
  }
  isFree(xa, ya, za, grow) {
    if (!this.level || !this.level.getCubes)
      return true;
    return true;
  }
  isMob() {
    return false;
  }
}

// src/game/world/phys/translated/Vec3.ts
class Vec3 {
  x;
  y;
  z;
  constructor(x, y, z) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else {
      if (x === -0)
        x = 0;
      if (y === -0)
        y = 0;
      if (z === -0)
        z = 0;
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  add(rhs) {
    return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
  }
  sub(rhs) {
    return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
  }
  multiply(k) {
    return new Vec3(this.x * k, this.y * k, this.z * k);
  }
  normalized() {
    const dist = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (dist < 0.0001)
      return new Vec3;
    return new Vec3(this.x / dist, this.y / dist, this.z / dist);
  }
  dot(p) {
    return this.x * p.x + this.y * p.y + this.z * p.z;
  }
  cross(p) {
    return new Vec3(this.y * p.z - this.z * p.y, this.z * p.x - this.x * p.z, this.x * p.y - this.y * p.x);
  }
  addXYZ(x, y, z) {
    return new Vec3(this.x + x, this.y + y, this.z + z);
  }
  subXYZ(x, y, z) {
    return new Vec3(this.x - x, this.y - y, this.z - z);
  }
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }
  negated() {
    return new Vec3(-this.x, -this.y, -this.z);
  }
  distanceTo(p) {
    const xd = p.x - this.x, yd = p.y - this.y, zd = p.z - this.z;
    return Math.sqrt(xd * xd + yd * yd + zd * zd);
  }
  distanceToSqr(p) {
    const xd = p.x - this.x, yd = p.y - this.y, zd = p.z - this.z;
    return xd * xd + yd * yd + zd * zd;
  }
  distanceToSqrXYZ(x2, y2, z2) {
    const xd = x2 - this.x, yd = y2 - this.y, zd = z2 - this.z;
    return xd * xd + yd * yd + zd * zd;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  clipX(b, xt, result) {
    const xd = b.x - this.x, yd = b.y - this.y, zd = b.z - this.z;
    if (xd * xd < 0.0000001)
      return false;
    const d = (xt - this.x) / xd;
    if (d < 0 || d > 1)
      return false;
    result.set(this.x + xd * d, this.y + yd * d, this.z + zd * d);
    return true;
  }
  clipY(b, yt, result) {
    const xd = b.x - this.x, yd = b.y - this.y, zd = b.z - this.z;
    if (yd * yd < 0.0000001)
      return false;
    const d = (yt - this.y) / yd;
    if (d < 0 || d > 1)
      return false;
    result.set(this.x + xd * d, this.y + yd * d, this.z + zd * d);
    return true;
  }
  clipZ(b, zt, result) {
    const xd = b.x - this.x, yd = b.y - this.y, zd = b.z - this.z;
    if (zd * zd < 0.0000001)
      return false;
    const d = (zt - this.z) / zd;
    if (d < 0 || d > 1)
      return false;
    result.set(this.x + xd * d, this.y + yd * d, this.z + zd * d);
    return true;
  }
  toString() {
    return "Vec3(" + this.x + "," + this.y + "," + this.z + ")";
  }
  lerp(v, a) {
    return new Vec3(this.x + (v.x - this.x) * a, this.y + (v.y - this.y) * a, this.z + (v.z - this.z) * a);
  }
  xRot(degs) {
    const cosv = Math.cos(degs), sinv = Math.sin(degs);
    const xx = this.x;
    const yy = this.y * cosv + this.z * sinv;
    const zz = this.z * cosv - this.y * sinv;
    this.x = xx;
    this.y = yy;
    this.z = zz;
  }
  yRot(degs) {
    const cosv = Math.cos(degs), sinv = Math.sin(degs);
    const xx = this.x * cosv + this.z * sinv;
    const yy = this.y;
    const zz = this.z * cosv - this.x * sinv;
    this.x = xx;
    this.y = yy;
    this.z = zz;
  }
  zRot(degs) {
    const cosv = Math.cos(degs), sinv = Math.sin(degs);
    const xx = this.x * cosv + this.y * sinv;
    const yy = this.y * cosv - this.x * sinv;
    const zz = this.z;
    this.x = xx;
    this.y = yy;
    this.z = zz;
  }
  static fromPolarXY(angle, radius) {
    return new Vec3(radius * Math.cos(angle), radius * Math.sin(angle), 0);
  }
}

// src/game/world/phys/translated/HitResult.ts
class HitResult {
  type;
  x;
  y;
  z;
  f;
  pos;
  entity;
  indirectHit;
  constructor(...args) {
    if (args.length === 0) {
      this.type = 2 /* NO_HIT */;
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.f = 0;
      this.pos = new Vec3;
      this.entity = null;
      this.indirectHit = false;
    } else if (args.length === 5) {
      this.type = 0 /* TILE */;
      this.x = args[0];
      this.y = args[1];
      this.z = args[2];
      this.f = args[3];
      this.pos = args[4];
      this.entity = null;
      this.indirectHit = false;
    } else {
      this.type = 1 /* ENTITY */;
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.f = 0;
      this.pos = new Vec3;
      this.entity = args[0];
      this.indirectHit = false;
    }
  }
  distanceTo(entity) {
    if (this.entity && this.entity.x !== undefined) {
      const xd = this.pos.x - entity.x;
      const yd = this.pos.y - entity.y;
      const zd = this.pos.z - entity.z;
      return Math.sqrt(xd * xd + yd * yd + zd * zd);
    }
    return 0;
  }
  isHit() {
    return this.type !== 2 /* NO_HIT */;
  }
}

// src/game/util/translated/Random.ts
class Random {
  constructor() {
    this.setSeed(Date.now() & 2147483647);
  }
  constructor_seed;
  _seed;
  static N = 624;
  static M = 397;
  static MATRIX_A = 2567483615;
  static UPPER_MASK = 2147483648;
  static LOWER_MASK = 2147483647;
  _mt = new Array(Random.N);
  _mti = Random.N + 1;
  haveNextNextGaussian = false;
  nextNextGaussian = 0;
  setSeed(seed) {
    this._seed = seed;
    this._mti = Random.N + 1;
    this.haveNextNextGaussian = false;
    this.nextNextGaussian = 0;
    this.init_genrand(seed);
  }
  getSeed() {
    return this._seed;
  }
  nextBoolean() {
    return (this.genrand_int32() & 134217728) > 0;
  }
  nextFloat() {
    return this.genrand_real2();
  }
  nextDouble() {
    return this.genrand_real2();
  }
  nextInt() {
    return this.genrand_int32() >> 1 | 0;
  }
  nextInt(n) {
    return this.genrand_int32() % n;
  }
  nextLong() {
    return this.genrand_int32() >> 1 | 0;
  }
  nextLong(n) {
    return this.genrand_int32() % n;
  }
  nextGaussian() {
    if (this.haveNextNextGaussian) {
      this.haveNextNextGaussian = false;
      return this.nextNextGaussian;
    } else {
      let v1, v2, s;
      do {
        v1 = 2 * this.nextFloat() - 1;
        v2 = 2 * this.nextFloat() - 1;
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      const multiplier = Math.sqrt(-2 * Math.log(s) / s);
      this.nextNextGaussian = v2 * multiplier;
      this.haveNextNextGaussian = true;
      return v1 * multiplier;
    }
  }
  init_genrand(s) {
    this._mt[0] = s >>> 0;
    for (this._mti = 1;this._mti < Random.N; this._mti++) {
      this._mt[this._mti] = 1812433253 * (this._mt[this._mti - 1] ^ this._mt[this._mti - 1] >> 30) + this._mti >>> 0;
      this._mt[this._mti] &= 4294967295;
    }
  }
  genrand_int32() {
    let y;
    const mag01 = [0, Random.MATRIX_A];
    if (this._mti >= Random.N) {
      let kk;
      if (this._mti === Random.N + 1) {
        this.init_genrand(5489);
      }
      for (kk = 0;kk < Random.N - Random.M; kk++) {
        y = (this._mt[kk] & Random.UPPER_MASK | this._mt[kk + 1] & Random.LOWER_MASK) >>> 0;
        this._mt[kk] = (this._mt[kk + Random.M] ^ y >> 1 ^ mag01[y & 1]) >>> 0;
      }
      for (;kk < Random.N - 1; kk++) {
        y = (this._mt[kk] & Random.UPPER_MASK | this._mt[kk + 1] & Random.LOWER_MASK) >>> 0;
        this._mt[kk] = (this._mt[kk + (Random.M - Random.N)] ^ y >> 1 ^ mag01[y & 1]) >>> 0;
      }
      y = (this._mt[Random.N - 1] & Random.UPPER_MASK | this._mt[0] & Random.LOWER_MASK) >>> 0;
      this._mt[Random.N - 1] = (this._mt[Random.M - 1] ^ y >> 1 ^ mag01[y & 1]) >>> 0;
      this._mti = 0;
    }
    y = this._mt[this._mti++];
    y ^= y >> 11;
    y ^= y << 7 & 2636928640;
    y ^= y << 15 & 4022730752;
    y ^= y >> 18;
    return y >>> 0;
  }
  genrand_real2() {
    return this.genrand_int32() * (1 / 4294967296);
  }
  rrDiff_x() {
    const u = this.genrand_int32();
    const xx0 = (u & 65535) / 65536;
    const xx1 = (u >> 16 & 65535) / 65536;
    return xx0 - xx1;
  }
  rrDiff_xy() {
    const u = this.genrand_int32();
    const xx0 = (u & 255) / 256;
    const xx1 = (u >> 8 & 255) / 256;
    const yy0 = (u >> 16 & 255) / 256;
    const yy1 = (u >> 24 & 255) / 256;
    return [xx0 - xx1, yy0 - yy1];
  }
  rrDiff_xyz() {
    const u = this.genrand_int32();
    const xx0 = (u & 31) / 32;
    const xx1 = (u >> 5 & 31) / 32;
    const yy0 = (u >> 10 & 31) / 32;
    const yy1 = (u >> 15 & 31) / 32;
    const zz0 = (u >> 20 & 31) / 32;
    const zz1 = (u >> 25 & 31) / 32;
    return [xx0 - xx1, yy0 - yy1, zz0 - zz1];
  }
}

// src/game/world/entity/translated/Mob.ts
var SWING_DURATION = 8;

class Mob3 extends Entity3 {
  invulnerableDuration = 20;
  timeOffs = 0;
  rotA = 0;
  yBodyRot = 0;
  yBodyRotO = 0;
  oAttackAnim = 0;
  attackAnim = 0;
  health = 10;
  lastHealth = 20;
  hurtTime = 0;
  hurtDuration = 0;
  hurtDir = 0;
  deathTime = 0;
  attackTime = 0;
  oTilt = 0;
  tilt = 0;
  lookTime = 0;
  fallTime = 0;
  walkAnimSpeedO = 0;
  walkAnimSpeed = 0;
  walkAnimPos = 0;
  aimDirection = new Vec3;
  arrowCount = 0;
  removeArrowTime = 0;
  random = new Random;
  sensing = null;
  bypassArmor = false;
  entityData;
  swinging = false;
  swingTime = 0;
  noActionTime = 0;
  xxa = 0;
  yya = 0;
  yRotA = 0;
  defaultLookAngle = 0;
  runSpeed = 0.7;
  walkingSpeed = 0.1;
  flyingSpeed = 0.02;
  textureName = "mob/char.png";
  modelName = "";
  deathScore = 0;
  oRun = 0;
  run = 0;
  animStep = 0;
  animStepO = 0;
  rotOffs = 0;
  bobStrength = 1;
  renderOffset = 0;
  lSteps = 0;
  lx = 0;
  ly = 0;
  lz = 0;
  lyr = 0;
  lxr = 0;
  lastHurt = 0;
  dmgSpill = 0;
  sentX = 0;
  sentY = 0;
  sentZ = 0;
  sentRotX = 0;
  sentRotY = 0;
  sentXd = 0;
  sentYd = 0;
  sentZd = 0;
  allowAlpha = true;
  jumping = false;
  autoSendPosRot = true;
  moveControl = null;
  jumpControl = null;
  navigation = null;
  goalSelector = null;
  targetSelector = null;
  lookingAtId = 0;
  ambientSoundTime = 0;
  speed = 0;
  constructor(level) {
    super(level);
    this.invulnerableDuration = 20;
    this.textureName = "mob/char.png";
    this.allowAlpha = true;
    this.modelName = "";
    this.bobStrength = 1;
    this.deathScore = 0;
    this.renderOffset = 0;
    this.lookingAtId = 0;
    this.jumping = false;
    this.defaultLookAngle = 0;
    this.runSpeed = 0.7;
    this.walkingSpeed = 0.1;
    this.flyingSpeed = 0.02;
    this.run = 0;
    this.oRun = 0;
    this.animStep = 0;
    this.animStepO = 0;
    this.lx = 0;
    this.ly = 0;
    this.lz = 0;
    this.lxr = 0;
    this.lyr = 0;
    this.lSteps = 0;
    this.walkAnimSpeed = 0;
    this.walkAnimSpeedO = 0;
    this.walkAnimPos = 0;
    this.attackAnim = 0;
    this.oAttackAnim = 0;
    this.autoSendPosRot = true;
    this.sentX = 0;
    this.sentY = 0;
    this.sentZ = 0;
    this.sentRotX = 0;
    this.sentRotY = 0;
    this.sentXd = 0;
    this.sentYd = 0;
    this.sentZd = 0;
    this.arrowCount = 0;
    this.removeArrowTime = 0;
    this.speed = 0;
    this.moveControl = null;
    this.jumpControl = null;
    this.navigation = null;
    this.goalSelector = null;
    this.targetSelector = null;
    this.sensing = null;
    this.swinging = false;
    this.swingTime = 0;
    this.lastHurt = 0;
    this.dmgSpill = 0;
    this.bypassArmor = false;
    this._init();
    this.health = this.getMaxHealth();
    this.blocksBuilding = true;
    this.ambientSoundTime = -level.random.nextInt(100);
    this.rotA = (Math.random() + 1) * 0.01;
    this.setPos(this.x, this.y, this.z);
    this.timeOffs = Math.random() * 12398;
    this.yRot = Math.random() * Math.PI * 2;
    this.footSize = 0.5;
  }
  destroy() {}
  getWalkingSpeedModifier() {
    let speed = 0.7;
    return speed;
  }
  canSee(target) {
    if (!this.level || !this.level.clip)
      return false;
    const from = new Vec3(this.x, this.y + this.getHeadHeight(), this.z);
    const to = new Vec3(target.x, target.y + target.getHeadHeight(), target.z);
    const hit = this.level.clip(from, to);
    return !hit || !hit.isHit();
  }
  getTexture() {
    return this.textureName;
  }
  isPickable() {
    return !this.removed;
  }
  isPushable() {
    return !this.removed;
  }
  getHeadHeight() {
    return this.bbHeight * 0.85;
  }
  getVoicePitch() {
    if (this.isBaby()) {
      return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1.5;
    }
    return (this.random.nextFloat() - this.random.nextFloat()) * 0.2 + 1;
  }
  getAmbientSoundInterval() {
    return 8 * 20;
  }
  playAmbientSound() {
    const ambient = this.getAmbientSound();
    if (ambient !== null) {
      this.level.playSound(this, ambient, this.getSoundVolume(), this.getVoicePitch());
    }
  }
  baseTick() {
    this.oAttackAnim = this.attackAnim;
    super.baseTick();
    if ((this.ambientSoundTime++ & 15) === 0 && this.random.nextInt(2000) < this.ambientSoundTime) {
      this.ambientSoundTime = -this.getAmbientSoundInterval();
      this.playAmbientSound();
    }
    if (this.isAlive() && this.isInWall()) {
      this.hurt(null, 1);
    }
    if (this.isAlive() && this.isUnderLiquid("water") && !this.isWaterMob()) {
      this.airSupply--;
      if (this.airSupply === -20) {
        this.airSupply = 0;
        this.hurt(null, 2);
      }
    } else {
      this.airSupply = this.airCapacity;
    }
    this.oTilt = this.tilt;
    if (this.attackTime > 0)
      this.attackTime--;
    if (this.hurtTime > 0)
      this.hurtTime--;
    if (this.invulnerableTime > 0)
      this.invulnerableTime--;
    if (this.health <= 0) {
      this.deathTime++;
      if (this.deathTime > 20) {
        this.beforeRemove();
        this.remove();
      }
    }
    this.animStepO = this.animStep;
    this.yBodyRotO = this.yBodyRot;
    this.yRotO = this.yRot;
    this.xRotO = this.xRot;
  }
  spawnAnim() {}
  lerpTo(x, y, z, yRot, xRot, steps) {
    this.lx = x;
    this.ly = y + this.heightOffset;
    this.lz = z;
    this.lyr = yRot;
    this.lxr = xRot;
    this.lSteps = steps;
  }
  superTick() {
    super.tick();
  }
  tick() {
    super.tick();
    if (this.arrowCount > 0) {
      if (this.removeArrowTime <= 0) {
        this.removeArrowTime = 20 * 3;
      }
      this.removeArrowTime--;
      if (this.removeArrowTime <= 0) {
        this.arrowCount--;
      }
    }
    if (this.lSteps > 0) {
      const xt = this.x + (this.lx - this.x) / this.lSteps;
      const yt = this.y + (this.ly - this.y) / this.lSteps;
      const zt = this.z + (this.lz - this.z) / this.lSteps;
      let yrd = this.lyr - this.yRot;
      while (yrd < -180)
        yrd += 360;
      while (yrd >= 180)
        yrd -= 360;
      this.yRot += yrd / this.lSteps;
      this.xRot += (this.lxr - this.xRot) / this.lSteps;
      this.lSteps--;
      this.setPos(xt, yt, zt);
      this.setRot(this.yRot, this.xRot);
    }
    this.aiStep();
    this.updateWalkAnim();
    const xd = this.x - this.xo;
    const zd = this.z - this.zo;
    const sideDist = Math.sqrt(xd * xd + zd * zd);
    let yBodyRotT = this.yBodyRot;
    let walkSpeed = 0;
    this.oRun = this.run;
    let tRun = 0;
    if (sideDist <= 0.05) {} else {
      tRun = 1;
      walkSpeed = sideDist * 3;
      yBodyRotT = Math.atan2(zd, xd) * (180 / Math.PI) - 90;
    }
    if (this.attackAnim > 0) {
      yBodyRotT = this.yRot;
    }
    if (!this.onGround) {
      tRun = 0;
    }
    this.run = this.run + (tRun - this.run) * 0.3;
    let yBodyRotD = yBodyRotT - this.yBodyRot;
    while (yBodyRotD < -180)
      yBodyRotD += 360;
    while (yBodyRotD >= 180)
      yBodyRotD -= 360;
    this.yBodyRot += yBodyRotD * 0.3;
    let headDiff = this.yRot - this.yBodyRot;
    while (headDiff < -180)
      headDiff += 360;
    while (headDiff >= 180)
      headDiff -= 360;
    const behind = headDiff < -90 || headDiff >= 90;
    if (headDiff < -75)
      headDiff = -75;
    if (headDiff >= 75)
      headDiff = 75;
    this.yBodyRot = this.yRot - headDiff;
    if (headDiff * headDiff > 2500) {
      this.yBodyRot += headDiff * 0.2;
    }
    if (behind) {
      walkSpeed *= -1;
    }
    while (this.yRot - this.yRotO < -180)
      this.yRotO -= 360;
    while (this.yRot - this.yRotO >= 180)
      this.yRotO += 360;
    while (this.yBodyRot - this.yBodyRotO < -180)
      this.yBodyRotO -= 360;
    while (this.yBodyRot - this.yBodyRotO >= 180)
      this.yBodyRotO += 360;
    while (this.xRot - this.xRotO < -180)
      this.xRotO -= 360;
    while (this.xRot - this.xRotO >= 180)
      this.xRotO += 360;
    this.animStep += walkSpeed;
  }
  setSize(w, h) {
    super.setSize(w, h);
  }
  heal(healAmount) {
    if (this.health <= 0)
      return;
    this.health += healAmount;
    if (this.health > 20)
      this.health = 20;
    this.invulnerableTime = this.invulnerableDuration / 2;
  }
  hurt(source, dmg) {
    if (this.level && this.level.isClientSide)
      return false;
    this.noActionTime = 0;
    if (this.health <= 0)
      return false;
    this.walkAnimSpeed = 1.5;
    let sound = true;
    if (this.invulnerableTime > this.invulnerableDuration / 2) {
      if (dmg <= this.lastHurt)
        return false;
      this.actuallyHurt(dmg - this.lastHurt);
      this.lastHurt = dmg;
      sound = false;
    } else {
      this.lastHurt = dmg;
      this.lastHealth = this.health;
      this.invulnerableTime = this.invulnerableDuration;
      this.actuallyHurt(dmg);
      this.hurtTime = this.hurtDuration = 10;
      this.hurtDuration = 10;
    }
    this.hurtDir = 0;
    if (sound) {
      this.markHurt();
      if (source !== null) {
        let xd = source.x - this.x;
        let zd = source.z - this.z;
        while (xd * xd + zd * zd < 0.0001) {
          xd = (Math.random() - Math.random()) * 0.01;
          zd = (Math.random() - Math.random()) * 0.01;
        }
        this.hurtDir = Math.atan2(zd, xd) * (180 / Math.PI) - this.yRot;
        this.knockback(source, dmg, xd, zd);
      } else {
        this.hurtDir = Math.floor(Math.random() * 2) * 180;
      }
    }
    if (this.health <= 0) {
      if (sound)
        this.level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      this.die(source);
    } else {
      if (sound)
        this.level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
    }
    return true;
  }
  actuallyHurt(dmg) {
    if (!this.bypassArmor) {
      dmg = this.getDamageAfterArmorAbsorb(dmg);
    }
    this.health = Math.max(0, this.health - dmg);
  }
  getSoundVolume() {
    return 1;
  }
  getAmbientSound() {
    return null;
  }
  getHurtSound() {
    return "random.hurt";
  }
  getDeathSound() {
    return "random.hurt";
  }
  knockback(source, dmg, xd, zd) {
    const dd = 1 / Math.sqrt(xd * xd + zd * zd);
    const pow = 0.4;
    this.xd *= 0.5;
    this.yd *= 0.5;
    this.zd *= 0.5;
    this.xd -= xd * dd * pow;
    this.yd += 0.4;
    this.zd -= zd * dd * pow;
    if (this.yd > 0.4)
      this.yd = 0.4;
  }
  die(source) {
    if (this.deathScore > 0 && source !== null) {
      if (source.awardKillScore)
        source.awardKillScore(this, this.deathScore);
    }
    if (!this.level.isClientSide) {
      if (!this.isBaby()) {
        this.dropDeathLoot();
      }
    }
  }
  dropDeathLoot() {
    const loot = this.getDeathLoot();
    if (loot > 0) {
      const count = this.random.nextInt(3);
      for (let i = 0;i < count; i++) {
        this.spawnAtLocation(loot, 1);
      }
    }
  }
  getDeathLoot() {
    return 0;
  }
  reset() {
    super.reset();
    this._init();
  }
  _init() {
    this.yBodyRot = 0;
    this.yBodyRotO = 0;
    this.rotOffs = 0;
    this.fallTime = 0;
    this.lastHurt = 0;
    this.deathTime = 0;
    this.attackTime = 0;
    this.tilt = 0;
    this.oTilt = 0;
    this.hurtDuration = 0;
    this.hurtTime = 0;
    this.hurtDir = 0;
    this.lookTime = 0;
    this.noActionTime = 0;
    this.xxa = 0;
    this.yya = 0;
    this.yRotA = 0;
    this.health = 10;
    this.lastHealth = 20;
  }
  causeFallDamage(distance) {
    const dmg = Math.ceil(distance - 3);
    if (dmg > 0) {
      this.hurt(null, dmg);
    }
  }
  travel(xa, ya) {
    if (this.isInWater()) {
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.8;
      this.yd *= 0.8;
      this.zd *= 0.8;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd, 0)) {
        this.yd = 0.3;
      }
    } else if (this.isInLava()) {
      const yo = this.y;
      this.moveRelative(xa, ya, 0.02);
      this.move(this.xd, this.yd, this.zd);
      this.xd *= 0.5;
      this.yd *= 0.5;
      this.zd *= 0.5;
      this.yd -= 0.02;
      if (this.horizontalCollision && this.isFree(this.xd, this.yd + 0.6 - this.y + yo, this.zd, 0)) {
        this.yd = 0.3;
      }
    } else {
      let friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        const t = this.level.getTile(Math.floor(this.x), Math.floor(this.bb.y0 - 0.5), Math.floor(this.z));
        if (t > 0) {
          friction = 0.6 * 0.91;
        }
      }
      const friction2 = 0.6 * 0.6 * 0.91 * 0.91 * 0.6 * 0.91 / (friction * friction * friction);
      this.moveRelative(xa, ya, this.onGround ? this.walkingSpeed * friction2 : this.flyingSpeed);
      friction = 0.91;
      if (this.onGround) {
        friction = 0.6 * 0.91;
        const t = this.level.getTile(Math.floor(this.x), Math.floor(this.bb.y0 - 0.5), Math.floor(this.z));
        if (t > 0) {
          friction = 0.6 * 0.91;
        }
      }
      if (this.onLadder()) {
        this.fallDistance = 0;
        if (this.yd < -0.15)
          this.yd = -0.15;
        if (this.isSneaking() && this.yd < 0)
          this.yd = 0;
      }
      this.move(this.xd, this.yd, this.zd);
      if (this.horizontalCollision && this.onLadder()) {
        this.yd = 0.2;
      }
      this.yd -= 0.08;
      this.yd *= 0.98;
      this.xd *= friction;
      this.zd *= friction;
    }
  }
  updateWalkAnim() {
    this.walkAnimSpeedO = this.walkAnimSpeed;
    const xxd = this.x - this.xo;
    const zzd = this.z - this.zo;
    let wst = Math.sqrt(xxd * xxd + zzd * zzd) * 4;
    if (wst > 1)
      wst = 1;
    this.walkAnimSpeed += (wst - this.walkAnimSpeed) * 0.4;
    this.walkAnimPos += this.walkAnimSpeed;
  }
  onLadder() {
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.bb.y0);
    const zt = Math.floor(this.z);
    return this.level.getTile(xt, yt, zt) === 65 || this.level.getTile(xt, yt + 1, zt) === 65;
  }
  isShootable() {
    return true;
  }
  addAdditionalSaveData(entityTag) {
    entityTag.putShort("Health", this.health);
    entityTag.putShort("HurtTime", this.hurtTime);
    entityTag.putShort("DeathTime", this.deathTime);
    entityTag.putShort("AttackTime", this.attackTime);
  }
  readAdditionalSaveData(tag) {
    this.health = tag.getShort("Health");
    this.hurtTime = tag.getShort("HurtTime");
    this.deathTime = tag.getShort("DeathTime");
    this.attackTime = tag.getShort("AttackTime");
  }
  animateHurt() {
    this.hurtTime = this.hurtDuration = 10;
    this.hurtDir = 0;
  }
  isAlive() {
    return !this.removed && this.health > 0;
  }
  isWaterMob() {
    return false;
  }
  aiStep() {
    if (this.isImmobile()) {
      this.jumping = false;
      this.xxa = 0;
      this.yya = 0;
      this.yRotA = 0;
    } else {
      if (!this.interpolateOnly()) {
        if (this.useNewAi()) {
          this.newServerAiStep();
        } else {
          this.updateAi();
        }
      }
    }
    const inWater = this.isInWater();
    const inLava = this.isInLava();
    if (this.jumping) {
      if (inWater) {
        this.yd += 0.04;
      } else if (inLava) {
        this.yd += 0.04;
      } else if (this.onGround) {
        this.jumpFromGround();
      }
    }
    this.xxa *= 0.98;
    this.yya *= 0.98;
    this.yRotA *= 0.9;
    const normalSpeed = this.walkingSpeed;
    const normalAirControlSpeed = this.flyingSpeed;
    this.walkingSpeed *= this.getWalkingSpeedModifier();
    this.flyingSpeed *= this.getWalkingSpeedModifier();
    this.travel(this.xxa, this.yya);
    this.walkingSpeed = normalSpeed;
    this.flyingSpeed = normalAirControlSpeed;
  }
  updateAi() {
    this.noActionTime++;
    const player = this.level.getNearestPlayer ? this.level.getNearestPlayer(this, -1) : null;
    this.checkDespawn(player);
    this.xxa = 0;
    this.yya = 0;
    const lookDistance = 8;
    if (this.random.nextFloat() < 0.02) {
      const p = this.level.getNearestPlayer ? this.level.getNearestPlayer(this, lookDistance) : null;
      if (p !== null) {
        this.lookingAtId = p.entityId;
        this.lookTime = 10 + this.random.nextInt(20);
      } else {
        this.yRotA = (this.random.nextFloat() - 0.5) * 20;
      }
    }
    if (this.lookingAtId !== 0) {
      const lookingAt = this.level.getEntity ? this.level.getEntity(this.lookingAtId) : null;
      this.lookingAtId = 0;
      if (lookingAt !== null) {
        this.lookAt(lookingAt, 10, this.getMaxHeadXRot());
        if (this.lookTime-- <= 0 || lookingAt.removed || this.distanceToSqrEntity(lookingAt) > lookDistance * lookDistance) {
          this.lookingAtId = 0;
        } else {
          this.lookingAtId = lookingAt.entityId;
        }
      }
    } else {
      if (this.random.nextFloat() < 0.05) {
        this.yRotA = (this.random.nextFloat() - 0.5) * 20;
      }
      this.yRot += this.yRotA;
      this.xRot = this.defaultLookAngle;
    }
    const inWater = this.isInWater();
    const inLava = this.isInLava();
    if (inWater || inLava)
      this.jumping = this.random.nextFloat() < 0.8;
  }
  newServerAiStep() {
    this.noActionTime++;
    this.checkDespawn();
    this.jumping = false;
    if (this.sensing && this.sensing.tick)
      this.sensing.tick();
    if (this.random.nextInt(5) === 0) {
      if (this.targetSelector && this.targetSelector.tick)
        this.targetSelector.tick();
      if (this.goalSelector && this.goalSelector.tick)
        this.goalSelector.tick();
    }
    if (this.navigation && this.navigation.tick)
      this.navigation.tick();
    if (this.moveControl && this.moveControl.tick)
      this.moveControl.tick();
    if (this.jumpControl && this.jumpControl.tick)
      this.jumpControl.tick();
  }
  isImmobile() {
    return this.health <= 0;
  }
  jumpFromGround() {
    this.yd = 0.42;
  }
  removeWhenFarAway() {
    return true;
  }
  getMaxHeadXRot() {
    return 10;
  }
  lookAt(e, yMax, xMax) {
    const xd = e.x - this.x;
    let yd;
    const zd = e.z - this.z;
    yd = (e.bb.y0 + e.bb.y1) / 2 - (this.y + this.getHeadHeight());
    const sd = Math.sqrt(xd * xd + zd * zd);
    const yRotD = Math.atan2(zd, xd) * 180 / Math.PI - 90;
    const xRotD = Math.atan2(yd, sd) * 180 / Math.PI;
    this.xRot = -this.rotlerp(this.xRot, xRotD, xMax);
    this.yRot = this.rotlerp(this.yRot, yRotD, yMax);
  }
  isLookingAtAnEntity() {
    return this.lookingAtId !== 0;
  }
  rotlerp(a, b, max) {
    let diff = b - a;
    while (diff < -180)
      diff += 360;
    while (diff >= 180)
      diff -= 360;
    if (diff > max)
      diff = max;
    if (diff < -max)
      diff = -max;
    return a + diff;
  }
  beforeRemove() {}
  canSpawn() {
    return this.level.isUnobstructed(this.bb) && this.level.getCubes(this, this.bb).length === 0 && !this.level.containsAnyLiquid(this.bb);
  }
  outOfWorld() {
    const oldHealth = this.health;
    this.hurt(null, 4);
    if (this.health >= oldHealth) {
      this.actuallyHurt(4);
    }
  }
  getAttackAnim(a) {
    let diff = this.attackAnim - this.oAttackAnim;
    if (diff < 0)
      diff += 1;
    return this.oAttackAnim + diff * a;
  }
  getPos(a) {
    if (a === 1) {
      return new Vec3(this.x, this.y, this.z);
    }
    const x = this.xo + (this.x - this.xo) * a;
    const y = this.yo + (this.y - this.yo) * a;
    const z = this.zo + (this.z - this.zo) * a;
    return new Vec3(x, y, z);
  }
  getLookAngle() {
    return this.getViewVector(1);
  }
  getViewVector(a) {
    let yRot, xRot;
    if (a === 1) {
      yRot = this.yRot;
      xRot = this.xRot;
    } else {
      xRot = this.xRotO + (this.xRot - this.xRotO) * a;
      yRot = this.yRotO + (this.yRot - this.yRotO) * a;
    }
    const yCos = Math.cos(-yRot * (Math.PI / 180) - Math.PI);
    const ySin = Math.sin(-yRot * (Math.PI / 180) - Math.PI);
    const xCos = -Math.cos(-xRot * (Math.PI / 180));
    const xSin = Math.sin(-xRot * (Math.PI / 180));
    return new Vec3(ySin * xCos, xSin, yCos * xCos);
  }
  pick(range, a) {
    const from = this.getPos(a);
    const dir = this.getViewVector(a);
    const to = new Vec3(from.x + dir.x * range, from.y + dir.y * range, from.z + dir.z * range);
    if (this.level && this.level.clip) {
      return this.level.clip(from, to);
    }
    return new HitResult;
  }
  getMaxSpawnClusterSize() {
    return 4;
  }
  interpolateOnly() {
    return this.level && this.level.isClientSide ? this.level.isClientSide : false;
  }
  handleEntityEvent(id2) {
    if (id2 === 2) {
      this.walkAnimSpeed = 1.5;
      this.invulnerableTime = this.invulnerableDuration;
      this.hurtTime = this.hurtDuration = 10;
      this.hurtDir = 0;
      this.level.playSound(this, this.getHurtSound(), this.getSoundVolume(), this.getVoicePitch());
      this.hurt(null, 0);
    } else if (id2 === 3) {
      this.level.playSound(this, this.getDeathSound(), this.getSoundVolume(), this.getVoicePitch());
      this.health = 0;
      this.die(null);
    } else {
      super.handleEntityEvent(id2);
    }
  }
  getMoveControl() {
    return this.moveControl;
  }
  getJumpControl() {
    return this.jumpControl;
  }
  setYya(yya) {
    this.yya = yya;
  }
  getSpeed() {
    return this.speed;
  }
  setSpeed(speed) {
    this.speed = speed;
    this.yya = speed;
  }
  setJumping(jump) {
    this.jumping = jump;
  }
  useNewAi() {
    return false;
  }
  checkDespawn(nearestBlocking) {
    if (nearestBlocking === undefined) {
      nearestBlocking = this.level.getNearestPlayer ? this.level.getNearestPlayer(this, -1) : null;
    }
    if (nearestBlocking !== null) {
      const removeIfFar = this.removeWhenFarAway();
      const xd = nearestBlocking.x - this.x;
      const yd = nearestBlocking.y - this.y;
      const zd = nearestBlocking.z - this.z;
      const sd = xd * xd + yd * yd + zd * zd;
      if (removeIfFar && sd > 96 * 96) {
        this.remove();
      }
      if (this.noActionTime > 30 * 20 && this.random.nextInt(800) === 0 && removeIfFar && sd > 32 * 32) {
        this.remove();
      } else {
        this.noActionTime = 0;
      }
    }
  }
  updateAttackAnim() {
    if (this.swinging) {
      if (++this.swingTime >= SWING_DURATION) {
        this.swingTime = 0;
        this.swinging = false;
      }
    } else {
      this.swingTime = 0;
    }
    this.attackAnim = this.swingTime / SWING_DURATION;
  }
  swing() {
    if (!this.swinging || this.swingTime >= 3 || this.swingTime < 0) {
      this.swingTime = -1;
      this.swinging = true;
    }
  }
  isSneaking() {
    return false;
  }
  isSleeping() {
    return false;
  }
  setSneaking(value) {}
  getMaxHealth() {
    return 10;
  }
  isMob() {
    return true;
  }
  isBaby() {
    return false;
  }
  getItemInHandIcon(item, layer) {
    return item ? item.getIcon() : 0;
  }
  getCarriedItem() {
    return null;
  }
  getUseItemDuration() {
    return 0;
  }
  hurtArmor(damage) {}
  getDamageAfterArmorAbsorb(damage) {
    const absorb = 25 - this.getArmorValue();
    const v = damage * absorb + this.dmgSpill;
    this.hurtArmor(damage);
    damage = Math.floor(v / 25);
    this.dmgSpill = v % 25;
    return damage;
  }
  getArmorValue() {
    return 0;
  }
}

// src/game/world/entity/translated/Player.ts
var BedSleepingResult = {
  OK: 0,
  NOT_POSSIBLE_HERE: 1,
  NOT_POSSIBLE_NOW: 2,
  TOO_FAR_AWAY: 3,
  OTHER_PROBLEM: 4,
  NOT_SAFE: 5
};

class Player extends Mob3 {
  static DATA_PLAYER_FLAGS_ID = 16;
  static DATA_BED_POSITION_ID = 17;
  static PLAYER_SLEEP_FLAG = 1;
  static MAX_NAME_LENGTH = 16;
  static MAX_HEALTH = 20;
  static DEFAULT_WALK_SPEED = 0.1;
  static DEFAULT_FLY_SPEED = 0.02;
  static SLEEP_DURATION = 100;
  static WAKE_UP_DURATION = 10;
  userType = 0;
  score = 0;
  oBob = 0;
  bob = 0;
  name = "";
  dimension = 0;
  abilities = { flying: false, instabuild: false, invulnerable: false };
  foodData = { tick: (p) => {} };
  containerMenu = null;
  hasFakeInventory = false;
  bedPosition = { x: 0, y: 0, z: 0 };
  bedOffsetX = 0;
  bedOffsetY = 0;
  bedOffsetZ = 0;
  inventory = null;
  useItem = null;
  useItemDuration = 0;
  sleepCounter = 0;
  static NUM_ARMOR = 4;
  respawnPosition = { x: 0, y: -1, z: 0 };
  playerHasRespawnPosition = false;
  playerIsSleeping = false;
  allPlayersSleeping = false;
  armor = [null, null, null, null];
  constructor(level, isCreative) {
    super(level);
    this.userType = 0;
    this.playerHasRespawnPosition = false;
    this.hasFakeInventory = false;
    this.containerMenu = null;
    this.useItemDuration = 0;
    this.playerIsSleeping = false;
    this.sleepCounter = 0;
    this.bedOffsetX = 0;
    this.bedOffsetY = 0;
    this.bedOffsetZ = 0;
    this.respawnPosition = { x: 0, y: -1, z: 0 };
    this.allPlayersSleeping = false;
    this.canRemove = false;
    this._init();
    this.autoSendPosRot = false;
    this.heightOffset = 1.62;
    this.health = Player.MAX_HEALTH;
    this.modelName = "humanoid";
    this.rotOffs = 180;
    this.flameTime = 20;
    this.textureName = "mob/char.png";
  }
  isSleeping() {
    return this.playerIsSleeping;
  }
  startSleepInBed(x, y, z) {
    if (!this.level.isClientSide) {
      if (this.isSleeping() || !this.isAlive())
        return BedSleepingResult.OTHER_PROBLEM;
      if (Math.abs(this.x - x) > 3 || Math.abs(this.y - y) > 4 || Math.abs(this.z - z) > 3)
        return BedSleepingResult.TOO_FAR_AWAY;
      if (this.level.isDay())
        return BedSleepingResult.NOT_POSSIBLE_NOW;
    }
    this.setSize(0.2, 0.2);
    this.heightOffset = 0.2;
    this.setPos(x + 0.5, y + 15 / 16, z + 0.5);
    this.playerIsSleeping = true;
    this.sleepCounter = 0;
    this.bedPosition = { x, y, z };
    this.xd = this.zd = this.yd = 0;
    return BedSleepingResult.OK;
  }
  stopSleepInBed(forcefulWakeUp, updateLevelList, saveRespawnPoint) {
    if (!this.isSleeping())
      return;
    this.setSize(0.6, 1.8);
    this.setDefaultHeadHeight();
    this.playerIsSleeping = false;
    if (forcefulWakeUp)
      this.sleepCounter = 0;
    else
      this.sleepCounter = Player.SLEEP_DURATION;
    if (saveRespawnPoint) {
      this.setRespawnPosition(this.bedPosition);
    }
    this.allPlayersSleeping = false;
  }
  getSleepTimer() {
    return this.allPlayersSleeping ? this.sleepCounter : 0;
  }
  setAllPlayersSleeping() {
    this.sleepCounter = 0;
    this.allPlayersSleeping = true;
  }
  setBedOffset(bedDirection) {
    this.bedOffsetX = 0;
    this.bedOffsetZ = 0;
  }
  isSleepingLongEnough() {
    return this.isSleeping() && this.sleepCounter >= Player.SLEEP_DURATION;
  }
  getSleepRotation() {
    return 0;
  }
  checkBed() {
    return this.level.getTile(this.bedPosition.x, this.bedPosition.y, this.bedPosition.z) === 26;
  }
  tick() {
    if (this.isSleeping()) {
      this.sleepCounter++;
      if (this.sleepCounter > Player.SLEEP_DURATION)
        this.sleepCounter = Player.SLEEP_DURATION;
      if (!this.level.isClientSide) {
        if (!this.checkBed())
          this.stopSleepInBed(true, true, false);
        else if (this.level.isDay())
          this.stopSleepInBed(false, true, true);
      }
    } else if (this.sleepCounter > 0) {
      this.sleepCounter++;
      if (this.sleepCounter >= Player.SLEEP_DURATION + Player.WAKE_UP_DURATION)
        this.sleepCounter = 0;
    }
    super.tick();
    if (!this.level.isClientSide) {
      this.foodData.tick(this);
    }
  }
  getMaxHealth() {
    return Player.MAX_HEALTH;
  }
  isUsingItem() {
    return this.useItem !== null && !this.useItem.isNull();
  }
  getUseItem() {
    return this.useItem;
  }
  startUsingItem(instance, duration) {
    this.useItem = instance;
    this.useItemDuration = duration;
  }
  stopUsingItem() {
    this.useItem = null;
    this.useItemDuration = 0;
  }
  releaseUsingItem() {
    if (this.useItem && !this.useItem.isNull()) {
      this.useItem.releaseUsing(this.level, this, this.useItemDuration);
    }
    this.stopUsingItem();
  }
  completeUsingItem() {
    if (this.useItem && !this.useItem.isNull()) {
      this.stopUsingItem();
    }
  }
  getUseItemDuration() {
    return this.useItemDuration;
  }
  getTicksUsingItem() {
    if (this.isUsingItem())
      return this.useItem.getUseDuration() - this.useItemDuration;
    return 0;
  }
  travel(xa, ya) {
    if (this.abilities.flying) {
      const ydo = this.yd;
      const ofs = this.flyingSpeed;
      this.flyingSpeed = 0.05;
      super.travel(xa, ya);
      this.yd = ydo * 0.6;
      this.flyingSpeed = ofs;
    } else {
      super.travel(xa, ya);
    }
  }
  isImmobileImpl() {
    return this.health <= 0 || this.isSleeping();
  }
  isImmobile() {
    return this.health <= 0 || this.isSleeping();
  }
  closeContainer() {
    this.containerMenu = null;
  }
  resetPos(clearMore) {
    if (!this.isSleeping()) {
      this.heightOffset = 1.62;
      this.setSize(0.6, 1.8);
      super.resetPos(clearMore);
    }
    this.invisible = false;
    if (clearMore) {
      this.health = this.getMaxHealth();
      this.deathTime = 0;
      this.playerIsSleeping = false;
    }
  }
  updateAi() {
    this.updateAttackAnim();
  }
  getItemInHandIcon(item, layer) {
    return item ? item.getIcon() : 0;
  }
  aiStep() {
    if (this.level.difficulty === 0 && this.health < Player.MAX_HEALTH) {
      if (this.tickCount % (12 * 20) === 0)
        this.heal(1);
    }
    this.oBob = this.bob;
    let tBob = Math.sqrt(this.xd * this.xd + this.zd * this.zd);
    let tTilt = Math.atan(-this.yd * 0.2) * 15;
    if (tBob > 0.1)
      tBob = 0.1;
    if (!this.onGround || this.health <= 0)
      tBob = 0;
    if (this.onGround || this.health <= 0)
      tTilt = 0;
    this.bob += (tBob - this.bob) * 0.4;
    this.tilt += (tTilt - this.tilt) * 0.8;
  }
  touch(entity) {
    entity.playerTouch(this);
  }
  getScore() {
    return this.score;
  }
  die(source) {
    super.die(source);
    this.setSize(0.2, 0.2);
    this.setPos(this.x, this.y, this.z);
    this.yd = 0.1;
    if (source !== null) {
      this.xd = -Math.cos((this.hurtDir + this.yRot) * Math.PI / 180) * 0.1;
      this.zd = -Math.sin((this.hurtDir + this.yRot) * Math.PI / 180) * 0.1;
    } else {
      this.xd = this.zd = 0;
    }
    this.heightOffset = 0.1;
  }
  reset() {
    super.reset();
    this._init();
  }
  _init() {
    this.oBob = this.bob = 0;
    this.swinging = false;
    this.swingTime = 0;
    this.score = 0;
  }
  getWalkingSpeedModifier() {
    return 1;
  }
  awardKillScore(victim, score) {
    this.score += score;
  }
  isShootable() {
    return true;
  }
  isCreativeModeAllowed() {
    return true;
  }
  drop(item, randomly = false) {
    if (item === null || item.isNull())
      return;
    if (this.level && this.level.spawnItemEntity) {
      this.level.spawnItemEntity(this.x, this.y - 0.3 + this.getHeadHeight(), this.z, item.id, item.count, item.getAuxValue());
    }
  }
  reallyDrop(thrownItem) {
    if (this.level && this.level.addEntity)
      this.level.addEntity(thrownItem);
  }
  getDestroySpeed(tile) {
    return this.inventory ? this.inventory.getDestroySpeed(tile) : 1;
  }
  canDestroy(tile) {
    return this.inventory ? this.inventory.canDestroy(tile) : true;
  }
  getHeadHeight() {
    return 0.12;
  }
  setDefaultHeadHeight() {
    this.heightOffset = 1.62;
  }
  isHurt() {
    return this.health > 0 && this.health < this.getMaxHealth();
  }
  hurt(source, dmg) {
    if (this.abilities.invulnerable)
      return false;
    this.noActionTime = 0;
    if (this.health <= 0)
      return false;
    if (this.isSleeping() && !this.level.isClientSide) {
      this.stopSleepInBed(true, true, false);
    }
    if (dmg === 0)
      return false;
    return super.hurt(source, dmg);
  }
  interactEntity(entity) {
    if (entity.interact && entity.interact(this))
      return;
    const item = this.inventory ? this.inventory.getSelected() : null;
    if (item !== null && entity.isMob && entity.isMob()) {
      item.interactEnemy(entity);
      if (item.count <= 0) {
        this.inventory.clearSlot(this.inventory.selected);
      }
    }
  }
  attack(entity) {
    const dmg = this.inventory ? this.inventory.getAttackDamage(entity) : 1;
    if (dmg > 0) {
      entity.hurt(this, dmg);
      const item = this.inventory ? this.inventory.getSelected() : null;
      if (item !== null && entity.isMob && entity.isMob() && !this.abilities.instabuild) {
        item.hurtEnemy(entity);
        if (item.count <= 0) {
          this.inventory.clearSlot(this.inventory.selected);
        }
      }
    }
  }
  respawn() {}
  animateRespawn() {}
  getCarriedItem() {
    return this.inventory ? this.inventory.getSelected() : null;
  }
  remove() {
    this.invisible = true;
    super.remove();
  }
  isInWall() {
    return super.isInWall();
  }
  hasResource(id2) {
    return this.inventory ? this.inventory.hasResource(id2) : false;
  }
  displayClientMessage(messageId) {}
  getRespawnPosition() {
    return this.respawnPosition;
  }
  setRespawnPosition(respawnPosition) {
    if (respawnPosition.y < 0) {
      this.playerHasRespawnPosition = false;
    } else {
      this.playerHasRespawnPosition = true;
    }
    this.respawnPosition = respawnPosition;
  }
  isPlayer() {
    return true;
  }
  static isPlayerEntity(e) {
    return e && e.isPlayer();
  }
  static asPlayer(e) {
    return Player.isPlayerEntity(e) ? e : null;
  }
  openContainer(container) {}
  tileEntityDestroyed(tileEntityId) {
    if (!this.containerMenu)
      return;
    if (this.containerMenu.tileEntityDestroyedIsInvalid && this.containerMenu.tileEntityDestroyedIsInvalid(tileEntityId)) {
      this.closeContainer();
    }
  }
  canUseCarriedItemWhileMoving() {
    const item = this.getCarriedItem();
    return item && (item.id === 261 || item.getItem && item.getItem().isFood());
  }
  handleEntityEvent(id2) {
    if (id2 === 9) {
      this.completeUsingItem();
    } else {
      super.handleEntityEvent(id2);
    }
  }
  getSelectedItem() {
    return this.inventory ? this.inventory.getSelected() : null;
  }
  hasRespawnPosition() {
    return this.playerHasRespawnPosition;
  }
  openTextEdit(tileEntity) {}
  getArmorValue() {
    let val = 0;
    for (let i = 0;i < 4; i++) {
      if (this.armor[i] && !this.armor[i].isNull && !this.armor[i].isNull()) {
        val += 0;
      }
    }
    return val;
  }
  getArmor(slot) {
    if (slot < 0 || slot >= 4)
      return null;
    if (!this.armor[slot] || this.armor[slot].isNull())
      return null;
    return this.armor[slot];
  }
  setArmor(slot, item) {
    if (item === null)
      this.armor[slot] = null;
    else
      this.armor[slot] = item;
  }
  hurtArmor(dmg) {
    dmg = Math.max(1, Math.floor(dmg / 4));
    for (let i = 0;i < 4; i++) {
      const item = this.armor[i];
      if (item && !item.isNull()) {
        item.hurt(dmg);
        if (item.count === 0)
          item.setNull();
      }
    }
  }
  getArmorTypeHash() {
    const a0 = this.armor[0] ? this.armor[0].id : 0;
    const a1 = this.armor[1] ? this.armor[1].id : 0;
    const a2 = this.armor[2] ? this.armor[2].id : 0;
    const a3 = this.armor[3] ? this.armor[3].id : 0;
    return a0 + (a1 << 8) + (a2 << 16) + (a3 << 24);
  }
  getEntityTypeId() {
    return 0;
  }
  startCrafting(x, y, z, tableSize) {}
  startStonecutting(x, y, z) {}
  openFurnace(e) {}
  take(e, orgCount) {}
}

// src/game/world/phys/translated/AABB.ts
class AABB {
  x0;
  y0;
  z0;
  x1;
  y1;
  z1;
  constructor(x0, y0, z0, x1, y1, z1) {
    if (x0 === undefined) {
      this.x0 = 0;
      this.y0 = 0;
      this.z0 = 0;
      this.x1 = 1;
      this.y1 = 1;
      this.z1 = 1;
    } else {
      this.x0 = x0;
      this.y0 = y0;
      this.z0 = z0;
      this.x1 = x1;
      this.y1 = y1;
      this.z1 = z1;
    }
  }
  set(x0, y0, z0, x1, y1, z1) {
    this.x0 = x0;
    this.y0 = y0;
    this.z0 = z0;
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    return this;
  }
  expand(xa, ya, za) {
    let _x0 = this.x0, _y0 = this.y0, _z0 = this.z0;
    let _x1 = this.x1, _y1 = this.y1, _z1 = this.z1;
    if (xa < 0)
      _x0 += xa;
    if (xa > 0)
      _x1 += xa;
    if (ya < 0)
      _y0 += ya;
    if (ya > 0)
      _y1 += ya;
    if (za < 0)
      _z0 += za;
    if (za > 0)
      _z1 += za;
    return new AABB(_x0, _y0, _z0, _x1, _y1, _z1);
  }
  grow(xa, ya, za) {
    return new AABB(this.x0 - xa, this.y0 - ya, this.z0 - za, this.x1 + xa, this.y1 + ya, this.z1 + za);
  }
  cloneMove(xa, ya, za) {
    return new AABB(this.x0 + xa, this.y0 + ya, this.z0 + za, this.x1 + xa, this.y1 + ya, this.z1 + za);
  }
  clipXCollide(c, xa) {
    if (c.y1 <= this.y0 || c.y0 >= this.y1)
      return xa;
    if (c.z1 <= this.z0 || c.z0 >= this.z1)
      return xa;
    if (xa > 0 && c.x1 <= this.x0) {
      const max = this.x0 - c.x1;
      if (max < xa)
        xa = max;
    }
    if (xa < 0 && c.x0 >= this.x1) {
      const max = this.x1 - c.x0;
      if (max > xa)
        xa = max;
    }
    return xa;
  }
  clipYCollide(c, ya) {
    if (c.x1 <= this.x0 || c.x0 >= this.x1)
      return ya;
    if (c.z1 <= this.z0 || c.z0 >= this.z1)
      return ya;
    if (ya > 0 && c.y1 <= this.y0) {
      const max = this.y0 - c.y1;
      if (max < ya)
        ya = max;
    }
    if (ya < 0 && c.y0 >= this.y1) {
      const max = this.y1 - c.y0;
      if (max > ya)
        ya = max;
    }
    return ya;
  }
  clipZCollide(c, za) {
    if (c.x1 <= this.x0 || c.x0 >= this.x1)
      return za;
    if (c.y1 <= this.y0 || c.y0 >= this.y1)
      return za;
    if (za > 0 && c.z1 <= this.z0) {
      const max = this.z0 - c.z1;
      if (max < za)
        za = max;
    }
    if (za < 0 && c.z0 >= this.z1) {
      const max = this.z1 - c.z0;
      if (max > za)
        za = max;
    }
    return za;
  }
  intersects(a, b, c, d, e, f) {
    if (a instanceof AABB) {
      if (a.x1 <= this.x0 || a.x0 >= this.x1)
        return false;
      if (a.y1 <= this.y0 || a.y0 >= this.y1)
        return false;
      if (a.z1 <= this.z0 || a.z0 >= this.z1)
        return false;
      return true;
    } else {
      if (d <= this.x0 || a >= this.x1)
        return false;
      if (e <= this.y0 || b >= this.y1)
        return false;
      if (f <= this.z0 || c >= this.z1)
        return false;
      return true;
    }
  }
  intersectsInner(c) {
    if (c.x1 < this.x0 || c.x0 > this.x1)
      return false;
    if (c.y1 < this.y0 || c.y0 > this.y1)
      return false;
    if (c.z1 < this.z0 || c.z0 > this.z1)
      return false;
    return true;
  }
  move(xa, ya, za) {
    this.x0 += xa;
    this.y0 += ya;
    this.z0 += za;
    this.x1 += xa;
    this.y1 += ya;
    this.z1 += za;
    return this;
  }
  contains(p) {
    if (p.x <= this.x0 || p.x >= this.x1)
      return false;
    if (p.y <= this.y0 || p.y >= this.y1)
      return false;
    if (p.z <= this.z0 || p.z >= this.z1)
      return false;
    return true;
  }
  getSize() {
    const xs = this.x1 - this.x0;
    const ys = this.y1 - this.y0;
    const zs = this.z1 - this.z0;
    return (xs + ys + zs) / 3;
  }
  shrink(xa, ya, za) {
    return new AABB(this.x0 + xa, this.y0 + ya, this.z0 + za, this.x1 - xa, this.y1 - ya, this.z1 - za);
  }
  copy() {
    return new AABB(this.x0, this.y0, this.z0, this.x1, this.y1, this.z1);
  }
  setFromAABB(b) {
    this.x0 = b.x0;
    this.y0 = b.y0;
    this.z0 = b.z0;
    this.x1 = b.x1;
    this.y1 = b.y1;
    this.z1 = b.z1;
  }
  toString() {
    return "AABB(" + this.x0 + "," + this.y0 + "," + this.z0 + " to " + this.x1 + "," + this.y1 + "," + this.z1 + ")";
  }
}

// src/game/world/level/translated/Level.ts
var DEPTH = 128;
var SEA_LEVEL = DEPTH / 2 - 1;
var TICKS_PER_DAY2 = 20 * 60 * 16;
class Level {
  instaTick = false;
  isClientSide = false;
  isGeneratingTerrain = false;
  difficulty = 0;
  adventureSettings = {
    doTickTime: true,
    noPvP: false,
    noPvM: false,
    noMvP: false,
    immutableWorld: false,
    showNameTags: false
  };
  entities = [];
  entityIdLookup = new Map;
  tileEntities = [];
  pendingTileEntities = [];
  updatingTileEntities = false;
  players = [];
  skyDarken = 0;
  noNeighborUpdate = false;
  dimension = null;
  raknetInstance = null;
  random = { nextInt: (n) => Math.floor(Math.random() * n), nextFloat: () => Math.random() };
  isFindingSpawn = false;
  _listeners = [];
  _chunkSource = null;
  levelStorage = null;
  levelData = { getTime: () => 0, getSpawnMobs: () => true };
  allPlayersAreSleeping = false;
  _spawnFriendlies = true;
  _spawnEnemies = true;
  _randValue = 42184323;
  _addend = 1013904223;
  _es = [];
  _tickNextTickSet = new Set;
  _lightUpdates = [];
  _pendingEntityData = new Map;
  _updateLights = true;
  _maxRecurse = 0;
  _isNew = false;
  _nightMode = false;
  _lastSavedPlayerTime = 0;
  _pendingPlayerRemovals = [];
  constructor(levelStorage, levelName, settings, generatorVersion, fixedDimension) {
    this.levelStorage = levelStorage;
    this.isClientSide = false;
    this.isFindingSpawn = false;
    this.noNeighborUpdate = false;
    this.skyDarken = 0;
    this.instaTick = false;
    this._isNew = false;
    this._chunkSource = null;
    this._randValue = 42184323;
    this._addend = 1013904223;
    this._maxRecurse = 0;
    this._updateLights = true;
    this._spawnFriendlies = true;
    this._spawnEnemies = true;
    this._lastSavedPlayerTime = 0;
    this.raknetInstance = null;
    this.updatingTileEntities = false;
    this.allPlayersAreSleeping = false;
    this._nightMode = false;
    this._init(levelName, settings, generatorVersion, fixedDimension);
  }
  _init(levelName, settings, generatorVersion, fixedDimension) {
    this.isGeneratingTerrain = false;
    this._isNew = true;
    this.dimension = { brightnessRamp: new Array(16).fill(0).map((_, i) => (15 - i) / (i * 3 + 1) * 0.95 + 0.05 * 3) };
  }
  getTile(x, y, z) {
    if (y < 0)
      return 0;
    if (y >= DEPTH)
      return 0;
    return this.getChunk(x >> 4, z >> 4)?.getTile(x & 15, y, z & 15) ?? 0;
  }
  isEmptyTile(x, y, z) {
    return this.getTile(x, y, z) === 0;
  }
  isSolidRenderTile(x, y, z) {
    const t = this.getTile(x, y, z);
    return t > 0;
  }
  isSolidBlockingTile(x, y, z) {
    const t = this.getTile(x, y, z);
    return t > 0;
  }
  hasChunkAt(x, y, z) {
    if (y < 0 || y >= DEPTH)
      return false;
    return this.hasChunk(x >> 4, z >> 4);
  }
  hasChunksAt(x, y, z, r) {
    return this.hasChunksAt6(x - r, y - r, z - r, x + r, y + r, z + r);
  }
  hasChunksAt6(x0, y0, z0, x1, y1, z1) {
    if (y1 < 0 || y0 >= DEPTH)
      return false;
    x0 >>= 4;
    z0 >>= 4;
    x1 >>= 4;
    z1 >>= 4;
    for (let x = x0;x <= x1; x++)
      for (let z = z0;z <= z1; z++)
        if (!this.hasChunk(x, z))
          return false;
    return true;
  }
  hasChunk(x, z) {
    return this._chunkSource ? this._chunkSource.hasChunk(x, z) : false;
  }
  getChunkAt(x, z) {
    return this.getChunk(x >> 4, z >> 4);
  }
  getChunk(x, z) {
    return this._chunkSource ? this._chunkSource.getChunk(x, z) : null;
  }
  setTileAndDataNoUpdate(x, y, z, tile, data) {
    if (y < 0)
      return false;
    if (y >= DEPTH)
      return false;
    const c = this.getChunk(x >> 4, z >> 4);
    return c ? c.setTileAndData(x & 15, y, z & 15, tile, data) : false;
  }
  setTileNoUpdate(x, y, z, tile) {
    if (y < 0)
      return false;
    if (y >= DEPTH)
      return false;
    const c = this.getChunk(x >> 4, z >> 4);
    return c ? c.setTile(x & 15, y, z & 15, tile) : false;
  }
  getMaterial(x, y, z) {
    const t = this.getTile(x, y, z);
    if (t === 0)
      return "air";
    return "stone";
  }
  getData(x, y, z) {
    if (y < 0)
      return 0;
    if (y >= DEPTH)
      return 0;
    const c = this.getChunk(x >> 4, z >> 4);
    x &= 15;
    z &= 15;
    return c ? c.getData(x, y, z) : 0;
  }
  setData(x, y, z, data) {
    if (this.setDataNoUpdate(x, y, z, data)) {
      this.tileUpdated(x, y, z, this.getTile(x, y, z));
    }
  }
  setDataNoUpdate(x, y, z, data) {
    if (y < 0)
      return false;
    if (y >= DEPTH)
      return false;
    const c = this.getChunk(x >> 4, z >> 4);
    x &= 15;
    z &= 15;
    if (c && c.getData(x, y, z) !== data) {
      c.setData(x, y, z, data);
      return true;
    }
    return false;
  }
  setTile(x, y, z, tile) {
    if (this.setTileNoUpdate(x, y, z, tile)) {
      this.tileUpdated(x, y, z, tile);
      return true;
    }
    return false;
  }
  setTileAndData(x, y, z, tile, data) {
    if (this.setTileAndDataNoUpdate(x, y, z, tile, data)) {
      this.tileUpdated(x, y, z, tile);
      return true;
    }
    return false;
  }
  tileUpdated(x, y, z, tile) {}
  addEntity(e) {
    const prev = this.getEntity(e.entityId);
    if (prev)
      this.removeEntity(prev);
    const xc = Math.floor(e.x / 16);
    const zc = Math.floor(e.z / 16);
    const forced = true;
    if (forced) {
      if (e.isPlayer && e.isPlayer() && !this.players.includes(e)) {
        this.players.push(e);
      }
      const chunk = this.getChunk(xc, zc);
      if (chunk && chunk.addEntity)
        chunk.addEntity(e);
      this.entities.push(e);
      this.entityIdLookup.set(e.entityId, e);
      this.entityAdded(e);
      return true;
    }
    return false;
  }
  getEntity(entityId) {
    return this.entityIdLookup.get(entityId) ?? null;
  }
  removeEntity(e) {
    const idx = this.entities.indexOf(e);
    if (idx >= 0)
      this.entities.splice(idx, 1);
    this.entityIdLookup.delete(e.entityId);
    const pidx = this.players.indexOf(e);
    if (pidx >= 0)
      this.players.splice(pidx, 1);
    this.entityRemoved(e);
  }
  entityAdded(e) {
    for (const listener of this._listeners) {
      if (listener.entityAdded)
        listener.entityAdded(e);
    }
  }
  entityRemoved(e) {
    for (const listener of this._listeners) {
      if (listener.entityRemoved)
        listener.entityRemoved(e);
    }
  }
  boxes = [];
  getCubes(source, box) {
    this.boxes = [];
    const x0 = Math.floor(box.x0);
    const x1 = Math.floor(box.x1 + 1);
    const y0 = Math.floor(box.y0);
    const y1 = Math.floor(box.y1 + 1);
    const z0 = Math.floor(box.z0);
    const z1 = Math.floor(box.z1 + 1);
    for (let x = x0;x < x1; x++) {
      for (let z = z0;z < z1; z++) {
        if (this.hasChunkAt(x, DEPTH / 2, z)) {
          for (let y = y0 - 1;y < y1; y++) {
            const t = this.getTile(x, y, z);
            if (t > 0) {
              this.boxes.push(new AABB(x, y, z, x + 1, y + 1, z + 1));
            }
          }
        }
      }
    }
    return this.boxes;
  }
  getRawBrightness(x, y, z, propagate = true) {
    const c = this.getChunk(x >> 4, z >> 4);
    if (c && c.getRawBrightness) {
      return c.getRawBrightness(x & 15, y, z & 15, this.skyDarken);
    }
    return 15;
  }
  getBrightness(x, y, z) {
    const br = this.getRawBrightness(x, y, z);
    const v = 1 - br / 16;
    return (1 - v) / (v * 3 + 1) * (1 - 0.05) + 0.05 * 3;
  }
  isDay() {
    return this.skyDarken < 4;
  }
  clip(A, b, liquid = false, solidOnly = false) {
    if (isNaN(A.x) || isNaN(A.y) || isNaN(A.z))
      return new HitResult;
    if (isNaN(b.x) || isNaN(b.y) || isNaN(b.z))
      return new HitResult;
    const a = new Vec3(A.x, A.y, A.z);
    let xTile1 = Math.floor(b.x);
    let yTile1 = Math.floor(b.y);
    let zTile1 = Math.floor(b.z);
    let xTile0 = Math.floor(a.x);
    let yTile0 = Math.floor(a.y);
    let zTile0 = Math.floor(a.z);
    let maxIterations = 200;
    while (maxIterations-- >= 0) {
      if (isNaN(a.x) || isNaN(a.y) || isNaN(a.z))
        return new HitResult;
      if (xTile0 === xTile1 && yTile0 === yTile1 && zTile0 === zTile1)
        return new HitResult;
      let xClip = 999, yClip = 999, zClip = 999;
      if (xTile1 > xTile0)
        xClip = xTile0 + 1;
      if (xTile1 < xTile0)
        xClip = xTile0 + 0;
      if (yTile1 > yTile0)
        yClip = yTile0 + 1;
      if (yTile1 < yTile0)
        yClip = yTile0 + 0;
      if (zTile1 > zTile0)
        zClip = zTile0 + 1;
      if (zTile1 < zTile0)
        zClip = zTile0 + 0;
      let xDist = 999, yDist = 999, zDist = 999;
      const xd = b.x - a.x;
      const yd = b.y - a.y;
      const zd = b.z - a.z;
      if (xClip !== 999)
        xDist = (xClip - a.x) / xd;
      if (yClip !== 999)
        yDist = (yClip - a.y) / yd;
      if (zClip !== 999)
        zDist = (zClip - a.z) / zd;
      let face = 0;
      if (xDist < yDist && xDist < zDist) {
        if (xTile1 > xTile0)
          face = 4;
        else
          face = 5;
        a.x = xClip;
        a.y += yd * xDist;
        a.z += zd * xDist;
      } else if (yDist < zDist) {
        if (yTile1 > yTile0)
          face = 0;
        else
          face = 1;
        a.x += xd * yDist;
        a.y = yClip;
        a.z += zd * yDist;
      } else {
        if (zTile1 > zTile0)
          face = 2;
        else
          face = 3;
        a.x += xd * zDist;
        a.y += yd * zDist;
        a.z = zClip;
      }
      const tPos = new Vec3(a.x, a.y, a.z);
      xTile0 = Math.floor(a.x);
      if (face === 5) {
        xTile0--;
        tPos.x++;
      }
      yTile0 = Math.floor(a.y);
      if (face === 1) {
        yTile0--;
        tPos.y++;
      }
      zTile0 = Math.floor(a.z);
      if (face === 3) {
        zTile0--;
        tPos.z++;
      }
      const t = this.getTile(xTile0, yTile0, zTile0);
      if (t > 0) {
        return new HitResult(xTile0, yTile0, zTile0, face, tPos);
      }
    }
    return new HitResult;
  }
  getSkyDarken(a) {
    const td = this.getTimeOfDay(a);
    let br = 1 - (Math.cos(td * Math.PI * 2) * 2 + 0.5);
    if (br < 0)
      br = 0;
    if (br > 0.8)
      br = 0.8;
    return Math.floor(br * 11);
  }
  getTimeOfDay(a) {
    const time = this.levelData.getTime();
    const t = (time + a) / TICKS_PER_DAY2 % 1;
    return 0.5 + 2 * t - (t > 0.5 ? 1 : 0) / 2;
  }
  getSunAngle(a) {
    const td = this.getTimeOfDay(a);
    return td * Math.PI * 2;
  }
  containsAnyLiquid(box) {
    const x0 = Math.floor(box.x0);
    const x1 = Math.floor(box.x1 + 1);
    const y0 = Math.floor(box.y0);
    const y1 = Math.floor(box.y1 + 1);
    const z0 = Math.floor(box.z0);
    const z1 = Math.floor(box.z1 + 1);
    for (let x = x0;x < x1; x++)
      for (let y = y0;y < y1; y++)
        for (let z = z0;z < z1; z++) {
          const t = this.getTile(x, y, z);
          if (t === 8 || t === 9 || t === 10 || t === 11)
            return true;
        }
    return false;
  }
  containsFireTile(box) {
    const x0 = Math.floor(box.x0);
    const x1 = Math.floor(box.x1 + 1);
    const y0 = Math.floor(box.y0);
    const y1 = Math.floor(box.y1 + 1);
    const z0 = Math.floor(box.z0);
    const z1 = Math.floor(box.z1 + 1);
    if (this.hasChunksAt6(x0, y0, z0, x1, y1, z1)) {
      for (let x = x0;x < x1; x++)
        for (let y = y0;y < y1; y++)
          for (let z = z0;z < z1; z++) {
            const t = this.getTile(x, y, z);
            if (t === 10 || t === 11)
              return true;
          }
    }
    return false;
  }
  containsMaterial(box, material) {
    const x0 = Math.floor(box.x0);
    const x1 = Math.floor(box.x1 + 1);
    const y0 = Math.floor(box.y0);
    const y1 = Math.floor(box.y1 + 1);
    const z0 = Math.floor(box.z0);
    const z1 = Math.floor(box.z1 + 1);
    for (let x = x0;x < x1; x++)
      for (let y = y0;y < y1; y++)
        for (let z = z0;z < z1; z++) {
          const t = this.getTile(x, y, z);
          if (t > 0 && this.getMaterial(x, y, z) === material)
            return true;
        }
    return false;
  }
  containsLiquid(box, material) {
    const x0 = Math.floor(box.x0);
    const x1 = Math.floor(box.x1 + 1);
    const y0 = Math.floor(box.y0);
    const y1 = Math.floor(box.y1 + 1);
    const z0 = Math.floor(box.z0);
    const z1 = Math.floor(box.z1 + 1);
    for (let x = x0;x < x1; x++)
      for (let y = y0;y < y1; y++)
        for (let z = z0;z < z1; z++) {
          if (this.getMaterial(x, y, z) === material) {
            const data = this.getData(x, y, z);
            let yh1 = y + 1;
            if (data < 8)
              yh1 = y + 1 - data / 8;
            if (yh1 >= box.y0)
              return true;
          }
        }
    return false;
  }
  checkAndHandleWater(box, material, e) {
    const x0 = Math.floor(box.x0);
    const x1 = Math.floor(box.x1 + 1);
    const y0 = Math.floor(box.y0);
    const y1 = Math.floor(box.y1 + 1);
    const z0 = Math.floor(box.z0);
    const z1 = Math.floor(box.z1 + 1);
    if (!this.hasChunksAt6(x0, y0, z0, x1, y1, z1))
      return false;
    let ok = false;
    for (let x = x0;x < x1; x++)
      for (let y = y0;y < y1; y++)
        for (let z = z0;z < z1; z++) {
          if (this.getMaterial(x, y, z) === material) {
            ok = true;
          }
        }
    return ok;
  }
  getNearestPlayer(source, maxDist) {
    return this.getNearestPlayerXYZ(source.x, source.y, source.z, maxDist);
  }
  getNearestPlayerXYZ(x, y, z, maxDist) {
    const maxDistSqr = maxDist * maxDist;
    let best = -1;
    let result = null;
    for (const p of this.players) {
      if (p.removed)
        continue;
      const dx = p.x - x, dy = p.y - y, dz = p.z - z;
      const dist = dx * dx + dy * dy + dz * dz;
      if ((maxDist < 0 || dist < maxDistSqr) && (best === -1 || dist < best)) {
        best = dist;
        result = p;
      }
    }
    return result;
  }
  getTopSolidBlock(x, z) {
    let y = DEPTH - 1;
    while (y > 0) {
      const t = this.getTile(x, y, z);
      if (t > 0 && t !== 18)
        return y + 1;
      y--;
    }
    return -1;
  }
  getStarBrightness(a) {
    const td = this.getTimeOfDay(a);
    let br = 1 - (Math.cos(td * Math.PI * 2) * 2 + 0.75);
    if (br < 0)
      br = 0;
    if (br > 1)
      br = 1;
    return br * br * 0.5;
  }
  addParticle(id2, x, y, z, xd, yd, zd, data = 0) {}
  playSound(entity, name, volume, pitch) {}
  broadcastEntityEvent(e, eventId) {}
  isNew() {
    return this._isNew;
  }
  getSeaLevel() {
    return SEA_LEVEL;
  }
  getTime() {
    return this.levelData.getTime();
  }
  setTime(time) {
    this.levelData.time = time;
  }
  isNightMode() {
    return this._nightMode ? 1 : 0;
  }
  setNightMode(isNightMode) {
    this._nightMode = isNightMode;
  }
}

// src/game/world/level/translated/chunk-classes.ts
class ChunkSource {
  isChunkCache = false;
  constructor() {
    this.isChunkCache = false;
  }
  saveAll(onlyUnsaved) {}
}

class LevelChunk {
  blocksLength = 0;
  loaded = false;
  level = null;
  data = new Uint8Array(32768);
  skyLight = new Uint8Array(32768);
  blockLight = new Uint8Array(32768);
  heightmap = new Int8Array(256);
  updateMap = new Uint8Array(256);
  minHeight = 0;
  x;
  z;
  xt;
  zt;
  terrainPopulated = false;
  unsaved = false;
  dontSave = false;
  createdFromSave = false;
  lastSaveHadEntities = false;
  lastSaveTime = 0;
  blocks = new Uint8Array(32768);
  entityBlocks = [[], [], [], [], [], [], [], []];
  tileEntities = new Map;
  static touchedSky = false;
  static ChunkBlockCount = 32768;
  static ChunkSize = 32768;
  static UpdateMapBitShift = 4;
  constructor(level, arg2, arg3, arg4) {
    this.level = level;
    if (arg2 instanceof Uint8Array) {
      this.blocks = arg2;
      this.x = arg3;
      this.z = arg4;
    } else {
      this.x = arg2;
      this.z = arg3;
    }
    this.xt = this.x * 16;
    this.zt = this.z * 16;
  }
  init() {}
  clearUpdateMap() {
    this.updateMap.fill(0);
  }
  deleteBlockData() {
    this.blocks = new Uint8Array(0);
  }
  isAt(x, z) {
    return this.x === x && this.z === z;
  }
  getHeightmap(x, z) {
    return this.heightmap[(z & 15) << 4 | x & 15];
  }
  getBlockData() {
    return this.blocks;
  }
  getTile(x, y, z) {
    return this.blocks[y << 8 | (z & 15) << 4 | x & 15];
  }
  setTile(x, y, z, tile) {
    return this.setTileAndData(x, y, z, tile, 0);
  }
  setTileAndData(x, y, z, tile, data) {
    const idx = y << 8 | (z & 15) << 4 | x & 15;
    if (this.blocks[idx] === tile)
      return false;
    this.blocks[idx] = tile;
    this.data[idx] = data;
    this.unsaved = true;
    return true;
  }
  getData(x, y, z) {
    return this.data[y << 8 | (z & 15) << 4 | x & 15];
  }
  setData(x, y, z, val) {
    const idx = y << 8 | (z & 15) << 4 | x & 15;
    this.data[idx] = val;
    this.unsaved = true;
  }
  setTileRaw(x, y, z, tile) {
    const idx = y << 8 | (z & 15) << 4 | x & 15;
    this.blocks[idx] = tile;
  }
  isEmpty() {
    return false;
  }
  addEntity(e) {
    const yc = Math.floor(e.y / 16);
    if (yc >= 0 && yc < 8) {
      this.entityBlocks[yc].push(e);
    }
  }
  removeEntity(e) {
    for (let i = 0;i < 8; i++) {
      const idx = this.entityBlocks[i].indexOf(e);
      if (idx >= 0) {
        this.entityBlocks[i].splice(idx, 1);
        return;
      }
    }
  }
  getTileEntity(x, y, z) {
    return this.tileEntities.get(`${x},${y},${z}`);
  }
  hasTileEntityAt(x, y, z) {
    return this.tileEntities.has(`${x},${y},${z}`);
  }
  addTileEntity(te) {}
  setTileEntity(x, y, z, tileEntity) {
    this.tileEntities.set(`${x},${y},${z}`, tileEntity);
  }
  removeTileEntity(x, y, z) {
    this.tileEntities.delete(`${x},${y},${z}`);
  }
  isSkyLit(x, y, z) {
    return y >= this.getHeightmap(x, z);
  }
  load() {
    this.loaded = true;
  }
  unload() {
    this.loaded = false;
  }
  shouldSave(force) {
    return force || this.unsaved;
  }
  markUnsaved() {
    this.unsaved = true;
  }
  countEntities() {
    let count = 0;
    for (let i = 0;i < 8; i++)
      count += this.entityBlocks[i].length;
    return count;
  }
  getRawBrightness(x, y, z, skyDampen) {
    const idx = y << 8 | (z & 15) << 4 | x & 15;
    const sky = Math.max(0, this.skyLight[idx] - skyDampen);
    const block2 = this.blockLight[idx];
    return Math.max(sky, block2);
  }
  getBrightness(layer, x, y, z) {
    const idx = y << 8 | (z & 15) << 4 | x & 15;
    if (layer === "sky")
      return this.skyLight[idx];
    return this.blockLight[idx];
  }
  setBrightness(layer, x, y, z, brightness) {
    const idx = y << 8 | (z & 15) << 4 | x & 15;
    if (layer === "sky")
      this.skyLight[idx] = brightness;
    else
      this.blockLight[idx] = brightness;
  }
  getTileEntityMap() {
    return this.tileEntities;
  }
}

class ChunkCache extends ChunkSource {
  static MAX_SAVES = 2;
  xLast = -999999999;
  zLast = -999999999;
  last = null;
  level;
  emptyChunk = null;
  source = null;
  storage = null;
  chunks;
  constructor(level, storage, source) {
    super();
    this.isChunkCache = true;
    this.level = level;
    this.storage = storage;
    this.source = source;
    this.chunks = new Array(32 * 32).fill(null);
    this.emptyChunk = { isAt: () => false, terrainPopulated: true };
  }
  fits(x, z) {
    return x >= 0 && z >= 0 && x < 32 && z < 32;
  }
  hasChunk(x, z) {
    if (!this.fits(x, z))
      return true;
    if (x === this.xLast && z === this.zLast && this.last !== null)
      return true;
    const xs = x & 31;
    const zs = z & 31;
    const slot = xs + zs * 32;
    return this.chunks[slot] !== null && (this.chunks[slot] === this.emptyChunk || this.chunks[slot].isAt(x, z));
  }
  create(x, z) {
    return this.getChunk(x, z);
  }
  getChunk(x, z) {
    if (x === this.xLast && z === this.zLast && this.last !== null)
      return this.last;
    if (!this.fits(x, z))
      return this.emptyChunk;
    const xs = x & 31;
    const zs = z & 31;
    const slot = xs + zs * 32;
    if (!this.hasChunk(x, z)) {
      if (this.chunks[slot] !== null) {
        this.chunks[slot].unload();
      }
      let newChunk = this.load(x, z);
      let updateLights = false;
      if (newChunk === null) {
        if (this.source === null)
          newChunk = this.emptyChunk;
        else
          newChunk = this.source.getChunk(x, z);
      } else {
        updateLights = true;
      }
      this.chunks[slot] = newChunk;
      if (this.chunks[slot] !== null) {
        this.chunks[slot].load();
      }
      if (!this.chunks[slot].terrainPopulated && this.hasChunk(x + 1, z + 1) && this.hasChunk(x, z + 1) && this.hasChunk(x + 1, z)) {
        this.postProcess(this, x, z);
      }
    }
    this.xLast = x;
    this.zLast = z;
    this.last = this.chunks[slot];
    return this.chunks[slot];
  }
  getMobsAt(mobCategory, x, y, z) {
    return this.source ? this.source.getMobsAt(mobCategory, x, y, z) : null;
  }
  postProcess(parent, x, z) {
    if (!this.fits(x, z))
      return;
    const chunk = this.getChunk(x, z);
    if (!chunk.terrainPopulated) {
      chunk.terrainPopulated = true;
      if (this.source !== null) {
        this.source.postProcess(parent, x, z);
        chunk.clearUpdateMap();
      }
    }
  }
  tick() {
    if (this.storage !== null)
      this.storage.tick();
    return this.source ? this.source.tick() : false;
  }
  shouldSave() {
    return true;
  }
  gatherStats() {
    return "ChunkCache: 1024";
  }
  load(x, z) {
    if (this.storage === null)
      return this.emptyChunk;
    if (x < 0 || x >= 32 || z < 0 || z >= 32)
      return this.emptyChunk;
    const levelChunk = this.storage.load(this.level, x, z);
    if (levelChunk !== null) {
      levelChunk.lastSaveTime = this.level.getTime();
    }
    return levelChunk;
  }
  saveEntities(levelChunk) {
    if (this.storage === null)
      return;
    this.storage.saveEntities(this.level, levelChunk);
  }
  save(levelChunk) {
    if (this.storage === null)
      return;
    levelChunk.lastSaveTime = this.level.getTime();
    this.storage.save(this.level, levelChunk);
  }
}

// src/game/util/translated/SharedConstants.ts
var TicksPerSecond = 20;

// src/game/world/level/translated/world-systems.ts
var LEVEL_HEIGHT = 128;
var CHUNK_CACHE_WIDTH = 16;
var CHUNK_WIDTH = 16;
var CHUNK_DEPTH = 16;
var LEVEL_WIDTH = CHUNK_CACHE_WIDTH * CHUNK_WIDTH;
var LEVEL_DEPTH = CHUNK_CACHE_WIDTH * CHUNK_DEPTH;
var CHUNK_COLUMNS = CHUNK_WIDTH * CHUNK_DEPTH;
var CHUNK_BLOCK_COUNT = CHUNK_COLUMNS * LEVEL_HEIGHT;
var GameType;
((GameType) => {
  GameType.Undefined = -1;
  GameType.Survival = 0;
  GameType.Creative = 1;
  GameType.Default = GameType.Creative;
})(GameType ||= {});
class Dimension {
  level = null;
  biomeSource = null;
  foggy = false;
  ultraWarm = false;
  hasCeiling = false;
  brightnessRamp = new Array(16);
  id = 0;
  sunriseCol = [0, 0, 0, 0];
  static fogColor = 8444671;
  constructor() {
    this.updateLightRamp();
  }
  init(level) {
    this.level = level;
  }
  createRandomLevelSource() {
    return null;
  }
  isValidSpawn(x, z) {
    return true;
  }
  isNaturalDimension() {
    return false;
  }
  getTimeOfDay(time, a) {
    let t = time * (1 / 19200) % 1;
    const tdo = t;
    t = (1 - Math.cos(t * Math.PI) + 1) * 0.5;
    return tdo + (t - tdo) / 3;
  }
  getSunriseColor(td, a) {
    return null;
  }
  getFogColor(td, a) {
    return { x: 0.5, y: 0.85, z: 1 };
  }
  mayRespawn() {
    return true;
  }
  updateLightRamp() {
    for (let i = 0;i < 16; i++) {
      const v = 1 - i / 16;
      this.brightnessRamp[i] = (1 - v) / (v * 3 + 1) * (1 - 0.05) + 0.05 * 3;
    }
  }
  static getNew(id2) {
    return new Dimension;
  }
}
class TileEntity2 {
  level = null;
  x = 0;
  y = 0;
  z = 0;
  data = 0;
  type = 0;
  runningId = 0;
  clientSideOnly = false;
  rendererId = 0;
  tile = null;
  remove = false;
  static _runningId = 0;
  constructor(tileEntityType) {
    this.type = tileEntityType;
    this.runningId = ++TileEntity2._runningId;
  }
  shouldSave() {
    return true;
  }
  load(tag) {}
  save(tag) {
    return true;
  }
  tick() {}
  isFinished() {
    return false;
  }
  static loadStatic(tag) {
    return null;
  }
  setLevelAndPos(level, x, y, z) {
    this.level = level;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  getData() {
    return this.data;
  }
  setData(data) {
    this.data = data;
  }
  setChanged() {}
  distanceToSqr(xPlayer, yPlayer, zPlayer) {
    const xd = this.x - xPlayer;
    const yd = this.y - yPlayer;
    const zd = this.z - zPlayer;
    return xd * xd + yd * yd + zd * zd;
  }
  getTile() {
    return this.tile;
  }
  isRemoved() {
    return this.remove;
  }
  setRemoved() {
    this.remove = true;
  }
  clearRemoved() {
    this.remove = false;
  }
  triggerEvent(b0, b1) {}
  clearCache() {}
  isType(Type) {
    return this.type === Type;
  }
  static isType(te, Type) {
    return te !== null && te.type === Type;
  }
}

class GameMode {
  minecraft;
  oDestroyProgress = 0;
  destroyProgress = 0;
  destroyTicks = 0;
  destroyDelay = 0;
  constructor(minecraft) {
    this.minecraft = minecraft;
  }
  initLevel(level) {}
  startDestroyBlock(x, y, z, face) {}
  destroyBlock(x, y, z, face) {
    return false;
  }
  continueDestroyBlock(x, y, z, face) {}
  stopDestroyBlock() {}
  tick() {}
  render(a) {}
  getPickRange() {
    return 5;
  }
  useItem(player, level, item) {
    return false;
  }
  useItemOn(player, level, item, x, y, z, face, hit) {
    return false;
  }
  createPlayer(level) {
    return null;
  }
  initPlayer(player) {}
  adjustPlayer(player) {}
  canHurtPlayer() {
    return false;
  }
  interact(player, entity) {}
  attack(player, entity) {}
  handleInventoryMouseClick(containerId, slotNum, buttonNum, player) {
    return null;
  }
  handleCloseInventory(containerId, player) {}
  isCreativeType() {
    return false;
  }
  isSurvivalType() {
    return false;
  }
  initAbilities(abilities) {}
  releaseUsingItem(player) {}
}

class CreativeMode extends GameMode {
  constructor(minecraft) {
    super(minecraft);
  }
  startDestroyBlock(x, y, z, face) {}
  continueDestroyBlock(x, y, z, face) {}
  stopDestroyBlock() {}
  isCreativeType() {
    return true;
  }
  initAbilities(abilities) {
    abilities.instabuild = true;
    abilities.mayfly = true;
  }
  releaseUsingItem(player) {}
  creativeDestroyBlock(x, y, z, face) {}
}

class SurvivalMode extends GameMode {
  xDestroyBlock = 0;
  yDestroyBlock = 0;
  zDestroyBlock = 0;
  constructor(minecraft) {
    super(minecraft);
  }
  destroyBlock(x, y, z, face) {
    return false;
  }
  startDestroyBlock(x, y, z, face) {}
  continueDestroyBlock(x, y, z, face) {}
  stopDestroyBlock() {}
  canHurtPlayer() {
    return true;
  }
  isSurvivalType() {
    return true;
  }
  initAbilities(abilities) {
    abilities.instabuild = false;
    abilities.mayfly = false;
  }
}
var biomes = {};

class Biome {
  name = "";
  color = 0;
  topMaterial = 0;
  material = 0;
  leafColor = 0;
  _enemies = [];
  _friendlies = [];
  _waterFriendlies = [];
  static map = new Array(64 * 64).fill(null);
  setName(name) {
    this.name = name;
    return this;
  }
  setLeafColor(leafColor) {
    this.leafColor = leafColor;
    return this;
  }
  setColor(color) {
    this.color = color;
    return this;
  }
  setSnowCovered() {
    return this;
  }
  clearMobs(friendlies = true, waterFriendlies = true, enemies = true) {
    return this;
  }
  getTreeFeature(random) {
    return null;
  }
  getGrassFeature(random) {
    return null;
  }
  static getBiome(temperature, downfall) {
    return Biome._getBiome(temperature, downfall);
  }
  static _getBiome(temperature, downfall) {
    return biomes.plains ?? null;
  }
  adjustScale(scale) {
    return scale;
  }
  adjustDepth(depth) {
    return depth;
  }
  getSkyColor(temp) {
    return 3174655;
  }
  getMobs(category) {
    return this._enemies;
  }
  getCreatureProbability() {
    return 0.1;
  }
}

class BiomeSource {
  temperatures = [];
  downfalls = [];
  noises = [];
  lenTemperatures = 0;
  lenDownfalls = 0;
  lenNoises = 0;
  lenBiomes = 0;
  biomes = [];
  temperatureMap = null;
  downfallMap = null;
  noiseMap = null;
  static zoom = 0.0125;
  static tempScale = 0.05;
  static downfallScale = 0.05;
  static noiseScale = 0.0125;
  constructor(level) {}
  getBiome(x, z) {
    return Biome.getBiome(0.5, 0.5);
  }
  getTemperatureBlock(x, z, w, h) {
    return new Array(w * h).fill(0.5);
  }
  getBiomeBlock(x, z, w, h) {
    const result = new Array(w * h);
    for (let i = 0;i < w * h; i++)
      result[i] = Biome.getBiome(0.5, 0.5);
    return result;
  }
}

class RandomLevelSource {
  static SNOW_CUTOFF = 0.5;
  static SNOW_SCALE = 1;
  static CHUNK_HEIGHT = 8;
  static CHUNK_WIDTH = 4;
  caveFeature = null;
  waterDepths = [];
  level = null;
  spawnMobs = true;
  chunkMap = new Map;
  random;
  buffer = [];
  constructor(level, seed, version, spawnMobs) {
    this.level = level;
    this.spawnMobs = spawnMobs;
    this.waterDepths = new Array(32).fill(0).map(() => new Array(32).fill(0));
  }
  hasChunk(x, y) {
    return true;
  }
  create(x, z) {
    return this.getChunk(x, z);
  }
  getChunk(xOffs, zOffs) {
    return null;
  }
  prepareHeights(xOffs, zOffs, blocks, biomes2, temperatures) {}
  buildSurfaces(xOffs, zOffs, blocks, biomes2) {}
  postProcess(parent, xt, zt) {}
  tick() {
    return false;
  }
  getMobsAt(mobCategory, x, y, z) {
    return null;
  }
  shouldSave() {
    return false;
  }
  gatherStats() {
    return "RandomLevelSource";
  }
}

// src/game/browser-entry.ts
window.VoxelCraftEngine = VoxelCraftEngine;
window.VoxelCraftBlockRegistry = BlockRegistry;
window.VoxelCraftCreateMeshCache = (engine) => new ChunkMeshCache(engine.world, engine.registry);
window.VoxelCraftGenerateTerrainChunk = generateTerrainChunk;
window.VoxelCraftEnsureTerrainNeighborhood = ensureTerrainNeighborhood;
window.VoxelCraftGetTool = getTool;
window.VoxelCraftMobFactory = MobFactory;
window.VoxelCraftMobType = MobType;
window.VoxelCraftChicken = Chicken;
window.VoxelCraftCow = Cow;
window.VoxelCraftPig = Pig;
window.VoxelCraftSheep = Sheep;
window.VoxelCraftZombie = Zombie;
window.VoxelCraftCreeper = Creeper;
window.VoxelCraftSkeleton = Skeleton;
window.VoxelCraftSpider = Spider;
window.VoxelCraftFurnaceTileEntity = FurnaceTileEntity;
window.VoxelCraftChestTileEntity = ChestTileEntity;
window.VoxelCraftSignTileEntity = SignTileEntity;
window.VoxelCraftCreateTileEntity = createTileEntity;
window.VoxelCraftRecipes = Recipes;
window.VoxelCraftFurnaceRecipes = FurnaceRecipes;
window.VoxelCraftInitTiles = initTiles;
window.VoxelCraftTiles = tiles;
window.VoxelCraftInitItems = initItems;
window.VoxelCraftItemInstance = ItemInstance;
window.VoxelCraftInitMaterials = initMaterials;
window.VoxelCraftFillingContainer = FillingContainer;
window.VoxelCraftPlayer = Player;
window.VoxelCraftLevel = Level;
window.VoxelCraftLevelChunk = LevelChunk;
window.VoxelCraftChunkCache = ChunkCache;
window.VoxelCraftVec3 = Vec3;
window.VoxelCraftHitResult = HitResult;
window.VoxelCraftRandom = Random;
window.VoxelCraftTicksPerSecond = TicksPerSecond;
window.VoxelCraftDimension = Dimension;
window.VoxelCraftTileEntity = TileEntity2;
window.VoxelCraftGameMode = GameMode;
window.VoxelCraftCreativeMode = CreativeMode;
window.VoxelCraftSurvivalMode = SurvivalMode;
window.VoxelCraftBiome = Biome;
window.VoxelCraftBiomeSource = BiomeSource;
window.VoxelCraftInitTiles = initTiles;
window.VoxelCraftTiles = tiles;
window.VoxelCraftItem = Item;
window.VoxelCraftInitItems = initItems;
window.VoxelCraftItemInstance = ItemInstance;
window.VoxelCraftMaterial = Material;
window.VoxelCraftInitMaterials = initMaterials;
window.VoxelCraftFillingContainer = FillingContainer;
window.VoxelCraftEntity = Entity;
window.VoxelCraftMob = Mob;
window.VoxelCraftPlayer = Player;
window.VoxelCraftLevel = Level;
window.VoxelCraftLevelChunk = LevelChunk;
window.VoxelCraftChunkCache = ChunkCache;
window.VoxelCraftAABB_Cpp = AABB_Cpp;
window.VoxelCraftVec3 = Vec3;
window.VoxelCraftHitResult = HitResult;
window.VoxelCraftMth = { sqrt: mthSqrt, floor: mthFloor, sin: mthSin, cos: mthCos, atan: mthAtan, atan2: mthAtan2, PI, TWO_PI, DEGRAD, RADDEG };
window.VoxelCraftRandom = Random;
window.VoxelCraftTicksPerSecond = TicksPerSecond;
window.VoxelCraftDimension = Dimension;
window.VoxelCraftTileEntity = TileEntity2;
window.VoxelCraftGameMode = GameMode;
window.VoxelCraftCreativeMode = CreativeMode;
window.VoxelCraftSurvivalMode = SurvivalMode;
window.VoxelCraftBiome = Biome;
window.VoxelCraftBiomeSource = BiomeSource;
