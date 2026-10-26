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
  UserCheck,
} from 'lucide-react';

export const ContractorInspectionsPage: React.FC = () => {
  const { inspectionReports, project } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Scheduled & Completed Site Inspections
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Independent quality audit gateways, compliance obligations, and field audit results.
        </p>
      </div>

      {/* Next Scheduled Gateway Banner */}
      <div className="bg-wensure-forest text-white rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-wensure-teal block">
              Upcoming Mandatory Field Audit
            </span>
            <h2 className="font-display text-xl sm:text-2xl text-white">
              16 October 2026 (10:30 AM IST)
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded border border-white/20 self-start sm:self-auto">
            Lead Auditor: Er. Neha Kulkarni
          </span>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-stone-200">
          <p className="font-semibold text-white">
            Pre-Inspection Contractor Action Items:
          </p>
          <ul className="space-y-1.5 text-stone-300 font-light list-disc list-inside">
            <li>Ensure Master Ensuite wall chase polymer mortar curing dampness check is completed.</li>
            <li>Maintain minimum 20mm clear plaster cover over re-grooved stairwell electrical DB conduits.</li>
            <li>Keep batch test certificates for polymer bonding agent accessible on site.</li>
          </ul>
        </div>
      </div>

      {/* Completed Inspection Reports */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Past Audit Reports & Findings
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Formal audit certificates with required contractor response items.
          </p>
        </div>

        <div className="divide-y divide-wensure-fine-divider">
          {inspectionReports.map((report) => (
            <div
              key={report.id}
              className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                    {report.reportCode}
                  </span>
                  <h3 className="font-semibold text-sm text-wensure-ink">
                    {report.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      report.verificationStatus === 'Fully Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.verificationStatus}
                  </span>
                </div>

                <p className="text-xs text-wensure-muted-text">
                  {report.scopeSummary}
                </p>

                <div className="text-[11px] text-stone-500 flex items-center gap-4">
                  <span>Audit Date: {report.inspectionDate}</span>
                  <span>Auditor: {report.inspectorName}</span>
                  <span className="font-semibold text-wensure-forest">
                    Score: {report.overallScore}%
                  </span>
                </div>
              </div>

              <Link
                to={`/customer/inspections/${report.id}`}
                className="text-xs font-semibold px-4 py-2 bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink rounded transition-colors self-start lg:self-center flex items-center gap-1"
              >
                <span>View Full Audit Certificate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
