import React, { useState } from 'react';
import type { GuestbookWish } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { Send, BookOpen, Star } from 'lucide-react';

const initialWishes: GuestbookWish[] = [
  {
    id: 'wish-1',
    name: 'Astrid Star-Gazer',
    wish: 'May every weary soul find a soft lavender cloud tonight. Thank you Pluto! ✨',
    color: 'from-purple-900/40 to-indigo-900/40 border-purple-400/40',
    createdAt: 'Just now',
  },
  {
    id: 'wish-2',
    name: 'Sleepy Bear',
    wish: 'Hoping for sweet dreams about honey stars and flying marshmallow pillows! 🍯',
    color: 'from-amber-900/40 to-yellow-900/40 border-amber-400/40',
    createdAt: '12m ago',
  },
  {
    id: 'wish-3',
    name: 'Luna Pilot',
    wish: 'Static cleared! My engine hums in tune with the midnight lullaby. 🚀',
    color: 'from-cyan-900/40 to-blue-900/40 border-cyan-400/40',
    createdAt: '1h ago',
  },
];

export const GuestbookWall: React.FC = () => {
  const [wishes, setWishes] = useState<GuestbookWish[]>(() => {
    try {
      const stored = localStorage.getItem('nebupip_guestbook');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return initialWishes;
  });

  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const { playSfx } = useAudio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;

    playSfx('chime');
    const newWishItem: GuestbookWish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      wish: wish.trim(),
      color: 'from-pink-900/40 to-purple-900/40 border-pink-400/40',
      createdAt: 'Just now',
    };

    const updated = [newWishItem, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('nebupip_guestbook', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setName('');
    setWish('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-400/30 text-purple-200 text-xs font-mono uppercase tracking-widest mb-2">
          <BookOpen className="w-3.5 h-3.5 text-purple-300" />
          Bonus (+2 pts) • Live Dream Guestbook Wall
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">The Celestial Visitor Wall</h3>
        <p className="text-xs text-purple-200/70 max-w-md mx-auto mt-1">
          Leave your dream wish. Pluto catches every note and pins it to the velvet night sky.
        </p>
      </div>

      {/* Wish Submission Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            id="guestbook-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your astral name..."
            maxLength={30}
            required
            className="px-3 py-2 rounded-xl bg-purple-950/50 border border-purple-400/30 text-purple-100 placeholder-purple-300/40 text-xs sm:text-sm focus:outline-none focus:border-purple-300 font-sans"
          />
          <input
            type="text"
            id="guestbook-wish-input"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="Your bedtime wish or dream note..."
            maxLength={120}
            required
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-purple-950/50 border border-purple-400/30 text-purple-100 placeholder-purple-300/40 text-xs sm:text-sm focus:outline-none focus:border-purple-300 font-sans"
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-purple-300/60">
          <span>{wish.length} / 120 chars</span>
          <button
            type="submit"
            id="btn-submit-wish"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-xs transition active:scale-95 shadow-md shadow-purple-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pin Dream Wish</span>
          </button>
        </div>
      </form>

      {/* Wish Pins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {wishes.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.color} border shadow-lg relative group transition-transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-purple-200/80 mb-1.5">
              <span className="font-bold flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                {item.name}
              </span>
              <span className="opacity-60">{item.createdAt}</span>
            </div>
            <p className="text-xs text-purple-100 font-sans leading-relaxed italic">
              "{item.wish}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
