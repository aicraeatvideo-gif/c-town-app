import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { ALBUMS_CATALOG, CURATED_TRACKS } from '../../data/catalog';
import { TrackCard } from '../cards/TrackCard';
import {
  Play,
  Share2,
  Compass,
  ArrowLeft,
  Disc,
  Clock,
} from 'lucide-react';

export const AlbumView: React.FC = () => {
  const {
    viewParams,
    playTrack,
    openCrossPlatformFinder,
    openShareModal,
    navigateTo,
  } = useMusic();

  const albumId = viewParams?.albumId;
  const album = ALBUMS_CATALOG.find((a) => a.id === albumId) || ALBUMS_CATALOG[0];

  // Get tracks belonging to album or fallback
  const albumTracks = album.tracks && album.tracks.length > 0
    ? album.tracks
    : CURATED_TRACKS.filter((t) => t.album.toLowerCase() === album.title.toLowerCase());

  const totalDuration = albumTracks.reduce((acc, t) => acc + t.duration, 0);
  const totalMins = Math.floor(totalDuration / 60);

  return (
    <div id="c-town-album-view" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Back button */}
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Album Hero Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-gradient-to-b from-white/10 to-transparent p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-slate-800">
          <img src={album.artworkUrl} alt={album.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Album Release
          </span>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {album.title}
          </h1>

          <div className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-2">
            <span
              onClick={() => navigateTo('artist', { artistId: album.artistId })}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              {album.artist}
            </span>
            <span>•</span>
            <span>{album.releaseDate}</span>
            <span>•</span>
            <span>{albumTracks.length} tracks ({totalMins} min)</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
            {albumTracks.length > 0 && (
              <button
                onClick={() => playTrack(albumTracks[0], albumTracks)}
                className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs shadow-xl shadow-emerald-500/30 flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Album</span>
              </button>
            )}

            <button
              onClick={() =>
                openShareModal({
                  title: album.title,
                  subtitle: `${album.artist} • ${album.releaseDate}`,
                  url: `https://c-town.music/album/${album.id}`,
                })
              }
              className="p-3 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
              title="Share album"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openCrossPlatformFinder({ query: `${album.title} ${album.artist}` })}
              className="px-4 py-2 rounded-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5"
              title="Find album on Spotify, Apple Music & more"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Locate on All Platforms</span>
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 text-xs font-semibold text-slate-400 border-b border-white/5 pb-2">
          <span># Title</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Duration</span>
          </span>
        </div>

        {albumTracks.map((track, idx) => (
          <TrackCard
            key={track.id}
            track={track}
            playlistContext={albumTracks}
            showIndex={idx}
            layout="row"
          />
        ))}
      </div>
    </div>
  );
};
