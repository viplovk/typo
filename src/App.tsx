/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { HeroSection } from './components/HeroSection';
import { SectionIntroduction } from './components/SectionIntroduction';
import { SectionDistortion } from './components/SectionDistortion';
import { SectionMomentum } from './components/SectionMomentum';
import { SectionExperiment } from './components/SectionExperiment';
import { SectionImmersion } from './components/SectionImmersion';
import { SectionOutro } from './components/SectionOutro';
import { soundEngine } from './utils/audioSynth';

export default function App() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [labTabOverride, setLabTabOverride] = useState<'field' | '3d' | 'poster' | null>(null);

  useEffect(() => {
    // Check initial prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }
    }
  }, []);

  const handleToggleSound = () => {
    const newState = soundEngine.toggleSound();
    setIsSoundEnabled(newState);
  };

  const handleToggleReducedMotion = () => {
    soundEngine.playClick(900);
    setReducedMotion((prev) => !prev);
    if (!reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const handleOpenPosterLab = () => {
    setLabTabOverride('poster');
    const labEl = document.getElementById('lab');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen bg-black text-white selection:bg-[#CCFF00] selection:text-black overflow-x-hidden ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Brutalist Noise & Swiss Grid Background Overlays */}
      <div className="fixed inset-0 pointer-events-none z-40 noise-overlay opacity-60" />
      <div className="fixed inset-0 pointer-events-none z-0 swiss-grid opacity-25" />

      {/* Avant-Garde Precision Magnetic Cursor */}
      <CustomCursor />

      {/* Minimal Top Navigation */}
      <Navigation
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onOpenPosterLab={handleOpenPosterLab}
      />

      {/* Main Narrative Flow */}
      <main className="relative z-10 w-full flex flex-col">
        {/* Hero: MOVE. BEYOND. ORDINARY. */}
        <HeroSection />

        {/* Section 1: Introduction & Manifesto */}
        <SectionIntroduction />

        {/* Section 2: Distortion Lab */}
        <SectionDistortion />

        {/* Section 3: Momentum Marquees */}
        <SectionMomentum />

        {/* Section 4: The Kinetic Lab (Magnetic Field, 3D Cylinder, Poster Studio) */}
        <SectionExperiment activeTabOverride={labTabOverride} />

        {/* Section 5: Layered 3D Immersion */}
        <SectionImmersion />

        {/* Section 6: Outro & Minimalist Swiss Footer */}
        <SectionOutro
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
        />
      </main>
    </div>
  );
}
