# Group Project - Intro to Programming

Group project for Introduction to Programming at NOVA.

## Team

- Tassilo Mylius
- Dominic Quadflieg
- Julius Veith

## Die App: NOVAFit

Eine Trainings-App im Design der Nova SBE fürs Handy (Progressive Web App): Po-Tag, Oberkörper, Laufen und Yoga, mit Fortschritt, Statistik, Kalender, Abzeichen und Erinnerungen.

Die App besteht aus einer einzigen Seite ohne Build-Schritt:

| Datei | Inhalt |
|---|---|
| `app/index.html` | Die ganze App: Aufbau, Design (CSS) und Logik (JavaScript) |
| `app/manifest.webmanifest` | Name, Farben und Symbol für den Home-Bildschirm |
| `app/OneSignalSDKWorker.js` | Service Worker: Offline-Nutzung und Push-Erinnerungen |
| `app/icon-*.png`, `app/apple-touch-icon.png` | App-Symbole |
| `app/LIESMICH.txt` | Anleitung zum Installieren auf dem Handy |

## Starten

- **Lokal:** `app/index.html` im Browser öffnen.
- **Auf dem Handy:** den Ordner `app` auf https://app.netlify.com/drop ziehen, die Adresse auf dem Handy öffnen und „Zum Home-Bildschirm“ wählen (Details in `app/LIESMICH.txt`).

## Änderungen nachvollziehen

Jede Änderung wird als eigener Commit mit kurzer Beschreibung gespeichert. Die Versionen stehen in [`CHANGELOG.md`](CHANGELOG.md), die genauen Code-Änderungen sieht man unter „Commits“ auf GitHub.
