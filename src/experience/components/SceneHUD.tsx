import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, ChevronRight, Layers, FileCheck, Eye, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SceneHUDProps {
  progress: number;
  onExploreLogin: () => void;
}

export const SceneHUD: React.FC<SceneHUDProps> = ({ progress, onExploreLogin }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-12">
      {/* ========================================================
          SCENE 01: THE BEGINNING (0.00 -> 0.12)
          ======================================================== */}
      {progress < 0.12 && (
        <div
          className="my-auto max-w-2xl mx-auto text-center space-y-6 transition-all duration-700"
          style={{ opacity: Math.max(0, 1 - progress * 8) }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wensure-ink/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold tracking-widest uppercase text-wensure-teal shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-wensure-teal animate-ping" />
            <span>Baner, Pune • Residential Plot 42</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-wensure-ink leading-[1.08] drop-shadow-xs">
            BUILD WITH{' '}
            <span className="italic text-wensure-teal block sm:inline">
              CONFIDENCE.
            </span>
          </h1>

          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-stone-700 font-semibold">
            YOUR HOME. YOUR MONEY. YOUR VISIBILITY.
          </p>

          <p className="text-sm sm:text-base text-stone-700 max-w-xl mx-auto font-normal leading-relaxed bg-white/40 backdrop-blur-xs p-3 rounded-lg border border-white/40">
            "Every home begins with a plan. Every successful project needs transparency."
          </p>

          {/* Scroll cue */}
          <div className="pt-6 flex flex-col items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-mono text-stone-600 font-medium animate-pulse">
              Scroll To Begin Journey
            </span>
            <div className="w-8 h-12 rounded-full border-2 border-stone-600/60 flex items-start justify-center p-1.5 backdrop-blur-xs">
              <div className="w-1.5 h-3 bg-wensure-teal rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCENE 02: THE FOUNDATION (0.12 -> 0.26)
          ======================================================== */}
      {progress >= 0.12 && progress < 0.26 && (
        <div
          className="my-auto max-w-xl transition-all duration-500 pointer-events-auto"
          style={{
            opacity: Math.min(1, Math.min((progress - 0.12) * 12, (0.26 - progress) * 12)),
          }}
        >
          <div className="bg-wensure-ink/85 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-8 text-white space-y-5 shadow-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-wensure-teal bg-wensure-teal/15 px-2.5 py-1 rounded">
              <Layers className="w-3.5 h-3.5" />
              <span>Milestone 01 • Substructure & Footings</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-normal leading-tight">
              EVERY GREAT HOME STARTS WITH A SOLID FOUNDATION.
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Track planned milestones, recorded progress, site evidence, and important observations in one place.
            </p>

            {/* Distinction Grid: Planned vs Reported vs Evidence vs Reviewed */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-mono text-stone-400 block mb-0.5">
                  01. Planned Milestone
                </span>
                <span className="font-semibold text-stone-200">15 May 2026 Target</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-mono text-amber-300 block mb-0.5">
                  02. Reported Completion
                </span>
                <span className="font-semibold text-stone-200">Contractor Logged 100%</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-mono text-sky-300 block mb-0.5">
                  03. Evidence Submitted
                </span>
                <span className="font-semibold text-stone-200">6 Rebar Geo-Photos</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-0.5">
                  04. Reviewed Progress
                </span>
                <span className="font-semibold text-stone-200">Er. Neha Kulkarni Sign-off</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 italic bg-black/30 p-2.5 rounded border border-white/5">
              * Integrity Principle: Milestones are never marked verified until physical civil testing and sign-off occurs.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCENE 03: A HOME TAKES SHAPE (0.26 -> 0.42)
          ======================================================== */}
      {progress >= 0.26 && progress < 0.42 && (
        <div
          className="my-auto max-w-xl transition-all duration-500 pointer-events-auto"
          style={{
            opacity: Math.min(1, Math.min((progress - 0.26) * 10, (0.42 - progress) * 10)),
          }}
        >
          <div className="bg-wensure-ink/85 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-8 text-white space-y-4 shadow-2xl">
            <span className="inline-block text-[10px] uppercase font-mono tracking-wider text-wensure-teal bg-wensure-teal/15 px-2.5 py-1 rounded">
              Structural Framing • G+1 Modern Villa
            </span>

            <h2 className="font-display text-2xl sm:text-3xl font-normal leading-tight">
              A HOME TAKES SHAPE.
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              RCC structural columns rising, beams connecting, floor slabs forming, and terracotta brick masonry laid course by course.
            </p>

            {/* Human Activity Callout */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
                <div className="text-xs">
                  <span className="font-semibold text-orange-200 block">Active Construction Mason</span>
                  <span className="text-[11px] text-stone-400">Laying brick masonry with mortar trowel and spirit level</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-wensure-teal animate-pulse" />
                <div className="text-xs">
                  <span className="font-semibold text-teal-200 block">Site Supervisor & Civil Auditor</span>
                  <span className="text-[11px] text-stone-400">Measuring column verticality and logging digital audit telemetry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCENE 06: THE HOME COMES TO LIFE (0.70 -> 0.84)
          ======================================================== */}
      {progress >= 0.70 && progress < 0.84 && (
        <div
          className="my-auto max-w-xl transition-all duration-500 pointer-events-auto"
          style={{
            opacity: Math.min(1, Math.min((progress - 0.70) * 10, (0.84 - progress) * 10)),
          }}
        >
          <div className="bg-wensure-ink/85 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-8 text-white space-y-4 shadow-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-amber-400 bg-amber-400/15 px-2.5 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Finishing • Twilight Transition</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-normal leading-tight">
              THE HOME COMES TO LIFE.
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Exterior off-white plaster, tinted double-glazed windows, golden teak louvers, and manicured landscaping blossom into place.
            </p>

            <p className="text-xs text-stone-400 leading-relaxed">
              Daylight softens into warm golden hour, revealing subtle architectural downlights and welcoming entrance sconces.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          SCENE 07: THE WENSURE REVEAL (0.84 -> 0.94)
          ======================================================== */}
      {progress >= 0.84 && progress < 0.94 && (
        <div
          className="my-auto max-w-2xl mx-auto text-center space-y-6 transition-all duration-700 pointer-events-auto"
          style={{
            opacity: Math.min(1, Math.min((progress - 0.84) * 12, (0.94 - progress) * 12)),
          }}
        >
          <div className="bg-wensure-ink/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-12 text-white space-y-6 shadow-2xl">
            <span className="text-[11px] uppercase tracking-widest font-mono text-wensure-teal font-semibold block">
              The Journey Completed
            </span>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              YOUR HOME IS MORE THAN A CONSTRUCTION PROJECT.
            </h2>

            <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-amber-300 font-medium">
              IT IS YOUR TRUST, YOUR MONEY, AND YOUR FUTURE.
            </p>

            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto font-light leading-relaxed">
              "Construction visibility that helps you stay informed, track progress, and make better decisions."
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onExploreLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-wensure-teal to-wensure-teal-dark hover:brightness-110 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xl hover:shadow-wensure-teal/30"
              >
                <span>Get Started • Access Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                to="/overview"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>Explore WENSURE</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
