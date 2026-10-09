'use client';

import { useEffect, useState, useReducer } from 'react';

interface ConfettiProps { trigger: boolean; }
interface Particle { id: number; left: number; delay: number; duration: number; color: string; size: number; isCircle: boolean; }

const COLORS = ['#f43f5e','#ec4899','#fb7185','#fbbf24','#fcd34d','#a78bfa','#f9a8d4','#fde047','#f472b6','#34d399','#60a5fa','#f87171'];

export function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);
  const [, force] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (!trigger) return;
    const np: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      np.push({ id: i, left: Math.random()*100, delay: Math.random()*0.8, duration: 2.5+Math.random()*2.5, color: COLORS[Math.floor(Math.random()*COLORS.length)], size: 8+Math.random()*14, isCircle: Math.random()>0.4 });
    }
    const raf = requestAnimationFrame(() => { setParticles(np); setVisible(true); });
    const timer = setTimeout(() => { setVisible(false); setParticles([]); }, 5000);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [trigger]);

  if (!visible || particles.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`@keyframes confetti-fall-fix { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(105vh) rotate(720deg); opacity: 0; } }`}</style>
      {particles.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.left}%`, top: 0, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, borderRadius: p.isCircle ? '50%' : '2px', animationName: 'confetti-fall-fix', animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, animationTimingFunction: 'ease-in', animationIterationCount: 1, animationFillMode: 'forwards', opacity: 0, zIndex: 9998 }} />
      ))}
    </div>
  );
}
