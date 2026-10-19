// Shared TypeScript Types for Nebupip: The Cosmic Dream-Sprout

export type CharacterMood = 'day' | 'night' | 'dreaming';

export interface EyeOffset {
  x: number;
  y: number;
}

export interface CharacterProps {
  mood: CharacterMood;
  isMuted?: boolean;
  onPoke?: () => void;
  onEasterEggTrigger?: () => void;
  className?: string;
}

export interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (type: 'giggle' | 'chime' | 'rattle' | 'pop') => void;
  isPlayingLullaby: boolean;
  toggleLullaby: () => void;
}

export interface CharacterSheetData {
  name: string;
  whatTheyAre: string;
  whatTheyDo: string;
  story: string;
  tagline: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  demoType: 'cloud' | 'stars' | 'sound';
}

export interface StoryScene {
  id: number;
  title: string;
  subtitle: string;
  text: string;
}

export interface GuestbookWish {
  id: string;
  name: string;
  wish: string;
  color: string;
  createdAt: string;
}

export interface VisitorState {
  visitCount: number;
  isReturning: boolean;
  greeting: string;
}
