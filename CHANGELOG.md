# Changelog

Alle Versionen der App, die neueste oben. Alle Abschnitte mit *v2.15* gehören zur Version 2.15.0 (21.–22. Nov 2026).

## Unreleased – The guided tour can't get stuck any more

- Scrolling during a “Tap …” step left the red ring where the button had been; tapping the button itself did nothing, so the tour seemed stuck. The ring now follows the button when the page or a sheet scrolls or the phone turns, and a tap on the button counts wherever it is
- On small phones (iPhone SE) and in landscape the tour card could cover the very part you had to tap (e.g. *This week* under *Your stories*). The card now moves to the other side, the page or sheet scrolls the part free, and as a last resort the card gets smaller
- A part below the screen (landscape) is scrolled into view
- Checked with a test user that walks the tour like a person in 14 setups (small/large phone, landscape, tablet, German, with and without example data, only one sport, slow taps, scrolling in between); two new browser tests

## Unreleased – Push notifications removed

NOVAFit no longer offers push notifications: the setting, the card on Today, OneSignal and its tests are gone. Calendar reminders stay. The service worker keeps its file name and only does the offline cache.

## Unreleased – Push messages are shown

The Content-Security-Policy now applies to the page only, not to the service worker that shows push messages.

## v2.15.1 – Runs near you without openrouteservice

- *A loop from here* (a round trip from openrouteservice) is gone, as the team decided: no more `netlify/functions/route.mjs`, no `ORS_API_KEY`, no location sent to an outside route service. *Runs near you* shows the hand-picked routes close by (at most 4), each with directions and *Start this run*
- Removed with it: the loop helpers in `run.js` (`validLoopKm`, `loopMapsUrl`, `loopSvg`), their styles, texts and translations, and the tests for the route function. README (external services, credits), docs and `netlify.toml` no longer mention it
- An `ORS_API_KEY` left in Netlify's environment variables isn't used any more and can be deleted

## v2.15.1 – iPhone push works

On iPhone and Safari the app now subscribes with OneSignal's Safari key, so OneSignal can register the device; an old subscription with the wrong key is removed. The app only shows notifications as on when OneSignal knows the device. The reminder card is translated and matches the real push times.

## v2.15 – Usability check: no impossible numbers, and Undo

A walk through the whole app with nonsense inputs (−3 km, 80 % incline, 600 min of yoga, 99 999 km per month, a 5-second loop goal) and every action that deletes or replaces something.

- **Runs and treadmill**: on top of the run check, a pace slower than 30:00 /km and a treadmill incline outside 0 to 30 % are refused, with a message
- **Yoga**: 1 to 300 minutes, with a message
- **Running goals**: the loop target must be a pace someone can run, kilometres per month 1 to 1000 (the race target check came with *Runs and race targets are checked*)
- **Edit a saved session** (history › Edit): fix reps, weights, distance, time or yoga minutes, with the same checks. Empty reps remove a set
- **Undo** after deleting a session, saving an edit, loading a backup, removing a progress photo or the profile photo, and deleting an own exercise
- **Badges** that only the deleted or edited session had earned are taken back (and come back with Undo)
- **Backups** ask first, say how many sessions are new and warn when the backup belongs to another account (the account itself already stays, see *A backup never replaces the account*); Undo puts everything back. Demo data loads without the question
- **Own exercises** can be edited (name, body part, equipment; the log type only while it was never logged) and deleted. Past workouts keep the name; an exercise still in an own workout or the running session can't be deleted
- **Skip this exercise** (optional exercises) asks first when sets are already ticked off, like *Remove from today*
- Removed the *Send a test notification* button
- Checks are pure functions with unit tests (`run.js`: `checkIncline`, `checkKmMonth`, a slowest pace in `validateRun`; `yoga.js`: `checkMinutes`); 8 new browser tests in `e2e/usability.e2e.js`; all new texts in four languages

## v2.15 – Translation gaps closed

- A test user clicked through every screen in German and listed what stayed English. About 100 texts now have a row in Portuguese, German and Italian: the yoga page (“A little space for yourself”, “Find your flow.” …), the empty Progress cards, “Back to top”, “Already trained today”, the flexibility check result, *added* / *your exercise* in the library, the sign-up and own-exercise errors, and many short messages (Strava, weather, import undo, running goal, calendar, backup)
- Two places mixed a sentence and a number in one text and could not be translated; they are now two parts (“Already trained today” card, *last:* badge)
- Fixed: “1 sessions loaded.” is now “1 session loaded.”
- One new browser test in German

## v2.15 – Swapping an exercise keeps your sets

- Machine taken after two sets? Swapping the exercise used to delete the sets you had already done (a small grey note said so). They now stay with the session, are saved with it, and a line under the new exercise says so (“Before the swap: 2 sets of …”). Swapping back brings them back, followed by fresh sets
- “Machine taken? Choose an alternative.” is translated now
- `swapSets` in `exercises.js` with a unit test; one new browser test

## v2.15 – A backup never replaces your account

- Loading a backup brings training data and settings, but name, email, password and the lock of this phone stay as they are. Until now a backup file from someone else (or a changed one) replaced them, so after loading it your own password no longer worked
- On a phone without an account (*Welcome back › Load backup file*), the account still comes from the file, so moving to a new phone works as before
- `backupSettings` in `plan.js` with a unit test; two new browser tests and a sample file

## v2.15 – Body weight and height in Settings are checked

- *Settings › Profile and body*: weight and height get the same check as at sign-up (weight 30 to 250 kg, height 120 to 230 cm or empty). Until now “abc” or “−70” were saved as body weight, which the calorie estimate uses. A wrong number shows an error below the field and the last good value stays saved
- The sign-up's errors for weight, height, age and “Choose an option” were never translated; they are now
- `kgError` and `cmError` in `plan.js`, also used by the sign-up, with a unit test; one new browser test

## v2.15 – Demo data to try the app

Optional demo file (app/demo/novafit-demo.json, made by demo/make_demo.py): 16 weeks of gym, runs and yoga, loaded via Load backup and moved to recent weeks. Remove demo data takes it out again. README explains it. Tonnage badges raised to 100 t and 500 t.

## v2.15 – Runs and race targets are checked

- A run typed in by hand gets the same check as a screenshot or a watch file: distance 0 to 300 km, time 3 minutes to 24 hours, and no pace faster than a world record. Until now −5 km, 900 km in 30 minutes or 10 km in 5 seconds were saved. The message shows right below the field
- Running goal: the target time has to be a pace a person can run (2:30 to 20 min per km); a 10 km target of 10 seconds made a plan before
- Fixed: without earlier runs, the 10 km goal suggested “1:0000–” as target time, which counted as 1 minute. Full hours now show as 1:00:00
- The error messages of the screenshot and file check are translated now too
- `checkTarget` in `run.js` with unit tests; two new browser tests

## v2.15 – Set numbers are checked

- Reps and weights in a gym session are checked while you type: reps a whole number from 1 to 200, weight 0 to 500 kg (assistance 0 to 200 kg), timed exercises 1 to 3600 seconds or 0.5 to 300 minutes. Until now −5 reps, letters or 99 999 kg were saved and spoiled records and totals
- A wrong number turns the set red with a short message right below it (in all four languages); the set doesn't count, the tick doesn't accept it, and the typo isn't copied into the next sets
- Saving leaves out any set with impossible numbers, also with *I did all, save them all*
- The check is a pure function in `exercises.js` (`checkSet`) with unit tests; one new browser test

## v2.15 – Badges that take longer

21 new long-term badges (★★ months, ★★★ a year or more), sorted easy to hard per group. Triple week now says 3× SPORTS. No more NEW tags in the Progress card editor.

## v2.15 – Own gym days and templates

- Choose my own at sign-up: every exercise starts at 0 sets; set 1 to 10 with + and −. Exercises without a set are marked red.
- Own templates can be edited from Your plan too, and deleted (Edit › Delete template). Past workouts keep their name; a plan day that used it gets a ready-made workout again.
- New exercises: Pull-up (Weighted) and Chest Dip (Weighted), logged with the extra kg.

## v2.15 – Marathon, and session length from what's in it

- Running goal: Finish a marathon, with an optional target time and a 16-week plan (long run up to 32 km, shorter the week before). If you raced today now shows a marathon time too; Marathon is also a goal at sign-up.
- The sign-up no longer asks for minutes per session. Gym sessions show about how long they take, worked out from their sets and rests; yoga shows its length; runs follow the running plan.

## v2.15 – Runs near you on the running page

- *Train › Running* (the running page most people use) has a new section **Where to run** with *Runs near you*, built like *Your goal* and *Import runs*. Until now the entry was only in the older running menu that opens from *Today*, so it couldn't be found from the running page
- The route service on the live site was checked first: it returns real loops
- “week 1 of 13” under *Your goal* is now translated too
- Browser test: the running page shows the section and opens *Runs near you*

## v2.15 – iPhone notifications, second step

- “Allow notifications” now creates the phone's own push subscription first, right in the tap, with the app's push key from OneSignal's public config (loaded when the app starts); OneSignal then registers that subscription. On an iPhone this is the only moment iOS allows it
- Every step has a time limit, so a call that never answers can't freeze the button any more; the reason shows in “Check notifications”
- “Send a test notification” also appears when the phone allows notifications but OneSignal isn't subscribed yet; “Check notifications” shows whether the push key is loaded
- Two new browser tests

## v2.15 – iPhone notifications subscribe

- On the iPhone, permission could be granted while OneSignal never created a subscription, so Notifications stayed “Off”. When permission is already granted, “Allow notifications” now starts the subscription right in the tap (iPhone only allows it there); otherwise it asks first and a second tap finishes
- The app waits a moment for OneSignal's device ID and, if it is still missing, says why in “Check notifications” (no push subscription on the phone, or OneSignal hasn't registered it yet)
- “Allow notifications” is translated now; two new browser tests

## v2.15 – Check notifications

- *Settings › Notifications* has **Send a test notification** (shown straight from the device, without OneSignal: if it appears, the phone or laptop is fine and a missing reminder is a OneSignal question)
- **Check notifications** lists device, permission, OneSignal, service worker, subscription and address, plus the last problem (e.g. OneSignal couldn't start or load, the permission question didn't appear, subscribing failed) instead of hiding it
- The device's OneSignal ID with a copy button, to send a test message to exactly this device from the OneSignal dashboard
- In all four languages; two new browser tests

## v2.15 – Clearer settings

- Chosen options in the settings (sex, show calories, appearance, sound …) are filled black with a ✓, white in dark mode.
- Weekly goal and My plan are one row: the plan sets how many sessions a week. The duplicate Edit profile and plan link under your name is gone.

## v2.15 – Running plan looks right again

- **Fixed:** the weeks of the running plan (“This week”, “Next week”) were squeezed into narrow columns side by side. The plan used the class `.pweek`, which the new Progress page also uses for its 7-day strip; the plan's week cards are now `.rweek`, so each run is a full-width row again
- The next run is marked with a small tag (“Up next”) like other tags in the app
- The running goal wizard and the plan are now in all four languages: run types (Easy, Tempo, Intervals, Long), their descriptions, targets, weeks to go, race day, buttons and the note below. The gym-days sentence was split so every weekday is translated on its own
- Two browser tests: the runs of a week are full-width rows under each other (it fails on the old styles), and in German nothing in the wizard and the plan stays English

## v2.15 – Profile and body in settings

- Changing your plan starts with how often you want to train; sex, age, weight and height are set under Settings › Profile and body (sex and age are new there).

## v2.15 – Workout overview

- + Add set right under each exercise; extra sets can be removed with −, the planned ones stay.
- ⋯ now shows today's whole workout with the sets per exercise; ↑ ↓ change the order.

## v2.15 – Sets in your own templates

- In Save a new template every exercise starts at 0 sets; set 1 to 10 sets per exercise with + and −. The template keeps them.
- During a workout, ⋯ › Remove a set takes away a set, also one of the planned ones.
## v2.15 – Polar Flow CSV

- Runs exported from Polar Flow as **CSV** can now be imported, as a single run (Log a run → watch file) and in “Bring your training history”, several files at once. NOVAFit reads date, start time, duration and distance; without a distance it uses the watch's per-second distances
- Recognised by the content, so `.CSV` in capitals works too; other Polar sports (e.g. cycling) are skipped, treadmill runs count as treadmill
- Clear error messages in all four languages; 5 new unit tests and a browser check with a real Polar export

## v2.15 – Runs near you in the new design

- *Runs near you* is now built from the same parts as the running and yoga menus: two sections with a small heading, a serif title and a short line (“Close by · Routes near you”, “From where you are · A loop from here”)
- Routes are rows like “Outdoor run” (stripe, serif name, distance, arrow); tapping one opens the description with *Directions* and *Start this run*, so only one pair of buttons shows at a time
- The loop button reads “Make me a loop · 8 km” (it said “Make a 8 km loop”); *Start this run* is the main button in blue
- Works in light and dark mode and in all four languages; the browser tests open and close a route too

## v2.15 – External services in the README

- New section *External services and APIs* in the README: every outside service NOVAFit uses (openrouteservice, Open-Meteo, BigDataCloud, the Nova SBE news page, OneSignal, Strava, Tesseract.js via jsDelivr, Google Fonts, Google Maps links), what for, where in the code, which key it needs and what is sent
- Credits name Open-Meteo (CC BY 4.0), openrouteservice with OpenStreetMap data (ODbL) and BigDataCloud

## v2.15 – Runs near you is back in the running menu

- *Train › Running* has a row **Runs near you** again (it was taken out in #39, so the routes and the loop from here could not be opened anymore, even though the route service is set up on the live site)
- The sheet is now in all four languages: titles, buttons, route names and descriptions, distances (“about 5 km · 3 km away”), loop texts and errors; place names stay as they are
- Three browser tests: the menu opens the sheet with the nearest routes and a loop that starts a run; without the route key the routes still work; in German nothing stays in English

## v2.15 – Sign out

- New **Sign out** in Settings › Account. NOVAFit has no server account, so signing out removes the account and all training from this phone: it offers a backup first (to sign in again on any phone with “I already have an account”), asks for the password and then removes the training data, photos, Strava login, weather and news caches and turns off push reminders. Other sites' data stays
- “Only lock the app (keep my data)” in the same sheet, like Lock app
- Wrong or empty password: an error next to the field; after 5 wrong tries a 30-second pause, like unlocking
- In all four languages; one unit test and three browser tests (wrong password, only lock, full sign out)

## v2.15 – README and docs for the submission

- README and `docs/setup.md` say clearly that the direct Strava connection is built and tested but not switched on in the live version: the Strava API needs a Strava subscription, which none of us has. Runs still come in by screenshot, watch file and the free Strava archive
- The README no longer names fixed numbers of tests and pull requests (they went out of date with every change); it links to the list of pull requests instead
- The old ready-made `releases/NOVAFit 2.8.2.zip` is no longer part of the current files; `docs/setup.md` links to it in the Git history, so it can still be downloaded

## v2.15 – Allow notifications on iPhone

- Tapping Allow notifications in the installed iPhone app now shows the question right away (it was asked too late, so iOS ignored the tap).
- The app always says what happened: on, blocked (with where to allow it) or not possible right now.

## v2.15 – Push messages in four languages

- The weekly and review push messages come in English, Portuguese, German or Italian; the app tells OneSignal the language chosen in the app where the browser allows it.
- Calendar reminders (Add to my calendar) are in the chosen language too.

## v2.15 – Four languages

- The app is available in English, Portuguese, German and Italian. It starts in the language of the phone; switch on the welcome screen or under Menu › Look and feel › Language.
- Exercise names stay in English. Dates, voice cues in yoga, toasts and story images follow the language.
- Fixed a German label ("Wunschzeit") in the running goal form.

## v2.15 – Edge cases

- Screenshots in Portuguese, Spanish, French and Italian are read correctly (dates, labels, "Tempo" as time).
- A full phone storage is no longer silent: the app says so once and points to the backup.
- A new account sees one short card per sport on Progress instead of many empty cards.
- Earned badges are visible in dark mode.

## v2.15 – The cursor stays where you tapped

- **Fixed:** on a slow phone, the sign-up form (and the form for your own exercise) could move the cursor back to the first field just after you tapped the next one, so your email landed in the name field. The app now only places the cursor when you haven't chosen a field yet
- Found through a browser test that failed now and then on GitHub; a new test stops the page's clock to reproduce it every time
- When the sign-up in a browser test doesn't reach the next step, the test now says what the screen showed (step, error messages, which fields were filled, whether the account was saved) instead of only “timeout”

## v2.15 – Menu, profile photo, install first on iPhone

A compact menu: five groups, one line per setting that says what it is for, missing things in red, a profile photo (tap + to add, tap the photo to change or remove it), Nova default pack for photos, no footer; the guided tour explains the sections. On an iPhone in Safari, Create account first shows how to add NOVAFit to the Home Screen (Safari and the app keep separate data); anyone who signed up in Safari moves everything with Copy my data and Paste from Safari.

## v2.15 – Today takes turns, backups, README

The big card on Today now takes turns every 5 seconds between the day's message, the week or month review and a reminder to back up (after 5 sessions, then every 2 weeks). Backups open the phone's share sheet, Settings shows the last backup, and the browser is asked to keep NOVAFit's data. New README with objectives, features, how to run and test, team and AI use; setup, architecture and security notes in docs/.

## v2.15 – Guided tour

After sign-up a guided tour walks through Today, Train (Gym, Run, Yoga) and Progress on the real screens: you tap the highlighted buttons, pauses show each new screen, the library can be browsed and a yoga session tried. Optional example data, removed again at the end. Restart it any time under Menu › Guided tour.

## v2.15 – Progress per sport, Calendar & history, Nova badges

Progress shows only the sports you train, each with cards you pick (Edit cards). Calendar and history now have their own page with a month view and the full list. Badges are Nova squares, grouped by sport, with new special badges.

## v2.15 – Reviews follow your sports

The weekly review now shows only the chapters for the sports you did: gym, running, yoga or a balanced mix. Every slide uses your photo with the same calm overlay, and the end slide says your name.

## v2.15 – Train with your week, and one page each for Gym, Run and Yoga

- **Train**: "Train" with "3 of 6 this week", a thin week line coloured by sport (Upper, Lower, Run …; done crossed out, today marked), today's session with Start, then one Nova photo per sport (Gym, Run, Yoga). The heavy footer is gone from Train
- **Edit what's on Train** is now just three switches (Gym, Run, Yoga); at least one stays on. Without a choice Train shows the sports in your plan. With one sport only, its picture is bigger
- **Gym page**: week line, the session that is up (today, still open, or next), your plan with days and ticks, your templates ("Save a new template", Edit), ready-made workouts, the exercise library
- **Run page**: week line, today's run, Outdoor / Treadmill, your plan runs, your running goal with progress, import
- **Yoga page**: suggested session, short routines, all sessions with their figure and length (each starts directly), flexibility check
- Replaces the per-session Edit from #43/#46 (`NFPlan.trainList`/`trainToggle` → `NFPlan.trainKinds`/`toggleKind`, tests in `tests/train-sports.test.js`). Own workouts are now "templates" under Gym

## v2.15 – Next sets take over your reps and weight

- In a workout, typing reps or weight in a set fills the same value into the later sets of that exercise (e.g. 10 reps, 62.5 kg in set 1 → sets 2 and 3 show 10 and 62.5). They stay suggestions until you tick them or change them; sets you already entered or ticked are never overwritten
- New `NFEx.carryForward` with tests in `tests/carry-sets.test.js`

## v2.15 – Build your own workout from Edit Train

- In "Edit Train", the Strength block has "+ Build your own workout": give it a name, pick exercises from the library (or create your own exercise), and save. It goes on Train with a "Yours" label and can be edited later
- Optional: "In your plan" puts it on one of your strength days instead of that day's workout (e.g. Fri · instead of Lower Body B)
- Errors show next to the field: a name (up to 30 characters) and at least one exercise (up to 15) are needed
- Saved like the own workouts from "Build my own". New `NFPlan.validateBuild` / `NFPlan.placeInPlan` with tests in `tests/build-workout.test.js`

## v2.15 – Edit Train sorted by kind

- "Edit Train" is now sorted into Strength, Running and Yoga, each with a small photo and how many are on Train. Your own workouts carry a "Yours" label; templates you can add sit under their kind
- Train with everything hidden says so and offers "Reset to my plan" next to Edit

## v2.15 – Train keeps your own workouts

- Fix for #43: workouts you built yourself ("Build my own" when setting up the plan) disappeared from Train. They show again, and "Edit Train" can add your other own workouts too

## v2.15 – Nova SBE News on Today

- New section at the bottom of Today: the three newest headlines from the Nova SBE news page, each opening the article on novasbe.unl.pt, plus "All news ›"
- The school has no RSS feed, so a small Netlify Function (`netlify/functions/news.mjs`) reads its news page and keeps only headline and link. Netlify caches the answer for 3 hours; the app keeps the last list for offline use
- If the page can't be read (offline, or the school changes its site), Today just shows a link to the news page
- Parser in `netlify/lib/news.mjs`, tests in `tests/news.test.js` (only links to novasbe.unl.pt articles are taken, no markup in headlines)

## v2.15 – Train: Edit instead of the extra rows

- The four dashed rows under "Start a session" on Train (More workouts, Exercise library, Running plan, Yoga) are gone. In their place, "Edit what's on Train" opens a sheet that starts from your plan: hide sessions you never do, show them again, add any other workout (full body, push, pull, legs, an empty session …) or reset to your plan. Hidden sessions stay in your plan
- The exercise library stays in the menu (top right), the running plan in the running menu
- New `NFPlan.trainList` / `NFPlan.trainToggle` with tests in `tests/train-edit.test.js`

## v2.15 – Today photo shows more of the campus

- The photo card on Today is a little shorter, the text and Start button sit smaller in the lower left, and the dark fade only covers the bottom, so more of the picture shows

## v2.15 – Service worker restored

- Fix: `app/OneSignalSDKWorker.js` was accidentally emptied in #39, which turned off offline use and push messages. Restored the file (cache v22) and added `tests/service-worker.test.js`, which fails if the file is ever empty again

## v2.15 – Calmer last slide in the weekly review

- The last slide of the weekly review no longer ends with emojis (the red heart in "New week, new chance" is gone). It now reads "Weekly goal reached", "Every session counts" or "A fresh week starts Monday"

## v2.15 – Running menu without "Runs near you"

- Removed the "Runs near you" link from the running menu again; the menu now matches the new design exactly (Up next, Outdoor run, Treadmill, My running goal)

## v2.15 – Runs near you stays in the running menu

- "Runs near you" (hand-picked routes and a loop from where you are) is reachable again: a small link under "Outdoor run" in the running menu, since the new menu no longer has its own card

## v2.15 – Running chooser

- Put the next planned run first and highlight it when a running goal has an upcoming run
- Keep Outdoor run, Treadmill at the gym and My running goal in the existing compact card layout, with a small weather line
- Remove Runs near you from this menu and keep the Strava connection available

## v2.15 – Running goal layout fix

- Give the running plan’s week and race-date row its own class, so the page footer’s full-width black background and shadow cannot cover the plan

## v2.15 – Clearer Yoga menu

- Give Yoga a prominent Nova-inspired blue block and group Short routines under Between classes, with compact cards and copy for campus life; keep duration and level controls in the session picker
- Move glute activation alongside the other short mobility routines instead of presenting Glute Mobility as a separate main option
- Keep the flexibility check available below the routines and refresh the offline cache

## v2.14 – Tests in the browser

- 11 end-to-end tests drive the real app in Chromium: sign-up (empty, invalid and valid), body data, the app lock with a wrong password, strength sessions (empty and logged), runs (no time, valid, watch file, wrong file, impossible time), the flexibility check, the training history import (wrong CSV, Garmin list, the same list again) and backups (broken file, markup in names)
- They run against the security headers from `netlify.toml` and fail on any page error or blocked request, so a policy that breaks the app shows up before it goes live
- GitHub runs them as a second job; `npm run e2e` locally
- Playwright is the only package: a development dependency with a fixed version and a lockfile; the app itself still loads no packages

## v2.13 – Security: headers, pinned scripts, protected functions

- **Fixed:** a changed backup file could put HTML (and with it script) into exercise and workout names, which then ran on the Progress tab. Names from storage, backups and the cloud sync are now cleaned when they are loaded and escaped when they are shown; the custom exercise form also refuses quotes
- Security headers for the live site (`netlify.toml`): Content-Security-Policy that only allows our own scripts and the services the app uses, no framing, no type sniffing, HTTPS only, location only for the site itself
- The app's script moved from `index.html` into `app/app.js`, so the policy can forbid inline scripts
- The text recognition script is checked with Subresource Integrity: a changed file on the CDN is refused, with a clear message
- The Netlify Functions (Strava, loops) only accept calls from the site itself, limit each IP address and refuse large requests (`netlify/lib/guard.mjs`)
- New “Security” section in the README: what is protected and the limits we know about
- 10 new tests (176 in total)

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

## v2.15 – Version history in the README

- New section "Version history" in `README.md`: every version from v1.0 to v2.10 with date, what changed, the commit and the pull request, plus what came after v2.10

## v2.10 – Bring your training history

- New step after choosing a plan: **Bring your training history**. Runs from other apps come into NOVAFit, so stats, calendar, badges, running plan and reviews start where you are (can be skipped)
- The same import later under Settings → Your data → **Import runs from other apps**
- Sources: Garmin Connect activity list (CSV, English or German), Strava archive (ZIP or activities.csv), the Strava connection (all runs since 1 January, page by page), or several GPX, FIT or TCX files at once; each with a short “How do I get it?”
- Preview before anything is saved: number of runs and kilometres, time range (this year, last 12 months, everything), walks on or off, kilometres or miles for Garmin files, and what is left out (rides, runs already in NOVAFit, outside the range)
- Nothing is counted twice: same Strava id, same start time or the same distance on the same day; “Undo import” removes exactly the added runs
- Big Strava archives are read in parts (only the list of files and activities.csv), so even hundreds of MB work on a phone
- 16 new tests (106 in total), one older test no longer depends on the computer's time zone

## v2.15 – New layout: Today · Train · Progress, "You" page

- Bottom tabs instead of one long home page. **Today**: the photo card, three big numbers (sessions this week opens the weekly review, last run, weeks in a row), "What's next" with the next two sessions of your plan, a note before and during exam weeks, and your last session. **Train**: your plan week, all sessions as photo tiles, more workouts, exercise library, running plan, yoga and short routines. **Progress**: numbers for the month, all reviews (this week, earlier weeks, this and last month, the year), strength, running, calendar, badges and history
- The NOVAFit header with the shrinking sign stays; its menu button now opens **You**: name, week ring, numbers, and every setting grouped (You, Training, Connected, App, Your data). Each row opens only its own settings
- "Photos for reviews" is now "Your photos" and says where they show (big card on Today and the reviews); small tiles use fixed photos per kind of training

## v2.15 – Tension check before and after yoga

- Before a yoga session or study break the app asks "How tense do you feel right now?" (1 relaxed to 5 very tense), and again afterwards: "From 4 down to 2. Nice." Skip is always one tap away, "Don't ask me again" turns it off, the yoga screen turns it back on
- After two checks the result shows the average of the last 60 days; the monthly and yearly reviews show "tension 3.8 → 2.1 after yoga" when it went down, otherwise the number of study breaks
- Answers are saved with the yoga session (`e.yoga.calm`) or, for study breaks from the home screen, in `S.settings.breaks`; `validTension`, `tension` and `tensionText` in `app/yoga.js` with tests

## v2.15 – Yoga level and spoken guidance

- Level on the yoga screen: "New to yoga" explains every pose and shows an easier option (knees down in plank, hands on a chair in downward dog …); "I know the poses" shows only the names. New users start on "New to yoga" until their 5th yoga session
- "Read the poses aloud": the phone reads each pose (and the easier option) with its built-in voice and lowers the music meanwhile; also a speaker button in the timer. Sun Salutation steps are read short ("Plank, exhale")
- `easier` and `cue` in `app/yoga.js` with tests

## v2.15 – Sun Salutations breath by breath, new pose drawings

- Sun Salutations are no longer one 2–3 minute step under a single picture: each movement is its own step with its own drawing and "Inhale"/"Exhale" (arms up, fold, half lift, plank, lower down, cobra, downward dog …), in the new sessions and in the vinyasa flows
- New drawings for the half lift and lowering down
- All pose drawings now use a dark outline around a light body, like the exercise drawings; in the timer they are white lines on the timer color. A dot marks where you should feel the stretch
- `expandSun` in `app/yoga.js` with tests

## v2.15 – Yoga sessions to choose from

- Yoga now has 7 sessions instead of one rotating flow: Study break (5–10 min on a chair), Wind down, Beginner basics, Morning wake-up, After your run, Back and neck, and the existing Vinyasa flow. Each shows its length, what you need (chair, mat, floor) and how calm or strong it is
- The app suggests one: wind down after 21:00, after-run stretches on days you ran, the morning session before 10:00, and the study break during the December exam weeks
- The study break is also under Short routines on the home screen and opens straight from `#studybreak` (for push messages); started from there it doesn't count as a workout
- New drawings for the chair poses and legs up the wall; history and reviews show the session's name; calm sessions count fewer calories
- Sessions and their timing live in the new `app/yoga.js`, with tests in `tests/yoga.test.js`

## v2.15 – Weather where you are, your own loop

- Running weather follows your location: tap "📍 Show the weather where I am" on the run screen or pick "Where I am" in Settings. The position is rounded to about 1 km and only used for the forecast (Open-Meteo) and the town name (BigDataCloud). Without permission the weather is for Carcavelos (Nova SBE).
- The Hamburg leftovers are gone: "Alster loop" is now your own loop with a name and length (Running goals, default "Home loop", 5 km). Old runs keep counting as loop runs.
- New pure helpers in `run.js` (`wxUrl`, `samePlace`, `placeName`, `loopName`, `validateLoop`) with tests

## v2.15 – Compact workout page

- Compact workout page: each exercise shows its drawing, name and target in one line; "How to", swap, add set, move and remove sit behind ⋯. Instructions only show for the first 3 times, finished exercises fold into one line (tap to open), and new exercises get a short hint for choosing a weight.

## v2.15 – Screen stays on, sound when rest is over

- The screen stays on from Start to Finish of every workout, not only in the warm-up and yoga timers; it comes back on after switching apps
- When the rest is over, a short double tone plays on every phone (iPhones can't vibrate from a web app), plus vibration on Android, and the next open set scrolls into view
- New switch in Settings: “Sound when rest is over” (on by default). On an iPhone set to silent the tone stays off
## v2.15 – Readable numbers, safer finish

- Large numbers get thousands separators everywhere they are shown, e.g. “16,440 kg moved” instead of “16440 kg”
- Finishing with sets that aren't ticked off: the dialog now names them (“Triceps Pushdown set 1, 2 and 3”), and the main button saves only the sets you actually did. Saving the untouched sets with last time's numbers is the second, deliberate choice

## v2.15 – Build my own strength plan

- New step after the questionnaire: “Recommended for you” (the ready plan as before) or “Build my own”
- Build my own: pick a split (or a custom split with your own day names, e.g. “Chest & Back”), then for each day choose “Recommended” (our template, you can still add exercises during the workout) or “Choose my own” (no suggestions, you pick every exercise, up to 15)
- Your own days show up by name in the plan, on the home screen and in the history, and start with exactly your exercises
- Exercise list redone in the style of Strong: a small drawing next to every exercise, A–Z sections, search, body part and equipment filters, an ⓘ button for the how-to with “Back to the list”, and checkboxes to pick several exercises at once
- 4 new tests for the own-day logic in `app/plan.js`

## v2.15 – Calories by sex, age, weight and height

- Calorie estimates for strength, yoga and timed runs now use your personal resting burn (Mifflin-St Jeor) from sex, age, weight and height instead of the same value for everyone: women and older people get a more honest, slightly lower number (e.g. 45 min strength at 70 kg: about 265 kcal for a 21-year-old man, about 240 kcal for a 21-year-old woman)
- New optional field “Height (cm)” in “A bit about you” and in Settings; without it a typical height is used. Distance runs and treadmill runs keep their pace-based formula
- Profiles without sex or age keep the old numbers
- 3 new tests

## v2.15 – Default photo pack for home screen and reviews

- New default photo pack in `app/img/pack/`: campus and gym photos for the photo box on the home screen and as backgrounds in the weekly and monthly reviews
- Own photos from Settings still come first; the pack is used when there are none, missing files are skipped
- Each photo has a crop point, so people and buildings stay in view on tall phone screens
- Review slides with charts (calendar, curves, muscle map, rhythm) no longer get a photo behind them, so they stay readable
- Five photos included: campus plaza, roof terrace, glass hall, gym cardio area and weights area (© Nova SBE, used for this course project only, see `app/img/pack/README.txt`)

## v2.15 – Muscle slide follows your training

- The muscle slide in the weekly and monthly reviews now names the muscle that got the most volume, e.g. “Back on fire 🔥”, “Quads on fire 🔥” or “Glutes on fire 🔥”, instead of always talking about the glutes
- Two muscles that are almost even share the headline (“Quads & calves on fire 🔥”)
- The tip at the bottom points to whatever was left out: a lower body day when the legs got little, an upper body day after a leg-heavy gym week; runners without strength sessions get no tip
- The monthly share card shows the top muscle instead of only the glutes
- New file `app/muscles.js` with the muscle logic and 9 new tests

## v2.15 – New app icon

- New home screen icon: the white NOVA ring with its bar on Nova blue (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`); the design keeps to the safe area, so Android's round and squircle masks don't cut it
- Service worker cache bumped so installed apps pick up the new icon

## v2.15 – Own OneSignal app for NOVAFit

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
