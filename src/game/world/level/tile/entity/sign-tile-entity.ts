// §MCPE 2013 SignTileEntity — 1:1 port from rujukan C++ source.
// Rujukan: SignTileEntity.h + SignTileEntity.cpp

import { TileEntity, TILE_ENTITY_SIGN } from './tile-entity';

/** §SignTileEntity.h:12 — `static const int MAX_LINE_LENGTH = 15;` */
export const SIGN_MAX_LINE_LENGTH = 15;
/** §SignTileEntity.h:13 — `static const int NUM_LINES = 4;` */
export const SIGN_NUM_LINES = 4;

/**
 * §SignTileEntity.h:14-33 — Sign tile entity.
 * Stores 4 lines of text (max 15 chars each).
 */
export class SignTileEntity extends TileEntity {
  /** §SignTileEntity.h:29 — `std::string messages[NUM_LINES];` */
  messages: string[] = ['', '', '', ''];
  /** §SignTileEntity.h:30 — `int selectedLine;` */
  selectedLine = -1;
  /** §SignTileEntity.h:33 — `bool editable;` */
  private editable = true;

  constructor() {
    super(TILE_ENTITY_SIGN);
  }

  /** §SignTileEntity.h:23 — `bool save(CompoundTag* tag);` */
  save(tag: Record<string, unknown>): boolean {
    if (!super.save(tag)) return false;
    // §SignTileEntity.cpp:16-19 — save 4 text lines
    tag.Text1 = this.messages[0];
    tag.Text2 = this.messages[1];
    tag.Text3 = this.messages[2];
    tag.Text4 = this.messages[3];
    return true;
  }

  /** §SignTileEntity.h:24 — `void load(CompoundTag* tag);` */
  load(tag: Record<string, unknown>): void {
    // §SignTileEntity.cpp:24 — `editable = false;`
    this.editable = false;
    super.load(tag);
    // §SignTileEntity.cpp:27-30 — load 4 text lines
    this.messages[0] = (tag.Text1 as string) ?? '';
    this.messages[1] = (tag.Text2 as string) ?? '';
    this.messages[2] = (tag.Text3 as string) ?? '';
    this.messages[3] = (tag.Text4 as string) ?? '';
    // §SignTileEntity.cpp:32-34 — clamp to MAX_LINE_LENGTH
    for (let i = 0; i < SIGN_NUM_LINES; i++) {
      if (this.messages[i].length > SIGN_MAX_LINE_LENGTH) {
        this.messages[i] = this.messages[i].substring(0, SIGN_MAX_LINE_LENGTH);
      }
    }
  }

  /** §SignTileEntity.h:25 — `bool shouldSave();` */
  shouldSave(): boolean {
    // §SignTileEntity.cpp:37 — always save signs
    return true;
  }

  /** §SignTileEntity.h:27 — `bool isEditable();` */
  isEditable(): boolean { return this.editable; }

  /** §SignTileEntity.h:28 — `void setEditable(bool);` */
  setEditable(editable: boolean): void { this.editable = editable; }

  /** §SignTileEntity.h:29 — `void setLevelAndPos(Level*, int, int, int);` */
  setLevelAndPos(level: unknown, x: number, y: number, z: number): void {
    super.setLevelAndPos(level, x, y, z);
    // §SignTileEntity.cpp:53-55 — check if sign block still exists
    // Browser adapter: world.getBlock(x, y, z) should be sign (63)
  }
}
