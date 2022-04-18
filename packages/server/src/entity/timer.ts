import { Timer as PrismaTimer } from '@prisma/client';
import { z } from 'zod';

export const timerInput = z.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

export type Timer = PrismaTimer;
