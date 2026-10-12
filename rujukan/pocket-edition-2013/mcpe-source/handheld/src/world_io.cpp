#include "world_io.hpp"

#include <fstream>
#include <vector>

namespace pocket {
namespace {

bool decodeBlock(int value, Block& block) {
    switch (value) {
        case 0: block = Block::Air; return true;
        case 1: block = Block::Grass; return true;
        case 2: block = Block::Dirt; return true;
        case 3: block = Block::Stone; return true;
        default: return false;
    }
}

int encodeBlock(Block block) {
    switch (block) {
        case Block::Air: return 0;
        case Block::Grass: return 1;
        case Block::Dirt: return 2;
        case Block::Stone: return 3;
    }
    return -1;
}

} // namespace

bool saveWorld(const World& world, const std::string& path) {
    std::ofstream out(path, std::ios::out | std::ios::trunc);
    if (!out) return false;
    out << "POCKET_WORLD 1\n" << world.width() << ' ' << world.height() << ' '
        << world.depth() << '\n';
    for (int y = 0; y < world.height(); ++y) {
        for (int z = 0; z < world.depth(); ++z) {
            for (int x = 0; x < world.width(); ++x) {
                out << encodeBlock(world.get({x, y, z})) << ' ';
            }
            out << '\n';
        }
    }
    return static_cast<bool>(out);
}

bool loadWorld(World& world, const std::string& path) {
    std::ifstream in(path);
    if (!in) return false;

    std::string magic;
    int version = 0;
    int width = 0, height = 0, depth = 0;
    if (!(in >> magic >> version) || magic != "POCKET_WORLD" || version != 1) return false;
    if (!(in >> width >> height >> depth)) return false;
    if (width != world.width() || height != world.height() || depth != world.depth()) return false;

    const std::size_t total = static_cast<std::size_t>(width) * static_cast<std::size_t>(height) * static_cast<std::size_t>(depth);
    std::vector<Block> decoded;
    decoded.reserve(total);
    for (std::size_t i = 0; i < total; ++i) {
        int value = -1;
        Block block = Block::Air;
        if (!(in >> value) || !decodeBlock(value, block)) return false;
        decoded.push_back(block);
    }

    // Commit only after the complete file has been validated.
    std::size_t i = 0;
    for (int y = 0; y < height; ++y) {
        for (int z = 0; z < depth; ++z) {
            for (int x = 0; x < width; ++x) {
                world.set({x, y, z}, decoded[i++]);
            }
        }
    }
    return true;
}

} // namespace pocket
