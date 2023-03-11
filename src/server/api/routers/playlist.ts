// import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "~/server/api/trpc";

const client_id = process.env.SPOTIFY_CLIENT_ID ?? ''
const client_secret = process.env.SPOTIFY_CLIENT_SECRET ?? ''
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

export const playlistRouter = createTRPCRouter({
  getPlaylists: publicProcedure
  .query(async ({ ctx }) => {
    const accounts = await ctx.prisma.account.findMany();

    const res = await getUsersPlaylists(accounts[0]?.refresh_token ?? '')
    return res.json()
  }),
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

  return response.json()
};

export const getUsersPlaylists = async (refresh_token: string) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};