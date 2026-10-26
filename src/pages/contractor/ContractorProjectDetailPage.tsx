import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Building,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  UploadCloud,
} from 'lucide-react';

export const ContractorProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { project } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation */}
      <div>
        <Link
          to="/contractor/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-wensure-forest hover:text-wensure-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Register</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal bg-wensure-teal-light px-2.5 py-0.5 rounded">
              Contractor Execution File
            </span>
            <span className="text-xs text-wensure-muted-text font-mono">
              {project.code}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-wensure-ink">
            {project.name}
          </h1>
          <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
            Homeowner: {project.homeowner.name} • Baner, Pune • Assigned Lead Auditor: {project.leadInspector.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/contractor/work-updates"
            className="px-4 py-2.5 bg-wensure-ink text-white hover:bg-wensure-forest rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-wensure-teal" />
            <span>Submit Milestone Update</span>
          </Link>
        </div>
      </div>

      {/* Distinction Section: Contractor Self-Reported vs Independent Audit Certified */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contractor Self-Reported Column */}
        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-ink">
              1. Contractor Self-Reported Execution
            </span>
            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">
              Field Team Entry
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Contractor Estimated Progress</span>
              <span className="font-bold text-wensure-ink">72%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Current Focus</span>
              <span className="font-medium text-wensure-ink">Conduit chase deepening & Gypsum plaster prep</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Latest Work Entry</span>
              <span className="font-medium text-wensure-ink">09 October 2026 (Stairwell DB rerouting)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Site Labor Count</span>
              <span className="font-medium text-wensure-ink">14 Masons & Electricians on site</span>
            </div>
          </div>
        </div>

        {/* Independent Inspection Audit Certified Column */}
        <div className="bg-white rounded-lg border border-wensure-teal/40 p-6 space-y-4 ring-1 ring-wensure-teal/10">
          <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-forest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-wensure-teal" />
              <span>2. Independent Quality Audit Findings</span>
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              Auditor Certified
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Auditor Certified Progress</span>
              <span className="font-bold text-wensure-forest">70% (2% delta pending re-check)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Latest Audit Report</span>
              <span className="font-medium text-wensure-ink">INS-RPT-2026-003 (Score: 92/100)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Mandatory Hold Points</span>
              <span className="font-semibold text-amber-700">3 Open Observations</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-wensure-muted-text">Scheduled Gate Re-Inspection</span>
              <span className="font-medium text-wensure-teal font-semibold">16 October 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Checklist */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
        <h2 className="text-sm font-semibold text-wensure-ink uppercase tracking-wider">
          Milestones Delivery Checklist
        </h2>

        <div className="divide-y divide-wensure-fine-divider">
          {project.milestones.map((ms) => (
            <div key={ms.id} className="py-4 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-wensure-forest">{ms.id}</span>
                  <span className="font-semibold text-wensure-ink">{ms.name}</span>
                </div>
                <p className="text-wensure-muted-text mt-0.5">{ms.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ms.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ms.status.replace('_', ' ')} ({ms.actualProgress}%)
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Target: {ms.plannedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
