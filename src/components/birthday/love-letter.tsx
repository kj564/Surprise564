'use client'

import { motion } from 'framer-motion'
import { birthdayContent } from '@/lib/birthday-content'
import { Download } from 'lucide-react'

/**
 * Surat ucapan asli dari Imi ke Nia.
 * Yang ditampilkan adalah FILE ASLI Ucapan.pdf yang di-render sebagai PNG (1700x2200),
 * BUKAN teks yang aku extract & restyle sendiri. Setiap pixel design Imi preserved 100%.
 *
 * Display: polaroid framed card di atas gingham merah-putih background.
 * Plus tombol download PDF asli biar Nia bisa simpan sebagai kenangan.
 */
export function LoveLetter() {
  const { images } = birthdayContent

  return (
    <section
      id="wish"
      className="relative w-full overflow-hidden px-6 py-20"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `url(${images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="mb-2 text-xs uppercase tracking-[0.3em] text-rose-700/80 font-comic"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Surat Ucapan Asli
          </motion.p>
          <motion.h2
            className="text-4xl font-bold text-rose-700 sm:text-5xl font-canda"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Untuk {birthdayContent.partnerName}
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-md text-sm text-rose-700/80 font-sugar"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Ini surat asli yang Imi tulis untuk kamu. Setiap kata, font, dan
            elemen — semua persis seperti yang Imi design dari hati.
          </motion.p>
        </motion.div>

        {/* Polaroid framed card berisi PNG asli Ucapan.pdf */}
        <motion.div
          className="relative mx-auto w-full max-w-2xl"
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 60, damping: 14 }}
          whileHover={{ rotate: 0, scale: 1.01 }}
        >
          <div className="rounded-sm bg-white p-3 pb-6 shadow-2xl sm:p-5 sm:pb-8">
            <div className="relative overflow-hidden rounded-sm shadow-md">
              <img
                src="/surprise/ucapan_asli-1.webp"
                alt="Surat ucapan ulang tahun asli dari Imi untuk Nia"
                className="block h-auto w-full"
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-center font-comic text-xs text-rose-500 sm:text-sm">
              ~ dengan sepenuh hati dari {birthdayContent.yourName} ~
            </p>
          </div>

          <div className="absolute -top-2 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-rose-300/80 backdrop-blur shadow-sm" />
          <motion.div
            className="absolute -right-2 -top-1 h-10 w-3 rotate-12 rounded-sm bg-rose-400 shadow-md"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            aria-hidden
          />
        </motion.div>

        {/* Download original PDF button */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="/surprise/Ucapan.pdf"
            download="Ucapan.pdf"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <Download className="h-4 w-4" />
            Download Surat Asli (PDF)
          </a>
        </motion.div>
      </div>
    </section>
  )
}
