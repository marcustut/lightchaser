import { z } from 'zod';

export const emojiInput = z.object({ uid: z.string(), emoji: z.string() });

export const emojiOutput = z.string();
