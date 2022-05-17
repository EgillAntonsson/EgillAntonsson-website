# [Egill Antonsson - website](https://www.egill.rocks)

This is the project of my personal website:

[Egill.rocks](https://egill.rocks)

## Development 💻💾

Project uses the [Angular](https://angular.io) framework

### Angular CLI, used commands:

#### [> ng serve](https://angular.io/cli/serve)

#### [> ng test](https://angular.io/guide/testing#set-up-testing)

#### [> ng e2e](https://angular.io/cli/e2e)

#### [> ng test --no-watch --code-coverage](https://angular.io/guide/testing-code-coverage)

## Build steps

requires `Python 3.7.1`

1. set `IS_ENABLED` to `false` in `log.service.ts`
1. `> py validate_sitemap.py`
    * validates deploy/sitemap.xml
1. `> py build.py`
    * executes 'ng build --prod' which generates build artifacts into temporary `dist/` folder (angular doc on ['--prod' flag](https://angular.io/guide/deployment#production-optimizations) )
    * Uses `dist/` folder to update `deploy/` folder, making it ready for deployment
1. git commit changes and push to remote

## Deployment

[Netlify](https://www.netlify.com) deploys `deploy/` on git push to remote `master` branch. (integrated via `Netlify` Github App)

[![Netlify Status](https://api.netlify.com/api/v1/badges/bc4a4897-0a5a-4854-b26c-ff66d80c0d94/deploy-status)](https://app.netlify.com/sites/egillantonsson/deploys)
