import type { Context } from 'elysia';
import User from '../model/users';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

// Enhanced interfaces with better typing
interface GameMove {
    player: 'X' | 'O';
    row: number;
    column: number;
}

interface GameSettings {
    column: number;
    row: number;
}

interface GameHistoryData {
    mode: 'pvp' | 'pve';
    settings: GameSettings;
    moves: GameMove[];
    winner: 'X' | 'O' | 'draw' | null;
    status: 'complete' | 'ongoing' | 'incomplete';
    playerSymbol?: 'X' | 'O'; // Track which symbol the user played as
}

interface AuthenticatedContext extends Context {
    userId?: string;
}

interface AuthenticatedUser {
    userId: string;
    user: any; // User document from MongoDB
}

interface GameStats {
    totalGames: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    pvpGames: number;
    pveGames: number;
    averageMovesPerGame: number;
    favoriteGameMode: 'pvp' | 'pve' | 'equal';
}

// Enhanced security: Fail if JWT_SECRET is not properly configured
const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret === 'fallback-secret-key') {
        throw new Error(
            '🚨 JWT_SECRET must be properly configured in environment variables for security. ' +
            'Never use fallback secrets in production!'
        );
    }
    if (secret.length < 32) {
        throw new Error(
            '🚨 JWT_SECRET must be at least 32 characters long for security.'
        );
    }
    return secret;
};

const JWT_SECRET: string = getJwtSecret();

// Helper Functions to eliminate code duplication

/**
 * Extracts and validates JWT token from authorization header
 */
const extractToken = (authHeader: string | undefined): string => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization token required');
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2) {
        throw new Error('Invalid authorization header format');
    }

    const token = tokenParts[1];
    if (!token) {
        throw new Error('Token not found in authorization header');
    }

    return token;
};

/**
 * Verifies JWT token and extracts user ID
 */
const verifyToken = (token: string): string => {
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
            const decoded = payload as { userId: string };
            return decoded.userId;
        } else {
            throw new Error('Invalid token payload');
        }
    } catch (error) {
        console.error('Invalid token:', {
            name: (error as any).name,
            message: (error as any).message
        });
        throw new Error('Invalid token');
    }
};

const authenticateUser = async (headers: Record<string, string | undefined>): Promise<AuthenticatedUser> => {
    try {
        const token = extractToken(headers.authorization);
        const userId = verifyToken(token);
        
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        return { userId, user };
    } catch (error) {
        throw error;
    }
};

const validateGameData = (gameData: any): GameHistoryData => {
    if (!gameData || typeof gameData !== 'object') {
        throw new Error('Game data must be a valid object');
    }
    if (!gameData.mode || !['pvp', 'pve'].includes(gameData.mode)) {
        throw new Error('Game mode must be either "pvp" or "pve"');
    }

    if (!gameData.settings || typeof gameData.settings !== 'object') {
        throw new Error('Game settings are required');
    }

    const { settings } = gameData;
    if (!Number.isInteger(settings.column) || !Number.isInteger(settings.row)) {
        throw new Error('Board dimensions must be integers');
    }

    if (settings.column < 3 || settings.column > 10 || settings.row < 3 || settings.row > 10) {
        throw new Error('Board size must be between 3x3 and 10x10');
    }

    if (!Array.isArray(gameData.moves)) {
        throw new Error('Moves must be an array');
    }

    for (const move of gameData.moves) {
        if (!move.player || !['X', 'O'].includes(move.player)) {
            throw new Error('Each move must have a valid player (X or O)');
        }
        if (!Number.isInteger(move.row) || !Number.isInteger(move.column)) {
            throw new Error('Move coordinates must be integers');
        }
        if (move.row < 0 || move.row >= settings.row || move.column < 0 || move.column >= settings.column) {
            throw new Error('Move coordinates must be within board boundaries');
        }
    }

    if (gameData.winner !== null && gameData.winner !== 'draw' && !['X', 'O'].includes(gameData.winner)) {
        throw new Error('Winner must be "X", "O", "draw", or null');
    }
    if (!gameData.status || !['complete', 'ongoing', 'incomplete'].includes(gameData.status)) {
        throw new Error('Status must be "complete", "ongoing", or "incomplete"');
    }

    if (gameData.playerSymbol && !['X', 'O'].includes(gameData.playerSymbol)) {
        throw new Error('Player symbol must be "X" or "O"');
    }

    return gameData as GameHistoryData;
};

const calculateGameStats = (history: any[]): GameStats => {
    const totalGames = history.length;
    
    if (totalGames === 0) {
        return {
            totalGames: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: 0,
            pvpGames: 0,
            pveGames: 0,
            averageMovesPerGame: 0,
            favoriteGameMode: 'equal'
        };
    }

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let totalMoves = 0;
    let pvpGames = 0;
    let pveGames = 0;

    for (const game of history) {
        totalMoves += game.moves?.length || 0;
        if (game.mode === 'pvp') pvpGames++;
        else if (game.mode === 'pve') pveGames++;
        
        if (game.winner === 'draw') {
            draws++;
        } else if (game.winner) {
            if (game.playerSymbol) {
                if (game.winner === game.playerSymbol) {
                    wins++;
                } else {
                    losses++;
                }
            } else {
                if (game.winner === 'X') {
                    wins++;
                } else {
                    losses++;
                }
            }
        }
    }

    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    const averageMovesPerGame = totalGames > 0 ? Math.round(totalMoves / totalGames) : 0;
    
    let favoriteGameMode: 'pvp' | 'pve' | 'equal' = 'equal';
    if (pvpGames > pveGames) favoriteGameMode = 'pvp';
    else if (pveGames > pvpGames) favoriteGameMode = 'pve';

    return {
        totalGames,
        wins,
        losses,
        draws,
        winRate,
        pvpGames,
        pveGames,
        averageMovesPerGame,
        favoriteGameMode
    };
};

export const saveGameHistory = async ({ body, headers, set }: AuthenticatedContext) => {
    try {
        const { userId, user } = await authenticateUser(headers);
        const validatedGameData = validateGameData(body);
        
        const gameHistory = {
            mode: validatedGameData.mode,
            settings: validatedGameData.settings,
            moves: validatedGameData.moves,
            winner: validatedGameData.winner || 'draw',
            status: validatedGameData.status,
            playerSymbol: validatedGameData.playerSymbol
        };
        
        user.history.push(gameHistory);
        
        const savedUser = await user.save();

        set.status = 201;
        return { 
            message: 'Game history saved successfully',
            game: gameHistory
        };

    } catch (error) {
        console.error('Error saving game history:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('Authorization') || error.message.includes('token')) {
                set.status = 401;
                return { message: error.message };
            }
            if (error.message.includes('User not found')) {
                set.status = 404;
                return { message: error.message };
            }
            if (error.message.includes('Game') || error.message.includes('Board') || 
                error.message.includes('Move') || error.message.includes('must be')) {
                set.status = 400;
                return { message: error.message };
            }
        }
        
        set.status = 500;
        return { message: 'Internal server error' };
    }
};

export const getUserGameHistory = async ({ headers, set }: AuthenticatedContext) => {
    try {
        const { userId, user } = await authenticateUser(headers);

        return { 
            games: user.history,
            totalGames: user.history.length
        };

    } catch (error) {
        console.error('Error fetching game history:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('Authorization') || error.message.includes('token')) {
                set.status = 401;
                return { message: error.message };
            }
            if (error.message.includes('User not found')) {
                set.status = 404;
                return { message: error.message };
            }
        }
        
        set.status = 500;
        return { message: 'Internal server error' };
    }
};

export const getGameStats = async ({ headers, set }: AuthenticatedContext) => {
    try {
        const { userId, user } = await authenticateUser(headers);
        
        const stats = calculateGameStats(user.history);
        
        return stats;

    } catch (error) {
        console.error('Error fetching game stats:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('Authorization') || error.message.includes('token')) {
                set.status = 401;
                return { message: error.message };
            }
            if (error.message.includes('User not found')) {
                set.status = 404;
                return { message: error.message };
            }
        }
        
        set.status = 500;
        return { message: 'Internal server error' };
    }
};
