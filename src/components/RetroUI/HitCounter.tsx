import React, { useEffect, useState } from 'react';
import { useVisitorMemory } from '../../hooks/useVisitorMemory';

/**
 * HitCounter — Vintage Mechanical Odometer Hit Counter (+1 pt Side Quest)
 *
 * Visually renders: "Dreams Delivered: 001,248"
 * Featuring vintage mechanical rolling tumbler barrels, bevel cylinder shadows,
 * screen reader accessibility, and prefers-reduced-motion compliance.
 */
export const HitCounter: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { visitCount } = useVisitorMemory();
  const [hasMounted, setHasMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }

      const timer = setTimeout(() => setHasMounted(true), 60);

      return () => {
        clearTimeout(timer);
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  const baseCount = 1247 + (visitCount > 0 ? visitCount : 1);
  const padded = String(baseCount).padStart(6, '0');
  const displayString = `${padded.slice(0, 3)},${padded.slice(3)}`;
  const chars = displayString.split('');

  return (
    <div
      role="group"
      aria-label={`Dreams Delivered: ${displayString}`}
      title={`Vintage Mechanical Odometer: Dreams Delivered ${displayString}`}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border-2 border-slate-700 shadow-inner select-none font-mono ${className}`}
    >
      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
        Dreams Delivered:
      </span>

      <span className="sr-only">Dreams Delivered: {displayString}</span>

      <div
        aria-hidden="true"
        className="relative flex items-center bg-neutral-950 border border-neutral-700 px-1 py-0.5 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 z-10" />

        {chars.map((char, index) => {
          if (char === ',') {
            return (
              <span
                key={`comma-${index}`}
                className="w-1.5 text-center text-amber-300 font-mono font-bold text-xs leading-5"
              >
                ,
              </span>
            );
          }

          const targetDigit = parseInt(char, 10);
          const shouldAnimate = hasMounted && !prefersReducedMotion;

          return (
            <div
              key={`digit-${index}`}
              className="relative w-4 h-6 sm:w-5 sm:h-7 mx-[1px] overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-sm border border-slate-700/80 shadow-sm"
            >
              <div
                className="flex flex-col transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: shouldAnimate
                    ? `translateY(-${targetDigit * 10}%)`
                    : prefersReducedMotion
                    ? `translateY(-${targetDigit * 10}%)`
                    : 'translateY(0%)',
                  transitionDelay: shouldAnimate ? `${index * 60}ms` : '0ms',
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <span
                    key={digit}
                    className="w-4 h-6 sm:w-5 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-black text-amber-300"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
