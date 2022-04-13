import http from 'http';

import * as trpc from '@trpc/server';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ws from 'ws';
import { z } from 'zod';
import 'dotenv/config';

import { registrationHandler } from './handlers';
import { loadEnv } from './utils/environment';

const env = loadEnv();

const doc = new GoogleSpreadsheet(env.GOOGLE_SPREADSHEET_ID);

type Context = Record<string, unknown>;

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
  });

export type AppRouter = typeof appRouter;

// http server
const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    return {};
  },
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
