import React from 'react';
import { Button } from './Button';
import { HistoryItem } from '../types/history';

interface HistoryCardProps {
    item: HistoryItem;
    gameNumber: number;
    onReplayGame: (gameData: any) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
    item,
    gameNumber,
    onReplayGame
}) => {
    const getGameModeDisplay = (mode: string) => {
        return mode === 'pvp' ? 'PvP' : 'PvE';
    };

    const getResultDisplay = (winner: string | null) => {
        if (!winner) return 'Ongoing';
        if (winner === 'draw') return 'Draw';
        return winner === 'X' ? 'Win' : 'Loss';
    };

    const getResultColor = (winner: string | null) => {
        if (!winner) return 'text-gray-400';
        if (winner === 'draw') return 'text-yellow-400';
        return winner === 'X' ? 'text-teal-400' : 'text-rose-400';
    };

    const getResultBadgeStyle = (winner: string | null) => {
        if (!winner) return 'bg-gray-700/50 border-gray-600';
        if (winner === 'draw') return 'bg-yellow-900/50 border-yellow-500';
        return winner === 'X'
            ? 'bg-teal-900/50 border-teal-500'
            : 'bg-rose-900/50 border-rose-500';
    };

    return (
        <div className="flex flex-row justify-between border-2 border-gray-400 hover:border-white p-4">
            <div className='flex flex-col justify-between'>
                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white tracking-wide">
                            Game #{gameNumber}
                        </h3>
                        <div className={`px-1 border ${getResultBadgeStyle(item.gameData.winner)} backdrop-blur-sm`}>
                            <span className={`text-sm font-bold ${getResultColor(item.gameData.winner)}`}>
                                {getResultDisplay(item.gameData.winner)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <span className="text-sm text-gray-300 font-medium">
                        {getGameModeDisplay(item.gameData.mode)}
                    </span>
                    <span className="text-sm text-gray-300 font-medium">
                        {item.gameData.settings.row}×{item.gameData.settings.column}
                    </span>
                    <span className="text-sm text-gray-300 font-medium">
                        {item.gameData.moves.length} moves
                    </span>
                </div>
            </div>
            <Button
                variant="teal"
                onClick={() => onReplayGame(item.gameData)}
                className="text-sm font-bold w-fit"
            >
                REPLAY
            </Button>
        </div>
    );
};
