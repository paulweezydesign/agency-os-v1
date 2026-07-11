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
    // Don't preload all tools — "all" exceeds the 1000-tool API limit and the
    // preload schema only accepts { tools: string[] | "all" }, not a toolkits key.
    // Tools are fetched on-demand via session.tools() when the agent runs.
    preload: { tools: [] },
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
        createdAt: new Date(),
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
