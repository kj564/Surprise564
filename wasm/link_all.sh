#!/bin/bash
# §Link script: combine 342 .o files + main_emscripten.cpp → single WASM binary
# Excludes main_dedicated.o / main.o / main_android.o (would shadow our main_emscripten.cpp)
exec 2>&1
EMSDK=/tmp/emsdk
export PATH="$EMSDK/upstream/emscripten:$EMSDK/node/24.19.0_64bit/bin:$PATH"
SRC=/tmp/Surprise564/rujukan/pocket-edition-2013/mcpe-source/handheld/src
WASM=/tmp/Surprise564/wasm
OUT_DIR=/tmp/mcpe_build

OBJS=$(ls $OUT_DIR/*.o | grep -v "main_dedicated.o" | grep -v "main.o" | grep -v "main_android.o" | grep -v "main_rpi.o" | grep -v "main_win32.o" | tr '\n' ' ')

em++ "$WASM/main_emscripten.cpp" \
  $OBJS \
  "$WASM/platform_stubs.cpp" \
  "$WASM/AppPlatform_emscripten.cpp" \
  -I$SRC -I$WASM -I$WASM/platform -I$WASM/EGL -I$WASM/gl \
  -std=c++14 -O2 -w \
  -include $EMSDK/upstream/emscripten/cache/sysroot/include/time.h \
  -DNO_EGL -DOPENGL_ES \
  -Wno-narrowing -Wno-reserved-user-defined-literal \
  -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s INITIAL_MEMORY=128MB \
  -s LEGACY_GL_EMULATION=1 \
  -s GL_PREINITIALIZED_CONTEXT=1 \
  -s EXPORTED_FUNCTIONS="['_main','_malloc','_free']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap','HEAPU8','HEAP8','HEAPU32','UTF8ToString','callMain']" \
  -s ENVIRONMENT=web \
  -o /tmp/Surprise564/public/mcpe_emscripten_full.js
