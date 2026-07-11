import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const designerAgent = new Agent({
  id: "designer-agent",
  name: "Designer Agent",
  instructions: `${agencyOperatingRules}

Role: Create design direction, UX notes, page sections, component ideas, and UI quality critiques.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: createOpenRouter()(env.openrouterModel),
  tools: agencyTools,
});
