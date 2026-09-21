import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Logo } from '../common/Logo';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  LogIn,
  Compass,
  Code2,
  Terminal,
  Upload,
  Tv,
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    currentView,
    navigateTo,
    user,
    isLoggedIn,
    setShowAuthModal,
    setAuthModalMode,
    openCrossPlatformFinder,
    openInAppPlayer,
    setShowDevGuideModal,
  } = useMusic();

  return (
    <header
      id="c-town-spotify-header"
      className="sticky top-0 z-30 h-16 w-full bg-[#101010]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 select-none shrink-0 border-b border-white/[0.04]"
    >
      {/* Left: Brand / Logo + History Navigation Circular Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="md:hidden flex items-center">
          <Logo size="sm" onClick={() => navigateTo('home')} />
        </div>

        {/* Back and Forward Navigation (Always visible in mobile and PC) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-back-btn"
            onClick={goBack}
            disabled={!canGoBack}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${
              canGoBack
                ? 'bg-[#000000]/70 hover:bg-[#000000] text-white cursor-pointer active:scale-95'
                : 'bg-[#000000]/40 text-[#535353] cursor-not-allowed'
            }`}
            title="Go back"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="nav-forward-btn"
            onClick={goForward}
            disabled={!canGoForward}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${
              canGoForward
                ? 'bg-[#000000]/70 hover:bg-[#000000] text-white cursor-pointer active:scale-95'
                : 'bg-[#000000]/40 text-[#535353] cursor-not-allowed'
            }`}
            title="Go forward"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Quick Search Bar */}
        {currentView !== 'search' && (
          <button
            onClick={() => navigateTo('search')}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] hover:ring-1 hover:ring-white/20 text-xs text-[#b3b3b3] hover:text-white transition-all max-w-[130px] sm:max-w-none sm:w-56 lg:w-64 text-left"
            title="Search for songs, artists, or YouTube full tracks"
          >
            <Search className="w-3.5 h-3.5 text-[#b3b3b3] shrink-0" />
            <span className="truncate hidden sm:inline">What do you want to play?</span>
            <span className="truncate sm:hidden text-[11px]">Search</span>
          </button>
        )}
      </div>

      {/* Right Controls: YouTube Stream + Upload + Universal Finder + Auth / Profile (All visible on mobile & PC) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* In-App YouTube Stream Player */}
        <button
          onClick={() => openInAppPlayer({ platform: 'youtube', query: 'Popular Music Hits' })}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors shadow-sm group active:scale-95"
          title="Open in-app YouTube video and full tracks"
        >
          <Tv className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">YouTube Full</span>
          <span className="md:hidden text-[10px] font-bold">YT</span>
        </button>

        {/* Upload Audio quick button */}
        <button
          onClick={() => navigateTo('library', { tab: 'local' })}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-[#1ed760]/15 hover:bg-[#1ed760]/25 border border-[#1ed760]/40 text-[#1ed760] text-xs font-semibold transition-colors shadow-sm group active:scale-95"
          title="Upload full songs to your local library"
        >
          <Upload className="w-3.5 h-3.5 text-[#1ed760] group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Upload</span>
        </button>

        {/* Universal Cross-Platform Finder (Now visible on mobile too) */}
        <button
          onClick={() => openCrossPlatformFinder({ query: '' })}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-[#b3b3b3] hover:text-white text-xs font-semibold transition-colors active:scale-95"
          title="Search Spotify, Apple Music, YouTube & more simultaneously across 8 apps"
        >
          <Compass className="w-3.5 h-3.5 text-[#1ed760]" />
          <span className="hidden lg:inline">Finder</span>
        </button>

        {/* User Account / Profile */}
        {isLoggedIn && user ? (
          <button
            id="header-profile-btn"
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-1.5 p-1 sm:pr-3 rounded-full bg-[#000000]/60 hover:bg-[#282828] transition-colors cursor-pointer"
            title={user.name}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#1ed760]"
            />
            <span className="text-xs font-bold text-white max-w-24 truncate hidden sm:inline">
              {user.name}
            </span>
          </button>
        ) : (
          <button
            id="header-login-btn"
            onClick={() => {
              setAuthModalMode('login');
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:scale-105 active:scale-95 text-black font-bold text-xs shadow transition-transform"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Log in</span>
          </button>
        )}
      </div>
    </header>
  );
};
