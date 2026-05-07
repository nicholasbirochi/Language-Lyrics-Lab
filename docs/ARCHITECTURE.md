# Architecture

This project uses a simple layered structure so the app can grow without mixing UI, API access, and business rules.

## Domain

Contains pure models and functions. This layer owns types such as `LyricsLine` and `StudyLanguage`, plus the LRC parser. It does not know about React Native, Expo, `fetch`, or external APIs.

## Application

Orchestrates the main flow:

1. Receive the artist, track, and study language.
2. Fetch synchronized lyrics.
3. Translate each line into Brazilian Portuguese.
4. Return a screen-ready study model.

## Infrastructure

Implements external providers:

- `LrcLibLyricsProvider`: fetches synchronized lyrics from LRCLIB.
- `DemoTranslationProvider`: translates phrases from the initial offline catalog.
- `LibreTranslateProvider`: provides real translation through LibreTranslate.
- `CachedTranslationProvider`: avoids translating identical lines more than once in the same session while preserving line alignment.
- `PersistentTranslationProvider`: stores translations in `localStorage` when the app runs on the web.

## Presentation

Expo/React Native. The same UI should work on web and iOS.

The presentation layer includes:

- Lyric search by artist and track.
- Manual `.lrc` text import.
- Real audio playback by URL with `expo-audio`.
- Lyrics, review, and flashcard modes.
- A simple simulated-time player.
- Fine sync adjustment through a millisecond offset.
- In-memory favorites and history during the session.
- Web persistence for favorites and history through `localStorage`.

## Next Technical Checkpoint

After Node.js is available, run:

```powershell
npm install
npm run typecheck
npm run web
```

After that, the next priority is validating the real translation provider while the app is running.
