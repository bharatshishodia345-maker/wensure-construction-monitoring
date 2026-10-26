import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementStrip } from '../common/AnnouncementStrip';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { ToastContainer } from '../common/Toast';

export const PublicLayout: React.FC = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const scrollToElement = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scrollToElement()) {
        const timer = setTimeout(scrollToElement, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash, pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-wensure-warm-white text-wensure-ink selection:bg-wensure-teal selection:text-white">
      <AnnouncementStrip />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
