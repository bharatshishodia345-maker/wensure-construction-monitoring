import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faCompassDrafting } from '@fortawesome/free-solid-svg-icons';

interface TeamMember {
  name: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Madan Mohan Misra', initials: 'MM' },
  { name: 'Bharat Shishodia', initials: 'BS' },
  { name: 'Prithvi Singh', initials: 'PS' },
  { name: 'Preetam Gupta', initials: 'PG' },
];

export const AboutTeamSection: React.FC = () => {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#FAF9F6] border-y border-[#E8DFD0] scroll-reveal">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#203D35]/8 border border-[#203D35]/15 text-[11px] font-mono uppercase tracking-widest text-[#203D35] mb-5">
            <FontAwesomeIcon icon={faCompassDrafting} className="text-[#178F88] text-xs" />
            <span>The Team Behind WENSURE</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#17231F] leading-[1.15] mb-6">
            Built by ANANTEX. Driven by Trust.
          </h2>

          <p className="text-base sm:text-lg text-[#737970] leading-relaxed">
            We are building WENSURE to make residential construction progress more transparent, understandable and accountable.
          </p>
        </div>

        {/* 4 Team Member Profiles in strict required order:
            1. Madan Mohan Misra
            2. Bharat Shishodia
            3. Prithvi Singh
            4. Preetam Gupta
            (No fabricated job titles, qualifications, roles, biographies or active badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-[#E8DFD0] p-7 flex flex-col justify-between hover:border-[#203D35]/40 hover:shadow-lg transition-all group duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  {/* Monogram Badge */}
                  <div className="w-12 h-12 rounded-xl bg-[#203D35]/6 border border-[#203D35]/15 flex items-center justify-center text-[#203D35] font-display font-bold text-lg group-hover:bg-[#203D35] group-hover:text-white transition-colors duration-300">
                    {member.initials}
                  </div>
                  {/* Index */}
                  <span className="font-mono text-xs font-semibold text-[#737970] bg-[#FAF9F6] border border-[#E8DFD0] px-2.5 py-1 rounded-md">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl text-[#17231F] group-hover:text-[#203D35] transition-colors leading-snug">
                  {member.name}
                </h3>
                <p className="text-xs font-mono text-[#178F88] mt-1.5 uppercase tracking-wider">
                  Team ANANTEX
                </p>
              </div>

              <div className="pt-6 mt-8 border-t border-[#E8DFD0] flex items-center justify-between text-xs font-mono text-[#737970]">
                <span>WENSURE Initiative</span>
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#178F88] text-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
