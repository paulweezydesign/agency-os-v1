import { collections } from "@/lib/mongodb/collections";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const c = await collections();
  const approvals = await c.approvals.find({}).sort({ createdAt: -1 }).limit(100).toArray();

  return (
    <div>
      <span className="eyebrow">Human-in-the-loop</span>
      <h1>Approval queue</h1>
      <p>External actions should land here before AgencyOS executes them through Composio.</p>

      <section className="stack" style={{ marginTop: 24 }}>
        {approvals.length === 0 ? (
          <article className="card"><h2>No approvals pending</h2><p>Queued external actions will appear here.</p></article>
        ) : approvals.map((approval) => (
          <article className="card" key={approval._id?.toString()}>
            <div className="card-header">
              <h2>{approval.title}</h2>
              <span className={`status status-${approval.status}`}>{approval.status}</span>
            </div>
            <p>{approval.description}</p>
            <p className="muted-small">{approval.externalToolkit} → {approval.externalAction}</p>
            <pre>{JSON.stringify(approval.payload, null, 2)}</pre>
          </article>
        ))}
      </section>
    </div>
  );
}
