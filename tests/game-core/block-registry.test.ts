import { describe, expect, test } from "bun:test";
import { AIR_BLOCK_ID, BlockRegistry } from "../../src/game/core/block-registry";

const blocks = [
  { id: AIR_BLOCK_ID, key: "air", solid: false, selectable: false },
  { id: 1, key: "stone", solid: true, selectable: true },
];

describe("BlockRegistry", () => {
  test("indexes blocks by stable numeric id and key", () => {
    const registry = new BlockRegistry(blocks);
    expect(registry.require(1).key).toBe("stone");
    expect(registry.getByKey("air")?.id).toBe(0);
  });

  test("rejects duplicate ids, duplicate keys, and invalid air definitions", () => {
    expect(() => new BlockRegistry([...blocks, { id: 1, key: "dirt", solid: true, selectable: true }])).toThrow();
    expect(() => new BlockRegistry([...blocks, { id: 2, key: "stone", solid: true, selectable: true }])).toThrow();
    expect(() => new BlockRegistry([{ id: 0, key: "air", solid: true, selectable: false }])).toThrow();
  });

  test("returns undefined for unknown ids and throws on require", () => {
    const registry = new BlockRegistry(blocks);
    expect(registry.getById(99)).toBeUndefined();
    expect(() => registry.require(99)).toThrow("Unknown block id: 99");
  });
});
