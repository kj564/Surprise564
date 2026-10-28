#include <cstdio>
#include "Random.h"
#include "Mth.h"

int main() {
    printf("MCPE 2013 compiled in WASM!\n");
    Random r(42);
    printf("Random nextInt(100) = %d\n", r.nextInt(100));
    printf("Random nextFloat() = %f\n", r.nextFloat());
    printf("Mth::sin(0) = %f\n", Mth::sin(0.0f));
    printf("Mth::cos(0) = %f\n", Mth::cos(0.0f));
    printf("Mth::floor(3.7) = %d\n", Mth::floor(3.7f));
    printf("Mth::PI = %f\n", Mth::PI);
    return 0;
}
