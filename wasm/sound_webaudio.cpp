// §Browser adaptation: Web Audio sound player for emscripten.
// Rule Zero: rujukan/ immutable. This file provides a C export that JS
// (or C++ code) can call to play raw PCM data via Web Audio API.
// SoundDesc contains: buffer (PCM samples), numFrames, channels, byteWidth, frameRate.
#include "platform/audio/SoundSystem.h"
#include "client/sound/Sound.h"
#include <emscripten.h>

// §play_sound_pcm: play raw PCM data via Web Audio API.
// Called with SoundDesc fields. PCM is 16-bit signed, channels interleaved.
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
