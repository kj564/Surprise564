'use client';
import { motion } from 'framer-motion';

interface WishProps { text: string; signature: string; }

export function Wish({ text, signature }: WishProps) {
  const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);
  return (
    <section id="wish" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="flex justify-center mb-10">
          <div className="relative w-full max-w-2xl">
            <img src="/surprise/html/img9.webp" alt="Search bar" className="w-full h-auto drop-shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'fnt4, Georgia, serif' }}><span className="text-black font-bold text-lg sm:text-2xl md:text-3xl">Harapan dan Doa</span></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }} className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-2xl">
              <img src="/surprise/html/img14.webp" alt="Sticky note paper" className="w-full h-auto shadow-2xl block" loading="lazy" />
              <div className="absolute overflow-hidden text-black" style={{ left: '5%', top: '17%', width: '90%', height: '70%', fontFamily: 'fnt6, "Comic Sans MS", cursive', color: '#000', fontSize: 'clamp(10px, 1.8vw, 18px)', lineHeight: '1.3' }}>
                <div className="space-y-1">
                  {paragraphs.map((p, i) => (
                    <motion.p key={i} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.3, duration: 0.7 }} className={i === 0 ? 'first-letter:text-3xl first-letter:font-bold first-letter:text-red-700 first-letter:mr-1 first-letter:float-left first-letter:leading-none' : ''}>{p}</motion.p>
                  ))}
                  <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + paragraphs.length * 0.3 + 0.2 }} className="text-right mt-1">
                    <span className="inline-block font-bold" style={{ transform: 'rotate(-3deg)', transformOrigin: 'right center', fontSize: 'clamp(12px, 2.2vw, 18px)', color: '#b91c1c' }}>{signature} 💗</span>
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30, rotate: 3 }} whileInView={{ opacity: 1, x: 0, rotate: 2 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex justify-center lg:justify-end">
            <div className="bg-white shadow-2xl transition-transform duration-300 hover:scale-105 hover:rotate-1 cursor-pointer" style={{ padding: '12px 12px 50px 12px', maxWidth: '320px', width: '100%', transform: 'rotate(2deg)' }}>
              <img src="/surprise/html/img13.webp" alt="Foto couple di photo booth" className="w-full h-auto block" loading="lazy" data-lightbox />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
