// §ItemCategory.ts — Direct 1:1 translation of C++ ItemCategory.h
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/item/ItemCategory.h
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- ItemCategory.h:6-10 — static constants ---
const Structures = 1;
const Tools = 2;
const FoodArmor = 4;
const Decorations = 8;
const Mechanisms = 16;

// --- ItemCategory.h:12 — NUM_CATEGORIES ---
const NUM_CATEGORIES = 5;

// --- ItemCategory.h:14-26 — categoryToString(int id) ---
function categoryToString(id: number): string {
  switch (id) {
    case Structures: return 'Structures';
    case Tools: return 'Tools';
    case FoodArmor: return 'Food and\nArmor';
    case Decorations: return 'Decorations';
    case Mechanisms: return 'Mechanisms';
    default: return '<Unknown category>';
  }
}

export { Structures, Tools, FoodArmor, Decorations, Mechanisms, NUM_CATEGORIES, categoryToString };
