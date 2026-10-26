import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  FileText,
  UserCheck,
} from 'lucide-react';

export const InspectionsPage: React.FC = () => {
  const { inspectionReports, project } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Civil Quality Audits
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            {project.code}
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">
          Inspections & Engineering Reports
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Objective third-party civil inspection reports, re-inspection schedules, and observation compliance tracking.
        </p>
      </div>

      {/* Upcoming Scheduled Inspection (Hero banner) */}
      <div className="bg-wensure-forest text-white rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-wensure-teal" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-wensure-teal block">
                Upcoming Site Verification
              </span>
              <h2 className="font-display text-xl sm:text-2xl text-white">
                16 October 2026 (10:30 AM IST)
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded border border-white/20 self-start sm:self-auto">
            Lead Auditor: Er. Neha Kulkarni
          </span>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-stone-200">
          <p className="font-semibold text-white">
            Audit Scope: Re-inspection of Rectified MEP Concealment & Plaster Prep
          </p>
          <p className="text-stone-300 font-light leading-relaxed">
            Physical check of fiber-mesh reinforced polymer mortar over plumbing chases on Grid C-3 (OBS-01) and deepened electrical DB conduits in stairwell shaft (OBS-03). Upon successful verification, Milestone 05 final sign-off and payment release recommendation will be issued.
          </p>
        </div>
      </div>

      {/* Published Inspection Reports Register */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Published Audit Reports Register
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Formal engineering certificates signed and sealed by chartered civil auditors.
          </p>
        </div>

        <div className="divide-y divide-wensure-fine-divider">
          {inspectionReports.map((report) => (
            <div
              key={report.id}
              className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-stone-50/50 transition-colors"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                    {report.reportCode}
                  </span>
                  <h3 className="font-semibold text-base text-wensure-ink">
                    {report.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      report.verificationStatus === 'Fully Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.verificationStatus}
                  </span>
                </div>

                <p className="text-xs text-wensure-muted-text leading-relaxed">
                  {report.scopeSummary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-wensure-teal" />
                    Inspected on {report.inspectionDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-wensure-teal" />
                    Auditor: {report.inspectorName} ({report.inspectorLicense})
                  </span>
                  <span className="font-semibold text-wensure-forest">
                    Quality Index: {report.overallScore}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <Link
                  to={`/customer/inspections/${report.id}`}
                  className="inline-flex items-center gap-2 bg-wensure-ink text-white hover:bg-wensure-forest px-4 py-2.5 rounded text-xs font-semibold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Open Full Audit Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
