import { defaultToolkits } from "@/lib/composio/session";

export default function IntegrationsPage() {
  return (
    <div>
      <span className="eyebrow">Outside world adapter</span>
      <h1>Connect Composio integrations.</h1>
      <p>
        Composio manages per-user authentication. AgencyOS stores only safe connection metadata
        and uses approval gates before external actions.
      </p>

      <section className="grid" style={{ marginTop: 24 }}>
        {defaultToolkits.map((toolkit) => (
          <article className="card" key={toolkit}>
            <h2 style={{ textTransform: "capitalize" }}>{toolkit}</h2>
            <p>Generate a secure Composio connect link for {toolkit}.</p>
            <a className="button" href={`/api/integrations/${toolkit}/authorize`}>Connect {toolkit}</a>
          </article>
        ))}
      </section>
    </div>
  );
}
