import React, { useState } from 'react';
import ArcadeGif from '../assets/arcade-machine.mp4';
import HomeActions from '../containers/HomeActions';
import Form from '../containers/Form';

type ViewType = 'home' | 'signin' | 'signup';

const Home: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleSignIn = () => {
    setCurrentView('signin');
  };

  const handleSignUp = () => {
    setCurrentView('signup');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="flex items-start justify-center p-8 gap-20">
      <div className="relative">
        <video src={ArcadeGif} muted className="w-75" />
      </div>
      {currentView === 'home' && (
        <HomeActions 
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      )}
      {(currentView === 'signin' || currentView === 'signup') && (
        <Form 
          formType={currentView}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
};

export default Home;