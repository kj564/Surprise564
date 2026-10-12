#include "world.hpp"

#include <algorithm>
#include <stdexcept>

namespace pocket {

World::World(int width, int height, int depth)
    : width_(width), height_(height), depth_(depth) {
    if (width <= 0 || height <= 0 || depth <= 0) {
        throw std::invalid_argument("World dimensions must be positive");
    }
    blocks_.assign(static_cast<std::size_t>(width_) *
                       static_cast<std::size_t>(height_) *
                       static_cast<std::size_t>(depth_),
                   Block::Air);
}

bool World::contains(Position p) const noexcept {
    return p.x >= 0 && p.x < width_ &&
           p.y >= 0 && p.y < height_ &&
           p.z >= 0 && p.z < depth_;
}

std::size_t World::index(Position p) const noexcept {
    return (static_cast<std::size_t>(p.y) * static_cast<std::size_t>(depth_) +
            static_cast<std::size_t>(p.z)) * static_cast<std::size_t>(width_) +
           static_cast<std::size_t>(p.x);
}

Block World::get(Position p) const noexcept {
    if (!contains(p)) return Block::Air;
    return blocks_[index(p)];
}

bool World::set(Position p, Block block) noexcept {
    if (!contains(p)) return false;
    blocks_[index(p)] = block;
    return true;
}

void World::generateFlat(int groundHeight) {
    const int surface = std::clamp(groundHeight, 0, height_);
    for (int y = 0; y < height_; ++y) {
        for (int z = 0; z < depth_; ++z) {
            for (int x = 0; x < width_; ++x) {
                Block block = Block::Air;
                if (y < surface - 3) block = Block::Stone;
                else if (y < surface - 1) block = Block::Dirt;
                else if (y < surface) block = Block::Grass;
                set({x, y, z}, block);
            }
        }
    }
}

std::size_t World::count(Block block) const noexcept {
    return static_cast<std::size_t>(std::count(blocks_.begin(), blocks_.end(), block));
}

const char* blockName(Block block) noexcept {
    switch (block) {
        case Block::Air: return "Air";
        case Block::Grass: return "Grass";
        case Block::Dirt: return "Dirt";
        case Block::Stone: return "Stone";
    }
    return "Unknown";
}

} // namespace pocket
