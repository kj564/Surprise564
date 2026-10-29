#pragma once
typedef unsigned int ALuint;
typedef int ALint;
typedef float ALfloat;
typedef void ALvoid;
typedef unsigned int ALenum;
typedef char ALboolean;
typedef unsigned int ALsizei;
#define AL_NONE 0
#define AL_NO_ERROR 0
#define AL_POSITION 0x1004
#define AL_GAIN 0x100A
#define AL_PITCH 0x1003
#define AL_PLAYING 0x1012
#define AL_SOURCE_STATE 0x1010
#define AL_BUFFER 0x1009
inline ALenum alGetError() { return 0; }
inline void alGenSources(int, ALuint*) {}
inline void alDeleteSources(int, const ALuint*) {}
inline void alSourcePlay(ALuint) {}
inline void alSourceStop(ALuint) {}
inline void alSourceRewind(ALuint) {}
inline void alSourcef(ALuint, ALenum, ALfloat) {}
inline void alSource3f(ALuint, ALenum, ALfloat, ALfloat, ALfloat) {}
inline void alSourcei(ALuint, ALenum, ALint) {}
inline void alGetSourcei(ALuint, ALenum, ALint*) {}
