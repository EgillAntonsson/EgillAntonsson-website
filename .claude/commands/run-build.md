Run the full production build workflow for this project. Follow every step below in order, stopping and reporting if any step fails.

## Rules
- You may run `git add` and `git commit` (with a descriptive message) without waiting for approval.
- You must NEVER run `git push`.

## Steps

### 1. Check logging is disabled
Verify that `IS_ENABLED` is set to `false` in `src/app/shared/services/log.service.ts`. If it is not `false`, set it to `false` before proceeding.

### 2. Update sitemap
Determine which pages have changed since the last deployed build by running:
```bash
git log --oneline origin/master..master
```
The currently running Netlify deployment corresponds to the latest commit pushed to `origin/master`. The commits listed above are changes not yet deployed.

Update `deploy/sitemap.xml`:
- Set `lastmod` to today's date for each page changed since the last deployed build.
- At minimum update changed section roots (e.g. `/blog`, `/music`) and any changed child pages under them.

### 3. Validate sitemap
```bash
cd scripts && python3 validate_sitemap.py
```
Report the output. Stop if validation fails.

### 4. Angular production build
```bash
cd .. && npx ng build --configuration production
```
Report the output. Stop if the build fails.

### 5. Update deploy folder
```bash
python3 build.py
```
This copies artifacts from `dist/` into `deploy/`, making it ready for deployment. Report the output.

### 6. Commit
Stage and commit all changes (source + deploy artifacts) with a descriptive commit message that summarises what changed since the last deployed build.

### 7. Report
Confirm all steps passed and remind the user to run `git push` manually when ready to deploy.
