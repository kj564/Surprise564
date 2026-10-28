// §Minimal compilation test — verify Emscripten can compile MCPE 2013 C++ code
#include <cstdio>
#include <string>

// §Test: Can we compile MCPE 2013 C++ classes?
class TestTile {
public:
    int id;
    int tex;
    std::string name;
    
    TestTile(int id, int tex, const std::string& name) 
        : id(id), tex(tex), name(name) {}
    
    int getTexture(int face) { return tex; }
};

int main() {
    printf("MCPE 2013 WASM Test\n");
    TestTile stone(1, 1, "Stone");
    printf("Tile: %s (id=%d, tex=%d)\n", stone.name.c_str(), stone.id, stone.tex);
    return 0;
}
