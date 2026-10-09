'use client';

import { useState, useEffect, useRef } from 'react';

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const onStart = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play()
          .then(() => setPlaying(true))
          .catch((err) => {
            console.warn('Music autoplay failed:', err.message);
            setPlaying(false);
            // Show hint toast kalau autoplay block
            setShowHint(true);
            setTimeout(() => setShowHint(false), 5000);
          });
      }
    };
    window.addEventListener('startMusic', onStart);
    return () => window.removeEventListener('startMusic', onStart);
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.volume = 0.3;
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.warn('Music play failed:', err.message);
          setShowHint(true);
          setTimeout(() => setShowHint(false), 5000);
        });
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/surprise/music/the-shade.mp3" type="audio/mpeg" />
      </audio>
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-red-600 shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110"
        aria-label={playing ? 'Pause music' : 'Play music'}
        style={{ pointerEvents: 'auto' }}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        )}
      </button>
      {/* Hint toast kalau autoplay failed */}
      {showHint && (
        <div className="fixed bottom-20 right-4 z-50 max-w-xs rounded-lg bg-rose-600 px-4 py-2 text-xs text-white shadow-lg">
          🎵 ketuk tombol Play di pojok buat mainkan musik
        </div>
      )}
    </>
  );
}
