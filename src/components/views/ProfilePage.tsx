import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  User,
  Settings,
  Sliders,
  Sparkles,
  LogOut,
  Shield,
  ShieldCheck,
  Music,
  Headphones,
  Check,
  Edit2,
  Heart,
  ListMusic,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    user,
    updateUserProfile,
    logout,
    likedTracks,
    playlists,
    recentlyPlayed,
    audioQuality,
    setAudioQuality,
    autoplay,
    setAutoplay,
    crossfadeSeconds,
    setCrossfadeSeconds,
    currentTheme,
    setThemeColor,
    equalizerPreset,
    setEqualizerPreset,
    setShowOnboardingModal,
    navigateTo,
  } = useMusic();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || 'C-Town Listener');
  const [bio, setBio] = useState(user?.bio || 'Tuning in to the best acoustic vibrations and beats.');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: displayName,
      bio: bio,
    });
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const themeOptions = [
    { label: 'C-Town Teal', hex: '#14b8a6' },
    { label: 'Nepal Emerald', hex: '#10b981' },
    { label: 'Himalayan Crimson', hex: '#dc2626' },
    { label: 'Lakeside Cyan', hex: '#06b6d4' },
    { label: 'Twilight Indigo', hex: '#6366f1' },
    { label: 'Solar Amber', hex: '#f59e0b' },
  ];

  const eqPresets = ['Flat', 'Bass Boost', 'Vocal Enhancer', 'Acoustic / Indie', 'Electronic Club'];

  return (
    <div id="c-town-profile-page" className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto select-none">
      {/* Profile Card Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/40 via-white/[0.03] to-transparent border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xl">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-2xl shrink-0 ring-4 ring-emerald-500/40">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1ed760]/20 text-[#1ed760] text-xs font-bold uppercase tracking-wider">
              {user?.membershipTier || 'Premium Tier'}
            </span>
            {user?.phone && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#1ed760]/15 text-[#1ed760] text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Phone Verified ({user.phone})</span>
              </span>
            )}
            <span className="text-xs text-[#b3b3b3] font-mono">@{user?.handle || 'ctown_user'}</span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 mt-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-base font-bold text-white focus:outline-none focus:border-emerald-500"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-[#07080a] font-bold text-xs"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {user?.name}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  title="Edit profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{user?.bio}</p>
            </>
          )}

          {savedNotice && (
            <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Profile updated successfully</span>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 text-xs text-slate-400">
            <div className="text-center sm:text-left">
              <span className="block font-bold text-white text-base font-mono">{likedTracks.length}</span>
              <span>Liked Songs</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block font-bold text-white text-base font-mono">{playlists.length}</span>
              <span>Playlists</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block font-bold text-white text-base font-mono">{user?.favoriteGenres?.length || 3}</span>
              <span>Favorite Genres</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Recalibrate Taste</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AUDIO PREFERENCES */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
            <Headphones className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display text-base font-bold text-white">Audio &amp; Playback Engine</h3>
          </div>

          {/* Audio Quality */}
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-white">Audio Streaming Quality</span>
              <span className="text-[11px] text-slate-400">High bitrate lossless encoding</span>
            </div>
            <div className="flex bg-white/5 rounded-xl p-1 text-xs">
              {(['Normal', 'High', 'Very High'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setAudioQuality(q)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    audioQuality === q ? 'bg-emerald-500 text-[#07080a] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Autoplay */}
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-white">Continuous Autoplay</span>
              <span className="text-[11px] text-slate-400">Keep similar tracks playing when queue ends</span>
            </div>
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                autoplay ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  autoplay ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Crossfade */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="block text-xs font-semibold text-white">Crossfade Songs</span>
                <span className="text-[11px] text-slate-400">Smooth transition between tracks</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">{crossfadeSeconds}s</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              value={crossfadeSeconds}
              onChange={(e) => setCrossfadeSeconds(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Equalizer Preset */}
          <div>
            <span className="block text-xs font-semibold text-white mb-2">Equalizer Acoustic Profile</span>
            <div className="grid grid-cols-2 gap-2">
              {eqPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEqualizerPreset(preset)}
                  className={`px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                    equalizerPreset === preset
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* THEMING & BRANDING PREFERENCES */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
            <Sliders className="w-5 h-5 text-teal-400" />
            <h3 className="font-display text-base font-bold text-white">Visual &amp; Atmosphere Customization</h3>
          </div>

          {/* Theme Accent Color */}
          <div>
            <span className="block text-xs font-semibold text-white mb-2">Interface Glow &amp; Accent</span>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((theme) => (
                <button
                  key={theme.hex}
                  onClick={() => setThemeColor(theme.hex)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                    currentTheme.primary === theme.hex
                      ? 'bg-white/15 border-white/40 font-bold text-white'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: theme.hex }}
                  />
                  <span className="truncate">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Account */}
          <div className="pt-2 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy &amp; Data Rights</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              C-Town does not sell personal listening history. All user favorites, playlists, and settings are cached
              cleanly with local client persistence and secure cloud authentication readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
