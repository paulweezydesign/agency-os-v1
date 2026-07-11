import { executeApproval } from "@/lib/approvals/execute";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await executeApproval(id);

  if (!result.ok) {
    return Response.json({ error: result.error, approval: result.approval }, { status: result.status });
  }

  return Response.json({ approval: result.approval, alreadyExecuted: result.alreadyExecuted ?? false });
}
