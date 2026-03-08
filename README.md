# Egill Antonsson Website

This is the codebase project for my personal website:

## [Egill.rocks](https://egill.rocks)

## Build 🛠️

py scripts require `Python 3.7.1`

* Make sure the `IS_ENABLED` is set to `false` in `log.service.ts`
* Update `deploy/sitemap.xml` as part of every build:
	* Set `lastmod` to today's date for each page changed since the last deployed build.
	* At minimum, update changed section roots (for example `/music` and `/blog`) and any changed child pages under them.
* Validate sitemap and build:
```bash
> cd scripts/ && python3 validate_sitemap.py
# Run this exactly as shown above (using `python3` from your shell).
# Then build the project with:
> cd .. && npx ng build --configuration production
# Executes `ng build --prod` which generates build artifacts into temporary `dist/` folder ([angular doc](https://angular.io/guide/deployment#production-optimizations))
> python3 build.py
# Uses `dist/` folder to update `deploy/` folder, making it ready for deployment
```

### AI-assisted build workflow

For future builds, an AI agent will be initiated by me to run the full build workflow above.

Workflow rules:
1. AI runs all build steps (including sitemap update and validation) and reports results.
1. AI can run `git add` and `git commit` (with a descriptive commit message) without waiting for approval.
1. AI never runs `git push`.
1. I always run `git push` manually.

How to invoke:

1. Prompt command (recommended): run `/run-build` in Copilot Chat.
1. Agent mode: use the `build-release` custom agent and ask it to run the release build.

### How to infer "changed since deployed"

Assume the currently running Netlify deployment corresponds to the latest commit that was pushed to remote branch `master`.

In practice, compare local `master` with `origin/master`:

```bash
> git log --oneline origin/master..master
```

The commits listed there are inferred to be the changes not yet deployed.

## Deployment 🚀

[Netlify](https://www.netlify.com) deploys `deploy/` (integrated via `Netlify` Github App).

[![Netlify Status](https://api.netlify.com/api/v1/badges/bc4a4897-0a5a-4854-b26c-ff66d80c0d94/deploy-status)](https://app.netlify.com/sites/egillantonsson/deploys)

Domain redirects are defined in file [deploy/_redirects](deploy/_redirects) and handled by Netlify.

## [License](LICENSE) 📜

## Development 💻

Project uses the [Angular](https://angular.io) framework


### Angular CLI most used commands 📜

Recommended for local development:
```bash
> npx ng serve
# Uses the project-local Angular CLI version from node_modules.
# https://angular.io/cli/serve
```

* [ng test](https://angular.io/guide/testing#set-up-testing)
* [ng e2e](https://angular.io/cli/e2e)
* [ng test --no-watch --code-coverage](https://angular.io/guide/testing-code-coverage)

### One time setup for local development 🛠️
#### Installing Angular CLI globally
```bash
> sudo npm install -g @angular/cli@15.0.1
# The version should match the version defined in `package.json` file.
> ng version
# Confirm the installation.
# Angular will ask you for auto-completion, allow it if you want to use it.
```

#### Install the dependencies
```bash
> sudo npm install
# If you get peer dependency resolution errors (ERESOLVE), use:
> npm install --legacy-peer-deps
```

## Tons lifted | Creature lifted 🏋️‍♂️

This is optional and manual. It is not part of every build.

Steps to update the `Tons lifted / Creature lifted` table:
1. In the [FitNotes](http://www.fitnotesapp.com) app export the workout data as a CSV file (`Settings > Spreadsheet Export >` with `WorkoutData` selected).
1. Put the CSV file in the `scripts/fitNotesExport/` folder.
1. Be in dir `scripts/fitNotesExport/` and run `python3 process_fitnotes_export.py` to generate the `src/assets/data/FitNotes_Export_Processed.csv` file, that the website uses to display the table.
