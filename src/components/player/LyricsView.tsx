import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Mic2, FileText, Compass, Sparkles } from 'lucide-react';

export const LyricsView: React.FC = () => {
  const {
    showLyricsModal,
    setShowLyricsModal,
    currentTrack,
    currentTime,
    seekTo,
    currentTheme,
    openCrossPlatformFinder,
  } = useMusic();

  const [mode, setMode] = useState<'synced' | 'plain'>('synced');
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!showLyricsModal || !currentTrack) return null;

  const lines = currentTrack.syncedLyrics || [];
  const hasSynced = lines.length > 0;

  // Find active line index based on current time
  let activeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (currentTime >= lines[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto scroll to active line
  useEffect(() => {
    if (mode === 'synced' && activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, mode]);

  return (
    <div
      id="c-town-lyrics-view"
      className="fixed inset-0 z-50 flex flex-col bg-[#07080a]/95 backdrop-blur-2xl text-white animate-fade-in select-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: `${currentTheme.primary}33`, color: currentTheme.primary }}
          >
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <span>{currentTrack.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-sans font-medium">
                {hasSynced ? 'Synchronized' : 'Standard'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">{currentTrack.artist}</p>
          </div>
        </div>

        {/* View toggles & Close */}
        <div className="flex items-center gap-3">
          {hasSynced && (
            <div className="flex rounded-xl bg-white/5 p-1 text-xs">
              <button
                onClick={() => setMode('synced')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  mode === 'synced' ? 'bg-emerald-500 text-[#07080a] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Synced
              </button>
              <button
                onClick={() => setMode('plain')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  mode === 'plain' ? 'bg-emerald-500 text-[#07080a] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Plain Text
              </button>
            </div>
          )}

          <button
            onClick={() =>
              openCrossPlatformFinder({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: currentTrack.album,
              })
            }
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-teal-300 transition-colors"
            title="Search on external lyrics / streaming apps"
          >
            <Compass className="w-5 h-5" />
          </button>

          <button
            id="lyrics-close-btn"
            onClick={() => setShowLyricsModal(false)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lyrics Content Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-12 max-w-3xl mx-auto w-full flex flex-col items-center text-center space-y-8 scroll-smooth"
      >
        {hasSynced && mode === 'synced' ? (
          lines.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seekTo(line.time)}
                className={`cursor-pointer transition-all duration-300 py-1.5 px-4 rounded-xl max-w-xl ${
                  isActive
                    ? 'text-2xl sm:text-4xl font-extrabold text-white scale-105 drop-shadow-md tracking-tight'
                    : isPast
                    ? 'text-lg sm:text-xl font-medium text-slate-400 hover:text-slate-200'
                    : 'text-lg sm:text-xl font-medium text-slate-400 hover:text-slate-300'
                }`}
                style={{
                  color: isActive ? currentTheme.primary : undefined,
                }}
              >
                {line.text}
              </div>
            );
          })
        ) : (
          <div className="space-y-4 text-slate-300 text-lg sm:text-xl leading-loose max-w-lg">
            {lines.map((l, i) => (
              <p key={i}>{l.text}</p>
            ))}
          </div>
        )}

        {lines.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center text-slate-400 space-y-3">
            <FileText className="w-12 h-12 text-slate-600" />
            <h4 className="text-base font-semibold text-white">Lyrics unavailable for this track</h4>
            <p className="text-xs max-w-sm">
              We respect copyright and artist licensing. You can open this song on Spotify or Apple Music to view full
              authorized lyrics.
            </p>
            <button
              onClick={() =>
                openCrossPlatformFinder({
                  title: currentTrack.title,
                  artist: currentTrack.artist,
                  album: currentTrack.album,
                })
              }
              className="mt-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Locate on Other Streaming Platforms</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Bottom info */}
      <div className="py-3 px-6 text-center text-xs text-slate-400 border-t border-white/5 bg-black/40">
        Tap any lyric line to jump directly to that timestamp • Licensed playback via C-Town Provider
      </div>
    </div>
  );
};
