import { createTool } from "@mastra/core/tools";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { collections, nowTimestamps } from "@/lib/mongodb/collections";

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, "Must be a MongoDB ObjectId string");

export const createLeadTool = createTool({
  id: "agencyos-create-lead",
  description: "Create a new lead record in AgencyOS MongoDB.",
  inputSchema: z.object({
    name: z.string(),
    company: z.string().optional(),
    email: z.string().email().optional(),
    source: z.string().optional(),
    problem: z.string(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    rawIntake: z.record(z.string(), z.unknown()).optional(),
  }),
  outputSchema: z.object({ leadId: z.string() }),
  execute: async (input) => {
    const c = await collections();
    const result = await c.leads.insertOne({
      ...input,
      status: "new",
      ...nowTimestamps(),
    });
    return { leadId: result.insertedId.toString() };
  },
});

export const createProjectTool = createTool({
  id: "agencyos-create-project",
  description: "Create a project record from a qualified lead or brief.",
  inputSchema: z.object({
    name: z.string(),
    type: z.enum(["landing_page", "web_app", "automation", "ai_agent", "other"]),
    leadId: objectIdString.optional(),
    clientId: objectIdString.optional(),
    briefId: objectIdString.optional(),
    goals: z.array(z.string()).default([]),
    assignedAgentIds: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({ projectId: z.string() }),
  execute: async (input) => {
    const c = await collections();
    const result = await c.projects.insertOne({
      name: input.name,
      type: input.type,
      leadId: input.leadId ? new ObjectId(input.leadId) : undefined,
      clientId: input.clientId ? new ObjectId(input.clientId) : undefined,
      briefId: input.briefId ? new ObjectId(input.briefId) : undefined,
      goals: input.goals,
      assignedAgentIds: input.assignedAgentIds,
      status: "planning",
      ...nowTimestamps(),
    });
    return { projectId: result.insertedId.toString() };
  },
});

export const createTaskTool = createTool({
  id: "agencyos-create-task",
  description: "Create a project task with acceptance criteria and optional owner agent.",
  inputSchema: z.object({
    projectId: objectIdString,
    title: z.string(),
    description: z.string().optional(),
    ownerAgentId: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    acceptanceCriteria: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({ taskId: z.string() }),
  execute: async (input) => {
    const c = await collections();
    const result = await c.tasks.insertOne({
      projectId: new ObjectId(input.projectId),
      title: input.title,
      description: input.description,
      ownerAgentId: input.ownerAgentId,
      priority: input.priority,
      acceptanceCriteria: input.acceptanceCriteria,
      status: "todo",
      ...nowTimestamps(),
    });
    return { taskId: result.insertedId.toString() };
  },
});

export const queueExternalApprovalTool = createTool({
  id: "agencyos-queue-external-approval",
  description: "Queue a human approval before executing a client-facing or external-system action.",
  inputSchema: z.object({
    requestedByAgentId: z.string(),
    projectId: objectIdString.optional(),
    title: z.string(),
    description: z.string(),
    externalToolkit: z.string(),
    externalAction: z.string(),
    payload: z.record(z.string(), z.unknown()),
  }),
  outputSchema: z.object({ approvalId: z.string(), status: z.literal("pending") }),
  execute: async (input) => {
    const c = await collections();
    const result = await c.approvals.insertOne({
      ...input,
      projectId: input.projectId ? new ObjectId(input.projectId) : undefined,
      status: "pending",
      ...nowTimestamps(),
    });
    return { approvalId: result.insertedId.toString(), status: "pending" as const };
  },
});

export const agencyTools = {
  createLeadTool,
  createProjectTool,
  createTaskTool,
  queueExternalApprovalTool,
};
