import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const agentDir = path.join(root, ".github", "agents");
const systemDir = path.join(root, ".github", "agent-system");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(systemDir, name), "utf8"));
const fail = (message) => { throw new Error(message); };

function frontmatter(text, file) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) fail(`${file}: missing YAML frontmatter`);
  const source = match[1];
  const name = source.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const toolBlock = source.match(/^tools:\n((?:\s+- .+\n?)*)/m)?.[1] ?? "";
  const tools = [...toolBlock.matchAll(/^\s+-\s+(.+)$/gm)].map((m) => m[1].trim());
  const agentBlock = source.match(/^agents:\n((?:\s+- .+\n?)*)/m)?.[1] ?? "";
  const agents = [...agentBlock.matchAll(/^\s+-\s+(.+)$/gm)].map((m) => m[1].trim());
  if (!name) fail(`${file}: frontmatter name missing`);
  if (!tools.length) fail(`${file}: tools missing`);
  return { name, tools, agents };
}

const registry = readJson("agent-registry.json");
const states = readJson("workflow-states.json");
const contracts = readJson("artifact-schemas.json");
const skills = readJson("skill-registry.json");
const registered = new Map(registry.agents.map((agent) => [agent.name, agent]));

for (const required of ["Orchestrator", "Context", "Planner", "Troubleshooter", "Critic", "Coder", "Reviewer", "Validator", "Knowledge Curator"]) {
  if (!registered.has(required)) fail(`agent registry missing ${required}`);
}

const files = fs.readdirSync(agentDir).filter((file) => file.endsWith(".agent.md"));
let orchestrator;
for (const file of files) {
  const agent = frontmatter(fs.readFileSync(path.join(agentDir, file), "utf8"), file);
  if (!registered.has(agent.name)) fail(`${file}: ${agent.name} absent from agent registry`);
  if (agent.name === "Orchestrator") orchestrator = agent;
}
if (files.length !== registered.size) fail(`expected ${registered.size} agent files, found ${files.length}`);
if (!orchestrator) fail("Orchestrator agent file missing");
const expectedSpecialists = [...registered.keys()].filter((name) => name !== "Orchestrator").sort();
if (JSON.stringify([...orchestrator.agents].sort()) !== JSON.stringify(expectedSpecialists)) {
  fail("Orchestrator subagent list does not match the specialist registry");
}

for (const [state, definition] of Object.entries(states.states)) {
  for (const next of definition.next) if (!states.states[next]) fail(`${state}: unknown next state ${next}`);
  if (!registered.has(definition.owner) && definition.owner !== "Human") fail(`${state}: unknown owner ${definition.owner}`);
}

for (const [type, fields] of Object.entries(contracts.artifact_types)) {
  if (!Array.isArray(fields) || !fields.length) fail(`artifact ${type}: fields missing`);
}

const skillIds = new Set();
for (const skill of skills.skills) {
  if (skillIds.has(skill.id)) fail(`duplicate skill id ${skill.id}`);
  skillIds.add(skill.id);
  for (const agent of skill.compatible_agents) if (!registered.has(agent)) fail(`${skill.id}: unknown compatible agent ${agent}`);
}

console.log(`Validated ${registered.size} agents, ${Object.keys(states.states).length} states, ${Object.keys(contracts.artifact_types).length} artifact contracts, and ${skillIds.size} skill registrations.`);
