import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/audioSynth';
import { Layers, Eye, Compass } from 'lucide-react';

export const SectionImmersion: React.FC = () => {
  const [viewAngle, setViewAngle] = useState<'FRONT' | 'ISOMETRIC' | 'EXTREME'>('FRONT');
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const angleConfig = {
    FRONT: { rotateX: 0, rotateY: 0, rotateZ: 0 },
    ISOMETRIC: { rotateX: 25, rotateY: -30, rotateZ: 4 },
    EXTREME: { rotateX: 45, rotateY: 20, rotateZ: -12 },
  };

  const currentAngle = angleConfig[viewAngle];

  return (
    <section
      id="immersion"
      className="relative min-h-screen w-full bg-black py-24 px-6 lg:px-12 flex flex-col justify-between border-t border-white/10 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Top Header */}
      <div className="relative z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4 text-xs font-space tracking-widest text-white/50 uppercase">
          <span className="text-[#CCFF00]">05 // IMMERSION</span>
          <span>·</span>
          <span>LAYERED SPATIAL TYPOGRAPHY</span>
        </div>

        {/* View Angle Perspective Switcher */}
        <div className="flex items-center gap-2">
          {(['FRONT', 'ISOMETRIC', 'EXTREME'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                soundEngine.playChirp(700, 0.08);
                setViewAngle(mode);
              }}
              className={`px-3 py-1 text-xs font-space uppercase border transition-all ${
                viewAngle === mode
                  ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-semibold scale-105'
                  : 'border-white/20 text-white/60 hover:text-white'
              }`}
            >
              {mode} VIEW
            </button>
          ))}
        </div>
      </div>

      {/* 3D Spatial Typography Chamber */}
      <div className="relative z-20 my-auto py-16 flex items-center justify-center min-h-[500px]">
        <motion.div
          animate={currentAngle}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full max-w-5xl h-[420px] flex items-center justify-center"
        >
          {/* LAYER 0 (Deepest Background - Z: -220px): Massive Ghost Stroke Outline */}
          <div
            style={{ transform: 'translateZ(-220px)' }}
            onMouseEnter={() => {
              setActiveLayer(0);
              soundEngine.playClick(400);
            }}
            className={`absolute inset-0 flex items-center justify-center select-none transition-opacity duration-300 ${
              activeLayer === 0 ? 'opacity-90' : 'opacity-25'
            }`}
          >
            <span className="font-anton text-[clamp(6rem,22vw,18rem)] uppercase leading-none tracking-tighter text-stroke-2">
              KINESIS
            </span>
          </div>

          {/* LAYER 1 (Midground Plane - Z: -60px): Acid Geometric Grid Matrix & Swiss Cards */}
          <div
            style={{ transform: 'translateZ(-60px)' }}
            onMouseEnter={() => {
              setActiveLayer(1);
              soundEngine.playClick(600);
            }}
            className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none"
          >
            <div className="flex justify-between items-start">
              <div className="border border-[#CCFF00]/40 bg-black/60 p-3 max-w-[200px] pointer-events-auto">
                <span className="text-[10px] font-space text-[#CCFF00] block mb-1">
                  AXIS: Z-DISPLACEMENT
                </span>
                <p className="text-xs font-space text-white/80">
                  Spatial layers decouple typography from 2D plane limitations.
                </p>
              </div>

              <div className="border border-white/20 bg-black/60 p-3 max-w-[180px] pointer-events-auto">
                <span className="text-[10px] font-space text-white/50 block mb-1">
                  OPTICAL KERNING
                </span>
                <p className="text-xs font-space text-white/80">
                  Letters cast synthetic shadows across lower surfaces.
                </p>
              </div>
            </div>

            <div className="flex justify-center pointer-events-auto">
              <span className="font-bebas text-6xl tracking-widest text-[#CCFF00] opacity-40">
                ////// DIMENSIONAL DEPTH //////
              </span>
            </div>
          </div>

          {/* LAYER 2 (Primary Focus - Z: 60px): Solid Heavy Display Letters */}
          <div
            style={{ transform: 'translateZ(60px)' }}
            onMouseEnter={() => {
              setActiveLayer(2);
              soundEngine.playClick(800);
            }}
            className="relative z-30 flex flex-col items-center justify-center select-none cursor-pointer"
          >
            <h2 className="font-anton text-[clamp(4.5rem,14vw,12rem)] uppercase leading-none tracking-tight text-white hover:text-[#CCFF00] transition-colors drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              IMMERSION
            </h2>
            <div className="mt-2 flex items-center gap-4 bg-black/80 px-4 py-1.5 border border-white/30 text-xs font-space tracking-widest text-white/80">
              <span className="text-[#CCFF00]">PLANE: Z+60PX</span>
              <span>·</span>
              <span>GEOMETRIC PROJECTION</span>
            </div>
          </div>

          {/* LAYER 3 (Foreground Float - Z: 180px): Staggered Brutalist Accents */}
          <div
            style={{ transform: 'translateZ(180px)' }}
            onMouseEnter={() => {
              setActiveLayer(3);
              soundEngine.playClick(1100);
            }}
            className="absolute -bottom-8 left-12 z-40 pointer-events-auto bg-[#CCFF00] text-black px-4 py-2 font-space text-xs font-bold uppercase tracking-widest shadow-xl flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>LAYER 04 // FOREGROUND PLANE</span>
          </div>

          <div
            style={{ transform: 'translateZ(180px)' }}
            className="absolute -top-6 right-12 z-40 pointer-events-auto border border-white bg-white text-black px-4 py-1.5 font-space text-xs font-bold uppercase tracking-widest shadow-xl"
          >
            VIEW: {viewAngle}
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="relative z-30 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-space text-white/50">
        <div className="flex items-center gap-6">
          <span className="text-white font-medium">3D SPATIAL ENGINE:</span>
          <span>CSS TRANSFORM-STYLE PRESERVE-3D</span>
          <span>4-LEVEL Z-INDEX STACK</span>
        </div>
        <div className="text-white/40">
          SELECT PERSPECTIVE MODES TO ROTATE CHAMBER IN 3D SPACE
        </div>
      </div>
    </section>
  );
};
