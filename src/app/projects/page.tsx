import Link from "next/link";
import { collections } from "@/lib/mongodb/collections";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const c = await collections();
  const projects = await c.projects.find({}).sort({ updatedAt: -1 }).limit(50).toArray();

  return (
    <div>
      <span className="eyebrow">Delivery command center</span>
      <h1>Projects</h1>
      <p>Projects created by the lead-to-project workflow and future client intake flows.</p>

      <section className="stack" style={{ marginTop: 24 }}>
        {projects.length === 0 ? (
          <article className="card">
            <h2>No projects yet</h2>
            <p>Run <span className="code">POST /api/workflows/lead-to-project</span> to create the first one.</p>
          </article>
        ) : (
          projects.map((project) => (
            <Link className="card link-card" href={`/projects/${project._id?.toString()}`} key={project._id?.toString()}>
              <div className="card-header">
                <h2>{project.name}</h2>
                <span className={`status status-${project.status}`}>{project.status}</span>
              </div>
              <p>{project.goals?.slice(0, 3).join(" • ") || "No goals recorded yet."}</p>
              <p className="muted-small">Agents: {project.assignedAgentIds?.join(", ") || "unassigned"}</p>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
