import React from 'react';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

interface MainMenuProps {
    onPlay: () => void;
    onHistory: () => void;
    onLogout: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onHistory, onLogout }) => {
    const { user } = useAuth();

    const handlePlay = () => {
        onPlay();
    };

    const handleHistory = () => {
        onHistory();
    };

    const handleLogout = () => {
        onLogout();
    };

    const buttonConfig = [
        {
            id: 'play',
            label: 'PLAY NOW',
            variant: 'teal' as const,
            onClick: handlePlay,
        },
        {
            id: 'history',
            label: 'VIEW GAME HISTORY',
            variant: 'blue' as const,
            onClick: handleHistory
        },
        {
            id: 'logout',
            label: 'LOGOUT',
            variant: 'rose' as const,
            onClick: handleLogout
        }
    ];

    return (
        <div className="flex flex-col items-center justify-start space-y-4 min-w-65 min-h-105">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white">Welcome!</h1>
                <p className="text-[18px] text-teal-500">Hello, {user?.username}</p>
            </div>
            <div className="flex flex-col gap-4 w-full">
                {buttonConfig.map((button, index) => (
                    <div key={button.id}>
                        <Button
                            variant={button.variant}
                            onClick={button.onClick}
                            className="w-full"
                        >
                            {button.label}
                        </Button>
                        {index === 1 && (
                            <div className="flex items-center mt-4">
                                <hr className="flex-grow border-t border-gray-400" />
                                <span className="px-4 text-gray-400 text-md">OR</span>
                                <hr className="flex-grow border-t border-gray-400" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainMenu;
