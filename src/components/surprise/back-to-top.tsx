'use client';
import { useState, useEffect } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 border-2 border-white" aria-label="Back to top" style={{ pointerEvents: 'auto' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5"><polyline points="18 15 12 9 6 15" /></svg>
    </button>
  );
}
