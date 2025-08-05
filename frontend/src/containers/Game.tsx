import React from 'react';
import { Button } from '../components/Button';
import { RepeatIcon } from '../assets/Icons';
import { GameProps } from '../types/game';
import { useGame } from '../hooks/useGame';
import GameBoard from '../components/GameBoard';

const Game: React.FC<GameProps> = ({ rows, columns, isPvP, onBack, onGameComplete }) => {
    const { gameState, makeMove, resetGame, getStatusMessage } = useGame({
        rows,
        columns,
        isPvP,
        onGameComplete
    });

    return (
        <div className="flex-1 flex flex-col items-center justify-start space-y-4 min-w-65 min-h-105">
            <h1 className="text-center mb-8 text-6xl font-bold text-white">
                <span className="text-blue-500">X</span><span className="text-rose-500">O</span> GAME
            </h1>
            <div className="text-center mb-4">
                <p className="text-xl text-white font-semibold">{getStatusMessage()}</p>
            </div>

            <GameBoard
                board={gameState.board}
                onCellClick={makeMove}
                winner={gameState.winner}
                rows={rows}
                columns={columns}
            />

            <div className="flex flex-row gap-4 w-full h-fit justify-center items-center">
                <Button
                    variant="rose"
                    onClick={onBack}
                    className="w-full"
                >
                    {gameState.winner ? 'BACK' : 'QUIT GAME'}
                </Button>
                {gameState.winner && (
                    <Button
                        variant="teal"
                        onClick={resetGame}
                        className="!w-fit !h-fit !p-2"
                    >
                        <RepeatIcon className="w-8 h-8" />
                    </Button>
                )}
            </div>
        </div >
    );
};

export default Game;
