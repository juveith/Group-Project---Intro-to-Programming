# Changelog

Alle Versionen der App, die neueste oben.

## v2.9 – Default photo pack for home screen and reviews

- New default photo pack in `app/img/pack/`: campus and gym photos for the photo box on the home screen and as backgrounds in the weekly and monthly reviews
- Own photos from Settings still come first; the pack is used when there are none, missing files are skipped
- Each photo has a crop point, so people and buildings stay in view on tall phone screens
- Review slides with charts (calendar, curves, muscle map, rhythm) no longer get a photo behind them, so they stay readable
- The photo files themselves are not in the repository yet (see `app/img/pack/README.txt`)

## v2.8 – Muscle slide follows your training

- The muscle slide in the weekly and monthly reviews now names the muscle that got the most volume, e.g. “Back on fire 🔥”, “Quads on fire 🔥” or “Glutes on fire 🔥”, instead of always talking about the glutes
- Two muscles that are almost even share the headline (“Quads & calves on fire 🔥”)
- The tip at the bottom points to whatever was left out: a lower body day when the legs got little, an upper body day after a leg-heavy gym week; runners without strength sessions get no tip
- The monthly share card shows the top muscle instead of only the glutes
- New file `app/muscles.js` with the muscle logic and 9 new tests (74 in total)

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
