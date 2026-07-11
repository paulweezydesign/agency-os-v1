import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const pmAgent = new Agent({
  id: "pm-agent",
  name: "PM Agent",
  instructions: `${agencyOperatingRules}

Role: Break briefs into milestones, tasks, owners, timelines, and status updates.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: openai(env.openaiModel),
  tools: agencyTools,
});
