// §gl/glew.h — Comprehensive GL1 stub for MCPE 2013 + Emscripten LEGACY_GL_EMULATION
#pragma once
#include <GLES/gl.h>
#include <GLES/glext.h>

// OpenGL 1.x constants not in GLES
#define GL_COMPILE 0x1300
#define GL_COMPILE_AND_EXECUTE 0x1301
#define GL_QUADS 0x0007
#define GL_COLOR_MATERIAL 0x0B57
#define GL_CURRENT_COLOR 0x0B00

// GL1 function declarations (provided by LEGACY_GL_EMULATION at link time)
extern "C" {
    void glBegin(unsigned int mode);
    void glEnd();
    void glColor3f(float r, float g, float b);
    void glColor4f(float r, float g, float b, float a);
    void glColor4ub(unsigned char r, unsigned char g, unsigned char b, unsigned char a);
    void glVertex3f(float x, float y, float z);
    void glVertex2f(float x, float y);
    void glTexCoord2f(float s, float t);
    void glNormal3f(float x, float y, float z);
    void glMatrixMode(unsigned int mode);
    void glLoadIdentity();
    void glPushMatrix();
    void glPopMatrix();
    void glTranslatef(float x, float y, float z);
    void glRotatef(float angle, float x, float y, float z);
    void glScalef(float x, float y, float z);
    void glOrthof(float l, float r, float b, float t, float n, float f);
    void glFrustumf(float l, float r, float b, float t, float n, float f);
    unsigned int glGenLists(int range);
    void glNewList(unsigned int list, unsigned int mode);
    void glEndList();
    void glCallList(unsigned int list);
    void glCallLists(int n, unsigned int type, const void* lists);
    void glDeleteLists(unsigned int list, int range);
    void glListBase(unsigned int base);
    void glEnableClientState(unsigned int cap);
    void glDisableClientState(unsigned int cap);
    void glVertexPointer(int size, unsigned int type, int stride, const void* ptr);
    void glTexCoordPointer(int size, unsigned int type, int stride, const void* ptr);
    void glNormalPointer(unsigned int type, int stride, const void* ptr);
    void glColorPointer(int size, unsigned int type, int stride, const void* ptr);
    void glAlphaFunc(unsigned int func, float ref);
    void glFogf(unsigned int pname, float param);
    void glFogfv(unsigned int pname, const float* params);
    void glShadeModel(unsigned int mode);
    void glColorMaterial(unsigned int face, unsigned int mode);
    void glLightfv(unsigned int light, unsigned int pname, const float* params);
    void glMaterialfv(unsigned int face, unsigned int pname, const float* params);
    void glActiveTexture(unsigned int texture);
    void glClientActiveTexture(unsigned int texture);
    void glPointSize(float size);
}
