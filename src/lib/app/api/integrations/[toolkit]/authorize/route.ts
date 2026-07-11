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

  try {
    const url = await createConnectLink(toolkit);
    if (!url) {
      return Response.json({ error: "Composio did not return a connect URL." }, { status: 502 });
    }
    redirect(url);
  } catch (err) {
    // next/navigation redirect throws a special non-Error object — let it propagate
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[authorize] createConnectLink failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
