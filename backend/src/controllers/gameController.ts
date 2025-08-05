import type { Context } from 'elysia';
import User from '../model/users';
import jwt from 'jsonwebtoken';

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

interface AuthenticatedContext extends Context {
    userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const saveGameHistory = async ({ body, headers, set }: AuthenticatedContext) => {
    try {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { message: 'Authorization token required' };
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            decoded = payload as { userId: string };
        } catch (error) {
            set.status = 401;
            return { message: 'Invalid token' };
        }

        const gameData = body as GameHistoryData;

        if (!gameData.mode || !gameData.settings || !Array.isArray(gameData.moves)) {
            set.status = 400;
            return { message: 'Invalid game data' };
        }

        if (gameData.settings.column < 3 || gameData.settings.column > 10 || 
            gameData.settings.row < 3 || gameData.settings.row > 10) {
            set.status = 400;
            return { message: 'Board size must be between 3x3 and 10x10' };
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            set.status = 404;
            return { message: 'User not found' };
        }

        const gameHistory = {
            mode: gameData.mode,
            settings: {
                column: gameData.settings.column,
                row: gameData.settings.row
            },
            moves: gameData.moves,
            winner: gameData.winner || 'draw',
            status: gameData.status
        };

        user.history.push(gameHistory);
        await user.save();

        set.status = 201;
        return { 
            message: 'Game history saved successfully',
            game: gameHistory
        };

    } catch (error) {
        console.error('Error saving game history:', error);
        set.status = 500;
        return { message: 'Internal server error' };
    }
};

export const getUserGameHistory = async ({ headers, set }: AuthenticatedContext) => {
    try {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { message: 'Authorization token required' };
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            decoded = payload as { userId: string };
        } catch (error) {
            set.status = 401;
            return { message: 'Invalid token' };
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            set.status = 404;
            return { message: 'User not found' };
        }

        return { 
            games: user.history,
            totalGames: user.history.length
        };

    } catch (error) {
        console.error('Error fetching game history:', error);
        set.status = 500;
        return { message: 'Internal server error' };
    }
};

export const getGameStats = async ({ headers, set }: AuthenticatedContext) => {
    try {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { message: 'Authorization token required' };
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            decoded = payload as { userId: string };
        } catch (error) {
            set.status = 401;
            return { message: 'Invalid token' };
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            set.status = 404;
            return { message: 'User not found' };
        }

        const history = user.history;
        const totalGames = history.length;
        
        const wins = history.filter((game: any) => 
            (game.mode === 'pve' && game.winner === 'X') || 
            (game.mode === 'pvp' && game.winner === 'X')
        ).length;
        
        const losses = history.filter((game: any) => 
            (game.mode === 'pve' && game.winner === 'O') ||
            (game.mode === 'pvp' && game.winner === 'O')
        ).length;
        
        const draws = history.filter((game: any) => game.winner === 'draw').length;
        
        const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

        const pvpGames = history.filter((game: any) => game.mode === 'pvp').length;
        const pveGames = history.filter((game: any) => game.mode === 'pve').length;

        return {
            totalGames,
            wins,
            losses,
            draws,
            winRate,
            pvpGames,
            pveGames
        };

    } catch (error) {
        console.error('Error fetching game stats:', error);
        set.status = 500;
        return { message: 'Internal server error' };
    }
};
