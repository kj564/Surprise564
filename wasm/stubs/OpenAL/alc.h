#pragma once
typedef void ALCdevice;
typedef void ALCcontext;
inline ALCdevice* alcOpenDevice(const char*) { return 0; }
inline void alcCloseDevice(ALCdevice*) {}
inline ALCcontext* alcCreateContext(ALCdevice*, const int*) { return 0; }
inline void alcDestroyContext(ALCcontext*) {}
inline int alcMakeContextCurrent(ALCcontext*) { return 0; }
inline void alcSuspendContext(ALCcontext*) {}
inline void alcProcessContext(ALCcontext*) {}
