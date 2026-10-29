// §Platform stubs for Emscripten — provides functions/classes that MCPE 2013 C++
// expects but that are NOT in the rujukan source tree (or are platform-specific
// to Android/Win32 that we replace with browser equivalents).
//
// What lives here (after deduplication):
//   - GL constants (for client/renderer files that don't include GLES/gl.h)
//   - Pos struct (used by some tile .cpp files)
//   - FallingTile stub (entity not yet linked)
//   - EntityTypes enum (forward declarations for IDs)
//   - MobCategory static pointer init (MobCategory.cpp is stub-only in rujukan)
//     — but MobCategory.cpp from rujukan DOES exist and DOES define these.
//     So we DON'T re-define here.
//   - I18n, Difficulty, TileEntityType, SharedFlagsInformation, etc. — these
//     are enum/namespace stubs for files that don't include the full headers.
//   - Tag stub (NBT) — full Tag.cpp exists in rujukan, so we DON'T redefine.

#include <string>
#include <ctime>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cmath>

// §Performance.h stubs (only StopwatchHandler init — Performance.cpp has the rest)
namespace Perf {
    class Stopwatch {
    public:
        void start() {}
        void stop() {}
        void print() {}
        void printEvery(int, const char*) {}
    };
}

// §gles.h stubs — Emscripten provides real WebGL via -s USE_WEBGL2=1
#define GL_DEPTH_TEST 0x0B71
#define GL_ALPHA_TEST 0x0BC0
#define GL_BLEND 0x0BE2
#define GL_TEXTURE_2D 0x0DE1
#define GL_FOG 0x0B60
#define GL_PROJECTION 0x1701
#define GL_MODELVIEW 0x1700
#define GL_TEXTURE 0x1702
#define GL_NEAREST 0x2600
#define GL_LINEAR 0x2601
#define GL_REPEAT 0x2901
#define GL_CLAMP_TO_EDGE 0x812F
#define GL_FRONT 0x0404
#define GL_BACK 0x0405
#define GL_TRIANGLES 0x0004
#define GL_TRIANGLE_STRIP 0x0005
#define GL_TRIANGLE_FAN 0x0006
#define GL_UNSIGNED_BYTE 0x1401
#define GL_UNSIGNED_SHORT 0x1403
#define GL_FLOAT 0x1406
#define GL_RGB 0x1907
#define GL_RGBA 0x1908
#define GL_LUMINANCE 0x1909
#define GL_LUMINANCE_ALPHA 0x190A
#define GL_STATIC_DRAW 0x88E4
#define GL_ARRAY_BUFFER 0x8892
#define GL_ELEMENT_ARRAY_BUFFER 0x8893

// §Pos.h stubs
struct Pos {
    int x, y, z;
    Pos() : x(0), y(0), z(0) {}
    Pos(int x, int y, int z) : x(x), y(y), z(z) {}
};

// §FallingTile stub — SandTile.cpp references it. Full FallingTile.cpp exists
// in rujukan but it pulls in Entity.cpp chain. Keep minimal stub for now.
class FallingTile {
public:
    FallingTile(void* level) {}
    FallingTile(void* level, float x, float y, float z, int id, int data = 0) {}
    int throwTime;
};

// §EntityTypes stubs — IDs only (for files that need the enum but not the .cpp)
namespace EntityTypes {
    enum Id { IdZombie = 32, IdSkeleton = 34, IdSpider = 35, IdCreeper = 33,
              IdArrow = 80, IdPainting = 9, IdChicken = 10, IdCow = 11, IdPig = 12, IdSheep = 13,
              IdFallingTile = 70 };
}

// §MobTypes stubs
namespace MobTypes {
    enum { BaseEnemy = 1, Creature = 2, WaterAnimal = 3 };
}

// §EntityEvent stubs
namespace EntityEvent {
    enum { HURT = 2, DEATH = 3, USE_ITEM_COMPLETE = 9 };
}

// §Difficulty stubs
namespace Difficulty {
    static const int PEACEFUL = 0;
    static const int EASY = 1;
    static const int NORMAL = 2;
    static const int HARD = 3;
}

// §TileEntityType stubs
namespace TileEntityType {
    static const int Undefined = 0;
    static const int Furnace = 1;
    static const int Chest = 2;
    static const int NetherReactor = 3;
    static const int Sign = 4;
}

// §SharedFlagsInformation stubs
namespace SharedFlagsInformation {
    static const int DATA_SHARED_FLAGS_ID = 13;
    static const int FLAG_SNEAKING = 1;
    static const int FLAG_SPRINTING = 3;
    static const int FLAG_FLYING = 7;
    static const int FLAG_USINGITEM = 4;
}

// §ParticleType stubs
namespace ParticleType {
    struct Id {};
}

// §EntityRendererId stubs
namespace EntityRendererId {
    enum { ER_DEFAULT_RENDERER = 0, ER_PLAYER_RENDERER = 1, ER_ITEM_RENDERER = 2 };
}

// §I18n stubs — real I18n is in locale/.
namespace I18n {
    inline std::string get(const std::string& key) { return key; }
}

