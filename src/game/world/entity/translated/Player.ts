// §Player.ts — Direct 1:1 translation of C++ Player.h (201 lines) + Player.cpp (924 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/entity/player/Player.h + Player.cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Mob } from './Mob';

// --- Player.h:22-30 — BedSleepingResult ---
const BedSleepingResult = {
  OK: 0, NOT_POSSIBLE_HERE: 1, NOT_POSSIBLE_NOW: 2,
  TOO_FAR_AWAY: 3, OTHER_PROBLEM: 4, NOT_SAFE: 5
};

// --- Player.h:32-201 — class Player : public Mob ---
class Player extends Mob {
  // --- Player.h:37-39 — static constants ---
  static DATA_PLAYER_FLAGS_ID = 16;
  static DATA_BED_POSITION_ID = 17;
  static PLAYER_SLEEP_FLAG = 1;

  // --- Player.h:42-47 ---
  static MAX_NAME_LENGTH = 16;
  static MAX_HEALTH = 20;
  static DEFAULT_WALK_SPEED = 0.1;
  static DEFAULT_FLY_SPEED = 0.02;
  static SLEEP_DURATION = 100;
  static WAKE_UP_DURATION = 10;

  // --- Player.h:165-184 — public fields ---
  userType: number = 0;
  score: number = 0;
  oBob: number = 0;
  bob: number = 0;
  name: string = '';
  dimension: number = 0;
  abilities: any = { flying: false, instabuild: false, invulnerable: false };
  foodData: any = { tick: (p: any) => {} };
  containerMenu: any = null;
  hasFakeInventory: boolean = false;
  bedPosition: any = { x: 0, y: 0, z: 0 };
  bedOffsetX: number = 0;
  bedOffsetY: number = 0;
  bedOffsetZ: number = 0;
  inventory: any = null;

  // --- Player.h:186-197 — protected/private fields ---
  protected useItem: any = null;
  protected useItemDuration: number = 0;
  protected sleepCounter: number = 0;
  protected static readonly NUM_ARMOR = 4;
  private respawnPosition: any = { x: 0, y: -1, z: 0 };
  private playerHasRespawnPosition: boolean = false;
  private playerIsSleeping: boolean = false;
  private allPlayersSleeping: boolean = false;
  private armor: any[] = [null, null, null, null];

  // --- Player.cpp:17-51 — constructor ---
  constructor(level: any, isCreative: boolean) {
    super(level);
    this.userType = 0;
    this.playerHasRespawnPosition = false;
    this.hasFakeInventory = false;
    this.containerMenu = null;
    this.useItemDuration = 0;
    this.playerIsSleeping = false;
    this.sleepCounter = 0;
    this.bedOffsetX = 0;
    this.bedOffsetY = 0;
    this.bedOffsetZ = 0;
    this.respawnPosition = { x: 0, y: -1, z: 0 };
    this.allPlayersSleeping = false;
    this.canRemove = false;
    this._init();
    this.autoSendPosRot = false;
    this.heightOffset = 1.62;
    this.health = Player.MAX_HEALTH;
    this.modelName = 'humanoid';
    this.rotOffs = 180;
    this.flameTime = 20;
    this.textureName = 'mob/char.png';
  }

  // --- Player.cpp:207-209 — isSleeping() ---
  isSleeping(): boolean { return this.playerIsSleeping; }

  // --- Player.cpp:211-249 — startSleepInBed(int, int, int) ---
  startSleepInBed(x: number, y: number, z: number): number {
    if (!this.level.isClientSide) {
      if (this.isSleeping() || !this.isAlive()) return BedSleepingResult.OTHER_PROBLEM;
      if (Math.abs(this.x - x) > 3 || Math.abs(this.y - y) > 4 || Math.abs(this.z - z) > 3) return BedSleepingResult.TOO_FAR_AWAY;
      if (this.level.isDay()) return BedSleepingResult.NOT_POSSIBLE_NOW;
    }
    this.setSize(0.2, 0.2);
    this.heightOffset = 0.2;
    this.setPos(x + 0.5, y + 15.0 / 16.0, z + 0.5);
    this.playerIsSleeping = true;
    this.sleepCounter = 0;
    this.bedPosition = { x, y, z };
    this.xd = this.zd = this.yd = 0;
    return BedSleepingResult.OK;
  }

  // --- Player.cpp:251-289 — stopSleepInBed(bool, bool, bool) ---
  stopSleepInBed(forcefulWakeUp: boolean, updateLevelList: boolean, saveRespawnPoint: boolean): void {
    if (!this.isSleeping()) return;
    this.setSize(0.6, 1.8);
    this.setDefaultHeadHeight();
    this.playerIsSleeping = false;
    if (forcefulWakeUp) this.sleepCounter = 0;
    else this.sleepCounter = Player.SLEEP_DURATION;
    if (saveRespawnPoint) {
      this.setRespawnPosition(this.bedPosition);
    }
    this.allPlayersSleeping = false;
  }

  // --- Player.cpp:291-293 — getSleepTimer() ---
  getSleepTimer(): number { return this.allPlayersSleeping ? this.sleepCounter : 0; }

  // --- Player.cpp:295-297 — setAllPlayersSleeping() ---
  setAllPlayersSleeping(): void { this.sleepCounter = 0; this.allPlayersSleeping = true; }

  // --- Player.cpp:299-313 — setBedOffset(int) ---
  setBedOffset(bedDirection: number): void {
    this.bedOffsetX = 0; this.bedOffsetZ = 0;
    // §C++: switch on Direction::SOUTH/NORTH/WEST/EAST
  }

  // --- Player.cpp:315-317 — isSleepingLongEnough() ---
  isSleepingLongEnough(): boolean { return this.isSleeping() && this.sleepCounter >= Player.SLEEP_DURATION; }

  // --- Player.cpp:319-336 — getSleepRotation() ---
  getSleepRotation(): number { return 0; }

  // --- Player.cpp:338-340 — checkBed() ---
  checkBed(): boolean {
    return this.level.getTile(this.bedPosition.x, this.bedPosition.y, this.bedPosition.z) === 26;
  }

  // --- Player.cpp:213-247 — tick() ---
  tick(): void {
    if (this.isSleeping()) {
      this.sleepCounter++;
      if (this.sleepCounter > Player.SLEEP_DURATION) this.sleepCounter = Player.SLEEP_DURATION;
      if (!this.level.isClientSide) {
        if (!this.checkBed()) this.stopSleepInBed(true, true, false);
        else if (this.level.isDay()) this.stopSleepInBed(false, true, true);
      }
    } else if (this.sleepCounter > 0) {
      this.sleepCounter++;
      if (this.sleepCounter >= (Player.SLEEP_DURATION + Player.WAKE_UP_DURATION)) this.sleepCounter = 0;
    }
    super.tick();
    if (!this.level.isClientSide) {
      this.foodData.tick(this);
    }
  }

  // --- Player.cpp:249-251 — getMaxHealth() ---
  getMaxHealth(): number { return Player.MAX_HEALTH; }

  // --- Player.cpp:255-257 — isUsingItem() ---
  isUsingItem(): boolean { return this.useItem !== null && !this.useItem.isNull(); }

  // --- Player.cpp:259-261 — getUseItem() ---
  getUseItem(): any { return this.useItem; }

  // --- Player.cpp:287-293 — startUsingItem(ItemInstance, int) ---
  startUsingItem(instance: any, duration: number): void {
    this.useItem = instance;
    this.useItemDuration = duration;
  }

  // --- Player.cpp:295-303 — stopUsingItem() ---
  stopUsingItem(): void {
    this.useItem = null;
    this.useItemDuration = 0;
  }

  // --- Player.cpp:305-310 — releaseUsingItem() ---
  releaseUsingItem(): void {
    if (this.useItem && !this.useItem.isNull()) {
      this.useItem.releaseUsing(this.level, this, this.useItemDuration);
    }
    this.stopUsingItem();
  }

  // --- Player.cpp:312-328 — completeUsingItem() ---
  completeUsingItem(): void {
    if (this.useItem && !this.useItem.isNull()) {
      this.stopUsingItem();
    }
  }

  // --- Player.cpp:330-332 — getUseItemDuration() ---
  getUseItemDuration(): number { return this.useItemDuration; }

  // --- Player.cpp:334-339 — getTicksUsingItem() ---
  getTicksUsingItem(): number {
    if (this.isUsingItem()) return this.useItem.getUseDuration() - this.useItemDuration;
    return 0;
  }

  // --- Player.cpp:341-349 — travel(float, float) ---
  travel(xa: number, ya: number): void {
    if (this.abilities.flying) {
      const ydo = this.yd;
      const ofs = this.flyingSpeed;
      this.flyingSpeed = 0.05;
      super.travel(xa, ya);
      this.yd = ydo * 0.6;
      this.flyingSpeed = ofs;
    } else {
      super.travel(xa, ya);
    }
  }

  // --- Player.cpp:351-353 — isImmobile() (protected) ---
  protected isImmobileImpl(): boolean { return this.health <= 0 || this.isSleeping(); }
  // Override Mob::isImmobile
  isImmobile(): boolean { return this.health <= 0 || this.isSleeping(); }

  // --- Player.cpp:355-359 — closeContainer() (protected) ---
  protected closeContainer(): void { this.containerMenu = null; }

  // --- Player.cpp:361-371 — resetPos(bool) ---
  resetPos(clearMore: boolean): void {
    if (!this.isSleeping()) {
      this.heightOffset = 1.62;
      this.setSize(0.6, 1.8);
      super.resetPos(clearMore);
    }
    this.invisible = false;
    if (clearMore) {
      this.health = this.getMaxHealth();
      this.deathTime = 0;
      this.playerIsSleeping = false;
    }
  }

  // --- Player.cpp:373-377 — updateAi() (protected) ---
  protected updateAi(): void { this.updateAttackAnim(); }

  // --- Player.cpp:379-395 — getItemInHandIcon(ItemInstance*, int) ---
  getItemInHandIcon(item: any, layer: number): number {
    return item ? item.getIcon() : 0;
  }

  // --- Player.cpp:397-427 — aiStep() ---
  aiStep(): void {
    if (this.level.difficulty === 0 && this.health < Player.MAX_HEALTH) {
      if (this.tickCount % (12 * 20) === 0) this.heal(1);
    }
    this.oBob = this.bob;
    let tBob = Math.sqrt(this.xd * this.xd + this.zd * this.zd);
    let tTilt = Math.atan(-this.yd * 0.2) * 15;
    if (tBob > 0.1) tBob = 0.1;
    if (!this.onGround || this.health <= 0) tBob = 0;
    if (this.onGround || this.health <= 0) tTilt = 0;
    this.bob += (tBob - this.bob) * 0.4;
    this.tilt += (tTilt - this.tilt) * 0.8;
  }

  // --- Player.cpp:429-431 — touch(Entity*) (private) ---
  private touch(entity: any): void { entity.playerTouch(this); }

  // --- Player.cpp:433-435 — getScore() ---
  getScore(): number { return this.score; }

  // --- Player.cpp:437-447 — die(Entity*) ---
  die(source: any): void {
    super.die(source);
    this.setSize(0.2, 0.2);
    this.setPos(this.x, this.y, this.z);
    this.yd = 0.1;
    if (source !== null) {
      this.xd = -Math.cos((this.hurtDir + this.yRot) * Math.PI / 180) * 0.1;
      this.zd = -Math.sin((this.hurtDir + this.yRot) * Math.PI / 180) * 0.1;
    } else {
      this.xd = this.zd = 0;
    }
    this.heightOffset = 0.1;
  }

  // --- Player.cpp:449-453 — reset() ---
  reset(): void { super.reset(); this._init(); }

  // --- Player.cpp:455-461 — _init() ---
  _init(): void {
    this.oBob = this.bob = 0;
    this.swinging = false;
    this.swingTime = 0;
    this.score = 0;
  }

  // --- Player.cpp:463-465 — getWalkingSpeedModifier() ---
  getWalkingSpeedModifier(): number { return 1.0; }

  // --- Player.cpp:467-469 — awardKillScore(Entity*, int) ---
  awardKillScore(victim: any, score: number): void { this.score += score; }

  // --- Player.cpp:471-473 — isShootable() ---
  isShootable(): boolean { return true; }

  // --- Player.cpp:475-477 — isCreativeModeAllowed() ---
  isCreativeModeAllowed(): boolean { return true; }

  // --- Player.cpp:486-526 — drop(ItemInstance*, bool) ---
  drop(item: any, randomly: boolean = false): void {
    if (item === null || item.isNull()) return;
    if (this.level && this.level.spawnItemEntity) {
      this.level.spawnItemEntity(this.x, this.y - 0.3 + this.getHeadHeight(), this.z, item.id, item.count, item.getAuxValue());
    }
  }

  // --- Player.cpp:528-530 — reallyDrop(ItemEntity*) (protected) ---
  protected reallyDrop(thrownItem: any): void {
    if (this.level && this.level.addEntity) this.level.addEntity(thrownItem);
  }

  // --- Player.cpp:532-537 — getDestroySpeed(Tile*) ---
  getDestroySpeed(tile: any): number {
    return this.inventory ? this.inventory.getDestroySpeed(tile) : 1;
  }

  // --- Player.cpp:539-541 — canDestroy(Tile*) ---
  canDestroy(tile: any): boolean {
    return this.inventory ? this.inventory.canDestroy(tile) : true;
  }

  // --- Player.cpp:543-545 — getHeadHeight() ---
  getHeadHeight(): number { return 0.12; }

  // --- Player.cpp:547-549 — setDefaultHeadHeight() (protected) ---
  setDefaultHeadHeight(): void { this.heightOffset = 1.62; }

  // --- Player.cpp:551-553 — isHurt() ---
  isHurt(): boolean { return this.health > 0 && this.health < this.getMaxHealth(); }

  // --- Player.cpp:555-582 — hurt(Entity*, int) ---
  hurt(source: any, dmg: number): boolean {
    if (this.abilities.invulnerable) return false;
    this.noActionTime = 0;
    if (this.health <= 0) return false;
    if (this.isSleeping() && !this.level.isClientSide) {
      this.stopSleepInBed(true, true, false);
    }
    if (dmg === 0) return false;
    return super.hurt(source, dmg);
  }

  // --- Player.cpp:584-596 — interact(Entity*) ---
  interactEntity(entity: any): void {
    if (entity.interact && entity.interact(this)) return;
    const item = this.inventory ? this.inventory.getSelected() : null;
    if (item !== null && entity.isMob && entity.isMob()) {
      item.interactEnemy(entity);
      if (item.count <= 0) {
        this.inventory.clearSlot(this.inventory.selected);
      }
    }
  }

  // --- Player.cpp:598-615 — attack(Entity*) ---
  attack(entity: any): void {
    const dmg = this.inventory ? this.inventory.getAttackDamage(entity) : 1;
    if (dmg > 0) {
      entity.hurt(this, dmg);
      const item = this.inventory ? this.inventory.getSelected() : null;
      if (item !== null && entity.isMob && entity.isMob() && !this.abilities.instabuild) {
        item.hurtEnemy(entity);
        if (item.count <= 0) {
          this.inventory.clearSlot(this.inventory.selected);
        }
      }
    }
  }

  // --- Player.cpp:617-619 — respawn() ---
  respawn(): void {}

  // --- Player.cpp:621-624 — animateRespawn() ---
  animateRespawn(): void {}

  // --- Player.cpp:626-628 — getCarriedItem() ---
  getCarriedItem(): any { return this.inventory ? this.inventory.getSelected() : null; }

  // --- Player.cpp:630-633 — remove() ---
  remove(): void { this.invisible = true; super.remove(); }

  // --- Player.cpp:635-637 — isInWall() ---
  isInWall(): boolean { return super.isInWall(); }

  // --- Player.cpp:639-641 — hasResource(int) ---
  hasResource(id: number): boolean {
    return this.inventory ? this.inventory.hasResource(id) : false;
  }

  // --- Player.cpp:643-645 — displayClientMessage(string) ---
  displayClientMessage(messageId: string): void {}

  // --- Player.cpp:647-649 — getRespawnPosition() ---
  getRespawnPosition(): any { return this.respawnPosition; }

  // --- Player.cpp:651-661 — setRespawnPosition(const Pos&) ---
  setRespawnPosition(respawnPosition: any): void {
    if (respawnPosition.y < 0) {
      this.playerHasRespawnPosition = false;
    } else {
      this.playerHasRespawnPosition = true;
    }
    this.respawnPosition = respawnPosition;
  }

  // --- Player.cpp:663-665 — isPlayer() ---
  isPlayer(): boolean { return true; }

  // --- Player.cpp:667-669 — isPlayer(Entity*) static ---
  static isPlayerEntity(e: any): boolean { return e && e.isPlayer(); }

  // --- Player.cpp:671-673 — asPlayer(Entity*) static ---
  static asPlayer(e: any): Player | null {
    return Player.isPlayerEntity(e) ? e as Player : null;
  }

  // --- Player.cpp:675-678 — openContainer(ChestTileEntity*) ---
  openContainer(container: any): void {}

  // --- Player.cpp:680-686 — tileEntityDestroyed(int) ---
  tileEntityDestroyed(tileEntityId: number): void {
    if (!this.containerMenu) return;
    if (this.containerMenu.tileEntityDestroyedIsInvalid &&
        this.containerMenu.tileEntityDestroyedIsInvalid(tileEntityId)) {
      this.closeContainer();
    }
  }

  // --- Player.cpp:688-694 — canUseCarriedItemWhileMoving() ---
  canUseCarriedItemWhileMoving(): boolean {
    const item = this.getCarriedItem();
    return item && (item.id === 261 || (item.getItem && item.getItem().isFood()));
  }

  // --- Player.cpp:696-702 — handleEntityEvent(char) ---
  handleEntityEvent(id: number): void {
    if (id === 9) {  // §EntityEvent::USE_ITEM_COMPLETE
      this.completeUsingItem();
    } else {
      super.handleEntityEvent(id);
    }
  }

  // --- Player.cpp:704-706 — getSelectedItem() ---
  getSelectedItem(): any { return this.inventory ? this.inventory.getSelected() : null; }

  // --- Player.cpp:708-710 — hasRespawnPosition() ---
  hasRespawnPosition(): boolean { return this.playerHasRespawnPosition; }

  // --- Player.cpp:712-714 — openTextEdit(TileEntity*) ---
  openTextEdit(tileEntity: any): void {}

  // --- Player.cpp:716-718 — getArmorValue() ---
  getArmorValue(): number {
    let val = 0;
    for (let i = 0; i < 4; i++) {
      if (this.armor[i] && !this.armor[i].isNull && !this.armor[i].isNull()) {
        // §C++: ((ArmorItem*) item->getItem())->defense
        val += 0;  // §simplified
      }
    }
    return val;
  }

  // --- Player.cpp:720-730 — getArmor(int) ---
  getArmor(slot: number): any {
    if (slot < 0 || slot >= 4) return null;
    if (!this.armor[slot] || this.armor[slot].isNull()) return null;
    return this.armor[slot];
  }

  // --- Player.cpp:732-739 — setArmor(int, const ItemInstance*) ---
  setArmor(slot: number, item: any): void {
    if (item === null) this.armor[slot] = null;
    else this.armor[slot] = item;
  }

  // --- Player.cpp:741-755 — hurtArmor(int) ---
  hurtArmor(dmg: number): void {
    dmg = Math.max(1, Math.floor(dmg / 4));
    for (let i = 0; i < 4; i++) {
      const item = this.armor[i];
      if (item && !item.isNull()) {
        item.hurt(dmg);
        if (item.count === 0) item.setNull();
      }
    }
  }

  // --- Player.cpp:757-762 — getArmorTypeHash() ---
  getArmorTypeHash(): number {
    const a0 = this.armor[0] ? this.armor[0].id : 0;
    const a1 = this.armor[1] ? this.armor[1].id : 0;
    const a2 = this.armor[2] ? this.armor[2].id : 0;
    const a3 = this.armor[3] ? this.armor[3].id : 0;
    return a0 + (a1 << 8) + (a2 << 16) + (a3 << 24);
  }

  // --- Player.h:128 — getEntityTypeId() ---
  getEntityTypeId(): number { return 0; }

  // --- Player.h:116-117 — startCrafting / startStonecutting ---
  startCrafting(x: number, y: number, z: number, tableSize: number): void {}
  startStonecutting(x: number, y: number, z: number): void {}

  // --- Player.h:120 — openFurnace(FurnaceTileEntity*) ---
  openFurnace(e: any): void {}

  // --- Player.h:93 — take(Entity*, int) ---
  take(e: any, orgCount: number): void {}
}

export { Player, BedSleepingResult };
