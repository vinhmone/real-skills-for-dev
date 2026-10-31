---
name: commit-message-generator
description: Generate a clear, concise conventional commit message from staged code changes. Use when writing a commit message.
---

# Commit Message Generator

Read the staged diff and write one conventional commit message:

```
type(scope): subject

- Optional bullet.
```

- **type**: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test` or `chore`.
- **scope**: the main area touched, ideally one word (`auth`, `api`, `ui`).
- **subject**: imperative, lowercase, no period, at most 50 characters.
- **body**: only when the change spans several areas or the why isn't obvious. Give 2–5 one-line bullets
  (max 72 characters), each a capitalized imperative verb ending with a period, saying what changed, not how.

Rules:

- Give one message only, not a list of options. If the diff mixes unrelated changes, describe the main one.
- No file paths, line numbers or code.
- A teammate should get it in 5 seconds. When in doubt, go shorter.

Example:

```
feat(auth): add biometric login

- Add fingerprint and face unlock on the sign-in screen.
- Store the refresh token in secure storage.
```
