import React from 'react';
import { useMusic } from '../../context/MusicContext';

export const DynamicBackground: React.FC = () => {
  const { currentTheme, isPlaying, currentTrack } = useMusic();

  return (
    <div
      id="spotify-dynamic-background"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000 ease-out"
    >
      {/* Base deep void tone */}
      <div className="absolute inset-0 bg-[#050608]" />

      {/* Dynamic radial gradient reacting to artwork color */}
      <div
        className="absolute inset-0 opacity-75 transition-all duration-1000 ease-in-out"
        style={{
          background: currentTheme.gradient,
        }}
      />

      {/* Live Ambient Floating Aura Orb 1 (top right) - pulses when playing */}
      <div
        className={`absolute -top-36 -right-20 w-[480px] h-[480px] rounded-full blur-[100px] transition-all duration-1000 ease-in-out ${
          isPlaying ? 'opacity-55 scale-110 animate-pulse' : 'opacity-30 scale-90'
        }`}
        style={{
          backgroundColor: currentTheme.primary,
          animationDuration: isPlaying ? '3.5s' : '7s',
        }}
      />

      {/* Live Ambient Floating Aura Orb 2 (center left) */}
      <div
        className={`absolute top-1/4 -left-28 w-[420px] h-[420px] rounded-full blur-[90px] transition-all duration-1000 ease-in-out ${
          isPlaying ? 'opacity-45 scale-105' : 'opacity-25 scale-90'
        }`}
        style={{
          backgroundColor: currentTheme.accent,
        }}
      />

      {/* Live Ambient Floating Aura Orb 3 (bottom center near player) */}
      <div
        className={`absolute -bottom-24 left-1/3 w-[500px] h-[350px] rounded-full blur-[110px] transition-all duration-1000 ease-in-out ${
          isPlaying ? 'opacity-40 scale-110' : 'opacity-20 scale-95'
        }`}
        style={{
          backgroundColor: currentTheme.primary,
        }}
      />

      {/* Live acoustic wave shimmer when track is actively playing */}
      {isPlaying && (
        <div
          className="absolute inset-x-0 top-0 h-96 opacity-30 blur-2xl transition-all duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${currentTheme.primary} 0%, transparent 80%)`,
          }}
        />
      )}

      {/* Subtle fine cinematic vignette to keep text crisp and legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-[#050608]/70 opacity-80" />
    </div>
  );
};
