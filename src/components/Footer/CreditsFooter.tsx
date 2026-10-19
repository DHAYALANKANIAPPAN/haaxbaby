import React from 'react';
import { HitCounter } from '../RetroUI/HitCounter';
import { Sparkles, Heart, ShieldCheck, Code2 } from 'lucide-react';

export const CreditsFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-purple-500/20 bg-slate-950/80 backdrop-blur-md py-8 px-4 sm:px-8 mt-16 text-slate-400 font-mono text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Project & Lore info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Pluto: Cosmic Sprout Baby</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-sm">
            haX.baby Hackathon • Track 2: Your Own Baby. 100% Original character entity weaving astral static into sweet dreams.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[10px] text-purple-300/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> License: MIT
            </span>
            <span>•</span>
            <span>Code Freeze: 19 Oct 2026, 17:17 IST</span>
          </div>
        </div>

        {/* Center: Vintage Mechanical Hit Counter */}
        <div className="flex flex-col items-center gap-1">
          <HitCounter />
          <span className="text-[10px] text-slate-400">Persistent Early-Web Meter (+1 pt)</span>
        </div>

        {/* Right: Author & Credits */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1">
          <div className="flex items-center gap-1.5 text-purple-200">
            <Code2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Built by <strong className="text-white">Dhaya, Meena & Akshitha</strong></span>
          </div>
          <p className="text-[10px] text-slate-400">
            Tech Lead Rig & Audio (Dhaya) • Lore & Chaos Mode (Meena) • Nostalgia & DevOps (Akshitha)
          </p>
          <div className="flex items-center gap-1 text-[10px] text-amber-300/90 font-serif italic pt-1">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>"Even the smallest star lights up the biggest dream!"</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
