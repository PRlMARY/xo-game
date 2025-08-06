import { Elysia, t } from 'elysia';
import { saveGameHistory, getUserGameHistory, getGameStats } from '../controllers/gameController';

export const gameRoutes = new Elysia()
  .group('/api/game', (app) =>
    app
      .post('/save', saveGameHistory, {
        body: t.Object({
          mode: t.String(),
          settings: t.Object({
            column: t.Number(),
            row: t.Number()
          }),
          moves: t.Array(t.Object({
            player: t.String(),
            row: t.Number(),
            column: t.Number()
          })),
          winner: t.Union([t.String(), t.Null()]),
          status: t.String()
        })
      })
      .get('/history', getUserGameHistory)
      .get('/stats', getGameStats)
  );
