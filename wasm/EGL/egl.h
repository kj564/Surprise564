// §EGL/egl.h stub for Emscripten — EGL is not used in browser (WebGL instead).
// AppContext has EGLDisplay/EGLContext/EGLSurface fields, but they're behind
// #ifndef NO_EGL. We define NO_EGL via -DNO_EGL in the build to skip them.
// This stub is only included if NO_EGL is NOT defined (legacy path).
#pragma once
// Use opaque pointer types instead of void — struct fields can't be void.
typedef struct EGLDisplayRec* EGLDisplay;
typedef struct EGLContextRec* EGLContext;
typedef struct EGLSurfaceRec* EGLSurface;
typedef int EGLint;
typedef int EGLBoolean;
typedef int EGLConfig;
#define EGL_DEFAULT_DISPLAY ((EGLDisplay)0)
#define EGL_NO_DISPLAY ((EGLDisplay)0)
#define EGL_NO_CONTEXT ((EGLContext)0)
#define EGL_NO_SURFACE ((EGLSurface)0)
