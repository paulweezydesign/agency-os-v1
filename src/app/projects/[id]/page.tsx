import { ObjectId } from "mongodb";
import { collections } from "@/lib/mongodb/collections";

export const dynamic = "force-dynamic";

function asObjectId(value: string) {
  return ObjectId.isValid(value) ? new ObjectId(value) : undefined;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = asObjectId(id);

  if (!projectId) {
    return <div className="card">Invalid project id.</div>;
  }

  const c = await collections();
  const [project, tasks, approvals, agentRuns, artifacts] = await Promise.all([
    c.projects.findOne({ _id: projectId }),
    c.tasks.find({ projectId }).sort({ createdAt: 1 }).toArray(),
    c.approvals.find({ projectId }).sort({ createdAt: -1 }).toArray(),
    c.agentRuns.find({ projectId }).sort({ createdAt: -1 }).limit(25).toArray(),
    c.artifacts.find({ projectId }).sort({ createdAt: -1 }).limit(25).toArray(),
  ]);

  if (!project) {
    return <div className="card">Project not found.</div>;
  }

  return (
    <div>
      <span className="eyebrow">Project</span>
      <h1>{project.name}</h1>
      <p>Status: <span className="code">{project.status}</span></p>

      <section className="grid" style={{ marginTop: 24 }}>
        <article className="card">
          <h2>Goals</h2>
          <ul>{project.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
        </article>
        <article className="card">
          <h2>Assigned agents</h2>
          <ul>{project.assignedAgentIds.map((agent) => <li key={agent}>{agent}</li>)}</ul>
        </article>
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Tasks</h2>
        <div className="stack">
          {tasks.map((task) => (
            <div className="row" key={task._id?.toString()}>
              <div>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <p className="muted-small">Owner: {task.ownerAgentId ?? "unassigned"} • Priority: {task.priority}</p>
              </div>
              <span className={`status status-${task.status}`}>{task.status}</span>
            </div>
          ))}
          {tasks.length === 0 ? <p>No tasks yet.</p> : null}
        </div>
      </section>

      <section className="grid" style={{ marginTop: 24 }}>
        <article className="card">
          <h2>Approvals</h2>
          <ul>{approvals.map((approval) => <li key={approval._id?.toString()}>{approval.title} — {approval.status}</li>)}</ul>
          {approvals.length === 0 ? <p>No approvals queued.</p> : null}
        </article>
        <article className="card">
          <h2>Agent runs</h2>
          <ul>{agentRuns.map((run) => <li key={run._id?.toString()}>{run.agentId} — {run.status}</li>)}</ul>
          {agentRuns.length === 0 ? <p>No agent runs logged yet.</p> : null}
        </article>
        <article className="card">
          <h2>Artifacts</h2>
          <ul>{artifacts.map((artifact) => <li key={artifact._id?.toString()}>{artifact.title} — {artifact.kind}</li>)}</ul>
          {artifacts.length === 0 ? <p>No artifacts yet.</p> : null}
        </article>
      </section>
    </div>
  );
}
