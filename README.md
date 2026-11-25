# Developer World

Pranesh Ramesh’s software portfolio in an explorable Three.js town. The homepage also serves Recruiter Mode as HTML, with searchable sections and shareable project and credential pages.

## Run locally

Use Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Drive with WASD or the arrow keys. Use Space to brake, F to enter or exit, E to interact, M to open the map, R to reset the vehicle, and Escape for settings. Touch screens get a joystick and action buttons. Recruiter Mode is available at `/#recruiter`.

## Build and verify

```sh
npm run lint
npm run typecheck
npm test -- --runInBand
npm run build
npm run start
```

With the app running, use `npm run test:e2e` and `node scripts/measure-world.mjs`. The browser tools default to localhost port 3000 and accept a `PLAYWRIGHT_BASE_URL`. Install Playwright Chromium with `npx playwright install chromium` if Chrome is unavailable. The measurement script accepts `--mobile`, `--software` and `--throttle`.

The default Vercel Next.js preset builds this app. The contact link uses the visitor’s email client. The town plays synthesized audio and the scripted dialogue runs locally without API keys.

## Content and assets

- `lib/portfolio.ts` contains projects, skills, links and credentials.
- `lib/city.ts` contains the city layout and destinations. `components/city` contains original procedural models, game logic and audio.
- Certificate artwork belongs to its respective issuers. Published previews come from the supplied documents. The project screenshot comes from the public Twincord portal.
- `scripts/prepare-resume.py` generates the public résumé. It requires Python with ReportLab. Keep source documents with residential details and private offer letters outside `public`.

Verification, measurements and known limits are tracked in `PROGRESS.md`.
