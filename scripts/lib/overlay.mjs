// Local customisations re-applied on top of an upstream after every sync (`overlay` in upstreams.json):
//   files:       a folder mirroring the upstream's `dest`; each file is copied over the synced copy.
//   frontmatter: { "<skill path under dest>": { key: value } } — top-level SKILL.md frontmatter keys to set.
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { findSkillDirs, parseFrontmatter, toPosix } from "./skills.mjs";

/** Apply `up.overlay` to the synced folder. Throws when an overlay target no longer exists upstream. */
export function applyOverlay(root, up) {
  const ov = up.overlay;
  if (!ov) return;
  const dest = join(root, up.dest);
  if (ov.files) {
    const src = join(root, ov.files);
    if (!existsSync(src)) throw new Error(`${up.id}: overlay folder ${ov.files} not found`);
    cpSync(src, dest, { recursive: true });
  }
  for (const [skill, fields] of Object.entries(ov.frontmatter ?? {})) {
    const file = skillFile(dest, up, skill);
    let text = readFileSync(file, "utf8");
    for (const [key, value] of Object.entries(fields)) text = setFrontmatterKey(text, key, value, `${up.id}/${skill}`);
    writeFileSync(file, text);
  }
}

/** Overlay entries the working tree no longer matches (hand edits under dest, or a sync without overlays). */
export function overlayDrift(root, up) {
  const ov = up.overlay;
  if (!ov) return [];
  const dest = join(root, up.dest);
  const drift = [];
  if (ov.files) {
    const src = join(root, ov.files);
    if (!existsSync(src)) return [`${up.id}: overlay folder ${ov.files} not found`];
    for (const f of listFiles(src)) {
      const rel = toPosix(relative(src, f));
      const target = join(dest, rel);
      if (!existsSync(target) || norm(readFileSync(target, "utf8")) !== norm(readFileSync(f, "utf8"))) {
        drift.push(`${up.dest}/${rel} differs from ${ov.files}/${rel}`);
      }
    }
  }
  for (const [skill, fields] of Object.entries(ov.frontmatter ?? {})) {
    let meta;
    try {
      meta = parseFrontmatter(readFileSync(skillFile(dest, up, skill), "utf8")) ?? {};
    } catch (e) {
      drift.push(e.message);
      continue;
    }
    for (const [key, value] of Object.entries(fields)) {
      if (meta[key] !== String(value)) drift.push(`${up.dest} (${skill}): frontmatter \`${key}\` should be ${JSON.stringify(value)}`);
    }
  }
  return drift;
}

/** SKILL.md of `skill`, keyed like the sync summary: path under dest, or the folder name when dest is the skill. */
function skillFile(dest, up, skill) {
  const dir = findSkillDirs(dest).find((d) => (toPosix(relative(dest, d)) || d.split(/[\\/]/).pop()) === skill);
  if (!dir) throw new Error(`${up.id}: overlay targets skill "${skill}", which is not in ${up.dest}`);
  return join(dir, "SKILL.md");
}

/** Set a top-level frontmatter key, replacing its current value (and any indented continuation lines). */
function setFrontmatterKey(text, key, value, where) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const start = lines[0].replace(/^﻿/, "") === "---" ? 0 : -1;
  const end = start === 0 ? lines.indexOf("---", 1) : -1;
  if (end < 0) throw new Error(`${where}: SKILL.md has no frontmatter`);
  const line = `${key}: ${typeof value === "string" ? JSON.stringify(value) : String(value)}`;
  const at = lines.findIndex((l, i) => i > 0 && i < end && l.startsWith(`${key}:`));
  if (at < 0) {
    lines.splice(end, 0, line);
  } else {
    let n = 1;
    while (at + n < end && /^\s/.test(lines[at + n])) n++;
    lines.splice(at, n, line);
  }
  return lines.join(eol);
}

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? listFiles(p) : [p];
  });
}

const norm = (s) => s.replace(/\r\n/g, "\n");
