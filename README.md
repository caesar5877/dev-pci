# Engineering Agent Workflow

A VS Code custom-agent workflow for grounded, gated software engineering.

## Included

- **Orchestrator** — coordinates the workflow and enforces evidence gates.

The Orchestrator is defined in
[`.github/agents/orchestrator.agent.md`](.github/agents/orchestrator.agent.md).
VS Code automatically discovers workspace custom agents in `.github/agents`.

## Workflow

```text
Raw task
  -> Context
  -> Context sufficiency gate
  -> Planner | Troubleshooter
  -> Critic
  -> Coder
  -> Reviewer
  -> Validator
  -> Critic final confidence audit
  -> Human review
  -> Knowledge Curator
```

The Orchestrator dispatches these eight specialist roles and ensures their
handoffs contain grounded artifacts rather than unstructured chat history.

## Add the specialist agents

Add one `.agent.md` file per role to `.github/agents/`, matching the names the
Orchestrator uses:

- `Context`
- `Planner`
- `Troubleshooter`
- `Critic`
- `Coder`
- `Reviewer`
- `Validator`
- `Knowledge Curator`

Each specialist should own only its stated decision boundary. In particular,
Context may form hypotheses but does not choose the solution; Critic approves
or returns a decision and performs the final confidence audit; Validator supplies
acceptance-criteria evidence; Knowledge Curator decides what reusable, sanitized
knowledge enters the configured knowledge stores.

The complete state machine, artifact contracts, and agent/skill registries are
in [`.github/agent-system`](.github/agent-system/README.md).

## Use in VS Code

1. Open this folder as a workspace.
2. Open Chat and select **Orchestrator** from the agent selector.
3. State the task, affected repositories/environments, constraints, and desired
   result.
4. Follow the handoffs and retain human approval before any commit, push, pull
   request, merge, or production change.

## Publish to GitHub

Create an empty GitHub repository, then run:

```bash
git remote add origin <your-github-repository-url>
git add .
git commit -m "Add engineering agent workflow foundation"
git push -u origin main
```

No remote, credentials, commit, or push have been created by this project.
