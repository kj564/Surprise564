// §AABB.ts — Direct 1:1 translation of C++ AABB.h (header-only, ~200 lines)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/phys/AABB.h
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- AABB.h:11-27 — class AABB ---
class AABB {
  x0: number; y0: number; z0: number;
  x1: number; y1: number; z1: number;

  // --- AABB.h:13-17 — default constructor ---
  constructor();
  // --- AABB.h:19-27 — constructor with 6 floats ---
  constructor(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number);
  constructor(x0?: number, y0?: number, z0?: number, x1?: number, y1?: number, z1?: number) {
    if (x0 === undefined) {
      // §Default constructor: x0,y0,z0=0, x1,y1,z1=1
      this.x0 = 0; this.y0 = 0; this.z0 = 0;
      this.x1 = 1; this.y1 = 1; this.z1 = 1;
    } else {
      this.x0 = x0!; this.y0 = y0!; this.z0 = z0!;
      this.x1 = x1!; this.y1 = y1!; this.z1 = z1!;
    }
  }

  // --- AABB.h:29-38 — set(float, float, float, float, float, float) ---
  set(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): this {
    this.x0 = x0; this.y0 = y0; this.z0 = z0;
    this.x1 = x1; this.y1 = y1; this.z1 = z1;
    return this;
  }

  // --- AABB.h:40-61 — expand(float, float, float) ---
  expand(xa: number, ya: number, za: number): AABB {
    let _x0 = this.x0, _y0 = this.y0, _z0 = this.z0;
    let _x1 = this.x1, _y1 = this.y1, _z1 = this.z1;
    if (xa < 0) _x0 += xa;
    if (xa > 0) _x1 += xa;
    if (ya < 0) _y0 += ya;
    if (ya > 0) _y1 += ya;
    if (za < 0) _z0 += za;
    if (za > 0) _z1 += za;
    return new AABB(_x0, _y0, _z0, _x1, _y1, _z1);
  }

  // --- AABB.h:63-66 — grow(float, float, float) ---
  grow(xa: number, ya: number, za: number): AABB {
    return new AABB(this.x0 - xa, this.y0 - ya, this.z0 - za, this.x1 + xa, this.y1 + ya, this.z1 + za);
  }

  // --- AABB.h:68-71 — cloneMove(float, float, float) ---
  cloneMove(xa: number, ya: number, za: number): AABB {
    return new AABB(this.x0 + xa, this.y0 + ya, this.z0 + za, this.x1 + xa, this.y1 + ya, this.z1 + za);
  }

  // --- AABB.h:73-89 — clipXCollide(const AABB&, float) ---
  clipXCollide(c: AABB, xa: number): number {
    if (c.y1 <= this.y0 || c.y0 >= this.y1) return xa;
    if (c.z1 <= this.z0 || c.z0 >= this.z1) return xa;
    if (xa > 0 && c.x1 <= this.x0) {
      const max = this.x0 - c.x1;
      if (max < xa) xa = max;
    }
    if (xa < 0 && c.x0 >= this.x1) {
      const max = this.x1 - c.x0;
      if (max > xa) xa = max;
    }
    return xa;
  }

  // --- AABB.h:91-107 — clipYCollide(const AABB&, float) ---
  clipYCollide(c: AABB, ya: number): number {
    if (c.x1 <= this.x0 || c.x0 >= this.x1) return ya;
    if (c.z1 <= this.z0 || c.z0 >= this.z1) return ya;
    if (ya > 0 && c.y1 <= this.y0) {
      const max = this.y0 - c.y1;
      if (max < ya) ya = max;
    }
    if (ya < 0 && c.y0 >= this.y1) {
      const max = this.y1 - c.y0;
      if (max > ya) ya = max;
    }
    return ya;
  }

  // --- AABB.h:109-125 — clipZCollide(const AABB&, float) ---
  clipZCollide(c: AABB, za: number): number {
    if (c.x1 <= this.x0 || c.x0 >= this.x1) return za;
    if (c.y1 <= this.y0 || c.y0 >= this.y1) return za;
    if (za > 0 && c.z1 <= this.z0) {
      const max = this.z0 - c.z1;
      if (max < za) za = max;
    }
    if (za < 0 && c.z0 >= this.z1) {
      const max = this.z1 - c.z0;
      if (max > za) za = max;
    }
    return za;
  }

  // --- AABB.h:127-133 — intersects(const AABB&) ---
  intersects(c: AABB): boolean;
  // --- AABB.h:143-150 — intersects(float, float, float, float, float, float) ---
  intersects(x02: number, y02: number, z02: number, x12: number, y12: number, z12: number): boolean;
  intersects(a: any, b?: any, c?: any, d?: any, e?: any, f?: any): boolean {
    if (a instanceof AABB) {
      // §intersects(const AABB&)
      if (a.x1 <= this.x0 || a.x0 >= this.x1) return false;
      if (a.y1 <= this.y0 || a.y0 >= this.y1) return false;
      if (a.z1 <= this.z0 || a.z0 >= this.z1) return false;
      return true;
    } else {
      // §intersects(float, float, float, float, float, float)
      if (d! <= this.x0 || a >= this.x1) return false;
      if (e! <= this.y0 || b! >= this.y1) return false;
      if (f! <= this.z0 || c! >= this.z1) return false;
      return true;
    }
  }

  // --- AABB.h:135-141 — intersectsInner(const AABB&) ---
  intersectsInner(c: AABB): boolean {
    if (c.x1 < this.x0 || c.x0 > this.x1) return false;
    if (c.y1 < this.y0 || c.y0 > this.y1) return false;
    if (c.z1 < this.z0 || c.z0 > this.z1) return false;
    return true;
  }

  // --- AABB.h:152-161 — move(float, float, float) ---
  move(xa: number, ya: number, za: number): this {
    this.x0 += xa; this.y0 += ya; this.z0 += za;
    this.x1 += xa; this.y1 += ya; this.z1 += za;
    return this;
  }

  // --- AABB.h:163-169 — contains(const Vec3&) ---
  contains(p: { x: number; y: number; z: number }): boolean {
    if (p.x <= this.x0 || p.x >= this.x1) return false;
    if (p.y <= this.y0 || p.y >= this.y1) return false;
    if (p.z <= this.z0 || p.z >= this.z1) return false;
    return true;
  }

  // --- AABB.h:171-176 — getSize() ---
  getSize(): number {
    const xs = this.x1 - this.x0;
    const ys = this.y1 - this.y0;
    const zs = this.z1 - this.z0;
    return (xs + ys + zs) / 3.0;
  }

  // --- AABB.h:178-180 — shrink(float, float, float) ---
  shrink(xa: number, ya: number, za: number): AABB {
    return new AABB(this.x0 + xa, this.y0 + ya, this.z0 + za, this.x1 - xa, this.y1 - ya, this.z1 - za);
  }

  // --- AABB.h:182-184 — copy() ---
  copy(): AABB {
    return new AABB(this.x0, this.y0, this.z0, this.x1, this.y1, this.z1);
  }

  // --- AABB.h:197-200 — set(const AABB&) ---
  setFromAABB(b: AABB): void {
    this.x0 = b.x0; this.y0 = b.y0; this.z0 = b.z0;
    this.x1 = b.x1; this.y1 = b.y1; this.z1 = b.z1;
  }

  // --- AABB.h:202-206 — toString() ---
  toString(): string {
    return 'AABB(' + this.x0 + ',' + this.y0 + ',' + this.z0 + ' to ' + this.x1 + ',' + this.y1 + ',' + this.z1 + ')';
  }
}

export { AABB };
