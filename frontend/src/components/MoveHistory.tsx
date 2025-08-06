import React from 'react';

interface MoveHistoryProps {
    moves: {
        player: 'X' | 'O';
        row: number;
        column: number;
    }[];
    currentMoveIndex: number;
    onMoveClick: (moveIndex: number) => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({
    moves,
    currentMoveIndex,
    onMoveClick
}) => {
    if (moves.length === 0) {
        return null;
    }

    return (
        <div className="w-full flex flex-col items-center border-2 border-gray-400 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Move History</h3>
            <div className="w-full max-h-32 overflow-y-auto space-y-2">
                {moves.map((move, index) => (
                    <button
                        key={index}
                        onClick={() => onMoveClick(index + 1)}
                        className={`flex items-start w-full text-left p-2 transition-colors ${
                            currentMoveIndex === index + 1
                                ? 'bg-teal-600 border-2 border-white text-white'
                                : ' border-2 border-gray-400 hover:border-white text-gray-300'
                        }`}
                    >
                        <span className="text-lg">
                            {index + 1}. Player {move.player} → ({move.row + 1}, {move.column + 1})
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoveHistory;