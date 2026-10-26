import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Info,
} from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const { contractors, showToast } = useApp();
  const [pipelineState, setPipelineState] = useState<Record<string, string>>({
    'CON-001': 'Independent Platinum Verified',
    'CON-002': 'Independent Gold Verified',
    'CON-003': 'Independent Platinum Verified',
    'CON-004': 'Audit Review In-Progress',
  });

  const handleAction = (builderId: string, newStatus: string) => {
    setPipelineState((prev) => ({ ...prev, [builderId]: newStatus }));
    showToast(`Verification status updated to: ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Contractor Independent Verification Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Rigorous civil engineering accreditation: license verification, financial standing, and on-site tolerance audits.
        </p>
      </div>

      {/* Illustrative Notice */}
      <div className="p-3.5 bg-wensure-soft-stone/70 border border-wensure-fine-divider rounded flex items-center gap-2.5 text-xs text-wensure-muted-text">
        <Info className="w-4 h-4 text-wensure-teal shrink-0" />
        <span>
          <strong>Simulated Verification Protocol:</strong> Demonstrates WENSURE's multi-step vetting checklist and independent rating assignment before builders are published to homeowners.
        </span>
      </div>

      {/* Verification Pipeline List */}
      <div className="space-y-6">
        {contractors.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wensure-fine-divider">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                    {b.id}
                  </span>
                  <span className="text-xs text-wensure-muted-text">
                    Founder: {b.founderName} • Established {b.establishedYear}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-wensure-ink">
                  {b.companyName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded">
                  {pipelineState[b.id] || b.verifiedTier}
                </span>
              </div>
            </div>

            {/* Vetting Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-semibold text-wensure-ink flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>State Civil License</span>
                </span>
                <p className="text-[11px] text-wensure-muted-text">
                  Class-A Building License verified with PWD.
                </p>
              </div>

              <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-semibold text-wensure-ink flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Physical Site Audit</span>
                </span>
                <p className="text-[11px] text-wensure-muted-text">
                  Historical compliance rate verified at {b.inspectionComplianceRate}.
                </p>
              </div>

              <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-semibold text-wensure-ink flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Dispute Arbitration</span>
                </span>
                <p className="text-[11px] text-wensure-muted-text">
                  Formal dispute history cleared at {b.disputeRate}.
                </p>
              </div>

              <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-semibold text-wensure-ink flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Client Testimonial Audit</span>
                </span>
                <p className="text-[11px] text-wensure-muted-text">
                  {b.reviewCount} direct homeowner interviews completed.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-wensure-fine-divider text-xs">
              <span className="text-stone-500 font-mono">
                {b.totalConstructedSqFt} documented area verified
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    handleAction(b.id, 'Independent Platinum Verified')
                  }
                  className="px-3 py-1.5 bg-wensure-forest text-white rounded font-medium hover:bg-wensure-ink transition-colors"
                >
                  Confirm Platinum Tier
                </button>
                <button
                  onClick={() =>
                    handleAction(b.id, 'Supplementary Audit Required')
                  }
                  className="px-3 py-1.5 bg-wensure-soft-stone text-stone-700 rounded font-medium hover:bg-stone-200 transition-colors"
                >
                  Request Supplementary Audit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
