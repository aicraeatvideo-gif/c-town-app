import { Track, Artist, Album, LyricsData, MusicProviderInterface } from '../types/music';
import { CURATED_TRACKS, ARTISTS_CATALOG, ALBUMS_CATALOG } from '../data/catalog';

interface ITunesTrackResult {
  trackId: number;
  trackName: string;
  artistName: string;
  artistId?: number;
  collectionName?: string;
  collectionId?: number;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  releaseDate?: string;
  trackViewUrl?: string;
}

export class OnlineMusicProvider implements MusicProviderInterface {
  name = 'C-Town Universal Licensed Provider';

  async searchSongs(query: string): Promise<Track[]> {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    // Filter curated catalog first
    const localMatches = CURATED_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(cleanQuery) ||
        t.artist.toLowerCase().includes(cleanQuery) ||
        t.album.toLowerCase().includes(cleanQuery) ||
        t.genre.toLowerCase().includes(cleanQuery)
    );

    try {
      // Connect to online authorized music preview index (Apple / iTunes Search API)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const onlineTracks: Track[] = (data.results || [])
          .filter((item: ITunesTrackResult) => item.trackName && item.previewUrl)
          .map((item: ITunesTrackResult) => {
            // High-res cover replacement
            const highResArtwork = item.artworkUrl100
              ? item.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg')
              : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800';

            // Pick a mood color based on genre
            let color = 'teal';
            const genre = item.primaryGenreName?.toLowerCase() || '';
            if (genre.includes('pop') || genre.includes('dance')) color = 'rose';
            else if (genre.includes('rock') || genre.includes('metal')) color = 'red';
            else if (genre.includes('hip-hop') || genre.includes('rap')) color = 'amber';
            else if (genre.includes('r&b') || genre.includes('soul')) color = 'purple';
            else if (genre.includes('electronic') || genre.includes('house')) color = 'indigo';
            else if (genre.includes('acoustic') || genre.includes('folk')) color = 'emerald';

            return {
              id: `itunes-${item.trackId}`,
              title: item.trackName,
              artist: item.artistName,
              artistId: item.artistId ? `art-itunes-${item.artistId}` : undefined,
              album: item.collectionName || item.trackName,
              albumId: item.collectionId ? `alb-itunes-${item.collectionId}` : undefined,
              artworkUrl: highResArtwork,
              audioUrl: item.previewUrl || '',
              duration: item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 30,
              genre: item.primaryGenreName || 'Music',
              releaseYear: item.releaseDate ? new Date(item.releaseDate).getFullYear() : 2024,
              dominantColor: color,
              previewAvailable: !!item.previewUrl,
              originalServiceUrl: item.trackViewUrl,
              syncedLyrics: [
                { time: 0, text: `♪ ${item.trackName} - ${item.artistName} ♪` },
                { time: 5, text: 'Authorized preview stream via C-Town Provider' },
                { time: 12, text: 'Stream full track directly on your preferred service' },
                { time: 20, text: 'Use the Cross-Platform Finder to open in Spotify, Apple Music & more' },
              ],
            };
          });

        // Combine deduplicating by title + artist
        const existingKeys = new Set(localMatches.map((t) => `${t.title.toLowerCase()}_${t.artist.toLowerCase()}`));
        const dedupedOnline = onlineTracks.filter(
          (t) => !existingKeys.has(`${t.title.toLowerCase()}_${t.artist.toLowerCase()}`)
        );

        return [...localMatches, ...dedupedOnline];
      }
    } catch (err) {
      console.warn('Online search fetch notice, falling back to curated local catalog:', err);
    }

    return localMatches;
  }

  async searchArtists(query: string): Promise<Artist[]> {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    const localArtists = ARTISTS_CATALOG.filter(
      (a) => a.name.toLowerCase().includes(clean) || a.genres.some((g) => g.toLowerCase().includes(clean))
    );

    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicArtist&limit=8`
      );
      if (res.ok) {
        const data = await res.json();
        const onlineArtists: Artist[] = (data.results || []).map((item: any) => ({
          id: `art-online-${item.artistId}`,
          name: item.artistName,
          imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
          genres: item.primaryGenreName ? [item.primaryGenreName] : ['Artist'],
          monthlyListeners: Math.floor(Math.random() * 2000000) + 500000,
          verified: true,
        }));

        const existingNames = new Set(localArtists.map((a) => a.name.toLowerCase()));
        const unique = onlineArtists.filter((a) => !existingNames.has(a.name.toLowerCase()));
        return [...localArtists, ...unique];
      }
    } catch (err) {
      console.warn('Online artist search notice:', err);
    }

    return localArtists;
  }

  async searchAlbums(query: string): Promise<Album[]> {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    const localAlbums = ALBUMS_CATALOG.filter(
      (alb) => alb.title.toLowerCase().includes(clean) || alb.artist.toLowerCase().includes(clean)
    );

    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=8`
      );
      if (res.ok) {
        const data = await res.json();
        const onlineAlbums: Album[] = (data.results || []).map((item: any) => ({
          id: `alb-online-${item.collectionId}`,
          title: item.collectionName,
          artist: item.artistName,
          artistId: `art-online-${item.artistId}`,
          artworkUrl: item.artworkUrl100
            ? item.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg')
            : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
          releaseDate: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : '2023',
          tracksCount: item.trackCount || 10,
          genre: item.primaryGenreName || 'Album',
        }));

        const existingTitles = new Set(localAlbums.map((a) => a.title.toLowerCase()));
        const unique = onlineAlbums.filter((a) => !existingTitles.has(a.title.toLowerCase()));
        return [...localAlbums, ...unique];
      }
    } catch (err) {
      console.warn('Online album search notice:', err);
    }

    return localAlbums;
  }

  async getRecommendations(genres: string[], artistIds: string[] = []): Promise<Track[]> {
    if (genres.length === 0 && artistIds.length === 0) {
      return CURATED_TRACKS;
    }

    const genreLower = genres.map((g) => g.toLowerCase());
    const matched = CURATED_TRACKS.filter((t) => {
      const genreMatch = genreLower.some((g) => t.genre.toLowerCase().includes(g));
      const artistMatch = t.artistId && artistIds.includes(t.artistId);
      return genreMatch || artistMatch;
    });

    if (matched.length > 0) {
      return matched;
    }

    return CURATED_TRACKS;
  }

  async getSong(id: string): Promise<Track | null> {
    const local = CURATED_TRACKS.find((t) => t.id === id);
    if (local) return local;
    return null;
  }

  async getArtist(id: string): Promise<Artist | null> {
    const local = ARTISTS_CATALOG.find((a) => a.id === id);
    if (local) return local;
    return null;
  }

  async getAlbum(id: string): Promise<Album | null> {
    const local = ALBUMS_CATALOG.find((alb) => alb.id === id);
    if (local) return local;
    return null;
  }

  async getLyrics(trackId: string): Promise<LyricsData | null> {
    const track = CURATED_TRACKS.find((t) => t.id === trackId);
    if (track && track.syncedLyrics && track.syncedLyrics.length > 0) {
      return {
        trackId,
        title: track.title,
        artist: track.artist,
        synced: true,
        lines: track.syncedLyrics,
      };
    }

    // Default fallback lyrics placeholder for online preview tracks
    return {
      trackId,
      title: track?.title || 'Unknown Track',
      artist: track?.artist || 'Artist',
      synced: true,
      lines: [
        { time: 0, text: '♪ (Audio Playback) ♪' },
        { time: 4, text: 'Lyrics synchronized for C-TOWN platform' },
        { time: 10, text: 'Enjoy the high-fidelity soundscape' },
        { time: 18, text: 'Check out the artist profile for full tour dates and lyrics' },
      ],
    };
  }
}

export const musicProvider = new OnlineMusicProvider();
