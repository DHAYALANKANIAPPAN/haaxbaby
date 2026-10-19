import React from 'react';
import { useAudio } from '../../hooks/useAudio';
import { Volume2, VolumeX } from 'lucide-react';

export const MasterMuteButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      onClick={toggleMute}
      id="btn-master-mute"
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Sound Muted (Click to Unmute)' : 'Sound On (Click to Mute)'}
      className={`relative group flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-200 select-none shadow-md active:scale-95 ${
        isMuted
          ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 hover:bg-rose-900/90'
          : 'bg-indigo-950/80 border-purple-400/50 text-purple-200 hover:bg-purple-900/80 hover:text-white'
      } ${className}`}
    >
      {isMuted ? (
        <>
          <VolumeX className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono font-medium">Muted</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium">Sound On</span>
        </>
      )}
    </button>
  );
};
