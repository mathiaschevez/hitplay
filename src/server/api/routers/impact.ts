import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const impactRouter = createTRPCRouter({
  getTrackImpact: publicProcedure
    .input(z.object({ text: z.string().nullable() }))
    .query( async ({ input }) => {
      if(!input.text || input.text.length === 0) return ''

      try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
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