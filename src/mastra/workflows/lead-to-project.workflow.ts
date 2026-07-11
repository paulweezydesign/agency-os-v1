import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { collections, nowTimestamps } from "@/lib/mongodb/collections";

const intakeSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  source: z.string().optional(),
  problem: z.string(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

const leadCreatedSchema = intakeSchema.extend({ leadId: z.string() });
const briefSchema = leadCreatedSchema.extend({
  brief: z.object({
    title: z.string(),
    summary: z.string(),
    targetAudience: z.string(),
    goals: z.array(z.string()),
    recommendedOffer: z.string(),
    scope: z.array(z.string()),
    risks: z.array(z.string()),
  }),
});

const projectPlanSchema = briefSchema.extend({
  project: z.object({
    name: z.string(),
    type: z.enum(["landing_page", "web_app", "automation", "ai_agent", "other"]),
    assignedAgentIds: z.array(z.string()),
  }),
  tasks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      ownerAgentId: z.string(),
      priority: z.enum(["low", "medium", "high"]),
      acceptanceCriteria: z.array(z.string()),
    }),
  ),
});

const createLeadStep = createStep({
  id: "create-lead",
  inputSchema: intakeSchema,
  outputSchema: leadCreatedSchema,
  execute: async ({ inputData }) => {
    const c = await collections();
    const result = await c.leads.insertOne({
      ...inputData,
      status: "new",
      rawIntake: inputData,
      ...nowTimestamps(),
    });
    return { ...inputData, leadId: result.insertedId.toString() };
  },
});

const draftBriefStep = createStep({
  id: "draft-brief",
  inputSchema: leadCreatedSchema,
  outputSchema: briefSchema,
  execute: async ({ inputData }) => {
    // Deterministic starter brief. Replace with strategistAgent.generate() once prompts are tuned.
    return {
      ...inputData,
      brief: {
        title: `${inputData.company ?? inputData.name} AgencyOS Strategy Brief`,
        summary: inputData.problem,
        targetAudience: "To be refined during discovery.",
        goals: ["Clarify business outcome", "Define MVP scope", "Create client-ready execution plan"],
        recommendedOffer: "AI-assisted design/development sprint",
        scope: ["Discovery", "Strategy", "UX/UI direction", "Implementation plan", "Launch checklist"],
        risks: ["Unclear scope", "Missing brand/content assets", "External integration access not connected"],
      },
    };
  },
});

const createProjectPlanStep = createStep({
  id: "create-project-plan",
  inputSchema: briefSchema,
  outputSchema: projectPlanSchema,
  execute: async ({ inputData }) => {
    return {
      ...inputData,
      project: {
        name: inputData.brief.title.replace(" Strategy Brief", ""),
        type: "web_app" as const,
        assignedAgentIds: ["strategist-agent", "pm-agent", "designer-agent", "engineer-agent", "qa-agent", "content-agent"],
      },
      tasks: [
        {
          title: "Finalize discovery brief",
          description: "Confirm audience, offer, constraints, assets, timeline, and success criteria.",
          ownerAgentId: "strategist-agent",
          priority: "high" as const,
          acceptanceCriteria: ["Brief has goals", "Brief has scope", "Brief has risks"],
        },
        {
          title: "Create project milestones",
          description: "Turn the brief into milestones and a build sequence.",
          ownerAgentId: "pm-agent",
          priority: "high" as const,
          acceptanceCriteria: ["Milestones are ordered", "Each milestone has clear outputs"],
        },
        {
          title: "Draft client proposal",
          description: "Generate a proposal draft from the brief and project plan.",
          ownerAgentId: "content-agent",
          priority: "medium" as const,
          acceptanceCriteria: ["Proposal is client-facing", "Proposal includes scope and next steps"],
        },
      ],
    };
  },
});

const persistProjectStep = createStep({
  id: "persist-project",
  inputSchema: projectPlanSchema,
  outputSchema: z.object({ leadId: z.string(), projectId: z.string(), taskIds: z.array(z.string()) }),
  execute: async ({ inputData }) => {
    const c = await collections();
    const projectResult = await c.projects.insertOne({
      leadId: inputData.leadId as never,
      name: inputData.project.name,
      type: inputData.project.type,
      status: "planning",
      goals: inputData.brief.goals,
      assignedAgentIds: inputData.project.assignedAgentIds,
      ...nowTimestamps(),
    });

    const taskResults = await c.tasks.insertMany(
      inputData.tasks.map((task) => ({
        projectId: projectResult.insertedId,
        title: task.title,
        description: task.description,
        ownerAgentId: task.ownerAgentId,
        priority: task.priority,
        acceptanceCriteria: task.acceptanceCriteria,
        status: "todo" as const,
        ...nowTimestamps(),
      })),
    );

    return {
      leadId: inputData.leadId,
      projectId: projectResult.insertedId.toString(),
      taskIds: Object.values(taskResults.insertedIds).map((id) => id.toString()),
    };
  },
});

export const leadToProjectWorkflow = createWorkflow({
  id: "lead-to-project",
  inputSchema: intakeSchema,
  outputSchema: z.object({ leadId: z.string(), projectId: z.string(), taskIds: z.array(z.string()) }),
})
  .then(createLeadStep)
  .then(draftBriefStep)
  .then(createProjectPlanStep)
  .then(persistProjectStep)
  .commit();
