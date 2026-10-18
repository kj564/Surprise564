import type { BlockMaterial } from '../items/tools';

export type RenderLayer = 'opaque' | 'cutout' | 'translucent' | 'invisible';
export type BlockShape = 'cube' | 'slab' | 'stairs' | 'cross' | 'torch' | 'liquid' | 'door' | 'none';
export type SoundGroup = 'stone' | 'wood' | 'gravel' | 'grass' | 'glass' | 'metal' | 'sand' | 'cloth' | 'silent';

export interface BlockDefinition {
  /** Stable, namespaced identity. Never derive identity from a display label. */
  readonly key: string;
  /** Numeric ID from the inspected MCPE 2013 Tile registry, if established. */
  readonly legacyId?: number;
  /** Additional historical IDs that normalize to the same modern block/state family. */
  readonly legacyAliases?: readonly number[];
  readonly displayName: string;
  readonly shape: BlockShape;
  readonly renderLayer: RenderLayer;
  readonly solid: boolean;
  readonly selectable: boolean;
  readonly replaceable: boolean;
  /** §MCPE 2013 Material (Material.cpp:37-66). Stone/metal/snow are notAlwaysDestroyable. */
  readonly material: BlockMaterial;
  readonly hardness: number;
  readonly sound: SoundGroup;
  readonly lightOpacity: number;
  readonly lightEmission: number;
  readonly drops: readonly string[];
}

function block(definition: BlockDefinition): BlockDefinition {
  return Object.freeze({ ...definition, legacyAliases: definition.legacyAliases ? Object.freeze([...definition.legacyAliases]) : undefined, drops: Object.freeze([...definition.drops]) });
}

const definitions: readonly BlockDefinition[] = [
  block({ key: 'minecraft:air', displayName: 'Air', shape: 'none', renderLayer: 'invisible', solid: false, selectable: false, replaceable: true, material: 'air', hardness: 0, sound: 'silent', lightOpacity: 0, lightEmission: 0, drops: [] }),
  block({ key: 'minecraft:stone', legacyId: 1, displayName: 'Stone', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 1.5, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:cobblestone'] }),
  block({ key: 'minecraft:grass_block', legacyId: 2, displayName: 'Grass Block', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'dirt', hardness: 0.6, sound: 'grass', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:dirt'] }),
  block({ key: 'minecraft:dirt', legacyId: 3, displayName: 'Dirt', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'dirt', hardness: 0.5, sound: 'gravel', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:dirt'] }),
  block({ key: 'minecraft:cobblestone', legacyId: 4, displayName: 'Cobblestone', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 2, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:cobblestone'] }),
  block({ key: 'minecraft:oak_planks', legacyId: 5, displayName: 'Oak Planks', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'wood', hardness: 2, sound: 'wood', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:oak_planks'] }),
  block({ key: 'minecraft:bedrock', legacyId: 7, displayName: 'Bedrock', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: -1, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: [] }),
  block({ key: 'minecraft:sand', legacyId: 12, displayName: 'Sand', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'sand', hardness: 0.5, sound: 'sand', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:sand'] }),
  block({ key: 'minecraft:gravel', legacyId: 13, displayName: 'Gravel', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'sand', hardness: 0.6, sound: 'gravel', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:gravel'] }),
  block({ key: 'minecraft:gold_ore', legacyId: 14, displayName: 'Gold Ore', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 3, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:gold_ore'] }),
  block({ key: 'minecraft:iron_ore', legacyId: 15, displayName: 'Iron Ore', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 3, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:iron_ore'] }),
  block({ key: 'minecraft:coal_ore', legacyId: 16, displayName: 'Coal Ore', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 3, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:coal'] }),
  block({ key: 'minecraft:oak_log', legacyId: 17, displayName: 'Oak Log', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'wood', hardness: 2, sound: 'wood', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:oak_log'] }),
  block({ key: 'minecraft:oak_leaves', legacyId: 18, displayName: 'Oak Leaves', shape: 'cube', renderLayer: 'cutout', solid: true, selectable: true, replaceable: false, material: 'leaves', hardness: 0.2, sound: 'grass', lightOpacity: 1, lightEmission: 0, drops: ['minecraft:oak_leaves'] }),
  block({ key: 'minecraft:glass', legacyId: 20, displayName: 'Glass', shape: 'cube', renderLayer: 'translucent', solid: true, selectable: true, replaceable: false, material: 'glass', hardness: 0.3, sound: 'glass', lightOpacity: 0, lightEmission: 0, drops: [] }),
  block({ key: 'minecraft:lapis_ore', legacyId: 21, displayName: 'Lapis Lazuli Ore', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 3, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:lapis_lazuli'] }),
  block({ key: 'minecraft:sandstone', legacyId: 24, displayName: 'Sandstone', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 0.8, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:sandstone'] }),
  block({ key: 'minecraft:web', legacyId: 30, displayName: 'Cobweb', shape: 'cross', renderLayer: 'cutout', solid: false, selectable: true, replaceable: false, material: 'web', hardness: 4, sound: 'cloth', lightOpacity: 1, lightEmission: 0, drops: ['minecraft:string'] }),
  block({ key: 'minecraft:gold_block', legacyId: 41, displayName: 'Gold Block', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'metal', hardness: 3, sound: 'metal', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:gold_block'] }),
  block({ key: 'minecraft:iron_block', legacyId: 42, displayName: 'Iron Block', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'metal', hardness: 5, sound: 'metal', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:iron_block'] }),
  block({ key: 'minecraft:stone_slab', legacyId: 44, displayName: 'Stone Slab', shape: 'slab', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 2, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:stone_slab'] }),
  block({ key: 'minecraft:bricks', legacyId: 45, displayName: 'Bricks', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 2, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:bricks'] }),
  block({ key: 'minecraft:obsidian', legacyId: 49, displayName: 'Obsidian', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 10, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:obsidian'] }),
  block({ key: 'minecraft:torch', legacyId: 50, displayName: 'Torch', shape: 'torch', renderLayer: 'cutout', solid: false, selectable: true, replaceable: true, material: 'wood', hardness: 0, sound: 'wood', lightOpacity: 0, lightEmission: 14, drops: ['minecraft:torch'] }),
  block({ key: 'minecraft:oak_stairs', legacyId: 53, displayName: 'Oak Stairs', shape: 'stairs', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'wood', hardness: 2, sound: 'wood', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:oak_stairs'] }),
  block({ key: 'minecraft:chest', legacyId: 54, displayName: 'Chest', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'wood', hardness: 2.5, sound: 'wood', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:chest'] }),
  block({ key: 'minecraft:diamond_ore', legacyId: 56, displayName: 'Diamond Ore', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 3, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:diamond'] }),
  block({ key: 'minecraft:diamond_block', legacyId: 57, displayName: 'Diamond Block', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'metal', hardness: 5, sound: 'metal', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:diamond_block'] }),
  block({ key: 'minecraft:crafting_table', legacyId: 58, displayName: 'Crafting Table', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'wood', hardness: 2.5, sound: 'wood', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:crafting_table'] }),
  block({ key: 'minecraft:farmland', legacyId: 60, displayName: 'Farmland', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'dirt', hardness: 0.6, sound: 'gravel', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:dirt'] }),
  block({ key: 'minecraft:furnace', legacyId: 61, displayName: 'Furnace', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 3.5, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:furnace'] }),
  block({ key: 'minecraft:ladder', legacyId: 65, displayName: 'Ladder', shape: 'cross', renderLayer: 'cutout', solid: false, selectable: true, replaceable: true, material: 'wood', hardness: 0.4, sound: 'wood', lightOpacity: 0, lightEmission: 0, drops: ['minecraft:ladder'] }),
  block({ key: 'minecraft:stone_stairs', legacyId: 67, displayName: 'Stone Stairs', shape: 'stairs', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'stone', hardness: 2, sound: 'stone', lightOpacity: 15, lightEmission: 0, drops: ['minecraft:stone_stairs'] }),
  block({ key: 'minecraft:iron_door', legacyId: 71, displayName: 'Iron Door', shape: 'door', renderLayer: 'cutout', solid: true, selectable: true, replaceable: false, material: 'metal', hardness: 5, sound: 'metal', lightOpacity: 0, lightEmission: 0, drops: ['minecraft:iron_door'] }),
  block({ key: 'minecraft:snow_layer', legacyId: 78, displayName: 'Snow Layer', shape: 'slab', renderLayer: 'opaque', solid: false, selectable: true, replaceable: true, material: 'topSnow', hardness: 0.1, sound: 'cloth', lightOpacity: 0, lightEmission: 0, drops: ['minecraft:snow_layer'] }),
  block({ key: 'minecraft:ice', legacyId: 79, displayName: 'Ice', shape: 'cube', renderLayer: 'translucent', solid: true, selectable: true, replaceable: false, material: 'ice', hardness: 0.5, sound: 'glass', lightOpacity: 3, lightEmission: 0, drops: ['minecraft:ice'] }),
  block({ key: 'minecraft:cactus', legacyId: 81, displayName: 'Cactus', shape: 'cube', renderLayer: 'opaque', solid: true, selectable: true, replaceable: false, material: 'cactus', hardness: 0.4, sound: 'cloth', lightOpacity: 0, lightEmission: 0, drops: ['minecraft:cactus'] }),
  block({ key: 'minecraft:reeds', legacyId: 83, displayName: 'Sugar Cane', shape: 'cross', renderLayer: 'cutout', solid: false, selectable: true, replaceable: true, material: 'plant', hardness: 0, sound: 'grass', lightOpacity: 0, lightEmission: 0, drops: ['minecraft:reeds'] }),
  block({ key: 'minecraft:oak_fence', legacyId: 85, displayName: 'Oak Fence', shape: 'cube', renderLayer: 'cutout', solid: true, selectable: true, replaceable: false, material: 'wood', hardness: 2, sound: 'wood', lightOpacity: 0, lightEmission: 0, drops: ['minecraft:oak_fence'] }),
  block({ key: 'minecraft:water', legacyId: 8, legacyAliases: [9], displayName: 'Water', shape: 'liquid', renderLayer: 'translucent', solid: false, selectable: true, replaceable: true, material: 'dirt', hardness: 100, sound: 'silent', lightOpacity: 3, lightEmission: 0, drops: [] }),
  block({ key: 'minecraft:lava', legacyId: 10, legacyAliases: [11], displayName: 'Lava', shape: 'liquid', renderLayer: 'translucent', solid: false, selectable: true, replaceable: true, material: 'dirt', hardness: 100, sound: 'silent', lightOpacity: 15, lightEmission: 15, drops: [] }),
];

/** Immutable registry indexes; unknown IDs never silently become solid cubes. */
export class BlockRegistry {
  private readonly byKey = new Map<string, BlockDefinition>();
  private readonly byLegacyId = new Map<number, BlockDefinition>();

  constructor(entries: readonly BlockDefinition[] = definitions) {
    for (const entry of entries) {
      if (!entry.key.includes(':') || entry.key.startsWith(':') || entry.key.endsWith(':')) {
        throw new TypeError('Block keys must be namespaced: ' + entry.key);
      }
      if (this.byKey.has(entry.key)) throw new Error('Duplicate block key: ' + entry.key);
      validateDefinition(entry);
      const stored = Object.freeze({
        ...entry,
        legacyAliases: entry.legacyAliases ? Object.freeze([...entry.legacyAliases]) : undefined,
        drops: Object.freeze([...entry.drops]),
      });
      this.byKey.set(entry.key, stored);
      const legacyIds = [...(entry.legacyId === undefined ? [] : [entry.legacyId]), ...(entry.legacyAliases ?? [])];
      for (const legacyId of legacyIds) {
        if (!Number.isInteger(legacyId) || legacyId < 0 || legacyId > 255) {
          throw new RangeError('Legacy block ID must be an integer from 0 to 255');
        }
        if (this.byLegacyId.has(legacyId)) throw new Error('Duplicate legacy block ID: ' + legacyId);
        this.byLegacyId.set(legacyId, stored);
      }
    }
    const air = this.byKey.get('minecraft:air');
    if (!air || air.legacyId !== undefined && air.legacyId !== 0) {
      throw new Error('Registry must define minecraft:air and reserve it as the zero block');
    }
  }

  getByKey(key: string): BlockDefinition | undefined {
    return this.byKey.get(key);
  }

  /** Numeric storage ID for a known block key; undefined when no mapping is established. */
  getIdByKey(key: string): number | undefined {
    if (key === 'minecraft:air') return 0;
    return this.byKey.get(key)?.legacyId;
  }

  /** Runtime storage ID used by the new engine; currently equal to legacy ID where available. */
  getById(id: number): BlockDefinition | undefined {
    if (!Number.isInteger(id) || id < 0 || id > 0xffff) return undefined;
    if (id === 0) return this.byKey.get('minecraft:air');
    return this.byLegacyId.get(id);
  }

  getByLegacyId(id: number): BlockDefinition | undefined {
    return Number.isInteger(id) ? this.byLegacyId.get(id) : undefined;
  }

  values(): readonly BlockDefinition[] {
    return [...this.byKey.values()];
  }
}

function validateDefinition(entry: BlockDefinition): void {
  if (!entry.displayName.trim()) throw new TypeError('Block displayName cannot be empty');
  if (!Number.isFinite(entry.hardness) || entry.hardness < -1) throw new RangeError('Block hardness must be -1 or non-negative');
  if (!Number.isInteger(entry.lightOpacity) || entry.lightOpacity < 0 || entry.lightOpacity > 15) throw new RangeError('lightOpacity must be between 0 and 15');
  if (!Number.isInteger(entry.lightEmission) || entry.lightEmission < 0 || entry.lightEmission > 15) throw new RangeError('lightEmission must be between 0 and 15');
  if (entry.legacyAliases?.some(id => !Number.isInteger(id) || id < 0 || id > 255)) throw new RangeError('Legacy block aliases must be integers from 0 to 255');
  if (entry.drops.some(drop => !drop.includes(':'))) throw new TypeError('Drop item keys must be namespaced');
}

export const defaultBlockRegistry = new BlockRegistry();
