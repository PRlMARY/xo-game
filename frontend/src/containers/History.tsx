import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { HistoryCard } from '../components/HistoryCard';
import { ArrowLeftIcon } from '@/assets/Icons';
import { HistoryContainerProps, HistoryItem } from '../types/history';
import { gameService } from '../services/gameService';
import { useAuth } from '../contexts/AuthContext';
import CookieService from '../utils/cookies';

const History: React.FC<HistoryContainerProps> = ({ onBack, onReplayGame }) => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchGameHistory = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const token = CookieService.getToken();
                if (!token) {
                    setError('Authentication token not found');
                    setLoading(false);
                    return;
                }

                const games = await gameService.getUserGameHistory(token);

                CookieService.refreshToken();

                const items: HistoryItem[] = games.map((game, index) => ({
                    id: `game-${Date.now()}-${index}`,
                    gameData: game,
                    createdAt: new Date()
                })).reverse();

                setHistoryItems(items);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch game history:', err);
                setError('Failed to load game history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchGameHistory();
    }, [user]);



    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-w-65 min-h-105">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
                    <p className="text-white text-lg">Loading game history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start space-y-6 min-w-65 min-h-105">
            <div className="flex justify-between w-full mb-8">
                <button
                    onClick={onBack}
                    className="text-white hover:text-gray-300 transition-colors items-center"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-center text-6xl font-bold text-white">
                    History
                </h1>
            </div>

            {error && (
                <div className="w-full bg-red-900/50 border-2 border-red-700 p-4">
                    <div className="text-center">
                        <p className="text-red-300 text-lg font-semibold mb-2">Error</p>
                        <p className="text-red-200 text-sm">{error}</p>
                        <Button
                            variant="rose"
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2"
                        >
                            RETRY
                        </Button>
                    </div>
                </div>
            )}

            {!loading && !error && historyItems.length === 0 && (
                <div className="w-full border-2 border-gray-400 p-8">
                    <div className="text-center space-y-4">
                        <div className="text-6xl text-gray-600 mb-4">🎮</div>
                        <h2 className="text-2xl font-semibold text-white">No Games Yet</h2>
                    </div>
                </div>
            )}

            {historyItems.length > 0 && (
                <div className="w-full space-y-4 max-h-71 overflow-y-auto">
                    {historyItems.map((item, index) => (
                        <HistoryCard
                            key={item.id}
                            item={item}
                            gameNumber={historyItems.length - index}
                            onReplayGame={onReplayGame}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
