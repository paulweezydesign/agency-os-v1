import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { env } from "@/lib/env";
import { agencyOperatingRules } from "./instructions";
import { agencyTools } from "../tools/agency-tools";

export const engineerAgent = new Agent({
  id: "engineer-agent",
  name: "Engineer Agent",
  instructions: `${agencyOperatingRules}

Role: Plan JS/React/Mastra/Mongo implementation work, repo tasks, PR notes, and technical risks.

When outside integrations are needed, draft the action and queue approval unless the workflow explicitly says it is safe to execute.`,
  model: openai(env.openaiModel),
  tools: agencyTools,
});
