// §AppPlatform_emscripten.cpp — Emscripten platform implementation
#include "AppPlatform_emscripten.h"
#include <cstring>
#include <cstdlib>
#include <cstdio>
#include <emscripten.h>

EM_JS(int, js_getTexture, (const char* pathC, int* outW, int* outH), {
    var path = UTF8ToString(pathC);
    var tex = window.__getTexture ? window.__getTexture(path) : null;
    if (!tex) return 0;
    HEAP32[outW >> 2] = tex.width;
    HEAP32[outH >> 2] = tex.height;
    return tex.ptr;
});

EM_JS(int, js_getAsset, (const char* pathC, int* outSize), {
    var path = UTF8ToString(pathC);
    var asset = window.__getAsset ? window.__getAsset(path) : null;
    if (!asset) return 0;
    HEAP32[outSize >> 2] = asset.size;
    return asset.ptr;
});

AppPlatform_emscripten::AppPlatform_emscripten()
    : _width(854), _height(480), _userInputStatus(0) {}

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
    if (ptr == 0 || w == 0 || h == 0) return result;
    result.w = w; result.h = h;
    result.data = (unsigned char*)ptr;
    result.numBytes = w * h * 4;
    result.format = TEXF_UNCOMPRESSED_8888;
    result.memoryHandledExternally = false;
    result.identifier = -1;
    result.transparent = true;
    return result;
}

TextureData AppPlatform_emscripten::getTexture(const std::string& name) { return TextureData(); }
void AppPlatform_emscripten::releaseTexture(TextureData* texture) {}

BinaryBlob AppPlatform_emscripten::readAssetFile(const std::string& filename) {
    int size = 0;
    int ptr = js_getAsset(filename.c_str(), &size);
    if (ptr == 0 || size <= 0) return BinaryBlob();
    return BinaryBlob((unsigned char*)ptr, size);
}

void* AppPlatform_emscripten::loadAsset(const std::string& name, int* size) {
    BinaryBlob blob = readAssetFile(name);
    if (blob.data && blob.size > 0) { *size = blob.size; return blob.data; }
    *size = 0;
    return nullptr;
}

// §Browser adaptation: saveFile/loadFile using Emscripten MEMFS.
// Rule Zero: rujukan/ is immutable; this is the browser adaptation layer.
// The game's ExternalFileLevelStorageSource (NinecraftApp.cpp:104, used when
// NO_STORAGE is not defined) calls platform->saveFile/loadFile to persist
// world data. We route these to Emscripten's in-memory filesystem (MEMFS)
// at /data (matching getExternalStoragePath). For persistence across page
// reloads, minecraft-wasm.html syncs /data to localStorage on beforeunload
// and restores on startup (see __mcpeSaveSync JS bridge).
void* AppPlatform_emscripten::loadFile(const std::string& path, int* size) {
    *size = 0;
    // §Read file from MEMFS via EM_ASM. Returns pointer to data in WASM heap
    // (caller must free via _free), or 0 if file doesn't exist.
    EM_ASM({
        var path = UTF8ToString($0);
        try {
            var data = FS.readFile(path);
            if (data && data.length > 0) {
                var ptr = _malloc(data.length);
                if (ptr) {
                    HEAPU8.set(data, ptr);
                    HEAP32[$1 >> 2] = data.length;
                    // Store ptr in a global for the return value
                    window.__mcpeLoadFilePtr = ptr;
                }
            }
        } catch(e) { window.__mcpeLoadFilePtr = 0; }
    }, path.c_str(), (int)size);
    // §Get the pointer set by EM_ASM (can't return directly from EM_ASM)
    int ptr = EM_ASM_INT({
        var p = window.__mcpeLoadFilePtr || 0;
        window.__mcpeLoadFilePtr = 0;
        return p;
    });
    return (void*)ptr;
}
bool AppPlatform_emscripten::saveFile(const std::string& path, const void* data, int size) {
    // §Write data to MEMFS via EM_ASM. Returns true on success.
    int result = EM_ASM_INT({
        var path = UTF8ToString($0);
        var dataPtr = $1;
        var size = $2;
        try {
            // Ensure parent directories exist (recursive)
            var lastSlash = path.lastIndexOf('/');
            if (lastSlash > 0) {
                var dir = path.substring(0, lastSlash);
                FS.mkdirTree(dir);
            }
            // Write file
            var data = HEAPU8.subarray(dataPtr, dataPtr + size);
            FS.writeFile(path, data);
            // §Notify JS to sync to localStorage (persistence)
            if (window.__mcpeSaveSync) window.__mcpeSaveSync(path);
            return 1;
        } catch(e) {
            console.error('[saveFile] failed: ' + e.message);
            return 0;
        }
    }, path.c_str(), (int)data, size);
    return result != 0;
}

std::string AppPlatform_emscripten::getDateString(int y, int m, int d, int hh, int min) {
    char buf[64]; snprintf(buf, sizeof(buf), "%04d-%02d-%02d %02d:%02d", y, m, d, hh, min);
    return std::string(buf);
}

int AppPlatform_emscripten::getPixelsPerMillimeter() const { return 6; }
// §Browser adaptation: play sound via Web Audio API.
// SoundEngine calls platform->playSound(name, volume, pitch) where name is
// e.g. "step.grass", "random.bow", "random.click". The actual PCM data is
// embedded in the WASM (Sound.cpp includes data/*.pcm as C arrays).
// We can't easily access the PCM by name from JS, so we generate a simple
// synthesized sound based on the sound name. This is a browser adaptation
// (Rule Zero: rujukan/ immutable, only wasm/ modified).
void AppPlatform_emscripten::playSound(const std::string& name, float volume, float pitch) {
    if (volume <= 0) return;
    EM_ASM_({
        var name = UTF8ToString($0);
        var volume = $1;
        var pitch = $2;
        // §Lazy-init Web Audio context (browsers require user gesture)
        if (!window.__mcpeAudioCtx) {
            try { window.__mcpeAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch(e) { return; }
        }
        var ctx = window.__mcpeAudioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        // §Synthesize a short sound based on sound name category
        var now = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        var freq = 440 * pitch;
        var type = 'sine';
        var dur = 0.1;
        var vol = Math.min(volume, 1) * 0.15;  // §Cap at 15% to avoid being too loud

        if (name.indexOf('step.') === 0) { type = 'triangle'; freq = 80 + Math.random()*40; dur = 0.05; }
        else if (name.indexOf('dig.') === 0) { type = 'square'; freq = 100 + Math.random()*50; dur = 0.1; }
        else if (name.indexOf('random.bow') === 0) { type = 'sine'; freq = 200; dur = 0.15; }
        else if (name.indexOf('random.click') === 0) { type = 'square'; freq = 800; dur = 0.03; vol *= 0.5; }
        else if (name.indexOf('damage') >= 0) { type = 'sawtooth'; freq = 150; dur = 0.2; }
        else if (name.indexOf('splash') >= 0) { type = 'sine'; freq = 300; dur = 0.3; }
        else { type = 'sine'; freq = 440; dur = 0.1; }

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + dur);

        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.start(now);
        osc.stop(now + dur);
    }, name.c_str(), volume, pitch);
}
void AppPlatform_emscripten::stopSound(const std::string& name) {}
void AppPlatform_emscripten::vibrate(int milliseconds) {
    EM_ASM_({
        if (navigator.vibrate) navigator.vibrate($0);
    }, milliseconds);
}
std::string AppPlatform_emscripten::getExternalStoragePath() const { return "/data"; }
std::string AppPlatform_emscripten::getCacheStoragePath() const { return "/cache"; }
bool AppPlatform_emscripten::hasMouse() const { return true; }
bool AppPlatform_emscripten::hasMultitouch() const { return true; }
void AppPlatform_emscripten::showKeyboard() {}
void AppPlatform_emscripten::hideKeyboard() {}
void AppPlatform_emscripten::buyGame() {}
void AppPlatform_emscripten::setupCanvas(int width, int height) { _width = width; _height = height; }
void AppPlatform_emscripten::swapBuffers() {}

// §createUserInput — show JS prompt for world name + seed
// Called when user clicks "Create new" in SelectWorldScreen
EM_JS(int, js_createUserInput, (void), {
    // §Auto-create world with default name — no dialog needed
    // Works on both desktop and mobile (prompt() doesn't work in headless/mobile)
    window.__mcpeUserName = 'New World';
    window.__mcpeUserSeed = '';
    return 1;
});

EM_JS(int, js_getUserNameLen, (void), {
    return window.__mcpeUserName ? window.__mcpeUserName.length : 0;
});

EM_JS(void, js_copyUserName, (int ptr), {
    var s = window.__mcpeUserName || '';
    for (var i = 0; i < s.length; i++) { HEAP8[ptr + i] = s.charCodeAt(i); }
    HEAP8[ptr + s.length] = 0;
});

EM_JS(int, js_getUserSeedLen, (void), {
    return window.__mcpeUserSeed ? window.__mcpeUserSeed.length : 0;
});

EM_JS(void, js_copyUserSeed, (int ptr), {
    var s = window.__mcpeUserSeed || '';
    for (var i = 0; i < s.length; i++) { HEAP8[ptr + i] = s.charCodeAt(i); }
    HEAP8[ptr + s.length] = 0;
});

void AppPlatform_emscripten::createUserInput() {
    _userInputStatus = 0;
    _userInputData.clear();
    
    int result = js_createUserInput();
    
    if (result == 1) {
        int nameLen = js_getUserNameLen();
        if (nameLen > 0) {
            char* nameBuf = (char*)malloc(nameLen + 1);
            js_copyUserName((int)nameBuf);
            std::string nameStr(nameBuf);
            free(nameBuf);
            
            int seedLen = js_getUserSeedLen();
            std::string seedStr;
            if (seedLen > 0) {
                char* seedBuf = (char*)malloc(seedLen + 1);
                js_copyUserSeed((int)seedBuf);
                seedStr = std::string(seedBuf);
                free(seedBuf);
            }
            
            _userInputData.push_back(nameStr);
            _userInputData.push_back(seedStr);
            _userInputData.push_back("creative");
            _userInputStatus = 1;
        } else {
            _userInputStatus = -1;
        }
    } else {
        _userInputStatus = -1;
    }
}

int AppPlatform_emscripten::getUserInputStatus() {
    return _userInputStatus;
}

StringVector AppPlatform_emscripten::getUserInput() {
    return _userInputData;
}
