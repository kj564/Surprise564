// §Platform stubs for Emscripten — provides functions that MCPE expects
#include <ctime>
#include <cstdio>

// §platform/time.h stubs
int getTimeMs() {
    return (int)(clock() * 1000.0 / CLOCKS_PER_SEC);
}

long getEpochTimeS() {
    return (long)time(nullptr);
}

// §Performance.h stub
namespace Perf {
    void start() {}
    void stop() {}
    void print() {}
}
