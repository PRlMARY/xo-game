import { Elysia } from 'elysia';
import { saveGameHistory, getUserGameHistory, getGameStats } from '../controllers/gameController';

export const gameRoutes = new Elysia()
  .group('/api/game', (app) =>
    app
      .post('/save', saveGameHistory, {
        body: {
          mode: 'string',
          settings: {
            column: 'number',
            row: 'number'
          },
          moves: 'array',
          winner: 'string',
          status: 'string'
        }
      })
      .get('/history', getUserGameHistory)
      .get('/stats', getGameStats)
  );
