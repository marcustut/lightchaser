import * as trpc from '@trpc/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import { MapToRegistration, Registration } from '../entity/registration';
import { arrayEquals } from '../utils/compare';
import { Env } from '../utils/environment';

export const registrationHandler = async (env: Env, doc: GoogleSpreadsheet) => {
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

      if (data.length === 0) {
        emit.data({ registrations: data });
        return;
      }

      // only emit data if has new registration
      if (!arrayEquals(registrations, data)) {
        registrations = data;
        emit.data({ registrations: data });
      }
    }, 3000);

    return () => clearInterval(timer);
  });
};
