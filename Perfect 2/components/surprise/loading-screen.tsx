'use client';

import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${hidden ? 'is-hidden' : ''}`} aria-hidden={hidden}>
      <style>{`
        .loading-screen {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 50%, #f472b6 100%);
          opacity: 1; visibility: visible;
          transition: opacity 0.8s ease-out 0s, visibility 0s linear 0.8s;
        }
        .loading-screen.is-hidden { opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.8s ease-out 0s, visibility 0s linear 0.8s; }
        @keyframes loading-bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes loading-heart-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes loading-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
      <div style={{ width: 80, height: 80, animation: 'loading-heart-pulse 1.2s ease-in-out infinite' }}>
        <svg viewBox="0 0 24 24" fill="#f43f5e" stroke="white" strokeWidth="1.5" className="w-full h-full drop-shadow-lg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#f43f5e" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 30 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: ['#ec4899','#f43f5e','#f472b6'][i], animation: `loading-bounce 1.4s ease-in-out infinite both`, animationDelay: `${-0.32 + i * 0.16}s` }} />
        ))}
      </div>
      <p style={{ marginTop: 24, color: 'white', fontSize: 18, fontWeight: 600, fontFamily: 'Dancing Script, cursive', textShadow: '0 2px 8px rgba(190,24,93,0.4)' }}>
        <span style={{ background: 'linear-gradient(90deg, #fff 0%, #fbcfe8 50%, #fff 100%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'loading-shimmer 2s linear infinite' }}>
          Memuat kejutan untuk Nia...
        </span>
      </p>
    </div>
  );
}
