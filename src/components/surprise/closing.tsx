'use client';
import { motion } from 'framer-motion';

interface ClosingProps { signature: string; date: string; }

export function Closing({ signature, date }: ClosingProps) {
  return (
    <section id="tamat" className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, type: 'spring', bounce: 0.5 }} className="relative inline-block mb-10">
          <div className="relative w-[420px] sm:w-[560px] md:w-[640px] mx-auto anim-pulse-soft">
            <img src="/surprise/html/img29.webp" alt="" className="w-full drop-shadow-2xl relative z-10" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="text-7xl sm:text-8xl md:text-9xl font-bold" style={{ fontFamily: 'var(--font-handwritten), "Caveat", cursive', color: '#fef9c3', WebkitTextStroke: '2px #000', textShadow: '3px 3px 0 rgba(0,0,0,0.35)', transform: 'translateY(-16px)' }}>Tamat</span>
            </div>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -left-16 sm:-left-20 md:-left-24 w-24 sm:w-28 md:w-32 z-30 anim-float" aria-hidden style={{ animationDelay: '0.5s' }}><img src="/surprise/html/img30.webp" alt="" className="w-full drop-shadow-lg" /></div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-16 sm:-right-20 md:-right-24 w-24 sm:w-28 md:w-32 z-30 anim-float" aria-hidden style={{ animationDelay: '1s' }}><img src="/surprise/html/img31.webp" alt="" className="w-full drop-shadow-lg" /></div>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-black text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-6 bg-white/85 rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-yellow-400" style={{ fontFamily: 'Georgia, serif' }}>
          Terima kasih sudah jadi kamu — versi paling spesial yang pernah aku kenal. Selamat ulang tahun, Nia sayang. Semoga panjang umur, sehat selalu, dan bahagia sepanjang masa.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-black text-sm sm:text-base font-bold">✨ Made with ❤️ by {signature} ✨</motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.8 }} className="text-black/70 text-xs sm:text-sm mt-3 italic">{date}</motion.p>
      </div>
    </section>
  );
}
