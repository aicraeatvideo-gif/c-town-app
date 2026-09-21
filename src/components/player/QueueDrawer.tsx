import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Trash2, Music2, Play, Compass } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    showQueueModal,
    setShowQueueModal,
    currentTrack,
    queue,
    playTrack,
    removeFromQueue,
    clearQueue,
    openCrossPlatformFinder,
  } = useMusic();

  if (!showQueueModal) return null;

  return (
    <div
      id="c-town-queue-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in select-none"
    >
      <div className="w-full max-w-md bg-[#0d1017] border-l border-white/10 h-full flex flex-col text-white shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Music2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-display text-white">Play Queue</h3>
            <span className="text-xs text-slate-400 font-mono">({queue.length + (currentTrack ? 1 : 0)})</span>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="text-xs text-slate-400 hover:text-rose-400 p-1.5 transition-colors"
                title="Clear queue"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowQueueModal(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Currently playing */}
          {currentTrack && (
            <div>
              <span className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2.5">
                Now Playing
              </span>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
                <img
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
                </div>
                <button
                  onClick={() =>
                    openCrossPlatformFinder({
                      title: currentTrack.title,
                      artist: currentTrack.artist,
                      album: currentTrack.album,
                    })
                  }
                  className="p-1.5 text-slate-400 hover:text-teal-300"
                  title="Cross-platform links"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Up Next ({queue.length})
            </span>

            {queue.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                Queue is currently empty. Explore songs or playlists to add more.
              </div>
            ) : (
              <div className="space-y-1.5">
                {queue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div
                      onClick={() => playTrack(track)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs font-mono text-slate-500 w-4 text-center">{idx + 1}</span>
                      <img
                        src={track.artworkUrl}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                          {track.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeFromQueue(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
                        title="Remove from queue"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
