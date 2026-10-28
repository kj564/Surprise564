// §AppPlatform_emscripten.cpp — Emscripten platform implementation
// Uses source code MCPE 2013 asli pattern (AppPlatform_android.h line 372):
//   loadTexture(filename) → get from JS cache → return TextureData
// Textures are pre-loaded async in HTML before WASM main() runs.
#include "AppPlatform_emscripten.h"
#include <cstring>
#include <cstdlib>
#include <cstdio>
#include <emscripten.h>

// §EM_JS — get texture from JS pre-loaded cache
// JS side: window.__getTexture(path) → {width, height, ptr} or null
EM_JS(int, js_getTexture, (const char* pathC, int* outW, int* outH), {
    var path = UTF8ToString(pathC);
    var tex = window.__getTexture ? window.__getTexture(path) : null;
    if (!tex) return 0;
    HEAP32[outW >> 2] = tex.width;
    HEAP32[outH >> 2] = tex.height;
    return tex.ptr;
});

// §EM_JS — get raw asset from JS pre-loaded cache
EM_JS(int, js_getAsset, (const char* pathC, int* outSize), {
    var path = UTF8ToString(pathC);
    var asset = window.__getAsset ? window.__getAsset(path) : null;
    if (!asset) return 0;
    HEAP32[outSize >> 2] = asset.size;
    return asset.ptr;
});

AppPlatform_emscripten::AppPlatform_emscripten()
    : _width(854), _height(480) {}

AppPlatform_emscripten::~AppPlatform_emscripten() {
    for (auto* tex : _loadedTextures) { if (tex) delete tex; }
}

int AppPlatform_emscripten::getScreenWidth() const { return _width; }
int AppPlatform_emscripten::getScreenHeight() const { return _height; }

TextureData AppPlatform_emscripten::loadTexture(const std::string& name, bool blur) {
    TextureData result;
    std::string path = name;

    int w = 0, h = 0;
    int ptr = js_getTexture(path.c_str(), &w, &h);

    if (ptr == 0 || w == 0 || h == 0) {
        printf("[TEX] Not in cache: %s\n", path.c_str()); fflush(stdout);
        return result;
    }

    result.w = w;
    result.h = h;
    result.data = (unsigned char*)ptr;
    result.numBytes = w * h * 4;
    result.format = TEXF_UNCOMPRESSED_8888;
    result.memoryHandledExternally = false;
    result.identifier = -1;
    result.transparent = true;

    printf("[TEX] %s: %dx%d OK\n", path.c_str(), w, h); fflush(stdout);
    return result;
}

TextureData AppPlatform_emscripten::getTexture(const std::string& name) { return TextureData(); }
void AppPlatform_emscripten::releaseTexture(TextureData* texture) {}

BinaryBlob AppPlatform_emscripten::readAssetFile(const std::string& filename) {
    int size = 0;
    int ptr = js_getAsset(filename.c_str(), &size);

    if (ptr == 0 || size <= 0) return BinaryBlob();

    printf("[ASSET] %s: %d bytes\n", filename.c_str(), size); fflush(stdout);
    return BinaryBlob((unsigned char*)ptr, size);
}

void* AppPlatform_emscripten::loadAsset(const std::string& name, int* size) {
    BinaryBlob blob = readAssetFile(name);
    if (blob.data && blob.size > 0) { *size = blob.size; return blob.data; }
    *size = 0;
    return nullptr;
}

void* AppPlatform_emscripten::loadFile(const std::string& path, int* size) { *size = 0; return nullptr; }
bool AppPlatform_emscripten::saveFile(const std::string& path, const void* data, int size) { return false; }

std::string AppPlatform_emscripten::getDateString(int y, int m, int d, int hh, int min) {
    char buf[64]; snprintf(buf, sizeof(buf), "%04d-%02d-%02d %02d:%02d", y, m, d, hh, min);
    return std::string(buf);
}

int AppPlatform_emscripten::getPixelsPerMillimeter() const { return 1; }
void AppPlatform_emscripten::playSound(const std::string& name, float volume, float pitch) {}
void AppPlatform_emscripten::stopSound(const std::string& name) {}
void AppPlatform_emscripten::vibrate(int milliseconds) {}
std::string AppPlatform_emscripten::getExternalStoragePath() const { return "/data"; }
std::string AppPlatform_emscripten::getCacheStoragePath() const { return "/cache"; }
bool AppPlatform_emscripten::hasMouse() const { return true; }
bool AppPlatform_emscripten::hasMultitouch() const { return false; }
void AppPlatform_emscripten::showKeyboard() {}
void AppPlatform_emscripten::hideKeyboard() {}
void AppPlatform_emscripten::buyGame() {}
void AppPlatform_emscripten::setupCanvas(int width, int height) { _width = width; _height = height; }
void AppPlatform_emscripten::swapBuffers() {}
