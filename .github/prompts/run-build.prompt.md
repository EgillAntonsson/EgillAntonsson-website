---
description: "Run production build workflow for Egill.rocks exactly per README.md and commit, but never push."
---

Run the repository production build workflow exactly as documented in `README.md`.

Use these sections as the source of truth:

1. `Build`
1. `AI-assisted build workflow`
1. `How to infer "changed since deployed"`

Requirements:

1. Follow README commands and order exactly.
1. Run `git add` and create one descriptive `git commit`.
1. Never run `git push`.
1. Return summary with changed files, warnings, and commit hash.
