import React from 'react';
import { GameData } from '@/types/game';

interface GameInfoProps {
    gameData: GameData;
    statusMessage: string;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameData, statusMessage }) => {
    return (
        <div className="justify-center text-center space-y-2 w-fit">
            <h2 className="text-xl font-semibold text-white w-full">
                {statusMessage}
            </h2>
            <div className="text-sm text-gray-300">
                <p>Mode: {gameData.mode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}</p>
                <p>Board Size: {gameData.settings.row} × {gameData.settings.column}</p>
                <p>Total Moves: {gameData.moves.length}</p>
                {gameData.winner && gameData.winner !== 'draw' && (
                    <p className="text-teal-400 font-semibold">
                        Winner: Player {gameData.winner}
                    </p>
                )}
                {gameData.winner === 'draw' && (
                    <p className="text-yellow-400 font-semibold">
                        Result: Draw
                    </p>
                )}
            </div>
        </div>
    );
};

export default GameInfo;
