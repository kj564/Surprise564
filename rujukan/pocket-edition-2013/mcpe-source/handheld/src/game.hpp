#pragma once

#include "world.hpp"

namespace pocket {

class Game {
public:
    Game(int width = 16, int height = 8, int depth = 16);

    const World& world() const noexcept { return world_; }
    Position playerPosition() const noexcept { return player_; }
    bool move(int dx, int dy, int dz) noexcept;
    Block blockAtPlayer() const noexcept;

private:
    World world_;
    Position player_;
};

} // namespace pocket
