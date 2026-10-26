import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouseChimney,
  faHardHat,
  faCheckCircle,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

const HOMEOWNER_BENEFITS = [
  'Stay informed from anywhere — eliminate anxiety of informal photo updates',
  'Pay only for verified work — release funds after third-party civil confirmation',
  'Catch defects before they are permanently plastered over',
  "Retain a complete digital as-built archive for your home's lifetime",
];

const CONTRACTOR_BENEFITS = [
  'Independent sign-offs eliminate subjective disputes and unlock prompt payment',
  'Verified audit scores become a differentiating credential on new project bids',
  'Evidence logs protect you from frivolous client claims',
  'Structured work update system replaces informal WhatsApp reporting',
];

export const AudienceSection: React.FC = () => {
  return (
    <section id="for-homeowners" className="relative bg-[#E8DFD0]/40 scroll-reveal">
      <div id="our-approach" className="absolute -top-20" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#203D35]/8 border border-[#203D35]/15 text-[11px] font-mono uppercase tracking-widest text-[#203D35] mb-5">
            Who WENSURE Is For
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-[#17231F] leading-tight">
            Transparency empowers<br />
            <span className="italic text-[#178F88]">great construction.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Homeowner Card */}
          <div className="group relative bg-white rounded-3xl border border-[#E8DFD0] p-10 sm:p-12 overflow-hidden hover:shadow-2xl hover:shadow-[#17231F]/10 transition-all duration-500">
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#178F88] to-emerald-400 rounded-t-3xl" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#178F88]/10 border border-[#178F88]/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faHouseChimney} className="text-[#178F88] text-xl" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-[#17231F]">For Indian Homeowners</h3>
                <p className="text-sm text-[#737970]">Confidence from foundation to handover</p>
              </div>
            </div>

            <ul className="space-y-4">
              {HOMEOWNER_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-[#484E46] leading-relaxed">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#178F88] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-[#E8DFD0]">
              <Link
                to="/login?role=customer"
                className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-[#17231F] hover:text-[#178F88] transition-colors uppercase tracking-wider"
              >
                <span>Launch Homeowner Demo</span>
                <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Contractor Card */}
          <div className="group relative bg-[#17231F] rounded-3xl border border-white/10 p-10 sm:p-12 overflow-hidden hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B86C4A] to-amber-500 rounded-t-3xl" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <FontAwesomeIcon icon={faHardHat} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-white">For Quality Builders</h3>
                <p className="text-sm text-stone-400">Reputation built on verified outcomes</p>
              </div>
            </div>

            <ul className="space-y-4">
              {CONTRACTOR_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-stone-300 leading-relaxed">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#B86C4A] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-white/10">
              <Link
                to="/login?role=contractor"
                className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#178F88] transition-colors uppercase tracking-wider"
              >
                <span>Launch Contractor Demo</span>
                <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
