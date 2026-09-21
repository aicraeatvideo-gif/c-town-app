import React, { useState, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Track } from '../../types/music';
import {
  FolderOpen,
  Upload,
  Play,
  Pause,
  Trash2,
  ListPlus,
  Music,
  HardDrive,
  Info,
  Sparkles,
  Link2,
  Loader2,
  CheckCircle2,
  Tv,
} from 'lucide-react';

export const LocalFilesTab: React.FC = () => {
  const {
    uploadedTracks,
    addUploadedTrackFiles,
    deleteUploadedTrack,
    isUploading,
    playTrack,
    togglePlayPause,
    addToQueue,
    currentTrack,
    isPlaying,
    openInAppPlayer,
  } = useMusic();

  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [customTrackTitle, setCustomTrackTitle] = useState('');
  const [customTrackArtist, setCustomTrackArtist] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadSamplePack = () => {
    // Generate high quality sample tracks for immediate testing
    const samplePackBlobs = [
      {
        name: 'Sajjan Raj Vaidya - Hataar Patar (Acoustic Full).mp3',
        title: 'Hataar Patar (Acoustic Full)',
        artist: 'Sajjan Raj Vaidya',
        duration: 215,
        url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=rain-and-nostalgia-acoustic-guitar-15421.mp3',
      },
      {
        name: 'Kathmandu Beat Lab - Midnight Coffee Lofi.mp3',
        title: 'Midnight Coffee Lofi',
        artist: 'Kathmandu Beat Lab',
        duration: 184,
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      },
      {
        name: 'Eastern Echoes - Sarangi Sunset Glow.mp3',
        title: 'Sarangi Sunset Glow',
        artist: 'Eastern Echoes',
        duration: 198,
        url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3527e30de.mp3?filename=ambient-piano-amp-strings-10711.mp3',
      },
    ];

    samplePackBlobs.forEach((item) => {
      // Synthesize Blob
      fetch(item.url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], item.name, { type: 'audio/mpeg' });
          addUploadedTrackFiles([file]);
        })
        .catch(() => {});
    });
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAudioUrl.trim()) return;

    fetch(customAudioUrl.trim())
      .then((res) => res.blob())
      .then((blob) => {
        const title = customTrackTitle.trim() || 'Imported Stream Track';
        const artist = customTrackArtist.trim() || 'Online Stream';
        const file = new File([blob], `${artist} - ${title}.mp3`, { type: 'audio/mpeg' });
        addUploadedTrackFiles([file]);
        setCustomAudioUrl('');
        setCustomTrackTitle('');
        setCustomTrackArtist('');
        setShowUrlInput(false);
      })
      .catch((err) => {
        console.warn('URL Fetch error:', err);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addUploadedTrackFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addUploadedTrackFiles(e.dataTransfer.files);
    }
  };

  const handlePlayAll = () => {
    if (uploadedTracks.length > 0) {
      playTrack(uploadedTracks[0], uploadedTracks);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="c-town-local-files-tab" className="space-y-6 select-none max-w-6xl mx-auto pb-12">
      {/* Spotify-styled Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#282828] to-[#121212] border border-white/5 shadow-2xl">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg bg-gradient-to-br from-[#1db954] to-[#121212] flex items-center justify-center text-white shadow-2xl shrink-0 group">
          <HardDrive className="w-20 h-20 text-white group-hover:scale-105 transition-transform" />
        </div>

        <div className="flex-1 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">
            Personal Library • Offline &amp; Persistent
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Local Files &amp; Uploads
          </h1>
          <p className="text-sm text-[#b3b3b3] max-w-2xl leading-relaxed">
            Upload full-length songs (MP3, WAV, FLAC, M4A, AAC). Stored securely in your browser's IndexedDB with zero size limits and full audio playback from start to finish.
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs text-[#b3b3b3]">
            <span className="font-semibold text-white">
              {uploadedTracks.length} {uploadedTracks.length === 1 ? 'song' : 'songs'}
            </span>
            <span>•</span>
            <span className="text-[#1ed760] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Full length playback
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          {uploadedTracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl shadow-[#1ed760]/20 transition-all cursor-pointer"
              title="Play All Uploaded Songs"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-3 rounded-full bg-white hover:bg-[#f0f0f0] text-black font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Full Audio...</span>
              </>
            ) : (
              <>
                <FolderOpen className="w-4 h-4 text-black" />
                <span>Upload Full Songs</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={loadSamplePack}
            className="px-4 py-2.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1.5"
            title="Import 3 studio demo tracks"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1ed760]" />
            <span>Load Demo Pack</span>
          </button>

          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-4 py-2.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-[#b3b3b3] hover:text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1.5"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Add Audio URL</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openInAppPlayer({ platform: 'youtube', query: 'Top Hits Full' })}
            className="px-4 py-2.5 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold text-xs transition-all flex items-center gap-1.5"
            title="Play YouTube or external streams inside the app"
          >
            <Tv className="w-3.5 h-3.5 text-red-400" />
            <span>In-App Video &amp; Full Streams</span>
          </button>
        </div>
      </div>

      {/* URL Import Form */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="p-4 rounded-xl bg-[#181818] border border-white/10 flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Artist Name (e.g. Sajjan Raj Vaidya)"
            value={customTrackArtist}
            onChange={(e) => setCustomTrackArtist(e.target.value)}
            className="w-full sm:w-1/4 px-3 py-2 rounded-md bg-[#282828] border border-transparent focus:border-[#1ed760] text-xs text-white placeholder-[#727272] outline-none"
          />
          <input
            type="text"
            placeholder="Song Title (e.g. Hataar Patar)"
            value={customTrackTitle}
            onChange={(e) => setCustomTrackTitle(e.target.value)}
            className="w-full sm:w-1/4 px-3 py-2 rounded-md bg-[#282828] border border-transparent focus:border-[#1ed760] text-xs text-white placeholder-[#727272] outline-none"
          />
          <input
            type="url"
            placeholder="Direct Audio Stream Link (https://...mp3)"
            value={customAudioUrl}
            onChange={(e) => setCustomAudioUrl(e.target.value)}
            required
            className="w-full sm:flex-1 px-3 py-2 rounded-md bg-[#282828] border border-transparent focus:border-[#1ed760] text-xs text-white placeholder-[#727272] outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold text-xs transition-all shrink-0"
          >
            Save Full Song
          </button>
        </form>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging
            ? 'border-[#1ed760] bg-[#1ed760]/10 scale-[1.01]'
            : 'border-[#282828] hover:border-[#1ed760]/50 bg-[#181818]/60 hover:bg-[#181818]'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#242424] flex items-center justify-center text-[#1ed760]">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              Drag &amp; drop full audio files here, or <span className="text-[#1ed760] underline">browse device files</span>
            </p>
            <p className="text-xs text-[#b3b3b3] mt-1">
              Supports MP3, WAV, FLAC, M4A, AAC, and OGG formats with full length playback
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#b3b3b3] bg-[#282828] px-3 py-1 rounded-full">
            <Info className="w-3.5 h-3.5 text-[#1ed760]" />
            <span>Files are kept permanently on your browser using IndexedDB. No 30-second cuts.</span>
          </div>
        </div>
      </div>

      {/* Track List (Spotify Table Layout) */}
      {uploadedTracks.length === 0 ? (
        <div className="py-16 text-center text-[#b3b3b3] text-sm bg-[#181818]/30 rounded-xl border border-white/5">
          <Music className="w-10 h-10 mx-auto mb-3 text-[#535353]" />
          <p className="font-semibold text-white">No uploaded music yet</p>
          <p className="text-xs text-[#b3b3b3] mt-1">Select files from your device or drop them above to build your offline library.</p>
        </div>
      ) : (
        <div className="bg-[#121212] rounded-xl overflow-hidden border border-white/5">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#b3b3b3] border-b border-[#282828]">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6 sm:col-span-5">Title</div>
            <div className="hidden sm:block sm:col-span-3">Album</div>
            <div className="col-span-3 sm:col-span-2 text-right">Duration</div>
            <div className="col-span-2 sm:col-span-1 text-center">Delete</div>
          </div>

          {/* Tracks Rows */}
          <div className="divide-y divide-white/[0.03]">
            {uploadedTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    if (isCurrent) {
                      togglePlayPause();
                    } else {
                      playTrack(track, uploadedTracks);
                    }
                  }}
                  className={`group grid grid-cols-12 gap-4 items-center px-4 py-2.5 hover:bg-[#ffffff1a] rounded-md transition-colors cursor-pointer ${
                    isCurrent ? 'bg-[#ffffff1a]' : ''
                  }`}
                >
                  {/* Column 1: Index or Play icon */}
                  <div className="col-span-1 text-center text-xs font-mono text-[#b3b3b3]">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end justify-center gap-0.5 h-3.5 w-full">
                        <span className="w-1 bg-[#1ed760] animate-pulse h-3" />
                        <span className="w-1 bg-[#1ed760] animate-pulse h-2 delay-75" />
                        <span className="w-1 bg-[#1ed760] animate-pulse h-3.5 delay-150" />
                      </div>
                    ) : (
                      <>
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <button className="hidden group-hover:inline-flex items-center justify-center text-white hover:text-[#1ed760]">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Column 2: Title & Artist & Artwork */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-[#282828] overflow-hidden shrink-0 flex items-center justify-center">
                      <Music className="w-5 h-5 text-[#1ed760]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-[#b3b3b3] truncate group-hover:text-white transition-colors">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Album */}
                  <div className="hidden sm:block sm:col-span-3 text-xs text-[#b3b3b3] truncate">
                    {track.album || 'Uploaded Music'}
                  </div>

                  {/* Column 4: Duration & Queue */}
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 text-xs font-mono text-[#b3b3b3]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue(track);
                      }}
                      className="p-1 rounded hover:bg-white/10 text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Add to queue"
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                    </button>
                    <span>{formatTime(track.duration)}</span>
                  </div>

                  {/* Column 5: Delete */}
                  <div className="col-span-2 sm:col-span-1 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUploadedTrack(track.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-[#b3b3b3] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete uploaded song"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
