import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Configuration, OpenAIApi } from "openai";
import { selectedRecommendedTracks } from "~/store/reducers/aiSlice";
import { store } from "~/store/store";

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
    .input(z.string().array())
    .query(async ({ input }) => {
      const recommendedTracks = selectedRecommendedTracks(store.getState())
      if(input.length === 0 || recommendedTracks.length > 0) return recommendedTracks

      try {
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {'role': 'system', 'content': 'Respond to the following prompt with an array of objects with the song title and artist name as properties'},
            {'role': 'user', 'content': `Provide a list of songs that are similar to the following: ${input.map((trackName) => trackName).join(', ')}, in the form of an array of objects with the song title and artist name as properties`}
          ],
          temperature: 0.6,
          max_tokens: 50,
        });

        if(!completion.data.choices[0]?.message?.content) return []
        store.dispatch({ 
          type: 'ai/setRecommendedTracks', 
          payload: JSON.parse(completion.data.choices[0]?.message?.content) as RecommendedTrack[]
        })
        return JSON.parse(completion.data.choices[0]?.message?.content) as RecommendedTrack[]
      } catch (error) {
        console.log(error)
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
    })
});