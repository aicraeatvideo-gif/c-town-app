import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { TrackCard } from '../cards/TrackCard';
import {
  Play,
  Share2,
  Trash2,
  Edit2,
  ListMusic,
  Plus,
  Compass,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const PlaylistView: React.FC = () => {
  const {
    viewParams,
    playlists,
    playTrack,
    removeTrackFromPlaylist,
    renamePlaylist,
    deletePlaylist,
    openShareModal,
    openCrossPlatformFinder,
    navigateTo,
  } = useMusic();

  const playlistId = viewParams?.playlistId;
  const playlist = playlists.find((p) => p.id === playlistId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  if (!playlist) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Playlist not found</h2>
        <button
          onClick={() => navigateTo('library')}
          className="px-4 py-2 rounded-full bg-emerald-500 text-[#07080a] font-bold text-xs"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const handleStartRename = () => {
    setEditedTitle(playlist.title);
    setIsEditingTitle(true);
  };

  const handleSaveRename = () => {
    if (editedTitle.trim()) {
      renamePlaylist(playlist.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete playlist "${playlist.title}"?`)) {
      deletePlaylist(playlist.id);
      navigateTo('library');
    }
  };

  return (
    <div id="c-town-playlist-view" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Back button */}
      <button
        onClick={() => navigateTo('library')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Library</span>
      </button>

      {/* Playlist Hero Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-gradient-to-b from-white/10 to-transparent p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-slate-800">
          <img
            src={playlist.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            {playlist.isCustom ? 'Custom User Playlist' : 'C-Town Curated Collection'}
          </span>

          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xl sm:text-3xl font-extrabold text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSaveRename}
                className="p-2 rounded-xl bg-emerald-500 text-[#07080a]"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {playlist.title}
              </h1>
              {playlist.isCustom && (
                <button
                  onClick={handleStartRename}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  title="Rename playlist"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-300">
            {playlist.description || 'Curated soundtrack for your focus, elevation, and mood.'}
          </p>

          <div className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2">
            <span>By {playlist.createdBy}</span>
            <span>•</span>
            <span>{playlist.tracks.length} tracks</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
            {playlist.tracks.length > 0 && (
              <button
                onClick={() => playTrack(playlist.tracks[0], playlist.tracks)}
                className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs shadow-xl shadow-emerald-500/30 flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Playlist</span>
              </button>
            )}

            <button
              onClick={() =>
                openShareModal({
                  title: playlist.title,
                  subtitle: `${playlist.tracks.length} tracks by ${playlist.createdBy}`,
                  url: `https://c-town.music/playlist/${playlist.id}`,
                })
              }
              className="p-3 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
              title="Share playlist"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openCrossPlatformFinder({ query: playlist.title })}
              className="px-3.5 py-2 rounded-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5"
              title="Find playlist or tracks on other music apps"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Cross-Platform</span>
            </button>

            {playlist.isCustom && (
              <button
                onClick={handleDelete}
                className="p-3 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-3 text-xs font-semibold text-slate-400 border-b border-white/5 pb-2">
          <span># Title</span>
          <span className="hidden md:inline">Album</span>
          <span>Duration</span>
        </div>

        {playlist.tracks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-3">
            <ListMusic className="w-10 h-10 text-slate-600 mx-auto" />
            <p>This playlist currently has no tracks.</p>
            <button
              onClick={() => navigateTo('search')}
              className="px-4 py-2 rounded-full bg-emerald-500 text-[#07080a] font-bold text-xs"
            >
              Search &amp; Add Tracks
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.tracks.map((track, idx) => (
              <div key={track.id} className="relative group">
                <TrackCard
                  track={track}
                  playlistContext={playlist.tracks}
                  showIndex={idx}
                  layout="row"
                />
                {playlist.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrackFromPlaylist(playlist.id, track.id);
                    }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
