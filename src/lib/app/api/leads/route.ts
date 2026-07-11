import { z } from "zod";
import { mastra } from "@/mastra";

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

  const run = mastra.getWorkflow("leadToProjectWorkflow").createRun();
  const result = await run.start({ inputData: body });

  return Response.json(result.result);
}
