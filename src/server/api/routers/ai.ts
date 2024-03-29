import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Configuration, OpenAIApi } from "openai";
import { type Track } from "~/utils/types";
import { getAccessToken } from "~/utils/api";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface RecommendedTrack {
  title: string;
  artist: string;
}

export const aiRouter = createTRPCRouter({
  getAiRecommendedTracks: publicProcedure
    .input(z.object({ userId: z.string(), selectedTracks: z.string().array(), tracksInStore: z.boolean() }))
    .query(async ({ ctx, input }) => {
      if(!input.userId || input.selectedTracks.length === 0 || input.tracksInStore) return []
      
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: input.userId
        }
      });

      try {
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {'role': 'system', 'content': 'You should only reply with code and no other additional text in your response.'},
            {'role': 'user', 'content': `Provide a list of 2 songs that are similar to the following: ${input.selectedTracks.map((trackName) => trackName).join(', ')}, in the form of an array of json objects with the song title and artist name as properties`}
          ],
          temperature: 0.6,
          max_tokens: 75,
        });

        const content = completion.data.choices[0]?.message?.content
        if(!content) return []

        const recommendedTracks = content.slice(content.indexOf('['), content.lastIndexOf(']') + 1)
        const tracks = JSON.parse(recommendedTracks) as RecommendedTrack[]
        
        const spotifyTracks = await Promise.all(tracks.map(async (track) => {
          return await findTrack(account?.refresh_token ?? '', track)
        }))

        console.log(spotifyTracks, 'SPOTIFY TRACKS ++++++++++++++++++')
        return spotifyTracks as Track[]
      } catch (error) {
        console.log(error, 'ERROR ++++++++++++++++++')
      }
    }),

  getTrackImpact: publicProcedure
    .input(z.object({ text: z.string().nullable() }))
    .query( async ({ input }) => {
      if(!input.text || input.text.length === 0) return ''

      try {
        const completion = await openai.createCompletion({
          model: 'text-davinci-003', //gpt-3.5-turbo
          prompt: `In two sentences, ${input.text}`,
          temperature: 0.6,
          max_tokens: 50,
        });

        console.log(completion.data.choices[0]?.text, 'COMPLETION ++++++++++++++++++')
  
        return completion.data.choices[0]?.text
      } catch (error) {
        console.log(error)
      }
    }),

  findRecommendedTracks: publicProcedure
    .input(z.object({ userId: z.string(), track: z.object({ title: z.string(), artist: z.string() }) }))
    .query(async ({ ctx, input }) => {
      if(!input) return null
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: input.userId
        }
      });

      const tracks = await findTrack(account?.refresh_token ?? '', input.track)
      return tracks ?? []
    })
});

async function findTrack(refresh_token: string, track: { title: string, artist: string }) {
  const { access_token } = await getAccessToken(refresh_token)
  const query = `${track.title} ${track.artist}`

  const tracks = await(await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).json() as { tracks: { items: Track[] }}

  return tracks.tracks.items[0]
}
