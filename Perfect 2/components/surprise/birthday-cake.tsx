'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// BIRTHDAY CAKE — Native React port dari repo smurf11k/bday-cake
// Pelajari source asli: index.html, style.css, script.js
// Implementasi 1:1 dengan animasi "baking" + 9 candles + blow logic + confetti
// ============================================================================

// --- SVG final-state paths (extracted dari <animate> values, state terakhir) ---
// Path 0: bottom layer (#a88679 — tan/brown)
const P0 = "M173.667,427.569c-49.795,0-101.101,0-147.334,0c-3.999,0-4-16.002,0-16.002 c46.385,0,97.539,0,147.334,0C177.668,411.567,177.667,427.569,173.667,427.569z";
// Path 1: bottom frosting drips (#8b6a60 — darker brown)
const P1 = "M102.242,427.569c5.348,0,14.079,0,17.462,0c0,0,17.026,0,27.504,0 c19.143,0,20.39-3.797,26.459,0c3,1.877,0,7.823,0,7.823c-2.412,2.258-58.328,0-73.667,0l0,0c-1.858,0-67.187,0-73.667,0 c0,0-4.125-4.983,0-7.823c5.201-3.58,16.085,0,23.725,0c8.841,0,20.762,0,20.762,0c3.686,0,8.597,0,19.511,0H102.242z";
// Path 2: middle layer (#a88679)
const P2 = "M173.667,451.394c-49.298,0-102.782,0-147.334,0c-3.999,0-4-16.002,0-16.002 c44.697,0,96.586,0,147.334,0C177.667,435.392,177.668,451.394,173.667,451.394z";
// Path 3: middle frosting drips (#8b6a60)
const P3 = "M173.667,451.394c2.875,0,2.997,9.257,0,9.131c-22.662-0.956-32.09-0.956-41.756-0.956 c-14.48,0-17.884,0-30.163,0c-2.087,0-2.068,0-3.915,0c-13.333,0-8.963,0-23.088,0c-11.668,0-34.99-0.294-48.412,1.831 c-4.109,0.65-3.01-10.006,0-10.006C37.129,451.394,149.379,451.394,173.667,451.394z";
// Path 4: top layer (#a88679)
const P4 = "M173.667,475.571c-46.512,0-105.486,0-147.334,0c-3.999,0-4-16.002,0-16.002c43.566,0,97.96,0,147.334,0 C177.667,459.569,177.666,475.571,173.667,475.571z";
// Path 5: cream frosting (#fefae9 — cream/white)
const P5 = "M111.547,415.233c-6.667-0.834-9.667,4.667-13.833,3.333c-19.649-6.291-8.158,22.176-14.5,22.334 c-6.667,0.166,2.833-18-13.333-22.167c-29.544-7.615-9.667,43.833-20.167,43.833c-10.333,0,8.004-55.006-16.833-39 c-7.5,4.833-9.508-3.78-9.299-7.004c0.799-12.329,23.592-7.153,38.132-7.329c10.234-0.124,20.238-1.505,38.287-2.167 c16.642-0.61,32.903,1.125,46.213,1.5c12.438,0.351,35.058-5.579,31.863,6.451c-5.532,20.833,1.25,28.216-4.409,27.883 c-7.606-0.447-6.058-37.895-20.62-23.333c-10.167,10.166-15.972-0.747-25,12C119.547,443.568,121.798,416.515,111.547,415.233z";

const CANDLE_COUNT = 9;
const FLAME_COUNT = 5;

export function BirthdayCake() {
  // State — sesuai script.js asli
  const [candlesVisible, setCandlesVisible] = useState(false);
  const [canBlow, setCanBlow] = useState(false);
  const [blown, setBlown] = useState(false);
  const [flameStates, setFlameStates] = useState<Array<'lit' | 'flickering' | 'extinguished'>>(
    Array(CANDLE_COUNT).fill('lit') as Array<'lit' | 'flickering' | 'extinguished'>
  );
  const [instructions, setInstructions] = useState('Make a wish and blow the candles!');
  const [showGif, setShowGif] = useState(false);
  const [confettiList, setConfettiList] = useState<Array<{
    id: number; left: number; color: string; width: number; height: number; delay: number; duration: number;
  }>>([]);

  // Show candles setelah delay (asli: tunggu crema animation end, di React kita pakai timeout ~4s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCandlesVisible(true);
      // Enable blow setelah candle-appear animations selesai (9 * 150ms + 400ms)
      setTimeout(() => setCanBlow(true), CANDLE_COUNT * 150 + 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Blow candles — persis dari script.js asli
  const blowCandles = () => {
    if (blown) return;
    setBlown(true);
    setCanBlow(false);

    // Flicker + extinguish per candle dengan delay (candleIndex * 50ms, lalu 400ms flicker)
    for (let i = 0; i < CANDLE_COUNT; i++) {
      setTimeout(() => {
        setFlameStates(prev => {
          const next = [...prev];
          next[i] = 'flickering';
          return next;
        });
        // Extinguish after 400ms flicker
        setTimeout(() => {
          setFlameStates(prev => {
            const next = [...prev];
            next[i] = 'extinguished';
            return next;
          });
        }, 400);
      }, i * 50);
    }

    // Confetti setelah semua candle padam (candles.length * 80 + 500)
    setTimeout(() => {
      const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#ff8800', '#ff0088', '#8800ff'];
      setConfettiList(Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 5 + Math.random() * 10,
        height: 5 + Math.random() * 10,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
      })));
      // Update instructions (candles.length * 80 + 300)
      setInstructions('Now your wish will come true!');
    }, CANDLE_COUNT * 80 + 500);

    // Show gif after confetti (3s)
    setTimeout(() => {
      setShowGif(true);
    }, CANDLE_COUNT * 80 + 500 + 3000);
  };

  // Relight
  const relight = () => {
    setBlown(false);
    setCanBlow(true);
    setShowGif(false);
    setConfettiList([]);
    setInstructions('Make a wish and blow the candles!');
    setFlameStates(Array(CANDLE_COUNT).fill('lit'));
  };

  return (
    <section id="cake" className="relative py-8 px-4 sm:px-6">
      {/* CSS — semua keyframes & styles dari style.css asli */}
      <style>{`
        @keyframes bc-candle-appear {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bc-fuego {
          0%, 100% {
            background: rgba(254, 248, 97, 0.5);
            box-shadow: 0 0 40px 10px rgba(248, 233, 209, 0.2);
            transform: translateY(0) scale(1);
          }
          50% {
            background: rgba(255, 50, 0, 0.1);
            box-shadow: 0 0 40px 20px rgba(248, 233, 209, 0.2);
            transform: translateY(-20px) scale(0);
          }
        }
        @keyframes bc-flicker {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.3; transform: scale(0.7); }
        }
        @keyframes bc-confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes bc-smoke {
          0% { opacity: 0.5; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
        }

        /* Candle styles — dari .velas di style.css */
        .bc-vela {
          background: #ffffff;
          border-radius: 10px;
          position: relative;
          width: 5px;
          height: 35px;
          backface-visibility: hidden;
          transform: translateZ(0);
          flex-shrink: 0;
        }
        .bc-vela::after, .bc-vela::before {
          background: rgba(255, 0, 0, 0.4);
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
        }
        .bc-vela::after { top: 25%; left: 0; }
        .bc-vela::before { top: 45%; left: 0; }

        /* Flame styles — dari .fuego di style.css */
        .bc-fuego {
          border-radius: 100%;
          position: absolute;
          top: -20px;
          left: 50%;
          margin-left: -2.6px;
          width: 6.66666667px;
          height: 18px;
          opacity: 1;
          transition: opacity 0.5s;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .bc-fuego:nth-child(1) { animation: bc-fuego 2s 1.5s infinite; }
        .bc-fuego:nth-child(2) { animation: bc-fuego 1.5s 1.5s infinite; }
        .bc-fuego:nth-child(3) { animation: bc-fuego 1s 1.5s infinite; }
        .bc-fuego:nth-child(4) { animation: bc-fuego 0.5s 1.5s infinite; }
        .bc-fuego:nth-child(5) { animation: bc-fuego 0.2s 1.5s infinite; }

        .bc-fuego.flickering {
          animation: bc-flicker 0.2s 2 alternate !important;
        }
        .bc-fuego.extinguished {
          opacity: 0;
          transform: scale(0);
          transition: all 0.1s ease-out;
        }

        /* Text — dari .text dan .instructions di style.css */
        .bc-text {
          color: #7f6158;
          font-weight: 300;
          font-style: italic;
          text-align: center;
        }
        .bc-text h1 {
          font-size: 2em;
          margin: 0;
        }
        .bc-instructions {
          color: #7f6158;
          text-align: center;
          margin-top: 20px;
          font-size: 1.6em;
          font-family: 'Caveat', cursive;
        }
      `}</style>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-800 mb-4"
          style={{ fontFamily: 'var(--font-handwritten), "Caveat", cursive' }}
        >
          🎂 Tiup Lilin & Buat Harapan 🎂
        </motion.h2>

        {/* Cake container — position: relative seperti .cake-container di aslinya */}
        <div style={{ position: 'relative', display: 'inline-block' }}>

          {/* Candles container — sesuai CSS: position absolute, top: 220px, left: 50%, width: 140px */}
          <div style={{
            position: 'absolute',
            top: '220px',
            left: '50%',
            width: '140px',
            height: '35px',
            display: 'flex',
            justifyContent: 'space-between',
            transform: 'translate(-50%, 0)',
            opacity: candlesVisible ? 1 : 0,
            willChange: 'transform',
            zIndex: 10,
          }}>
            {Array.from({ length: CANDLE_COUNT }).map((_, i) => (
              <div
                key={i}
                className="bc-vela"
                style={{
                  opacity: candlesVisible ? undefined : 0,
                  animation: candlesVisible ? `bc-candle-appear 0.4s ease-out forwards` : undefined,
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                {/* 5 Flames per candle — sesuai script.js: for (j = 0; j < 5; j++) */}
                {flameStates[i] === 'lit' && (
                  <>
                    <div className="bc-fuego" />
                    <div className="bc-fuego" />
                    <div className="bc-fuego" />
                    <div className="bc-fuego" />
                    <div className="bc-fuego" />
                  </>
                )}
                {flameStates[i] === 'flickering' && (
                  <>
                    <div className="bc-fuego flickering" />
                    <div className="bc-fuego flickering" />
                    <div className="bc-fuego flickering" />
                    <div className="bc-fuego flickering" />
                    <div className="bc-fuego flickering" />
                  </>
                )}
                {/* Smoke setelah extinguish */}
                {flameStates[i] === 'extinguished' && (
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '14px',
                    animation: 'bc-smoke 1.5s ease-out forwards',
                    pointerEvents: 'none',
                  }}>
                    💨
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Blow area — transparent overlay untuk click detection (seperti #blowArea di aslinya) */}
          {canBlow && !blown && (
            <div
              onClick={blowCandles}
              onTouchStart={blowCandles}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 15,
                background: 'transparent',
                cursor: 'pointer',
              }}
              aria-label="Click to blow candles"
            />
          )}

          {/* Cake SVG — final state paths (tidak pakai SMIL karena React tidak support) */}
          {/* margin: -10em auto 0 auto dari CSS asli, tapi di React kita pakai container */}
          <svg
            width="200px"
            height="500px"
            viewBox="0 0 200 500"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', position: 'relative', margin: '0 auto' }}
          >
            {/* 6 paths sesuai urutan asli, dengan fill colors */}
            <path fill="#a88679" d={P0} />
            <path fill="#8b6a60" d={P1} />
            <path fill="#a88679" d={P2} />
            <path fill="#8b6a60" d={P3} />
            <path fill="#a88679" d={P4} />
            <path fill="#fefae9" d={P5} />
            {/* Plate */}
            <rect x="10" y="475.571" fill="#fefae9" width="180" height="4" />
          </svg>

          {/* Happy Birthday text — dari .text class di aslinya */}
          <div className="bc-text" style={{ position: 'relative', marginTop: '-60px' }}>
            <h1 style={{ fontFamily: '"Caveat", cursive' }}>Happy Birthday!</h1>
          </div>

          {/* Instructions — dari .instructions class di aslinya */}
          <p className="bc-instructions" style={{ fontFamily: '"Caveat", cursive' }}>
            {instructions}
          </p>
        </div>

        {/* Blow button — jika candle visible & belum ditiup */}
        {candlesVisible && !blown && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={blowCandles}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-sm sm:text-base shadow-lg border-2 border-white anim-pulse-soft"
            style={{ fontFamily: 'Georgia, serif', marginTop: '20px', position: 'relative', zIndex: 20 }}
          >
            💨 Tiup Lilin
          </motion.button>
        )}

        {/* Relight button — setelah blow, sebelum gif */}
        {blown && !showGif && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={relight}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-white text-red-600 font-bold text-sm sm:text-base shadow-lg border-2 border-red-600"
            style={{ fontFamily: 'Georgia, serif', marginTop: '20px', position: 'relative', zIndex: 20 }}
          >
            🔥 Nyalakan Lagi
          </motion.button>
        )}

        {/* Cat gif — dari #gifContainer di aslinya, show setelah confetti selesai */}
        <AnimatePresence>
          {showGif && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
              style={{ textAlign: 'center', marginTop: '20px', position: 'relative', zIndex: 20 }}
            >
              <img
                src="/surprise/bday-cake/cat.gif"
                alt="Celebration cat"
                style={{
                  width: 'min(300px, 90vw)',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                }}
              />
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={relight}
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Nyalakan lilin lagi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti — 100 particles, persis dari createConfetti() di script.js */}
        {confettiList.length > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
            {confettiList.map(c => (
              <div
                key={c.id}
                style={{
                  position: 'absolute',
                  left: `${c.left}vw`,
                  top: '-10px',
                  width: `${c.width}px`,
                  height: `${c.height}px`,
                  backgroundColor: c.color,
                  opacity: 0,
                  animation: `bc-confetti-fall ${c.duration}s linear ${c.delay}s forwards`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
