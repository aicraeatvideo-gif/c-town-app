import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { DynamicBackground } from './DynamicBackground';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { PlayerBar } from '../player/PlayerBar';
import { LyricsView } from '../player/LyricsView';
import { QueueDrawer } from '../player/QueueDrawer';
import { HomePage } from '../views/HomePage';
import { SearchPage } from '../search/SearchPage';
import { LibraryPage } from '../views/LibraryPage';
import { PlaylistView } from '../views/PlaylistView';
import { ArtistView } from '../views/ArtistView';
import { AlbumView } from '../views/AlbumView';
import { ProfilePage } from '../views/ProfilePage';
import { CrossPlatformFinderModal } from '../search/CrossPlatformFinderModal';
import { OnboardingModal } from '../auth/OnboardingModal';
import { AuthModal } from '../auth/AuthModal';
import { ShareModal } from '../common/ShareModal';
import { DevSpecsModal } from '../common/DevSpecsModal';
import { InAppEmbeddedPlayer } from '../player/InAppEmbeddedPlayer';

export const MainLayout: React.FC = () => {
  const { currentView, currentTheme, isPlaying, currentTrack } = useMusic();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'library':
      case 'liked':
        return <LibraryPage />;
      case 'playlist':
        return <PlaylistView />;
      case 'artist':
        return <ArtistView />;
      case 'album':
        return <AlbumView />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative h-screen max-h-screen w-screen bg-[#000000] text-[#b3b3b3] flex flex-col overflow-hidden font-sans p-0 sm:p-2 sm:gap-2 select-none">
      {/* Dynamic mood atmosphere glow */}
      <DynamicBackground />

      {/* Main Upper Workspace: Sidebar + Scrollable Content Panel */}
      <div className="relative z-10 flex flex-1 min-h-0 w-full gap-2 overflow-hidden">
        {/* Spotify-style Desktop Sidebar */}
        <Sidebar />

        {/* Spotify-style Main Content Container with Dynamic Song Color & Live Playing Lighting */}
        <div
          id="spotify-main-content-panel"
          className="flex-1 min-h-0 sm:rounded-lg flex flex-col overflow-hidden relative shadow-2xl transition-all duration-1000 ease-out"
          style={{
            backgroundColor: '#121212',
            backgroundImage: `radial-gradient(ellipse 110% 70% at 50% -5%, ${currentTheme.primary}${isPlaying ? '55' : '30'} 0%, ${currentTheme.accent}${isPlaying ? '28' : '15'} 35%, transparent 75%), linear-gradient(180deg, ${currentTheme.primary}${isPlaying ? '38' : '20'} 0%, #121212 450px)`,
          }}
        >
          {/* Subtle live pulsating glow when actively playing */}
          {isPlaying && (
            <div
              className="absolute -top-24 left-1/4 w-1/2 h-64 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-1000 animate-pulse"
              style={{
                backgroundColor: currentTheme.primary,
                animationDuration: '4s',
              }}
            />
          )}

          {/* Pinned Top Navigation Bar */}
          <TopHeader />

          {/* Dedicated Up/Down Scrollable Viewport */}
          <main
            id="c-town-scrollable-main"
            tabIndex={0}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain focus:outline-none"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
            }}
          >
            <div className="min-h-full pb-48 sm:pb-40 md:pb-24">
              {renderCurrentView()}
            </div>
          </main>
        </div>
      </div>

      {/* Persistent Bottom Controls (Player + Mobile Nav) */}
      <div className="shrink-0 z-40 flex flex-col bg-[#000000]">
        <PlayerBar />
        <MobileNav />
      </div>

      {/* Overlays, Drawers & Modals */}
      <LyricsView />
      <QueueDrawer />
      <InAppEmbeddedPlayer />
      <CrossPlatformFinderModal />
      <OnboardingModal />
      <AuthModal />
      <ShareModal />
      <DevSpecsModal />
    </div>
  );
};
