import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'dark' | 'light' | 'monochrome';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  showTagline = false,
  className = '',
}) => {
  const isDark = variant === 'dark';

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Architectural Geometric W Symbol */}
      <div className="relative w-8 h-8 rounded-sm bg-wensure-ink flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 32 32"
          className="w-5 h-5 text-wensure-teal fill-none stroke-current"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 9L11 23L16 13L21 23L25 9" />
        </svg>
        {/* Subtle architectural cross-hair mark */}
        <div className="absolute top-1 right-1 w-1 h-1 bg-wensure-teal rounded-full opacity-80" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-semibold tracking-widest text-lg font-sans uppercase ${
              isDark ? 'text-wensure-ink' : 'text-white'
            }`}
          >
            WENSURE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-wensure-teal" />
        </div>
        {showTagline && (
          <span
            className={`text-[9.5px] tracking-wider uppercase font-medium -mt-1 ${
              isDark ? 'text-wensure-muted-text' : 'text-stone-300'
            }`}
          >
            We Ensure What Was Promised
          </span>
        )}
      </div>
    </Link>
  );
};
