# AgencyOS v1

AI-native agency operating system built with **Mastra.ai + MongoDB + Composio**.

## Product goal

AgencyOS v1 turns a new lead into a client-ready operating plan:

```txt
Lead intake
→ strategy brief
→ proposal draft
→ project plan
→ tasks/milestones
→ agent assignments
→ approved external actions
```

## Stack

- **Mastra.ai** — agents, typed tools, workflows, runtime memory/state
- **MongoDB / Atlas** — source of truth for clients, leads, projects, tasks, artifacts, agent runs, approvals
- **Composio** — outside-world integrations and per-user auth for GitHub, Linear, Slack, Google Drive/Docs, Gmail, etc.
- **Next.js** — AgencyOS dashboard and API surface

## Current scope

This repo now has the foundation plus the first operational loop:

- MongoDB typed collections and indexes
- Composio session/auth helper and callback status sync
- Mastra agent definitions for the 8-agent agency
- Mastra internal tools for leads/projects/tasks/approvals
- First controlled workflow: `leadToProjectWorkflow`
- Dashboard pages for overview, integrations, projects, project detail, and approvals
- API routes for lead creation, integration connection links, approval status updates, and `POST /api/workflows/lead-to-project`

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Mastra Studio/runtime:

```bash
npm run dev:mastra
```

Create MongoDB indexes:

```bash
npm run db:indexes
```

Typecheck:

```bash
npm run typecheck
```

## Environment variables

See `.env.example`.

Required for local agent execution:

- `OPENAI_API_KEY`
- `COMPOSIO_API_KEY`
- `MONGODB_URI`
- `MONGODB_DB_NAME`

## Architecture rule

Do **not** let agents directly mutate outside systems without an approval path.

Pattern:

```txt
Agent drafts action
→ AgencyOS queues approval
→ human approves
→ Composio executes
→ MongoDB logs result
```

## Directory map

```txt
src/
  app/                 Next.js dashboard + API routes
  lib/
    composio/          Composio client/session/auth helpers
    mongodb/           MongoDB client, types, collections, indexes
  mastra/
    agents/            8-agent agency definitions
    tools/             typed Mastra tools
    workflows/         controlled workflows
    index.ts           Mastra runtime registration
scripts/
  setup.ts
```
