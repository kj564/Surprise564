#include <string>
// §Platform stubs for Emscripten — provides functions that MCPE 2013 C++ expects
#include <ctime>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cmath>

// §platform/time.h
int getTimeMs() { return (int)(clock() * 1000.0 / CLOCKS_PER_SEC); }
long getEpochTimeS() { return (long)time(nullptr); }

// §platform/log.h
#define LOGI(...) fprintf(stderr, "[I] " __VA_ARGS__)
#define LOGW(...) fprintf(stderr, "[W] " __VA_ARGS__)
#define LOGE(...) fprintf(stderr, "[E] " __VA_ARGS__)

// §Performance.h stubs
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
// We define minimal GL constants that MCPE needs
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

// §Minimal GL function stubs — real ones come from Emscripten WebGL
extern "C" {
    void glEnable(int) {}
    void glDisable(int) {}
    void glColor4f(float r, float g, float b, float a) {}
    void glClearColor(float, float, float, float) {}
    void glClear(int) {}
    void glViewport(int, int, int, int) {}
    void glMatrixMode(int) {}
    void glLoadIdentity() {}
    void glOrthof(float, float, float, float, float, float) {}
    void glFrustumf(float, float, float, float, float, float) {}
    void glTranslatef(float, float, float) {}
    void glRotatef(float, float, float, float) {}
    void glScalef(float, float, float) {}
    void glPushMatrix() {}
    void glPopMatrix() {}
    void glBegin(int) {}
    void glEnd() {}
    void glVertex3f(float, float, float) {}
    void glVertex2f(float, float) {}
    void glTexCoord2f(float, float) {}
    void glColor4ub(unsigned char, unsigned char, unsigned char, unsigned char) {}
    void glBindTexture(int, unsigned int) {}
    void glGenTextures(int, unsigned int*) {}
    void glTexImage2D(int, int, int, int, int, int, int, int, const void*) {}
    void glTexSubImage2D(int, int, int, int, int, int, int, int, const void*) {}
    void glTexParameteri(int, int, int) {}
    void glDrawElements(int, int, int, const void*) {}
    void glDrawArrays(int, int, int) {}
    void glEnableClientState(int) {}
    void glDisableClientState(int) {}
    void glVertexPointer(int, int, int, const void*) {}
    void glTexCoordPointer(int, int, int, const void*) {}
    void glColorPointer(int, int, int, const void*) {}
    void glDeleteTextures(int, const unsigned int*) {}
    unsigned int glGenLists(int) { return 0; }
    void glCallList(unsigned int) {}
    void glNewList(unsigned int, int) {}
    void glEndList() {}
    void glDeleteLists(unsigned int, int) {}
    void glFlush() {}
    void glFinish() {}
}


// §Pos.h stubs
struct Pos {
    int x, y, z;
    Pos() : x(0), y(0), z(0) {}
    Pos(int x, int y, int z) : x(x), y(y), z(z) {}
};

// §FallingTile (entity) stub — SandTile.cpp references it
class FallingTile {
public:
    FallingTile(void* level, float x, float y, float z, int id, int data) {}
    int throwTime;
};

// §EntityTypes stubs
namespace EntityTypes {
    enum Id { IdZombie = 32, IdSkeleton = 34, IdSpider = 35, IdCreeper = 33,
              IdArrow = 80, IdPainting = 9, IdChicken = 10, IdCow = 11, IdPig = 12, IdSheep = 13 };
}

// §MobCategory stubs
class MobCategory {
public:
    static const MobCategory* monster;
    static const MobCategory* creature;
    static const MobCategory* waterCreature;
    static void initMobCategories() {}
    int getMaxInstancesPerChunk() const { return 4; }
};
const MobCategory* MobCategory::monster = nullptr;
const MobCategory* MobCategory::creature = nullptr;
const MobCategory* MobCategory::waterCreature = nullptr;

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

// §TileEntityFactory stubs
class TileEntityFactory {
public:
    static void* createTileEntity(int type) { return nullptr; }
};

// §I18n stubs
#include <string>
namespace I18n {
    inline std::string get(const std::string& key) { return key; }
}

// §LevelData stub
class LevelData {
public:
    int getGameType() const { return 1; }
    long getTime() const { return 0; }
    bool getSpawnMobs() const { return true; }
    void setLevelName(const std::string&) {}
};

// §Level stub — minimal interface for tile .cpp files
class Level {
public:
    LevelData* getLevelData() { static LevelData d; return &d; }
    bool isClientSide = false;
};

// §NetherReactorPattern stub
class NetherReactorPattern {
public:
    NetherReactorPattern() {}
};

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
    #define PARTICLETYPE(x) ParticleType::Id()
}

// §LightLayer stubs
struct LightLayer {
    static const LightLayer Sky;
    static const LightLayer Block;
};
const LightLayer LightLayer::Sky = {};
const LightLayer LightLayer::Block = {};

// §EntityRendererId stubs
namespace EntityRendererId {
    enum { ER_DEFAULT_RENDERER = 0, ER_PLAYER_RENDERER = 1, ER_ITEM_RENDERER = 2 };
}


// §EntityTile stubs
// EntityTile extends Tile — needs Level, but we can provide minimal impl


// §Recipe constants
class Recipe {
public:
    static const int SIZE_2X2 = 0;
    static const int SIZE_3X3 = 1;
    static const int ANY_AUX_VALUE = -1;
    static bool isAnyAuxValue(int) { return false; }
};
const int Recipe::SIZE_2X2;
const int Recipe::SIZE_3X3;
const int Recipe::ANY_AUX_VALUE;

// §Tag stubs (NBT)
class Tag {
public:
    static const int TAG_Compound = 10;
    static const int TAG_List = 9;
    Tag(const std::string& name) : name(name) {}
    virtual ~Tag() {}
    std::string name;
    int getId() const { return 0; }
};


