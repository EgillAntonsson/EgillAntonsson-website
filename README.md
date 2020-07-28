# [Egill Antonsson - website](https://www.egill.rocks) :guitar::musical_keyboard:

This is the project of my website [Egill.rocks](https://egill.rocks) :guitar::musical_keyboard:

## Development

Project uses the [Angular](https://angular.io) framework.

Run command `ng serve` to serve locally.

Run command `ng test` to run tests.

## Build steps

1. run command `py validate_sitemap.py`
    * validates deploy/sitemap.xml
2. run command `py build.py`
    * performs 'ng build --prod' which generates build artifacts into `dist` temporary folder [(details on '--prod' flag)](https://angular.io/guide/deployment#production-optimizations)
    * Uses `dist` folder to update `deploy` folder, making it ready for deployment
3. git commit changes and push to remote `master` branch

## Deployment

[Netlify](https://www.netlify.com) deploys `deploy` folder of remote `master` branch, integrated via `Netlify` Github App.

[![Netlify Status](https://api.netlify.com/api/v1/badges/bc4a4897-0a5a-4854-b26c-ff66d80c0d94/deploy-status)](https://app.netlify.com/sites/egillantonsson/deploys)
