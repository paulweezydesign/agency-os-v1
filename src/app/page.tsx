const pillars = [
  ["Mastra", "Agents, typed tools, controlled workflows, and runtime state."],
  ["MongoDB", "Source of truth for leads, clients, projects, tasks, artifacts, and approvals."],
  ["Composio", "Outside-world auth and tool execution for GitHub, Linear, Slack, Drive, Docs, Gmail, and more."],
];

const agents = ["Sales", "Strategist", "PM", "Designer", "Engineer", "QA", "Content", "Ops"];

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <span className="eyebrow">AgencyOS v1</span>
        <h1>The AI-native agency command center.</h1>
        <p>
          Add a lead and AgencyOS starts operating: strategy brief, proposal draft, project plan,
          task assignments, and approval-gated outside actions.
        </p>
        <div className="nav">
          <a className="button" href="/integrations">Connect integrations</a>
          <a className="button" href="/projects">View projects</a>
          <a className="button" href="/approvals">Approval queue</a>
          <span className="badge">Workflow: <span className="code">lead → project</span></span>
        </div>
      </section>

      <section className="grid">
        {pillars.map(([title, body]) => (
          <article className="card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section style={{ marginTop: 24 }} className="card">
        <h2>8-agent agency model</h2>
        <p>{agents.join(" Agent • ")} Agent</p>
      </section>
    </div>
  );
}
