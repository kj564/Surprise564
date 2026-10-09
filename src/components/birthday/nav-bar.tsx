'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'Tentang' },
  { id: 'cake', label: 'Cake' },
  { id: 'story', label: 'Kenangan' },
  { id: 'eyes', label: 'Hal Favorit' },
  { id: 'wish', label: 'Surat' },
  { id: 'card', label: 'Penutup' },
]

/** Sticky navbar with smooth scroll — enhancement from Perfect 2.
 *  Visible immediately after open (jangan tunggu scroll 100px). */
export function NavBar({ forceVisible = false }: { forceVisible?: boolean }) {
  // Initialize visible berdasarkan forceVisible — no setState in effect needed
  const [visible, setVisible] = useState(forceVisible)
  const [active, setActive] = useState<string>('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (!forceVisible) {
        setVisible(window.scrollY > 100)
      }
      // Determine active section
      const sections = NAV_LINKS.map(l => document.getElementById(l.id))
        .filter(Boolean) as HTMLElement[]
      const scrollPos = window.scrollY + 100
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          setActive(NAV_LINKS[i].id)
          break
        }
      }
    }
    // Panggil sekali untuk set initial state
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [forceVisible])

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="premium-nav fixed left-0 right-0 top-0 z-40 border-b border-white/70 bg-white/75 shadow-[0_8px_30px_rgba(136,19,55,0.08)] backdrop-blur-2xl"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <a
              href="#hero"
              onClick={(e) => handleClick(e, 'hero')}
              className="flex items-center gap-3 text-sm font-bold text-rose-800 sm:text-base font-canda"
            >
              <span>♥ For Nia</span>
              {/* Goal-Gradient Effect (Laws of UX): show current/total progress */}
              <span className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[10px] font-sans font-semibold text-rose-700">
                {NAV_LINKS.findIndex(l => l.id === active) + 1}/{NAV_LINKS.length}
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleClick(e, link.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active === link.id
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_5px_14px_rgba(190,24,93,0.22)]'
                      : 'text-rose-800 hover:bg-rose-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              className="rounded-full border border-rose-100 bg-white/80 p-2.5 text-rose-800 shadow-sm transition hover:bg-rose-50 md:hidden"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                className="overflow-hidden border-t border-rose-100/80 bg-white/95 backdrop-blur-xl md:hidden"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mx-auto flex max-w-6xl flex-col gap-1 p-3">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => handleClick(e, link.id)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        active === link.id
                          ? 'bg-rose-600 text-white'
                          : 'text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
