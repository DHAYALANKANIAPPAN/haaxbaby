import { useState, useEffect } from 'react';
import type { VisitorState } from '../types';

/**
 * Storage keys used for tracking local device visits.
 * Tracks visits local to this browser and device only via localStorage.
 */
const STORAGE_KEY = 'nebupip_visit_count';
const SESSION_GUARD_KEY = 'nebupip_session_visit_recorded';

const FIRST_VISIT_GREETING = "Welcome, Starlight Traveler! Pluto is waking up to weave dreams with you! ✨";

// In-memory guard to avoid double-counting during React StrictMode effect replay
let hasRecordedThisSessionInMemory = false;

export function useVisitorMemory(): VisitorState {
  const [visitorState, setVisitorState] = useState<VisitorState>({
    visitCount: 1,
    isReturning: false,
    greeting: FIRST_VISIT_GREETING,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      let isSessionAlreadyRecorded = hasRecordedThisSessionInMemory;

      try {
        if (sessionStorage.getItem(SESSION_GUARD_KEY) === '1') {
          isSessionAlreadyRecorded = true;
        }
      } catch {
        // Fallback to in-memory guard
      }

      const rawStored = localStorage.getItem(STORAGE_KEY);
      let parsedCount = rawStored ? parseInt(rawStored, 10) : 0;

      if (isNaN(parsedCount) || parsedCount < 0) {
        parsedCount = 0;
      }

      let currentCount: number;

      if (!isSessionAlreadyRecorded) {
        currentCount = parsedCount + 1;
        try {
          localStorage.setItem(STORAGE_KEY, String(currentCount));
        } catch {
          // Ignore
        }

        hasRecordedThisSessionInMemory = true;
        try {
          sessionStorage.setItem(SESSION_GUARD_KEY, '1');
        } catch {
          // Ignore
        }
      } else {
        currentCount = Math.max(parsedCount, 1);
      }

      const isReturning = currentCount > 1;
      const greeting = isReturning
        ? `Welcome back, Dreamer! Pluto remembered you! 🌟 (Visit #${currentCount})`
        : FIRST_VISIT_GREETING;

      setVisitorState({
        visitCount: currentCount,
        isReturning,
        greeting,
      });
    } catch {
      setVisitorState({
        visitCount: 1,
        isReturning: false,
        greeting: FIRST_VISIT_GREETING,
      });
    }
  }, []);

  return visitorState;
}
