// §Platform stubs — anGenBuffers override + glDrawArrays override
// anGenBuffers: call real glGenBuffers (not fake counter from gles.cpp)
// glDrawArrays: call real WebGL drawArrays via EM_ASM
//   (LEGACY_GL_EMULATION's glDrawArrays hook doesn't forward to WebGL)
#include <string>
#include <cstdio>
#include <GLES/gl.h>
#include <emscripten.h>

// §anGenBuffers override
void anGenBuffers(GLsizei n, GLuint* buffers) {
    glGenBuffers(n, buffers);
}

// §glDrawArrays override — call real WebGL drawArrays
// LEGACY_GL_EMULATION hooks glDrawArrays but doesn't properly forward
// to WebGL's gl.drawArrays. We override it here.
// Tesselator::draw calls glDrawArrays2 → glDrawArrays
// gles.h defines glDrawArrays2 = glDrawArrays (non-debug) or macro (debug)
// With -O0, macros should resolve to real glDrawArrays function.
// We override glDrawArrays to call EM_ASM that calls GLctx.drawArrays.
extern "C" void glDrawArrays_real(unsigned int mode, int first, int count) {
    EM_ASM({
        var mode = $0;
        var first = $1;
        var count = $2;
        var gl = (GL.currentContext && GL.currentContext.GLctx);
        if (gl) {
            gl.drawArrays(mode, first, count);
        }
    }, mode, first, count);
}
