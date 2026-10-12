import { Aabb } from './aabb';
import { resolveAabbMovement } from './collision';

export interface PlayerInput {
  readonly moveX: number;
  readonly moveZ: number;
  readonly jump: boolean;
}

export interface PlayerPosition {
  readonly x: number;
  /** Feet height in world block units. */
  readonly y: number;
  readonly z: number;
}

export interface PlayerPhysicsConfig {
  readonly width?: number;
  readonly height?: number;
  readonly moveSpeed?: number;
  readonly gravity?: number;
  readonly jumpSpeed?: number;
  readonly terminalVelocity?: number;
  readonly groundProbe?: number;
}

export interface PlayerPhysicsState {
  readonly position: PlayerPosition;
  readonly velocityY: number;
  readonly onGround: boolean;
  readonly horizontalCollision: boolean;
  readonly verticalCollision: boolean;
}

export type CollisionProvider = (sweptBounds: Aabb) => readonly Aabb[];

const MAX_STEP_SECONDS = 0.25;

export class PlayerPhysics {
  readonly width: number;
  readonly height: number;
  readonly moveSpeed: number;
  readonly gravity: number;
  readonly jumpSpeed: number;
  readonly terminalVelocity: number;
  readonly groundProbe: number;

  private positionValue: PlayerPosition;
  private velocityYValue = 0;
  private onGroundValue = false;
  private horizontalCollisionValue = false;
  private verticalCollisionValue = false;

  constructor(spawn: PlayerPosition, config: PlayerPhysicsConfig = {}) {
    this.width = positiveFinite(config.width ?? 0.6, 'width');
    this.height = positiveFinite(config.height ?? 1.8, 'height');
    this.moveSpeed = positiveFinite(config.moveSpeed ?? 4.3, 'moveSpeed');
    this.gravity = positiveFinite(config.gravity ?? 24, 'gravity');
    this.jumpSpeed = positiveFinite(config.jumpSpeed ?? 8, 'jumpSpeed');
    this.terminalVelocity = positiveFinite(config.terminalVelocity ?? 50, 'terminalVelocity');
    this.groundProbe = positiveFinite(config.groundProbe ?? 0.025, 'groundProbe');
    this.positionValue = validatePosition(spawn);
  }

  get bounds(): Aabb {
    const half = this.width / 2;
    return new Aabb(
      this.positionValue.x - half, this.positionValue.y, this.positionValue.z - half,
      this.positionValue.x + half, this.positionValue.y + this.height, this.positionValue.z + half,
    );
  }

  get state(): PlayerPhysicsState {
    return Object.freeze({
      position: Object.freeze({ ...this.positionValue }),
      velocityY: this.velocityYValue,
      onGround: this.onGroundValue,
      horizontalCollision: this.horizontalCollisionValue,
      verticalCollision: this.verticalCollisionValue,
    });
  }

  teleport(position: PlayerPosition): void {
    this.positionValue = validatePosition(position);
    this.velocityYValue = 0;
    this.onGroundValue = false;
    this.horizontalCollisionValue = false;
    this.verticalCollisionValue = false;
  }

  /** Advance one bounded simulation step; call from FixedStepClock, not once per render frame. */
  step(deltaSeconds: number, input: PlayerInput, obstaclesFor: CollisionProvider): PlayerPhysicsState {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0 || deltaSeconds > MAX_STEP_SECONDS) {
      throw new RangeError('deltaSeconds must be in (0, 0.25]');
    }
    if (![input.moveX, input.moveZ].every(Number.isFinite)) throw new TypeError('Movement input must be finite');
    if (typeof input.jump !== 'boolean') throw new TypeError('jump input must be boolean');
    if (typeof obstaclesFor !== 'function') throw new TypeError('obstaclesFor must be a function');

    let moveX = clamp(input.moveX, -1, 1);
    let moveZ = clamp(input.moveZ, -1, 1);
    const moveLength = Math.hypot(moveX, moveZ);
    if (moveLength > 1) {
      moveX /= moveLength;
      moveZ /= moveLength;
    }
    const dx = moveX * this.moveSpeed * deltaSeconds;
    const dz = moveZ * this.moveSpeed * deltaSeconds;

    if (input.jump && this.onGroundValue) {
      this.velocityYValue = this.jumpSpeed;
      this.onGroundValue = false;
    }
    this.velocityYValue = Math.max(-this.terminalVelocity, this.velocityYValue - this.gravity * deltaSeconds);
    const dy = this.velocityYValue * deltaSeconds;

    const startingBounds = this.bounds;
    const swept = startingBounds.sweptBounds(dx, dy, dz);
    const result = resolveAabbMovement(startingBounds, { dx, dy, dz }, obstaclesFor(swept));
    const half = this.width / 2;
    this.positionValue = Object.freeze({
      x: result.box.minX + half,
      y: result.box.minY,
      z: result.box.minZ + half,
    });
    if (result.verticalCollision) this.velocityYValue = 0;
    this.horizontalCollisionValue = result.horizontalCollision;
    this.verticalCollisionValue = result.verticalCollision;
    this.onGroundValue = result.onGround;

    if (!this.onGroundValue) {
      const currentBounds = this.bounds;
      const probeBounds = currentBounds.sweptBounds(0, -this.groundProbe, 0);
      const probe = resolveAabbMovement(currentBounds, { dx: 0, dy: -this.groundProbe, dz: 0 }, obstaclesFor(probeBounds));
      if (probe.onGround) {
        this.onGroundValue = true;
        if (this.velocityYValue < 0) this.velocityYValue = 0;
      }
    }
    return this.state;
  }
}

function validatePosition(position: PlayerPosition): PlayerPosition {
  if (![position.x, position.y, position.z].every(Number.isFinite)) {
    throw new TypeError('Player position must contain finite coordinates');
  }
  return Object.freeze({ x: position.x, y: position.y, z: position.z });
}

function positiveFinite(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(name + ' must be finite and positive');
  return value;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}
