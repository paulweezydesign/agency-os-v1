import { isAgencyToolkit, syncConnectionFromCallback } from "@/lib/composio/session";

export const dynamic = "force-dynamic";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function IntegrationsCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = one(params.status);
  const toolkit = one(params.toolkit);
  const connectedAccountId = one(params.connected_account_id) ?? one(params.connectedAccountId);

  let storedStatus = "unknown";
  let error: string | undefined;

  if (toolkit && isAgencyToolkit(toolkit)) {
    try {
      storedStatus = await syncConnectionFromCallback({ toolkit, status, connectedAccountId });
    } catch (caught) {
      error = caught instanceof Error ? caught.message : "Could not sync connection status.";
    }
  }

  return (
    <div className="card">
      <span className="eyebrow">Integration callback</span>
      <h1>{status === "success" ? "Connected." : "Connection returned."}</h1>
      <p>
        Toolkit: <span className="code">{toolkit ?? "unknown"}</span>
      </p>
      <p>
        Stored status: <span className="code">{storedStatus}</span>
      </p>
      {connectedAccountId ? (
        <p>
          Connected account: <span className="code">{connectedAccountId}</span>
        </p>
      ) : null}
      {error ? <div className="notice">{error}</div> : null}
      <a className="button" href="/integrations">
        Back to integrations
      </a>
    </div>
  );
}
