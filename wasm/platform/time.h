// §Stub platform/time.h for Emscripten — replaces MCPE's Android/iOS time
#pragma once
#include <ctime>
inline int getTimeMs() {
    return (int)(clock() * 1000.0 / CLOCKS_PER_SEC);
}
inline long getEpochTimeS() {
    return (long)time(nullptr);
}
