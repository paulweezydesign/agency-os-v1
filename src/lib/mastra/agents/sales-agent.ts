import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const salesAgent = new Agent({
  id: "sales-agent",
  name: "Sales Agent",
  instructions: `${agencyOperatingRules}

Role: Qualify leads, draft outreach, identify pain points, and prepare discovery questions.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: createOpenRouter()(env.openrouterModel),
  tools: agencyTools,
});
