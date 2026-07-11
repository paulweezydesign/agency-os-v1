import { MongoClient, type Db } from "mongodb";
import { env } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __agencyosMongoClient: MongoClient | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!globalThis.__agencyosMongoClient) {
    globalThis.__agencyosMongoClient = new MongoClient(env.mongodbUri);
    await globalThis.__agencyosMongoClient.connect();
  }
  return globalThis.__agencyosMongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(env.mongodbDbName);
}
