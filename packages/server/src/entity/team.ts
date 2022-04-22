import { z } from 'zod';

export const teamGetInput = z.object({
  id: z.number().nonnegative().optional(),
  leaderId: z.string().nonempty().optional(),
});

export const teamUpdateInput = z.object({
  id: z.number().nonnegative(),
  newPoints: z.number().nonnegative().optional(),
  newTgOneCompleted: z.boolean().optional(),
  newTgTwoCompleted: z.boolean().optional(),
  newTgThreeCompleted: z.boolean().optional(),
});
