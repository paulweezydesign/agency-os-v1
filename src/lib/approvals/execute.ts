import { ObjectId } from "mongodb";
import { env } from "@/lib/env";
import { getComposioSession } from "@/lib/composio/session";
import { collections } from "@/lib/mongodb/collections";

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return { value };
}

export async function executeApproval(approvalId: string, userId = env.agencyUserId) {
  if (!ObjectId.isValid(approvalId)) {
    return { ok: false as const, status: 400, error: "Invalid approval id." };
  }

  const c = await collections();
  const _id = new ObjectId(approvalId);
  const approval = await c.approvals.findOne({ _id });

  if (!approval) {
    return { ok: false as const, status: 404, error: "Approval not found." };
  }

  if (approval.status === "rejected") {
    return { ok: false as const, status: 409, error: "Rejected approvals cannot be executed." };
  }

  if (approval.status === "executed") {
    return { ok: true as const, status: 200, approval, alreadyExecuted: true };
  }

  if (approval.status !== "approved") {
    return { ok: false as const, status: 409, error: "Approval must be approved before execution." };
  }

  const now = new Date();

  try {
    const session = await getComposioSession(userId);
    const result = await session.execute(approval.externalAction, approval.payload);
    const resultRecord = toRecord(result);

    const updated = await c.approvals.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: "executed",
          result: {
            ok: true,
            toolkit: approval.externalToolkit,
            action: approval.externalAction,
            response: resultRecord,
            executedAt: now.toISOString(),
          },
          updatedAt: now,
        },
      },
      { returnDocument: "after" },
    );

    if (approval.projectId) {
      await c.agentRuns.insertOne({
        agentId: "ops-agent",
        workflowId: "approval-execution",
        projectId: approval.projectId,
        status: "completed",
        input: {
          approvalId,
          toolkit: approval.externalToolkit,
          action: approval.externalAction,
          payload: approval.payload,
        },
        output: resultRecord,
        toolCalls: [
          {
            provider: "composio",
            toolkit: approval.externalToolkit,
            action: approval.externalAction,
          },
        ],
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { ok: true as const, status: 200, approval: updated };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Composio execution error.";
    const updated = await c.approvals.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: "failed",
          result: {
            ok: false,
            toolkit: approval.externalToolkit,
            action: approval.externalAction,
            error: message,
            failedAt: now.toISOString(),
          },
          updatedAt: now,
        },
      },
      { returnDocument: "after" },
    );

    if (approval.projectId) {
      await c.agentRuns.insertOne({
        agentId: "ops-agent",
        workflowId: "approval-execution",
        projectId: approval.projectId,
        status: "failed",
        input: {
          approvalId,
          toolkit: approval.externalToolkit,
          action: approval.externalAction,
          payload: approval.payload,
        },
        error: message,
        createdAt: now,
        updatedAt: now,
        completedAt: now,
      });
    }

    return { ok: false as const, status: 502, error: message, approval: updated };
  }
}
