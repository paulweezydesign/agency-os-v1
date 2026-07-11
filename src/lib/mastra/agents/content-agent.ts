import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const contentAgent = new Agent({
  id: "content-agent",
  name: "Content Agent",
  instructions: `${agencyOperatingRules}

Role: Write proposals, landing-page copy, client summaries, emails, and case-study drafts.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: createOpenRouter()(env.openrouterModel),
  tools: agencyTools,
});
