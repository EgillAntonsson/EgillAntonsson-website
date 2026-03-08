# Copilot Instructions For This Repository

Use `README.md` as the canonical source for the build workflow.

- Build steps and required sitemap behavior: `README.md` section `Build`.
- AI behavior and invocation: `README.md` section `AI-assisted build workflow`.
- Deployment-diff inference rule: `README.md` section `How to infer "changed since deployed"`.

## Minimal enforcement rules

1. Follow the README workflow exactly when doing production build/release work.
2. AI may run `git add` and `git commit` with a descriptive commit message.
3. AI must never run `git push` (user always pushes manually).
4. Report command results and any warnings/errors.
