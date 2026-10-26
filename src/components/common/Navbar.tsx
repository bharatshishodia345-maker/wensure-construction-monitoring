import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faXmark,
  faCube,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = location.pathname === '/' || location.pathname === '/overview';
  const getHref = (hash: string) => (isPublicPage ? hash : `/${hash}`);

  const navLinks = [
    { name: '3D Journey', href: '/experience', isSpecial: true },
    { name: 'How It Works', href: getHref('#how-it-works') },
    { name: 'For Homeowners', href: getHref('#for-homeowners') },
    { name: 'Find Contractors', href: getHref('#find-contractors') },
    { name: 'Our Approach', href: getHref('#our-approach') },
    { name: 'About', href: getHref('#about') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8DFD0] transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="shrink-0">
          <Logo showTagline={false} />
        </div>

        {/* Center: Clean Nav Links with Safe Responsive Breakpoint (lg instead of md to prevent collision) */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[13.5px] font-medium text-[#17231F]/80">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`hover:text-[#178F88] transition-colors py-2 relative group flex items-center gap-1.5 ${
                link.isSpecial ? 'text-[#203D35] font-semibold' : ''
              }`}
            >
              {link.isSpecial && (
                <FontAwesomeIcon icon={faCube} className="text-[#178F88] text-xs" />
              )}
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#178F88] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Sign In & Explore Demo Button */}
        <div className="hidden sm:flex items-center space-x-4 shrink-0">
          <Link
            to="/login"
            className="text-[13.5px] font-medium text-[#17231F]/80 hover:text-[#178F88] transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 bg-[#203D35] text-white hover:bg-[#17231F] px-4 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow"
          >
            <span>Explore Demo</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[#178F88] text-xs transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger (visible below lg to prevent collision) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#17231F] hover:text-[#178F88] transition-colors"
          aria-label="Toggle navigation menu"
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-xl w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b border-[#E8DFD0] px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#17231F] hover:text-[#178F88] py-1.5 flex items-center gap-2"
              >
                {link.isSpecial && (
                  <FontAwesomeIcon icon={faCube} className="text-[#178F88] text-xs" />
                )}
                <span>{link.name}</span>
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-[#E8DFD0] flex flex-col space-y-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 text-sm font-medium text-[#17231F] border border-[#E8DFD0] rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#203D35] text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Explore Demo</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[#178F88] text-xs" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
