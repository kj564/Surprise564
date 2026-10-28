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
    FallingTile(void* level, float x, float y, float z, int id, int data) {}
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

// §GL1 function stubs — no-op implementations so engine runs without LEGACY_GL_EMULATION
// These prevent crashes when MCPE calls GL1 fixed-function pipeline functions.
// Rendering won't work, but engine logic (level gen, physics, etc.) will run.
extern "C" {
    // glEnable/glDisable — no-op
    void glEnable(unsigned int) {}
    void glDisable(unsigned int) {}
    void glEnableClientState(unsigned int) {}
    void glDisableClientState(unsigned int) {}
    
    // Depth/alpha/cull
    void glDepthFunc(unsigned int) {}
    void glDepthRangef(float, float) {}
    void glAlphaFunc(unsigned int, float) {}
    void glCullFace(unsigned int) {}
    void glHint(unsigned int, unsigned int) {}
    void glShadeModel(unsigned int) {}
    void glColorMaterial(unsigned int, unsigned int) {}
    void glPolygonMode(unsigned int, unsigned int) {}
    
    // Matrix
    void glMatrixMode(unsigned int) {}
    void glLoadIdentity() {}
    void glPushMatrix() {}
    void glPopMatrix() {}
    void glTranslatef(float, float, float) {}
    void glRotatef(float, float, float, float) {}
    void glScalef(float, float, float) {}
    void glOrthof(float, float, float, float, float, float) {}
    void glOrtho(double, double, double, double, double, double) {}
    void glFrustumf(float, float, float, float, float, float) {}
    void glFrustum(double, double, double, double, double, double) {}
    void glMultMatrixf(const float*) {}
    void glLoadMatrixf(const float*) {}
    
    // Color/vertex/normal/texcoord (immediate mode)
    void glColor3f(float, float, float) {}
    void glColor4f(float, float, float, float) {}
    void glColor4ub(unsigned char, unsigned char, unsigned char, unsigned char) {}
    void glVertex3f(float, float, float) {}
    void glVertex2f(float, float) {}
    void glTexCoord2f(float, float) {}
    void glNormal3f(float, float, float) {}
    
    // Begin/end
    void glBegin(unsigned int) {}
    void glEnd() {}
    
    // Display lists
    unsigned int glGenLists(int) { return 1; }
    void glNewList(unsigned int, unsigned int) {}
    void glEndList() {}
    void glCallList(unsigned int) {}
    void glCallLists(int, unsigned int, const void*) {}
    void glDeleteLists(unsigned int, int) {}
    void glListBase(unsigned int) {}
    
    // Pointers
    void glVertexPointer(int, unsigned int, int, const void*) {}
    void glTexCoordPointer(int, unsigned int, int, const void*) {}
    void glNormalPointer(unsigned int, int, const void*) {}
    void glColorPointer(int, unsigned int, int, const void*) {}
    
    // Point size
    void glPointSize(float) {}
    
    // Fog
    void glFogf(unsigned int, float) {}
    void glFogfv(unsigned int, const float*) {}
    void glFogi(unsigned int, int) {}
    
    // Lighting
    void glLightfv(unsigned int, unsigned int, const float*) {}
    void glMaterialfv(unsigned int, unsigned int, const float*) {}
    
    // Textures
    void glActiveTexture(unsigned int) {}
    void glClientActiveTexture(unsigned int) {}
    
    // Clear
    void glClear(unsigned int) {}
    void glClearColor(float, float, float, float) {}
    void glClearDepthf(float) {}
    void glViewport(int, int, int, int) {}
    
    // Textures bind/create
    void glBindTexture(unsigned int, unsigned int) {}
    void glGenTextures(int, unsigned int*) {}
    void glDeleteTextures(int, const unsigned int*) {}
    void glTexImage2D(unsigned int, int, int, int, int, int, unsigned int, unsigned int, const void*) {}
    void glTexSubImage2D(unsigned int, int, int, int, int, int, unsigned int, unsigned int, const void*) {}
    void glTexParameteri(unsigned int, unsigned int, int) {}
    void glTexParameterf(unsigned int, unsigned int, float) {}
    
    // Drawing
    void glDrawArrays(unsigned int, int, int) {}
    void glDrawElements(unsigned int, int, unsigned int, const void*) {}
    
    // Buffers
    void glGenBuffers(int, unsigned int*) {}
    void glDeleteBuffers(int, const unsigned int*) {}
    void glBindBuffer(unsigned int, unsigned int) {}
    void glBufferData(unsigned int, int, const void*, unsigned int) {}
    void glBufferSubData(unsigned int, int, int, const void*) {}
    
    // Shaders (not used but stubbed)
    unsigned int glCreateShader(unsigned int) { return 0; }
    void glShaderSource(unsigned int, int, const char**, const int*) {}
    void glCompileShader(unsigned int) {}
    unsigned int glCreateProgram() { return 0; }
    void glAttachShader(unsigned int, unsigned int) {}
    void glLinkProgram(unsigned int) {}
    void glUseProgram(unsigned int) {}
    
    // Misc
    int glGetError() { return 0; }
    void glGetIntegerv(unsigned int, int*) {}
    void glGetFloatv(unsigned int, float*) {}
    const unsigned char* glGetString(unsigned int) { return (const unsigned char*)""; }
    void glFinish() {}
    void glFlush() {}
}

// MCPE custom GL wrapper functions (from gles.cpp)
extern "C" {
    void drawArrayVT(int, int, int, int, const void*, ...) {}
    void drawArrayVT_NoState(int, int, int, int, const void*, ...) {}
    void drawArrayVTC(int, int, int, ...) {}
    void drawArrayVTC_NoState(int, int, int, ...) {}
}

// §Additional GL stubs for GLES1 fixed-point functions
extern "C" {
    void glFogx(unsigned int, int) {}
    void glFogxv(unsigned int, const int*) {}
    void glTexParameterx(unsigned int, unsigned int, int) {}
    void glTexParameteriv(unsigned int, unsigned int, const int*) {}
    void glClipPlanex(unsigned int, const int*) {}
    void glMultMatrixx(const int*) {}
    void glLoadMatrixx(const int*) {}
    void glOrthox(int, int, int, int, int, int) {}
    void glFrustumx(int, int, int, int, int, int) {}
    void glDepthRangex(int, int) {}
    void glClearDepthx(int) {}
    void glAlphaFuncx(unsigned int, int) {}
    void glColor4x(int, int, int, int) {}
    void glLightxv(unsigned int, unsigned int, const int*) {}
    void glMaterialxv(unsigned int, unsigned int, const int*) {}
    void glPointSizex(int) {}
    void glPointParameterx(unsigned int, int) {}
    void glPointParameterxv(unsigned int, const int*) {}
    void glLineWidthx(int) {}
    void glBlendFunc(unsigned int, unsigned int) {}
    void glBlendFuncSeparate(unsigned int, unsigned int, unsigned int, unsigned int) {}
    void glStencilFunc(unsigned int, int, unsigned int) {}
    void glStencilOp(unsigned int, unsigned int, unsigned int) {}
    void glStencilMask(unsigned int) {}
    void glScissor(int, int, int, int) {}
    void glFrontFace(unsigned int) {}
    void glPixelStorei(unsigned int, int) {}
    void glReadPixels(int, int, int, int, unsigned int, unsigned int, void*) {}
    void glCopyTexImage2D(unsigned int, int, unsigned int, int, int, int, int, int) {}
    void glCopyTexSubImage2D(unsigned int, int, int, int, int, int, int, int) {}
    void glCompressedTexImage2D(unsigned int, int, unsigned int, int, int, int, int, const void*) {}
    void glGetTexParameteriv(unsigned int, unsigned int, int*) {}
    void glGetTexLevelParameteriv(unsigned int, int, unsigned int, int*) {}
    void glGenFramebuffers(int, unsigned int*) {}
    void glDeleteFramebuffers(int, const unsigned int*) {}
    void glBindFramebuffer(unsigned int, unsigned int) {}
    void glFramebufferTexture2D(unsigned int, unsigned int, unsigned int, unsigned int, int) {}
    void glGenRenderbuffers(int, unsigned int*) {}
    void glDeleteRenderbuffers(int, const unsigned int*) {}
    void glBindRenderbuffer(unsigned int, unsigned int) {}
    void glRenderbufferStorage(unsigned int, unsigned int, int, int) {}
    void glFramebufferRenderbuffer(unsigned int, unsigned int, unsigned int, unsigned int) {}
    int glCheckFramebufferStatus(unsigned int) { return 0x8CD5; }
    void glGetAttribLocation(unsigned int, const char*) {}
    void glGetUniformLocation(unsigned int, const char*) {}
    void glUniform1i(int, int) {}
    void glUniform1f(int, float) {}
    void glUniformMatrix4fv(int, int, unsigned char, const float*) {}
    void glVertexAttribPointer(unsigned int, int, unsigned int, unsigned char, int, const void*) {}
    void glEnableVertexAttribArray(unsigned int) {}
    void glDisableVertexAttribArray(unsigned int) {}
    void glGetShaderiv(unsigned int, unsigned int, int*) {}
    void glGetProgramiv(unsigned int, unsigned int, int*) {}
    void glGetShaderInfoLog(unsigned int, int, int*, char*) {}
    void glGetProgramInfoLog(unsigned int, int, int*, char*) {}
    void glDeleteShader(unsigned int) {}
    void glDeleteProgram(unsigned int) {}
    void glDetachShader(unsigned int, unsigned int) {}
    void glBindAttribLocation(unsigned int, int, const char*) {}
}

// MCPE custom functions (from gles.cpp)
extern "C" {
    void glEnable2(unsigned int cap) { glEnable(cap); }
    void glDisable2(unsigned int cap) { glDisable(cap); }
    void glDepthFunc2(unsigned int f) { glDepthFunc(f); }
    void glDepthRangef2(float n, float f) { glDepthRangef(n, f); }
    void glAlphaFunc2(unsigned int f, float r) { glAlphaFunc(f, r); }
    void glTranslatef2(float x, float y, float z) { glTranslatef(x, y, z); }
    void glRotatef2(float a, float x, float y, float z) { glRotatef(a, x, y, z); }
    void glScalef2(float x, float y, float z) { glScalef(x, y, z); }
    void glPushMatrix2() { glPushMatrix(); }
    void glPopMatrix2() { glPopMatrix(); }
    void glColor4f2(float r, float g, float b, float a) { glColor4f(r, g, b, a); }
    void glBindTexture2(unsigned int t, unsigned int id) { glBindTexture(t, id); }
    void glTexCoordPointer2(int s, unsigned int t, int st, const void* p) { glTexCoordPointer(s, t, st, p); }
    void glEnableClientState2(unsigned int c) { glEnableClientState(c); }
    void glDisableClientState2(unsigned int c) { glDisableClientState(c); }
    void glTexParameteri2(unsigned int t, unsigned int n, int v) { glTexParameteri(t, n, v); }
    void glTexImage2D2(unsigned int t, int l, int i, int w, int h, int b, unsigned int f, unsigned int ty, const void* d) { glTexImage2D(t, l, i, w, h, b, f, ty, d); }
    void glDrawElements2(unsigned int m, int c, unsigned int t, const void* p) { glDrawElements(m, c, t, p); }
    void glDrawArrays2(unsigned int m, int f, int c) { glDrawArrays(m, f, c); }
    void glGenTextures2(int n, unsigned int* t) { glGenTextures(n, t); }
    void glActiveTexture2(unsigned int t) { glActiveTexture(t); }
    void glClientActiveTexture2(unsigned int t) { glClientActiveTexture(t); }
    void glBlendFunc2(unsigned int s, unsigned int d) { glBlendFunc(s, d); }
    void glFogfv2(unsigned int n, const float* p) { glFogfv(n, p); }
    void glFogf2(unsigned int n, float p) { glFogf(n, p); }
    void glShadeModel2(unsigned int m) { glShadeModel(m); }
    void glFogi2(unsigned int n, int p) { glFogi(n, p); }
    void glCullFace2(unsigned int f) { glCullFace(f); }
    void glDepthMask(unsigned char) {}
    void glColorMask(unsigned char, unsigned char, unsigned char, unsigned char) {}
    void glPolygonOffset(float, float) {}
    void glSampleCoverage(float, unsigned char) {}
}
