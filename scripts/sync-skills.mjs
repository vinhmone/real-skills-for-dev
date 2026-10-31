#!/usr/bin/env node
// Pull the latest skills from every upstream in upstreams.json.
//
//   node scripts/sync-skills.mjs                    # sync all upstreams
//   node scripts/sync-skills.mjs ponytail           # sync only some (by id)
//   node scripts/sync-skills.mjs --summary out.md   # also write a markdown change summary (used for the PR body)
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findSkillDirs, hashDir, toPosix } from "./lib/skills.mjs";
import { generate } from "./generate.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = join(ROOT, "upstreams.json");
const LOCK = join(ROOT, "upstreams.lock.json");

const args = process.argv.slice(2);
const summaryIdx = args.indexOf("--summary");
const summaryPath = summaryIdx >= 0 ? args.splice(summaryIdx, 2)[1] : null;
const only = new Set(args);

const { upstreams } = JSON.parse(readFileSync(CONFIG, "utf8"));
const lock = existsSync(LOCK) ? JSON.parse(readFileSync(LOCK, "utf8")) : {};
const unknown = [...only].filter((id) => !upstreams.some((u) => u.id === id));
if (unknown.length) {
  console.error(`✖ Unknown upstream id(s): ${unknown.join(", ")}`);
  process.exit(1);
}

const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const summary = [];

try {
  for (const up of upstreams) syncOne(up);
} catch (e) {
  console.error(`✖ ${e.message}`);
  process.exit(1);
}

writeFileSync(LOCK, JSON.stringify(lock, null, 2) + "\n");
generate(ROOT);

const md = summary.length ? summary.join("\n") : "No skill changes.";
console.log(`\n${md}`);
if (summaryPath) writeFileSync(summaryPath, md + "\n");

// ---------------------------------------------------------------------------

function syncOne(up) {
  if (only.size && !only.has(up.id)) return;
  console.log(`\n▸ ${up.id}: ${up.repo} (${up.branch})`);

  const tmp = mkdtempSync(join(tmpdir(), `skills-${up.id}-`));
  try {
    git("clone", "--quiet", "--depth", "1", "--branch", up.branch, up.repo, tmp);
    const commit = git("-C", tmp, "rev-parse", "HEAD");

    const sources = resolveSkills(up, tmp);
    if (!sources.length) fail(`${up.id}: no skills found upstream — refusing to wipe ${up.dest}`);

    const dest = join(ROOT, up.dest);
    const before = skillHashes(dest);

    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });
    for (const src of sources) cpSync(src, join(dest, destRel(up, tmp, src)), { recursive: true });
    if (up.license && existsSync(join(tmp, up.license))) {
      mkdirSync(join(ROOT, "licenses"), { recursive: true });
      cpSync(join(tmp, up.license), join(ROOT, "licenses", `${up.id}.LICENSE`));
    }

    const after = skillHashes(dest);
    const added = Object.keys(after).filter((k) => !(k in before));
    const removed = Object.keys(before).filter((k) => !(k in after));
    const changed = Object.keys(after).filter((k) => k in before && before[k] !== after[k]);
    const dirty = added.length + removed.length + changed.length > 0;

    // Only move the pinned commit when skill content actually changed, so unrelated upstream commits don't open PRs.
    const prev = lock[up.id];
    if (dirty || !prev) lock[up.id] = { repo: up.repo, branch: up.branch, commit, skills: Object.keys(after) };

    console.log(`  ${Object.keys(after).length} skills @ ${commit.slice(0, 7)}` +
      (dirty ? `  (+${added.length} -${removed.length} ~${changed.length})` : "  (no changes)"));

    if (dirty) {
      const base = up.repo.replace(/\.git$/, "");
      const link = prev?.commit && prev.commit !== commit
        ? `[\`${prev.commit.slice(0, 7)}…${commit.slice(0, 7)}\`](${base}/compare/${prev.commit}...${commit})`
        : `[\`${commit.slice(0, 7)}\`](${base}/commit/${commit})`;
      summary.push(`### ${up.name ?? up.id}\n\nUpstream: ${link}\n`);
      for (const [label, list] of [["Added", added], ["Removed", removed], ["Updated", changed]]) {
        if (list.length) summary.push(`- **${label}:** ${list.map((s) => `\`${s}\``).join(", ")}`);
      }
      summary.push("");
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** Absolute paths of the upstream skill folders to copy. */
function resolveSkills(up, repoDir) {
  const root = join(repoDir, up.skillsRoot ?? ".");
  const spec = up.skills ?? "all";
  let dirs;
  if (spec === "all") {
    dirs = findSkillDirs(root);
  } else if (Array.isArray(spec)) {
    dirs = spec.map((p) => join(repoDir, p));
  } else if (spec.fromPluginManifest) {
    const manifest = join(repoDir, spec.fromPluginManifest);
    if (!existsSync(manifest)) fail(`${up.id}: ${spec.fromPluginManifest} not found upstream`);
    const listed = JSON.parse(readFileSync(manifest, "utf8")).skills;
    if (!Array.isArray(listed)) fail(`${up.id}: ${spec.fromPluginManifest} has no "skills" array`);
    dirs = listed.map((p) => join(repoDir, p));
  } else {
    fail(`${up.id}: unsupported "skills" value ${JSON.stringify(spec)}`);
  }
  for (const d of dirs) if (!existsSync(join(d, "SKILL.md"))) fail(`${up.id}: ${toPosix(relative(repoDir, d))} has no SKILL.md`);
  return dirs;
}

/** Where an upstream skill lands inside `dest`: keep its path under skillsRoot (e.g. engineering/tdd). */
function destRel(up, repoDir, src) {
  const rel = relative(join(repoDir, up.skillsRoot ?? "."), src);
  return rel.startsWith("..") || rel === "" ? src.split(/[\\/]/).pop() : rel;
}

function skillHashes(dest) {
  return Object.fromEntries(findSkillDirs(dest).map((d) => [toPosix(relative(dest, d)), hashDir(d)]));
}

function fail(msg) {
  throw new Error(msg);
}
