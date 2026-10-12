import type { BlockDefinition, BlockRegistry, RenderLayer } from '../blocks/registry';
import type { VoxelWorld } from '../world/world';

export type CubeFace = 'west' | 'east' | 'down' | 'up' | 'north' | 'south';

export interface ChunkMeshLayer {
  readonly renderLayer: Exclude<RenderLayer, 'invisible'>;
  /** World-space XYZ positions, four vertices per visible quad. */
  readonly positions: Float32Array;
  /** One flat normal per vertex, matching positions. */
  readonly normals: Float32Array;
  /** Legacy numeric block ID repeated for each vertex; renderer maps it to atlas/material data. */
  readonly blockIds: Uint16Array;
  /** Six indices per quad. */
  readonly indices: Uint32Array;
  readonly faceCount: number;
}

export interface ChunkMeshData {
  readonly chunkX: number;
  readonly chunkZ: number;
  readonly layers: Readonly<Partial<Record<Exclude<RenderLayer, 'invisible'>, ChunkMeshLayer>>>;
  readonly unsupportedShapeBlocks: number;
  readonly unknownBlockIds: number;
}

interface FaceTemplate {
  readonly face: CubeFace;
  readonly normal: readonly [number, number, number];
  readonly vertices: readonly (readonly [number, number, number])[];
  readonly dx: number;
  readonly dy: number;
  readonly dz: number;
}

const FACES: readonly FaceTemplate[] = Object.freeze([
  { face: 'west', normal: [-1, 0, 0], dx: -1, dy: 0, dz: 0, vertices: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
  { face: 'east', normal: [1, 0, 0], dx: 1, dy: 0, dz: 0, vertices: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]] },
  { face: 'down', normal: [0, -1, 0], dx: 0, dy: -1, dz: 0, vertices: [[0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1]] },
  { face: 'up', normal: [0, 1, 0], dx: 0, dy: 1, dz: 0, vertices: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]] },
  { face: 'north', normal: [0, 0, -1], dx: 0, dy: 0, dz: -1, vertices: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
  { face: 'south', normal: [0, 0, 1], dx: 0, dy: 0, dz: 1, vertices: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
]);

type MutableLayer = {
  positions: number[];
  normals: number[];
  blockIds: number[];
  indices: number[];
  faceCount: number;
};

const VISIBLE_LAYERS = ['opaque', 'cutout', 'translucent'] as const;

/**
 * Builds renderer-independent surface geometry for cube blocks in one loaded chunk.
 * Non-cube shapes are counted, not silently approximated as full cubes. Unloaded
 * neighbors are treated as exposed surfaces and will be remeshed when the neighbor loads.
 */
export function buildChunkMesh(
  world: VoxelWorld,
  chunkX: number,
  chunkZ: number,
  registry: BlockRegistry,
): ChunkMeshData {
  if (!world.hasChunk(chunkX, chunkZ)) throw new Error('Cannot mesh an unloaded chunk: ' + chunkX + ',' + chunkZ);

  const dimensions = world.dimensions;
  const baseX = chunkX * dimensions.chunkSizeX;
  const baseZ = chunkZ * dimensions.chunkSizeZ;
  const layers: Record<Exclude<RenderLayer, 'invisible'>, MutableLayer> = {
    opaque: emptyLayer(), cutout: emptyLayer(), translucent: emptyLayer(),
  };
  let unsupportedShapeBlocks = 0;
  let unknownBlockIds = 0;

  for (let localX = 0; localX < dimensions.chunkSizeX; localX += 1) {
    for (let y = 0; y < dimensions.height; y += 1) {
      for (let localZ = 0; localZ < dimensions.chunkSizeZ; localZ += 1) {
        const x = baseX + localX;
        const z = baseZ + localZ;
        const blockId = world.getBlock(x, y, z);
        if (blockId === undefined || blockId === 0) continue;
        const definition = registry.getById(blockId);
        if (!definition) { unknownBlockIds += 1; continue; }
        if (definition.renderLayer === 'invisible' || definition.shape === 'none') continue;
        if (definition.shape !== 'cube') { unsupportedShapeBlocks += 1; continue; }
        if (!VISIBLE_LAYERS.includes(definition.renderLayer)) continue;

        for (const face of FACES) {
          const neighborId = world.getBlock(x + face.dx, y + face.dy, z + face.dz);
          if (isFaceOccluded(definition, neighborId, registry)) continue;
          appendFace(layers[definition.renderLayer], face, x, y, z, blockId);
        }
      }
    }
  }

  const output: Partial<Record<Exclude<RenderLayer, 'invisible'>, ChunkMeshLayer>> = {};
  for (const layerName of VISIBLE_LAYERS) {
    const layer = layers[layerName];
    if (layer.faceCount === 0) continue;
    output[layerName] = Object.freeze({
      renderLayer: layerName,
      positions: Float32Array.from(layer.positions),
      normals: Float32Array.from(layer.normals),
      blockIds: Uint16Array.from(layer.blockIds),
      indices: Uint32Array.from(layer.indices),
      faceCount: layer.faceCount,
    });
  }

  return Object.freeze({
    chunkX, chunkZ,
    layers: Object.freeze(output),
    unsupportedShapeBlocks,
    unknownBlockIds,
  });
}

function isFaceOccluded(current: BlockDefinition, neighborId: number | undefined, registry: BlockRegistry): boolean {
  if (neighborId === undefined || neighborId === 0) return false;
  const neighbor = registry.getById(neighborId);
  if (!neighbor || neighbor.renderLayer === 'invisible' || neighbor.shape === 'none') return false;
  if (neighbor.renderLayer === 'opaque') return true;
  return current.key === neighbor.key && current.renderLayer === neighbor.renderLayer;
}

function emptyLayer(): MutableLayer {
  return { positions: [], normals: [], blockIds: [], indices: [], faceCount: 0 };
}

function appendFace(layer: MutableLayer, face: FaceTemplate, x: number, y: number, z: number, blockId: number): void {
  const firstVertex = layer.blockIds.length;
  for (const vertex of face.vertices) {
    layer.positions.push(x + vertex[0], y + vertex[1], z + vertex[2]);
    layer.normals.push(face.normal[0], face.normal[1], face.normal[2]);
    layer.blockIds.push(blockId);
  }
  layer.indices.push(firstVertex, firstVertex + 1, firstVertex + 2, firstVertex, firstVertex + 2, firstVertex + 3);
  layer.faceCount += 1;
}
