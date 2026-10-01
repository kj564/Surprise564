'use client';
import { motion } from 'framer-motion';

interface SpecialCardProps { embedUrl: string; }

export function SpecialCard({ embedUrl }: SpecialCardProps) {
  return (
    <section id="card" className="relative py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="flex justify-center mb-10">
          <div className="relative w-full max-w-2xl">
            <img src="/surprise/html/img9.webp" alt="Search bar" className="w-full h-auto drop-shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'var(--font-cursive), "Dancing Script", cursive' }}>
              <span className="text-black font-bold text-lg sm:text-2xl md:text-3xl">Kartu Ucapan</span>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, type: 'spring', bounce: 0.3 }} className="relative inline-block" style={{ transform: 'rotate(-1.5deg)' }}>
          <div className="shadow-2xl overflow-hidden" style={{ width: 'min(500px, 90vw)' }}>
            <iframe src={embedUrl} title="Kartu Ucapan Ulang Tahun" className="w-full block border-0" style={{ width: '100%', aspectRatio: '594 / 842', background: '#dcdee0' }} loading="lazy" allow="clipboard-write" />
          </div>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} className="text-black/70 text-sm sm:text-base italic mt-12 font-bold" style={{ fontFamily: 'Georgia, serif' }}>Semoga kartu ini bisa jadi kenang-kenangan untuk hari spesialmu 🎂</motion.p>
      </div>
    </section>
  );
}
