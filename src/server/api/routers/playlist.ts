import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; // protectedProcedure,
import { getAccessToken } from "~/utils/api";
import { type Playlist } from "~/utils/types";

const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const CREATE_PLAYLIST_ENDPOINT = (user_id: string) => `https://api.spotify.com/v1/users/${user_id}/playlists`;
const PLAYLIST_BY_ID_ENDPOINT = (playlist_id: string) => `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

interface PlaylistsData {
  items: Playlist[]
}

interface CreatedPlaylistData {
  id: string,
  name: string,
  description: string,
  href: string,
  collaborative: boolean,
  public: boolean,
}

export const playlistRouter = createTRPCRouter({
  createPlaylist: publicProcedure
    .input(z.object({ userId: z.string(), userSpotifyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if(!input) return null
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: input.userId
        }
      });

      const playlist = await createPlaylist(account?.refresh_token ?? '', input.userSpotifyId)
      return playlist
    }),

  getUserPlaylists: publicProcedure
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

async function createPlaylist(refresh_token: string, userSpotifyId: string) {
  const { access_token  } = await getAccessToken(refresh_token);

  const playlist = await(await fetch(CREATE_PLAYLIST_ENDPOINT(userSpotifyId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'TEST PLAYLIST',
      description: 'My Playlist Description',
      public: false,
    }),
  })).json() as CreatedPlaylistData

  return playlist
}

async function getUsersPlaylists(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token);

  const userPlaylists = await(await fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistsData

  return userPlaylists
}

async function getPlaylistById(refresh_token: string, playlistId: string) {
  const { access_token } = await getAccessToken(refresh_token)

  const playlist = await(await fetch(PLAYLIST_BY_ID_ENDPOINT(playlistId), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistsData

  return playlist
}
