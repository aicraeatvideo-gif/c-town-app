import React, { useState } from 'react';
import { Track } from '../../types/music';
import { useMusic } from '../../context/MusicContext';
import {
  Play,
  Pause,
  Heart,
  MoreVertical,
  ListPlus,
  Compass,
  Share2,
  Music,
  Tv,
  Download,
  CheckCircle,
} from 'lucide-react';

interface TrackCardProps {
  track: Track;
  playlistContext?: Track[];
  showIndex?: number;
  layout?: 'card' | 'row';
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  playlistContext,
  showIndex,
  layout = 'card',
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLikeTrack,
    isLiked,
    addToQueue,
    playlists,
    addTrackToPlaylist,
    openCrossPlatformFinder,
    openInAppPlayer,
    openShareModal,
    navigateTo,
    downloadTrack,
    isDownloaded,
  } = useMusic();

  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const liked = isLiked(track.id);
  const downloaded = isDownloaded(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, playlistContext);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeTrack(track);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadTrack(track);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ROW LAYOUT (Table / List view)
  if (layout === 'row') {
    return (
      <div
        id={`track-row-${track.id}`}
        onClick={handlePlayClick}
        className={`group relative flex items-center justify-between px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-md transition-colors cursor-pointer select-none ${
          isCurrent
            ? 'bg-[#ffffff1a]'
            : 'hover:bg-[#ffffff12]'
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Index or Equalizer on PC, Play button on Mobile */}
          <div className="hidden sm:block w-5 text-center text-xs font-mono text-[#b3b3b3] group-hover:hidden shrink-0">
            {isCurrent && isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-3.5 w-full">
                <span className="w-1 bg-[#1ed760] animate-pulse h-3" />
                <span className="w-1 bg-[#1ed760] animate-pulse h-2 delay-75" />
                <span className="w-1 bg-[#1ed760] animate-pulse h-3.5 delay-150" />
              </div>
            ) : (
              showIndex !== undefined ? showIndex + 1 : '•'
            )}
          </div>

          <button
            onClick={handlePlayClick}
            className="sm:hidden group-hover:flex w-6 h-6 sm:w-5 sm:h-5 items-center justify-center text-white hover:text-[#1ed760] transition-colors shrink-0"
            title={isCurrent && isPlaying ? 'Pause' : 'Play'}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-4 h-4 fill-current text-[#1ed760]" />
            ) : (
              <Play className="w-4 h-4 fill-current text-[#1ed760] sm:text-white ml-0.5" />
            )}
          </button>

          {/* Artwork Thumbnail */}
          <div className="w-10 h-10 rounded bg-[#282828] overflow-hidden shrink-0 shadow">
            <img
              src={track.artworkUrl}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Artist with Artist Logo */}
          <div className="min-w-0 flex-1">
            <p
              className={`text-xs sm:text-sm font-semibold truncate ${
                isCurrent ? 'text-[#1ed760]' : 'text-white'
              }`}
            >
              {track.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              {track.artistLogoUrl && (
                <img
                  src={track.artistLogoUrl}
                  alt={track.artist}
                  className="w-3.5 h-3.5 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                  title={`${track.artist} (Official Artist)`}
                />
              )}
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  if (track.artistId) navigateTo('artist', { artistId: track.artistId });
                }}
                className="text-[11px] sm:text-xs text-[#b3b3b3] hover:text-white hover:underline truncate"
              >
                {track.artist}
              </p>
              {track.language && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#a7a7a7] shrink-0 font-medium hidden sm:inline-block">
                  {track.language}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Album Column (Desktop) */}
        <div className="hidden md:block w-1/4 px-4">
          <p
            onClick={(e) => {
              e.stopPropagation();
              if (track.albumId) navigateTo('album', { albumId: track.albumId });
            }}
            className="text-xs text-[#b3b3b3] hover:text-white hover:underline truncate"
          >
            {track.album}
          </p>
        </div>

        {/* Actions & Duration */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Download button */}
          <button
            onClick={handleDownloadClick}
            className={`p-1.5 rounded-full transition-colors ${
              downloaded
                ? 'text-[#1ed760]'
                : 'text-[#b3b3b3] hover:text-white sm:opacity-0 sm:group-hover:opacity-100'
            }`}
            title={downloaded ? 'Downloaded offline' : 'Download for offline play'}
          >
            {downloaded ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Like button */}
          <button
            onClick={handleLikeClick}
            className={`p-1.5 rounded-full transition-colors ${
              liked
                ? 'text-[#1ed760]'
                : 'text-[#b3b3b3] hover:text-white sm:opacity-0 sm:group-hover:opacity-100'
            }`}
            title={liked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          <span className="text-[11px] sm:text-xs font-mono text-[#b3b3b3] w-8 sm:w-10 text-right">
            {formatDuration(track.duration)}
          </span>

          {/* Options Menu Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-full text-[#b3b3b3] hover:text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 w-48 bg-[#282828] border border-[#3e3e3e] rounded-md shadow-2xl z-50 py-1 text-xs text-white"
              >
                <button
                  onClick={() => {
                    addToQueue(track);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#3e3e3e] text-left"
                >
                  <ListPlus className="w-4 h-4 text-[#b3b3b3]" />
                  <span>Add to Queue</span>
                </button>

                <button
                  onClick={() => {
                    downloadTrack(track);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#3e3e3e] text-left text-emerald-300"
                >
                  <Download className="w-4 h-4 text-[#1ed760]" />
                  <span>{downloaded ? 'Re-download Offline' : 'Download for Offline Play'}</span>
                </button>

                <button
                  onClick={() => {
                    openInAppPlayer({
                      platform: 'youtube',
                      query: track.youtubeVideoId || `${track.title} ${track.artist}`,
                      title: track.title,
                      artist: track.artist,
                    });
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#3e3e3e] text-left text-red-300"
                >
                  <Tv className="w-4 h-4 text-red-400" />
                  <span>Play In-App (YouTube)</span>
                </button>

                <button
                  onClick={() => {
                    openCrossPlatformFinder({
                      title: track.title,
                      artist: track.artist,
                    });
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#3e3e3e] text-left"
                >
                  <Compass className="w-4 h-4 text-[#1ed760]" />
                  <span>Find Across 8 Apps</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowPlaylistSubmenu(!showPlaylistSubmenu)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#3e3e3e] text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-[#b3b3b3]" />
                      <span>Add to Playlist</span>
                    </span>
                    <span>›</span>
                  </button>

                  {showPlaylistSubmenu && (
                    <div className="bg-[#242424] border border-[#3e3e3e] rounded-md my-1 mx-2 p-1 max-h-36 overflow-y-auto">
                      {playlists.map((pl) => (
                        <button
                          key={pl.id}
                          onClick={() => {
                            addTrackToPlaylist(pl.id, track);
                            setShowMenu(false);
                            setShowPlaylistSubmenu(false);
                          }}
                          className="w-full px-2 py-1.5 text-left text-[11px] truncate hover:text-[#1ed760] hover:bg-[#333333] rounded"
                        >
                          + {pl.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    openShareModal({
                      title: track.title,
                      subtitle: track.artist,
                      url: `https://c-town.music/track/${track.id}`,
                    });
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#3e3e3e] text-left"
                >
                  <Share2 className="w-4 h-4 text-[#b3b3b3]" />
                  <span>Share Song</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CARD LAYOUT (Spotify Grid view)
  return (
    <div
      id={`track-card-${track.id}`}
      onClick={handlePlayClick}
      className="group relative p-3 sm:p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer select-none flex flex-col shadow-md hover:shadow-xl"
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828] shadow-lg">
        <img
          src={track.artworkUrl}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Artist Logo Pill overlay */}
        {track.artistLogoUrl && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (track.artistId) navigateTo('artist', { artistId: track.artistId });
            }}
            className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/75 hover:bg-black/90 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 shadow-md transition-colors"
            title={`${track.artist} - Verified Artist`}
          >
            <img
              src={track.artistLogoUrl}
              alt={track.artist}
              className="w-4 h-4 rounded-full object-cover ring-1 ring-white/30"
            />
            <span className="text-[10px] font-semibold text-white/90 truncate max-w-[80px]">
              {track.artist}
            </span>
          </div>
        )}

        {/* Language Badge */}
        {track.language && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
            {track.language}
          </span>
        )}

        {/* Spotify Green Play Button (Visible on mobile, hover-revealed on desktop) */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-2.5 right-2.5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black shadow-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isCurrent
              ? 'opacity-100 translate-y-0 shadow-lg shadow-[#1ed760]/30'
              : 'opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0'
          }`}
          title={isCurrent && isPlaying ? 'Pause' : 'Play'}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Title */}
      <h4
        className={`text-sm font-bold truncate mb-1 ${
          isCurrent ? 'text-[#1ed760]' : 'text-white'
        }`}
      >
        {track.title}
      </h4>

      {/* Artist Row with Logo & Streams */}
      <div className="flex items-center justify-between text-xs text-[#b3b3b3] mt-0.5">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (track.artistId) navigateTo('artist', { artistId: track.artistId });
          }}
          className="flex items-center gap-1.5 hover:text-white truncate cursor-pointer"
        >
          {track.artistLogoUrl && (
            <img
              src={track.artistLogoUrl}
              alt={track.artist}
              className="w-3.5 h-3.5 rounded-full object-cover shrink-0 ring-1 ring-white/20"
            />
          )}
          <span className="truncate">{track.artist}</span>
        </div>
        {track.streamsCount && (
          <span className="text-[10px] text-[#888888] shrink-0 ml-1 font-medium">
            {track.streamsCount}
          </span>
        )}
      </div>
    </div>
  );
};
