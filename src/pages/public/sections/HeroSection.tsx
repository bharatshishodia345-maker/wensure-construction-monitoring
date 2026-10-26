import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProjectData } from '../../../types';
import { HOMEPAGE_BUDGET_METRICS } from '../data/homepageData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faShieldHalved,
  faLocationDot,
  faIndianRupeeSign,
  faCube,
} from '@fortawesome/free-solid-svg-icons';

interface HeroSectionProps {
  project: ProjectData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ project }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const pctRef = useRef<HTMLSpanElement>(null);

  // Count-up animation for progress percentage
  useEffect(() => {
    const target = project.recordedProgress;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      if (pctRef.current) pctRef.current.textContent = `${current}%`;
      if (current >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [project.recordedProgress]);

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#17231F]">
      {/* ── BACKGROUND ARCHITECTURAL IMAGE ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2400&q=85"
          alt="Contemporary Indian residential villa — warm-toned architecture, Pune"
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Layered gradient scrims for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A17]/95 via-[#0D1A17]/70 to-[#0D1A17]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A17]/80 via-transparent to-transparent" />
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-[#178F88]/40 bg-[#178F88]/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#178F88] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#178F88] font-semibold">
              Independent Construction Monitoring · India
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] text-white leading-[1.04] tracking-tight mb-6">
            Your Dream Home.
            <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#178F88] to-emerald-300">
              Our Independent
            </span>
            <br />
            <span className="text-white">Oversight.</span>
          </h1>

          {/* Sub-copy — minimal */}
          <p className="text-lg sm:text-xl text-stone-300 font-light leading-relaxed mb-10 max-w-xl">
            See what was promised.&nbsp;
            <span className="text-stone-100 font-normal">Track what is happening.</span>&nbsp;
            Know what is verified.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              id="hero-explore-cta"
              className="group inline-flex items-center justify-center gap-3 bg-[#178F88] hover:bg-[#0E746F] text-white px-8 py-4 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#178F88]/30 hover:shadow-[#178F88]/50"
            >
              <span>Explore WENSURE</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/experience"
              id="hero-3d-cta"
              className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-4 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200 backdrop-blur-sm"
            >
              <FontAwesomeIcon icon={faCube} className="w-4 h-4 text-[#178F88]" />
              <span>3D Construction Journey</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── FLOATING PROJECT TELEMETRY CARD ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pb-10">
        <div className="bg-[#0D1A17]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 shadow-2xl">
          {/* Metric 1 */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">Verified Progress</span>
            <span ref={pctRef} className="text-3xl sm:text-4xl font-display text-white">0%</span>
            <span className="text-[11px] text-[#178F88] font-mono">
              <FontAwesomeIcon icon={faShieldHalved} className="mr-1" />
              Independently Audited
            </span>
          </div>

          {/* Metric 2 */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">Budget Disbursed</span>
            <span className="text-3xl sm:text-4xl font-display text-white">₹54L</span>
            <span className="text-[11px] text-stone-400 font-mono">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
              of {HOMEPAGE_BUDGET_METRICS.totalBudgetFormatted} total
            </span>
          </div>

          {/* Metric 3 */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">Project Location</span>
            <span className="text-xl sm:text-2xl font-display text-white">{project.city}</span>
            <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
              <FontAwesomeIcon icon={faLocationDot} className="text-[#178F88]" />
              {project.address}
            </span>
          </div>

          {/* Metric 4 — Demo label */}
          <div className="space-y-1 border-l border-white/10 pl-6 sm:pl-0 sm:border-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">Reference ID</span>
            <span className="text-xl sm:text-2xl font-display text-white font-mono">{project.code}</span>
            <span className="text-[11px] text-stone-500 font-mono">Illustrative Demo Project</span>
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR (Desktop only to prevent overlap) ── */}
      <div className="hidden xl:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1 opacity-70 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Scroll</span>
        <div className="w-4 h-6 rounded-full border border-white/20 flex items-start justify-center pt-1">
          <div className="w-1 h-1.5 rounded-full bg-[#178F88] animate-bounce" />
        </div>
      </div>
    </section>
  );
};
