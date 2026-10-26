import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ContractorDashboard: React.FC = () => {
  const { project, opportunities, currentUser } = useApp();

  const nextAudit = project.upcomingAudits[0];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome & Priority Actions Strip */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal bg-wensure-teal-light px-2.5 py-0.5 rounded">
              Contractor Command
            </span>
            <span className="text-xs text-wensure-muted-text">
              {currentUser.name}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-wensure-ink">
            Project Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
            Managing active villa execution at <strong className="text-wensure-ink">{project.name}</strong> • Baner, Pune.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/contractor/issues"
            className="text-xs font-semibold px-4 py-2.5 bg-wensure-warning-light/70 text-amber-900 border border-wensure-warning/40 hover:bg-amber-100 rounded transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-wensure-warning" />
            <span>Respond to 3 Observations</span>
          </Link>

          <Link
            to="/contractor/work-updates"
            className="text-xs font-semibold px-4 py-2.5 bg-wensure-ink text-white hover:bg-wensure-forest rounded transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-wensure-teal" />
            <span>Submit Site Update</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Operational Metrics (Prioritizing Immediate Next Actions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-muted-text block">
            Supervised Projects
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-wensure-ink">1 Active</span>
            <span className="text-xs text-wensure-muted-text">2 in Pipeline</span>
          </div>
          <p className="text-[11px] text-wensure-muted-text truncate">
            {project.name} (70% Recorded)
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-warning/40 space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-warning block">
            Action Items Required
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-wensure-warning">3</span>
            <span className="text-xs text-amber-800">Observations</span>
          </div>
          <p className="text-[11px] text-stone-600">
            Re-inspection on 16 October
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-muted-text block">
            Inspection Compliance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-wensure-forest">98.4%</span>
            <span className="text-xs text-emerald-700">Audit Score</span>
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            Independent Platinum Tier
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-muted-text block">
            New Villa Opportunities
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-wensure-teal">
              {opportunities.length}
            </span>
            <span className="text-xs text-wensure-muted-text">Matches in Pune</span>
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            High-specification NRI projects
          </p>
        </div>
      </div>

      {/* 3. Next Field Audit Alert Banner */}
      <div className="bg-wensure-forest text-white rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-wensure-teal block">
            Critical Upcoming Inspection Gateway
          </span>
          <h2 className="font-display text-xl text-white">
            {nextAudit.scheduledDate} — Milestone 05 Sign-Off
          </h2>
          <p className="text-xs text-stone-300 font-light max-w-2xl leading-relaxed">
            {nextAudit.scope}
          </p>
        </div>

        <Link
          to="/contractor/inspections"
          className="px-4 py-2.5 rounded bg-white text-wensure-ink hover:bg-stone-100 text-xs font-semibold whitespace-nowrap self-start md:self-auto"
        >
          Review Inspection Checklist
        </Link>
      </div>

      {/* 4. Active Project Details & Rectification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Active Supervised Project Snapshot */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
            <div>
              <h2 className="font-semibold text-base text-wensure-ink">
                Active Supervised Build: {project.name}
              </h2>
              <p className="text-xs text-wensure-muted-text">
                Client: {project.homeowner.name} • Baner, Pune
              </p>
            </div>
            <Link
              to="/contractor/projects/WNS-PUN-2026-001"
              className="text-xs font-semibold text-wensure-teal hover:underline"
            >
              Project Dossier →
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Current Stage Execution</span>
              <span className="font-semibold text-wensure-ink">Milestone 05: Internal Plaster & Rough-Ins (88% Done)</span>
            </div>
            <div className="w-full bg-wensure-soft-stone h-2 rounded-full overflow-hidden">
              <div
                className="bg-wensure-teal h-full rounded-full"
                style={{ width: `${project.recordedProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>Overall Recorded: {project.recordedProgress}%</span>
              <span>Planned: {project.plannedProgress}% (-2% schedule variance)</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded border border-stone-200 text-xs space-y-2">
            <span className="font-semibold text-wensure-ink block">
              Contractor Action Roadmap:
            </span>
            <ul className="space-y-1.5 text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-wensure-teal" />
                <span>Rotary grooving completed on electrical DB conduit shaft (15mm extra depth achieved).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-wensure-teal" />
                <span>Polymer fiber mesh procured for Master Ensuite wall chase.</span>
              </li>
              <li className="flex items-center gap-2 text-amber-800 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Prepare for Er. Neha Kulkarni's physical sign-off visit on 16 Oct.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right 5 cols: New Opportunities Preview */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
            <div>
              <h2 className="font-semibold text-base text-wensure-ink">
                Homeowner Opportunities
              </h2>
              <p className="text-xs text-wensure-muted-text">
                Pre-vetted villa builds seeking verified contractors
              </p>
            </div>
            <Link
              to="/contractor/opportunities"
              className="text-xs font-semibold text-wensure-teal hover:underline"
            >
              All Leads →
            </Link>
          </div>

          <div className="space-y-3">
            {opportunities.slice(0, 2).map((opp) => (
              <div
                key={opp.id}
                className="p-3.5 rounded bg-wensure-soft-stone/40 border border-wensure-fine-divider space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-wensure-forest font-bold">
                    {opp.id}
                  </span>
                  <span className="text-xs font-semibold text-wensure-ink">
                    {opp.budgetRange}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-wensure-ink line-clamp-1">
                  {opp.title}
                </h4>
                <p className="text-[11px] text-wensure-muted-text">
                  {opp.location} • {opp.areaSqFt}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/contractor/opportunities"
            className="w-full block text-center text-xs font-semibold py-2.5 bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink rounded transition-colors"
          >
            Express Interest in Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
};
