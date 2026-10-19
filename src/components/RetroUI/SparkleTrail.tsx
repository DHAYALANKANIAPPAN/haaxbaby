import React, { useEffect, useRef } from 'react';

const PARTICLES = ['✨', '⭐', '💫', '✦'];
const STARLIGHT_COLORS = [
  '#fef08a', // starlight yellow
  '#a7f3d0', // starlight mint
  '#fbcfe8', // starlight bubble pink
  '#fed7aa', // starlight peach
  '#c4b5fd', // starlight lavender
];

export const SparkleTrail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let rafId: number | null = null;
    let particleIndex = 0;
    const timeouts = new Set<ReturnType<typeof setTimeout>>();

    const spawnParticle = (x: number, y: number) => {
      if (!container) return;

      if (container.childElementCount >= 16) {
        const oldest = container.firstElementChild;
        if (oldest) container.removeChild(oldest);
      }

      const particleChar = PARTICLES[particleIndex % PARTICLES.length];
      const particleColor =
        STARLIGHT_COLORS[particleIndex % STARLIGHT_COLORS.length];
      particleIndex++;

      const el = document.createElement('span');
      el.textContent = particleChar;
      el.className = 'stardust-particle';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = particleColor;
      el.style.textShadow = `0 0 6px ${particleColor}80`;

      container.appendChild(el);

      const handleCleanup = () => {
        if (el.parentNode === container) {
          container.removeChild(el);
        }
      };

      el.addEventListener('animationend', handleCleanup, { once: true });
      const timer = setTimeout(handleCleanup, 520);
      timeouts.add(timer);
    };

    const handlePointerMove = (e: MouseEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distSq = dx * dx + dy * dy;

      if (distSq < 144 && now - lastTime < 40) {
        return;
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      const clientX = e.clientX;
      const clientY = e.clientY;
      rafId = requestAnimationFrame(() => {
        spawnParticle(clientX, clientY);
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      timeouts.forEach((timer) => clearTimeout(timer));
      timeouts.clear();
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes stardustParticleFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          40% {
            opacity: 0.9;
            transform: translate(-50%, -60%) scale(1.15) rotate(12deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -85%) scale(0.25) rotate(28deg);
          }
        }
        .stardust-particle {
          position: absolute;
          pointer-events: none;
          user-select: none;
          font-size: 13px;
          line-height: 1;
          will-change: transform, opacity;
          animation: stardustParticleFade 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      />
    </>
  );
};
