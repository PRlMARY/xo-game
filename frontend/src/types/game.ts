export interface GameProps {
    rows: number;
    columns: number;
    isPvP: boolean;
    onBack: () => void;
    onGameComplete?: (gameData: GameData) => void;
}

export interface GameData {
    mode: 'pvp' | 'pve';
    settings: {
        column: number;
        row: number;
    };
    moves: {
        player: 'X' | 'O';
        row: number;
        column: number;
    }[];
    winner: 'X' | 'O' | 'draw' | null;
    status: 'complete' | 'ongoing' | 'incomplete';
}

export type CellValue = 'X' | 'O' | null;
export type Board = CellValue[][];
export type Player = 'X' | 'O';
export type GameStatus = 'ongoing' | 'complete';

export interface GameMove {
    player: Player;
    row: number;
    column: number;
}

export interface GameState {
    board: Board;
    currentPlayer: Player;
    winner: Player | 'draw' | null;
    moves: GameMove[];
    gameStatus: GameStatus;
}
