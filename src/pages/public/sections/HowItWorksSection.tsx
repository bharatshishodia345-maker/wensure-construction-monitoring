import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileLines,
  faCamera,
  faClipboardCheck,
  faShieldHalved,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { ProjectData } from '../../../types';

interface HowItWorksSectionProps {
  project: ProjectData;
}

const STAGES = [
  {
    id: '01',
    label: 'PROMISE',
    icon: faFileLines,
    color: '#178F88',
    headline: 'A clear construction plan.',
    body: 'Milestone schedule, structural specifications, and escrow-linked payment tranches locked before ground breaks. No vague verbal commitments.',
    accent: 'border-[#178F88]',
    badgeBg: 'bg-[#178F88]/10 text-[#178F88] border-[#178F88]/30',
  },
  {
    id: '02',
    label: 'OBSERVE',
    icon: faCamera,
    color: '#B86C4A',
    headline: 'Progress backed by evidence.',
    body: 'Contractors submit structured, timestamped updates tagged to specific structural grid points — not casual photos on messaging apps.',
    accent: 'border-[#B86C4A]',
    badgeBg: 'bg-[#B86C4A]/10 text-[#B86C4A] border-[#B86C4A]/30',
  },
  {
    id: '03',
    label: 'INSPECT',
    icon: faClipboardCheck,
    color: '#E8DFD0',
    headline: 'Findings from authorized inspections.',
    body: 'Independent civil engineers audit tolerances on site — rebar cover, concrete slump, plumb alignment — before flaws are permanently plastered over.',
    accent: 'border-[#E8DFD0]',
    badgeBg: 'bg-white/10 text-stone-200 border-white/20',
  },
  {
    id: '04',
    label: 'VERIFY',
    icon: faShieldHalved,
    color: '#178F88',
    headline: 'Know what has actually been verified.',
    body: 'Stage payments release only after physical verification confirms construction exists and meets engineering benchmarks. No unverified advances.',
    accent: 'border-[#178F88]',
    badgeBg: 'bg-[#178F88]/10 text-[#178F88] border-[#178F88]/30',
  },
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ project }) => {
  return (
    <section id="how-it-works" className="bg-[#17231F] text-white relative overflow-hidden">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
        {/* Section Header */}
        <div className="max-w-2xl mb-20 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#178F88]/15 border border-[#178F88]/30 text-[11px] font-mono uppercase tracking-widest text-[#178F88] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#178F88]" />
            The WENSURE Protocol
          </div>
          <h2 className="font-display text-4xl sm:text-6xl leading-tight mb-4">
            From contractor promises<br />
            <span className="italic text-stone-300">to verified reality.</span>
          </h2>
          <p className="text-stone-400 text-base sm:text-lg font-light leading-relaxed">
            Four stages. Complete accountability. Every rupee tracked against physical evidence.
          </p>
        </div>

        {/* ── VISUAL STAGES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal">
          {STAGES.map((stage, idx) => (
            <div
              key={stage.id}
              className={`relative flex flex-col bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-all duration-300 hover:border-opacity-60 group overflow-hidden`}
              style={{ borderTopColor: stage.color, borderTopWidth: '3px' }}
            >
              {/* Background number watermark */}
              <span className="absolute bottom-4 right-4 text-[72px] font-display text-white/4 leading-none select-none pointer-events-none">
                {stage.id}
              </span>

              {/* Icon */}
              <div className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stage.color}18`, border: `1px solid ${stage.color}30` }}>
                <FontAwesomeIcon icon={stage.icon} className="text-lg" style={{ color: stage.color }} />
              </div>

              {/* Badge */}
              <span className={`self-start text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded border font-semibold mb-4 ${stage.badgeBg}`}>
                {stage.id} — {stage.label}
              </span>

              <h3 className="font-display text-xl text-white leading-snug mb-3">
                {stage.headline}
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed font-light flex-1">
                {stage.body}
              </p>

              {/* Connector arrow (hidden on last) */}
              {idx < STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-[#17231F] border border-white/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px] text-[#178F88]" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── VERIFY COMPARISON VISUAL ── */}
        <div className="mt-20 scroll-reveal">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-stone-300 mb-1">
                Transparency in Action
              </div>
              <h3 className="font-display text-3xl sm:text-4xl text-white leading-tight">
                Claimed vs.&nbsp;
                <span className="italic text-[#178F88]">verified</span>&nbsp;— the gap that matters.
              </h3>
              <p className="text-stone-400 leading-relaxed font-light">
                WENSURE makes the delta between contractor self-reporting and independent audit findings visible before a single rupee moves.
              </p>
              <div className="flex gap-4 pt-2">
                <Link
                  to="/login?role=customer"
                  className="group inline-flex items-center gap-2 bg-[#178F88] hover:bg-[#0E746F] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <span>Explore Homeowner View</span>
                  <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right: progress comparison bars */}
            <div className="bg-[#0D1A17] rounded-xl p-7 space-y-6 border border-white/10">
              <div className="text-xs text-stone-400 font-mono uppercase tracking-wider pb-3 border-b border-white/10">
                Project Reference: {project.code} — Illustrative Demo
              </div>

              {/* Contractor claimed */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Contractor Self-Reported</span>
                  <span className="font-mono text-amber-400 font-bold">72%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500/70" style={{ width: '72%' }} />
                </div>
              </div>

              {/* Independently verified */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-white flex items-center gap-2 font-medium">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-[#178F88]" />
                    WENSURE Verified
                  </span>
                  <span className="font-mono text-[#178F88] font-bold">{project.recordedProgress}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#178F88]" style={{ width: `${project.recordedProgress}%` }} />
                </div>
              </div>

              <div className="bg-[#178F88]/10 border border-[#178F88]/20 rounded-lg p-4 text-sm text-stone-300 font-light">
                <span className="text-[#178F88] font-semibold block mb-1">Escrow Active</span>
                Next tranche release locked until column cube test reports and field tolerances are independently confirmed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
