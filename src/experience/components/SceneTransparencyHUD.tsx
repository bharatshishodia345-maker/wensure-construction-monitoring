import React from 'react';
import {
  TrendingUp,
  AlertCircle,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Building,
  ArrowRight,
  Info,
  Layers,
  Scale,
} from 'lucide-react';

interface SceneTransparencyHUDProps {
  progress: number;
}

export const SceneTransparencyHUD: React.FC<SceneTransparencyHUDProps> = ({ progress }) => {
  // Active between progress 0.56 and 0.70
  if (progress < 0.56 || progress > 0.70) return null;

  const opacity = Math.min(1, Math.min((progress - 0.56) * 12, (0.70 - progress) * 12));

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center p-4 sm:p-8 transition-all duration-500"
      style={{ opacity }}
    >
      <div className="pointer-events-auto max-w-4xl w-full bg-wensure-ink/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Header with Project and Illustrative Demo Data Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-wensure-teal font-semibold">
                SCENE 05 • THE TRANSPARENCY MOMENT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-wensure-teal" />
              <span className="text-[10px] font-mono text-stone-300">WNS-PUN-2026-001</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-white font-normal mt-0.5">
              WENSURE RESIDENCE, BANER, PUNE
            </h2>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-[9.5px] uppercase font-mono tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded font-semibold">
              ILLUSTRATIVE DEMO DATA
            </span>
          </div>
        </div>

        {/* Central Thesis */}
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-start gap-3">
          <Scale className="w-4 h-4 text-wensure-teal shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-serif italic text-stone-200 text-sm">
              "Understand the difference between what was planned, what has been recorded, and what the evidence shows."
            </p>
            <p className="text-[11px] text-stone-400">
              You should never have to guess what is happening to your home, where your funds go, or which milestones are signed off.
            </p>
          </div>
        </div>

        {/* CINEMATIC SPLIT VISUALIZATION: LEFT (PLANNED) vs RIGHT (RECORDED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT: PLANNED PROGRESS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                PLANNED PROGRESS
              </span>
              <span className="font-mono text-xs text-stone-400">Schedule Target</span>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-4xl sm:text-5xl font-light text-stone-100">
                72<span className="text-2xl text-stone-400">%</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Planned architectural completion for current project phase (15 June 2026 baseline).
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Total Approved Villa Budget:</span>
                <span className="font-mono font-bold text-white">₹90,00,000</span>
              </div>
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Planned Milestone Disbursals:</span>
                <span className="font-mono">₹58,50,000 (65%)</span>
              </div>
            </div>
          </div>

          {/* RIGHT: RECORDED PROGRESS */}
          <div className="bg-gradient-to-br from-wensure-teal/20 to-wensure-ink border border-wensure-teal/40 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-wensure-teal font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-wensure-teal animate-pulse" />
                RECORDED PROGRESS
              </span>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                -2% Safe Variance
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-4xl sm:text-5xl font-light text-wensure-teal">
                70<span className="text-2xl text-teal-300">%</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Recorded civil progress verified on-site by Chartered Auditor Er. Neha Kulkarni.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-stone-200">
                <span>Recorded Expenditure:</span>
                <span className="font-mono font-bold text-emerald-400">₹54,00,000</span>
              </div>
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Escrow Retained Protection:</span>
                <span className="font-mono text-teal-200">₹36,00,000 (40%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Timeline Strip & Site Evidence Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-stone-400 uppercase">Substructure</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="font-semibold text-stone-200">Footings & Plinth</p>
            <p className="text-[10px] text-emerald-300">100% Physically Verified</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-stone-400 uppercase">Superstructure</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="font-semibold text-stone-200">RCC Columns & Slabs</p>
            <p className="text-[10px] text-emerald-300">100% Cube Test Verified</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-wensure-teal uppercase">Finishing</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <p className="font-semibold text-stone-200">Brick Masonry & Stucco</p>
            <p className="text-[10px] text-amber-300">70% Evidence Under Review</p>
          </div>
        </div>

        {/* Footer Integrity Disclaimer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10.5px] text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-wensure-teal shrink-0" />
            <span>Third-party verification principle: Claims are never verified without photo-evidence and physical testing.</span>
          </div>
          <span className="hidden md:inline font-mono text-[10px] text-stone-500">
            Pune West Civil Cluster
          </span>
        </div>
      </div>
    </div>
  );
};
