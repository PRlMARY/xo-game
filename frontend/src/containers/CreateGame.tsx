import React from 'react';
import Input from '../components/Input';
import { Button } from '../components/Button';
import Switch from '../components/Switch';
import { ArrowLeftIcon } from '@/assets/Icons';

interface CreateGameProps {
    onBack: () => void;
}

const CreateGame: React.FC<CreateGameProps> = ({ onBack }) => {
    const [boardSize, setBoardSize] = React.useState(3);
    const [isPvP, setIsPvP] = React.useState(false);

    const handleStartGame = () => {
        console.log('Start game', boardSize, isPvP);
    }
    return (
        <div className="flex-1 flex flex-col items-center justify-start space-y-4 min-w-65 min-h-105">
            <div className="flex justify-between w-full mb-8">
                <button
                    onClick={onBack}
                    className="text-white hover:text-gray-300 transition-colors items-center"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-center text-5xl font-bold text-white">
                    Setting
                </h1>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-md">
                <Switch onChange={(value) => setIsPvP(value)} />
                <Input
                    label="Board Size"
                    type="number"
                    value={boardSize.toString()}
                    required
                    min="3"
                    onChange={(e) => setBoardSize(Number(e.target.value))}
                />
                <div className="flex flex-col">
                    <Button
                        variant="teal"
                        onClick={handleStartGame}
                        className="w-full"
                    >
                        START GAME
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateGame;