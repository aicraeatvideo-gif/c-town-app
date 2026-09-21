import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Track, Playlist, UserProfile, SearchHistoryItem, ColorTheme, Artist, Album, InAppPlayerState } from '../types/music';
import { CURATED_TRACKS, INITIAL_PLAYLISTS, ARTISTS_CATALOG, ALBUMS_CATALOG } from '../data/catalog';
import { DEFAULT_THEME, getThemeForTrack } from '../utils/colorExtractor';
import { saveAudioFile, loadAllSavedAudio, deleteSavedAudio } from '../utils/audioStorage';
import {
  downloadTrackForOffline,
  getOfflineDownloadedTracks,
  removeDownloadedTrack,
  download30MinOfflinePack,
  getOfflineStorageStats,
} from '../utils/offlineManager';

interface MusicContextType {
  // Playback
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  repeatMode: 'off' | 'all' | 'one';
  isShuffled: boolean;
  currentTheme: ColorTheme;
  playbackError: string | null;
  
  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  stop: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  seekTo: (seconds: number) => void;
  seekRelative: (deltaSeconds: number) => void;
  setVolumeLevel: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Navigation & Views
  currentView: string;
  viewParams: any;
  navigateTo: (view: string, params?: any) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;

  // User & Auth
  user: UserProfile | null;
  isLoggedIn: boolean;
  loginAsGuest: () => void;
  loginWithEmail: (email: string) => void;
  loginWithPhone: (phone: string) => void;
  registerUser: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  updateUserProfile: (partial: Partial<UserProfile>) => void;

  // Likes, Playlists, Follows
  likedTrackIds: string[];
  likedTracks: Track[];
  toggleLikeTrack: (track: Track) => void;
  isLiked: (trackId: string) => boolean;

  playlists: Playlist[];
  createPlaylist: (title: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, title: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  followedArtistIds: string[];
  toggleFollowArtist: (artistId: string) => void;
  isArtistFollowed: (artistId: string) => boolean;

  recentlyPlayed: Track[];
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  removeSearchHistoryItem: (id: string) => void;

  // Modals & Panels
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'signup' | 'phone' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'phone' | 'forgot') => void;

  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;

  showLyricsModal: boolean;
  setShowLyricsModal: (show: boolean) => void;

  showQueueModal: boolean;
  setShowQueueModal: (show: boolean) => void;

  showCrossPlatformModal: boolean;
  setShowCrossPlatformModal: (show: boolean) => void;
  crossPlatformTarget: { title: string; artist: string; album?: string; query?: string } | null;
  openCrossPlatformFinder: (target: { title?: string; artist?: string; album?: string; query?: string }) => void;

  showDevGuideModal: boolean;
  setShowDevGuideModal: (show: boolean) => void;

  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  shareData: { title: string; subtitle: string; url: string } | null;
  openShareModal: (data: { title: string; subtitle: string; url?: string }) => void;

  // In-App External Media Player (YouTube, Spotify, SoundCloud, etc.)
  inAppPlayer: InAppPlayerState;
  openInAppPlayer: (params: { platform?: 'youtube' | 'spotify' | 'soundcloud' | 'applemusic'; query?: string; title?: string; artist?: string }) => void;
  closeInAppPlayer: () => void;
  toggleMinimizeInAppPlayer: () => void;
  setInAppPlatform: (platform: 'youtube' | 'spotify' | 'soundcloud' | 'applemusic') => void;
  setInAppQuery: (query: string) => void;

  // Local & Uploaded Full Audio Files (IndexedDB)
  uploadedTracks: Track[];
  addUploadedTrackFiles: (files: FileList | File[]) => Promise<Track[]>;
  deleteUploadedTrack: (id: string) => Promise<void>;
  isUploading: boolean;

  // Offline Download & Playback System (30-Minute Pack)
  downloadedTracks: Track[];
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  isOnline: boolean;
  downloadTrack: (track: Track) => Promise<void>;
  removeDownload: (trackId: string) => Promise<void>;
  isDownloaded: (trackId: string) => boolean;
  download30MinPack: () => Promise<void>;
  isDownloadingPack: boolean;
  downloadPackProgress: { current: number; total: number } | null;
  totalOfflineMinutes: number;

  // Direct YouTube Full Song Playback
  playFullSongYouTube: (track: Track) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

const STORAGE_PREFIX = 'ctown_music_';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(CURATED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(CURATED_TRACKS[0].duration || 180);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(CURATED_TRACKS.slice(1));
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // Theme state
  const currentTheme = useMemo(() => {
    return getThemeForTrack(currentTrack?.dominantColor);
  }, [currentTrack]);

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Liked tracks
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}liked_ids`);
      return saved ? JSON.parse(saved) : ['nepali-1', 'nepali-2', 'bolly-1'];
    } catch {
      return ['nepali-1', 'nepali-2', 'bolly-1'];
    }
  });

  // Playlists
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}playlists`);
      return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
    } catch {
      return INITIAL_PLAYLISTS;
    }
  });

  // Followed artists
  const [followedArtistIds, setFollowedArtistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}followed_artists`);
      return saved ? JSON.parse(saved) : ['art-sajjan', 'art-bipul'];
    } catch {
      return ['art-sajjan', 'art-bipul'];
    }
  });

  // Recently played
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([CURATED_TRACKS[0], CURATED_TRACKS[1], CURATED_TRACKS[4]]);

  // Search history
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
    { id: 'sh-1', query: 'Sajjan Raj Vaidya', timestamp: Date.now() - 3600000 },
    { id: 'sh-2', query: 'Arijit Singh', timestamp: Date.now() - 7200000 },
    { id: 'sh-3', query: 'Nepali Hits', timestamp: Date.now() - 14400000 },
  ]);

  // Navigation state
  const [historyStack, setHistoryStack] = useState<Array<{ view: string; params?: any }>>([
    { view: 'home' },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentView = historyStack[historyIndex]?.view || 'home';
  const viewParams = historyStack[historyIndex]?.params || {};

  const navigateTo = (view: string, params?: any) => {
    setHistoryStack((prev) => {
      const nextStack = prev.slice(0, historyIndex + 1);
      return [...nextStack, { view, params }];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyStack.length - 1;

  const goBack = () => {
    if (canGoBack) setHistoryIndex((prev) => prev - 1);
  };

  const goForward = () => {
    if (canGoForward) setHistoryIndex((prev) => prev + 1);
  };

  // Modals
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'phone' | 'forgot'>('login');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showLyricsModal, setShowLyricsModal] = useState<boolean>(false);
  const [showQueueModal, setShowQueueModal] = useState<boolean>(false);
  const [showCrossPlatformModal, setShowCrossPlatformModal] = useState<boolean>(false);
  const [crossPlatformTarget, setCrossPlatformTarget] = useState<{ title: string; artist: string; album?: string; query?: string } | null>(null);
  const [showDevGuideModal, setShowDevGuideModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{ title: string; subtitle: string; url: string } | null>(null);

  // In-App External Media Player State (YouTube, Spotify, SoundCloud, etc.)
  const [inAppPlayer, setInAppPlayer] = useState<InAppPlayerState>({
    isOpen: false,
    isMinimized: false,
    platform: 'youtube',
    query: 'Sajjan Raj Vaidya - Hataar Patar',
    title: 'Hataar Patar',
    artist: 'Sajjan Raj Vaidya',
  });

  const openInAppPlayer = (params: {
    platform?: 'youtube' | 'spotify' | 'soundcloud' | 'applemusic';
    query?: string;
    title?: string;
    artist?: string;
  }) => {
    // Pause internal audio player so external stream doesn't clash with app sound
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    const effectiveQuery =
      params.query ||
      (params.title ? `${params.title} ${params.artist || ''}`.trim() : inAppPlayer.query);

    setInAppPlayer({
      isOpen: true,
      isMinimized: false,
      platform: params.platform || 'youtube',
      query: effectiveQuery,
      title: params.title || effectiveQuery,
      artist: params.artist || '',
    });
  };

  const closeInAppPlayer = () => {
    setInAppPlayer((prev) => ({ ...prev, isOpen: false }));
  };

  const toggleMinimizeInAppPlayer = () => {
    setInAppPlayer((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const setInAppPlatform = (platform: 'youtube' | 'spotify' | 'soundcloud' | 'applemusic') => {
    setInAppPlayer((prev) => ({ ...prev, platform }));
  };

  const setInAppQuery = (query: string) => {
    setInAppPlayer((prev) => ({ ...prev, query }));
  };

  // Uploaded full audio files state (IndexedDB backed)
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    loadAllSavedAudio().then((tracks) => {
      if (tracks && tracks.length > 0) {
        setUploadedTracks(tracks);
      }
    });
  }, []);

  const addUploadedTrackFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    const newItems: Track[] = [];
    try {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        const isAudio =
          file.type.startsWith('audio/') ||
          /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(file.name);
        if (isAudio) {
          const track = await saveAudioFile(file);
          newItems.push(track);
        }
      }
      if (newItems.length > 0) {
        setUploadedTracks((prev) => [...prev, ...newItems]);
      }
      return newItems;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteUploadedTrack = async (id: string) => {
    await deleteSavedAudio(id);
    setUploadedTracks((prev) => prev.filter((t) => t.id !== id));
  };

  // Offline Download & 30-Minute Pack State
  const [downloadedTracks, setDownloadedTracks] = useState<Track[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isDownloadingPack, setIsDownloadingPack] = useState<boolean>(false);
  const [downloadPackProgress, setDownloadPackProgress] = useState<{ current: number; total: number } | null>(null);
  const [totalOfflineMinutes, setTotalOfflineMinutes] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsOfflineMode(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of downloaded tracks
    getOfflineDownloadedTracks().then((tracks) => {
      if (tracks && tracks.length > 0) {
        setDownloadedTracks(tracks);
        const totalSecs = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
        setTotalOfflineMinutes(Math.round(totalSecs / 60));
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineMode = () => {
    setIsOfflineMode((prev) => !prev);
  };

  const downloadTrack = async (track: Track) => {
    try {
      const downloaded = await downloadTrackForOffline(track);
      setDownloadedTracks((prev) => {
        const filtered = prev.filter((t) => t.id !== track.id);
        return [downloaded, ...filtered];
      });
      setTotalOfflineMinutes((prev) => prev + Math.round((track.duration || 210) / 60));
    } catch (e) {
      console.warn('Failed downloading track for offline:', e);
    }
  };

  const removeDownload = async (trackId: string) => {
    try {
      await removeDownloadedTrack(trackId);
      setDownloadedTracks((prev) => {
        const removed = prev.find((t) => t.id === trackId);
        if (removed) {
          setTotalOfflineMinutes((m) => Math.max(0, m - Math.round((removed.duration || 210) / 60)));
        }
        return prev.filter((t) => t.id !== trackId);
      });
    } catch (e) {
      console.warn('Failed removing offline track:', e);
    }
  };

  const isDownloaded = (trackId: string) => {
    return downloadedTracks.some((t) => t.id === trackId);
  };

  const download30MinPack = async () => {
    setIsDownloadingPack(true);
    try {
      const popularTracks = CURATED_TRACKS.filter((t) => t.isPopular);
      const results = await download30MinOfflinePack(popularTracks, (curr, total) => {
        setDownloadPackProgress({ current: curr, total });
      });
      setDownloadedTracks(results);
      const totalSecs = results.reduce((acc, t) => acc + (t.duration || 0), 0);
      setTotalOfflineMinutes(Math.round(totalSecs / 60));
    } catch (e) {
      console.warn('Error downloading 30min pack:', e);
    } finally {
      setIsDownloadingPack(false);
      setDownloadPackProgress(null);
    }
  };

  const playFullSongYouTube = (track: Track) => {
    openInAppPlayer({
      platform: 'youtube',
      query: track.youtubeVideoId || `${track.title} ${track.artist}`,
      title: track.title,
      artist: track.artist,
    });
  };

  // Initialize HTML Audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio && audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (audio && audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        skipNext();
      }
    };

    const handleError = () => {
      console.warn('Audio playback error encountered on current preview URL');
      setPlaybackError('Preview stream unavailable for this track. Use Cross-Platform finder to open in external apps.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Save persistent items
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}liked_ids`, JSON.stringify(likedTrackIds));
    } catch {}
  }, [likedTrackIds]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}playlists`, JSON.stringify(playlists));
    } catch {}
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}followed_artists`, JSON.stringify(followedArtistIds));
    } catch {}
  }, [followedArtistIds]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
      } else {
        localStorage.removeItem(`${STORAGE_PREFIX}user`);
      }
    } catch {}
  }, [user]);

  // Audio Playback methods
  const playTrack = (track: Track, newQueue?: Track[]) => {
    setPlaybackError(null);
    setCurrentTrack(track);
    if (track.duration && track.duration > 0) {
      setDuration(track.duration);
    }

    if (newQueue) {
      setQueue(newQueue.filter((t) => t.id !== track.id));
    }

    // Add to recently played
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      return [track, ...filtered].slice(0, 20);
    });

    // Check if track is available offline (stored blob)
    const offlineMatch = downloadedTracks.find((d) => d.id === track.id);
    const audioSrc =
      track.offlineBlobUrl ||
      (offlineMatch && offlineMatch.offlineBlobUrl) ||
      track.audioUrl;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(true);
        });
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const skipNext = () => {
    if (queue.length === 0) {
      if (repeatMode === 'all' && recentlyPlayed.length > 0) {
        playTrack(recentlyPlayed[recentlyPlayed.length - 1]);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    let nextIndex = 0;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    const nextTrack = queue[nextIndex];
    const newQueue = queue.filter((_, idx) => idx !== nextIndex);
    playTrack(nextTrack, newQueue);
  };

  const skipPrev = () => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    // Previous from recently played
    if (recentlyPlayed.length > 1) {
      const prevTrack = recentlyPlayed[1];
      playTrack(prevTrack);
    } else {
      seekTo(0);
    }
  };

  const seekTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const seekRelative = (deltaSeconds: number) => {
    if (audioRef.current) {
      const target = Math.max(0, Math.min(duration, currentTime + deltaSeconds));
      seekTo(target);
    }
  };

  const setVolumeLevel = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  // User Actions
  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'usr-guest',
      name: 'Music Explorer',
      username: 'ctown_listener',
      email: 'guest@c-town.music',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      favoriteGenres: ['Nepali', 'Lo-fi', 'Bollywood', 'Pop'],
      favoriteArtistIds: ['art-sajjan', 'art-bipul'],
      joinedDate: '2025-01-01',
      followersCount: 14,
      followingCount: 38,
      audioQuality: 'high',
      crossfadeSeconds: 3,
      normalizeVolume: true,
    };
    setUser(guestUser);
    setShowAuthModal(false);
  };

  const loginWithEmail = (email: string) => {
    const defaultUser: UserProfile = {
      id: 'usr-' + Date.now().toString(36),
      name: email.split('@')[0] || 'C-Town Listener',
      username: (email.split('@')[0] || 'ctown_user').toLowerCase(),
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      favoriteGenres: ['Nepali', 'Pop', 'Hip-Hop', 'Electronic'],
      favoriteArtistIds: ['art-sajjan', 'art-arijit'],
      joinedDate: new Date().toISOString().split('T')[0],
      followersCount: 4,
      followingCount: 12,
      audioQuality: 'high',
      crossfadeSeconds: 4,
      normalizeVolume: true,
    };
    setUser(defaultUser);
    setShowAuthModal(false);
  };

  const loginWithPhone = (phone: string) => {
    const defaultUser: UserProfile = {
      id: 'usr-phone-' + Date.now().toString(36),
      name: 'C-Town Verified Member',
      username: 'user_' + phone.replace(/\D/g, '').slice(-4),
      email: `${phone.replace(/\D/g, '')}@mobile.ctown.music`,
      phone,
      phoneVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      favoriteGenres: ['Nepali', 'Bollywood', 'R&B'],
      favoriteArtistIds: ['art-sushant', 'art-prateek'],
      joinedDate: new Date().toISOString().split('T')[0],
      followersCount: 0,
      followingCount: 6,
      audioQuality: 'high',
      crossfadeSeconds: 2,
      normalizeVolume: true,
    };
    setUser(defaultUser);
    setShowAuthModal(false);
  };

  const registerUser = (details: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now().toString(36),
      name: details.name || 'New Listener',
      username: details.username || 'listener_' + Math.floor(Math.random() * 1000),
      email: details.email || 'user@ctown.music',
      phone: details.phone,
      phoneVerified: details.phoneVerified ?? (!!details.phone),
      avatarUrl: details.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      favoriteGenres: details.favoriteGenres || [],
      favoriteArtistIds: details.favoriteArtistIds || [],
      joinedDate: new Date().toISOString().split('T')[0],
      followersCount: 0,
      followingCount: 0,
      audioQuality: 'high',
      crossfadeSeconds: 3,
      normalizeVolume: true,
    };
    setUser(newUser);
    setShowAuthModal(false);
    setShowOnboardingModal(true); // Guide directly into artist selection!
  };

  const logout = () => {
    setUser(null);
    navigateTo('home');
  };

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  // Likes
  const toggleLikeTrack = (track: Track) => {
    setLikedTrackIds((prev) => {
      if (prev.includes(track.id)) {
        return prev.filter((id) => id !== track.id);
      } else {
        return [...prev, track.id];
      }
    });
  };

  const isLiked = (trackId: string) => likedTrackIds.includes(trackId);

  const likedTracks = useMemo(() => {
    const all = [...CURATED_TRACKS, ...(recentlyPlayed || [])];
    const map = new Map<string, Track>();
    all.forEach((t) => map.set(t.id, t));
    return likedTrackIds.map((id) => map.get(id)).filter(Boolean) as Track[];
  }, [likedTrackIds, recentlyPlayed]);

  // Playlists
  const createPlaylist = (title: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: 'pl-custom-' + Date.now().toString(36),
      title: title.trim() || 'New C-Town Playlist',
      description: description || 'Created by ' + (user?.name || 'Listener'),
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      createdDate: new Date().toISOString().split('T')[0],
      isCustom: true,
      tracks: [],
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    if (currentView === 'playlist' && viewParams?.playlistId === id) {
      navigateTo('library');
    }
  };

  const renamePlaylist = (id: string, title: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: title.trim() } : p))
    );
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          const exists = p.tracks.some((t) => t.id === track.id);
          if (!exists) {
            return { ...p, tracks: [...p.tracks, track] };
          }
        }
        return p;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) };
        }
        return p;
      })
    );
  };

  // Follows
  const toggleFollowArtist = (artistId: string) => {
    setFollowedArtistIds((prev) => {
      if (prev.includes(artistId)) {
        return prev.filter((id) => id !== artistId);
      } else {
        return [...prev, artistId];
      }
    });
  };

  const isArtistFollowed = (artistId: string) => followedArtistIds.includes(artistId);

  // Search history
  const addSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());
      return [
        { id: 'sh-' + Date.now().toString(36), query: trimmed, timestamp: Date.now() },
        ...filtered,
      ].slice(0, 15);
    });
  };

  const clearSearchHistory = () => setSearchHistory([]);

  const removeSearchHistoryItem = (id: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Cross-Platform Finder Trigger
  const openCrossPlatformFinder = (target: { title?: string; artist?: string; album?: string; query?: string }) => {
    setCrossPlatformTarget({
      title: target.title || '',
      artist: target.artist || '',
      album: target.album,
      query: target.query,
    });
    setShowCrossPlatformModal(true);
  };

  const openShareModal = (data: { title: string; subtitle: string; url?: string }) => {
    setShareData({
      title: data.title,
      subtitle: data.subtitle,
      url: data.url || window.location.href,
    });
    setShowShareModal(true);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        progress,
        volume,
        isMuted,
        queue,
        repeatMode,
        isShuffled,
        currentTheme,
        playbackError,

        playTrack,
        togglePlayPause,
        stop,
        skipNext,
        skipPrev,
        seekTo,
        seekRelative,
        setVolumeLevel,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        addToQueue,
        removeFromQueue,
        clearQueue,

        currentView,
        viewParams,
        navigateTo,
        canGoBack,
        canGoForward,
        goBack,
        goForward,

        user,
        isLoggedIn: !!user,
        loginAsGuest,
        loginWithEmail,
        loginWithPhone,
        registerUser,
        logout,
        updateUserProfile,

        likedTrackIds,
        likedTracks,
        toggleLikeTrack,
        isLiked,

        playlists,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,

        followedArtistIds,
        toggleFollowArtist,
        isArtistFollowed,

        recentlyPlayed,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        removeSearchHistoryItem,

        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,

        showOnboardingModal,
        setShowOnboardingModal,

        showLyricsModal,
        setShowLyricsModal,

        showQueueModal,
        setShowQueueModal,

        showCrossPlatformModal,
        setShowCrossPlatformModal,
        crossPlatformTarget,
        openCrossPlatformFinder,

        showDevGuideModal,
        setShowDevGuideModal,

        showShareModal,
        setShowShareModal,
        shareData,
        openShareModal,

        inAppPlayer,
        openInAppPlayer,
        closeInAppPlayer,
        toggleMinimizeInAppPlayer,
        setInAppPlatform,
        setInAppQuery,

        uploadedTracks,
        addUploadedTrackFiles,
        deleteUploadedTrack,
        isUploading,

        // Offline and Downloads
        downloadedTracks,
        isOfflineMode,
        toggleOfflineMode,
        isOnline,
        downloadTrack,
        removeDownload,
        isDownloaded,
        download30MinPack,
        isDownloadingPack,
        downloadPackProgress,
        totalOfflineMinutes,

        // Direct YouTube Full Song Playback
        playFullSongYouTube,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
