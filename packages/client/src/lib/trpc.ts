import type { AppRouter } from '@opening/server/dist/index';
import { createReactQueryHooks } from '@trpc/react';

export const trpc = createReactQueryHooks<AppRouter>();
