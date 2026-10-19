import React, { useState, useEffect, useRef } from 'react';
import type { CharacterProps, EyeOffset } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { Sparkles, Heart } from 'lucide-react';
import plutoImg from '../../assets/pluto.png';

/**
 * Pluto: Cosmic Sprout Baby Interactive Rig
 * Replaces old Nebupip model with official Pluto artwork
 */
export const Nebupip: React.FC<CharacterProps> = ({
  mood,
  isMuted = false,
  onPoke,
  onEasterEggTrigger,
  className = '',
}) => {
  const { playSfx } = useAudio();
  const [isBlushing, setIsBlushing] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const [, setEyeOffset] = useState<EyeOffset>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Eye / cursor tracking
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const dist = Math.min(6, Math.hypot(deltaX, deltaY) / 25);

      setEyeOffset({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  const handleCharacterClick = () => {
    if (!isMuted) {
      playSfx('giggle');
    }
    setIsBlushing(true);
    setIsWiggling(true);
    const nextPokes = pokeCount + 1;
    setPokeCount(nextPokes);

    if (onPoke) onPoke();

    if (nextPokes >= 5 && onEasterEggTrigger) {
      playSfx('chime');
      onEasterEggTrigger();
    }

    setTimeout(() => setIsWiggling(false), 600);
    setTimeout(() => setIsBlushing(false), 2000);
  };

  // Color schemes based on mood
  const moodTheme = {
    day: {
      auraGlow: 'radial-gradient(circle, rgba(253, 224, 71, 0.45) 0%, rgba(244, 184, 200, 0.25) 50%, transparent 70%)',
      ringColor: '#FFE49A',
    },
    night: {
      auraGlow: 'radial-gradient(circle, rgba(205, 184, 232, 0.5) 0%, rgba(185, 208, 244, 0.3) 50%, transparent 70%)',
      ringColor: '#CDB8E8',
    },
    dreaming: {
      auraGlow: 'radial-gradient(circle, rgba(245, 184, 200, 0.55) 0%, rgba(184, 217, 192, 0.35) 50%, transparent 70%)',
      ringColor: '#B8D9C0',
    },
  }[mood];

  return (
    <div
      ref={containerRef}
      onClick={handleCharacterClick}
      className={`relative inline-flex flex-col items-center cursor-pointer select-none group transition-transform ${className}`}
      title="Click Pluto to poke tummy and hear a giggle!"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCharacterClick();
        }
      }}
      aria-label="Pluto: The Cosmic Sprout Baby. Click to poke and interact."
    >
      {/* Ambient Starlight Dream Aura */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-700 pointer-events-none scale-125"
        style={{ background: moodTheme.auraGlow }}
      />

      {/* Floating Hearts / Sparkles on Poke */}
      {isWiggling && (
        <div className="absolute -top-8 flex gap-2 animate-bounce pointer-events-none z-30">
          <Heart className="w-6 h-6 text-[#F5B8C8] fill-[#F5B8C8] drop-shadow-md" />
          <Sparkles className="w-5 h-5 text-[#FFE49A] fill-[#FFE49A] drop-shadow-md" />
        </div>
      )}

      {/* Pluto Character Frame & Rig */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex flex-col items-center justify-center">
        {/* Orbiting Starlight Halo */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed opacity-40 animate-spin-slow pointer-events-none"
          style={{ borderColor: moodTheme.ringColor }}
        />

        {/* Floating Twinkling Stars */}
        <div className="absolute top-1 left-3 text-[#FFE49A] text-sm animate-pulse pointer-events-none">✦</div>
        <div className="absolute bottom-5 right-3 text-[#F5B8C8] text-sm animate-pulse delay-500 pointer-events-none">✦</div>
        <div className="absolute top-4 right-2 text-[#B9D0F4] text-base animate-pulse delay-700 pointer-events-none">★</div>

        {/* Soft Celestial Portrait Frame */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-[#CDB8E8]/40 bg-gradient-to-b from-[#202747]/80 via-[#1E2442]/90 to-[#14182E] shadow-2xl p-2.5 flex items-center justify-center">
          <img
            src={plutoImg}
            alt="Pluto: Cosmic Sprout Baby"
            className={`w-full h-full object-contain relative z-10 transition-transform duration-300 drop-shadow-[0_10px_22px_rgba(255,228,154,0.35)] ${
              isWiggling ? 'animate-wiggle scale-108' : 'group-hover:scale-105'
            } motion-reduce:transition-none motion-reduce:animate-none`}
            draggable={false}
          />

          {/* Gentle cloud pillow base */}
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#14182E] via-[#14182E]/70 to-transparent pointer-events-none z-15" />
        </div>

        {/* Rosy Blush overlay when poked */}
        {isBlushing && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <span className="text-3xl animate-ping opacity-90">💖</span>
          </div>
        )}
      </div>

      {/* Interactive Status Pill */}
      <span className="text-[11px] font-mono text-[#FFF4E7]/90 bg-[#202747]/80 px-3.5 py-1 rounded-full border border-[#CDB8E8]/30 backdrop-blur-xs mt-2 shadow-sm transition-colors group-hover:border-[#FFE49A]">
        ✨ Click to poke Pluto • Mood: <span className="text-[#FFE49A] capitalize">{mood}</span>
      </span>
    </div>
  );
};

// Also export Pluto alias for clean future imports
export const Pluto = Nebupip;
