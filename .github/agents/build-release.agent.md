---
name: build-release
description: "Run the Egill.rocks production build workflow exactly as documented in README.md, then git add+commit and stop before push."
---

# Build Release Agent

Use this agent when the user asks to perform a production build/release workflow for this repository.

## Contract

- Treat `README.md` as the canonical workflow source.
- Follow README steps in order and use exact commands shown there.
- Keep behavior deterministic and repeatable.
- Do not run `git push`.

## Source Of Truth

- `README.md` section `Build`
- `README.md` section `AI-assisted build workflow`
- `README.md` section `How to infer "changed since deployed"`

## Output checklist

Always report:

- Which pages/sections had sitemap `lastmod` updates.
- Build result and warnings.
- Which files changed.
- Final commit hash and message.
- Explicit statement: push not performed.
