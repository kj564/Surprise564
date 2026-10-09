'use client';
import { motion } from 'framer-motion';

interface TimelineMilestone { label: string; description: string; photo: string; secondPhoto?: string; photoAlt: string; emoji: string; patternFrame: string; }
interface TimelineProps { milestones: TimelineMilestone[]; }

export function Timeline({ milestones }: TimelineProps) {
  return (
    <section id="story" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="flex justify-center mb-10">
          <div className="relative w-full max-w-2xl">
            <img src="/surprise/html/img9.webp" alt="Search bar" className="w-full h-auto drop-shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'fnt4, Georgia, serif' }}><span className="text-black font-bold text-lg sm:text-2xl md:text-3xl">Hubungan Kita</span></div>
          </div>
        </motion.div>
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: i * 0.15 }} whileHover={{ scale: 1.08 }} className="flex flex-col items-center text-center cursor-pointer transition-transform duration-300">
              <div className="relative w-[260px] h-[260px] mb-2">
                <div className="absolute inset-0" style={{ backgroundImage: `url(${m.patternFrame})`, backgroundSize: 'cover', backgroundPosition: 'center', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                <div className="absolute overflow-hidden bg-white" style={{ top: '22px', left: '22px', right: '22px', bottom: '22px', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                  {m.secondPhoto ? (
                    <div className="flex w-full h-full"><img src={m.photo} alt={m.photoAlt} loading="lazy" data-lightbox className="w-1/2 h-full object-cover cursor-pointer" /><img src={m.secondPhoto} alt={`${m.photoAlt} 2`} loading="lazy" data-lightbox className="w-1/2 h-full object-cover cursor-pointer" /></div>
                  ) : <img src={m.photo} alt={m.photoAlt} loading="lazy" data-lightbox className="w-full h-full object-cover cursor-pointer" />}
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mt-1" style={{ fontFamily: 'var(--font-handwritten), "Caveat", cursive' }}>{m.label}</h3>
            </motion.div>
          ))}
        </div>
        <div className="md:hidden relative pl-6 space-y-8">
          <div className="absolute left-3 top-4 bottom-4 w-1 bg-yellow-400 rounded-full" aria-hidden />
          {milestones.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.1 }} className="relative">
              <div className="absolute -left-7 top-4 w-5 h-5 border-2 border-yellow-400 shadow" style={{ backgroundImage: `url(${m.patternFrame})`, backgroundSize: 'cover', transform: 'rotate(45deg)' }} aria-hidden />
              <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-yellow-300">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                    <div className="absolute inset-0" style={{ backgroundImage: `url(${m.patternFrame})`, backgroundSize: 'cover', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                    <div className="absolute overflow-hidden" style={{ top: '3px', left: '3px', right: '3px', bottom: '3px', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                      {m.secondPhoto ? <div className="flex w-full h-full"><img src={m.photo} alt={m.photoAlt} loading="lazy" data-lightbox className="w-1/2 h-full object-cover cursor-pointer" /><img src={m.secondPhoto} alt={`${m.photoAlt} 2`} loading="lazy" data-lightbox className="w-1/2 h-full object-cover cursor-pointer" /></div> : <img src={m.photo} alt={m.photoAlt} loading="lazy" data-lightbox className="w-full h-full object-cover cursor-pointer" />}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-black" style={{ fontFamily: 'var(--font-handwritten), "Caveat", cursive' }}>{m.label}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
