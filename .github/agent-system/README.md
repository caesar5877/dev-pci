# Engineering Agent System

This directory is the durable contract for the workspace agents. The agent
files define behavior and permissions; this directory defines the shared state,
artifacts, skills, and handoff rules they must use.

## Role map

| Role | Owns | May change production code |
| --- | --- | --- |
| Orchestrator | Routing, gates, task state, stop/escalate decisions | No |
| Context | Evidence, historical context, skill and agent discovery | No |
| Planner | Feature implementation decisions | No |
| Troubleshooter | Evidence-based diagnosis and remediation decision | No |
| Critic | Decision review and final confidence audit | No |
| Coder | Approved implementation and focused tests | Yes, in approved scope |
| Reviewer | Independent code review | No |
| Validator | Independent acceptance-criteria verification | No |
| Knowledge Curator | Reusable knowledge selection and Wiki handoff | Wiki only |

## Execution model

`Task -> Worktree -> Session -> Agent responsibility -> Skill -> Tool/MCP`

One story owns one worktree or multi-root task workspace. Agents handling one
story run in separate sessions for context isolation, while dependent phases
remain sequential. Parallel work is appropriate for independent Context
research or separate stories, never for overlapping edits to the same scope.

Every task starts with Context, passes Task Alignment and Registry Discovery,
and ends only after Validator evidence, Critic's final confidence audit, human
review, and the knowledge handoff decision. The state machine is in `workflow-states.json`; artifact fields are in
`artifact-schemas.json`.

## Required use

1. Create a `TaskRecord` and assign a stable `task_id`.
2. Produce typed artifacts with an envelope from `artifact-schemas.json`.
3. Resolve skills with the registry before each specialist phase. Record the
   chosen, unavailable, and rejected skills in `SkillPlan`.
4. Transition only through allowed states and record the gate evidence.
5. Re-run dependent review and validation after a decision or implementation
   change invalidates earlier evidence.

The registry is deliberately declarative. A registry entry does not make a
tool, MCP server, or external service available; the responsible agent must
record unavailable prerequisites and route the task safely.
