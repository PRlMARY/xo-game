import { GameData } from './game';

export interface HistoryItem {
    id: string;
    gameData: GameData;
    createdAt: Date;
}

export interface HistoryContainerProps {
    onBack: () => void;
    onReplayGame: (gameData: GameData) => void;
}

export interface ReplayViewerProps {
    gameData: GameData;
    onBack: () => void;
}

export interface ReplayState {
    currentMoveIndex: number;
    isPlaying: boolean;
    speed: number;
}
