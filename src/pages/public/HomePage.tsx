import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './sections/HeroSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { DemoSpotlightSection } from './sections/DemoSpotlightSection';
import { AudienceSection } from './sections/AudienceSection';
import { ContractorDirectorySection } from './sections/ContractorDirectorySection';
import { AboutTeamSection } from './sections/AboutTeamSection';
import { FinalCTASection } from './sections/FinalCTASection';

// Hook for scroll-triggered reveal animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const targets = el.querySelectorAll('.scroll-reveal');
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export const HomePage: React.FC = () => {
  const { project, contractors } = useApp();
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef} className="text-[#17231F] selection:bg-[#178F88]/20">
      <HeroSection project={project} />
      <HowItWorksSection project={project} />
      <DemoSpotlightSection project={project} />
      <AudienceSection />
      <ContractorDirectorySection contractors={contractors} />
      <AboutTeamSection />
      <FinalCTASection />
    </div>
  );
};

export default HomePage;
