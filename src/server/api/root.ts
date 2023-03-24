import { createTRPCRouter } from '~/server/api/trpc';
import { playlistRouter } from '~/server/api/routers/playlist'
import { trackRouter } from './routers/track';
import { userRouter } from './routers/user';
import { duelRouter } from './routers/duel';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  playlist: playlistRouter,
  track: trackRouter,
  user: userRouter,
  duel: duelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
