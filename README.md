# Group Project - Intro to Programming

Group project for Introduction to Programming at NOVA.

## Team

- Tassilo Mylius
- Dominic Quadflieg
- Julius Veith

## The app: NOVAFit

A training app for your phone (Progressive Web App) in the design of Nova SBE: strength (lower body, upper body), running and yoga, with personal training plans, progress, stats, a calendar, badges and reminders.

On first start, new users create an account (name, email, password) and answer a short questionnaire:

1. About you: sex, age and body weight (the weight is used to estimate calories)
2. How many sessions per week (2–6)
3. How to split them across strength, running and yoga
4. Predefined goals, up to 2 per type and 6 in total (e.g. “10 km under 60 minutes”, “Your first pull-up”, “Exam-week stress relief”)
5. Level and time per session

NOVAFit then suggests three plans (balanced, focused on the main goal, easy start). The chosen plan sets the weekly goal and shows the next session on the home screen.

A session that has been started can be reset at any time (Reset → Start over or Delete session).

The account is a local profile: it lives on the phone together with the training data. The password is never stored in plain text, only as a salted PBKDF2-SHA256 hash, and locks the app on that device (Settings → Lock app).

## Files

The app needs no build step:

| File | Content |
|---|---|
| `app/index.html` | The app: layout, design (CSS) and logic (JavaScript) |
| `app/plan.js` | Sign-up validation, questionnaire checks and plan suggestions (pure functions, tested) |
| `app/run.js` | Running logic: reading runs from screenshots and from GPX, TCX and FIT files, checking the values, turning Strava activities into runs (pure functions, tested) |
| `app/muscles.js` | Which muscles were trained and how much, and the headline of the muscle slide in the reviews (pure functions, tested) |
| `app/manifest.webmanifest` | Name, colours and icon for the home screen |
| `app/OneSignalSDKWorker.js` | Service worker: offline use and push reminders |
| `app/img/` | Pictures for the home screen and training cards (placeholders) |
| `app/icon-*.png`, `app/apple-touch-icon.png` | App icons |
| `netlify/functions/strava.mjs` | Server part of the Strava connection (keeps the client secret) |
| `netlify.toml` | Netlify settings: publishes `app`, runs the Strava function |
| `app/INSTALL.txt` | How to install the app on a phone |
| `tests/plan.test.js` | Tests for `app/plan.js` |
| `tests/run.test.js` | Tests for `app/run.js` (screenshots) |
| `tests/run-files.test.js` | Tests for `app/run.js` (GPX, TCX, FIT, ZIP) |
| `tests/muscles.test.js` | Tests for `app/muscles.js` |
| `tests/strava.test.js` | Tests for the Strava connection (app side and function) |

## Run

- **Locally:** `python3 -m http.server 8000 --directory app`, then open http://localhost:8000 (opening `app/index.html` directly also works in most browsers).
- **On a phone:** drag the `app` folder onto https://app.netlify.com/drop, open the address on the phone and choose “Add to Home Screen” (details in `app/INSTALL.txt`). Everything works this way except Strava.
- **With Strava:** see below. The Strava connection needs the Netlify function, which Netlify Drop can't run.

## Strava connection

Garmin, Polar, Coros, Suunto and Apple Watch can send runs to Strava automatically. Connected to Strava, NOVAFit picks up those runs whenever the app is opened.

Strava gives each app a public client ID and a secret. The secret must never be in the app or in this repository, so a small Netlify Function (`netlify/functions/strava.mjs`) talks to Strava for the app.

One-time setup:

1. **Connect Netlify to GitHub:** on Netlify, *Add new site → Import an existing project → GitHub* and pick this repository. `netlify.toml` already says what to publish (`app`) and where the function is. Every merge into `main` then deploys automatically.
2. **Create a Strava API app:** https://www.strava.com/settings/api. Use the site address as *Website* and its domain (e.g. `novafit.netlify.app`, without `https://`) as *Authorization Callback Domain*.
3. **Add the keys to Netlify:** *Site configuration → Environment variables*: `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` from the Strava page, then deploy again.
4. Open the app: *Run → Connect Strava*. The Strava button only shows up once the function answers, so the app looks as before without this setup.

Notes:

- New Strava API apps can only be used by a few athletes at first. If more people want to connect, ask Strava for more capacity on the API settings page.
- NOVAFit only asks for read access to activities. The login stays on the phone under its own storage key, so it isn't part of backups or the cloud sync. *Settings → Strava → Disconnect* removes it and the access on Strava.
- Strava allows 100 requests per 15 minutes per app. NOVAFit checks at most every 15 minutes per phone.

## Test

Requires Node.js 18 or newer, no packages to install:

```
node --test
```

or `npm test`. The tests cover valid and rejected sign-up input (empty fields, invalid email, weak or too long passwords, markup in names), body data (age and weight limits, non-numeric input), questionnaire limits (days, mix, goals per type, level, session length) and the plan suggestions (session counts, rest days, edge cases). GitHub runs them automatically on every push and pull request.

## Replacing the pictures

**Photo pack (home screen and reviews):** put the photos into `app/img/pack/` with the names listed in `app/img/pack/README.txt`. They are used for the photo box on the home screen and as backgrounds in the weekly and monthly reviews, unless a user has added own photos in Settings. The list and the crop for portrait screens are in `PHOTO_PACK` in `app/index.html`. Missing files are skipped.

**Placeholder graphics:** the pictures in `app/img/` are placeholders:

| File | Where |
|---|---|
| `campus-1.svg`, `campus-2.svg` | Photo box on the home screen, only if the photo pack is empty |
| `gym.svg`, `run.svg`, `yoga.svg` | Picture at the top of the training cards |

To change the training card pictures, update the file names in `.simg-gym`, `.simg-run`, `.simg-yoga` in `app/index.html`. When you add files the app loads at start, also add them to `FILES` in `app/OneSignalSDKWorker.js` and increase `CACHE` by one so installed apps pick them up (photo pack files are cached automatically when they are first shown).

Only use your own photos or photos with a suitable licence – pictures from the Nova website are protected by copyright.

## Tracking changes

Every change is saved as its own commit with a short description. Versions are listed in [`CHANGELOG.md`](CHANGELOG.md); the exact code changes are under “Commits” on GitHub.
