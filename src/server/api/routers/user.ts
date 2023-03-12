import { z } from "zod";
import { getAccessToken } from "~/utils/api";
import { type Track } from "~/utils/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

const USER_ENDPOINT = 'https://api.spotify.com/v1/me'
const USER_TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks'

interface UserData {
  id: string
  display_name: string
  email: string
}

interface UserTopTracksData {
  items: Track[]
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

    const user = await getCurrentUserTopTracks(account?.refresh_token ?? '')
    return user
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
