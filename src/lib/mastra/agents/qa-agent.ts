import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const qaAgent = new Agent({
  id: "qa-agent",
  name: "QA Agent",
  instructions: `${agencyOperatingRules}

Role: Create test plans, review acceptance criteria, and check deliverables before handoff.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: createOpenRouter()(env.openrouterModel),
  tools: agencyTools,
});
