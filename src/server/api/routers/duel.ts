import { z } from 'zod';

import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "~/server/api/trpc";

export const duelRouter = createTRPCRouter({
  createDuel: publicProcedure
    .input(z.object({
      track1Id: z.string(),
      track2Id: z.string(),
      userId: z.string(),
      winnerId: z.string(),
      loserId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const duel = await ctx.prisma.duel.create({
        data: {
          track1Id: input.track1Id,
          track2Id: input.track2Id,
          userId: input.userId,
          winnerId: input.winnerId,
          loserId: input.loserId,
        }
      })

      // const updatedDuel = await ctx.prisma.duel.update({
      //   where: { id: duel.id },
      //   data: { winnerId: input.track1Id, loserId: input.track2Id }
      // })

      console.log(duel, 'DUEL CREATED')
      return duel;
    })

  // updateDuelWithWinnerAndLoser: publicProcedure
  //   .input(z.object({
  //     duelId: z.string(),
  //     winnerId: z.string(),
  //     loserId: z.string(),
  //   }))
  //   .mutation(async ({ ctx, input }) => {
  //     const updatedDuel = await ctx.prisma.duel.update({
  //       where: { id: input.duelId },
  //       data: { winnerId: input.winnerId, loserId: input.loserId }
  //     })

  //     console.log(updatedDuel, 'DUEL UPDATED')
  //     return updatedDuel;
  //   })
});
