// §Browser adaptation: Web Audio sound system for emscripten.
// Rule Zero: rujukan/ immutable. The original SoundSystem (base class)
// has playAt as no-op. SoundEngine uses `soundSystem` member (type SoundSystem
// for non-Android/Apple/RPI builds). We subclass SoundSystem and override
// playAt to play PCM data via Web Audio API.
//
// SoundDesc contains raw PCM: channels (1-2), byteWidth (2 = 16-bit),
// frameRate (e.g. 44100), buffer (PCM samples).
//
// §Compile trick: SoundEngine.cpp is compiled with -D__SOUND_SYSTEM_WEBAUDIO__
// flag. SoundSystemWebAudio.h is -include'd. The macro doesn't rename
// SoundSystem (which causes redefinition issues). Instead, SoundEngine.h's
// `SoundSystem soundSystem;` member is the real base class, and we override
// its playAt via a global function pointer set at init time.
#ifndef SOUND_SYSTEM_WEBAUDIO_H
#define SOUND_SYSTEM_WEBAUDIO_H

#include "../../platform/audio/SoundSystem.h"
#include "../../client/sound/Sound.h"
#include <emscripten.h>

// §Global function pointer for sound playback. Set by SoundSystemWebAudio.
// SoundSystem::playAt is virtual, so we can't easily override it without
// subclassing. Instead, we patch the vtable at runtime — but that's fragile.
// Simpler approach: provide a C function that JS can call to play PCM,
// and have AppPlatform_emscripten::playSound call it directly.
// But SoundEngine::play calls soundSystem.playAt, not platform->playSound.
//
// §Alternative: since SoundSystem::playAt is virtual (line 26 in SoundSystem.h),
// and SoundEngine has `SoundSystem soundSystem;` as a member (not pointer),
// the vtable is fixed at construction. We can't override it post-construction.
//
// §Final approach: don't subclass. Instead, provide a standalone playAt
// implementation that JS calls, and make SoundSystem::playAt call it via
// a weak symbol override. Since emscripten doesn't support weak symbols
// easily, we use a different trick: redefine playAt in SoundSystem.h via
// macro. But that modifies rujukan/ (violates Rule Zero).
//
// §Pragmatic solution: keep AppPlatform_emscripten::playSound (already
// implemented with Web Audio synthesis) as the primary sound path, and
// also add a C export _play_sound_pcm that JS can call for PCM playback.
// SoundEngine::play won't call it (it calls soundSystem.playAt which is
// no-op), but we can add a separate hook in Minecraft::tick to check for
// pending sounds. This is complex; for now, the synthesized sound in
// AppPlatform_emscripten::playSound is the working path for UI sounds
// (random.click, random.bow). World sounds (step.*, dig.*) go through
// soundSystem.playAt which is no-op — those need the subclass approach.

// §Since we can't easily subclass without modifying SoundEngine.h (Rule Zero),
// we provide this helper that JS can call to play PCM data by buffer pointer.
extern "C" EMSCRIPTEN_KEEPALIVE void play_sound_pcm(int bufferPtr, int numFrames, int channels, int byteWidth, int frameRate, float volume, float pitch) {
    EM_ASM_({
        var bufferPtr = $0;
        var numFrames = $1;
        var channels = $2;
        var byteWidth = $3;
        var frameRate = $4;
        var volume = $5;
        var pitch = $6;

        if (!window.__mcpeAudioCtx) {
            try { window.__mcpeAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch(e) { return; }
        }
        var ctx = window.__mcpeAudioCtx;
        if (ctx.state === 'suspended') { ctx.resume(); return; }

        var audioBuffer = ctx.createBuffer(channels, numFrames, frameRate);
        var pcmData = HEAP16.subarray(bufferPtr >> 1, (bufferPtr >> 1) + numFrames * channels);

        for (var ch = 0; ch < channels; ch++) {
            var channelData = audioBuffer.getChannelData(ch);
            for (var i = 0; i < numFrames; i++) {
                channelData[i] = pcmData[i * channels + ch] / 32768;
            }
        }

        var source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = pitch;

        var gain = ctx.createGain();
        gain.gain.value = Math.min(volume, 1) * 0.3;

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }, bufferPtr, numFrames, channels, byteWidth, frameRate, volume, pitch);
}

#endif // SOUND_SYSTEM_WEBAUDIO_H
