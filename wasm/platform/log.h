// §Stub platform/log.h for Emscripten
#pragma once
#include <cstdio>
#define LOGI(...) fprintf(stderr, "[I] " __VA_ARGS__)
#define LOGW(...) fprintf(stderr, "[W] " __VA_ARGS__)
#define LOGE(...) fprintf(stderr, "[E] " __VA_ARGS__)
