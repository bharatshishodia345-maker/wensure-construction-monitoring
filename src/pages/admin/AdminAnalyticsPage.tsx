import React from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Operational Analytics & Quality Trends
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Synthesized performance indicators across regional inspection volume, observation defect categories, and turnaround timelines.
        </p>
      </div>

      {/* Metric Visuals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              Average Rectification Turnaround
            </span>
            <Clock className="w-4 h-4 text-wensure-teal" />
          </div>
          <div className="text-4xl font-display text-wensure-ink">
            5.8 Days
          </div>
          <p className="text-xs text-wensure-muted-text">
            Time from auditor defect notice to contractor repair submission.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              First-Pass Audit Approval
            </span>
            <ShieldCheck className="w-4 h-4 text-wensure-forest" />
          </div>
          <div className="text-4xl font-display text-wensure-forest">
            91.2%
          </div>
          <p className="text-xs text-wensure-muted-text">
            Milestones cleared without requiring secondary re-grooving or structural remediation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              Arbitration Mediation Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-4xl font-display text-emerald-700">
            100%
          </div>
          <p className="text-xs text-wensure-muted-text">
            100% of recorded customer-builder scope disputes resolved within 14 days without litigation.
          </p>
        </div>
      </div>

      {/* Observation Categories Breakdown Visual */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Quality Observations by Civil Trade Category
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Historical distribution of site defects flagged during independent audits
          </p>
        </div>

        <div className="space-y-4">
          {[
            { category: 'MEP Conduit Depth & Cover', count: '38%', countNum: 14, color: 'bg-wensure-teal' },
            { category: 'Masonry Verticality & Wall Chases', count: '28%', countNum: 10, color: 'bg-wensure-forest' },
            { category: 'Curing Routine & Hessian Wetness', count: '18%', countNum: 6, color: 'bg-amber-600' },
            { category: 'Waterproofing Substrate Slope', count: '16%', countNum: 5, color: 'bg-stone-500' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-wensure-ink">{item.category}</span>
                <span className="font-mono text-stone-600">{item.count} ({item.countNum} occurrences)</span>
              </div>
              <div className="w-full bg-wensure-soft-stone h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: item.count }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
