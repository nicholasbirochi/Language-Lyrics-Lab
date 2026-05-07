# Roadmap

## 0.1 - Project Foundation

- [x] Create the central project root.
- [x] Define the web/iOS stack with Expo.
- [x] Separate domain, application, infrastructure, and presentation.
- [x] Create a visual MVP with original lyrics and translations underneath.
- [x] Add the initial LRCLIB provider.

## 0.2 - Functional MVP

- [ ] Install Node.js and dependencies.
- [ ] Run the app on the web.
- [ ] Validate the mobile layout.
- [x] Document setup and no-install diagnostics.
- [x] Connect real LRCLIB search to the form.
- [x] Handle errors and empty states more carefully.

## 0.3 - Real Translation

- [x] Choose the primary translation provider.
- [x] Add a local in-memory cache.
- [x] Translate in batches while preserving line-by-line alignment.
- [x] Allow manual translation review and correction.
- [x] Add persistent translation cache between web sessions.
- [ ] Add persistent translation cache between iOS sessions.

## 0.4 - Language Study

- [x] Show keywords for the active line.
- [x] Add flashcard mode.
- [x] Save favorite phrases in memory.
- [x] Create per-language history in memory.
- [x] Persist favorite phrases on the web.
- [x] Persist per-language history on the web.
- [ ] Persist favorite phrases on iOS.
- [ ] Persist per-language history on iOS.

## 0.5 - Player and Sync

- [x] Add a simple built-in player.
- [x] Highlight the active line by current time.
- [x] Support local `.lrc` files through manual paste.
- [x] Support fine delay/advance sync adjustment.
- [x] Play real audio by URL.
- [ ] Play local audio files.

## 0.6 - Integrations

- [ ] Study supported music APIs for currently playing tracks.
- [ ] Evaluate Navidrome for a personal music library.
- [ ] Review licensing requirements for a public app.
