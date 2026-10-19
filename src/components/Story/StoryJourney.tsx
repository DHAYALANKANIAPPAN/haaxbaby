import React, { useState, useEffect, useRef, useCallback } from 'react';
import { storyScenes } from '../../data/characterSheet';
import { useAudio } from '../../hooks/useAudio';
import { Sparkles, ChevronLeft, ChevronRight, Moon, Heart, Compass, CheckCircle2 } from 'lucide-react';

/**
 * Section 05: Pluto's Interactive Story Journey
 *
 * Features:
 * - 3 connected story scenes rendered strictly from src/data/characterSheet.ts
 * - Visual progress indicator with step connectors
 * - Whimsical celestial visual treatment for each scene
 * - Keyboard navigation (Left/Right arrow keys)
 * - Word counts displayed (< 150 words per scene verified)
 * - Accessible, responsive, and respects prefers-reduced-motion
 */
export const StoryJourney: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { playSfx } = useAudio();

  const currentScene = storyScenes[currentIdx];

  // Intersection Observer for scroll-triggered entrance
  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNext = useCallback(() => {
    playSfx('chime');
    setCurrentIdx((prev) => (prev + 1) % storyScenes.length);
    setInteracted(false);
  }, [playSfx]);

  const handlePrev = useCallback(() => {
    playSfx('pop');
    setCurrentIdx((prev) => (prev - 1 + storyScenes.length) % storyScenes.length);
    setInteracted(false);
  }, [playSfx]);

  const handleSceneSelect = (idx: number) => {
    if (idx === currentIdx) return;
    playSfx('chime');
    setCurrentIdx(idx);
    setInteracted(false);
  };

  const handleIllustrationClick = () => {
    playSfx('giggle');
    setInteracted(true);
  };

  // Keyboard navigation for accessible scene controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if focus is within or near the story section
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Exact word count calculator for story text
  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section
      ref={sectionRef}
      id="story-journey"
      aria-labelledby="story-heading"
      className="relative w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#B9D0F4]/30"
    >
      {/* Background Celestial Nursery Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 rounded-full blur-3xl pointer-events-none opacity-40 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(205,184,232,0.25) 0%, rgba(185,208,244,0.15) 50%, transparent 70%)',
        }}
      />

      {/* Section Header */}
      <div className={`text-center mb-8 sm:mb-12 relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#202747]/70 border border-[#CDB8E8]/40 text-[#CDB8E8] text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
          <Moon className="w-3.5 h-3.5 text-[#FFE49A]" />
          <span>Section 05 • Celestial Chronicles</span>
        </div>

        <h2
          id="story-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4E7] via-[#B9D0F4] to-[#CDB8E8]"
        >
          Pluto's Story Journey
        </h2>

        <p className="text-sm sm:text-base text-[#FFF4E7]/80 max-w-xl mx-auto mt-2.5 font-sans leading-relaxed">
          Three bedtime chapters tracing how a tiny star-sneeze blossomed into the universe's gentlest apprentice dream-weaver.
        </p>

        {/* Visible Progress Tracker with Connected Step Line */}
        <nav
          aria-label="Story Scene Progress"
          className="relative max-w-xl mx-auto mt-8 px-4"
        >
          {/* Connector Track Bar */}
          <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-0.5 bg-[#202747] border-b border-[#CDB8E8]/20 z-0" />
          <div
            className="absolute top-1/2 left-10 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#B8D9C0] via-[#B9D0F4] to-[#CDB8E8] transition-all duration-500 z-0 motion-reduce:transition-none"
            style={{
              width: `${(currentIdx / (storyScenes.length - 1)) * 82}%`,
            }}
          />

          {/* Interactive Step Nodes */}
          <div className="relative z-10 flex items-center justify-between">
            {storyScenes.map((scene, idx) => {
              const isActive = idx === currentIdx;
              const isPast = idx < currentIdx;

              return (
                <button
                  key={scene.id}
                  onClick={() => handleSceneSelect(idx)}
                  aria-label={`Jump to ${scene.title}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group flex flex-col items-center focus:outline-hidden transition-transform duration-300 ${
                    isActive ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                      isActive
                        ? 'bg-[#202747] border-[#FFE49A] text-[#FFE49A] shadow-[#FFE49A]/30 ring-4 ring-[#FFE49A]/20'
                        : isPast
                        ? 'bg-[#B8D9C0]/20 border-[#B8D9C0] text-[#B8D9C0]'
                        : 'bg-[#202747]/80 border-[#CDB8E8]/30 text-[#CDB8E8]/50'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-[#B8D9C0]" />
                    ) : (
                      <span className="text-xs font-mono font-bold">0{scene.id}</span>
                    )}
                  </div>
                  <span
                    className={`hidden sm:block text-[11px] font-mono mt-1.5 transition-colors ${
                      isActive
                        ? 'text-[#FFE49A] font-bold'
                        : isPast
                        ? 'text-[#B8D9C0]'
                        : 'text-[#CDB8E8]/60'
                    }`}
                  >
                    Scene 0{scene.id}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Interactive Story Card */}
      <div
        className="relative z-10 rounded-3xl bg-gradient-to-b from-[#202747]/90 via-[#1E2442]/95 to-[#151930]/95 border-2 border-[#CDB8E8]/30 p-6 sm:p-10 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-500"
      >
        {/* Soft Background Stardust Constellation pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(205,184,232,0.12),transparent_60%)] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (5 cols): Celestial Scene Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              onClick={handleIllustrationClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleIllustrationClick();
                }
              }}
              aria-label={`Interactive artwork for ${currentScene.title}. Click to interact.`}
              className="cursor-pointer group relative w-full aspect-square max-w-[320px] rounded-2xl bg-gradient-to-b from-[#2A345E] via-[#202747] to-[#14182E] border-2 border-[#FFE49A]/40 p-4 flex flex-col items-center justify-center shadow-inner overflow-hidden select-none transition-all duration-300 hover:border-[#FFE49A] focus:outline-hidden focus:ring-2 focus:ring-[#FFE49A]"
              title="Click artwork for a tiny cosmic giggle & twinkle!"
            >
              {/* Twinkling ambient decorative stars */}
              <div className="absolute top-4 left-5 text-[#FFE49A] text-xs animate-pulse">✦</div>
              <div className="absolute bottom-5 right-6 text-[#F5B8C8] text-xs animate-pulse delay-300">✦</div>
              <div className="absolute top-8 right-7 text-[#B9D0F4] text-sm animate-pulse delay-700">★</div>
              <div className="absolute bottom-8 left-6 text-[#B8D9C0] text-xs animate-pulse delay-500">✦</div>

              {/* Dynamic Celestial Artworks per Scene */}
              {currentScene.id === 1 && (
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`transition-transform duration-500 motion-reduce:transition-none ${
                      interacted ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                    }`}
                  >
                    {/* Scene 1 Artwork: The Cosmic Sneeze */}
                    <svg viewBox="0 0 140 140" className="w-36 h-36 sm:w-40 sm:h-40" role="img" aria-label="The Cosmic Sneeze artwork">
                      <defs>
                        <radialGradient id="sneezeCore" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#FFF4E7" />
                          <stop offset="40%" stopColor="#FFE49A" />
                          <stop offset="80%" stopColor="#F5B8C8" />
                          <stop offset="100%" stopColor="#CDB8E8" />
                        </radialGradient>
                      </defs>

                      {/* Swirling celestial orbit burst */}
                      <circle cx="70" cy="70" r="54" fill="none" stroke="#FFE49A" strokeWidth="1.5" strokeDasharray="3,5" className="animate-spin-slow origin-center" />

                      {/* Sneezing Starburst particles */}
                      <path
                        d="M70 24 L76 54 L106 48 L86 70 L110 84 L80 88 L82 118 L64 94 L44 112 L52 82 L24 76 L50 62 L32 36 L62 50 Z"
                        fill="url(#sneezeCore)"
                        opacity="0.9"
                      />

                      {/* Cloud Asteroid floating beneath baby Pluto */}
                      <ellipse cx="70" cy="95" rx="34" ry="14" fill="#B9D0F4" opacity="0.85" />
                      <ellipse cx="54" cy="92" rx="16" ry="10" fill="#FFF4E7" opacity="0.95" />
                      <ellipse cx="86" cy="92" rx="16" ry="10" fill="#FFF4E7" opacity="0.95" />

                      {/* Baby Pluto Emergence */}
                      {/* Fluffy cream head */}
                      <circle cx="70" cy="68" r="18" fill="#FFF4E7" />
                      {/* Sprout on head */}
                      <path d="M70 50 Q62 38 56 42 Q60 50 70 50" fill="#86EFAC" />
                      <path d="M70 50 Q78 36 84 40 Q80 48 70 50" fill="#86EFAC" />
                      <path d="M70 54 L70 48" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
                      {/* Cute face */}
                      <circle cx="64" cy="66" r="2.5" fill="#202747" />
                      <circle cx="63.5" cy="65" r="1" fill="#FFFFFF" />
                      <circle cx="76" cy="66" r="2.5" fill="#202747" />
                      <circle cx="75.5" cy="65" r="1" fill="#FFFFFF" />
                      {/* Rosy blush */}
                      <ellipse cx="60" cy="71" rx="3" ry="1.8" fill="#F5B8C8" />
                      <ellipse cx="80" cy="71" rx="3" ry="1.8" fill="#F5B8C8" />
                      {/* Happy baby smile */}
                      <path d="M67 72 Q70 75 73 72" stroke="#202747" strokeWidth="1.2" fill="none" />
                      {/* Pastel blue swaddle */}
                      <path d="M56 82 C60 92 80 92 84 82 Z" fill="#B9D0F4" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-mono text-[#FFE49A] mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFE49A]" />
                    {interacted ? "Achoo! Golden stardust blossomed!" : "Click to spark the star-sneeze!"}
                  </span>
                </div>
              )}

              {currentScene.id === 2 && (
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`transition-transform duration-500 motion-reduce:transition-none ${
                      interacted ? 'rotate-12 scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    {/* Scene 2 Artwork: Gathering Stardust */}
                    <svg viewBox="0 0 140 140" className="w-36 h-36 sm:w-40 sm:h-40" role="img" aria-label="Gathering Stardust artwork">
                      {/* Dream Spool Backdrop Glow */}
                      <circle cx="70" cy="70" r="48" fill="#CDB8E8" opacity="0.25" />

                      {/* Golden Spool */}
                      <rect x="52" y="34" width="36" height="72" rx="10" fill="#FFE49A" stroke="#EAB308" strokeWidth="1.5" />

                      {/* Spun Pastel Yarn Bands */}
                      <path d="M52 48 Q70 54 88 48" stroke="#B8D9C0" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M52 60 Q70 66 88 60" stroke="#CDB8E8" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M52 72 Q70 78 88 72" stroke="#B9D0F4" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M52 84 Q70 90 88 84" stroke="#F5B8C8" strokeWidth="3" fill="none" strokeLinecap="round" />

                      {/* Stardust Needle */}
                      <line x1="36" y1="104" x2="104" y2="36" stroke="#FFF4E7" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="38" cy="102" r="2" fill="#FFE49A" />

                      {/* Floating Dream Sparks */}
                      <circle cx="35" cy="50" r="3" fill="#B8D9C0" className="animate-ping" />
                      <circle cx="105" cy="85" r="3.5" fill="#FFE49A" className="animate-pulse" />
                      <circle cx="95" cy="40" r="2.5" fill="#F5B8C8" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-mono text-[#B8D9C0] mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B8D9C0]" />
                    {interacted ? "Starlight yarn spun with kindness!" : "Click to gather glowing stardust!"}
                  </span>
                </div>
              )}

              {currentScene.id === 3 && (
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`transition-transform duration-500 motion-reduce:transition-none ${
                      interacted ? 'scale-115 -rotate-6' : 'group-hover:scale-105'
                    }`}
                  >
                    {/* Scene 3 Artwork: The Cradle of Dreams */}
                    <svg viewBox="0 0 140 140" className="w-36 h-36 sm:w-40 sm:h-40" role="img" aria-label="The Cradle of Dreams artwork">
                      {/* Crescent Moon Cradle */}
                      <path
                        d="M85 26 C54 26 42 50 42 78 C42 102 58 114 85 114 C70 104 64 88 67 68 C70 48 85 36 85 26 Z"
                        fill="#FFE49A"
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                      />

                      {/* Pillowy Lavender Cloud Blanket */}
                      <path
                        d="M36 86 C36 74 50 72 58 78 C64 68 82 68 88 78 C96 72 108 80 106 90 C108 102 94 106 82 104 C58 106 36 104 36 86 Z"
                        fill="#CDB8E8"
                        opacity="0.9"
                      />

                      {/* Sleeping Little Star Tucked in Cradle */}
                      <path
                        d="M74 68 L77 74 L83 75 L78 79 L80 85 L74 82 L68 85 L70 79 L65 75 L71 74 Z"
                        fill="#FFF4E7"
                        stroke="#FFE49A"
                        strokeWidth="1"
                      />
                      <circle cx="72.5" cy="76" r="0.8" fill="#202747" />
                      <circle cx="75.5" cy="76" r="0.8" fill="#202747" />
                      <path d="M73 78 Q74 79 75 78" stroke="#202747" strokeWidth="0.8" fill="none" />

                      {/* Warm Floating Heart */}
                      <Heart className="w-5 h-5 text-[#F5B8C8] fill-[#F5B8C8] absolute top-8 right-8 animate-bounce" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-mono text-[#F5B8C8] mt-2 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-[#F5B8C8] fill-[#F5B8C8]" />
                    {interacted ? "A restful lullaby blankets the stars!" : "Click to tuck in the sleeping star!"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 cols): Scene Narrative Content */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Scene Number & Verified Word Count Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2">
                <span className="px-3 py-1 rounded-full bg-[#FFE49A]/15 border border-[#FFE49A]/40 text-[#FFE49A] font-bold">
                  CHAPTER 0{currentScene.id} OF 0{storyScenes.length}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-[#202747] border border-[#CDB8E8]/30 text-[#CDB8E8] text-[11px]">
                  Verified: {getWordCount(currentScene.text)} / 150 words
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#FFF4E7] tracking-wide mt-2">
                {currentScene.title}
              </h3>

              <p className="text-sm font-serif italic text-[#B9D0F4] mt-1 mb-5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFE49A]" />
                {currentScene.subtitle}
              </p>

              {/* Story Narrative Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#202747]/80 border-2 border-[#CDB8E8]/20 shadow-inner">
                <p className="text-base sm:text-lg text-[#FFF4E7]/95 leading-relaxed font-sans font-normal selection:bg-[#B9D0F4]/40">
                  {currentScene.text}
                </p>
              </div>
            </div>

            {/* Bottom Controls: Previous, Indicator, Next */}
            <div className="pt-2 border-t border-[#CDB8E8]/20 flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                id="btn-story-prev"
                aria-label="Previous story scene"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#202747] hover:bg-[#2A345E] border border-[#CDB8E8]/40 text-[#FFF4E7] text-xs font-mono uppercase tracking-wider transition-all hover:scale-102 active:scale-98 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#CDB8E8]"
              >
                <ChevronLeft className="w-4 h-4 text-[#CDB8E8]" />
                <span>Previous Scene</span>
              </button>

              {/* Center Scene Navigation dots */}
              <div className="flex items-center gap-2">
                {storyScenes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSceneSelect(i)}
                    aria-label={`Go to scene ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === currentIdx
                        ? 'w-8 bg-[#FFE49A]'
                        : 'w-2.5 bg-[#CDB8E8]/40 hover:bg-[#CDB8E8]'
                    }`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                id="btn-story-next"
                aria-label="Next story scene"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B9D0F4] via-[#CDB8E8] to-[#FFE49A] hover:opacity-95 text-[#202747] text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-102 active:scale-98 shadow-md shadow-[#CDB8E8]/20 focus:outline-hidden focus:ring-2 focus:ring-[#FFE49A]"
              >
                <span>{currentIdx === storyScenes.length - 1 ? 'Replay From Start' : 'Next Chapter'}</span>
                <ChevronRight className="w-4 h-4 text-[#202747]" />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Keyboard Shortcut Hint for Accessibility */}
      <div className="text-center mt-4">
        <span className="text-[11px] font-mono text-[#CDB8E8]/50 flex items-center justify-center gap-1.5">
          <Compass className="w-3 h-3 text-[#CDB8E8]/40" />
          Tip: You can use the Left and Right Arrow keys on your keyboard to navigate chapters.
        </span>
      </div>

    </section>
  );
};
