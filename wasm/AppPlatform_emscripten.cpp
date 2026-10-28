// §AppPlatform_emscripten.cpp — Emscripten platform implementation
#include "AppPlatform_emscripten.h"
#include <cstring>
#include <cstdlib>
#include <cstdio>

AppPlatform_emscripten::AppPlatform_emscripten()
    : _width(854), _height(480) {}

AppPlatform_emscripten::~AppPlatform_emscripten() {
    for (auto* tex : _loadedTextures) { if (tex) delete tex; }
}

int AppPlatform_emscripten::getScreenWidth() const { return _width; }
int AppPlatform_emscripten::getScreenHeight() const { return _height; }

TextureData AppPlatform_emscripten::getTexture(const std::string& name) { return TextureData(); }
TextureData AppPlatform_emscripten::loadTexture(const std::string& name, bool blur) { return TextureData(); }
void AppPlatform_emscripten::releaseTexture(TextureData* texture) {}
void* AppPlatform_emscripten::loadAsset(const std::string& name, int* size) { return nullptr; }
void* AppPlatform_emscripten::loadFile(const std::string& path, int* size) { return nullptr; }
bool AppPlatform_emscripten::saveFile(const std::string& path, const void* data, int size) { return false; }

std::string AppPlatform_emscripten::getDateString(int y, int m, int d, int h, int min) {
    char buf[64]; snprintf(buf, sizeof(buf), "%04d-%02d-%02d %02d:%02d", y, m, d, h, min);
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
