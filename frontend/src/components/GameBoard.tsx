import React from 'react';
import { Board, Player } from '../types/game';

interface GameBoardProps {
    board: Board;
    onCellClick: (row: number, col: number) => void;
    winner: Player | 'draw' | null;
    rows: number;
    columns: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
    board, 
    onCellClick, 
    winner, 
    rows, 
    columns 
}) => {
    return (
        <div
            className="grid gap-2 mx-auto"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                aspectRatio: `${columns} / ${rows}`,
            }}
        >
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        className={`
                            aspect-square flex items-center justify-center text-xl font-bold
                            border-2 border-gray-400 hover:border-white
                            transition-all duration-200 w-8 h-8
                            ${cell === 'X' ? 'text-blue-500' : 'text-rose-500'}
                            ${cell === null && winner === null ? 'hover:border-white cursor-pointer' : 'cursor-not-allowed border-white'}
                        `}
                        disabled={cell !== null || winner !== null}
                    >
                        {cell}
                    </button>
                ))
            )}
        </div>
    );
};

export default GameBoard;
