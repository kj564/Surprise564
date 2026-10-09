'use client'

import { motion } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'

/**
 * Section "Hubungan Kita" — dari slide 4 Materi Imi.
 * LAYOUT slide 4: 4 kartu milestone dengan colored gingham backgrounds + foto asli.
 */
export function TimelineSection() {
  const items = birthdayContent.timeline

  return (
    <section
      id="story"
      className="relative w-full px-6 py-20"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `url(${birthdayContent.images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <motion.p
            className="mb-2 text-xs uppercase tracking-[0.3em] text-rose-700/80 font-comic"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Perjalanan Kita
          </motion.p>
          <motion.h2
            className="text-4xl font-bold text-rose-700 sm:text-5xl font-canda"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hubungan Kita
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.milestone}
              className="group relative overflow-hidden rounded-xl border-4 border-white shadow-xl" data-animate
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, type: 'spring', stiffness: 120 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${item.bg})`,
                  backgroundSize: '150px',
                  backgroundRepeat: 'repeat',
                }}
                aria-hidden
              />

              <div className="relative p-3">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border-2 border-white shadow-md">
                  <img
                    src={item.photo}
                    alt={`Foto ${item.milestone}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                    loading="lazy"
                    data-lightbox
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rose-900/80 to-transparent p-2">
                    <p className="text-center text-sm font-bold text-white font-canda">
                      {item.emoji} {item.milestone}
                    </p>
                  </div>
                </div>

                {item.note && (
                  <p className="mt-3 px-1 text-center text-[11px] leading-snug text-rose-700 font-sugar">
                    {item.note}
                  </p>
                )}
              </div>

              <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white shadow">
                {i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
