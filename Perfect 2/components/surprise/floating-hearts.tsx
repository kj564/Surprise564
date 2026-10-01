'use client';

import { useState, useEffect, useReducer } from 'react';

const EMOJIS = ['❤️','💕','💗','💖','💝','🌹'];

interface Heart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [, force] = useReducer(x => x + 1, 0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setHearts(
        Array.from({ length: 15 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          size: 16 + Math.random() * 20,
          duration: 8 + Math.random() * 12,
          delay: Math.random() * 15,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        }))
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9996, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`@keyframes fhu { 0% { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.5; } 100% { transform: translateY(-120vh) rotate(360deg) scale(0.6); opacity: 0; } }`}</style>
      {hearts.map(h => (
        <div key={h.id} style={{ position: 'absolute', left: `${h.left}%`, top: '100%', fontSize: `${h.size}px`, animationName: 'fhu', animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s`, animationIterationCount: 'infinite', animationTimingFunction: 'linear', opacity: 0 }}>{h.emoji}</div>
      ))}
    </div>
  );
}
