const envKeys = [
  'GOOGLE_SPREADSHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL',
  'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
] as const;

type Env = Record<typeof envKeys[number], string>;

/**
 * Load required environment variables, throw an error
 * if one of it is not found.
 * @returns {Env} An object of environment variables
 */
export const loadEnv = (): Env => {
  const env: Partial<Env> = {};
  envKeys.forEach((key) => {
    if (!process.env[key]) throw new Error(`'${key}' is not found in environment.`);
    env[key] = process.env[key];
  });
  return env as Env;
};
