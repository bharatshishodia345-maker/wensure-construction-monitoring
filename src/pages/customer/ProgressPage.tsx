import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProgressPage: React.FC = () => {
  const { project } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Civil Progression Record
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            {project.code}
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">
          Construction Progress & Milestone Trajectory
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Compare planned timeline commitments against certified on-site progress.
        </p>
      </div>

      {/* Progress Metric Visual Card */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-wensure-fine-divider">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text block mb-1">
              Recorded Site Progress
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-display text-wensure-ink">
                {project.recordedProgress}%
              </span>
              <span className="text-xs text-emerald-700 font-medium">Certified by Auditor</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text block mb-1">
              Planned Schedule Progress
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-display text-stone-500">
                {project.plannedProgress}%
              </span>
              <span className="text-xs text-wensure-muted-text">Contractual Baseline</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text block mb-1">
              Schedule Variance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-display text-amber-700">
                {project.scheduleVariance}%
              </span>
              <span className="text-xs text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded">
                Minor Delay (Controlled)
              </span>
            </div>
          </div>
        </div>

        {/* Dual Progress Bar Visual */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-wensure-ink">Recorded Actual Execution</span>
              <span className="font-mono text-wensure-teal font-bold">{project.recordedProgress}%</span>
            </div>
            <div className="w-full bg-wensure-soft-stone h-3 rounded-full overflow-hidden">
              <div
                className="bg-wensure-teal h-full rounded-full transition-all duration-700"
                style={{ width: `${project.recordedProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-wensure-muted-text">Planned Target Benchmark</span>
              <span className="font-mono text-stone-500">{project.plannedProgress}%</span>
            </div>
            <div className="w-full bg-wensure-soft-stone h-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${project.plannedProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Factual Variance Explanation */}
        <div className="p-4 rounded bg-wensure-warning-light/50 border border-wensure-warning/30 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-wensure-warning shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-wensure-ink">
              Variance Cause & Rectification Schedule (Milestone 05)
            </p>
            <p className="text-wensure-muted-text leading-relaxed">
              The 2-percentage-point schedule variance is due to the mandatory stoppage of final gypsum plastering on First Floor Grid C-3. Auditor Er. Neha Kulkarni identified that electrical distribution conduits had only 8mm cover (OBS-03) and plumbing wall chases sustained micro-cracking (OBS-01). Re-grooving and fiber-mesh patching are scheduled for completion on 15 October, with re-inspection on 16 October 2026. Handover target date (31 March 2027) remains secure.
            </p>
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Milestone Timeline & Comparison */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
          <div>
            <h2 className="font-semibold text-base text-wensure-ink">
              Stage-by-Stage Milestone Comparison
            </h2>
            <p className="text-xs text-wensure-muted-text">
              Detailed breakdown of all 8 contractual construction milestones
            </p>
          </div>
          <Link
            to="/customer/site-gallery"
            className="text-xs font-semibold text-wensure-teal hover:underline flex items-center gap-1"
          >
            <span>View Photographic Evidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-wensure-fine-divider">
          {project.milestones.map((ms) => (
            <div
              key={ms.id}
              className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-stone-50/50 transition-colors"
            >
              {/* Left Info */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-wensure-forest">
                    {ms.id}
                  </span>
                  <span className="text-sm font-semibold text-wensure-ink">
                    {ms.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      ms.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ms.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {ms.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-wensure-muted-text leading-relaxed">
                  {ms.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-wensure-teal" />
                    Target: {ms.plannedDate}
                  </span>
                  {ms.actualDate && (
                    <span className="text-emerald-700 font-medium">
                      Signed Off: {ms.actualDate}
                    </span>
                  )}
                  {ms.verifiedBy && (
                    <span className="text-wensure-teal font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {ms.verifiedBy}
                    </span>
                  )}
                  {ms.evidenceCount > 0 && (
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-mono">
                      {ms.evidenceCount} photos logged
                    </span>
                  )}
                </div>
              </div>

              {/* Right Mini Progress */}
              <div className="lg:w-64 space-y-1.5 shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-wensure-muted-text">Milestone Execution</span>
                  <span className="font-semibold text-wensure-ink">{ms.actualProgress}%</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ms.status === 'completed' ? 'bg-wensure-forest' : 'bg-wensure-teal'
                    }`}
                    style={{ width: `${ms.actualProgress}%` }}
                  />
                </div>
                <div className="text-[10.5px] text-stone-400 text-right">
                  Target: {ms.plannedProgress}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
