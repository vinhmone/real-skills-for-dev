---
name: implement-leaf-ticket
description: "Implement the next leaf GitHub issue end to end: build, review, commit, push, close. Also resolves wayfinder decision tickets."
---

1. **Pick** the next *leaf*: an open issue with no open sub-issues and no open blockers. If a ticket is passed, search only its sub-issue tree (it is the leaf if it has none); otherwise search all open issues. Take the first in its parent's order (else lowest number). Skip:
   - leaves only a human can do;
   - `wayfinder:*` tickets already assigned: the assignee is another session's claim;
   - HITL wayfinder tickets (`grilling`, `prototype`, or a `task` needing the human), unless you will work them live with the human in this session. A dispatched worker never can.

   A `wayfinder:map` issue is never a leaf. If its tree has no open tickets, the way is clear: report that and stop.
2. **Route** by label: a leaf labelled `wayfinder:<type>` is a decision ticket. Go to [Wayfinder ticket](#wayfinder-ticket). Every other leaf continues at step 3.
3. **Build** it: call the Skill tool with "ponytail", then read and follow `.agents/skills/implement/SKILL.md` (user-only, so the Skill tool can't load it).
4. **Clean up** where needed: remove throwaway work created for this task and code made redundant by the implementation. Keep cleanup within the task's scope and run the relevant tests on the final result.
5. **Reconcile** related material before closing: update affected docs in the same change, and update the ticket and related parent/blocker issues to reflect the delivered scope, acceptance checklist, and any remaining work. Keep the issue open if its acceptance criteria are still unmet.
6. **Review**: keep fixing and re-running "code-review" until a pass comes back with no findings.
7. **Ship**: once cleanup, related updates, tests, and review are complete, commit and push (child repos before the parent's submodule pin), then close the issue with a comment naming the commits.

## Wayfinder ticket

Read `.agents/skills/wayfinder/SKILL.md` (user-only, so the Skill tool can't load it) and run its **Work through the map** steps with this leaf as the named ticket and its `wayfinder:map` parent as the map. Done when the leaf is closed with a resolution comment, the map's Decisions-so-far has its line, and any fog the answer sharpened has graduated into wired tickets.

Wayfinder's rules govern this branch:

- The output is a **decision**: a resolution comment, not code. Skip steps 3–7 unless the map's Notes carry execution into the map. In that case a `task` that changes the repo runs steps 3–7 and closes with both the resolution comment and the commits.
- Resolve **one** ticket per session (research tickets excepted), then stop and report.
- On a HITL ticket the human gives their own side of the exchange. You ask; they answer.

## Throughout

- Steps written for a human are yours whenever you can do or verify them; the owner's approval is standing. The human's side of a HITL wayfinder ticket stays theirs.
- Delegate to subagents (they may spawn their own), use cheaper models for small tasks. Tell code-writing subagents to load "ponytail".
