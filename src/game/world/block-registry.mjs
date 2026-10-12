const REQUIRED_FIELDS = ["id", "key", "solid", "transparent", "hardness"];

export class BlockRegistry {
  #byId = new Map();
  #byKey = new Map();

  constructor(definitions) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw new TypeError("block definitions must be a non-empty array");
    }
    for (const input of definitions) {
      if (!input || typeof input !== "object") throw new TypeError("block definition must be an object");
      for (const field of REQUIRED_FIELDS) {
        if (!(field in input)) throw new TypeError(`block definition missing ${field}`);
      }
      if (!Number.isSafeInteger(input.id) || input.id < 0 || input.id > 65535) {
        throw new RangeError("block id must be an integer between 0 and 65535");
      }
      if (typeof input.key !== "string" || !/^[a-z0-9_:-]+$/.test(input.key)) {
        throw new TypeError("block key must be a stable lowercase identifier");
      }
      if (typeof input.solid !== "boolean" || typeof input.transparent !== "boolean") {
        throw new TypeError("solid and transparent must be booleans");
      }
      if (typeof input.hardness !== "number" || !Number.isFinite(input.hardness) || input.hardness < -1) {
        throw new RangeError("hardness must be a number >= -1; -1 means unbreakable");
      }
      if (this.#byId.has(input.id)) throw new Error(`duplicate block id: ${input.id}`);
      if (this.#byKey.has(input.key)) throw new Error(`duplicate block key: ${input.key}`);
      const definition = Object.freeze({
        ...input,
        drops: input.drops === undefined ? null : input.drops,
        renderLayer: input.renderLayer ?? (input.transparent ? "transparent" : "opaque"),
      });
      this.#byId.set(definition.id, definition);
      this.#byKey.set(definition.key, definition);
    }
    const air = this.#byId.get(0);
    if (!air || air.key !== "air" || air.solid) {
      throw new Error("block id 0 must be non-solid air");
    }
  }

  getById(id) {
    return this.#byId.get(id) ?? null;
  }

  getByKey(key) {
    return this.#byKey.get(key) ?? null;
  }

  hasId(id) {
    return this.#byId.has(id);
  }

  get size() {
    return this.#byId.size;
  }

  values() {
    return this.#byId.values();
  }
}

export const CORE_BLOCKS = Object.freeze([
  { id: 0, key: "air", solid: false, transparent: true, hardness: 0, renderLayer: "none" },
  { id: 1, key: "stone", solid: true, transparent: false, hardness: 1.5, sound: "stone", drops: "cobblestone" },
  { id: 2, key: "grass_block", solid: true, transparent: false, hardness: 0.6, sound: "grass", drops: "dirt" },
  { id: 3, key: "dirt", solid: true, transparent: false, hardness: 0.5, sound: "gravel" },
  { id: 4, key: "cobblestone", solid: true, transparent: false, hardness: 2, sound: "stone" },
  { id: 5, key: "oak_planks", solid: true, transparent: false, hardness: 2, sound: "wood" },
  { id: 6, key: "bedrock", solid: true, transparent: false, hardness: -1, sound: "stone" },
]);
