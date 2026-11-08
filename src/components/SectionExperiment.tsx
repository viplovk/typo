import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../utils/audioSynth';
import { calculateMagneticOffset } from '../utils/kineticMath';
import { Atom, Box, Palette, Download, Sparkles, RefreshCw } from 'lucide-react';

/* -------------------------------------------------------------
 * EXPERIMENT A: MAGNETIC LETTER FIELD (CANVAS 2D)
 * ------------------------------------------------------------- */
const MagneticLetterCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Grid of letters
    interface LetterNode {
      char: string;
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }

    const GLYPHS = 'KINETICARCHITECTURESWISSTYPEBRUTALISM2026';
    let nodes: LetterNode[] = [];

    const initNodes = () => {
      nodes = [];
      const cols = Math.floor(width / 50);
      const rows = Math.floor(height / 50);
      const startX = (width - cols * 50) / 2 + 25;
      const startY = (height - rows * 50) / 2 + 25;

      let gIdx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const char = GLYPHS[gIdx % GLYPHS.length];
          gIdx++;
          const baseX = startX + c * 50;
          const baseY = startY + r * 50;
          nodes.push({
            char,
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
            size: 22,
            color: (c + r) % 5 === 0 ? '#CCFF00' : '#ffffff',
          });
        }
      }
    };

    initNodes();

    let cachedRect = canvas.getBoundingClientRect();
    const updateRect = () => {
      if (canvas) cachedRect = canvas.getBoundingClientRect();
    };

    window.addEventListener('scroll', updateRect, { passive: true });

    const onMouseEnter = () => {
      updateRect();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX - cachedRect.left;
      mouseRef.current.y = e.clientY - cachedRect.top;
    };

    const onMouseDown = () => {
      mouseRef.current.isDown = true;
      soundEngine.playThump();
      // Shockwave push
      for (const node of nodes) {
        const dx = node.x - mouseRef.current.x;
        const dy = node.y - mouseRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          const force = (1 - dist / 220) * 45;
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle) * force;
          node.vy += Math.sin(angle) * force;
        }
      }
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener('mouseenter', onMouseEnter, { passive: true });
    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let isRunning = true;
    let needsRender = true;

    const render = () => {
      if (!isRunning) return;

      // Draw frame
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid dots
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (const node of nodes) {
        ctx.fillRect(node.baseX - 1, node.baseY - 1, 2, 2);
      }

      let activeMotion = mouseRef.current.x > 0;

      // Update and draw letters
      for (const node of nodes) {
        // Cursor repulsion
        const mag = calculateMagneticOffset(
          mouseRef.current,
          { x: node.x, y: node.y },
          140,
          25
        );

        if (mag.strength > 0) {
          node.vx += mag.x * 0.35;
          node.vy += mag.y * 0.35;
          activeMotion = true;
        }

        // Spring return to base
        const springX = (node.baseX - node.x) * 0.08;
        const springY = (node.baseY - node.y) * 0.08;

        node.vx = (node.vx + springX) * 0.82;
        node.vy = (node.vy + springY) * 0.82;

        node.x += node.vx;
        node.y += node.vy;

        const speed = Math.hypot(node.vx, node.vy);
        if (speed > 0.05) {
          activeMotion = true;
        }

        // Render letter
        ctx.font = 'bold 20px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = node.color;

        if (speed > 1.5) {
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.rotate(node.vx * 0.05);
          ctx.fillText(node.char, 0, 0);
          ctx.restore();
        } else {
          ctx.fillText(node.char, node.x, node.y);
        }
      }

      // Schedule next frame with 30fps throttle
      setTimeout(() => {
        animId = requestAnimationFrame(render);
      }, 33);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRect);
      canvas.removeEventListener('mouseenter', onMouseEnter);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] bg-black border border-white/20 overflow-hidden cursor-crosshair">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-4 left-4 text-[11px] font-space tracking-widest uppercase text-white/50 pointer-events-none">
        DRAG CURSOR TO DISPLACE GLYPH FIELD · CLICK FOR RADIAL SHOCKWAVE
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * EXPERIMENT B: THREE.JS 3D KINETIC TYPOGRAPHY CYLINDER
 * ------------------------------------------------------------- */
const ThreeKineticCylinder: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const wireframeRef = useRef(wireframe);
  wireframeRef.current = wireframe;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);

    // Create Dynamic Canvas Texture with Kinetic Typography
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 2048;
    textCanvas.height = 512;
    const ctx = textCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 2048, 512);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 90px "Anton", sans-serif';
      ctx.textBaseline = 'middle';

      const phrase = 'KINESIS · AVANT-GARDE TYPOGRAPHY · MOVE BEYOND ORDINARY · SWISS MODERNISM · ';
      ctx.fillText(phrase + phrase, 0, 160);

      ctx.fillStyle = '#CCFF00';
      ctx.font = 'bold 70px "Syne", sans-serif';
      ctx.fillText(phrase + phrase, -200, 360);
    }

    const texture = new THREE.CanvasTexture(textCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // Create Cylinder
    const geometry = new THREE.CylinderGeometry(1.6, 1.6, 1.8, 48, 16, true);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);

    // Subtle ambient lighting
    cylinder.rotation.x = 0.25;

    let isDragging = false;
    let prevMouseX = 0;
    let rotSpeedY = 0.005;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      cylinder.rotation.y += deltaX * 0.008;
      prevMouseX = e.clientX;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;

      // Auto rotation
      if (!isDragging) {
        cylinder.rotation.y += rotSpeedY;
      }
      texture.offset.x += 0.001;

      material.wireframe = wireframeRef.current;
      renderer.render(scene, camera);

      setTimeout(() => {
        animId = requestAnimationFrame(animate);
      }, 33);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] bg-black border border-white/20 overflow-hidden cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => {
            soundEngine.playClick(800);
            setWireframe(!wireframe);
          }}
          className={`px-3 py-1 text-xs font-space uppercase border transition-colors ${
            wireframe
              ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-semibold'
              : 'border-white/30 text-white hover:border-white'
          }`}
        >
          {wireframe ? 'Wireframe: ON' : 'Wireframe: OFF'}
        </button>
      </div>
      <div className="absolute bottom-4 left-4 text-[11px] font-space tracking-widest uppercase text-white/50 pointer-events-none">
        3D WEBGL KINETIC CYLINDER · DRAG HORIZONTALLY TO SPIN
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * EXPERIMENT C: BRUTALIST POSTER GENERATOR
 * ------------------------------------------------------------- */
const BrutalistPosterStudio: React.FC = () => {
  const [headline, setHeadline] = useState('THE FORM OF FORCE');
  const [subheading, setSubheading] = useState('SWISS EXPERIMENTAL TYPOGRAPHY 2026');
  const [posterStyle, setPosterStyle] = useState<'MONOLITH' | 'ACID' | 'INVERT'>('MONOLITH');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'justify'>('left');
  const posterRef = useRef<HTMLDivElement>(null);

  const exportPoster = () => {
    soundEngine.playThump();
    // Render to canvas and download
    const el = posterRef.current;
    if (!el) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = posterStyle === 'ACID' ? '#CCFF00' : posterStyle === 'INVERT' ? '#FFFFFF' : '#050505';
    ctx.fillRect(0, 0, 1200, 1600);

    // Grid lines
    ctx.strokeStyle = posterStyle === 'ACID' ? '#000000' : posterStyle === 'INVERT' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 1080, 1480);

    // Text Header
    ctx.fillStyle = posterStyle === 'ACID' ? '#000000' : posterStyle === 'INVERT' ? '#000000' : '#FFFFFF';
    ctx.font = '24px "Space Grotesk", sans-serif';
    ctx.fillText('KINESIS TYPEFOUNDRY SPECIMEN // ARCHIVE NO. 2026', 100, 140);

    // Giant Headline
    ctx.font = 'bold 160px "Anton", sans-serif';
    const words = headline.split(' ');
    let startY = 420;
    for (const w of words) {
      ctx.fillText(w.toUpperCase(), 100, startY);
      startY += 155;
    }

    // Subheading
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = posterStyle === 'ACID' ? '#000000' : '#CCFF00';
    ctx.fillText(subheading.toUpperCase(), 100, startY + 60);

    // Footer info
    ctx.fillStyle = posterStyle === 'ACID' ? '#000000' : posterStyle === 'INVERT' ? '#444444' : '#888888';
    ctx.font = '20px "Space Grotesk", sans-serif';
    ctx.fillText('SCALE: 1:1 · FORMAT: 1200×1600 · RENDERED VIA BROWSER CANVASES', 100, 1480);

    // Trigger download
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `kinesis-poster-${Date.now()}.png`;
    a.href = url;
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls Column */}
      <div className="lg:col-span-5 flex flex-col gap-5 bg-zinc-950 p-6 border border-white/20">
        <div>
          <label className="text-xs font-space tracking-widest uppercase text-white/50 block mb-2">
            PRIMARY HEADLINE STATEMENT
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={28}
            className="w-full bg-black border border-white/20 px-3 py-2 text-sm font-space text-white uppercase focus:border-[#CCFF00] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-space tracking-widest uppercase text-white/50 block mb-2">
            SUBHEADING & SPECIFICATION
          </label>
          <input
            type="text"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            maxLength={45}
            className="w-full bg-black border border-white/20 px-3 py-2 text-sm font-space text-white uppercase focus:border-[#CCFF00] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-space tracking-widest uppercase text-white/50 block mb-2">
            COLOR PALETTE THEME
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'MONOLITH', label: 'Dark Mono' },
              { id: 'ACID', label: 'Acid Lime' },
              { id: 'INVERT', label: 'White Invert' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  soundEngine.playClick(750);
                  setPosterStyle(t.id as 'MONOLITH' | 'ACID' | 'INVERT');
                }}
                className={`py-2 text-xs font-space uppercase border transition-colors ${
                  posterStyle === t.id
                    ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-semibold'
                    : 'border-white/20 text-white/60 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-space tracking-widest uppercase text-white/50 block mb-2">
            TEXT ALIGNMENT
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['left', 'center', 'justify'] as const).map((align) => (
              <button
                key={align}
                onClick={() => {
                  soundEngine.playClick(650);
                  setAlignment(align);
                }}
                className={`py-2 text-xs font-space uppercase border transition-colors ${
                  alignment === align
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/20 text-white/60 hover:text-white'
                }`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={exportPoster}
          className="w-full mt-2 py-3 bg-[#CCFF00] text-black font-space font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export 1200×1600 Poster (PNG)</span>
        </button>
      </div>

      {/* Live Poster Preview */}
      <div className="lg:col-span-7 flex justify-center">
        <div
          ref={posterRef}
          style={{ textAlign: alignment }}
          className={`w-full max-w-[460px] aspect-[3/4] p-8 border flex flex-col justify-between transition-colors duration-300 shadow-2xl relative select-none ${
            posterStyle === 'ACID'
              ? 'bg-[#CCFF00] text-black border-black'
              : posterStyle === 'INVERT'
              ? 'bg-white text-black border-zinc-300'
              : 'bg-[#050505] text-white border-white/20'
          }`}
        >
          {/* Poster Header */}
          <div className="flex justify-between items-center text-[11px] font-space tracking-widest uppercase border-b pb-3 border-current/20">
            <span>KINESIS // POSTER 01</span>
            <span>SPECIMEN EDITION</span>
          </div>

          {/* Poster Center Headline */}
          <div className="my-auto py-6">
            <h3 className="font-anton uppercase text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.88] tracking-tight">
              {headline || 'KINETIC'}
            </h3>
            <p className="mt-4 font-space text-xs tracking-widest uppercase opacity-80">
              {subheading}
            </p>
          </div>

          {/* Poster Footer */}
          <div className="pt-4 border-t border-current/20 flex justify-between items-end text-[10px] font-space tracking-widest uppercase opacity-70">
            <div>
              <p>SWISS MODERNISM</p>
              <p>DIGITAL BRUTALISM</p>
            </div>
            <div className="text-right">
              <p>ZURICH SPECIMEN</p>
              <p>2026 ARCHIVE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * MAIN SECTION CONTAINER
 * ------------------------------------------------------------- */
interface SectionExperimentProps {
  activeTabOverride?: 'field' | '3d' | 'poster' | null;
}

export const SectionExperiment: React.FC<SectionExperimentProps> = ({ activeTabOverride }) => {
  const [activeTab, setActiveTab] = useState<'field' | '3d' | 'poster'>('field');

  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);

  return (
    <section
      id="lab"
      className="relative min-h-screen w-full bg-zinc-950 py-24 px-6 lg:px-12 flex flex-col justify-between border-t border-white/10 overflow-hidden"
    >
      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4 text-xs font-space tracking-widest text-white/50 uppercase">
          <span className="text-[#CCFF00]">04 // THE KINETIC LAB</span>
          <span>·</span>
          <span>INTERACTIVE TYPOGRAPHY WORKSHOP</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick(600);
              setActiveTab('field');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-space uppercase border transition-colors ${
              activeTab === 'field'
                ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-semibold'
                : 'border-white/20 text-white/60 hover:text-white'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Magnetic Field</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(700);
              setActiveTab('3d');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-space uppercase border transition-colors ${
              activeTab === '3d'
                ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-semibold'
                : 'border-white/20 text-white/60 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Cylinder</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(800);
              setActiveTab('poster');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-space uppercase border transition-colors ${
              activeTab === 'poster'
                ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-semibold'
                : 'border-white/20 text-white/60 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Poster Studio</span>
          </button>
        </div>
      </div>

      {/* Main Experiment Content */}
      <div className="relative z-10 my-auto py-8">
        {activeTab === 'field' && <MagneticLetterCanvas />}
        {activeTab === '3d' && <ThreeKineticCylinder />}
        {activeTab === 'poster' && <BrutalistPosterStudio />}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-space text-white/50">
        <div className="flex items-center gap-6">
          <span className="text-white font-medium">LAB ARCHITECTURE:</span>
          <span>THREE.JS WEBGL RENDERER</span>
          <span>CANVAS 2D PARTICLE SPRINGS</span>
          <span>HIGH-RES CANVAS EXPORT</span>
        </div>
        <div className="text-[#CCFF00]">LAB MODE 0{activeTab === 'field' ? 1 : activeTab === '3d' ? 2 : 3} ACTIVE</div>
      </div>
    </section>
  );
};
