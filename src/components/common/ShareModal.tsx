import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Copy, Check, Share2, Compass } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareModalData, closeShareModal, openCrossPlatformFinder } = useMusic();
  const [copied, setCopied] = useState(false);

  if (!shareModalData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareModalData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="c-town-share-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white select-none"
    >
      <div className="relative w-full max-w-md bg-[#0e1117] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display text-base font-bold">Share to Friends</h3>
          </div>
          <button
            onClick={closeShareModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
          <h4 className="text-sm font-bold text-white truncate">{shareModalData.title}</h4>
          {shareModalData.subtitle && (
            <p className="text-xs text-slate-400 truncate">{shareModalData.subtitle}</p>
          )}
        </div>

        {/* Copy Link Row */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareModalData.url}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Cross platform tip */}
        <button
          onClick={() => {
            closeShareModal();
            openCrossPlatformFinder({ title: shareModalData.title });
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Compass className="w-4 h-4 text-teal-400" />
          <span>Locate this title across 8 other music apps</span>
        </button>
      </div>
    </div>
  );
};
