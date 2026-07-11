import { z } from "zod";
import { mastra } from "@/mastra";

const leadToProjectSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  source: z.string().optional(),
  problem: z.string(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

export async function POST(request: Request) {
  const body = leadToProjectSchema.parse(await request.json());
  const workflow = mastra.getWorkflow("leadToProjectWorkflow");
  const run = await workflow.createRun();
  const result = await run.start({ inputData: body });

  return Response.json({
    workflow: "lead-to-project",
    runId: run.runId,
    result,
  });
}
