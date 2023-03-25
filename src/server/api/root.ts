import { createTRPCRouter } from '~/server/api/trpc';
import { playlistRouter } from '~/server/api/routers/playlist'
import { trackRouter } from './routers/track';
import { userRouter } from './routers/user';
import { duelRouter } from './routers/duel';

export const appRouter = createTRPCRouter({
  playlist: playlistRouter,
  track: trackRouter,
  user: userRouter,
  duel: duelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
