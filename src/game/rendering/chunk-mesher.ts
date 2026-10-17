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
 * Builds renderer-independent surface geometry for supported legacy block shapes.
 * Shape categories follow the MCPE Tile shape taxonomy in rujukan/.../Tile.h; unsupported
 * shapes are counted, not silently approximated as full cubes. Unloaded
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
        if (!VISIBLE_LAYERS.includes(definition.renderLayer)) continue;

        if (definition.shape === 'cube') {
          for (const face of FACES) {
            const neighborId = world.getBlock(x + face.dx, y + face.dy, z + face.dz);
            if (isFaceOccluded(definition, neighborId, registry)) continue;
            appendFace(layers[definition.renderLayer], face, x, y, z, blockId);
          }
          continue;
        }

        if (definition.shape === 'slab') {
          const height = definition.shapeHeight ?? 0.5;
          appendSlab(
            layers[definition.renderLayer],
            x, y, z, blockId, height,
            face => shouldRenderSlabFace(world, registry, definition, x, y, z, height, face),
          );
          continue;
        }
        if (definition.shape === 'torch') {
          appendTorch(layers[definition.renderLayer], x, y, z, blockId);
          continue;
        }
        if (definition.shape === 'cross') {
          appendCross(layers[definition.renderLayer], x, y, z, blockId);
          continue;
        }
        unsupportedShapeBlocks += 1;
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
  // A partial-height neighbor cannot occlude a whole cube face; keep it to avoid holes.
  if (neighbor.renderLayer === 'opaque') {
    return neighbor.shape !== 'slab' || (neighbor.shapeHeight ?? 0.5) >= 1;
  }
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


/** Half-height slab geometry; orientation/state variants can extend this contract later. */
function appendSlab(layer: MutableLayer, x: number, y: number, z: number, blockId: number, h: number, shouldRender: (face: FaceTemplate) => boolean): void {
  const faces: readonly FaceTemplate[] = [
    { face: 'west', normal: [-1, 0, 0], dx: -1, dy: 0, dz: 0, vertices: [[0, 0, 0], [0, 0, 1], [0, h, 1], [0, h, 0]] },
    { face: 'east', normal: [1, 0, 0], dx: 1, dy: 0, dz: 0, vertices: [[1, 0, 1], [1, 0, 0], [1, h, 0], [1, h, 1]] },
    { face: 'down', normal: [0, -1, 0], dx: 0, dy: -1, dz: 0, vertices: [[0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1]] },
    { face: 'up', normal: [0, 1, 0], dx: 0, dy: 1, dz: 0, vertices: [[0, h, 0], [0, h, 1], [1, h, 1], [1, h, 0]] },
    { face: 'north', normal: [0, 0, -1], dx: 0, dy: 0, dz: -1, vertices: [[1, 0, 0], [0, 0, 0], [0, h, 0], [1, h, 0]] },
    { face: 'south', normal: [0, 0, 1], dx: 0, dy: 0, dz: 1, vertices: [[0, 0, 1], [1, 0, 1], [1, h, 1], [0, h, 1]] },
  ];
  for (const face of faces) if (shouldRender(face)) appendFace(layer, face, x, y, z, blockId);
}

function shouldRenderSlabFace(
  world: VoxelWorld,
  registry: BlockRegistry,
  current: BlockDefinition,
  x: number, y: number, z: number,
  height: number,
  face: FaceTemplate,
): boolean {
  const neighborId = world.getBlock(x + face.dx, y + face.dy, z + face.dz);
  if (neighborId === undefined || neighborId === 0) return true;
  const neighbor = registry.getById(neighborId);
  if (!neighbor || neighbor.renderLayer === 'invisible' || neighbor.shape === 'none') return true;
  if (face.face === 'up') {
    // A block above only touches the slab's top plane when the slab reaches full height.
    return !(height >= 1 && neighbor.renderLayer === 'opaque' &&
      (neighbor.shape !== 'slab' || (neighbor.shapeHeight ?? 0.5) >= 1));
  }
  if (face.face === 'down') {
    // A full-height block below reaches the slab's bottom plane even when this slab is partial.
    return !(neighbor.renderLayer === 'opaque' &&
      (neighbor.shape !== 'slab' || (neighbor.shapeHeight ?? 0.5) >= 1));
  }
  if (neighbor.renderLayer === 'opaque') {
    if (neighbor.shape !== 'slab') return false;
    return (neighbor.shapeHeight ?? 0.5) < height;
  }
  if (neighbor.key === current.key && neighbor.renderLayer === current.renderLayer) return false;
  if (neighbor.shape === 'slab' && neighbor.renderLayer === current.renderLayer) {
    return (neighbor.shapeHeight ?? 0.5) < height;
  }
  return true;
}

/** Narrow upright torch prism; lighting emission remains data-driven in the block registry. */
function appendTorch(layer: MutableLayer, x: number, y: number, z: number, blockId: number): void {
  const lo = 0.4375, hi = 0.5625, top = 0.75;
  const quads: readonly { vertices: readonly (readonly [number, number, number])[]; normal: readonly [number, number, number] }[] = [
    { normal: [-1, 0, 0], vertices: [[lo, 0, lo], [lo, 0, hi], [lo, top, hi], [lo, top, lo]] },
    { normal: [1, 0, 0], vertices: [[hi, 0, hi], [hi, 0, lo], [hi, top, lo], [hi, top, hi]] },
    { normal: [0, 0, -1], vertices: [[hi, 0, lo], [lo, 0, lo], [lo, top, lo], [hi, top, lo]] },
    { normal: [0, 0, 1], vertices: [[lo, 0, hi], [hi, 0, hi], [hi, top, hi], [lo, top, hi]] },
    { normal: [0, 1, 0], vertices: [[lo, top, lo], [lo, top, hi], [hi, top, hi], [hi, top, lo]] },
  ];
  for (const quad of quads) appendQuad(layer, quad.vertices, quad.normal, x, y, z, blockId);
}

/** Crossed planes for legacy cross-texture blocks such as cobweb/vegetation. */
function appendCross(layer: MutableLayer, x: number, y: number, z: number, blockId: number): void {
  const a = [[0, 0, 0], [1, 0, 1], [1, 1, 1], [0, 1, 0]] as const;
  const b = [[1, 0, 0], [0, 0, 1], [0, 1, 1], [1, 1, 0]] as const;
  appendQuad(layer, a, [0, 0, 1], x, y, z, blockId);
  appendQuad(layer, b, [0, 0, -1], x, y, z, blockId);
}

function appendQuad(
  layer: MutableLayer,
  vertices: readonly (readonly [number, number, number])[],
  normal: readonly [number, number, number],
  x: number,
  y: number,
  z: number,
  blockId: number,
): void {
  const firstVertex = layer.blockIds.length;
  for (const vertex of vertices) {
    layer.positions.push(x + vertex[0], y + vertex[1], z + vertex[2]);
    layer.normals.push(normal[0], normal[1], normal[2]);
    layer.blockIds.push(blockId);
  }
  layer.indices.push(firstVertex, firstVertex + 1, firstVertex + 2, firstVertex, firstVertex + 2, firstVertex + 3);
  layer.faceCount += 1;
}
