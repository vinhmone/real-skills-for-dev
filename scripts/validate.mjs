#!/usr/bin/env node
// Sanity checks run in CI: every skill has a valid SKILL.md, names are unique, generated files are current.
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { staleOutputs } from "./generate.mjs";
import { listRepoSkills } from "./lib/skills.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
const seen = new Map();

const skills = listRepoSkills(ROOT);
if (!skills.length) errors.push("no skills found under skills/");

for (const s of skills) {
  const where = `skills/${s.rel}/SKILL.md`;
  const { name, description } = s.meta;
  if (!name) errors.push(`${where}: frontmatter is missing \`name\``);
  if (!description) errors.push(`${where}: frontmatter is missing \`description\``);
  if (name && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) errors.push(`${where}: name "${name}" must be lowercase kebab-case`);
  if (name && name !== s.folder) warnings.push(`${where}: name "${name}" differs from folder "${s.folder}"`);
  if (name && seen.has(name)) errors.push(`${where}: name "${name}" is also used by skills/${seen.get(name)} (installers key on name)`);
  if (name) seen.set(name, s.rel);
}

try {
  const stale = staleOutputs(ROOT);
  if (stale.length) errors.push(`out of date: ${stale.join(", ")} — run \`npm run generate\``);
} catch (e) {
  errors.push(e.message);
}

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);
if (errors.length) process.exit(1);
console.log(`✓ ${skills.length} skills OK`);
