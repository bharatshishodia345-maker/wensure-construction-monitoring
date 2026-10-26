import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faShieldHalved,
  faIndianRupeeSign,
  faTriangleExclamation,
  faHouseChimney,
  faArrowRight,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ProjectData } from '../../../types';
import { DEMO_CATEGORIES, DemoCategory, HOMEPAGE_BUDGET_METRICS } from '../data/homepageData';

interface DemoSpotlightSectionProps {
  project: ProjectData;
}

const TAB_ICONS: Record<DemoCategory, IconDefinition> = {
  Overview: faHouseChimney,
  Progress: faChartLine,
  Inspections: faShieldHalved,
  Budget: faIndianRupeeSign,
  'Contractor Records': faCheckCircle,
};

export const DemoSpotlightSection: React.FC<DemoSpotlightSectionProps> = ({ project }) => {
  const [activeCategory, setActiveCategory] = useState<DemoCategory>('Overview');

  return (
    <section id="demo-spotlight" className="bg-[#FAF9F6] py-24 sm:py-32 scroll-reveal">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#203D35]/8 border border-[#203D35]/15 text-[11px] font-mono uppercase tracking-widest text-[#203D35] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#178F88]" />
              Interactive Platform Demo
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-[#17231F] leading-tight">
              See the product.<br />
              <span className="italic text-[#178F88]">Understand the difference.</span>
            </h2>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 text-xs text-[#737970] font-mono bg-white border border-[#E8DFD0] px-4 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#B86C4A]" />
              Demo: {project.name} — {project.code}
            </span>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mb-8 bg-white border border-[#E8DFD0] rounded-xl p-1.5">
          {DEMO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#17231F] text-white shadow-sm'
                  : 'text-[#737970] hover:text-[#17231F] hover:bg-[#FAF9F6]'
              }`}
            >
              <FontAwesomeIcon icon={TAB_ICONS[cat]} className={`w-3 h-3 ${activeCategory === cat ? 'text-[#178F88]' : ''}`} />
              {cat}
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm overflow-hidden min-h-[420px]">
          {activeCategory === 'Overview' && (
            <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Progress metric */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#178F88]/10 border border-[#178F88]/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faHouseChimney} className="text-[#178F88]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#17231F] text-sm">{project.name}</h3>
                    <p className="text-xs text-[#737970] font-mono">{project.address}, {project.city} · {project.code}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#737970]">Construction Progress</span>
                      <span className="font-mono font-bold text-[#17231F]">{project.recordedProgress}% Verified</span>
                    </div>
                    <div className="h-4 bg-[#E8DFD0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#178F88] to-emerald-400 transition-all"
                        style={{ width: `${project.recordedProgress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#737970]">Budget Disbursed</span>
                      <span className="font-mono font-bold text-[#17231F]">₹54L / {HOMEPAGE_BUDGET_METRICS.totalBudgetFormatted}</span>
                    </div>
                    <div className="h-4 bg-[#E8DFD0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#B86C4A] to-amber-500" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#178F88] font-medium font-mono mt-4">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  <span>All figures independently verified · Illustrative demonstration data</span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="space-y-4">
                {[
                  { label: 'Open Observations', value: String(project.openObservationsCount), icon: faTriangleExclamation, color: '#B86C4A' },
                  { label: 'Next Inspection', value: project.nextInspectionDate, icon: faShieldHalved, color: '#178F88' },
                  { label: 'Contract Budget', value: HOMEPAGE_BUDGET_METRICS.totalBudgetFormatted, icon: faIndianRupeeSign, color: '#203D35' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#FAF9F6] border border-[#E8DFD0] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15` }}>
                      <FontAwesomeIcon icon={item.icon} style={{ color: item.color }} className="text-sm" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#737970]">{item.label}</p>
                      <p className="font-semibold text-[#17231F] text-sm font-mono">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'Progress' && (
            <div className="p-8 sm:p-10 space-y-6">
              <h3 className="font-display text-2xl text-[#17231F]">Construction Milestones</h3>
              <div className="space-y-3">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-center justify-between bg-[#FAF9F6] border border-[#E8DFD0] rounded-xl px-5 py-4">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        m.actualProgress >= 100 ? 'bg-[#178F88]/15 text-[#178F88]' : 
                        m.actualProgress > 0 ? 'bg-amber-50 text-amber-700' : 'bg-[#E8DFD0] text-[#737970]'
                      }`}>
                        {m.id.replace('MS-', '')}
                      </span>
                      <div>
                        <p className="font-semibold text-[#17231F] text-sm">{m.name}</p>
                        <p className="text-xs text-[#737970] font-mono">Stage: {m.stage} · Planned: {m.plannedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-24 h-2 bg-[#E8DFD0] rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${m.actualProgress >= 100 ? 'bg-[#178F88]' : 'bg-amber-500'}`}
                          style={{ width: `${m.actualProgress}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold ${m.actualProgress >= 100 ? 'text-[#178F88]' : 'text-amber-700'}`}>
                        {m.actualProgress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'Budget' && (
            <div className="p-8 sm:p-10 space-y-6">
              <h3 className="font-display text-2xl text-[#17231F]">Financial Governance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Contract Total', value: '₹90,00,000', sub: 'Baseline', color: '#203D35' },
                  { label: 'Verified & Disbursed', value: '₹54,00,000', sub: '60% Released', color: '#178F88' },
                  { label: 'In Escrow', value: '₹36,00,000', sub: '40% Remaining', color: '#B86C4A' },
                ].map((card) => (
                  <div key={card.label} className="bg-[#FAF9F6] border border-[#E8DFD0] rounded-xl p-6 space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#737970]">{card.label}</span>
                    <div className="font-display text-3xl" style={{ color: card.color }}>{card.value}</div>
                    <span className="text-xs text-[#737970] font-mono">{card.sub}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#737970] font-mono border-t border-[#E8DFD0] pt-4">
                Illustrative demonstration data aligned with WENSURE reference project · ₹90L total · ₹54L disbursed
              </p>
            </div>
          )}

          {activeCategory === 'Inspections' && (
            <div className="p-8 sm:p-10 space-y-6">
              <h3 className="font-display text-2xl text-[#17231F]">Audit & Inspection Reports</h3>
              <div className="space-y-3">
                {project.upcomingAudits.slice(0, 3).map((audit) => (
                  <div key={audit.id} className="bg-[#FAF9F6] border border-[#E8DFD0] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-[#178F88]/10 border border-[#178F88]/20 flex items-center justify-center">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-[#178F88] text-sm" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17231F] text-sm">{audit.title}</p>
                        <p className="text-xs text-[#737970] font-mono">{audit.scheduledDate} · {audit.leadAuditor}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                      Scheduled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'Contractor Records' && (
            <div className="p-8 sm:p-10 space-y-6">
              <h3 className="font-display text-2xl text-[#17231F]">Contractor Performance Register</h3>
              <div className="bg-[#FAF9F6] border border-[#E8DFD0] rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#17231F]">{project.contractor.name}</h4>
                    <p className="text-xs text-[#737970] font-mono">Lead Civil Contractor · Baner, Pune</p>
                  </div>
                  <span className="text-xs font-mono bg-[#178F88]/10 text-[#178F88] border border-[#178F88]/20 px-3 py-1 rounded-full">
                    Verified Tier
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {[
                    { label: 'Audit Score', value: '98.4%' },
                    { label: 'Open Issues', value: String(project.openObservationsCount) },
                    { label: 'Work Updates', value: `${project.sitePhotos.length}` },
                    { label: 'Milestones', value: `${project.milestones.filter(m => m.actualProgress >= 100).length}/${project.milestones.length} Done` },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="font-display text-2xl text-[#17231F]">{stat.value}</div>
                      <div className="text-[10px] font-mono text-[#737970] uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom CTA Bar */}
          <div className="border-t border-[#E8DFD0] px-8 py-5 bg-[#FAF9F6] flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-[#737970] font-mono">
              Illustrative demo data · All metrics match WENSURE reference project
            </p>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-[#17231F] hover:text-[#178F88] transition-colors uppercase tracking-wider"
            >
              <span>Open Full Demo</span>
              <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
