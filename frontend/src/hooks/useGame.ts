import { useState, useEffect, useCallback } from 'react';
import { Board, GameMove, GameState, GameData } from '../types/game';
import { checkWinner, isBoardFull, createEmptyBoard, applyMove, getOpponentPlayer } from '../utils/gameLogic';
import { BotAI } from '../utils/botAI';
import { useAuth } from '../contexts/AuthContext';

interface UseGameProps {
    rows: number;
    columns: number;
    isPvP: boolean;
    onGameComplete?: (gameData: GameData) => void;
}

export const useGame = ({ rows, columns, isPvP, onGameComplete }: UseGameProps) => {
    const { user } = useAuth();
    const [gameState, setGameState] = useState<GameState>(() => ({
        board: createEmptyBoard(rows, columns),
        currentPlayer: 'X',
        winner: null,
        moves: [],
        gameStatus: 'ongoing'
    }));

    const botAI = new BotAI(rows, columns);

    const makeMove = useCallback((row: number, col: number) => {
        if (gameState.board[row][col] !== null || gameState.winner !== null) return;

        const newBoard = applyMove(gameState.board, row, col, gameState.currentPlayer);
        const newMove: GameMove = { 
            player: gameState.currentPlayer, 
            row, 
            column: col 
        };

        const newMoves = [...gameState.moves, newMove];
        let winner = null;
        let gameStatus: 'ongoing' | 'complete' = 'ongoing';

        if (checkWinner(newBoard, row, col, gameState.currentPlayer)) {
            winner = gameState.currentPlayer;
            gameStatus = 'complete';
        } else if (isBoardFull(newBoard)) {
            winner = 'draw' as const;
            gameStatus = 'complete';
        }

        setGameState({
            board: newBoard,
            currentPlayer: winner ? gameState.currentPlayer : getOpponentPlayer(gameState.currentPlayer),
            winner,
            moves: newMoves,
            gameStatus
        });

        if (!isPvP && gameState.currentPlayer === 'X' && !winner) {
            setTimeout(() => makeBotMove(newBoard, newMoves), 500);
        }
    }, [gameState, isPvP, rows, columns]);

    const makeBotMove = useCallback((currentBoard: Board, currentMoves: GameMove[]) => {
        const bestMove = botAI.getBestMove(currentBoard);
        
        if (bestMove) {
            const [row, col] = bestMove;
            const newBoard = applyMove(currentBoard, row, col, 'O');
            const newMove: GameMove = { player: 'O', row, column: col };
            const newMoves = [...currentMoves, newMove];

            let winner: 'X' | 'O' | 'draw' | null = null;
            let gameStatus: 'ongoing' | 'complete' = 'ongoing';

            if (checkWinner(newBoard, row, col, 'O')) {
                winner = 'O';
                gameStatus = 'complete';
            } else if (isBoardFull(newBoard)) {
                winner = 'draw';
                gameStatus = 'complete';
            }

            setGameState({
                board: newBoard,
                currentPlayer: winner ? 'O' : 'X',
                winner,
                moves: newMoves,
                gameStatus
            });
        }
    }, [botAI]);

    const resetGame = useCallback(() => {
        setGameState({
            board: createEmptyBoard(rows, columns),
            currentPlayer: 'X',
            winner: null,
            moves: [],
            gameStatus: 'ongoing'
        });
    }, [rows, columns]);

    const getStatusMessage = useCallback((): string => {
        if (gameState.winner === 'draw') return "It's a draw!";
        if (gameState.winner) return `Player ${gameState.winner} wins!`;
        if (!isPvP && gameState.currentPlayer === 'O') return "Bot is thinking...";
        return `Player ${gameState.currentPlayer}'s turn`;
    }, [gameState.winner, gameState.currentPlayer, isPvP]);

    useEffect(() => {
        if (gameState.gameStatus === 'complete' && user && onGameComplete) {
            const gameData: GameData = {
                mode: isPvP ? 'pvp' : 'pve',
                settings: {
                    column: columns,
                    row: rows
                },
                moves: gameState.moves,
                winner: gameState.winner as 'X' | 'O' | 'draw' | null,
                status: 'complete'
            };
            onGameComplete(gameData);
        }
    }, [gameState.gameStatus, gameState.moves, gameState.winner, user, onGameComplete, isPvP, rows, columns]);
    return {
        gameState,
        makeMove,
        resetGame,
        getStatusMessage
    };
};
