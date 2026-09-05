# Artifact Lifecycle and Improvement Loop

## Task alignment and durable artifacts

After memory preload and Context, Orchestrator resolves `grill-with-docs` and
`lightweight-alignment-loop`. The result must identify the actual goal,
acceptance criteria, non-goals, constraints, affected repositories,
environment, worktree, and unresolved questions.

Planner saves the approved ADR and implementation plan to
`artifacts/tasks/<task_id>/`. This is the task's durable record, separate from
chat. Only Planner may write planning artifacts there; Coder may read them.
The plan is a DecisionPackage and must identify its ContextPackage source.

## Failure and coverage loops

When Coder encounters an issue or a test failure, it returns to Orchestrator.
Orchestrator routes evidence to Troubleshooter, which uses `matt-diagnose` or
another eligible diagnostic skill. A diagnosis is not a code change. Critic
reviews the remediation decision before Coder resumes.

Validator records the coverage baseline when the project exposes a credible
coverage metric. If coverage drops, Coder adds or improves targeted tests and
Validator reruns the relevant checks. If coverage is unavailable or incomparable,
record `NOT_RUN` and explain the gap; never invent a baseline.

## Human review and knowledge handoff

Before Human Review, Orchestrator prepares a PRReadiness artifact containing a
plain change summary, validator and review evidence, known risks, unanswered
questions, and an explicit statement that no commit, push, pull request, or
merge was performed automatically.

Knowledge Curator always writes a sanitized task summary to the configured LLM
Wiki after Human Review when the destination is available. It promotes only
reusable, evidenced lessons as long-lived knowledge. This preserves the chart's
full knowledge handoff while preventing raw, transient, sensitive, or
unsubstantiated material from becoming a reusable rule.

Every repeated failure, review finding, or validation gap becomes an improvement
proposal with a source task, intended Agent/Skill/registry change, and a
representative verification case. A proposal is accepted only after that case
shows the intended behavior without a new regression.
