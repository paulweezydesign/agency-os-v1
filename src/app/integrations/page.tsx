import { defaultToolkits, getStoredIntegrationConnections } from "@/lib/composio/session";

export const dynamic = "force-dynamic";

function statusLabel(status?: string) {
  if (!status) return "not connected";
  return status.replaceAll("_", " ");
}

export default async function IntegrationsPage() {
  let connections = new Map<string, { status?: string; connectedAccountId?: string }>();
  let connectionError: string | undefined;

  try {
    connections = await getStoredIntegrationConnections();
  } catch (error) {
    connectionError = error instanceof Error ? error.message : "Could not load integration status.";
  }

  return (
    <div>
      <span className="eyebrow">Outside world adapter</span>
      <h1>Connect Composio integrations.</h1>
      <p>
        Composio manages per-user authentication. AgencyOS stores only safe connection metadata
        and uses approval gates before external actions.
      </p>

      {connectionError ? (
        <div className="notice">MongoDB status unavailable: {connectionError}</div>
      ) : null}

      <section className="grid" style={{ marginTop: 24 }}>
        {defaultToolkits.map((toolkit) => {
          const connection = connections.get(toolkit);
          const status = connection?.status;
          return (
            <article className="card" key={toolkit}>
              <div className="card-header">
                <h2 style={{ textTransform: "capitalize" }}>{toolkit}</h2>
                <span className={`status status-${status ?? "none"}`}>{statusLabel(status)}</span>
              </div>
              <p>Generate a secure Composio connect link for {toolkit}.</p>
              {connection?.connectedAccountId ? (
                <p className="muted-small">Connected account: {connection.connectedAccountId}</p>
              ) : null}
              <a className="button" href={`/api/integrations/${toolkit}/authorize`}>
                {status === "active" ? `Reconnect ${toolkit}` : `Connect ${toolkit}`}
              </a>
            </article>
          );
        })}
      </section>
    </div>
  );
}
