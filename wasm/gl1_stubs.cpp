// §GLES1 emulation layer for WebGL2
// Implements GL1 fixed-function → WebGL2 shader translation
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
#define GL_TEXTURE_2D 0x0DE1
#define GL_COLOR_BUFFER_BIT 0x00004000
#define GL_DEPTH_BUFFER_BIT 0x00000100
#define GL_NEAREST 0x2600
#define GL_LINEAR 0x2601
#define GL_CLAMP_TO_EDGE 0x812F
#define GL_REPEAT 0x2901
#define GL_TEXTURE_MIN_FILTER 0x2801
#define GL_TEXTURE_MAG_FILTER 0x2800
#define GL_TEXTURE_WRAP_S 0x2802
#define GL_TEXTURE_WRAP_T 0x2803
#define GL_RGBA 0x1908
#define GL_RGB 0x1907
#define GL_UNPACK_FLIP_Y_WEBGL 0x9240

// Client-side vertex array state
struct ClientArray {
    bool enabled;
    int size;
    unsigned int type;
    int stride;
    long pointer;  // offset into bound VBO or client pointer
};

static ClientArray g_vertexArray = {false, 3, GL_FLOAT, 0, 0};
static ClientArray g_colorArray = {false, 4, GL_UNSIGNED_BYTE, 0, 0};
static ClientArray g_texCoordArray = {false, 2, GL_FLOAT, 0, 0};
static ClientArray g_normalArray = {false, 3, GL_FLOAT, 0, 0};

// Default shader for GL1 emulation
static int g_defaultProgram = 0;
static int g_defaultVBO = 0;
static bool g_gl1Init = false;

// §Init default shader + VBO for GL1 emulation
static void initGL1Emulation() {
    if (g_gl1Init) return;
    g_gl1Init = true;
    
    EM_ASM({
        // §Create default shader program for GL1 fixed-function emulation
        var vsSrc = [
            'attribute vec3 aPos;',
            'attribute vec4 aColor;',
            'attribute vec2 aTexCoord;',
            'uniform mat4 uProjection;',
            'uniform mat4 uModelView;',
            'varying vec4 vColor;',
            'varying vec2 vTexCoord;',
            'void main() {',
            '  vColor = aColor;',
            '  vTexCoord = aTexCoord;',
            '  gl_Position = uProjection * uModelView * vec4(aPos, 1.0);',
            '}'
        ].join('\n');
        
        var fsSrc = [
            'precision mediump float;',
            'varying vec4 vColor;',
            'varying vec2 vTexCoord;',
            'uniform sampler2D uTexture;',
            'uniform bool uTextured;',
            'void main() {',
            '  if (uTextured) {',
            '    vec4 tex = texture2D(uTexture, vTexCoord);',
            '    gl_FragColor = vec4(tex.rgb, tex.a * vColor.a);',
            '  } else {',
            '    gl_FragColor = vColor;',
            '  }',
            '}'
        ].join('\n');
        
        var gl = (GL.currentContext && GL.currentContext.GLctx) || Module.ctx;
        if (!gl) return;
        
        function compileShader(src, type) {
            var s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(s));
            }
            return s;
        }
        
        var vs = compileShader(vsSrc, gl.VERTEX_SHADER);
        var fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
        var prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(prog));
        }
        
        // Store in GL.programs map
        var progId = GL.getNewId(GL.programs);
        GL.programs[progId] = prog;
        window.__gl1Program = progId;
        window.__gl1ProgramObj = prog;  // also store raw obj for direct use
        
        // Create temp VBO for client-side vertex data
        var vbo = gl.createBuffer();
        var vboId = GL.getNewId(GL.buffers);
        GL.buffers[vboId] = vbo;
        window.__gl1TempVBO = vboId;
        window.__gl1TempVBOObj = vbo;
        
        // Identity matrices (4x4 float arrays)
        window.__gl1Projection = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
        window.__gl1ModelView = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
        
        console.log('[GL1] Default shader + VBO initialized');
    });
}

extern "C" {

// === Client-side vertex array functions ===

void glVertexPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_vertexArray.size = size;
    g_vertexArray.type = type;
    g_vertexArray.stride = stride;
    g_vertexArray.pointer = (long)pointer;
}

void glColorPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_colorArray.size = size;
    g_colorArray.type = type;
    g_colorArray.stride = stride;
    g_colorArray.pointer = (long)pointer;
}

void glTexCoordPointer(int size, unsigned int type, int stride, const void* pointer) {
    g_texCoordArray.size = size;
    g_texCoordArray.type = type;
    g_texCoordArray.stride = stride;
    g_texCoordArray.pointer = (long)pointer;
}

void glNormalPointer(unsigned int type, int stride, const void* pointer) {
    g_normalArray.size = 3;
    g_normalArray.type = type;
    g_normalArray.stride = stride;
    g_normalArray.pointer = (long)pointer;
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

// §glDrawArrays — the KEY function: upload client data to VBO, setup attribs, draw
void glDrawArrays(unsigned int mode, int first, int count) {
    initGL1Emulation();
    
    // Check if we have client-side vertex array data (no VBO bound or offset > 0)
    // For now, assume VBO is already bound (Tesselator::draw binds VBO before calling)
    // and pointer is an offset into that VBO.
    // In that case, just call real glDrawArrays via WebGL.
    
    EM_ASM({
        var mode = $0;
        var first = $1;
        var count = $2;
        var progId = window.__gl1Program || 0;
        var prog = window.__gl1ProgramObj;
        var gl = (GL.currentContext && GL.currentContext.GLctx) || Module.ctx;
        if (!gl) return;
        
        // Use default shader
        if (prog) {
            gl.useProgram(prog);
            
            // Set uniforms
            var uProj = gl.getUniformLocation(prog, 'uProjection');
            var uMV = gl.getUniformLocation(prog, 'uModelView');
            if (uProj) gl.uniformMatrix4fv(uProj, false, window.__gl1Projection);
            if (uMV) gl.uniformMatrix4fv(uMV, false, window.__gl1ModelView);
            
            // Setup vertex attribs — assume VBO is bound, pointer is offset
            // pos at offset 0, texcoord at offset 12 (3*4), color at offset 20 (5*4)
            var aPos = gl.getAttribLocation(prog, 'aPos');
            var aColor = gl.getAttribLocation(prog, 'aColor');
            var aTexCoord = gl.getAttribLocation(prog, 'aTexCoord');
            
            // Tesselator vertex format: pos(3f) + tex(2f) + color(4ub) = 24 bytes
            // pos at 0, tex at 12, color at 20
            var stride = 24;  // sizeof(VERTEX) in MCPE
            
            if (aPos >= 0) {
                gl.enableVertexAttribArray(aPos);
                gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, stride, 0);
            }
            if (aTexCoord >= 0) {
                gl.enableVertexAttribArray(aTexCoord);
                gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, stride, 12);
            }
            if (aColor >= 0) {
                gl.enableVertexAttribArray(aColor);
                gl.vertexAttribPointer(aColor, 4, gl.UNSIGNED_BYTE, true, stride, 20);
            }
        }
        
        gl.drawArrays(mode, first, count);
    }, mode, first, count);
}

// === Immediate mode (glBegin/glEnd) ===
void glBegin(unsigned int mode) {}
void glEnd() {}
void glVertex3f(float, float, float) {}
void glVertex2f(float, float) {}
void glColor3f(float, float, float) {}
void glColor4f(float, float, float, float) {}
void glColor4ub(unsigned char, unsigned char, unsigned char, unsigned char) {}
void glTexCoord2f(float, float) {}
void glNormal3f(float, float, float) {}

// === Matrix stack ===
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

// === Display lists ===
unsigned int glGenLists(int) { return 1; }
void glNewList(unsigned int, unsigned int) {}
void glEndList() {}
void glCallList(unsigned int) {}
void glCallLists(int, unsigned int, const void*) {}
void glDeleteLists(unsigned int, int) {}
void glListBase(unsigned int) {}

// === GL1 state functions ===
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

// MCPE custom GL wrappers
void glEnable2(unsigned int) {}
void glDisable2(unsigned int) {}
void glDepthFunc2(unsigned int) {}
void glDepthRangef2(float, float) {}
void glAlphaFunc2(unsigned int, float) {}
void glTranslatef2(float, float, float) {}
void glRotatef2(float, float, float, float) {}
void glScalef2(float, float, float) {}
void glPushMatrix2() {}
void glPopMatrix2() {}
void glColor4f2(float, float, float, float) {}
void glBindTexture2(unsigned int, unsigned int) {}
void glTexCoordPointer2(int s, unsigned int t, int st, const void* p) { glTexCoordPointer(s,t,st,p); }
void glEnableClientState2(unsigned int c) { glEnableClientState(c); }
void glDisableClientState2(unsigned int c) { glDisableClientState(c); }
void glTexParameteri2(unsigned int, unsigned int, int) {}
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

// Shaders
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

// Framebuffers
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

void gluPerspective(float, float, float, float) {}
void gluLookAt(float, float, float, float, float, float, float, float, float) {}
int glewInit() { return 0; }

// anGenBuffers override — call real WebGL createBuffer
void anGenBuffers(int n, unsigned int* buffers) {
    EM_ASM_({
        var n = $0;
        var buffers = $1;
        var gl = (GL.currentContext && GL.currentContext.GLctx) || Module.ctx;
        if (!gl) return;
        for (var i = 0; i < n; i++) {
            var buf = gl.createBuffer();
            var id = GL.getNewId(GL.buffers);
            GL.buffers[id] = buf;
            HEAPU32[(buffers >> 2) + i] = id;
        }
    }, n, (int)buffers);
}

} // extern "C"
