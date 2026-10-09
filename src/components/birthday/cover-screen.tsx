'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'

/**
 * Layar pembuka dengan kado yang bisa dibuka (pink radial-gradient — TIDAK DIRUBAH).
 * Setelah dibuka, parent onOpen dipanggil untuk transisi ke konten utama.
 */
export function CoverScreen({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false)

  const handleOpen = () => {
    setOpening(true)
    // Reduced dari 900ms ke 500ms — biar transisi lebih responsif di mobile
    setTimeout(() => onOpen(), 500)
  }

  return (
    <motion.section
      className="premium-cover fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 py-10 text-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: opening ? 0 : 1, scale: opening ? 1.05 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        background:
          'radial-gradient(ellipse at 50% 12%, rgba(255,255,255,0.98) 0%, rgba(255,241,247,0.96) 28%, rgba(252,207,232,0.96) 66%, rgba(244,180,211,0.98) 100%)',
      }}
    >
      {/* Hiasan hati melayang di background */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-rose-300/60"
          style={{
            left: `${10 + i * 11}%`,
            top: `${(i % 3) * 25 + 10}%`,
            fontSize: `${20 + (i % 4) * 8}px`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
          aria-hidden
        >
          ♥
        </motion.span>
      ))}

      <motion.p
        className="mb-4 rounded-full border border-white/80 bg-white/55 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-rose-500 shadow-sm backdrop-blur-md sm:text-xs font-comic"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Sebuah kejutan kecil untukmu
      </motion.p>

      <motion.h1
        className="mb-8 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-rose-800 sm:text-5xl md:text-6xl font-canda"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{ textShadow: '0 8px 30px rgba(190,24,93,0.12)' }}
      >
        Hai, {birthdayContent.partnerName}…
      </motion.h1>

      {/* Kado — pakai pulse animation untuk signifier (Norman's principle:
          "Signifiers" — visual cue bahwa ini clickable, dari Don Norman's Design of Everyday Things) */}
      <motion.button
        onClick={handleOpen}
        disabled={opening}
        className="group relative h-48 w-48 cursor-pointer sm:h-56 sm:w-56"
        aria-label="Buka hadiah"
        initial={{ scale: 0, rotate: -30 }}
        animate={{
          scale: opening ? 1.2 : 1,
          rotate: opening ? 5 : 0,
          y: opening ? -40 : 0,
          boxShadow: opening
            ? '0 0 0 0 rgba(244,114,182,0)'
            : [
                '0 0 0 0 rgba(244,114,182,0.85), 0 0 24px 4px rgba(244,114,182,0.4)',
                '0 0 0 28px rgba(244,114,182,0), 0 0 24px 4px rgba(244,114,182,0)',
                '0 0 0 0 rgba(244,114,182,0.85), 0 0 24px 4px rgba(244,114,182,0.4)',
              ],
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 18,
          duration: 0.4,
          boxShadow: {
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeOut',
          },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Tajuk kado (tutup atas) */}
        <motion.div
          className="absolute left-1/2 top-0 h-12 w-full -translate-x-1/2"
          animate={{
            y: opening ? -180 : 0,
            opacity: opening ? 0 : 1,
            rotate: opening ? -45 : 0,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            background:
              'linear-gradient(180deg, #f472b6 0%, #ec4899 60%, #db2777 100%)',
            borderRadius: '14px 14px 0 0',
            boxShadow: '0 6px 18px rgba(219,39,119,0.35)',
          }}
        >
          <div className="absolute left-1/2 top-1 h-8 w-8 -translate-x-1/2 rounded-full bg-amber-300 shadow-inner" />
        </motion.div>

        {/* Pita vertikal */}
        <div
          className="absolute left-1/2 top-3 h-44 w-6 -translate-x-1/2 sm:h-52"
          style={{
            background:
              'linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #fcd34d 100%)',
          }}
        />
        {/* Pita horizontal */}
        <div
          className="absolute left-0 top-20 h-6 w-full sm:top-24"
          style={{
            background:
              'linear-gradient(90deg, #fcd34d 0%, #f59e0b 50%, #fcd34d 100%)',
          }}
        />
        {/* Kotak kado */}
        <div
          className="absolute bottom-0 h-32 w-full rounded-md sm:h-36"
          style={{
            background:
              'linear-gradient(180deg, #fb7185 0%, #f43f5e 60%, #e11d48 100%)',
            boxShadow: '0 14px 32px rgba(225,29,72,0.4)',
          }}
        />
        {/* Selempang pita */}
        <motion.div
          className="absolute left-1/2 top-16 h-6 w-24 -translate-x-1/2 rounded-full bg-amber-300 sm:top-20"
          animate={{
            scale: opening ? 1.5 : 1,
            opacity: opening ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      <AnimatePresence>
        {!opening && (
          <motion.p
            className="mt-8 rounded-full border border-white/70 bg-white/55 px-5 py-2.5 text-sm text-rose-600 shadow-sm backdrop-blur-md font-comic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {birthdayContent.openGiftHint}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.p
        className="absolute bottom-5 px-4 text-[10px] uppercase tracking-[0.2em] text-rose-500/75 sm:text-xs font-comic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Dibuat dengan ♥ untukmu oleh {birthdayContent.yourName}
      </motion.p>
    </motion.section>
  )
}
