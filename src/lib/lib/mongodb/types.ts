import type { ObjectId } from "mongodb";

export type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

export type LeadStatus = "new" | "qualified" | "converted" | "archived";
export type ProjectStatus = "intake" | "planning" | "active" | "review" | "delivered" | "paused";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "review" | "done";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "executed" | "failed";

export type ClientDoc = Timestamped & {
  _id?: ObjectId;
  name: string;
  company?: string;
  email?: string;
  notes?: string;
  sourceLeadId?: ObjectId;
};

export type LeadDoc = Timestamped & {
  _id?: ObjectId;
  name: string;
  company?: string;
  email?: string;
  source?: string;
  problem: string;
  budget?: string;
  timeline?: string;
  status: LeadStatus;
  rawIntake?: Record<string, unknown>;
};

export type BriefDoc = Timestamped & {
  _id?: ObjectId;
  leadId?: ObjectId;
  clientId?: ObjectId;
  projectId?: ObjectId;
  title: string;
  summary: string;
  targetAudience: string;
  goals: string[];
  recommendedOffer: string;
  scope: string[];
  risks: string[];
};

export type ProjectDoc = Timestamped & {
  _id?: ObjectId;
  clientId?: ObjectId;
  leadId?: ObjectId;
  briefId?: ObjectId;
  name: string;
  type: "landing_page" | "web_app" | "automation" | "ai_agent" | "other";
  status: ProjectStatus;
  goals: string[];
  assignedAgentIds: string[];
};

export type MilestoneDoc = Timestamped & {
  _id?: ObjectId;
  projectId: ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  order: number;
  status: TaskStatus;
};

export type TaskDoc = Timestamped & {
  _id?: ObjectId;
  projectId: ObjectId;
  milestoneId?: ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  ownerAgentId?: string;
  priority: "low" | "medium" | "high";
  acceptanceCriteria: string[];
};

export type ArtifactDoc = Timestamped & {
  _id?: ObjectId;
  projectId?: ObjectId;
  taskId?: ObjectId;
  kind: "brief" | "proposal" | "status_report" | "design" | "code" | "document" | "other";
  title: string;
  content?: string;
  externalUrl?: string;
  metadata?: Record<string, unknown>;
};

export type AgentRunDoc = Timestamped & {
  _id?: ObjectId;
  agentId: string;
  workflowId?: string;
  projectId?: ObjectId;
  leadId?: ObjectId;
  status: "queued" | "running" | "completed" | "failed";
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  model?: string;
  toolCalls?: Array<Record<string, unknown>>;
  completedAt?: Date;
};

export type IntegrationConnectionDoc = Timestamped & {
  _id?: ObjectId;
  userId: string;
  toolkit: "github" | "linear" | "slack" | "googledrive" | "googledocs" | "gmail" | string;
  status: "active" | "pending" | "expired" | "disconnected";
  connectedAccountId?: string;
  workspaceName?: string;
  metadata?: Record<string, unknown>;
};

export type ApprovalDoc = Timestamped & {
  _id?: ObjectId;
  requestedByAgentId: string;
  projectId?: ObjectId;
  title: string;
  description: string;
  externalToolkit: string;
  externalAction: string;
  payload: Record<string, unknown>;
  status: ApprovalStatus;
  result?: Record<string, unknown>;
};
