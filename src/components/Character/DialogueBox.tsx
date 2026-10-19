import React, { useState } from 'react';
import type { CharacterMood } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { Sparkles } from 'lucide-react';

interface DialogueBoxProps {
  mood: CharacterMood;
  className?: string;
}

interface DialogueItem {
  id: string;
  topic: string;
  icon: string;
  text: string;
  sfx: 'giggle' | 'chime' | 'pop' | 'rattle';
  dayText?: string;
  nightText?: string;
  dreamText?: string;
}

const dialogueBank: DialogueItem[] = [
  {
    id: 'stars',
    topic: 'Ask about stars',
    icon: '⭐',
    sfx: 'chime',
    text: "Pipu! When a little star gets sleepy, it wraps itself in a violet nebula blanket and snores in sparkles! Shhh, listen close!",
    dayText: "During the day, stars play cosmic hide-and-seek behind the blue sky! They're still there, winking just for you!",
    nightText: "*whispers* Look up! The stars are polishing their lanterns so you won't bump your toes in dreamland.",
    dreamText: "I'm swimming with a comet family right now! The baby comet is tickling my roots with golden tails!",
  },
  {
    id: 'lullaby',
    topic: 'Sing a lullaby',
    icon: '🎵',
    sfx: 'giggle',
    text: "*giggle-wiggles* La-la-loo, moonbeam shoe, night-night sleepy cloud to you! Close your eyes and count three flying star-sheep!",
    dayText: "Tra-la-la! Little sunny beam, dancing on a stream! Even afternoon naps deserve a soft nursery rhyme!",
    nightText: "Hush-a-bye, velvet sky, little dream-sprout watches nearby... drift away, safe and sound...",
    dreamText: "♪ Mmmm-mmm-loo... the moon is humming theta waves... feel how soft the astral wind is...",
  },
  {
    id: 'bedtime',
    topic: 'Bedtime tip',
    icon: '🌙',
    sfx: 'chime',
    text: "Puff your pillow three times and whisper your biggest secret to the moon. No monsters are allowed past my starlight shield!",
    dayText: "Bedtime tip for tonight: take three deep deep breaths. Inhale starlight, exhale any static crackles!",
    nightText: "Tuck your toes under the blanket. The warm static-catcher is already spinning sweet dreams above your pillow.",
    dreamText: "If you meet a scary thought, tap your nose twice! It'll turn into a floating lavender bubble and *POP*!",
  },
  {
    id: 'poke',
    topic: 'Poke tummy',
    icon: '🍓',
    sfx: 'giggle',
    text: "*squeal giggle* Wheee! My tummy is ticklish! You just shook loose three baby stardust embers all over your screen!",
    dayText: "*burble chuckle* Hehehe! That tickles like solar wind on my sprout leaves!",
    nightText: "*sleepy chuckle* Heehee... quiet giggles so we don't wake the slumbering satellites...",
    dreamText: "*purrrr* Tickles feel like warm chamomile tea in dream-space!",
  },
  {
    id: 'dream-yarn',
    topic: 'Secret wish',
    icon: '✨',
    sfx: 'pop',
    text: "Make a wish right now in your heart! I'll catch it with my sprout antennae and plant it in the Stardust Garden!",
    dayText: "Wishes made in the morning grow all day long in the astral soil!",
    nightText: "Night wishes are the sweetest! The moon keeps them safe in a crystal jar until morning.",
    dreamText: "Your wish just landed in my hands! It glows like a tiny peach lantern. I will guard it forever!",
  },
];

export const DialogueBox: React.FC<DialogueBoxProps> = ({ mood, className = '' }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('stars');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { playSfx } = useAudio();

  // Pick text based on topic and mood
  const getDialogueText = (item: DialogueItem, currentMood: CharacterMood) => {
    if (currentMood === 'day' && item.dayText) return item.dayText;
    if (currentMood === 'night' && item.nightText) return item.nightText;
    if (currentMood === 'dreaming' && item.dreamText) return item.dreamText;
    return item.text;
  };

  const currentItem = dialogueBank.find((d) => d.id === selectedTopic) || dialogueBank[0];
  const activeText = getDialogueText(currentItem, mood);

  const handleSelectTopic = (item: DialogueItem) => {
    if (item.id === selectedTopic) return;
    playSfx(item.sfx);
    setIsTyping(true);
    setSelectedTopic(item.id);
    setTimeout(() => {
      setIsTyping(false);
    }, 150);
  };

  return (
    <div className={`relative max-w-md mx-auto z-20 ${className}`}>
      {/* Speech Bubble Container */}
      <div className="relative bg-gradient-to-b from-purple-900/90 via-slate-900/95 to-indigo-950/90 border-2 border-purple-400/50 rounded-3xl p-5 shadow-2xl backdrop-blur-md transition-all duration-300">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-2 mb-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span className="font-bold tracking-wider uppercase">Pluto Whispers</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/30 text-[10px] text-purple-300 uppercase">
            {mood === 'day' ? '☀️ Daytime Chirp' : mood === 'night' ? '🌙 Nighttime Hush' : '✨ Dreaming Deep'}
          </span>
        </div>

        {/* Dynamic Bubble Content */}
        <div className="min-h-[70px] flex items-center justify-center text-center px-2 py-1">
          <p
            className={`text-sm sm:text-base font-sans font-medium text-purple-100 leading-relaxed transition-opacity duration-200 ${
              isTyping ? 'opacity-20 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            "{activeText}"
          </p>
        </div>

        {/* Interactive Topic Pill Buttons */}
        <div className="mt-4 pt-3 border-t border-purple-500/20">
          <p className="text-[10px] font-mono text-purple-300/60 uppercase tracking-widest text-center mb-2">
            Click a topic to talk with Pluto:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {dialogueBank.map((item) => {
              const isSelected = selectedTopic === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTopic(item)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 border ${
                    isSelected
                      ? 'bg-purple-500 border-purple-200 text-white shadow-md shadow-purple-500/30 scale-105'
                      : 'bg-purple-950/40 hover:bg-purple-900/60 border-purple-500/30 text-purple-200/80 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.topic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speech Bubble Tail pointing down to Pluto */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-purple-400/50" />
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-indigo-950" />
      </div>
    </div>
  );
};
