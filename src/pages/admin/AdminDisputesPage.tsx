import React, { useState } from 'react';
import { DEMO_DISPUTES } from '../../data/demoData';
import { useApp } from '../../context/AppContext';


export const AdminDisputesPage: React.FC = () => {
  const { showToast } = useApp();
  const [disputes, setDisputes] = useState(DEMO_DISPUTES);

  const handleResolve = (dspId: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === dspId
          ? {
              ...d,
              status: 'Resolved via Independent Audit',
            }
          : d
      )
    );
    showToast(`Case ${dspId} marked as mutually arbitrated & resolved.`, 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Evidence-Based Dispute Resolution & Arbitration
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Neutral civil engineering arbitration utilizing immutable site inspection photographic records and certified volume calculations.
        </p>
      </div>

      {/* Case Register */}
      <div className="space-y-6">
        {disputes.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wensure-fine-divider">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                    {caseItem.id}
                  </span>
                  <span className="font-mono text-xs text-wensure-muted-text">
                    {caseItem.projectCode} • {caseItem.projectName}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Logged: {caseItem.dateLogged}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-wensure-ink">
                  Parties Involved: {caseItem.parties}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded ${
                    caseItem.status.includes('Resolved')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {caseItem.status}
                </span>

                {!caseItem.status.includes('Resolved') && (
                  <button
                    onClick={() => handleResolve(caseItem.id)}
                    className="px-3 py-1 bg-wensure-forest text-white rounded text-xs font-medium hover:bg-wensure-ink transition-colors"
                  >
                    Issue Formal Arbitration Seal
                  </button>
                )}
              </div>
            </div>

            {/* Matter Description & Evidence Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5 p-4 rounded bg-stone-50 border border-stone-200">
                <span className="font-semibold text-wensure-ink uppercase tracking-wider text-[10px] block">
                  Contested Issue & Claims
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {caseItem.issueDescription}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded bg-wensure-soft-stone/60 border border-wensure-fine-divider">
                <span className="font-semibold text-wensure-forest uppercase tracking-wider text-[10px] block">
                  Independent Civil Evidence Finding
                </span>
                <p className="text-stone-700 leading-relaxed font-medium">
                  {caseItem.evidenceSummary}
                </p>
              </div>
            </div>

            {/* Recommended Settlement */}
            <div className="p-4 rounded bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
              <span className="font-semibold text-emerald-950 uppercase tracking-wider text-[10px] block">
                Arbitrated Resolution Determination
              </span>
              <p className="text-emerald-900 leading-relaxed font-medium">
                {caseItem.recommendedResolution}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
