'use client';
import { useState, useEffect } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(sh > 0 ? Math.min((window.scrollY / sh) * 100, 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 pointer-events-none">
      <div className="h-full transition-all duration-150" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f43f5e 0%, #ec4899 50%, #fbbf24 100%)', boxShadow: '0 0 8px rgba(244,63,94,0.5)' }} />
    </div>
  );
}
