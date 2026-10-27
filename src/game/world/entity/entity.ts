// §MCPE 2013 Entity base class — 1:1 port from rujukan C++ source.
//
// Rujukan source files (Rule Zero — read line-by-line):
//   Entity.h:23-224   — Entity class declaration (fields + virtuals)
//   Entity.cpp:15-72  — constructor / _init / setPos(0,0,0)
//   Entity.cpp:137-359 — Entity::move (collide-and-slide with footSize)
//   Entity.cpp:391-399 — Entity::setPos (rebuild AABB)
//   Entity.cpp:429-433 — Entity::setSize (set bbWidth/bbHeight)
//   Entity.cpp:463-534 — Entity::tick / baseTick (fire, lava, water, void)
//   Entity.cpp:541-564 — checkFallDamage / causeFallDamage (no-op base)
//   Entity.cpp:570-590 — getHeadHeight / moveRelative
//   Entity.cpp:607-637 — distanceTo / distanceToSqr
//   Entity.cpp:683-687 — Entity::hurt (markHurt + false)
//   Entity.cpp:744-757 — isAlive / getShadowHeightOffs
//   Entity.cpp:801-817 — lavaHurt / burn
//   Entity.cpp:920-922 — isOnFire
//
// The renderer is selected browser-side from `entityRendererId`; this class
// carries only the discriminator (no Three.js imports anywhere in the tree).

import { Aabb } from '../physics/aabb';
import { TICKS_PER_SECOND } from '../../constants';
import type { EntityLevel, Random } from './level';
import {
  EntityRendererId,
  DATA_AIR_SUPPLY_ID,
  type EntityPos,
} from './types';

/** §Entity.h:27 — `static const int TOTAL_AIR_SUPPLY = 15 * SharedConstants::TicksPerSecond;` = 300. */
export const TOTAL_AIR_SUPPLY = 15 * TICKS_PER_SECOND;

/** §Entity.h:222 — `static const int DATA_AIR_SUPPLY_ID = 1;` (re-exported here for callers). */
export { DATA_AIR_SUPPLY_ID };

/** §Mth.h:13 — `extern const float RADDEG;` = 180 / PI (radians→degrees). */
const RADDEG = 180 / Math.PI;
/** §Mth.h:14 — `extern const float DEGRAD;` = PI / 180 (degrees→radians). */
const DEGRAD = Math.PI / 180;

/**
 * §Entity.h:23-224 — abstract Entity base. Mirrors the C++ class field-for-field
 * so the same per-tick physics + fire/lava/void behaviour is reproduced.
 *
 * Pure game logic: no rendering, no networking. `level` is an `EntityLevel`
 * adapter (the engine composition root wires VoxelWorld into one). Methods
 * that would render or send packets (sound/particle/spawnAtLocation) are
 * routed through the level adapter so they remain no-op safe in tests.
 */
export abstract class Entity {
  // === Static state (§Entity.h:26-27, 213) ===
  /** §Entity.h:26 — `static int entityCounter = 0;` (§Entity.cpp:11) — incremented per ctor. */
  static entityCounter = 0;
  /** §Entity.h:213 — `static Random sharedRandom;` (§Entity.cpp:13 seeded from getEpochTimeS()). */
  static sharedRandom: Random = {
    nextFloat: () => Math.random(),
    nextInt: (n: number) => Math.floor(Math.random() * n),
  };

  /** §Entity.h:152 — `float x, y, z;` — entity position (feet for mobs). */
  x = 0;
  y = 0;
  z = 0;
  /** §Entity.h:154 — `int xChunk, yChunk, zChunk;` — cached chunk coords (unused in pure logic). */
  xChunk = 0;
  yChunk = 0;
  zChunk = 0;

  /** §Entity.h:156 — `int entityId;` — assigned in ctor via `++entityCounter`. */
  readonly entityId: number;

  /** §Entity.h:158 — `float viewScale;` (default 1). */
  viewScale = 1.0;

  /** §Entity.h:160 — `Level* level;` — possibly null (e.g. item preview). */
  level: EntityLevel | null;

  /** §Entity.h:161 — `float xo, yo, zo;` — previous-tick position. */
  xo = 0;
  yo = 0;
  zo = 0;
  /** §Entity.h:162 — `float xd, yd, zd;` — per-tick velocity. */
  xd = 0;
  yd = 0;
  zd = 0;
  /** §Entity.h:163 — `float yRot, xRot;` — yaw/pitch (degrees). */
  yRot = 0;
  xRot = 0;
  /** §Entity.h:164 — `float yRotO, xRotO;` — previous-tick rotation. */
  yRotO = 0;
  xRotO = 0;

  /** §Entity.h:166 — `AABB bb;` — current bounding box (mutable, updated by setPos). */
  bb: Aabb = new Aabb(0, 0, 0, 0, 0, 0);

  /** §Entity.h:168 — `float heightOffset;` = `0 / 16.0f` = 0. */
  heightOffset = 0;

  /** §Entity.h:170 — `float bbWidth;` default 0.6 (§Entity.cpp:31). */
  bbWidth = 0.6;
  /** §Entity.h:171 — `float bbHeight;` default 1.8 (§Entity.cpp:32). */
  bbHeight = 1.8;

  /** §Entity.h:173 — `float walkDistO;` previous-tick walk distance. */
  walkDistO = 0;
  /** §Entity.h:174 — `float walkDist;` cumulative walk distance (drives step sound). */
  walkDist = 0;

  /** §Entity.h:176 — `float xOld, yOld, zOld;` previous render-frame position. */
  xOld = 0;
  yOld = 0;
  zOld = 0;
  /** §Entity.h:177 — `float ySlideOffset;` — auto-step slide offset. */
  ySlideOffset = 0;
  /** §Entity.h:178 — `float footSize;` — auto-step foot height. */
  footSize = 0;
  /** §Entity.h:179 — `float pushthrough;` — push-back mitigation (0..1). */
  pushthrough = 0;

  /** §Entity.h:181 — `int tickCount;` — incremented every baseTick. */
  tickCount = 0;
  /** §Entity.h:182 — `int invulnerableTime;` */
  invulnerableTime = 0;
  /** §Entity.h:183 — `int airSupply;` initialised in ctor to TOTAL_AIR_SUPPLY (§Entity.cpp:42). */
  airSupply = TOTAL_AIR_SUPPLY;
  /** §Entity.h:184 — `int onFire;` — remaining fire ticks (positive = burning). */
  onFire = 0;
  /** §Entity.h:185 — `int flameTime;` default 1 (§Entity.cpp:57). */
  flameTime = 1;

  /** §Entity.h:187 — `EntityRendererId entityRendererId;` default Default (§Entity.cpp:60). */
  entityRendererId: EntityRendererId = EntityRendererId.Default;

  /** §Entity.h:197 — `float fallDistance;` */
  fallDistance = 0;
  /** §Entity.h:198 — `bool blocksBuilding;` default false (§Entity.cpp:18). */
  blocksBuilding = false;
  /** §Entity.h:199 — `bool inChunk;` */
  inChunk = false;

  /** §Entity.h:201 — `bool onGround;` */
  onGround = false;
  /** §Entity.h:202 — `bool horizontalCollision, verticalCollision;` */
  horizontalCollision = false;
  verticalCollision = false;
  /** §Entity.h:203 — `bool collision;` */
  collision = false;
  /** §Entity.h:204 — `bool hurtMarked;` */
  hurtMarked = false;

  /** §Entity.h:206 — `bool slide;` default true (§Entity.cpp:23). */
  slide = true;
  /** §Entity.h:207 — `bool removed;` */
  removed = false;
  /** §Entity.h:208 — `bool noPhysics;` */
  noPhysics = false;
  /** §Entity.h:209 — `bool canRemove;` default true (§Entity.cpp:27). */
  canRemove = true;
  /** §Entity.h:210 — `bool invisible;` */
  invisible = false;
  /** §Entity.h:211 — `bool reallyRemoveIfPlayer;` */
  reallyRemoveIfPlayer = false;

  // === protected (§Entity.h:212-223) ===
  /** §Entity.h:214 — `int airCapacity;` = TOTAL_AIR_SUPPLY (§Entity.cpp:41). */
  protected airCapacity = TOTAL_AIR_SUPPLY;
  /** §Entity.h:215 — `bool makeStepSound;` default true (§Entity.cpp:62). */
  protected makeStepSound = true;
  /** §Entity.h:216 — `bool wasInWater;` default false (§Entity.cpp:20). */
  protected wasInWater = false;
  /** §Entity.h:217 — `bool fireImmune;` default false (§Entity.cpp:55). */
  protected fireImmune = false;
  /** §Entity.h:220 — `bool firstTick;` default true (§Entity.cpp:29). */
  protected firstTick = true;
  /** §Entity.h:221 — `int nextStep;` default 1 (§Entity.cpp:61). */
  protected nextStep = 1;
  /** §Entity.h:223 — `bool isStuckInWeb;` default false (§Entity.cpp:24). */
  protected isStuckInWeb = false;

  constructor(level: EntityLevel | null) {
    this.level = level;
    // §Entity.cpp:65 — `_init();`
    this._init();
    // §Entity.cpp:67 — `entityId = ++entityCounter;`
    this.entityId = ++Entity.entityCounter;
    // §Entity.cpp:71 — `setPos(0, 0, 0);`
    this.setPos(0, 0, 0);
  }

  // === Pure virtuals (§Entity.h:121, 147-148) — implemented by subclasses ===
  /** §Entity.h:121 — `virtual int getEntityTypeId() const = 0;` */
  abstract getEntityTypeId(): number;
  /** §Entity.h:147 — `virtual void readAdditionalSaveData(CompoundTag* tag) = 0;` */
  abstract readAdditionalSaveData(tag: Record<string, unknown>): void;
  /** §Entity.h:148 — `virtual void addAdditonalSaveData(CompoundTag* tag) = 0;` */
  abstract addAdditonalSaveData(tag: Record<string, unknown>): void;

  // === §Entity.cpp:689-701 — reset / _init ===
  /** §Entity.cpp:689-691 — `void Entity::reset() { this->_init(); }` */
  reset(): void {
    this._init();
  }

  /** §Entity.cpp:692-701 — `void Entity::_init()` — sync old↔current + reset fire. */
  protected _init(): void {
    // §Entity.cpp:693 — `xo = xOld = x;`
    this.xo = this.xOld = this.x;
    this.yo = this.yOld = this.y;
    this.zo = this.zOld = this.z;
    // §Entity.cpp:696 — `xRotO = xRot;`
    this.xRotO = this.xRot;
    this.yRotO = this.yRot;
    // §Entity.cpp:698 — `onFire = 0;`
    this.onFire = 0;
    // §Entity.cpp:699 — `removed = false;`
    this.removed = false;
    // §Entity.cpp:700 — `fallDistance = 0;`
    this.fallDistance = 0;
  }

  // === §Entity.cpp:424-427 — remove / setSize / setRot ===
  /** §Entity.cpp:424-427 — `void Entity::remove() { removed = true; }` */
  remove(): void {
    this.removed = true;
  }

  /** §Entity.cpp:429-433 — `void Entity::setSize(float w, float h)`. */
  setSize(w: number, h: number): void {
    this.bbWidth = w;
    this.bbHeight = h;
  }

  /** §Entity.cpp:435-439 — `void Entity::setRot(float yRot, float xRot)`. */
  setRot(yRot: number, xRot: number): void {
    this.yRot = yRot;
    this.yRotO = yRot;
    this.xRot = xRot;
    this.xRotO = xRot;
  }

  // === §Entity.cpp:391-399 — setPos ===
  /**
   * §Entity.cpp:391-399 — `void Entity::setPos(float x, float y, float z)`.
   * Stores position and rebuilds the AABB from (bbWidth, bbHeight, heightOffset).
   */
  setPos(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    const w = this.bbWidth / 2;
    const h = this.bbHeight;
    // §Entity.cpp:398 — bb.set(x-w, y-ho+yso, z-w, x+w, y-ho+yso+h, z+w)
    const y0 = y - this.heightOffset + this.ySlideOffset;
    this.bb = new Aabb(x - w, y0, z - w, x + w, y0 + h, z + w);
  }

  /** §Entity.cpp:382-389 — `void Entity::setPos(EntityPos* pos)`. */
  setPosFrom(pos: EntityPos): void {
    if (pos.move) this.setPos(pos.x, pos.y, pos.z);
    else this.setPos(this.x, this.y, this.z);
    if (pos.rot) this.setRot(pos.yRot, pos.xRot);
    else this.setRot(this.yRot, this.xRot);
  }

  // === §Entity.cpp:137-359 — move (collide-and-slide) ===
  /**
   * §Entity.cpp:137-359 — `void Entity::move(float xa, float ya, float za)`.
   *
   * Simplified port: no sneaking edge-detection, no footSize auto-step retry,
   * no per-block tile entityInside. Those touch browser-side concerns
   * (step sound, fence collision) outside the pure logic port scope. The
   * core collide-and-slide on each axis is preserved verbatim.
   *
   * If `noPhysics` is set, the AABB translates freely without collision.
   * If `isStuckInWeb`, motion is throttled (§Entity.cpp:154-163) and the
   * stuck flag clears for next tick.
   */
  move(xa: number, ya: number, za: number): void {
    const level = this.level;
    if (this.noPhysics) {
      // §Entity.cpp:141-147 — `bb.move(xa, ya, za); ... return;`
      this.bb = this.bb.move(xa, ya, za);
      this.x = (this.bb.minX + this.bb.maxX) / 2;
      this.y = this.bb.minY + this.heightOffset - this.ySlideOffset;
      this.z = (this.bb.minZ + this.bb.maxZ) / 2;
      return;
    }
    if (!level) {
      // No level → no collision sources; replicate noPhysics path.
      this.bb = this.bb.move(xa, ya, za);
      this.x = (this.bb.minX + this.bb.maxX) / 2;
      this.y = this.bb.minY + this.heightOffset - this.ySlideOffset;
      this.z = (this.bb.minZ + this.bb.maxZ) / 2;
      return;
    }

    // §Entity.cpp:154-163 — web slow-down
    if (this.isStuckInWeb) {
      this.isStuckInWeb = false;
      xa *= 0.25;
      ya *= 0.05;
      za *= 0.25;
      this.xd = 0;
      this.yd = 0;
      this.zd = 0;
    }

    const xo = this.x;
    const zo = this.z;
    let xaOrg = xa;
    let yaOrg = ya;
    let zaOrg = za;

    // §Entity.cpp:201 — `level->getCubes(this, bb.expand(xa, ya, za))`
    const cubes = level.getCubes(this, this.bbExpanded(xa, ya, za));

    // §Entity.cpp:204-206 — LAND FIRST, then x and z
    for (const cube of cubes) ya = this.clipY(cube, ya);
    this.bb = this.bb.move(0, ya, 0);
    if (!this.slide && yaOrg !== ya) { xa = ya = za = 0; }

    const og = this.onGround || (yaOrg !== ya && yaOrg < 0);

    for (const cube of cubes) xa = this.clipX(cube, xa);
    this.bb = this.bb.move(xa, 0, 0);
    if (!this.slide && xaOrg !== xa) { xa = ya = za = 0; }

    for (const cube of cubes) za = this.clipZ(cube, za);
    this.bb = this.bb.move(0, 0, za);
    if (!this.slide && zaOrg !== za) { xa = ya = za = 0; }

    // §Entity.cpp:282-284 — recenter position from AABB
    this.x = (this.bb.minX + this.bb.maxX) / 2;
    this.y = this.bb.minY + this.heightOffset - this.ySlideOffset;
    this.z = (this.bb.minZ + this.bb.maxZ) / 2;

    // §Entity.cpp:286-289 — collision flags
    this.horizontalCollision = xaOrg !== xa || zaOrg !== za;
    this.verticalCollision = yaOrg !== ya;
    this.onGround = yaOrg !== ya && yaOrg < 0;
    this.collision = this.horizontalCollision || this.verticalCollision;
    this.checkFallDamage(ya, this.onGround);

    // §Entity.cpp:292-294 — zero velocity on the axis we hit
    if (xaOrg !== xa) this.xd = 0;
    if (yaOrg !== ya) this.yd = 0;
    if (zaOrg !== za) this.zd = 0;

    // §Entity.cpp:296-318 — step sound + walkDist accounting (no-op without sound adapter).
    if (this.makeStepSound) {
      const xm = this.x - xo;
      const zm = this.z - zo;
      // §Entity.cpp:300 — `walkDist += sqrt(xm*xm + zm*zm) * 0.6f;`
      this.walkDist += Math.sqrt(xm * xm + zm * zm) * 0.6;
      if (this.walkDist > this.nextStep) {
        this.nextStep = Math.floor(this.walkDist) + 1;
        this.playStepSound(Math.floor(this.x), Math.floor(this.y - 0.2 - this.heightOffset), Math.floor(this.z));
      }
    }

    // §Entity.cpp:338 — `ySlideOffset *= 0.4f;`
    this.ySlideOffset *= 0.4;

    // §Entity.cpp:340-356 — fire / lava damage via level adapter
    const water = this.isInWater();
    if (level.containsFireTile(this.bb)) {
      // §Entity.cpp:342 — `burn(1);`
      this.burn(1);
      if (!water) {
        // §Entity.cpp:344-345 — `onFire++; if (onFire == 0) onFire = 20 * 15;`
        this.onFire++;
        if (this.onFire === 0) this.onFire = 20 * 15;
      }
    } else if (this.onFire <= 0) {
      // §Entity.cpp:348-350 — `onFire = -flameTime;`
      this.onFire = -this.flameTime;
    }
    if (water && this.onFire > 0) {
      // §Entity.cpp:353-356 — extinguish in water
      this.onFire = -this.flameTime;
    }

    void og; // §Entity.cpp:212 — `og` only used by the footSize retry we omitted.
  }

  /** §Entity.cpp:169 (bb.expand) — broad-phase expansion for getCubes query. */
  private bbExpanded(xa: number, ya: number, za: number): Aabb {
    return new Aabb(
      Math.min(this.bb.minX, this.bb.minX + xa),
      Math.min(this.bb.minY, this.bb.minY + ya),
      Math.min(this.bb.minZ, this.bb.minZ + za),
      Math.max(this.bb.maxX, this.bb.maxX + xa),
      Math.max(this.bb.maxY, this.bb.maxY + ya),
      Math.max(this.bb.maxZ, this.bb.maxZ + za),
    );
  }

  /** §AABB.h — `clipYCollide` clip on Y axis (positive ya = up). */
  private clipY(cube: Aabb, ya: number): number {
    if (ya === 0) return 0;
    if (!overlapOnAxes(this.bb, cube, 'y')) return ya;
    if (ya > 0 && this.bb.maxY <= cube.minY) return Math.min(ya, cube.minY - this.bb.maxY);
    if (ya < 0 && this.bb.minY >= cube.maxY) return Math.max(ya, cube.maxY - this.bb.minY);
    return ya;
  }
  private clipX(cube: Aabb, xa: number): number {
    if (xa === 0) return 0;
    if (!overlapOnAxes(this.bb, cube, 'x')) return xa;
    if (xa > 0 && this.bb.maxX <= cube.minX) return Math.min(xa, cube.minX - this.bb.maxX);
    if (xa < 0 && this.bb.minX >= cube.maxX) return Math.max(xa, cube.maxX - this.bb.minX);
    return xa;
  }
  private clipZ(cube: Aabb, za: number): number {
    if (za === 0) return 0;
    if (!overlapOnAxes(this.bb, cube, 'z')) return za;
    if (za > 0 && this.bb.maxZ <= cube.minZ) return Math.min(za, cube.minZ - this.bb.maxZ);
    if (za < 0 && this.bb.minZ >= cube.maxZ) return Math.max(za, cube.maxZ - this.bb.minZ);
    return za;
  }

  /** §Entity.cpp:361-364 — `void Entity::makeStuckInWeb()`. */
  makeStuckInWeb(): void {
    this.isStuckInWeb = true;
    this.fallDistance = 0;
  }

  // === §Entity.cpp:463-534 — tick / baseTick ===
  /** §Entity.cpp:463-466 — `void Entity::tick() { baseTick(); }` */
  tick(): void {
    this.baseTick();
  }

  /**
   * §Entity.cpp:468-534 — `void Entity::baseTick()`.
   * Increments tickCount, snapshots old position, processes fire/lava/void.
   */
  baseTick(): void {
    // §Entity.cpp:472 — `tickCount++;`
    this.tickCount++;
    // §Entity.cpp:473 — `walkDistO = walkDist;`
    this.walkDistO = this.walkDist;
    // §Entity.cpp:474-478 — snapshot old position/rotation
    this.xo = this.x;
    this.yo = this.y;
    this.zo = this.z;
    this.xRotO = this.xRot;
    this.yRotO = this.yRot;

    const level = this.level;
    if (!level) {
      this.firstTick = false;
      return;
    }

    if (this.isInWater()) {
      // §Entity.cpp:497-499 — reset fallDistance + wasInWater + extinguish
      this.fallDistance = 0;
      this.wasInWater = true;
      this.onFire = 0;
    } else {
      // §Entity.cpp:500-502
      this.wasInWater = false;
    }

    if (!level.isClientSide) {
      // §Entity.cpp:507-517 — fire tick
      if (this.onFire > 0) {
        if (this.fireImmune) {
          // §Entity.cpp:509-511 — `onFire -= 4; if (onFire < 0) onFire = 0;`
          this.onFire -= 4;
          if (this.onFire < 0) this.onFire = 0;
        } else {
          // §Entity.cpp:512-514 — every 20 ticks, take 1 damage
          if (this.onFire % 20 === 0) {
            this.hurt(null, 1);
          }
          // §Entity.cpp:515 — `onFire--;`
          this.onFire--;
        }
      }
    }

    // §Entity.cpp:520-522 — lava damage
    if (this.isInLava()) {
      this.lavaHurt();
    }

    // §Entity.cpp:524-526 — out of world
    if (this.y < -64) {
      this.outOfWorld();
    }

    // §Entity.cpp:532 — `firstTick = false;`
    this.firstTick = false;
  }

  /** §Entity.cpp:536-539 — `void Entity::outOfWorld() { remove(); }` */
  outOfWorld(): void {
    this.remove();
  }

  /** §Entity.cpp:541-564 — `void Entity::checkFallDamage(float ya, bool onGround)`. */
  protected checkFallDamage(ya: number, onGround: boolean): void {
    if (onGround) {
      if (this.fallDistance > 0) {
        // §Entity.cpp:545-557 — mob-only tile fallOn + causeFallDamage(fallDistance)
        if (this.isMob()) {
          // §Entity.cpp:546-552 — fence-alias fallback omitted (browser-layer concern).
        }
        // §Entity.cpp:558 — `causeFallDamage(fallDistance);`
        this.causeFallDamage(this.fallDistance);
        this.fallDistance = 0;
      }
    } else {
      // §Entity.cpp:561-563 — `if (ya < 0) fallDistance -= ya;`
      if (ya < 0) this.fallDistance -= ya;
    }
  }

  /** §Entity.cpp:566-568 — `void Entity::causeFallDamage(float fallDamage2) {}` — no-op base. */
  causeFallDamage(_fallDistance: number): void {
    void _fallDistance;
  }

  /** §Entity.cpp:570-573 — `float Entity::getHeadHeight() { return 0; }`. */
  getHeadHeight(): number {
    return 0;
  }

  /** §Entity.cpp:575-590 — `void Entity::moveRelative(float xa, float za, float speed)`. */
  moveRelative(xa: number, za: number, speed: number): void {
    let dist = Math.sqrt(xa * xa + za * za);
    // §Entity.cpp:578 — `if (dist < 0.01f) return;`
    if (dist < 0.01) return;
    // §Entity.cpp:580-583 — `if (dist < 1) dist = 1; dist = speed / dist;`
    if (dist < 1) dist = 1;
    dist = speed / dist;
    const xa2 = xa * dist;
    const za2 = za * dist;
    // §Entity.cpp:585-586 — sin/cos of yRot (degrees→radians)
    const sin_ = Math.sin(this.yRot * DEGRAD);
    const cos_ = Math.cos(this.yRot * DEGRAD);
    // §Entity.cpp:588-589 — `xd += xa * cos_ - za * sin_; zd += za * cos_ + xa * sin_;`
    this.xd += xa2 * cos_ - za2 * sin_;
    this.zd += za2 * cos_ + xa2 * sin_;
  }

  /** §Entity.cpp:597-605 — `void Entity::moveTo(x, y, z, yRot, xRot)`. */
  moveTo(x: number, y: number, z: number, yRot: number, xRot: number): void {
    this.xOld = this.xo = this.x = x;
    this.yOld = this.yo = this.y = y + this.heightOffset;
    this.zOld = this.zo = this.z = z;
    this.yRot = this.yRotO = yRot;
    this.xRot = this.xRotO = xRot;
    this.setPos(this.x, this.y, this.z);
  }

  // === §Entity.cpp:607-637 — distance queries ===
  /** §Entity.cpp:607-613 — `float Entity::distanceTo(Entity* e)`. */
  distanceToEntity(e: Entity): number {
    return this.distanceTo(e.x, e.y, e.z);
  }
  /** §Entity.cpp:615-621 — `float Entity::distanceTo(float x2, y2, z2)`. */
  distanceTo(x2: number, y2: number, z2: number): number {
    const dx = this.x - x2;
    const dy = this.y - y2;
    const dz = this.z - z2;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  /** §Entity.cpp:623-629 — `float Entity::distanceToSqr(x2, y2, z2)`. */
  distanceToSqr(x2: number, y2: number, z2: number): number {
    const dx = this.x - x2;
    const dy = this.y - y2;
    const dz = this.z - z2;
    return dx * dx + dy * dy + dz * dz;
  }
  /** §Entity.cpp:631-637 — `float Entity::distanceToSqr(Entity* e)`. */
  distanceToSqrEntity(e: Entity): number {
    return this.distanceToSqr(e.x, e.y, e.z);
  }

  // === §Entity.cpp:678-687 — markHurt / hurt ===
  /** §Entity.cpp:678-681 — `void Entity::markHurt() { this->hurtMarked = true; }`. */
  markHurt(): void {
    this.hurtMarked = true;
  }

  /**
   * §Entity.cpp:683-687 — `bool Entity::hurt(Entity* source, int damage)`.
   * Base implementation just marks hurt and returns false. Mobs override.
   */
  hurt(source: Entity | null, _damage: number): boolean {
    void _damage;
    // §Entity.cpp:685 — `markHurt();`
    this.markHurt();
    void source;
    // §Entity.cpp:686 — `return false;`
    return false;
  }

  /** §Entity.cpp:703-706 — `bool Entity::intersects(x0,y0,z0,x1,y1,z1)`. */
  intersects(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): boolean {
    return this.bb.intersects(new Aabb(x0, y0, z0, x1, y1, z1));
  }

  /** §Entity.cpp:708-711 — `bool Entity::isPickable() { return false; }`. */
  isPickable(): boolean {
    return false;
  }
  /** §Entity.cpp:713-716 — `bool Entity::isPushable() { return false; }`. */
  isPushable(): boolean {
    return false;
  }
  /** §Entity.cpp:718-721 — `bool Entity::isShootable() { return false; }`. */
  isShootable(): boolean {
    return false;
  }

  /** §Entity.cpp:744-747 — `bool Entity::isCreativeModeAllowed() { return false; }`. */
  isCreativeModeAllowed(): boolean {
    return false;
  }

  /** §Entity.cpp:749-752 — `float Entity::getShadowHeightOffs() { return bbHeight / 2; }`. */
  getShadowHeightOffs(): number {
    return this.bbHeight / 2;
  }

  /** §Entity.cpp:754-757 — `bool Entity::isAlive() { return !removed; }`. */
  isAlive(): boolean {
    return !this.removed;
  }

  /** §Entity.cpp:790-793 — `bool Entity::isSneaking() { return false; }`. */
  isSneaking(): boolean {
    return false;
  }

  /** §Entity.cpp:795-798 — `bool Entity::isPlayer() { return false; }`. */
  isPlayer(): boolean {
    return false;
  }

  /** §Entity.h:125 — `virtual bool isMob() { return false; }`. */
  isMob(): boolean {
    return false;
  }

  /** §Entity.cpp:943-945 — `bool Entity::isItemEntity() { return false; }`. */
  isItemEntity(): boolean {
    return false;
  }

  /** §Entity.cpp:947-949 — `bool Entity::isHangingEntity() { return false; }`. */
  isHangingEntity(): boolean {
    return false;
  }

  /** §Entity.cpp:951-953 — `int Entity::getAuxData() { return 0; }`. */
  getAuxData(): number {
    return 0;
  }

  /** §Entity.cpp:920-922 — `bool Entity::isOnFire() { return onFire > 0; }`. */
  isOnFire(): boolean {
    return this.onFire > 0;
  }

  /** §Entity.cpp:924-926 — `bool Entity::interactPreventDefault() { return false; }`. */
  interactPreventDefault(): boolean {
    return false;
  }

  /** §Entity.cpp:759-762 — `bool Entity::interact(Player*) { return false; }`. */
  interact(_player: unknown): boolean {
    void _player;
    return false;
  }

  /** §Entity.cpp:770-773 — `float Entity::getPickRadius() { return 0.1f; }`. */
  getPickRadius(): number {
    return 0.1;
  }

  // === §Entity.cpp:801-817 — lavaHurt / burn ===
  /** §Entity.cpp:801-807 — `void Entity::lavaHurt()` — 4 dmg + 30s onFire unless immune. */
  lavaHurt(): void {
    if (this.fireImmune) return;
    this.hurt(null, 4);
    // §Entity.cpp:805 — `onFire = 30 * SharedConstants::TicksPerSecond;`
    this.onFire = 30 * TICKS_PER_SECOND;
  }

  /** §Entity.cpp:813-817 — `void Entity::burn(int dmg)` — pass-through to hurt unless immune. */
  burn(dmg: number): void {
    if (!this.fireImmune) {
      this.hurt(null, dmg);
    }
  }

  // === §Entity.cpp:899-918 — spawnAtLocation (delegates to level adapter) ===
  /** §Entity.cpp:899-918 — `ItemEntity* spawnAtLocation(int resource, int count, float yOffs)`.
   *  VoxelCraft returns the spawned ItemStack description so callers/tests can
   *  assert on loot drops without standing up an ItemEntity sub-tree. */
  spawnAtLocation(resource: string, count: number, yOffs = 0): { readonly itemKey: string; readonly count: number } | null {
    const level = this.level;
    if (!level) return null;
    // §Entity.cpp:908 — `ItemEntity* ie = new ItemEntity(level, x, y + yOffs, z, *itemInstance);`
    // The browser-layer adapter turns this into a real ItemEntity.
    level.addEntity({ itemKey: resource, count, x: this.x, y: this.y + yOffs, z: this.z });
    return Object.freeze({ itemKey: resource, count });
  }

  // === Liquid checks (§Entity.cpp:105-127) ===
  /** §Entity.cpp:105-107 — `bool Entity::isInWater()` (level adapter handles grow). */
  isInWater(): boolean {
    const level = this.level;
    if (!level) return false;
    return level.isInWater(this.bb, this);
  }
  /** §Entity.cpp:109-111 — `bool Entity::isInLava()`. */
  isInLava(): boolean {
    const level = this.level;
    if (!level) return false;
    // §Entity.cpp:110 — `bb.grow(-0.1f, -0.4f, -0.1f)` mirrored via containsMaterial.
    return level.containsMaterial(this.bb, 'lava');
  }
  /** §Entity.cpp:367-379 — `bool Entity::isUnderLiquid(Material*)` — delegated to level. */
  isUnderLiquid(material: string): boolean {
    const level = this.level;
    if (!level) return false;
    return level.containsMaterial(this.bb, material);
  }

  /** §Entity.cpp:86-91 — `bool Entity::isInWall()` (head-height solid-blocking check). */
  isInWall(): boolean {
    const level = this.level;
    if (!level) return false;
    const xt = Math.floor(this.x);
    const yt = Math.floor(this.y + this.getHeadHeight());
    const zt = Math.floor(this.z);
    return level.isSolidBlockingTile(xt, yt, zt);
  }

  /** §Entity.cpp:402-412 — `float Entity::getBrightness(float a)` — delegated to level. */
  getBrightness(_a: number): number {
    const level = this.level;
    if (!level) return 0;
    const xTile = Math.floor(this.x);
    const hh = (this.bb.maxY - this.bb.minY) * 0.66;
    const yTile = Math.floor(this.y - this.heightOffset + hh);
    const zTile = Math.floor(this.z);
    return level.getBrightness(xTile, yTile, zTile);
  }

  /** §Entity.cpp:441-453 — `void Entity::turn(float xo, float yo)`. */
  turn(xo: number, yo: number): void {
    const xRotOld = this.xRot;
    const yRotOld = this.yRot;
    // §Entity.cpp:446 — `yRot += xo * 0.15f;`
    this.yRot += xo * 0.15;
    // §Entity.cpp:447 — `xRot -= yo * 0.15f;`
    this.xRot -= yo * 0.15;
    // §Entity.cpp:448-449 — clamp xRot to [-90, 90]
    if (this.xRot < -90) this.xRot = -90;
    if (this.xRot > 90) this.xRot = 90;
    // §Entity.cpp:451-452 — propagate delta to old-rotation
    this.xRotO += this.xRot - xRotOld;
    this.yRotO += this.yRot - yRotOld;
  }

  /** §Entity.cpp:455-461 — `void Entity::interpolateTurn(float xo, float yo)`. */
  interpolateTurn(xo: number, yo: number): void {
    this.yRot += xo * 0.15;
    this.xRot -= yo * 0.15;
    if (this.xRot < -90) this.xRot = -90;
    if (this.xRot > 90) this.xRot = 90;
  }

  /** §Entity.cpp:764-768 — `void Entity::lerpTo(...)` — direct apply (no lSteps here). */
  lerpTo(x: number, y: number, z: number, yRot: number, xRot: number, _steps: number): void {
    void _steps;
    this.setPos(x, y, z);
    this.setRot(yRot, xRot);
  }

  /** §Entity.cpp:775-780 — `void Entity::lerpMotion(float xd, yd, zd)`. */
  lerpMotion(xd: number, yd: number, zd: number): void {
    this.xd = xd;
    this.yd = yd;
    this.zd = zd;
  }

  /** §Entity.cpp:671-676 — `void Entity::push(float xa, ya, za)`. */
  push(xa: number, ya: number, za: number): void {
    this.xd += xa;
    this.yd += ya;
    this.zd += za;
  }

  /** §Entity.cpp:643-668 — `void Entity::push(Entity* e)` — bidirectional push. */
  pushEntity(e: Entity): void {
    let xa = e.x - this.x;
    let za = e.z - this.z;
    let dd = Math.max(Math.abs(xa), Math.abs(za));
    if (dd >= 0.01) {
      dd = Math.sqrt(dd);
      xa /= dd;
      za /= dd;
      let pow = 1 / dd;
      if (pow > 1) pow = 1;
      xa *= pow;
      za *= pow;
      xa *= 0.05;
      za *= 0.05;
      // §Entity.cpp:663-664 — `xa *= 1 - pushthrough; za *= 1 - pushthrough;`
      xa *= 1 - this.pushthrough;
      za *= 1 - this.pushthrough;
      this.push(-xa, 0, -za);
      e.push(xa, 0, za);
    }
  }

  /** §Entity.cpp:782-784 — `void Entity::animateHurt()` — no-op base. */
  animateHurt(): void {
    /* no-op */
  }

  /** §Entity.cpp:786-788 — `void Entity::setEquippedSlot(slot, item, auxValue)` — no-op. */
  setEquippedSlot(_slot: number, _item: number, _auxValue: number): void {
    void _slot; void _item; void _auxValue;
  }

  /** §Entity.h:123 — `virtual EntityRendererId queryEntityRenderer() { return ER_DEFAULT_RENDERER; }`. */
  queryEntityRenderer(): EntityRendererId {
    return this.entityRendererId;
  }

  /** §Entity.h:122 — `virtual int getCreatureBaseType() const { return 0; }`. */
  getCreatureBaseType(): number {
    return 0;
  }

  /** §Entity.h:101 — `virtual void handleEntityEvent(char eventId) {}` — no-op base. */
  handleEntityEvent(_id: number): void {
    void _id;
  }

  /** §Entity.cpp:955-963 — `void Entity::playStepSound(...)` — delegated to level adapter. */
  playStepSound(xt: number, yt: number, zt: number): void {
    const level = this.level;
    if (!level) return;
    // Step-sound tile lookup happens at the browser layer (BlockRegistry lookup).
    level.playSound(this, 'step.stone', 0.25, 1);
    void xt; void yt; void zt;
  }

  /** §Entity.cpp:723-725 — `void Entity::awardKillScore(Entity* victim, int score)` — no-op. */
  awardKillScore(_victim: Entity, _score: number): void {
    void _victim; void _score;
  }

  /** §Entity.cpp:737-742 — `bool Entity::shouldRenderAtSqrDistance(float distance)`. */
  shouldRenderAtSqrDistance(distance: number): boolean {
    // §Entity.cpp:739-741 — `size *= 64.0f * viewScale; return distance < size * size;`
    // §AABB.h — `getSize()` returns the diagonal length of the box.
    const dx = this.bb.maxX - this.bb.minX;
    const dy = this.bb.maxY - this.bb.minY;
    const dz = this.bb.maxZ - this.bb.minZ;
    let size = Math.sqrt(dx * dx + dy * dy + dz * dz);
    size *= 64.0 * this.viewScale;
    return distance < size * size;
  }
}

/** §AABB.h — overlap check on the two non-moving axes (used by clip{X,Y,Z}). */
function overlapOnAxes(a: Aabb, b: Aabb, axis: 'x' | 'y' | 'z'): boolean {
  if (axis === 'x') return a.maxY > b.minY && a.minY < b.maxY && a.maxZ > b.minZ && a.minZ < b.maxZ;
  if (axis === 'y') return a.maxX > b.minX && a.minX < b.maxX && a.maxZ > b.minZ && a.minZ < b.maxZ;
  return a.maxX > b.minX && a.minX < b.maxX && a.maxY > b.minY && a.minY < b.maxY;
}
