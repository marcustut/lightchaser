import { EventEmitter } from 'events';
import http from 'http';

import { PrismaClient, Team, Timer } from '@prisma/client';
import * as trpc from '@trpc/server';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ws from 'ws';
import { z } from 'zod';
import 'dotenv/config';

import { contactAddInput, contactDeleteInput, contactUpdateInput } from './entity/contact';
import { emojiInput, emojiOutput } from './entity/emoji';
import { teamGetInput, teamUpdateInput } from './entity/team';
import { timerInput } from './entity/timer';
import { userGetInput } from './entity/user';
import { registrationHandler } from './handlers';
import { Context } from './utils/context';
import { loadEnv } from './utils/environment';

const CACHE_TIMEOUT = 10 * 1000; // 10 seconds
const MESSAGE_LIMIT = 5;
const PORT = process.env.PORT || 2022;

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
  })
  .query('timer.get', {
    resolve: async () => {
      const timer = await prisma.timer.findUnique({ where: { id: 1 } });
      if (!timer)
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '`Timer` table is not initialized properly.',
        });
      return timer.endAt.toISOString();
    },
  })
  .subscription('gametimer.realtime', {
    resolve: async () => {
      const timer = await prisma.timer.findUnique({ where: { id: 2 } });
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
        ee.on('gametimer.update', broadcast);

        // unsubscribe listener
        return () => ee.off('gametimer.update', broadcast);
      });
    },
  })
  .mutation('gametimer.update', {
    input: timerInput,
    resolve: async ({ input }) => {
      const timer = await prisma.timer.update({
        data: { endAt: input },
        where: { id: 2 },
      });
      ee.emit('gametimer.update', timer);
    },
  })
  .query('gametimer.get', {
    resolve: async () => {
      const timer = await prisma.timer.findUnique({ where: { id: 2 } });
      if (!timer)
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '`Timer` table is not initialized properly.',
        });
      return timer.endAt.toISOString();
    },
  })
  .mutation('contact.add', {
    input: contactAddInput,
    resolve: async ({ input }) =>
      await prisma.contact.create({
        data: {
          contactNumber: input.contactNumber,
          name: input.name,
          description: input.description,
        },
      }),
  })
  .mutation('contact.delete', {
    input: contactDeleteInput,
    resolve: async ({ input }) => await prisma.contact.delete({ where: { contactNumber: input } }),
  })
  .mutation('contact.update', {
    input: contactUpdateInput,
    resolve: async ({ input }) =>
      await prisma.contact.update({
        where: { contactNumber: input.contactNumber },
        data: {
          contactNumber: input.newContactNumber,
          name: input.newName,
          description: input.newDescription,
        },
      }),
  })
  .query('contact.all', {
    resolve: async () => await prisma.contact.findMany(),
  })
  .query('user.get', {
    input: userGetInput,
    resolve: async ({ input }) => {
      if (input.identityCardNumber)
        return await prisma.user.findUnique({
          where: { identityCardNumber: input.identityCardNumber },
        });
      else if (input.contactNumber)
        return await prisma.user.findFirst({
          where: { contactNumber: { contains: input.contactNumber } },
        });
      else
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'either `identityCardNumber` or `contactNumber` must be provided',
        });
    },
  })
  .query('user.all', {
    resolve: async () => await prisma.user.findMany(),
  })
  .query('team.get', {
    input: teamGetInput,
    resolve: async ({ input }) => {
      if (input.id === null || input.leaderId === null)
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: 'input must not be null' });
      return await prisma.team.findUnique({
        where: { id: input.id, leaderId: input.leaderId },
        include: { User: { orderBy: { identityCardNumber: 'asc' } } },
      });
    },
  })
  .query('team.all', {
    resolve: async () => await prisma.team.findMany(),
  })
  .subscription('team.realtime', {
    resolve: async () => {
      const teams = await prisma.team.findMany();
      return new trpc.Subscription<Team[]>((emit) => {
        // broadcast teams
        const broadcast = (teams: Team[]) => emit.data(teams);
        // broadcast the teams to listener on connect
        broadcast(teams);

        // listen on db updates
        ee.on('team.update', broadcast);

        // unsubscribe listener
        return () => ee.off('team.update', broadcast);
      });
    },
  })
  .mutation('team.update', {
    input: teamUpdateInput,
    resolve: async ({ input }) => {
      await prisma.team.update({
        where: { id: input.id },
        data: {
          points: input.newPoints,
          tgOneCompleted: input.newTgOneCompleted,
          tgTwoCompleted: input.newTgTwoCompleted,
          tgThreeCompleted: input.newTgThreeCompleted,
        },
      });
      ee.emit('team.update', await prisma.team.findMany());
    },
  })
  .subscription('presence.realtime', {
    resolve: async () => {
      return new trpc.Subscription<string>((emit) => {
        // broadcast presence
        const broadcast = (user: string) => emit.data(user);

        // listen on db updates
        ee.on('presence.add', broadcast);

        // unsubscribe listener
        return () => ee.off('presence.add', broadcast);
      });
    },
  })
  .mutation('presence.add', {
    input: z.string(),
    resolve: async ({ input }) => {
      if (input !== '') ee.emit('presence.add', input);
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
console.log(`✅ WebSocket Server listening on ws://localhost:${PORT}`);

server.listen(PORT);
