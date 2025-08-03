import React from 'react';
import { Button } from '../components/Button';

const HomeActions: React.FC = () => {
    const handleGuest = () => {
        const video = document.querySelector('video') as HTMLVideoElement;
        video.play();
        console.log('Guest clicked');
    };

    const handleSignIn = () => {
        console.log('Sign In clicked');
    };

    const handleSignUp = () => {
        console.log('Sign Up clicked');
    };

    const buttonConfig = [
        {
            id: 'guest',
            label: 'PLAY NOW',
            variant: 'teal' as const,
            onClick: handleGuest,
        },
        {
            id: 'signin',
            label: 'SIGN IN',
            variant: 'blue' as const,
            onClick: handleSignIn
        },
        {
            id: 'signup',
            label: 'SIGN UP',
            variant: 'rose' as const,
            onClick: handleSignUp
        }
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-start space-y-4 min-w-65 min-h-105">
            <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-white">
                    <span className="text-blue-500">X</span><span className="text-rose-500">O</span> GAME
                </h1>
            </div>
            <div className="flex flex-col space-y-4 w-full">
                {buttonConfig.map((button, index) => (
                    <div key={button.id}>
                        <Button
                            variant={button.variant}
                            onClick={button.onClick}
                            className="w-full"
                        >
                            {button.label}
                        </Button>
                        {index === 0 && (
                            <div className="flex items-center mt-4">
                                <hr className="flex-grow border-t border-gray-400" />
                                <span className="px-4 text-gray-400 text-md">OR</span>
                                <hr className="flex-grow border-t border-gray-400" />
                            </div>
                        )}
                    </div>
                ))}
                <div className="text-center">
                    <p className="text-gray-400 text-md">
                        Sign in to watch your match replay!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomeActions;