import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; // protectedProcedure,
import { getAccessToken } from "~/utils/api";
import { type PlaylistTrack, type Track } from "~/utils/types";

const TRACK_ENDPOINT = 'https://api.spotify.com/v1/tracks/6rPO02ozF3bM7NnOV4h6s2';
const TOP_ONE_HUNDRED_ALL_TIME_ENDPOINT = 'https://api.spotify.com/v1/playlists/5ABHKGoOzxkaa28ttQV9sE?si=d5525acac0d34e6d/tracks'
const TRACKS_BY_PLAYLIST_ENDPOINT = (playlist_id: string) => `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`

interface PlaylistTracksData {
  items: PlaylistTrack[]
}

interface PlaylistByIdData {
  tracks: PlaylistTracksData
}

interface TrackFromDb {
  id: string,
  createdAt: Date,
  name: string,
  imageUrl: string,
  previewURL: string,
  winRate?: number,
  lossRate?: number,
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
      return tracks.items ?? []
    }),

  getTopOneHundredAllTimeTracks: publicProcedure
    .input(z.string() || z.null())
    .query(async ({ ctx, input}) => {
      if(!input) return null
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: input
        }
      });

      const tracks = await getTop100AllTimeTracks(account?.refresh_token ?? '')
      return tracks.tracks ?? []
    }),

  createTrack: publicProcedure
    .input(z.object({ 
      id: z.string(), 
      name: z.string(), 
      imageUrl: z.string(), 
      previewURL: z.string() 
    }))
    .mutation(async ({ ctx, input }) => {
      const trackInDb = await ctx.prisma.track.findFirst({
        where: {
          id: input.id
        }
      })

      if(trackInDb) {
        console.log(trackInDb, 'TRACK FOUND IN DB')
        return trackInDb
      }

      const track = await ctx.prisma.track.create({
        data: {
          ...input
        }
      })

      console.log(track, 'CREATED NEW TRACK')
      return track
    }),

    getTracksFromDb: publicProcedure
      .query(({ ctx }) => {
        return ctx.prisma.track.findMany()
      }),

    getTrackWinRates: publicProcedure
      .input(z.array(
        z.object({ 
          id: z.string(),
          createdAt: z.date(),
          name: z.string(),
          imageUrl: z.string(),
          previewURL: z.string(),
        })
      ))
      .query(async ({ ctx, input }) => {
        const newList: TrackFromDb[] = []

        for(const track of input) {
          const duelWins = await ctx.prisma.duel.findMany({
            where: {
              winnerId: track.id
            }
          })

          const duelLosses = await ctx.prisma.duel.findMany({
            where: {
              loserId: track.id
            }
          })

          newList.push({
            ...track,
            winRate: 
              duelWins.length === 0 ? 0 :
              duelLosses.length === 0 ? 100 : 
              duelWins.length / (duelWins.length + duelLosses.length)
          })
        }

        return newList
      })

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

async function getTop100AllTimeTracks(refresh_token: string) {
  const { access_token } = await getAccessToken(refresh_token)

  const tracks = await(await fetch(TOP_ONE_HUNDRED_ALL_TIME_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as PlaylistByIdData

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