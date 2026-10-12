#include "game.hpp"

#include <iostream>
#include <sstream>
#include <string>

namespace {

void printHelp() {
    std::cout << "Commands:\n"
              << "  look                 Show player position and current block\n"
              << "  move <direction>     north/south/east/west/up/down\n"
              << "  stats                Show world dimensions and block counts\n"
              << "  help                 Show this help\n"
              << "  quit                 Exit the prototype\n";
}

void printLook(const pocket::Game& game) {
    const auto p = game.playerPosition();
    std::cout << "Player: (" << p.x << ", " << p.y << ", " << p.z << ")\n"
              << "Block at player: " << pocket::blockName(game.blockAtPlayer()) << "\n";
}

void printStats(const pocket::World& world) {
    std::cout << "World: " << world.width() << " x " << world.height()
              << " x " << world.depth() << "\n"
              << "Air: " << world.count(pocket::Block::Air)
              << " | Grass: " << world.count(pocket::Block::Grass)
              << " | Dirt: " << world.count(pocket::Block::Dirt)
              << " | Stone: " << world.count(pocket::Block::Stone) << "\n";
}

bool directionDelta(const std::string& direction, int& dx, int& dy, int& dz) {
    dx = dy = dz = 0;
    if (direction == "north") dz = -1;
    else if (direction == "south") dz = 1;
    else if (direction == "east") dx = 1;
    else if (direction == "west") dx = -1;
    else if (direction == "up") dy = 1;
    else if (direction == "down") dy = -1;
    else return false;
    return true;
}

} // namespace

int main() {
    pocket::Game game;
    std::cout << "Pocket Engine Study v0.1.0 (original clean-room prototype)\n";
    std::cout << "Type 'help' for commands. This is not Minecraft source code.\n";

    std::string line;
    while (std::cout << "> " && std::getline(std::cin, line)) {
        std::istringstream input(line);
        std::string command;
        input >> command;

        if (command.empty()) continue;
        if (command == "quit" || command == "exit") break;
        if (command == "help") {
            printHelp();
        } else if (command == "look") {
            printLook(game);
        } else if (command == "stats") {
            printStats(game.world());
        } else if (command == "move") {
            std::string direction;
            input >> direction;
            int dx = 0, dy = 0, dz = 0;
            if (!directionDelta(direction, dx, dy, dz)) {
                std::cout << "Unknown direction. Use north/south/east/west/up/down.\n";
            } else if (!game.move(dx, dy, dz)) {
                std::cout << "Move blocked: outside world bounds.\n";
            } else {
                printLook(game);
            }
        } else {
            std::cout << "Unknown command. Type 'help'.\n";
        }
    }

    std::cout << "Goodbye.\n";
    return 0;
}
