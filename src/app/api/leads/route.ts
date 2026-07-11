import { z } from "zod";
import { collections, nowTimestamps } from "@/lib/mongodb/collections";

const createLeadSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  source: z.string().optional(),
  problem: z.string(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

export async function POST(request: Request) {
  const body = createLeadSchema.parse(await request.json());
  const c = await collections();
  const result = await c.leads.insertOne({
    ...body,
    status: "new",
    rawIntake: body,
    ...nowTimestamps(),
  });

  return Response.json({
    leadId: result.insertedId.toString(),
    nextWorkflow: "lead-to-project",
  });
}
