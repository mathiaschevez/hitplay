import { createTRPCRouter } from '~/server/api/trpc';
import { exampleRouter } from '~/server/api/routers/example';
import { playlistRouter } from '~/server/api/routers/playlist'
import { trackRouter } from './routers/track';
import { userRouter } from './routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  playlist: playlistRouter,
  track: trackRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
