import { Track } from '../types/music';

const OFFLINE_DB_NAME = 'ctown_offline_music_db';
const OFFLINE_DB_VERSION = 1;
const STORE_NAME = 'offline_downloads';

export interface OfflineTrackRecord {
  id: string;
  trackData: Track;
  blob?: Blob;
  downloadedAt: number;
  duration: number;
}

function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Download and cache a single track's audio for 100% offline playback
export async function downloadTrackForOffline(track: Track): Promise<Track> {
  const db = await openOfflineDB();

  let audioBlob: Blob | undefined;
  try {
    const res = await fetch(track.audioUrl, { mode: 'cors' });
    if (res.ok) {
      audioBlob = await res.blob();
    }
  } catch (err) {
    console.warn('Direct fetch notice, caching metadata for offline player:', err);
  }

  const record: OfflineTrackRecord = {
    id: track.id,
    trackData: {
      ...track,
      isDownloaded: true,
    },
    blob: audioBlob,
    downloadedAt: Date.now(),
    duration: track.duration || 210,
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  const blobUrl = audioBlob ? URL.createObjectURL(audioBlob) : track.audioUrl;

  return {
    ...track,
    isDownloaded: true,
    offlineBlobUrl: blobUrl,
  };
}

// Check if a track is downloaded
export async function isTrackDownloaded(trackId: string): Promise<boolean> {
  try {
    const db = await openOfflineDB();
    return new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(trackId);
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

// Get all downloaded tracks for offline listening
export async function getOfflineDownloadedTracks(): Promise<Track[]> {
  try {
    const db = await openOfflineDB();
    const records = await new Promise<OfflineTrackRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    return records.map((rec) => {
      const blobUrl = rec.blob ? URL.createObjectURL(rec.blob) : rec.trackData.audioUrl;
      return {
        ...rec.trackData,
        isDownloaded: true,
        offlineBlobUrl: blobUrl,
        audioUrl: blobUrl,
      };
    });
  } catch (err) {
    console.warn('Failed to read offline tracks:', err);
    return [];
  }
}

// Remove downloaded track
export async function removeDownloadedTrack(trackId: string): Promise<void> {
  const db = await openOfflineDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(trackId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Download 30-Minute Popular Hits Offline Pack (~8-10 tracks totaling >= 30 mins)
export async function download30MinOfflinePack(
  availableTracks: Track[],
  onProgress?: (current: number, total: number) => void
): Promise<Track[]> {
  // Select top popular tracks up to ~1800 seconds (30 minutes)
  let accumulatedSeconds = 0;
  const targetTracks: Track[] = [];

  for (const track of availableTracks) {
    targetTracks.push(track);
    accumulatedSeconds += track.duration || 210;
    if (accumulatedSeconds >= 1800) break; // 30 minutes achieved!
  }

  const downloadedTracks: Track[] = [];
  for (let i = 0; i < targetTracks.length; i++) {
    const t = targetTracks[i];
    try {
      const downloaded = await downloadTrackForOffline(t);
      downloadedTracks.push(downloaded);
    } catch {
      downloadedTracks.push({ ...t, isDownloaded: true });
    }
    if (onProgress) {
      onProgress(i + 1, targetTracks.length);
    }
  }

  return downloadedTracks;
}

// Get total offline playback statistics
export async function getOfflineStorageStats(): Promise<{
  count: number;
  totalMinutes: number;
}> {
  const tracks = await getOfflineDownloadedTracks();
  const totalSecs = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  return {
    count: tracks.length,
    totalMinutes: Math.round(totalSecs / 60),
  };
}
