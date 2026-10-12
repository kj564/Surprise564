#pragma once

#include "world.hpp"

#include <string>

namespace pocket {

// Saves a world in a small versioned text format. Returns false on I/O failure.
bool saveWorld(const World& world, const std::string& path);

// Loads only matching dimensions and known block IDs. On failure, world is unchanged.
bool loadWorld(World& world, const std::string& path);

} // namespace pocket
