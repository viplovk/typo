import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { splitTextIntoCharacters } from '../utils/kineticMath';
import { soundEngine } from '../utils/audioSynth';
import { ArrowDownRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWordHover, setActiveWordHover] = useState<string | null>(null);

  // Scroll parallax for words
  const { scrollY } = useScroll();
  const yWord1 = useTransform(scrollY, [0, 800], [0, -140]);
  const yWord2 = useTransform(scrollY, [0, 800], [0, 80]);
  const yWord3 = useTransform(scrollY, [0, 800], [0, -60]);

  // Motion values for smooth hardware-accelerated 3D parallax without React re-renders
  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);
  const smoothX = useSpring(mouseNormX, { damping: 35, stiffness: 220 });
  const smoothY = useSpring(mouseNormY, { damping: 35, stiffness: 220 });
  const rotX = useTransform(smoothY, [-1, 1], [6, -6]);
  const rotY = useTransform(smoothX, [-1, 1], [-6, 6]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1440;
      const h = window.innerHeight || 900;
      mouseNormX.set((e.clientX / w) * 2 - 1);
      mouseNormY.set((e.clientY / h) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseNormX, mouseNormY]);

  const word1Chars = splitTextIntoCharacters('MOVE.');
  const word2Chars = splitTextIntoCharacters('BEYOND.');
  const word3Chars = splitTextIntoCharacters('ORDINARY.');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 lg:px-12 overflow-hidden bg-black select-none"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Avant-Garde Swiss Metadata Header Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs font-space tracking-widest uppercase text-white/50 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[#CCFF00]">VOL. 01</span>
          <span>·</span>
          <span>EXPERIMENTAL KINETIC ENGINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>LAT: 47.3769° N</span>
          <span>LONG: 8.5417° E</span>
          <span>ZURICH / SWITZERLAND</span>
        </div>
        <div className="flex items-center gap-2 text-[#CCFF00]">
          <span className="inline-block w-1.5 h-1.5 bg-[#CCFF00]"></span>
          <span>KINETIC STATUS: LIVE</span>
        </div>
      </div>

      {/* Main Kinetic Typography Grid */}
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-20 my-auto py-8 flex flex-col justify-center"
      >
        {/* WORD 1: MOVE. */}
        <motion.div
          style={{ y: yWord1 }}
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative overflow-visible"
        >
          <div
            data-cursor="interactive"
            data-cursor-text="EXPAND"
            onMouseEnter={() => {
              setActiveWordHover('MOVE');
              soundEngine.playChirp(440, 0.06);
            }}
            onMouseLeave={() => setActiveWordHover(null)}
            className="flex items-baseline flex-nowrap whitespace-nowrap font-anton uppercase text-[clamp(3rem,12vw,11.5rem)] leading-[0.85] tracking-tight text-white hover:tracking-widest transition-all duration-500 cursor-pointer"
          >
            {word1Chars.map((item, idx) => (
              <motion.span
                key={idx}
                whileHover={{
                  y: -12,
                  scale: 1.08,
                  color: '#CCFF00',
                  transition: { duration: 0.15 },
                }}
                onMouseEnter={() => soundEngine.playClick(600 + idx * 80)}
                className="inline-block transition-transform duration-200 origin-bottom"
              >
                {item.char}
              </motion.span>
            ))}
            <span className="ml-4 hidden lg:inline-block text-xs font-space font-normal tracking-widest text-[#CCFF00] align-top mt-4">
              [DIR: LEFT // ACCEL: 1.4]
            </span>
          </div>
        </motion.div>

        {/* WORD 2: BEYOND. */}
        <motion.div
          style={{ y: yWord2 }}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative lg:pl-16 py-1 overflow-visible"
        >
          <div
            data-cursor="interactive"
            data-cursor-text="SHEAR"
            onMouseEnter={() => {
              setActiveWordHover('BEYOND');
              soundEngine.playChirp(660, 0.08);
            }}
            onMouseLeave={() => setActiveWordHover(null)}
            className="flex items-baseline flex-nowrap whitespace-nowrap font-syne font-extrabold uppercase text-[clamp(2.8rem,10.5vw,9.5rem)] leading-[0.88] tracking-tighter text-white hover:text-[#CCFF00] transition-colors duration-300 cursor-pointer"
          >
            {word2Chars.map((item, idx) => (
              <motion.span
                key={idx}
                whileHover={{
                  skewX: -18,
                  scaleY: 1.15,
                  transition: { duration: 0.15 },
                }}
                onMouseEnter={() => soundEngine.playClick(800 + idx * 60)}
                className="inline-block transition-transform duration-200"
              >
                {item.char}
              </motion.span>
            ))}
            <span className="ml-4 hidden lg:inline-block text-xs font-space font-normal tracking-widest text-white/40 align-top mt-4">
              [SHEAR: -18° // TENSION]
            </span>
          </div>
        </motion.div>

        {/* WORD 3: ORDINARY. */}
        <motion.div
          style={{ y: yWord3 }}
          initial={{ x: '120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative lg:self-end overflow-visible"
        >
          <div
            data-cursor="interactive"
            data-cursor-text="INVERT"
            onMouseEnter={() => {
              setActiveWordHover('ORDINARY');
              soundEngine.playChirp(880, 0.08);
            }}
            onMouseLeave={() => setActiveWordHover(null)}
            className="flex items-baseline flex-nowrap whitespace-nowrap font-bebas uppercase text-[clamp(3.2rem,13vw,12rem)] leading-[0.82] tracking-normal text-stroke-white hover:text-white transition-all duration-300 cursor-pointer"
          >
            {word3Chars.map((item, idx) => (
              <motion.span
                key={idx}
                whileHover={{
                  scaleX: 1.25,
                  scaleY: 0.95,
                  rotate: (idx % 2 === 0 ? 4 : -4),
                  transition: { duration: 0.15 },
                }}
                onMouseEnter={() => soundEngine.playClick(1000 + idx * 50)}
                className="inline-block transition-transform duration-200"
              >
                {item.char}
              </motion.span>
            ))}
            <span className="ml-4 hidden lg:inline-block text-xs font-space font-normal tracking-widest text-[#CCFF00] align-top mt-4">
              [DIR: RIGHT // STROKE: 1.5PX]
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Strip of Hero with Interaction Hints */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-6 border-t border-white/10 text-xs font-space">
        <div className="max-w-md text-white/60 leading-relaxed">
          <p className="text-white font-medium mb-1">
            Typography is not a vessel for words.
          </p>
          <p>
            It is an autonomous structural medium. Move cursor to displace spatial planes.
            Scroll to trigger kinetic tension.
          </p>
        </div>

        <div className="flex items-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <span className="text-white/40">HOVER STATE:</span>
            <span className="font-semibold text-[#CCFF00]">
              {activeWordHover || 'IDLE'}
            </span>
          </div>

          <a
            href="#intro"
            onClick={() => soundEngine.playThump()}
            className="flex items-center gap-2 text-white hover:text-[#CCFF00] transition-colors uppercase tracking-widest"
          >
            <span>Scroll to destructure</span>
            <ArrowDownRight className="w-4 h-4 animate-bounce text-[#CCFF00]" />
          </a>
        </div>
      </div>
    </section>
  );
};
