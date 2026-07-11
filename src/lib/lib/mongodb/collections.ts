import { getDb } from "./client";
import type {
  AgentRunDoc,
  ApprovalDoc,
  ArtifactDoc,
  BriefDoc,
  ClientDoc,
  IntegrationConnectionDoc,
  LeadDoc,
  MilestoneDoc,
  ProjectDoc,
  TaskDoc,
} from "./types";

export async function collections() {
  const db = await getDb();
  return {
    clients: db.collection<ClientDoc>("clients"),
    leads: db.collection<LeadDoc>("leads"),
    briefs: db.collection<BriefDoc>("briefs"),
    projects: db.collection<ProjectDoc>("projects"),
    milestones: db.collection<MilestoneDoc>("milestones"),
    tasks: db.collection<TaskDoc>("tasks"),
    artifacts: db.collection<ArtifactDoc>("artifacts"),
    agentRuns: db.collection<AgentRunDoc>("agent_runs"),
    integrationConnections: db.collection<IntegrationConnectionDoc>("integration_connections"),
    approvals: db.collection<ApprovalDoc>("approvals"),
  };
}

export function nowTimestamps() {
  const now = new Date();
  return { createdAt: now, updatedAt: now };
}
