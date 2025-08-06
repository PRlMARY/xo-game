import React from 'react';
import { ArrowLeftIcon } from '@/assets/Icons';
import { ReplayViewerProps } from '../types/history';
import { useReplay } from '../hooks/useReplay';
import GameInfo from '@/components/GameInfo';
import MoveHistory from '@/components/MoveHistory';
import ReplayControls from '@/components/ReplayControls';
import GameBoard from '@/components/GameBoard';

const ReplayViewer: React.FC<ReplayViewerProps> = ({ gameData, onBack }) => {
    const {
        replayState,
        currentBoard,
        isAtEnd,
        isAtStart,
        play,
        pause,
        start,
        end,
        nextMove,
        previousMove,
        goToMove,
        setSpeed
    } = useReplay(gameData);

    const getCurrentWinner = () => {
        if (replayState.currentMoveIndex === gameData.moves.length) {
            return gameData.winner;
        }
        return null;
    };

    const getStatusMessage = () => {
        const currentMove = replayState.currentMoveIndex;

        if (currentMove === 0) {
            return `Game Start`;
        }

        if (currentMove === gameData.moves.length) {
            if (gameData.winner === 'draw') {
                return "Game End - It's a Draw!";
            } else if (gameData.winner) {
                return `Game End - Player ${gameData.winner} Wins!`;
            }
            return "Game End";
        }

        const nextPlayer = currentMove < gameData.moves.length ? gameData.moves[currentMove].player : 'X';
        return `Move ${currentMove} - ${nextPlayer}'s Turn`;
    };

    return (
        <div className="flex flex-col items-center justify-start space-y-4 min-w-65 min-h-105">
            <div className="flex justify-between w-full mb-4">
                <button
                    onClick={onBack}
                    className="text-white hover:text-gray-300 transition-colors items-center"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-center text-4xl font-bold text-white">
                    Game Replay
                </h1>
            </div>

            <div className="w-full border-2 border-gray-400 px-4 pb-4 pt-2 flex flex-col justify-center items-center gap-4">
                <GameInfo
                    gameData={gameData}
                    statusMessage={getStatusMessage()}
                />

                <div className="border-2 border-gray-700 w-fit p-4">
                    <GameBoard
                        board={currentBoard}
                        onCellClick={() => { }}
                        winner={getCurrentWinner()}
                        rows={gameData.settings.row}
                        columns={gameData.settings.column}
                    />
                </div>

                <div className="w-full">
                    <ReplayControls
                        isPlaying={replayState.isPlaying}
                        isAtStart={isAtStart}
                        isAtEnd={isAtEnd}
                        speed={replayState.speed}
                        onPlay={play}
                        onPause={pause}
                        onStart={start}
                        onEnd={end}
                        onNextMove={nextMove}
                        onPreviousMove={previousMove}
                        onSpeedChange={setSpeed}
                    />
                </div>
            </div>

                <MoveHistory
                    moves={gameData.moves}
                    currentMoveIndex={replayState.currentMoveIndex}
                    onMoveClick={goToMove}
                />
        </div>
    );
};

export default ReplayViewer;
