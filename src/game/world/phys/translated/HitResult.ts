// §HitResult.ts — Direct 1:1 translation of C++ HitResult.h
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/phys/HitResult.h
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Vec3 } from './Vec3';

// --- HitResult.h:9-13 — enum HitResultType ---
enum HitResultType { TILE, ENTITY, NO_HIT }

// --- HitResult.h:15-37 — class HitResult ---
class HitResult {
  type: HitResultType;
  x: number; y: number; z: number; f: number;
  pos: Vec3;
  entity: any;
  indirectHit: boolean;

  // --- HitResult.h:22 — default constructor ---
  constructor();
  // --- HitResult.h:23 — constructor with tile coords + face + pos ---
  constructor(x: number, y: number, z: number, f: number, pos: Vec3);
  // --- HitResult.h:24 — constructor with Entity* ---
  constructor(entity: any);
  constructor(...args: any[]) {
    if (args.length === 0) {
      this.type = HitResultType.NO_HIT;
      this.x = 0; this.y = 0; this.z = 0; this.f = 0;
      this.pos = new Vec3();
      this.entity = null;
      this.indirectHit = false;
    } else if (args.length === 5) {
      this.type = HitResultType.TILE;
      this.x = args[0]; this.y = args[1]; this.z = args[2]; this.f = args[3];
      this.pos = args[4];
      this.entity = null;
      this.indirectHit = false;
    } else {
      this.type = HitResultType.ENTITY;
      this.x = 0; this.y = 0; this.z = 0; this.f = 0;
      this.pos = new Vec3();
      this.entity = args[0];
      this.indirectHit = false;
    }
  }

  // --- HitResult.h:28 — distanceTo(Entity*) ---
  distanceTo(entity: any): number {
    // §C++: returns distance from hit pos to entity
    if (this.entity && this.entity.x !== undefined) {
      const xd = this.pos.x - entity.x;
      const yd = this.pos.y - entity.y;
      const zd = this.pos.z - entity.z;
      return Math.sqrt(xd * xd + yd * yd + zd * zd);
    }
    return 0;
  }

  // --- HitResult.h:30 — isHit() ---
  isHit(): boolean { return this.type !== HitResultType.NO_HIT; }
}

export { HitResult, HitResultType };
