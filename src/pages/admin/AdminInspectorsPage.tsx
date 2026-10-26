import React from 'react';
import { DEMO_INSPECTORS } from '../../data/demoData';
import { Star } from 'lucide-react';

export const AdminInspectorsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Field Quality Auditors & Engineering Cadre
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Licensed structural and MEP civil engineers conducting on-site physical audits and milestone verifications.
        </p>
      </div>

      {/* Inspectors Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_INSPECTORS.map((insp) => (
          <div
            key={insp.id}
            className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                  {insp.id}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {insp.status}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-base text-wensure-ink">
                  {insp.name}
                </h3>
                <p className="text-xs text-wensure-teal font-medium mt-0.5">
                  {insp.role}
                </p>
              </div>

              <div className="p-3 rounded bg-wensure-soft-stone/40 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-wensure-muted-text block">
                  Qualifications & Accreditation
                </span>
                <p className="text-stone-800 font-medium leading-relaxed">
                  {insp.qualification}
                </p>
              </div>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Field Experience</span>
                  <span className="font-semibold text-wensure-ink">
                    {insp.experienceYears} Years
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Completed Audits</span>
                  <span className="font-semibold text-wensure-forest">
                    {insp.completedAudits} Verified Sites
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Active Workload</span>
                  <span className="font-semibold text-amber-700">
                    {insp.activeAudits} Projects
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-wensure-fine-divider flex items-center justify-between text-xs">
              <span className="text-stone-500">Auditor Quality Rating</span>
              <span className="font-bold text-wensure-ink flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {insp.rating} / 5.0
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
