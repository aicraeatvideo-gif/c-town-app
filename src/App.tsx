import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { LandingPage } from './components/auth/LandingPage';
import { MainLayout } from './components/layout/MainLayout';
import { AuthModal } from './components/auth/AuthModal';
import { CarrierSmsNotification } from './components/common/CarrierSmsNotification';

const AppContent: React.FC = () => {
  const { isFirstVisit, setIsFirstVisit } = useMusic();

  if (isFirstVisit) {
    return (
      <div className="relative min-h-screen bg-[#07080a] text-white">
        <CarrierSmsNotification />
        <LandingPage onExplore={() => setIsFirstVisit(false)} />
        <AuthModal />
      </div>
    );
  }

  return (
    <>
      <CarrierSmsNotification />
      <MainLayout />
    </>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}
