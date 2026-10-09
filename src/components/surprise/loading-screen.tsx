'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/** Subscribe ke localStorage — React canonical pattern (useSyncExternalStore).
 *  Avoids hydration mismatch + setState-in-effect lint error. */
function useLocalStorageVisited(): boolean {
  return useSyncExternalStore(
    // Subscribe — listen to storage event (cross-tab) + custom event (same tab)
    (callback) => {
      window.addEventListener('storage', callback)
      window.addEventListener('imi-visited-change', callback)
      return () => {
        window.removeEventListener('storage', callback)
        window.removeEventListener('imi-visited-change', callback)
      }
    },
    // Client snapshot
    () => localStorage.getItem('imi_visited') === '1',
    // Server snapshot — always false (gak ada localStorage di server)
    () => false
  )
}

export function LoadingScreen() {
  const visited = useLocalStorageVisited()
  // Initial state derived dari visited (false on server, may be true on client)
  // Tapi karena useSyncExternalStore returns false on server, gak hydration mismatch
  const [hidden, setHidden] = useState(false)

  // Schedule auto-hide ONLY jika belum visited — pakai useEffect dengan timer
  useEffect(() => {
    if (visited) {
      // Sudah visited sebelumnya — skip loading entirely
      const raf = requestAnimationFrame(() => setHidden(true))
      return () => cancelAnimationFrame(raf)
    }
    // First visit — auto-hide setelah 1.2s
    const timer = setTimeout(() => {
      setHidden(true)
      localStorage.setItem('imi_visited', '1')
      window.dispatchEvent(new Event('imi-visited-change'))
    }, 1200)
    return () => clearTimeout(timer)
  }, [visited])

  // Click anywhere to skip
  const handleSkip = () => {
    setHidden(true)
    localStorage.setItem('imi_visited', '1')
    window.dispatchEvent(new Event('imi-visited-change'))
  }

  // Class string computed dari hidden state — consistent server vs client
  const className = hidden ? 'loading-screen is-hidden' : 'loading-screen'

  return (
    <div
      className={className}
      aria-hidden={hidden}
      onClick={handleSkip}
      role="button"
      tabIndex={hidden ? -1 : 0}
      aria-label="Klik untuk lewati"
    >
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
      <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'sans-serif' }}>
        ketuk untuk lewati
      </p>
    </div>
  );
}
