import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { formatSwissTime } from '../utils/kineticMath';
import { soundEngine } from '../utils/audioSynth';
import { ArrowUp, Clock, Globe } from 'lucide-react';

interface OutroProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const SectionOutro: React.FC<OutroProps> = ({
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    setTimeStr(formatSwissTime());
    const interval = setInterval(() => {
      setTimeStr(formatSwissTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    soundEngine.playThump();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="outro"
      className="relative min-h-screen w-full bg-black py-24 px-6 lg:px-12 flex flex-col justify-between border-t border-white/10 overflow-hidden"
    >
      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4 text-xs font-space tracking-widest text-white/50 uppercase">
          <span className="text-[#CCFF00]">06 // THE CONCLUSION</span>
          <span>·</span>
          <span>FINAL KINETIC DISCOURSE</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-space text-white/60">
          <div className="flex items-center gap-1.5 text-[#CCFF00]">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{timeStr || '12:00:00 UTC'}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>ZURICH / BASEL</span>
          </div>
        </div>
      </div>

      {/* Central Enormous Kinetic Statement */}
      <div className="relative z-10 my-auto py-12 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="select-none"
        >
          <span className="text-xs sm:text-sm font-space tracking-widest uppercase text-[#CCFF00] block mb-4">
            FINAL CREATIVE PRINCIPLE
          </span>

          <h2 className="font-anton uppercase text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.88] tracking-tight text-white">
            EVERY LETTER <br />
            <span className="text-[#CCFF00] hover:tracking-wider transition-all duration-300 cursor-pointer">
              ALIVE.
            </span>
            <br />
            EVERY MOVEMENT <br />
            <span className="text-stroke-white hover:text-white transition-colors duration-300 cursor-pointer">
              PURPOSEFUL.
            </span>
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10 font-space text-xs text-white/70">
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-2">
              KINETIC ARCHITECTURE
            </h4>
            <p className="leading-relaxed text-white/50">
              Letters as dynamic physical entities reacting in continuous spatial equilibrium.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-2">
              SWISS BRUTALISM
            </h4>
            <p className="leading-relaxed text-white/50">
              Strict geometric grid structures collided with high-contrast electric accents.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-2">
              TECHNICAL PRECISION
            </h4>
            <p className="leading-relaxed text-white/50">
              Web Audio synthesis, 3D WebGL projection, and real-time canvas deformations.
            </p>
          </div>
        </div>
      </div>

      {/* Minimalist Swiss Footer */}
      <div className="relative z-10 pt-12 border-t border-white/10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 text-xs font-space">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-anton text-2xl tracking-tight text-white">
              KINESIS
            </span>
            <span className="text-white/40">·</span>
            <span className="text-white/60 uppercase">EXPERIMENTAL TYPOGRAPHY LAB</span>
          </div>
          <p className="text-white/40">
            © 2026 KINESIS RESEARCH · DESIGNED FOR AWWWARDS RECOGNITION
          </p>
        </div>

        {/* Action Controls & Back to top */}
        <div className="flex items-center gap-6">
          <button
            onClick={onToggleReducedMotion}
            className={`px-3 py-1.5 uppercase border transition-colors ${
              reducedMotion
                ? 'border-[#CCFF00] text-[#CCFF00]'
                : 'border-white/20 text-white/50 hover:text-white'
            }`}
          >
            Motion: {reducedMotion ? 'Reduced' : 'Fluid'}
          </button>

          <button
            onClick={scrollToTop}
            data-cursor="interactive"
            data-cursor-text="TOP"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold uppercase tracking-wider hover:bg-[#CCFF00] transition-colors"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
