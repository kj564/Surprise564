/** Pure voxel coordinate helpers; world state is integer block coordinates. */
export const CHUNK_SIZE_X = 16;
export const CHUNK_SIZE_Z = 16;

export function worldToChunk(worldCoordinate: number, chunkSize = CHUNK_SIZE_X): number {
  assertInteger(worldCoordinate, 'worldCoordinate');
  assertPositiveInteger(chunkSize, 'chunkSize');
  return Math.floor(worldCoordinate / chunkSize);
}

export function worldToLocal(worldCoordinate: number, chunkSize = CHUNK_SIZE_X): number {
  assertInteger(worldCoordinate, 'worldCoordinate');
  assertPositiveInteger(chunkSize, 'chunkSize');
  return ((worldCoordinate % chunkSize) + chunkSize) % chunkSize;
}

export function chunkToWorld(chunkCoordinate: number, localCoordinate: number, chunkSize = CHUNK_SIZE_X): number {
  assertInteger(chunkCoordinate, 'chunkCoordinate');
  assertInteger(localCoordinate, 'localCoordinate');
  assertPositiveInteger(chunkSize, 'chunkSize');
  if (localCoordinate < 0 || localCoordinate >= chunkSize) throw new RangeError('localCoordinate must be within the chunk');
  return chunkCoordinate * chunkSize + localCoordinate;
}

export function localBlockIndex(localX: number, y: number, localZ: number, sizeX: number, height: number, sizeZ: number): number {
  assertInteger(localX, 'localX');
  assertInteger(y, 'y');
  assertInteger(localZ, 'localZ');
  assertPositiveInteger(sizeX, 'sizeX');
  assertPositiveInteger(height, 'height');
  assertPositiveInteger(sizeZ, 'sizeZ');
  if (localX < 0 || localX >= sizeX || localZ < 0 || localZ >= sizeZ || y < 0 || y >= height) {
    throw new RangeError('Block coordinates are outside the chunk volume');
  }
  return localX + sizeX * (localZ + sizeZ * y);
}

function assertInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value)) throw new TypeError(name + ' must be a safe integer');
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RangeError(name + ' must be a positive safe integer');
}
