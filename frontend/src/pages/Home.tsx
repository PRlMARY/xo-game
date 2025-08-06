import React, { useState, useEffect } from 'react';
import ArcadeGif from '../assets/arcade-machine.mp4';
import HomeActions from '../containers/HomeActions';
import Form from '../containers/Form';
import { useAuth } from '../contexts/AuthContext';
import MainMenu from '../containers/MainMenu';
import CreateGame from '../containers/CreateGame';
import Game from '../containers/Game';
import History from '../containers/History';
import ReplayViewer from '../containers/ReplayViewer';
import { gameService } from '../services/gameService';
import { GameData } from '../types/game';
import CookieService from '../utils/cookies';

type ViewType = 'mainmenu' | 'signin' | 'signup' | 'creategame' | 'game' | 'history' | 'replay';

interface GameSettings {
  rows: number;
  columns: number;
  isPvP: boolean;
}

const Home: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('mainmenu');
  const [gameSettings, setGameSettings] = useState<GameSettings>({ rows: 3, columns: 3, isPvP: false });
  const [replayGameData, setReplayGameData] = useState<GameData | null>(null);
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
    setCurrentView('history');
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

  const handleBackFromHistory = () => {
    setCurrentView('mainmenu');
  };

  const handleReplayGame = (gameData: GameData) => {
    setReplayGameData(gameData);
    setCurrentView('replay');
  };

  const handleBackFromReplay = () => {
    setReplayGameData(null);
    setCurrentView('history');
  };

  const handleGameComplete = async (gameData: GameData) => {
    console.log('Game completed! Data:', gameData);
    console.log('User authenticated:', !!user);
    console.log('User details:', user);
    
    if (user) {
      try {
        const token = CookieService.getToken();
        console.log('Token exists:', !!token);
        
        if (token) {
          console.log('Sending game data to backend:', gameData);
          const result = await gameService.saveGameHistory(gameData, token);
          console.log('Game history saved successfully:', result);
          
          CookieService.refreshToken();
        } else {
          console.warn('No token found in cookies');
        }
      } catch (error) {
        console.error('Failed to save game history:', error);
      }
    } else {
      console.log('Guest user - skipping history save');
    }
  };

  return (
    <div className="flex items-start justify-center p-8 gap-20">
      <div className="relative hidden min-[710px]:block">
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
      {currentView === 'history' && (
        <History 
          onBack={handleBackFromHistory}
          onReplayGame={handleReplayGame}
        />
      )}
      {currentView === 'replay' && replayGameData && (
        <ReplayViewer 
          gameData={replayGameData}
          onBack={handleBackFromReplay}
        />
      )}
    </div>
  );
};

export default Home;