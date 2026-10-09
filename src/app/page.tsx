'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// 8 native birthday sections (rebuilt with original content + webp paths)
import { CoverScreen } from '@/components/birthday/cover-screen'
import { HeroSection } from '@/components/birthday/hero-section'
import { SiapaAkuSection } from '@/components/birthday/siapa-aku-section'
import { CakeSection } from '@/components/birthday/cake-section'
import { TimelineSection } from '@/components/birthday/timeline-section'
import { TraitsSection } from '@/components/birthday/traits-section'
import { LoveLetter } from '@/components/birthday/love-letter'
import { Footer } from '@/components/birthday/footer'

// Native birthday utilities
import { Confetti } from '@/components/birthday/confetti'
import { NavBar } from '@/components/birthday/nav-bar'

// Enhancement components from Perfect 2 (template Imi — patokan repo)
import { LoadingScreen } from '@/components/surprise/loading-screen'
import { MusicPlayer } from '@/components/surprise/music-player'
import { ScrollProgress } from '@/components/surprise/scroll-progress'
import { BackToTop } from '@/components/surprise/back-to-top'
import { FloatingHearts } from '@/components/surprise/floating-hearts'
// Restored SparkleTrail — match Perfect 2 (FloatingHearts + SparkleTrail bersamaan)
import { SparkleTrail } from '@/components/surprise/sparkle-trail'
// PhotoLightbox — click photos → zoom modal (Norman Affordances + Krug Billboard)
import { PhotoLightbox } from '@/components/surprise/photo-lightbox'
// useScrollAnimation hook — scroll-triggered animations (Krug Billboard Design 101)
import { useScrollAnimation } from '@/components/surprise/use-scroll-animation'

/** Photo lightbox images — sama seperti di Perfect 2 page.tsx.
 *  Foto-foto yang bisa di-click untuk zoom (data-lightbox attribute dipasang di section components). */
const LIGHTBOX_IMAGES = [
  { src: '/surprise/html/img10.webp', alt: 'Foto Nia outdoor malam' },
  { src: '/surprise/html/img12.webp', alt: 'Selfie mirror Nia' },
  { src: '/surprise/html/img19.webp', alt: 'XD Class' },
  { src: '/surprise/html/img20.webp', alt: 'First Date' },
  { src: '/surprise/html/img21.webp', alt: 'Graduation' },
  { src: '/surprise/html/img23.webp', alt: 'LDR video call' },
  { src: '/surprise/html/img26.webp', alt: 'Couple di photobooth' },
]

/**
 * Web surprise ulang tahun untuk Nia (Aulia Rizky Ramadhaniati) dari Imi.
 *
 * PATOKAN: 5 buku UI/UX (Laws of UX, Refactoring UI, Don't Make Me Think,
 * Design of Everyday Things) + repo Imi Perfect 2 (gold standard).
 *
 * 8 native birthday sections + Perfect 2 enhancement components (full alignment).
 * - Cover, Hero, Siapa Aku, Cake, Timeline, Traits, LoveLetter, Footer
 * - LoadingScreen, Confetti, ScrollProgress, MusicPlayer, BackToTop
 * - FloatingHearts + SparkleTrail (both, match Perfect 2)
 * - PhotoLightbox (click photos → zoom modal)
 * - useScrollAnimation hook (scroll-triggered animations)
 * - NavBar custom dengan Goal-Gradient Effect (1/7 progress indicator)
 */
export default function Home() {
  const [opened, setOpened] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(false)

  // useScrollAnimation — apply data-animate attributes to elements for scroll-triggered reveal
  useScrollAnimation()

  // Scroll lock sampai user klik Open My Gift
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [opened])

  const handleOpen = useCallback(() => {
    setOpened(true)
    setConfettiTrigger(true)
    // Trigger music player start event
    window.dispatchEvent(new Event('startMusic'))
    setTimeout(() => {
      const el = document.getElementById('hero')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [])

  const handleCelebrate = useCallback(() => {
    setConfettiTrigger(true)
    setTimeout(() => setConfettiTrigger(false), 100)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-pink-50 text-rose-900">
      {/* Loading screen (sebelum cover screen) — enhancement dari Perfect 2 */}
      <LoadingScreen />

      {/* Native confetti (80 particles, triggered on Open) */}
      <Confetti trigger={confettiTrigger} />

      {/* Enhancement components from Perfect 2 — match repo Imi
          Music player HIDDEN saat cover screen (z-index fix via conditional render) */}
      <ScrollProgress />
      {opened && <MusicPlayer />}
      {opened && <BackToTop />}
      <FloatingHearts />
      <SparkleTrail />

      {/* PhotoLightbox — listen clicks on photos with data-lightbox attribute */}
      <PhotoLightbox images={LIGHTBOX_IMAGES} />

      {/* Native navbar (custom aku, Goal-Gradient Effect) — show after open */}
      {opened && <NavBar forceVisible={opened} />}

      <AnimatePresence mode="wait">
        {!opened && <CoverScreen key="cover" onOpen={handleOpen} />}
      </AnimatePresence>

      {opened && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <HeroSection />
          <SiapaAkuSection />
          {/* Cake section KEPT — embodies Tesler's Law (conservation of complexity).
              Perfect 2 hapus Cake karena gak sesuai narrative flow, tapi Cake
              provide simple interactive value-add (5 lilin + 1 click = permohonan). */}
          <CakeSection onCelebrate={handleCelebrate} />
          <TimelineSection />
          <TraitsSection />
          <LoveLetter />
          <Footer />
        </motion.div>
      )}
    </main>
  )
}
