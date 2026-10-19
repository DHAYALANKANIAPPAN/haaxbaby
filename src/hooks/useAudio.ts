import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { AudioContextType } from '../types';

const defaultAudioContext: AudioContextType = {
  isMuted: false,
  toggleMute: () => {},
  playSfx: () => {},
  isPlayingLullaby: false,
  toggleLullaby: () => {},
};

export const AudioContext = createContext<AudioContextType>(defaultAudioContext);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('nebupip_muted');
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [isPlayingLullaby, setIsPlayingLullaby] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lullabyOscsRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const lullabyTimerRef = useRef<number | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('nebupip_muted', String(next));
      } catch {
        // Ignore local storage error
      }
      return next;
    });
  }, []);

  const playSfx = useCallback((type: 'giggle' | 'chime' | 'rattle' | 'pop') => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'chime') {
        // Pentatonic cascade
        const freqs = [659.25, 783.99, 987.77, 1318.51];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          gain.gain.setValueAtTime(0, now + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.5);
        });
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.07);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'giggle') {
        // Cute double chirp
        [0, 0.11, 0.22].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const baseFreq = 700 + idx * 120;
          osc.frequency.setValueAtTime(baseFreq, now + offset);
          osc.frequency.linearRampToValueAtTime(baseFreq + 250, now + offset + 0.08);

          gain.gain.setValueAtTime(0.12, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + offset);
          osc.stop(now + offset + 0.1);
        });
      } else if (type === 'rattle') {
        // Shaker rattle noise burst
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3500;
        filter.Q.value = 3;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
      }
    } catch {
      // Audio autoplay or web audio policy catch
    }
  }, [isMuted, getAudioContext]);

  // Gentle procedural lullaby generator
  const stopLullaby = useCallback(() => {
    if (lullabyTimerRef.current) {
      window.clearInterval(lullabyTimerRef.current);
      lullabyTimerRef.current = null;
    }
    lullabyOscsRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.linearRampToValueAtTime(0.0001, (audioCtxRef.current?.currentTime || 0) + 0.2);
        osc.stop((audioCtxRef.current?.currentTime || 0) + 0.25);
      } catch {
        // Ignore
      }
    });
    lullabyOscsRef.current = [];
    setIsPlayingLullaby(false);
  }, []);

  const startLullaby = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    setIsPlayingLullaby(true);

    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63];
    let noteIdx = 0;

    const playNote = () => {
      if (isMuted) return;
      try {
        const curCtx = getAudioContext();
        if (!curCtx) return;
        const now = curCtx.currentTime;
        const osc = curCtx.createOscillator();
        const gain = curCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx % notes.length], now);
        noteIdx++;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(curCtx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      } catch {
        // Safe catch
      }
    };

    playNote();
    lullabyTimerRef.current = window.setInterval(playNote, 1400);
  }, [getAudioContext, isMuted]);

  const toggleLullaby = useCallback(() => {
    if (isPlayingLullaby) {
      stopLullaby();
    } else {
      startLullaby();
    }
  }, [isPlayingLullaby, startLullaby, stopLullaby]);

  useEffect(() => {
    if (isMuted && isPlayingLullaby) {
      stopLullaby();
    }
  }, [isMuted, isPlayingLullaby, stopLullaby]);

  useEffect(() => {
    return () => {
      if (lullabyTimerRef.current) {
        clearInterval(lullabyTimerRef.current);
      }
    };
  }, []);

  const value: AudioContextType = {
    isMuted,
    toggleMute,
    playSfx,
    isPlayingLullaby,
    toggleLullaby,
  };

  return React.createElement(AudioContext.Provider, { value }, children);
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    return defaultAudioContext;
  }
  return context;
}
