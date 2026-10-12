#pragma once

#include <cstddef>
#include <vector>

namespace pocket {

enum class Block { Air, Grass, Dirt, Stone };

struct Position {
    int x{0};
    int y{0};
    int z{0};
};

class World {
public:
    World(int width, int height, int depth);

    int width() const noexcept { return width_; }
    int height() const noexcept { return height_; }
    int depth() const noexcept { return depth_; }

    bool contains(Position p) const noexcept;
    Block get(Position p) const noexcept;
    bool set(Position p, Block block) noexcept;
    void generateFlat(int groundHeight);
    std::size_t count(Block block) const noexcept;

private:
    std::size_t index(Position p) const noexcept;

    int width_;
    int height_;
    int depth_;
    std::vector<Block> blocks_;
};

const char* blockName(Block block) noexcept;

} // namespace pocket
