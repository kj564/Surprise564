#ifndef HELL_SAND_TILE_H
#define HELL_SAND_TILE_H
#include "Tile.h"
#include "Material.h"
// §Inferred from 0.7.0: HellSandTile (soul sand) — slows entity movement.
// Pattern: Tile subclass with sand material, no special render.
// Constructor: HellSandTile(int id, int tex, const Material* material)
// Based on HeavyTile pattern (sand is HeavyTile in source).
class HellSandTile : public Tile {
    typedef Tile super;
public:
    HellSandTile(int id, int tex, const Material* material) : super(id, tex, material) {}
};
#endif
