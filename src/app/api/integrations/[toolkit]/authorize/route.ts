import { redirect } from "next/navigation";
import { createConnectLink, isAgencyToolkit } from "@/lib/composio/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ toolkit: string }> },
) {
  const { toolkit } = await params;

  if (!isAgencyToolkit(toolkit)) {
    return Response.json({ error: `Unsupported toolkit: ${toolkit}` }, { status: 400 });
  }

  const url = await createConnectLink(toolkit);
  if (!url) {
    return Response.json({ error: "Composio did not return a connect URL." }, { status: 502 });
  }

  redirect(url);
}
