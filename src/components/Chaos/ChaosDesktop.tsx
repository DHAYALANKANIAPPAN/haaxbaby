import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAudio } from '../../hooks/useAudio';
import {
  Sparkles,
  Minus,
  Square,
  X,
  Volume2,
  VolumeX,
  Clock,
  Smartphone,
} from 'lucide-react';

interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface ChaosDesktopProps {
  children?: React.ReactNode;
  isChaosMode: boolean;
  toggleChaosMode: () => void;
  // Specific sections passed to render inside windows / mobile deck
  nebupipSection?: React.ReactNode;
  storySection?: React.ReactNode;
  projectsSection?: React.ReactNode;
  guestbookSection?: React.ReactNode;
  onOpenPassport?: () => void;
}

export const ChaosDesktop: React.FC<ChaosDesktopProps> = ({
  children,
  isChaosMode,
  toggleChaosMode,
  nebupipSection,
  storySection,
  projectsSection,
  guestbookSection,
  onOpenPassport,
}) => {
  const { isMuted, toggleMute, playSfx } = useAudio();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'character' | 'story' | 'projects' | 'guestbook'>('character');

  // Initial window layouts
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    nebupip: {
      id: 'nebupip',
      title: 'Pluto_LiveCam.exe',
      icon: '🌌',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 30,
      y: 20,
      width: 440,
      height: 480,
      zIndex: 10,
    },
    story: {
      id: 'story',
      title: 'DreamScroll_v1.0.txt',
      icon: '📜',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 500,
      y: 20,
      width: 540,
      height: 460,
      zIndex: 9,
    },
    projects: {
      id: 'projects',
      title: 'Stardust_Creations.app',
      icon: '🛠️',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 80,
      y: 120,
      width: 680,
      height: 480,
      zIndex: 11,
    },
    guestbook: {
      id: 'guestbook',
      title: 'Guestbook_Wall.htm',
      icon: '📖',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 200,
      y: 160,
      width: 600,
      height: 440,
      zIndex: 12,
    },
  });

  const [topZIndex, setTopZIndex] = useState(15);
  const desktopRef = useRef<HTMLDivElement | null>(null);

  // Live retro clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const bringToFront = useCallback((id: string) => {
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((curr) => ({
        ...curr,
        [id]: { ...curr[id], zIndex: nextZ, isMinimized: false },
      }));
      return nextZ;
    });
  }, []);

  const toggleWindowOpen = (id: string) => {
    playSfx('pop');
    setWindows((curr) => {
      const win = curr[id];
      const willBeOpen = !win.isOpen;
      return {
        ...curr,
        [id]: {
          ...win,
          isOpen: willBeOpen,
          isMinimized: false,
          zIndex: willBeOpen ? topZIndex + 1 : win.zIndex,
        },
      };
    });
    setTopZIndex((z) => z + 1);
  };

  const toggleMinimize = (id: string) => {
    playSfx('pop');
    setWindows((curr) => ({
      ...curr,
      [id]: { ...curr[id], isMinimized: !curr[id].isMinimized },
    }));
  };

  const toggleMaximize = (id: string) => {
    playSfx('chime');
    setWindows((curr) => ({
      ...curr,
      [id]: { ...curr[id], isMaximized: !curr[id].isMaximized },
    }));
  };

  // Dragging logic for floating windows
  const handleDragStart = (id: string, startEvent: React.MouseEvent | React.TouchEvent) => {
    bringToFront(id);
    const win = windows[id];
    if (win.isMaximized) return;

    const isTouch = 'touches' in startEvent;
    const startClientX = isTouch ? startEvent.touches[0].clientX : startEvent.clientX;
    const startClientY = isTouch ? startEvent.touches[0].clientY : startEvent.clientY;
    const startX = win.x;
    const startY = win.y;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const isTouchMove = 'touches' in moveEvent;
      const clientX = isTouchMove ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = isTouchMove ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const dx = clientX - startClientX;
      const dy = clientY - startClientY;

      const desktopWidth = desktopRef.current?.clientWidth || 1000;
      const desktopHeight = desktopRef.current?.clientHeight || 700;

      // Prevent windows from being dragged offscreen or becoming permanently inaccessible
      const maxX = Math.max(0, desktopWidth - 100);
      const maxY = Math.max(0, desktopHeight - 50);

      const newX = Math.max(0, Math.min(maxX, startX + dx));
      const newY = Math.max(0, Math.min(maxY, startY + dy));

      setWindows((curr) => ({
        ...curr,
        [id]: { ...curr[id], x: newX, y: newY },
      }));
    };

    const handleEnd = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
  };

  const resetWindows = () => {
    playSfx('chime');
    setWindows({
      nebupip: {
        id: 'nebupip',
        title: 'Pluto_LiveCam.exe',
        icon: '🌌',
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        x: 30,
        y: 20,
        width: 440,
        height: 480,
        zIndex: 10,
      },
      story: {
        id: 'story',
        title: 'DreamScroll_v1.0.txt',
        icon: '📜',
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        x: 500,
        y: 20,
        width: 540,
        height: 460,
        zIndex: 9,
      },
      projects: {
        id: 'projects',
        title: 'Stardust_Creations.app',
        icon: '🛠️',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        x: 80,
        y: 120,
        width: 680,
        height: 480,
        zIndex: 11,
      },
      guestbook: {
        id: 'guestbook',
        title: 'Guestbook_Wall.htm',
        icon: '📖',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        x: 200,
        y: 160,
        width: 600,
        height: 440,
        zIndex: 12,
      },
    });
    setTopZIndex(15);
  };

  if (!isChaosMode) {
    // Normal Mode: renders children in standard cozy web view
    return <>{children}</>;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-purple-500/30">
      
      {/* =========================================================================
          DESKTOP VIEW (>= 768px): 90s/00s Nostalgic OS Draggable Desktop
          ========================================================================= */}
      <div
        ref={desktopRef}
        className="hidden md:block relative w-full h-[calc(100vh-44px)] bg-[#0b1021] overflow-hidden select-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(147, 51, 234, 0.15), transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      >
        {/* Desktop Retro Icons Column */}
        <div className="absolute top-4 left-4 flex flex-col gap-5 z-0">
          
          <button
            onClick={() => {
              bringToFront('nebupip');
              setWindows((w) => ({ ...w, nebupip: { ...w.nebupip, isOpen: true, isMinimized: false } }));
            }}
            className="group flex flex-col items-center w-20 text-center p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <div className="text-3xl mb-1 filter drop-shadow">🌌</div>
            <span className="text-[11px] font-mono text-purple-200 group-hover:text-white px-1 rounded bg-black/40">
              Pluto.exe
            </span>
          </button>

          <button
            onClick={() => {
              bringToFront('story');
              setWindows((w) => ({ ...w, story: { ...w.story, isOpen: true, isMinimized: false } }));
            }}
            className="group flex flex-col items-center w-20 text-center p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <div className="text-3xl mb-1 filter drop-shadow">📜</div>
            <span className="text-[11px] font-mono text-purple-200 group-hover:text-white px-1 rounded bg-black/40">
              Chronicles.txt
            </span>
          </button>

          <button
            onClick={() => {
              bringToFront('projects');
              setWindows((w) => ({ ...w, projects: { ...w.projects, isOpen: true, isMinimized: false } }));
            }}
            className="group flex flex-col items-center w-20 text-center p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <div className="text-3xl mb-1 filter drop-shadow">🛠️</div>
            <span className="text-[11px] font-mono text-purple-200 group-hover:text-white px-1 rounded bg-black/40">
              Creations.app
            </span>
          </button>

          <button
            onClick={() => {
              bringToFront('guestbook');
              setWindows((w) => ({ ...w, guestbook: { ...w.guestbook, isOpen: true, isMinimized: false } }));
            }}
            className="group flex flex-col items-center w-20 text-center p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <div className="text-3xl mb-1 filter drop-shadow">📖</div>
            <span className="text-[11px] font-mono text-purple-200 group-hover:text-white px-1 rounded bg-black/40">
              Guestbook.htm
            </span>
          </button>

          {onOpenPassport && (
            <button
              onClick={() => {
                playSfx('chime');
                onOpenPassport();
              }}
              className="group flex flex-col items-center w-20 text-center p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
            >
              <div className="text-3xl mb-1 filter drop-shadow">🪪</div>
              <span className="text-[11px] font-mono text-amber-200 group-hover:text-white px-1 rounded bg-black/40">
                Passport.reg
              </span>
            </button>
          )}

        </div>

        {/* Floating Draggable Windows */}
        {Object.values(windows).map((win) => {
          if (!win.isOpen || win.isMinimized) return null;

          const isMax = win.isMaximized;
          const style: React.CSSProperties = isMax
            ? {
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: win.zIndex,
                position: 'absolute',
              }
            : {
                top: `${win.y}px`,
                left: `${win.x}px`,
                width: `${win.width}px`,
                height: `${win.height}px`,
                zIndex: win.zIndex,
                position: 'absolute',
              };

          return (
            <div
              key={win.id}
              onClick={() => bringToFront(win.id)}
              style={style}
              className="flex flex-col bg-[#141b2d] rounded-t-lg rounded-b shadow-2xl border-2 border-slate-600/80 overflow-hidden"
            >
              {/* Retro OS Window Titlebar */}
              <div
                onMouseDown={(e) => handleDragStart(win.id, e)}
                onTouchStart={(e) => handleDragStart(win.id, e)}
                className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 cursor-move border-b border-purple-500/40 select-none"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{win.icon}</span>
                  <span className="text-xs font-mono font-bold tracking-wide text-purple-100">
                    {win.title}
                  </span>
                </div>

                {/* Window Actions */}
                <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleMinimize(win.id)}
                    className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-600"
                    title="Minimize"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => toggleMaximize(win.id)}
                    className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-600"
                    title={isMax ? 'Restore' : 'Maximize'}
                  >
                    <Square className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() => toggleWindowOpen(win.id)}
                    className="w-5 h-5 rounded flex items-center justify-center bg-rose-900/60 hover:bg-rose-700 text-rose-200 text-xs border border-rose-600/60"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Window Content Pane */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-950/90 text-slate-200">
                {win.id === 'nebupip' && (
                  <div>
                    {nebupipSection || (
                      <div className="p-4 text-center text-xs font-mono text-purple-300">
                        Pluto living viewport mounted.
                      </div>
                    )}
                  </div>
                )}
                {win.id === 'story' && (
                  <div>
                    {storySection || (
                      <div className="p-4 text-center text-xs font-mono text-purple-300">
                        The Dream-Weaver Chronicles.
                      </div>
                    )}
                  </div>
                )}
                {win.id === 'projects' && (
                  <div>
                    {projectsSection || (
                      <div className="p-4 text-center text-xs font-mono text-purple-300">
                        Star-Craft Inventions.
                      </div>
                    )}
                  </div>
                )}
                {win.id === 'guestbook' && (
                  <div>
                    {guestbookSection || (
                      <div className="p-4 text-center text-xs font-mono text-purple-300">
                        Live Dream Guestbook Wall.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Start Menu Popup */}
        {startMenuOpen && (
          <div className="absolute bottom-2 left-2 w-64 bg-slate-900 border-2 border-purple-500/50 rounded-lg shadow-2xl p-2 z-50 animate-fade-in font-mono text-xs">
            <div className="p-2 border-b border-purple-500/30 flex items-center gap-2 text-purple-200 font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Pluto OS v1.0</span>
            </div>
            <div className="py-2 flex flex-col gap-1">
              <button
                onClick={() => {
                  bringToFront('nebupip');
                  setWindows((w) => ({ ...w, nebupip: { ...w.nebupip, isOpen: true, isMinimized: false } }));
                  setStartMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-purple-900/50 text-left text-slate-200"
              >
                <span>🌌</span>
                <span>Launch Pluto Cam</span>
              </button>
              <button
                onClick={() => {
                  bringToFront('story');
                  setWindows((w) => ({ ...w, story: { ...w.story, isOpen: true, isMinimized: false } }));
                  setStartMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-purple-900/50 text-left text-slate-200"
              >
                <span>📜</span>
                <span>Open Dream Chronicles</span>
              </button>
              <button
                onClick={() => {
                  bringToFront('projects');
                  setWindows((w) => ({ ...w, projects: { ...w.projects, isOpen: true, isMinimized: false } }));
                  setStartMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-purple-900/50 text-left text-slate-200"
              >
                <span>🛠️</span>
                <span>Open Stardust Lab</span>
              </button>
              <button
                onClick={() => {
                  bringToFront('guestbook');
                  setWindows((w) => ({ ...w, guestbook: { ...w.guestbook, isOpen: true, isMinimized: false } }));
                  setStartMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-purple-900/50 text-left text-slate-200"
              >
                <span>📖</span>
                <span>Open Guestbook Wall</span>
              </button>
              {onOpenPassport && (
                <button
                  onClick={() => {
                    playSfx('chime');
                    onOpenPassport();
                    setStartMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-amber-900/50 text-left text-amber-200"
                >
                  <span>🪪</span>
                  <span>View Baby Passport</span>
                </button>
              )}
            </div>
            <div className="pt-2 border-t border-purple-500/30 space-y-1">
              <button
                onClick={() => {
                  resetWindows();
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-purple-900/50 text-left text-slate-200"
                title="Reset all windows to default positions"
              >
                <span>🔄 Reset Window Layout</span>
              </button>
              <button
                onClick={() => {
                  toggleChaosMode();
                  setStartMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-200"
              >
                <span>Exit Chaos Mode</span>
                <span>⏻</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          DESKTOP TASKBAR (Windows 95/98 Aesthetic)
          ========================================================================= */}
      <div className="hidden md:flex h-11 bg-slate-900/95 border-t-2 border-slate-700/80 px-2 items-center justify-between z-40 select-none shadow-lg">
        {/* Left: Start Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSfx('pop');
              setStartMenuOpen((o) => !o);
            }}
            id="chaos-start-btn"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 border border-purple-400/50 text-white font-mono font-bold text-xs shadow active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Start</span>
          </button>

          {/* Open Window Tabs on Taskbar */}
          <div className="flex items-center gap-1">
            {Object.values(windows).map((win) => {
              if (!win.isOpen) return null;
              const isActive = !win.isMinimized;
              return (
                <button
                  key={win.id}
                  onClick={() => {
                    if (win.isMinimized) {
                      bringToFront(win.id);
                    } else {
                      toggleMinimize(win.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition border ${
                    isActive
                      ? 'bg-purple-900/60 border-purple-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{win.icon}</span>
                  <span className="truncate max-w-[100px]">{win.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: System Tray */}
        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <button
            onClick={toggleMute}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={toggleChaosMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-950/80 border border-purple-400/40 text-purple-200 hover:text-white text-[11px]"
            title="Switch back to Cozy Bedtime view"
          >
            <Smartphone className="w-3 h-3" />
            <span>Cozy View</span>
          </button>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-purple-200 text-[11px]">
            <Clock className="w-3 h-3 text-purple-400" />
            <span>{currentTime || '11:11 PM'}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE / TABLET VIEW (< 768px): Touch-Friendly Bedtime Card Deck
          ========================================================================= */}
      <div className="md:hidden flex flex-col min-h-screen p-4 pb-20 space-y-4">
        
        {/* Mobile Header Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border border-purple-400/30 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <div>
              <h2 className="text-sm font-bold text-white">Chaos Mode: Bedtime Deck</h2>
              <p className="text-[10px] font-mono text-purple-300">Collapsed into touch cards</p>
            </div>
          </div>
          <button
            onClick={toggleChaosMode}
            className="px-2.5 py-1 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold shadow"
          >
            Exit Chaos
          </button>
        </div>

        {/* Mobile Bedtime Deck Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-purple-500/20 text-xs font-mono">
          <button
            onClick={() => setActiveMobileTab('character')}
            className={`py-2 rounded-xl transition ${
              activeMobileTab === 'character' ? 'bg-purple-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            🌌 Sprout
          </button>
          <button
            onClick={() => setActiveMobileTab('story')}
            className={`py-2 rounded-xl transition ${
              activeMobileTab === 'story' ? 'bg-purple-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            📜 Story
          </button>
          <button
            onClick={() => setActiveMobileTab('projects')}
            className={`py-2 rounded-xl transition ${
              activeMobileTab === 'projects' ? 'bg-purple-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            🛠️ Toys
          </button>
          <button
            onClick={() => setActiveMobileTab('guestbook')}
            className={`py-2 rounded-xl transition ${
              activeMobileTab === 'guestbook' ? 'bg-purple-600 text-white font-bold' : 'text-purple-300'
            }`}
          >
            📖 Wall
          </button>
        </div>

        {/* Active Mobile Card Display */}
        <div className="flex-1 bg-slate-900/80 border border-slate-700/60 rounded-3xl p-4 shadow-xl backdrop-blur-md">
          {activeMobileTab === 'character' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-purple-500/20 pb-2">
                <span className="text-xs font-mono text-purple-300">CARD 01: PLUTO CAM</span>
                {onOpenPassport && (
                  <button
                    onClick={() => {
                      playSfx('chime');
                      onOpenPassport();
                    }}
                    className="text-xs font-serif text-amber-300 underline"
                  >
                    View Passport 🪪
                  </button>
                )}
              </div>
              {nebupipSection}
            </div>
          )}

          {activeMobileTab === 'story' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-purple-300 block border-b border-purple-500/20 pb-2">
                CARD 02: THE DREAM-WEAVER CHRONICLES
              </span>
              {storySection}
            </div>
          )}

          {activeMobileTab === 'projects' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-purple-300 block border-b border-purple-500/20 pb-2">
                CARD 03: STAR-CRAFT INVENTIONS
              </span>
              {projectsSection}
            </div>
          )}

          {activeMobileTab === 'guestbook' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-purple-300 block border-b border-purple-500/20 pb-2">
                CARD 04: CELESTIAL GUESTBOOK
              </span>
              {guestbookSection}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
