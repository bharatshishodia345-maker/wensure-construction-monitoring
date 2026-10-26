import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const AnnouncementStrip: React.FC = () => {
  return (
    <div className="bg-[#17231F] text-white py-2 px-4 border-b border-white/10 text-xs tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#178F88] animate-pulse" />
          <span className="font-medium text-stone-200">
            Independent construction monitoring. Clearer decisions.
          </span>
          <span className="hidden md:inline text-stone-400 font-normal">
            — Demonstration Project Reference: Baner Corridor, Pune (Villa WNS-PUN-2026-001)
          </span>
        </div>

        <Link
          to="/login"
          className="group hidden sm:inline-flex items-center gap-1.5 text-stone-300 hover:text-[#178F88] transition-colors font-medium text-[11px] uppercase tracking-wider"
        >
          <span>Explore Live Project</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-[10px] transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
