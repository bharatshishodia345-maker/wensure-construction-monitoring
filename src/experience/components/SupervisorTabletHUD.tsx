import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileCheck2,
  Bell,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SupervisorTabletHUDProps {
  progress: number;
}

export const SupervisorTabletHUD: React.FC<SupervisorTabletHUDProps> = ({ progress }) => {
  const { project } = useApp();
  const [activeTab, setActiveTab] = useState<'progress' | 'milestones' | 'observations' | 'budget'>('progress');

  // Scene 4 is active between progress 0.42 and 0.56
  if (progress < 0.42 || progress > 0.56) return null;

  const opacity = Math.min(1, Math.min((progress - 0.42) * 10, (0.56 - progress) * 10));

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 flex items-center justify-end p-4 sm:p-10 lg:pr-16 transition-all duration-500"
      style={{ opacity }}
    >
      <div className="pointer-events-auto max-w-lg w-full bg-wensure-ink/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
        {/* Header with Demo Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-wensure-teal font-semibold block">
              Supervisor Telemetry • Baner Villa
            </span>
            <h3 className="font-display text-xl sm:text-2xl text-white">
              SITE SUPERVISOR AUDIT
            </h3>
          </div>
          <span className="text-[9.5px] uppercase font-mono tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded font-semibold">
            Illustrative Demo Data
          </span>
        </div>

        {/* Core Methodology Explanation */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs space-y-1">
          <p className="font-serif italic text-stone-200">
            "Know what has been reported. See what evidence supports it. Understand what has been reviewed."
          </p>
          <p className="text-[11px] text-stone-400 font-light">
            Distinguishing reported claims from evidence-supported records and independent physical sign-offs.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 gap-1.5 bg-black/40 p-1.5 rounded-xl text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all ${
              activeTab === 'progress'
                ? 'bg-wensure-teal text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all ${
              activeTab === 'milestones'
                ? 'bg-wensure-teal text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all ${
              activeTab === 'observations'
                ? 'bg-wensure-teal text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Obs ({project.openObservationsCount})
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all ${
              activeTab === 'budget'
                ? 'bg-wensure-teal text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Budget
          </button>
        </div>

        {/* Tab 1: Project Progress */}
        {activeTab === 'progress' && (
          <div className="space-y-3.5 text-xs">
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Recorded Site Progress</span>
                <span className="font-mono text-base font-bold text-wensure-teal">
                  {project.recordedProgress}%
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-wensure-teal h-full rounded-full"
                  style={{ width: `${project.recordedProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Planned Target: {project.plannedProgress}%</span>
                <span>Variance: {project.scheduleVariance}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-stone-400 block mb-1">Contractor</span>
                <p className="font-semibold text-stone-200 truncate">{project.contractor.name}</p>
                <span className="text-[10px] text-emerald-400">Class A Builder</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-stone-400 block mb-1">Civil Auditor</span>
                <p className="font-semibold text-stone-200 truncate">{project.leadInspector.name}</p>
                <span className="text-[10px] text-wensure-teal">Chartered Auditor</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Construction Milestones */}
        {activeTab === 'milestones' && (
          <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
            {project.milestones.slice(0, 4).map((ms) => (
              <div
                key={ms.id}
                className="bg-white/5 p-2.5 rounded-lg border border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-wensure-teal">{ms.id}</span>
                    <span className="font-semibold text-stone-200">{ms.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {ms.stage} • {ms.status === 'completed' ? 'Verified' : 'Under Review'}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    ms.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {ms.actualProgress}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Site Observations */}
        {activeTab === 'observations' && (
          <div className="space-y-2.5 text-xs">
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {project.observations[0]?.title}
                </span>
                <span className="text-[9.5px] uppercase font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">
                  {project.observations[0]?.severity}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 line-clamp-2">
                {project.observations[0]?.description}
              </p>
              <div className="pt-1 text-[10.5px] text-wensure-teal">
                Contractor Rectification: "{project.observations[0]?.contractorResponse?.slice(0, 50)}..."
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Budget Tracking */}
        {activeTab === 'budget' && (
          <div className="space-y-3 text-xs">
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Total Villa Budget</span>
                <span className="font-mono font-bold text-stone-200">
                  ₹{(project.totalBudget / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Recorded Expenditure</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{(project.recordedExpenditure / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{
                    width: `${(project.recordedExpenditure / project.totalBudget) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer info note */}
        <div className="flex items-center gap-2 text-[10.5px] text-stone-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-wensure-teal shrink-0" />
          <span>Independent civil audits cross-referenced against approved drawings.</span>
        </div>
      </div>
    </div>
  );
};
