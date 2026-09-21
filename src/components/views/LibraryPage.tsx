import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { TrackCard } from '../cards/TrackCard';
import { AlbumCard } from '../cards/AlbumCard';
import { ArtistCard } from '../cards/ArtistCard';
import { LocalFilesTab } from './LocalFilesTab';
import { ARTISTS_CATALOG, ALBUMS_CATALOG } from '../../data/catalog';
import {
  Heart,
  ListMusic,
  Disc,
  Users,
  Clock,
  PlusCircle,
  Play,
  Share2,
  Trash2,
  ArrowUpDown,
  HardDrive,
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const {
    viewParams,
    likedTracks,
    playlists,
    createPlaylist,
    deletePlaylist,
    playTrack,
    navigateTo,
    followedArtistIds,
    recentlyPlayed,
    openShareModal,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'local' | 'albums' | 'artists' | 'history'>(
    (viewParams?.tab as any) || 'playlists'
  );

  useEffect(() => {
    if (viewParams?.tab) {
      setActiveTab(viewParams.tab);
    }
  }, [viewParams?.tab]);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'title' | 'artist'>('default');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const created = createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreating(false);
      navigateTo('playlist', { playlistId: created.id });
    }
  };

  const followedArtists = ARTISTS_CATALOG.filter((a) => followedArtistIds.includes(a.id));

  // Sorting liked tracks
  const sortedLikedTracks = [...likedTracks].sort((a, b) => {
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    if (sortOrder === 'artist') return a.artist.localeCompare(b.artist);
    return 0;
  });

  return (
    <div id="c-town-library-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282828] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Your Library</h1>
          <p className="text-xs text-[#b3b3b3] mt-0.5">
            Playlists, full uploaded audio, liked tracks, and followed artists
          </p>
        </div>

        {/* Tab Switcher (Spotify Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'playlists' ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Playlists</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'liked' ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liked ({likedTracks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'local' ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Local &amp; Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab('albums')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'albums' ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Albums</span>
          </button>

          <button
            onClick={() => setActiveTab('artists')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'artists' ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Artists ({followedArtists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'history' ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#333333]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* TAB: PLAYLISTS */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Collections</h3>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Playlist</span>
            </button>
          </div>

          {/* Creation modal / form */}
          {isCreating && (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-3 max-w-md">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Give your playlist a title..."
                autoFocus
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-[#07080a] font-bold text-xs rounded-xl"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigateTo('playlist', { playlistId: pl.id })}
                className="group p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-800 shadow-md">
                  <img
                    src={pl.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {pl.tracks.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(pl.tracks[0], pl.tracks);
                      }}
                      className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07080a] shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 truncate">
                  {pl.title}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {pl.tracks.length} tracks • {pl.isCustom ? 'By You' : 'Curated'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LIKED SONGS */}
      {activeTab === 'liked' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-950/30 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-xl">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Playlist</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Liked Songs</h2>
                <p className="text-xs text-slate-400 mt-0.5">{likedTracks.length} tracks in your favorites</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {likedTracks.length > 0 && (
                <button
                  onClick={() => playTrack(likedTracks[0], likedTracks)}
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play All Favorites</span>
                </button>
              )}

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="default" className="bg-[#12161f]">Default Order</option>
                  <option value="title" className="bg-[#12161f]">Title (A-Z)</option>
                  <option value="artist" className="bg-[#12161f]">Artist (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {sortedLikedTracks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              You haven't liked any songs yet. Tap the heart icon on any song to save it here!
            </div>
          ) : (
            <div className="space-y-1">
              {sortedLikedTracks.map((track, idx) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlistContext={sortedLikedTracks}
                  showIndex={idx}
                  layout="row"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: LOCAL AUDIO FILES */}
      {activeTab === 'local' && <LocalFilesTab />}

      {/* TAB: ALBUMS */}
      {activeTab === 'albums' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Saved &amp; Curated Albums</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ALBUMS_CATALOG.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}

      {/* TAB: ARTISTS */}
      {activeTab === 'artists' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Followed Artists</h3>
          {followedArtists.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              You aren't following any artists yet. Explore Nepali &amp; global artists and tap Follow!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {followedArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Recently Played History</h3>
          <div className="space-y-1">
            {recentlyPlayed.map((track, idx) => (
              <TrackCard
                key={`${track.id}-${idx}`}
                track={track}
                playlistContext={recentlyPlayed}
                showIndex={idx}
                layout="row"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
