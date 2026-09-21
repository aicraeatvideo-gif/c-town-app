import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Home, Search, Library, User, Compass } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, navigateTo, openCrossPlatformFinder } = useMusic();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'finder', label: 'Finder', icon: Compass, action: () => openCrossPlatformFinder({ query: '' }) },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="c-town-mobile-bottom-nav"
      className="md:hidden relative w-full h-14 bg-[#0a0c10]/95 backdrop-blur-xl border-t border-white/10 px-2 flex items-center justify-around select-none shrink-0"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                navigateTo(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center gap-1 w-14 py-1 transition-all ${
              isActive ? 'text-[#1ed760] font-bold' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
