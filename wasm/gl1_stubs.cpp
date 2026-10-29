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
    gl1_init_shader();
    
    EM_ASM({
        var gl = (GL.currentContext && GL.currentContext.GLctx);
        if (!gl) return;
        var prog = window.__gl1Shader;
        if (!prog) return;
        
        gl.useProgram(prog);
        
        // Set identity matrices (will be replaced when matrix hooks work)
        var id = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
        gl.uniformMatrix4fv(window.__gl1Uniforms.proj, false, id);
        gl.uniformMatrix4fv(window.__gl1Uniforms.mv, false, id);
        
        // Tesselator vertex format: pos(3f) + tex(2f) + color(4ub) = 24 bytes
        // pos@0, texCoord@12, color@20
        var stride = 24;
        
        if ($0) { // vertex array enabled
            gl.enableVertexAttribArray(window.__gl1Attribs.pos);
            gl.vertexAttribPointer(window.__gl1Attribs.pos, 3, gl.FLOAT, false, stride, $1);
        }
        if ($2) { // texCoord array enabled
            gl.enableVertexAttribArray(window.__gl1Attribs.texCoord);
            gl.vertexAttribPointer(window.__gl1Attribs.texCoord, 2, gl.FLOAT, false, stride, $3);
            gl.uniform1i(window.__gl1Uniforms.tex, 0);
            gl.uniform1i(window.__gl1Uniforms.hasTex, 1);
        } else {
            gl.uniform1i(window.__gl1Uniforms.hasTex, 0);
        }
        if ($4) { // color array enabled
            gl.enableVertexAttribArray(window.__gl1Attribs.color);
            gl.vertexAttribPointer(window.__gl1Attribs.color, 4, gl.UNSIGNED_BYTE, true, stride, $5);
        } else {
            gl.disableVertexAttribArray(window.__gl1Attribs.color);
            gl.vertexAttrib4f(window.__gl1Attribs.color, 1, 1, 1, 1);
        }
        
        gl.drawArrays($6, 0, $7);
    }, g_vaEnabled, g_vaPointer, g_taEnabled, g_taPointer, g_caEnabled, g_caPointer, mode, count);
}

// GL1 state functions (no-op for now, proper impl later)
void glBegin(unsigned int) {}
void glEnd() {}
void glVertex3f(float, float, float) {}
void glVertex2f(float, float) {}
void glColor3f(float, float, float) {}
void glColor4f(float, float, float, float) {}
void glColor4ub(unsigned char, unsigned char, unsigned char, unsigned char) {}
void glTexCoord2f(float, float) {}
void glNormal3f(float, float, float) {}
void glMatrixMode(unsigned int mode) { g_matrixMode = mode; }
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
void glNewList(unsigned int, unsigned int) {}
void glEndList() {}
void glCallList(unsigned int) {}
void glCallLists(int, unsigned int, const void*) {}
void glDeleteLists(unsigned int, int) {}
void glListBase(unsigned int) {}
unsigned int glGenLists(int) { return 1; }
void glNormalPointer(unsigned int, int, const void*) {}
void gluPerspective(float, float, float, float) {}
void gluLookAt(float, float, float, float, float, float, float, float, float) {}
int glewInit() { return 0; }
int glGetAttribLocation(unsigned int, const char*) { return 0; }
int glGetUniformLocation(unsigned int, const char*) { return 0; }

// MCPE custom wrappers — resolve to GL1 functions above
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
void glFogi2(unsigned int, int) {}
void glCullFace2(unsigned int) {}
void glVertexPointer2(int a, unsigned int b, int c, const void* d) { glVertexPointer(a,b,c,d); }
void glColorPointer2(int a, unsigned int b, int c, const void* d) { glColorPointer(a,b,c,d); }

void glActiveTexture(unsigned int) {}
void glClientActiveTexture(unsigned int) {}
void glBlendFunc(unsigned int, unsigned int) {}

// Shaders (stub)
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
void glGetShaderiv(unsigned int, unsigned int, int*) {}
void glGetProgramiv(unsigned int, unsigned int, int*) {}
void glGetShaderInfoLog(unsigned int, int, int*, char*) {}
void glGetProgramInfoLog(unsigned int, int, int*, char*) {}
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

} // extern "C"
