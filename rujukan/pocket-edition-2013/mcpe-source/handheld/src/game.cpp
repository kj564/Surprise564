#include "game.hpp"

namespace pocket {

Game::Game(int width, int height, int depth)
    : world_(width, height, depth), player_{width / 2, 4 < height ? 4 : height - 1, depth / 2} {
    world_.generateFlat(height / 2);
    // Keep the player above the generated surface where possible.
    const int surface = height / 2;
    player_.y = surface < height ? surface : height - 1;
}

bool Game::move(int dx, int dy, int dz) noexcept {
    const Position next{player_.x + dx, player_.y + dy, player_.z + dz};
    if (!world_.contains(next)) return false;
    player_ = next;
    return true;
}

Block Game::blockAtPlayer() const noexcept {
    return world_.get(player_);
}

} // namespace pocket
