import { useState } from 'react';
import type { CharacterMood } from './types';
import { AudioProvider, useAudio } from './hooks/useAudio';
import { useVisitorMemory } from './hooks/useVisitorMemory';
import { Nebupip } from './components/Character/Nebupip';
import { DialogueBox } from './components/Character/DialogueBox';
import { CharacterSheetModal } from './components/Story/CharacterSheetModal';
import { StoryJourney } from './components/Story/StoryJourney';
import { ProjectsShowcase } from './components/Story/ProjectsShowcase';
import { GuestbookWall } from './components/RetroUI/GuestbookWall';
import { ChaosDesktop } from './components/Chaos/ChaosDesktop';
import { MasterMuteButton } from './components/Audio/MasterMuteButton';
import { SparkleTrail } from './components/RetroUI/SparkleTrail';
import { CreditsFooter } from './components/Footer/CreditsFooter';
import { Sun, Moon, Sparkles, Monitor, Award } from 'lucide-react';

function MainApp() {
  const [mood, setMood] = useState<CharacterMood>('night');
  const [isChaosMode, setIsChaosMode] = useState<boolean>(false);
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [easterEggActive, setEasterEggActive] = useState<boolean>(false);
  const { playSfx } = useAudio();
  const { greeting } = useVisitorMemory();

  const handleMoodCycle = () => {
    playSfx('chime');
    setMood((prev) => {
      if (prev === 'day') return 'night';
      if (prev === 'night') return 'dreaming';
      return 'day';
    });
  };

  const toggleChaosMode = () => {
    playSfx('pop');
    setIsChaosMode((prev) => !prev);
  };

  const handleOpenPassport = () => {
    playSfx('chime');
    setIsPassportOpen(true);
  };

  // Modular sections for clean composition in normal view or Chaos Desktop windows
  const characterSection = (
    <div className="flex flex-col items-center justify-center space-y-6 py-6">
      <DialogueBox mood={mood} />
      <Nebupip
        mood={mood}
        onPoke={() => playSfx('giggle')}
        onEasterEggTrigger={() => setEasterEggActive(true)}
      />
    </div>
  );

  const storySection = <StoryJourney />;
  const projectsSection = <ProjectsShowcase />;
  const guestbookSection = <GuestbookWall />;

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between selection:bg-purple-500/30">
      {/* Stardust Sparkle Cursor Trail (+2 pts) */}
      <SparkleTrail />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-purple-500/20 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin-slow">🌌</span>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
                Pluto
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200">
                  Track 2
                </span>
              </h1>
              <span className="text-[11px] font-serif italic text-purple-300/80">Cosmic Sprout Baby • Apprentice Dream-Weaver</span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 5-Point Character Sheet / Passport Button */}
            <button
              onClick={handleOpenPassport}
              id="btn-open-passport"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-serif font-bold transition active:scale-95 shadow-sm"
              title="Open Section 04 5-Point Character Sheet Passport"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Character Passport</span>
              <span className="sm:hidden">Passport</span>
            </button>

            {/* Day / Night / Dreaming Mood Toggle */}
            <button
              onClick={handleMoodCycle}
              id="btn-mood-cycle"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-900/80 border border-purple-400/30 text-purple-200 text-xs font-mono transition active:scale-95"
              title={`Current mood: ${mood}. Click to cycle!`}
            >
              {mood === 'day' && <Sun className="w-3.5 h-3.5 text-yellow-300" />}
              {mood === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
              {mood === 'dreaming' && <Sparkles className="w-3.5 h-3.5 text-pink-300" />}
              <span className="capitalize">{mood}</span>
            </button>

            {/* Responsive Chaos Mode Toggle (+5 pts) */}
            <button
              onClick={toggleChaosMode}
              id="btn-toggle-chaos"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition active:scale-95 ${
                isChaosMode
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-300 text-white shadow-md shadow-pink-500/30'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Toggle Responsive Chaos Mode (+5 pts)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isChaosMode ? '90s OS Mode Active' : 'Chaos Mode (+5)'}</span>
              <span className="md:hidden">Chaos</span>
            </button>

            {/* Master Mute Button */}
            <MasterMuteButton />

          </div>

        </div>
      </header>

      {/* Main Content Area: Responsive Chaos Mode OR Cozy Normal Layout */}
      {isChaosMode ? (
        <ChaosDesktop
          isChaosMode={isChaosMode}
          toggleChaosMode={toggleChaosMode}
          nebupipSection={characterSection}
          storySection={storySection}
          projectsSection={projectsSection}
          guestbookSection={guestbookSection}
          onOpenPassport={handleOpenPassport}
        />
      ) : (
        <main className="flex-1 flex flex-col space-y-16 py-8">
          
          {/* Hero Character Section */}
          <section className="relative px-4 text-center max-w-4xl mx-auto w-full">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/30 border border-purple-400/30 text-purple-200 text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Living Entity • Tier 1 & 2 Interactive Character Rig
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-300 text-xs font-mono shadow-sm">
                <span>{greeting}</span>
              </div>
            </div>
            
            {characterSection}
          </section>

          {/* Section 05: Visual Story Scenes */}
          {storySection}

          {/* Section 05: What They Made (Interactive Micro-Demos) */}
          {projectsSection}

          {/* Bonus (+2 pts): Live Persistent Dream Guestbook Wall */}
          {guestbookSection}

        </main>
      )}

      {/* Section 04: 5-Point Character Sheet Modal */}
      <CharacterSheetModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
      />

      {/* Easter Egg Modal */}
      {easterEggActive && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setEasterEggActive(false)}
        >
          <div
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 border-2 border-pink-400 max-w-md text-center shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl animate-bounce">🌟</div>
            <h3 className="text-xl font-bold text-pink-200">Cosmic Secret Unlocked!</h3>
            <p className="text-xs text-purple-200 font-sans leading-relaxed">
              You poked Pluto 5 times! A burst of warm starlight sprinkles has blessed your screen with eternal sweet daydreams.
            </p>
            <button
              onClick={() => {
                playSfx('pop');
                setEasterEggActive(false);
              }}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
            >
              Hooray! 💖
            </button>
          </div>
        </div>
      )}

      {/* Credits Footer */}
      <CreditsFooter />

    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MainApp />
    </AudioProvider>
  );
}
