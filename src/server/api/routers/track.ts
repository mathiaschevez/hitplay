import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "~/server/api/trpc";
import { getAccessToken } from "~/utils/api";
import { type Track } from "~/utils/types";

const TRACK_ENDPOINT = 'https://api.spotify.com/v1/tracks/6rPO02ozF3bM7NnOV4h6s2';
const TRACKS_BY_PLAYLIST_ENDPOINT = (playlist_id: string) => `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`

type PlaylistTrack = {
  track: Track
}
interface PlaylistTracksData {
  items: PlaylistTrack[]
}

export const trackRouter = createTRPCRouter({
  getTrack: publicProcedure
  .input(z.string() || z.null())
  .query(async ({ ctx, input }) => {
    if(!input) return null
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: input
      }
    });

    const track = await getTrack(account?.refresh_token ?? '')
    return track
  }),
  getTracksByPlaylist: publicProcedure
  .input(z.object({ userId: z.string(), playlistId: z.string() }))
  .query(async ({ ctx, input }) => {
    if(!input) return null
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: input.userId
      }
    });

    const tracks = await getTracksByPlaylist(account?.refresh_token ?? '', input.playlistId)
    return tracks.items
  })
  // getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
  //   return ctx.prisma.user.findFirst({
  //     where: {
  //       id: input,
  //     },
  //   });
  // }),
});

async function getTracksByPlaylist(refresh_token: string, playlistId: string) {
  const { access_token } = await getAccessToken(refresh_token);

  const tracks = await(await fetch(TRACKS_BY_PLAYLIST_ENDPOINT(playlistId), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistTracksData

  return tracks
}

async function getTrack(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token);

  const track = await(await fetch(TRACK_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as Track

  return track
}