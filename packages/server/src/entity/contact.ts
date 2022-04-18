import { Contact as PrismaContact } from '@prisma/client';
import { z } from 'zod';

export const contactAddInput = z.object({
  contactNumber: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const contactUpdateInput = z.object({
  contactNumber: z.string().nonempty(),
  newContactNumber: z.string().nonempty().optional(),
  newName: z.string().nonempty().optional(),
  newDescription: z.string().nonempty().optional(),
});

export const contactDeleteInput = z.string().nonempty();

export type Contact = PrismaContact;
