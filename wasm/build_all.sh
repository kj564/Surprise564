#!/bin/bash
exec 2>&1
EMSDK=/tmp/emsdk
export PATH="$EMSDK/upstream/emscripten:$EMSDK/node/24.19.0_64bit/bin:$PATH"
SRC=/tmp/Surprise564/rujukan/pocket-edition-2013/mcpe-source/handheld/src
WASM=/tmp/Surprise564/wasm
OUT_DIR=/tmp/mcpe_build
mkdir -p $OUT_DIR
> $OUT_DIR/success.txt
> $OUT_DIR/fail.txt

INCLUDES="-I$WASM/platform -I$SRC -I$SRC/util -I$SRC/world/phys -I$SRC/world/level/material -I$SRC/world/level/tile -I$SRC/world/item -I$SRC/world/entity -I$SRC/world/inventory -I$SRC/world/level -I$SRC/client -I$SRC/client/renderer -I$SRC/client/gui -I$SRC/client/model -I$SRC/client/particle -I$SRC/client/player -I$SRC/client/gamemode -I$SRC/client/sound -I$SRC/network -I$SRC/raknet -I$SRC/nbt -I$SRC/platform/input -I$SRC/platform/audio -I$SRC/server -I$WASM"

# Critical flags:
#   -include <time.h>  -- pull in POSIX time.h FIRST so ::time_t is defined
#                         before <ctime> tries `using ::time_t _LIBCPP_USING_IF_EXISTS`
#   -- skip <atomic> / <chrono> / <thread> machinery
#   -Wno-* -- suppress MCPE's many C++03-style warnings under C++14
CFLAGS="-std=c++14 -O2 -Wno-uninitialized -Wno-deprecated-declarations -Wno-writable-strings -Wno-nullability-extension -Wno-pragma-pack -Wno-narrowing -Wno-reserved-user-defined-literal -Wno-error -w -include /tmp/emsdk/upstream/emscripten/cache/sysroot/include/time.h -DNO_EGL -DOPENGL_ES"

total=0; success=0; fail=0
for cpp in $(find $SRC -name "*.cpp" | sort); do
    total=$((total + 1))
    relpath=${cpp#$SRC/}
    objname=$(echo "$relpath" | tr '/' '_' | sed 's/\.cpp$/.o/')
    objpath=$OUT_DIR/$objname
    if em++ "$cpp" $INCLUDES $CFLAGS -c -o "$objpath" 2>$OUT_DIR/last_err.txt; then
        echo "$relpath" >> $OUT_DIR/success.txt
        success=$((success + 1))
    else
        first_err=$(grep -m1 "error:" $OUT_DIR/last_err.txt 2>/dev/null || head -1 $OUT_DIR/last_err.txt)
        echo "$relpath|$first_err" >> $OUT_DIR/fail.txt
        fail=$((fail + 1))
    fi
done

echo "========================================"
echo "TOTAL: $total"
echo "SUCCESS: $success"
echo "FAIL: $fail"
echo "========================================"
echo ""
echo "===TOP ERROR PATTERNS==="
cut -d'|' -f2 $OUT_DIR/fail.txt | sed 's/^.*error: //' | awk '{print $1, $2, $3}' | sort | uniq -c | sort -rn | head -15
