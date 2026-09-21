import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  CURATED_TRACKS,
  ARTISTS_CATALOG,
  ALBUMS_CATALOG,
  INITIAL_PLAYLISTS,
  POPULAR_LANGUAGES,
  PopularLanguage,
} from '../../data/catalog';
import { TrackCard } from '../cards/TrackCard';
import { AlbumCard } from '../cards/AlbumCard';
import { ArtistCard } from '../cards/ArtistCard';
import {
  Flame,
  Globe2,
  TrendingUp,
  Sparkles,
  Play,
  Heart,
  HardDrive,
  Upload,
  Tv,
  Radio,
  Clock,
  MapPin,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    recentlyPlayed,
    currentTrack,
    playTrack,
    openInAppPlayer,
    navigateTo,
    uploadedTracks,
  } = useMusic();

  const [selectedLanguage, setSelectedLanguage] = useState<PopularLanguage>('All');
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [userLocation, setUserLocation] = useState('');

  // Live time and location tracking
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cleanTz = tz.replace(/_/g, ' ').split('/').pop() || 'Local';
      setUserLocation(cleanTz);
    } catch {
      setUserLocation('Local');
    }

    return () => clearInterval(interval);
  }, []);

  // Dynamic greeting based on current local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Only popular tracks across all languages
  const onlyPopularTracks = CURATED_TRACKS.filter((t) => t.isPopular);

  // Filtered tracks based on selected language pill
  const displayedTracks =
    selectedLanguage === 'All'
      ? onlyPopularTracks
      : onlyPopularTracks.filter((t) => t.language === selectedLanguage);

  // Popular category slices for "All" view
  const popularHindiTracks = onlyPopularTracks.filter((t) => t.language === 'Hindi');
  const popularEnglishTracks = onlyPopularTracks.filter((t) => t.language === 'English');
  const popularNepaliTracks = onlyPopularTracks.filter((t) => t.language === 'Nepali');
  const popularPunjabiTracks = onlyPopularTracks.filter((t) => t.language === 'Punjabi');
  const popularWorldTracks = onlyPopularTracks.filter(
    (t) => t.language === 'Korean' || t.language === 'Spanish'
  );

  // Quick access cards (Spotify 6-box top grid) - only popular tracks
  const quickAccessItems = [
    {
      id: 'popular-spotlight-1',
      track: onlyPopularTracks[0], // Kesariya
      title: onlyPopularTracks[0]?.title,
      artist: onlyPopularTracks[0]?.artist,
      artwork: onlyPopularTracks[0]?.artworkUrl,
      artistLogo: onlyPopularTracks[0]?.artistLogoUrl,
      language: onlyPopularTracks[0]?.language,
      action: () => playTrack(onlyPopularTracks[0], onlyPopularTracks),
    },
    {
      id: 'popular-spotlight-2',
      track: onlyPopularTracks[4], // Blinding Lights
      title: onlyPopularTracks[4]?.title,
      artist: onlyPopularTracks[4]?.artist,
      artwork: onlyPopularTracks[4]?.artworkUrl,
      artistLogo: onlyPopularTracks[4]?.artistLogoUrl,
      language: onlyPopularTracks[4]?.language,
      action: () => playTrack(onlyPopularTracks[4], onlyPopularTracks),
    },
    {
      id: 'popular-spotlight-3',
      track: onlyPopularTracks[9], // Hataar Patar
      title: onlyPopularTracks[9]?.title,
      artist: onlyPopularTracks[9]?.artist,
      artwork: onlyPopularTracks[9]?.artworkUrl,
      artistLogo: onlyPopularTracks[9]?.artistLogoUrl,
      language: onlyPopularTracks[9]?.language,
      action: () => playTrack(onlyPopularTracks[9], onlyPopularTracks),
    },
    {
      id: 'popular-spotlight-4',
      track: onlyPopularTracks[14], // Brown Munde
      title: onlyPopularTracks[14]?.title,
      artist: onlyPopularTracks[14]?.artist,
      artwork: onlyPopularTracks[14]?.artworkUrl,
      artistLogo: onlyPopularTracks[14]?.artistLogoUrl,
      language: onlyPopularTracks[14]?.language,
      action: () => playTrack(onlyPopularTracks[14], onlyPopularTracks),
    },
    {
      id: 'popular-spotlight-5',
      track: onlyPopularTracks[17], // Seven (Jung Kook)
      title: onlyPopularTracks[17]?.title,
      artist: onlyPopularTracks[17]?.artist,
      artwork: onlyPopularTracks[17]?.artworkUrl,
      artistLogo: onlyPopularTracks[17]?.artistLogoUrl,
      language: onlyPopularTracks[17]?.language,
      action: () => playTrack(onlyPopularTracks[17], onlyPopularTracks),
    },
    {
      id: 'popular-playlist-1',
      title: "Today's Top Popular Hits",
      artist: 'Global Chart-Toppers',
      artwork: INITIAL_PLAYLISTS[0]?.coverUrl,
      action: () => navigateTo('playlist', { playlistId: INITIAL_PLAYLISTS[0]?.id }),
    },
  ];

  return (
    <div id="spotify-home-page" className="p-4 sm:p-6 space-y-8 select-none max-w-7xl mx-auto">
      {/* Top Header & Popular Language Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center flex-wrap gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {greeting}
              </h1>

              {/* Time by Location indicator */}
              {currentTimeStr && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md text-xs font-semibold text-white/90 shadow-sm transition-colors"
                  title={`Local time based on your location: ${userLocation}`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#1ed760]" />
                  <span>{currentTimeStr}</span>
                  <span className="text-white/40">•</span>
                  <MapPin className="w-3 h-3 text-orange-400" />
                  <span className="truncate max-w-[110px] sm:max-w-[160px] text-white/80">
                    {userLocation}
                  </span>
                </div>
              )}

              {/* Play top music button directly on greeting */}
              <button
                onClick={() => {
                  if (onlyPopularTracks.length > 0) {
                    playTrack(onlyPopularTracks[0], onlyPopularTracks);
                  }
                }}
                className="px-3 py-1 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#1ed760]/20 transition-all cursor-pointer shrink-0"
                title="Instant Play Certified Top Popular Hit"
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Play Hits</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#b3b3b3] flex items-center gap-1.5 font-medium">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
              <span>Showing certified popular chartbusters only across languages</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openInAppPlayer({ platform: 'youtube', query: 'Top Billboard Music Hits' })}
              className="px-3.5 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Tv className="w-3.5 h-3.5 text-red-400" />
              <span>In-App Video Streamer</span>
            </button>

            <button
              onClick={() => navigateTo('library', { tab: 'local' })}
              className="px-3.5 py-1.5 rounded-full bg-[#1ed760]/15 hover:bg-[#1ed760]/25 border border-[#1ed760]/40 text-[#1ed760] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Full Audio</span>
            </button>
          </div>
        </div>

        {/* Popular Language Filter Pills (Hindi, English, Nepali, Punjabi, Korean, Spanish, etc.) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-[#a7a7a7] mr-1 shrink-0 font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-[#1ed760]" />
            <span>Popular Languages:</span>
          </div>

          {POPULAR_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-[#282828] text-white hover:bg-[#333333] hover:text-[#1ed760]'
                }`}
              >
                <span>{lang === 'All' ? 'All Popular Hits' : `${lang} Hits`}</span>
                {lang !== 'All' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/15 text-black font-extrabold' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {onlyPopularTracks.filter((t) => t.language === lang).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spotify 6-Box Quick Access Grid with Artist Logos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickAccessItems.map((item) => (
          <div
            key={item.id}
            onClick={item.action}
            className="group relative flex items-center bg-[#ffffff12] hover:bg-[#ffffff20] rounded-md overflow-hidden transition-all duration-200 cursor-pointer shadow hover:shadow-lg"
          >
            {/* Left Image / Thumbnail */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#282828] flex items-center justify-center relative shadow-md overflow-hidden">
              {item.artwork ? (
                <img src={item.artwork} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <Radio className="w-8 h-8 text-[#b3b3b3]" />
              )}
            </div>

            {/* Title, Artist with Artist Logo */}
            <div className="flex-1 px-3 sm:px-4 min-w-0 pr-14">
              <p className="font-bold text-sm text-white truncate group-hover:text-white">
                {item.title}
              </p>
              {item.artist && (
                <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                  {item.artistLogo && (
                    <img
                      src={item.artistLogo}
                      alt={item.artist}
                      className="w-3.5 h-3.5 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                    />
                  )}
                  <p className="text-xs text-[#b3b3b3] truncate">
                    {item.artist}
                  </p>
                  {item.language && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 font-semibold shrink-0">
                      {item.language}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Hover Floating Spotify Green Play Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
              className="absolute right-3.5 w-11 h-11 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
              title="Play"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>
        ))}
      </div>

      {/* FILTERED VIEW: If specific language is active */}
      {selectedLanguage !== 'All' ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Popular {selectedLanguage} Music</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1ed760]/20 text-[#1ed760] border border-[#1ed760]/30">
                  {displayedTracks.length} chartbusters
                </span>
              </h2>
              <p className="text-xs text-[#b3b3b3] mt-0.5">
                Highest-streamed and certified viral tracks in {selectedLanguage} with official artist logos
              </p>
            </div>
            <button
              onClick={() => setSelectedLanguage('All')}
              className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white"
            >
              View all languages
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                playlistContext={displayedTracks}
                layout="card"
              />
            ))}
          </div>
        </section>
      ) : (
        /* DEFAULT VIEW: Organized popular music sections across languages */
        <>
          {/* SECTION 1: Top Popular Songs in India & Bollywood (Hindi) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  onClick={() => setSelectedLanguage('Hindi')}
                  className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer flex items-center gap-2"
                >
                  <span>Popular Hindi Music</span>
                  <span className="text-xs font-normal text-orange-400 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                    Billion Streams Club
                  </span>
                </h2>
                <p className="text-xs text-[#b3b3b3] mt-0.5">
                  Top popular Bollywood and indie anthems featuring Arijit Singh, Jubin Nautiyal & Prateek Kuhad
                </p>
              </div>
              <button
                onClick={() => setSelectedLanguage('Hindi')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white"
              >
                Show all Hindi
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularHindiTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlistContext={onlyPopularTracks}
                  layout="card"
                />
              ))}
            </div>
          </section>

          {/* SECTION 2: Top Popular Global Hits (English) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  onClick={() => setSelectedLanguage('English')}
                  className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer flex items-center gap-2"
                >
                  <span>Popular English Music</span>
                  <span className="text-xs font-normal text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    Billboard Global #1s
                  </span>
                </h2>
                <p className="text-xs text-[#b3b3b3] mt-0.5">
                  Worldwide mega-hits from The Weeknd, Harry Styles, Ed Sheeran, and Dua Lipa
                </p>
              </div>
              <button
                onClick={() => setSelectedLanguage('English')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white"
              >
                Show all English
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularEnglishTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlistContext={onlyPopularTracks}
                  layout="card"
                />
              ))}
            </div>
          </section>

          {/* SECTION 3: Top Popular Punjabi Hits */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  onClick={() => setSelectedLanguage('Punjabi')}
                  className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer flex items-center gap-2"
                >
                  <span>Popular Punjabi Anthems</span>
                  <span className="text-xs font-normal text-red-400 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                    Global Punjabi Waves
                  </span>
                </h2>
                <p className="text-xs text-[#b3b3b3] mt-0.5">
                  Viral chart-busters by AP Dhillon, Sidhu Moose Wala, and Diljit Dosanjh
                </p>
              </div>
              <button
                onClick={() => setSelectedLanguage('Punjabi')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white"
              >
                Show all Punjabi
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularPunjabiTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlistContext={onlyPopularTracks}
                  layout="card"
                />
              ))}
            </div>
          </section>

          {/* SECTION 4: Top Popular Nepali Hits */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  onClick={() => setSelectedLanguage('Nepali')}
                  className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer flex items-center gap-2"
                >
                  <span>Popular Nepali Music</span>
                  <span className="text-xs font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Acoustic & Indie Classics
                  </span>
                </h2>
                <p className="text-xs text-[#b3b3b3] mt-0.5">
                  The most beloved songs by Sajjan Raj Vaidya, Bipul Chettri, Sushant KC, and Tribal Rain
                </p>
              </div>
              <button
                onClick={() => setSelectedLanguage('Nepali')}
                className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white"
              >
                Show all Nepali
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularNepaliTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlistContext={onlyPopularTracks}
                  layout="card"
                />
              ))}
            </div>
          </section>

          {/* SECTION 5: Popular International Music (Korean & Spanish) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>Popular World Hits (Korean & Spanish)</span>
                  <span className="text-xs font-normal text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                    Multi-Language Record Breakers
                  </span>
                </h2>
                <p className="text-xs text-[#b3b3b3] mt-0.5">
                  Historic global hits: Jung Kook (Seven), BTS (Dynamite), Luis Fonsi (Despacito), Bad Bunny (Dákiti)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularWorldTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlistContext={onlyPopularTracks}
                  layout="card"
                />
              ))}
            </div>
          </section>

          {/* SECTION 6: Popular Artists (Showing Artist Logos & Followers) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
                  Popular Artists
                </h2>
                <p className="text-xs text-[#b3b3b3] mt-0.5">
                  Verified top streaming artists with official artist logos and catalogs
                </p>
              </div>
              <span className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer">
                Show all
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {ARTISTS_CATALOG.slice(0, 6).map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>

          {/* SECTION 7: Popular Playlists */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
                  Popular Playlists
                </h2>
                <p className="text-xs text-[#b3b3b3] mt-0.5">
                  Curated playlists grouped by language and mood
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {INITIAL_PLAYLISTS.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => navigateTo('playlist', { playlistId: pl.id })}
                  className="group relative p-3.5 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer select-none flex flex-col shadow-md hover:shadow-xl"
                >
                  <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828] shadow-md">
                    <img
                      src={pl.coverUrl}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks);
                      }}
                      className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 text-black shadow-2xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mb-1">{pl.title}</h4>
                  <p className="text-xs text-[#b3b3b3] line-clamp-2">{pl.description}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Uploaded music section if user added their own audio */}
      {uploadedTracks.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer"
                onClick={() => navigateTo('library', { tab: 'local' })}
              >
                Your Uploaded Tracks ({uploadedTracks.length})
              </h2>
              <p className="text-xs text-[#b3b3b3] mt-0.5">
                Offline full audio files saved locally in your browser
              </p>
            </div>
            <button
              onClick={() => navigateTo('library', { tab: 'local' })}
              className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white"
            >
              Show all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedTracks.slice(0, 5).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                playlistContext={uploadedTracks}
                layout="card"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
