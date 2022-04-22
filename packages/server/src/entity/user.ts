import { z } from 'zod';

export const userGetInput = z.object({
  identityCardNumber: z.string().optional(),
  contactNumber: z.string().optional(),
});

export { User } from '@prisma/client';
