# AGENTS.md

Notes for coding agents (and new team members) working on NOVAFit.

## Stack

- Plain HTML, CSS and JavaScript, no framework and no build step
- `app/index.html` contains the app; `app/plan.js` holds the testable logic for sign-up, questionnaire, splits and plans; `app/exercises.js` the exercise library, workout templates and custom-exercise checks (exercise ids are stored in the history, never rename or remove one); `app/run.js` the testable running logic (screenshots, GPX/TCX/FIT files, importing a training history from Garmin and Strava); `app/yoga.js` the yoga sessions, their timing, which one to suggest (time of day and the yoga goals) and the flexibility check (`S.settings.flex`)
- Data is stored in `localStorage` under the key `po-plan-app-v2` (do not rename it, or existing users lose their data)
- Strava connection: `netlify/functions/strava.mjs` (Netlify Function, needs `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` set in Netlify, never in the repo); Strava tokens live only in `localStorage` under `novafit-strava`, never in `S`
- Runs near you: hand-picked routes in `app/run.js` (`NEARBY_ROUTES`, at most 4, so with the loop there are never more than 5 suggestions); the loop from here comes from `netlify/functions/route.mjs` (openrouteservice, needs `ORS_API_KEY` in Netlify); the exact position is only sent for that one request and never stored
- Service worker and push reminders: `app/OneSignalSDKWorker.js` (bump `CACHE` when files change)
- Tests: Node.js built-in test runner, no dependencies

## Commands

- Run locally: `python3 -m http.server 8000 --directory app`, then open http://localhost:8000
- Run tests: `node --test` (or `npm test`)

## Conventions

- The app UI is in English
- Keep logic that can be tested in `app/plan.js`, `app/exercises.js`, `app/run.js` or `app/yoga.js` as pure functions and add tests in `tests/`
- Validate all user input and show a clear error next to the field
- Never store passwords or other secrets in plain text or in the repository
- One change per commit and pull request, with a short description; update `CHANGELOG.md`
