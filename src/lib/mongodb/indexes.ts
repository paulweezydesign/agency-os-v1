import { collections } from "./collections";

export async function setupMongoIndexes() {
  const c = await collections();

  await Promise.all([
    c.leads.createIndex({ status: 1, createdAt: -1 }),
    c.leads.createIndex({ email: 1 }, { sparse: true }),
    c.clients.createIndex({ email: 1 }, { sparse: true }),
    c.projects.createIndex({ status: 1, updatedAt: -1 }),
    c.projects.createIndex({ clientId: 1, createdAt: -1 }),
    c.tasks.createIndex({ projectId: 1, status: 1 }),
    c.milestones.createIndex({ projectId: 1, order: 1 }),
    c.agentRuns.createIndex({ projectId: 1, createdAt: -1 }),
    c.agentRuns.createIndex({ agentId: 1, createdAt: -1 }),
    c.artifacts.createIndex({ projectId: 1, createdAt: -1 }),
    c.integrationConnections.createIndex({ userId: 1, toolkit: 1 }),
    c.approvals.createIndex({ status: 1, createdAt: -1 }),
    c.approvals.createIndex({ projectId: 1, createdAt: -1 }),
  ]);
}
