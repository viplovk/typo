import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface NavigationProps {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPosterLab?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isSoundEnabled,
  onToggleSound,
  onOpenPosterLab,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-8 px-6 lg:px-12 py-5 bg-black/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={() => soundEngine.playClick(1400)}
        className="font-anton text-2xl lg:text-3xl tracking-tight text-white hover:text-[#CCFF00] transition-colors whitespace-nowrap shrink-0"
      >
        KINESIS
      </a>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-space tracking-widest uppercase text-white/70">
        <a
          href="#intro"
          onClick={() => soundEngine.playClick(800)}
          className="hover:text-white hover:underline underline-offset-4 decoration-[#CCFF00] transition-colors whitespace-nowrap shrink-0"
        >
          01. Intro
        </a>
        <a
          href="#distortion"
          onClick={() => soundEngine.playClick(900)}
          className="hover:text-white hover:underline underline-offset-4 decoration-[#CCFF00] transition-colors whitespace-nowrap shrink-0"
        >
          02. Distortion
        </a>
        <a
          href="#momentum"
          onClick={() => soundEngine.playClick(1000)}
          className="hover:text-white hover:underline underline-offset-4 decoration-[#CCFF00] transition-colors whitespace-nowrap shrink-0"
        >
          03. Momentum
        </a>
        <a
          href="#lab"
          onClick={() => soundEngine.playClick(1100)}
          className="hover:text-white hover:underline underline-offset-4 decoration-[#CCFF00] transition-colors whitespace-nowrap shrink-0"
        >
          04. Kinetic Lab
        </a>
        <a
          href="#immersion"
          onClick={() => soundEngine.playClick(1200)}
          className="hover:text-white hover:underline underline-offset-4 decoration-[#CCFF00] transition-colors whitespace-nowrap shrink-0"
        >
          05. Immersion
        </a>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSound}
          aria-label={isSoundEnabled ? 'Mute kinetic audio' : 'Enable kinetic audio'}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-space tracking-wider uppercase border border-white/20 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] transition-all whitespace-nowrap shrink-0"
        >
          {isSoundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#CCFF00] animate-pulse" />
              <span>Audio: On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/50" />
              <span>Audio: Off</span>
            </>
          )}
        </button>

        {onOpenPosterLab && (
          <button
            onClick={() => {
              soundEngine.playThump();
              onOpenPosterLab();
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 text-xs font-space font-semibold uppercase bg-[#CCFF00] text-black hover:bg-white transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design Poster</span>
          </button>
        )}
      </div>
    </header>
  );
};
