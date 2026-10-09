'use client'

import { motion } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'

/**
 * Hero section — pakai background gingham merah-putih (img0.webp) + HAPPY BIRTHDAY text graphic (img7.webp).
 * Heading pakai Canda Tawa Cute (font-canda), tanggal lahir pakai Comic Sans (font-comic).
 */
export function HeroSection() {
  const { images } = birthdayContent

  return (
    <section
      id="hero"
      className="premium-hero relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-24 text-center sm:px-8"
    >
      {/* Background gingham merah-putih (img0.webp) — background utama Imi */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(255,247,250,0.60), rgba(255,255,255,0.18) 42%, rgba(255,235,243,0.68)), url(${images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* HAPPY BIRTHDAY text graphic (img7.webp) — dekorasi slide 1 */}
      <motion.img
        src={images.happyBirthdayText}
        alt="Happy Birthday"
        className="relative z-10 mb-5 w-44 max-w-[82%] object-contain drop-shadow-[0_18px_28px_rgba(136,19,55,0.18)] sm:w-60 md:w-72"
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        whileHover={{ rotate: 5, scale: 1.05 }}
        aria-hidden
      />

      <motion.p
        className="relative z-10 mb-5 inline-block rounded-full border border-white/80 bg-white/65 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-rose-700 shadow-[0_8px_28px_rgba(136,19,55,0.08)] backdrop-blur-xl sm:text-xs font-comic"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        data-animate
      >
        Selamat Ulang Tahun
      </motion.p>

      <motion.h1
        className="relative z-10 max-w-full break-words text-6xl font-black leading-[0.95] tracking-tight text-rose-800 drop-shadow-[0_8px_24px_rgba(136,19,55,0.16)] sm:text-8xl md:text-9xl font-canda"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.5 }}
        style={{
          textShadow: '0 8px 34px rgba(190,24,93,0.16), 0 2px 4px rgba(255,255,255,0.75)',
        }}
      >
        {birthdayContent.partnerName}
      </motion.h1>

      <motion.div
        className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <motion.span
          className="rounded-full border border-white/30 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(190,24,93,0.25)] sm:text-base"
          animate={{
            boxShadow: [
              '0 8px 24px rgba(236,72,153,0.35)',
              '0 8px 32px rgba(236,72,153,0.55)',
              '0 8px 24px rgba(236,72,153,0.35)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {birthdayContent.birthdayAge}th ♥
        </motion.span>
        <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-xs font-medium text-rose-800 shadow-sm backdrop-blur-xl sm:text-sm font-comic">
          📅 {birthdayContent.birthdayDate}
        </span>
      </motion.div>

      <motion.div
        className="relative z-10 my-8 h-px w-36 bg-gradient-to-r from-transparent via-rose-500 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 128, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />

      <motion.p
        className="relative z-10 max-w-xl rounded-2xl border border-white/80 bg-white/65 px-6 py-3 text-base leading-relaxed text-rose-950 shadow-[0_12px_35px_rgba(136,19,55,0.08)] backdrop-blur-xl sm:text-lg md:text-xl font-sugar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        style={{
          textShadow: '0 1px 2px rgba(255,255,255,0.6)',
        }}
      >
        {birthdayContent.heroSubtitle}
      </motion.p>

      <motion.p
        className="relative z-10 mt-5 text-sm italic text-rose-800/80 font-comic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        — dari {birthdayContent.yourName}
      </motion.p>

      <motion.div
        className="absolute bottom-7 z-10 flex flex-col items-center gap-2 text-rose-700/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.4 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <span className="text-xs uppercase tracking-[0.3em] font-comic">
          Scroll ke bawah
        </span>
        <span className="text-lg">↓</span>
      </motion.div>
    </section>
  )
}
