import React, { useState, useRef, useEffect, useCallback } from 'react';
import { projects } from '../../data/characterSheet';
import { useAudio } from '../../hooks/useAudio';
import { Sparkles, Cloud, Stars, Music, RotateCcw, Volume2, CheckCircle2, Wand2 } from 'lucide-react';

export const ProjectsShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(projects[0].id);
  const { playSfx } = useAudio();

  return (
    <section id="projects-showcase" className="relative w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/40 border border-indigo-400/30 text-indigo-200 text-xs font-mono uppercase tracking-widest mb-3">
          <Wand2 className="w-3.5 h-3.5 text-indigo-300" />
          Section 05 • What They Made
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pluto's Star-Craft Inventions
        </h2>
        <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2">
          Interactive micro-toys hand-crafted by the apprentice dream-weaver to catch static and cultivate peace.
        </p>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {projects.map((proj) => {
            const isActive = activeTab === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  playSfx('pop');
                  setActiveTab(proj.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-300 text-white shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                {proj.demoType === 'cloud' && <Cloud className="w-4 h-4 text-cyan-300" />}
                {proj.demoType === 'stars' && <Stars className="w-4 h-4 text-amber-300" />}
                {proj.demoType === 'sound' && <Music className="w-4 h-4 text-pink-300" />}
                <span>{proj.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Demo Display Area */}
      <div className="bg-slate-900/90 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {activeTab === 'cloud-fluff-weaver' && <CloudWeaverDemo project={projects[0]} />}
        {activeTab === 'constellation-color-sorter' && <ConstellationSorterDemo project={projects[1]} />}
        {activeTab === 'midnight-slumber-box' && <SlumberBoxDemo project={projects[2]} />}
      </div>
    </section>
  );
};

/* ---------------- MICRO-DEMO 1: Cloud-Fluff Weaver ---------------- */
interface CloudParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
}

const PASTEL_COLORS = ['#F5B8C8', '#CDB8E8', '#B9D0F4', '#FFE49A', '#B8D9C0'];

const CloudWeaverDemo: React.FC<{ project: (typeof projects)[0] }> = ({ project }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<CloudParticle[]>([]);
  const isDrawingRef = useRef(false);
  const [particleCount, setParticleCount] = useState(0);
  const { playSfx } = useAudio();

  const addParticle = useCallback((x: number, y: number) => {
    const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    particlesRef.current.push({
      x,
      y,
      radius: Math.random() * 18 + 12,
      color,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      alpha: 0.85,
    });
    if (particlesRef.current.length > 200) {
      particlesRef.current.shift();
    }
    setParticleCount(particlesRef.current.length);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.fillStyle = 'rgba(15, 17, 35, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.0015;

        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    playSfx('pop');
    const rect = e.currentTarget.getBoundingClientRect();
    addParticle(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    addParticle(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    playSfx('rattle');
    particlesRef.current = [];
    setParticleCount(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const seedBreeze = () => {
    playSfx('chime');
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let i = 0; i < 30; i++) {
      addParticle(Math.random() * canvas.width, Math.random() * canvas.height);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{project.tag}</span>
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={seedBreeze}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Puff Breeze</span>
          </button>
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition active:scale-95 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Canvas Playground */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0b0d1e] shadow-inner select-none">
        <canvas
          ref={canvasRef}
          width={720}
          height={320}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-64 sm:h-80 cursor-crosshair touch-none"
        />
        <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] font-mono text-purple-300/80 bg-slate-900/80 px-2.5 py-1 rounded-full border border-purple-500/20 backdrop-blur-xs">
          ☁️ Click & Drag to weave cloud-fluff • Fluff particles: {particleCount}
        </div>
      </div>
    </div>
  );
};

/* ---------------- MICRO-DEMO 2: Constellation Sorter ---------------- */
interface StarItem {
  id: number;
  type: 'gold' | 'lavender' | 'mint';
  name: string;
  colorClass: string;
  glowClass: string;
}

const ConstellationSorterDemo: React.FC<{ project: (typeof projects)[0] }> = ({ project }) => {
  const { playSfx } = useAudio();
  const [stars, setStars] = useState<StarItem[]>(() => generateStars());
  const [sortedCounts, setSortedCounts] = useState({ gold: 0, lavender: 0, mint: 0 });
  const [completed, setCompleted] = useState(false);

  function generateStars(): StarItem[] {
    const types: ('gold' | 'lavender' | 'mint')[] = ['gold', 'lavender', 'mint', 'gold', 'lavender', 'mint', 'gold', 'mint'];
    return types.map((t, i) => ({
      id: Date.now() + i,
      type: t,
      name: t === 'gold' ? 'Solar Flare' : t === 'lavender' ? 'Astral Lilac' : 'Aurora Mint',
      colorClass: t === 'gold' ? 'text-amber-300 bg-amber-500/20 border-amber-400' : t === 'lavender' ? 'text-purple-300 bg-purple-500/20 border-purple-400' : 'text-emerald-300 bg-emerald-500/20 border-emerald-400',
      glowClass: t === 'gold' ? 'shadow-amber-500/30' : t === 'lavender' ? 'shadow-purple-500/30' : 'shadow-emerald-500/30',
    }));
  }

  const handleSortStar = (star: StarItem, targetJar: 'gold' | 'lavender' | 'mint') => {
    if (star.type === targetJar) {
      playSfx('chime');
      setSortedCounts((prev) => {
        const next = { ...prev, [targetJar]: prev[targetJar] + 1 };
        const total = next.gold + next.lavender + next.mint;
        if (total >= 8) {
          setCompleted(true);
        }
        return next;
      });
      setStars((prev) => prev.filter((s) => s.id !== star.id));
    } else {
      playSfx('pop');
    }
  };

  const resetGame = () => {
    playSfx('rattle');
    setStars(generateStars());
    setSortedCounts({ gold: 0, lavender: 0, mint: 0 });
    setCompleted(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{project.tag}</span>
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">{project.description}</p>
        </div>
        <button
          onClick={resetGame}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition active:scale-95 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Twinkle Batch</span>
        </button>
      </div>

      {completed && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-emerald-500/20 border border-amber-400/50 flex items-center justify-between text-xs sm:text-sm text-amber-200 animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span className="font-bold">Constellations Aligned! The cosmic frequency is in perfect harmony.</span>
          </div>
          <button onClick={resetGame} className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs">
            Sort Again
          </button>
        </div>
      )}

      {/* Sorting Target Jars */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {/* Jar 1: Solar Gold */}
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 flex flex-col items-center text-center shadow-lg">
          <span className="text-xs font-mono uppercase text-amber-300 font-bold mb-1">Solar Gold</span>
          <div className="w-12 h-16 rounded-b-2xl border-2 border-amber-400/80 bg-amber-900/30 flex items-center justify-center text-amber-300 font-bold text-lg shadow-inner">
            {sortedCounts.gold}
          </div>
          <span className="text-[10px] text-amber-300/70 font-mono mt-1">Target: Gold</span>
        </div>

        {/* Jar 2: Lavender Dream */}
        <div className="p-3.5 rounded-2xl bg-purple-950/20 border-2 border-purple-500/40 flex flex-col items-center text-center shadow-lg">
          <span className="text-xs font-mono uppercase text-purple-300 font-bold mb-1">Astral Lilac</span>
          <div className="w-12 h-16 rounded-b-2xl border-2 border-purple-400/80 bg-purple-900/30 flex items-center justify-center text-purple-300 font-bold text-lg shadow-inner">
            {sortedCounts.lavender}
          </div>
          <span className="text-[10px] text-purple-300/70 font-mono mt-1">Target: Lilac</span>
        </div>

        {/* Jar 3: Mint Aurora */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/40 flex flex-col items-center text-center shadow-lg">
          <span className="text-xs font-mono uppercase text-emerald-300 font-bold mb-1">Aurora Mint</span>
          <div className="w-12 h-16 rounded-b-2xl border-2 border-emerald-400/80 bg-emerald-900/30 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-inner">
            {sortedCounts.mint}
          </div>
          <span className="text-[10px] text-emerald-300/70 font-mono mt-1">Target: Mint</span>
        </div>
      </div>

      {/* Floating Unsorted Stars */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 min-h-[160px] flex flex-wrap items-center justify-center gap-3">
        {stars.length === 0 ? (
          <p className="text-xs font-mono text-purple-300/60 italic">All stars sorted into their harmonic celestial jars! ✨</p>
        ) : (
          stars.map((star) => (
            <div
              key={star.id}
              className={`p-2.5 rounded-xl border ${star.colorClass} ${star.glowClass} shadow-md flex items-center gap-2 select-none transition-transform hover:scale-105`}
            >
              <Stars className="w-4 h-4 animate-spin-slow" />
              <span className="text-xs font-mono font-medium">{star.name}</span>
              <div className="flex gap-1 ml-1">
                <button
                  onClick={() => handleSortStar(star, 'gold')}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 hover:bg-amber-500/60 text-amber-200"
                  title="Send to Gold"
                >
                  G
                </button>
                <button
                  onClick={() => handleSortStar(star, 'lavender')}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 hover:bg-purple-500/60 text-purple-200"
                  title="Send to Lilac"
                >
                  L
                </button>
                <button
                  onClick={() => handleSortStar(star, 'mint')}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 hover:bg-emerald-500/60 text-emerald-200"
                  title="Send to Mint"
                >
                  M
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ---------------- MICRO-DEMO 3: The Midnight Slumber Box ---------------- */
const SlumberBoxDemo: React.FC<{ project: (typeof projects)[0] }> = ({ project }) => {
  const { playSfx, isPlayingLullaby, toggleLullaby } = useAudio();
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const chimeKeys = [
    { id: 1, note: 'C5', name: 'Starlight', freq: 523.25, color: 'from-amber-400 to-yellow-500' },
    { id: 2, note: 'D5', name: 'Moonbeam', freq: 587.33, color: 'from-purple-400 to-indigo-500' },
    { id: 3, note: 'E5', name: 'Dewdrop', freq: 659.25, color: 'from-cyan-400 to-blue-500' },
    { id: 4, note: 'G5', name: 'Comet', freq: 783.99, color: 'from-pink-400 to-rose-500' },
    { id: 5, note: 'A5', name: 'Serenity', freq: 880.0, color: 'from-emerald-400 to-teal-500' },
  ];

  const playTone = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    } catch {
      // Ignore audio context initialization failures
    }
  };

  const handleKeyTap = (key: (typeof chimeKeys)[0]) => {
    setActiveKey(key.id);
    playTone(key.freq);
    playSfx('chime');
    setTimeout(() => setActiveKey(null), 300);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">{project.tag}</span>
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">{project.description}</p>
        </div>
        <button
          onClick={toggleLullaby}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md active:scale-95 ${
            isPlayingLullaby
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingLullaby ? 'Pause Lullaby Wind' : 'Wind Music Box'}</span>
        </button>
      </div>

      {/* Vintage Wooden Slumber Box Visual Chassis */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2a1708] via-[#1a0e05] to-[#0d0702] border-4 border-amber-900/60 shadow-2xl relative overflow-hidden">
        {/* Brass corner trim */}
        <div className="absolute top-2 left-2 text-amber-500/40 text-xs">⚜</div>
        <div className="absolute top-2 right-2 text-amber-500/40 text-xs">⚜</div>
        <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs">⚜</div>
        <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs">⚜</div>

        {/* Music Cylinder Gears Animation */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className={`w-12 h-12 rounded-full border-4 border-dashed border-amber-500/60 flex items-center justify-center ${isPlayingLullaby ? 'animate-spin' : ''}`}>
            <span className="text-xs font-mono text-amber-300">⚙</span>
          </div>
          <div className="w-32 h-6 rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 border border-amber-400/40 flex items-center justify-around px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
          </div>
          <div className={`w-12 h-12 rounded-full border-4 border-dashed border-amber-500/60 flex items-center justify-center ${isPlayingLullaby ? 'animate-spin-reverse' : ''}`}>
            <span className="text-xs font-mono text-amber-300">⚙</span>
          </div>
        </div>

        {/* Chime Tines (Pentatonic Bells) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 mt-4 pt-4 border-t border-amber-900/40">
          {chimeKeys.map((k) => {
            const isHit = activeKey === k.id;
            return (
              <button
                key={k.id}
                onClick={() => handleKeyTap(k)}
                className={`flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-200 select-none shadow-md ${
                  isHit
                    ? 'scale-95 bg-amber-300 text-slate-950 shadow-amber-300/50'
                    : 'bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200'
                }`}
              >
                <span className="text-[10px] font-mono opacity-70">{k.note}</span>
                <div className={`w-2 h-12 sm:h-16 rounded-full bg-gradient-to-b ${k.color} my-1 shadow-xs`} />
                <span className="text-[11px] font-serif font-bold tracking-tight">{k.name}</span>
              </button>
            );
          })}
        </div>

        <p className="text-center text-[11px] font-mono text-amber-400/60 mt-4">
          🎵 Tap individual brass tines or wind the main cylinder for continuous astral lullabies.
        </p>
      </div>
    </div>
  );
};
