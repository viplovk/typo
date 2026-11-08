import React, { useState } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'motion/react';
import { soundEngine } from '../utils/audioSynth';
import { Zap, FastForward } from 'lucide-react';

interface MarqueeRowProps {
  words: string[];
  direction: 'left' | 'right';
  fontClass: string;
  outlineOnly?: boolean;
  isBoosted: boolean;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  words,
  direction,
  fontClass,
  outlineOnly = false,
  isBoosted,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        soundEngine.playChirp(700, 0.05);
      }}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="interactive"
      data-cursor-text={isHovered ? 'PAUSED' : 'VELOCITY'}
      className={`relative w-full py-3 overflow-hidden select-none whitespace-nowrap transition-colors duration-300 ${
        isHovered ? 'bg-[#CCFF00] text-black' : 'text-white'
      }`}
    >
      <div
        className={`${
          direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'
        } ${isBoosted ? 'speed-boost' : ''} ${isHovered ? 'marquee-paused' : ''} flex gap-8 items-center`}
      >
        {/* Render duplicate arrays for continuous infinite seamless looping */}
        {[...Array(3)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex gap-8 items-center shrink-0">
            {words.map((word, wIdx) => (
              <span
                key={wIdx}
                className={`${fontClass} uppercase text-[clamp(3.5rem,11vw,10.5rem)] leading-none tracking-tight transition-all duration-200 ${
                  outlineOnly && !isHovered
                    ? 'text-stroke-white hover:text-white'
                    : ''
                }`}
              >
                {word}
                <span className="ml-8 text-[#CCFF00] inline-block font-sans opacity-60">
                  /
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SectionMomentum: React.FC = () => {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const toggleSpeed = () => {
    soundEngine.playThump();
    setSpeedMultiplier((prev) => (prev === 1 ? 2.2 : 1));
  };

  const row1Words = ['VELOCITY', 'TENSION', 'RHYTHM', 'IMPACT', 'GRAVITY', 'PROPULSION'];
  const row2Words = ['DIGITAL BRUTALISM', 'RAW TYPE', 'SWISS ORDER', 'EXTREME CONTRAST', 'UNTITLED'];
  const row3Words = ['SCATTER', 'ALIGN', 'DISTORT', 'EXPAND', 'COLLAPSE', 'ACCELERATE'];

  return (
    <section
      id="momentum"
      className="relative min-h-screen w-full bg-black py-24 flex flex-col justify-between border-t border-white/10 overflow-hidden"
    >
      {/* Top Header */}
      <div className="relative z-10 px-6 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4 text-xs font-space tracking-widest text-white/50 uppercase">
          <span className="text-[#CCFF00]">03 // MOMENTUM</span>
          <span>·</span>
          <span>HIGH-VELOCITY KINETIC MARQUEE</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleSpeed}
            data-cursor="interactive"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-space uppercase border border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black transition-colors"
          >
            {speedMultiplier > 1 ? (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Hyper Boost Active (2.2x)</span>
              </>
            ) : (
              <>
                <FastForward className="w-3.5 h-3.5" />
                <span>Engage Velocity Boost</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Marquee Tracks */}
      <div className="relative z-10 my-auto py-8 flex flex-col gap-4 border-y border-white/10 overflow-hidden">
        {/* Track 1: Anton Leftwards */}
        <MarqueeRow
          words={row1Words}
          direction="left"
          fontClass="font-anton"
          outlineOnly={false}
          isBoosted={speedMultiplier > 1}
        />

        {/* Track 2: Bebas Neue Rightwards (Outlined) */}
        <MarqueeRow
          words={row2Words}
          direction="right"
          fontClass="font-bebas"
          outlineOnly={true}
          isBoosted={speedMultiplier > 1}
        />

        {/* Track 3: Syne Leftwards */}
        <MarqueeRow
          words={row3Words}
          direction="left"
          fontClass="font-syne font-extrabold"
          outlineOnly={false}
          isBoosted={speedMultiplier > 1}
        />
      </div>

      {/* Footer Instructions */}
      <div className="relative z-10 px-6 lg:px-12 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-space text-white/50 border-t border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">INTERACTION CUE:</span>
          <span>HOVER ANY TRACK TO HALT MOMENTUM & INVERT POLARITY</span>
        </div>
        <div className="text-white/40">
          SCROLLING DYNAMICALLY DISPLACES KINETIC TRACKS
        </div>
      </div>
    </section>
  );
};
