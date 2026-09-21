import React from 'react';
import { Album } from '../../types/music';
import { useMusic } from '../../context/MusicContext';
import { Play } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const { navigateTo, playTrack } = useMusic();

  const handleClick = () => {
    navigateTo('album', { albumId: album.id });
  };

  const handleQuickPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks);
    } else {
      handleClick();
    }
  };

  return (
    <div
      id={`album-card-${album.id}`}
      onClick={handleClick}
      className="group relative p-4 rounded-md bg-[#181818] hover:bg-[#282828] transition-colors duration-300 cursor-pointer select-none flex flex-col shadow-md"
    >
      <div className="relative aspect-square w-full rounded overflow-hidden mb-4 bg-[#282828] shadow-lg">
        <img
          src={album.artworkUrl}
          alt={album.title}
          className="w-full h-full object-cover"
        />

        <button
          onClick={handleQuickPlay}
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black shadow-2xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          title="Play Album"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>

      <h4 className="text-sm font-bold text-white truncate mb-1">
        {album.title}
      </h4>
      <p className="text-xs text-[#b3b3b3] truncate">
        {album.releaseDate} • Album
      </p>
    </div>
  );
};
