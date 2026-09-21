import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Logo } from '../common/Logo';
import {
  Home,
  Search,
  Library,
  Heart,
  ListMusic,
  Disc,
  Users,
  Plus,
  Compass,
  Code2,
  HardDrive,
  Terminal,
  Upload,
  Tv,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    viewParams,
    navigateTo,
    playlists,
    createPlaylist,
    openCrossPlatformFinder,
    openInAppPlayer,
    setShowDevGuideModal,
    likedTrackIds,
    uploadedTracks,
  } = useMusic();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'playlists' | 'uploaded' | 'artists'>('all');

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      const created = createPlaylist(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
      navigateTo('playlist', { playlistId: created.id });
    }
  };

  return (
    <aside
      id="c-town-spotify-sidebar"
      className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 select-none text-[#b3b3b3] gap-2 min-h-0"
    >
      {/* Box 1: Brand Logo & Main Navigation */}
      <div className="bg-[#121212] rounded-lg p-4 space-y-3 shrink-0">
        <div className="px-2 pt-1 pb-2 flex items-center justify-between">
          <Logo size="md" onClick={() => navigateTo('home')} className="cursor-pointer" />
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1ed760]/10 text-[#1ed760] border border-[#1ed760]/30 shadow-sm shrink-0">
            ARYAN BRAND
          </span>
        </div>

        <nav className="space-y-1">
          <button
            id="sidebar-nav-home"
            onClick={() => navigateTo('home')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-bold transition-colors ${
              currentView === 'home'
                ? 'text-white bg-[#282828]/60'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]/30'
            }`}
          >
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-white' : 'text-[#b3b3b3]'}`} />
            <span>Home</span>
          </button>

          <button
            id="sidebar-nav-search"
            onClick={() => navigateTo('search')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-bold transition-colors ${
              currentView === 'search'
                ? 'text-white bg-[#282828]/60'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]/30'
            }`}
          >
            <Search className={`w-5 h-5 ${currentView === 'search' ? 'text-white' : 'text-[#b3b3b3]'}`} />
            <span>Search</span>
          </button>

          <button
            id="sidebar-in-app-stream"
            onClick={() => openInAppPlayer({ platform: 'youtube', query: 'Sajjan Raj Vaidya' })}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold text-[#b3b3b3] hover:text-white hover:bg-[#282828]/30 transition-colors group"
          >
            <span className="flex items-center gap-4">
              <Tv className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              <span>In-App Player</span>
            </span>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono">
              YouTube
            </span>
          </button>
        </nav>
      </div>

      {/* Box 2: Your Library & Uploaded Tracks */}
      <div className="bg-[#121212] rounded-lg p-3 flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="flex items-center justify-between px-2 py-2 text-[#b3b3b3] hover:text-white transition-colors">
          <button
            onClick={() => navigateTo('library')}
            className="flex items-center gap-3 text-sm font-bold hover:text-white transition-colors"
          >
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateTo('library', { tab: 'local' })}
              className="p-1.5 rounded-full hover:bg-[#282828] text-[#b3b3b3] hover:text-[#1ed760] transition-colors"
              title="Upload full audio"
            >
              <Upload className="w-4 h-4" />
            </button>

            <button
              id="sidebar-add-playlist-btn"
              onClick={() => setIsCreating(!isCreating)}
              className="p-1.5 rounded-full hover:bg-[#282828] text-[#b3b3b3] hover:text-white transition-colors"
              title="Create playlist"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-2 py-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('uploaded')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeFilter === 'uploaded'
                ? 'bg-white text-black'
                : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            <span>Local &amp; Uploads</span>
            {uploadedTracks.length > 0 && (
              <span className="text-[10px] bg-[#1ed760] text-black px-1.5 rounded-full font-bold">
                {uploadedTracks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter('playlists')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'playlists'
                ? 'bg-white text-black'
                : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            Playlists
          </button>
        </div>

        {/* Inline Create playlist input */}
        {isCreating && (
          <form onSubmit={handleCreatePlaylist} className="px-2 my-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Playlist name..."
              autoFocus
              className="w-full px-3 py-2 rounded-md bg-[#242424] border border-[#3e3e3e] text-xs text-white placeholder-[#727272] outline-none focus:border-[#1ed760]"
            />
          </form>
        )}

        {/* Scrollable Library Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {/* Liked Songs Entry (Spotify Purple/Pink Gradient Box) */}
          {(activeFilter === 'all' || activeFilter === 'playlists') && (
            <div
              onClick={() => navigateTo('liked')}
              className={`group flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition-colors ${
                currentView === 'liked' ? 'bg-[#282828]' : ''
              }`}
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${currentView === 'liked' ? 'text-[#1ed760]' : 'text-white'}`}>
                  Liked Songs
                </p>
                <p className="text-xs text-[#b3b3b3] truncate">
                  Playlist • {likedTrackIds.length} songs
                </p>
              </div>
            </div>
          )}

          {/* Uploaded Full Songs Entry */}
          {(activeFilter === 'all' || activeFilter === 'uploaded') && (
            <div
              onClick={() => navigateTo('library', { tab: 'local' })}
              className={`group flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition-colors ${
                currentView === 'library' && viewParams?.tab === 'local' ? 'bg-[#282828]' : ''
              }`}
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-[#1db954] to-[#0f5123] flex items-center justify-center shrink-0 shadow">
                <HardDrive className="w-5 h-5 text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate group-hover:text-[#1ed760]">
                  Local &amp; Uploaded
                </p>
                <p className="text-xs text-[#b3b3b3] truncate">
                  Full Audio • {uploadedTracks.length} tracks
                </p>
              </div>
            </div>
          )}

          {/* User Playlists */}
          {(activeFilter === 'all' || activeFilter === 'playlists') &&
            playlists.map((pl) => {
              const isActive = currentView === 'playlist' && viewParams?.playlistId === pl.id;
              return (
                <div
                  key={pl.id}
                  onClick={() => navigateTo('playlist', { playlistId: pl.id })}
                  className={`group flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition-colors ${
                    isActive ? 'bg-[#282828]' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded bg-[#282828] overflow-hidden shrink-0 flex items-center justify-center">
                    {pl.coverUrl ? (
                      <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover" />
                    ) : (
                      <ListMusic className="w-5 h-5 text-[#b3b3b3]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#1ed760]' : 'text-white'}`}>
                      {pl.title}
                    </p>
                    <p className="text-xs text-[#b3b3b3] truncate">
                      Playlist • {pl.tracks.length} tracks
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Universal Music Finder shortcut & Brand footer */}
        <div className="pt-2 border-t border-[#282828] space-y-2">
          <button
            onClick={() => openCrossPlatformFinder({ query: '' })}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-[#b3b3b3] hover:text-white hover:bg-[#282828]/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1ed760]" />
              <span>Universal Finder</span>
            </span>
            <span className="text-[10px] text-[#727272]">8 Apps</span>
          </button>

          <div className="px-3 py-1 flex items-center justify-between text-[10px] text-slate-500 select-none">
            <span>C-TOwn Player</span>
            <span className="text-[#1ed760] font-black tracking-wider">ARYAN BRAND</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
