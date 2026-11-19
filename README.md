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
6. How to split the strength sessions, e.g. for three a week: 3× Full Body, Push / Pull / Legs, 2× Upper + 1× Lower or 1× Upper + 2× Lower (the best match for the goal and level is marked)

NOVAFit then suggests three plans (balanced, focused on the main goal, easy start). Each week combines the strength split with running and yoga, avoids a run the day after a heavy leg session and suggests a short mobility routine after each session. The chosen plan sets the weekly goal and shows the next session on the home screen.

The exercise library has 124 exercises, each with a drawing (named like in the Strong app, e.g. “Bench Press (Barbell)”), searchable by name, body part and equipment. In a session, exercises can be added, removed or swapped, and users can create their own exercises. Sets are logged as weight × reps, reps only, assisted (kg of help) or time.

A session that has been started can be reset at any time (Reset → Start over or Delete session).

The account is a local profile: it lives on the phone together with the training data. The password is never stored in plain text, only as a salted PBKDF2-SHA256 hash, and locks the app on that device (Settings → Lock app).

## Files

The app needs no build step:

| File | Content |
|---|---|
| `app/index.html` | The page: layout and design (CSS) |
| `app/app.js` | The app itself: screens, sessions, storage and everything you tap (kept out of `index.html` so the site can forbid inline scripts) |
| `app/plan.js` | Sign-up validation, questionnaire checks, strength splits and plan suggestions (pure functions, tested) |
| `app/exercises.js` | Exercise library, workout templates, search and checks for custom exercises (pure functions, tested) |
| `app/run.js` | Running logic: reading runs from screenshots and from GPX, TCX and FIT files, checking the values, turning Strava activities into runs (pure functions, tested) |
| `app/muscles.js` | Which muscles were trained and how much, and the headline of the muscle slide in the reviews (pure functions, tested) |
| `app/manifest.webmanifest` | Name, colours and icon for the home screen |
| `app/OneSignalSDKWorker.js` | Service worker: offline use and push reminders |
| `app/img/` | Pictures for the home screen and training cards (placeholders) |
| `app/img/ex/` | Exercise drawings from Everkinetic and Workout Guide, CC BY-SA 4.0, see `SOURCES.md` there |
| `app/icon-*.png`, `app/apple-touch-icon.png` | App icons |
| `netlify/functions/route.mjs` | Server part of “A loop from here” (keeps the openrouteservice key) |
| `netlify/lib/guard.mjs` | Shared protection for the functions: same site only, rate limit, small requests |
| `netlify/functions/strava.mjs` | Server part of the Strava connection (keeps the client secret) |
| `netlify.toml` | Netlify settings: publishes `app`, runs the Strava function |
| `app/INSTALL.txt` | How to install the app on a phone |
| `releases/` | Zipped versions of the app, ready to install |
| `tests/plan.test.js` | Tests for `app/plan.js` |
| `tests/exercises.test.js` | Tests for `app/exercises.js` |
| `tests/run.test.js` | Tests for `app/run.js` (screenshots) |
| `tests/run-files.test.js` | Tests for `app/run.js` (GPX, TCX, FIT, ZIP) |
| `tests/muscles.test.js` | Tests for `app/muscles.js` |
| `tests/history.test.js` | Tests for importing a training history (Garmin CSV, Strava archive, files) |
| `tests/nearby.test.js` | Tests for “Runs near you” (routes, loop link and shape, route function) |
| `tests/guard.test.js` | Tests for the protection of the functions |
| `tests/strava.test.js` | Tests for the Strava connection (app side and function) |

## Run

- **Locally:** `python3 -m http.server 8000 --directory app`, then open http://localhost:8000 (opening `app/index.html` directly also works in most browsers).
- **Ready-made download:** `releases/NOVAFit 2.8.2.zip` contains the current app. Unzip it and use the `novafit` folder like the `app` folder below.
- **On a phone:** drag the `app` folder onto https://app.netlify.com/drop, open the address on the phone and choose “Add to Home Screen” (details in `app/INSTALL.txt`). Everything works this way except Strava.
- **With Strava:** see below. The Strava connection needs the Netlify function, which Netlify Drop can't run.

## Bring your training history

New users can bring their runs from other apps right after choosing a plan (“Bring your training history”), and everyone can do it later under *Settings → Your data → Import runs from other apps*:

| Source | What to choose | How to get it |
|---|---|---|
| Garmin Connect | the activity list (CSV) | connect.garmin.com → *Activities → All Activities* → scroll until the year is loaded → *Export CSV* |
| Strava | the archive (ZIP) or `activities.csv` from it | strava.com → *Settings → My Account → Download or Delete Your Account → Request Your Archive* |
| Strava (connected) | nothing, NOVAFit gets the runs since 1 January | needs the Strava connection below |
| Polar, Coros, Suunto, Apple Watch … | several GPX, FIT or TCX files at once | export from the app of the watch |

A preview shows the number of runs and kilometres, with the time range (this year, last 12 months, everything), walks on or off, and kilometres or miles for Garmin files. Rides and other sports are left out, runs that are already in NOVAFit are skipped, and an import can be undone right away. Everything is read on the phone; big Strava archives are not loaded completely, only the activity list inside.

## Runs near you

*Run → Runs near you* suggests at most five runs:

- **Up to 4 hand-picked routes** (`NEARBY_ROUTES` in `app/run.js`): Carcavelos seafront, Oeiras seafront, Paredão Estoril–Cascais and the Lisbon riverside at Belém, sorted by how far away they are. The weather location is used for this (rounded to about 1 km, Nova SBE if location is off). Routes that fit the next run of your running plan are marked. Lengths are approximate: it's a demo set, check them before you rely on them.
- **A loop from here:** pick 3, 5, 8 or 10 km (or the length of your next plan run) and NOVAFit makes a round trip on foot paths from where you are, shows its shape and opens it in Google Maps. For this one request the position is sent to the route service, it isn't stored.

“Start this run” opens an outdoor run with the distance and the route already filled in.

The loop needs a free openrouteservice key (the list of routes works without it):

1. Sign up at https://openrouteservice.org and create a token in the dashboard.
2. In Netlify → *Site configuration → Environment variables* add `ORS_API_KEY` with the token, then deploy again (like the Strava keys, it only works when Netlify is connected to this repository).

Without the key the app shows “Needs a one-time setup” instead of the loop button.

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

## Security

What is protected, and what isn't:

- **No secrets in the repository.** The Strava and openrouteservice keys live only in Netlify's environment variables and are used by the functions; the app never sees them.
- **Passwords** are stored only as a salted PBKDF2-SHA256 hash, never as text.
- **Input is checked** where it comes in: forms (with an error next to the field), imported files (GPX, FIT, TCX, CSV, ZIP) and backup files. Text that comes back from a backup or the cloud sync is cleaned before it is shown (`safeText`, `safeCustom` in `app/exercises.js`), and names are escaped in the HTML.
- **Content-Security-Policy** (`netlify.toml`): the browser runs only our own scripts (no inline scripts), the pinned text recognition and OneSignal, and only connects to the services the app uses. Further headers stop the app from being framed and from sniffing file types.
- **Pinned outside code:** the text recognition is fixed to version 5.1.1 and checked with Subresource Integrity, so a changed file on the CDN is refused. The app itself has no npm dependencies.
- **The functions** only accept calls from the site itself, limit each IP address (Strava 120, loops 20 per 10 minutes) and refuse large requests (`netlify/lib/guard.mjs`).

Limits we know about:

- **Data lives on the phone.** Training data is in the browser's storage. “Lock app” hides the app behind the password, but it is not encryption: someone with access to the unlocked phone and the browser's developer tools could read the data. A real fix needs accounts on a server.
- **OneSignal** has to be loaded from its own address for major version 16, which can change without notice, so it can't be checked with Subresource Integrity.
- **The rate limit** is kept in the memory of a function instance: it slows abuse down but resets when Netlify starts a new instance.
- **The Strava tokens** are kept in the browser's storage on the phone (not in backups or the sync), like most web apps do.

## Test

Requires Node.js 18 or newer, no packages to install:

```
node --test
```

or `npm test`. The tests cover valid and rejected sign-up input (empty fields, invalid email, weak or too long passwords, markup in names), body data (age and weight limits, non-numeric input), questionnaire limits (days, mix, goals per type, level, session length), the plan suggestions (session counts, rest days, splits, no run after leg day, mobility add-ons, edge cases), the exercise library (search, filters, alternatives, templates) and custom exercises (empty, too short or long, markup, duplicates). GitHub runs them automatically on every push and pull request.

## Replacing the pictures

**Photo pack (home screen and reviews):** put the photos into `app/img/pack/` with the names listed in `app/img/pack/README.txt`. They are used for the photo box on the home screen and as backgrounds in the weekly and monthly reviews, unless a user has added own photos in Settings. The list and the crop for portrait screens are in `PHOTO_PACK` in `app/index.html`. Missing files are skipped.

**Placeholder graphics:** the pictures in `app/img/` are placeholders:

| File | Where |
|---|---|
| `campus-1.svg`, `campus-2.svg` | Photo box on the home screen, only if the photo pack is empty |
| `gym.svg`, `run.svg`, `yoga.svg` | Picture at the top of the training cards |

To change the training card pictures, update the file names in `.simg-gym`, `.simg-run`, `.simg-yoga` in `app/index.html`. When you add files the app loads at start, also add them to `FILES` in `app/OneSignalSDKWorker.js` and increase `CACHE` by one so installed apps pick them up (photo pack files are cached automatically when they are first shown).

The photos in `app/img/pack/` are © Nova SBE and used only for this course project. For anything beyond the course, replace them with your own photos or photos with a suitable licence.

## Version history

How the app got to where it is, one row per version. The commits show the code exactly as it was at that point; v1.0 lives on the branch `novafit-redesign` and stays reachable through pull request #1.

| Version | Date | What changed | Commit | Pull request |
|---|---|---|---|---|
| v1.0 | 2026-11-10 | My Workout: the starting version of the app | [f77a1b5](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/f77a1b5dc83b618598eef718a4b594d8fe51079f) | [#1](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/1) (kept on purpose, not merged) |
| v2.0 | 2026-11-10 | NOVAFit: redesign in the Nova SBE style | [baa4569](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/baa4569f48aadb86d32821b194942ba9fd6fa0e1) |  |
| v2.1 | 2026-11-10 | New NOVAFit header with the shrinking sign | [40a0bf9](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/40a0bf976efa2beed753c39f4b16e869a3d7dca8) | [#2](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/2) |
| v2.2 | 2026-11-10 | Nova design: photos, image cards, colour blocks, menu | [ecce412](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/ecce41206db9190e4d6dbbfcfae7d401b04adedc) | [#3](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/3) |
| v2.3 | 2026-11-17 | English app, account sign-up, questionnaire and personal plans | [9c62da3](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/9c62da35d62cae90a10031d3c23349e406a13a2b) | [#4](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/4) |
| v2.4 | 2026-11-17 | Goals per type, body data, lower body workout, session reset | [34965f2](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/34965f26cde32f62da77ef70eb1ae789edb9532b) | [#5](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/5) |
| v2.5 | 2026-11-17 | Run screenshots: more reliable and with a check | [ea6be22](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/ea6be2214dc0996627346ca1706b1c323b98113f) |  |
| v2.6 | 2026-11-17 | Import runs from GPX, FIT and TCX files | [30dddcd](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/30dddcdb35645bdb2fdffda69bf32952a22e5ae1) | [#9](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/9) |
| v2.7 | 2026-11-17 | Strava: runs from your watch come in by themselves | [5e77f55](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/5e77f55eec30b1da32cc00a66ec048c9f9de5cb3) | [#9](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/9) |
| v2.8 | 2026-11-17 | Exercise library, custom exercises, strength splits and mobility add-ons | [e0b72a4](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/e0b72a4256ce279bdecc62b873067038b3eee39e) |  |
| v2.8.1 | 2026-11-17 | Drawings for 124 exercises | [dc67964](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/dc67964ef2cec8ac7f188c51b8f78e0c1d8f91d1) |  |
| v2.8.2 | 2026-11-17 | Only exercises with a drawing in the library | [cd98248](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/cd9824819a4e336b97fd317f8ec918fa4d124fd9) |  |
| v2.10 | 2026-11-17 | Bring your training history from Garmin and Strava | [0897dd2](https://github.com/juveith/Group-Project---Intro-to-Programming/commit/0897dd2ea8d68f1bb408ad763155d3ee97b765f3) | [#17](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/17) |

After v2.10 (18 Nov 2026, merged into `main` as separate pull requests, details in [CHANGELOG.md](CHANGELOG.md)): muscle slide that follows your training [#10](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/10), Nova photo pack [#11](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/11), calories by sex, age, weight and height [#19](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/19), build-your-own strength plan [#20](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/20), readable numbers and a safer finish [#21](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/21), screen stays on and rest sound [#22](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/22), compact workout page [#23](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/23), weather where you are and your own running loop [#24](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/24), German Strava screenshot test [#25](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/25), yoga sessions, breath-by-breath Sun Salutations, level and voice, tension check [#26](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/26)–[#29](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/29), and the new layout with Today · Train · Progress tabs and the "You" page [#30](https://github.com/juveith/Group-Project---Intro-to-Programming/pull/30).

## Credits

The exercise drawings in `app/img/ex/` are from [Everkinetic](https://github.com/everkinetic/data) and [Workout Guide](https://github.com/bryllim/workout-guide) by Bryl Lim and licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The app shows this credit under each drawing. New drawings must come from a source with a suitable licence and be listed in `app/img/ex/SOURCES.md`.

## Tracking changes

Every change is saved as its own commit with a short description. Versions are listed in [`CHANGELOG.md`](CHANGELOG.md); the exact code changes are under “Commits” on GitHub.
