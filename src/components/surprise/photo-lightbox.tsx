'use client';
import { useState, useEffect } from 'react';

interface LightboxProps { images: Array<{ src: string; alt: string }>; }

export function PhotoLightbox({ images }: LightboxProps) {
  const [open, setOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const [currentAlt, setCurrentAlt] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target.hasAttribute('data-lightbox')) {
        e.preventDefault(); e.stopPropagation();
        setCurrentSrc(target.src); setCurrentAlt(target.alt || ''); setOpen(true);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const currentIdx = typeof window !== 'undefined' ? images.findIndex(img => currentSrc.includes(img.src) || img.src.includes(currentSrc.replace(window.location.origin, ''))) : -1;
  const validIdx = currentIdx >= 0 ? currentIdx : 0;
  const current = currentIdx >= 0 ? images[validIdx] : { src: currentSrc, alt: currentAlt };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight' && currentIdx >= 0) { const n = (validIdx+1)%images.length; setCurrentSrc(images[n].src); setCurrentAlt(images[n].alt); }
      if (e.key === 'ArrowLeft' && currentIdx >= 0) { const n = (validIdx-1+images.length)%images.length; setCurrentSrc(images[n].src); setCurrentAlt(images[n].alt); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, currentIdx, validIdx, images]);

  if (!open) return null;
  const displaySrc = current.src.startsWith('http') && current.src.includes(window.location.origin) ? current.src.replace(window.location.origin, '') : current.src;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }} onClick={() => setOpen(false)}>
      <button onClick={() => setOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
      <img src={displaySrc} alt={current.alt || currentAlt} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
      {currentIdx >= 0 && images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); const n = (validIdx-1+images.length)%images.length; setCurrentSrc(images[n].src); setCurrentAlt(images[n].alt); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-6 h-6"><polyline points="15 18 9 12 15 6" /></svg></button>
          <button onClick={(e) => { e.stopPropagation(); const n = (validIdx+1)%images.length; setCurrentSrc(images[n].src); setCurrentAlt(images[n].alt); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-6 h-6"><polyline points="9 18 15 12 9 6" /></svg></button>
        </>
      )}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">{current.alt || currentAlt}{currentIdx >= 0 && ` (${validIdx+1} / ${images.length})`}</p>
    </div>
  );
}
