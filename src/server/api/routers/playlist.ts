import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "~/server/api/trpc";
import { getAccessToken } from "~/utils/api";
import { type Playlist } from "~/utils/types";

const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const PLAYLIST_BY_ID_ENDPOINT = (playlist_id: string) => `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`

interface PlaylistsData {
  items: Playlist[]
}

export const playlistRouter = createTRPCRouter({
  getPlaylists: publicProcedure
  .input(z.string() || z.null())
  .query(async ({ ctx, input }) => {
    if(!input) return null
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: input
      }
    });

    const userPlaylists = await getUsersPlaylists(account?.refresh_token ?? '')
    return userPlaylists.items
  }),
  getPlaylistById: publicProcedure
  .input(z.object({ userId: z.string(), playlistId: z.string() }))
  .query(async ({ ctx, input }) => {
    if(!input) return null
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: input.userId
      }
    });

    const playlist = await getPlaylistById(account?.refresh_token ?? '', input.playlistId)
    return playlist
  }),
});

export const getUsersPlaylists = async (refresh_token: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  const userPlaylists = await(await fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistsData

  return userPlaylists
};

export const getPlaylistById = async (refresh_token: string, playlistId: string) => {
  const { access_token } = await getAccessToken(refresh_token)

  const playlist = await(await fetch(PLAYLIST_BY_ID_ENDPOINT(playlistId), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistsData

  return playlist
}
