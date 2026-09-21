export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artistLogoUrl?: string; // Artist official logo / avatar photo displayed on their own music
  language?: string; // e.g. Hindi, English, Nepali, Punjabi, Korean, Spanish
  isPopular?: boolean; // Mark as certified popular hit
  streamsCount?: string; // e.g. "1.2B streams"
  album: string;
  albumId?: string;
  artworkUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
  releaseYear?: number;
  isExplicit?: boolean;
  plays?: number;
  previewAvailable?: boolean;
  dominantColor?: string; // hex or rgb
  lyrics?: string;
  syncedLyrics?: SyncedLyricLine[];
  originalServiceUrl?: string; // e.g. iTunes / Deezer / YouTube
  youtubeVideoId?: string; // Direct YouTube video ID for 100% full song playback
  isDownloaded?: boolean; // Available offline
  offlineBlobUrl?: string; // Cached blob URL for offline play
}

export interface YouTubeSearchResult {
  id: string; // YouTube Video ID
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  durationText?: string;
  viewsText?: string;
  publishedText?: string;
}

export interface SyncedLyricLine {
  time: number; // seconds
  text: string;
}

export interface LyricsData {
  trackId: string;
  title: string;
  artist: string;
  synced: boolean;
  lines: SyncedLyricLine[];
  plainLyrics?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  bio?: string;
  monthlyListeners?: number;
  verified?: boolean;
  topTracks?: Track[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  artworkUrl: string;
  releaseDate: string;
  tracksCount: number;
  tracks?: Track[];
  genre?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  createdDate: string;
  isCustom?: boolean;
  tracks: Track[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  avatarUrl: string;
  favoriteGenres: string[];
  favoriteArtistIds: string[];
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  audioQuality: 'normal' | 'high' | 'lossless';
  crossfadeSeconds: number;
  normalizeVolume: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  type?: 'song' | 'artist' | 'album' | 'all';
}

export interface ColorTheme {
  primary: string;
  accent: string;
  glow: string;
  gradient: string;
  name: string;
}

export interface MusicProviderInterface {
  name: string;
  searchSongs(query: string): Promise<Track[]>;
  searchArtists(query: string): Promise<Artist[]>;
  searchAlbums(query: string): Promise<Album[]>;
  getRecommendations(genres: string[], artistIds?: string[]): Promise<Track[]>;
  getSong(id: string): Promise<Track | null>;
  getArtist(id: string): Promise<Artist | null>;
  getAlbum(id: string): Promise<Album | null>;
  getLyrics(trackId: string): Promise<LyricsData | null>;
}

export interface InAppPlayerState {
  isOpen: boolean;
  isMinimized: boolean;
  platform: 'youtube' | 'spotify' | 'soundcloud' | 'applemusic' | 'radio' | 'custom';
  query: string;
  title?: string;
  artist?: string;
  directUrl?: string;
  videoId?: string;
}
