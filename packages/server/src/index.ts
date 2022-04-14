import { EventEmitter } from 'events';
import http from 'http';

import { PrismaClient, Timer } from '@prisma/client';
import * as trpc from '@trpc/server';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ws from 'ws';
import { z } from 'zod';
import 'dotenv/config';

import { emojiInput, emojiOutput } from './entity/emoji';
import { timerInput } from './entity/timer';
import { registrationHandler } from './handlers';
import { Context } from './utils/context';
import { loadEnv } from './utils/environment';

const CACHE_TIMEOUT = 10 * 1000; // 10 seconds
const MESSAGE_LIMIT = 5;

const env = loadEnv();
const doc = new GoogleSpreadsheet(env.GOOGLE_SPREADSHEET_ID);
const ee = new EventEmitter();
const prisma = new PrismaClient();

let emojiCache: Record<string, number> = {};

// reset the cache every CACHE_TIMEOUT
setInterval(() => {
  emojiCache = {};
  console.log(`${new Date()}: cache is cleared`);
}, CACHE_TIMEOUT);

export const appRouter = trpc
  .router<Context>()
  .query('hello', {
    input: z.object({ name: z.string() }).nullish(),
    resolve: ({ input }) => {
      return {
        text: `hello ${input?.name ?? 'world!'}`,
      };
    },
  })
  .subscription('registration', {
    resolve: async () => await registrationHandler(env, doc),
  })
  .subscription('onEmoji', {
    resolve: async () => {
      return new trpc.Subscription<z.infer<typeof emojiOutput>>((emit) => {
        // handle when emoji is added
        const onAdd = (data: z.infer<typeof emojiInput>) => {
          emit.data(data.emoji);
        };

        // trigger `onAdd()` when `addEmoji` is triggered in our event emitter
        ee.on('addEmoji', onAdd);

        // unsubscribe function when client disconnects or stop subscribing
        return () => {
          ee.off('addEmoji', onAdd);
        };
      });
    },
  })
  .mutation('addEmoji', {
    input: emojiInput,
    resolve: ({ input }) => {
      // if user exceed MESSAGE_LIMIT then reject
      if (emojiCache[input.uid] >= MESSAGE_LIMIT) {
        console.error(`${input.uid} is rejected`);
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'you have exceeded the limit, try again later.',
        });
      }

      // if user not cached before, init to 1
      if (emojiCache[input.uid] === undefined) emojiCache[input.uid] = 1;
      else emojiCache[input.uid]++;

      // trigger 'addEmoji' to broadcast payload to clients
      ee.emit('addEmoji', input);
    },
  })
  .subscription('timer.realtime', {
    resolve: async () => {
      const timer = await prisma.timer.findUnique({ where: { id: 1 } });
      if (!timer)
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '`Timer` table is not initialized properly.',
        });

      return new trpc.Subscription<string>((emit) => {
        // broadcast timer
        const broadcast = (timer: Timer) => emit.data(timer.endAt.toISOString());
        // broadcast the timer to listener on connect
        broadcast(timer);

        // listen on db updates
        ee.on('timer.update', broadcast);

        // unsubscribe listener
        return () => ee.off('timer.update', broadcast);
      });
    },
  })
  .mutation('timer.update', {
    input: timerInput,
    resolve: async ({ input }) => {
      const timer = await prisma.timer.update({
        data: { endAt: input },
        where: { id: 1 },
      });
      ee.emit('timer.update', timer);
    },
  });

export type AppRouter = typeof appRouter;

// http server
const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    return {};
  },
  teardown: async () => await prisma.$disconnect(),
});

const createServerHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PATCH');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  handler(req, res);
};

const server = http.createServer(createServerHandler);

// ws server
const wss = new ws.Server({ server });
applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext() {
    return {};
  },
});

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log('✅ WebSocket Server listening on ws://localhost:2022');

server.listen(process.env.PORT ?? 2022);
