import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Mic2,
  Compass,
  AlertCircle,
  Tv,
  Download,
  CheckCircle,
} from 'lucide-react';

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    playbackError,
    togglePlayPause,
    skipNext,
    skipPrev,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    toggleLikeTrack,
    isLiked,
    showLyricsModal,
    setShowLyricsModal,
    showQueueModal,
    setShowQueueModal,
    openCrossPlatformFinder,
    openInAppPlayer,
    navigateTo,
    downloadTrack,
    isDownloaded,
  } = useMusic();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [showMobileVolume, setShowMobileVolume] = useState(false);

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const downloaded = isDownloaded(currentTrack.id);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSeekValue(val);
    setIsSeeking(true);
  };

  const handleSeekCommit = () => {
    setIsSeeking(false);
    const targetSeconds = (seekValue / 100) * duration;
    seekTo(targetSeconds);
  };

  const currentDisplayProgress = isSeeking ? seekValue : progress;

  return (
    <footer
      id="c-town-spotify-player-bar"
      className="w-full bg-[#0a0a0a] border-t border-[#242424] select-none relative z-50 text-[#b3b3b3]"
    >
      {/* Playback alert banner if audio stream ends early */}
      {playbackError && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#282828] border border-amber-500/40 text-amber-300 text-[11px] px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span className="truncate max-w-sm">{playbackError}</span>
          <button
            onClick={() =>
              openInAppPlayer({
                platform: 'youtube',
                query: `${currentTrack.title} ${currentTrack.artist}`,
                title: currentTrack.title,
                artist: currentTrack.artist,
              })
            }
            className="underline font-bold text-white flex items-center gap-1 hover:text-[#1ed760]"
          >
            Play In-App (YouTube) <Tv className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* MOBILE FULL ICONS PLAYER (< md) */}
      <div className="md:hidden flex flex-col w-full bg-[#181818] border-t border-[#282828] px-3 pt-2 pb-1.5 shadow-2xl select-none">
        {/* Mobile Volume Slider Popout (if toggled open) */}
        {showMobileVolume && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-[#282828] rounded-xl border border-white/10 shadow-lg">
            <button
              onClick={toggleMute}
              className="p-1 text-[#b3b3b3] hover:text-white shrink-0"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4 text-[#1ed760]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#1ed760]" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #1ed760 ${(isMuted ? 0 : volume) * 100}%, #4d4d4d ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
            <span className="text-[11px] font-mono text-white w-9 text-right shrink-0">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        )}

        {/* ROW 1: Track Info + Top Action Icons (Like, Download, YouTube, Volume) */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Track Info with Artwork, Title, Artist & Logo */}
          <div
            onClick={() => setShowLyricsModal(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 shadow-md">
              <img
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-ping" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-white truncate leading-tight">{currentTrack.title}</h5>
              <div className="flex items-center gap-1.5 min-w-0 mt-0.5">
                {currentTrack.artistLogoUrl && (
                  <img
                    src={currentTrack.artistLogoUrl}
                    alt={currentTrack.artist}
                    className="w-3 h-3 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                  />
                )}
                <p className="text-[11px] text-[#b3b3b3] truncate">{currentTrack.artist}</p>
                {currentTrack.language && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-white/70 font-medium shrink-0">
                    {currentTrack.language}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Like button */}
            <button
              id="mobile-player-like-btn"
              onClick={() => toggleLikeTrack(currentTrack)}
              className={`p-1.5 rounded-full transition-colors active:scale-95 ${
                liked ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={liked ? 'Liked' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>

            {/* Offline download toggle */}
            <button
              id="mobile-player-download-btn"
              onClick={() => downloadTrack(currentTrack)}
              className={`p-1.5 rounded-full active:scale-95 ${
                downloaded ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={downloaded ? 'Downloaded offline' : 'Download for offline play'}
            >
              {downloaded ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            </button>

            {/* Full Song YouTube trigger */}
            <button
              id="mobile-player-youtube-btn"
              onClick={() =>
                openInAppPlayer({
                  platform: 'youtube',
                  query: currentTrack.youtubeVideoId || `${currentTrack.title} ${currentTrack.artist}`,
                  title: currentTrack.title,
                  artist: currentTrack.artist,
                })
              }
              className="p-1.5 text-red-400 hover:text-red-300 rounded-full active:scale-95"
              title="Play 100% full song on YouTube"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Volume toggle */}
            <button
              id="mobile-player-volume-btn"
              onClick={() => setShowMobileVolume(!showMobileVolume)}
              className={`p-1.5 rounded-full transition-colors active:scale-95 ${
                showMobileVolume || isMuted ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title="Volume control"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ROW 2: Interactive Seek Timeline Scrubber with Timestamps (PC mode feature now on mobile) */}
        <div className="w-full flex items-center gap-2 text-[10px] font-mono text-[#b3b3b3] mt-1 px-0.5">
          <span className="w-7 text-right shrink-0">{formatTime(currentTime)}</span>
          <div className="relative flex-1 flex items-center py-1">
            <input
              id="mobile-player-progress-bar"
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={currentDisplayProgress || 0}
              onChange={handleSeekChange}
              onMouseUp={handleSeekCommit}
              onTouchEnd={handleSeekCommit}
              className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer active:h-2 transition-all"
              style={{
                background: `linear-gradient(to right, #1ed760 ${currentDisplayProgress}%, #4d4d4d ${currentDisplayProgress}%)`,
              }}
            />
          </div>
          <span className="w-7 text-left shrink-0">{formatTime(duration)}</span>
        </div>

        {/* ROW 3: ALL PC Playback & Utility Control Icons on Mobile */}
        <div className="flex items-center justify-between pt-1 pb-0.5 px-0.5">
          {/* Shuffle */}
          <button
            id="mobile-player-shuffle-btn"
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors active:scale-90 ${
              isShuffled ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={isShuffled ? 'Shuffle on' : 'Enable shuffle'}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            id="mobile-player-prev-btn"
            onClick={skipPrev}
            className="p-1.5 rounded-full text-[#b3b3b3] hover:text-white active:scale-90 transition-colors"
            title="Previous song"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            id="mobile-player-play-pause-btn"
            onClick={togglePlayPause}
            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 shadow transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current text-black" />
            ) : (
              <Play className="w-4 h-4 fill-current text-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            id="mobile-player-next-btn"
            onClick={skipNext}
            className="p-1.5 text-[#b3b3b3] hover:text-white rounded-full active:scale-90 transition-colors"
            title="Next song"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Repeat */}
          <button
            id="mobile-player-repeat-btn"
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full transition-colors active:scale-90 ${
              repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>

          <span className="w-px h-3.5 bg-white/10 shrink-0 mx-0.5" />

          {/* Synced Lyrics */}
          <button
            id="mobile-player-lyrics-btn"
            onClick={() => setShowLyricsModal(!showLyricsModal)}
            className={`p-1.5 rounded-full transition-colors active:scale-90 ${
              showLyricsModal ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title="Synced Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue */}
          <button
            id="mobile-player-queue-btn"
            onClick={() => setShowQueueModal(!showQueueModal)}
            className={`p-1.5 rounded-full transition-colors active:scale-90 ${
              showQueueModal ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Universal Finder */}
          <button
            id="mobile-player-finder-btn"
            onClick={() =>
              openCrossPlatformFinder({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: currentTrack.album,
              })
            }
            className="p-1.5 rounded-full text-[#b3b3b3] hover:text-[#1ed760] active:scale-90 transition-colors"
            title="Find Across 8 Music Apps"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DESKTOP 3-COLUMN SPOTIFY PLAYER (>= md) */}
      <div className="hidden md:flex items-center justify-between gap-4 h-[88px] px-6">
        {/* COLUMN 1 (LEFT): Track Info & Like / Download Buttons */}
        <div className="flex items-center gap-3 min-w-0 w-[30%] shrink-0">
          <div
            onClick={() => navigateTo('album', { albumId: currentTrack.albumId })}
            className="relative w-14 h-14 rounded overflow-hidden shrink-0 cursor-pointer shadow-md group"
          >
            <img
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4
              onClick={() => navigateTo('album', { albumId: currentTrack.albumId })}
              className="text-sm font-bold text-white truncate cursor-pointer hover:underline"
            >
              {currentTrack.title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              {currentTrack.artistLogoUrl && (
                <img
                  src={currentTrack.artistLogoUrl}
                  alt={currentTrack.artist}
                  className="w-3.5 h-3.5 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                  title={`${currentTrack.artist} - Verified Artist`}
                />
              )}
              <p
                onClick={() => navigateTo('artist', { artistId: currentTrack.artistId })}
                className="text-xs text-[#b3b3b3] truncate cursor-pointer hover:underline hover:text-white"
              >
                {currentTrack.artist}
              </p>
              {currentTrack.language && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-white/70 font-medium shrink-0">
                  {currentTrack.language}
                </span>
              )}
            </div>
          </div>

          <button
            id="player-like-btn"
            onClick={() => toggleLikeTrack(currentTrack)}
            className={`p-2 rounded-full transition-all shrink-0 flex items-center justify-center ${
              liked ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => downloadTrack(currentTrack)}
            className={`p-2 rounded-full transition-all shrink-0 flex items-center justify-center ${
              downloaded ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={downloaded ? 'Downloaded offline' : 'Download for offline play'}
          >
            {downloaded ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          </button>
        </div>

        {/* COLUMN 2 (CENTER): Player Controls & Timeline */}
        <div className="flex flex-col items-center max-w-xl flex-1 px-2 min-w-0">
          {/* Controls Row */}
          <div className="flex items-center gap-5 mb-1">
            {/* Shuffle */}
            <button
              id="player-shuffle-btn"
              onClick={toggleShuffle}
              className={`p-1.5 rounded-full transition-colors ${
                isShuffled ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={isShuffled ? 'Shuffle on' : 'Enable shuffle'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              id="player-prev-btn"
              onClick={skipPrev}
              className="p-1.5 rounded-full text-[#b3b3b3] hover:text-white transition-colors"
              title="Previous song"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Primary Play/Pause Button */}
            <button
              id="player-play-pause-btn"
              onClick={togglePlayPause}
              className="w-9 h-9 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-transform shadow-md shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current text-black" />
              ) : (
                <Play className="w-4 h-4 fill-current text-black ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              id="player-next-btn"
              onClick={skipNext}
              className="p-1.5 rounded-full text-[#b3b3b3] hover:text-white transition-colors"
              title="Next song"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat */}
            <button
              id="player-repeat-btn"
              onClick={toggleRepeat}
              className={`p-1.5 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Timeline & Scrubber Bar */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-[#b3b3b3]">
            <span className="w-8 text-right shrink-0">{formatTime(currentTime)}</span>

            <div className="relative flex-1 flex items-center group py-1">
              <input
                id="player-progress-bar"
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={currentDisplayProgress || 0}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                className="w-full h-1 bg-[#4d4d4d] group-hover:h-1.5 rounded-lg appearance-none cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(to right, #1ed760 ${currentDisplayProgress}%, #4d4d4d ${currentDisplayProgress}%)`,
                }}
              />
            </div>

            <span className="w-8 text-left shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* COLUMN 3 (RIGHT): Lyrics, Queue, In-App Stream & Volume */}
        <div className="flex items-center justify-end gap-2.5 shrink-0 w-[30%]">
          {/* Synchronized Lyrics */}
          <button
            id="player-lyrics-toggle-btn"
            onClick={() => setShowLyricsModal(!showLyricsModal)}
            className={`p-1.5 rounded-full transition-colors ${
              showLyricsModal ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title="Synced Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue Drawer */}
          <button
            id="player-queue-toggle-btn"
            onClick={() => setShowQueueModal(!showQueueModal)}
            className={`p-1.5 rounded-full transition-colors ${
              showQueueModal ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* In-App YouTube Full Song Streamer */}
          <button
            id="player-in-app-stream-btn"
            onClick={() =>
              openInAppPlayer({
                platform: 'youtube',
                query: currentTrack.youtubeVideoId || `${currentTrack.title} ${currentTrack.artist}`,
                title: currentTrack.title,
                artist: currentTrack.artist,
              })
            }
            className="p-1.5 rounded-full text-[#b3b3b3] hover:text-red-400 transition-colors"
            title="Play full authentic song on YouTube"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Universal Cross-Platform Finder */}
          <button
            id="player-cross-platform-btn"
            onClick={() =>
              openCrossPlatformFinder({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: currentTrack.album,
              })
            }
            className="p-1.5 rounded-full text-[#b3b3b3] hover:text-[#1ed760] transition-colors"
            title="Find on external streaming apps"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-28 group">
            <button
              onClick={toggleMute}
              className="p-1 text-[#b3b3b3] hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#4d4d4d] group-hover:h-1.5 rounded-lg appearance-none cursor-pointer transition-all"
              style={{
                background: `linear-gradient(to right, #1ed760 ${(isMuted ? 0 : volume) * 100}%, #4d4d4d ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
