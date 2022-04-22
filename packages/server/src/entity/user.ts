import { z } from 'zod';

export const userGetInput = z.object({
  identityCardNumber: z.string().nonempty().optional(),
  contactNumber: z.string().nonempty().optional(),
});
