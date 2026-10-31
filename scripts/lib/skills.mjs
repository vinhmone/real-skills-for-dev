// Shared helpers: find skill folders and read SKILL.md frontmatter.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const toPosix = (p) => p.split(sep).join("/");

/** Every directory under `root` that contains a SKILL.md (does not descend into a skill). */
export function findSkillDirs(root) {
  const out = [];
  if (!existsSync(root)) return out;
  const walk = (dir) => {
    if (existsSync(join(dir, "SKILL.md"))) return out.push(dir);
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") walk(join(dir, e.name));
    }
  };
  walk(root);
  return out.sort();
}

/** Minimal YAML frontmatter reader: top-level `key: value`, quoted strings and `>` / `|` block scalars. */
export function parseFrontmatter(text) {
  const m = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!m) return null;
  const lines = m[1].split("\n");
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, value] = kv;
    value = value.trim();
    if (/^[>|][+-]?$/.test(value)) {
      const block = [];
      while (i + 1 < lines.length && (/^\s/.test(lines[i + 1]) || lines[i + 1] === "")) block.push(lines[++i].trim());
      value = value.startsWith(">") ? block.join(" ").replace(/\s+/g, " ").trim() : block.join("\n").trim();
    } else {
      // Plain/quoted scalars may continue on following indented lines; fold them into one line.
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) value += " " + lines[++i].trim();
      if (/^".*"$/.test(value)) {
        try { value = JSON.parse(value); } catch { value = value.slice(1, -1); }
      } else if (/^'.*'$/.test(value)) {
        value = value.slice(1, -1).replace(/''/g, "'");
      }
    }
    data[key] = value;
  }
  return data;
}

/** All skills in this repo, grouped by the first folder under `skills/`. */
export function listRepoSkills(repoRoot) {
  const skillsRoot = join(repoRoot, "skills");
  return findSkillDirs(skillsRoot).map((dir) => {
    const rel = toPosix(relative(skillsRoot, dir));
    const meta = parseFrontmatter(readFileSync(join(dir, "SKILL.md"), "utf8")) ?? {};
    return { dir, rel, group: rel.split("/")[0], folder: rel.split("/").pop(), meta };
  });
}

/** Content hash of a directory tree (line endings normalised so CRLF checkouts compare equal). */
export function hashDir(root) {
  const h = createHash("sha256");
  if (!existsSync(root)) return null;
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else h.update(toPosix(relative(root, p)) + "\0" + readFileSync(p).toString("latin1").replace(/\r\n/g, "\n") + "\0");
    }
  };
  walk(root);
  return h.digest("hex");
}
