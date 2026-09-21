import React from 'react';
import { Artist } from '../../types/music';
import { useMusic } from '../../context/MusicContext';
import { CheckCircle2, Play } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { navigateTo, isArtistFollowed, toggleFollowArtist } = useMusic();

  const followed = isArtistFollowed(artist.id);

  const handleClick = () => {
    navigateTo('artist', { artistId: artist.id });
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowArtist(artist.id);
  };

  return (
    <div
      id={`artist-card-${artist.id}`}
      onClick={handleClick}
      className="group relative p-4 rounded-md bg-[#181818] hover:bg-[#282828] transition-colors duration-300 cursor-pointer select-none flex flex-col shadow-md"
    >
      {/* Circle Photo */}
      <div className="relative aspect-square w-full rounded-full overflow-hidden mb-4 bg-[#282828] shadow-lg">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover"
        />

        {/* Hover Spotify Green Play Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black shadow-2xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          title={`Play ${artist.name}`}
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-1">
        <h4 className="text-sm font-bold text-white truncate">
          {artist.name}
        </h4>
        {artist.verified && (
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760] fill-current shrink-0" />
        )}
      </div>

      <p className="text-xs text-[#b3b3b3] capitalize truncate">
        Artist
      </p>
    </div>
  );
};
