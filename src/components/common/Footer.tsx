import React from 'react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faLocationDot,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

const TEAM_MEMBERS = [
  { name: 'Madan Mohan Misra' },
  { name: 'Bharat Shishodia' },
  { name: 'Prithvi Singh' },
  { name: 'Preetam Gupta' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#17231F] text-stone-300 pt-20 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <Logo variant="light" showTagline={true} />
            <p className="text-sm text-stone-400 font-normal leading-relaxed max-w-sm pt-2">
              Independent construction monitoring and third-party verification for homeowners who hire contractors to build their homes. We document truth, verify quality, and protect commitments.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-[#178F88] font-medium tracking-wide">
              <FontAwesomeIcon icon={faShieldHalved} className="text-sm" />
              <span>Independent Third-Party Verification Platform</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold font-mono">Platform</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li><Link to="/experience" className="hover:text-white transition-colors">3D Journey</Link></li>
              <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/#for-homeowners" className="hover:text-white transition-colors">For Homeowners</a></li>
              <li><a href="/#find-contractors" className="hover:text-white transition-colors">Find Contractors</a></li>
              <li><a href="/#our-approach" className="hover:text-white transition-colors">Our Approach</a></li>
              <li><a href="/#about" className="hover:text-white transition-colors">About ANANTEX</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Interactive Demo</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold font-mono">Portals</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li><Link to="/login?role=customer" className="hover:text-white transition-colors">Customer Portal</Link></li>
              <li><Link to="/login?role=contractor" className="hover:text-white transition-colors">Contractor Workspace</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-white transition-colors">Operations &amp; Audit</Link></li>
              <li><Link to="/customer/inspections/INS-RPT-2026-003" className="hover:text-white transition-colors">Sample Audit Report</Link></li>
            </ul>
          </div>

          {/* Demonstration Context */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold font-mono">Project Context</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#178F88] shrink-0 mt-0.5" />
                <span>Baner Corridor, Pune, Maharashtra (Reference Site)</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#178F88] shrink-0" />
                <span>Demonstration &amp; Verification Showcase</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#178F88] shrink-0" />
                <span>team@wensure.in</span>
              </div>
            </div>
          </div>

          {/* Team Anantex */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold font-mono">Built By</h4>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#178F88] tracking-wide font-display">Team ANANTEX</p>
              <ul className="space-y-1.5 pt-1">
                {TEAM_MEMBERS.map((member) => (
                  <li key={member.name}>
                    <span className="text-xs text-stone-300 hover:text-white transition-colors cursor-default">
                      {member.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 WENSURE • Developed by Team ANANTEX. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-stone-400 bg-white/5 px-2.5 py-1 rounded text-[11px] font-mono">
              Demo Environment: Illustrative Residential Project WNS-PUN-2026-001
            </span>
            <span className="text-stone-500">
              Crafted by <span className="text-[#178F88] font-medium">Team ANANTEX</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
