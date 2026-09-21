// IndexedDB helper for storing full-length audio files without truncation or size restrictions
import { Track } from '../types/music';

const DB_NAME = 'ctown_music_storage';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_tracks';

export interface StoredAudioRecord {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  blob: Blob;
  mimeType: string;
  fileName: string;
  fileSize: number;
  createdAt: number;
}

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

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

// Extract true full duration using HTMLAudioElement
export function getAudioFileDuration(file: Blob): Promise<number> {
  return new Promise((resolve) => {
    const tempUrl = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = tempUrl;

    const cleanup = () => {
      URL.revokeObjectURL(tempUrl);
    };

    audio.onloadedmetadata = () => {
      const dur = audio.duration;
      cleanup();
      if (dur && !isNaN(dur) && dur !== Infinity && dur > 0) {
        resolve(Math.round(dur));
      } else {
        resolve(210); // fallback default
      }
    };

    audio.onerror = () => {
      cleanup();
      resolve(210);
    };

    // Timeout safety
    setTimeout(() => {
      cleanup();
      resolve(210);
    }, 4000);
  });
}

// Save a full audio file into IndexedDB
export async function saveAudioFile(file: File): Promise<Track> {
  const db = await openDB();
  const cleanName = file.name.replace(/\.[^/.]+$/, '');
  let title = cleanName;
  let artist = 'Local Artist';

  if (cleanName.includes(' - ')) {
    const parts = cleanName.split(' - ');
    artist = parts[0].trim();
    title = parts.slice(1).join(' - ').trim();
  }

  const duration = await getAudioFileDuration(file);
  const id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const record: StoredAudioRecord = {
    id,
    title,
    artist,
    album: 'Uploaded Music',
    genre: 'My Music',
    duration,
    blob: file,
    mimeType: file.type || 'audio/mpeg',
    fileName: file.name,
    fileSize: file.size,
    createdAt: Date.now(),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  const blobUrl = URL.createObjectURL(file);

  return {
    id,
    title,
    artist,
    album: 'Uploaded Music',
    artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: blobUrl,
    duration,
    genre: 'My Music',
    releaseYear: new Date().getFullYear(),
    dominantColor: '#1ed760',
    previewAvailable: true,
  };
}

// Load all saved audio files from IndexedDB
export async function loadAllSavedAudio(): Promise<Track[]> {
  try {
    const db = await openDB();
    const records = await new Promise<StoredAudioRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    const covers = [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    ];

    return records.map((rec, index) => {
      const blobUrl = URL.createObjectURL(rec.blob);
      return {
        id: rec.id,
        title: rec.title,
        artist: rec.artist,
        album: rec.album || 'Uploaded Music',
        artworkUrl: covers[index % covers.length],
        audioUrl: blobUrl,
        duration: rec.duration,
        genre: rec.genre || 'My Music',
        releaseYear: new Date(rec.createdAt).getFullYear(),
        dominantColor: '#1ed760',
        previewAvailable: true,
      };
    });
  } catch (err) {
    console.warn('Failed to load saved audio from IndexedDB:', err);
    return [];
  }
}

// Delete an audio record
export async function deleteSavedAudio(id: string): Promise<void> {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
