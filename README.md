# Surubao (Angular front-end)

| ![](_docs/repo-readme/screenshot-01.jpg) | 
|:--:| 
| *After setup is finished, your local page should looks like this* |

---

## Summary:

- [About](#about)
- [Stack](#stack)
- [Getting started](#getting-started)
    - [Cloning the repository](#cloning-the-repository)
    - [Installing dependencies](#installing-dependencies)
    - [Running local environment](#running-local-environment)
    - [Building](#building)
    - [Deploying](#deploying)
- [TODO](#todo)

---

## About

Basic blank front-end bootstrap project (Angular + TypeScript + Tailwind CSS + ThreeJS + Firebase + Socket.IO + AWS S3 CDN).
This repo provides a minimal, opinionated setup with PWA and Material, plus utilities like image-loading handling, text localization, a simple app-version panel, and an optional local CDN workflow for static assets.

---

## Stack

- Angular 17 (TypeScript, Router, Service Worker/PWA)
- Tailwind CSS + Flowbite
- Three.js (+ typings)
- Firebase (Hosting; Firestore rules optional)
- Socket.IO client
- Optional static assets via AWS S3 CDN

---

### Getting Started:

##### Cloning the repository:

To work locally you need [Angular CLI](https://github.com/angular/angular-cli) (preferably ^17).

```sh
# Clone the repository:
git clone https://github.com/joveem/base-angular-project-01
# Directory changing
cd base-angular-project-01
# Install dependencies:
npm install
```

##### Installing dependencies:

Install the local static server used by the convenience script that hosts a fake CDN during development.

```sh
npm install --save-dev five-server
```

##### Running local environment:

Create a folder named `.local-fake-cdn` at the repository root to simulate a CDN with icons, images, models, etc. Then run both the Angular app and the local CDN server in parallel:

```sh
npm run serve-local
```

- App: http://localhost:4200
- Fake CDN: http://localhost:2828

##### Building:

```sh
npm run build
```

Outputs go to `dist/` by default; the deploy scripts build into `./.build/<site>/build`.

##### Deploying:

Requires [Firebase CLI](https://firebase.google.com/docs/cli) and (optionally) [AWS CLI](https://aws.amazon.com/cli). You must also provide a `.app.config.json` at the repository root containing the current `AppVersion` and per-environment settings (Firebase Hosting site, S3 bucket name, and text-replacing rules). The deploy flow increments the version, builds, applies text replacing, deploys Hosting, and can sync the S3 CDN with `.local-fake-cdn`.

```sh
# Development env
_RUN-DEPLOY-DEVELOPMENT.bat

# Production env
_RUN-DEPLOY-PRODUCTION.bat
```

---

## TODO

Context: although this repo aims to be a generic base, the latest iteration was bootstrapped from an older landing-page project. Some useful features were kept, and the landing-specific content was removed quickly. The checklist below tracks the cleanup and generalization work.

- 🧹 Cleanup & Generalization
  - 🔁 Standardize generic names across components/services/routes
  - 🧾 Remove leftover copy, assets, and styles from the legacy landing page
  - 🗂️ Reorganize folders for clarity (e.g., `_app`, `_jovdk-web`, `_jovdk-web-threejs`)
  - 📚 Add short docs to each feature folder (README with purpose/usage)

- 🖼️ Image Cache Loading State
  - 🔍 Audit the image-loading directive/service behavior and events
  - 🧪 Add a small demo route to visualize states (loading/loaded/error/cached)
  - 📖 Document usage: inputs, outputs, best practices

- 🌐 Text Localization
  - 📦 Centralize i18n keys and provide a default `en` dictionary
  - 🔤 Replace remaining hardcoded strings in templates/components
  - 🧩 Add minimal API for language switching and persistence
  - 📖 Document conventions: key naming and file structure

- 🔢 App Version Panel / Build Version
  - ⚙️ Document `.app.config.json` and version bump on deploy
  - 🧪 Verify apply/reset on `environment.<env>.ts` during deploy
  - 📖 Document how to surface version in the UI

- 🚀 Deploy Flow & CDN
  - 📝 Add `.app.config.EXAMPLE.json` with fake values
  - 🧰 Validate text-replacing rules against `./.build/<site>/build/browser`
  - ☁️ Document S3 sync and cache headers; warn about conflicts

- 🧭 Developer Experience
  - 🧪 Add a “Showcase Scene” route for feature demos (img-loading, i18n)
  - 🧰 Optional: Storybook/Playwright scaffolding
  - 🧹 Add `npm run lint` and format hooks if desired

