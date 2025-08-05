import React, { useState, useEffect } from 'react';
import ArcadeGif from '../assets/arcade-machine.mp4';
import HomeActions from '../containers/HomeActions';
import Form from '../containers/Form';
import { useAuth } from '../contexts/AuthContext';
import MainMenu from '../containers/MainMenu';
import CreateGame from '../containers/CreateGame';
import Game from '../containers/Game';
import { gameService } from '../services/gameService';
import { GameData } from '../types/game';

type ViewType = 'mainmenu' | 'signin' | 'signup' | 'creategame' | 'game';

interface GameSettings {
  rows: number;
  columns: number;
  isPvP: boolean;
}

const Home: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('mainmenu');
  const [gameSettings, setGameSettings] = useState<GameSettings>({ rows: 3, columns: 3, isPvP: false });
  const { isAuthenticated, logout, user } = useAuth();

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
    setCurrentView('mainmenu');
  };

  const handleStartGame = (rows: number, columns: number, isPvP: boolean) => {
    setGameSettings({ rows, columns, isPvP });
    setCurrentView('game');
  };

  const handleBackFromGame = () => {
    setCurrentView('creategame');
  };

  const handleGameComplete = async (gameData: GameData) => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await gameService.saveGameHistory(gameData, token);
          console.log('Game history saved successfully');
        }
      } catch (error) {
        console.error('Failed to save game history:', error);
      }
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
        <CreateGame 
          onBack={handleBackFromCreateGame} 
          onStartGame={handleStartGame}
        />
      )}
      {currentView === 'game' && (
        <Game 
          rows={gameSettings.rows}
          columns={gameSettings.columns}
          isPvP={gameSettings.isPvP}
          onBack={handleBackFromGame}
          onGameComplete={handleGameComplete}
        />
      )}
    </div>
  );
};

export default Home;