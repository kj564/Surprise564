// src/game/blocks/registry.ts
function block(definition) {
  return Object.freeze({ ...definition, legacyAliases: definition.legacyAliases ? Object.freeze([...definition.legacyAliases]) : undefined, drops: Object.freeze([...definition.drops]) });
}
var definitions = [
  block({ key: "minecraft:air", displayName: "Air", shape: "none", renderLayer: "invisible", solid: false, selectable: false, replaceable: true, material: "air", hardness: 0, sound: "silent", lightOpacity: 0, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:stone", legacyId: 1, displayName: "Stone", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 1.5, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:cobblestone"] }),
  block({ key: "minecraft:grass_block", legacyId: 2, displayName: "Grass Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "dirt", hardness: 0.6, sound: "grass", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:dirt"] }),
  block({ key: "minecraft:dirt", legacyId: 3, displayName: "Dirt", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "dirt", hardness: 0.5, sound: "gravel", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:dirt"] }),
  block({ key: "minecraft:cobblestone", legacyId: 4, displayName: "Cobblestone", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:cobblestone"] }),
  block({ key: "minecraft:oak_planks", legacyId: 5, displayName: "Oak Planks", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:oak_planks"] }),
  block({ key: "minecraft:bedrock", legacyId: 7, displayName: "Bedrock", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: -1, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:sand", legacyId: 12, displayName: "Sand", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "sand", hardness: 0.5, sound: "sand", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:sand"] }),
  block({ key: "minecraft:gravel", legacyId: 13, displayName: "Gravel", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "sand", hardness: 0.6, sound: "gravel", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:gravel"] }),
  block({ key: "minecraft:gold_ore", legacyId: 14, displayName: "Gold Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:gold_ore"] }),
  block({ key: "minecraft:iron_ore", legacyId: 15, displayName: "Iron Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:iron_ore"] }),
  block({ key: "minecraft:coal_ore", legacyId: 16, displayName: "Coal Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:coal"] }),
  block({ key: "minecraft:oak_log", legacyId: 17, displayName: "Oak Log", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:oak_log"] }),
  block({ key: "minecraft:oak_leaves", legacyId: 18, displayName: "Oak Leaves", shape: "cube", renderLayer: "cutout", solid: true, selectable: true, replaceable: false, material: "leaves", hardness: 0.2, sound: "grass", lightOpacity: 1, lightEmission: 0, drops: ["minecraft:oak_leaves"] }),
  block({ key: "minecraft:glass", legacyId: 20, displayName: "Glass", shape: "cube", renderLayer: "translucent", solid: true, selectable: true, replaceable: false, material: "glass", hardness: 0.3, sound: "glass", lightOpacity: 0, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:lapis_ore", legacyId: 21, displayName: "Lapis Lazuli Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:lapis_lazuli"] }),
  block({ key: "minecraft:sandstone", legacyId: 24, displayName: "Sandstone", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 0.8, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:sandstone"] }),
  block({ key: "minecraft:web", legacyId: 30, displayName: "Cobweb", shape: "cross", renderLayer: "cutout", solid: false, selectable: true, replaceable: false, material: "web", hardness: 4, sound: "cloth", lightOpacity: 1, lightEmission: 0, drops: ["minecraft:string"] }),
  block({ key: "minecraft:gold_block", legacyId: 41, displayName: "Gold Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 3, sound: "metal", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:gold_block"] }),
  block({ key: "minecraft:iron_block", legacyId: 42, displayName: "Iron Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 5, sound: "metal", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:iron_block"] }),
  block({ key: "minecraft:stone_slab", legacyId: 44, displayName: "Stone Slab", shape: "slab", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:stone_slab"] }),
  block({ key: "minecraft:bricks", legacyId: 45, displayName: "Bricks", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:bricks"] }),
  block({ key: "minecraft:obsidian", legacyId: 49, displayName: "Obsidian", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 10, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:obsidian"] }),
  block({ key: "minecraft:torch", legacyId: 50, displayName: "Torch", shape: "torch", renderLayer: "cutout", solid: false, selectable: true, replaceable: true, material: "decoration", hardness: 0, sound: "wood", lightOpacity: 0, lightEmission: 14, drops: ["minecraft:torch"] }),
  block({ key: "minecraft:oak_stairs", legacyId: 53, displayName: "Oak Stairs", shape: "stairs", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:oak_stairs"] }),
  block({ key: "minecraft:chest", legacyId: 54, displayName: "Chest", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2.5, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:chest"] }),
  block({ key: "minecraft:diamond_ore", legacyId: 56, displayName: "Diamond Ore", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:diamond"] }),
  block({ key: "minecraft:diamond_block", legacyId: 57, displayName: "Diamond Block", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 5, sound: "metal", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:diamond_block"] }),
  block({ key: "minecraft:crafting_table", legacyId: 58, displayName: "Crafting Table", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2.5, sound: "wood", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:crafting_table"] }),
  block({ key: "minecraft:farmland", legacyId: 60, displayName: "Farmland", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "dirt", hardness: 0.6, sound: "gravel", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:dirt"] }),
  block({ key: "minecraft:furnace", legacyId: 61, displayName: "Furnace", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 3.5, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:furnace"] }),
  block({ key: "minecraft:ladder", legacyId: 65, displayName: "Ladder", shape: "cross", renderLayer: "cutout", solid: false, selectable: true, replaceable: true, material: "decoration", hardness: 0.4, sound: "wood", lightOpacity: 0, lightEmission: 0, drops: ["minecraft:ladder"] }),
  block({ key: "minecraft:stone_stairs", legacyId: 67, displayName: "Stone Stairs", shape: "stairs", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "stone", hardness: 2, sound: "stone", lightOpacity: 15, lightEmission: 0, drops: ["minecraft:stone_stairs"] }),
  block({ key: "minecraft:iron_door", legacyId: 71, displayName: "Iron Door", shape: "door", renderLayer: "cutout", solid: true, selectable: true, replaceable: false, material: "metal", hardness: 5, sound: "metal", lightOpacity: 0, lightEmission: 0, drops: ["minecraft:iron_door"] }),
  block({ key: "minecraft:snow_layer", legacyId: 78, displayName: "Snow Layer", shape: "slab", renderLayer: "opaque", solid: false, selectable: true, replaceable: true, material: "topSnow", hardness: 0.1, sound: "cloth", lightOpacity: 0, lightEmission: 0, drops: ["minecraft:snow_layer"] }),
  block({ key: "minecraft:ice", legacyId: 79, displayName: "Ice", shape: "cube", renderLayer: "translucent", solid: true, selectable: true, replaceable: false, material: "ice", hardness: 0.5, sound: "glass", lightOpacity: 3, lightEmission: 0, drops: ["minecraft:ice"] }),
  block({ key: "minecraft:cactus", legacyId: 81, displayName: "Cactus", shape: "cube", renderLayer: "opaque", solid: true, selectable: true, replaceable: false, material: "cactus", hardness: 0.4, sound: "cloth", lightOpacity: 0, lightEmission: 0, drops: ["minecraft:cactus"] }),
  block({ key: "minecraft:reeds", legacyId: 83, displayName: "Sugar Cane", shape: "cross", renderLayer: "cutout", solid: false, selectable: true, replaceable: true, material: "plant", hardness: 0, sound: "grass", lightOpacity: 0, lightEmission: 0, drops: ["minecraft:reeds"] }),
  block({ key: "minecraft:oak_fence", legacyId: 85, displayName: "Oak Fence", shape: "cube", renderLayer: "cutout", solid: true, selectable: true, replaceable: false, material: "wood", hardness: 2, sound: "wood", lightOpacity: 0, lightEmission: 0, drops: ["minecraft:oak_fence"] }),
  block({ key: "minecraft:water", legacyId: 8, legacyAliases: [9], displayName: "Water", shape: "liquid", renderLayer: "translucent", solid: false, selectable: true, replaceable: true, material: "dirt", hardness: 100, sound: "silent", lightOpacity: 3, lightEmission: 0, drops: [] }),
  block({ key: "minecraft:lava", legacyId: 10, legacyAliases: [11], displayName: "Lava", shape: "liquid", renderLayer: "translucent", solid: false, selectable: true, replaceable: true, material: "dirt", hardness: 100, sound: "silent", lightOpacity: 15, lightEmission: 15, drops: [] })
];

class BlockRegistry {
  byKey = new Map;
  byLegacyId = new Map;
  constructor(entries = definitions) {
    for (const entry of entries) {
      if (!entry.key.includes(":") || entry.key.startsWith(":") || entry.key.endsWith(":")) {
        throw new TypeError("Block keys must be namespaced: " + entry.key);
      }
      if (this.byKey.has(entry.key))
        throw new Error("Duplicate block key: " + entry.key);
      validateDefinition(entry);
      const stored = Object.freeze({
        ...entry,
        legacyAliases: entry.legacyAliases ? Object.freeze([...entry.legacyAliases]) : undefined,
        drops: Object.freeze([...entry.drops])
      });
      this.byKey.set(entry.key, stored);
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
    const air = this.byKey.get("minecraft:air");
    if (!air || air.legacyId !== undefined && air.legacyId !== 0) {
      throw new Error("Registry must define minecraft:air and reserve it as the zero block");
    }
  }
  getByKey(key) {
    return this.byKey.get(key);
  }
  getIdByKey(key) {
    if (key === "minecraft:air")
      return 0;
    return this.byKey.get(key)?.legacyId;
  }
  getById(id) {
    if (!Number.isInteger(id) || id < 0 || id > 65535)
      return;
    if (id === 0)
      return this.byKey.get("minecraft:air");
    return this.byLegacyId.get(id);
  }
  getByLegacyId(id) {
    return Number.isInteger(id) ? this.byLegacyId.get(id) : undefined;
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
  if (entry.legacyAliases?.some((id) => !Number.isInteger(id) || id < 0 || id > 255))
    throw new RangeError("Legacy block aliases must be integers from 0 to 255");
  if (entry.drops.some((drop) => !drop.includes(":")))
    throw new TypeError("Drop item keys must be namespaced");
}
var defaultBlockRegistry = new BlockRegistry;

// src/game/core/fixed-step.ts
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

// src/game/inventory/inventory.ts
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
    const normalized = stack === null ? null : createStack(stack.itemKey, stack.count, stack.maxStackSize, stack.auxValue);
    const previous = this.slots[slot];
    if (sameStack(previous, normalized))
      return false;
    this.slots[slot] = normalized;
    this._revision += 1;
    return true;
  }
  insert(itemKey, count, maxStackSize = 64) {
    validateItemKey(itemKey);
    positiveInteger2(count, "count");
    positiveInteger2(maxStackSize, "maxStackSize");
    if (maxStackSize > 999)
      throw new RangeError("maxStackSize cannot exceed 999");
    for (const stack of this.slots) {
      if (stack?.itemKey === itemKey && stack.maxStackSize !== maxStackSize) {
        throw new Error("maxStackSize does not match existing stack definition for " + itemKey);
      }
    }
    let remaining = count;
    let changed = false;
    for (let index = 0;index < this.slots.length && remaining > 0; index += 1) {
      const stack = this.slots[index];
      if (!stack || stack.itemKey !== itemKey || stack.count >= stack.maxStackSize)
        continue;
      const amount = Math.min(remaining, stack.maxStackSize - stack.count);
      this.slots[index] = createStack(itemKey, stack.count + amount, maxStackSize);
      remaining -= amount;
      changed = true;
    }
    for (let index = 0;index < this.slots.length && remaining > 0; index += 1) {
      if (this.slots[index] !== null)
        continue;
      const amount = Math.min(remaining, maxStackSize);
      this.slots[index] = createStack(itemKey, amount, maxStackSize);
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
    const removed = createStack(stack.itemKey, removedCount, stack.maxStackSize);
    this.slots[slot] = removedCount === stack.count ? null : createStack(stack.itemKey, stack.count - removedCount, stack.maxStackSize);
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
function createStack(itemKey, count, maxStackSize, auxValue) {
  validateItemKey(itemKey);
  positiveInteger2(count, "count");
  positiveInteger2(maxStackSize, "maxStackSize");
  if (maxStackSize > 999)
    throw new RangeError("maxStackSize cannot exceed 999");
  if (count > maxStackSize)
    throw new RangeError("Stack count exceeds maxStackSize");
  if (auxValue !== undefined && (!Number.isInteger(auxValue) || auxValue < 0 || auxValue > 9999)) {
    throw new RangeError("auxValue must be a non-negative integer up to 9999");
  }
  return Object.freeze({ itemKey, count, maxStackSize, auxValue: auxValue ?? 0 });
}
function validateItemKey(itemKey) {
  if (typeof itemKey !== "string" || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(itemKey)) {
    throw new TypeError("itemKey must be a lowercase namespaced key");
  }
}
function positiveInteger2(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError(name + " must be a positive safe integer");
}
function sameStack(a, b) {
  return a === b || a !== null && b !== null && a.itemKey === b.itemKey && a.count === b.count && a.maxStackSize === b.maxStackSize && (a.auxValue ?? 0) === (b.auxValue ?? 0);
}

// src/game/items/tools.ts
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
function getTool(itemKey) {
  if (!itemKey)
    return null;
  return TOOL_TABLE[itemKey] ?? null;
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

// src/game/interaction/mining.ts
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
      inserted.push(Object.freeze({ itemKey: dropKey, count: result.inserted, maxStackSize: 64 }));
    if (result.remainder > 0)
      remaining.push(Object.freeze({ itemKey: dropKey, count: result.remainder, maxStackSize: 64 }));
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

// src/game/items/item-instance.ts
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

// src/game/physics/aabb.ts
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

// src/game/interaction/placement.ts
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
  const blockId = registry.getIdByKey(stack.itemKey);
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

// src/game/interaction/raycast.ts
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

// src/game/physics/collision.ts
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

// src/game/physics/player-physics.ts
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

// src/game/physics/world-collision.ts
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

// src/game/core/coordinates.ts
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

// src/game/world/chunk.ts
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

// src/game/world/world.ts
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

// src/game/persistence/save-schema.ts
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
        if (!isRecord(stack) || typeof stack.itemKey !== "string" || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(stack.itemKey) || !isBoundedInteger(stack.count, 1, 999) || !isBoundedInteger(stack.maxStackSize, 1, 999) || stack.count > stack.maxStackSize) {
          errors.push("player.inventory[" + index + "] is not a valid item stack");
          return;
        }
        const auxValue = typeof stack.auxValue === "number" && Number.isInteger(stack.auxValue) && stack.auxValue >= 0 && stack.auxValue <= 9999 ? stack.auxValue : 0;
        normalizedInventory.push(Object.freeze({ itemKey: stack.itemKey, count: stack.count, maxStackSize: stack.maxStackSize, auxValue }));
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

// src/game/persistence/world-save.ts
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
    return raycastVoxels(this.world, origin, direction, reach, (id) => this.registry.getById(id)?.selectable ?? false);
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
    const tool = getTool(stack.itemKey);
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

// src/game/rendering/chunk-mesher.ts
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

// src/game/rendering/chunk-mesh-cache.ts
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

// src/game/world/terrain-generator.ts
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
        const id = y === 0 ? ids.bedrock : y === height ? surface : y >= height - 3 ? ids.dirt : ids.stone;
        chunk.setBlock(localX, y, localZ, id);
      }
    }
  }
  return Object.freeze({ chunkX, chunkZ, minHeight, maxHeight });
}
function requireId(registry, key) {
  const id = registry.getIdByKey(key);
  if (id === undefined)
    throw new Error("Terrain requires block definition " + key);
  return id;
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

// src/game/world/terrain-streaming.ts
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

// src/game/browser-entry.ts
window.VoxelCraftEngine = VoxelCraftEngine;
window.VoxelCraftBlockRegistry = BlockRegistry;
window.VoxelCraftCreateMeshCache = (engine) => new ChunkMeshCache(engine.world, engine.registry);
window.VoxelCraftGenerateTerrainChunk = generateTerrainChunk;
window.VoxelCraftEnsureTerrainNeighborhood = ensureTerrainNeighborhood;
window.VoxelCraftGetTool = getTool;
