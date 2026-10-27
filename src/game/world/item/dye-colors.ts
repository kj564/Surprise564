// §MCPE 2013 DyePowderItem — dye color constants.
// Rujukan: DyePowderItem.h:21-36
// Every value is verified 1:1 against the rujukan C++ source.

/** §DyePowderItem.h:21 — `static const int BLACK = 0;` */
export const DYE_BLACK = 0;
/** §DyePowderItem.h:22 — `static const int RED = 1;` */
export const DYE_RED = 1;
/** §DyePowderItem.h:23 — `static const int GREEN = 2;` */
export const DYE_GREEN = 2;
/** §DyePowderItem.h:24 — `static const int BROWN = 3;` */
export const DYE_BROWN = 3;
/** §DyePowderItem.h:25 — `static const int BLUE = 4;` */
export const DYE_BLUE = 4;
/** §DyePowderItem.h:26 — `static const int PURPLE = 5;` */
export const DYE_PURPLE = 5;
/** §DyePowderItem.h:27 — `static const int CYAN = 6;` */
export const DYE_CYAN = 6;
/** §DyePowderItem.h:28 — `static const int SILVER = 7;` */
export const DYE_SILVER = 7;
/** §DyePowderItem.h:29 — `static const int GRAY = 8;` */
export const DYE_GRAY = 8;
/** §DyePowderItem.h:30 — `static const int PINK = 9;` */
export const DYE_PINK = 9;
/** §DyePowderItem.h:31 — `static const int LIME = 10;` */
export const DYE_LIME = 10;
/** §DyePowderItem.h:32 — `static const int YELLOW = 11;` */
export const DYE_YELLOW = 11;
/** §DyePowderItem.h:33 — `static const int LIGHT_BLUE = 12;` */
export const DYE_LIGHT_BLUE = 12;
/** §DyePowderItem.h:34 — `static const int MAGENTA = 13;` */
export const DYE_MAGENTA = 13;
/** §DyePowderItem.h:35 — `static const int ORANGE = 14;` */
export const DYE_ORANGE = 14;
/** §DyePowderItem.h:36 — `static const int WHITE = 15;` */
export const DYE_WHITE = 15;

export type DyeColor = typeof DYE_BLACK | typeof DYE_RED | typeof DYE_GREEN |
  typeof DYE_BROWN | typeof DYE_BLUE | typeof DYE_PURPLE | typeof DYE_CYAN |
  typeof DYE_SILVER | typeof DYE_GRAY | typeof DYE_PINK | typeof DYE_LIME |
  typeof DYE_YELLOW | typeof DYE_LIGHT_BLUE | typeof DYE_MAGENTA |
  typeof DYE_ORANGE | typeof DYE_WHITE;

/** All 16 dye color names in index order (§DyePowderItem.h:21-36). */
export const DYE_COLOR_NAMES = [
  'black', 'red', 'green', 'brown', 'blue', 'purple', 'cyan', 'silver',
  'gray', 'pink', 'lime', 'yellow', 'light_blue', 'magenta', 'orange', 'white',
] as const;
