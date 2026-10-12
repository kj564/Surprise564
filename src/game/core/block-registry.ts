export type BlockId = number;

export interface BlockDefinition {
  readonly id: BlockId;
  readonly key: string;
  readonly solid: boolean;
  readonly selectable: boolean;
}

export const AIR_BLOCK_ID = 0;

export class BlockRegistry {
  private readonly byId = new Map<BlockId, BlockDefinition>();
  private readonly byKey = new Map<string, BlockDefinition>();

  constructor(definitions: readonly BlockDefinition[]) {
    for (const input of definitions) {
      if (!Number.isSafeInteger(input.id) || input.id < 0) {
        throw new Error(`Invalid block id: ${input.id}`);
      }
      if (!input.key.trim()) throw new Error("Block key must not be empty.");
      if (this.byId.has(input.id)) throw new Error(`Duplicate block id: ${input.id}`);
      if (this.byKey.has(input.key)) throw new Error(`Duplicate block key: ${input.key}`);
      this.byId.set(input.id, Object.freeze({ ...input }));
      this.byKey.set(input.key, Object.freeze({ ...input }));
    }

    const air = this.byId.get(AIR_BLOCK_ID);
    if (!air || air.solid || air.selectable) {
      throw new Error("Registry must define id 0 as non-solid, non-selectable air.");
    }
  }

  getById(id: BlockId): BlockDefinition | undefined {
    return this.byId.get(id);
  }

  getByKey(key: string): BlockDefinition | undefined {
    return this.byKey.get(key);
  }

  require(id: BlockId): BlockDefinition {
    const block = this.getById(id);
    if (!block) throw new Error(`Unknown block id: ${id}`);
    return block;
  }

  has(id: BlockId): boolean {
    return this.byId.has(id);
  }

  values(): readonly BlockDefinition[] {
    return [...this.byId.values()];
  }
}
