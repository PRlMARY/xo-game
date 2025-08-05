interface GameHistoryData {
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

interface GameHistoryResponse {
    message: string;
    game?: GameHistoryData;
}

const API_BASE_URL = 'http://localhost:3000';

class GameService {
    async saveGameHistory(gameData: GameHistoryData, token: string): Promise<GameHistoryResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/game/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(gameData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to save game history:', error);
            throw error;
        }
    }

    async getUserGameHistory(token: string): Promise<GameHistoryData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/game/history`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.games || [];
        } catch (error) {
            console.error('Failed to fetch game history:', error);
            throw error;
        }
    }
}

export const gameService = new GameService();
export type { GameHistoryData, GameHistoryResponse };
