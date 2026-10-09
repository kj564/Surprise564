'use client'

import { motion } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'

/**
 * Footer — dari slide 6 Materi Imi ("Tamat").
 * Pakai apel besar (img29) di tengah + bunga hijau (img30) di kiri + bintang kuning (img31) di kanan.
 * Background gingham merah-putih.
 */
export function Footer() {
  const { images } = birthdayContent

  return (
    <footer
      id="card"
      className="relative overflow-hidden px-6 py-20 text-center text-rose-700"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `url(${images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <motion.div
        className="mx-auto flex max-w-md flex-col items-center gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <motion.img
            src={images.bungaHijau}
            alt="Dekorasi bunga"
            className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            initial={{ rotate: -30, opacity: 0 }}
            whileInView={{ rotate: -15, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            whileHover={{ rotate: 0, scale: 1.2 }}
            aria-hidden
          />

          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <img
              src={images.apelTamat}
              alt="Tamat"
              className="h-28 w-28 object-contain drop-shadow-xl sm:h-36 sm:w-36"
              aria-hidden
            />
          </motion.div>

          <motion.img
            src={images.bintangKuning}
            alt="Dekorasi bintang"
            className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            initial={{ rotate: 30, opacity: 0 }}
            whileInView={{ rotate: 15, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            whileHover={{ rotate: 0, scale: 1.2 }}
            aria-hidden
          />
        </div>

        <motion.div
          className="rounded-full bg-white/80 px-6 py-3 shadow-lg backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          data-animate
        >
          <p className="text-base font-canda">
            {birthdayContent.yourName} ♥ {birthdayContent.partnerName}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-rose-600/60">
            {birthdayContent.birthdayDate}
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}
