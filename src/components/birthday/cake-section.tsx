'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'

/**
 * Section kue ulang tahun + SATU lilin besar (was 5 lilin).
 *
 * 1 lilin = satu permohonan untuk tahun ke-19 (Hick's Law — kurang choice, jelas action).
 * Plus embodies Tesler's Law — conservation of complexity.
 *
 * Background: gingham merah-putih (img0.webp).
 * Heading pakai Canda Tawa Cute, body pakai More Sugar Thin.
 */
export function CakeSection({ onCelebrate }: { onCelebrate: () => void }) {
  const [blown, setBlown] = useState(false)

  const blow = () => {
    if (blown) return
    setBlown(true)
    setTimeout(() => onCelebrate(), 500)
  }

  return (
    <section
      id="cake"
      className="relative w-full px-6 py-20"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `url(${birthdayContent.images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          className="mb-2 text-xs uppercase tracking-[0.3em] text-rose-700/80 font-comic"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          Tiup Lilinnya
        </motion.p>
        <motion.h2
          className="mb-8 text-4xl font-bold text-rose-700 sm:text-5xl font-canda"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Buat Satu Permohonan
        </motion.h2>

        <motion.p
          className="mx-auto mb-10 max-w-md text-base text-rose-700/80 font-sugar bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm inline-block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {birthdayContent.cakeHint}
        </motion.p>

        {/* SATU lilin besar di atas kue */}
        <div className="mx-auto mb-4 flex w-full max-w-md justify-center px-4">
          <Candle blown={blown} onClick={blow} />
        </div>

        {/* Kue */}
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="relative h-60 w-full">
            <motion.div
              className="absolute left-1/2 top-[-30px] z-10 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 px-4 py-2 text-2xl font-black text-rose-900 shadow-lg"
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {birthdayContent.birthdayAge}
              <span className="ml-1 text-xs font-normal">th</span>
            </motion.div>

            <div
              className="absolute left-1/2 top-0 h-20 w-44 -translate-x-1/2 rounded-t-2xl"
              style={{
                background: 'linear-gradient(180deg, #fde68a 0%, #fbbf24 60%, #f59e0b 100%)',
                boxShadow: 'inset 0 -6px 0 rgba(180,83,9,0.2)',
              }}
            />
            <div className="absolute left-1/2 top-[78px] flex -translate-x-1/2 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-5 rounded-b-full bg-white"
                  style={{ marginTop: `${(i % 3) * 2}px` }}
                />
              ))}
            </div>
            <div
              className="absolute left-1/2 top-[88px] h-20 w-56 -translate-x-1/2"
              style={{
                background: 'linear-gradient(180deg, #f9a8d4 0%, #ec4899 60%, #db2777 100%)',
                boxShadow: 'inset 0 -6px 0 rgba(157,23,77,0.2)',
              }}
            />
            <div className="absolute left-1/2 top-[166px] flex -translate-x-1/2 gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-5 rounded-b-full bg-white"
                  style={{ marginTop: `${(i % 3) * 2}px` }}
                />
              ))}
            </div>
            <div
              className="absolute left-1/2 top-[176px] h-20 w-72 -translate-x-1/2 rounded-b-2xl"
              style={{
                background: 'linear-gradient(180deg, #fda4af 0%, #fb7185 60%, #e11d48 100%)',
                boxShadow: 'inset 0 6px 0 rgba(159,18,57,0.2)',
              }}
            />
            <div className="absolute left-1/2 top-[248px] h-2 w-80 -translate-x-1/2 rounded-full bg-rose-200" />
          </div>
        </div>

        <AnimatePresence>
          {blown && (
            <motion.div
              className="mt-12 rounded-2xl bg-white/85 p-6 shadow-lg backdrop-blur"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <p className="text-lg text-rose-700 sm:text-xl font-sugar">
                {birthdayContent.cakeDoneMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/** SATU lilin besar dengan api yang bisa ditiup (klik) */
function Candle({ blown, onClick }: { blown: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative h-32 cursor-pointer sm:h-36"
      aria-label={blown ? 'Lilin sudah padam' : 'Tiup lilin ini'}
      style={{ width: '60px' }}
    >
      {/* Api — bigger flame untuk single candle */}
      <motion.div
        className="absolute left-1/2 top-0 h-10 w-5 -translate-x-1/2"
        animate={{
          opacity: blown ? 0 : 1,
          scale: blown ? 0.5 : 1,
          y: blown ? 12 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute inset-0 rounded-full blur-[3px]"
          style={{
            background: 'radial-gradient(circle, #fff 0%, #fde047 40%, #f97316 80%, transparent 100%)',
            boxShadow: '0 0 24px 8px rgba(251,191,36,0.7)',
          }}
        />
        <motion.div
          className="absolute inset-x-0 top-1 mx-auto h-7 w-3 rounded-full bg-orange-400"
          animate={{ scaleY: [1, 1.3, 1], scaleX: [1, 0.85, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      </motion.div>

      {/* Asap setelah ditiup */}
      {blown && (
        <motion.div
          className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-500"
          initial={{ opacity: 0.8, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -50, scale: 3 }}
          transition={{ duration: 1.8 }}
        />
      )}

      {/* Lilin — single, bigger */}
      <div
        className="absolute left-1/2 top-10 h-24 w-3 -translate-x-1/2 rounded-full transition-colors sm:h-28 sm:w-4"
        style={{
          background: blown
            ? 'linear-gradient(180deg, #fda4af 0%, #f9a8d4 100%)'
            : 'linear-gradient(180deg, #f472b6 0%, #ec4899 100%)',
          boxShadow: '0 0 12px 2px rgba(244,114,182,0.4)',
        }}
      />
    </button>
  )
}
