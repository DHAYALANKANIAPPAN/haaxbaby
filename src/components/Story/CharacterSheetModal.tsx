import React, { useEffect, useRef, useState } from 'react';
import { characterSheet } from '../../data/characterSheet';
import { useAudio } from '../../hooks/useAudio';
import { X, Sparkles, Award, Star, Compass, Feather, Moon, Bookmark, Stamp } from 'lucide-react';
import plutoImg from '../../assets/pluto.png';

interface CharacterSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Section 04: Character Sheet & Celestial Identity Passport
 * Whimsical vintage baby passport / celestial identity booklet for Pluto
 * Suggested Palette:
 * - Midnight navy: #202747
 * - Soft mint:     #B8D9C0
 * - Cream:         #FFF4E7
 * - Lavender:      #CDB8E8
 * - Baby blue:     #B9D0F4
 * - Warm yellow:   #FFE49A
 * - Soft pink:     #F5B8C8
 */
export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({ isOpen, onClose }) => {
  const { playSfx } = useAudio();
  const [stampActive, setStampActive] = useState(false);
  const [stampCount, setStampCount] = useState(0);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Focus management and body scroll locking
  useEffect(() => {
    if (isOpen) {
      playSfx('chime');

      // Prevent background scrolling while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus the close button for accessibility
      const focusTimeout = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          playSfx('pop');
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(focusTimeout);
      };
    }
  }, [isOpen, onClose, playSfx]);

  if (!isOpen) return null;

  const handleSealClick = () => {
    playSfx('chime');
    setStampActive(true);
    setStampCount((prev) => prev + 1);
    setTimeout(() => setStampActive(false), 900);
  };

  const handleClose = () => {
    playSfx('pop');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="passport-title"
      aria-describedby="passport-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#202747]/80 backdrop-blur-md animate-fade-in motion-reduce:animate-none overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Outer Passport / Celestial Booklet */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl my-auto bg-gradient-to-br from-[#FFF4E7] via-[#FFF9F2] to-[#F5ECE0] text-[#202747] rounded-3xl shadow-2xl border-4 border-[#CDB8E8]/70 p-5 sm:p-8 max-h-[92vh] overflow-y-auto selection:bg-[#B9D0F4]/40 outline-none"
      >
        {/* Subtle decorative inner border & corner ornaments */}
        <div className="pointer-events-none absolute inset-2.5 rounded-2xl border-2 border-dashed border-[#202747]/20" />
        
        {/* Corner Celestial Ornaments */}
        <div className="pointer-events-none absolute top-4 left-4 text-[#CDB8E8] text-lg select-none">✦</div>
        <div className="pointer-events-none absolute top-4 right-4 text-[#CDB8E8] text-lg select-none">✦</div>
        <div className="pointer-events-none absolute bottom-4 left-4 text-[#CDB8E8] text-lg select-none">✦</div>
        <div className="pointer-events-none absolute bottom-4 right-4 text-[#CDB8E8] text-lg select-none">✦</div>

        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          id="btn-close-passport"
          aria-label="Close Character Passport"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FFF4E7] hover:bg-[#FFE49A]/50 border-2 border-[#202747]/30 text-[#202747] transition-all hover:scale-105 active:scale-95 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#CDB8E8]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Passport Header: Vintage Celestial Identity Booklet */}
        <header className="text-center pb-4 mb-5 border-b-2 border-[#202747]/15 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9D0F4]/30 border border-[#B9D0F4] text-xs font-mono tracking-widest text-[#202747] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE49A] fill-[#FFE49A]" />
            <span>Celestial Identity Booklet • Doc #001-PLUTO</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FFE49A] fill-[#FFE49A]" />
          </div>

          <h2
            id="passport-title"
            className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-[#202747] uppercase"
          >
            Cosmic Baby Passport
          </h2>

          <p
            id="passport-desc"
            className="text-xs sm:text-sm font-serif italic text-[#202747]/80 mt-1 max-w-md mx-auto"
          >
            Official 5-Point Character Sheet & Dream-Weaver Emergence Registry
          </p>
        </header>

        {/* Passport Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative z-10">
          
          {/* Left Column: Pluto's Portrait & Astral Badges */}
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* Passport Photo Frame */}
            <div className="relative group w-40 h-52 sm:w-48 sm:h-56 rounded-2xl bg-gradient-to-b from-[#202747] via-[#2A345E] to-[#171B33] border-4 border-[#FFE49A] shadow-lg p-2 flex flex-col items-center justify-center overflow-hidden">

              {/* Twinkling ambient star aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,228,154,0.18),transparent_70%)] pointer-events-none" />
              
              {/* Official Pluto Character Photo */}
              <img
                src={plutoImg}
                alt="Pluto: Cosmic Sprout Baby"
                className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105 rounded-xl drop-shadow-md select-none"
              />

              {/* Photo Label Bar */}
              <div className="absolute bottom-1.5 px-2.5 py-0.5 rounded-full bg-[#202747]/90 border border-[#FFE49A]/60 text-[9px] text-[#FFE49A] font-mono tracking-widest uppercase z-20 shadow-xs">
                PHOTO ID: PLUTO ★
              </div>
            </div>

            {/* Clickable Astral Birth Wax Seal & Stamping */}
            <div
              onClick={handleSealClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSealClick();
                }
              }}
              className={`cursor-pointer transition-all duration-300 select-none ${
                stampActive ? 'scale-110 rotate-6' : 'hover:scale-105'
              }`}
              title="Click to stamp official cosmic birth seal!"
              aria-label="Authenticate with cosmic birth seal"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#991B1B] via-[#B91C1C] to-[#7F1D1D] border-2 border-[#FFE49A] shadow-md flex flex-col items-center justify-center text-[#FFF4E7] p-1 relative">
                <div className="absolute inset-1 rounded-full border border-dashed border-[#FFE49A]/60" />
                <Award className="w-6 h-6 text-[#FFE49A]" />
                <span className="text-[7.5px] font-black tracking-widest uppercase mt-0.5">ASTRAL SEAL</span>
                <span className="text-[6.5px] text-[#FFE49A] font-mono">
                  {stampActive ? 'STAMPED!' : 'AUTHENTIC'}
                </span>
              </div>
            </div>

            {/* Official Postal Origin Stamp */}
            <div className="px-3 py-1.5 rounded-xl border-2 border-dashed border-[#202747]/30 bg-[#B8D9C0]/20 text-[10px] font-mono text-[#202747] flex items-center gap-1.5">
              <Stamp className="w-3.5 h-3.5 text-[#202747]/70" />
              <span>ORIGIN: SNEEZED STAR</span>
            </div>

            <p className="text-[10px] text-[#202747]/70 font-mono">
              Certification Stamps: <span className="font-bold text-[#202747]">{stampCount}</span>
            </p>
          </div>

          {/* Right Column: Exactly The 5 Mandatory Character Details */}
          <div className="md:col-span-2 space-y-3.5 font-serif text-sm">
            
            {/* Field 1: Name */}
            <div className="bg-[#FFF4E7] p-3.5 rounded-2xl border-2 border-[#CDB8E8]/60 shadow-xs">
              <span className="text-xs uppercase tracking-wider text-[#202747]/70 font-bold block mb-0.5 flex items-center gap-1.5 font-mono">
                <Star className="w-3.5 h-3.5 text-[#FFE49A] fill-[#FFE49A]" />
                Point 1 • Character Name
              </span>
              <p className="text-2xl font-black text-[#202747] font-serif tracking-wide flex items-center justify-between">
                <span>{characterSheet.name}</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#B8D9C0]/40 border border-[#B8D9C0] text-[#202747]">
                  Apprentice Level 1
                </span>
              </p>
            </div>

            {/* Field 2 & Field 3: Species & Calling Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Field 2: What They Are */}
              <div className="bg-[#FFF4E7] p-3 rounded-2xl border-2 border-[#B9D0F4]/60 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#202747]/70 font-bold block mb-0.5 flex items-center gap-1.5 font-mono">
                  <Compass className="w-3.5 h-3.5 text-[#B9D0F4]" />
                  Point 2 • What They Are
                </span>
                <p className="text-base font-bold text-[#202747]">
                  {characterSheet.whatTheyAre}
                </p>
              </div>

              {/* Field 3: What They Do */}
              <div className="bg-[#FFF4E7] p-3 rounded-2xl border-2 border-[#CDB8E8]/60 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#202747]/70 font-bold block mb-0.5 flex items-center gap-1.5 font-mono">
                  <Feather className="w-3.5 h-3.5 text-[#CDB8E8]" />
                  Point 3 • What They Do
                </span>
                <p className="text-base font-bold text-[#202747]">
                  {characterSheet.whatTheyDo}
                </p>
              </div>
            </div>

            {/* Field 4: Origin Story */}
            <div className="bg-[#FFF4E7] p-3.5 rounded-2xl border-2 border-[#B8D9C0]/60 shadow-xs relative overflow-hidden">
              <div className="absolute top-1 right-2 text-2xl text-[#B8D9C0]/30 select-none">🌱</div>
              <span className="text-[11px] uppercase tracking-wider text-[#202747]/70 font-bold block mb-1 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#FFE49A] fill-[#FFE49A]" />
                Point 4 • Origin Story
              </span>
              <p className="text-sm text-[#202747] leading-relaxed font-serif font-semibold italic">
                "{characterSheet.story}"
              </p>
              <div className="mt-2 pt-2 border-t border-[#202747]/10 flex items-center justify-between text-[11px] font-mono text-[#202747]/60">
                <span>Constellation: Petit Sprout</span>
                <span>Coordinates: 00° Sneeze Nebula</span>
              </div>
            </div>

            {/* Field 5: Tagline / Motto */}
            <div className="bg-gradient-to-r from-[#FFE49A]/30 via-[#FFF4E7] to-[#FFE49A]/30 p-3.5 rounded-2xl border-2 border-[#FFE49A] shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#202747]/70 font-bold block mb-1 font-mono flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#FFE49A]" />
                Point 5 • Official Tagline
              </span>
              <p className="text-sm sm:text-base font-extrabold text-[#202747] tracking-wide font-serif">
                ✨ "{characterSheet.tagline}"
              </p>
            </div>

            {/* Celestial Passport Badges Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#CDB8E8]/30 border border-[#CDB8E8] text-[10px] font-mono text-[#202747]">
                <Moon className="w-3 h-3 text-[#202747]" />
                Theta-Wave Dreamer
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#B8D9C0]/30 border border-[#B8D9C0] text-[10px] font-mono text-[#202747]">
                🌱 Sprout-Guaranteed
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5B8C8]/30 border border-[#F5B8C8] text-[10px] font-mono text-[#202747]">
                💖 Pure Kindness
              </span>
            </div>

          </div>

        </div>

        {/* Modal Footer / Passport Sign-off */}
        <footer className="mt-6 pt-3 border-t border-[#202747]/15 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-[#202747]/70 gap-2">
          <span>COSMIC PASSPORT • SECTION 04 CHARACTER SHEET</span>
          <span>STATUS: OFFICIAL CITIZEN OF THE DREAMWAYS</span>
        </footer>

      </div>
    </div>
  );
};
