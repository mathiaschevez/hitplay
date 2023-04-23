import { z } from "zod";
import { getAccessToken } from "~/utils/api";
import { type Artist, type Track } from "~/utils/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

const USER_ENDPOINT = 'https://api.spotify.com/v1/me'
const USER_TOP_TRACKS_ENDPOINT = (timeRange: 'short_term' | 'medium_term' | 'long_term') => `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`
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

const TimeRangeValues = ['short_term', 'medium_term', 'long_term'] as const;

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
    .input(z.object({ userId: z.string(), timeRange: z.optional(z.enum(TimeRangeValues)) }))
    .query(async ({ ctx, input }) => {
      if(!input) return null
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: input.userId
        }
      });

      const timeRange = input.timeRange ?? 'long_term'

      const tracks = await getCurrentUserTopTracks(account?.refresh_token ?? '', timeRange)
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

// SPOTIFY API CALLS
async function getCurrentUser(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token)

  const user = await(await fetch(USER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as UserData

  return user
}

async function getCurrentUserTopTracks(refresh_token: string, timeRange: 'short_term' | 'medium_term' | 'long_term') {
  const { access_token } = await getAccessToken(refresh_token)

  const userTopTracks = await(await fetch(USER_TOP_TRACKS_ENDPOINT(timeRange), {
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