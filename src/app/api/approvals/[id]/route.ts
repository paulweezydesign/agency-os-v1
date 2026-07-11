import { ObjectId } from "mongodb";
import { z } from "zod";
import { collections } from "@/lib/mongodb/collections";
import { executeApproval } from "@/lib/approvals/execute";

const updateApprovalSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

async function updateApprovalStatus(id: string, status: "approved" | "rejected") {
  if (!ObjectId.isValid(id)) {
    return { response: Response.json({ error: "Invalid approval id." }, { status: 400 }) };
  }

  const c = await collections();
  const result = await c.approvals.findOneAndUpdate(
    { _id: new ObjectId(id), status: { $in: ["pending", "approved", "failed"] } },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!result) {
    return { response: Response.json({ error: "Approval not found or already executed/rejected." }, { status: 404 }) };
  }

  return { approval: result };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = updateApprovalSchema.parse(await request.json());
  const result = await updateApprovalStatus(id, body.status);

  if (result.response) return result.response;
  return Response.json({ approval: result.approval });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "approve" || intent === "reject") {
    const result = await updateApprovalStatus(id, intent === "approve" ? "approved" : "rejected");
    if (result.response) return result.response;
    return Response.redirect(new URL("/approvals", request.url));
  }

  if (intent === "execute") {
    const result = await executeApproval(id);
    if (!result.ok) {
      return Response.redirect(new URL(`/approvals?error=${encodeURIComponent(result.error)}`, request.url));
    }
    return Response.redirect(new URL("/approvals", request.url));
  }

  return Response.json({ error: "Unsupported approval action." }, { status: 400 });
}
