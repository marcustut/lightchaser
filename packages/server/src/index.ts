import http from 'http';

import * as trpc from '@trpc/server';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ws from 'ws';
import { z } from 'zod';
import 'dotenv/config';

import { MapToRegistration, Registration } from './entity/registration';
import { arrayEquals } from './utils/compare';
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
    async resolve() {
      await doc.useServiceAccountAuth({
        client_email: env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      });
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];

      let registrations: Registration[] = [];

      return new trpc.Subscription<{ registrations: Registration[] }>((emit) => {
        const timer = setInterval(async () => {
          const rows = await sheet.getRows();
          const data = rows.map(MapToRegistration);

          // only emit data if has new registration
          if (!arrayEquals(registrations, data)) {
            registrations = data;
            emit.data({ registrations: data });
          }
        }, 3000);

        return () => clearInterval(timer);
      });
    },
  });

export type AppRouter = typeof appRouter;

// http server
const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    return {};
  },
});

const server = http.createServer((req, res) => {
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
});

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

server.listen(2022);
