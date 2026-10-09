'use client'

import { motion } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'
import { Search } from 'lucide-react'

/**
 * Section "Di Mata Imi, Nia Itu..." — dari slide 5 Materi Imi.
 *
 * PATTERN: SATU sticky note (kertas catatan img14) dengan SEMUA 3 traits
 * ALWAYS VISIBLE sebagai bullet points.
 *
 * Reference: Imi's Perfect 2 implementation uses ONE sticky note with all
 * text visible — no accordion, no 3-card grid.
 *
 * Plus elemen visual slide 5: kamera digital (img25) yang menampilkan
 * foto couple (img26) di layarnya.
 *
 * Search bar (img6 equivalent) sebagai decorative focal point — dari buku
 * Krug "Billboard Design" + Refactoring UI "Hierarchy".
 */
export function TraitsSection() {
  const traits = birthdayContent.traits
  const { images } = birthdayContent

  return (
    <section
      id="eyes"
      className="relative w-full overflow-hidden px-6 py-20"
    >
      {/* Background gingham merah-putih (img0.webp) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `url(${images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="mx-auto max-w-3xl">
        {/* Search bar decorative — Billboard Design 101 (Krug) */}
        <div className="mb-8 flex justify-center">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border-3 border-amber-400 bg-lime-200 px-5 py-2 shadow-md"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ borderWidth: '3px' }}
          >
            <Search className="h-5 w-5 text-amber-600" strokeWidth={2.5} />
            <span className="font-bold text-sm text-gray-800 font-sugar">
              Di Mata Imi, {birthdayContent.partnerName} Itu...
            </span>
          </motion.div>
        </div>

        {/* SATU sticky note — kertas catatan dengan SEMUA 3 traits visible */}
        <motion.div
          className="relative mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          whileHover={{ rotate: 0, scale: 1.01 }}
        >
          <div
            className="relative overflow-hidden rounded-lg p-8 shadow-2xl sm:p-10"
            style={{
              backgroundImage: `url(${images.kertasCatatan})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Paper clip di pojok atas */}
            <div className="absolute -top-2 left-1/2 h-6 w-16 -translate-x-1/2 rotate-3 rounded-sm bg-rose-300/80 backdrop-blur shadow-sm" />

            {/* 3 traits sebagai bullet points — ALWAYS VISIBLE */}
            <div className="space-y-6">
              {traits.map((trait, i) => (
                <motion.div
                  key={trait.title}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                >
                  {/* Number badge */}
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white shadow">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-rose-800 font-canda sm:text-xl">
                      {trait.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-rose-900/80 font-sugar sm:text-base">
                      {trait.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Kamera digital dengan foto couple di layarnya — elemen slide 5 */}
        <motion.div
          className="relative mx-auto mt-12 w-full max-w-sm"
          initial={{ opacity: 0, y: 30, rotate: 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 3 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          whileHover={{ rotate: 0, scale: 1.03 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-3 shadow-2xl">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-4 border-gray-700 bg-black">
              <img
                src={images.couplePhotobooth}
                alt="Foto di layar kamera"
                className="h-full w-full object-cover cursor-pointer"
                loading="lazy"
                data-lightbox
              />
              <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-amber-300/80 blur-[2px]" />
              <div className="absolute right-4 top-4 text-[10px] font-bold text-white/80">
                REC ●
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-rose-300">
              ♥ Imi Cam ♥
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
