import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faArrowRight,
  faCube,
} from '@fortawesome/free-solid-svg-icons';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="relative overflow-hidden scroll-reveal">
      {/* Full-bleed architectural background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=80"
          alt="Indian residential home — architectural exterior, evening light"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1A17]/40 via-[#0D1A17]/75 to-[#0D1A17]/95" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center py-36 sm:py-48">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono uppercase tracking-widest text-[#178F88] mb-8 backdrop-blur-sm">
          <FontAwesomeIcon icon={faShieldHalved} />
          <span>Independent Residential Oversight</span>
        </div>

        {/* Headline */}
        <h2 className="font-display text-5xl sm:text-7xl text-white leading-[1.06] mb-6">
          Your home deserves<br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#178F88] to-emerald-300">
            verified truth.
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-stone-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Replace fragmented messages and vague estimates with dated photographic logs, independent civil audits, and milestone-linked verification.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            to="/login"
            id="cta-explore-demo"
            className="group inline-flex items-center gap-3 bg-white text-[#17231F] hover:bg-[#E8DFD0] px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-xl"
          >
            <span>Explore Demo Workspace</span>
            <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/experience"
            id="cta-3d-journey"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200 backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={faCube} className="text-[#178F88]" />
            <span>Experience 3D Journey</span>
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-xs font-mono text-stone-400">
          {[
            'Third-Party Civil Audits',
            'Milestone-Linked Escrow',
            'Photographic Evidence Logs',
            'Real-Time Progress Tracking',
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#178F88]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
