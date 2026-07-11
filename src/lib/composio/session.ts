import { env } from "@/lib/env";
import { collections, nowTimestamps } from "@/lib/mongodb/collections";
import { getComposioClient } from "./client";

export const defaultToolkits = [
  "github",
  "linear",
  "slack",
  "googledrive",
  "googledocs",
  "gmail",
] as const;

export type AgencyToolkit = (typeof defaultToolkits)[number];

export async function getComposioSession(userId = env.agencyUserId) {
  const composio = getComposioClient();
  return composio.create(userId, {
    manageConnections: {
      callbackUrl: env.composioCallbackUrl,
    },
    toolkits: [...defaultToolkits],
    // Keep the default meta-tool enabled so an agent can surface a Connect Link when needed.
    preload: { tools: "all" },
  });
}

export async function createConnectLink(toolkit: AgencyToolkit, userId = env.agencyUserId) {
  const session = await getComposioSession(userId);
  const request = await session.authorize(toolkit, {
    callbackUrl: `${env.appUrl}/integrations/callback?toolkit=${toolkit}`,
  });

  const c = await collections();
  await c.integrationConnections.updateOne(
    { userId, toolkit },
    {
      $set: {
        status: "pending",
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        toolkit,
        ...nowTimestamps(),
      },
    },
    { upsert: true },
  );

  return request.redirectUrl;
}

export async function getMastraComposioTools(userId = env.agencyUserId) {
  const session = await getComposioSession(userId);
  return session.tools();
}
