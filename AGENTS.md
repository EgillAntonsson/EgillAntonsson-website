# AGENTS.md

This file contains build process information and other workflow details for this project. It references the comprehensive documentation in README.md and avoids duplicating content where possible. Code style conventions are defined in .editorconfig.

## Build Process
This project uses Angular 15.0.1 with Angular CLI 15.0.1.

For comprehensive build instructions, see [README.md](README.md#build-️) section "Build 🛠️".

### Key Files to Update During Build
- `deploy/sitemap.xml` - Must be updated with current dates for changed pages since last deployment
- `src/assets/data/FitNotes_Export_Processed.csv` - Optional, manually updated when needed

### Sitemap Update Method
Assume the running Netlify deployment corresponds to the latest commit on `master`. 
To identify changes since last deployed:
```bash
git log --oneline origin/master..master
```

## Development
- Local dev server: `npx ng serve`
- Test command: `ng test` or `ng test --no-watch --code-coverage`

## Special Requirements
- Python 3.7.1 required for scripts
- In `log.service.ts`, ensure `IS_ENABLED` is set to `false` before building for production
- Use `python3` explicitly when running Python scripts (not just `python`)
