'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface NavBarProps {
  links: Array<{ id: string; label: string }>;
}

export function NavBar({ links }: NavBarProps) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 400);
      let current = '';
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            current = l.id;
          }
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [links]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-yellow-400 shadow-md"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => scrollTo('hero')}
              className="inline-flex items-center gap-2 bg-lime-200 px-3 py-1.5 rounded-full border-2 border-yellow-400 font-black text-black text-sm sm:text-base"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>For Nia</span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className={`px-3 py-2 rounded-full text-sm font-bold transition-colors ${
                    active === l.id
                      ? 'bg-red-600 text-white shadow'
                      : 'text-black hover:bg-red-100'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-black"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t-2 border-yellow-400 overflow-hidden"
              >
                <div className="px-4 py-2 space-y-1">
                  {links.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => scrollTo(l.id)}
                      className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                        active === l.id
                          ? 'bg-red-600 text-white'
                          : 'text-black hover:bg-red-100'
                      }`}
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
