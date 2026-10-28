// §AppPlatform_emscripten.h — Emscripten/WebGL platform layer for MCPE 2013
// Replaces AppPlatform_android.h / AppPlatform_win32.h
// Provides browser-compatible implementations of platform-specific functions.
#ifndef APP_PLATFORM_EMSCRIPTEN_H__
#define APP_PLATFORM_EMSCRIPTEN_H__

#include "AppPlatform.h"
#include <string>
#include <vector>

class AppPlatform_emscripten : public AppPlatform {
public:
    AppPlatform_emscripten();
    virtual ~AppPlatform_emscripten();

    // §AppPlatform.h — platform abstraction methods
    int getScreenWidth() const;
    int getScreenHeight() const;
    
    TextureData getTexture(const std::string& name);
    TextureData loadTexture(const std::string& name, bool blur = false);
    void releaseTexture(TextureData* texture);
    
    void* loadAsset(const std::string& name, int* size);
    void* loadFile(const std::string& path, int* size);
    bool saveFile(const std::string& path, const void* data, int size);
    
    std::string getDateString(int year, int month, int day, int hour, int minute);
    
    int getPixelsPerMillimeter() const;
    
    void playSound(const std::string& name, float volume, float pitch);
    void stopSound(const std::string& name);
    
    void vibrate(int milliseconds);
    
    std::string getExternalStoragePath() const;
    std::string getCacheStoragePath() const;
    
    bool hasMouse() const;
    bool hasMultitouch() const;
    
    void showKeyboard();
    void hideKeyboard();
    
    void buyGame();
    
    // §Emscripten-specific
    void setupCanvas(int width, int height);
    void swapBuffers();
    
private:
    int _width;
    int _height;
    std::vector<TextureData*> _loadedTextures;
};

#endif // APP_PLATFORM_EMSCRIPTEN_H__
