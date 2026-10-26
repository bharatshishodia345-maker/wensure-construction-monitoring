import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneManager } from '../../experience/three/SceneManager';
import { CinematicNavigation } from '../../experience/components/CinematicNavigation';
import { SceneHUD } from '../../experience/components/SceneHUD';
import { SupervisorTabletHUD } from '../../experience/components/SupervisorTabletHUD';
import { SceneTransparencyHUD } from '../../experience/components/SceneTransparencyHUD';
import { IntegratedLoginHUD } from '../../experience/components/IntegratedLoginHUD';
import { soundEngine } from '../../experience/audio/soundEngine';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CinematicLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [webGLError, setWebGLError] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Listen to system prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (sceneManagerRef.current) {
        sceneManagerRef.current.setReducedMotion(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize Three.js SceneManager
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Check WebGL availability
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL is not supported by your browser or graphics hardware.');
      }

      // Initialize 3D Scene
      const sceneManager = new SceneManager(containerRef.current);
      sceneManager.setReducedMotion(reducedMotion);
      sceneManagerRef.current = sceneManager;

      // Finish loading after first render frame
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 700);

      return () => {
        clearTimeout(timer);
        if (sceneManagerRef.current) {
          sceneManagerRef.current.destroy();
          sceneManagerRef.current = null;
        }
      };
    } catch (err: unknown) {
      console.error('Failed to initialize 3D scene:', err);
      setWebGLError(
        err instanceof Error
          ? err.message
          : 'Unable to initialize 3D construction visualization.'
      );
      setIsLoading(false);
    }
  }, []);

  // Handle native scroll and wheel events to calculate normalized progress (0.00 to 1.00)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(1.0, Math.max(0.0, scrollY / maxScroll));
      setCurrentProgress(progress);

      if (sceneManagerRef.current) {
        sceneManagerRef.current.setScrollProgress(progress);
      }
      soundEngine.updateScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Jump smoothly to a specific target progress (e.g. from nav clicks)
  const handleJumpToProgress = useCallback((targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = targetProgress * maxScroll;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleExploreLogin = useCallback(() => {
    handleJumpToProgress(0.98);
  }, [handleJumpToProgress]);

  // Fallback view for systems without WebGL
  if (webGLError) {
    return (
      <div className="min-h-screen bg-wensure-ink text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-white">WENSURE 3D EXPERIENCE</h1>
            <p className="text-xs text-stone-300 mt-2">
              Hardware acceleration is currently unavailable on this browser session. You can still access all WENSURE features, dashboards, and the platform overview.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center py-3 bg-wensure-teal text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:brightness-110"
            >
              Proceed to Sign In
            </Link>
            <Link
              to="/overview"
              className="w-full inline-flex items-center justify-center py-3 bg-white/10 text-stone-200 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-white/15"
            >
              View Platform Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-wensure-ink select-none">
      {/* ========================================================
          PRELOADER SCREEN
          ======================================================== */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#17231F] flex flex-col items-center justify-center text-white transition-opacity duration-700">
          <div className="relative flex flex-col items-center space-y-6">
            {/* Animated Brand Emblem */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-wensure-teal/30 border-t-wensure-teal animate-spin" />
              <div className="w-14 h-14 rounded-full bg-wensure-teal/20 border border-wensure-teal flex items-center justify-center text-white font-serif font-bold text-2xl shadow-xl shadow-wensure-teal/30">
                W
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-serif tracking-widest text-lg sm:text-xl font-semibold text-white">
                WENSURE
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-widest text-wensure-teal font-medium">
                BUILD WITH CONFIDENCE
              </p>
              <p className="text-xs text-stone-400 font-light">
                Preparing Cinematic 3D Construction Experience...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FIXED 3D VIEWPORT CONTAINER
          ======================================================== */}
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full z-0 overflow-hidden cursor-grab active:cursor-grabbing"
      />

      {/* ========================================================
          FLOATING UI & INTERACTIVE HUD OVERLAYS
          ======================================================== */}
      {/* Top Floating Scene Navigation Bar */}
      <CinematicNavigation
        currentProgress={currentProgress}
        onJumpToProgress={handleJumpToProgress}
      />

      {/* Contextual Narrative HUD (Scenes 01, 02, 03, 06, 07) */}
      <SceneHUD
        progress={currentProgress}
        onExploreLogin={handleExploreLogin}
      />

      {/* Scene 04: Site Supervisor Digital Tablet Telemetry */}
      <SupervisorTabletHUD progress={currentProgress} />

      {/* Scene 05: The Transparency Moment (Split Planned vs Recorded) */}
      <SceneTransparencyHUD progress={currentProgress} />

      {/* Scene 08: Integrated Villa Entrance Login Experience */}
      <IntegratedLoginHUD
        progress={currentProgress}
        onScrollToTop={handleScrollToTop}
      />

      {/* ========================================================
          SCROLL TRACK SPACER (750vh for smooth, precise control)
          ======================================================== */}
      <div className="relative z-10 w-full h-[750vh] pointer-events-none" />

      {/* Floating Accessibility Control (Reduced Motion Toggle) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            const next = !reducedMotion;
            setReducedMotion(next);
            if (sceneManagerRef.current) {
              sceneManagerRef.current.setReducedMotion(next);
            }
          }}
          className="px-3 py-1.5 rounded-full bg-wensure-ink/80 hover:bg-wensure-ink text-stone-300 hover:text-white border border-white/10 text-[10px] font-mono uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg"
          title="Toggle camera animation smoothing for motion sensitivity"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${reducedMotion ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span>Motion: {reducedMotion ? 'Direct / Low Motion' : 'Smooth Cinematic'}</span>
        </button>
      </div>

      {/* Subtle floating bottom hint during early scenes */}
      {currentProgress < 0.15 && !isLoading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center animate-bounce">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-300 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            ↓ Scroll Down To Construct Home
          </span>
        </div>
      )}
    </div>
  );
};
