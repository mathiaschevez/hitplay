// import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "~/server/api/trpc";

type Item = {
  name: string
}

interface PlaylistsData {
  items: Item[]
}

const client_id = process.env.SPOTIFY_CLIENT_ID ?? ''
const client_secret = process.env.SPOTIFY_CLIENT_SECRET ?? ''
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

export const playlistRouter = createTRPCRouter({
  getPlaylists: publicProcedure
  .query(async ({ ctx }) => {
    const accounts = await ctx.prisma.account.findMany();

    const userPlaylists = await getUsersPlaylists(accounts[0]?.refresh_token ?? '')

    return userPlaylists.items
  }),
  // getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
  //   return ctx.prisma.user.findFirst({
  //     where: {
  //       id: input,
  //     },
  //   });
  // }),
});

export const getAccessToken = async (refresh_token: string): Promise<{access_token: string}> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  });

  return response.json() as Promise<{access_token: string}>
};

export const getUsersPlaylists = async (refresh_token: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  const userPlaylists = await(await fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistsData

  return userPlaylists
};