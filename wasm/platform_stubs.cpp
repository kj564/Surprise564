// §Platform stubs — anGenBuffers override + glDrawArrays override
// Rule Zero: rujukan/ immutable. We override anGenBuffers (from gles.cpp:49-53
// fake counter) to call real glGenBuffers. emsdk 2.0.34 wasm-ld doesn't
// support --allow-multiple-definition, so we rename the gles.cpp version
// via compile flag -DanGenBuffers=anGenBuffers_gles_impl when recompiling
// gles.cpp. See build.sh for the gles.cpp recompile step.
#include <string>
#include <cstdio>
#include <GLES/gl.h>
#include <emscripten.h>

void anGenBuffers(GLsizei n, GLuint* buffers) {
    glGenBuffers(n, buffers);
}

extern "C" void glDrawArrays_real(unsigned int mode, int first, int count) {
    EM_ASM({
        var mode = $0; var first = $1; var count = $2;
        var gl = (GL.currentContext && GL.currentContext.GLctx);
        if (gl) gl.drawArrays(mode, first, count);
    }, mode, first, count);
}
