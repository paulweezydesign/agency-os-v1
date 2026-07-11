import { env } from "@/lib/env";
import { collections } from "@/lib/mongodb/collections";
import type { IntegrationConnectionDoc } from "@/lib/mongodb/types";
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

type CallbackStatus = "success" | "failed" | "error" | string | undefined;

export function isAgencyToolkit(value: string): value is AgencyToolkit {
  return (defaultToolkits as readonly string[]).includes(value);
}

export async function getComposioSession(userId = env.agencyUserId) {
  const composio = getComposioClient();
  return composio.create(userId, {
    manageConnections: {
      callbackUrl: env.composioCallbackUrl,
    },
    toolkits: [...defaultToolkits],
    // Preload no tools eagerly — avoids Composio's large-toolset/API caps.
    // Agents can still fetch session-scoped tools on demand.
    preload: { tools: [] },
  });
}

export async function createConnectLink(toolkit: AgencyToolkit, userId = env.agencyUserId) {
  const session = await getComposioSession(userId);
  const request = await session.authorize(toolkit, {
    callbackUrl: `${env.appUrl}/integrations/callback?toolkit=${toolkit}`,
  });

  const c = await collections();
  const now = new Date();
  await c.integrationConnections.updateOne(
    { userId, toolkit },
    {
      $set: {
        status: "pending",
        updatedAt: now,
      },
      $setOnInsert: {
        userId,
        toolkit,
        createdAt: now,
      },
    },
    { upsert: true },
  );

  return request.redirectUrl;
}

export async function syncConnectionFromCallback({
  toolkit,
  status,
  connectedAccountId,
  userId = env.agencyUserId,
}: {
  toolkit: AgencyToolkit;
  status: CallbackStatus;
  connectedAccountId?: string;
  userId?: string;
}) {
  const connectionStatus: IntegrationConnectionDoc["status"] =
    status === "success" ? "active" : status === "failed" || status === "error" ? "disconnected" : "pending";

  const c = await collections();
  const now = new Date();
  await c.integrationConnections.updateOne(
    { userId, toolkit },
    {
      $set: {
        status: connectionStatus,
        connectedAccountId,
        updatedAt: now,
        metadata: {
          callbackStatus: status ?? "unknown",
          lastCallbackAt: now.toISOString(),
        },
      },
      $setOnInsert: {
        userId,
        toolkit,
        createdAt: now,
      },
    },
    { upsert: true },
  );

  return connectionStatus;
}

export async function getStoredIntegrationConnections(userId = env.agencyUserId) {
  const c = await collections();
  const rows = await c.integrationConnections
    .find({ userId, toolkit: { $in: [...defaultToolkits] } })
    .sort({ toolkit: 1 })
    .toArray();

  return new Map(rows.map((row) => [row.toolkit, row]));
}

export async function getMastraComposioTools(userId = env.agencyUserId) {
  const session = await getComposioSession(userId);
  return session.tools();
}
