#include "game.hpp"
#include "world.hpp"

#include <cassert>
#include <iostream>

int main() {
    using namespace pocket;

    World world(4, 6, 3);
    assert(world.width() == 4);
    assert(world.get({0, 0, 0}) == Block::Air);
    assert(!world.set({-1, 0, 0}, Block::Stone));
    assert(world.set({1, 1, 1}, Block::Stone));
    assert(world.get({1, 1, 1}) == Block::Stone);

    world.generateFlat(4);
    assert(world.get({0, 3, 0}) == Block::Grass);
    assert(world.get({0, 2, 0}) == Block::Dirt);
    assert(world.get({0, 0, 0}) == Block::Stone);
    assert(world.get({0, 5, 0}) == Block::Air);

    Game game(8, 8, 8);
    const Position before = game.playerPosition();
    assert(game.move(1, 0, 0));
    assert(game.playerPosition().x == before.x + 1);
    assert(!game.move(100, 0, 0));

    std::cout << "All pocket-engine tests passed.\n";
    return 0;
}
