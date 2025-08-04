import React, { useState, useEffect } from 'react';
import ArcadeGif from '../assets/arcade-machine.mp4';
import HomeActions from '../containers/HomeActions';
import Form from '../containers/Form';
import { useAuth } from '../contexts/AuthContext';
import MainMenu from '../containers/MainMenu';
import CreateGame from '../containers/CreateGame';

type ViewType = 'mainmenu' | 'signin' | 'signup' | 'creategame';

const Home: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('mainmenu');
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView('mainmenu');
    }
  }, [isAuthenticated]);

  const handleSignIn = () => {
    setCurrentView('signin');
  };

  const handleSignUp = () => {
    setCurrentView('signup');
  };

  const handleBackToHome = () => {
    setCurrentView('mainmenu');
  };

  const handlePlay = () => {
    const video = document.querySelector('video') as HTMLVideoElement;
    video.play();
    setCurrentView('creategame');
  };

  const handleHistory = () => {
  };

  const handleLogout = () => {
    logout();
    setCurrentView('mainmenu');
  };

  const handleBackFromCreateGame = () => {
    const video = document.querySelector('video') as HTMLVideoElement;
    video.currentTime = 0;
    video.pause();
    if (isAuthenticated) {
      setCurrentView('mainmenu');
    } else {
      setCurrentView('mainmenu');
    }
  };

  return (
    <div className="flex items-start justify-center p-8 gap-20">
      <div className="relative">
        <video src={ArcadeGif} muted className="w-75" />
      </div>
      {currentView === 'mainmenu' && !isAuthenticated && (
        <HomeActions
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onPlay={handlePlay}
        />
      )}
      {currentView === 'mainmenu' && isAuthenticated && (
        <MainMenu
          onPlay={handlePlay}
          onHistory={handleHistory}
          onLogout={handleLogout}
        />
      )}
      {(currentView === 'signin' || currentView === 'signup') && (
        <Form
          formType={currentView}
          onBack={handleBackToHome}
        />
      )}
      {currentView === 'creategame' && (
        <CreateGame onBack={handleBackFromCreateGame} />
      )}
    </div>
  );
};

export default Home;