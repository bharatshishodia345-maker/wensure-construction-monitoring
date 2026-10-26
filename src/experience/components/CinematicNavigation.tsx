import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Shield, ArrowRight, LayoutGrid, ChevronDown } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface CinematicNavigationProps {
  currentProgress: number;
  onJumpToProgress: (target: number) => void;
}

export const SCENES_METADATA = [
  { id: 1, name: 'The Beginning', progress: 0.05, desc: 'Empty Plot & Survey Blueprint' },
  { id: 2, name: 'The Foundation', progress: 0.18, desc: 'Excavation & Rebar Footings' },
  { id: 3, name: 'A Home Takes Shape', progress: 0.34, desc: 'RCC Columns, Slabs & Brickwork' },
  { id: 4, name: 'The Site Supervisor', progress: 0.49, desc: 'Evidence & Tablet Telemetry' },
  { id: 5, name: 'The Transparency Moment', progress: 0.63, desc: 'Planned vs Recorded Split' },
  { id: 6, name: 'The Home Comes to Life', progress: 0.77, desc: 'Finishes, Glass & Sunset' },
  { id: 7, name: 'The WENSURE Reveal', progress: 0.89, desc: 'Completed Residence & Orbit' },
  { id: 8, name: 'Login Experience', progress: 0.98, desc: 'Portal Sign-In' },
];

export const CinematicNavigation: React.FC<CinematicNavigationProps> = ({
  currentProgress,
  onJumpToProgress,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine current active scene
  const activeSceneIndex = SCENES_METADATA.findIndex((s, idx) => {
    const nextS = SCENES_METADATA[idx + 1];
    if (!nextS) return true;
    return currentProgress < nextS.progress;
  });

  const activeScene = SCENES_METADATA[Math.max(0, activeSceneIndex)] || SCENES_METADATA[0];

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all">
      {/* Top Glass Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Brand & Tagline - Back to Homepage */}
        <Link
          to="/"
          title="Return to WENSURE Homepage"
          className="pointer-events-auto flex items-center gap-3 bg-wensure-ink/80 hover:bg-wensure-ink/95 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full shadow-lg transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-wensure-teal flex items-center justify-center text-white font-serif font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-white text-xs font-semibold">
                WENSURE
              </span>
              <span className="hidden sm:inline text-[9.5px] uppercase tracking-wider text-wensure-teal bg-wensure-teal/15 px-1.5 py-0.5 rounded border border-wensure-teal/30">
                3D Experience
              </span>
            </div>
            <span className="text-[10px] text-stone-300 font-light hidden sm:block">
              BUILD WITH CONFIDENCE
            </span>
          </div>
        </Link>

        {/* Center: Active Scene Indicator with Dropdown Scrubber */}
        <div className="pointer-events-auto relative hidden md:block">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 bg-wensure-ink/80 hover:bg-wensure-ink/95 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white transition-all shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-wensure-teal animate-pulse" />
            <span className="text-xs font-mono tracking-wider uppercase text-stone-200">
              Scene {activeScene.id < 8 ? `0${activeScene.id}` : '08'} — {activeScene.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Scene Jump Drawer */}
          {menuOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-wensure-ink/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-2.5 space-y-1 animate-in fade-in zoom-in-95">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 px-3 py-1 block">
                Jump to Construction Stage
              </span>
              {SCENES_METADATA.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    onJumpToProgress(scene.progress);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                    activeScene.id === scene.id
                      ? 'bg-wensure-teal/20 text-wensure-teal border border-wensure-teal/30 font-semibold'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="font-mono text-[10px] text-stone-400 mr-2">0{scene.id}</span>
                    <span>{scene.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-light truncate max-w-[110px]">
                    {scene.desc}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions: Sound Toggle + Classic Overview + Skip to Login */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Audio Button */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Enable Ambient Construction Sound' : 'Mute Sound'}
            className={`p-2.5 rounded-full border transition-all backdrop-blur-md shadow-lg flex items-center justify-center ${
              isMuted
                ? 'bg-wensure-ink/80 border-white/10 text-stone-400 hover:text-white'
                : 'bg-wensure-teal/30 border-wensure-teal text-wensure-teal shadow-wensure-teal/20'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Platform Home Link */}
          <Link
            to="/"
            className="hidden lg:flex items-center gap-1.5 bg-wensure-ink/80 hover:bg-wensure-ink/95 border border-white/10 text-stone-200 hover:text-white px-3.5 py-2 rounded-full text-xs font-medium backdrop-blur-md transition-all shadow-lg"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-wensure-teal" />
            <span>Platform Home</span>
          </Link>

          {/* Skip to Login Button */}
          <button
            onClick={() => onJumpToProgress(0.98)}
            className="flex items-center gap-2 bg-gradient-to-r from-wensure-teal to-wensure-teal-dark hover:brightness-110 text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all shadow-lg hover:shadow-wensure-teal/30"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Thin Horizontal Scroll Progress Indicator */}
      <div className="w-full bg-white/10 h-1">
        <div
          className="h-full bg-gradient-to-r from-wensure-teal to-emerald-400 transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, currentProgress * 100))}%` }}
        />
      </div>
    </header>
  );
};
