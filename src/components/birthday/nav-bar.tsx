'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'cake', label: 'Cake' },
  { id: 'story', label: 'Story' },
  { id: 'eyes', label: 'Eyes' },
  { id: 'wish', label: 'Wish' },
  { id: 'card', label: 'Card' },
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
          className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md shadow-md border-b-2 border-rose-200"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
            <a
              href="#hero"
              onClick={(e) => handleClick(e, 'hero')}
              className="font-bold text-rose-700 font-canda text-sm sm:text-base flex items-center gap-3"
            >
              <span>♥ For Nia</span>
              {/* Goal-Gradient Effect (Laws of UX): show current/total progress */}
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-sans font-semibold text-rose-600">
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
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden rounded-full p-2 text-rose-700 hover:bg-rose-100"
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
                className="md:hidden border-t border-rose-200 bg-white"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col gap-1 p-3">
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
