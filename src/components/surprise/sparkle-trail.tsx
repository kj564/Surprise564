'use client';
import { useEffect, useRef } from 'react';

const SPARKLES = ['✨','⭐','💫','🌟'];

export function SparkleTrail() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let last = 0;
    const onMove = (e: MouseEvent) => {
      if (Date.now() - last < 80) return;
      last = Date.now();
      if (!ref.current) return;
      const s = document.createElement('div');
      s.textContent = SPARKLES[Math.floor(Math.random()*SPARKLES.length)];
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:${12+Math.random()*10}px;pointer-events:none;z-index:9997;animation:st-fade 1s ease-out forwards;transform:translate(-50%,-50%)`;
      ref.current.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);
  return <div ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9997 }}><style>{`@keyframes st-fade { 0% { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(0deg); } 100% { opacity: 0; transform: translate(-50%,-150%) scale(0.3) rotate(180deg); } }`}</style></div>;
}
