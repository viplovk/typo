import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/audioSynth';
import { RefreshCw } from 'lucide-react';

const PRINCIPLES = [
  {
    title: 'FRICTION AS TEXTURE',
    kicker: '01. MANIFESTO',
    desc: 'When glyphs collide, meaning vibrates. We treat letterforms not as passive phonetic symbols, but as kinetic matter with weight, inertia, and mass.',
    accentWord: 'KINETIC MASS',
  },
  {
    title: 'EXTREME COMPRESSION',
    kicker: '02. FORM',
    desc: 'Squeezing horizontal counter-spaces forces letterforms into dense architectural monoliths that demand the viewers physical attention.',
    accentWord: 'COMPRESSION',
  },
  {
    title: 'NEGATIVE VOID DYNAMICS',
    kicker: '03. SPACE',
    desc: 'The space between words is an active acoustic silence. We crop display lettering past the boundary edges to imply infinite spatial continuity.',
    accentWord: 'INFINITE CONTINUITY',
  },
  {
    title: 'RADICAL MONOCHROME',
    kicker: '04. DISCIPLINE',
    desc: 'Stripping chromatic noise forces the eye to perceive only tension, curve tension, stroke weight, and temporal velocity.',
    accentWord: 'STARK CONTRAST',
  },
];

export const SectionIntroduction: React.FC = () => {
  const [activePrinciple, setActivePrinciple] = useState(0);

  const cyclePrinciple = () => {
    soundEngine.playChirp(520 + activePrinciple * 100, 0.08);
    setActivePrinciple((prev) => (prev + 1) % PRINCIPLES.length);
  };

  const current = PRINCIPLES[activePrinciple];

  return (
    <section
      id="intro"
      className="relative min-h-screen w-full bg-black py-24 px-6 lg:px-12 flex flex-col justify-between border-t border-white/10 overflow-hidden"
    >
      {/* Top Editorial Row */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-8 pb-12 border-b border-white/10">
        <div className="flex items-center gap-4 text-xs font-space tracking-widest text-white/50 uppercase">
          <span className="text-[#CCFF00]">01 // THE MANIFESTO</span>
          <span>·</span>
          <span>SWISS MODERNISM × DIGITAL BRUTALISM</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cyclePrinciple}
            data-cursor="interactive"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-space tracking-widest uppercase border border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Cycle Principle ({activePrinciple + 1}/4)</span>
          </button>
        </div>
      </div>

      {/* Central Statement - Giant Expressive Typography */}
      <div className="relative z-10 my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Enormous Typography */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-space text-xs sm:text-sm tracking-widest uppercase text-[#CCFF00] block mb-2">
              STATEMENT OF INTENT
            </span>
            <h2 className="font-anton uppercase text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.88] tracking-tight text-white">
              TYPE IS NOT <br />
              <span className="text-stroke-white hover:text-white transition-colors duration-300">
                ORNAMENT.
              </span>
              <br />
              TYPE IS THE <br />
              <span className="text-[#CCFF00] underline decoration-4 underline-offset-8">
                STRUCTURE.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Right Column: Swiss Card with Dynamic Switcher */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-white/20 p-6 lg:p-8 bg-zinc-950/60 backdrop-blur-sm relative">
          <div className="absolute top-0 right-0 bg-[#CCFF00] text-black font-space text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
            {current.kicker}
          </div>

          <div className="mb-8">
            <span className="font-space text-xs text-white/40 tracking-widest uppercase block mb-1">
              PRINCIPLE NO. {activePrinciple + 1}
            </span>
            <h3 className="font-syne text-2xl lg:text-3xl font-bold uppercase text-white mb-4">
              {current.title}
            </h3>
            <p className="font-space text-sm text-white/70 leading-relaxed">
              {current.desc}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="font-space text-xs tracking-wider text-white/40">
              FOCUS: <span className="text-[#CCFF00] font-semibold">{current.accentWord}</span>
            </div>
            <span className="font-bebas text-2xl text-white/30">
              0{activePrinciple + 1} / 04
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Staggered Running Word Strip */}
      <div className="relative z-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-xs font-space text-white/60">
        <div className="flex items-center gap-6">
          <span className="text-white font-medium">TYPOGRAPHIC PARAMETERS:</span>
          <span>WEIGHT: 900 EXTRA-CONDENSED</span>
          <span>KERNING: OPTICAL METRICS</span>
          <span>AXIS: VARIABLE WEIGHT</span>
        </div>
        <div className="text-[#CCFF00] font-mono text-xs">
          [SCROLL VELOCITY ENGINE ENGAGED]
        </div>
      </div>
    </section>
  );
};
