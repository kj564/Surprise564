// §GLES1→WebGL2 translation — C++ implementation (no JS hooks needed)
// Provides GL1 functions that call WebGL2 via EM_ASM
#include <cstdio>
#include <cstring>
#include <emscripten.h>

// GL constants
#define GL_FLOAT 0x1406
#define GL_UNSIGNED_BYTE 0x1401
#define GL_VERTEX_ARRAY 0x8074
#define GL_COLOR_ARRAY 0x8076
#define GL_TEXTURE_COORD_ARRAY 0x8078
#define GL_TRIANGLES 0x0004
#define GL_MODELVIEW 0x1700
#define GL_PROJECTION 0x1701

// Client-side vertex array state
static int g_vaEnabled = 0, g_caEnabled = 0, g_taEnabled = 0;
static int g_vaPointer = 0, g_caPointer = 0, g_taPointer = 0;
static int g_matrixMode = GL_MODELVIEW;

// Default shader (initialized lazily)
static bool g_shaderInit = false;

EM_JS(void, gl1_init_shader, (void), {
    if (window.__gl1Shader) return;
    var gl = (GL.currentContext && GL.currentContext.GLctx);
    if (!gl) return;
    
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, 'attribute vec3 aPos; attribute vec4 aColor; attribute vec2 aTexCoord; uniform mat4 uProj; uniform mat4 uMV; varying vec4 vColor; varying vec2 vTexCoord; void main() { vColor = aColor; vTexCoord = aTexCoord; gl_Position = uProj * uMV * vec4(aPos, 1.0); }');
    gl.compileShader(vs);
    
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, 'precision mediump float; varying vec4 vColor; varying vec2 vTexCoord; uniform sampler2D uTex; uniform bool uHasTex; void main() { if (uHasTex) { vec4 t = texture2D(uTex, vTexCoord); gl_FragColor = vec4(t.rgb * vColor.rgb, t.a * vColor.a); } else { gl_FragColor = vColor; } }');
    gl.compileShader(fs);
    
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    
    window.__gl1Shader = prog;
    window.__gl1Attribs = {
        pos: gl.getAttribLocation(prog, 'aPos'),
        color: gl.getAttribLocation(prog, 'aColor'),
        texCoord: gl.getAttribLocation(prog, 'aTexCoord')
    };
    window.__gl1Uniforms = {
        proj: gl.getUniformLocation(prog, 'uProj'),
        mv: gl.getUniformLocation(prog, 'uMV'),
        tex: gl.getUniformLocation(prog, 'uTex'),
        hasTex: gl.getUniformLocation(prog, 'uHasTex')
    };
    console.log('[GL1] Shader OK: pos=' + window.__gl1Attribs.pos + ' color=' + window.__gl1Attribs.color + ' tex=' + window.__gl1Attribs.texCoord);
});

extern "C" {
extern void glTexImage2D(unsigned int, int, int, int, int, int, unsigned int, unsigned int, const void*);

// glVertexPointer — track pointer offset (into bound VBO)
void glVertexPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_vaPointer = (int)pointer;
    EM_ASM({ if (typeof window.__gl1VertexPointer === "function") window.__gl1VertexPointer($0, $1, $2, $3); }, size, type, stride, (int)pointer);
}

void glColorPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_caPointer = (int)pointer;
    EM_ASM({ if (typeof window.__gl1ColorPointer === "function") window.__gl1ColorPointer($0, $1, $2, $3); }, size, type, stride, (int)pointer);
}

void glTexCoordPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_taPointer = (int)pointer;
    EM_ASM({ if (typeof window.__gl1TexCoordPointer === "function") window.__gl1TexCoordPointer($0, $1, $2, $3); }, size, type, stride, (int)pointer);
}

void glEnableClientState(unsigned int cap) {
    if (cap == GL_VERTEX_ARRAY) g_vaEnabled = 1;
    else if (cap == GL_COLOR_ARRAY) g_caEnabled = 1;
    else if (cap == GL_TEXTURE_COORD_ARRAY) g_taEnabled = 1;
    EM_ASM({ if (typeof window.__gl1EnableClientState === "function") window.__gl1EnableClientState($0); }, cap);
}

void glDisableClientState(unsigned int cap) {
    if (cap == GL_VERTEX_ARRAY) g_vaEnabled = 0;
    else if (cap == GL_COLOR_ARRAY) g_caEnabled = 0;
    else if (cap == GL_TEXTURE_COORD_ARRAY) g_taEnabled = 0;
    EM_ASM({ if (typeof window.__gl1DisableClientState === "function") window.__gl1DisableClientState($0); }, cap);
}

// glDrawArrays — THE KEY function: set up shader + attribs + draw
void glDrawArrays(unsigned int mode, int first, int count) {
    EM_ASM({ if (typeof window.__gl1Draw === "function") window.__gl1Draw($0, $1, $2); }, mode, first, count);
}

// GL1 state functions (no-op for now, proper impl later)
void glBegin(unsigned int) {}
void glEnd() {}
void glVertex3f(float, float, float) {}
void glVertex2f(float, float) {}
void glColor3f(float, float, float) {}
void glColor4f(float r, float g, float b, float a) { 
    EM_ASM({ if (typeof _glColor4f === "function") _glColor4f($0, $1, $2, $3); }, r, g, b, a); 
}
void glColor4ub(unsigned char r, unsigned char g, unsigned char b, unsigned char a) { EM_ASM({ if (typeof _glColor4ub === "function") _glColor4ub($0, $1, $2, $3); }, r, g, b, a); }
void glTexCoord2f(float, float) {}
void glNormal3f(float, float, float) {}
void glMatrixMode(unsigned int mode) { g_matrixMode = mode; EM_ASM({ if (typeof window.__gl1MatrixMode === "function") window.__gl1MatrixMode($0); }, mode); }
void glLoadIdentity() { EM_ASM({ if (typeof window.__gl1LoadIdentity === "function") window.__gl1LoadIdentity(); }); }
void glPushMatrix() { EM_ASM({ if (typeof window.__gl1PushMatrix === "function") window.__gl1PushMatrix(); }); }
void glPopMatrix() { EM_ASM({ if (typeof window.__gl1PopMatrix === "function") window.__gl1PopMatrix(); }); }
void glTranslatef(float x, float y, float z) { EM_ASM({ if (typeof window.__gl1Translatef === "function") window.__gl1Translatef($0, $1, $2); }, x, y, z); }
void glRotatef(float a, float x, float y, float z) { EM_ASM({ if (typeof window.__gl1Rotatef === "function") window.__gl1Rotatef($0, $1, $2, $3); }, a, x, y, z); }
void glScalef(float x, float y, float z) { EM_ASM({ if (typeof window.__gl1Scalef === "function") window.__gl1Scalef($0, $1, $2); }, x, y, z); }
void glMultMatrixf(const float*) {}
void glLoadMatrixf(const float*) {}
void glOrtho(double l, double r, double b, double t, double n, double f) { EM_ASM({ if (typeof window.__gl1Orthof === "function") window.__gl1Orthof($0, $1, $2, $3, $4, $5); }, (float)l, (float)r, (float)b, (float)t, (float)n, (float)f); }
void glOrthof(float l, float r, float b, float t, float n, float f) { EM_ASM({ if (typeof window.__gl1Orthof === "function") window.__gl1Orthof($0, $1, $2, $3, $4, $5); }, l, r, b, t, n, f); }
void glFrustum(double, double, double, double, double, double) {}
void glFrustumf(float l, float r, float b, float t, float n, float f) { EM_ASM({ if (typeof window.__gl1Frustum === "function") window.__gl1Frustum($0, $1, $2, $3, $4, $5); }, l, r, b, t, n, f); }
void glAlphaFunc(unsigned int func, float ref) { EM_ASM({ if (typeof _glAlphaFunc === "function") _glAlphaFunc($0, $1); }, func, ref); }
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
void glNewList(unsigned int, unsigned int) {}
void glEndList() {}
void glCallList(unsigned int) {}
void glCallLists(int, unsigned int, const void*) {}
void glDeleteLists(unsigned int, int) {}
void glListBase(unsigned int) {}
unsigned int glGenLists(int) { return 1; }
void glNormalPointer(unsigned int, int, const void*) {}
void gluPerspective(float fovy, float aspect, float near, float far) { EM_ASM({ if (typeof window.__gl1Perspective === "function") window.__gl1Perspective($0, $1, $2, $3); }, fovy, aspect, near, far); }
void gluLookAt(float, float, float, float, float, float, float, float, float) {}
int glewInit() { return 0; }
int glGetAttribLocation(unsigned int, const char*) { return 0; }
int glGetUniformLocation(unsigned int, const char*) { return 0; }


// §MCPE *2 wrappers that DON'T expand via macro — bridge to real GLES2
// §glEnable/glDisable overrides — intercept GLES1-only caps (GL_TEXTURE_2D, GL_ALPHA_TEST)
// that WebGL2 doesn't support, and forward the rest to real WebGL2
#undef glEnable
#undef glDisable
void glEnable(unsigned int cap) {
    // GL_TEXTURE_2D (0x0DE0) and GL_ALPHA_TEST (0x0BC0) are GLES1 fixed-function
    // states that don't exist in WebGL2. Track them locally, don't forward.
    if (cap == 0x0DE0) { return; } // tracked by JS GL1 layer
    if (cap == 0x0BC0) { return; } // tracked by JS GL1 layer
    // Forward to real WebGL2
    EM_ASM({ var gl = (GL.currentContext && GL.currentContext.GLctx); if (gl) gl.enable($0); }, cap);
}
void glDisable(unsigned int cap) {
    if (cap == 0x0DE0) { return; }
    if (cap == 0x0BC0) { return; }
    EM_ASM({ var gl = (GL.currentContext && GL.currentContext.GLctx); if (gl) gl.disable($0); }, cap);
}
extern void glDepthFunc(unsigned int);
extern void glCullFace(unsigned int);
extern void glBlendFunc(unsigned int, unsigned int);
extern void glShadeModel(unsigned int);
extern void glDepthRangef(float, float);
extern void glActiveTexture(unsigned int);

void glDepthFunc2(unsigned int f) { glDepthFunc(f); }
void glCullFace2(unsigned int f) { glCullFace(f); }
void glBlendFunc2(unsigned int s, unsigned int d) { glBlendFunc(s, d); }
void glAlphaFunc2(unsigned int f, float r) { glAlphaFunc(f, r); }
void glDepthRangef2(float n, float f) { glDepthRangef(n, f); }
void glActiveTexture2(unsigned int t) { glActiveTexture(t); }
void glClientActiveTexture2(unsigned int t) { glActiveTexture(t); }
void glShadeModel2(unsigned int m) { glShadeModel(m); }
void glFogf2(unsigned int n, float p) { /* no-op — fog not needed for menu */ }
void glFogfv2(unsigned int n, const float* p) { /* no-op */ }
void glFogi2(unsigned int n, int p) { /* no-op */ }

} // extern "C"
