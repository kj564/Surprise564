#!/bin/bash
# §build.sh — Compile MCPE 2013 C++ source to WebAssembly
# Usage: ./wasm/build.sh
set -e
exec 2>&1

EMSDK=${EMSDK:-/tmp/emsdk}
export PATH="$EMSDK/upstream/emscripten:$EMSDK/node/24.19.0_64bit/bin:$PATH"

SRC=rujukan/pocket-edition-2013/mcpe-source/handheld/src
WASM=wasm
OUT=public
BUILD=/tmp/mcpe_build

mkdir -p $BUILD

INCLUDES="-I$WASM -I$SRC -I$SRC/util -I$SRC/world/phys -I$SRC/world/level/material -I$SRC/world/level/tile -I$SRC/world/item -I$SRC/world/entity -I$SRC/world/inventory -I$SRC/world/level -I$SRC/client -I$SRC/client/renderer -I$SRC/client/gui -I$SRC/client/model -I$SRC/client/particle -I$SRC/client/player -I$SRC/client/gamemode -I$SRC/client/sound -I$SRC/network -I$SRC/raknet -I$SRC/nbt -I$SRC/platform/input -I$SRC/platform/audio -I$SRC/server -I$WASM/EGL -I$WASM/gl -I$WASM/stubs"

CFLAGS="-std=c++14 -O1 -w -include $EMSDK/upstream/emscripten/cache/sysroot/include/time.h -DNO_EGL -DOPENGL_ES -DNO_STORAGE -DUSE_VBO -DNO_NETWORK -Wno-narrowing -Wno-reserved-user-defined-literal"

# Files to skip (platform-specific, not needed for browser)
SKIP="main_dedicated.cpp|main.cpp|main_android.cpp|main_android_java.cpp|main_rpi.cpp|main_win32.cpp|AppPlatform_win32.cpp|platform/audio/SoundSystemAL.cpp|platform/audio/SoundSystemSL.cpp|raknet/FileList.cpp"

echo "=== Compiling MCPE 2013 source files ==="
total=0; ok=0; fail=0
for cpp in $(find $SRC -name "*.cpp" | sort); do
    relpath=${cpp#$SRC/}
    echo "$relpath" | grep -qE "$SKIP" && continue
    total=$((total + 1))
    objname=$(echo "$relpath" | tr '/' '_' | sed 's/\.cpp$/.o/')
    if em++ "$cpp" $INCLUDES $CFLAGS -c -o "$BUILD/$objname" 2>/dev/null; then
        ok=$((ok + 1))
    else
        fail=$((fail + 1))
        echo "  [FAIL] $relpath"
    fi
done
echo "Source: $ok/$total compiled ($fail skipped)"

# Compile custom WASM files
echo "=== Compiling WASM platform files ==="
em++ $WASM/platform_stubs.cpp $INCLUDES $CFLAGS -c -o $BUILD/platform_stubs.o
em++ $WASM/gl1_stubs.cpp $INCLUDES $CFLAGS -c -o $BUILD/gl1_stubs.o
em++ $WASM/AppPlatform_emscripten.cpp -I$WASM -I$SRC -I$SRC/util -I$SRC/world/phys -I$SRC/client/renderer $CFLAGS -c -o $BUILD/AppPlatform_emscripten.o

# Link
echo "=== Linking WASM ==="
OBJS=$(ls $BUILD/*.o | grep -vE "main_dedicated|main\.o|main_android|main_rpi|main_win32" | tr '\n' ' ')
em++ $WASM/main_emscripten.cpp $OBJS -I$SRC -I$WASM -I$WASM/EGL -I$WASM/gl \
    -std=c++14 -O1 -w $CFLAGS \
    -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s INITIAL_MEMORY=128MB \
    -s USE_WEBGL2=1 -s FULL_ES2=1 \
    -s DISABLE_EXCEPTION_CATCHING=0 -Wl,--allow-multiple-definition \
    -s EXPORTED_FUNCTIONS="['_main','_malloc','_free','_mouse_feed','_keyboard_feed']" \
    -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap','HEAPU8','HEAP8','HEAPU32','UTF8ToString','callMain']" \
    -s ENVIRONMENT=web -o $OUT/mcpe_emscripten_full.js

echo "=== Build complete ==="
ls -la $OUT/mcpe_emscripten_full.*
