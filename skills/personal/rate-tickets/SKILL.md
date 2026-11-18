---
name: rate-tickets
description: Rate GitHub tickets (a parent tree or a list) with one complexity label and one area label each.
argument-hint: "<issue> [issue...]"
disable-model-invocation: true
---

Give every open ticket in scope exactly one `complexity:*` label and one `area:*` label. Rate complexity by how hard the ticket is to get right, not by its size.

Rate from scratch: an existing label is shown as "old" in the table, never used as a hint.

## Complexity

- `complexity:low`: follows a pattern the repo already shows; little new logic; acceptance checkable directly. E.g. a doc refresh, a default or config change, wiring an existing value to a new place, prompt wording, a test fix.
- `complexity:medium`: a standard feature slice on the project's existing frameworks. E.g. new fields or states on an existing model, a page, an import, a report, a new endpoint. Several files, needs tests.
- `complexity:high`: a shared framework piece other tickets build on; money, permission or concurrency logic; a core pipeline stage; migrating existing data; or a build ticket with a decision still open inside it.

**Tie-break**, in order: any `high` trigger above → `high`. A schema change (new field, model or state) or a new page/endpoint → at least `medium`. A sibling ticket or existing code shows the same move → `low`. Still between two levels → the higher.

A decision ticket (research, prototype, a question for the owner) is rated by what deciding it takes: one lookup or one owner question → `low`; a choice inside one feature → `medium`; a choice that shapes several tickets or shared code → `high`.

## Area

Area is where the work lands:

- `area:ui`: user-facing screens, layout, theme, UX copy.
- `area:logic`: data model, business rules, API, import, report; the backend.
- `area:ai`: AI agents, prompts, tools, evals.
- `area:docs`: documentation only, with no code change.
- `area:ops`: deploy, containers, dependency or platform upgrades, CI, release.
- `area:multi`: two or more areas each carry real work (e.g. a new API plus a new page). A page that needs a one-line API tweak stays `area:ui`; the doc updates every code ticket makes on the way don't count.

## Labels

The nine labels, as `gh label create` makes them when missing:

| Name                | Colour   | Description                                                  |
| ------------------- | -------- | ------------------------------------------------------------ |
| `complexity:low`    | `C2E0C6` | Small slice on existing patterns; little new logic           |
| `complexity:medium` | `FBCA04` | Standard feature slice on existing frameworks                |
| `complexity:high`   | `B60205` | Shared framework, money/permission/concurrency, or open decision |
| `area:ui`           | `BFD4F2` | User-facing screens, layout, theme, UX copy                  |
| `area:logic`        | `BFD4F2` | Data model, business rules, API, import, report; the backend |
| `area:ai`           | `BFD4F2` | AI agents, prompts, tools, evals                             |
| `area:docs`         | `BFD4F2` | Documentation only, with no code change                      |
| `area:ops`          | `BFD4F2` | Deploy, containers, dependency or platform upgrades, CI, release |
| `area:multi`        | `BFD4F2` | Two or more areas each carry real work                       |

## Steps

1. **Collect** the scope. No issue passed → ask and stop. Each passed issue is in scope itself, plus its whole open sub-issue tree, recursively (`gh api 'repos/{owner}/{repo}/issues/<n>/sub_issues' --paginate`; where sub-issues aren't used, the children are the task list in the parent body). Closed tickets are out of scope and don't feed the roll-up; each ticket appears once. Done when every open ticket in scope is listed, each marked leaf (no open children) or parent.
2. **Rate each leaf** against the lists above. Read the full ticket (`gh issue view <n> --json number,title,body,labels,comments`); when the tie-break needs a fact the body doesn't give (does the pattern already exist? does it change the schema?), check the code or docs it names. Each rating carries a one-line reason naming the deciding fact. For more than ~15 leaves, split them across subagents that return rows in that shape, and spot-check a few of their rows. Done when every leaf has both labels and a reason.
3. **Roll up** parents bottom-up: complexity is the highest among its open children; area is the shared area of its children (ignoring `area:docs` children when others exist), else `area:multi`.
4. **Show** one table, leaves under their parent: `# | title | complexity (old → new) | area (old → new) | reason`, marking unchanged rows and flagging tickets that carry more than one `complexity:*` or `area:*` label. Check the nine names in [Labels](#labels) against `gh label list --limit 200`; under the table, propose each missing one with its row from [Labels](#labels) and ask whether to create it. Wait for explicit approval of both. When the user edits rows, check each new value is one of the nine names and re-show the changed rows.
5. **Apply** the approved rows. Create only the missing labels the user approved (`gh label create <name> -c <colour> -d "<description>"`, from [Labels](#labels)); rows that need a label the user declined stay unapplied and go in the report. Per changed ticket, one `gh issue edit <n>` that adds the new labels and removes every other `complexity:*` or `area:*` label it actually carries; leave all other labels alone. Done when every applied ticket re-reads with exactly one `complexity:*` and one `area:*` label, matching the table.
6. **Report** the tickets changed, unchanged, and any that failed.
