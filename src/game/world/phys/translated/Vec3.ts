// §Vec3.ts — Direct 1:1 translation of C++ Vec3.h (header-only, ~180 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/phys/Vec3.h
// Rule Zero: Every line below maps to a specific line in the C++ source.

class Vec3 {
  x: number; y: number; z: number;

  // --- Vec3.h:10-13 — default constructor ---
  constructor();
  // --- Vec3.h:15-22 — constructor with 3 floats ---
  constructor(x: number, y: number, z: number);
  constructor(x?: number, y?: number, z?: number) {
    if (x === undefined) {
      this.x = 0; this.y = 0; this.z = 0;
    } else {
      if (x === -0.0) x = 0.0;
      if (y === -0.0) y = 0.0;
      if (z === -0.0) z = 0.0;
      this.x = x; this.y = y!; this.z = z!;
    }
  }

  // --- Vec3.h:24-29 — set(float, float, float) ---
  set(x: number, y: number, z: number): this {
    this.x = x; this.y = y; this.z = z;
    return this;
  }

  // --- Vec3.h:31-33 — operator+ ---
  add(rhs: Vec3): Vec3 { return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z); }
  // --- Vec3.h:39-41 — operator- ---
  sub(rhs: Vec3): Vec3 { return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z); }
  // --- Vec3.h:47-49 — operator* (scalar) ---
  multiply(k: number): Vec3 { return new Vec3(this.x * k, this.y * k, this.z * k); }

  // --- Vec3.h:51-55 — normalized() ---
  normalized(): Vec3 {
    const dist = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (dist < 0.0001) return new Vec3();
    return new Vec3(this.x / dist, this.y / dist, this.z / dist);
  }

  // --- Vec3.h:57-59 — dot(Vec3) ---
  dot(p: Vec3): number { return this.x * p.x + this.y * p.y + this.z * p.z; }

  // --- Vec3.h:61-63 — cross(Vec3) ---
  cross(p: Vec3): Vec3 {
    return new Vec3(this.y * p.z - this.z * p.y, this.z * p.x - this.x * p.z, this.x * p.y - this.y * p.x);
  }

  // --- Vec3.h:65-68 — add(float, float, float) ---
  addXYZ(x: number, y: number, z: number): Vec3 { return new Vec3(this.x + x, this.y + y, this.z + z); }
  // --- Vec3.h:73-76 — sub(float, float, float) ---
  subXYZ(x: number, y: number, z: number): Vec3 { return new Vec3(this.x - x, this.y - y, this.z - z); }

  // --- Vec3.h:83-87 — negate() ---
  negate(): void { this.x = -this.x; this.y = -this.y; this.z = -this.z; }
  // --- Vec3.h:89-91 — negated() ---
  negated(): Vec3 { return new Vec3(-this.x, -this.y, -this.z); }

  // --- Vec3.h:93-99 — distanceTo(Vec3) ---
  distanceTo(p: Vec3): number {
    const xd = p.x - this.x, yd = p.y - this.y, zd = p.z - this.z;
    return Math.sqrt(xd * xd + yd * yd + zd * zd);
  }

  // --- Vec3.h:101-106 — distanceToSqr(Vec3) ---
  distanceToSqr(p: Vec3): number {
    const xd = p.x - this.x, yd = p.y - this.y, zd = p.z - this.z;
    return xd * xd + yd * yd + zd * zd;
  }

  // --- Vec3.h:108-113 — distanceToSqr(float, float, float) ---
  distanceToSqrXYZ(x2: number, y2: number, z2: number): number {
    const xd = x2 - this.x, yd = y2 - this.y, zd = z2 - this.z;
    return xd * xd + yd * yd + zd * zd;
  }

  // --- Vec3.h:115-117 — length() ---
  length(): number { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }

  // --- Vec3.h:119-132 — clipX(Vec3 b, float xt, Vec3& result) ---
  clipX(b: Vec3, xt: number, result: Vec3): boolean {
    const xd = b.x - this.x, yd = b.y - this.y, zd = b.z - this.z;
    if (xd * xd < 0.0000001) return false;
    const d = (xt - this.x) / xd;
    if (d < 0 || d > 1) return false;
    result.set(this.x + xd * d, this.y + yd * d, this.z + zd * d);
    return true;
  }

  // --- Vec3.h:134-146 — clipY(Vec3 b, float yt, Vec3& result) ---
  clipY(b: Vec3, yt: number, result: Vec3): boolean {
    const xd = b.x - this.x, yd = b.y - this.y, zd = b.z - this.z;
    if (yd * yd < 0.0000001) return false;
    const d = (yt - this.y) / yd;
    if (d < 0 || d > 1) return false;
    result.set(this.x + xd * d, this.y + yd * d, this.z + zd * d);
    return true;
  }

  // --- Vec3.h:148-160 — clipZ(Vec3 b, float zt, Vec3& result) ---
  clipZ(b: Vec3, zt: number, result: Vec3): boolean {
    const xd = b.x - this.x, yd = b.y - this.y, zd = b.z - this.z;
    if (zd * zd < 0.0000001) return false;
    const d = (zt - this.z) / zd;
    if (d < 0 || d > 1) return false;
    result.set(this.x + xd * d, this.y + yd * d, this.z + zd * d);
    return true;
  }

  // --- Vec3.h:162-166 — toString() ---
  toString(): string { return 'Vec3(' + this.x + ',' + this.y + ',' + this.z + ')'; }

  // --- Vec3.h:168-170 — lerp(Vec3, float) ---
  lerp(v: Vec3, a: number): Vec3 {
    return new Vec3(this.x + (v.x - this.x) * a, this.y + (v.y - this.y) * a, this.z + (v.z - this.z) * a);
  }

  // --- Vec3.h:172-183 — xRot(float degs) ---
  xRot(degs: number): void {
    const cosv = Math.cos(degs), sinv = Math.sin(degs);
    const xx = this.x;
    const yy = this.y * cosv + this.z * sinv;
    const zz = this.z * cosv - this.y * sinv;
    this.x = xx; this.y = yy; this.z = zz;
  }

  // --- Vec3.h:185-195 — yRot(float degs) ---
  yRot(degs: number): void {
    const cosv = Math.cos(degs), sinv = Math.sin(degs);
    const xx = this.x * cosv + this.z * sinv;
    const yy = this.y;
    const zz = this.z * cosv - this.x * sinv;
    this.x = xx; this.y = yy; this.z = zz;
  }

  // --- Vec3.h:197-207 — zRot(float degs) ---
  zRot(degs: number): void {
    const cosv = Math.cos(degs), sinv = Math.sin(degs);
    const xx = this.x * cosv + this.y * sinv;
    const yy = this.y * cosv - this.x * sinv;
    const zz = this.z;
    this.x = xx; this.y = yy; this.z = zz;
  }

  // --- Vec3.h:209-211 — fromPolarXY(float, float) static ---
  static fromPolarXY(angle: number, radius: number): Vec3 {
    return new Vec3(radius * Math.cos(angle), radius * Math.sin(angle), 0);
  }
}

export { Vec3 };
