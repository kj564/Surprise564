import { Aabb, type Axis } from './aabb';

export interface MovementRequest {
  dx: number;
  dy: number;
  dz: number;
}

export interface MovementResult {
  box: Aabb;
  dx: number;
  dy: number;
  dz: number;
  onGround: boolean;
  horizontalCollision: boolean;
  verticalCollision: boolean;
}

/**
 * Resolve one movement request against a caller-supplied set of nearby collision boxes.
 * Axis order is Y, X, Z so vertical grounding is resolved before horizontal motion.
 * Broad-phase obstacle collection and player input remain responsibilities of the world/player systems.
 */
export function resolveAabbMovement(box: Aabb, movement: MovementRequest, obstacles: readonly Aabb[]): MovementResult {
  const requested = [movement.dx, movement.dy, movement.dz];
  if (!requested.every(Number.isFinite)) throw new TypeError('Movement deltas must be finite');

  let current = box;
  const actual: Record<Axis, number> = { x: movement.dx, y: movement.dy, z: movement.dz };
  for (const axis of ['y', 'x', 'z'] as const) {
    let delta = actual[axis];
    for (const obstacle of obstacles) delta = current.clipDisplacement(obstacle, axis, delta);
    actual[axis] = delta;
    if (axis === 'x') current = current.move(delta, 0, 0);
    else if (axis === 'y') current = current.move(0, delta, 0);
    else current = current.move(0, 0, delta);
  }

  const verticalCollision = actual.y !== movement.dy;
  const horizontalCollision = actual.x !== movement.dx || actual.z !== movement.dz;
  return {
    box: current,
    dx: actual.x,
    dy: actual.y,
    dz: actual.z,
    onGround: movement.dy < 0 && verticalCollision,
    horizontalCollision,
    verticalCollision,
  };
}
