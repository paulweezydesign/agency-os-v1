import { collections } from "@/lib/mongodb/collections";

export const dynamic = "force-dynamic";

function ActionButtons({ id, status }: { id: string; status: string }) {
  if (status === "executed" || status === "rejected") return null;

  return (
    <div className="actions-row">
      {status !== "approved" ? (
        <form action={`/api/approvals/${id}`} method="post">
          <input type="hidden" name="intent" value="approve" />
          <button className="button" type="submit">Approve</button>
        </form>
      ) : null}
      {status === "approved" ? (
        <form action={`/api/approvals/${id}`} method="post">
          <input type="hidden" name="intent" value="execute" />
          <button className="button" type="submit">Execute with Composio</button>
        </form>
      ) : null}
      {status !== "approved" ? (
        <form action={`/api/approvals/${id}`} method="post">
          <input type="hidden" name="intent" value="reject" />
          <button className="button button-secondary" type="submit">Reject</button>
        </form>
      ) : null}
    </div>
  );
}

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const c = await collections();
  const approvals = await c.approvals.find({}).sort({ createdAt: -1 }).limit(100).toArray();

  return (
    <div>
      <span className="eyebrow">Human-in-the-loop</span>
      <h1>Approval queue</h1>
      <p>External actions should land here before AgencyOS executes them through Composio.</p>
      {error ? <div className="notice">Execution error: {error}</div> : null}

      <section className="stack" style={{ marginTop: 24 }}>
        {approvals.length === 0 ? (
          <article className="card"><h2>No approvals pending</h2><p>Queued external actions will appear here.</p></article>
        ) : approvals.map((approval) => {
          const id = approval._id?.toString() ?? "";
          return (
            <article className="card" key={id}>
              <div className="card-header">
                <h2>{approval.title}</h2>
                <span className={`status status-${approval.status}`}>{approval.status}</span>
              </div>
              <p>{approval.description}</p>
              <p className="muted-small">{approval.externalToolkit} → {approval.externalAction}</p>
              <ActionButtons id={id} status={approval.status} />
              <h3>Payload</h3>
              <pre>{JSON.stringify(approval.payload, null, 2)}</pre>
              {approval.result ? (
                <>
                  <h3>Execution result</h3>
                  <pre>{JSON.stringify(approval.result, null, 2)}</pre>
                </>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
