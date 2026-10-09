'use client';
import { motion } from 'framer-motion';

interface Trait { title: string; description: string; }
interface InMyEyesProps { traits: Trait[]; }

export function InMyEyes({ traits }: InMyEyesProps) {
  return (
    <section id="eyes" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="flex justify-center mb-12">
          <div className="relative w-full max-w-3xl">
            <img src="/surprise/html/img9.webp" alt="Search bar" className="w-full h-auto drop-shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'fnt4, Georgia, serif' }}><span className="text-black font-bold text-base sm:text-xl md:text-2xl">Di Mata Imi, Nia Itu...</span></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div initial={{ opacity: 0, x: -30, rotate: -2 }} whileInView={{ opacity: 1, x: 0, rotate: -1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }} className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md">
              <img src="/surprise/html/img24.webp" alt="Sticky note" className="w-full h-auto shadow-2xl" loading="lazy" />
              <div className="absolute overflow-hidden text-black" style={{ left: '5%', top: '17%', width: '90%', height: '70%', fontFamily: 'fnt6, "Comic Sans MS", cursive', color: '#000', fontSize: 'clamp(10px, 1.8vw, 18px)', lineHeight: '1.3' }}>
                <div className="space-y-1">
                  {traits.map((trait, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.2 }}>
                      <p><span className="font-bold text-black">•</span> <span className="font-bold text-black">{trait.title}</span> <span>{trait.description}</span></p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 right-8 w-16 sm:w-20 z-20 anim-float" aria-hidden style={{ animationDelay: '0.3s' }}><img src="/surprise/html/img28.webp" alt="" className="w-full drop-shadow-lg" /></div>
              <div className="absolute -bottom-4 -left-2 w-20 sm:w-24 z-20 anim-float" aria-hidden style={{ animationDelay: '0.8s' }}><img src="/surprise/html/img27.webp" alt="" className="w-full drop-shadow-lg" /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30, rotate: 3 }} whileInView={{ opacity: 1, x: 0, rotate: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md mt-12 lg:mt-20">
              <img src="/surprise/html/img25.webp" alt="Digital camera" className="w-full h-auto drop-shadow-2xl" loading="lazy" />
              <div className="absolute overflow-hidden border-2 border-gray-800" style={{ top: '23%', left: '9.6%', width: '34.5%', height: '36.5%' }}>
                <img src="/surprise/html/img26.webp" alt="Selfie couple di kamera" className="w-full h-full object-cover cursor-pointer" loading="lazy" data-lightbox />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
