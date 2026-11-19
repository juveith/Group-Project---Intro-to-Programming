# Changelog

Alle Versionen der App, die neueste oben.

## v2.12 – Yoga that follows your goals, flexibility check

- The yoga goals from the questionnaire now steer the suggestion: “Sleep better” brings Wind down from 20:00, “Exam-week stress relief” the study break in the afternoon, “Desk-proof back” Back and neck, “Touch your toes” After your run (calves and hamstrings). Time of day and today's run still come first
- The yoga screen says why: “For your goal: touch your toes · …”
- A suggestion is now preselected even if you picked another session before; without a suggestion your last pick stays
- “Sleep better”: from 20:00 the Today tab shows “Wind down tonight” with a start button, until you did yoga that day
- New **flexibility check** (yoga menu and Progress tab): stand, fold forward, tap how far you reach (knees, shins, ankles, toes, palms on the floor). Every 14 days, one per day; the result compares with the last check
- Progress tab: new Flexibility block with the current level, the steps gained and a chart with the toes line; new badge “Toes touched”
- `suggestWhy`, `addFlex`, `flexTrend`, `flexDueIn` in `app/yoga.js`; 7 new tests (166 in total)

## v2.11 – Runs near you

- New in the running menu: **Runs near you**, at most five suggestions
- Up to 4 hand-picked routes (Carcavelos seafront, Oeiras seafront, Paredão Estoril–Cascais, Lisbon riverside at Belém), sorted by distance from you, with “Directions” to the start; routes that fit the next run of your plan are marked
- **A loop from here**: choose 3, 5, 8, 10 km or the length of your next plan run, NOVAFit makes a round trip on foot paths from where you are (openrouteservice via `netlify/functions/route.mjs`), shows its shape and opens it in Google Maps; “Show me another loop” gives a different one
- “Start this run” opens an outdoor run with distance and route filled in
- Privacy: the list uses the rounded weather location; the exact position is only sent for the loop and never stored
- Without the openrouteservice key the app shows that a one-time setup is needed; the routes work anyway
- 10 new tests (159 in total)

## Unreleased – Version history in the README

- New section "Version history" in `README.md`: every version from v1.0 to v2.10 with date, what changed, the commit and the pull request, plus what came after v2.10

## v2.10 – Bring your training history

- New step after choosing a plan: **Bring your training history**. Runs from other apps come into NOVAFit, so stats, calendar, badges, running plan and reviews start where you are (can be skipped)
- The same import later under Settings → Your data → **Import runs from other apps**
- Sources: Garmin Connect activity list (CSV, English or German), Strava archive (ZIP or activities.csv), the Strava connection (all runs since 1 January, page by page), or several GPX, FIT or TCX files at once; each with a short “How do I get it?”
- Preview before anything is saved: number of runs and kilometres, time range (this year, last 12 months, everything), walks on or off, kilometres or miles for Garmin files, and what is left out (rides, runs already in NOVAFit, outside the range)
- Nothing is counted twice: same Strava id, same start time or the same distance on the same day; “Undo import” removes exactly the added runs
- Big Strava archives are read in parts (only the list of files and activities.csv), so even hundreds of MB work on a phone
- 16 new tests (106 in total), one older test no longer depends on the computer's time zone

## Unreleased – New layout: Today · Train · Progress, "You" page

- Bottom tabs instead of one long home page. **Today**: the photo card, three big numbers (sessions this week opens the weekly review, last run, weeks in a row), "What's next" with the next two sessions of your plan, a note before and during exam weeks, and your last session. **Train**: your plan week, all sessions as photo tiles, more workouts, exercise library, running plan, yoga and short routines. **Progress**: numbers for the month, all reviews (this week, earlier weeks, this and last month, the year), strength, running, calendar, badges and history
- The NOVAFit header with the shrinking sign stays; its menu button now opens **You**: name, week ring, numbers, and every setting grouped (You, Training, Connected, App, Your data). Each row opens only its own settings
- "Photos for reviews" is now "Your photos" and says where they show (big card on Today and the reviews); small tiles use fixed photos per kind of training

## Unreleased – Tension check before and after yoga

- Before a yoga session or study break the app asks "How tense do you feel right now?" (1 relaxed to 5 very tense), and again afterwards: "From 4 down to 2. Nice." Skip is always one tap away, "Don't ask me again" turns it off, the yoga screen turns it back on
- After two checks the result shows the average of the last 60 days; the monthly and yearly reviews show "tension 3.8 → 2.1 after yoga" when it went down, otherwise the number of study breaks
- Answers are saved with the yoga session (`e.yoga.calm`) or, for study breaks from the home screen, in `S.settings.breaks`; `validTension`, `tension` and `tensionText` in `app/yoga.js` with tests

## Unreleased – Yoga level and spoken guidance

- Level on the yoga screen: "New to yoga" explains every pose and shows an easier option (knees down in plank, hands on a chair in downward dog …); "I know the poses" shows only the names. New users start on "New to yoga" until their 5th yoga session
- "Read the poses aloud": the phone reads each pose (and the easier option) with its built-in voice and lowers the music meanwhile; also a speaker button in the timer. Sun Salutation steps are read short ("Plank, exhale")
- `easier` and `cue` in `app/yoga.js` with tests

## Unreleased – Sun Salutations breath by breath, new pose drawings

- Sun Salutations are no longer one 2–3 minute step under a single picture: each movement is its own step with its own drawing and "Inhale"/"Exhale" (arms up, fold, half lift, plank, lower down, cobra, downward dog …), in the new sessions and in the vinyasa flows
- New drawings for the half lift and lowering down
- All pose drawings now use a dark outline around a light body, like the exercise drawings; in the timer they are white lines on the timer color. A dot marks where you should feel the stretch
- `expandSun` in `app/yoga.js` with tests

## Unreleased – Yoga sessions to choose from

- Yoga now has 7 sessions instead of one rotating flow: Study break (5–10 min on a chair), Wind down, Beginner basics, Morning wake-up, After your run, Back and neck, and the existing Vinyasa flow. Each shows its length, what you need (chair, mat, floor) and how calm or strong it is
- The app suggests one: wind down after 21:00, after-run stretches on days you ran, the morning session before 10:00, and the study break during the December exam weeks
- The study break is also under Short routines on the home screen and opens straight from `#studybreak` (for push messages); started from there it doesn't count as a workout
- New drawings for the chair poses and legs up the wall; history and reviews show the session's name; calm sessions count fewer calories
- Sessions and their timing live in the new `app/yoga.js`, with tests in `tests/yoga.test.js`

## Unreleased – Weather where you are, your own loop

- Running weather follows your location: tap "📍 Show the weather where I am" on the run screen or pick "Where I am" in Settings. The position is rounded to about 1 km and only used for the forecast (Open-Meteo) and the town name (BigDataCloud). Without permission the weather is for Carcavelos (Nova SBE).
- The Hamburg leftovers are gone: "Alster loop" is now your own loop with a name and length (Running goals, default "Home loop", 5 km). Old runs keep counting as loop runs.
- New pure helpers in `run.js` (`wxUrl`, `samePlace`, `placeName`, `loopName`, `validateLoop`) with tests

## Unreleased – Compact workout page

- Compact workout page: each exercise shows its drawing, name and target in one line; "How to", swap, add set, move and remove sit behind ⋯. Instructions only show for the first 3 times, finished exercises fold into one line (tap to open), and new exercises get a short hint for choosing a weight.

## Unreleased – Screen stays on, sound when rest is over

- The screen stays on from Start to Finish of every workout, not only in the warm-up and yoga timers; it comes back on after switching apps
- When the rest is over, a short double tone plays on every phone (iPhones can't vibrate from a web app), plus vibration on Android, and the next open set scrolls into view
- New switch in Settings: “Sound when rest is over” (on by default). On an iPhone set to silent the tone stays off
## Unreleased – Readable numbers, safer finish

- Large numbers get thousands separators everywhere they are shown, e.g. “16,440 kg moved” instead of “16440 kg”
- Finishing with sets that aren't ticked off: the dialog now names them (“Triceps Pushdown set 1, 2 and 3”), and the main button saves only the sets you actually did. Saving the untouched sets with last time's numbers is the second, deliberate choice

## Unreleased – Build my own strength plan

- New step after the questionnaire: “Recommended for you” (the ready plan as before) or “Build my own”
- Build my own: pick a split (or a custom split with your own day names, e.g. “Chest & Back”), then for each day choose “Recommended” (our template, you can still add exercises during the workout) or “Choose my own” (no suggestions, you pick every exercise, up to 15)
- Your own days show up by name in the plan, on the home screen and in the history, and start with exactly your exercises
- Exercise list redone in the style of Strong: a small drawing next to every exercise, A–Z sections, search, body part and equipment filters, an ⓘ button for the how-to with “Back to the list”, and checkboxes to pick several exercises at once
- 4 new tests for the own-day logic in `app/plan.js`

## Unreleased – Calories by sex, age, weight and height

- Calorie estimates for strength, yoga and timed runs now use your personal resting burn (Mifflin-St Jeor) from sex, age, weight and height instead of the same value for everyone: women and older people get a more honest, slightly lower number (e.g. 45 min strength at 70 kg: about 265 kcal for a 21-year-old man, about 240 kcal for a 21-year-old woman)
- New optional field “Height (cm)” in “A bit about you” and in Settings; without it a typical height is used. Distance runs and treadmill runs keep their pace-based formula
- Profiles without sex or age keep the old numbers
- 3 new tests

## Unreleased – Default photo pack for home screen and reviews

- New default photo pack in `app/img/pack/`: campus and gym photos for the photo box on the home screen and as backgrounds in the weekly and monthly reviews
- Own photos from Settings still come first; the pack is used when there are none, missing files are skipped
- Each photo has a crop point, so people and buildings stay in view on tall phone screens
- Review slides with charts (calendar, curves, muscle map, rhythm) no longer get a photo behind them, so they stay readable
- Five photos included: campus plaza, roof terrace, glass hall, gym cardio area and weights area (© Nova SBE, used for this course project only, see `app/img/pack/README.txt`)

## Unreleased – Muscle slide follows your training

- The muscle slide in the weekly and monthly reviews now names the muscle that got the most volume, e.g. “Back on fire 🔥”, “Quads on fire 🔥” or “Glutes on fire 🔥”, instead of always talking about the glutes
- Two muscles that are almost even share the headline (“Quads & calves on fire 🔥”)
- The tip at the bottom points to whatever was left out: a lower body day when the legs got little, an upper body day after a leg-heavy gym week; runners without strength sessions get no tip
- The monthly share card shows the top muscle instead of only the glutes
- New file `app/muscles.js` with the muscle logic and 9 new tests

## Unreleased – New app icon

- New home screen icon: the white NOVA ring with its bar on Nova blue (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`); the design keeps to the safe area, so Android's round and squircle masks don't cut it
- Service worker cache bumped so installed apps pick up the new icon

## Unreleased – Own OneSignal app for NOVAFit

- Push notifications now go through NOVAFit's own OneSignal app instead of the one the app was copied from, so NOVAFit users only get NOVAFit messages

## v2.8.2 – Only exercises with a drawing

- 22 exercises without a drawing were taken out of the library (e.g. Turkish Get-up, Olympic lifts, Box Jump, Sit-up); 124 exercises remain, all with drawings
- Swap only suggests exercises with a drawing; all workout templates already use them only
- Older sessions keep the names and progress curves of the removed exercises, and they can be added again as your own exercise
- 2 new tests (90 in total)

## v2.8.1 – Drawings for 124 exercises

- 52 more exercises have drawings, from Workout Guide by Bryl Lim (based on Everkinetic, CC BY-SA 4.0): e.g. Hip Thrust, Plank, Overhead Press, Lat Pulldown, Bulgarian Split Squat, Kettlebell Swing, Face Pull and all cardio machines
- The how-to sheet shows one to three numbered frames; the credit names the source of each drawing
- Drawings are now numbered files (`<id>-1.svg`, `<id>-2.svg`, …); `app/img/ex/SOURCES.md` lists the source and frames of every drawing
- Test checks every frame, caption and credit (88 tests)

## v2.8 – Exercise library, splits and mobility

- Exercise library with 146 exercises named like in the Strong app (“Bench Press (Barbell)”, “Lat Pulldown (Cable)”), searchable and filtered by body part and equipment; tap one to see how it's done and which muscles it trains
- Four ways to log a set: weight × reps, reps only (bodyweight), assisted (kg of help, less is better) and time (seconds, minutes for cardio)
- Your own exercises: name, body part, equipment and log type, checked for missing fields, length, markup and duplicates
- In a session: “+ Add exercise” from the library, “✕ Remove” for any exercise (asks first if sets are already checked off), “Swap” now offers every exercise with the same movement
- New workout templates: Full Body A/B/C, Upper Body A/B, Lower Body A/B, Push, Pull, Legs and an empty session; Upper Body and Lower Body were updated to match
- New questionnaire step “How do you want to split your strength days?”: three or four options for every number of strength sessions (e.g. for 3: 3× Full Body, Push/Pull/Legs, 2× Upper + 1× Lower, 1× Upper + 2× Lower), the best match for your goal and level is marked
- The week combines the split with running and yoga: no run the day after a heavy leg session where possible, and each session suggests a short mobility routine afterwards (hip mobility, shoulder mobility, full-body stretch, runner's stretch)
- Three new mobility routines; the cool-down shows up after a session, in the plan and in the yoga menu
- Home screen: start buttons follow your split, “More workouts” and the exercise library; tap a day in the plan to see that session
- Drawings of the start and end position for 72 exercises from Everkinetic (CC BY-SA 4.0), shown with numbered captions on the how-to sheet; step-by-step instructions for bench press, deadlift, pull-up, seated row and leg press
- Older sessions keep their exercise names and progress curves
- 22 new tests for the library, custom exercises, splits and the week schedule (87 in total)

## v2.7 – Strava: runs from your watch come in by themselves

- New “Connect Strava” in the run menu and in Settings. Runs from Garmin, Polar, Coros, Suunto and Apple Watch that reach Strava are added automatically when NOVAFit is opened (can be turned off)
- “Get runs from Strava” shows new runs from the last 30 days to pick from; treadmill runs and the Alster loop are recognised, own run titles become the note
- No double counting: runs that are already imported or were logged by hand the same day are skipped; rides and other sports are left out
- The Strava secret stays on the server in a Netlify Function (`netlify/functions/strava.mjs`); the app only gets read access; the login stays on the phone and is not part of backups or the cloud sync; “Disconnect Strava” removes the access
- New `netlify.toml` and setup steps in the README; without the setup the app looks and works as before
- 11 new tests for the Strava logic and the function (65 in total)

## v2.6 – Import runs from your watch

- New “Import from your watch” button when logging an outdoor run: choose a GPX, FIT or TCX file, also the ZIP from Garmin Connect (“Export Original”) or a .gz file
- Works for Garmin, Strava, Polar, Coros, Suunto, Wahoo and Apple Watch (via an export app); “How do I get the file?” explains the export for each
- Exact values instead of text recognition: distance, moving time (pauses at traffic lights don't count) and start time; everything runs on the phone, no account or internet needed
- Same “Is this right?” step as for screenshots; rides, swims and other sports are refused with a clear message
- Warning when the run is already saved, so it isn't counted twice (also for screenshots)
- 13 new tests with example GPX, TCX, FIT and ZIP files (54 in total)

## v2.5 – Run screenshots: more reliable and with a check

- Reading run screenshots works with many more layouts: Strava (distance, pace and time in one row), Garmin, Apple Fitness and Nike, labels in English and German, whole kilometres (“10 km”), miles, distances without a unit under their label
- The clock in the status bar is no longer taken as the running time; typical reading errors (O for 0, l for 1) are fixed; a misread distance is corrected from pace and time
- Dates in more formats: 17.11.2026, 2026-11-17, 11/17/2026, “Nov 17, 2026 at 7:12 AM”, “Yesterday”
- New “Is this right?” step after reading: the screenshot next to distance, time and date, all editable and checked with clear errors, before anything is saved
- Clear messages for each problem (not an image, image can't be opened, offline, nothing found) instead of always “needs internet”
- The text recognition starts loading as soon as “Upload screenshot” is tapped and shows its progress; after the first time it is kept for offline use, also across app updates
- New file `app/run.js` with the running logic and 20 new tests (41 in total)

## v2.4 – Goals per type, body data, lower body, reset

- Goals: up to 6 in total and at most 2 per type (strength, running, yoga); the counter per type shows how many are picked
- New first questionnaire step “A bit about you”: sex, age (16–99) and body weight (30–250 kg, decimal comma or point), checked with clear errors; the weight is used for the calorie estimate, everything is shown in Settings → Account
- “Glute Day” is now **Lower Body**: back squats, Romanian deadlift, Bulgarian split squats and hip thrusts, optional lying leg curls, standing calf raises and hip adduction; new alternatives (leg press, goblet squats, Smith machine squats, seated leg curls), guides with drawings, new warm-up (bodyweight squats, walking lunges)
- Older sessions keep their history; kickbacks stay available for old records; saved plans are renamed automatically
- Every running session (strength, run, yoga) has **Reset** at the top right: “Start over” clears everything logged and restarts the clock, “Delete session” removes it completely
- Tests extended to 21 (body data, goal limits, lower body)

## v2.3 – English, account and personal plans

- The whole app is now in English: all screens, workouts, yoga flows, exercise guides, badges, reviews, share images, calendar files and notification settings; dates and numbers in English format
- New first start: welcome screen, then create an account with name, email and password (checked for valid input with clear error messages)
- The password is stored only as a salted PBKDF2-SHA256 hash, never in plain text; “Lock app” in Settings locks NOVAFit until the password is entered (after 5 wrong tries there is a 30-second pause); password can be changed
- Questionnaire in four steps: sessions per week, split across strength/running/yoga, up to three predefined goals (running, strength, yoga and mobility), level and time per session
- NOVAFit suggests three plans (balanced week, goal-focused “best match”, easy start); the chosen plan sets the weekly goal
- Home screen: new plan card with the week, today's or the next session and a start button; the hero box and reminders follow the plan's training days
- Existing users keep all their training data: they create an account once and can skip the questionnaire
- “I already have an account” loads a backup file on a new phone
- New file `app/plan.js` with the logic for validation and plans, plus 19 automated tests (`node --test`), run by GitHub on every push and pull request
- `LIESMICH.txt` is now `INSTALL.txt` (in English)

## v2.2 – Nova-Design: Fotos, Bilder-Karten, Farbblöcke, Menü

- Großer Kasten oben zeigt Campus-Fotos statt Schwarz (wechseln alle 10 s, Pfeile ‹ › zum Blättern). Eigene Fotos aus den Einstellungen haben Vorrang
- Trainingskarten mit Bild oben (je nach Art: Gym, Laufen, Yoga) und Rahmen-Button „Starten“
- „Stärker geworden“ als lila Block, „Laufen“ als Nova-blauer Block mit weißen Zahlen und Linien-Icons auf Balken
- Hamburger-Menü statt Zahnrad und Mond: Einstellungen, Laufplan, Kalender, Abzeichen, Sicherung, Dunkelmodus
- Schwarzer Footer am Ende der Startseite mit Schnellzugriffen
- „Wochenrückblick“ als Rahmen-Button, „Nach oben“ am rechten Rand (Tablet/Desktop)
- Abschnitte blenden beim ersten Öffnen sanft ein (nicht bei „Bewegung reduzieren“)
- Bilder liegen in `app/img/` – aktuell Platzhalter, siehe README
- Wortmarke: „Fit“ jetzt dünn, das schwebende O in Nova-Blau (im Header und im Footer)

## v2.1 – Neuer NOVAFit-Header

- Neue Wortmarke im Header: N – schwarzer Balken mit schwebendem O – VAFit (als Vektorgrafik, schwarz auf weiß)
- Ganz oben groß aufgefaltet; beim Scrollen ziehen sich Headerhöhe, Balkenbreite und Position des O fließend zusammen, danach bleibt eine schmale Leiste oben haften
- Die Bewegung hängt direkt an der Scrollposition und entfaltet sich erst am Seitenanfang wieder vollständig
- Die Trainingsoberfläche verrutscht beim Übergang nicht (Header hat immer dieselbe Höhe)
- Dunkelmodus- und Einstellungen-Button bleiben jederzeit erreichbar
- Eigene Größen für Smartphone, Tablet, Desktop und Handy quer; bei „Bewegung reduzieren“ bleibt der Header kompakt ohne Animation

## v2.0 – NOVAFit (Redesign im Nova-Design)

- App umbenannt von „My Workout“ in **NOVAFit** (Seite, Home-Bildschirm, Teilen-Bilder, Rückblicke, Kalender, Sicherungsdateien)
- Design an die Website der Nova SBE angepasst:
  - Überschriften in *Playfair Display*, Text in *Open Sans*
  - Schwarz-Weiß, eckige Formen, schwarzer Balken unter den Abschnittstiteln
  - Farben: Schwarz fürs Gym-Training, Nova-Blau `#005BAA` fürs Laufen, Nova-Orange `#FC4C01` für Yoga, Nova-Rot `#ED1B34` als Akzent
- Neues App-Symbol: weißes „N“ auf Schwarz mit rotem Balken
- Timer, Zusammenfassung, Teilen-Bild, Jahresrückblick und Dunkelmodus im neuen Design
- Offline-Speicher (Service Worker) neu benannt, damit installierte Apps das Update laden
- Gespeicherte Trainingsdaten bleiben beim Update erhalten
