import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export const AdminReportsPage: React.FC = () => {
  const { inspectionReports, verifyInspectionReport } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered =
    filter === 'All'
      ? inspectionReports
      : inspectionReports.filter((r) => r.verificationStatus === filter);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Audit Reports Verification Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Review on-site engineering findings, sign off verification certificates, and trigger milestone releases.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['All', 'Verified with Observations', 'Fully Verified'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === status
                ? 'bg-wensure-ink text-white'
                : 'bg-wensure-soft-stone text-wensure-muted-text hover:text-wensure-ink'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-wensure-fine-divider text-[10px] uppercase font-bold tracking-wider text-wensure-muted-text">
              <th className="py-3 px-4">Report Code & Title</th>
              <th className="py-3 px-4">Milestone</th>
              <th className="py-3 px-4">Lead Auditor</th>
              <th className="py-3 px-4">Audit Date</th>
              <th className="py-3 px-4">Quality Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wensure-fine-divider">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="py-4 px-4 max-w-xs">
                  <span className="font-mono font-bold text-wensure-forest text-[11px] block">
                    {r.reportCode}
                  </span>
                  <span className="font-semibold text-wensure-ink">{r.title}</span>
                </td>
                <td className="py-4 px-4 font-medium text-stone-700">
                  {r.milestoneChecked}
                </td>
                <td className="py-4 px-4 text-wensure-ink">
                  {r.inspectorName}
                </td>
                <td className="py-4 px-4 text-stone-500 whitespace-nowrap">
                  {r.inspectionDate}
                </td>
                <td className="py-4 px-4 font-mono font-bold text-wensure-forest">
                  {r.overallScore}%
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${
                      r.verificationStatus === 'Fully Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.verificationStatus}
                  </span>
                </td>
                <td className="py-4 px-4 text-right space-x-2">
                  <Link
                    to={`/customer/inspections/${r.id}`}
                    className="text-xs font-semibold text-wensure-forest hover:text-wensure-teal underline"
                  >
                    View
                  </Link>

                  {r.verificationStatus !== 'Fully Verified' && (
                    <button
                      onClick={() => verifyInspectionReport(r.id)}
                      className="px-2.5 py-1 bg-wensure-teal hover:bg-wensure-forest text-white rounded text-[11px] font-medium transition-colors"
                    >
                      Sign Off
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
