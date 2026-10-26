import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faLocationDot,
  faStar,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { ContractorProfile } from '../../../types';
import { ArchitecturalImage } from '../../../components/common/ArchitecturalImage';

interface ContractorDirectorySectionProps {
  contractors: ContractorProfile[];
}

export const ContractorDirectorySection: React.FC<ContractorDirectorySectionProps> = ({ contractors }) => {
  return (
    <section id="find-contractors" className="py-24 sm:py-32 bg-[#FAF9F6] scroll-reveal">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#203D35]/8 border border-[#203D35]/15 text-[11px] font-mono uppercase tracking-widest text-[#203D35] mb-4">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#178F88] text-xs" />
              <span>Verified Builder Directory</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#17231F] leading-tight">
              Choose builders based on documented civil evidence.
            </h2>
            <p className="text-sm text-[#737970] mt-3 font-normal">
              Illustrative builder profiles displaying independent quality compliance scores.
            </p>
          </div>
          <Link
            to="/customer/contractors"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#178F88] hover:text-[#203D35] transition-colors shrink-0"
          >
            <span>Explore All Builders</span>
            <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Contractor Profile Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contractors.slice(0, 3).map((builder) => (
            <div
              key={builder.id}
              className="bg-white rounded-2xl border border-[#E8DFD0] overflow-hidden hover:shadow-xl hover:border-[#203D35]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-52 overflow-hidden relative bg-[#17231F]">
                  <ArchitecturalImage
                    src={builder.heroImageUrl}
                    alt={builder.companyName}
                    stage="villa"
                    fallbackLabel={builder.companyName}
                    demoLabel="Builder Portfolio Reference"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-[#17231F]/90 text-white text-[10px] font-mono font-medium px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/10 shadow-sm">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-[#178F88] text-xs" />
                    <span>{builder.verifiedTier}</span>
                  </span>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#737970] flex items-center gap-1.5 font-mono">
                      <FontAwesomeIcon icon={faLocationDot} className="text-[#178F88] text-xs shrink-0" />
                      {builder.location.split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#17231F] font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      <FontAwesomeIcon icon={faStar} className="text-amber-500 text-xs" />
                      {builder.rating} ({builder.reviewCount})
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-[#17231F] group-hover:text-[#203D35] transition-colors leading-snug">
                    {builder.companyName}
                  </h3>
                  <p className="text-xs text-[#737970] line-clamp-2 leading-relaxed font-normal">
                    {builder.tagline}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {builder.specializations.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] font-mono bg-[#FAF9F6] text-[#203D35] px-2.5 py-1 rounded-md border border-[#E8DFD0]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 border-t border-[#E8DFD0] mt-4">
                <div className="pt-4 flex items-center justify-between text-xs text-[#737970]">
                  <span className="font-mono text-[11px] font-medium">{builder.verifiedProjectsCount} Verified Builds</span>
                  <Link
                    to={`/customer/contractors/${builder.id}`}
                    className="font-semibold text-[#203D35] hover:text-[#178F88] flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Dossier</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
