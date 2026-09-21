import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  X,
  Database,
  Key,
  Server,
  Cloud,
  Code2,
  Copy,
  Check,
  Compass,
  FileCode,
  Terminal,
  Laptop,
  Download,
  FolderDown,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';

export const DevSpecsModal: React.FC = () => {
  const { showDevGuideModal, setShowDevGuideModal } = useMusic();
  const [activeTab, setActiveTab] = useState<'run_locally' | 'architecture' | 'database' | 'apis' | 'deployment'>('run_locally');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!showDevGuideModal) return null;

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const localRunScript = `# Quick Setup: Run C-TOWN Locally on your computer

# 1. Download or clone this repository
# (Use Settings > Export to GitHub or Download ZIP in AI Studio)
git clone https://github.com/your-username/c-town-music.git
cd c-town-music

# 2. Install all dependencies (Node 18+ required)
npm install

# 3. Launch local Vite development server
npm run dev

# 4. Open your browser:
# http://localhost:3000`;

  const localBuildScript = `# Production Build & Local Preview
npm run build
npm run start`;

  const postgresSchema = `-- C-TOWN PostgreSQL / Supabase Schema

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  name VARCHAR(150) NOT NULL,
  handle VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  favorite_genres TEXT[] DEFAULT '{}',
  membership_tier VARCHAR(50) DEFAULT 'Premium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  track_id VARCHAR(100) NOT NULL,
  track_data JSONB NOT NULL,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id VARCHAR(100) NOT NULL,
  track_data JSONB NOT NULL,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, track_id)
);

CREATE TABLE listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id VARCHAR(100) NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_seconds INTEGER DEFAULT 0
);`;

  const envExample = `# C-TOWN Streaming Platform Environment Setup
NODE_ENV=production
PORT=3000

# Connected Music API (Spotify API / Apple Music Kit / Deezer)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
APPLE_MUSIC_DEVELOPER_TOKEN=your_apple_music_token_here

# Cloud Database (Supabase / Cloud SQL / Firebase)
DATABASE_URL=postgresql://user:password@host:5432/c_town_db
FIREBASE_PROJECT_ID=c-town-music-prod`;

  return (
    <div
      id="c-town-dev-specs-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-white select-none animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-[#0e1117] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold">C-TOWN Backend &amp; Architecture Specs</h3>
              <p className="text-xs text-slate-400">Database schemas, music provider interfaces &amp; deployment guide</p>
            </div>
          </div>

          <button
            onClick={() => setShowDevGuideModal(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-white/5 bg-white/[0.01] overflow-x-auto">
          <button
            onClick={() => setActiveTab('run_locally')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'run_locally'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Run Locally</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            PostgreSQL / Cloud SQL Schema
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'apis'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Music Provider API Interface
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'deployment'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Environment &amp; Deploy
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 flex-1">
          {activeTab === 'run_locally' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Run C-TOWN on Your Local Machine</h4>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Fast Vite development server with hot reload on port 3000
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyCode(localRunScript, 'run_cmd')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07080a] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  {copiedKey === 'run_cmd' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'run_cmd' ? 'Commands Copied!' : 'Copy Setup Script'}</span>
                </button>
              </div>

              {/* Step by step */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <span className="font-mono text-emerald-400 text-[11px] font-bold">STEP 01</span>
                  <h5 className="font-bold text-white text-xs">Download or Clone Code</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Click the <strong>Settings</strong> menu in AI Studio and select <strong>Download ZIP</strong> or <strong>Export to GitHub</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <span className="font-mono text-emerald-400 text-[11px] font-bold">STEP 02</span>
                  <h5 className="font-bold text-white text-xs">Install Dependencies</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ensure Node.js 18+ is installed, open your terminal in the extracted folder, and run <code className="text-emerald-300">npm install</code>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <span className="font-mono text-emerald-400 text-[11px] font-bold">STEP 03</span>
                  <h5 className="font-bold text-white text-xs">Start Local Dev Server</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Run <code className="text-emerald-300">npm run dev</code> and open <code className="text-emerald-300">http://localhost:3000</code> in your browser.
                  </p>
                </div>
              </div>

              {/* Code snippet block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 text-[11px] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Terminal Commands</span>
                  </span>
                  <button
                    onClick={() => copyCode(localRunScript, 'run_cmd')}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 text-[11px]"
                  >
                    {copiedKey === 'run_cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'run_cmd' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-[#090b0e] border border-white/10 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                  {localRunScript}
                </pre>
              </div>

              {/* Local Audio feature callout */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-white text-xs">Want to play your own local music files right now?</h5>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Head to <strong>Your Library &gt; Local Audio</strong> inside C-TOWN to drag &amp; drop your device's audio files (MP3, WAV, FLAC) and play them with full waveform visuals!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Production Architecture Ready</span>
              </h4>
              <p className="leading-relaxed">
                C-Town is constructed with strict separation of concerns using the <code>MusicProviderInterface</code>
                pattern. This allows replacing the audio data provider (iTunes Search API / Apple Music / Spotify API /
                SoundCloud) without touching UI components.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <h5 className="font-bold text-white text-xs">Audio Playback Engine</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Uses native HTML5 Audio singleton with crossfade timing, buffer monitoring, repeat modes, dynamic
                    waveform progress scrubbing, and synced lyric synchronization.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <h5 className="font-bold text-white text-xs">Universal Cross-Platform Hub</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Integrates direct deep-links to Spotify, Apple Music, YouTube Music, SoundCloud, Deezer, Tidal, Amazon
                    Music, and Bandcamp for universal song lookup.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400 text-[11px]">schema.sql (PostgreSQL / Supabase)</span>
                <button
                  onClick={() => copyCode(postgresSchema, 'sql')}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5"
                >
                  {copiedKey === 'sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#090b0e] border border-white/10 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                {postgresSchema}
              </pre>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Connecting Licensed Music APIs</span>
              </h4>
              <p className="leading-relaxed">
                To connect Spotify, Apple Music, or Deezer, implement the <code>MusicProviderInterface</code> located in
                <code>src/types/music.ts</code>:
              </p>
              <pre className="p-4 rounded-2xl bg-[#090b0e] border border-white/10 font-mono text-[11px] text-teal-300 overflow-x-auto leading-relaxed">
{`export class SpotifyMusicProvider implements MusicProviderInterface {
  async searchSongs(query: string): Promise<Track[]> {
    const res = await fetch(\`/api/spotify/search?q=\${encodeURIComponent(query)}&type=track\`);
    const data = await res.json();
    return data.tracks.items.map(mapSpotifyTrackToCTown);
  }
  // Implement getTrackById, searchArtists, searchAlbums...
}`}
              </pre>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400 text-[11px]">.env.example Configuration</span>
                <button
                  onClick={() => copyCode(envExample, 'env')}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5"
                >
                  {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'env' ? 'Copied' : 'Copy .env'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#090b0e] border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                {envExample}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
