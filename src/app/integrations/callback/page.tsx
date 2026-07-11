export default async function IntegrationsCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = Array.isArray(params.status) ? params.status[0] : params.status;
  const toolkit = Array.isArray(params.toolkit) ? params.toolkit[0] : params.toolkit;

  return (
    <div className="card">
      <span className="eyebrow">Integration callback</span>
      <h1>{status === "success" ? "Connected." : "Connection returned."}</h1>
      <p>
        Toolkit: <span className="code">{toolkit ?? "unknown"}</span>
      </p>
      <a className="button" href="/integrations">Back to integrations</a>
    </div>
  );
}
