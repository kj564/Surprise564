'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, ExternalLink, Image as ImageIcon, MonitorPlay } from 'lucide-react'
import { birthdayContent } from '@/lib/birthday-content'

/**
 * Surat ucapan asli dari Imi ke Nia.
 * Mengutamakan versi HTML iSpring dari folder HTML/Ucapan, sesuai checkpoint Perfect 2.
 * Preview gambar dan PDF asli tetap tersedia sebagai alternatif.
 */
export function LoveLetter() {
  const { images } = birthdayContent
  const [showImagePreview, setShowImagePreview] = useState(false)
  const originalCardUrl = '/Surprise564/HTML/Ucapan/'

  return (
    <section id="wish" className="relative w-full overflow-hidden px-4 py-20 sm:px-6">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `url(${images.ginghamMerahPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-rose-50/35" aria-hidden />

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-rose-700/80 font-comic">
            Surat Ucapan Asli
          </p>
          <h2 className="text-4xl font-bold text-rose-700 sm:text-5xl font-canda">
            Untuk {birthdayContent.partnerName}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-rose-800/85 font-sugar sm:text-base">
            Dibuka langsung dari kartu ucapan HTML asli—lengkap dengan pengalaman interaktifnya.
            Kalau tampilan interaktif tidak cocok di perangkatmu, versi gambar dan PDF tetap tersedia.
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-2xl"
          initial={{ opacity: 0, y: 35, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, type: 'spring', stiffness: 65, damping: 14 }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_24px_70px_rgba(136,19,55,0.2)] sm:p-4">
            {!showImagePreview ? (
              <div className="overflow-hidden rounded-xl border border-rose-100 bg-[#dcdee0]">
                <iframe
                  src={originalCardUrl}
                  title="Kartu ucapan ulang tahun asli untuk Nia"
                  className="block w-full border-0"
                  style={{ aspectRatio: '594 / 842', minHeight: '420px', maxHeight: '78vh' }}
                  loading="lazy"
                  allow="fullscreen"
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-rose-100 bg-white">
                <img
                  src="/Surprise564/surprise/ucapan_asli-1.webp"
                  alt="Preview gambar surat ucapan ulang tahun asli dari Imi untuk Nia"
                  className="mx-auto block h-auto max-h-[78vh] w-full object-contain"
                  loading="lazy"
                />
              </div>
            )}
            <p className="px-2 pt-4 text-center font-comic text-xs text-rose-500 sm:text-sm">
              ~ dengan sepenuh hati dari {birthdayContent.yourName} ~
            </p>
          </div>
          <div className="pointer-events-none absolute -top-2 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-rose-300/85 shadow-sm" aria-hidden />
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowImagePreview((value) => !value)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-5 py-3 text-sm font-bold text-rose-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            {showImagePreview ? <MonitorPlay className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
            {showImagePreview ? 'Kembali ke kartu interaktif' : 'Lihat versi gambar'}
          </button>
          <a
            href={originalCardUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-5 py-3 text-sm font-bold text-rose-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <ExternalLink className="h-4 w-4" />
            Buka kartu penuh
          </a>
          <a
            href="/Surprise564/surprise/Ucapan.pdf"
            download="Ucapan.pdf"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" />
            Download surat PDF
          </a>
        </div>
      </div>
    </section>
  )
}
