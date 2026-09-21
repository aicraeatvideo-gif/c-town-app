import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { ARTISTS_CATALOG, GENRE_LIST } from '../../data/catalog';
import { Search, X, Check, Sparkles, ArrowRight, Music, Heart } from 'lucide-react';
import { Artist } from '../../types/music';

export const OnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal, user, updateUserProfile, navigateTo } = useMusic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>(['art-sajjan', 'art-bipul']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Nepali', 'Lo-fi', 'Bollywood']);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!showOnboardingModal) return null;

  const filteredArtists = ARTISTS_CATALOG.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleArtist = (id: string) => {
    setSelectedArtistIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const removeArtist = (id: string) => {
    setSelectedArtistIds((prev) => prev.filter((a) => a !== id));
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleFinish = () => {
    setIsCompleted(true);
    updateUserProfile({
      favoriteGenres: selectedGenres,
      favoriteArtistIds: selectedArtistIds,
    });

    // Short transition before routing to personalized home
    setTimeout(() => {
      setShowOnboardingModal(false);
      setIsCompleted(false);
      navigateTo('home');
    }, 1800);
  };

  const selectedArtistsList = ARTISTS_CATALOG.filter((a) => selectedArtistIds.includes(a.id));

  return (
    <div
      id="c-town-onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#0e1117] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Completion Celebration Overlay */}
        {isCompleted ? (
          <div className="p-12 flex flex-col items-center justify-center text-center my-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                You're ready to listen.
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                We've calibrated your personalized C-Town stream with your favorite vibrations. Enjoy the soundscape.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Personalizing Home Dashboard...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-8 pt-8 pb-4 border-b border-white/5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Music className="w-3.5 h-3.5" />
                <span>Taste Profile Calibration</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Which artists do you want to listen to?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your beloved artists and favorite sound genres so C-Town can curate your daily soundtrack.
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="px-8 py-6 overflow-y-auto space-y-6">
              {/* Selected Artist Chips */}
              {selectedArtistsList.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Selected Artists ({selectedArtistsList.length})</span>
                    <button
                      onClick={() => setSelectedArtistIds([])}
                      className="text-[11px] text-slate-400 hover:text-rose-400"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedArtistsList.map((artist) => (
                      <span
                        key={artist.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                      >
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{artist.name}</span>
                        <button
                          onClick={() => removeArtist(artist.id)}
                          className="hover:text-white p-0.5 rounded-full hover:bg-emerald-500/30"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Artist Search Field */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Nepali, Bollywood, or global artists..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-500"
                />
              </div>

              {/* Artists Grid */}
              <div>
                <span className="block text-xs font-medium text-slate-400 mb-3">Popular on C-Town</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filteredArtists.map((artist) => {
                    const isSelected = selectedArtistIds.includes(artist.id);
                    return (
                      <div
                        key={artist.id}
                        onClick={() => toggleArtist(artist.id)}
                        className={`group relative p-3 rounded-2xl cursor-pointer border text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/15'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="relative w-16 h-16 mx-auto mb-2.5">
                          <img
                            src={artist.imageUrl}
                            alt={artist.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 rounded-full bg-emerald-500/40 flex items-center justify-center">
                              <Check className="w-6 h-6 text-white drop-shadow" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{artist.name}</h4>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {artist.genres[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Favorite Genres Selection */}
              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-2.5">Choose Favorite Genres</span>
                <div className="flex flex-wrap gap-2">
                  {GENRE_LIST.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-[#07080a] font-bold shadow-md shadow-emerald-500/20'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
              <span className="text-xs text-slate-400">
                {selectedArtistIds.length} artists, {selectedGenres.length} genres chosen
              </span>
              <button
                id="onboarding-continue-btn"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
