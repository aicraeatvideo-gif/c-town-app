import React from 'react';
import { Logo } from '../common/Logo';
import { Play, Sparkles, Compass, ShieldCheck, Music2, LogIn, UserPlus } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

interface LandingPageProps {
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  const { setShowAuthModal, setAuthModalMode, loginAsGuest } = useMusic();

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleOpenSignup = () => {
    setAuthModalMode('signup');
    setShowAuthModal(true);
  };

  return (
    <div
      id="c-town-landing-page"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#07080a] text-white select-none"
    >
      {/* Respectful & Aesthetic Nepal Flag Inspired Visual Canvas */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Deep starry sky and atmospheric aurora */}
        <div className="absolute inset-0 bg-radial-at-c from-[#151928] via-[#090b10] to-[#050608]" />

        {/* Nepal Flag double-pennant stylized crimson gradient geometry */}
        <svg
          className="absolute right-0 top-0 h-full w-full opacity-35 lg:opacity-45 object-cover"
          viewBox="0 0 1000 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nepalCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#991b1b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#08090c" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="nepalBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Upper pennant: Triangular geometry with moon motif */}
          <polygon
            points="550,60 980,260 550,460"
            fill="url(#nepalCrimson)"
            stroke="url(#nepalBorder)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Lower pennant: Triangular geometry with sun motif */}
          <polygon
            points="550,420 980,620 550,780"
            fill="url(#nepalCrimson)"
            stroke="url(#nepalBorder)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Stylized Celestial Moon Emblem (upper) */}
          <g transform="translate(640, 260) scale(0.9)">
            <path
              d="M0 -30 A30 30 0 1 0 0 30 A20 20 0 1 1 0 -30 Z"
              fill="#ffffff"
              fillOpacity="0.85"
            />
            <circle cx="0" cy="0" r="10" fill="#ffffff" fillOpacity="0.9" />
          </g>

          {/* Stylized Twelve-Rayed Sun Emblem (lower) */}
          <g transform="translate(640, 600) scale(0.9)">
            <circle cx="0" cy="0" r="18" fill="#ffffff" fillOpacity="0.9" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = Math.cos(angle) * 22;
              const y1 = Math.sin(angle) * 22;
              const x2 = Math.cos(angle) * 36;
              const y2 = Math.sin(angle) * 36;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeOpacity="0.75"
                />
              );
            })}
          </g>
        </svg>

        {/* Soft Himalayan Mountain Silhouette at the bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full h-48 opacity-25 text-slate-800 pointer-events-none"
          viewBox="0 0 1440 320"
          fill="currentColor"
        >
          <path d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,240C1120,245,1280,203,1360,181.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
        </svg>

        {/* Ambient Teal glow representing C-Town vibrancy */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-pulse-glow" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <button
            id="landing-login-btn-top"
            onClick={handleOpenLogin}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            id="landing-signup-btn-top"
            onClick={handleOpenSignup}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-[#07080a] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-0.5"
          >
            Sign Up Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center my-auto">
        {/* Cultural & Sonic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Next-Gen Audio Experience</span>
        </div>

        {/* Core Brand Title & Tagline */}
        <h1 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.08] mb-4">
          Sound Reimagined with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            C-TOWN
          </span>
        </h1>

        {/* Required Tagline */}
        <p className="text-xl sm:text-2xl font-light text-slate-300 tracking-wide mb-3">
          "Your Music. Your Mood."
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mb-10 leading-relaxed font-normal">
          From Nepali indie anthems to global chart toppers, immerse yourself in dynamic color-reactive atmospheres, real synchronized lyrics, and seamless cross-platform discovery.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            id="landing-explore-music-btn"
            onClick={() => {
              loginAsGuest();
              onExplore();
            }}
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-[#07080a] shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 group"
          >
            <Compass className="w-5 h-5 text-[#07080a] group-hover:rotate-45 transition-transform" />
            <span>Explore Music</span>
          </button>

          <button
            id="landing-signup-btn-hero"
            onClick={handleOpenSignup}
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full font-bold text-base bg-white/10 hover:bg-white/15 border border-white/15 text-white backdrop-blur-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <span>Sign Up</span>
          </button>

          <button
            id="landing-login-btn-hero"
            onClick={handleOpenLogin}
            className="w-full sm:w-auto px-6 py-4 rounded-full font-semibold text-sm text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
        </div>

        {/* Value Highlights */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left w-full max-w-3xl">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5">
              <Music2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Dynamic Colors</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ambient lighting shifts smoothly with each track's album art.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2.5">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Universal Search</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Locate any track instantly across Spotify, Apple, YouTube & more.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Zero Advertisements</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pure, uninterrupted listening with respectful design.
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} C-TOWN Sonic Platform</span>
          <span>•</span>
          <span className="text-slate-400">Pure sound. No ads.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setShowAuthModal(true);
            }}
            className="hover:text-emerald-400 transition-colors"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setAuthModalMode('login');
              setShowAuthModal(true);
            }}
            className="hover:text-emerald-400 transition-colors"
          >
            Privacy Policy
          </button>
        </div>
      </footer>
    </div>
  );
};
