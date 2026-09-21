import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
  showBrandSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
  showBrandSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-extrabold tracking-tight',
    md: 'text-xl font-black tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
  };

  return (
    <div
      id="c-town-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Spotify-inspired, original C-Town acoustic icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Glowing Spotify-green background disc with subtle gradient */}
          <circle cx="20" cy="20" r="20" fill="url(#ctown-green-grad)" />

          {/* Concentric acoustic audio waves shaped into a distinct musical 'C' */}
          {/* Outer arc of the C */}
          <path
            d="M 28 9 A 14 14 0 1 0 28 31"
            stroke="#080b0f"
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Middle arc of the C */}
          <path
            d="M 25.5 13.5 A 9.5 9.5 0 1 0 25.5 26.5"
            stroke="#080b0f"
            strokeWidth="3.1"
            strokeLinecap="round"
          />

          {/* Inner audio pulse dot / harmonic core */}
          <circle cx="20" cy="20" r="2.6" fill="#080b0f" />

          {/* Subtle audio frequency notches on right side */}
          <circle cx="30" cy="18" r="1.4" fill="#080b0f" opacity="0.8" />
          <circle cx="32" cy="20" r="1.6" fill="#080b0f" />
          <circle cx="30" cy="22" r="1.4" fill="#080b0f" opacity="0.8" />

          <defs>
            <linearGradient
              id="ctown-green-grad"
              x1="4"
              y1="4"
              x2="36"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1ed760" />
              <stop offset="1" stopColor="#14b84b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-sans font-black text-white tracking-tight leading-none transition-colors duration-200 group-hover:text-[#1ed760] ${textSizes[size]}`}
            >
              C-TOwn
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] shrink-0 self-center animate-pulse" />
          </div>
          {showBrandSubtitle && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1ed760] transition-colors">
                ARYAN BRAND
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
