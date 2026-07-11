import { ObjectId } from "mongodb";
import { z } from "zod";
import { collections } from "@/lib/mongodb/collections";

const updateApprovalSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid approval id." }, { status: 400 });
  }

  const body = updateApprovalSchema.parse(await request.json());
  const c = await collections();
  const result = await c.approvals.findOneAndUpdate(
    { _id: new ObjectId(id), status: "pending" },
    { $set: { status: body.status, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!result) {
    return Response.json({ error: "Approval not found or already handled." }, { status: 404 });
  }

  return Response.json({ approval: result });
}
