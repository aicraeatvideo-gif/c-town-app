import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { musicProvider } from '../../services/musicProvider';
import { searchYouTubeMusic, VERIFIED_YOUTUBE_TRACKS } from '../../services/youtubeService';
import { Track, Artist, Album, YouTubeSearchResult } from '../../types/music';
import { TrackCard } from '../cards/TrackCard';
import { ArtistCard } from '../cards/ArtistCard';
import { AlbumCard } from '../cards/AlbumCard';
import { TRENDING_SEARCHES } from '../../data/catalog';
import {
  Search,
  X,
  History,
  TrendingUp,
  Compass,
  Music2,
  Disc,
  Users,
  Loader2,
  ExternalLink,
  Tv,
  Play,
  Download,
  CheckCircle,
  WifiOff,
  Sparkles,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const {
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
    removeSearchHistoryItem,
    openCrossPlatformFinder,
    openInAppPlayer,
    playTrack,
    navigateTo,
    downloadedTracks,
    downloadTrack,
    isDownloaded,
    download30MinPack,
    isDownloadingPack,
    downloadPackProgress,
    totalOfflineMinutes,
  } = useMusic();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'youtube' | 'songs' | 'artists' | 'albums' | 'offline'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Search Results
  const [songResults, setSongResults] = useState<Track[]>([]);
  const [youtubeResults, setYoutubeResults] = useState<YouTubeSearchResult[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const convertYouTubeResultToTrack = (yt: YouTubeSearchResult): Track => ({
    id: `yt-${yt.id}`,
    title: yt.title.replace(/\(Official.*?\)/gi, '').replace(/- Official.*$/gi, '').trim(),
    artist: yt.channelTitle,
    album: 'YouTube Full Original',
    genre: 'Pop',
    duration: 210,
    artworkUrl: yt.thumbnailUrl,
    audioUrl: `https://www.youtube.com/watch?v=${yt.id}`,
    youtubeVideoId: yt.id,
    isPopular: true,
  });

  const executeSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setSongResults([]);
      setYoutubeResults([]);
      setArtistResults([]);
      setAlbumResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    addSearchHistory(trimmed);

    try {
      const [songs, ytTracks, artists, albums] = await Promise.all([
        musicProvider.searchSongs(trimmed),
        searchYouTubeMusic(trimmed),
        musicProvider.searchArtists(trimmed),
        musicProvider.searchAlbums(trimmed),
      ]);

      setSongResults(songs);
      setYoutubeResults(ytTracks);
      setArtistResults(artists);
      setAlbumResults(albums);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setSongResults([]);
      setYoutubeResults([]);
      setArtistResults([]);
      setAlbumResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(query);
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  const handleSelectSearchTerm = (term: string) => {
    setQuery(term);
  };

  const hasResults =
    songResults.length > 0 ||
    youtubeResults.length > 0 ||
    artistResults.length > 0 ||
    albumResults.length > 0;

  return (
    <div id="c-town-search-page" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Search Bar & Direct YouTube / Offline Quick Controls */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="online-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search YouTube full songs, artists, albums, or paste YouTube link..."
            autoFocus
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-base focus:outline-none focus:border-[#1ed760] text-white placeholder-slate-500 shadow-xl transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* YouTube Search Direct Action Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">YouTube Full Song Search</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                  Full Length • No Cuts
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {query
                  ? `Search YouTube directly for "${query}" and play official full song videos`
                  : 'Play 100% full original songs by your favorite artists with official videos'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setActiveCategory('youtube');
                if (!query) setQuery('Arijit Singh Kesariya');
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Search YouTube Music</span>
            </button>
            <button
              onClick={() => openInAppPlayer({ platform: 'youtube', query: query || 'Top Music Hits' })}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Open Player</span>
            </button>
          </div>
        </div>

        {/* 30-Minute Offline Pack Quick Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#1ed760] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">30-Minute Offline Music Pack</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#1ed760] font-bold border border-emerald-500/30">
                  {totalOfflineMinutes} mins downloaded
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Download top popular hits for seamless offline listening with no internet required.
              </p>
            </div>
          </div>
          <button
            onClick={() => download30MinPack()}
            disabled={isDownloadingPack}
            className="px-4 py-2 rounded-xl bg-[#1ed760] hover:bg-[#1fdf64] active:scale-95 text-black text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {isDownloadingPack ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>
                  Downloading {downloadPackProgress ? `${downloadPackProgress.current}/${downloadPackProgress.total}` : '...'}
                </span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download 30-Min Pack</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-[#1ed760] text-black font-bold shadow-md shadow-[#1ed760]/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          All Results
        </button>
        <button
          onClick={() => setActiveCategory('youtube')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'youtube'
              ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20'
              : 'bg-white/5 hover:bg-white/10 text-red-300'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>YouTube Full Songs ({youtubeResults.length > 0 ? youtubeResults.length : VERIFIED_YOUTUBE_TRACKS.length})</span>
        </button>
        <button
          onClick={() => setActiveCategory('songs')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'songs'
              ? 'bg-[#1ed760] text-black font-bold'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          Songs ({songResults.length})
        </button>
        <button
          onClick={() => setActiveCategory('artists')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'artists'
              ? 'bg-[#1ed760] text-black font-bold'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          Artists ({artistResults.length})
        </button>
        <button
          onClick={() => setActiveCategory('albums')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'albums'
              ? 'bg-[#1ed760] text-black font-bold'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          Albums ({albumResults.length})
        </button>
        <button
          onClick={() => setActiveCategory('offline')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'offline'
              ? 'bg-teal-500 text-black font-bold'
              : 'bg-white/5 hover:bg-white/10 text-teal-300'
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline ({downloadedTracks.length})</span>
        </button>
      </div>

      {/* Loading Skeleton Indicator */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 text-[#1ed760] animate-spin" />
          <span className="text-xs">Searching YouTube full songs &amp; C-Town catalog...</span>
        </div>
      )}

      {/* Empty query state: Verified YouTube Full Tracks + Recent Searches + Trending */}
      {!query && activeCategory !== 'offline' && (
        <div className="space-y-8 animate-fade-in">
          {/* Trending Official Full Songs on YouTube */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Tv className="w-4 h-4 text-red-500" />
                <span>Trending Full Songs on YouTube</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  Full Song Verified
                </span>
              </div>
              <button
                onClick={() => openInAppPlayer({ platform: 'youtube', query: 'Top Billboard Music Hits' })}
                className="text-xs text-red-400 hover:underline flex items-center gap-1"
              >
                <span>Browse All on YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VERIFIED_YOUTUBE_TRACKS.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 group transition-all"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-md">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{item.channelTitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                        Full Track
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.durationText || '3:30'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() =>
                        openInAppPlayer({
                          platform: 'youtube',
                          query: item.id,
                          title: item.title,
                          artist: item.channelTitle,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold transition-all shadow flex items-center gap-1"
                      title="Play full authentic song via YouTube"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play</span>
                    </button>
                    <button
                      onClick={() => downloadTrack(convertYouTubeResultToTrack(item))}
                      className={`p-1 rounded-lg text-[11px] transition-colors flex items-center justify-center ${
                        isDownloaded('yt-' + item.id)
                          ? 'text-[#1ed760]'
                          : 'text-slate-400 hover:text-white bg-white/5'
                      }`}
                      title={isDownloaded('yt-' + item.id) ? 'Downloaded offline' : 'Download for offline play'}
                    >
                      {isDownloaded('yt-' + item.id) ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <History className="w-4 h-4 text-[#1ed760]" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearSearchHistory}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Clear History
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item) => (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 transition-all cursor-pointer group"
                    onClick={() => handleSelectSearchTerm(item.query)}
                  >
                    <span>{item.query}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearchHistoryItem(item.id);
                      }}
                      className="text-slate-500 hover:text-white p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Trending on C-TOWN</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSearchTerm(term)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 text-xs text-slate-300 transition-all"
                >
                  #{idx + 1} {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OFFLINE TAB CONTENT */}
      {activeCategory === 'offline' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-teal-400" />
                <span>Downloaded Offline Tracks ({downloadedTracks.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Total duration: {totalOfflineMinutes} minutes of offline audio ready to play without internet.
              </p>
            </div>
            <button
              onClick={() => download30MinPack()}
              disabled={isDownloadingPack}
              className="px-4 py-2 rounded-xl bg-[#1ed760] hover:bg-[#1fdf64] active:scale-95 text-black text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingPack ? 'Downloading Pack...' : 'Download 30-Min Pack'}</span>
            </button>
          </div>

          {downloadedTracks.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Download className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No offline songs downloaded yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tap the download button next to any popular song or click "Download 30-Min Pack" to get 30+ minutes of offline playback immediately.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {downloadedTracks.map((track, idx) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlistContext={downloadedTracks}
                  showIndex={idx}
                  layout="row"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {!isLoading && query && hasResults && activeCategory !== 'offline' && (
        <div className="space-y-8">
          {/* YOUTUBE FULL SONGS RESULTS */}
          {(activeCategory === 'all' || activeCategory === 'youtube') && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-red-500" />
                  <span>YouTube Full Songs ({youtubeResults.length})</span>
                </h3>
                <span className="text-xs text-red-400">100% Full Length</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {youtubeResults.map((ytItem) => (
                  <div
                    key={ytItem.id}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 group transition-all"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-md">
                      <img
                        src={ytItem.thumbnailUrl}
                        alt={ytItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs sm:text-sm font-bold text-white truncate">{ytItem.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{ytItem.channelTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                          YouTube Full
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ytItem.durationText || '3:30'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() =>
                          openInAppPlayer({
                            platform: 'youtube',
                            query: ytItem.id,
                            title: ytItem.title,
                            artist: ytItem.channelTitle,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold transition-all shadow flex items-center gap-1"
                        title="Play Full Song on YouTube"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play</span>
                      </button>
                      <button
                        onClick={() => downloadTrack(convertYouTubeResultToTrack(ytItem))}
                        className={`p-1 rounded-lg text-[11px] transition-colors flex items-center justify-center ${
                          isDownloaded('yt-' + ytItem.id)
                            ? 'text-[#1ed760]'
                            : 'text-slate-400 hover:text-white bg-white/5'
                        }`}
                        title={isDownloaded('yt-' + ytItem.id) ? 'Downloaded' : 'Download for offline play'}
                      >
                        {isDownloaded('yt-' + ytItem.id) ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SONGS */}
          {(activeCategory === 'all' || activeCategory === 'songs') && songResults.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Music2 className="w-5 h-5 text-[#1ed760]" />
                <span>Catalog Songs ({songResults.length})</span>
              </h3>

              <div className="space-y-1">
                {songResults.slice(0, activeCategory === 'all' ? 6 : 25).map((track, idx) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    playlistContext={songResults}
                    showIndex={idx}
                    layout="row"
                  />
                ))}
              </div>
            </div>
          )}

          {/* ARTISTS */}
          {(activeCategory === 'all' || activeCategory === 'artists') && artistResults.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <span>Artists</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {artistResults.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}

          {/* ALBUMS */}
          {(activeCategory === 'all' || activeCategory === 'albums') && albumResults.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Disc className="w-5 h-5 text-[#1ed760]" />
                <span>Albums</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {albumResults.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results state */}
      {!isLoading && query && !hasResults && activeCategory !== 'offline' && (
        <div className="py-16 text-center space-y-4">
          <Music2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No direct previews found for "{query}"</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You can search YouTube directly for "{query}" to stream the authentic full video with zero cuts.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => openInAppPlayer({ platform: 'youtube', query })}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Tv className="w-4 h-4" />
              <span>Search YouTube for "{query}"</span>
            </button>
            <button
              onClick={() => openCrossPlatformFinder({ query })}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
            >
              Universal Finder (Spotify, Apple)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

