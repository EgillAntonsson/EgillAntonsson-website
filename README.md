# Egill Antonsson Website

This is the codebase project for my personal website:

## [Egill.rocks](https://egill.rocks)

## Development 💻💾

Project uses the [Angular](https://angular.io) framework

### Angular CLI most used commands 📜

- [> ng serve](https://angular.io/cli/serve)
- [> ng test](https://angular.io/guide/testing#set-up-testing)
- [> ng e2e](https://angular.io/cli/e2e)
- [> ng test --no-watch --code-coverage](https://angular.io/guide/testing-code-coverage)

## Build steps 🛠️

py scripts require `Python 3.7.1`

1. Make sure the `IS_ENABLED` is set to `false` in `log.service.ts`
1. Make appropriate changes to `deploy/sitemap.xml` if needed, then run `> py validate_sitemap.py`
1. `> py build.py`
    - executes `ng build --prod` which generates build artifacts into temporary `dist/` folder ([angular doc](https://angular.io/guide/deployment#production-optimizations))
    - Uses `dist/` folder to update `deploy/` folder, making it ready for deployment
1. git commit changes and push to remote

## Deployment 🚀

[Netlify](https://www.netlify.com) deploys `deploy/` (integrated via `Netlify` Github App).

[![Netlify Status](https://api.netlify.com/api/v1/badges/bc4a4897-0a5a-4854-b26c-ff66d80c0d94/deploy-status)](https://app.netlify.com/sites/egillantonsson/deploys)

### Domain redirects

Are defined in file [deploy/_redirects](deploy/_redirects) and handled by Netlify.

## [License](LICENSE) 📜
