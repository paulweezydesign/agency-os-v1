import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const strategistAgent = new Agent({
  id: "strategist-agent",
  name: "Strategist Agent",
  instructions: `${agencyOperatingRules}

Role: Turn intake into positioning, recommended offer, scope, risks, and a client-ready strategy brief.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: openai(env.openaiModel),
  tools: agencyTools,
});
