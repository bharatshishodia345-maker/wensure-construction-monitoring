import React, { useState } from 'react';

export type ConstructionStageType =
  | 'villa'
  | 'foundation'
  | 'rcc-structure'
  | 'brickwork'
  | 'inspection'
  | 'blueprint';

interface ArchitecturalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  stage?: ConstructionStageType;
  fallbackLabel?: string;
  demoLabel?: string;
}

export const ArchitecturalImage: React.FC<ArchitecturalImageProps> = ({
  src,
  alt,
  className = '',
  stage = 'villa',
  fallbackLabel,
  demoLabel,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // High-fidelity SVG architectural fallbacks for offline or unreached network assets
  const renderFallback = () => {
    switch (stage) {
      case 'foundation':
        return (
          <div className={`w-full h-full bg-[#18231F] text-[#E7E2D8] flex flex-col justify-between p-6 relative overflow-hidden select-none ${className}`}>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#178F88_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-wensure-teal font-semibold">
                Technical Blueprint • Foundation Raft
              </span>
              <span className="text-[9px] font-mono text-stone-400">IS 456 / IS 2974</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
              {/* Foundation technical vector */}
              <svg viewBox="0 0 240 120" className="w-48 h-24 stroke-current fill-none text-wensure-sandstone stroke-[1.5]">
                <rect x="20" y="80" width="200" height="30" strokeDasharray="4 2" />
                <rect x="50" y="30" width="30" height="50" fill="currentColor" fillOpacity="0.1" />
                <rect x="160" y="30" width="30" height="50" fill="currentColor" fillOpacity="0.1" />
                <line x1="10" y1="80" x2="230" y2="80" />
                <line x1="65" y1="10" x2="65" y2="30" stroke="#178F88" />
                <line x1="175" y1="10" x2="175" y2="30" stroke="#178F88" />
                <path d="M40 95 L200 95" stroke="#BC5438" strokeWidth="2" />
              </svg>
              <p className="font-mono text-xs text-stone-200 mt-2 font-medium tracking-wide">
                {fallbackLabel || 'Substructure, Raft & Anti-Termite Barrier Stage'}
              </p>
              <span className="text-[10px] text-stone-400 font-light mt-0.5">
                Fe550D TMT Reinforcement • M25 Design Mix Specification
              </span>
            </div>
            <div className="relative z-10 text-[9.5px] font-mono text-stone-400 flex justify-between items-center pt-2 border-t border-white/10">
              <span>{demoLabel || 'Reference Construction Diagram'}</span>
              <span className="text-wensure-teal">WENSURE Telemetry</span>
            </div>
          </div>
        );

      case 'rcc-structure':
        return (
          <div className={`w-full h-full bg-[#16211D] text-[#E7E2D8] flex flex-col justify-between p-6 relative overflow-hidden select-none ${className}`}>
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-wensure-teal font-semibold">
                RCC Superstructure Detail
              </span>
              <span className="text-[9px] font-mono text-amber-300/80">Grid Inspection A-2</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
              <svg viewBox="0 0 240 120" className="w-52 h-24 stroke-current fill-none text-stone-300 stroke-[1.5]">
                {/* Column Column cross tie */}
                <rect x="80" y="20" width="80" height="80" stroke="#E7E2D8" strokeWidth="2" />
                <circle cx="95" cy="35" r="4" fill="#BC5438" />
                <circle cx="145" cy="35" r="4" fill="#BC5438" />
                <circle cx="95" cy="85" r="4" fill="#BC5438" />
                <circle cx="145" cy="85" r="4" fill="#BC5438" />
                <line x1="80" y1="20" x2="160" y2="100" strokeDasharray="3 3" opacity="0.4" />
                <line x1="160" y1="20" x2="80" y2="100" strokeDasharray="3 3" opacity="0.4" />
              </svg>
              <p className="font-mono text-xs text-stone-200 mt-2 font-medium">
                {fallbackLabel || 'RCC Column Reinforcement & 40mm Cover Check'}
              </p>
              <span className="text-[10px] text-stone-400 font-light mt-0.5">
                Pre-pour shuttering tolerance & vertical plumb verified
              </span>
            </div>
            <div className="relative z-10 text-[9.5px] font-mono text-stone-400 flex justify-between items-center pt-2 border-t border-white/10">
              <span>{demoLabel || 'Engineering Reference'}</span>
              <span className="text-wensure-teal">Grid Verified</span>
            </div>
          </div>
        );

      case 'brickwork':
        return (
          <div className={`w-full h-full bg-[#1D1B18] text-[#E7E2D8] flex flex-col justify-between p-6 relative overflow-hidden select-none ${className}`}>
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-wensure-terracotta font-semibold">
                Masonry & Conduit Grooving Detail
              </span>
              <span className="text-[9px] font-mono text-stone-400">Tolerance Log</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
              <svg viewBox="0 0 240 100" className="w-56 h-20 stroke-current fill-none stroke-[1.2]">
                <rect x="20" y="20" width="45" height="18" fill="#BC5438" fillOpacity="0.3" stroke="#BC5438" />
                <rect x="70" y="20" width="45" height="18" fill="#BC5438" fillOpacity="0.3" stroke="#BC5438" />
                <rect x="120" y="20" width="45" height="18" fill="#BC5438" fillOpacity="0.3" stroke="#BC5438" />
                <rect x="170" y="20" width="45" height="18" fill="#BC5438" fillOpacity="0.3" stroke="#BC5438" />
                <rect x="45" y="42" width="45" height="18" fill="#BC5438" fillOpacity="0.3" stroke="#BC5438" />
                <rect x="95" y="42" width="45" height="18" fill="#BC5438" fillOpacity="0.3" stroke="#BC5438" />
                <rect x="145" y="42" width="45" height="18" fill="#BC5438" fillOpacity="0.3" stroke="#BC5438" />
                {/* Conduit chase channel */}
                <line x1="117" y1="10" x2="117" y2="70" stroke="#178F88" strokeWidth="3" />
              </svg>
              <p className="font-mono text-xs text-stone-200 mt-2 font-medium">
                {fallbackLabel || 'Blockwork Masonry with 25mm Chased PVC Conduit Channel'}
              </p>
            </div>
            <div className="relative z-10 text-[9.5px] font-mono text-stone-400 flex justify-between items-center pt-2 border-t border-white/10">
              <span>{demoLabel || 'Pre-Plaster Audit Reference'}</span>
              <span className="text-wensure-teal">Documented Log</span>
            </div>
          </div>
        );

      case 'villa':
      default:
        return (
          <div className={`w-full h-full bg-[#121917] text-[#FAF8F5] flex flex-col justify-between p-8 relative overflow-hidden select-none ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#17231F]/50 to-transparent" />
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-wensure-teal font-semibold">
                Architectural Villa Perspective
              </span>
              <span className="text-[10px] font-mono text-stone-400">Contemporary Indian Residence</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-12 text-center max-w-md mx-auto">
              <svg viewBox="0 0 280 140" className="w-64 h-32 stroke-current fill-none stroke-[1.4] text-wensure-sandstone mb-3">
                {/* Modern villa geometry */}
                <path d="M30 110 L30 65 L110 65 L110 110 Z" fill="currentColor" fillOpacity="0.05" />
                <path d="M110 110 L110 40 L250 40 L250 110 Z" fill="currentColor" fillOpacity="0.08" />
                <line x1="20" y1="110" x2="260" y2="110" strokeWidth="2" />
                {/* Overhang cantilever */}
                <line x1="90" y1="40" x2="260" y2="40" stroke="#178F88" strokeWidth="2" />
                <rect x="130" y="55" width="45" height="35" stroke="#BC5438" />
                <rect x="190" y="55" width="45" height="35" stroke="#BC5438" />
                <rect x="50" y="75" width="35" height="35" stroke="currentColor" />
              </svg>
              <h4 className="font-display text-xl text-white font-normal">
                {fallbackLabel || 'Contemporary G+1 Residential Villa'}
              </h4>
              <p className="text-xs text-stone-300 font-light mt-1">
                RCC frame construction, exposed terracotta elements & thermal envelope
              </p>
            </div>
            <div className="relative z-10 text-[10px] font-mono text-stone-400 flex justify-between items-center pt-3 border-t border-white/10">
              <span>{demoLabel || 'Illustrative Residential Context'}</span>
              <span className="text-wensure-teal">WENSURE Project Model</span>
            </div>
          </div>
        );
    }
  };

  if (hasError || !src) {
    return renderFallback();
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-wensure-forest/20 animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
            Loading architectural view...
          </span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        {...rest}
      />
    </div>
  );
};
