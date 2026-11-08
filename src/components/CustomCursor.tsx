import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate on fine pointer devices (mouse / trackpad)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovered = false;
    let isClicked = false;
    let isOverInput = false;

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    if (!dotEl || !ringEl) return;

    let animId: number;

    const render = () => {
      // Smooth lerp for trailing ring
      ringX += (targetX - ringX) * 0.25;
      ringY += (targetY - ringY) * 0.25;

      if (!isVisible || isOverInput) {
        dotEl.style.opacity = '0';
        ringEl.style.opacity = '0';
      } else {
        dotEl.style.opacity = '1';
        ringEl.style.opacity = '1';

        // Direct hardware-accelerated transform
        dotEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) ${
          isClicked ? 'scale(0.75)' : isHovered ? 'scale(1.3)' : 'scale(1)'
        }`;

        ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${
          isClicked ? 'scale(0.8)' : isHovered ? 'scale(1.2)' : 'scale(1)'
        }`;

        if (isHovered) {
          dotEl.style.backgroundColor = '#CCFF00';
          ringEl.style.borderColor = '#CCFF00';
          ringEl.style.backgroundColor = 'rgba(204, 255, 0, 0.08)';
        } else {
          dotEl.style.backgroundColor = '#ffffff';
          ringEl.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          ringEl.style.backgroundColor = 'transparent';
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) isVisible = true;
    };

    const onMouseDown = () => {
      isClicked = true;
    };

    const onMouseUp = () => {
      isClicked = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    // Event delegation: light, passive, no forced synchronous reflows
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const inputEl = target.closest('input[type="text"], textarea');
      if (inputEl) {
        isOverInput = true;
        return;
      }
      isOverInput = false;

      const interactive = target.closest('a, button, [role="button"], input[type="range"], [data-cursor], .cursor-pointer');
      isHovered = Boolean(interactive);
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('input[type="text"], textarea')) {
        isOverInput = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
    >
      {/* Precision Micro Dot (Direct, Zero Lag) */}
      <div
        ref={dotRef}
        style={{ willChange: 'transform, opacity' }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none mix-blend-difference opacity-0 transition-opacity duration-150"
      />

      {/* Minimalist Micro Ring Follower */}
      <div
        ref={ringRef}
        style={{ willChange: 'transform, opacity' }}
        className="fixed top-0 left-0 w-5 h-5 rounded-full border border-white/50 pointer-events-none mix-blend-difference opacity-0 transition-opacity duration-150"
      />
    </div>
  );
};
