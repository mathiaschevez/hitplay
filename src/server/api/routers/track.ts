import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; // protectedProcedure,
import { getAccessToken } from "~/utils/api";
import { type PlaylistTrack } from "~/utils/types";

const TOP_ONE_HUNDRED_ALL_TIME_ENDPOINT = 'https://api.spotify.com/v1/playlists/5ABHKGoOzxkaa28ttQV9sE?si=d5525acac0d34e6d/tracks'
const TRACKS_BY_PLAYLIST_ENDPOINT = (playlist_id: string) => `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`

interface PlaylistTracksData {
  items: PlaylistTrack[]
}

interface PlaylistByIdData {
  tracks: PlaylistTracksData
}

export const trackRouter = createTRPCRouter({
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
      return ctx.prisma.track.findMany({
        include: {
          winnerOf: true,
          loserOf: true
        }
      })
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
});

// SPOTIFY API CALLS
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