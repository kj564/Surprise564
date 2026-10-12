#include "game.hpp"
#include "world.hpp"
#include "world_io.hpp"

#include <cstdio>
#include <cstdlib>
#include <fstream>
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

    const char* savePath = "pocket_world_test.save";
    check(saveWorld(world, savePath), "world save succeeds");
    World restored(4, 6, 3);
    check(loadWorld(restored, savePath), "world load succeeds");
    check(restored.get({0, 3, 0}) == Block::Grass, "saved surface survives round trip");
    check(restored.get({0, 0, 0}) == Block::Stone, "saved stone survives round trip");

    {
        std::ofstream corrupt(savePath, std::ios::trunc);
        corrupt << "POCKET_WORLD 1\n4 6 3\n999\n";
    }
    const Block beforeFailedLoad = restored.get({0, 3, 0});
    check(!loadWorld(restored, savePath), "invalid block ID is rejected");
    check(restored.get({0, 3, 0}) == beforeFailedLoad, "failed load leaves world unchanged");
    std::remove(savePath);

    Game game(8, 8, 8);
    const Position before = game.playerPosition();
    check(game.move(1, 0, 0), "valid player movement succeeds");
    check(game.playerPosition().x == before.x + 1, "movement updates player position");
    check(!game.move(100, 0, 0), "movement outside world is rejected");

    std::cout << "All pocket-engine tests passed.\n";
    return EXIT_SUCCESS;
}
