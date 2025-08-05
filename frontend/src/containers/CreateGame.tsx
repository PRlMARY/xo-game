import React from 'react';
import Input from '../components/Input';
import { Button } from '../components/Button';
import Switch from '../components/Switch';
import { ArrowLeftIcon } from '@/assets/Icons';

interface CreateGameProps {
    onBack: () => void;
    onStartGame: (rows: number, columns: number, isPvP: boolean) => void;
}

const CreateGame: React.FC<CreateGameProps> = ({ onBack, onStartGame }) => {
    const [rows, setRows] = React.useState(3);
    const [columns, setColumns] = React.useState(3);
    const [isPvP, setIsPvP] = React.useState(false);

    const handleStartGame = () => {
        onStartGame(rows, columns, isPvP);
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
                <h1 className="text-center text-6xl font-bold text-white">
                    Setting
                </h1>
            </div>
            <div className="flex flex-col gap-4 w-full items-center">
                <Switch onChange={(value) => setIsPvP(value)} />
                <Input
                    label="Rows (min: 3)"
                    type="number"
                    value={rows.toString()}
                    required
                    min="3"
                    onChange={(e) => setRows(Math.max(3, Number(e.target.value)))}
                />
                <Input
                    label="Columns (min: 3)"
                    type="number"
                    value={columns.toString()}
                    required
                    min="3"
                    onChange={(e) => setColumns(Math.max(3, Number(e.target.value)))}
                />
                <Button
                    variant="teal"
                    onClick={handleStartGame}
                    className="w-full"
                >
                    START GAME
                </Button>
            </div>
        </div>
    );
};

export default CreateGame;