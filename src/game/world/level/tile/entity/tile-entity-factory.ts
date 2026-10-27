// §TileEntityFactory — 1:1 port from rujukan C++ source.
// Rujukan: TileEntity.h:21 — `static TileEntity* createTileEntity(int type);`

import type { TileEntity } from './tile-entity';
import { TILE_ENTITY_FURNACE, TILE_ENTITY_CHEST, TILE_ENTITY_SIGN } from './tile-entity';
import { FurnaceTileEntity } from './furnace-tile-entity';
import { ChestTileEntity } from './chest-tile-entity';
import { SignTileEntity } from './sign-tile-entity';

/** §TileEntity.h:21 — `static TileEntity* createTileEntity(int type);` */
export function createTileEntity(type: number): TileEntity | null {
  switch (type) {
    case TILE_ENTITY_FURNACE: return new FurnaceTileEntity();
    case TILE_ENTITY_CHEST: return new ChestTileEntity();
    case TILE_ENTITY_SIGN: return new SignTileEntity();
    default: return null;
  }
}
