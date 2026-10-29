#pragma once
typedef struct { int dummy; } SDL_SysWMinfo;
struct SDL_version { unsigned char major, minor, patch; };
struct XWindowAttributes { int x, y, width, height; };
inline int SDL_GetWMinfo(SDL_SysWMinfo*) { return 0; }
inline void SDL_Init(int) {}
inline void SDL_Quit() {}
