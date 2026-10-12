#include "game.hpp"
#include "world.hpp"

#include <cstdlib>
#include <iostream>

namespace {
void check(bool condition, const char* message) {
    if (!condition) {
        std::cerr << "FAILED: " << message << '\n';
        std::exit(EXIT_FAILURE);
    }
}
}

int main() {
    using namespace pocket;

    World world(4, 6, 3);
    check(world.width() == 4, "world width is preserved");
    check(world.get({0, 0, 0}) == Block::Air, "new world starts with air");
    check(!world.set({-1, 0, 0}, Block::Stone), "out-of-bounds writes are rejected");
    check(world.set({1, 1, 1}, Block::Stone), "valid block write succeeds");
    check(world.get({1, 1, 1}) == Block::Stone, "written block can be read");

    world.generateFlat(4);
    check(world.get({0, 3, 0}) == Block::Grass, "surface layer is grass");
    check(world.get({0, 2, 0}) == Block::Dirt, "subsurface layer is dirt");
    check(world.get({0, 0, 0}) == Block::Stone, "deep layer is stone");
    check(world.get({0, 5, 0}) == Block::Air, "space above terrain is air");

    Game game(8, 8, 8);
    const Position before = game.playerPosition();
    check(game.move(1, 0, 0), "valid player movement succeeds");
    check(game.playerPosition().x == before.x + 1, "movement updates player position");
    check(!game.move(100, 0, 0), "movement outside world is rejected");

    std::cout << "All pocket-engine tests passed.\n";
    return EXIT_SUCCESS;
}
