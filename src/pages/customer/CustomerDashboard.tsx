import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { project } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Compact Project Welcome & Status Banner */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal bg-wensure-teal-light px-2.5 py-0.5 rounded">
              Active Supervision
            </span>
            <span className="text-xs text-wensure-muted-text font-mono">
              {project.code}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-wensure-ink">
            {project.name}
          </h1>
          <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
            {project.address}, {project.city} • Target Handover:{' '}
            <strong className="text-wensure-ink">{project.targetCompletionDate}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/customer/house-plan"
            className="text-xs font-semibold px-4 py-2.5 bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink rounded transition-colors"
          >
            Floor Plan & Map
          </Link>
          <Link
            to="/customer/site-gallery"
            className="text-xs font-semibold px-4 py-2.5 bg-wensure-ink text-white hover:bg-wensure-forest rounded transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-wensure-teal" />
            <span>Site Evidence</span>
          </Link>
        </div>
      </div>

      {/* 2. Coherent Project Health Overview (3 Balanced Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Metric */}
        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              Construction Progress
            </span>
            <TrendingUp className="w-4 h-4 text-wensure-teal" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-display text-wensure-ink">
              {project.recordedProgress}%
            </span>
            <span className="text-xs text-wensure-muted-text">
              Planned: {project.plannedProgress}%
            </span>
          </div>
          <div className="w-full bg-wensure-soft-stone h-2 rounded-full overflow-hidden">
            <div
              className="bg-wensure-teal h-full rounded-full transition-all duration-700"
              style={{ width: `${project.recordedProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-amber-700 font-medium">
            2% schedule variance (MEP conduit depth adjustment)
          </p>
        </div>

        {/* Financial Metric */}
        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              Expenditure Verified
            </span>
            <CreditCard className="w-4 h-4 text-wensure-forest" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display text-wensure-ink">
              ₹54.0L
            </span>
            <span className="text-xs text-wensure-muted-text">
              of ₹90.0L Budget
            </span>
          </div>
          <div className="w-full bg-wensure-soft-stone h-2 rounded-full overflow-hidden">
            <div
              className="bg-wensure-forest h-full rounded-full transition-all duration-700"
              style={{ width: '60%' }}
            />
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            60% disbursed • ₹8.0L tranche currently under physical audit
          </p>
        </div>

        {/* Quality Audit Metric */}
        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              Quality Audit Status
            </span>
            <ShieldCheck className="w-4 h-4 text-wensure-teal" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display text-wensure-ink">
              {project.openObservationsCount}
            </span>
            <span className="text-xs text-wensure-muted-text">
              Open Observations
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-wensure-success" />
            <span>92% Score on Latest Interim Audit</span>
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            Next on-site audit: {project.nextInspectionDate}
          </p>
        </div>
      </div>

      {/* 3. Attention Required Section: Schedule Variance & 3 Open Observations */}
      <div className="bg-white rounded-lg border border-wensure-warning/40 shadow-xs overflow-hidden">
        <div className="p-5 bg-wensure-warning-light/50 border-b border-wensure-warning/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-wensure-warning" />
            <div>
              <h2 className="text-sm font-semibold text-wensure-ink">
                Attention Required — 3 Civil Quality Observations
              </h2>
              <span className="text-[11px] text-stone-600">
                Identified during Milestone 04/05 audit by Er. Neha Kulkarni. Contractor has submitted rectification plans.
              </span>
            </div>
          </div>
          <Link
            to="/customer/issues"
            className="text-xs font-semibold text-wensure-forest hover:text-wensure-teal flex items-center gap-1"
          >
            <span>View Issue Register</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-wensure-fine-divider">
          {project.observations.map((obs) => (
            <div
              key={obs.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      obs.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : obs.severity === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {obs.severity}
                  </span>
                  <span className="text-xs font-semibold text-wensure-ink">
                    {obs.code}: {obs.title}
                  </span>
                </div>
                <p className="text-xs text-wensure-muted-text">{obs.description}</p>
                <p className="text-[11px] text-wensure-teal font-medium">
                  Status: {obs.status} • Rectification Target: {obs.targetResolutionDate}
                </p>
              </div>

              <Link
                to="/customer/issues"
                className="text-xs font-medium px-3 py-1.5 border border-wensure-fine-divider hover:border-wensure-ink rounded text-wensure-ink shrink-0 self-start sm:self-center"
              >
                Inspect Details
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 4 & 5. Active Milestone & Concise Stage Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Construction Stage Sequence */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
            <div>
              <h2 className="font-semibold text-base text-wensure-ink">
                Construction Stages Sequence
              </h2>
              <span className="text-xs text-wensure-muted-text">
                Chronological milestone tracking and audit sign-offs
              </span>
            </div>
            <Link
              to="/customer/progress"
              className="text-xs font-semibold text-wensure-teal hover:underline"
            >
              Full Timeline →
            </Link>
          </div>

          <div className="space-y-4">
            {project.milestones.slice(0, 5).map((ms, index) => (
              <div
                key={ms.id}
                className="flex items-start gap-4 p-3 rounded hover:bg-wensure-soft-stone/40 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      ms.status === 'completed'
                        ? 'bg-wensure-forest text-white'
                        : ms.status === 'in_progress'
                        ? 'bg-wensure-teal text-white ring-4 ring-wensure-teal-light'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {ms.status === 'completed' ? '✓' : index + 1}
                  </div>
                  {index < 4 && <div className="w-0.5 h-10 bg-stone-200 my-1" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-wensure-ink truncate">
                      {ms.name}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${
                        ms.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {ms.actualProgress}% Done
                    </span>
                  </div>
                  <p className="text-xs text-wensure-muted-text line-clamp-1 mt-0.5">
                    {ms.description}
                  </p>
                  <div className="text-[10.5px] text-stone-500 mt-1 flex items-center gap-3">
                    <span>Target: {ms.plannedDate}</span>
                    {ms.verifiedBy && (
                      <span className="text-wensure-teal font-medium">
                        Verified by {ms.verifiedBy}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Upcoming Audit & Contractor Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Inspection Card */}
          <div className="bg-wensure-forest text-white rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-wensure-teal uppercase font-semibold tracking-wider">
              <span>Next Field Audit</span>
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-xl text-white">
                16 October 2026 (10:30 AM)
              </h3>
              <p className="text-xs text-stone-300 font-light mt-1">
                Er. Neha Kulkarni will conduct re-inspection of Master Ensuite plumbing chase and stairwell electrical DB conduit cover.
              </p>
            </div>
            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
              <span className="text-stone-300">Milestone 05 Sign-Off</span>
              <Link
                to="/customer/inspections"
                className="text-wensure-teal font-semibold hover:underline"
              >
                Inspection Dossier →
              </Link>
            </div>
          </div>

          {/* Contractor Identity & Direct Hotline */}
          <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-wensure-fine-divider">
              <span className="text-xs font-semibold text-wensure-ink uppercase tracking-wider">
                Assigned Builder
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Verified Platinum
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=128&q=80"
                alt={project.contractor.name}
                className="w-11 h-11 rounded-full object-cover border border-wensure-fine-divider"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-wensure-ink">
                  {project.contractor.name}
                </h4>
                <p className="text-xs text-wensure-muted-text">
                  {project.contractor.leadContact}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2 text-wensure-muted-text">
                <Phone className="w-3.5 h-3.5 text-wensure-teal" />
                <span>{project.contractor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-wensure-muted-text">
                <Mail className="w-3.5 h-3.5 text-wensure-teal" />
                <span>{project.contractor.email}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-wensure-fine-divider">
              <Link
                to="/customer/contractors/CON-001"
                className="w-full block text-center text-xs font-semibold py-2 bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink rounded transition-colors"
              >
                View Builder Profile & Track Record
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
