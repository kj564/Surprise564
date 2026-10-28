// §Facing.ts — Direct 1:1 translation of C++ Facing.h + Direction.cpp
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/Facing.h + Direction.cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- Facing.h:9-14 — static constants ---
const DOWN = 0;
const UP = 1;
const NORTH = 2;
const SOUTH = 3;
const WEST = 4;
const EAST = 5;

// --- Facing.h:16-24 — toString(int face) ---
function facingToString(face: number): string {
  if (face === DOWN) return 'Down';
  if (face === UP) return 'Up';
  if (face === NORTH) return 'North';
  if (face === SOUTH) return 'South';
  if (face === WEST) return 'West';
  if (face === EAST) return 'East';
  return 'Unknown facing';
}

// --- Direction.cpp — static arrays ---
const OPPOSITE_FACING = [UP, DOWN, SOUTH, NORTH, EAST, WEST];
const STEP_X = [0, 0, 0, 0, -1, 1];
const STEP_Y = [-1, 1, 0, 0, 0, 0];
const STEP_Z = [0, 0, -1, 1, 0, 0];

export { DOWN, UP, NORTH, SOUTH, WEST, EAST, facingToString, OPPOSITE_FACING, STEP_X, STEP_Y, STEP_Z };
