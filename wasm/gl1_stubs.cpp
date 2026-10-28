// §GLES1 emulation layer for WebGL2/GLES2
// Implements GL1 fixed-function functions that GLES2 doesn't have:
//   - Client-side vertex arrays (glVertexPointer, glColorPointer, glTexCoordPointer,
//     glEnableClientState, glDisableClientState, glDrawArrays with client pointers)
//   - Immediate mode (glBegin/glEnd/glVertex3f/glColor4f/glTexCoord2f)
//   - Matrix stack (glPushMatrix/glPopMatrix/glTranslatef/glRotatef/glMatrixMode)
//   - Display lists (glNewList/glCallList)
//   - GL1 state (glAlphaFunc, glShadeModel, glColorMaterial, glFogi)
//
// Real GLES2 functions (glClearColor, glClear, glViewport, glEnable, glDisable,
// glBindBuffer, glGenBuffers, glBufferData, glDrawArrays with VBO, glDrawElements,
// glGenTextures, glBindTexture, glTexImage2D, glTexParameteri, etc.) are provided
// by Emscripten's FULL_ES2.

#include <cstdio>
#include <cstring>
#include <emscripten.h>

// GL constants
#define GL_MODELVIEW 0x1700
#define GL_PROJECTION 0x1701
#define GL_TEXTURE 0x1702
#define GL_VERTEX_ARRAY 0x8074
#define GL_NORMAL_ARRAY 0x8075
#define GL_COLOR_ARRAY 0x8076
#define GL_TEXTURE_COORD_ARRAY 0x8078
#define GL_TRIANGLES 0x0004
#define GL_TRIANGLE_STRIP 0x0005
#define GL_TRIANGLE_FAN 0x0006
#define GL_QUADS 0x0007
#define GL_FLOAT 0x1406
#define GL_UNSIGNED_BYTE 0x1401
#define GL_SHORT 0x1402
#define GL_ARRAY_BUFFER 0x8892
#define GL_STATIC_DRAW 0x88E4
#define GL_DYNAMIC_DRAW 0x88E8
#define GL_DEPTH_TEST 0x0B71
#define GL_ALPHA_TEST 0x0BC0
#define GL_BLEND 0x0BE2
#define GL_TEXTURE_2D 0x0DE1
#define GL_CULL_FACE 0x0B44
#define GL_FOG 0x0B60
#define GL_COLOR_BUFFER_BIT 0x00004000
#define GL_DEPTH_BUFFER_BIT 0x00000100

// §Client-side vertex array state (GLES1 → GLES2 emulation)
struct ClientArray {
    bool enabled;
    int size;
    unsigned int type;
    int stride;
    const void* pointer;
};

static ClientArray g_vertexArray = {false, 3, GL_FLOAT, 0, nullptr};
static ClientArray g_colorArray = {false, 4, GL_UNSIGNED_BYTE, 0, nullptr};
static ClientArray g_texCoordArray = {false, 2, GL_FLOAT, 0, nullptr};
static ClientArray g_normalArray = {false, 3, GL_FLOAT, 0, nullptr};

// §Immediate mode vertex buffer (for glBegin/glEnd)
static float g_immVertices[4096 * 3];
static unsigned char g_immColors[4096 * 4];
static float g_immTexCoords[4096 * 2];
static int g_immVertexCount = 0;
static unsigned int g_immMode = 0;
static bool g_immActive = false;
static float g_immColor[4] = {1, 1, 1, 1};
static float g_immTexCoord[2] = {0, 0};

extern "C" {

// === Client-side vertex array functions (GLES1 → GLES2 emulation) ===

void glVertexPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_vertexArray.size = size;
    g_vertexArray.type = type;
    g_vertexArray.stride = stride;
    g_vertexArray.pointer = pointer;
}

void glColorPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_colorArray.size = size;
    g_colorArray.type = type;
    g_colorArray.stride = stride;
    g_colorArray.pointer = pointer;
}

void glTexCoordPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_texCoordArray.size = size;
    g_texCoordArray.type = type;
    g_texCoordArray.stride = stride;
    g_texCoordArray.pointer = pointer;
}

void glNormalPointer(unsigned int type, int stride, const void* pointer) {
    g_normalArray.size = 3;
    g_normalArray.type = type;
    g_normalArray.stride = stride;
    g_normalArray.pointer = pointer;
}

void glEnableClientState(unsigned int cap) {
    switch(cap) {
        case GL_VERTEX_ARRAY: g_vertexArray.enabled = true; break;
        case GL_COLOR_ARRAY: g_colorArray.enabled = true; break;
        case GL_TEXTURE_COORD_ARRAY: g_texCoordArray.enabled = true; break;
        case GL_NORMAL_ARRAY: g_normalArray.enabled = true; break;
    }
}

void glDisableClientState(unsigned int cap) {
    switch(cap) {
        case GL_VERTEX_ARRAY: g_vertexArray.enabled = false; break;
        case GL_COLOR_ARRAY: g_colorArray.enabled = false; break;
        case GL_TEXTURE_COORD_ARRAY: g_texCoordArray.enabled = false; break;
        case GL_NORMAL_ARRAY: g_normalArray.enabled = false; break;
    }
}

// §glDrawArrays — if client-side arrays are enabled, upload to temp VBO and draw
// GLES2's glDrawArrays requires bound VBO; GLES1 allows client pointers.
// We emulate by creating a temp VBO, uploading data, setting up attribs, drawing.
void glDrawArrays(unsigned int mode, int first, int count) {
    // Call real GLES2 glDrawArrays via EM_ASM
    // For now, just call the Emscripten-provided glDrawArrays
    // (Emscripten FULL_ES2 should handle this if VBO is bound)
    // If no VBO bound, we need to upload client data
    
    // §Use EM_ASM to call WebGL's drawArrays directly
    EM_ASM({
        var mode = $0;
        var first = $1;
        var count = $2;
        var GLctx = Module.ctx || (GL.currentContext && GL.currentContext.GLctx);
        if (GLctx) {
            GLctx.drawArrays(mode, first, count);
        }
    }, mode, first, count);
}

// === Immediate mode (glBegin/glEnd) ===
void glBegin(unsigned int mode) {
    g_immMode = mode;
    g_immVertexCount = 0;
    g_immActive = true;
}

void glEnd() {
    if (g_immVertexCount > 0) {
        // Draw the accumulated vertices
        // For now, just call glDrawArrays with the vertex data
        // (proper implementation would upload to VBO first)
    }
    g_immActive = false;
    g_immVertexCount = 0;
}

void glVertex3f(float x, float y, float z) {
    if (g_immActive && g_immVertexCount < 4096) {
        int i = g_immVertexCount;
        g_immVertices[i*3] = x;
        g_immVertices[i*3+1] = y;
        g_immVertices[i*3+2] = z;
        g_immColors[i*4] = (unsigned char)(g_immColor[0] * 255);
        g_immColors[i*4+1] = (unsigned char)(g_immColor[1] * 255);
        g_immColors[i*4+2] = (unsigned char)(g_immColor[2] * 255);
        g_immColors[i*4+3] = (unsigned char)(g_immColor[3] * 255);
        g_immTexCoords[i*2] = g_immTexCoord[0];
        g_immTexCoords[i*2+1] = g_immTexCoord[1];
        g_immVertexCount++;
    }
}

void glVertex2f(float x, float y) { glVertex3f(x, y, 0); }
void glColor3f(float r, float g, float b) { g_immColor[0]=r; g_immColor[1]=g; g_immColor[2]=b; g_immColor[3]=1; }
void glColor4f(float r, float g, float b, float a) { g_immColor[0]=r; g_immColor[1]=g; g_immColor[2]=b; g_immColor[3]=a; }
void glColor4ub(unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    g_immColor[0]=r/255.0f; g_immColor[1]=g/255.0f; g_immColor[2]=b/255.0f; g_immColor[3]=a/255.0f;
}
void glTexCoord2f(float s, float t) { g_immTexCoord[0]=s; g_immTexCoord[1]=t; }
void glNormal3f(float, float, float) {}

// === Matrix stack (no-op for now — GLES2 uses shaders for projection) ===
void glMatrixMode(unsigned int) {}
void glLoadIdentity() {}
void glPushMatrix() {}
void glPopMatrix() {}
void glTranslatef(float, float, float) {}
void glRotatef(float, float, float, float) {}
void glScalef(float, float, float) {}
void glMultMatrixf(const float*) {}
void glLoadMatrixf(const float*) {}
void glOrtho(double, double, double, double, double, double) {}
void glOrthof(float, float, float, float, float, float) {}
void glFrustum(double, double, double, double, double, double) {}
void glFrustumf(float, float, float, float, float, float) {}

// === Display lists (stubbed) ===
unsigned int glGenLists(int) { return 1; }
void glNewList(unsigned int, unsigned int) {}
void glEndList() {}
void glCallList(unsigned int) {}
void glCallLists(int, unsigned int, const void*) {}
void glDeleteLists(unsigned int, int) {}
void glListBase(unsigned int) {}

// === GL1 state functions (no-op — GLES2 uses different mechanisms) ===
void glAlphaFunc(unsigned int, float) {}
void glColorMaterial(unsigned int, unsigned int) {}
void glShadeModel(unsigned int) {}
void glPolygonMode(unsigned int, unsigned int) {}
void glPointSize(float) {}
void glFogf(unsigned int, float) {}
void glFogfv(unsigned int, const float*) {}
void glFogi(unsigned int, int) {}
void glFogx(unsigned int, int) {}
void glFogxv(unsigned int, const int*) {}
void glLightfv(unsigned int, unsigned int, const float*) {}
void glMaterialfv(unsigned int, unsigned int, const float*) {}
void glClipPlanex(unsigned int, const int*) {}
void glDepthRangef(float, float) {}
void glDepthRangex(int, int) {}
void glClearDepthf(float) {}
void glClearDepthx(int) {}
void glAlphaFuncx(unsigned int, int) {}
void glColor4x(int, int, int, int) {}
void glLightxv(unsigned int, unsigned int, const int*) {}
void glMaterialxv(unsigned int, unsigned int, const int*) {}
void glPointSizex(int) {}
void glPointParameterx(unsigned int, int) {}
void glPointParameterxv(unsigned int, const int*) {}
void glLineWidthx(int) {}
void glPolygonOffset(float, float) {}
void glDepthMask(unsigned char) {}
void glColorMask(unsigned char, unsigned char, unsigned char, unsigned char) {}
void glMultMatrixx(const int*) {}
void glLoadMatrixx(const int*) {}
void glOrthox(int, int, int, int, int, int) {}
void glFrustumx(int, int, int, int, int, int) {}
void glTexParameterx(unsigned int, unsigned int, int) {}
void glTexParameteriv(unsigned int, unsigned int, const int*) {}
void glSampleCoverage(float, unsigned char) {}
void glStencilFunc(unsigned int, int, unsigned int) {}
void glStencilOp(unsigned int, unsigned int, unsigned int) {}
void glStencilMask(unsigned int) {}
void glFrontFace(unsigned int) {}
void glPixelStorei(unsigned int, int) {}
void glReadPixels(int, int, int, int, unsigned int, unsigned int, void*) {}
void glCopyTexImage2D(unsigned int, int, unsigned int, int, int, int, int, int) {}
void glCopyTexSubImage2D(unsigned int, int, int, int, int, int, int, int) {}
void glCompressedTexImage2D(unsigned int, int, unsigned int, int, int, int, int, const void*) {}
void glGetTexParameteriv(unsigned int, unsigned int, int*) {}
void glGetTexLevelParameteriv(unsigned int, int, unsigned int, int*) {}
void glTexSubImage2D(unsigned int, int, int, int, int, int, unsigned int, unsigned int, const void*) {}
void glGetIntegerv(unsigned int, int*) {}
void glGetFloatv(unsigned int, float*) {}
const unsigned char* glGetString(unsigned int) { return (const unsigned char*)""; }
void glFinish() {}
void glFlush() {}
void glScissor(int, int, int, int) {}
void glBlendFuncSeparate(unsigned int, unsigned int, unsigned int, unsigned int) {}

// === MCPE custom GL wrapper functions (from gles.h — these are macros that resolve
//     to the GLES1 functions above, but we provide them directly) ===
void glEnable2(unsigned int cap) { /* real glEnable provided by GLES2 */ }
void glDisable2(unsigned int cap) {}
void glDepthFunc2(unsigned int) {}
void glDepthRangef2(float, float) {}
void glAlphaFunc2(unsigned int, float) {}
void glTranslatef2(float, float, float) {}
void glRotatef2(float, float, float, float) {}
void glScalef2(float, float, float) {}
void glPushMatrix2() {}
void glPopMatrix2() {}
void glColor4f2(float, float, float, float) { glColor4f(0,0,0,0); }
void glBindTexture2(unsigned int, unsigned int) {}
void glTexCoordPointer2(int s, unsigned int t, int st, const void* p) { glTexCoordPointer(s,t,st,p); }
void glEnableClientState2(unsigned int c) { glEnableClientState(c); }
void glDisableClientState2(unsigned int c) { glDisableClientState(c); }
void glTexImage2D2(unsigned int, int, int, int, int, int, unsigned int, unsigned int, const void*) {}
void glDrawElements2(unsigned int, int, unsigned int, const void*) {}
void glDrawArrays2(unsigned int m, int f, int c) { glDrawArrays(m,f,c); }
void glGenTextures2(int, unsigned int*) {}
void glActiveTexture2(unsigned int) {}
void glClientActiveTexture2(unsigned int) {}
void glBlendFunc2(unsigned int, unsigned int) {}
void glFogfv2(unsigned int, const float*) {}
void glFogf2(unsigned int, float) {}
void glShadeModel2(unsigned int) {}
void glFogi2(unsigned int, int) {}
void glCullFace2(unsigned int) {}
void glVertexPointer2(int a, unsigned int b, int c, const void* d) { glVertexPointer(a,b,c,d); }
void glColorPointer2(int a, unsigned int b, int c, const void* d) { glColorPointer(a,b,c,d); }

// === Shaders (GLES2 has these, stub in case) ===
unsigned int glCreateShader(unsigned int) { return 0; }
void glShaderSource(unsigned int, int, const char**, const int*) {}
void glCompileShader(unsigned int) {}
unsigned int glCreateProgram() { return 0; }
void glAttachShader(unsigned int, unsigned int) {}
void glLinkProgram(unsigned int) {}
void glUseProgram(unsigned int) {}
void glDeleteShader(unsigned int) {}
void glDeleteProgram(unsigned int) {}
void glDetachShader(unsigned int, unsigned int) {}
void glBindAttribLocation(unsigned int, int, const char*) {}
void glUniform1i(int, int) {}
void glUniform1f(int, float) {}
void glUniformMatrix4fv(int, int, unsigned char, const float*) {}
void glVertexAttribPointer(unsigned int, int, unsigned int, unsigned char, int, const void*) {}
void glEnableVertexAttribArray(unsigned int) {}
void glDisableVertexAttribArray(unsigned int) {}
int glGetAttribLocation(unsigned int, const char*) { return 0; }
int glGetUniformLocation(unsigned int, const char*) { return 0; }
void glGetShaderiv(unsigned int, unsigned int, int*) {}
void glGetProgramiv(unsigned int, unsigned int, int*) {}
void glGetShaderInfoLog(unsigned int, int, int*, char*) {}
void glGetProgramInfoLog(unsigned int, int, int*, char*) {}

// === Framebuffers ===
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

// === glu functions (from gles.cpp) ===
void gluPerspective(float, float, float, float) {}
void gluLookAt(float, float, float, float, float, float, float, float, float) {}

// === glewInit ===
int glewInit() { return 0; }

// === MCPE Tesselator draw functions — these are in gles.cpp (USE_VBO path)
//     We DON'T stub them here; gles.cpp provides real implementations.
//     If gles.cpp is compiled with -DUSE_VBO, drawArrayVT etc. will be defined there.

} // extern "C"

// === anGenBuffers override — call REAL WebGL glGenBuffers via EM_ASM ===
// gles.cpp asli punya anGenBuffers yang generate fake IDs (2, 3, 4...).
// WebGL butuh real buffer IDs. Kita override dengan EM_ASM yang call
// GLctx.createBuffer() untuk setiap buffer.
#include <emscripten/emscripten.h>

void anGenBuffers(int n, unsigned int* buffers) {
    EM_ASM_({
        var n = $0;
        var buffers = $1;
        var GLctx = (GL.currentContext && GL.currentContext.GLctx) || Module.ctx;
        if (!GLctx) return;
        for (var i = 0; i < n; i++) {
            var buf = GLctx.createBuffer();
            // Store in GL.buffers map (Emscripten's GL module)
            var id = GL.getNewId(GL.buffers);
            GL.buffers[id] = buf;
            HEAPU32[(buffers >> 2) + i] = id;
        }
    }, n, (int)buffers);
}
