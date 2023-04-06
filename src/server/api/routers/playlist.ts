import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; // protectedProcedure,
import { getAccessToken } from "~/utils/api";
import { type Playlist, type PlaylistTrack } from "~/utils/types";

const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const CREATE_PLAYLIST_ENDPOINT = (user_id: string) => `https://api.spotify.com/v1/users/${user_id}/playlists`;
const PLAYLIST_BY_ID_ENDPOINT = (playlist_id: string) => `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

interface PlaylistsList{
  items: Playlist[]
}

interface UserPlaylist {
  items: PlaylistTrack[]
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
    .input(z.object({ userId: z.string(), userSpotifyId: z.string(), title: z.string(), description: z.string()}))
    .mutation(async ({ ctx, input }) => {
      if(!input.userId || !input.userSpotifyId || input.title.length === 0) return null
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: input.userId
        }
      });

      const playlist = await createPlaylist(account?.refresh_token ?? '', input.userSpotifyId, input.title, input.description)
      console.log(playlist, 'BACKEND PLAYLIST')
      return playlist
    }),

  addTracksToPlaylist: publicProcedure
    .input(z.object({ userId: z.string(), playlistId: z.string(), trackList: z.string().array()}))
    .mutation(async ({ ctx, input }) => {
      if(!input.userId || !input.playlistId || !input.trackList) return null
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: input.userId
        }
      })

      const playlist = await addTracksToUserPlaylist(account?.refresh_token ?? '', input.playlistId, input.trackList)
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

async function createPlaylist(refresh_token: string, userSpotifyId: string, title: string, description: string) {
  const { access_token  } = await getAccessToken(refresh_token);

  const playlist = await(await fetch(CREATE_PLAYLIST_ENDPOINT(userSpotifyId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${title}`,
      description: `${description}`,
      public: false,
    }),
  })).json() as CreatedPlaylistData

  return playlist
}

async function addTracksToUserPlaylist(refresh_token: string, playlistId: string, trackList: string[]) {
  const { access_token } = await getAccessToken(refresh_token)

  const playlist = await(await fetch(PLAYLIST_BY_ID_ENDPOINT(playlistId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uris: trackList })
  })).json() as { snapshot_id: string }

  return playlist
}

async function getUsersPlaylists(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token);

  const userPlaylists = await(await fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistsList

  return userPlaylists
}

async function getPlaylistById(refresh_token: string, playlistId: string) {
  const { access_token } = await getAccessToken(refresh_token)

  const playlist = await(await fetch(PLAYLIST_BY_ID_ENDPOINT(playlistId), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as UserPlaylist

  return playlist
}
