'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Hero } from '@/components/surprise/hero';
import { About } from '@/components/surprise/about';
import { Timeline } from '@/components/surprise/timeline';
import { InMyEyes } from '@/components/surprise/in-my-eyes';
import { Wish } from '@/components/surprise/wish';
import { SpecialCard } from '@/components/surprise/special-card';
import { Closing } from '@/components/surprise/closing';
import { NavBar } from '@/components/surprise/nav-bar';
import { LoadingScreen } from '@/components/surprise/loading-screen';
import { Confetti } from '@/components/surprise/confetti';
import { MusicPlayer } from '@/components/surprise/music-player';
import { ScrollProgress } from '@/components/surprise/scroll-progress';
import { BackToTop } from '@/components/surprise/back-to-top';
import { FloatingHearts } from '@/components/surprise/floating-hearts';
import { PhotoLightbox } from '@/components/surprise/photo-lightbox';
import { SparkleTrail } from '@/components/surprise/sparkle-trail';
import { useScrollAnimation } from '@/components/surprise/use-scroll-animation';

const NAME = 'Aulia Rizky Ramadhaniati';
const NICKNAME = 'Nia';
const AGE = 19;
const BIRTH_DATE = '08 Oktober 2007';
const SIGNATURE = 'Imi';
const SKILL = 'Marah dan Bermalas-malasan';
const ID_NUMBER = '050100';

const TIMELINE_MILESTONES = [
  { label: 'XD Class', description: 'Awal pertemuan kita, di kelas yang sama.', photo: '/surprise/html/img19.webp', photoAlt: 'XD Class', emoji: '🏫', patternFrame: '/surprise/html/img15.webp' },
  { label: 'First Date', description: 'Hari pertama yang akhirnya resmi berdua.', photo: '/surprise/html/img20.webp', photoAlt: 'First Date', emoji: '💑', patternFrame: '/surprise/html/img16.webp' },
  { label: 'Graduation', description: 'Hari kelulusan yang jadi saksi.', photo: '/surprise/html/img21.webp', photoAlt: 'Graduation', emoji: '🎓', patternFrame: '/surprise/html/img17.webp' },
  { label: 'LDR', description: 'Jarak memisahkan tubuh, tapi bukan hati.', photo: '/surprise/html/img22.webp', secondPhoto: '/surprise/html/img23.webp', photoAlt: 'LDR', emoji: '🌐', patternFrame: '/surprise/html/img18.webp' },
];

const TRAITS = [
  { title: 'Wanita Kuat:', description: 'Selama 19 tahun ini Nia hebat banget sudah berjuang melewati banyak jatuh bangun kehidupan nia.' },
  { title: 'Cewe Pintar dan Dewasa:', description: 'Nia itu orangnya pintar banget dan dewasa tauu, walaupun pemalass sihhh.... awokawok' },
  { title: 'Orangnya Ternyata Lucu:', description: 'Di balik sisi tangguh dan dewasanya, Nia selalu punya cara tersendiri yang selalu bikin imi kegemasshhhann dan senanggg.' },
];

const WISH_TEXT = `Selamat ulang tahun yang ke-19, Nia sayang. Imi berharap di usia baru ini semua cita-cita Nia bisa tergapai, dan Nia diberikan kemudahan serta kesehatan untuk beradaptasi dengan padatnya dunia perkuliahan.

Nia adalah wanita kuat yang hebat, tapi ingat ya, Nia gak harus menghadapi semuanya sendiri karena imi selalu siap jadi sahabat, kakak, maupun adik yang selalu ada untuk membantu Nia.

Imi berdoa semoga hubungan LDR kita selalu dilancarkan, harapan kita untuk bertemu di libur akhir tahun nanti bisa terwujud, dan semoga kita bisa terus saling melengkapi, saling membantu, serta bersama selamanya.`;

const NAV_LINKS = [
  { id: 'hero', label: 'Home' }, { id: 'about', label: 'About' }, { id: 'story', label: 'Story' },
  { id: 'eyes', label: 'In My Eyes' }, { id: 'wish', label: 'Wish' }, { id: 'card', label: 'Card' },
];

const LIGHTBOX_IMAGES = [
  { src: '/surprise/html/img10.webp', alt: 'Foto Nia outdoor' },
  { src: '/surprise/html/img12.webp', alt: 'Selfie mirror Nia' },
  { src: '/surprise/html/img19.webp', alt: 'XD Class' },
  { src: '/surprise/html/img20.webp', alt: 'First Date' },
  { src: '/surprise/html/img21.webp', alt: 'Graduation' },
  { src: '/surprise/html/img13.webp', alt: 'Foto couple di photo booth' },
  { src: '/surprise/html/img26.webp', alt: 'Selfie couple di kamera' },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  useScrollAnimation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (started) document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [started]);

  const handleOpen = useCallback(() => {
    setStarted(true);
    setConfettiTrigger(true);
    window.dispatchEvent(new Event('startMusic'));
    setTimeout(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fixed background using img0.webp */}
      <div className="fixed inset-0 z-0" style={{ backgroundImage: 'url(/surprise/html/img0.webp)', backgroundRepeat: 'repeat', backgroundSize: 'auto', backgroundPosition: '0 0' }} aria-hidden />

      <Confetti trigger={confettiTrigger} />
      <ScrollProgress />
      <MusicPlayer />
      <BackToTop />
      <FloatingHearts />
      <SparkleTrail />
      <PhotoLightbox images={LIGHTBOX_IMAGES} />
      <LoadingScreen />
      <NavBar links={NAV_LINKS} />

      <main className="flex-1 relative z-10">
        <Hero name={NAME} age={AGE} birthDate={BIRTH_DATE} onOpen={handleOpen} locked={!started} />
        <About name={NAME} birthDate={BIRTH_DATE} skill={SKILL} />
        <Timeline milestones={TIMELINE_MILESTONES} />
        <InMyEyes traits={TRAITS} />
        <Wish text={WISH_TEXT} signature={SIGNATURE} />
        <SpecialCard embedUrl="/surprise/ucapan-embed/index.html" />
        <Closing signature={SIGNATURE} date={`Dibuat dengan cinta • ${dateStr}`} />
      </main>

      <footer className="bg-red-900 text-amber-50 py-6 px-4 text-center text-xs sm:text-sm border-t-4 border-yellow-400 relative z-10">
        <p>🎂 Web spesial untuk <span className="font-bold text-yellow-300">Aulia Rizky Ramadhaniati</span> 🎂</p>
        <p className="mt-1 text-amber-200/70">Happy 19th Birthday • Made with love</p>
      </footer>
    </div>
  );
}
