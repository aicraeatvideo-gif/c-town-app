import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { ARTISTS_CATALOG, CURATED_TRACKS, ALBUMS_CATALOG } from '../../data/catalog';
import { TrackCard } from '../cards/TrackCard';
import { AlbumCard } from '../cards/AlbumCard';
import {
  CheckCircle2,
  UserPlus,
  Check,
  Play,
  Share2,
  Compass,
  ArrowLeft,
} from 'lucide-react';

export const ArtistView: React.FC = () => {
  const {
    viewParams,
    isArtistFollowed,
    toggleFollowArtist,
    playTrack,
    openCrossPlatformFinder,
    openShareModal,
    navigateTo,
  } = useMusic();

  const artistId = viewParams?.artistId;
  const artist = ARTISTS_CATALOG.find((a) => a.id === artistId) || ARTISTS_CATALOG[0];

  const followed = isArtistFollowed(artist.id);

  // Songs by this artist
  const artistTracks = CURATED_TRACKS.filter(
    (t) => t.artistId === artist.id || t.artist.toLowerCase().includes(artist.name.toLowerCase())
  );

  // Albums by this artist
  const artistAlbums = ALBUMS_CATALOG.filter(
    (alb) => alb.artistId === artist.id || alb.artist.toLowerCase().includes(artist.name.toLowerCase())
  );

  return (
    <div id="c-town-artist-view" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Back button */}
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Artist Hero Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-t from-[#080b0f] via-white/[0.05] to-transparent border border-white/10 flex flex-col md:flex-row items-center md:items-end gap-6 shadow-2xl">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl shrink-0 ring-4 ring-white/10">
          <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            {artist.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Artist</span>
              </span>
            )}
            <span className="text-xs text-slate-400 capitalize">
              {artist.genres.join(' • ')}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {artist.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {artist.bio}
          </p>

          <div className="text-xs text-slate-400">
            {artist.monthlyListeners.toLocaleString()} monthly listeners on C-TOWN
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
            {artistTracks.length > 0 && (
              <button
                onClick={() => playTrack(artistTracks[0], artistTracks)}
                className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs shadow-xl shadow-emerald-500/30 flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Artist</span>
              </button>
            )}

            <button
              onClick={() => toggleFollowArtist(artist.id)}
              className={`px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                followed
                  ? 'bg-white/10 text-white hover:bg-rose-500/20 hover:text-rose-300'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {followed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                openShareModal({
                  title: artist.name,
                  subtitle: `${artist.monthlyListeners.toLocaleString()} listeners • ${artist.genres[0]}`,
                  url: `https://c-town.music/artist/${artist.id}`,
                })
              }
              className="p-3 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
              title="Share artist profile"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openCrossPlatformFinder({ query: artist.name })}
              className="px-4 py-2.5 rounded-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5"
              title="Open artist across Spotify, Apple, YouTube"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Find on All Platforms</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Popular Tracks</h3>
        {artistTracks.length === 0 ? (
          <p className="text-xs text-slate-400">Tracks loaded dynamically via online search.</p>
        ) : (
          <div className="space-y-1">
            {artistTracks.map((track, idx) => (
              <TrackCard
                key={track.id}
                track={track}
                playlistContext={artistTracks}
                showIndex={idx}
                layout="row"
              />
            ))}
          </div>
        )}
      </div>

      {/* Discography / Albums */}
      {artistAlbums.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Discography</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artistAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
