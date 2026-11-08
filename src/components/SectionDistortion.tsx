import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/audioSynth';
import { Sliders, Copy, Check, RotateCcw } from 'lucide-react';

interface Preset {
  name: string;
  font: string;
  scaleX: number;
  scaleY: number;
  skewX: number;
  tracking: number;
  text: string;
}

const PRESETS: Preset[] = [
  {
    name: 'SWISS MONOLITH',
    font: 'font-anton',
    scaleX: 1.0,
    scaleY: 1.0,
    skewX: 0,
    tracking: -0.04,
    text: 'DEFORMATION',
  },
  {
    name: 'HYPER STRETCH',
    font: 'font-bebas',
    scaleX: 2.2,
    scaleY: 0.8,
    skewX: -8,
    tracking: 0.12,
    text: 'ELONGATE',
  },
  {
    name: 'EXTREME OBLIQUE',
    font: 'font-syne',
    scaleX: 1.15,
    scaleY: 1.3,
    skewX: -26,
    tracking: 0.05,
    text: 'VELOCITY',
  },
  {
    name: 'ASTRONOMICAL VOID',
    font: 'font-space',
    scaleX: 0.85,
    scaleY: 1.4,
    skewX: 12,
    tracking: 0.45,
    text: 'EXPANSION',
  },
];

export const SectionDistortion: React.FC = () => {
  const [scaleX, setScaleX] = useState<number>(1.2);
  const [scaleY, setScaleY] = useState<number>(1.0);
  const [skewX, setSkewX] = useState<number>(-12);
  const [tracking, setTracking] = useState<number>(0.08);
  const [selectedFont, setSelectedFont] = useState<string>('font-anton');
  const [sampleText, setSampleText] = useState<string>('DEFORMATION');
  const [copied, setCopied] = useState<boolean>(false);

  const applyPreset = (p: Preset) => {
    soundEngine.playChirp(600, 0.08);
    setScaleX(p.scaleX);
    setScaleY(p.scaleY);
    setSkewX(p.skewX);
    setTracking(p.tracking);
    setSelectedFont(p.font);
    setSampleText(p.text);
  };

  const resetValues = () => {
    soundEngine.playClick(500);
    setScaleX(1.0);
    setScaleY(1.0);
    setSkewX(0);
    setTracking(0);
  };

  const copyCSS = () => {
    soundEngine.playChirp(1000, 0.1);
    const css = `transform: scale(${scaleX}, ${scaleY}) skewX(${skewX}deg);\nletter-spacing: ${tracking}em;`;
    navigator.clipboard?.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="distortion"
      className="relative min-h-screen w-full bg-zinc-950 py-24 px-6 lg:px-12 flex flex-col justify-between border-t border-white/10 overflow-hidden"
    >
      {/* Top Section Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4 text-xs font-space tracking-widest text-white/50 uppercase">
          <span className="text-[#CCFF00]">02 // DISTORTION LAB</span>
          <span>·</span>
          <span>VARIABLE GEOMETRY ENGINE</span>
        </div>

        {/* Presets Segmented Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1 text-[11px] font-space tracking-wider uppercase border border-white/20 text-white/70 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={resetValues}
            title="Reset deformation"
            className="p-1 text-white/40 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Kinetic Typography Canvas Area */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center min-h-[380px] overflow-hidden">
        {/* Subtle crosshairs background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-full h-[1px] bg-white/20"></div>
          <div className="absolute h-full w-[1px] bg-white/20"></div>
        </div>

        {/* The Live Distorted Typography Output */}
        <div
          data-cursor="interactive"
          data-cursor-text="MORPH"
          className="relative transition-transform duration-100 ease-out select-none flex items-center justify-center text-center max-w-full"
          style={{
            transform: `scale(${scaleX}, ${scaleY}) skewX(${skewX}deg)`,
            letterSpacing: `${tracking}em`,
          }}
        >
          <span
            className={`${selectedFont} uppercase text-[clamp(3.5rem,14vw,11rem)] leading-none text-white hover:text-[#CCFF00] transition-colors duration-200 block drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]`}
          >
            {sampleText}
          </span>
        </div>

        <div className="mt-8 text-xs font-space text-white/40 uppercase tracking-widest flex items-center gap-4">
          <span>SCALE: {scaleX.toFixed(2)}x · {scaleY.toFixed(2)}y</span>
          <span>SKEW: {skewX}°</span>
          <span>TRACKING: {tracking.toFixed(2)}EM</span>
        </div>
      </div>

      {/* Control Console (Slanted Brutalist Controls) */}
      <div className="relative z-10 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-black/60 p-6 backdrop-blur-md">
        {/* Control 1: Scale X */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-space text-white/70">
            <span className="uppercase">HORIZONTAL STRETCH (X)</span>
            <span className="font-mono text-[#CCFF00]">{scaleX.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.8"
            step="0.05"
            value={scaleX}
            onChange={(e) => {
              setScaleX(parseFloat(e.target.value));
              soundEngine.playClick(300 + parseFloat(e.target.value) * 200);
            }}
            className="w-full accent-[#CCFF00] bg-white/20 cursor-pointer h-1.5"
          />
        </div>

        {/* Control 2: Scale Y */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-space text-white/70">
            <span className="uppercase">VERTICAL TENSION (Y)</span>
            <span className="font-mono text-[#CCFF00]">{scaleY.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.2"
            step="0.05"
            value={scaleY}
            onChange={(e) => {
              setScaleY(parseFloat(e.target.value));
              soundEngine.playClick(400 + parseFloat(e.target.value) * 200);
            }}
            className="w-full accent-[#CCFF00] bg-white/20 cursor-pointer h-1.5"
          />
        </div>

        {/* Control 3: Shear / Skew */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-space text-white/70">
            <span className="uppercase">SHEAR ANGLE</span>
            <span className="font-mono text-[#CCFF00]">{skewX}°</span>
          </div>
          <input
            type="range"
            min="-35"
            max="35"
            step="1"
            value={skewX}
            onChange={(e) => {
              setSkewX(parseInt(e.target.value, 10));
              soundEngine.playClick(500 + Math.abs(parseInt(e.target.value, 10)) * 15);
            }}
            className="w-full accent-[#CCFF00] bg-white/20 cursor-pointer h-1.5"
          />
        </div>

        {/* Control 4: Tracking / Spacing */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-space text-white/70">
            <span className="uppercase">LETTER SPACING</span>
            <span className="font-mono text-[#CCFF00]">{tracking.toFixed(2)}em</span>
          </div>
          <input
            type="range"
            min="-0.15"
            max="0.8"
            step="0.02"
            value={tracking}
            onChange={(e) => {
              setTracking(parseFloat(e.target.value));
              soundEngine.playClick(600 + parseFloat(e.target.value) * 300);
            }}
            className="w-full accent-[#CCFF00] bg-white/20 cursor-pointer h-1.5"
          />
        </div>

        {/* Bottom Tool Row: Font Switcher & CSS Copy */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-space text-white/50 uppercase">FONT TYPEFACE:</span>
            {[
              { id: 'font-anton', label: 'Anton (Condensed)' },
              { id: 'font-bebas', label: 'Bebas (Narrow)' },
              { id: 'font-syne', label: 'Syne (Wide Geometric)' },
              { id: 'font-space', label: 'Space Grotesk' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFont(f.id);
                  soundEngine.playClick(900);
                }}
                className={`text-xs font-space px-3 py-1 border transition-colors ${
                  selectedFont === f.id
                    ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-semibold'
                    : 'border-white/20 text-white/60 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value.toUpperCase())}
              placeholder="CUSTOM TEXT..."
              maxLength={16}
              className="bg-black border border-white/20 px-3 py-1 text-xs font-space text-white uppercase focus:border-[#CCFF00] focus:outline-none w-36"
            />
            <button
              onClick={copyCSS}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-space uppercase border border-white/30 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>CSS Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy CSS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
