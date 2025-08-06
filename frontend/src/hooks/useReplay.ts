import { useState, useEffect, useCallback } from 'react';
import { GameData, Board, CellValue } from '../types/game';
import { ReplayState } from '../types/history';
import { createEmptyBoard } from '../utils/gameLogic';

interface UseReplayReturn {
    replayState: ReplayState;
    currentBoard: Board;
    isAtEnd: boolean;
    isAtStart: boolean;
    play: () => void;
    pause: () => void;
    start: () => void;
    end: () => void;
    nextMove: () => void;
    previousMove: () => void;
    goToMove: (moveIndex: number) => void;
    setSpeed: (speed: number) => void;
}

export const useReplay = (gameData: GameData): UseReplayReturn => {
    const [replayState, setReplayState] = useState<ReplayState>({
        currentMoveIndex: 0,
        isPlaying: false,
        speed: 1000
    });

    const [currentBoard, setCurrentBoard] = useState<Board>(() => {
        console.log({ currentMoveIndex: replayState.currentMoveIndex, totalMoves: gameData.moves.length });
        return createEmptyBoard(gameData.settings.row, gameData.settings.column);
    });

    const isAtEnd = replayState.currentMoveIndex >= gameData.moves.length;
    const isAtStart = replayState.currentMoveIndex === 0;

    const updateBoard = useCallback((moveIndex: number) => {
        const newBoard = createEmptyBoard(gameData.settings.row, gameData.settings.column);

        for (let i = 0; i < moveIndex && i < gameData.moves.length; i++) {
            const move = gameData.moves[i];
            newBoard[move.row][move.column] = move.player as CellValue;
        }

        setCurrentBoard(newBoard);
    }, [gameData.settings.row, gameData.settings.column, gameData.moves]);

    useEffect(() => {
        updateBoard(replayState.currentMoveIndex);
    }, [replayState.currentMoveIndex, updateBoard]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (replayState.isPlaying && !isAtEnd) {
            interval = setInterval(() => {
                setReplayState(prev => {
                    const nextIndex = prev.currentMoveIndex + 1;
                    if (nextIndex >= (gameData.moves.length + 1)) {
                        return { ...prev, isPlaying: false };
                    }
                    return { ...prev, currentMoveIndex: nextIndex };
                });
            }, replayState.speed);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [replayState.isPlaying, replayState.speed, isAtEnd, gameData.moves.length]);

    const play = useCallback(() => {
        if (!isAtEnd) {
            setReplayState(prev => ({ ...prev, isPlaying: true }));
        }
    }, [isAtEnd]);

    const pause = useCallback(() => {
        setReplayState(prev => ({ ...prev, isPlaying: false }));
    }, []);

    const start = useCallback(() => {
        setReplayState(prev => ({
            ...prev,
            currentMoveIndex: 0,
            isPlaying: false
        }));
    }, []);

    const end = useCallback(() => {
        setReplayState(prev => ({
            ...prev,
            currentMoveIndex: gameData.moves.length,
            isPlaying: false
        }));
    }, []);

    const nextMove = useCallback(() => {
        setReplayState(prev => ({
            ...prev,
            currentMoveIndex: Math.min(prev.currentMoveIndex + 1, gameData.moves.length),
            isPlaying: false
        }));
    }, [gameData.moves.length]);

    const previousMove = useCallback(() => {
        setReplayState(prev => ({
            ...prev,
            currentMoveIndex: Math.max(prev.currentMoveIndex - 1, 0),
            isPlaying: false
        }));
    }, []);

    const goToMove = useCallback((moveIndex: number) => {
        setReplayState(prev => ({
            ...prev,
            currentMoveIndex: Math.max(0, Math.min(moveIndex, gameData.moves.length)),
            isPlaying: false
        }));
    }, [gameData.moves.length]);

    const setSpeed = useCallback((speed: number) => {
        setReplayState(prev => ({ ...prev, speed }));
    }, []);

    return {
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
    };
};
