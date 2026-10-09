'use client'

import { motion } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'

/**
 * Section "Siapa Aku?" — dari slide 2 Materi Imi.
 * LAYOUT slide asli: ID card (kiri) + Polaroid foto (kanan) di atas gingham bg.
 * Foto asli: img10.webp (polaroid malam) + img12.webp (selfie cermin untuk ID card).
 */
export function SiapaAkuSection() {
  const { siapaAku, images } = birthdayContent

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden px-6 py-20"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `url(${images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <motion.p
            className="mb-2 text-xs uppercase tracking-[0.3em] text-rose-700/80 font-comic"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Kenalan Yuk
          </motion.p>
          <motion.h2
            className="text-4xl font-bold text-rose-700 sm:text-5xl font-canda"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {siapaAku.title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12">
          {/* ID CARD */}
          <motion.div
            className="relative mx-auto w-full max-w-sm"
            initial={{ opacity: 0, x: -30, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: -3 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
          >
            <div
              className="overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-pink-100 to-rose-200 p-5 shadow-2xl"
              style={{ boxShadow: '0 20px 50px rgba(190,24,93,0.25)' }}
            >
              <div className="mb-3 flex items-center justify-between border-b-2 border-dashed border-rose-300 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">ID-CARD</span>
                <span className="text-xs text-rose-400 font-comic">★</span>
              </div>

              <div className="mb-3 flex justify-center">
                <div className="relative h-40 w-32 overflow-hidden rounded-lg border-2 border-rose-300 shadow-inner sm:h-48 sm:w-36">
                  <img
                    src={images.niaSelfieCermin}
                    alt="Selfie Nia"
                    className="h-full w-full object-cover cursor-pointer"
                    loading="lazy"
                    data-lightbox
                  />
                </div>
              </div>

              <dl className="space-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="font-bold text-rose-600 font-comic">name:</dt>
                  <dd className="text-rose-800 font-canda">{siapaAku.name}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold text-rose-600 font-comic">date of birth:</dt>
                  <dd className="text-rose-800 font-comic">{siapaAku.birthday}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold text-rose-600 font-comic">skill:</dt>
                  <dd className="text-rose-800 font-comic">{siapaAku.traits.join(' & ')}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold text-rose-600 font-comic">ID-N:</dt>
                  <dd className="text-rose-800 font-comic">050100</dd>
                </div>
              </dl>
            </div>
          </motion.div>

          {/* POLAROID FOTO */}
          <motion.div
            className="relative mx-auto mt-12 w-full max-w-sm sm:mt-0"
            initial={{ opacity: 0, x: 30, rotate: 4 }}
            whileInView={{ opacity: 1, x: 0, rotate: 4 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
          >
            <div className="rounded-sm bg-white p-3 pb-12 shadow-2xl">
              <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                <img
                  src={images.niaPolaroidMalam}
                  alt="Polaroid foto Nia"
                  className="h-full w-full object-cover cursor-pointer"
                  loading="lazy"
                  data-lightbox
                />
              </div>
              <p className="mt-2 text-center font-comic text-xs text-rose-500">
                ~ malam yang indah ~
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 rounded-sm bg-rose-200/80 backdrop-blur" />
          </motion.div>
        </div>

        {siapaAku.intro && (
          <motion.p
            className="mx-auto mt-12 max-w-2xl text-center text-base italic leading-relaxed text-rose-700/80 sm:text-lg font-sugar"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {siapaAku.intro}
          </motion.p>
        )}
      </div>
    </section>
  )
}
