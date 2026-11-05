# Real Skills For Dev

My personal collection of AI agent skills (Claude Code, Codex, Cursor, Copilot, …), installed with the
[`skills`](https://skills.sh) CLI.

Skills are grouped by source:

| Group | Folder | Source |
| --- | --- | --- |
| 1. Matt Pocock | `skills/mattpocock` | <https://github.com/mattpocock/skills> (synced automatically) |
| 2. Ponytail | `skills/ponytail` | <https://github.com/dietrichgebert/ponytail> (synced automatically) |
| 3. Personal | `skills/personal` | Written here, plus Cloudflare's synced security audit skill |
| 4. Office | `skills/office` | <https://github.com/anthropics/skills/tree/main/skills> (synced automatically) |

The installer (`npx skills add`) shows three selectable groups instead (toggle a whole group at once):

- **Recommended** — all Matt Pocock skills, the personal skills (except `code-review-senior`), and `ponytail`.
- **Others** — everything else (`code-review-senior` and the `ponytail-*` helpers).
- **Office** — Anthropic's `docx`, `pdf`, `pptx`, and `xlsx` skills.

They are defined by `installerGroups` in [`upstreams.json`](upstreams.json) and written to
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) by `npm run generate` — don't edit that file by
hand. A skill can only be in one installer group; new upstream skills land in the first group whose pattern matches
(new Matt Pocock skills → Recommended, new Ponytail skills → Others).

## Install

```bash
# Pick skills interactively
npx skills@latest add vinhmone/real-skills-for-dev

# See what's available without installing
npx skills@latest add vinhmone/real-skills-for-dev --list

# Install specific skills, for specific agents, globally
npx skills@latest add vinhmone/real-skills-for-dev -s tdd -s ponytail -a claude-code -a codex -g

# Install every skill from one source folder
npx skills@latest add https://github.com/vinhmone/real-skills-for-dev/tree/main/skills/personal
```

Update installed skills later with `npx skills@latest update`; re-run `add` to pick up new ones.

## How to use

### First time in a project

```text
/setup-matt-pocock-skills
```

Run once per repo. It sets up where tickets live (GitHub Issues or local markdown), the triage labels and the docs
layout. The other skills read this setup.

### Building a feature you can already describe

```text
/to-spec                           # turn the conversation into a spec
/to-tickets                        # split the spec into tickets
/implement-leaf-ticket <spec #>    # build the next ready ticket under the spec; repeat until done
/implement <ticket #>              # …or build one specific ticket
```

Talk the feature through with the agent before `/to-spec` (`/grill-me` if you want to be questioned).

### Big or unclear work

```text
/wayfinder                         # chart a map of decisions (a parent ticket with child tickets)
/wayfinder <map #>                 # resolve the next decision; repeat, one per session
/to-tickets                        # once no decisions are left, turn the map into build tickets
```

Make a rough plan with the agent before the first `/wayfinder`. After `/to-tickets`, build the tickets the same way as
above.

## Keeping upstream skills up to date

Upstreams are configured in [`upstreams.json`](upstreams.json); the commit each group was last synced from is
pinned in [`upstreams.lock.json`](upstreams.lock.json).

```bash
npm run sync              # pull the latest skills from every upstream
npm run sync -- ponytail  # just one upstream
npm run sync -- office    # just the four Office skills
npm run sync -- security-audit # just Cloudflare's security audit skill
npm run validate          # check SKILL.md frontmatter, unique names, generated files
```

`npm run sync` wipes and re-copies each upstream's folder (so skills deleted upstream disappear here too), copies
configured upstream licenses into `licenses/`, preserves licenses inside skill folders, and regenerates the tables
below plus `.claude-plugin/marketplace.json`. Office syncs only `docx`, `pdf`, `pptx`, and `xlsx`, including their
supporting scripts and assets.
Cloudflare's [security-audit](https://github.com/cloudflare/security-audit-skill) syncs only into
`skills/personal/security-audit`, preserving the other personal skills.
The pinned commit only moves when skill content actually changed.

The [Sync upstream skills](.github/workflows/sync-skills.yml) workflow does this every Sunday at 21:00 (UTC+7), or
on demand from the Actions tab, and opens/updates a PR on the `bot/sync-skills` branch when anything changed.

Don't hand-edit files under `skills/mattpocock`, `skills/ponytail`, or `skills/office` — the next sync overwrites them. Put your
own skills (or customised copies with a different `name`) in `skills/personal`.
The exception is `skills/personal/security-audit`: it is managed by upstream sync, so don't hand-edit it either.

## Adding a personal skill

```bash
mkdir -p skills/personal/my-skill
```

Create `skills/personal/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: What it does and when the agent should use it.
---

Instructions…
```

To put it in the Recommended group, add `personal/my-skill` to that group's `include` in [`upstreams.json`](upstreams.json)
(otherwise it lands in Others). Then run `npm run generate` (or `npm run validate` to check).
Skill names must be unique across all groups, because installers key on `name`.

## Skills

<!-- skills:start (generated by `npm run generate`, do not edit) -->

### 1. Matt Pocock (`skills/mattpocock`)

Synced from <https://github.com/mattpocock/skills>.

| Skill | Installer group | Description |
| --- | --- | --- |
| [`ask-matt`](skills/mattpocock/engineering/ask-matt) | Recommended | Ask which skill or flow fits your situation. A router over the skills in this repo. |
| [`code-review`](skills/mattpocock/engineering/code-review) | Recommended | Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X". |
| [`codebase-design`](skills/mattpocock/engineering/codebase-design) | Recommended | Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary. |
| [`diagnosing-bugs`](skills/mattpocock/engineering/diagnosing-bugs) | Recommended | Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow. |
| [`domain-modeling`](skills/mattpocock/engineering/domain-modeling) | Recommended | Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR. |
| [`grill-with-docs`](skills/mattpocock/engineering/grill-with-docs) | Recommended | A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go. |
| [`implement`](skills/mattpocock/engineering/implement) | Recommended | Implement a piece of work based on a spec or set of tickets. |
| [`implement-spec`](skills/mattpocock/engineering/implement-spec) | Recommended | Implement the result of /to-spec and /to-tickets in code. |
| [`improve-codebase-architecture`](skills/mattpocock/engineering/improve-codebase-architecture) | Recommended | Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick. |
| [`pr`](skills/mattpocock/engineering/pr) | Recommended | Use when writing a PR body. |
| [`prototype`](skills/mattpocock/engineering/prototype) | Recommended | Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like. |
| [`research`](skills/mattpocock/engineering/research) | Recommended | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent. |
| [`retro`](skills/mattpocock/engineering/retro) | Recommended | Conduct a retrospective on a coding session. |
| [`setup-matt-pocock-skills`](skills/mattpocock/engineering/setup-matt-pocock-skills) | Recommended | Configure this repo for the engineering skills: set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the other engineering skills. |
| [`tdd`](skills/mattpocock/engineering/tdd) | Recommended | Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests. |
| [`to-spec`](skills/mattpocock/engineering/to-spec) | Recommended | Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed. |
| [`to-tickets`](skills/mattpocock/engineering/to-tickets) | Recommended | Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker (edges as text in one file per ticket locally, or native blocking links on a real tracker). |
| [`triage`](skills/mattpocock/engineering/triage) | Recommended | Move issues and external PRs through a state machine of triage roles, categorise, verify, grill if needed, and write agent-ready briefs. |
| [`wayfinder`](skills/mattpocock/engineering/wayfinder) | Recommended | Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets on your issue tracker, and resolve them one at a time until the way to the destination is clear. |
| [`wizard`](skills/mattpocock/engineering/wizard) | Recommended | Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don't invoke this for steps the agent can perform itself. |
| [`grill-me`](skills/mattpocock/productivity/grill-me) | Recommended | A relentless interview to sharpen a plan or design. |
| [`grilling`](skills/mattpocock/productivity/grilling) | Recommended | Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases. |
| [`handoff`](skills/mattpocock/productivity/handoff) | Recommended | Compact the current conversation into a handoff document for another agent to pick up. |
| [`teach`](skills/mattpocock/productivity/teach) | Recommended | Teach the user a new skill or concept, within this workspace. |
| [`to-questionnaire`](skills/mattpocock/productivity/to-questionnaire) | Recommended | Turn a decision you can't fully answer into a questionnaire for someone else to fill in. |
| [`wait-what`](skills/mattpocock/productivity/wait-what) | Recommended | Stop. That last message did not land: re-pitch it. |
| [`writing-for-agents`](skills/mattpocock/productivity/writing-for-agents) | Recommended | Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md. |

### 2. Ponytail (`skills/ponytail`)

Synced from <https://github.com/dietrichgebert/ponytail>.

| Skill | Installer group | Description |
| --- | --- | --- |
| [`ponytail`](skills/ponytail/ponytail) | Recommended | Lazy senior dev mode: the smallest change that fully solves the task, and a reply a busy human understands in one read. Use on any coding task (writing, fixing, refactoring, reviewing, choosing dependencies) and when the user says "ponytail", "be lazy", "simplest solution", "yagni", or complains about over-engineering or bloat. Levels: lite, full (default), ultra. |
| [`ponytail-audit`](skills/ponytail/ponytail-audit) | Others | Quality audit of a whole repo: bugs, security holes, what breaks under real load, risky code without tests, slow paths, and what to delete, merge or split. Ranked, each finding explained in plain English. One-shot report, changes nothing. Use for "audit this codebase", "review the whole repo", "find bloat", "what can I delete", /ponytail-audit. |
| [`ponytail-debt`](skills/ponytail/ponytail-debt) | Others | List every `shortcut:` comment (and older `ponytail:` ones) as a debt ledger. One-shot report, changes nothing. Use for "ponytail debt", "what did ponytail defer", "list the shortcuts", /ponytail-debt. |
| [`ponytail-gain`](skills/ponytail/ponytail-gain) | Others | Show ponytail's measured savings (code, cost, speed) from the benchmark. One-shot display. Use for /ponytail-gain, "what does ponytail save", "ponytail impact". |
| [`ponytail-help`](skills/ponytail/ponytail-help) | Others | Quick reference for ponytail levels, skills and commands. One-shot display. Use for /ponytail-help, "ponytail help", "how do I use ponytail". |
| [`ponytail-review`](skills/ponytail/ponytail-review) | Others | Quality review of a change: is the logic right, is it safe, does it hold under real load, is risky code tested, is it fast enough, and is every line needed. Reads the connected code, not only the diff. Each finding is explained in plain English. Use for "review this", "code review", "review the last commit", "review my PR", "is this over-engineered", /ponytail-review. |

### 3. Personal (`skills/personal`)

| Skill | Installer group | Description |
| --- | --- | --- |
| [`code-review-senior`](skills/personal/code-review-senior) | Others | Senior code review skill. Analyze code changes for security, performance, code quality, architecture, and testing. Use when reviewing code changes. |
| [`commit-message-generator`](skills/personal/commit-message-generator) | Recommended | Generate a clear, concise conventional commit message from staged code changes. Use when writing a commit message. |
| [`explain-in-vietnameses`](skills/personal/explain-in-vietnameses) | Recommended | Giải thích các khái niệm kỹ thuật, nghiệp vụ, domain hoặc kiến trúc phức tạp bằng tiếng Việt bình dân, trực quan cho người mới bắt đầu. Giữ nguyên thuật ngữ tiếng Anh kèm nghĩa tiếng Việt, tiếng lóng/thông tục và ví dụ thực tế. Dùng khi người dùng yêu cầu "giải thích dễ hiểu", "giải thích cho người không biết gì", "nói tiếng người", "eli5", "bình dân", hoặc gọi /explain-in-vietnameses. |
| [`implement-leaf-ticket`](skills/personal/implement-leaf-ticket) | Recommended | Implement the next leaf GitHub issue end to end: build, review, commit, push, close. |
| [`security-audit`](skills/personal/security-audit) | Recommended | Security guidance and vulnerability review for codebases, APIs, services, CLI tools, libraries, and daemons. Use for security questions, focused reviews, vulnerability research, security audits, or pen tests. Run the complete workflow only for explicit codebase audit or pen-test requests, full/comprehensive/end-to-end reviews, or requested report artifacts. |

### 4. Office (`skills/office`)

Synced from <https://github.com/anthropics/skills>.

| Skill | Installer group | Description |
| --- | --- | --- |
| [`docx`](skills/office/docx) | Office | Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx files). Triggers include: any mention of 'Word doc', 'word document', '.docx', '.dotx', or requests to produce professional documents with formatting like tables of contents, headings, page numbers, or letterheads. Also use when extracting or reorganizing content from .docx or .dotx files, inserting or replacing images in documents, performing find-and-replace in Word files, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a 'report', 'memo', 'letter', 'template', or similar deliverable as a Word or .docx file, use this skill. Do NOT use for PDFs, spreadsheets, Google Docs, or general coding tasks unrelated to document generation. |
| [`pdf`](skills/office/pdf) | Office | Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable. If the user mentions a .pdf file or asks to produce one, use this skill. |
| [`pptx`](skills/office/pptx) | Office | Use this skill any time a .pptx or .potx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations; reading, parsing, or extracting text from any .pptx or .potx file (even if the extracted content will be used elsewhere, like in an email or summary); editing, modifying, or updating existing presentations; combining or splitting slide files; working with templates (.potx), layouts, speaker notes, or comments. Trigger whenever the user mentions "deck," "slides," "presentation," or references a .pptx or .potx filename, regardless of what they plan to do with the content afterward. If a .pptx or .potx file needs to be opened, created, or touched, use this skill. |
| [`xlsx`](skills/office/xlsx) | Office | Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit, or fix an existing .xlsx, .xlsm, .xltx, .csv, or .tsv file (e.g., adding columns, computing formulas, formatting, charting, cleaning messy data); create a new spreadsheet from scratch or from other data sources; or convert between tabular file formats. Trigger especially when the user references a spreadsheet file by name or path — even casually (like "the xlsx in my downloads") — and wants something done to it or produced from it. Also trigger for cleaning or restructuring messy tabular data files (malformed rows, misplaced headers, junk data) into proper spreadsheets. The deliverable must be a spreadsheet file. Do NOT trigger when the primary deliverable is a Word document, HTML report, standalone Python script, database pipeline, or Google Sheets API integration, even if tabular data is involved. |
<!-- skills:end -->

## Licenses

This repo (scripts and locally authored personal skills) is [MIT](LICENSE). Matt Pocock and Ponytail skills retain their MIT
licenses, copied to [`licenses/`](licenses).
Cloudflare's security audit skill retains its [MIT license](licenses/security-audit.LICENSE).

Office skills retain Anthropic's license in each skill folder:
[`docx`](skills/office/docx/LICENSE.txt), [`pdf`](skills/office/pdf/LICENSE.txt),
[`pptx`](skills/office/pptx/LICENSE.txt), and [`xlsx`](skills/office/xlsx/LICENSE.txt).
These are not MIT-licensed; their terms include restrictions on copying, modification, and redistribution.
