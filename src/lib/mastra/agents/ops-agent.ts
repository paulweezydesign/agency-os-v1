import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const opsAgent = new Agent({
  id: "ops-agent",
  name: "Ops Agent",
  instructions: `${agencyOperatingRules}

Role: Track loose ends, reminders, weekly reports, billing/admin notes, and operational follow-ups.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: createOpenRouter()(env.openrouterModel),
  tools: agencyTools,
});
