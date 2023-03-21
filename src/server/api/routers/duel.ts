import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
      const duelInDb = await ctx.prisma.duel.findFirst({
        where: {
          track1Id: input.track1Id,
          track2Id: input.track2Id,
        }
      })

      if(duelInDb) {
        const duelWithUser = await ctx.prisma.duel.findFirst({
          where: {
            seenByUser: {
              some: {
                id: input.userId
              }
            }
          }
        })

        if(duelWithUser) return duelWithUser

        const updatedDuelWithUser = await ctx.prisma.duel.update({
          where: { id: duelInDb.id },
          data: {
            seenByUser: {
              connect: { id: input.userId }
            }
          }
        })

        return updatedDuelWithUser
      }

      const newDuel = await ctx.prisma.duel.create({
        data: {
          track1Id: input.track1Id,
          track2Id: input.track2Id,
          userId: input.userId,
          winnerId: input.winnerId,
          loserId: input.loserId,
        }
      })

      const updatedDuelWithUser = await ctx.prisma.duel.update({
        where: { id: newDuel.id },
        data: {
          seenByUser: {
            connect: { id: input.userId }
          }
        }
      })

      console.log(updatedDuelWithUser, 'DUEL UPDATED WITH USER')
      return updatedDuelWithUser;
    }),
});
