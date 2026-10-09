'use client';
import { motion } from 'framer-motion';

interface AboutProps { name: string; birthDate: string; skill: string; }

export function About({ name, birthDate, skill }: AboutProps) {
  return (
    <section id="about" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="flex justify-center mb-10">
          <div className="relative w-full max-w-2xl">
            <img src="/surprise/html/img9.webp" alt="Search bar" className="w-full h-auto drop-shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'fnt4, Georgia, serif' }}><span className="text-black font-bold text-lg sm:text-2xl md:text-3xl">Siapa Aku?</span></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }} className="flex justify-center">
            <div className="relative w-full max-w-md">
              <img src="/surprise/html/img11.webp" alt="Pink ID Card" className="w-full h-auto shadow-2xl block" loading="lazy" />
              <div className="absolute" style={{ top: '20%', left: '57.5%', width: '37%' }}>
                <img src="/surprise/html/img12.webp" alt="Selfie mirror Nia" className="w-full h-auto shadow-lg anim-pop-in cursor-pointer" loading="lazy" data-lightbox />
              </div>
              <div className="absolute" style={{ left: '18.7%', top: '36.4%', width: '31.3%', color: '#f9f6f5', fontFamily: 'fnt5, "Comic Sans MS", cursive', fontSize: 'clamp(9px, 1.8vw, 14px)', fontWeight: 700, lineHeight: '1.2', textShadow: '0 1px 2px rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>{name}</div>
              <div className="absolute" style={{ left: '27.5%', top: '47.2%', width: '22.5%', color: '#f9f6f5', fontFamily: 'fnt5, "Comic Sans MS", cursive', fontSize: 'clamp(9px, 1.8vw, 14px)', fontWeight: 700, lineHeight: '1.2', textShadow: '0 1px 2px rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>{birthDate}</div>
              <div className="absolute" style={{ left: '16.4%', top: '58%', width: '37.1%', color: '#f9f6f5', fontFamily: 'fnt5, "Comic Sans MS", cursive', fontSize: 'clamp(9px, 1.8vw, 14px)', fontWeight: 700, lineHeight: '1.2', textShadow: '0 1px 2px rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>{skill}</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center">
            <div className="bg-white shadow-2xl transition-transform duration-300 hover:scale-105 hover:-rotate-1 cursor-pointer" style={{ padding: '12px 12px 50px 12px', maxWidth: '400px', width: '100%' }}>
              <img src="/surprise/html/img10.webp" alt="Foto Nia outdoor" className="w-full h-auto block" loading="lazy" data-lightbox />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
