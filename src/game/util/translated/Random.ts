// §Random.ts — Direct 1:1 translation of C++ Random.h (Mersenne Twister)
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/util/Random.h
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- Random.h:25-213 — class Random (Mersenne Twister) ---
class Random {
  // --- Random.h:27-30 — default constructor ---
  constructor() {
    this.setSeed(Date.now() & 0x7FFFFFFF);  // §getTimeMs()
  }
  // --- Random.h:31-33 — constructor with seed ---
  constructor_seed: number;

  // --- Random.h:82 — private _seed ---
  private _seed: number;

  // --- Random.h:84-87 — Period parameters ---
  private static readonly N = 624;
  private static readonly M = 397;
  private static readonly MATRIX_A = 0x9908b0df;
  private static readonly UPPER_MASK = 0x80000000;
  private static readonly LOWER_MASK = 0x7fffffff;

  // --- Random.h:89-90 — state vector ---
  private _mt: number[] = new Array(Random.N);
  private _mti: number = Random.N + 1;

  // --- Random.h:92-93 — Gaussian state ---
  private haveNextNextGaussian: boolean = false;
  private nextNextGaussian: number = 0;

  // --- Random.h:35-42 — setSeed(long seed) ---
  setSeed(seed: number): void {
    this._seed = seed;
    this._mti = Random.N + 1;
    this.haveNextNextGaussian = false;
    this.nextNextGaussian = 0;
    this.init_genrand(seed);
  }

  // --- Random.h:43-45 — getSeed() ---
  getSeed(): number { return this._seed; }

  // --- Random.h:46-48 — nextBoolean() ---
  nextBoolean(): boolean {
    return (this.genrand_int32() & 0x8000000) > 0;
  }

  // --- Random.h:49-51 — nextFloat() ---
  nextFloat(): number {
    return this.genrand_real2();
  }

  // --- Random.h:52-54 — nextDouble() ---
  nextDouble(): number {
    return this.genrand_real2();
  }

  // --- Random.h:55-57 — nextInt() ---
  nextInt(): number {
    return (this.genrand_int32() >> 1) | 0;
  }

  // --- Random.h:58-60 — nextInt(int n) ---
  nextInt(n: number): number {
    return this.genrand_int32() % n;
  }

  // --- Random.h:61-63 — nextLong() ---
  nextLong(): number {
    return (this.genrand_int32() >> 1) | 0;
  }

  // --- Random.h:64-66 — nextLong(n) ---
  nextLong(n: number): number {
    return this.genrand_int32() % n;
  }

  // --- Random.h:68-85 — nextGaussian() ---
  nextGaussian(): number {
    if (this.haveNextNextGaussian) {
      this.haveNextNextGaussian = false;
      return this.nextNextGaussian;
    } else {
      let v1: number, v2: number, s: number;
      do {
        v1 = 2 * this.nextFloat() - 1;
        v2 = 2 * this.nextFloat() - 1;
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      const multiplier = Math.sqrt(-2 * Math.log(s) / s);
      this.nextNextGaussian = v2 * multiplier;
      this.haveNextNextGaussian = true;
      return v1 * multiplier;
    }
  }

  // --- Random.h:94-106 — init_genrand(unsigned long s) ---
  private init_genrand(s: number): void {
    this._mt[0] = s >>> 0;
    for (this._mti = 1; this._mti < Random.N; this._mti++) {
      this._mt[this._mti] = ((1812433253 * ((this._mt[this._mti - 1] ^ (this._mt[this._mti - 1] >> 30))) + this._mti) >>> 0);
      this._mt[this._mti] &= 0xffffffff;
    }
  }

  // --- Random.h:151-174 — genrand_int32() ---
  private genrand_int32(): number {
    let y: number;
    const mag01 = [0x0, Random.MATRIX_A];

    if (this._mti >= Random.N) {
      let kk: number;

      if (this._mti === Random.N + 1) {
        this.init_genrand(5489);
      }

      for (kk = 0; kk < Random.N - Random.M; kk++) {
        y = ((this._mt[kk] & Random.UPPER_MASK) | (this._mt[kk + 1] & Random.LOWER_MASK)) >>> 0;
        this._mt[kk] = (this._mt[kk + Random.M] ^ (y >> 1) ^ mag01[y & 0x1]) >>> 0;
      }
      for (; kk < Random.N - 1; kk++) {
        y = ((this._mt[kk] & Random.UPPER_MASK) | (this._mt[kk + 1] & Random.LOWER_MASK)) >>> 0;
        this._mt[kk] = (this._mt[kk + (Random.M - Random.N)] ^ (y >> 1) ^ mag01[y & 0x1]) >>> 0;
      }
      y = ((this._mt[Random.N - 1] & Random.UPPER_MASK) | (this._mt[0] & Random.LOWER_MASK)) >>> 0;
      this._mt[Random.N - 1] = (this._mt[Random.M - 1] ^ (y >> 1) ^ mag01[y & 0x1]) >>> 0;

      this._mti = 0;
    }

    y = this._mt[this._mti++];

    // Tempering
    y ^= (y >> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >> 18);

    return y >>> 0;
  }

  // --- Random.h:185-188 — genrand_real2() ---
  private genrand_real2(): number {
    return this.genrand_int32() * (1.0 / 4294967296.0);
  }

  // --- Random.h:198-204 — rrDiff(float& x) ---
  rrDiff_x(): number {
    const u = this.genrand_int32();
    const xx0 = (u & 0xffff) / 65536.0;
    const xx1 = ((u >> 16) & 0xffff) / 65536.0;
    return xx0 - xx1;
  }

  // --- Random.h:205-213 — rrDiff(float& x, float& y) ---
  rrDiff_xy(): [number, number] {
    const u = this.genrand_int32();
    const xx0 = (u & 0xff) / 256.0;
    const xx1 = ((u >> 8) & 0xff) / 256.0;
    const yy0 = ((u >> 16) & 0xff) / 256.0;
    const yy1 = ((u >> 24) & 0xff) / 256.0;
    return [xx0 - xx1, yy0 - yy1];
  }

  // --- Random.h:214-225 — rrDiff(float& x, float& y, float& z) ---
  rrDiff_xyz(): [number, number, number] {
    const u = this.genrand_int32();
    const xx0 = (u & 0x1f) / 32.0;
    const xx1 = ((u >> 5) & 0x1f) / 32.0;
    const yy0 = ((u >> 10) & 0x1f) / 32.0;
    const yy1 = ((u >> 15) & 0x1f) / 32.0;
    const zz0 = ((u >> 20) & 0x1f) / 32.0;
    const zz1 = ((u >> 25) & 0x1f) / 32.0;
    return [xx0 - xx1, yy0 - yy1, zz0 - zz1];
  }
}

export { Random };
