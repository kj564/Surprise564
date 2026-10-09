'use client';
import { motion } from 'framer-motion';

interface HeroProps { name: string; age: number; birthDate: string; onOpen: () => void; locked: boolean; }

export function Hero({ name, age, birthDate, onOpen, locked }: HeroProps) {
  return (
    <section id="hero" className="relative h-screen min-h-screen flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-80 pointer-events-none" style={{ backgroundImage: 'url(/surprise/html/img1.webp)', backgroundSize: '70%' }} aria-hidden />
      {/* Stickers */}
      <div className="absolute top-[5%] left-[3%] w-[12%] max-w-[100px] z-10 anim-float transition-transform duration-300 hover:scale-125 hover:rotate-12 cursor-pointer" aria-hidden style={{ animationDelay: '0s' }}><img src="/surprise/html/img2.webp" alt="" className="w-full drop-shadow-lg" /></div>
      <div className="absolute bottom-[8%] right-[3%] w-[11%] max-w-[90px] z-10 anim-float transition-transform duration-300 hover:scale-125 hover:-rotate-12 cursor-pointer" aria-hidden style={{ animationDelay: '0.5s' }}><img src="/surprise/html/img3.webp" alt="" className="w-full drop-shadow-lg" /></div>
      <div className="absolute bottom-[6%] left-[5%] w-[10%] max-w-[80px] z-10 anim-float transition-transform duration-300 hover:scale-125 hover:rotate-12 cursor-pointer" aria-hidden style={{ animationDelay: '1s' }}><img src="/surprise/html/img4.webp" alt="" className="w-full drop-shadow-lg" /></div>
      <div className="absolute top-[2%] right-[4%] w-[10%] max-w-[90px] z-10 anim-float transition-transform duration-300 hover:scale-125 hover:-rotate-12 cursor-pointer" aria-hidden style={{ animationDelay: '1.5s' }}><img src="/surprise/html/img5.webp" alt="" className="w-full drop-shadow-lg" /></div>

      <div className="relative z-20 text-center mx-auto flex flex-col items-center justify-center h-full max-h-full max-w-2xl px-2 py-2">
        <motion.div initial={{ opacity: 0, scale: 0.7, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, type: 'spring', bounce: 0.4 }} className="w-full max-w-[220px] sm:max-w-[320px] lg:max-w-[400px]" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
          <img src="/surprise/html/img7.webp" alt="HAPPY BIRTHDAY" className="w-full h-auto" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="relative w-full max-w-[220px] sm:max-w-sm lg:max-w-md mt-3 sm:mt-4" style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))' }}>
          <img src="/surprise/html/img6.webp" alt="Search bar" className="w-full h-auto" />
          <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'cursive, "Segoe Script", "Comic Sans MS"' }}>
            <span className="text-black font-bold text-[9px] sm:text-sm lg:text-base px-[10%] text-center truncate drop-shadow-sm">{name}</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="mt-3 sm:mt-4">
          <p className="inline-block bg-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-black font-bold text-[10px] sm:text-sm lg:text-base border-2 border-red-600" style={{ fontFamily: 'Georgia, serif', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>🎂 {birthDate} · Turning {age} 🎂</p>
        </motion.div>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} onClick={onOpen} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="mt-3 sm:mt-4 relative z-30 inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-sm sm:text-base lg:text-lg border-4 border-white anim-pulse-soft" style={{ fontFamily: 'Georgia, serif', pointerEvents: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.35)' }}>
          <span>Open My Gift</span><span className="text-base sm:text-lg">🎁</span>
        </motion.button>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.5 }} className="mt-2 sm:mt-3 relative z-30">
          {locked ? (
            <span className="inline-block bg-white px-3 py-1 rounded-full text-black font-bold text-[9px] sm:text-xs shadow-md animate-pulse" style={{ fontFamily: 'Georgia, serif' }}>👆 Klik tombol di atas untuk membuka kejutan</span>
          ) : (
            <span className="inline-block bg-white px-3 py-1 rounded-full text-red-700 font-bold text-[9px] sm:text-xs shadow-md" style={{ fontFamily: 'Georgia, serif' }}>Selamat menikmati kejutanmu, Nia 💕</span>
          )}
        </motion.div>
      </div>
    </section>
  );
}
