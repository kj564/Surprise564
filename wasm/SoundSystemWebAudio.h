// §Browser adaptation: Web Audio sound system for emscripten.
// Rule Zero: rujukan/ immutable. SoundEngine has `SoundSystem soundSystem;`
// member (base class, playAt is no-op). We subclass SoundSystem and override
// playAt to play PCM via Web Audio API. SoundEngine.cpp is compiled with
// -DSoundSystem=SoundSystemWebAudio so the member becomes our subclass.
//
// SoundDesc contains: buffer (PCM 16-bit signed), numFrames, channels, byteWidth, frameRate.
#ifndef SOUND_SYSTEM_WEBAUDIO_H
#define SOUND_SYSTEM_WEBAUDIO_H

// §Undef the SoundSystem macro (from -D flag) so we can include the real
// SoundSystem.h and define our subclass. We re-define it after.
#ifdef SoundSystem
# undef SoundSystem
#endif

#include "../../platform/audio/SoundSystem.h"
#include "../../client/sound/Sound.h"
#include <emscripten.h>

// §SoundSystemWebAudio: subclass of the real SoundSystem that plays PCM
// data via Web Audio API instead of no-op.
class SoundSystemWebAudio : public SoundSystem
{
public:
    SoundSystemWebAudio() : SoundSystem() {}

    bool isAvailable() { return true; }
    void enable(bool status) {}

    void playAt(const SoundDesc& desc, float x, float y, float z, float volume, float pitch) {
        if (!desc.isValid() || desc.numFrames <= 0 || volume <= 0) return;
        // §Play PCM via Web Audio API. desc.frames points to raw 16-bit signed
        // PCM data in the WASM heap (interleaved channels, after 16-byte header).
        EM_ASM_({
            var bufferPtr = $0;   // desc.frames (PCM data start)
            var numFrames = $1;
            var channels = $2;
            var frameRate = $3;
            var volume = $4;
            var pitch = $5;

            if (!window.__mcpeAudioCtx) {
                try { window.__mcpeAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
                catch(e) { return; }
            }
            var ctx = window.__mcpeAudioCtx;
            if (ctx.state === 'suspended') { ctx.resume(); return; }

            // §Create AudioBuffer from 16-bit PCM
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

            // §Volume scaling (0-1, capped at 30% to avoid clipping)
            var gain = ctx.createGain();
            gain.gain.value = Math.min(volume, 1) * 0.3;

            source.connect(gain);
            gain.connect(ctx.destination);
            source.start();
        }, (int)desc.frames, desc.numFrames, desc.channels, desc.frameRate, volume, pitch);
    }
};

// §Restore the SoundSystem macro for the rest of the compilation
// (SoundEngine.h's `SoundSystem soundSystem;` becomes `SoundSystemWebAudio soundSystem;`)
#define SoundSystem SoundSystemWebAudio

#endif // SOUND_SYSTEM_WEBAUDIO_H
