import { redirect } from "next/navigation";
import { createConnectLink, defaultToolkits, type AgencyToolkit } from "@/lib/composio/session";

function isAgencyToolkit(value: string): value is AgencyToolkit {
  return (defaultToolkits as readonly string[]).includes(value);
}

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
