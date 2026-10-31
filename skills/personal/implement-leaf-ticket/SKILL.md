---
name: implement-leaf-ticket
description: "Implement the next leaf GitHub issue end to end: build, review, commit, push, close."
---

1. **Pick** the next *leaf*: an open issue with no open sub-issues and no open blockers. If a ticket is passed, search only its sub-issue tree (it is the leaf if it has none); otherwise search all open issues. Take the first in its parent's order (else lowest number). Skip leaves only a human can do.
2. **Build** it: call the Skill tool with "ponytail", then read and follow `.agents/skills/implement/SKILL.md` (user-only, so the Skill tool can't load it).
3. **Clean up** where needed: remove throwaway work created for this task and code made redundant by the implementation. Keep cleanup within the task's scope and run the relevant tests on the final result.
4. **Reconcile** related material before closing: update affected docs in the same change, and update the ticket and related parent/blocker issues to reflect the delivered scope, acceptance checklist, and any remaining work. Keep the issue open if its acceptance criteria are still unmet.
5. **Review**: keep fixing and re-running "code-review" until a pass comes back with no findings.
6. **Ship**: once cleanup, related updates, tests, and review are complete, commit and push (child repos before the parent's submodule pin), then close the issue with a comment naming the commits.

Throughout:

- Steps written for a human are yours whenever you can do or verify them; the owner's approval is standing.
- Delegate to subagents (they may spawn their own), use cheaper models for small tasks. Tell code-writing subagents to load "ponytail".
