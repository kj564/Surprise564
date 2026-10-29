// §Minimal platform stubs — only anGenBuffers override
// ALL GL1 functions are provided by Emscripten's LEGACY_GL_EMULATION
// NO GL stubs here — let Emscripten handle GL1→WebGL2 translation natively

#include <string>
#include <cstdio>
#include <GLES/gl.h>

// §anGenBuffers override — gles.cpp asli generate fake IDs (counter).
// WebGL butuh real buffer IDs dari gl.createBuffer().
// We override anGenBuffers to call real glGenBuffers.
// Link with --allow-multiple-definition so this wins over gles.cpp's version.
void anGenBuffers(GLsizei n, GLuint* buffers) {
    glGenBuffers(n, buffers);
}
