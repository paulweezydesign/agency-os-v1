export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  agencyUserId: process.env.AGENCYOS_USER_ID ?? "paul",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4.1",
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017",
  mongodbDbName: process.env.MONGODB_DB_NAME ?? "agency_os_v1",
  composioCallbackUrl:
    process.env.COMPOSIO_CALLBACK_URL ??
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/integrations/callback`,
};
