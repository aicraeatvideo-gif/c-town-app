import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { getCrossPlatformLinks } from '../../utils/crossPlatformLinks';
import {
  X,
  Search,
  ExternalLink,
  Compass,
  Copy,
  Check,
  Music,
  Share2,
  Play,
  Tv,
} from 'lucide-react';

export const CrossPlatformFinderModal: React.FC = () => {
  const {
    showCrossPlatformModal,
    setShowCrossPlatformModal,
    crossPlatformTarget,
    openInAppPlayer,
  } = useMusic();

  const [inputQuery, setInputQuery] = useState(
    crossPlatformTarget?.query ||
      (crossPlatformTarget?.title
        ? `${crossPlatformTarget.title} ${crossPlatformTarget.artist}`
        : 'Sajjan Raj Vaidya')
  );
  const [copied, setCopied] = useState(false);

  if (!showCrossPlatformModal) return null;

  const currentQuery = inputQuery.trim() || 'Music';
  const platformLinks = getCrossPlatformLinks({ query: currentQuery });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://c-town.music/search?q=${encodeURIComponent(currentQuery)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayInApp = (platformName: string) => {
    let platformKey: 'youtube' | 'spotify' | 'soundcloud' | 'applemusic' = 'youtube';
    const lower = platformName.toLowerCase();
    if (lower.includes('spotify')) platformKey = 'spotify';
    else if (lower.includes('sound')) platformKey = 'soundcloud';
    else if (lower.includes('apple')) platformKey = 'applemusic';
    else platformKey = 'youtube';

    setShowCrossPlatformModal(false);
    openInAppPlayer({
      platform: platformKey,
      query: currentQuery,
      title: crossPlatformTarget?.title || currentQuery,
      artist: crossPlatformTarget?.artist || '',
    });
  };

  return (
    <div
      id="cross-platform-finder-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-white"
    >
      <div className="relative w-full max-w-xl bg-[#0e1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Cross-Platform Music Locator</h3>
              <p className="text-[11px] text-slate-400">Search once, open seamlessly across any major music app</p>
            </div>
          </div>
          <button
            onClick={() => setShowCrossPlatformModal(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input for Cross-Platform */}
        <div className="p-6 space-y-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search song, artist, album, or genre..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-teal-400 text-white placeholder-slate-500"
            />
          </div>

          {/* In-App Direct Stream Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/15 via-emerald-500/15 to-orange-500/15 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <Tv className="w-4 h-4 text-red-400" />
                <span>Stream Inside C-TOWN (No External Apps)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Play "{currentQuery}" directly in the built-in player with video & background playback.
              </p>
            </div>
            <button
              onClick={() => handlePlayInApp('youtube')}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Now In-App</span>
            </button>
          </div>

          {/* Platforms Grid */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
              <span>Choose Player to Open Inside App:</span>
              <button
                onClick={handleCopyLink}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Copy Search'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {platformLinks.map((platform) => {
                const isDirectInApp = ['Spotify', 'YouTube Music', 'SoundCloud', 'Apple Music'].includes(platform.name);
                return (
                  <button
                    key={platform.name}
                    onClick={() => handlePlayInApp(platform.name)}
                    className={`group p-3 rounded-2xl bg-white/[0.03] border border-white/10 ${platform.bgColor} flex flex-col items-center text-center transition-all hover:scale-[1.02] cursor-pointer`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-sm"
                      style={{ backgroundColor: `${platform.color}25`, color: platform.color }}
                    >
                      <Music className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 truncate w-full">
                      {platform.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{isDirectInApp ? 'Play In-App' : 'Stream In-App'}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong>Pro-tip:</strong> C-Town is built with an open ecosystem. If an external song isn't directly
            playable in your region, click any provider above to immediately stream the full track with high-fidelity
            lossless audio on your preferred service without leaving your session.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">8 Connected Streaming Networks</span>
          <button
            onClick={() => setShowCrossPlatformModal(false)}
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
