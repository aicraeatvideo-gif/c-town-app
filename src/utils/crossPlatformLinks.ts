export interface PlatformLink {
  name: string;
  url: string;
  iconName: string;
  color: string;
  bgColor: string;
}

export function getCrossPlatformLinks(trackOrQuery: {
  title?: string;
  artist?: string;
  album?: string;
  query?: string;
}): PlatformLink[] {
  let searchTerms = '';
  if (trackOrQuery.query) {
    searchTerms = trackOrQuery.query;
  } else {
    searchTerms = `${trackOrQuery.title || ''} ${trackOrQuery.artist || ''}`.trim();
  }

  const encoded = encodeURIComponent(searchTerms);

  return [
    {
      name: 'Spotify',
      url: `https://open.spotify.com/search/${encoded}`,
      iconName: 'spotify',
      color: '#1DB954',
      bgColor: 'hover:bg-[#1DB954]/20 border-[#1DB954]/30',
    },
    {
      name: 'Apple Music',
      url: `https://music.apple.com/us/search?term=${encoded}`,
      iconName: 'apple',
      color: '#FA2D48',
      bgColor: 'hover:bg-[#FA2D48]/20 border-[#FA2D48]/30',
    },
    {
      name: 'YouTube Music',
      url: `https://music.youtube.com/search?q=${encoded}`,
      iconName: 'youtube',
      color: '#FF0000',
      bgColor: 'hover:bg-[#FF0000]/20 border-[#FF0000]/30',
    },
    {
      name: 'SoundCloud',
      url: `https://soundcloud.com/search?q=${encoded}`,
      iconName: 'soundcloud',
      color: '#FF5500',
      bgColor: 'hover:bg-[#FF5500]/20 border-[#FF5500]/30',
    },
    {
      name: 'Deezer',
      url: `https://www.deezer.com/search/${encoded}`,
      iconName: 'deezer',
      color: '#A238FF',
      bgColor: 'hover:bg-[#A238FF]/20 border-[#A238FF]/30',
    },
    {
      name: 'Tidal',
      url: `https://listen.tidal.com/search?q=${encoded}`,
      iconName: 'tidal',
      color: '#00FFFF',
      bgColor: 'hover:bg-[#00FFFF]/20 border-[#00FFFF]/30',
    },
    {
      name: 'Amazon Music',
      url: `https://music.amazon.com/search/${encoded}`,
      iconName: 'amazon',
      color: '#00A8E1',
      bgColor: 'hover:bg-[#00A8E1]/20 border-[#00A8E1]/30',
    },
    {
      name: 'Bandcamp',
      url: `https://bandcamp.com/search?q=${encoded}`,
      iconName: 'bandcamp',
      color: '#1DA0C3',
      bgColor: 'hover:bg-[#1DA0C3]/20 border-[#1DA0C3]/30',
    },
  ];
}
