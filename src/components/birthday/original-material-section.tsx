'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, ChevronDown, ExternalLink, Maximize2, X } from 'lucide-react'

const materialUrl = '/Surprise564/HTML/Materi/'

/**
 * Keeps the original iSpring presentation accessible beside the redesigned,
 * native sections. The preview is collapsed by default to keep page loading light.
 */
export function OriginalMaterialSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="materi-asli" className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(251,207,232,0.55),_transparent_55%),linear-gradient(135deg,#fff7fb,#fff1f2_55%,#fff7ed)]"
      />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <span className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-rose-700 shadow-sm">
            <BookOpen className="h-4 w-4" />
            Arsip kenangan
          </span>
          <h2 className="font-canda text-3xl font-bold tracking-tight text-rose-800 sm:text-4xl md:text-5xl">
            Versi Presentasi Asli
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-rose-900/75 sm:text-base">
            Mau melihat lagi materi yang menjadi dasar website ini? Presentasi iSpring dari folder HTML/Materi tetap bisa dibuka di sini, tanpa menghilangkan versi website yang sudah diperbarui.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-8 max-w-3xl rounded-3xl border border-white/90 bg-white/75 p-4 shadow-[0_24px_80px_rgba(136,19,55,0.12)] backdrop-blur sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-canda text-xl font-bold text-rose-800">Materi ulang tahun Nia</h3>
                <p className="mt-1 text-sm text-rose-800/65">6 slide · versi interaktif asli</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={materialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-800 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <ExternalLink className="h-4 w-4" />
                Buka penuh
              </a>
              <button
                type="button"
                onClick={() => setIsOpen((value) => !value)}
                aria-expanded={isOpen}
                aria-controls="original-material-preview"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              >
                {isOpen ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {isOpen ? 'Tutup preview' : 'Lihat di sini'}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id="original-material-preview"
                key="original-material-preview"
                initial={{ height: 0, opacity: 0, y: -8 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-5 overflow-hidden rounded-2xl border border-rose-100 bg-[#f4f0f1] shadow-inner">
                  <iframe
                    src={materialUrl}
                    title="Presentasi ulang tahun Nia versi asli"
                    className="block w-full border-0"
                    style={{ height: 'min(72vh, 720px)', minHeight: '420px' }}
                    loading="lazy"
                    allow="fullscreen"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-rose-700/65">
                  <p>Jika preview kurang nyaman di layar kecil, buka versi penuh.</p>
                  <a
                    href={materialUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Buka presentasi asli di tab baru"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-2 font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Layar penuh
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
