import { z } from "zod";
import { getAccessToken } from "~/utils/api";
import { type Artist, type Track } from "~/utils/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

const USER_ENDPOINT = 'https://api.spotify.com/v1/me'
const USER_TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks'
const USER_TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists'

interface UserData {
  id: string
  display_name: string
  email: string
}

interface UserTopTracksData {
  items: Track[]
}

interface UserTopAlbumsData {
  items: Artist[]
}

export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure
  .input(z.string() || z.null())
  .query(async ({ ctx, input }) => {
    if(!input) return null
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: input
      }
    });

    const user = await getCurrentUser(account?.refresh_token ?? '')
    return user
  }),

  getCurrentUserTopTracks: publicProcedure
  .input(z.string() || z.null())
  .query(async ({ ctx, input }) => {
    if(!input) return null
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: input
      }
    });

    const tracks = await getCurrentUserTopTracks(account?.refresh_token ?? '')
    return tracks
  }),

  getCurrentUserTopArtists: publicProcedure
  .input(z.string() || z.null())
  .query(async ({ ctx, input }) => {
    if(!input) return null
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: input
      }
    });

    const artists = await getCurrentUserTopArtists(account?.refresh_token ?? '')
    return artists
  })
});

async function getCurrentUser(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token)

  const user = await(await fetch(USER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as UserData

  return user
}

async function getCurrentUserTopTracks(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token)

  const userTopTracks = await(await fetch(USER_TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as UserTopTracksData

  return userTopTracks
}

async function getCurrentUserTopArtists(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token)

  const userTopArtists = await(await fetch(USER_TOP_ARTISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as UserTopAlbumsData

  return userTopArtists
}