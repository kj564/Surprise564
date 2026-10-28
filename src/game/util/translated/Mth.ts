// §Mth.ts — Direct 1:1 translation of C++ Mth.h + Mth.cpp
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/util/Mth.h + Mth.cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

import { Random } from './Random';

// --- Mth.cpp:7 ---
const _rand = new Random();

// --- Mth.cpp:9-12 — constants ---
const PI = 3.14159265358979323846;
const TWO_PI = 2.0 * PI;
const DEGRAD = PI / 180.0;
const RADDEG = 180.0 / PI;

// --- Mth.cpp:14-15 — sin lookup table ---
const _sin: number[] = new Array(65536);
const _sinScale = 65536.0 / (2.0 * PI);

// --- Mth.cpp:17-19 — initMth() ---
function initMth(): void {
  for (let i = 0; i < 65536; i++) {
    _sin[i] = Math.sin(i / _sinScale);
  }
}

// --- Mth.cpp:21-26 — sqrt(float) ---
function sqrt(x: number): number {
  return Math.sqrt(x);
}

// --- Mth.cpp:28-36 — fastInvSqrt + invSqrt ---
function fastInvSqrt(x: number): number {
  // §C++ bit manipulation — JS doesn't support pointer casting, use Math
  return 1.0 / Math.sqrt(x);
}
function invSqrt(x: number): number {
  return fastInvSqrt(x);
}

// --- Mth.cpp:38-41 — floor(float) ---
function floor(v: number): number {
  const i = Math.trunc(v);
  return v < i ? i - 1 : i;
}

// --- Mth.cpp:43-48 — cos(float) ---
function cos(x: number): number {
  return _sin[Math.trunc(x * _sinScale + 65536 / 4) & 65535];
}

// --- Mth.cpp:50-55 — sin(float) ---
function sin(x: number): number {
  return _sin[Math.trunc(x * _sinScale) & 65535];
}

// --- Mth.cpp:57-63 — atan + atan2 ---
function atan(x: number): number {
  return Math.atan(x);
}
function atan2(dy: number, dx: number): number {
  return Math.atan2(dy, dx);
}

// --- Mth.cpp:65-67 — random() ---
function random(): number {
  return _rand.nextFloat();
}
// --- Mth.cpp:68-70 — random(int n) ---
function randomInt(n: number): number {
  return _rand.nextInt(n);
}

// --- Mth.cpp:72-75 — intFloorDiv(int, int) ---
function intFloorDiv(a: number, b: number): number {
  if (a < 0) return -((-a - 1) / b | 0) - 1;
  return (a / b) | 0;
}

// --- Mth.cpp:77-85 — abs/Min/Max (float) ---
function abs(a: number): number;
function abs(a: number): number { return a >= 0 ? a : -a; }
function Min(a: number, b: number): number { return a <= b ? a : b; }
function Max(a: number, b: number): number { return a >= b ? a : b; }

// --- Mth.cpp:87-89 — abs/Min/Max (int) — overloaded ---
// §C++ overloads abs/Min/Max for int — in TS, use the same function

// --- Mth.cpp:91-94 — absDecrease(float, float, float) ---
function absDecrease(value: number, with_: number, min: number): number {
  if (value > 0) return Max(min, value - with_);
  return Min(value + with_, -min);
}

// --- Mth.cpp:97-101 — clamp(int, int, int) ---
function clamp(v: number, low: number, high: number): number;
// --- Mth.cpp:103-106 — clamp(float, float, float) — overloaded ---
function clamp(v: number, low: number, high: number): number {
  if (v > high) return high;
  return v > low ? v : low;
}

// --- Mth.cpp:107-109 — lerp(float, float, float) ---
function lerp(src: number, dst: number, alpha: number): number;
// --- Mth.cpp:110-112 — lerp(int, int, float) — overloaded ---
function lerp(src: number, dst: number, alpha: number): number {
  return src + (dst - src) * alpha;
}

// --- Mth.cpp:114-118 — absMax(float, float) ---
function absMax(a: number, b: number): number {
  if (a < 0) a = -a;
  if (b < 0) b = -b;
  return a > b ? a : b;
}

// --- Mth.cpp:120-122 — absMaxSigned(float, float) ---
function absMaxSigned(a: number, b: number): number {
  return abs(a) > abs(b) ? a : b;
}

// Initialize the sin table
initMth();

export {
  PI, TWO_PI, DEGRAD, RADDEG,
  initMth, sqrt, invSqrt, floor, cos, sin, atan, atan2,
  random, randomInt, intFloorDiv, abs, Min, Max,
  absDecrease, clamp, lerp, absMax, absMaxSigned
};
