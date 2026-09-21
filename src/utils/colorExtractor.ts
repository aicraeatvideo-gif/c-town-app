import { ColorTheme } from '../types/music';

// Default signature C-TOWN palette (teal/emerald dark luxury)
export const DEFAULT_THEME: ColorTheme = {
  name: 'emerald',
  primary: '#10b981',
  accent: '#14b8a6',
  glow: 'rgba(16, 185, 129, 0.18)',
  gradient: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.22) 0%, rgba(10, 11, 14, 0.95) 70%, #08090c 100%)',
};

export const COLOR_THEMES: Record<string, ColorTheme> = {
  green: {
    name: 'green',
    primary: '#1ed760',
    accent: '#1db954',
    glow: 'rgba(30, 215, 96, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(30, 215, 96, 0.32) 0%, rgba(10, 28, 16, 0.95) 70%, #08090c 100%)',
  },
  blue: {
    name: 'blue',
    primary: '#3b82f6',
    accent: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.30) 0%, rgba(10, 15, 28, 0.95) 70%, #08090c 100%)',
  },
  purple: {
    name: 'purple',
    primary: '#a855f7',
    accent: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.30) 0%, rgba(18, 12, 28, 0.95) 70%, #08090c 100%)',
  },
  red: {
    name: 'red',
    primary: '#ef4444',
    accent: '#f87171',
    glow: 'rgba(239, 68, 68, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.30) 0%, rgba(28, 10, 12, 0.95) 70%, #08090c 100%)',
  },
  emerald: {
    name: 'emerald',
    primary: '#10b981',
    accent: '#34d399',
    glow: 'rgba(16, 185, 129, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.30) 0%, rgba(10, 24, 18, 0.95) 70%, #08090c 100%)',
  },
  teal: {
    name: 'teal',
    primary: '#14b8a6',
    accent: '#2dd4bf',
    glow: 'rgba(20, 184, 166, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.30) 0%, rgba(8, 24, 24, 0.95) 70%, #08090c 100%)',
  },
  amber: {
    name: 'amber',
    primary: '#f59e0b',
    accent: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.30) 0%, rgba(28, 20, 8, 0.95) 70%, #08090c 100%)',
  },
  orange: {
    name: 'orange',
    primary: '#f97316',
    accent: '#fb923c',
    glow: 'rgba(249, 115, 22, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.30) 0%, rgba(28, 16, 8, 0.95) 70%, #08090c 100%)',
  },
  rose: {
    name: 'rose',
    primary: '#f43f5e',
    accent: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(244, 63, 94, 0.30) 0%, rgba(28, 8, 14, 0.95) 70%, #08090c 100%)',
  },
  indigo: {
    name: 'indigo',
    primary: '#6366f1',
    accent: '#818cf8',
    glow: 'rgba(99, 102, 241, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.30) 0%, rgba(12, 12, 30, 0.95) 70%, #08090c 100%)',
  },
  cyan: {
    name: 'cyan',
    primary: '#06b6d4',
    accent: '#38bdf8',
    glow: 'rgba(6, 182, 212, 0.28)',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.30) 0%, rgba(8, 20, 26, 0.95) 70%, #08090c 100%)',
  },
};

export function getThemeForTrack(dominantColor?: string): ColorTheme {
  if (!dominantColor) return DEFAULT_THEME;
  const key = dominantColor.toLowerCase().trim();
  if (COLOR_THEMES[key]) {
    return COLOR_THEMES[key];
  }
  // If a hex code was passed like #3b82f6 or #ef4444
  if (dominantColor.startsWith('#')) {
    return {
      name: 'custom',
      primary: dominantColor,
      accent: dominantColor,
      glow: `${dominantColor}33`,
      gradient: `radial-gradient(circle at 50% 0%, ${dominantColor}38 0%, rgba(10, 11, 14, 0.95) 70%, #08090c 100%)`,
    };
  }
  return DEFAULT_THEME;
}
